import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Session access control without user accounts: creating a session mints a
 * 256-bit token returned exactly once to the creating browser. The DB stores
 * only its sha256 hash; every session/photo/render route requires the token
 * in the x-studio-token header.
 */

export function mintSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function tokenMatches(token: string, storedHash: string): boolean {
  if (!storedHash) return false;
  const a = Buffer.from(hashToken(token));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface StudioSessionRow {
  id: string;
  room_type: "kitchen" | "bathroom" | "other";
  selections: Record<string, string>;
  dimensions: Record<string, number> | null;
  estimate: unknown;
  notes: string;
  photo_paths: string[];
  client_token_hash: string;
  created_at: string;
  updated_at: string;
}

export type RequireSessionResult =
  | { ok: true; session: StudioSessionRow }
  | { ok: false; status: 401 | 404 | 503; error: string };

export async function requireSession(
  supabase: SupabaseClient,
  sessionId: string,
  token: string | null,
): Promise<RequireSessionResult> {
  if (!token) {
    return { ok: false, status: 401, error: "Missing session token" };
  }
  const { data, error } = await supabase
    .from("designer_sessions")
    .select(
      "id, room_type, selections, dimensions, estimate, notes, photo_paths, client_token_hash, created_at, updated_at",
    )
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    return { ok: false, status: 503, error: "Design studio is temporarily unavailable" };
  }
  if (!data) {
    return { ok: false, status: 404, error: "Session not found" };
  }
  const session = data as unknown as StudioSessionRow;
  if (!tokenMatches(token, session.client_token_hash)) {
    return { ok: false, status: 401, error: "Invalid session token" };
  }
  return { ok: true, session };
}
