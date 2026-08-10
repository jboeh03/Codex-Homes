import "server-only";
import type { MaterialCategory, MaterialRow, RoomType } from "@/lib/db.types";
import type { Selections } from "./estimate";
import { studioCategories } from "./estimate";

/**
 * Edit instruction for image-editing models (Gemini image, flux-kontext).
 * These models natively preserve the source photo, so the prompt's job is to
 * scope the edit tightly: keep the room, replace only the chosen finishes.
 */
export function buildEditPrompt(
  roomType: RoomType,
  selections: Selections,
  materials: MaterialRow[],
): string {
  const byId = new Map(materials.map((m) => [m.id, m]));
  const swaps: string[] = [];

  for (const cat of studioCategories) {
    const id = selections[cat.id];
    if (!id) continue;
    const m = byId.get(id);
    if (!m) continue;
    const desc = m.description ? `${m.name} (${m.description})` : m.name;
    swaps.push(`${surfaceLabel(cat.id)} to ${desc}`);
  }

  const room = roomType === "bathroom" ? "bathroom" : "kitchen";
  const changes =
    swaps.length > 0
      ? `Change only these finishes: ${swaps.join("; ")}.`
      : "Give the finishes a tasteful, cohesive refresh.";

  return [
    `Edit this photo of the customer's ${room}.`,
    "Keep the exact camera angle, room layout, walls, windows, doors, and appliance positions unchanged.",
    changes,
    "Everything not listed stays exactly as it is in the original photo.",
    "Photorealistic result matching the original photo's lighting, shadows, and perspective.",
  ].join(" ");
}

function surfaceLabel(category: MaterialCategory): string {
  switch (category) {
    case "cabinet":
      return "the cabinets";
    case "countertop":
      return "the countertops";
    case "backsplash":
      return "the backsplash";
    case "wall-tile":
      return "the wall tile";
    case "floor":
      return "the flooring";
    case "fixture":
      return "the fixtures";
    case "lighting":
      return "the light fixtures";
    default:
      return `the ${category}`;
  }
}
