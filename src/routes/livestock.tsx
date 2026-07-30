import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft, Search, MapPin, BadgeCheck, Phone, MessageCircle, Mail,
  ShieldCheck, ChevronRight, Plus, Heart, HeartHandshake, Headphones, Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  ANIMAL_TYPES, ANIMAL_LISTINGS, LIVESTOCK_SERVICES, LIVESTOCK_LOCATIONS,
} from "@/data/livestock";
import { whatsappLink, telLink } from "@/lib/contact";

const SUPPORT_WA = "252611234567";
const SUPPORT_PHONE = "+252611234567";
const SUPPORT_EMAIL = "info@maalsoorhub.com";

export const Route = createFileRoute("/livestock")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/livestock";
    const title = "Animal Market — Buy & Sell Livestock | MaalsoorHub";
    const description = "Buy or sell cattle, goats, sheep, camels, poultry and pets from verified sellers across Somalia. Healthy animals, fair prices.";
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
              numberOfItems: ANIMAL_LISTINGS.length,
              itemListElement: ANIMAL_LISTINGS.slice(0, 20).map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.title,
                url: `https://market-link-somalia.lovable.app/livestock/${a.id}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: LivestockPage,
});

function LivestockPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const items = useMemo(
    () =>
      ANIMAL_LISTINGS.filter((a) => {
        if (type && a.type !== type) return false;
        if (city && a.city !== city) return false;
        if (q && !`${a.title} ${a.city} ${a.tag}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, type, city],
  );

  return (
    <AppShell>
      {/* HERO */}
      <header className="grad-livestock rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link to="/home" aria-label="Go back to home" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Animal Market</h1>
            <p className="truncate text-xs text-white/80">Buy & sell livestock & pets</p>
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold leading-tight">
          Buy or Sell Animals with Trusted Sellers Near You
        </h2>
        <p className="mt-1 text-xs text-white/85">
          Find healthy animals, compare listings and connect with verified sellers easily.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, t: "Verified Sellers", s: "Trusted & Verified" },
            { icon: Heart, t: "Healthy Animals", s: "Quality Checked" },
            { icon: Zap, t: "Wide Variety", s: "All Animal Types" },
          ].map(({ icon: Ic, t, s }) => (
            <div key={t} className="rounded-2xl bg-white/15 p-2.5 backdrop-blur">
              <Ic className="h-4 w-4" aria-hidden="true" />
              <div className="mt-1 text-[11px] font-semibold leading-tight">{t}</div>
              <div className="text-[10px] leading-tight text-white/80">{s}</div>
            </div>
          ))}
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Search animals"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search animals, breeds, categories…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </header>

      {/* SELL CTA */}
      <section className="px-4 pt-5">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground">Are You Selling Animals?</div>
            <p className="mt-0.5 text-xs text-muted-foreground">List your animals and connect with serious buyers.</p>
          </div>
          <Link
            to="/post"
            className="ml-3 inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> List
          </Link>
        </div>
      </section>

      {/* BROWSE BY ANIMAL TYPE */}
      <section className="px-4 pt-5">
        <SectionHeader title="Browse by Animal Type" actionLabel={type ? "Clear" : undefined} onAction={() => setType(null)} />
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ANIMAL_TYPES.map((a) => {
            const Ic = a.icon;
            const active = type === a.key;
            return (
              <button
                key={a.key}
                onClick={() => setType(active ? null : a.key)}
                aria-pressed={active}
                className="flex w-20 flex-shrink-0 flex-col items-center gap-1.5"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft transition-all ${active ? "bg-primary ring-2 ring-primary/30" : "bg-card border border-border"}`}>
                  <Ic className={`h-6 w-6 ${active ? "text-primary-foreground" : "text-primary"}`} />
                </span>
                <span className={`text-center text-[11px] font-medium ${active ? "text-primary" : "text-foreground"}`}>{a.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="px-4 pt-6">
        <SectionHeader title="Featured Listings" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {items.length === 0 ? (
            <div className="col-span-2 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No animals match your filters.
            </div>
          ) : (
            items.map((a) => <AnimalCard key={a.id} a={a} />)
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="px-4 pt-6">
        <SectionHeader title="Why Use MaalsoorHub Animal Market?" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { icon: ShieldCheck, t: "Verified Sellers", s: "All sellers are verified for your safety." },
            { icon: Heart, t: "Healthy Animals", s: "Quality checked for better results." },
            { icon: MessageCircle, t: "Direct Connection", s: "Talk directly with sellers." },
            { icon: HeartHandshake, t: "Local Support", s: "We support you every step." },
          ].map(({ icon: Ic, t, s }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-3">
              <Ic className="h-5 w-5 text-primary" />
              <div className="mt-1.5 text-xs font-bold">{t}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR LOCATIONS */}
      <section className="px-4 pt-6">
        <SectionHeader title="Popular Locations" actionLabel={city ? "Clear" : undefined} onAction={() => setCity(null)} />
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LIVESTOCK_LOCATIONS.map((l) => {
            const active = city === l.city;
            return (
              <button
                key={l.city}
                onClick={() => setCity(active ? null : l.city)}
                className={`w-28 flex-shrink-0 overflow-hidden rounded-2xl border bg-card text-left shadow-soft ${active ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
              >
                <img src={l.image} alt="" className="h-16 w-full object-cover" loading="lazy" />
                <div className="px-2 py-2">
                  <div className={`text-xs font-bold ${active ? "text-primary" : ""}`}>{l.city}</div>
                  <div className="text-[10px] text-muted-foreground">{l.count} Listings</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="px-4 pt-6">
        <SectionHeader title="Popular Livestock Services" />
        <div className="mt-3 space-y-2">
          {LIVESTOCK_SERVICES.map((s) => {
            const Ic = s.icon;
            return (
              <a
                key={s.id}
                href={whatsappLink(SUPPORT_WA, `Hello MaalsoorHub, I'm interested in: ${s.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft hover:border-primary/40"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}>
                  <Ic className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.subtitle}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 pt-6">
        <SectionHeader title="How It Works" />
        <div className="mt-3 space-y-2">
          {[
            { n: 1, t: "Search Animals", s: "Find the animal you need." },
            { n: 2, t: "Connect with Seller", s: "Talk directly and ask questions." },
            { n: 3, t: "Meet & Verify", s: "Check the animal and agree." },
            { n: 4, t: "Complete Deal", s: "Make a safe and happy deal." },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                {s.n}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY TIP */}
      <section className="px-4 pt-6">
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-4">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary" />
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground">Safety Tips</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Always meet in safe locations, verify the animal and seller before making any agreement.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="px-4 pb-8 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="text-sm font-bold">Talk to Our Animal Experts</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            We connect you with trusted sellers and livestock experts.
          </p>
          <div className="mt-3 space-y-2">
            <a href={whatsappLink(SUPPORT_WA, "Hello, I need help on the Animal Market.")} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-whatsapp/10 px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-[hsl(142_70%_38%)]">
                <MessageCircle className="h-4 w-4" /> WhatsApp · Chat with us
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a href={telLink(SUPPORT_PHONE)} className="flex items-center justify-between rounded-xl bg-primary-soft px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Phone className="h-4 w-4" /> Call · {SUPPORT_PHONE}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Trusted Platform</div>
            <div className="flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5 text-primary" /> 24/7 Support</div>
            <div className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> Secure & Safe</div>
            <div className="flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5 text-primary" /> Community Driven</div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {actionLabel && (
        <button onClick={onAction} className="text-xs font-semibold text-primary">{actionLabel}</button>
      )}
    </div>
  );
}

function AnimalCard({ a }: { a: (typeof ANIMAL_LISTINGS)[number] }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:shadow-card">
      <Link to="/livestock/$id" params={{ id: a.id }} className="block">
        <div className="relative">
          <img src={a.image} alt={a.title} className="h-32 w-full object-cover" loading="lazy" />
          {a.featured && (
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              FEATURED
            </span>
          )}
        </div>
        <div className="p-2.5">
          <div className="text-xs font-bold text-foreground line-clamp-1">{a.title}</div>
          <div className="mt-0.5 text-sm font-bold text-primary">${a.price}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> <span className="line-clamp-1">{a.district}, {a.city}</span>
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
            {a.age} · {a.gender}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">
              {a.tag}
            </span>
            {a.sellerVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
          </div>
        </div>
      </Link>
      <div className="px-2.5 pb-2.5">
        <a
          href={whatsappLink(a.whatsapp, `Hello, is the ${a.title} still available?`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 rounded-xl bg-primary py-1.5 text-[11px] font-semibold text-primary-foreground active:scale-[0.98]"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Chat with Seller
        </a>
      </div>
    </article>
  );
}

