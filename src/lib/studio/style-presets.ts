import type { MaterialCategory, MaterialRow, RoomType } from "@/lib/db.types";
import type { Selections } from "./estimate";
import { categoriesForRoom, materialsForRoom } from "./estimate";

/**
 * Style presets pre-fill a coherent set of selections. Matching is by name /
 * description keywords rather than material ids, so presets keep working as
 * the catalog changes (fallback list today, Zach's real SKUs tomorrow). Any
 * category with no keyword match is simply left unselected.
 */

export type StylePresetId = "modern" | "classic" | "warm";

export interface StylePreset {
  id: StylePresetId;
  label: string;
  blurb: string;
  /** Keyword preference lists per category, tried in order. */
  picks: Partial<Record<MaterialCategory, string[]>>;
}

export const stylePresets: StylePreset[] = [
  {
    id: "modern",
    label: "Modern",
    blurb: "Slab fronts, matte black, large-format stone",
    picks: {
      cabinet: ["slab", "navy", "flat"],
      countertop: ["quartz", "black"],
      backsplash: ["large", "herringbone", "subway"],
      "wall-tile": ["large-format", "porcelain"],
      floor: ["porcelain", "lvp", "slate"],
      fixture: ["matte black"],
      lighting: ["recessed", "can"],
    },
  },
  {
    id: "classic",
    label: "Classic",
    blurb: "White shaker, marble veining, brushed nickel",
    picks: {
      cabinet: ["shaker", "white"],
      countertop: ["calacatta", "carrara", "marble", "quartz"],
      backsplash: ["subway"],
      "wall-tile": ["subway"],
      floor: ["oak", "hex", "marble"],
      fixture: ["brushed nickel"],
      lighting: ["pendant", "sconce", "recessed"],
    },
  },
  {
    id: "warm",
    label: "Warm",
    blurb: "Walnut and sage, butcher block, aged brass",
    picks: {
      cabinet: ["sage", "walnut"],
      countertop: ["butcher", "oak", "marble"],
      backsplash: ["zellige", "sea glass"],
      "wall-tile": ["penny", "large-format"],
      floor: ["oak", "lvp"],
      fixture: ["brass"],
      lighting: ["sconce", "pendant", "recessed"],
    },
  },
];

export function applyPreset(
  preset: StylePreset,
  roomType: RoomType,
  materials: MaterialRow[],
): Selections {
  const pool = materialsForRoom(materials, roomType);
  const selections: Selections = {};

  for (const category of categoriesForRoom(roomType)) {
    const keywords = preset.picks[category.id];
    if (!keywords) continue;
    const options = pool.filter((m) => m.category === category.id);
    const match = keywords
      .map((kw) =>
        options.find((m) =>
          `${m.name} ${m.description}`.toLowerCase().includes(kw.toLowerCase()),
        ),
      )
      .find(Boolean);
    if (match) selections[category.id] = match.id;
  }
  return selections;
}
