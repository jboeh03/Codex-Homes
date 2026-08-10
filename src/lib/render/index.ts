import "server-only";
import type { RenderInput, RenderProvider, RenderResult } from "./provider";
import { geminiProvider } from "./gemini";
import { replicateProvider } from "./replicate";
import { mockProvider } from "./mock";

export type { RenderInput, RenderResult } from "./provider";

const providers: Record<string, RenderProvider> = {
  gemini: geminiProvider,
  replicate: replicateProvider,
  mock: mockProvider,
};

export function getRenderProvider(): RenderProvider {
  const name = process.env.RENDER_PROVIDER ?? "gemini";
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown RENDER_PROVIDER "${name}"`);
  }
  return provider;
}

export function isRenderConfigured(): boolean {
  const name = process.env.RENDER_PROVIDER ?? "gemini";
  if (name === "mock") return true;
  if (name === "replicate") return Boolean(process.env.REPLICATE_API_TOKEN);
  return Boolean(
    process.env.GEMINI_API_KEY ??
      process.env.GOOGLE_AI_API_KEY ??
      process.env.REPLICATE_API_TOKEN,
  );
}

/**
 * Try the configured provider; if it's gemini and it fails while Replicate is
 * configured, fall back once. Mock never falls back.
 */
export async function generateWithFallback(
  input: RenderInput,
): Promise<RenderResult> {
  const primary = getRenderProvider();
  try {
    return await primary.generate(input);
  } catch (err) {
    const canFallback =
      primary.name === "gemini" && Boolean(process.env.REPLICATE_API_TOKEN);
    if (!canFallback) throw err;
    console.error(`[studio] ${primary.name} render failed, trying replicate:`, err);
    return replicateProvider.generate(input);
  }
}
