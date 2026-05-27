"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-hero-fade]"), { opacity: 1, y: 0 });
      gsap.set(el.querySelectorAll("[data-hero-line] span"), { yPercent: 0 });
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        imageWrap.current,
        { scale: 1.18 },
        { scale: 1, duration: 2.4, ease: "power2.out" },
        0
      )
        .fromTo(
          "[data-hero-line] span",
          { yPercent: 120 },
          { yPercent: 0, duration: 1.3, stagger: 0.12, ease: "power4.out" },
          0.3
        )
        .fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: "power3.out" },
          0.9
        );

      gsap.to(imageWrap.current, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-content]", {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "55% top",
          scrub: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={root}
      className="grain relative h-[100svh] w-full overflow-hidden bg-[--color-ink] text-white"
    >
      <div ref={imageWrap} className="absolute inset-0 will-change-transform">
        <Image
          src="/portfolio/portfolio-4.webp"
          alt="A custom Cincinnati kitchen remodel by Codex Homes"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div
        data-hero-content
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28"
      >
        <p className="eyebrow mb-6 text-white/70">
          <span data-hero-fade className="inline-block" style={{ opacity: 0 }}>
            Cincinnati · Custom Build &amp; Remodel
          </span>
        </p>

        <h1 className="display-hero max-w-5xl text-[clamp(2.8rem,9vw,8.5rem)] text-white">
          <span data-hero-line className="block overflow-hidden pb-[0.08em]">
            <span className="block" style={{ transform: "translateY(110%)" }}>
              Living spaces,
            </span>
          </span>
          <span
            data-hero-line
            className="block overflow-hidden pb-[0.08em] italic text-white/90"
          >
            <span className="block" style={{ transform: "translateY(110%)" }}>
              composed with intent.
            </span>
          </span>
        </h1>

        <div
          data-hero-fade
          className="mt-8 flex max-w-2xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: 0 }}
        >
          <p className="max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            Kitchens, baths, and whole-home renovations for Greater Cincinnati —
            built without the guesswork, priced before the first hammer falls.
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/designer"
              data-cursor
              className="rounded-full bg-white px-7 py-3.5 text-center text-[0.72rem] uppercase tracking-[0.2em] text-[--color-ink] transition-colors hover:bg-[--color-brand-paleblue]"
            >
              Try the Designer
            </Link>
            <Link
              href="/portfolio"
              data-cursor
              className="rounded-full border border-white/40 px-7 py-3.5 text-center text-[0.72rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              View Work
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 hidden justify-center lg:flex">
        <div
          data-hero-fade
          className="flex flex-col items-center gap-3"
          style={{ opacity: 0 }}
        >
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/50">
            Scroll
          </span>
          <span className="flex h-10 w-5 justify-center rounded-full border border-white/30 pt-2">
            <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-white/70" />
          </span>
        </div>
      </div>
    </section>
  );
}
