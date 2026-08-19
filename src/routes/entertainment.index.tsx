import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Heart, Trophy, Ticket, Clapperboard, X, MapPin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EntVenueCard } from "@/components/entertainment/EntVenueCard";
import { ENT_CITIES, ENT_EVENTS, ENT_SUBCATEGORIES, ENT_VENUES, TOURNAMENTS, type EntSubKey } from "@/data/entertainment";
import { useFavorites } from "@/lib/entertainment-store";

const URL = "https://market-link-somalia.lovable.app/entertainment";

export const Route = createFileRoute("/entertainment/")({
  head: () => {
    const title = "Entertainment in Somalia — Futsal, Stadiums, Events & Cinema | MaalsoorHub";
    const description =
      "Book futsal pitches and stadiums, join tournaments, buy event and cinema tickets, and find kids, gaming and recreation venues across Mogadishu, Hargeisa and Bosaso.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: URL },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: URL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: URL,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: ENT_VENUES.length,
              itemListElement: ENT_VENUES.map((v, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: v.name,
                url: `${URL}/venues/${v.id}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: EntertainmentPage,
});

function EntertainmentPage() {
  const [q, setQ] = useState("");
  const [sub, setSub] = useState<EntSubKey | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favOnly, setFavOnly] = useState(false);
  const { favs } = useFavorites();

  const results = useMemo(
    () =>
      ENT_VENUES.filter((v) => {
        if (sub && v.sub !== sub) return false;
        if (city && v.city !== city) return false;
        if (verifiedOnly && !v.verified) return false;
        if (minRating && v.rating < minRating) return false;
        if (favOnly && !favs.includes(v.id)) return false;
        if (q && !`${v.name} ${v.city} ${v.district} ${v.about}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, sub, city, verifiedOnly, minRating, favOnly, favs],
  );

  const activeCount = [sub, city, verifiedOnly ? "v" : null, minRating ? "r" : null, favOnly ? "f" : null].filter(Boolean).length;
  const featured = ENT_VENUES.filter((v) => v.featured);
  const popular = ENT_VENUES.filter((v) => v.popular);
  const upcoming = [...ENT_EVENTS].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AppShell>
      <header className="grad-entertainment rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            aria-label="Back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-tight">Entertainment</h1>
            <p className="text-xs text-white/85">Pitches, stadiums, tournaments, events & fun</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2.5 text-foreground">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search entertainment venues"
              placeholder="Search venue, sport or district…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold">
                {activeCount}
              </span>
            )}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-white/85">
          <MapPin className="h-3.5 w-3.5" /> {city ?? "All of Somalia"}
        </div>
      </header>

      {showFilters && (
        <section className="mx-4 mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h2 className="text-sm font-bold text-foreground">Filters</h2>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">City</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {ENT_CITIES.map((c) => (
              <Chip key={c} active={city === c} onClick={() => setCity(city === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">Minimum rating</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {[0, 4, 4.5].map((r) => (
              <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>
                {r === 0 ? "Any" : `${r}+`}
              </Chip>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
              Verified only
            </Chip>
            <Chip active={favOnly} onClick={() => setFavOnly((v) => !v)}>
              <Heart className="mr-1 inline h-3 w-3" /> My favorites
            </Chip>
          </div>
        </section>
      )}

      {activeCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 px-4">
          {sub && <ActiveChip label={ENT_SUBCATEGORIES.find((s) => s.key === sub)?.label ?? sub} onClear={() => setSub(null)} />}
          {city && <ActiveChip label={city} onClear={() => setCity(null)} />}
          {verifiedOnly && <ActiveChip label="Verified" onClear={() => setVerifiedOnly(false)} />}
          {minRating > 0 && <ActiveChip label={`${minRating}+ rating`} onClear={() => setMinRating(0)} />}
          {favOnly && <ActiveChip label="Favorites" onClear={() => setFavOnly(false)} />}
          <button
            type="button"
            onClick={() => {
              setSub(null);
              setCity(null);
              setVerifiedOnly(false);
              setMinRating(0);
              setFavOnly(false);
            }}
            className="rounded-full px-2 py-1 text-xs font-bold text-primary underline"
          >
            Clear all
          </button>
        </div>
      )}

      <section className="mt-5 px-4">
        <h2 className="text-sm font-bold text-foreground">Browse by type</h2>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {ENT_SUBCATEGORIES.map((s) => {
            const to = s.key === "tournaments" ? null : s.key;
            const active = sub === s.key;
            return s.key === "tournaments" ? (
              <Link
                key={s.key}
                to="/entertainment/tournaments"
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-center shadow-soft active:scale-[0.98]"
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[11px] font-bold leading-tight text-foreground">{s.label}</span>
              </Link>
            ) : (
              <button
                key={s.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSub(active ? null : to)}
                className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center shadow-soft active:scale-[0.98] ${
                  active ? "border-primary bg-primary-soft" : "border-border bg-card"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[11px] font-bold leading-tight text-foreground">{s.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3 px-4">
        <Link
          to="/entertainment/tournaments"
          className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft active:scale-[0.99]"
        >
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="text-xs font-bold text-foreground">Tournaments</span>
        </Link>
        <Link
          to="/entertainment/bookings"
          className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft active:scale-[0.99]"
        >
          <Ticket className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground">My bookings</span>
        </Link>
      </div>

      {!q && !activeCount && (
        <>
          <Row title="Featured venues">
            {featured.map((v) => (
              <EntVenueCard key={v.id} v={v} compact />
            ))}
          </Row>
          <Row title="Popular right now">
            {popular.map((v) => (
              <EntVenueCard key={v.id} v={v} compact />
            ))}
          </Row>

          <section className="mt-6 px-4">
            <h2 className="text-sm font-bold text-foreground">Upcoming events & sessions</h2>
            <div className="mt-3 space-y-3">
              {upcoming.map((e) => (
                <Link
                  key={e.id}
                  to="/entertainment/events/$id"
                  params={{ id: e.id }}
                  className="flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft active:scale-[0.99]"
                >
                  <img src={e.image} alt={e.title} loading="lazy" className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-bold text-foreground">{e.title}</h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {e.venueName} · {e.district}, {e.city}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 font-bold text-primary">{e.date}</span>
                      <span className="text-muted-foreground">
                        from ${e.pricePerTicket}/{e.ticketLabel}
                      </span>
                      <span className="text-muted-foreground">
                        {e.sessions.reduce((s, x) => s + x.seatsLeft, 0)} places left
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-6 px-4">
            <h2 className="text-sm font-bold text-foreground">Recommended for you</h2>
            <div className="mt-3 space-y-3">
              {ENT_VENUES.filter((v) => v.rating >= 4.6)
                .slice(0, 3)
                .map((v) => (
                  <EntVenueCard key={v.id} v={v} />
                ))}
            </div>
          </section>
        </>
      )}

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            {activeCount || q ? "Results" : "All venues"}
          </h2>
          <span className="text-xs text-muted-foreground">{results.length} venues</span>
        </div>
        {results.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <Clapperboard className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-bold text-foreground">No venues match your filters</p>
            <p className="mt-1 text-xs text-muted-foreground">Try clearing a filter or searching a different district.</p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {results.map((v) => (
              <EntVenueCard key={v.id} v={v} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-4 mb-8 mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <h2 className="text-sm font-bold text-foreground">Own a venue or run tournaments?</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          List your pitch, stadium, cinema or play centre and manage bookings from your dashboard.
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            to="/vendor/entertainment"
            className="flex-1 rounded-xl bg-primary px-3 py-2.5 text-center text-xs font-bold text-primary-foreground"
          >
            Venue owner tools
          </Link>
          <Link
            to="/vendor/apply"
            className="flex-1 rounded-xl border border-border px-3 py-2.5 text-center text-xs font-bold text-foreground"
          >
            Apply as vendor
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="px-4 text-sm font-bold text-foreground">{title}</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1">{children}</div>
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
      {label}
      <button type="button" aria-label={`Clear ${label}`} onClick={onClear}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
