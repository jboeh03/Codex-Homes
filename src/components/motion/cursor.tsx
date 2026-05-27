"use client";

import { useEffect, useRef } from "react";

/** Lerping dual-ring cursor. Styled only on fine pointers (see globals.css). */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("cursor-none");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;
    let hovering = false;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = ring.style.opacity = "1";
      }
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        'a, button, [data-cursor], input, textarea, select, [role="button"]'
      );
      if (interactive !== hovering) {
        hovering = interactive;
        ring.dataset.hover = hovering ? "true" : "false";
      }
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.15;
      ringPos.y += (pos.y - ringPos.y) * 0.15;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onLeave = () => (ring.style.opacity = dot.style.opacity = "0");
    const onEnter = () => {
      if (visible) ring.style.opacity = dot.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" data-hover="false" aria-hidden />
    </>
  );
}
