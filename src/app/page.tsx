import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { ServicesList } from "@/components/home/services-list";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CinematicImage } from "@/components/motion/cinematic-image";
import { ExpandImage } from "@/components/motion/expand-image";

const stats = [
  { value: "200+", label: "Cincinnati homes transformed" },
  { value: "4.9", label: "Across Google & Houzz" },
  { value: "20yr", label: "Building in Greater Cincinnati" },
];

const process = [
  {
    n: "01",
    title: "Design intake",
    body: "Use the Designer Tool or book a quiet in-home visit. We listen, measure, and tell you what's truly possible.",
  },
  {
    n: "02",
    title: "Fixed-scope quote",
    body: "Detailed line items, honest allowances, a written timeline. The price doesn't move unless the scope does.",
  },
  {
    n: "03",
    title: "Build with a portal",
    body: "Daily photos, weekly walk-throughs, one project lead. You always know the status — without chasing us.",
  },
  {
    n: "04",
    title: "Walkthrough & warranty",
    body: "Final punch list closed before invoice. One-year workmanship warranty, five on plumbing and tile.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[--color-background]">
      <Hero />

      {/* Intro statement */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal as="p" className="eyebrow mb-10 text-[--color-brand-darkblue]">
          <span className="text-[--color-brand-darkgray]">(01)</span>&nbsp;&nbsp;The
          studio
        </Reveal>
        <Reveal>
          <p className="max-w-5xl text-balance font-display text-[clamp(1.9rem,4.6vw,4rem)] font-light leading-[1.08] tracking-tight text-[--color-foreground]">
            Codex Homes is a Cincinnati building studio for people who care how a
            space is made — not just how it looks.{" "}
            <span className="text-[--color-brand-darkgray]">
              We design, price, and build kitchens, baths, and whole homes with a
              process you can read from the first week to the last walkthrough.
            </span>
          </p>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-20 grid grid-cols-1 gap-10 border-t border-[--color-border] pt-12 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-5xl font-light text-[--color-brand-darkblue] lg:text-6xl">
                {s.value}
              </p>
              <p className="mt-3 text-sm text-[--color-brand-darkgray]">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Expanding image showcase */}
      <section className="grain relative overflow-hidden bg-[--color-ink] py-24 text-white lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Reveal className="mb-14 flex flex-col gap-4 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight">
              The detail is the design.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Every line, reveal, and transition is drawn before demo begins.
              What you see at the consult is what gets built.
            </p>
          </Reveal>
        </div>
        <ExpandImage
          src="/portfolio/portfolio-2.webp"
          alt="A bright, custom white kitchen remodeled by Codex Homes"
          sizes="100vw"
        />
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal className="mb-14 flex flex-col gap-4 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6 text-[--color-brand-darkblue]">
              <span className="text-[--color-brand-darkgray]">(02)</span>
              &nbsp;&nbsp;What we build
            </p>
            <h2 className="max-w-xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
              Built for how Cincinnati lives.
            </h2>
          </div>
          <Link
            href="/services"
            data-cursor
            className="link-underline self-start text-sm uppercase tracking-[0.2em] text-[--color-brand-darkblue] lg:self-end"
          >
            All services
          </Link>
        </Reveal>

        <ServicesList />
      </section>

      {/* Designer tool feature — layered visuals + parallax */}
      <section className="relative overflow-hidden bg-[--color-ink-soft] py-28 text-white lg:py-40">
        <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:px-12">
          <div className="relative h-[440px] sm:h-[560px] lg:h-[640px]">
            <Parallax speed={0.3} className="absolute left-0 top-0 h-[72%] w-[68%]">
              <CinematicImage
                src="/portfolio/portfolio-3.webp"
                alt="A walk-in tiled shower remodel by Codex Homes"
                className="h-full w-full rounded-lg"
                sizes="(max-width: 1024px) 60vw, 30vw"
              />
            </Parallax>
            <Parallax
              speed={-0.25}
              className="absolute bottom-0 right-0 h-[62%] w-[58%]"
            >
              <CinematicImage
                src="/portfolio/portfolio-1.webp"
                alt="A finished bathroom remodel with subway tile by Codex Homes"
                className="h-full w-full rounded-lg shadow-2xl"
                sizes="(max-width: 1024px) 50vw, 26vw"
              />
            </Parallax>
            <div className="absolute right-2 top-6 z-10 hidden rounded-lg border border-white/15 bg-white/5 p-5 backdrop-blur-md sm:block">
              {[
                ["Cabinets", "Shaker · White Oak"],
                ["Counters", "Quartz · Calacatta"],
                ["Tile", "Zellige · Pale Blue"],
              ].map(([k, v]) => (
                <div key={k} className="mb-3 last:mb-0">
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50">
                    {k}
                  </p>
                  <p className="font-display text-base">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Reveal as="p" className="eyebrow mb-6 text-[--color-brand-paleblue]">
              The Codex Designer
            </Reveal>
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-tight">
                See your remodel in your{" "}
                <span className="italic text-white/80">actual room.</span>
              </h2>
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-7 max-w-md text-white/65">
              Upload a few photos of your kitchen or bath. Swap cabinets,
              counters, tile, and fixtures — and watch the design, and a real
              Cincinnati price range, update live.
            </Reveal>
            <Reveal
              stagger={0.1}
              className="mt-9 space-y-4 text-sm text-white/70"
            >
              {[
                "Auto-measured dimensions from your photos",
                "Real SKUs from the suppliers we buy from",
                "Live materials + installed price ranges",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-center gap-3 border-b border-white/10 pb-4"
                >
                  <span className="text-[--color-brand-paleblue]">—</span>
                  {line}
                </div>
              ))}
            </Reveal>
            <Reveal className="mt-10">
              <Link
                href="/designer"
                data-cursor
                className="inline-block rounded-full bg-white px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-[--color-ink] transition-colors hover:bg-[--color-brand-paleblue]"
              >
                Start designing
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Portfolio gallery — parallax columns */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal className="mb-16 lg:mb-24">
          <p className="eyebrow mb-6 text-[--color-brand-darkblue]">
            <span className="text-[--color-brand-darkgray]">(03)</span>
            &nbsp;&nbsp;Selected work
          </p>
          <h2 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
            Real Cincinnati homes. Real numbers.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="md:mt-24">
            <CinematicImage
              src="/portfolio/portfolio-2.webp"
              alt="White kitchen remodel in Cincinnati"
              className="aspect-[4/5] w-full rounded-lg"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <Reveal className="mt-5 flex items-center justify-between">
              <p className="font-display text-xl">Hyde Park Kitchen</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[--color-brand-darkgray]">
                $55k – $110k
              </p>
            </Reveal>
          </div>
          <div>
            <CinematicImage
              src="/portfolio/portfolio-3.webp"
              alt="Walk-in shower remodel in Cincinnati"
              className="aspect-[4/5] w-full rounded-lg"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <Reveal className="mt-5 flex items-center justify-between">
              <p className="font-display text-xl">Oakley Primary Bath</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[--color-brand-darkgray]">
                $35k – $75k
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-16 text-center">
          <Link
            href="/portfolio"
            data-cursor
            className="inline-block rounded-full border border-[--color-brand-darkblue] px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-[--color-brand-darkblue] transition-colors hover:bg-[--color-brand-darkblue] hover:text-white"
          >
            View full portfolio
          </Link>
        </Reveal>
      </section>

      {/* Process */}
      <section className="border-y border-[--color-border] bg-[--color-muted] py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Reveal className="mb-16 lg:mb-24">
            <p className="eyebrow mb-6 text-[--color-brand-darkblue]">
              <span className="text-[--color-brand-darkgray]">(04)</span>
              &nbsp;&nbsp;The process
            </p>
            <h2 className="max-w-3xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
              Legible from week one.
            </h2>
          </Reveal>

          <Reveal
            stagger={0.12}
            className="grid grid-cols-1 gap-px overflow-hidden border border-[--color-border] bg-[--color-border] sm:grid-cols-2 lg:grid-cols-4"
          >
            {process.map((step) => (
              <div
                key={step.n}
                className="flex flex-col bg-[--color-background] p-8 lg:p-10"
              >
                <span className="font-display text-4xl font-light text-[--color-brand-lightgray]">
                  {step.n}
                </span>
                <h3 className="mt-8 font-display text-2xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[--color-brand-darkgray]">
                  {step.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
        <Reveal>
          <blockquote className="mx-auto max-w-5xl text-balance text-center font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-light leading-[1.12] tracking-tight">
            “They handed us a price before demo and never moved it. We watched the
            whole build from our phones. It is the calmest renovation we could have
            imagined.”
          </blockquote>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[--color-brand-darkgray]">
            The Harmons · Hyde Park whole-home
          </p>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="grain relative overflow-hidden bg-[--color-ink] text-white">
        <Parallax speed={0.25} className="absolute inset-0">
          <Image
            src="/portfolio/portfolio-4.webp"
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-40"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
        <div className="relative mx-auto flex min-h-[80svh] max-w-[1400px] flex-col items-center justify-center px-5 py-32 text-center sm:px-8 lg:px-12">
          <Reveal as="p" className="eyebrow mb-8 text-white/60">
            Free in-home estimates
          </Reveal>
          <Reveal>
            <h2 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1.0] tracking-tight">
              Let&apos;s build something{" "}
              <span className="italic">worth keeping.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/designer"
              data-cursor
              className="rounded-full bg-white px-9 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-[--color-ink] transition-colors hover:bg-[--color-brand-paleblue]"
            >
              Try the Designer
            </Link>
            <Link
              href="/get-estimate"
              data-cursor
              className="rounded-full border border-white/40 px-9 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Book a free estimate
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
