import { Award, Hammer, MapPin, ShieldCheck, Star } from "lucide-react";

const items = [
  { icon: Star, label: "4.9 / 5 across Google + Houzz" },
  { icon: ShieldCheck, label: "Licensed & insured in Ohio" },
  { icon: Award, label: "BBB accredited since 2020" },
  { icon: MapPin, label: "Cincinnati owned & operated" },
  { icon: Hammer, label: "200+ Cincinnati homes transformed" },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Trust"
      className="border-y border-[var(--color-border)] bg-[var(--color-muted)]"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 text-sm text-[var(--color-muted-foreground)] sm:px-6 lg:px-8">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
