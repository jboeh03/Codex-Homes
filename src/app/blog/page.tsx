import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes from Cincinnati remodels — what we learn, what we'd do differently, and what to budget for.",
};

export default function BlogPage() {
  return (
    <div className="bg-blueprint">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Field notes
        </p>
        <h1 className="font-display text-5xl tracking-tight text-[var(--color-brand-black)] sm:text-6xl">
          Blog launching soon.
        </h1>
        <p className="mt-4 text-lg text-[var(--color-brand-darkgray)]">
          We&apos;re writing about Cincinnati-specific remodeling — basement moisture, 1920s
          plaster, what cabinetry actually costs in 2026 — and we&apos;ll publish it here
          shortly.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/designer">Try the Design Studio in the meantime</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
