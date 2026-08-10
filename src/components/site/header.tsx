"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/designer", label: "Design Studio" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the dark hero, render light. Everywhere else, render solid.
  const solid = !isHome || scrolled || open;

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-all duration-500",
        isHome ? "fixed" : "sticky",
        solid
          ? "border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Codex Homes home"
          data-cursor
        >
          <Logo
            variant={solid ? "horizontal" : "horizontal-white"}
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <nav
          className="hidden items-center gap-10 md:flex"
          aria-label="Main"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor
              className={cn(
                "link-underline text-[0.8rem] uppercase tracking-[0.2em] transition-colors",
                solid
                  ? "text-[var(--color-foreground)]/80 hover:text-[var(--color-foreground)]"
                  : "text-white/80 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="tel:+15135326692"
            data-cursor
            className={cn(
              "text-[0.8rem] tracking-wide transition-colors",
              solid ? "text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]" : "text-white/70 hover:text-white"
            )}
          >
            (513) 532-6692
          </a>
          <Link
            href="/get-estimate"
            data-cursor
            className={cn(
              "group relative overflow-hidden rounded-full border px-6 py-2.5 text-[0.72rem] uppercase tracking-[0.22em] transition-colors duration-300",
              solid
                ? "border-[var(--color-brass)] text-[var(--color-brass)] hover:bg-[var(--color-brass)] hover:text-[var(--color-primary-foreground)]"
                : "border-white/60 text-white hover:bg-white hover:text-[var(--color-ink)]"
            )}
          >
            Consultation
          </Link>
        </div>

        <button
          type="button"
          className={cn(
            "rounded-md p-2 md:hidden",
            solid ? "text-[var(--color-foreground)]" : "text-white"
          )}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden",
          open ? "block border-t border-[var(--color-border)] bg-[var(--color-background)]" : "hidden"
        )}
      >
        <div className="space-y-1 px-5 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase tracking-[0.18em] text-[var(--color-foreground)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <a
              href="tel:+15135326692"
              className="flex-1 rounded-full border border-[var(--color-border)] py-3 text-center text-xs uppercase tracking-[0.18em]"
            >
              Call
            </a>
            <Link
              href="/get-estimate"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-[var(--color-brass)] py-3 text-center text-xs uppercase tracking-[0.2em] text-[var(--color-primary-foreground)]"
            >
              Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
