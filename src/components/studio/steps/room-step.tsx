"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RoomType } from "@/lib/db.types";
import { useStudio } from "../studio-provider";

const rooms: { id: RoomType; label: string; blurb: string }[] = [
  {
    id: "kitchen",
    label: "Kitchen",
    blurb: "Cabinetry, stone, backsplash, floors, lighting",
  },
  {
    id: "bathroom",
    label: "Bathroom",
    blurb: "Vanity, tile, stone, fixtures, lighting",
  },
];

export function RoomStep() {
  const { state, dispatch, goTo } = useStudio();

  return (
    <section aria-label="Choose your room">
      <p className="eyebrow text-[var(--color-brass)]">Step two</p>
      <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight">
        Which room are we designing?
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {rooms.map((room) => {
          const selected = state.roomChosen && state.roomType === room.id;
          return (
            <button
              key={room.id}
              type="button"
              data-cursor
              aria-pressed={selected}
              onClick={() => {
                dispatch({ type: "SET_ROOM", roomType: room.id });
                goTo("materials");
              }}
              className={cn(
                "grain rounded-lg border p-8 text-left transition-all sm:p-10",
                selected
                  ? "border-[var(--color-brass)] bg-[var(--color-ink)] text-[var(--color-cream)]"
                  : "border-[var(--color-border)] bg-white hover:border-[var(--color-stone)]",
              )}
            >
              <span className="font-display text-2xl font-light sm:text-3xl">
                {room.label}
              </span>
              <span
                className={cn(
                  "mt-3 block text-sm",
                  selected ? "text-[var(--color-cream)]/65" : "text-[var(--color-ink-soft)]",
                )}
              >
                {room.blurb}
              </span>
            </button>
          );
        })}
      </div>

      {state.roomChosen && (
        <div className="mt-10">
          <Button
            size="lg"
            data-cursor
            className="rounded-full px-8"
            onClick={() => goTo("materials")}
          >
            Choose materials
          </Button>
        </div>
      )}
    </section>
  );
}
