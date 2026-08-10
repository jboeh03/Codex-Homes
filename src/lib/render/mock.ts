import "server-only";
import sharp from "sharp";
import type { RenderInput, RenderProvider, RenderResult } from "./provider";

/**
 * Zero-spend provider for development and QA (RENDER_PROVIDER=mock).
 * Returns the source photo with a diagonal PREVIEW watermark after a short
 * delay, exercising the full persist/serve pipeline without any API cost.
 */

const WATERMARK = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <text x="400" y="400" font-family="sans-serif" font-size="96" font-weight="bold"
      fill="rgba(255,255,255,0.35)" stroke="rgba(0,0,0,0.25)" stroke-width="2"
      text-anchor="middle" transform="rotate(-30 400 400)">PREVIEW</text>
  </svg>`,
);

export const mockProvider: RenderProvider = {
  name: "mock",
  async generate(input: RenderInput): Promise<RenderResult> {
    await new Promise((r) => setTimeout(r, 1500));
    const imageBytes = await sharp(input.imageBytes)
      .rotate() // respect EXIF orientation
      .resize({ width: 1536, withoutEnlargement: true })
      .composite([{ input: WATERMARK, gravity: "centre" }])
      .png()
      .toBuffer();
    return { imageBytes, mimeType: "image/png", provider: "mock" };
  },
};
