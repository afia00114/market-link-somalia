import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, MapPin, BadgeCheck, Heart } from "lucide-react";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/contact";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link
      to="/property/$id"
      params={{ id: p.id }}
      className="block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform active:scale-[0.99]"
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label="Save"
          onClick={(e) => { e.preventDefault(); }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          {p.deal}
        </span>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-base font-bold text-foreground">{formatPrice(p.price, p.priceUnit)}</div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">
            <BadgeCheck className="h-3 w-3" /> {p.agent.badge.replace("Verified ", "")}
          </span>
        </div>
        <div className="line-clamp-1 text-sm font-semibold text-foreground">{p.title}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {p.district}, {p.city}
        </div>
        {(p.beds > 0 || p.baths > 0) && (
          <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            {p.beds > 0 && <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{p.beds} Beds</span>}
            {p.baths > 0 && <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{p.baths} Baths</span>}
            <span>· {p.area} m²</span>
          </div>
        )}
      </div>
    </Link>
  );
}
