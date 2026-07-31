import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Search, PackageOpen, Wrench, Zap, Sparkles, Snowflake,
  PaintBucket, Hammer, Brush, Truck, Car as CarIcon, Wheat, Briefcase,
  Landmark, UtensilsCrossed, Stethoscope, Plane, Home as HomeIcon, MoreHorizontal,
  X, Navigation, type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CATEGORIES, type CategoryKey } from "@/data/categories";
import { ListingCard } from "@/components/ListingCard";
import { listingsByCategory } from "@/data/listings";
import { useUserLocation } from "@/hooks/use-user-location";
import { coordsFor, distanceKm } from "@/lib/geo";
import { useLivePosts } from "@/hooks/use-live-posts";
import { LivePostCard } from "@/components/LivePostCard";

type PopularItem = { label: string; icon: LucideIcon; tone: string };

const POPULAR: Record<string, PopularItem[]> = {
  services: [
    { label: "Plumbing", icon: Wrench, tone: "text-sky-600 bg-sky-50" },
    { label: "Electrical", icon: Zap, tone: "text-amber-600 bg-amber-50" },
    { label: "Cleaning", icon: Sparkles, tone: "text-cyan-600 bg-cyan-50" },
    { label: "AC Repair", icon: Snowflake, tone: "text-blue-600 bg-blue-50" },
    { label: "Painting", icon: PaintBucket, tone: "text-rose-600 bg-rose-50" },
    { label: "Carpentry", icon: Hammer, tone: "text-orange-700 bg-orange-50" },
    { label: "Masonry", icon: Brush, tone: "text-emerald-700 bg-emerald-50" },
    { label: "More", icon: MoreHorizontal, tone: "text-slate-600 bg-slate-100" },
  ],
  food: [
    { label: "Restaurants", icon: UtensilsCrossed, tone: "text-rose-600 bg-rose-50" },
    { label: "Delivery", icon: Truck, tone: "text-amber-600 bg-amber-50" },
    { label: "Cafes", icon: Sparkles, tone: "text-emerald-600 bg-emerald-50" },
    { label: "More", icon: MoreHorizontal, tone: "text-slate-600 bg-slate-100" },
  ],
  vehicles: [
    { label: "Cars", icon: CarIcon, tone: "text-blue-600 bg-blue-50" },
    { label: "Trucks", icon: Truck, tone: "text-orange-600 bg-orange-50" },
    { label: "Parts", icon: Wrench, tone: "text-slate-600 bg-slate-100" },
    { label: "More", icon: MoreHorizontal, tone: "text-slate-600 bg-slate-100" },
  ],
  livestock: [
    { label: "Camels", icon: Wheat, tone: "text-amber-700 bg-amber-50" },
    { label: "Cattle", icon: Wheat, tone: "text-emerald-700 bg-emerald-50" },
    { label: "Farms", icon: HomeIcon, tone: "text-lime-700 bg-lime-50" },
    { label: "More", icon: MoreHorizontal, tone: "text-slate-600 bg-slate-100" },
  ],
  jobs: [
    { label: "Full-time", icon: Briefcase, tone: "text-indigo-600 bg-indigo-50" },
    { label: "Part-time", icon: Briefcase, tone: "text-sky-600 bg-sky-50" },
    { label: "Remote", icon: Plane, tone: "text-emerald-600 bg-emerald-50" },
    { label: "More", icon: MoreHorizontal, tone: "text-slate-600 bg-slate-100" },
  ],
  banking: [
    { label: "Banks", icon: Landmark, tone: "text-blue-700 bg-blue-50" },
    { label: "Forex", icon: Landmark, tone: "text-emerald-700 bg-emerald-50" },
    { label: "Insurance", icon: Stethoscope, tone: "text-rose-600 bg-rose-50" },
    { label: "More", icon: MoreHorizontal, tone: "text-slate-600 bg-slate-100" },
  ],
};

export const Route = createFileRoute("/category/$key")({
  component: CategoryPage,
  head: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.key === (params.key as CategoryKey));
    const label = cat?.label ?? "Category";
    const url = `https://market-link-somalia.lovable.app/category/${params.key}`;
    const title = `${label} in Somalia — MaalsoorHub`;
    const description = cat
      ? `Browse verified ${label.toLowerCase()} providers across Somalia and East Africa. ${cat.short}. Connect directly via WhatsApp or call.`
      : `Browse verified providers on MaalsoorHub.`;
    const items = listingsByCategory((params.key as CategoryKey));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
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
              numberOfItems: items.length,
              itemListElement: items.slice(0, 20).map((l, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://market-link-somalia.lovable.app/listing/${l.id}`,
                name: l.title,
              })),
            },
          }),
        },
      ],
    };
  },
});

