import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Heart, BadgeCheck, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HOTELS, type Hotel } from "@/data/hotels";

type Tab = "All" | "Near me" | "Top Rated" | "Featured";
const TABS: Tab[] = ["All", "Near me", "Top Rated", "Featured"];

export const Route = createFileRoute("/hotels/")({
  head: () => ({
    meta: [
      { title: "Hotels — MaalsoorHub" },
      { name: "description", content: "Discover hotels, view rooms, and book directly via WhatsApp or call." },
    ],
  }),
  component: HotelsPage,
});

function matchTab(h: Hotel, tab: Tab) {
  if (tab === "All") return true;
  if (tab === "Near me") return h.tags?.includes("near-me");
  if (tab === "Top Rated") return h.rating >= 4.4;
  if (tab === "Featured") return !!h.featured;
}

function HotelsPage() {
  const [tab, setTab] = useState<Tab>("All");
  const [q, setQ] = useState("");

  const items = HOTELS.filter(
    (h) => matchTab(h, tab) && h.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/home" aria-label="Go back" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-base font-bold">Hotels</h1>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-secondary px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              aria-label="Search hotels"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hotels…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button aria-label="Filter results" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <section className="space-y-3 px-4 pt-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No hotels match your filters.
          </div>
        ) : (
          items.map((h) => <HotelListCard key={h.id} h={h} />)
        )}
      </section>
    </AppShell>
  );
}

function HotelListCard({ h }: { h: Hotel }) {
  return (
    <Link
      to="/hotels/$id"
      params={{ id: h.id }}
      className="block overflow-hidden rounded-2xl border border-border bg-card shadow-soft active:scale-[0.99]"
    >
      <div className="relative h-44 w-full">
        <img src={h.image} alt={h.name} className="h-full w-full object-cover" loading="lazy" />
        {h.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
            Featured
          </span>
        )}
        <button
          aria-label="Save"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
        >
          <Heart className="h-4 w-4 text-foreground" />
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 text-sm font-bold text-foreground">
          {h.name}
          {h.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-semibold text-foreground">{h.rating}</span>
          <span>({h.reviews})</span>
        </div>
        <div className="mt-1 flex items-end justify-between">
          <span className="text-xs text-muted-foreground">{h.city}, {h.region}</span>
          <span className="text-sm font-bold text-primary">
            ${h.pricePerNight}<span className="text-xs font-medium text-muted-foreground">/night</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
