import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrencyRange } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/motion/cinematic-image";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Recent Cincinnati kitchen, bath, basement, and whole-home remodels by Codex Homes.",
};

export const dynamic = "force-dynamic";

const budgetRanges: Record<string, [number, number]> = {
  "under-15k": [5000, 15000],
  "15-35k": [15000, 35000],
  "35-75k": [35000, 75000],
  "75-150k": [75000, 150000],
  "150-300k": [150000, 300000],
  "300k-plus": [300000, 750000],
  unsure: [0, 0],
};

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  meta: string;
  budget: string | null;
  href?: string;
}

const fallbackProjects: GalleryItem[] = [
  {
    id: "f1",
    title: "Hyde Park Kitchen",
    image: "/portfolio/portfolio-2.webp",
    meta: "Hyde Park · 2024",
    budget: formatCurrencyRange(55000, 110000),
  },
  {
    id: "f2",
    title: "Oakley Primary Bath",
    image: "/portfolio/portfolio-3.webp",
    meta: "Oakley · 2024",
    budget: formatCurrencyRange(35000, 75000),
  },
  {
    id: "f3",
    title: "Mt. Lookout Galley",
    image: "/portfolio/portfolio-4.webp",
    meta: "Mt. Lookout · 2023",
    budget: formatCurrencyRange(45000, 90000),
  },
  {
    id: "f4",
    title: "Norwood Guest Bath",
    image: "/portfolio/portfolio-1.webp",
    meta: "Norwood · 2023",
    budget: formatCurrencyRange(15000, 35000),
  },
];

const galleryImages = [
  "/showcase/showcase-01.webp",
  "/showcase/showcase-02.webp",
  "/showcase/showcase-03.webp",
  "/showcase/showcase-04.webp",
  "/showcase/showcase-05.webp",
  "/showcase/showcase-06.webp",
  "/showcase/showcase-07.webp",
  "/showcase/showcase-08.webp",
  "/showcase/showcase-09.webp",
  "/showcase/showcase-10.webp",
  "/showcase/showcase-11.webp",
  "/showcase/showcase-12.webp",
];

async function loadProjects(): Promise<GalleryItem[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return fallbackProjects;

    return data.map((p, i) => {
      const range = budgetRanges[p.budget_band];
      return {
        id: p.id ?? `p${i}`,
        title: p.title,
        image: p.hero_image || fallbackProjects[i % fallbackProjects.length].image,
        meta: `${p.neighborhood || "Cincinnati"} · ${p.year ?? "—"}`,
        budget: range && range[0] > 0 ? formatCurrencyRange(range[0], range[1]) : null,
        href: p.slug ? `/portfolio/${p.slug}` : undefined,
      };
    });
  } catch {
    return fallbackProjects;
  }
}

function PortfolioCard({ item }: { item: GalleryItem }) {
  const inner = (
    <>
      <CinematicImage
        src={item.image}
        alt={item.title}
        className="aspect-[4/5] w-full rounded-lg"
        imageClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 45vw"
      />
      <div className="mt-6 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-brand-darkgray)]">
            {item.meta}
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight transition-colors group-hover:text-[var(--color-brand-darkblue)] lg:text-3xl">
            {item.title}
          </h2>
        </div>
        {item.budget && (
          <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-[var(--color-brand-darkblue)]">
            {item.budget}
          </span>
        )}
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} data-cursor className="group block">
        {inner}
      </Link>
    );
  }
  return <div className="group block">{inner}</div>;
}

export default async function PortfolioPage() {
  const projects = await loadProjects();

  return (
    <div className="bg-[var(--color-background)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
          <Reveal as="p" className="eyebrow mb-8 text-[var(--color-brand-darkblue)]">
            <span className="text-[var(--color-brand-darkgray)]">(03)</span>
            &nbsp;&nbsp;Selected work
          </Reveal>
          <Reveal>
            <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1.0] tracking-tight">
              Real Cincinnati homes. Real numbers.
            </h1>
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-brand-darkgray)]">
            Every project shows the neighborhood, the actual scope, the time it
            took, and the budget range. No staged renders, no stock photography.
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} className={i % 2 === 1 ? "md:mt-24" : undefined}>
              <PortfolioCard item={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recently completed — curated gallery */}
      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal as="p" className="eyebrow mb-6 text-[var(--color-brand-darkblue)]">
            <span className="text-[var(--color-brand-darkgray)]">(04)</span>
            &nbsp;&nbsp;Recently completed
          </Reveal>
          <Reveal as="h2" className="mb-14 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-tight lg:mb-20">
            A few rooms we&apos;ve finished lately.
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {galleryImages.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 0.06}>
                <CinematicImage
                  src={src}
                  alt="A completed Codex Homes remodel in Greater Cincinnati"
                  className="aspect-[4/3] w-full rounded-lg"
                  imageClassName="transition-transform duration-[1.2s] ease-out hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-ink)] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-28">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
              Your home could be next.
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              Free in-home estimates across Greater Cincinnati and Northern
              Kentucky.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/get-estimate"
              data-cursor
              className="rounded-full bg-white px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-paleblue)]"
            >
              Book a free estimate
            </Link>
            <Link
              href="/designer"
              data-cursor
              className="rounded-full border border-white/40 px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Try the Design Studio
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
