import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Search, PackageOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CATEGORIES, type CategoryKey } from "@/data/categories";
import { ListingCard } from "@/components/ListingCard";
import { listingsByCategory } from "@/data/listings";

export const Route = createFileRoute("/category/$key")({
  component: CategoryPage,
});

function CategoryPage() {
  const { key } = useParams({ from: "/category/$key" });
  const cat = CATEGORIES.find((c) => c.key === (key as CategoryKey));
  const items = cat ? listingsByCategory(cat.key) : [];

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
