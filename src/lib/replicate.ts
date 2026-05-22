/**
 * Minimal Replicate REST helper. We only need to create predictions and poll status.
 *
 * Requires REPLICATE_API_TOKEN env var (server-side only).
 * Docs: https://replicate.com/docs/reference/http
 */

export type ReplicateStatus =
  | "starting"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled";

export interface ReplicatePrediction {
  id: string;
  status: ReplicateStatus;
  output: string | string[] | null;
  error: string | null;
  urls: { get: string; cancel: string };
}

const BASE = "https://api.replicate.com/v1";

function token(): string {
  const t = process.env.REPLICATE_API_TOKEN;
  if (!t) throw new Error("REPLICATE_API_TOKEN is not set");
  return t;
}

/**
 * Kick off a prediction against a model by owner/name (uses the latest version).
 * Returns immediately with prediction id + initial status — caller polls.
 */
export async function createPrediction(
  owner: string,
  model: string,
  input: Record<string, unknown>,
): Promise<ReplicatePrediction> {
  const res = await fetch(`${BASE}/models/${owner}/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      Prefer: "wait=1", // short server-side wait — speeds up cache hits
    },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate ${res.status}: ${body}`);
  }
  return (await res.json()) as ReplicatePrediction;
}

export async function getPrediction(id: string): Promise<ReplicatePrediction> {
  const res = await fetch(`${BASE}/predictions/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate ${res.status}: ${body}`);
  }
  return (await res.json()) as ReplicatePrediction;
}

/** Replicate sometimes returns output as string[]; we want a single URL. */
export function firstOutput(output: ReplicatePrediction["output"]): string {
  if (!output) return "";
  if (Array.isArray(output)) return output[0] ?? "";
  return output;
}
