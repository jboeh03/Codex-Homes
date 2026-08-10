import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Render-spend guardrails. DB-count based so they survive serverless cold
 * starts; the in-memory IP bucket is a cheap first gate against tight loops
 * (best-effort only — each lambda instance has its own map).
 */

const PER_SESSION_HOUR = Number(process.env.STUDIO_RENDERS_PER_SESSION_HOUR ?? 8);
const GLOBAL_DAY = Number(process.env.STUDIO_RENDERS_GLOBAL_DAY ?? 200);
const IP_PER_MINUTE = 10;

const ipHits = new Map<string, number[]>();

export function ipAllowed(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (hits.length >= IP_PER_MINUTE) return false;
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 5000) ipHits.clear();
  return true;
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; status: 429 | 503; error: string };

export async function checkRenderLimits(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<RateLimitResult> {
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const dayStart = new Date(new Date().toISOString().slice(0, 10)).toISOString();

  const [session, global] = await Promise.all([
    supabase
      .from("designer_renders")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId)
      .gte("created_at", hourAgo),
    supabase
      .from("designer_renders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", dayStart),
  ]);

  if ((session.count ?? 0) >= PER_SESSION_HOUR) {
    return {
      ok: false,
      status: 429,
      error:
        "You've generated a lot of designs this hour. Call us at 513-532-6692 and we'll take it from here in person.",
    };
  }
  if ((global.count ?? 0) >= GLOBAL_DAY) {
    return {
      ok: false,
      status: 503,
      error:
        "The studio is at capacity today. Leave your details on the estimate form and we'll design with you directly.",
    };
  }
  return { ok: true };
}
