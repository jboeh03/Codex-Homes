import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "horizontal" | "horizontal-white" | "monogram";
  className?: string;
  priority?: boolean;
}

const sources: Record<NonNullable<LogoProps["variant"]>, string> = {
  horizontal: "/brand/codex-logo-horizontal.png",
  "horizontal-white": "/brand/codex-logo-horizontal-white.png",
  monogram: "/brand/codex-monogram.png",
};

export function Logo({ variant = "horizontal", className }: LogoProps) {
  return (
    // Using <img> instead of next/image because SVGs are inlined statically and
    // the wordmark is just a few hundred bytes — no resize pipeline needed.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[variant]}
      alt="Codex Homes — Custom Building & Remodeling"
      className={cn("select-none", className)}
    />
  );
}
