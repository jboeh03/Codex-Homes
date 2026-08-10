import "server-only";
import type { RenderInput, RenderProvider, RenderResult } from "./provider";

/**
 * Gemini image editing. Sends the source photo inline with the edit
 * instruction; the model returns the edited image inline. Structure-preserving
 * edits (keep the room, swap the finishes) are the model's native behavior.
 */

const MODEL = "gemini-2.5-flash-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export const geminiProvider: RenderProvider = {
  name: "gemini",
  async generate(input: RenderInput): Promise<RenderResult> {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: input.prompt },
              {
                inline_data: {
                  mime_type: input.mimeType,
                  data: input.imageBytes.toString("base64"),
                },
              },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(90_000),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gemini ${res.status}: ${body.slice(0, 500)}`);
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: GeminiPart[] } }[];
    };
    const parts = json.candidates?.[0]?.content?.parts ?? [];
    const image = parts.find((p) => p.inlineData?.data);
    if (!image?.inlineData) {
      const text = parts.find((p) => p.text)?.text ?? "no image in response";
      throw new Error(`Gemini returned no image: ${text.slice(0, 300)}`);
    }

    return {
      imageBytes: Buffer.from(image.inlineData.data, "base64"),
      mimeType: image.inlineData.mimeType || "image/png",
      provider: "gemini",
    };
  },
};
