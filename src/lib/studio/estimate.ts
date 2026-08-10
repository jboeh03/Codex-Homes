import type { MaterialCategory, MaterialRow, RoomType } from "@/lib/db.types";

export interface StudioCategory {
  id: MaterialCategory;
  label: string;
  helper: string;
  roomTypes: RoomType[];
}

export const studioCategories: StudioCategory[] = [
  {
    id: "cabinet",
    label: "Cabinets",
    helper: "Priced by linear foot of cabinet or vanity run",
    roomTypes: ["kitchen", "bathroom"],
  },
  {
    id: "countertop",
    label: "Countertops",
    helper: "Priced by square foot of counter",
    roomTypes: ["kitchen", "bathroom"],
  },
  {
    id: "backsplash",
    label: "Backsplash",
    helper: "Priced by square foot of wall coverage",
    roomTypes: ["kitchen"],
  },
  {
    id: "wall-tile",
    label: "Wall tile",
    helper: "Priced by square foot of tiled wall",
    roomTypes: ["bathroom"],
  },
  {
    id: "floor",
    label: "Floors",
    helper: "Priced by square foot of floor area",
    roomTypes: ["kitchen", "bathroom"],
  },
  {
    id: "fixture",
    label: "Fixtures",
    helper: "Priced each (faucet, sink, shower set, hood)",
    roomTypes: ["kitchen", "bathroom"],
  },
  {
    id: "lighting",
    label: "Lighting",
    helper: "Priced each (pendants, cans, sconces)",
    roomTypes: ["kitchen", "bathroom"],
  },
];

export function categoriesForRoom(roomType: RoomType): StudioCategory[] {
  return studioCategories.filter((c) => c.roomTypes.includes(roomType));
}

export function materialsForRoom(
  materials: MaterialRow[],
  roomType: RoomType,
): MaterialRow[] {
  return materials.filter((m) => {
    // room_types arrives once the studio_v2 migration is applied; older rows
    // without it apply everywhere.
    const roomTypes = (m as MaterialRow & { room_types?: RoomType[] })
      .room_types;
    return !roomTypes || roomTypes.includes(roomType);
  });
}

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

export type SizePreset = "small" | "medium" | "large";

const PRESET_SCALE: Record<SizePreset, number> = {
  small: 0.75,
  medium: 1,
  large: 1.4,
};

export const sizePresetLabels: Record<SizePreset, string> = {
  small: "Small",
  medium: "Average",
  large: "Large",
};

export function dimensionsForPreset(
  roomType: RoomType,
  preset: SizePreset,
): RoomDimensions {
  const base = defaultDimensions[roomType];
  const s = PRESET_SCALE[preset];
  const scale = (n: number) => Math.round(n * s);
  return {
    lengthFt: scale(base.lengthFt),
    widthFt: scale(base.widthFt),
    ceilingFt: base.ceilingFt,
    cabinetRunFt: scale(base.cabinetRunFt),
    counterSqFt: scale(base.counterSqFt),
    backsplashSqFt: scale(base.backsplashSqFt),
    fixtureCount: scale(base.fixtureCount),
    lightingCount: scale(base.lightingCount),
  };
}

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
 * Labor + GC overhead on top of materials+install, expressed as multiplier of
 * installed cost. Range covers the typical Cincinnati spread (lean to
 * fully-managed scope).
 */
const OVERHEAD_LOW = 0.18;
const OVERHEAD_HIGH = 0.32;

const floorSqFt = (d: RoomDimensions) => d.lengthFt * d.widthFt;

function quantityFor(category: MaterialCategory, d: RoomDimensions): number {
  switch (category) {
    case "cabinet":
      return d.cabinetRunFt;
    case "countertop":
      return d.counterSqFt;
    case "backsplash":
    case "wall-tile":
      return d.backsplashSqFt;
    case "floor":
      return floorSqFt(d);
    case "fixture":
      return d.fixtureCount;
    case "lighting":
      return d.lightingCount;
    default:
      return 0;
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

  for (const cat of studioCategories) {
    const matId = selections[cat.id];
    if (!matId) continue;
    const m = byId.get(matId);
    if (!m) continue;
    const qty = quantityFor(cat.id, dimensions);
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

export function formatUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
