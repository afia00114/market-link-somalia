import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft, Search, MapPin, Star, BadgeCheck, Phone, MessageCircle, Mail,
  ShieldCheck, Headphones, Zap, HeartHandshake, ChevronRight, CalendarCheck,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  HOSPITALS, DEPARTMENTS, HEALTH_PACKAGES, POPULAR_LOCATIONS,
} from "@/data/health";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health & Medical — MaalsoorHub" },
      { name: "description", content: "Find verified hospitals, clinics and health services across Somalia. Connect via WhatsApp, call or email." },
      { property: "og:title", content: "Health & Medical — MaalsoorHub" },
      { property: "og:description", content: "Verified hospitals, clinics and health services across Somalia." },
    ],
  }),
  component: HealthPage,
});

type Tab = "All" | "24/7" | "Nearby" | "Multi-Specialty";
const TABS: Tab[] = ["All", "24/7", "Nearby", "Multi-Specialty"];

function HealthPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("All");

  const items = useMemo(
    () =>
      HOSPITALS.filter((h) => {
        if (tab === "24/7" && !h.open24) return false;
        if (tab === "Multi-Specialty" && !h.type.toLowerCase().includes("multi")) return false;
        if (q && !`${h.name} ${h.city} ${h.district}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, tab],
  );

  return (
    <AppShell>
      {/* HERO */}
      <header className="grad-hero rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Health & Medical</h1>
            <p className="truncate text-xs text-white/80">Hospitals, clinics & specialists</p>
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold leading-tight">
          Find the Best Hospitals & Healthcare Services Near You
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
              <Ic className="h-4 w-4" />
              <div className="mt-1 text-[11px] font-semibold leading-tight">{t}</div>
              <div className="text-[10px] leading-tight text-white/80">{s}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search hospitals, clinics, departments…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      {/* DEPARTMENTS */}
      <section className="px-4 pt-5">
        <SectionHeader title="Browse by Department" actionLabel="View all" />
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DEPARTMENTS.map((d) => {
            const Ic = d.icon;
            return (
              <button
                key={d.key}
                className="flex w-20 flex-shrink-0 flex-col items-center gap-1.5"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-soft">
                  <Ic className={`h-6 w-6 ${d.tone}`} />
                </span>
                <span className="text-center text-[11px] font-medium text-foreground">{d.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* BOOK APPOINTMENT CTA */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-card">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">Book Appointment</div>
              <p className="mt-0.5 text-xs text-white/85">
                Book an appointment with your preferred hospital easily.
              </p>
              <button className="mt-3 w-full rounded-xl bg-white py-2 text-xs font-semibold text-primary">
                Request Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TOP HOSPITALS */}
      <section className="px-4 pt-5">
        <SectionHeader title="Top Hospitals" actionLabel="View all" />

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

        <div className="mt-3 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No hospitals match your filters.
            </div>
          ) : (
            items.map((h) => <HospitalCard key={h.id} h={h} />)
          )}
        </div>
      </section>

      {/* HEALTH PACKAGES */}
      <section className="px-4 pt-6">
        <SectionHeader title="Featured Health Packages" actionLabel="View all" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {HEALTH_PACKAGES.map((p) => {
            const Ic = p.icon;
            return (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${p.tone}`}>
                  <Ic className="h-4 w-4" />
                </span>
                <div className="mt-2 text-sm font-bold">{p.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.description}</div>
                <div className="mt-1.5 text-sm font-bold text-primary">{p.price}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR LOCATIONS */}
      <section className="px-4 pt-6">
        <SectionHeader title="Popular Locations" actionLabel="View all" />
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {POPULAR_LOCATIONS.map((l) => (
            <div key={l.city} className="w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <img src={l.image} alt={l.city} className="h-16 w-full object-cover" loading="lazy" />
              <div className="px-2 py-2">
                <div className="text-xs font-bold">{l.city}</div>
                <div className="text-[10px] text-muted-foreground">{l.count} Hospitals</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="px-4 pt-6">
        <SectionHeader title="Why Choose MaalsoorHub?" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { icon: ShieldCheck, t: "Verified Hospitals", s: "All hospitals are verified and trusted." },
            { icon: MessageCircle, t: "Easy Communication", s: "Contact via call, WhatsApp or email." },
            { icon: HeartHandshake, t: "Compare & Choose", s: "Compare hospitals, services and reviews." },
            { icon: Headphones, t: "24/7 Support", s: "We are here to help you anytime." },
          ].map(({ icon: Ic, t, s }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-3">
              <Ic className="h-5 w-5 text-primary" />
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
              href={whatsappLink("252611234567", "Hello, I need help finding a hospital on MaalsoorHub.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-whatsapp/10 px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-[hsl(142_70%_38%)]">
                <MessageCircle className="h-4 w-4" /> WhatsApp · Chat with us
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href={telLink("+252611234567")}
              className="flex items-center justify-between rounded-xl bg-primary-soft px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Phone className="h-4 w-4" /> Call · +252 61 123 4567
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="mailto:info@maalsoorhub.com"
              className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Mail className="h-4 w-4" /> Email · info@maalsoorhub.com
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {actionLabel && (
        <button className="text-xs font-semibold text-primary">{actionLabel}</button>
      )}
    </div>
  );
}

function HospitalCard({ h }: { h: typeof HOSPITALS[number] }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <Link to="/health/$id" params={{ id: h.id }} className="block">
        <div className="flex gap-3 p-3">
          <img src={h.image} alt={h.name} loading="lazy" className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="truncate text-sm font-bold">{h.name}</h4>
                  {h.verified && <BadgeCheck className="h-4 w-4 flex-shrink-0 text-primary" />}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-current text-accent" /> {h.rating} ({h.reviews})
                  </span>
                  <span>·</span>
                  <span className="truncate">{h.type}</span>
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {h.district}, {h.city}
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
        <a href={telLink(h.phone)} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:bg-secondary">
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={whatsappLink(h.whatsapp, `Hello ${h.name}, I'd like to make an inquiry from MaalsoorHub.`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 border-x border-border py-2.5 text-xs font-semibold text-[hsl(142_70%_38%)] hover:bg-secondary"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a href={`mailto:${h.email}`} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary">
          <Mail className="h-4 w-4" /> Email
        </a>
      </div>
    </article>
  );
}
