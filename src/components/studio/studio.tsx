"use client";

import type { MaterialRow } from "@/lib/db.types";
import { StudioProvider, useStudio } from "./studio-provider";
import { StepNav } from "./step-nav";
import { EstimateSummary } from "./estimate-summary";
import { PhotoStep } from "./steps/photo-step";
import { RoomStep } from "./steps/room-step";
import { MaterialsStep } from "./steps/materials-step";
import { RenderStep } from "./steps/render-step";
import { EstimateStep } from "./steps/estimate-step";

export function Studio({ materials }: { materials: MaterialRow[] }) {
  return (
    <StudioProvider materials={materials}>
      <StudioShell />
    </StudioProvider>
  );
}

function SaveIndicator() {
  const { state } = useStudio();
  const label = {
    idle: null,
    saving: "Saving…",
    saved: "Saved automatically",
    error: "Couldn't save — still working locally",
    offline: "Working locally — saving is offline",
  }[state.saveState];
  if (!label) return null;
  return (
    <p aria-live="polite" className="text-xs text-[var(--color-stone)]">
      {label}
    </p>
  );
}

function WelcomeBack() {
  const { state, startOver } = useStudio();
  if (!state.restored) return null;
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-white px-5 py-4 text-sm">
      <span className="text-[var(--color-ink)]">
        Welcome back — we kept your design right where you left it.
      </span>
      <button
        type="button"
        data-cursor
        onClick={startOver}
        className="link-underline text-[var(--color-ink-soft)]"
      >
        Start over
      </button>
    </div>
  );
}

function StudioShell() {
  const { state, estimate } = useStudio();

  if (state.restoring) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center"
        aria-busy="true"
        aria-label="Loading your design"
      >
        <span
          aria-hidden
          className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-stone)] border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="pb-28 lg:pb-16">
      <WelcomeBack />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <StepNav />
        <SaveIndicator />
      </div>

      {state.step === "photo" && <PhotoStep />}
      {state.step === "room" && <RoomStep />}
      {state.step === "materials" && <MaterialsStep />}
      {state.step === "render" && <RenderStep />}
      {state.step === "estimate" && <EstimateStep />}

      {/* Mobile: live range pinned to the bottom while composing materials. */}
      {estimate.lines.length > 0 && state.step !== "estimate" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[var(--color-ink)] px-5 py-3 lg:hidden">
          <EstimateSummary />
        </div>
      )}
    </div>
  );
}
