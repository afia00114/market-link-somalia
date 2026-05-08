import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Heart, Share2, MapPin, BedDouble, Bath, Maximize2,
  Car, BadgeCheck, Star,
} from "lucide-react";
import { ContactBar } from "@/components/ContactBar";
import { PROPERTIES } from "@/data/properties";
import { formatPrice } from "@/lib/contact";

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

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-28">
      <div className="relative">
        <img src={p.images[idx]} alt={p.title} className="h-72 w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link to="/real-estate" className="flex h-10 w-10 items-center justify-center rounded-full bg-card/95 shadow-soft">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/95 shadow-soft"><Share2 className="h-5 w-5" /></button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/95 shadow-soft"><Heart className="h-5 w-5" /></button>
          </div>
        </div>
        {p.images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {p.images.map((_x, i: number) => (
              <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-2xl font-extrabold text-foreground">{formatPrice(p.price, p.priceUnit)}</div>
            <h1 className="mt-1 text-lg font-bold leading-tight">{p.title}</h1>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {p.district}, {p.city}
            </div>
          </div>
          <span className="rounded-full bg-primary-soft px-2 py-1 text-[10px] font-semibold text-primary">
            {p.status}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft">
          <Spec icon={BedDouble} label={`${p.beds || "—"} Beds`} />
          <Spec icon={Bath} label={`${p.baths || "—"} Baths`} />
          <Spec icon={Maximize2} label={`${p.area} m²`} />
          <Spec icon={Car} label={p.parking ? "Parking" : "No Park"} />
        </div>

        <div>
          <h2 className="mb-1 text-sm font-bold text-foreground">About this property</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
          <img src={p.agent.avatar} alt={p.agent.name} className="h-12 w-12 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
              {p.agent.name}
              <BadgeCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="text-[11px] text-muted-foreground">{p.agent.badge}</div>
            <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="h-3 w-3 fill-accent text-accent" /> {p.agent.rating} · {p.agent.reviews} reviews
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</h3>
          <div className="flex h-32 items-center justify-center rounded-xl bg-secondary text-xs text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" /> Map preview — {p.district}, {p.city}
          </div>
        </div>
      </div>

      <ContactBar whatsapp={p.agent.whatsapp} phone={p.agent.phone} />
    </div>
  );
}

function Spec({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-[11px] text-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
