import { createFileRoute, Link, useNavigate, useParams, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, BadgeCheck, MapPin, Clock, DollarSign, Languages,
  Star, MessageCircle, Phone, CalendarPlus, Heart, Share2, Briefcase,
  Wrench, Sparkles, Check, ShieldCheck, Award, Zap, ThumbsUp, ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LISTINGS } from "@/data/listings";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/listing/$id/")({
  component: ListingDetailPage,
  loader: ({ params }) => {
    const item = LISTINGS.find((l) => l.id === params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ params, loaderData }) => {
    const item = loaderData?.item;
    const url = `https://market-link-somalia.lovable.app/listing/${params.id}`;
    const name = item?.provider.name ?? "Provider";
    const title = `${name} — ${item?.title ?? "Service"} | MaalsoorHub`.slice(0, 60);
    const description = (item?.description ?? `Connect with ${name} on MaalsoorHub via WhatsApp or call.`).slice(0, 160);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "profile" },
        ...(item?.image ? [
          { property: "og:image", content: item.image },
          { name: "twitter:image", content: item.image },
        ] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: item ? [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: item.provider.name,
            description: item.description,
            image: item.image,
            url,
            address: {
              "@type": "PostalAddress",
              addressLocality: item.city,
              ...(item.district ? { addressRegion: item.district } : {}),
              addressCountry: "SO",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: item.provider.rating,
              reviewCount: item.provider.reviews,
            },
            telephone: item.provider.phone,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ] : [],
    };
  },
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <h1 className="text-lg font-bold">Listing not found</h1>
      <Link to="/home" className="mt-3 inline-block text-primary">Go home</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8 text-sm">{error.message}</div>,
});

type Offer = { id: string; name: string; price: string; desc: string; popular?: boolean };

function offersFor(title: string, subtitle: string): Offer[] {
  const t = (title + " " + subtitle).toLowerCase();
  if (t.includes("plumb")) return [
    { id: "leak", name: "Leak Detection & Repair", price: "$10 – $25", desc: "Find and fix hidden leaks fast", popular: true },
    { id: "install", name: "Pipe & Fixture Installation", price: "$15 – $40", desc: "Sinks, taps, water lines" },
    { id: "bath", name: "Bathroom Installation", price: "$80 – $250", desc: "Full bathroom plumbing setup" },
    { id: "emergency", name: "24/7 Emergency Callout", price: "$30 flat", desc: "Same-hour response in Mogadishu" },
  ];
  if (t.includes("electric")) return [
    { id: "wiring", name: "House Wiring", price: "$50 – $200", desc: "Complete or partial rewiring", popular: true },
    { id: "fix", name: "Outlet & Switch Fix", price: "$10 – $25", desc: "Fast in-home repairs" },
    { id: "panel", name: "Panel Upgrade", price: "$80 – $250", desc: "Safer, higher capacity panels" },
    { id: "light", name: "Lighting Installation", price: "$15 – $50", desc: "Indoor & outdoor fixtures" },
  ];
  if (t.includes("clean")) return [
    { id: "deep", name: "Deep Home Clean", price: "$40 – $120", desc: "Top-to-bottom cleaning", popular: true },
    { id: "regular", name: "Regular Cleaning", price: "$20 – $50", desc: "Weekly or bi-weekly visits" },
    { id: "office", name: "Office Cleaning", price: "$30 – $90", desc: "Daily / scheduled service" },
    { id: "move", name: "Move-out Clean", price: "$60 – $150", desc: "Get your deposit back" },
  ];
  if (t.includes("dental") || t.includes("dentist")) return [
    { id: "check", name: "Check-up & Cleaning", price: "$15 – $25", desc: "Routine dental health visit", popular: true },
    { id: "fill", name: "Fillings", price: "$20 – $40", desc: "Composite / amalgam options" },
    { id: "extract", name: "Tooth Extraction", price: "$25 – $60", desc: "Painless modern technique" },
    { id: "braces", name: "Braces Consultation", price: "From $50", desc: "Free initial assessment" },
  ];
  if (t.includes("hospital") || t.includes("clinic")) return [
    { id: "consult", name: "General Consultation", price: "$15 – $25", desc: "GP visit & assessment", popular: true },
    { id: "lab", name: "Lab Tests", price: "From $5", desc: "Blood, urine & imaging" },
    { id: "specialist", name: "Specialist Visit", price: "$25 – $60", desc: "Cardiology, pediatrics & more" },
    { id: "er", name: "24/7 Emergency", price: "From $30", desc: "Walk-in any time" },
  ];
  return [
    { id: "consult", name: "Initial Consultation", price: "$10 – $25", desc: "Discuss your needs" },
    { id: "standard", name: "Standard Service", price: "$25 – $60", desc: "Most popular package", popular: true },
    { id: "premium", name: "Premium Service", price: "$60 – $150", desc: "Full-coverage option" },
  ];
}

