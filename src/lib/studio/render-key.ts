import type { MaterialCategory, RoomType } from "@/lib/db.types";
import type { Selections } from "./estimate";

/**
 * Canonical key for "which render do these inputs produce". Used verbatim by
 * the client (stale-render banner) and the server (render cache), so the two
 * can never disagree. A plain sorted string — no hashing, no crypto import,
 * safe in any bundle.
 */
export function buildRenderKey(
  roomType: RoomType,
  photoPath: string,
  selections: Selections,
): string {
  const sorted = Object.keys(selections)
    .sort()
    .filter((k) => selections[k as MaterialCategory])
    .map((k) => `${k}:${selections[k as MaterialCategory]}`)
    .join("|");
  return `${roomType}|${photoPath}|${sorted}`;
}
