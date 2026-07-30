import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Heart, Share2, MapPin, BedDouble, Bath, Maximize2,
  Car, BadgeCheck, Star, MessageCircle, Phone, CheckCircle2, Sofa,
  ShieldCheck, Calendar, X, FileText, Scale, Landmark, ScrollText,
  Wifi, Trees, Droplets, Zap, Wind, Lock, School, ShoppingBag,
  Hospital, Bus, Calculator,
} from "lucide-react";
import { PROPERTIES } from "@/data/properties";
import { formatPrice, telLink, whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const property = PROPERTIES.find((p) => p.id === params.id);
    if (!property) throw notFound();
    return property;
  },
  head: ({ loaderData, params }) => {
    const url = `https://market-link-somalia.lovable.app/property/${params.id}`;
    if (!loaderData) return { meta: [{ title: "Property — MaalsoorHub" }], links: [{ rel: "canonical", href: url }] };
    const title = `${loaderData.title} — MaalsoorHub`.slice(0, 60);
    const description = String(loaderData.description ?? "").slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: description },
        { property: "og:image", content: loaderData.image },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:image", content: loaderData.image },
      ],
      links: [
        { rel: "canonical", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: loaderData.title,
            description: loaderData.description,
            image: loaderData.image,
            url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-xl font-bold">Listing not found</h1>
        <Link to="/real-estate" className="mt-3 inline-block text-primary underline">Back to Real Estate</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">{error.message}</div>
  ),
  component: PropertyDetail,
});

