import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db.types";

/**
 * Anonymous server-side client. RLS is enforced via the publishable anon key.
 * No cookie/session plumbing — we don't run any authenticated flows.
 */
export async function createSupabaseServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
