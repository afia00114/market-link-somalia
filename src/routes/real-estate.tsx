import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Search, X, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PropertyCard } from "@/components/PropertyCard";
import { PROPERTIES, REAL_ESTATE_SUBS, type Deal, type PropertySub } from "@/data/properties";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/real-estate")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/real-estate";
    const title = "Real Estate — MaalsoorHub";
    const description = "Buy, rent, or lease houses, apartments, villas, land, and commercial property from verified agents in Somalia.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: PROPERTIES.length,
              itemListElement: PROPERTIES.slice(0, 20).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.title,
                url: `https://market-link-somalia.lovable.app/property/${p.id}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: RealEstatePage,
});

type SortKey = "newest" | "price-asc" | "price-desc" | "area-desc" | "beds-desc";
const SORT_LABEL: Record<SortKey, string> = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "area-desc": "Largest area",
  "beds-desc": "Most bedrooms",
};

const BUY_MAX = 500000;
const RENT_MAX = 5000;

function RealEstatePage() {
  const [deal, setDeal] = useState<Deal>("Buy");
  const [sub, setSub] = useState<PropertySub | "All">("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const maxPrice = deal === "Buy" ? BUY_MAX : RENT_MAX;
  const [price, setPrice] = useState<[number, number]>([0, BUY_MAX]);
  const [city, setCity] = useState<string | "Any">("Any");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);

  const cities = useMemo(
    () => Array.from(new Set(PROPERTIES.map((p) => p.city))).sort(),
    [],
  );

  function switchDeal(d: Deal) {
    setDeal(d);
    setPrice([0, d === "Buy" ? BUY_MAX : RENT_MAX]);
  }

  function resetFilters() {
    setPrice([0, maxPrice]);
    setCity("Any");
    setBeds(0);
    setBaths(0);
    setFurnished(false);
    setParking(false);
  }

  const activeCount =
    (price[0] > 0 || price[1] < maxPrice ? 1 : 0) +
    (city !== "Any" ? 1 : 0) +
    (beds > 0 ? 1 : 0) +
    (baths > 0 ? 1 : 0) +
    (furnished ? 1 : 0) +
    (parking ? 1 : 0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = PROPERTIES.filter((p) => {
      if (p.deal !== deal) return false;
      if (sub !== "All" && p.sub !== sub) return false;
      if (city !== "Any" && p.city !== city) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      if (beds > 0 && p.beds < beds) return false;
      if (baths > 0 && p.baths < baths) return false;
      if (furnished && !p.furnished) return false;
      if (parking && !p.parking) return false;
      if (
        needle &&
        !`${p.title} ${p.district} ${p.city} ${p.sub}`.toLowerCase().includes(needle)
      )
        return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "area-desc") sorted.sort((a, b) => b.area - a.area);
    if (sort === "beds-desc") sorted.sort((a, b) => b.beds - a.beds);
    return sorted;
  }, [deal, sub, city, price, beds, baths, furnished, parking, q, sort]);

  return (
    <AppShell>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/home" aria-label="Go back" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold leading-tight">Real Estate</h1>
            <p className="text-[11px] text-muted-foreground">Find your perfect property</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Search properties"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search area, city or property…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button aria-label="Clear search" onClick={() => setQ("")}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="mt-3 inline-flex w-full rounded-xl bg-secondary p-1">
          {(["Buy", "Rent"] as Deal[]).map((d) => (
            <button
              key={d}
              onClick={() => switchDeal(d)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                deal === d ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium text-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            {activeCount > 0 && (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium text-foreground">
              <ArrowUpDown className="h-3.5 w-3.5" /> {SORT_LABEL[sort]}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-popover">
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <DropdownMenuItem key={k} onSelect={() => setSort(k)} className="text-xs">
                  <span className="flex-1">{SORT_LABEL[k]}</span>
                  {sort === k && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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

      {activeCount > 0 && (
        <section className="px-4 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {(price[0] > 0 || price[1] < maxPrice) && (
              <ActiveChip
                label={`$${price[0].toLocaleString()} – $${price[1].toLocaleString()}`}
                onClear={() => setPrice([0, maxPrice])}
              />
            )}
            {city !== "Any" && <ActiveChip label={city} onClear={() => setCity("Any")} />}
            {beds > 0 && <ActiveChip label={`${beds}+ beds`} onClear={() => setBeds(0)} />}
            {baths > 0 && <ActiveChip label={`${baths}+ baths`} onClear={() => setBaths(0)} />}
            {furnished && <ActiveChip label="Furnished" onClear={() => setFurnished(false)} />}
            {parking && <ActiveChip label="Parking" onClear={() => setParking(false)} />}
            <button onClick={resetFilters} className="px-1.5 text-[11px] font-semibold text-primary">
              Clear all
            </button>
          </div>
        </section>
      )}

      <section className="px-4 pt-3">
        <p className="mb-2 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"} for {deal.toLowerCase()}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No listings match your filters.</p>
            <button onClick={resetFilters} className="mt-2 text-sm font-semibold text-primary">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">Price range</span>
                <span className="text-xs text-muted-foreground">
                  ${price[0].toLocaleString()} – ${price[1].toLocaleString()}
                  {deal === "Rent" ? "/mo" : ""}
                </span>
              </div>
              <Slider
                min={0}
                max={maxPrice}
                step={deal === "Buy" ? 5000 : 50}
                value={price}
                onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
              />
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">City</div>
              <div className="flex flex-wrap gap-2">
                <Chip label="Any" active={city === "Any"} onClick={() => setCity("Any")} />
                {cities.map((c) => (
                  <Chip key={c} label={c} active={city === c} onClick={() => setCity(c)} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Bedrooms</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <Chip
                    key={n}
                    label={n === 0 ? "Any" : `${n}+`}
                    active={beds === n}
                    onClick={() => setBeds(n)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Bathrooms</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Chip
                    key={n}
                    label={n === 0 ? "Any" : `${n}+`}
                    active={baths === n}
                    onClick={() => setBaths(n)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Amenities</div>
              <div className="flex gap-2">
                <Chip label="🛋️ Furnished" active={furnished} onClick={() => setFurnished(!furnished)} />
                <Chip label="🅿️ Parking" active={parking} onClick={() => setParking(!parking)} />
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row gap-2 pb-[env(safe-area-inset-bottom)]">
            <Button variant="outline" className="flex-1" onClick={resetFilters}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} results
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">
      {label}
      <button aria-label={`Remove ${label}`} onClick={onClear}>
        <X className="h-3 w-3" />
      </button>
    </span>
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
