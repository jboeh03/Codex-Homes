import { Suspense } from "react";
import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Get a Free Estimate",
  description:
    "Free in-home estimates for kitchen, bath, basement, and whole-home renovations in Cincinnati.",
};

export default function GetEstimatePage() {
  return (
    <div className="bg-blueprint">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Free in-home estimate
          </p>
          <h1 className="font-display text-5xl tracking-tight text-[var(--color-brand-black)] sm:text-6xl">
            Tell us about your project.
          </h1>
          <p className="mt-4 text-lg text-[var(--color-brand-darkgray)]">
            Two minutes. Five questions. We&apos;ll text you to confirm a time
            within the hour.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-[var(--color-brand-darkgray)]">
            <li>· One project lead from intake to punch list</li>
            <li>· Written, fixed-scope quote — no surprises</li>
            <li>· Cincinnati owned, BBB accredited, fully insured</li>
            <li>· Prefer to text? (513) 532-6692</li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<LeadFormFallback />}>
            <LeadForm source="get-estimate" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function LeadFormFallback() {
  return (
    <div className="h-[480px] animate-pulse rounded-xl border border-[var(--color-border)] bg-white" />
  );
}
