"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestRender, StudioApiError } from "@/lib/studio/client-api";
import { useStudio } from "../studio-provider";
import { BeforeAfter } from "../before-after";

const loadingLines = [
  "Reading your photo…",
  "Applying your finishes…",
  "Matching the light…",
  "Final polish…",
];

export function RenderStep() {
  const { state, currentRenderKey, renderIsStale, dispatch, goTo, ensureSession } =
    useStudio();
  const [generating, setGenerating] = useState(false);
  const [loadingLine, setLoadingLine] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!generating) return;
    const handle = window.setInterval(
      () => setLoadingLine((i) => Math.min(i + 1, loadingLines.length - 1)),
      6000,
    );
    return () => window.clearInterval(handle);
  }, [generating]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const activePhoto = state.photos.find((p) => p.path === state.activePhotoPath);
  const pickedCount = Object.keys(state.selections).length;
  const upToDate = Boolean(
    state.render && currentRenderKey && state.render.renderKey === currentRenderKey,
  );

  async function generate() {
    if (!state.activePhotoPath || !currentRenderKey) return;
    setError(null);
    setGenerating(true);
    setLoadingLine(0);
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 120_000);
    try {
      const creds = await ensureSession();
      if (!creds) {
        setError("The studio can't reach our servers right now — your estimate still works.");
        return;
      }
      const render = await requestRender(
        creds.token,
        {
          sessionId: creds.sessionId,
          photoPath: state.activePhotoPath,
          roomType: state.roomType,
          selections: state.selections,
        },
        controller.signal,
      );
      if (render.url) {
        dispatch({
          type: "RENDER_DONE",
          render: {
            id: render.id,
            url: render.url,
            renderKey: render.renderKey,
            provider: render.provider,
          },
        });
      } else {
        setError("The preview came back empty — try again.");
      }
    } catch (err) {
      if (controller.signal.aborted) {
        setError("That took longer than it should. Nothing was lost — try again.");
      } else if (err instanceof StudioApiError) {
        setError(err.message);
      } else {
        setError("The AI preview didn't come through. Nothing was lost — try again.");
      }
    } finally {
      window.clearTimeout(timeout);
      setGenerating(false);
    }
  }

  return (
    <section aria-label="AI preview of your design">
      <p className="eyebrow text-[var(--color-brass)]">Step four</p>
      <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight">
        Your room, in your finishes.
      </h2>

      {!activePhoto ? (
        <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-white p-8">
          <p className="text-[var(--color-ink-soft)]">
            Add a photo of your room and we&apos;ll restyle it in the finishes
            you picked — same walls, same light.
          </p>
          <Button
            data-cursor
            className="mt-5 rounded-full px-6"
            onClick={() => goTo("photo")}
          >
            Add a photo
          </Button>
          <button
            type="button"
            data-cursor
            onClick={() => goTo("estimate")}
            className="link-underline ml-6 text-sm text-[var(--color-ink-soft)]"
          >
            Skip to the estimate
          </button>
        </div>
      ) : (
        <div className="mt-8">
          {state.render && (
            <div className="relative">
              <BeforeAfter
                beforeUrl={activePhoto.url}
                afterUrl={state.render.url}
                alt={`AI concept of your ${state.roomType} in the selected finishes`}
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-[var(--color-ink)]/85 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-brass-soft)]">
                AI concept — not a final rendering
              </span>
            </div>
          )}

          {renderIsStale && !generating && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-brass)]/40 bg-[var(--color-paleblue)]/20 px-4 py-3 text-sm">
              <span>Your selections changed since this preview.</span>
              <Button size="sm" data-cursor className="rounded-full" onClick={() => void generate()}>
                Update design
              </Button>
            </div>
          )}

          {generating ? (
            <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhoto.url}
                  alt=""
                  aria-hidden
                  className="block w-full opacity-60 blur-[1px]"
                />
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
              <p
                className="px-5 py-4 text-sm text-[var(--color-ink-soft)]"
                aria-live="polite"
              >
                {loadingLines[loadingLine]}
              </p>
            </div>
          ) : (
            !state.render &&
            !error && (
              <div className="mt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhoto.url}
                  alt="Your room today"
                  className="w-full rounded-lg"
                />
              </div>
            )
          )}

          {error && !generating && (
            <div className="mt-4 rounded-md border border-[var(--color-destructive)]/30 bg-[var(--color-destructive)]/5 px-4 py-3 text-sm text-[var(--color-ink)]">
              <p>{error}</p>
            </div>
          )}

          {!generating && (
            <div className="mt-6 flex flex-wrap items-center gap-5">
              {!upToDate && (
                <Button
                  size="lg"
                  data-cursor
                  disabled={pickedCount === 0}
                  className="rounded-full px-8"
                  onClick={() => void generate()}
                >
                  <Sparkles className="h-5 w-5" aria-hidden />
                  {state.render || error ? "Try again" : "Generate my redesign"}
                </Button>
              )}
              {pickedCount === 0 && (
                <button
                  type="button"
                  data-cursor
                  onClick={() => goTo("materials")}
                  className="link-underline text-sm text-[var(--color-ink-soft)]"
                >
                  Pick finishes first
                </button>
              )}
              {state.render && (
                <Button
                  size="lg"
                  variant={upToDate ? "primary" : "outline"}
                  data-cursor
                  className="rounded-full px-8"
                  onClick={() => goTo("estimate")}
                >
                  See the numbers
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
