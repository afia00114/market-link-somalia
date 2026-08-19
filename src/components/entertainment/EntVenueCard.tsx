import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, MapPin, Star, Clock } from "lucide-react";
import type { EntVenue } from "@/data/entertainment";
import { subLabel } from "@/data/entertainment";
import { useFavorites } from "@/lib/entertainment-store";

export function EntVenueCard({ v, compact = false }: { v: EntVenue; compact?: boolean }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(v.id);
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft ${compact ? "w-56 flex-shrink-0" : ""}`}
    >
      <Link to="/entertainment/venues/$id" params={{ id: v.id }} className="block active:scale-[0.99]">
        <div className="relative">
          <img src={v.image} alt={v.name} loading="lazy" className="h-32 w-full object-cover" />
          <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-bold text-foreground backdrop-blur">
            {subLabel(v.sub)}
          </span>
          {v.bookable && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
              <Clock className="h-2.5 w-2.5" /> Book by the hour
            </span>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-bold text-foreground">{v.name}</h3>
            <span className="whitespace-nowrap text-xs font-bold text-primary">
              ${v.priceFrom}/{v.priceUnit}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">
              {v.district}, {v.city}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">
              <Star className="h-3 w-3 fill-current" /> {v.rating.toFixed(1)}
              <span className="text-muted-foreground">({v.reviewCount})</span>
            </span>
            {v.verified && (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-label={fav ? `Remove ${v.name} from favorites` : `Save ${v.name} to favorites`}
        aria-pressed={fav}
        onClick={() => toggle(v.id)}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur transition hover:bg-background"
      >
        <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : "text-foreground"}`} />
      </button>
    </article>
  );
}
