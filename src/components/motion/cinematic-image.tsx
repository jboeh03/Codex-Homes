"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, registerGsap, prefersReducedMotion } from "./gsap";

interface CinematicImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Curtain sweep + slow zoom on enter. */
  reveal?: boolean;
}

/** Full-bleed image that sweeps in behind a curtain and slowly settles from a zoom. */
export function CinematicImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority,
  reveal = true,
}: CinematicImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !reveal) return;
    if (prefersReducedMotion()) {
      el.style.clipPath = "none";
      return;
    }
    const img = el.querySelector<HTMLElement>("[data-ci-img]");
    if (!img) return;

    registerGsap();
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 85%" } })
        .fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.out" }
        )
        .fromTo(
          img,
          { scale: 1.3 },
          { scale: 1, duration: 1.6, ease: "power2.out" },
          0
        );
    }, el);

    return () => ctx.revert();
  }, [reveal]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={reveal ? { clipPath: "inset(100% 0% 0% 0%)" } : undefined}
    >
      <div data-ci-img className="absolute inset-0 h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  );
}