function CategoryPage() {
  const { key } = useParams({ from: "/category/$key" });
  const cat = CATEGORIES.find((c) => c.key === (key as CategoryKey));
  const allItems = cat ? listingsByCategory(cat.key) : [];
  const popular = POPULAR[key as string];

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortByNearby, setSortByNearby] = useState(false);
  const { coords, status, request } = useUserLocation();
  const { posts: livePosts } = useLivePosts(key as string);



  const items = useMemo(() => {
    let list = allItems;
    if (activeFilter && activeFilter !== "More") {
      const f = activeFilter.toLowerCase();
      list = list.filter(
        (l) =>
          l.subtitle.toLowerCase().includes(f) ||
          l.title.toLowerCase().includes(f) ||
          l.description.toLowerCase().includes(f),
      );
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.subtitle.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          (l.district ?? "").toLowerCase().includes(q),
      );
    }
    if (sortByNearby && coords) {
      list = [...list].sort((a, b) => {
        const pa = coordsFor(a.city, a.district);
        const pb = coordsFor(b.city, b.district);
        const da = pa ? distanceKm(coords, pa) : Infinity;
        const db = pb ? distanceKm(coords, pb) : Infinity;
        return da - db;
      });
    }
    return list;
  }, [allItems, activeFilter, query, sortByNearby, coords]);

  return (
    <AppShell>
      <header className={`${cat?.gradient ?? "grad-hero"} rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card`}>
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">{cat?.label ?? "Category"}</h1>
            <p className="truncate text-xs text-white/80">{cat?.short}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${cat?.label ?? "category"}…`}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {popular && (
        <section className="px-4 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Most popular</h2>
            {activeFilter ? (
              <button
                onClick={() => setActiveFilter(null)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            ) : (
              <span className="text-[11px] font-semibold text-muted-foreground">
                Browse by type
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {popular.map((p) => {
              const Icon = p.icon;
              const isActive = activeFilter === p.label;
              return (
                <button
                  key={p.label}
                  onClick={() =>
                    setActiveFilter((cur) => (cur === p.label ? null : p.label))
                  }
                  className="group flex flex-col items-center gap-1.5 active:scale-95 transition"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.tone} shadow-soft ring-1 transition group-hover:shadow-card ${
                      isActive ? "ring-2 ring-primary scale-105" : "ring-border/40"
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span
                    className={`text-[11px] font-semibold leading-tight text-center line-clamp-1 ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="px-4 pt-4">
        {status !== "granted" ? (
          <button
            onClick={request}
            disabled={status === "loading" || status === "unavailable"}
            className="mb-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left shadow-soft active:scale-[0.99] disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Navigation className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-emerald-900">
                  {status === "loading" ? "Finding you…"
                    : status === "denied" ? "Location blocked"
                    : status === "unavailable" ? "Location unavailable"
                    : "See who's closest to you"}
                </div>
                <div className="text-[11px] text-emerald-800/80">
                  {status === "denied"
                    ? "Enable location in your browser settings to sort by nearest."
                    : "Share your location to sort providers by distance."}
                </div>
              </div>
            </div>
            {status === "prompt" && (
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white">
                Use my location
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setSortByNearby((v) => !v)}
            className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-soft transition ${
              sortByNearby
                ? "bg-emerald-600 text-white"
                : "border border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            {sortByNearby ? "Sorted by nearest" : "Sort by nearest"}
          </button>
        )}

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            {items.length} {items.length === 1 ? "listing" : "listings"}
            {activeFilter && activeFilter !== "More" && (
              <span className="ml-1 font-normal text-muted-foreground">
                · {activeFilter}
              </span>
            )}
          </h2>
          <span className="text-xs text-muted-foreground">Verified providers</span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-bold">No matches</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different filter or clear your search.
            </p>
            {(activeFilter || query) && (
              <button
                onClick={() => {
                  setActiveFilter(null);
                  setQuery("");
                }}
                className="mt-3 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        )}
      </section>
    </AppShell>
  );
}