function PropertyDetail() {
  const p = Route.useLoaderData();
  const [idx, setIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [openVisit, setOpenVisit] = useState(false);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background pb-32">
      {/* Hero */}
      <div className="relative">
        <img src={p.images[idx]} alt={p.title} className="h-[380px] w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link
            to="/real-estate"
            aria-label="Go back"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-soft backdrop-blur-xl active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button aria-label="Share" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-soft backdrop-blur-xl active:scale-95">
              <Share2 className="h-5 w-5" />
            </button>
            <button
              aria-label={saved ? "Unsave" : "Save to favorites"}
              onClick={() => setSaved((s) => !s)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-soft backdrop-blur-xl active:scale-95 ${saved ? "text-destructive" : "text-white"}`}
            >
              <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        <div className="absolute left-4 top-20 flex items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-soft backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
          {p.status}
        </div>

        {p.images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
            {p.images.map((_x: string, i: number) => (
              <button
                key={i}
                aria-label={`View image ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating price card */}
      <div className="-mt-6 px-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {p.deal === "Rent" ? "For Rent" : "For Sale"}
              </div>
              <div className="mt-0.5 text-3xl font-extrabold tracking-tight text-foreground">
                {formatPrice(p.price, p.priceUnit)}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
              <Star className="h-3 w-3 fill-accent text-accent" /> {p.agent.rating}
            </span>
          </div>
          <h1 className="mt-2 text-lg font-bold leading-tight text-foreground">{p.title}</h1>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {p.district}, {p.city}
          </div>
        </div>
      </div>

      {/* Spec grid */}
      <div className="mt-4 px-4">
        <div className="grid grid-cols-2 gap-2.5">
          <SpecCard icon={BedDouble} label="Bedrooms" value={p.beds > 0 ? `${p.beds} Beds` : "Studio"} />
          <SpecCard icon={Bath} label="Bathrooms" value={p.baths > 0 ? `${p.baths} Baths` : "—"} />
          <SpecCard icon={Maximize2} label="Area" value={`${p.area} m²`} />
          <SpecCard icon={Car} label="Parking" value={p.parking ? "Included" : "None"} />
        </div>
      </div>

      {/* Highlights */}
      <Section title="Highlights">
        <div className="flex flex-wrap gap-2">
          <Tag icon={ShieldCheck} label="Verified listing" />
          {p.furnished && <Tag icon={Sofa} label="Furnished" />}
          {p.parking && <Tag icon={Car} label="Private parking" />}
          <Tag icon={CheckCircle2} label="Move-in ready" />
        </div>
      </Section>

      {/* About */}
      <div className="mt-6 px-4">
        <h2 className="mb-1.5 text-base font-bold text-foreground">About this property</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
      </div>

      {/* Amenities */}
      <Section title="Amenities">
        <div className="grid grid-cols-3 gap-2">
          <Amenity icon={Wifi} label="Wi-Fi" />
          <Amenity icon={Zap} label="24/7 Power" />
          <Amenity icon={Droplets} label="Water tank" />
          <Amenity icon={Wind} label="A/C ready" />
          <Amenity icon={Trees} label="Garden" />
          <Amenity icon={Lock} label="Security" />
        </div>
      </Section>

      {/* Legal & Documents */}
      <Section title="Legal & Documents" subtitle="Verified by MaalsoorHub Trust Team">
        <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
          <ul className="divide-y divide-border">
            <LegalRow icon={FileText} label="Title deed" value="Original — verified" ok />
            <LegalRow icon={Landmark} label="Land registry" value={`Registered (#BD-${p.id.toUpperCase()}-2021)`} ok />
            <LegalRow icon={Scale} label="Ownership dispute" value="None on record" ok />
            <LegalRow icon={ScrollText} label="Tax & municipality" value="Cleared — current year" ok />
            <LegalRow icon={ShieldCheck} label="Building permit" value={p.sub === "Land" ? "Not required" : "Approved"} ok />
          </ul>
          <p className="mt-3 rounded-xl bg-primary-soft p-2.5 text-[11px] leading-relaxed text-primary">
            Always meet at the property and verify originals before payment. MaalsoorHub never holds funds — pay the seller directly only after due diligence.
          </p>
        </div>
      </Section>

      {/* Mortgage / Payment plan (Buy only) */}
      {p.deal === "Buy" && <MortgageEstimator price={p.price} />}

      {/* Nearby */}
      <Section title="What's nearby">
        <div className="grid grid-cols-2 gap-2">
          <Nearby icon={School} label="Hodan Primary" meta="0.4 km" />
          <Nearby icon={ShoppingBag} label="Bakara Market" meta="1.2 km" />
          <Nearby icon={Hospital} label="Madina Hospital" meta="1.8 km" />
          <Nearby icon={Bus} label="Main bus stop" meta="0.3 km" />
        </div>
      </Section>

      {/* Agent */}
      <div className="mt-6 px-4">
        <div className="rounded-3xl bg-foreground p-4 text-background shadow-card">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img src={p.agent.avatar} alt={p.agent.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-background/10" />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-2 ring-foreground">
                <BadgeCheck className="h-3.5 w-3.5 text-primary-foreground" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">{p.agent.name}</div>
              <div className="text-[11px] text-background/60">{p.agent.badge}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-background/80">
                <Star className="h-3 w-3 fill-accent text-accent" /> {p.agent.rating} · {p.agent.reviews} reviews
              </div>
            </div>
            <a
              href={whatsappLink(p.agent.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message on WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-whatsapp text-whatsapp-foreground shadow-soft active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Location */}
      <Section title="Location" right={<button className="text-xs font-bold text-primary">View map</button>}>
        <div className="relative h-40 overflow-hidden rounded-3xl border border-border bg-secondary">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.92_0.02_250),oklch(0.96_0.01_250))]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              <span className="text-xs font-bold text-foreground">{p.district}, {p.city}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-3 pb-3 safe-bottom">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card/95 p-3 shadow-card backdrop-blur">
          <div className="flex-1 pl-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {p.priceUnit === "month" ? "Monthly" : "Total"}
            </div>
            <div className="text-lg font-extrabold leading-tight text-foreground">
              {formatPrice(p.price, p.priceUnit)}
            </div>
          </div>
          <a
            href={telLink(p.agent.phone)}
            aria-label="Call agent"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground active:scale-95"
          >
            <Phone className="h-5 w-5" />
          </a>
          <button
            onClick={() => setOpenVisit(true)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 font-bold text-primary-foreground shadow-soft active:scale-95"
          >
            <Calendar className="h-4 w-4" /> Schedule visit
          </button>
        </div>
      </div>

      {openVisit && (
        <ScheduleVisitSheet
          onClose={() => setOpenVisit(false)}
          property={p}
        />
      )}
    </main>
  );
}

/* ---------------- helpers ---------------- */

function Section({
  title, subtitle, right, children,
}: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-6 px-4">
      <div className="mb-2 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground/80">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function SpecCard({
  icon: Icon, label, value,
}: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-soft">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {label}
    </span>
  );
}

