import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Hammer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrustStrip } from "@/components/site/trust-strip";
import { services } from "@/lib/services";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint opacity-90" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
              Cincinnati custom building &amp; remodeling
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-[--color-brand-black] sm:text-6xl lg:text-7xl">
              Cincinnati remodels,{" "}
              <span className="text-[--color-primary]">decoded.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[--color-brand-darkgray] sm:text-xl">
              Upload a photo of your room. Pick the finishes you love. See your
              remodel — and a real price range — before you ever schedule a consult.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/designer">
                  Try the Designer Tool
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/get-estimate">Get a Free In-Home Estimate</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm text-[--color-brand-darkgray]">
              Locally owned. Licensed and insured. 200+ Cincinnati homes transformed.
            </p>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
              What we do
            </p>
            <h2 className="font-display text-4xl tracking-tight text-[--color-brand-black] sm:text-5xl">
              Built for how Cincinnati families live.
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden text-sm font-medium text-[--color-primary] hover:underline md:inline"
          >
            All services →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <Card key={service.slug} className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm text-[--color-brand-darkgray]">
                  {service.blurb}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[--color-primary] hover:underline"
                >
                  See scope &amp; price range
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Designer Tool teaser */}
      <section className="bg-[--color-brand-black] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-brand-paleblue]">
              The Codex Designer Tool
            </p>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              See your remodel in your actual room.
            </h2>
            <p className="mt-5 max-w-xl text-white/80">
              Snap a few photos of your kitchen or bath. We measure the space, you swap
              cabinets, counters, tile, and fixtures — and watch the design (and the
              real Cincinnati price range) update live.
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              {[
                "Auto-measured dimensions from your photos",
                "Real SKUs from the suppliers we actually buy from",
                "Live materials + installed price ranges",
                "Save your design — bring it to the consult",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[--color-brand-paleblue]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary">
                <Link href="/designer">
                  Start designing
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] w-full rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="grid h-full grid-cols-2 gap-3">
              {[
                ["Cabinets", "Shaker · White Oak"],
                ["Counters", "Quartz · Calacatta"],
                ["Backsplash", "Zellige · Pale Blue"],
                ["Floor", "LVP · Wide Plank"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-white/60">{label}</p>
                  <p className="font-display text-lg">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
          The Codex process
        </p>
        <h2 className="font-display text-4xl tracking-tight text-[--color-brand-black] sm:text-5xl">
          Here&apos;s exactly what to expect.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-[--color-brand-darkgray]">
          Remodeling is anxious work. We&apos;ve built a process that&apos;s legible
          from week one — so you know what&apos;s happening, why, and what it
          costs before we lift a hammer.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "01",
              icon: Compass,
              title: "Design intake",
              body: "Use the Designer Tool or book a free in-home visit. We listen, measure, and tell you what's realistic.",
            },
            {
              n: "02",
              icon: Sparkles,
              title: "Fixed-scope quote",
              body: "Detailed line items, real allowances for selections, and a written timeline. Price doesn't move unless scope does.",
            },
            {
              n: "03",
              icon: Hammer,
              title: "Build with a portal",
              body: "Daily photos, weekly walk-throughs, and one project lead. You always know the status — without chasing us.",
            },
            {
              n: "04",
              icon: CheckCircle2,
              title: "Walkthrough & warranty",
              body: "Final punch list closed before invoice. One-year workmanship warranty. Five-year on plumbing and tile.",
            },
          ].map(({ n, icon: Icon, title, body }) => (
            <Card key={n}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl text-[--color-brand-lightgray]">{n}</span>
                  <Icon className="h-5 w-5 text-[--color-primary]" />
                </div>
                <h3 className="mt-4 font-display text-xl">{title}</h3>
                <p className="mt-3 text-sm text-[--color-brand-darkgray]">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[--color-primary] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Ready to see what&apos;s possible?
            </h2>
            <p className="mt-2 text-white/80">
              Free in-home estimates. Designer Tool runs in your browser.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/designer">Try the Designer Tool</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/get-estimate">Book a free estimate</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
