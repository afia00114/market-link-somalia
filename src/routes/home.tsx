import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronDown, MapPin, Search, BadgeCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CategoryCard } from "@/components/CategoryCard";
import { PropertyCard } from "@/components/PropertyCard";
import { CATEGORIES } from "@/data/categories";
import { PROPERTIES } from "@/data/properties";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "MaalsoorHub — Home" },
      { name: "description", content: "Browse verified businesses, real estate, and services across Somalia and East Africa." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = PROPERTIES.slice(0, 3);
  return (
    <AppShell>
      <header className="grad-hero px-4 pb-6 pt-5 text-white rounded-b-3xl shadow-card">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1 text-sm font-medium">
            <MapPin className="h-4 w-4" /> Mogadishu <ChevronDown className="h-4 w-4" />
          </button>
          <button aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
        <h1 className="mt-4 text-xl font-bold leading-tight">Find. Connect. WhatsApp.</h1>
        <p className="mt-1 text-xs text-white/80">Connect with trusted providers near you.</p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search properties, services, jobs…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <section className="px-4 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((c) => <CategoryCard key={c.key} category={c} />)}
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Featured Listings</h2>
          <Link to="/real-estate" className="text-xs font-semibold text-primary">See all</Link>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((p) => (
            <div key={p.id} className="w-64 flex-shrink-0">
              <PropertyCard p={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Verified Businesses</h2>
        </div>
        <div className="space-y-2">
          {[
            { name: "Hodan Realty", type: "Real Estate Agency", rating: 4.8 },
            { name: "Fast Plumbing Solutions", type: "Plumbing Services", rating: 4.8 },
            { name: "Coastline Developers", type: "Property Developer", rating: 4.9 },
          ].map((b) => (
            <div key={b.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
              <div className="grad-hero flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold">
                {b.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  {b.name} <BadgeCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">{b.type} · ⭐ {b.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
