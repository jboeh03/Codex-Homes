"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, registerGsap, prefersReducedMotion } from "./gsap";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Positive moves up as you scroll down. Fraction of element travel. */
  speed?: number;
}

export function Parallax({ children, className, speed = 0.2 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
