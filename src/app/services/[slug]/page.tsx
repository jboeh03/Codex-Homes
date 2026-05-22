import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findService, services, type ServiceSlug } from "@/lib/services";
import { formatCurrencyRange } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return { title: "Services" };
  return {
    title: service.title,
    description: service.blurb,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = findService(slug as ServiceSlug);
  if (!service) notFound();

  return (
    <div>
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/services" className="text-sm text-[--color-primary] hover:underline">
            ← All services
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
            {service.shortTitle} in Cincinnati
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-tight text-[--color-brand-black] sm:text-6xl">
            {service.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[--color-brand-darkgray]">
            {service.longBlurb}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[--color-secondary] px-3 py-1 text-sm font-medium text-[--color-primary]">
              Typical range · {formatCurrencyRange(service.priceRange[0], service.priceRange[1])}
            </span>
            <span className="rounded-full border border-[--color-border] bg-white px-3 py-1 text-sm text-[--color-brand-darkgray]">
              {service.durationWeeks[0]}–{service.durationWeeks[1]} weeks
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/get-estimate">
                Get a free in-home estimate
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/designer">Design it yourself first</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-[--color-brand-black]">
              What&apos;s included
            </h2>
            <ul className="mt-6 space-y-3">
              {service.scope.map((line) => (
                <li key={line} className="flex items-start gap-2 text-[--color-brand-darkgray]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[--color-primary]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-tight text-[--color-brand-black]">
              Highlights
            </h2>
            <ul className="mt-6 space-y-3">
              {service.highlights.map((line) => (
                <li key={line} className="flex items-start gap-2 text-[--color-brand-darkgray]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[--color-primary]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[--color-primary] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Ready to talk through your {service.shortTitle.toLowerCase()} project?
            </h2>
            <p className="mt-2 text-white/80">
              No-pressure consult, walked-through scope, written quote.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/get-estimate">Book a free estimate</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