const HOURS = [
  { day: "Mon – Fri", time: "8:00 AM – 8:00 PM" },
  { day: "Saturday", time: "9:00 AM – 6:00 PM" },
  { day: "Sunday", time: "On call (emergency)" },
];

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Verified ID & licence" },
  { icon: Zap, label: "Responds in under 1 hr" },
  { icon: Award, label: "5+ years experience" },
  { icon: ThumbsUp, label: "98% satisfaction" },
];

const REVIEWS = [
  { name: "Amina H.", rating: 5, text: "Came within an hour and fixed the leak under our sink. Very professional and clean work.", when: "2 weeks ago" },
  { name: "Mohamed A.", rating: 5, text: "Best service I've used in Mogadishu. Fair price and explained everything clearly.", when: "1 month ago" },
  { name: "Khadija M.", rating: 4, text: "Good job overall, took a bit longer than expected but the result was great.", when: "2 months ago" },
];

const FAQS = [
  { q: "Do you offer free quotes?", a: "Yes — message us on WhatsApp with photos of the issue and we'll give you a free estimate within an hour." },
  { q: "Which areas do you cover?", a: "All of Mogadishu and nearby districts. For outside areas a small travel fee may apply." },
  { q: "Do you offer a warranty?", a: "All work comes with a 30-day warranty. If anything goes wrong, we'll come back free of charge." },
];

