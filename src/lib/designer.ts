import { createHash } from "crypto";
import type { MaterialCategory, MaterialRow, RoomType } from "@/lib/db.types";

export const designerCategories: { id: MaterialCategory; label: string; helper: string }[] = [
  { id: "cabinet", label: "Cabinets", helper: "Priced by linear foot of cabinet run" },
  { id: "countertop", label: "Countertops", helper: "Priced by square foot of counter" },
  { id: "backsplash", label: "Backsplash", helper: "Priced by square foot of wall coverage" },
  { id: "floor", label: "Floors", helper: "Priced by square foot of floor area" },
  { id: "fixture", label: "Fixtures", helper: "Priced each (faucet, sink, hood, etc.)" },
  { id: "lighting", label: "Lighting", helper: "Priced each (pendants, cans, sconces)" },
];

export interface RoomDimensions {
  lengthFt: number;
  widthFt: number;
  ceilingFt: number;
  cabinetRunFt: number;
  counterSqFt: number;
  backsplashSqFt: number;
  fixtureCount: number;
  lightingCount: number;
}

export const defaultDimensions: Record<RoomType, RoomDimensions> = {
  kitchen: {
    lengthFt: 14,
    widthFt: 12,
    ceilingFt: 8,
    cabinetRunFt: 22,
    counterSqFt: 42,
    backsplashSqFt: 28,
    fixtureCount: 3,
    lightingCount: 6,
  },
  bathroom: {
    lengthFt: 9,
    widthFt: 7,
    ceilingFt: 8,
    cabinetRunFt: 6,
    counterSqFt: 12,
    backsplashSqFt: 36,
    fixtureCount: 4,
    lightingCount: 3,
  },
  other: {
    lengthFt: 12,
    widthFt: 12,
    ceilingFt: 8,
    cabinetRunFt: 0,
    counterSqFt: 0,
    backsplashSqFt: 0,
    fixtureCount: 0,
    lightingCount: 4,
  },
};

export type Selections = Partial<Record<MaterialCategory, string>>;

export interface LineItem {
  category: MaterialCategory;
  label: string;
  quantity: number;
  unit: string;
  unitCost: number;
  installCost: number;
  subtotal: number;
}

export interface Estimate {
  lines: LineItem[];
  materialsSubtotal: number;
  installSubtotal: number;
  laborOverhead: number;
  rangeLow: number;
  rangeHigh: number;
}

/**
 * Labor + GC overhead on top of materials+install, expressed as multiplier of installed cost.
 * Range covers the typical Cincinnati spread (lean to fully-managed scope).
 */
const OVERHEAD_LOW = 0.18;
const OVERHEAD_HIGH = 0.32;

const floorSqFt = (d: RoomDimensions) => d.lengthFt * d.widthFt;

function quantityFor(category: MaterialCategory, d: RoomDimensions): { qty: number } {
  switch (category) {
    case "cabinet":
      return { qty: d.cabinetRunFt };
    case "countertop":
      return { qty: d.counterSqFt };
    case "backsplash":
      return { qty: d.backsplashSqFt };
    case "floor":
      return { qty: floorSqFt(d) };
    case "fixture":
      return { qty: d.fixtureCount };
    case "lighting":
      return { qty: d.lightingCount };
    default:
      return { qty: 0 };
  }
}

export function calculateEstimate(
  selections: Selections,
  materials: MaterialRow[],
  dimensions: RoomDimensions,
): Estimate {
  const byId = new Map(materials.map((m) => [m.id, m]));
  const lines: LineItem[] = [];
  let materialsSubtotal = 0;
  let installSubtotal = 0;

  for (const cat of designerCategories) {
    const matId = selections[cat.id];
    if (!matId) continue;
    const m = byId.get(matId);
    if (!m) continue;
    const { qty } = quantityFor(cat.id, dimensions);
    if (qty <= 0) continue;
    const materialCost = qty * Number(m.unit_cost);
    const installCost = qty * Number(m.install_cost_per_unit);
    const subtotal = materialCost + installCost;
    lines.push({
      category: cat.id,
      label: m.name,
      quantity: Math.round(qty * 100) / 100,
      unit: m.unit,
      unitCost: Number(m.unit_cost),
      installCost,
      subtotal,
    });
    materialsSubtotal += materialCost;
    installSubtotal += installCost;
  }

  const installedTotal = materialsSubtotal + installSubtotal;
  const laborOverhead = installedTotal * ((OVERHEAD_LOW + OVERHEAD_HIGH) / 2);
  const rangeLow = Math.round(installedTotal * (1 + OVERHEAD_LOW));
  const rangeHigh = Math.round(installedTotal * (1 + OVERHEAD_HIGH));

  return {
    lines,
    materialsSubtotal: Math.round(materialsSubtotal),
    installSubtotal: Math.round(installSubtotal),
    laborOverhead: Math.round(laborOverhead),
    rangeLow,
    rangeHigh,
  };
}

/**
 * Build the prompt for the AI room-redesign model from the user's selections.
 * Kept descriptive but constrained — we want the model to honor room geometry
 * (ControlNet does most of that work) while restyling surfaces.
 */
export function buildRenderPrompt(
  roomType: RoomType,
  selections: Selections,
  materials: MaterialRow[],
): string {
  const byId = new Map(materials.map((m) => [m.id, m]));
  const desc = (cat: MaterialCategory): string | null => {
    const id = selections[cat];
    if (!id) return null;
    const m = byId.get(id);
    if (!m) return null;
    return m.description ? `${m.name} (${m.description})` : m.name;
  };

  const parts: string[] = [];
  const cabinet = desc("cabinet");
  const counter = desc("countertop");
  const backsplash = desc("backsplash");
  const floor = desc("floor");
  const fixture = desc("fixture");
  const lighting = desc("lighting");

  if (cabinet) parts.push(`${cabinet} cabinets`);
  if (counter) parts.push(`${counter} countertops`);
  if (backsplash) parts.push(`${backsplash} backsplash`);
  if (floor) parts.push(`${floor} floors`);
  if (fixture) parts.push(`${fixture}`);
  if (lighting) parts.push(`${lighting}`);

  const room = roomType === "bathroom" ? "modern bathroom" : roomType === "kitchen" ? "modern kitchen" : "modern interior";
  const finishes = parts.length > 0 ? parts.join(", ") + ". " : "";

  return `A ${room} renovation with ${finishes}Professional interior photography, natural lighting, photorealistic, magazine quality.`;
}

/**
 * Stable hash of the inputs that determine a render. Cached renders are keyed
 * by this — change a selection or the photo and we render again.
 */
export function selectionsHash(
  roomType: RoomType,
  photoUrl: string,
  selections: Selections,
): string {
  const sorted = Object.keys(selections)
    .sort()
    .map((k) => `${k}:${selections[k as MaterialCategory] ?? ""}`)
    .join("|");
  return createHash("sha256")
    .update(`${roomType}|${photoUrl}|${sorted}`)
    .digest("hex")
    .slice(0, 24);
}

