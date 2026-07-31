import { BadgeCheck, MapPin, Phone, MessageCircle, Star, Navigation, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Listing } from "@/data/listings";
import { whatsappLink, telLink } from "@/lib/contact";
import { coordsFor, distanceKm, formatDistance } from "@/lib/geo";
import { useUserLocation } from "@/hooks/use-user-location";
import { getShop } from "@/data/shops";

export function ListingCard({ l }: { l: Listing }) {
  const { coords } = useUserLocation();
  const place = coordsFor(l.city, l.district);
  const km = coords && place ? distanceKm(coords, place) : null;
  const shop = l.category === "shops" ? getShop(l.id) : undefined;
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <Link
        to={shop ? "/shops/$id" : "/listing/$id"}
        params={{ id: l.id }}
        className="flex gap-3 p-3 active:scale-[0.99]"
      >
        <img
          src={l.image}
          alt={l.title}
          loading="lazy"
          className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-bold text-foreground">{l.title}</h3>
            {l.price && (
              <span className="whitespace-nowrap text-xs font-bold text-primary">{l.price}</span>
            )}
          </div>
          <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{l.subtitle}</div>
          {shop && (
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              <ShoppingBag className="h-3 w-3" /> {shop.products.length} items · shop now
            </div>
          )}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{l.district ? `${l.district}, ` : ""}{l.city}</span>
            {km !== null && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                <Navigation className="h-2.5 w-2.5" /> {formatDistance(km)}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">
              <BadgeCheck className="h-3 w-3" /> {l.provider.badge.replace("Verified ", "")}
            </span>
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-accent" /> {l.provider.rating}
              <span className="ml-0.5">({l.provider.reviews})</span>
            </span>
          </div>
        </div>
      </Link>
      <div className="flex border-t border-border">
        <a
          href={whatsappLink(l.provider.whatsapp, `Hello ${l.provider.name}, I'm interested in "${l.title}" on MaalsoorHub.`)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[hsl(142_70%_38%)] hover:bg-secondary"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <span className="w-px bg-border" />
        <a
          href={telLink(l.provider.phone)}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:bg-secondary"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
      </div>
    </article>
  );
}
