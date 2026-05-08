import { BadgeCheck, Star, Phone, MessageCircle, Plane, Clock } from "lucide-react";
import type { FlightOffer } from "@/data/travel";
import { whatsappLink, telLink } from "@/lib/contact";

export function FlightResultCard({
  offer,
  onSelect,
  fromCity,
  toCity,
}: {
  offer: FlightOffer;
  onSelect: () => void;
  fromCity?: string;
  toCity?: string;
}) {
  const waMsg = `Hello ${offer.name}, I found you on MaalsoorHub. I'd like to book a flight from ${fromCity ?? offer.from} to ${toCity ?? offer.to} (around $${offer.price}).`;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex gap-3 p-3">
        <img
          src={offer.logo}
          alt={offer.name}
          loading="lazy"
          className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="truncate text-sm font-bold">{offer.name}</h3>
                {offer.verified && <BadgeCheck className="h-4 w-4 flex-shrink-0 text-primary" />}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-current text-accent" /> {offer.rating}
                  <span className="text-[10px]">({offer.reviews})</span>
                </span>
                <span>· {offer.city}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-extrabold text-primary">${offer.price}</div>
              <div className="text-[10px] text-muted-foreground">est. price</div>
            </div>
          </div>

          {/* Schedule strip */}
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-secondary px-2 py-1.5 text-[11px] text-foreground">
            {offer.departTime && (
              <span className="font-semibold">
                {offer.departTime}
                {offer.arriveTime ? ` → ${offer.arriveTime}` : ""}
              </span>
            )}
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Clock className="h-3 w-3" /> {offer.durationHrs}h
            </span>
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Plane className="h-3 w-3" />
              {offer.direct ? "Direct" : `Via ${offer.via ?? "1 stop"}`}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-border p-2">
        <a
          href={telLink(offer.phone)}
          aria-label={`Call ${offer.name}`}
          onClick={(e) => e.stopPropagation()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground active:scale-95"
        >
          <Phone className="h-4 w-4" />
        </a>
        <a
          href={whatsappLink(offer.whatsapp, waMsg)}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${offer.name}`}
          onClick={(e) => e.stopPropagation()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-whatsapp text-whatsapp-foreground active:scale-95"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
        <button
          onClick={onSelect}
          className="ml-auto flex h-10 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
        >
          Select
        </button>
      </div>
    </article>
  );
}
