import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrencyRange } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Recent Cincinnati kitchen, bath, basement, and whole-home remodels by Codex Homes.",
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

export default async function PortfolioPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  const projects = error ? [] : (data ?? []);

  return (
    <div>
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
            Portfolio
          </p>
          <h1 className="font-display text-5xl tracking-tight text-[--color-brand-black] sm:text-6xl">
            Real Cincinnati homes. Real numbers.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[--color-brand-darkgray]">
            Every project below shows the neighborhood, the actual scope, the time it took,
            and the budget range. No staged renders, no stock photography.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <p className="rounded-md border border-[--color-border] bg-white p-8 text-center text-[--color-brand-darkgray]">
            Portfolio coming soon. Photos in editing.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const [lo, hi] = budgetRanges[p.budget_band] ?? [0, 0];
              return (
                <Card key={p.id}>
                  <CardContent className="p-0">
                    <div
                      className="aspect-[4/3] w-full rounded-t-xl bg-[--color-muted]"
                      style={
                        p.hero_image
                          ? { background: `center/cover no-repeat url(${p.hero_image})` }
                          : undefined
                      }
                    />
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.15em] text-[--color-brand-darkgray]">
                        {p.neighborhood || "Cincinnati"} · {p.year ?? "—"}
                      </p>
                      <h2 className="mt-1 font-display text-xl">{p.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm text-[--color-brand-darkgray]">
                        {p.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-[--color-brand-darkgray]">
                          {lo > 0 ? formatCurrencyRange(lo, hi) : "Budget on request"}
                        </span>
                        <Link
                          href={`/portfolio/${p.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[--color-primary] hover:underline"
                        >
                          See project
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
