import type { Metadata } from "next";
import { DesignerTool } from "@/components/designer/designer-tool";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MaterialRow } from "@/lib/db.types";

export const metadata: Metadata = {
  title: "Designer Tool",
  description:
    "Pick cabinets, counters, tile, and fixtures from the suppliers we actually use. See a real Cincinnati installed price range update as you choose.",
};

export const dynamic = "force-dynamic";

export default async function DesignerPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("is_active", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  const materials: MaterialRow[] = error ? [] : (data ?? []);

  return (
    <div className="bg-blueprint">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
            Designer Tool
          </p>
          <h1 className="font-display text-4xl tracking-tight text-[--color-brand-black] sm:text-5xl">
            Design your remodel. See a real price range.
          </h1>
          <p className="mt-3 max-w-2xl text-[--color-brand-darkgray]">
            Pick materials from the suppliers we actually buy from in Cincinnati. The price
            range updates as you change selections and room dimensions. Save it and bring it
            to your free in-home consult.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Couldn&apos;t load the materials catalog: {error.message}
          </div>
        )}

        <DesignerTool materials={materials} />
      </div>
    </div>
  );
}
