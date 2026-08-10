"use client";

import { formatUsd } from "@/lib/studio/estimate";
import { useStudio } from "./studio-provider";

/**
 * Live investment range. Compact by default (mobile bottom bar); detailed in
 * the estimate step.
 */
export function EstimateSummary({ detailed = false }: { detailed?: boolean }) {
  const { state, estimate } = useStudio();
  const hasLines = estimate.lines.length > 0;

  if (!detailed) {
    return (
      <div className="flex items-baseline gap-3">
        <span className="eyebrow text-[var(--color-cream)]/60">Range</span>
        <span className="font-display text-lg text-[var(--color-cream)]">
          {hasLines
            ? `${formatUsd(estimate.rangeLow)} – ${formatUsd(estimate.rangeHigh)}`
            : "—"}
        </span>
      </div>
    );
  }

  return (
    <div className="grain rounded-lg bg-[var(--color-ink)] p-6 text-[var(--color-cream)] sm:p-8">
      <p className="eyebrow text-[var(--color-brass-soft)]">
        Estimated investment
      </p>
      <p className="mt-4 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-light leading-none">
        {hasLines
          ? `${formatUsd(estimate.rangeLow)} – ${formatUsd(estimate.rangeHigh)}`
          : "Select materials"}
      </p>
      <p className="mt-3 text-sm text-[var(--color-cream)]/60">
        Installed Cincinnati range for your {state.roomType === "bathroom" ? "bath" : "kitchen"}
        {hasLines ? ", materials and labor included." : " appears as you choose finishes."}
      </p>

      {hasLines && (
        <>
          <div className="gold-rule my-6" />
          <ul className="space-y-3 text-sm">
            {estimate.lines.map((line) => (
              <li key={line.category} className="flex items-baseline justify-between gap-4">
                <span className="text-[var(--color-cream)]/75">{line.label}</span>
                <span className="shrink-0 tabular-nums text-[var(--color-cream)]/90">
                  {formatUsd(Math.round(line.subtotal))}
                </span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-4 border-t border-[var(--color-cream)]/15 pt-3">
              <span className="text-[var(--color-cream)]/75">Labor &amp; project management</span>
              <span className="shrink-0 tabular-nums text-[var(--color-cream)]/90">
                {formatUsd(estimate.laborOverhead)}
              </span>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
