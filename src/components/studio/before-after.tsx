"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Draggable before/after comparison. Pointer events so mouse and touch behave
 * identically; the divider follows the pointer while pressed.
 */
export function BeforeAfter({
  beforeUrl,
  afterUrl,
  alt,
}: {
  beforeUrl: string;
  afterUrl: string;
  alt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(55);
  const draggingRef = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(97, Math.max(3, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-lg"
      onPointerDown={(e) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) moveTo(e.clientX);
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      style={{ touchAction: "none" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterUrl} alt={alt} className="block w-full" draggable={false} />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt=""
          aria-hidden
          className="block h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-y-0 w-px bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--color-ink)] shadow-md">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
            <path d="M5 1 1 6l4 5M11 1l4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white">
        Today
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white">
        Your design
      </span>

      <input
        type="range"
        min={3}
        max={97}
        value={Math.round(position)}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Compare before and after"
        className="sr-only"
      />
    </div>
  );
}
