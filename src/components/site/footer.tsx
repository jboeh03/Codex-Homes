import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo variant="horizontal-white" className="h-12 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            A Cincinnati atelier for bespoke residential renovation — kitchens,
            baths, additions, and whole homes, made with restraint and master
            craftsmanship.
          </p>
          <p className="mt-4 text-xs text-white/50">
            Codex Homes, LLC · Cincinnati, OH · Licensed &amp; insured
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-brass-soft)]">
            Services
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Kitchen Renovation", "/services/kitchen"],
              ["Bath & Spa", "/services/bathroom"],
              ["Lower Levels", "/services/basement"],
              ["Whole-Home Renovation", "/services/whole-home"],
              ["Additions", "/services/additions"],
              ["Outdoor Living", "/services/outdoor"],
              ["Estate Maintenance", "/services/handyman"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-brass-soft)]">
            Codex Homes
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Portfolio", "/portfolio"],
              ["Process", "/process"],
              ["Design Studio", "/designer"],
              ["About", "/about"],
              ["Blog", "/blog"],
              ["Service Areas", "/service-areas"],
              ["Get Estimate", "/get-estimate"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-white/70 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-brass-soft)]">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href="tel:+15135326692" className="hover:text-white">
                513-532-6692
              </a>
            </li>
            <li>
              <a href="mailto:zachwest@codex.homes" className="hover:text-white">
                zachwest@codex.homes
              </a>
            </li>
            <li className="pt-1 leading-relaxed not-italic">
              <p className="text-white/50">Main Office</p>
              <address className="not-italic">
                8277 Jakaro Dr
                <br />
                Cincinnati, OH 45255
              </address>
            </li>
            <li>Serving Greater Cincinnati &amp; NKY</li>
            <li className="pt-2">
              <a
                href="https://www.instagram.com/codexhomes"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-white"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Codex Homes, LLC. All rights reserved.</p>
          <p className="font-serif italic text-[var(--color-brass-soft)]">
            The art of the considered home.
          </p>
        </div>
      </div>
    </footer>
  );
}
