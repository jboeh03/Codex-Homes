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

    const fadeEls = Array.from(
      el.querySelectorAll<HTMLElement>("[data-hero-fade]")
    );

    // Headline line-reveal runs from a pure CSS keyframe (see globals.css)
    // so it's deterministic across browsers and engines. GSAP handles the
    // image entrance, the secondary fade group, and the scroll-bound moves.
    if (prefersReducedMotion()) {
      gsap.set(fadeEls, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        imageWrap.current,
        { scale: 1.18 },
        { scale: 1, duration: 2.6, ease: "power2.out" },
        0
      ).fromTo(
        fadeEls,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: "power3.out" },
        1.0
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
      className="grain relative h-[100svh] w-full overflow-hidden bg-[var(--color-ink)] text-[var(--color-cream)]"
    >
      <div ref={imageWrap} className="absolute inset-0 will-change-transform">
        <Image
          src="/portfolio/portfolio-4.webp"
          alt="A bespoke Cincinnati kitchen renovation by Codex Homes"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Brand-black scrim — even and strong so the serif headline
            pops and the photo recedes into a moody backdrop */}
        <div className="absolute inset-0 bg-[#101820]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-[#101820]/70 to-[#101820]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101820]/70 via-transparent to-transparent" />
      </div>

      <div
        data-hero-content
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28"
      >
        <p className="eyebrow mb-7 flex items-center gap-3 text-[var(--color-brass-soft)]">
          <span
            data-hero-fade
            className="inline-flex items-center gap-3"
            style={{ opacity: 0 }}
          >
            <span className="brass-tick" />
            Cincinnati · Bespoke Residential Renovation
          </span>
        </p>

        <h1 className="display-hero max-w-5xl text-[clamp(2.8rem,9vw,8.5rem)] text-[#ffffff]">
          <span className="hero-line block overflow-hidden pb-[0.08em]">
            <span className="hero-line-inner hero-line-1 block">
              The art of the
            </span>
          </span>
          <span className="hero-line block overflow-hidden pb-[0.08em] italic text-[var(--color-brass-soft)]">
            <span className="hero-line-inner hero-line-2 block">
              considered home.
            </span>
          </span>
        </h1>

        <div
          data-hero-fade
          className="mt-9 flex max-w-2xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: 0 }}
        >
          <p className="max-w-md text-base leading-relaxed text-[#ffffff]/75 sm:text-lg">
            Bespoke kitchens, baths, and whole-home renovations for Greater
            Cincinnati — designed with restraint, built by master craftsmen, and
            priced with absolute clarity.
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/get-estimate"
              data-cursor
              className="rounded-full bg-[#ffffff] px-7 py-3.5 text-center text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors duration-300 hover:bg-[var(--color-brass-soft)]"
            >
              Request a consultation
            </Link>
            <Link
              href="/portfolio"
              data-cursor
              className="rounded-full border border-[#ffffff]/40 px-7 py-3.5 text-center text-[0.72rem] uppercase tracking-[0.22em] text-[#ffffff] transition-colors duration-300 hover:border-[var(--color-brass-soft)] hover:text-[var(--color-brass-soft)]"
            >
              View the portfolio
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
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-[#ffffff]/50">
            Scroll
          </span>
          <span className="flex h-10 w-5 justify-center rounded-full border border-[#ffffff]/30 pt-2">
            <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-[var(--color-brass-soft)]" />
          </span>
        </div>
      </div>
    </section>
  );
}
