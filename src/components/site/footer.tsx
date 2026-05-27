import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="bg-[--color-ink] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo variant="horizontal-white" className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Cincinnati-based custom building and remodeling. Kitchens, baths, basements,
            additions, and full home renovations — built without the guesswork.
          </p>
          <p className="mt-4 text-xs text-white/50">
            Codex Homes, LLC · Cincinnati, OH · Licensed &amp; insured
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
            Services
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Kitchen Remodeling", "/services/kitchen"],
              ["Bathroom Remodeling", "/services/bathroom"],
              ["Basement Finishing", "/services/basement"],
              ["Whole-Home Renovations", "/services/whole-home"],
              ["Additions", "/services/additions"],
              ["Decks &amp; Outdoor", "/services/outdoor"],
              ["Handyman", "/services/handyman"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/70 transition-colors hover:text-white"
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
            Codex Homes
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Portfolio", "/portfolio"],
              ["Process", "/process"],
              ["Designer Tool", "/designer"],
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
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href="tel:+15135550123" className="hover:text-white">
                (513) 555-0123
              </a>
            </li>
            <li>
              <a href="mailto:hello@codex.homes" className="hover:text-white">
                hello@codex.homes
              </a>
            </li>
            <li>Serving Greater Cincinnati &amp; NKY</li>
            <li className="pt-2">
              <a
                href="https://www.instagram.com/codex_homes/"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-white"
              >
                Instagram
              </a>
              {" · "}
              <a
                href="https://www.houzz.com/professionals/general-contractors/codex-homes-pfvwus-pf~1704075941"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-white"
              >
                Houzz
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Codex Homes, LLC. All rights reserved.</p>
          <p className="font-serif italic">Cincinnati remodels, decoded.</p>
        </div>
      </div>
    </footer>
  );
}
