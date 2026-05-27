import type { ServiceSlug } from "@/lib/services";

/** Representative imagery per service, drawn from the local portfolio set. */
export const serviceImage: Record<ServiceSlug, string> = {
  kitchen: "/portfolio/portfolio-2.webp",
  bathroom: "/portfolio/portfolio-3.webp",
  basement: "/portfolio/portfolio-4.webp",
  "whole-home": "/portfolio/portfolio-2.webp",
  additions: "/portfolio/portfolio-4.webp",
  outdoor: "/portfolio/portfolio-1.webp",
  handyman: "/portfolio/portfolio-1.webp",
};