function ListingDetailPage() {
  const { id } = useParams({ from: "/listing/$id/" });
  const item = LISTINGS.find((l) => l.id === id)!;
  const navigate = useNavigate();
  const p = item.provider;
  const offers = useMemo(() => offersFor(item.title, item.subtitle), [item]);
  const jobsCompleted = Math.round(p.reviews * 2.4);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const gallery = [item.image, item.image, item.image, item.image];

  return (
    <AppShell hideNav>
      {/* Hero image */}
      <div className="relative h-72 w-full">
        <img src={item.image} alt={p.name} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <button
            onClick={() => navigate({ to: "/category/$key", params: { key: item.category } })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft active:scale-95" aria-label="Save">
              <Heart className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft active:scale-95" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile header */}
      <section className="-mt-6 rounded-t-3xl bg-background px-4 pt-5">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
          <BadgeCheck className="h-3.5 w-3.5" /> {p.badge}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold">{p.name}</h1>
        <p className="text-sm text-muted-foreground">{item.subtitle}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current text-accent" />
            <span className="font-bold text-foreground">{p.rating}</span> ({p.reviews} reviews)
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" /> {jobsCompleted} jobs completed
          </span>
        </div>

        {/* Highlight chips */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary-soft text-primary">
                <h.icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold leading-tight">{h.label}</span>
            </div>
          ))}
        </div>

        {/* Info rows */}
        <ul className="mt-5 space-y-3">
          <InfoRow icon={MapPin} title="10 min away" subtitle={`${item.district ? item.district + ", " : ""}${item.city}`} />
          <InfoRow icon={DollarSign} title={item.price ?? "Contact for pricing"} subtitle="Starting price" />
          <InfoRow icon={Clock} title="Open now" subtitle="Closes 8:00 PM" tone="success" />
          <InfoRow icon={Languages} title="Languages" subtitle="Somali, English, Arabic" />
        </ul>
      </section>

      {/* What I Offer */}
      <section className="mt-6 px-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold">What {p.name} offers</h2>
            <p className="text-xs text-muted-foreground">Tap a service to book it directly</p>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground">{offers.length} services</span>
        </div>
        <div className="space-y-2">
          {offers.map((o) => (
            <Link
              key={o.id}
              to="/listing/$id/book"
              params={{ id: item.id }}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition hover:border-primary/40 hover:shadow-soft active:scale-[0.99]"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Wrench className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-bold">{o.name}</span>
                  {o.popular && (
                    <span className="inline-flex flex-none items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-600">
                      <Sparkles className="h-2.5 w-2.5" /> Popular
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{o.desc}</span>
              </span>
              <span className="flex flex-none flex-col items-end">
                <span className="text-xs font-extrabold text-primary">{o.price}</span>
                <ChevronRight className="mt-0.5 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mt-6 px-4">
        <h2 className="mb-3 text-lg font-extrabold">Recent work</h2>
        <div className="grid grid-cols-4 gap-2">
          {gallery.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" className="h-20 w-full rounded-xl object-cover" />
          ))}
          <div className="relative h-20 w-full overflow-hidden rounded-xl">
            <img src={item.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-foreground/55 text-sm font-bold text-white">+12</div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-extrabold">About</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Licensed", "Insured", "Locally owned", "Card & cash"].map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground">
              <Check className="h-3 w-3 text-primary" /> {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Hours */}
      <section className="mt-6 px-4">
        <h2 className="mb-3 text-lg font-extrabold">Working hours</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {HOURS.map((h, i) => (
            <div
              key={h.day}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i < HOURS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="font-semibold">{h.day}</span>
              <span className="text-muted-foreground">{h.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-6 px-4">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-extrabold">Reviews</h2>
          <span className="inline-flex items-center gap-1 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-current text-accent" />
            {p.rating} · {p.reviews}
          </span>
        </div>
        <div className="space-y-2">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-card p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{r.name}</span>
                <span className="text-[11px] text-muted-foreground">{r.when}</span>
              </div>
              <div className="mt-1 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < r.rating ? "fill-current text-accent" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-6 px-4 pb-8">
        <h2 className="mb-3 text-lg font-extrabold">Frequently asked</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className={i < FAQS.length - 1 ? "border-b border-border" : ""}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold">{f.q}</span>
                  <ChevronRight className={`h-4 w-4 flex-none text-muted-foreground transition ${open ? "rotate-90" : ""}`} />
                </button>
                {open && (
                  <p className="px-4 pb-3 text-xs leading-relaxed text-muted-foreground">{f.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 grid grid-cols-3 gap-2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        <a
          href={whatsappLink(p.whatsapp, `Hello ${p.name}, I'm interested in ${item.title}.`)}
          target="_blank" rel="noreferrer"
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-whatsapp text-sm font-bold text-whatsapp-foreground active:scale-95"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={telLink(p.phone)}
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-secondary text-sm font-bold text-foreground active:scale-95"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <Link
          to="/listing/$id/book" params={{ id: item.id }}
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-95"
        >
          <CalendarPlus className="h-4 w-4" /> Book
        </Link>
      </div>
    </AppShell>
  );
}

function InfoRow({
  icon: Icon, title, subtitle, tone,
}: { icon: any; title: string; subtitle: string; tone?: "success" }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className={`text-sm font-bold ${tone === "success" ? "text-emerald-600" : ""}`}>{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </li>
  );
}
