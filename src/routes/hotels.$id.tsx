import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Share2, Heart, BadgeCheck, Star, Wifi, Waves, Coffee, Plane,
  UtensilsCrossed, ParkingCircle, Dumbbell, Shirt, Clock, MapPin, Phone, MoreHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getHotel } from "@/data/hotels";
import { telLink, whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/hotels/$id")({
  component: HotelDetailPage,
  loader: ({ params }) => {
    const hotel = getHotel(params.id);
    if (!hotel) throw notFound();
    return { hotel };
  },
  head: ({ loaderData, params }) => {
    const h = loaderData?.hotel;
    const url = `https://market-link-somalia.lovable.app/hotels/${params.id}`;
    if (!h) return { meta: [{ title: "Hotel — MaalsoorHub" }], links: [{ rel: "canonical", href: url }] };
    const title = `${h.name} — MaalsoorHub`.slice(0, 60);
    return {
      meta: [
        { title },
        { name: "description", content: h.about ?? `${h.name} in ${h.city}, ${h.region}. Book via WhatsApp on MaalsoorHub.` },
        { property: "og:title", content: title },
        { property: "og:description", content: h.about ?? `${h.name} in ${h.city}, ${h.region}.` },
        { property: "og:image", content: h.image },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:image", content: h.image },
      ],
      links: [
        { rel: "canonical", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hotel",
            name: h.name,
            description: h.about,
            image: h.image,
            address: {
              "@type": "PostalAddress",
              addressLocality: h.city,
              addressRegion: h.region,
              addressCountry: "SO",
            },
            aggregateRating: h.rating ? {
              "@type": "AggregateRating",
              ratingValue: h.rating,
              reviewCount: h.reviews,
            } : undefined,
            priceRange: h.pricePerNight ? `$${h.pricePerNight}` : undefined,
          }),
        },
      ],
    };
  },
});

const AMENITY_ICON: Record<string, typeof Wifi> = {
  "Free WiFi": Wifi,
  "Pool": Waves,
  "Breakfast": Coffee,
  "Airport Pickup": Plane,
  "Restaurant": UtensilsCrossed,
  "Parking": ParkingCircle,
  "Gym": Dumbbell,
  "Laundry": Shirt,
  "24/7 Reception": Clock,
};

function HotelDetailPage() {
  const { id } = useParams({ from: "/hotels/$id" });
  const hotel = getHotel(id)!;
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const topAmenities = hotel.amenities.slice(0, 4);
  const moreCount = Math.max(0, hotel.amenities.length - 4);

  return (
    <AppShell hideNav>
      <div className="relative">
        <img
          src={hotel.gallery[active]}
          alt={hotel.name}
          className="h-72 w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link to="/hotels" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
              <Heart className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
          {active + 1}/{hotel.gallery.length}
        </span>
      </div>

      {hotel.gallery.length > 1 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {hotel.gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={g} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <section className="px-4 pt-4">
        <div className="flex items-center gap-1 text-lg font-bold">
          {hotel.name}
          {hotel.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-semibold text-foreground">{hotel.rating}</span>
          <span>({hotel.reviews} reviews)</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{hotel.city}, {hotel.region}</div>
      </section>

      <section className="mt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          {topAmenities.map((a) => {
            const Icon = AMENITY_ICON[a] ?? Wifi;
            return (
              <div key={a} className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-secondary px-2 py-3">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-medium text-foreground">{a}</span>
              </div>
            );
          })}
          {moreCount > 0 && (
            <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-secondary px-2 py-3">
              <MoreHorizontal className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-medium text-foreground">+{moreCount} more</span>
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 px-4">
        <h2 className="text-sm font-bold">About Hotel</h2>
        <p className={`mt-1 text-xs leading-relaxed text-muted-foreground ${expanded ? "" : "line-clamp-3"}`}>
          {hotel.about}
        </p>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-semibold text-primary"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      </section>

      <section className="mt-5 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold">Available Rooms</h2>
          <span className="text-xs font-semibold text-primary">See all</span>
        </div>
        <div className="space-y-2">
          {hotel.rooms.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2">
              <img src={r.image} alt={r.name} className="h-16 w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">{r.name}</div>
                  <div className="text-sm font-bold text-primary">
                    ${r.pricePerNight}<span className="text-[10px] font-medium text-muted-foreground">/night</span>
                  </div>
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {r.guests} Guests · {r.bed}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 px-4">
        <h2 className="mb-2 text-sm font-bold">Location</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <MapPin className="h-8 w-8" />
          </div>
          <div className="bg-card p-3">
            <div className="text-sm font-semibold">{hotel.name}</div>
            <div className="text-xs text-muted-foreground">{hotel.city}, {hotel.region}, Somalia</div>
          </div>
        </div>
      </section>

      <div className="h-28" />

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-card p-3 safe-bottom">
        <div className="flex gap-2">
          <a
            href={telLink(hotel.phone)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <Link
            to="/hotels/$id/book"
            params={{ id: hotel.id }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
          >
            Book Now
          </Link>
        </div>
        <a
          href={whatsappLink(hotel.whatsapp, `Hello, I'm interested in booking at ${hotel.name}.`)}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-xs font-semibold text-whatsapp-foreground"
        >
          Send via WhatsApp
        </a>
      </div>
    </AppShell>
  );
}
