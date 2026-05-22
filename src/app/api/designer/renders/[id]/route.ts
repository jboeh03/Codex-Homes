import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { firstOutput, getPrediction } from "@/lib/replicate";

const uuid = z.string().uuid();

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!uuid.safeParse(id).success) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("designer_renders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Terminal — just return what we have
  if (row.status === "succeeded" || row.status === "failed" || row.status === "canceled") {
    return NextResponse.json({
      id: row.id,
      status: row.status,
      outputUrl: row.output_url,
      error: row.error,
    });
  }

  // In flight — poll Replicate once and persist the latest
  if (!row.replicate_id) {
    return NextResponse.json({
      id: row.id,
      status: row.status,
      outputUrl: row.output_url,
      error: row.error,
    });
  }

  try {
    const p = await getPrediction(row.replicate_id);
    const outputUrl = firstOutput(p.output);
    if (p.status !== row.status || outputUrl !== row.output_url) {
      await supabase
        .from("designer_renders")
        .update({
          status: p.status,
          output_url: outputUrl,
          error: p.error ?? "",
        })
        .eq("id", id);
    }
    return NextResponse.json({
      id: row.id,
      status: p.status,
      outputUrl,
      error: p.error ?? "",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Poll failed" },
      { status: 502 },
    );
  }
}
