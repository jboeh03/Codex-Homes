"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  sizePresetLabels,
  type RoomDimensions,
  type SizePreset,
} from "@/lib/studio/estimate";
import { cn } from "@/lib/utils";
import { useStudio } from "../studio-provider";
import { EstimateSummary } from "../estimate-summary";

const dimensionFields: { key: keyof RoomDimensions; label: string }[] = [
  { key: "lengthFt", label: "Length (ft)" },
  { key: "widthFt", label: "Width (ft)" },
  { key: "cabinetRunFt", label: "Cabinet run (lf)" },
  { key: "counterSqFt", label: "Counter (sq ft)" },
  { key: "backsplashSqFt", label: "Wall tile / backsplash (sq ft)" },
  { key: "fixtureCount", label: "Fixtures" },
  { key: "lightingCount", label: "Lights" },
];

export function EstimateStep() {
  const { state, dimensions, dispatch, goTo } = useStudio();
  const [fineTune, setFineTune] = useState(false);

  const ctaHref = state.sessionId
    ? `/get-estimate?session=${state.sessionId}&project=${state.roomType}`
    : `/get-estimate?project=${state.roomType}`;

  return (
    <section aria-label="Your estimate">
      <p className="eyebrow text-[var(--color-brass)]">Step five</p>
      <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight">
        Honest numbers, before anyone visits.
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              How large is your {state.roomType === "bathroom" ? "bath" : "kitchen"}?
            </p>
            <div className="mt-3 flex gap-2">
              {(Object.keys(sizePresetLabels) as SizePreset[]).map((preset) => {
                const active = !state.customDimensions && state.sizePreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    data-cursor
                    aria-pressed={active}
                    onClick={() => dispatch({ type: "SET_PRESET", preset })}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm transition-colors",
                      active
                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)]"
                        : "border-[var(--color-border)] bg-white text-[var(--color-ink-soft)] hover:border-[var(--color-stone)]",
                    )}
                  >
                    {sizePresetLabels[preset]}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              data-cursor
              className="link-underline mt-4 text-sm text-[var(--color-ink-soft)]"
              aria-expanded={fineTune}
              onClick={() => setFineTune((v) => !v)}
            >
              {fineTune ? "Hide measurements" : "Fine-tune measurements"}
            </button>

            {fineTune && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {dimensionFields.map((field) => (
                  <label key={field.key} className="block text-xs text-[var(--color-ink-soft)]">
                    {field.label}
                    <Input
                      type="number"
                      min={0}
                      className="mt-1"
                      value={dimensions[field.key]}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        dispatch({
                          type: "SET_DIMENSIONS",
                          dimensions: {
                            ...dimensions,
                            [field.key]: Number.isFinite(v) ? Math.max(0, v) : 0,
                          },
                        });
                      }}
                    />
                  </label>
                ))}
                <button
                  type="button"
                  data-cursor
                  className="self-end pb-2 text-left text-xs text-[var(--color-ink-soft)] underline"
                  onClick={() =>
                    dispatch({ type: "SET_PRESET", preset: state.sizePreset })
                  }
                >
                  Reset to {sizePresetLabels[state.sizePreset].toLowerCase()}
                </button>
              </div>
            )}
          </div>

          {state.render && (
            <figure className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.render.url}
                alt={`AI concept of your ${state.roomType}`}
                className="w-full rounded-lg"
              />
              <figcaption className="mt-2 flex items-center justify-between text-xs text-[var(--color-stone)]">
                <span>AI concept — not a final rendering</span>
                <a
                  href={state.render.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  className="inline-flex items-center gap-1 text-[var(--color-ink-soft)] underline"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden /> Download
                </a>
              </figcaption>
            </figure>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <EstimateSummary detailed />

          <Link
            href={ctaHref}
            data-cursor
            className="mt-5 block rounded-full bg-[var(--color-darkblue)] px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[var(--color-mediumblue)]"
          >
            Bring this design to a free consult
          </Link>
          <p className="mt-3 text-center text-xs text-[var(--color-stone)]">
            Your design and photos ride along — no re-explaining. Or call{" "}
            <a href="tel:+15135326692" className="underline">
              513-532-6692
            </a>
            .
          </p>

          <button
            type="button"
            data-cursor
            onClick={() => goTo("materials")}
            className="link-underline mx-auto mt-6 block text-sm text-[var(--color-ink-soft)]"
          >
            Adjust materials
          </button>
        </div>
      </div>
    </section>
  );
}
