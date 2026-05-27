"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, registerGsap, prefersReducedMotion } from "./gsap";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical offset to travel, in px. */
  y?: number;
  delay?: number;
  duration?: number;
  /** Stagger direct children instead of the wrapper itself. */
  stagger?: number;
  /** Viewport trigger position. */
  start?: string;
  as?: React.ElementType;
}

export function Reveal({
  children,
  className,
  y = 44,
  delay = 0,
  duration = 1.1,
  stagger,
  start = "top 88%",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el];

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger ?? 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, duration, stagger, start]);

  return (
    <Tag
      ref={ref}
      className={cn(stagger && "reveal-stagger", className)}
      data-reveal=""
    >
      {children}
    </Tag>
  );
}
