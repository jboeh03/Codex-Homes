"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, registerGsap, prefersReducedMotion } from "./gsap";

interface ExpandImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  children?: React.ReactNode;
}

/** Image that expands from a centered inset to full-bleed as it scrolls through. */
export function ExpandImage({
  src,
  alt,
  className,
  sizes = "100vw",
  children,
}: ExpandImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const frame = el.querySelector<HTMLElement>("[data-expand-frame]");
    const img = el.querySelector<HTMLElement>("[data-expand-img]");
    if (!frame || !img) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      tl.fromTo(
        frame,
        { width: "62%", borderRadius: "1.5rem" },
        { width: "100%", borderRadius: "0rem", ease: "none" }
      ).fromTo(img, { scale: 1.35 }, { scale: 1, ease: "none" }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={cn("flex justify-center", className)}>
      <div
        data-expand-frame
        className="relative aspect-[16/9] w-[62%] overflow-hidden rounded-3xl"
      >
        <div data-expand-img className="absolute inset-0 h-full w-full">
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </div>
        {children}
      </div>
    </div>
  );
}
