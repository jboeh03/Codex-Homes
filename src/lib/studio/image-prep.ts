"use client";

/**
 * Client-side photo preparation:
 * - HEIC/HEIF (iPhone library picks) → JPEG via heic2any (WASM libheif —
 *   server-side sharp can't decode HEVC-encoded HEIC). iOS camera captures
 *   already arrive as JPEG, so this path only triggers on library picks.
 * - Downscale to ≤2048px JPEG q0.85 — faster uploads on cellular and a
 *   friendlier input size for the render models.
 */

const MAX_EDGE = 2048;
const JPEG_QUALITY = 0.85;

function isHeic(file: File): boolean {
  return (
    /image\/hei[cf]/.test(file.type) || /\.hei[cf]$/i.test(file.name)
  );
}

async function heicToJpeg(file: File): Promise<Blob> {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: JPEG_QUALITY,
  });
  return Array.isArray(out) ? out[0] : out;
}

async function decode(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob);
}

export interface PreparedPhoto {
  blob: Blob;
  filename: string;
  previewUrl: string;
}

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  const source = isHeic(file) ? await heicToJpeg(file) : file;
  const bitmap = await decode(source);

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not encode photo"))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  const filename = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return { blob, filename, previewUrl: URL.createObjectURL(blob) };
}
