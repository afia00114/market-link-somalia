import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Search, PackageOpen, Wrench, Zap, Sparkles, Snowflake,
  PaintBucket, Hammer, Brush, Truck, Car as CarIcon, Wheat, Briefcase,
  Landmark, UtensilsCrossed, Stethoscope, Plane, Home as HomeIcon, MoreHorizontal,
  X, type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CATEGORIES, type CategoryKey } from "@/data/categories";
import { ListingCard } from "@/components/ListingCard";
import { listingsByCategory } from "@/data/listings";

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
});

function CategoryPage() {
  const { key } = useParams({ from: "/category/$key" });
  const cat = CATEGORIES.find((c) => c.key === (key as CategoryKey));
  const items = cat ? listingsByCategory(cat.key) : [];
  const popular = POPULAR[key as string];

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
            placeholder={`Search in ${cat?.label ?? "category"}…`}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      {popular && (
        <section className="px-4 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Most popular</h2>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Browse by type
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {popular.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.label}
                  className="group flex flex-col items-center gap-1.5 active:scale-95 transition"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.tone} shadow-soft ring-1 ring-border/40 group-hover:shadow-card transition`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-foreground text-center line-clamp-1">
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="px-4 pt-4 pb-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            {items.length} {items.length === 1 ? "listing" : "listings"}
          </h2>
          <span className="text-xs text-muted-foreground">Verified providers</span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-bold">No listings yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Verified providers in this category will appear here soon.
            </p>
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
