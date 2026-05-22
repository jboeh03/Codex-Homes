import { NextResponse, type NextRequest } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  const utm = readUtm(req);

  const supabase = await createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("leads")
    .insert({
      project_type: data.projectType,
      rooms: data.rooms,
      scope_notes: data.scopeNotes,
      timeline: data.timeline,
      budget: data.budget,
      name: data.name,
      email: data.email,
      phone: data.phone,
      zip: data.zip,
      address: data.address,
      photo_urls: data.photoUrls,
      source: data.source,
      designer_session_id: data.designerSessionId ?? null,
      utm,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: row.id }, { status: 201 });
}

function readUtm(req: NextRequest): Record<string, string> {
  const url = new URL(req.url);
  const out: Record<string, string> = {};
  for (const [k, v] of url.searchParams.entries()) {
    if (k.startsWith("utm_")) out[k] = v;
  }
  const ref = req.headers.get("referer");
  if (ref) out.referer = ref;
  return out;
}
