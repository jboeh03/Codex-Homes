"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/designer", label: "Designer Tool" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[--color-border] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Codex Homes home">
          <Logo variant="horizontal" className="h-10 w-auto md:h-12" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[--color-foreground] transition-colors hover:text-[--color-primary]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <a href="tel:+15135550123" aria-label="Call Codex Homes">
              <Phone className="h-4 w-4" />
              (513) 555-0123
            </a>
          </Button>
          <Button asChild size="md">
            <Link href="/get-estimate">Free Estimate</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden",
          open ? "block border-t border-[--color-border]" : "hidden"
        )}
      >
        <div className="space-y-1 px-4 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-[--color-foreground] hover:bg-[--color-muted]"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" size="md" className="flex-1">
              <a href="tel:+15135550123">Call</a>
            </Button>
            <Button asChild size="md" className="flex-1">
              <Link href="/get-estimate" onClick={() => setOpen(false)}>
                Free Estimate
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
