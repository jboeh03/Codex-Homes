import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Codex Homes serves Greater Cincinnati and Northern Kentucky — Hyde Park, Oakley, Mt. Lookout, Anderson, Mason, Indian Hill, Madeira, Wyoming, and more.",
};

const areas = [
  ["Hyde Park", "45208"],
  ["Oakley", "45209"],
  ["Mt. Lookout", "45226"],
  ["Mt. Adams", "45202"],
  ["Anderson Twp", "45230"],
  ["Madeira", "45243"],
  ["Indian Hill", "45243"],
  ["Wyoming", "45215"],
  ["Mason", "45040"],
  ["West Chester", "45069"],
  ["Loveland", "45140"],
  ["Montgomery", "45242"],
  ["Blue Ash", "45242"],
  ["Newport, KY", "41071"],
  ["Covington, KY", "41011"],
  ["Fort Thomas, KY", "41075"],
];

export default function ServiceAreasPage() {
  return (
    <div>
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Service Areas
          </p>
          <h1 className="font-display text-5xl tracking-tight text-[var(--color-brand-black)] sm:text-6xl">
            Greater Cincinnati &amp; Northern Kentucky.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--color-brand-darkgray)]">
            We&apos;re based in the city and travel within about 45 minutes for full
            remodels. Not sure if we cover your zip? Send it and we&apos;ll tell you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(([area, zip]) => (
            <div
              key={area}
              className="flex items-baseline justify-between rounded-md border border-[var(--color-border)] bg-white px-4 py-3"
            >
              <span className="font-medium text-[var(--color-foreground)]">{area}</span>
              <span className="font-mono text-xs text-[var(--color-brand-darkgray)]">{zip}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-display text-2xl">Not on the list?</h2>
          <p className="mt-2 text-[var(--color-brand-darkgray)]">
            For smaller jobs we&apos;ll usually go further. Send us a quick note and a zip and we&apos;ll
            tell you straight up whether we&apos;re a fit.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/get-estimate">Check my zip</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
