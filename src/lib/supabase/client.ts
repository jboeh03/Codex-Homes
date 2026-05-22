import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db.types";

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseBrowserClient() {
  if (cached) return cached;
  cached = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
  return cached;
}
