import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Codex Homes is a Cincinnati custom builder and remodeler — locally owned, fully licensed, and obsessed with making remodels legible.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
            About Codex Homes
          </p>
          <h1 className="font-display text-5xl tracking-tight text-[--color-brand-black] sm:text-6xl">
            A Cincinnati builder, built around clarity.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[--color-brand-darkgray]">
            We&apos;re a small, employee-owned custom builder and remodeler. We work on
            kitchens, baths, basements, additions, and whole-home renovations across Greater
            Cincinnati and Northern Kentucky.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Why we exist</h2>
          <p className="mt-4 text-[--color-brand-darkgray]">
            The remodeling industry runs on opacity — vague quotes, scope creep, and
            silence between walkthroughs. We built Codex Homes around a simple thesis:
            homeowners deserve to know what&apos;s happening in their home, what it costs,
            and what comes next, every day of the project.
          </p>
          <p className="mt-4 text-[--color-brand-darkgray]">
            That&apos;s why we publish price ranges. Why we put a Designer Tool on our home
            page. Why every project gets a single lead, a daily photo log, and a written
            schedule. We&apos;d rather lose the job at the consult than surprise you at the
            invoice.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl tracking-tight">By the numbers</h2>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            {[
              ["200+", "Cincinnati homes transformed"],
              ["15 yrs", "Building in Greater Cincinnati"],
              ["1 yr", "Workmanship warranty (5 yr on tile & plumbing)"],
              ["98%", "On-time within 2 weeks of contracted finish"],
            ].map(([n, label]) => (
              <div key={label} className="rounded-xl border border-[--color-border] bg-white p-5">
                <dt className="font-display text-3xl text-[--color-primary]">{n}</dt>
                <dd className="mt-2 text-sm text-[--color-brand-darkgray]">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-[--color-primary] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Come see what a Codex remodel feels like.
            </h2>
            <p className="mt-2 text-white/80">
              Free in-home consult. Try the Designer Tool first if you like.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/designer">Open the Designer Tool</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link href="/get-estimate">
                Book a consult
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
