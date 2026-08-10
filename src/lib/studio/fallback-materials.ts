import type { MaterialRow, RoomType } from "@/lib/db.types";

/**
 * Built-in material catalog used when Supabase is unreachable (paused project,
 * network issue) or returns no rows. The studio must never 500 or go blank —
 * estimates and renders work off this list; only persistence degrades.
 * Prices are installed Cincinnati-market figures matching the estimate
 * engine's unit conventions.
 */

type Fallback = MaterialRow & { room_types: RoomType[] };

function m(
  partial: Pick<
    MaterialRow,
    "id" | "category" | "name" | "description" | "unit" | "unit_cost" | "install_cost_per_unit" | "color_hex" | "sort_order"
  > & { room_types: RoomType[] },
): Fallback {
  return {
    created_at: "",
    image_url: "",
    is_active: true,
    sku: "",
    supplier: "",
    swatch_url: "",
    ...partial,
  };
}

export const fallbackMaterials: Fallback[] = [
  // Cabinets — per linear foot
  m({ id: "fb-cab-shaker-white", category: "cabinet", name: "Shaker, Dove White", description: "painted maple shaker doors", unit: "lf", unit_cost: 185, install_cost_per_unit: 95, color_hex: "#f2f0ea", sort_order: 1, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-cab-shaker-navy", category: "cabinet", name: "Shaker, Harbor Navy", description: "painted maple shaker doors in deep navy", unit: "lf", unit_cost: 195, install_cost_per_unit: 95, color_hex: "#1f3a5f", sort_order: 2, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-cab-slab-walnut", category: "cabinet", name: "Slab, Natural Walnut", description: "flat-panel walnut veneer, modern", unit: "lf", unit_cost: 260, install_cost_per_unit: 105, color_hex: "#6b4a2f", sort_order: 3, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-cab-sage", category: "cabinet", name: "Shaker, Sage Green", description: "painted shaker doors in muted sage", unit: "lf", unit_cost: 195, install_cost_per_unit: 95, color_hex: "#8a9a85", sort_order: 4, room_types: ["kitchen", "bathroom"] }),

  // Countertops — per sq ft
  m({ id: "fb-top-quartz-calacatta", category: "countertop", name: "Quartz, Calacatta", description: "white quartz with soft gray veining", unit: "sqft", unit_cost: 75, install_cost_per_unit: 35, color_hex: "#eceae4", sort_order: 1, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-top-granite-black", category: "countertop", name: "Granite, Absolute Black", description: "honed black granite", unit: "sqft", unit_cost: 65, install_cost_per_unit: 35, color_hex: "#23272a", sort_order: 2, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-top-butcher", category: "countertop", name: "Butcher Block, Oak", description: "oiled oak butcher block", unit: "sqft", unit_cost: 42, install_cost_per_unit: 28, color_hex: "#c09a66", sort_order: 3, room_types: ["kitchen"] }),
  m({ id: "fb-top-marble", category: "countertop", name: "Marble, Carrara", description: "honed Carrara marble", unit: "sqft", unit_cost: 90, install_cost_per_unit: 40, color_hex: "#e8e8e8", sort_order: 4, room_types: ["bathroom", "kitchen"] }),

  // Backsplash (kitchen) — per sq ft
  m({ id: "fb-bs-subway", category: "backsplash", name: "Subway Tile, Bright White", description: "3x6 glossy ceramic subway", unit: "sqft", unit_cost: 14, install_cost_per_unit: 22, color_hex: "#f7f7f5", sort_order: 1, room_types: ["kitchen"] }),
  m({ id: "fb-bs-zellige", category: "backsplash", name: "Zellige, Sea Glass", description: "handmade-look glazed squares", unit: "sqft", unit_cost: 32, install_cost_per_unit: 26, color_hex: "#b9cfc4", sort_order: 2, room_types: ["kitchen"] }),
  m({ id: "fb-bs-herringbone", category: "backsplash", name: "Marble Herringbone", description: "Carrara herringbone mosaic", unit: "sqft", unit_cost: 38, install_cost_per_unit: 30, color_hex: "#dcdcda", sort_order: 3, room_types: ["kitchen"] }),

  // Wall tile (bathroom) — per sq ft
  m({ id: "fb-wt-subway", category: "wall-tile", name: "Subway Tile, Classic White", description: "3x6 ceramic, shower walls", unit: "sqft", unit_cost: 14, install_cost_per_unit: 24, color_hex: "#f7f7f5", sort_order: 1, room_types: ["bathroom"] }),
  m({ id: "fb-wt-largeformat", category: "wall-tile", name: "Large-Format Porcelain, Fog", description: "12x24 matte porcelain", unit: "sqft", unit_cost: 22, install_cost_per_unit: 26, color_hex: "#c9cccd", sort_order: 2, room_types: ["bathroom"] }),
  m({ id: "fb-wt-pennyround", category: "wall-tile", name: "Penny Round, Ink", description: "dark penny-round mosaic accent", unit: "sqft", unit_cost: 28, install_cost_per_unit: 30, color_hex: "#2e3a45", sort_order: 3, room_types: ["bathroom"] }),

  // Floors — per sq ft
  m({ id: "fb-fl-oak", category: "floor", name: "White Oak, Natural", description: "engineered white oak plank", unit: "sqft", unit_cost: 11, install_cost_per_unit: 8, color_hex: "#cdb28c", sort_order: 1, room_types: ["kitchen"] }),
  m({ id: "fb-fl-lvp", category: "floor", name: "LVP, Weathered Gray", description: "waterproof luxury vinyl plank", unit: "sqft", unit_cost: 6, install_cost_per_unit: 5, color_hex: "#a99f92", sort_order: 2, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-fl-hexmarble", category: "floor", name: "Marble Hex, Carrara", description: "2in hex mosaic floor", unit: "sqft", unit_cost: 30, install_cost_per_unit: 26, color_hex: "#e3e3e1", sort_order: 3, room_types: ["bathroom"] }),
  m({ id: "fb-fl-porcelain", category: "floor", name: "Porcelain, Slate Look", description: "12x24 textured porcelain", unit: "sqft", unit_cost: 12, install_cost_per_unit: 12, color_hex: "#5d625f", sort_order: 4, room_types: ["kitchen", "bathroom"] }),

  // Fixtures — each
  m({ id: "fb-fx-brushed-nickel", category: "fixture", name: "Brushed Nickel Set", description: "faucet + hardware in brushed nickel", unit: "each", unit_cost: 320, install_cost_per_unit: 180, color_hex: "#b6b8ba", sort_order: 1, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-fx-matte-black", category: "fixture", name: "Matte Black Set", description: "faucet + hardware in matte black", unit: "each", unit_cost: 360, install_cost_per_unit: 180, color_hex: "#1d1f21", sort_order: 2, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-fx-brass", category: "fixture", name: "Aged Brass Set", description: "faucet + hardware in aged brass", unit: "each", unit_cost: 420, install_cost_per_unit: 180, color_hex: "#a8874f", sort_order: 3, room_types: ["kitchen", "bathroom"] }),

  // Lighting — each
  m({ id: "fb-lt-cans", category: "lighting", name: "Recessed Cans", description: "4in LED recessed, dimmable", unit: "each", unit_cost: 85, install_cost_per_unit: 120, color_hex: "#e8e4da", sort_order: 1, room_types: ["kitchen", "bathroom"] }),
  m({ id: "fb-lt-pendants", category: "lighting", name: "Island Pendants", description: "glass-and-metal pendant pair", unit: "each", unit_cost: 240, install_cost_per_unit: 140, color_hex: "#8f939b", sort_order: 2, room_types: ["kitchen"] }),
  m({ id: "fb-lt-sconce", category: "lighting", name: "Vanity Sconces", description: "warm brass vanity sconces", unit: "each", unit_cost: 180, install_cost_per_unit: 130, color_hex: "#9c8354", sort_order: 3, room_types: ["bathroom"] }),
];
