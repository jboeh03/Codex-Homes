import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DesignerSessionUpdate } from "@/lib/db.types";

const updateSchema = z.object({
  roomType: z.enum(["kitchen", "bathroom", "other"]).optional(),
  dimensions: z.record(z.string(), z.unknown()).optional(),
  selections: z.record(z.string(), z.string()).optional(),
  estimate: z.record(z.string(), z.unknown()).optional(),
  photoUrls: z.array(z.string().url()).max(12).optional(),
  notes: z.string().max(2000).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

const uuid = z.string().uuid();

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!uuid.safeParse(id).success) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("designer_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!uuid.safeParse(id).success) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const patch: DesignerSessionUpdate = { updated_at: new Date().toISOString() };
  if (parsed.data.roomType !== undefined) patch.room_type = parsed.data.roomType;
  if (parsed.data.dimensions !== undefined) patch.dimensions = parsed.data.dimensions as DesignerSessionUpdate["dimensions"];
  if (parsed.data.selections !== undefined) patch.selections = parsed.data.selections as DesignerSessionUpdate["selections"];
  if (parsed.data.estimate !== undefined) patch.estimate = parsed.data.estimate as DesignerSessionUpdate["estimate"];
  if (parsed.data.photoUrls !== undefined) patch.photo_urls = parsed.data.photoUrls;
  if (parsed.data.notes !== undefined) patch.notes = parsed.data.notes;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("designer_sessions").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
