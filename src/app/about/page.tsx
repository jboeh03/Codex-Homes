import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CinematicImage } from "@/components/motion/cinematic-image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Codex Homes is a Cincinnati custom builder and remodeler — locally owned, fully licensed, and obsessed with making remodels legible.",
};

const numbers = [
  ["200+", "Cincinnati homes transformed"],
  ["15 yrs", "Building in Greater Cincinnati"],
  ["1 yr", "Workmanship warranty (5 yr on tile & plumbing)"],
  ["98%", "On time, within 2 weeks of contracted finish"],
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-background)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
          <Reveal as="p" className="eyebrow mb-8 text-[var(--color-brand-darkblue)]">
            About Codex Homes
          </Reveal>
          <Reveal>
            <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1.0] tracking-tight">
              A Cincinnati builder, built around clarity.
            </h1>
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-brand-darkgray)]">
            We&apos;re a small, employee-owned custom builder and remodeler —
            kitchens, baths, basements, additions, and whole-home renovations
            across Greater Cincinnati and Northern Kentucky.
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative h-[440px] sm:h-[560px]">
            <Parallax speed={0.25} className="absolute left-0 top-0 h-[70%] w-[66%]">
              <CinematicImage
                src="/portfolio/portfolio-4.webp"
                alt="A Codex Homes kitchen remodel in Cincinnati"
                className="h-full w-full rounded-lg"
                sizes="(max-width: 1024px) 60vw, 30vw"
              />
            </Parallax>
            <Parallax speed={-0.2} className="absolute bottom-0 right-0 h-[60%] w-[56%]">
              <CinematicImage
                src="/portfolio/portfolio-1.webp"
                alt="A finished bathroom remodel by Codex Homes"
                className="h-full w-full rounded-lg shadow-2xl"
                sizes="(max-width: 1024px) 50vw, 26vw"
              />
            </Parallax>
          </div>

          <div>
            <Reveal as="p" className="eyebrow mb-6 text-[var(--color-brand-darkblue)]">
              Why we exist
            </Reveal>
            <Reveal>
              <p className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-light leading-[1.18] tracking-tight">
                The remodeling industry runs on opacity — vague quotes, scope
                creep, and silence between walkthroughs.
              </p>
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 leading-relaxed text-[var(--color-brand-darkgray)]">
              We built Codex Homes around a simple thesis: homeowners deserve to
              know what&apos;s happening in their home, what it costs, and what
              comes next — every day of the project.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-4 leading-relaxed text-[var(--color-brand-darkgray)]">
              That&apos;s why we publish price ranges. Why we put a Designer Tool
              on our home page. Why every project gets a single lead, a daily
              photo log, and a written schedule. We&apos;d rather lose the job at
              the consult than surprise you at the invoice.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-muted)] py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Reveal as="h2" className="mb-14 font-display text-[clamp(1.8rem,4vw,3rem)] font-light tracking-tight">
            By the numbers
          </Reveal>
          <Reveal
            stagger={0.1}
            className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4"
          >
            {numbers.map(([n, label]) => (
              <div key={label} className="bg-[var(--color-background)] p-8 lg:p-10">
                <p className="font-display text-5xl font-light text-[var(--color-brand-darkblue)] lg:text-6xl">
                  {n}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-brand-darkgray)]">
                  {label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-ink)] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-28">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
              Come see what a Codex remodel feels like.
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              Free in-home consult. Try the Designer Tool first if you like.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/designer"
              data-cursor
              className="rounded-full bg-white px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-paleblue)]"
            >
              Open the Designer
            </Link>
            <Link
              href="/get-estimate"
              data-cursor
              className="rounded-full border border-white/40 px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Book a consult
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
