import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Heart, Share2, MapPin, BedDouble, Bath, Maximize2,
  Car, BadgeCheck, Star, MessageCircle, Phone, CheckCircle2, Sofa,
  ShieldCheck, Calendar,
} from "lucide-react";
import { PROPERTIES } from "@/data/properties";
import { formatPrice, telLink, whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const property = PROPERTIES.find((p) => p.id === params.id);
    if (!property) throw notFound();
    return property;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — MaalsoorHub` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.description },
          { property: "og:image", content: loaderData.image },
        ]
      : [{ title: "Property — MaalsoorHub" }],
  }),
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
            <button
              aria-label="Share"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-soft backdrop-blur-xl active:scale-95"
            >
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

        {/* Status pill on hero */}
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

      {/* Floating card overlapping hero */}
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
      <div className="mt-5 px-4">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Highlights
        </h2>
        <div className="flex flex-wrap gap-2">
          <Tag icon={ShieldCheck} label="Verified listing" />
          {p.furnished && <Tag icon={Sofa} label="Furnished" />}
          {p.parking && <Tag icon={Car} label="Private parking" />}
          <Tag icon={CheckCircle2} label="Move-in ready" />
        </div>
      </div>

      {/* About */}
      <div className="mt-6 px-4">
        <h2 className="mb-1.5 text-base font-bold text-foreground">About this property</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
      </div>

      {/* Agent card */}
      <div className="mt-6 px-4">
        <div className="rounded-3xl bg-foreground p-4 text-background shadow-card">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={p.agent.avatar}
                alt={p.agent.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-background/10"
              />
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
      <div className="mt-6 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</h2>
          <button className="text-xs font-bold text-primary">View map</button>
        </div>
        <div className="relative h-40 overflow-hidden rounded-3xl border border-border bg-secondary">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.92_0.02_250),oklch(0.96_0.01_250))]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              <span className="text-xs font-bold text-foreground">{p.district}, {p.city}</span>
            </div>
          </div>
        </div>
      </div>

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
          <a
            href={whatsappLink(p.agent.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 font-bold text-primary-foreground shadow-soft active:scale-95"
          >
            <Calendar className="h-4 w-4" /> Schedule visit
          </a>
        </div>
      </div>
    </main>
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
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
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
