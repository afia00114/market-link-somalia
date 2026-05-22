import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import {
  ArrowLeft, Search, MapPin, Star, BadgeCheck, Phone, MessageCircle, Mail,
  ShieldCheck, Headphones, Zap, HeartHandshake, ChevronRight, CalendarCheck,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  HOSPITALS, DEPARTMENTS, HEALTH_PACKAGES, POPULAR_LOCATIONS,
} from "@/data/health";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/health")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/health";
    const title = "Health & Medical — MaalsoorHub";
    const description = "Find verified hospitals, clinics and health services across Somalia. Connect via WhatsApp, call or email.";
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
              numberOfItems: HOSPITALS.length,
              itemListElement: HOSPITALS.slice(0, 20).map((h, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: h.name,
                url: `https://market-link-somalia.lovable.app/health/${h.id}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: HealthPage,
});

type Tab = "All" | "24/7" | "Nearby" | "Multi-Specialty";
const TABS: Tab[] = ["All", "24/7", "Nearby", "Multi-Specialty"];

const SUPPORT_WA = "252611234567";
const SUPPORT_PHONE = "+252611234567";
const SUPPORT_EMAIL = "info@maalsoorhub.com";

function HealthPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("All");
  const [dept, setDept] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      HOSPITALS.filter((h) => {
        if (tab === "24/7" && !h.open24) return false;
        if (tab === "Multi-Specialty" && !h.type.toLowerCase().includes("multi")) return false;
        if (dept && !h.departments.includes(dept)) return false;
        if (city && h.city !== city) return false;
        if (q && !`${h.name} ${h.city} ${h.district} ${h.services.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, tab, dept, city],
  );

  const hasFilters = tab !== "All" || dept !== null || city !== null || q.length > 0;

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setTab("All");
    setDept(null);
    setCity(null);
    setQ("");
  };

  return (
    <AppShell>
      {/* HERO */}
      <header className="grad-hero rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link to="/home" aria-label="Go back to home" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-colors hover:bg-white/30">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Health & Medical</h1>
            <p className="truncate text-xs text-white/80">Hospitals, clinics & specialists</p>
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold leading-tight">
          Find the Best Hospitals & Healthcare Near You
        </h2>
        <p className="mt-1 text-xs text-white/80">
          Search, compare and connect with trusted hospitals across Somalia.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, t: "Verified", s: "Trusted & Certified" },
            { icon: Phone, t: "Easy Contact", s: "Call · WhatsApp · Email" },
            { icon: Zap, t: "Fast & Reliable", s: "Care you can trust" },
          ].map(({ icon: Ic, t, s }) => (
            <div key={t} className="rounded-2xl bg-white/15 p-2.5 backdrop-blur">
              <Ic className="h-4 w-4" aria-hidden="true" />
              <div className="mt-1 text-[11px] font-semibold leading-tight">{t}</div>
              <div className="text-[10px] leading-tight text-white/80">{s}</div>
            </div>
          ))}
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-white/50">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            aria-label="Search hospitals, clinics, departments"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search hospitals, clinics, departments…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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

      {/* DEPARTMENTS */}
      <section className="px-4 pt-5" aria-labelledby="dept-heading">
        <SectionHeader id="dept-heading" title="Browse by Department" actionLabel={dept ? "Clear" : undefined} onAction={() => setDept(null)} />
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DEPARTMENTS.map((d) => {
            const Ic = d.icon;
            const active = dept === d.key;
            return (
              <button
                key={d.key}
                onClick={() => {
                  setDept(active ? null : d.key);
                  if (!active) scrollToResults();
                }}
                aria-pressed={active}
                aria-label={`Filter by ${d.label}`}
                className="flex w-20 flex-shrink-0 flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft transition-all ${
                    active ? "bg-primary ring-2 ring-primary/30" : "bg-card"
                  }`}
                >
                  <Ic className={`h-6 w-6 ${active ? "text-primary-foreground" : d.tone}`} aria-hidden="true" />
                </span>
                <span className={`text-center text-[11px] font-medium ${active ? "text-primary" : "text-foreground"}`}>
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* BOOK APPOINTMENT CTA */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-card">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20" aria-hidden="true">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">Book an Appointment</div>
              <p className="mt-0.5 text-xs text-white/85">
                Reach a verified hospital and request a time that works for you.
              </p>
              <a
                href={whatsappLink(SUPPORT_WA, "Hello MaalsoorHub, I'd like to request a hospital appointment.")}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-xs font-semibold text-primary transition-transform active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" /> Request Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TOP HOSPITALS */}
      <section className="px-4 pt-5" aria-labelledby="hospitals-heading">
        <SectionHeader id="hospitals-heading" title="Top Hospitals" />

        <div
          role="tablist"
          aria-label="Hospital filters"
          className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">
              {items.length} result{items.length === 1 ? "" : "s"}
            </span>
            {dept && (
              <FilterChip
                label={DEPARTMENTS.find((d) => d.key === dept)?.label ?? dept}
                onClear={() => setDept(null)}
              />
            )}
            {city && <FilterChip label={city} onClear={() => setCity(null)} />}
            {tab !== "All" && <FilterChip label={tab} onClear={() => setTab("All")} />}
            {q && <FilterChip label={`"${q}"`} onClear={() => setQ("")} />}
            <button
              onClick={clearFilters}
              className="ml-auto text-[11px] font-semibold text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div ref={resultsRef} className="mt-3 space-y-3 scroll-mt-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">No hospitals match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-3 inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Reset filters
              </button>
            </div>
          ) : (
            items.map((h) => <HospitalCard key={h.id} h={h} />)
          )}
        </div>
      </section>

      {/* HEALTH PACKAGES */}
      <section className="px-4 pt-6" aria-labelledby="packages-heading">
        <SectionHeader id="packages-heading" title="Featured Health Packages" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {HEALTH_PACKAGES.map((p) => {
            const Ic = p.icon;
            return (
              <a
                key={p.id}
                href={whatsappLink(SUPPORT_WA, `Hello MaalsoorHub, I'm interested in the "${p.title}" package (${p.price}).`)}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:border-primary/40 hover:shadow-card active:scale-[0.98]"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${p.tone}`} aria-hidden="true">
                  <Ic className="h-4 w-4" />
                </span>
                <div className="mt-2 text-sm font-bold">{p.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.description}</div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{p.price}</span>
                  <span className="text-[10px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Inquire →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* POPULAR LOCATIONS */}
      <section className="px-4 pt-6" aria-labelledby="locations-heading">
        <SectionHeader id="locations-heading" title="Popular Locations" actionLabel={city ? "Clear" : undefined} onAction={() => setCity(null)} />
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {POPULAR_LOCATIONS.map((l) => {
            const active = city === l.city;
            return (
              <button
                key={l.city}
                onClick={() => {
                  setCity(active ? null : l.city);
                  if (!active) scrollToResults();
                }}
                aria-pressed={active}
                aria-label={`Filter hospitals in ${l.city}`}
                className={`w-28 flex-shrink-0 overflow-hidden rounded-2xl border bg-card text-left shadow-soft transition-all ${
                  active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                }`}
              >
                <img src={l.image} alt="" className="h-16 w-full object-cover" loading="lazy" />
                <div className="px-2 py-2">
                  <div className={`text-xs font-bold ${active ? "text-primary" : ""}`}>{l.city}</div>
                  <div className="text-[10px] text-muted-foreground">{l.count} Hospitals</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* WHY US */}
      <section className="px-4 pt-6" aria-labelledby="why-heading">
        <SectionHeader id="why-heading" title="Why Choose MaalsoorHub?" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { icon: ShieldCheck, t: "Verified Hospitals", s: "All hospitals are verified and trusted." },
            { icon: MessageCircle, t: "Easy Communication", s: "Contact via call, WhatsApp or email." },
            { icon: HeartHandshake, t: "Compare & Choose", s: "Compare hospitals, services and reviews." },
            { icon: Headphones, t: "24/7 Support", s: "We are here to help you anytime." },
          ].map(({ icon: Ic, t, s }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-3">
              <Ic className="h-5 w-5 text-primary" aria-hidden="true" />
              <div className="mt-1.5 text-xs font-bold">{t}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section className="px-4 pb-8 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="text-sm font-bold">Talk to Our Support Team</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            We help you find the right hospital or service.
          </p>
          <div className="mt-3 space-y-2">
            <a
              href={whatsappLink(SUPPORT_WA, "Hello, I need help finding a hospital on MaalsoorHub.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-whatsapp/10 px-3 py-2.5 transition-colors hover:bg-whatsapp/20"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-[hsl(142_70%_38%)]">
                <MessageCircle className="h-4 w-4" /> WhatsApp · Chat with us
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href={telLink(SUPPORT_PHONE)}
              className="flex items-center justify-between rounded-xl bg-primary-soft px-3 py-2.5 transition-opacity hover:opacity-90"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Phone className="h-4 w-4" /> Call · +252 61 123 4567
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5 transition-opacity hover:opacity-90"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Mail className="h-4 w-4" /> Email · {SUPPORT_EMAIL}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({
  id,
  title,
  actionLabel,
  onAction,
}: {
  id?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 id={id} className="text-sm font-bold text-foreground">{title}</h3>
      {actionLabel && (
        <button onClick={onAction} className="text-xs font-semibold text-primary hover:underline">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
      {label}
      <button
        onClick={onClear}
        aria-label={`Remove ${label} filter`}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary/20"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

function HospitalCard({ h }: { h: typeof HOSPITALS[number] }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-card">
      <Link to="/health/$id" params={{ id: h.id }} className="block">
        <div className="flex gap-3 p-3">
          <img src={h.image} alt="" loading="lazy" className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="truncate text-sm font-bold">{h.name}</h4>
                  {h.verified && <BadgeCheck className="h-4 w-4 flex-shrink-0 text-primary" aria-label="Verified" />}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-current text-accent" aria-hidden="true" /> {h.rating} ({h.reviews})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{h.type}</span>
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" /> {h.district}, {h.city}
                </div>
              </div>
              {h.open24 && (
                <span className="flex-shrink-0 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  24/7 Open
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {h.services.slice(0, 3).map((s) => (
                <span key={s} className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
      <div className="grid grid-cols-3 border-t border-border">
        <a
          href={telLink(h.phone)}
          aria-label={`Call ${h.name}`}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:bg-secondary"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={whatsappLink(h.whatsapp, `Hello ${h.name}, I'd like to make an inquiry from MaalsoorHub.`)}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${h.name}`}
          className="flex items-center justify-center gap-1.5 border-x border-border py-2.5 text-xs font-semibold text-[hsl(142_70%_38%)] hover:bg-secondary"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={`mailto:${h.email}`}
          aria-label={`Email ${h.name}`}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
        >
          <Mail className="h-4 w-4" /> Email
        </a>
      </div>
    </article>
  );
}
