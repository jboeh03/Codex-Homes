import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Compass, FileText, Hammer, Handshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How Codex Homes runs Cincinnati remodels — from first call to final punch list, with no surprises.",
};

const steps = [
  {
    icon: Compass,
    title: "Free in-home consult",
    body: "We come out, measure, listen, and tell you what's realistic. No quote yet — just a conversation about what you actually want.",
  },
  {
    icon: Sparkles,
    title: "Designer + selections",
    body: "Use our Design Studio to pre-pick finishes (or come into our Cincinnati showroom). We refine into a full selections list with allowances we know hold.",
  },
  {
    icon: FileText,
    title: "Fixed-scope quote",
    body: "Line-item written quote with a real timeline. Allowances are written down. The price doesn't move unless the scope does — and we tell you before it does.",
  },
  {
    icon: Handshake,
    title: "Contract + deposit",
    body: "We sign, you pay a deposit, we order long-lead items (cabinets, slabs, fixtures). You get a written schedule.",
  },
  {
    icon: Hammer,
    title: "Build with a portal",
    body: "Daily photos, weekly walk-throughs, and one project lead you can text. You always know what's happening today and what's next.",
  },
  {
    icon: CheckCircle2,
    title: "Walkthrough + warranty",
    body: "We close the punch list before final invoice. One-year workmanship warranty. Five-year on plumbing and tile.",
  },
];

export default function ProcessPage() {
  return (
    <div>
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            How we work
          </p>
          <h1 className="font-display text-5xl tracking-tight text-[var(--color-brand-black)] sm:text-6xl">
            Remodeling, decoded.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--color-brand-darkgray)]">
            Anxious about remodels? You should be — most of them are run badly. Here&apos;s
            exactly how we run ours, in six steps you can hold us to.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ol className="space-y-6">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="flex gap-5 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-xl">
                  <span className="text-[var(--color-brand-lightgray)]">0{i + 1}</span>{" "}
                  {title}
                </p>
                <p className="mt-2 text-[var(--color-brand-darkgray)]">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Ready to start at step one?
            </h2>
            <p className="mt-2 text-white/80">Free in-home estimate. No high-pressure sales.</p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/get-estimate">
              Book a free estimate
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
