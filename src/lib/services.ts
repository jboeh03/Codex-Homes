export type ServiceSlug =
  | "kitchen"
  | "bathroom"
  | "basement"
  | "whole-home"
  | "additions"
  | "outdoor"
  | "handyman";

export interface Service {
  slug: ServiceSlug;
  title: string;
  shortTitle: string;
  blurb: string;
  longBlurb: string;
  priceRange: [number, number];
  durationWeeks: [number, number];
  highlights: string[];
  scope: string[];
}

export const services: Service[] = [
  {
    slug: "kitchen",
    title: "Kitchen Remodeling",
    shortTitle: "Kitchens",
    blurb:
      "Custom kitchens designed for how Cincinnati families actually live — open layouts, durable finishes, smart storage.",
    longBlurb:
      "From a single-week countertop swap to a full down-to-the-studs gut, our kitchen team handles cabinetry, countertops, tile, lighting, appliances, and the trades behind the walls. Most full kitchens in Greater Cincinnati land between $55k and $110k installed, and we'll show you a tight range before you sign.",
    priceRange: [25000, 150000],
    durationWeeks: [4, 12],
    highlights: [
      "Custom and semi-custom cabinetry from regional suppliers",
      "Quartz, granite, and butcher block countertops",
      "Layout changes, walls removed, structural work",
      "Smart appliance packages (Wi-Fi ranges, panel-ready refrigeration)",
    ],
    scope: [
      "Demolition and disposal",
      "Cabinetry design, build, and installation",
      "Countertops with template and install",
      "Backsplash and tile",
      "Plumbing, electrical, gas, and HVAC adjustments",
      "Lighting and ventilation",
      "Painting and trim",
      "Final punch list and one-year workmanship warranty",
    ],
  },
  {
    slug: "bathroom",
    title: "Bathroom Remodeling",
    shortTitle: "Baths",
    blurb:
      "Spa-like primary baths and small powder-room refreshes. Walk-in showers, freestanding tubs, heated floors — all built to handle real water and real life.",
    longBlurb:
      "Cincinnati's older housing stock means a lot of bath remodels uncover surprises behind the walls. We're meticulous about waterproofing, vent stacks, and subfloor conditions so you only have to do this once.",
    priceRange: [15000, 90000],
    durationWeeks: [2, 8],
    highlights: [
      "Curbless walk-in showers, custom niches and benches",
      "Freestanding soaking tubs",
      "Heated tile floors and shower benches",
      "Frameless glass enclosures",
    ],
    scope: [
      "Demolition and waterproofing inspection",
      "Plumbing rough-in and vent updates",
      "Tile, stone, and glass installation",
      "Vanity, fixtures, and accessories",
      "Ventilation, lighting, and trim",
      "Punch list and warranty",
    ],
  },
  {
    slug: "basement",
    title: "Basement Finishing",
    shortTitle: "Basements",
    blurb:
      "Family rooms, home theaters, gyms, in-law suites — basements are usually your cheapest square footage. We finish them so they don't feel like basements.",
    longBlurb:
      "Most Cincinnati basements have moisture and ceiling-height quirks. We assess before we quote, and we don't cut corners on egress, sump systems, or insulation.",
    priceRange: [35000, 120000],
    durationWeeks: [5, 12],
    highlights: [
      "Egress windows and code compliance",
      "Moisture mitigation and sump upgrades",
      "Full baths, wet bars, and theaters",
      "Sound-dampened framing and ceilings",
    ],
    scope: [
      "Waterproofing and moisture mitigation",
      "Framing, insulation, drywall",
      "Electrical, lighting, and low-voltage",
      "Plumbing for baths and wet bars",
      "Flooring and finish carpentry",
      "Egress and code inspections",
    ],
  },
  {
    slug: "whole-home",
    title: "Whole-Home Renovations",
    shortTitle: "Whole-Home",
    blurb:
      "From dated 1970s split-levels in Anderson to historic homes in Hyde Park — we take entire houses down to what's worth keeping and rebuild around it.",
    longBlurb:
      "Whole-home projects are where our process matters most. You get a single project lead, a written schedule, weekly walk-throughs, and a clear price before demo starts.",
    priceRange: [150000, 750000],
    durationWeeks: [12, 36],
    highlights: [
      "Architectural and structural planning",
      "Permits and historic-district approvals",
      "Kitchen, baths, mechanicals, exterior — coordinated",
      "Move-out logistics and storage support",
    ],
    scope: [
      "Pre-design feasibility and structural review",
      "Architectural drawings and engineering",
      "Permit coordination",
      "Demolition through final punch list",
      "Selections support throughout",
    ],
  },
  {
    slug: "additions",
    title: "Home Additions",
    shortTitle: "Additions",
    blurb:
      "Primary suites, family rooms, sunrooms, and second-story pop-ups. We tie additions in so cleanly they look original.",
    longBlurb:
      "Additions are equal parts construction and architecture. We work with our regular architects and engineers, handle every permit, and match siding, trim, and rooflines so it doesn't read as 'an addition.'",
    priceRange: [80000, 400000],
    durationWeeks: [10, 24],
    highlights: [
      "Foundations, framing, and rooflines tied to existing",
      "HVAC and electrical capacity upgrades",
      "Exterior match for siding, brick, trim, and windows",
    ],
    scope: [
      "Feasibility and zoning review",
      "Architectural and structural drawings",
      "Permits and HOA approvals",
      "Site work, foundation, framing",
      "Mechanicals, finishes, and exterior tie-in",
    ],
  },
  {
    slug: "outdoor",
    title: "Decks, Patios & Outdoor",
    shortTitle: "Outdoor",
    blurb:
      "Composite and hardwood decks, covered patios, outdoor kitchens, and pergolas built to outlast Cincinnati winters.",
    longBlurb:
      "Outdoor living projects often get value-engineered to death. We'll show you where it's worth spending (footings, structural connections, drainage) and where it's not.",
    priceRange: [12000, 90000],
    durationWeeks: [2, 8],
    highlights: [
      "Composite and ipe decking",
      "Covered porches and pergolas",
      "Outdoor kitchens and fireplaces",
      "Drainage and lighting",
    ],
    scope: [
      "Permits and HOA review",
      "Footings and structural framing",
      "Decking, railings, stairs",
      "Lighting and electrical",
      "Optional gas, water, and built-ins",
    ],
  },
  {
    slug: "handyman",
    title: "Handyman & Small Projects",
    shortTitle: "Handyman",
    blurb:
      "Punch lists, repairs, drywall, trim, fixture swaps, and the dozen small things you've been meaning to get to. Same crew quality, smaller scope.",
    longBlurb:
      "We started doing handyman work because our existing clients kept asking. We bundle small jobs into half-day or full-day visits to keep pricing reasonable.",
    priceRange: [500, 8000],
    durationWeeks: [0, 2],
    highlights: [
      "Half-day and full-day handyman blocks",
      "Drywall, trim, paint, fixtures, doors",
      "Pre-listing repairs for realtors",
    ],
    scope: [
      "Free phone consult and quote",
      "Scheduled half-day or full-day visit",
      "Materials sourcing included",
    ],
  },
];

export const findService = (slug: string) =>
  services.find((s) => s.slug === slug);