function Amenity({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 shadow-soft">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-[11px] font-semibold text-foreground">{label}</span>
    </div>
  );
}

function Nearby({ icon: Icon, label, meta }: { icon: typeof MapPin; label: string; meta: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3 shadow-soft">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs font-semibold text-foreground">{label}</div>
        <div className="text-[11px] text-muted-foreground">{meta}</div>
      </div>
    </div>
  );
}

function LegalRow({
  icon: Icon, label, value, ok,
}: { icon: typeof MapPin; label: string; value: string; ok?: boolean }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-foreground">{label}</div>
        <div className="text-[11px] text-muted-foreground">{value}</div>
      </div>
      {ok && <CheckCircle2 className="h-5 w-5 text-whatsapp" />}
    </li>
  );
}

function MortgageEstimator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(30);
  const [years, setYears] = useState(10);
  const rate = 0.08;

  const { monthly, principal } = useMemo(() => {
    const principal = price * (1 - downPct / 100);
    const n = years * 12;
    const r = rate / 12;
    const monthly = (principal * r) / (1 - Math.pow(1 + r, -n));
    return { monthly: Math.round(monthly), principal: Math.round(principal) };
  }, [price, downPct, years]);

  return (
    <Section title="Payment plan estimate" subtitle="Indicative only — confirm with your bank">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Mortgage calculator</span>
        </div>
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Down payment</span>
            <span className="font-bold text-foreground">{downPct}% · ${(price * downPct / 100).toLocaleString()}</span>
          </div>
          <input type="range" min={10} max={70} step={5} value={downPct} onChange={(e) => setDownPct(+e.target.value)} className="w-full accent-[oklch(0.55_0.15_250)]" />
        </div>
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Term</span>
            <span className="font-bold text-foreground">{years} years</span>
          </div>
          <input type="range" min={3} max={25} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-[oklch(0.55_0.15_250)]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-secondary p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Loan</div>
            <div className="text-sm font-bold text-foreground">${principal.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-primary-soft p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Per month</div>
            <div className="text-sm font-bold text-primary">${monthly.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Schedule visit sheet ---------------- */

function ScheduleVisitSheet({
  onClose, property,
}: {
  onClose: () => void;
  property: { id: string; title: string; agent: { whatsapp: string; name: string } };
}) {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

  const [date, setDate] = useState(dates[1].toISOString().slice(0, 10));
  const [time, setTime] = useState(times[1]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const valid = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 7;

  const send = () => {
    const msg =
`Hello ${property.agent.name}, I'd like to schedule a visit.

Property: ${property.title}
Listing ID: ${property.id}
Preferred date: ${date}
Preferred time: ${time}
Name: ${name}
Phone: ${phone}
${notes ? `Notes: ${notes}` : ""}`.trim();
    window.open(whatsappLink(property.agent.whatsapp, msg), "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-card animate-in slide-in-from-bottom">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Schedule a visit</h3>
            <p className="text-[11px] text-muted-foreground">Free · No payment required</p>
          </div>
          <button aria-label="Close" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Date row */}
        <div className="mb-3">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pick a date</div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {dates.map((d) => {
              const iso = d.toISOString().slice(0, 10);
              const active = iso === date;
              return (
                <button
                  key={iso}
                  onClick={() => setDate(iso)}
                  className={`flex min-w-[58px] flex-col items-center rounded-2xl border px-2 py-2 text-xs ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}
                >
                  <span className="text-[10px] font-semibold opacity-80">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
                  <span className="text-base font-extrabold">{d.getDate()}</span>
                  <span className="text-[10px] opacity-80">{d.toLocaleDateString(undefined, { month: "short" })}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time row */}
        <div className="mb-3">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Time slot</div>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => {
              const active = t === time;
              return (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`rounded-xl border py-2 text-xs font-bold ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="Phone" className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary" />
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes (optional)" rows={2} className="mb-3 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary" />

        <button
          disabled={!valid}
          onClick={send}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp font-bold text-whatsapp-foreground shadow-soft active:scale-95 disabled:opacity-50"
        >
          <MessageCircle className="h-5 w-5" /> Confirm via WhatsApp
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Your request opens a chat with the agent. No fees — payment happens after the visit.
        </p>
      </div>
    </div>
  );
}
