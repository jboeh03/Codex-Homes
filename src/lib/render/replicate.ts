import "server-only";
import type { RenderInput, RenderProvider, RenderResult } from "./provider";

/**
 * Replicate fallback: black-forest-labs/flux-kontext-pro, an instruction-
 * following image-editing model. Uses `Prefer: wait` so the request resolves
 * synchronously, then downloads the output bytes (Replicate URLs expire).
 */

const ENDPOINT =
  "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions";

function apiToken(): string {
  const t = process.env.REPLICATE_API_TOKEN;
  if (!t) throw new Error("REPLICATE_API_TOKEN is not set");
  return t;
}

export const replicateProvider: RenderProvider = {
  name: "replicate",
  async generate(input: RenderInput): Promise<RenderResult> {
    const dataUri = `data:${input.mimeType};base64,${input.imageBytes.toString("base64")}`;
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken()}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({
        input: {
          prompt: input.prompt,
          input_image: dataUri,
          output_format: "png",
        },
      }),
      signal: AbortSignal.timeout(90_000),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Replicate ${res.status}: ${body.slice(0, 500)}`);
    }

    const prediction = (await res.json()) as {
      status: string;
      output: string | string[] | null;
      error: string | null;
    };
    if (prediction.status !== "succeeded" || !prediction.output) {
      throw new Error(
        `Replicate prediction ${prediction.status}: ${prediction.error ?? "no output"}`,
      );
    }

    const url = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;
    const imgRes = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!imgRes.ok) {
      throw new Error(`Replicate output fetch ${imgRes.status}`);
    }

    return {
      imageBytes: Buffer.from(await imgRes.arrayBuffer()),
      mimeType: imgRes.headers.get("content-type") ?? "image/png",
      provider: "replicate",
    };
  },
};
