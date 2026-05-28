import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { ServicesList } from "@/components/home/services-list";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CinematicImage } from "@/components/motion/cinematic-image";
import { ExpandImage } from "@/components/motion/expand-image";

const stats = [
  { value: "200+", label: "Cincinnati residences reimagined" },
  { value: "4.9", label: "Rated across Google & Houzz" },
  { value: "20 yrs", label: "Of craft in Greater Cincinnati" },
];

const process = [
  {
    n: "01",
    title: "Consultation",
    body: "We begin in your home — listening, measuring, and understanding how you live long before a single line is drawn.",
  },
  {
    n: "02",
    title: "Design & selections",
    body: "Plans, elevations, and a curated palette of materials. We refine until the vision is exact — and so is the fixed price.",
  },
  {
    n: "03",
    title: "The build",
    body: "One dedicated project lead, a private client portal, and weekly walk-throughs. Master trades, quietly orchestrated.",
  },
  {
    n: "04",
    title: "The reveal",
    body: "Every detail closed before the final invoice. A lasting workmanship warranty, and a home made to be lived in for decades.",
  },
];

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="brass-tick" />
      <span className="text-[var(--color-stone)]">{index}</span>
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[var(--color-background)]">
      <Hero />

      {/* Intro statement */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal as="p" className="eyebrow mb-10 text-[var(--color-brass)]">
          <Eyebrow index="(01)">The atelier</Eyebrow>
        </Reveal>
        <Reveal>
          <p className="max-w-5xl text-balance font-display text-[clamp(1.9rem,4.6vw,4rem)] font-light leading-[1.08] tracking-tight text-[var(--color-foreground)]">
            Codex Homes is a Cincinnati atelier for those who believe a home
            should be made with the same care it&apos;s lived in.{" "}
            <span className="text-[var(--color-stone)]">
              We design, price, and build kitchens, baths, and whole residences
              with a craftsmanship — and a candor — you can feel from the first
              drawing to the last walkthrough.
            </span>
          </p>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-20 grid grid-cols-1 gap-10 border-t border-[var(--color-border)] pt-12 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-5xl font-light text-[var(--color-brass)] lg:text-6xl">
                {s.value}
              </p>
              <p className="mt-3 text-sm text-[var(--color-stone)]">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Expanding image showcase */}
      <section className="grain relative overflow-hidden bg-[var(--color-ink)] py-24 text-[var(--color-cream)] lg:py-32">
        <div className="atelier-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Reveal className="mb-14 flex flex-col gap-4 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight">
              The detail <span className="italic text-[var(--color-brass-soft)]">is</span>{" "}
              the design.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--color-cream)]/55">
              Every reveal, miter, and transition is drawn before demolition
              begins. What you approve at the table is what we hand you at the
              door.
            </p>
          </Reveal>
        </div>
        <ExpandImage
          src="/portfolio/portfolio-2.webp"
          alt="A bright, custom white-oak kitchen renovated by Codex Homes"
          sizes="100vw"
        />
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal className="mb-14 flex flex-col gap-4 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6 text-[var(--color-brass)]">
              <Eyebrow index="(02)">The work</Eyebrow>
            </p>
            <h2 className="max-w-xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
              Crafted for how Cincinnati lives.
            </h2>
          </div>
          <Link
            href="/services"
            data-cursor
            className="link-underline self-start text-sm uppercase tracking-[0.2em] text-[var(--color-brass)] lg:self-end"
          >
            All services
          </Link>
        </Reveal>

        <ServicesList />
      </section>

      {/* Designer tool feature — layered visuals + parallax */}
      <section className="relative overflow-hidden bg-[var(--color-ink-soft)] py-28 text-[var(--color-cream)] lg:py-40">
        <div className="atelier-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:px-12">
          <div className="relative h-[440px] sm:h-[560px] lg:h-[640px]">
            <Parallax speed={0.3} className="absolute left-0 top-0 h-[72%] w-[68%]">
              <CinematicImage
                src="/portfolio/portfolio-3.webp"
                alt="A walk-in tiled shower renovation by Codex Homes"
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
                alt="A finished primary bath with hand-glazed tile by Codex Homes"
                className="h-full w-full rounded-lg shadow-2xl"
                sizes="(max-width: 1024px) 50vw, 26vw"
              />
            </Parallax>
            <div className="absolute right-2 top-6 z-10 hidden rounded-lg border border-[var(--color-brass-soft)]/25 bg-[#15110c]/40 p-5 backdrop-blur-md sm:block">
              {[
                ["Cabinetry", "Rift-cut White Oak"],
                ["Stone", "Calacatta Viola"],
                ["Tile", "Zellige · Hand-glazed"],
              ].map(([k, v]) => (
                <div key={k} className="mb-3 last:mb-0">
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-[var(--color-brass-soft)]">
                    {k}
                  </p>
                  <p className="font-display text-base text-[var(--color-cream)]">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Reveal as="p" className="eyebrow mb-6 text-[var(--color-brass-soft)]">
              The Codex Atelier
            </Reveal>
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-tight">
                See your home, before the{" "}
                <span className="italic text-[var(--color-brass-soft)]">
                  first hammer.
                </span>
              </h2>
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-7 max-w-md text-[var(--color-cream)]/65">
              Share a few photographs of your kitchen or bath. Compose cabinetry,
              stone, tile, and fixtures — and watch the design, and a precise
              Cincinnati investment range, resolve in real time.
            </Reveal>
            <Reveal stagger={0.1} className="mt-9 space-y-4 text-sm text-[var(--color-cream)]/70">
              {[
                "Dimensions read directly from your photographs",
                "Genuine selections from the houses we source",
                "Live materials and installed investment ranges",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-center gap-3 border-b border-[var(--color-cream)]/10 pb-4"
                >
                  <span className="text-[var(--color-brass-soft)]">—</span>
                  {line}
                </div>
              ))}
            </Reveal>
            <Reveal className="mt-10">
              <Link
                href="/designer"
                data-cursor
                className="inline-block rounded-full bg-[#f6f0e6] px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brass-soft)]"
              >
                Enter the studio
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Portfolio gallery — parallax columns */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <Reveal className="mb-16 lg:mb-24">
          <p className="eyebrow mb-6 text-[var(--color-brass)]">
            <Eyebrow index="(03)">Selected work</Eyebrow>
          </p>
          <h2 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
            Considered homes. Honest numbers.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="md:mt-24">
            <CinematicImage
              src="/portfolio/portfolio-2.webp"
              alt="White-oak kitchen renovation in Hyde Park, Cincinnati"
              className="aspect-[4/5] w-full rounded-lg"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <Reveal className="mt-5 flex items-center justify-between">
              <p className="font-display text-xl">Hyde Park Kitchen</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-stone)]">
                $55k – $110k
              </p>
            </Reveal>
          </div>
          <div>
            <CinematicImage
              src="/portfolio/portfolio-3.webp"
              alt="Primary bath renovation in Oakley, Cincinnati"
              className="aspect-[4/5] w-full rounded-lg"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <Reveal className="mt-5 flex items-center justify-between">
              <p className="font-display text-xl">Oakley Primary Bath</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-stone)]">
                $35k – $75k
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-16 text-center">
          <Link
            href="/portfolio"
            data-cursor
            className="inline-block rounded-full border border-[var(--color-brass)] px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-brass)] transition-colors hover:bg-[var(--color-brass)] hover:text-[var(--color-primary-foreground)]"
          >
            View full portfolio
          </Link>
        </Reveal>
      </section>

      {/* Process */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-muted)] py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Reveal className="mb-16 lg:mb-24">
            <p className="eyebrow mb-6 text-[var(--color-brass)]">
              <Eyebrow index="(04)">The process</Eyebrow>
            </p>
            <h2 className="max-w-3xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
              Composed from the first visit.
            </h2>
          </Reveal>

          <Reveal
            stagger={0.12}
            className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4"
          >
            {process.map((step) => (
              <div
                key={step.n}
                className="flex flex-col bg-[var(--color-card)] p-8 lg:p-10"
              >
                <span className="font-display text-4xl font-light text-[var(--color-brass)]">
                  {step.n}
                </span>
                <span className="mt-6 h-px w-10 bg-[var(--color-brass)]/40" />
                <h3 className="mt-6 font-display text-2xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone)]">
                  {step.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
        <Reveal className="mb-12 flex justify-center">
          <span className="gold-rule max-w-[120px]" />
        </Reveal>
        <Reveal>
          <blockquote className="mx-auto max-w-5xl text-balance text-center font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-light italic leading-[1.12] tracking-tight">
            “They handed us a price before demolition and never moved it. We
            watched the entire build from our phones. It is the calmest, most
            considered renovation we could have imagined.”
          </blockquote>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-stone)]">
            The Harmons · Hyde Park whole-home
          </p>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="grain relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-cream)]">
        <Parallax speed={0.25} className="absolute inset-0">
          <Image
            src="/portfolio/portfolio-4.webp"
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-35"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-[#15110c]/90 to-[#15110c]/40" />
        <div className="relative mx-auto flex min-h-[80svh] max-w-[1400px] flex-col items-center justify-center px-5 py-32 text-center sm:px-8 lg:px-12">
          <Reveal as="p" className="eyebrow mb-8 text-[var(--color-brass-soft)]">
            By private consultation
          </Reveal>
          <Reveal>
            <h2 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1.0] tracking-tight">
              Let&apos;s make something{" "}
              <span className="italic text-[var(--color-brass-soft)]">
                worth passing down.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/get-estimate"
              data-cursor
              className="rounded-full bg-[#f6f0e6] px-9 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brass-soft)]"
            >
              Request a consultation
            </Link>
            <Link
              href="/designer"
              data-cursor
              className="rounded-full border border-[#f6f0e6]/40 px-9 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-[#f6f0e6] transition-colors hover:border-[var(--color-brass-soft)] hover:text-[var(--color-brass-soft)]"
            >
              Visualize your home
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
