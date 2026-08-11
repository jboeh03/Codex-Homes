"use client";

import { Button } from "@/components/ui/button";
import {
  categoriesForRoom,
  materialsForRoom,
} from "@/lib/studio/estimate";
import { applyPreset, stylePresets } from "@/lib/studio/style-presets";
import { cn } from "@/lib/utils";
import { useStudio } from "../studio-provider";
import { MaterialCard } from "../material-card";

export function MaterialsStep() {
  const { state, materials, dispatch, goTo } = useStudio();
  const roomMaterials = materialsForRoom(materials, state.roomType);
  const categories = categoriesForRoom(state.roomType);
  const pickedCount = Object.keys(state.selections).length;

  return (
    <section aria-label="Choose your materials">
      <p className="eyebrow text-[var(--color-brass)]">Step three</p>
      <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight">
        Compose your {state.roomType === "bathroom" ? "bath" : "kitchen"}.
      </h2>
      <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
        Genuine selections from the suppliers we buy from. Pick as many or as
        few as you like — the investment range follows your choices.
      </p>

      <div className="mt-8">
        <p className="text-sm font-medium text-[var(--color-ink)]">
          Start from a style, or compose your own
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {stylePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              data-cursor
              onClick={() =>
                dispatch({
                  type: "APPLY_SELECTIONS",
                  selections: applyPreset(preset, state.roomType, materials),
                })
              }
              className={cn(
                "rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-left transition-colors hover:border-[var(--color-brass)]",
              )}
            >
              <span className="block text-sm font-medium text-[var(--color-ink)]">
                {preset.label}
              </span>
              <span className="block text-[0.7rem] text-[var(--color-ink-soft)]">
                {preset.blurb}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((category) => {
          const options = roomMaterials
            .filter((m) => m.category === category.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          if (options.length === 0) return null;
          const selectedId = state.selections[category.id];

          return (
            <div key={category.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl">{category.label}</h3>
                <p className="text-xs text-[var(--color-stone)]">{category.helper}</p>
              </div>
              <div className="hairline mt-3" />
              <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-2">
                {options.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    selected={selectedId === material.id}
                    onSelect={() =>
                      dispatch({
                        type: "SET_SELECTION",
                        category: category.id,
                        materialId: selectedId === material.id ? null : material.id,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <Button
          size="lg"
          data-cursor
          disabled={pickedCount === 0}
          className="rounded-full px-8"
          onClick={() => goTo(state.photos.length > 0 ? "render" : "estimate")}
        >
          {state.photos.length > 0 ? "Preview it on your room" : "See your estimate"}
        </Button>
        {pickedCount === 0 && (
          <p className="text-sm text-[var(--color-ink-soft)]">
            Pick at least one finish to continue.
          </p>
        )}
      </div>
    </section>
  );
}
