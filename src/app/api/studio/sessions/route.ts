import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import { createSessionSchema } from "@/lib/studio/api-schemas";
import { hashToken, mintSessionToken } from "@/lib/studio/session-auth";

export const runtime = "nodejs";

/**
 * Create a studio session. Called on the first meaningful edit — never on
 * page view. Returns the session id plus a bearer token exactly once; the
 * DB stores only the token's hash.
 */
export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Saving is unavailable right now", code: "unavailable" },
      { status: 503 },
    );
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine — defaults apply
  }
  const parsed = createSessionSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", code: "invalid" },
      { status: 422 },
    );
  }

  const token = mintSessionToken();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("designer_sessions")
    .insert({
      room_type: parsed.data.roomType ?? "kitchen",
      selections: parsed.data.selections ?? {},
      dimensions: parsed.data.dimensions ?? {},
      notes: parsed.data.notes ?? "",
      client_token_hash: hashToken(token),
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Could not save your design", code: "unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json({ id: data.id as string, token }, { status: 201 });
}
