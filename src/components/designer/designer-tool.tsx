"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check, Loader2, Save, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency, formatCurrencyRange } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MaterialCategory, MaterialRow, RoomType } from "@/lib/db.types";
import {
  calculateEstimate,
  defaultDimensions,
  designerCategories,
  type RoomDimensions,
  type Selections,
} from "@/lib/designer";

interface Props {
  materials: MaterialRow[];
}

const STORAGE_KEY = "codex-designer-session-id";

export function DesignerTool({ materials }: Props) {
  const [roomType, setRoomType] = useState<RoomType>("kitchen");
  const [dimensions, setDimensions] = useState<RoomDimensions>(defaultDimensions.kitchen);
  const [selections, setSelections] = useState<Selections>(() => pickDefaults(materials));
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>("floor");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [render, setRender] = useState<{
    id: string;
    status: string;
    outputUrl: string;
    error?: string;
    sourcePhotoUrl: string;
    selectionsKey: string;
  } | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstSaveDone = useRef(false);

  // Restore session id from localStorage on mount. Intentionally a client-only
  // post-mount sync (SSR can't read localStorage) — not a state-from-state derivation.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) setSessionId(id);
  }, []);

  function changeRoomType(rt: RoomType) {
    setRoomType(rt);
    setDimensions(defaultDimensions[rt]);
  }

  const byCategory = useMemo(() => {
    const map = new Map<MaterialCategory, MaterialRow[]>();
    for (const m of materials) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category)!.push(m);
    }
    return map;
  }, [materials]);

  const estimate = useMemo(
    () => calculateEstimate(selections, materials, dimensions),
    [selections, materials, dimensions],
  );

  // Debounced autosave
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist();
    }, 1200);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomType, dimensions, selections, estimate.rangeLow, estimate.rangeHigh, photoUrls]);

  async function persist() {
    setSaveState("saving");
    try {
      const payload = {
        roomType,
        dimensions: dimensions as unknown as Record<string, unknown>,
        selections: selections as Record<string, string>,
        estimate: estimate as unknown as Record<string, unknown>,
        photoUrls,
      };
      if (!sessionId) {
        const res = await fetch("/api/designer/sessions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        const { id } = (await res.json()) as { id: string };
        setSessionId(id);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, id);
        }
      } else {
        const res = await fetch(`/api/designer/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setSaveState("saved");
      firstSaveDone.current = true;
    } catch {
      setSaveState("error");
    }
  }

  function updateDim<K extends keyof RoomDimensions>(key: K, value: number) {
    setDimensions((d) => ({ ...d, [key]: value }));
  }

  function selectMaterial(category: MaterialCategory, id: string) {
    setSelections((s) => ({ ...s, [category]: id }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadState("uploading");
    setUploadError(null);
    const supabase = createSupabaseBrowserClient();
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files).slice(0, 6)) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} is over 10 MB`);
        }
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const key = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("designer-uploads")
          .upload(key, file, { cacheControl: "31536000", upsert: false });
        if (error) throw error;
        const { data: pub } = supabase.storage.from("designer-uploads").getPublicUrl(key);
        uploaded.push(pub.publicUrl);
      }
      setPhotoUrls((prev) => [...prev, ...uploaded].slice(0, 12));
      setUploadState("idle");
    } catch (e) {
      setUploadState("error");
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  function removePhoto(url: string) {
    setPhotoUrls((prev) => prev.filter((p) => p !== url));
  }

  // Build a stable client-side key of the inputs that determine a render
  const currentSelectionsKey = useMemo(() => {
    return Object.keys(selections)
      .sort()
      .map((k) => `${k}:${selections[k as MaterialCategory] ?? ""}`)
      .join("|");
  }, [selections]);

  const renderIsStale =
    render &&
    (render.sourcePhotoUrl !== photoUrls[0] ||
      render.selectionsKey !== currentSelectionsKey);

  async function generateAiPreview() {
    setRenderError(null);
    if (!sessionId || photoUrls.length === 0) return;
    // Ensure session exists before we POST
    try {
      const res = await fetch("/api/designer/renders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId,
          photoUrl: photoUrls[0],
          roomType,
          selections,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Render failed (${res.status})`);
      }
      const data = (await res.json()) as {
        id: string;
        status: string;
        outputUrl: string;
      };
      setRender({
        id: data.id,
        status: data.status,
        outputUrl: data.outputUrl,
        sourcePhotoUrl: photoUrls[0],
        selectionsKey: currentSelectionsKey,
      });
    } catch (e) {
      setRenderError(e instanceof Error ? e.message : "Render failed");
    }
  }

  // Poll render status while it's in flight
  useEffect(() => {
    if (!render) return;
    if (render.status !== "starting" && render.status !== "processing") return;
    let cancelled = false;
    const timer = setInterval(async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/designer/renders/${render.id}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          status: string;
          outputUrl: string;
          error?: string;
        };
        if (cancelled) return;
        setRender((prev) =>
          prev && prev.id === render.id
            ? { ...prev, status: data.status, outputUrl: data.outputUrl, error: data.error }
            : prev,
        );
      } catch {
        /* keep polling */
      }
    }, 3000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [render]);

  const activeOptions = byCategory.get(activeCategory) ?? [];
  const activeMeta = designerCategories.find((c) => c.id === activeCategory);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">
      {/* Left: room + categories */}
      <aside className="space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand-darkgray)]">
            Room
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["kitchen", "bathroom", "other"] as RoomType[]).map((rt) => (
              <button
                key={rt}
                type="button"
                onClick={() => changeRoomType(rt)}
                className={cn(
                  "rounded-md border px-2 py-2 text-xs font-medium capitalize transition-colors",
                  roomType === rt
                    ? "border-[var(--color-primary)] bg-[var(--color-secondary)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-white text-[var(--color-brand-darkgray)] hover:bg-[var(--color-muted)]",
                )}
              >
                {rt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand-darkgray)]">
            Categories
          </p>
          <div className="mt-3 space-y-1">
            {designerCategories.map((c) => {
              const selected = selections[c.id];
              const mat = selected ? materials.find((m) => m.id === selected) : null;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    activeCategory === c.id
                      ? "bg-[var(--color-secondary)] text-[var(--color-primary)]"
                      : "hover:bg-[var(--color-muted)]",
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-medium">{c.label}</p>
                    <p className="truncate text-xs text-[var(--color-brand-darkgray)]">
                      {mat ? mat.name : "Not selected"}
                    </p>
                  </div>
                  {mat && (
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border border-black/10 bg-cover bg-center"
                      style={{
                        background: mat.image_url
                          ? `center/cover no-repeat url("${mat.image_url}"), ${mat.color_hex || "#E5E9EC"}`
                          : mat.color_hex || "#E5E9EC",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand-darkgray)]">
            Room dimensions
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <DimField label="Length (ft)" value={dimensions.lengthFt} onChange={(v) => updateDim("lengthFt", v)} />
            <DimField label="Width (ft)" value={dimensions.widthFt} onChange={(v) => updateDim("widthFt", v)} />
            <DimField label="Cabinet run (lf)" value={dimensions.cabinetRunFt} onChange={(v) => updateDim("cabinetRunFt", v)} />
            <DimField label="Counter (sf)" value={dimensions.counterSqFt} onChange={(v) => updateDim("counterSqFt", v)} />
            <DimField label="Backsplash (sf)" value={dimensions.backsplashSqFt} onChange={(v) => updateDim("backsplashSqFt", v)} />
            <DimField label="Fixtures" value={dimensions.fixtureCount} onChange={(v) => updateDim("fixtureCount", v)} />
            <DimField label="Lights" value={dimensions.lightingCount} onChange={(v) => updateDim("lightingCount", v)} />
            <DimField label="Ceiling (ft)" value={dimensions.ceilingFt} onChange={(v) => updateDim("ceilingFt", v)} />
          </div>
          <p className="mt-3 text-xs text-[var(--color-brand-darkgray)]">
            Floor: {(dimensions.lengthFt * dimensions.widthFt).toFixed(0)} sf
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand-darkgray)]">
            Your room photos
          </p>
          <p className="mt-1 text-xs text-[var(--color-brand-darkgray)]">
            Snap or upload up to 12. We&apos;ll use them for the preview and bring them to the consult.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="hidden"
            onChange={(e) => {
              void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            className="mt-3 w-full gap-2"
            disabled={uploadState === "uploading" || photoUrls.length >= 12}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadState === "uploading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" /> Add photos
              </>
            )}
          </Button>
          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}
          {photoUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photoUrls.map((url) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-md border border-[var(--color-border)]">
                  <img src={url} alt="Room" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    aria-label="Remove photo"
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Middle: material picker + room preview */}
      <section className="space-y-6">
        <RoomPreview
          selections={selections}
          materials={materials}
          dimensions={dimensions}
          photoUrls={photoUrls}
          render={render}
          renderError={renderError}
          renderIsStale={!!renderIsStale}
          canGenerate={!!sessionId && photoUrls.length > 0}
          onGenerate={generateAiPreview}
        />

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl">{activeMeta?.label}</h3>
              {activeMeta && (
                <p className="mt-1 text-xs text-[var(--color-brand-darkgray)]">{activeMeta.helper}</p>
              )}
            </div>
            <p className="text-xs text-[var(--color-brand-darkgray)]">
              {activeOptions.length} option{activeOptions.length === 1 ? "" : "s"}
            </p>
          </div>

          {activeOptions.length === 0 ? (
            <p className="mt-6 rounded-md bg-[var(--color-muted)] p-4 text-sm text-[var(--color-brand-darkgray)]">
              No materials in this category yet. Talk to us at the consult — we&apos;ll show
              you samples.
            </p>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {activeOptions.map((m) => {
                const selected = selections[activeCategory] === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectMaterial(activeCategory, m.id)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      selected
                        ? "border-[var(--color-primary)] bg-[var(--color-secondary)]/40"
                        : "border-[var(--color-border)] bg-white hover:bg-[var(--color-muted)]",
                    )}
                  >
                    <span
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-black/10"
                      style={{
                        background: m.image_url
                          ? `center/cover no-repeat url("${m.image_url}"), ${m.color_hex || "#E5E9EC"}`
                          : m.color_hex || "#E5E9EC",
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium text-[var(--color-foreground)]">
                          {m.name}
                        </span>
                        {selected && <Check className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />}
                      </span>
                      <span className="block truncate text-xs text-[var(--color-brand-darkgray)]">
                        {m.supplier}
                        {m.supplier && " · "}
                        {formatCurrency(Number(m.unit_cost))}/{m.unit}
                      </span>
                      {m.sku && (
                        <span className="mt-0.5 block truncate font-mono text-[10px] text-[var(--color-brand-lightgray)]">
                          SKU {m.sku}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Right: live estimate */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-brand-black)] p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
              Installed price range
            </p>
            <Sparkles className="h-4 w-4 text-[var(--color-brand-paleblue)]" />
          </div>
          <p className="mt-3 font-display text-3xl tracking-tight">
            {estimate.rangeLow > 0
              ? formatCurrencyRange(estimate.rangeLow, estimate.rangeHigh)
              : "—"}
          </p>
          <p className="mt-1 text-xs text-white/60">
            Materials + install + Cincinnati labor & overhead
          </p>

          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
            {estimate.lines.length === 0 ? (
              <p className="text-white/60">
                Pick materials on the left to see your range.
              </p>
            ) : (
              estimate.lines.map((line) => (
                <div key={line.category} className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-white/90">{line.label}</span>
                    <span className="block text-xs text-white/50">
                      {line.quantity} {line.unit}
                    </span>
                  </span>
                  <span className="font-mono text-sm tabular-nums">
                    {formatCurrency(line.subtotal)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-1 border-t border-white/10 pt-3 text-xs text-white/60">
            <Row label="Materials" value={formatCurrency(estimate.materialsSubtotal)} />
            <Row label="Install" value={formatCurrency(estimate.installSubtotal)} />
            <Row label="Labor & overhead (avg)" value={formatCurrency(estimate.laborOverhead)} />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-brand-darkgray)]">
          <SaveStatus state={saveState} hasSession={!!sessionId} />
          <button
            type="button"
            onClick={() => void persist()}
            className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline"
          >
            <Save className="h-3 w-3" />
            Save now
          </button>
        </div>

        <Button asChild size="lg" className="mt-4 w-full">
          <Link href={`/get-estimate${sessionId ? `?session=${sessionId}` : ""}`}>
            Bring this to a free consult
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-2 text-center text-xs text-[var(--color-brand-darkgray)]">
          Your design is auto-saved so you can come back later.
        </p>
      </aside>
    </div>
  );
}

function DimField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="text-xs">
      <span className="block text-[var(--color-brand-darkgray)]">{label}</span>
      <Input
        type="number"
        min={0}
        inputMode="decimal"
        className="mt-1 h-9 text-sm"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}

function SaveStatus({
  state,
  hasSession,
}: {
  state: "idle" | "saving" | "saved" | "error";
  hasSession: boolean;
}) {
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" /> Saving…
      </span>
    );
  }
  if (state === "error") return <span className="text-red-600">Save failed — retry?</span>;
  if (state === "saved" || hasSession) {
    return (
      <span className="inline-flex items-center gap-1">
        <Check className="h-3 w-3 text-[var(--color-primary)]" /> Saved
      </span>
    );
  }
  return <span>Auto-save on</span>;
}

function RoomPreview({
  selections,
  materials,
  dimensions,
  photoUrls,
  render,
  renderError,
  renderIsStale,
  canGenerate,
  onGenerate,
}: {
  selections: Selections;
  materials: MaterialRow[];
  dimensions: RoomDimensions;
  photoUrls: string[];
  render: { id: string; status: string; outputUrl: string; error?: string } | null;
  renderError: string | null;
  renderIsStale: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
}) {
  const get = (cat: MaterialCategory) => {
    const id = selections[cat];
    if (!id) return null;
    return materials.find((m) => m.id === id) ?? null;
  };
  const floor = get("floor");
  const cabinet = get("cabinet");
  const counter = get("countertop");
  const backsplash = get("backsplash");

  const heroPhoto = photoUrls[0];
  const chipMaterials = (
    [
      ["Floor", floor],
      ["Cabinets", cabinet],
      ["Counters", counter],
      ["Backsplash", backsplash],
    ] as const
  ).filter(([, m]) => !!m) as Array<[string, MaterialRow]>;

  if (heroPhoto) {
    const aiBusy = render?.status === "starting" || render?.status === "processing";
    const aiDone = render?.status === "succeeded" && render.outputUrl;
    return (
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand-darkgray)]">
            Your room · with your finishes
          </p>
          <div className="flex items-center gap-3">
            <p className="text-xs text-[var(--color-brand-darkgray)]">
              {dimensions.lengthFt}&apos; × {dimensions.widthFt}&apos;
            </p>
            <Button
              type="button"
              size="sm"
              variant={aiDone && !renderIsStale ? "outline" : "primary"}
              disabled={!canGenerate || aiBusy}
              onClick={onGenerate}
              className="gap-1.5"
            >
              {aiBusy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Rendering…
                </>
              ) : aiDone && !renderIsStale ? (
                <>
                  <Wand2 className="h-3.5 w-3.5" />
                  Re-render
                </>
              ) : (
                <>
                  <Wand2 className="h-3.5 w-3.5" />
                  {aiDone ? "Update AI preview" : "Generate AI preview"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={cn("grid gap-px bg-[var(--color-border)]", aiDone && "grid-cols-2")}>
          <div className="relative h-[360px] w-full overflow-hidden bg-black/5">
            <img
              src={heroPhoto}
              alt="Your room"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
            <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
              {chipMaterials.map(([label, m]) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur"
                >
                  <span
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{
                      background: m.image_url
                        ? `center/cover no-repeat url("${m.image_url}"), ${m.color_hex || "#E5E9EC"}`
                        : m.color_hex || "#E5E9EC",
                    }}
                  />
                  <span className="text-[11px] font-medium text-[var(--color-foreground)]">
                    <span className="text-[var(--color-brand-darkgray)]">{label}: </span>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] uppercase tracking-wider text-white">
              Original
            </div>
          </div>

          {aiDone && (
            <div className="relative h-[360px] w-full overflow-hidden bg-black/5">
              <img
                src={render.outputUrl}
                alt="AI preview of your remodel"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 rounded bg-[var(--color-primary)] px-2 py-1 text-[10px] uppercase tracking-wider text-white">
                AI preview · not a final render
              </div>
            </div>
          )}
        </div>

        {(renderError || render?.status === "failed" || renderIsStale) && (
          <div className="border-t border-[var(--color-border)] px-5 py-3 text-xs">
            {renderError && <p className="text-red-600">{renderError}</p>}
            {!renderError && render?.status === "failed" && (
              <p className="text-red-600">
                AI render failed{render.error ? `: ${render.error}` : ""}. Try again.
              </p>
            )}
            {!renderError && renderIsStale && render?.status === "succeeded" && (
              <p className="text-[var(--color-brand-darkgray)]">
                Selections changed since this render. Click <strong>Update AI preview</strong> to regenerate.
              </p>
            )}
          </div>
        )}

        {photoUrls.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-[var(--color-border)] p-3">
            {photoUrls.slice(1).map((url) => (
              <img
                key={url}
                src={url}
                alt="Room"
                className="h-16 w-24 shrink-0 rounded border border-[var(--color-border)] object-cover"
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // No photo yet — synthetic illustrated preview (uses product textures where available)
  const bgFor = (m: MaterialRow | null, fallback: string) =>
    m?.image_url
      ? `center/cover no-repeat url("${m.image_url}"), ${m.color_hex || fallback}`
      : m?.color_hex || fallback;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand-darkgray)]">
          Room preview · add a photo for a real view
        </p>
        <p className="text-xs text-[var(--color-brand-darkgray)]">
          {dimensions.lengthFt}&apos; × {dimensions.widthFt}&apos;
        </p>
      </div>
      <div
        className="relative h-[280px] w-full"
        style={{ background: bgFor(floor, "#E5E9EC") }}
        aria-label="Room preview"
      >
        <div
          className="absolute inset-x-0 top-0 h-[55%]"
          style={{ background: "linear-gradient(180deg, #ffffff 0%, #F4F6F8 100%)" }}
        />
        <div
          className="absolute inset-x-[8%] top-[28%] h-[12%] rounded-sm border border-black/10"
          style={{ background: bgFor(backsplash, "#F4F6F8") }}
          title={backsplash?.name ?? "Backsplash"}
        />
        <div
          className="absolute inset-x-[6%] top-[40%] h-[8%] rounded-sm border border-black/10 shadow-sm"
          style={{ background: bgFor(counter, "#D7D2CB") }}
          title={counter?.name ?? "Counter"}
        />
        <div
          className="absolute inset-x-[6%] top-[48%] h-[24%] rounded-sm border border-black/10"
          style={{ background: bgFor(cabinet, "#C8A977") }}
          title={cabinet?.name ?? "Cabinets"}
        >
          <div className="grid h-full grid-cols-6 gap-1 p-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-sm border border-black/15" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-2 right-3 rounded bg-black/60 px-2 py-1 text-[10px] uppercase tracking-wider text-white">
          {floor?.name ?? "Floor"}
        </div>
      </div>
    </div>
  );
}

function pickDefaults(materials: MaterialRow[]): Selections {
  const out: Selections = {};
  for (const cat of designerCategories) {
    const first = materials.find((m) => m.category === cat.id);
    if (first) out[cat.id] = first.id;
  }
  return out;
}
