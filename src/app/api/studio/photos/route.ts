import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import { STUDIO_TOKEN_HEADER } from "@/lib/studio/api-schemas";
import { requireSession } from "@/lib/studio/session-auth";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_PHOTOS_PER_SESSION = 8;
const SIGNED_URL_SECONDS = 7 * 24 * 60 * 60;

/** JPEG / PNG / WebP magic bytes. HEIC is converted client-side before upload. */
function sniffImage(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return "image/webp";
  return null;
}

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Photo uploads are unavailable right now", code: "unavailable" },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload", code: "invalid" }, { status: 400 });
  }

  const sessionId = form.get("sessionId");
  const file = form.get("file");
  if (typeof sessionId !== "string" || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Invalid upload", code: "invalid" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Photo is too large (10 MB max)", code: "invalid" },
      { status: 413 },
    );
  }

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
  if ((auth.session.photo_paths?.length ?? 0) >= MAX_PHOTOS_PER_SESSION) {
    return NextResponse.json(
      { error: "Photo limit reached for this design", code: "invalid" },
      { status: 400 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffImage(bytes);
  if (!mime) {
    return NextResponse.json(
      { error: "Please upload a JPEG, PNG, or WebP photo", code: "invalid" },
      { status: 415 },
    );
  }

  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const path = `sessions/${sessionId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("designer-uploads")
    .upload(path, bytes, { contentType: mime, upsert: false });
  if (uploadError) {
    return NextResponse.json(
      { error: "Upload failed — please try again", code: "unavailable" },
      { status: 503 },
    );
  }

  const { error: updateError } = await supabase
    .from("designer_sessions")
    .update({
      photo_paths: [...(auth.session.photo_paths ?? []), path],
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
  if (updateError) {
    return NextResponse.json(
      { error: "Upload failed — please try again", code: "unavailable" },
      { status: 503 },
    );
  }

  const { data: signed } = await supabase.storage
    .from("designer-uploads")
    .createSignedUrl(path, SIGNED_URL_SECONDS);

  return NextResponse.json({ path, url: signed?.signedUrl ?? "" }, { status: 201 });
}
