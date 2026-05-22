import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/services";
import { formatCurrencyRange } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Kitchen, bath, basement, whole-home, additions, outdoor living, and handyman work across Greater Cincinnati.",
};

export default function ServicesIndexPage() {
  return (
    <div>
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[--color-primary]">
            Services
          </p>
          <h1 className="font-display text-5xl tracking-tight text-[--color-brand-black] sm:text-6xl">
            Every part of the house. One Cincinnati team.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[--color-brand-darkgray]">
            We&apos;ve organized our work so you can browse by room or scope. Every
            service includes a free in-home assessment and a written, fixed-scope quote.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.slug}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-2xl">{service.title}</h2>
                  <span className="rounded-full bg-[--color-secondary] px-3 py-1 text-xs font-medium text-[--color-primary]">
                    {formatCurrencyRange(service.priceRange[0], service.priceRange[1])}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[--color-brand-darkgray]">
                  {service.blurb}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.15em] text-[--color-brand-darkgray]">
                  Typical timeline · {service.durationWeeks[0]}–{service.durationWeeks[1]} weeks
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[--color-primary] hover:underline"
                >
                  See full scope
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
