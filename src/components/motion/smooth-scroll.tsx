"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "./gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // New routes mount fresh animations; recalculate trigger positions.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}
