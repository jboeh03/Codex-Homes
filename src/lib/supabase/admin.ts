import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for the studio API routes. Bypasses RLS — never import
 * from client components (the "server-only" import makes that a build error).
 *
 * Deliberately untyped against Database: studio v2 adds columns (room_types,
 * client_token_hash, photo_paths, render_key, output_path, provider) that are
 * ahead of the generated db.types.ts. Regenerate types after the migrations
 * apply, then this can regain the <Database> generic.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase admin client is not configured");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/** True when the server has what it needs to persist sessions and renders. */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
