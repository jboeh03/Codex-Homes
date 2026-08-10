"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPhoto } from "@/lib/studio/client-api";
import { preparePhoto } from "@/lib/studio/image-prep";
import { cn } from "@/lib/utils";
import { useStudio } from "../studio-provider";

interface UploadItem {
  key: string;
  filename: string;
  previewUrl: string | null;
  status: "preparing" | "uploading" | "done" | "error";
  error?: string;
  file?: File;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";

export function PhotoStep() {
  const { state, dispatch, goTo, ensureSession } = useStudio();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [offline, setOffline] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef(0);

  const patchItem = (key: string, patch: Partial<UploadItem>) =>
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));

  async function handleFile(file: File) {
    const key = `u${keyRef.current++}`;
    setItems((prev) => [
      ...prev,
      { key, filename: file.name, previewUrl: null, status: "preparing", file },
    ]);
    try {
      const prepared = await preparePhoto(file);
      patchItem(key, { previewUrl: prepared.previewUrl, status: "uploading" });

      const creds = await ensureSession();
      if (!creds) {
        setOffline(true);
        patchItem(key, {
          status: "error",
          error: "Uploads are offline right now",
        });
        return;
      }
      const { path, url } = await uploadPhoto(
        creds.sessionId,
        creds.token,
        prepared.blob,
        prepared.filename,
      );
      dispatch({ type: "PHOTO_ADDED", photo: { path, url: url || prepared.previewUrl } });
      patchItem(key, { status: "done" });
    } catch (err) {
      patchItem(key, {
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  // One file failing never discards the others — each runs independently.
  function handleFiles(list: FileList | null) {
    if (!list) return;
    Array.from(list).forEach((file) => void handleFile(file));
  }

  async function addSamplePhoto() {
    const key = `u${keyRef.current++}`;
    const which = "/studio/sample-kitchen.jpg";
    setItems((prev) => [
      ...prev,
      { key, filename: "Sample kitchen", previewUrl: which, status: "uploading" },
    ]);
    try {
      const res = await fetch(which);
      const blob = await res.blob();
      const creds = await ensureSession();
      if (!creds) {
        setOffline(true);
        patchItem(key, { status: "error", error: "Uploads are offline right now" });
        return;
      }
      const { path, url } = await uploadPhoto(creds.sessionId, creds.token, blob, "sample-kitchen.jpg");
      dispatch({ type: "PHOTO_ADDED", photo: { path, url: url || which } });
      patchItem(key, { status: "done" });
    } catch {
      patchItem(key, { status: "error", error: "Could not load the sample" });
    }
  }

  const pendingItems = items.filter((it) => it.status !== "done");
  const hasPhotos = state.photos.length > 0;

  return (
    <section aria-label="Add a photo of your room">
      <div className="grain rounded-lg bg-[var(--color-ink)] px-6 py-12 text-[var(--color-cream)] sm:px-10 sm:py-16">
        <p className="eyebrow text-[var(--color-brass-soft)]">Design Studio · Step one</p>
        <h1 className="mt-5 max-w-xl font-display text-[clamp(2rem,5.5vw,3.4rem)] font-light leading-[1.05]">
          See your kitchen or bath,{" "}
          <span className="italic text-[var(--color-brass-soft)]">redesigned.</span>
        </h1>
        <p className="mt-5 max-w-md text-[var(--color-cream)]/65">
          Photograph the room as it stands today. We&apos;ll restyle your actual
          space — same walls, same light — in the finishes you choose, with an
          honest Cincinnati price range beside it.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            data-cursor
            className="rounded-full bg-white text-[var(--color-ink)] hover:bg-[var(--color-brass-soft)]"
            onClick={() => cameraRef.current?.click()}
          >
            <Camera className="h-5 w-5" aria-hidden />
            Photograph your room
          </Button>
          <Button
            size="lg"
            variant="ghost"
            data-cursor
            className="rounded-full border border-[var(--color-cream)]/30 text-[var(--color-cream)] hover:bg-white/10"
            onClick={() => libraryRef.current?.click()}
          >
            <ImagePlus className="h-5 w-5" aria-hidden />
            Choose from library
          </Button>
          <button
            type="button"
            data-cursor
            onClick={() => void addSamplePhoto()}
            className="link-underline text-sm text-[var(--color-cream)]/70"
          >
            Try a sample room
          </button>
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept={ACCEPT}
          capture="environment"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={libraryRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {offline && (
          <p className="mt-6 max-w-md rounded-md border border-[var(--color-cream)]/20 bg-white/5 p-3 text-sm text-[var(--color-cream)]/75">
            Photo uploads are briefly offline. You can still choose materials
            and see live pricing — add your photo when you return, or skip
            ahead.
          </p>
        )}
      </div>

      {(state.photos.length > 0 || pendingItems.length > 0) && (
        <div className="mt-8">
          <p className="eyebrow text-[var(--color-brass)]">Your photos</p>
          <div className="mt-4 flex flex-wrap gap-4">
            {state.photos.map((photo) => (
              <figure key={photo.path} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="Your room"
                  className={cn(
                    "h-28 w-36 rounded-md object-cover",
                    state.activePhotoPath === photo.path &&
                      "ring-2 ring-[var(--color-brass)] ring-offset-2",
                  )}
                  onClick={() => dispatch({ type: "SET_ACTIVE_PHOTO", path: photo.path })}
                />
                <button
                  type="button"
                  aria-label="Remove photo"
                  data-cursor
                  onClick={() => dispatch({ type: "PHOTO_REMOVED", path: photo.path })}
                  className="absolute -right-2 -top-2 rounded-full bg-[var(--color-ink)] p-1.5 text-[var(--color-cream)] shadow"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </figure>
            ))}

            {pendingItems.map((item) => (
              <div
                key={item.key}
                className="flex h-28 w-36 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-stone-light)] bg-white p-2 text-center"
              >
                {item.status === "error" ? (
                  <>
                    <p className="text-[0.7rem] leading-snug text-[var(--color-destructive)]">
                      {item.error}
                    </p>
                    {item.file && (
                      <button
                        type="button"
                        data-cursor
                        className="inline-flex items-center gap-1 text-[0.7rem] text-[var(--color-ink)] underline"
                        onClick={() => {
                          const file = item.file;
                          setItems((prev) => prev.filter((it) => it.key !== item.key));
                          if (file) void handleFile(file);
                        }}
                      >
                        <RefreshCw className="h-3 w-3" aria-hidden /> Try again
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden
                      className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-stone)] border-t-transparent"
                    />
                    <p className="text-[0.7rem] text-[var(--color-ink-soft)]">
                      {item.status === "preparing"
                        ? "Preparing your photo…"
                        : "Uploading…"}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center gap-6">
        <Button
          size="lg"
          data-cursor
          disabled={!hasPhotos}
          className="rounded-full px-8"
          onClick={() => goTo("room")}
        >
          Continue
        </Button>
        {!hasPhotos && (
          <button
            type="button"
            data-cursor
            onClick={() => goTo("room")}
            className="link-underline text-sm text-[var(--color-ink-soft)]"
          >
            Skip the photo for now
          </button>
        )}
      </div>
    </section>
  );
}
