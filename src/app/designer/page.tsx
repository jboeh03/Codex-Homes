import type { Metadata } from "next";
import { Studio } from "@/components/studio/studio";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackMaterials } from "@/lib/studio/fallback-materials";
import type { MaterialRow } from "@/lib/db.types";

export const metadata: Metadata = {
  title: "Design Studio",
  description:
    "Photograph your kitchen or bath, restyle it in real materials, and see an honest Cincinnati installed price range — before anyone visits your home.",
};

export const dynamic = "force-dynamic";

export default async function DesignerPage() {
  let materials: MaterialRow[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("materials")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    materials = data ?? [];
  } catch {
    // Missing config or unreachable project — the built-in catalog covers it.
  }
  if (materials.length === 0) {
    materials = fallbackMaterials;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 lg:pt-36">
      <Studio materials={materials} />
    </div>
  );
}
