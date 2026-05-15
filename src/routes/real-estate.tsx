import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PropertyCard } from "@/components/PropertyCard";
import { PROPERTIES, REAL_ESTATE_SUBS, type Deal, type PropertySub } from "@/data/properties";

export const Route = createFileRoute("/real-estate")({
  head: () => ({
    meta: [
      { title: "Real Estate — MaalsoorHub" },
      { name: "description", content: "Buy, rent, or lease houses, apartments, villas, land, and commercial property from verified agents in Somalia." },
      { property: "og:title", content: "Real Estate — MaalsoorHub" },
      { property: "og:description", content: "Verified houses, apartments, villas, land, and commercial property in Somalia." },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/real-estate" },
    ],
    links: [
      { rel: "canonical", href: "https://market-link-somalia.lovable.app/real-estate" },
    ],
  }),
  component: RealEstatePage,
});

function RealEstatePage() {
  const [deal, setDeal] = useState<Deal>("Buy");
  const [sub, setSub] = useState<PropertySub | "All">("All");

  const filtered = PROPERTIES.filter(
    (p) => p.deal === deal && (sub === "All" || p.sub === sub),
  );

  return (
    <AppShell>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold leading-tight">Real Estate</h1>
            <p className="text-[11px] text-muted-foreground">Find your perfect property</p>
          </div>
        </div>

        <div className="mt-3 inline-flex w-full rounded-xl bg-secondary p-1">
          {(["Buy", "Rent"] as Deal[]).map((d) => (
            <button
              key={d}
              onClick={() => setDeal(d)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                deal === d ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <button className="inline-flex items-center gap-1 font-medium"><SlidersHorizontal className="h-3.5 w-3.5" /> Filter</button>
          <button className="inline-flex items-center gap-1 font-medium"><ArrowUpDown className="h-3.5 w-3.5" /> Sort</button>
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip label="All" active={sub === "All"} onClick={() => setSub("All")} />
          {REAL_ESTATE_SUBS.map((s) => (
            <Chip
              key={s.label}
              label={`${s.emoji} ${s.label}`}
              active={sub === s.label}
              onClick={() => setSub(s.label)}
            />
          ))}
        </div>
      </section>

      <section className="px-4 pt-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No listings match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
