import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import {
  patchSessionSchema,
  STUDIO_TOKEN_HEADER,
  type GetSessionResponse,
  type RenderInfo,
} from "@/lib/studio/api-schemas";
import { requireSession } from "@/lib/studio/session-auth";

export const runtime = "nodejs";

const SIGNED_URL_SECONDS = 7 * 24 * 60 * 60;
const uuid = z.string().uuid();

type Ctx = { params: Promise<{ id: string }> };

function unavailable() {
  return NextResponse.json(
    { error: "Design studio is temporarily unavailable", code: "unavailable" },
    { status: 503 },
  );
}

/** Restore a saved design: state + freshly signed photo/render URLs. */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!uuid.safeParse(id).success) {
    return NextResponse.json({ error: "Bad id", code: "invalid" }, { status: 400 });
  }
  if (!isSupabaseAdminConfigured()) return unavailable();

  const supabase = createSupabaseAdminClient();
  const auth = await requireSession(
    supabase,
    id,
    req.headers.get(STUDIO_TOKEN_HEADER),
  );
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error, code: auth.status === 503 ? "unavailable" : "unauthorized" },
      { status: auth.status },
    );
  }
  const session = auth.session;

  const photos = await Promise.all(
    (session.photo_paths ?? []).map(async (path) => {
      const { data } = await supabase.storage
        .from("designer-uploads")
        .createSignedUrl(path, SIGNED_URL_SECONDS);
      return { path, url: data?.signedUrl ?? "" };
    }),
  );

  let latestRender: RenderInfo | null = null;
  const { data: renderRow } = await supabase
    .from("designer_renders")
    .select("id, status, render_key, output_path, provider, error")
    .eq("session_id", id)
    .eq("status", "succeeded")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (renderRow?.output_path) {
    const { data } = await supabase.storage
      .from("designer-renders")
      .createSignedUrl(renderRow.output_path as string, SIGNED_URL_SECONDS);
    latestRender = {
      id: renderRow.id as string,
      status: "succeeded",
      renderKey: (renderRow.render_key as string) ?? "",
      url: data?.signedUrl ?? null,
      provider: (renderRow.provider as string) ?? "",
    };
  }

  const response: GetSessionResponse = {
    id: session.id,
    roomType: session.room_type,
    selections: session.selections ?? {},
    dimensions: session.dimensions,
    notes: session.notes ?? "",
    photos: photos.filter((p) => p.url),
    latestRender,
  };
  return NextResponse.json(response);
}

/** Update a saved design. Token required — no stomping by session id alone. */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!uuid.safeParse(id).success) {
    return NextResponse.json({ error: "Bad id", code: "invalid" }, { status: 400 });
  }
  if (!isSupabaseAdminConfigured()) return unavailable();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON", code: "invalid" }, { status: 400 });
  }
  const parsed = patchSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", code: "invalid" },
      { status: 422 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const auth = await requireSession(
    supabase,
    id,
    req.headers.get(STUDIO_TOKEN_HEADER),
  );
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error, code: auth.status === 503 ? "unavailable" : "unauthorized" },
      { status: auth.status },
    );
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.roomType !== undefined) patch.room_type = parsed.data.roomType;
  if (parsed.data.selections !== undefined) patch.selections = parsed.data.selections;
  if (parsed.data.dimensions !== undefined) patch.dimensions = parsed.data.dimensions;
  if (parsed.data.estimate !== undefined) patch.estimate = parsed.data.estimate;
  if (parsed.data.notes !== undefined) patch.notes = parsed.data.notes;

  const { error } = await supabase
    .from("designer_sessions")
    .update(patch)
    .eq("id", id);
  if (error) return unavailable();
  return NextResponse.json({ ok: true });
}
