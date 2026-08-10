"use client";

import type { MaterialRow } from "@/lib/db.types";
import { cn } from "@/lib/utils";

/**
 * Swatch card. Uses the material's photo when the catalog provides one,
 * otherwise a color chip from color_hex — the built-in fallback catalog is
 * color-only.
 */
export function MaterialCard({
  material,
  selected,
  onSelect,
}: {
  material: MaterialRow;
  selected: boolean;
  onSelect: () => void;
}) {
  const swatch = material.swatch_url || material.image_url;
  return (
    <button
      type="button"
      onClick={onSelect}
      data-cursor
      aria-pressed={selected}
      className={cn(
        "group w-36 shrink-0 snap-start rounded-lg border bg-white p-2 text-left transition-all sm:w-40",
        selected
          ? "border-[var(--color-brass)] shadow-[0_0_0_1px_var(--color-brass)]"
          : "border-[var(--color-border)] hover:border-[var(--color-stone)]",
      )}
    >
      <span className="block overflow-hidden rounded-md">
        {swatch ? (
          // Material photos come from Supabase storage / supplier CDNs with
          // unknown hosts — plain img matches the existing Logo treatment.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={swatch}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden
            className="block aspect-[4/3] w-full"
            style={{ backgroundColor: material.color_hex || "#d8d8d4" }}
          />
        )}
      </span>
      <span className="mt-2 block text-[0.8rem] font-medium leading-tight text-[var(--color-ink)]">
        {material.name}
      </span>
      {material.description && (
        <span className="mt-0.5 block text-[0.7rem] leading-snug text-[var(--color-ink-soft)]">
          {material.description}
        </span>
      )}
    </button>
  );
}
