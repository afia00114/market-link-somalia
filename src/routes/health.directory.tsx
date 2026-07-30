import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, MapPin, Building2, X, Globe } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

type Hospital = {
  id: string;
  name: string;
  city: string;
  region: string | null;
  country: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
};

export const Route = createFileRoute("/health/directory")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/health/directory";
    const title = "Hospital Panel Directory — MaalsoorHub";
    const description =
      "Browse the full 2026 hospital panel directory: 197 hospitals and clinics across Somalia, Kenya, Ethiopia and India.";
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
            about: "Hospitals and clinics in Somalia, Kenya, Ethiopia and India",
          }),
        },
      ],
    };
  },
  component: DirectoryPage,
});

function DirectoryPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("All");
  const [city, setCity] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["hospitals-directory"],
    queryFn: async (): Promise<Hospital[]> => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("id,name,city,region,country,phone,whatsapp,email,website")
        .eq("is_published", true)
        .order("country", { ascending: true })
        .order("city", { ascending: true })
        .order("name", { ascending: true })
        .limit(500);
      if (error) throw error;
      return data as Hospital[];
    },
  });

  const countries = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((h) => set.add(h.country));
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    (data ?? [])
      .filter((h) => country === "All" || h.country === country)
      .forEach((h) => set.add(h.city));
    return Array.from(set).sort();
  }, [data, country]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((h) => {
      if (country !== "All" && h.country !== country) return false;
      if (city && h.city !== city) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${h.name} ${h.city} ${h.region ?? ""} ${h.country}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [data, country, city, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Hospital[]>();
    filtered.forEach((h) => {
      const key = `${h.city}, ${h.country}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(h);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const clearAll = () => {
    setQ("");
    setCountry("All");
    setCity(null);
  };

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/health"
            aria-label="Back to health"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Hospital Panel Directory</h1>
            <p className="truncate text-xs text-white/80">
              {isLoading ? "Loading…" : `${data?.length ?? 0} hospitals across the network`}
            </p>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, city or country…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search hospitals"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
      </header>

      {/* Country tabs */}
      <section className="px-4 pt-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {countries.map((c) => {
            const active = country === c;
            return (
              <button
                key={c}
                onClick={() => {
                  setCountry(c);
                  setCity(null);
                }}
                aria-pressed={active}
                className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* City chips */}
      {cities.length > 0 && (
        <section className="px-4 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {cities.map((c) => {
              const active = city === c;
              return (
                <button
                  key={c}
                  onClick={() => setCity(active ? null : c)}
                  aria-pressed={active}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <MapPin className="h-3 w-3" />
                  {c}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {(q || country !== "All" || city) && (
        <div className="px-4 pt-3 text-xs text-muted-foreground">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} ·{" "}
          <button onClick={clearAll} className="font-medium text-primary underline">
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      <section className="px-4 pb-24 pt-4">
        {error && (
          <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
            Couldn't load hospitals. Please try again.
          </div>
        )}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground">
            No hospitals match your filters.
            <div className="mt-3">
              <button onClick={clearAll} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                Reset filters
              </button>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {grouped.map(([place, items]) => (
            <div key={place}>
              <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {place} · {items.length}
              </h2>
              <ul className="overflow-hidden rounded-2xl bg-card shadow-soft">
                {items.map((h, idx) => (
                  <li
                    key={h.id}
                    className={`flex items-start gap-3 p-3 ${
                      idx !== items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground">{h.name}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {h.region ? `${h.region} · ` : ""}
                        {h.city}, {h.country}
                      </div>
                      {h.website && (
                        <a
                          href={h.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary"
                        >
                          <Globe className="h-3 w-3" /> Website
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
