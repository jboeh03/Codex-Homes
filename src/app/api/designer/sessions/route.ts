import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/db.types";

const createSchema = z.object({
  roomType: z.enum(["kitchen", "bathroom", "other"]).default("kitchen"),
  dimensions: z.record(z.string(), z.unknown()).optional().default({}),
  selections: z.record(z.string(), z.string()).optional().default({}),
  estimate: z.record(z.string(), z.unknown()).optional().default({}),
  photoUrls: z.array(z.string().url()).max(12).optional().default([]),
  notes: z.string().max(2000).optional().default(""),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("designer_sessions")
    .insert({
      room_type: parsed.data.roomType,
      dimensions: parsed.data.dimensions as Json,
      selections: parsed.data.selections as Json,
      estimate: parsed.data.estimate as Json,
      photo_urls: parsed.data.photoUrls,
      notes: parsed.data.notes,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
