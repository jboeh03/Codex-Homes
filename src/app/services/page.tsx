import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/lib/services";
import { serviceImage } from "@/lib/service-images";
import { formatCurrencyRange } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/motion/cinematic-image";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Kitchen, bath, basement, whole-home, additions, outdoor living, and handyman work across Greater Cincinnati.",
};

export default function ServicesIndexPage() {
  return (
    <div className="bg-[var(--color-background)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
          <Reveal as="p" className="eyebrow mb-8 text-[var(--color-brand-darkblue)]">
            <span className="text-[var(--color-brand-darkgray)]">(01)</span>
            &nbsp;&nbsp;Services
          </Reveal>
          <Reveal>
            <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1.0] tracking-tight">
              Every part of the house. One Cincinnati team.
            </h1>
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-brand-darkgray)]">
            Browse by room or by scope. Every service includes a free in-home
            assessment and a written, fixed-scope quote — no surprises between
            the consult and the invoice.
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 2) * 0.08}>
              <Link href={`/services/${service.slug}`} data-cursor className="group block">
                <CinematicImage
                  src={serviceImage[service.slug]}
                  alt={service.title}
                  className="aspect-[16/10] w-full rounded-lg"
                  imageClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h2 className="font-display text-3xl tracking-tight transition-colors group-hover:text-[var(--color-brand-darkblue)] lg:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-brand-darkgray)]">
                      {service.blurb}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-brand-darkgray)]">
                  <span>
                    {formatCurrencyRange(service.priceRange[0], service.priceRange[1])}
                  </span>
                  <span>
                    {service.durationWeeks[0]}–{service.durationWeeks[1]} weeks
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}

function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-28">
        <Reveal>
          <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
            Not sure where to start?
          </h2>
          <p className="mt-4 max-w-md text-white/65">
            Try the Design Studio, or book a free in-home estimate and we&apos;ll
            walk the scope with you.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href="/designer"
            data-cursor
            className="rounded-full bg-white px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-paleblue)]"
          >
            Enter the Design Studio
          </Link>
          <Link
            href="/get-estimate"
            data-cursor
            className="rounded-full border border-white/40 px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
          >
            Free estimate
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
