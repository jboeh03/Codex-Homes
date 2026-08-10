import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import type { MaterialRow } from "@/lib/db.types";
import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import {
  renderRequestSchema,
  STUDIO_TOKEN_HEADER,
  type RenderInfo,
} from "@/lib/studio/api-schemas";
import { fallbackMaterials } from "@/lib/studio/fallback-materials";
import { buildEditPrompt } from "@/lib/studio/prompt";
import { buildRenderKey } from "@/lib/studio/render-key";
import { checkRenderLimits, ipAllowed } from "@/lib/studio/rate-limit";
import { requireSession } from "@/lib/studio/session-auth";
import { generateWithFallback, isRenderConfigured } from "@/lib/render";

export const runtime = "nodejs";
export const maxDuration = 120;

const SIGNED_URL_SECONDS = 7 * 24 * 60 * 60;
const OUTPUT_MAX_EDGE = 1536;

/**
 * Synchronous render pipeline: validate → rate limit → cache check
 * (succeeded renders only, so failures are always retryable) → download the
 * source photo → provider (Gemini → Replicate fallback) → webp → persist to
 * the private designer-renders bucket → DB row → signed URL back.
 */
export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured() || !isRenderConfigured()) {
    return NextResponse.json(
      {
        error: "AI previews are unavailable right now — call 513-532-6692 for a live design consult",
        code: "unavailable",
      },
      { status: 503 },
    );
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!ipAllowed(ip)) {
    return NextResponse.json(
      { error: "Too many requests — give it a minute", code: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON", code: "invalid" }, { status: 400 });
  }
  const parsed = renderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", code: "invalid" },
      { status: 422 },
    );
  }
  const { sessionId, photoPath, roomType, selections } = parsed.data;

  const supabase = createSupabaseAdminClient();
  const auth = await requireSession(
    supabase,
    sessionId,
    req.headers.get(STUDIO_TOKEN_HEADER),
  );
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error, code: auth.status === 503 ? "unavailable" : "unauthorized" },
      { status: auth.status },
    );
  }
  if (!(auth.session.photo_paths ?? []).includes(photoPath)) {
    return NextResponse.json(
      { error: "Photo does not belong to this design", code: "invalid" },
      { status: 400 },
    );
  }

  const limits = await checkRenderLimits(supabase, sessionId);
  if (!limits.ok) {
    return NextResponse.json(
      { error: limits.error, code: limits.status === 429 ? "rate_limited" : "unavailable" },
      { status: limits.status },
    );
  }

  const renderKey = buildRenderKey(roomType, photoPath, selections);

  // Cache: return only previously *succeeded* renders for these exact inputs.
  const { data: cached } = await supabase
    .from("designer_renders")
    .select("id, output_path, provider")
    .eq("session_id", sessionId)
    .eq("render_key", renderKey)
    .eq("status", "succeeded")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cached?.output_path) {
    const { data: signed } = await supabase.storage
      .from("designer-renders")
      .createSignedUrl(cached.output_path as string, SIGNED_URL_SECONDS);
    if (signed?.signedUrl) {
      const response: RenderInfo = {
        id: cached.id as string,
        status: "succeeded",
        renderKey,
        url: signed.signedUrl,
        provider: (cached.provider as string) ?? "",
        cached: true,
      };
      return NextResponse.json(response);
    }
  }

  // Source photo from private storage.
  const { data: photoBlob, error: photoError } = await supabase.storage
    .from("designer-uploads")
    .download(photoPath);
  if (photoError || !photoBlob) {
    return NextResponse.json(
      { error: "Could not read your photo — try uploading it again", code: "invalid" },
      { status: 400 },
    );
  }

  // Prompt materials: DB catalog merged with the built-in fallback list so
  // fallback selection ids resolve even before the DB is reachable/seeded.
  const { data: materialRows } = await supabase
    .from("materials")
    .select("*")
    .eq("is_active", true);
  const materials = [
    ...((materialRows ?? []) as MaterialRow[]),
    ...fallbackMaterials,
  ];
  const prompt = buildEditPrompt(roomType, selections, materials);

  const sourceBytes = Buffer.from(await photoBlob.arrayBuffer());
  const sourceMime = photoBlob.type || "image/jpeg";

  try {
    const result = await generateWithFallback({
      imageBytes: sourceBytes,
      mimeType: sourceMime,
      prompt,
    });

    const webp = await sharp(result.imageBytes)
      .resize({ width: OUTPUT_MAX_EDGE, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();

    const { data: inserted, error: insertError } = await supabase
      .from("designer_renders")
      .insert({
        session_id: sessionId,
        source_photo_url: photoPath,
        selections_hash: renderKey.slice(0, 64),
        render_key: renderKey,
        prompt,
        provider: result.provider,
        status: "succeeded",
      })
      .select("id")
      .single();
    if (insertError || !inserted) throw new Error("Could not record render");

    const outputPath = `sessions/${sessionId}/${inserted.id}.webp`;
    const { error: uploadError } = await supabase.storage
      .from("designer-renders")
      .upload(outputPath, webp, { contentType: "image/webp", upsert: true });
    if (uploadError) throw new Error("Could not store render");

    await supabase
      .from("designer_renders")
      .update({ output_path: outputPath, updated_at: new Date().toISOString() })
      .eq("id", inserted.id);

    const { data: signed } = await supabase.storage
      .from("designer-renders")
      .createSignedUrl(outputPath, SIGNED_URL_SECONDS);

    const response: RenderInfo = {
      id: inserted.id as string,
      status: "succeeded",
      renderKey,
      url: signed?.signedUrl ?? null,
      provider: result.provider,
    };
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Render failed";
    console.error("[studio] render failed:", message);
    // Record the failure for ops visibility; the cache ignores failed rows.
    await supabase.from("designer_renders").insert({
      session_id: sessionId,
      source_photo_url: photoPath,
      selections_hash: renderKey.slice(0, 64),
      render_key: renderKey,
      prompt,
      status: "failed",
      error: message.slice(0, 1000),
    });
    return NextResponse.json(
      {
        error: "The AI preview didn't come through. Nothing was lost — try again.",
        code: "unavailable",
      },
      { status: 502 },
    );
  }
}
