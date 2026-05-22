import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("portfolio_projects")
    .select("title, summary")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return { title: "Portfolio" };
  return { title: data.title, description: data.summary };
}

export default async function PortfolioProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) notFound();

  const gallery = Array.isArray(data.gallery) ? (data.gallery as unknown[]) : [];

  return (
    <div>
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/portfolio" className="text-sm text-[--color-primary] hover:underline">
            ← All projects
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.15em] text-[--color-brand-darkgray]">
            {data.neighborhood || "Cincinnati"} · {data.year ?? "—"} ·{" "}
            {data.duration_weeks ? `${data.duration_weeks} weeks` : "—"}
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-tight text-[--color-brand-black] sm:text-6xl">
            {data.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[--color-brand-darkgray]">{data.summary}</p>
        </div>
      </section>

      {data.hero_image && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div
            className="aspect-[16/9] w-full rounded-xl bg-[--color-muted]"
            style={{ background: `center/cover no-repeat url(${data.hero_image})` }}
          />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {data.body.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4 text-[--color-brand-darkgray]">
            {para}
          </p>
        ))}
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((src, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-lg bg-[--color-muted]"
                style={{ background: `center/cover no-repeat url(${String(src)})` }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="bg-[--color-primary] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Like the look? Try it in your room.
            </h2>
            <p className="mt-2 text-white/80">
              Use the Designer Tool to test these finishes in your own space — and see the range.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/designer">
              Open the Designer Tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
