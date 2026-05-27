import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findService, services, type ServiceSlug } from "@/lib/services";
import { serviceImage } from "@/lib/service-images";
import { formatCurrencyRange } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/motion/cinematic-image";

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
    <div className="bg-[--color-background]">
      <section className="mx-auto max-w-[1400px] px-5 pb-12 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <Reveal as="div">
          <Link
            href="/services"
            data-cursor
            className="link-underline text-xs uppercase tracking-[0.2em] text-[--color-brand-darkblue]"
          >
            ← All services
          </Link>
        </Reveal>
        <Reveal as="p" className="eyebrow mb-6 mt-10 text-[--color-brand-darkgray]">
          {service.shortTitle} in Cincinnati
        </Reveal>
        <Reveal>
          <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1.0] tracking-tight">
            {service.title}
          </h1>
        </Reveal>
        <Reveal as="p" delay={0.05} className="mt-8 max-w-2xl text-lg leading-relaxed text-[--color-brand-darkgray]">
          {service.longBlurb}
        </Reveal>
        <Reveal delay={0.1} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-[--color-brand-darkgray]">
          <span>
            Typical range ·{" "}
            <span className="text-[--color-brand-darkblue]">
              {formatCurrencyRange(service.priceRange[0], service.priceRange[1])}
            </span>
          </span>
          <span>
            Timeline · {service.durationWeeks[0]}–{service.durationWeeks[1]} weeks
          </span>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <CinematicImage
          src={serviceImage[service.slug]}
          alt={`${service.title} by Codex Homes`}
          className="aspect-[16/9] w-full rounded-xl"
          sizes="(max-width: 1400px) 100vw, 1400px"
        />
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal as="h2" className="font-display text-3xl tracking-tight lg:text-4xl">
              What&apos;s included
            </Reveal>
            <Reveal stagger={0.07} className="mt-8">
              {service.scope.map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-4 border-b border-[--color-border] py-4 text-[--color-brand-darkgray]"
                >
                  <span className="mt-0.5 text-[--color-brand-darkblue]">—</span>
                  <span>{line}</span>
                </div>
              ))}
            </Reveal>
          </div>
          <div>
            <Reveal as="h2" className="font-display text-3xl tracking-tight lg:text-4xl">
              Highlights
            </Reveal>
            <Reveal stagger={0.07} className="mt-8">
              {service.highlights.map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-4 border-b border-[--color-border] py-4 text-[--color-brand-darkgray]"
                >
                  <span className="mt-0.5 text-[--color-brand-darkblue]">—</span>
                  <span>{line}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[--color-ink] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-28">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
              Ready to talk through your{" "}
              {service.shortTitle.toLowerCase()} project?
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              No-pressure consult, walked-through scope, written quote.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/get-estimate"
              data-cursor
              className="rounded-full bg-white px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-[--color-ink] transition-colors hover:bg-[--color-brand-paleblue]"
            >
              Book a free estimate
            </Link>
            <Link
              href="/designer"
              data-cursor
              className="rounded-full border border-white/40 px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Design it yourself first
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
