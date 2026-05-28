import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/motion/reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function loadProject(slug: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadProject(slug);
  if (!data) return { title: "Portfolio" };
  return { title: data.title, description: data.summary };
}

export default async function PortfolioProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await loadProject(slug);
  if (!data) notFound();

  const gallery = Array.isArray(data.gallery) ? (data.gallery as unknown[]) : [];

  return (
    <div className="bg-[var(--color-background)]">
      <section className="mx-auto max-w-[1400px] px-5 pb-12 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <Reveal as="div">
          <Link
            href="/portfolio"
            data-cursor
            className="link-underline text-xs uppercase tracking-[0.2em] text-[var(--color-brand-darkblue)]"
          >
            ← All projects
          </Link>
        </Reveal>
        <Reveal as="p" className="mb-6 mt-10 text-xs uppercase tracking-[0.18em] text-[var(--color-brand-darkgray)]">
          {data.neighborhood || "Cincinnati"} · {data.year ?? "—"} ·{" "}
          {data.duration_weeks ? `${data.duration_weeks} weeks` : "—"}
        </Reveal>
        <Reveal>
          <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1.0] tracking-tight">
            {data.title}
          </h1>
        </Reveal>
        <Reveal as="p" delay={0.05} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-brand-darkgray)]">
          {data.summary}
        </Reveal>
      </section>

      {data.hero_image && (
        <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div
            className="aspect-[16/9] w-full rounded-xl bg-[var(--color-muted)]"
            style={{ background: `center/cover no-repeat url(${data.hero_image})` }}
          />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {data.body.split("\n\n").map((para, i) => (
          <Reveal as="p" key={i} className="mb-6 text-lg leading-relaxed text-[var(--color-brand-darkgray)]">
            {para}
          </Reveal>
        ))}
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((src, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-lg bg-[var(--color-muted)]"
                style={{ background: `center/cover no-repeat url(${String(src)})` }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-[var(--color-ink)] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-28">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
              Like the look? Try it in your room.
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              Use the Designer Tool to test these finishes in your own space — and
              see the range.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href="/designer"
              data-cursor
              className="inline-block rounded-full bg-white px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-paleblue)]"
            >
              Open the Designer Tool
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
