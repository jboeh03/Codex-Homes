import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildRenderPrompt, selectionsHash } from "@/lib/designer";
import { createPrediction, firstOutput } from "@/lib/replicate";
import type { MaterialRow } from "@/lib/db.types";

export const maxDuration = 60; // give Replicate a moment to finish small jobs

const body = z.object({
  sessionId: z.string().uuid(),
  photoUrl: z.string().url(),
  roomType: z.enum(["kitchen", "bathroom", "other"]),
  selections: z.record(z.string(), z.string()),
});

const NEGATIVE_PROMPT =
  "low quality, blurry, distorted, deformed, watermark, text, signature, oversaturated";

export async function POST(req: NextRequest) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "AI preview is not configured (REPLICATE_API_TOKEN missing)" },
      { status: 503 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const { sessionId, photoUrl, roomType, selections } = parsed.data;

  const supabase = await createSupabaseServerClient();

  // Hash the inputs so we don't pay twice for the same render
  const hash = selectionsHash(roomType, photoUrl, selections);

  // Cache hit?
  const { data: cached } = await supabase
    .from("designer_renders")
    .select("*")
    .eq("session_id", sessionId)
    .eq("selections_hash", hash)
    .maybeSingle();

  if (cached) {
    // If a previous attempt is mid-flight or already done, hand it back.
    return NextResponse.json({
      id: cached.id,
      status: cached.status,
      outputUrl: cached.output_url,
      cached: true,
    });
  }

  // Need a materials lookup to expand selections into a real prompt
  const ids = Object.values(selections).filter(Boolean);
  let materials: MaterialRow[] = [];
  if (ids.length > 0) {
    const { data } = await supabase.from("materials").select("*").in("id", ids);
    materials = data ?? [];
  }
  const prompt = buildRenderPrompt(roomType, selections, materials);

  // Kick off the prediction
  let prediction;
  try {
    prediction = await createPrediction("adirik", "interior-design", {
      image: photoUrl,
      prompt,
      negative_prompt: NEGATIVE_PROMPT,
      num_inference_steps: 50,
      guidance_scale: 15,
      prompt_strength: 0.8,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Replicate call failed" },
      { status: 502 },
    );
  }

  const outputUrl = firstOutput(prediction.output);

  const { data: row, error } = await supabase
    .from("designer_renders")
    .insert({
      session_id: sessionId,
      source_photo_url: photoUrl,
      selections_hash: hash,
      prompt,
      status: prediction.status,
      output_url: outputUrl,
      replicate_id: prediction.id,
      error: prediction.error ?? "",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: row.id,
    status: row.status,
    outputUrl: row.output_url,
    cached: false,
  });
}
