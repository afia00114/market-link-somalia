import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Search, MapPin, Star, BadgeCheck, Bike, Clock, ChevronRight, UtensilsCrossed,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RESTAURANTS, RESTAURANT_CITIES, MENU_CATEGORIES } from "@/data/restaurants";

export const Route = createFileRoute("/restaurants/")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/restaurants";
    const title = "Restaurants & Food Delivery in Somalia | MaalsoorHub";
    const description =
      "Order food from restaurants in Mogadishu, Hargeisa, Kismayo and Bosaso. Browse menus, add to cart and get delivery straight to your door.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
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
              numberOfItems: RESTAURANTS.length,
              itemListElement: RESTAURANTS.slice(0, 20).map((r, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: r.name,
                url: `https://market-link-somalia.lovable.app/restaurants/${r.id}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);

  const items = useMemo(
    () =>
      RESTAURANTS.filter((r) => {
        if (city && r.city !== city) return false;
        if (cat && !r.menu.some((m) => m.category === cat)) return false;
        if (q && !`${r.name} ${r.cuisine} ${r.city} ${r.district}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        return true;
      }),
    [q, city, cat],
  );

  return (
    <AppShell>
      <header className="grad-food rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            aria-label="Go back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Restaurants</h1>
            <p className="truncate text-xs text-white/80">Order food, delivered to you</p>
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold leading-tight">Good Food. Good Mood.</h2>
        <p className="mt-1 text-xs text-white/85">
          Browse menus, add dishes to your cart and confirm delivery on WhatsApp.
        </p>

        <label className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Search restaurants"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search restaurant or cuisine"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </header>

      {/* Food categories */}
      <section className="px-4 pt-5">
        <h3 className="mb-2 text-sm font-bold">What are you craving?</h3>
        <div className="grid grid-cols-3 gap-2">
          {MENU_CATEGORIES.map(({ key, label, icon: Icon }) => {
            const active = cat === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setCat(active ? null : key)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition ${
                  active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-[11px] font-semibold leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* City chips */}
      <section className="px-4 pt-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!city} onClick={() => setCity(null)}>All cities</Chip>
          {RESTAURANT_CITIES.map((c) => (
            <Chip key={c} active={city === c} onClick={() => setCity(city === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
      </section>

      {/* List */}
      <section className="px-4 pb-8 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold">{items.length} restaurant{items.length === 1 ? "" : "s"}</h3>
          {(city || cat || q) && (
            <button
              type="button"
              onClick={() => {
                setCity(null);
                setCat(null);
                setQ("");
              }}
              className="text-[12px] font-semibold text-primary"
            >
              Reset
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <UtensilsCrossed className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-semibold">No restaurants match your filters</p>
            <p className="text-xs text-muted-foreground">Try another city or food category.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((r) => (
              <li key={r.id}>
                <Link
                  to="/restaurants/$id"
                  params={{ id: r.id }}
                  className="block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition active:scale-[0.99]"
                >
                  <img
                    src={r.image}
                    alt={`${r.name} restaurant in ${r.city}`}
                    loading="lazy"
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="truncate text-sm font-bold">{r.name}</span>
                          {r.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                        </div>
                        <div className="truncate text-[12px] text-muted-foreground">{r.cuisine}</div>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[11px] font-bold">
                        <Star className="h-3 w-3 fill-current text-amber-500" />
                        {r.rating}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {r.district}, {r.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {r.deliveryMins}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bike className="h-3.5 w-3.5" />
                        ${r.deliveryFee.toFixed(2)} delivery
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-end text-[12px] font-semibold text-primary">
                      View menu <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
      }`}
    >
      {children}
    </button>
  );
}
