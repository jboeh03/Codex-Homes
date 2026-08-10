"use client";

import { cn } from "@/lib/utils";
import { stepOrder, useStudio, type StudioStep } from "./studio-provider";

const stepLabels: Record<StudioStep, string> = {
  photo: "Photo",
  room: "Room",
  materials: "Materials",
  render: "Preview",
  estimate: "Estimate",
};

/** Which steps are reachable given current state — no dead-end jumps. */
function reachable(step: StudioStep, state: ReturnType<typeof useStudio>["state"]): boolean {
  switch (step) {
    case "photo":
      return true;
    case "room":
      return true;
    case "materials":
      return state.roomChosen;
    case "render":
    case "estimate":
      return state.roomChosen;
  }
}

export function StepNav() {
  const studio = useStudio();
  const { state, goTo } = studio;
  const activeIndex = stepOrder.indexOf(state.step);

  return (
    <nav aria-label="Design steps" className="flex items-center gap-1 sm:gap-2">
      {stepOrder.map((step, i) => {
        const enabled = reachable(step, state);
        const active = step === state.step;
        const done = i < activeIndex;
        return (
          <button
            key={step}
            type="button"
            disabled={!enabled}
            onClick={() => goTo(step)}
            data-cursor
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-2 text-[0.68rem] uppercase tracking-[0.18em] transition-colors sm:px-4",
              active
                ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                : done
                  ? "text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5"
                  : "text-[var(--color-stone)]",
              enabled && !active && "hover:bg-[var(--color-ink)]/5",
              !enabled && "cursor-default opacity-45",
            )}
          >
            <span className="font-display text-sm normal-case italic">{i + 1}</span>
            <span className="hidden sm:inline">{stepLabels[step]}</span>
          </button>
        );
      })}
    </nav>
  );
}
