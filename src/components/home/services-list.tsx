"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

const imageFor: Record<string, string> = {
  kitchen: "/portfolio/portfolio-2.webp",
  bathroom: "/portfolio/portfolio-3.webp",
  basement: "/portfolio/portfolio-4.webp",
  "whole-home": "/portfolio/portfolio-2.webp",
  additions: "/portfolio/portfolio-4.webp",
  outdoor: "/portfolio/portfolio-1.webp",
};

const shown = services.filter((s) => s.slug in imageFor);

export function ServicesList() {
  const [active, setActive] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled.current) return;

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!enabled.current || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={onMove}
      onMouseLeave={() => setActive(null)}
    >
      {/* Cursor-following preview (fine pointers only) */}
      <div
        ref={previewRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[4/3] w-[clamp(220px,24vw,360px)] overflow-hidden rounded-lg shadow-2xl transition-opacity duration-500 lg:block",
          active === null ? "opacity-0" : "opacity-100"
        )}
      >
        {shown.map((s, i) => (
          <Image
            key={s.slug}
            src={imageFor[s.slug]}
            alt=""
            fill
            sizes="360px"
            className={cn(
              "object-cover transition-opacity duration-500",
              active === i ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      <ul className="border-t border-[--color-border]">
        {shown.map((s, i) => (
          <li key={s.slug} className="border-b border-[--color-border]">
            <Link
              href={`/services/${s.slug}`}
              data-cursor
              onMouseEnter={() => setActive(i)}
              className="group flex items-center justify-between gap-6 py-7 transition-colors lg:py-9"
            >
              <div className="flex items-baseline gap-5 lg:gap-10">
                <span className="text-xs tabular-nums text-[--color-brand-lightgray]">
                  0{i + 1}
                </span>
                <span
                  className={cn(
                    "font-display text-3xl tracking-tight transition-all duration-500 sm:text-4xl lg:text-6xl",
                    "text-[--color-foreground]/55 group-hover:text-[--color-foreground] group-hover:translate-x-2"
                  )}
                >
                  {s.title}
                </span>
              </div>
              <span className="hidden shrink-0 text-xs uppercase tracking-[0.2em] text-[--color-brand-darkgray] transition-colors group-hover:text-[--color-brand-darkblue] md:inline">
                View →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
