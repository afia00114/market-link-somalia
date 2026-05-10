import { BadgeCheck, Star, Phone, MessageCircle, Plane, ArrowRight } from "lucide-react";
import { DEFAULT_AMENITIES, flightClassesFor, type FlightOffer } from "@/data/travel";
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
  const isAgency = !!offer.whatsapp;
  const amenities = offer.amenities ?? DEFAULT_AMENITIES;
  const classes = offer.classes ?? flightClassesFor(offer.price);
  const hours = Math.floor(offer.durationHrs);
  const mins = Math.round((offer.durationHrs - hours) * 60);
  const waMsg = [
    "Flight request:",
    `Route: ${offer.from} → ${offer.to}`,
    `Departure: ${offer.departTime ?? "—"}`,
    `Arrival: ${offer.arriveTime ?? "—"}`,
    `Provider: ${offer.name}`,
    `Price: $${offer.price}`,
  ].join("\n");

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Header: logo + name + rating + price */}
      <div className="flex items-start gap-3 p-3">
        <img
          src={offer.logo}
          alt={offer.name}
          className="h-11 w-11 flex-shrink-0 rounded-xl object-cover ring-1 ring-border"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="truncate text-sm font-bold">{offer.name}</h3>
            {offer.verified && <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0 text-flights" />}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-current text-amber-500" /> {offer.rating}
              <span className="text-muted-foreground">({offer.reviews})</span>
            </span>
            {offer.yearsInBusiness && <span>· {offer.yearsInBusiness}+ yrs</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground">From</div>
          <div className="text-lg font-extrabold leading-tight text-flights">${offer.price}</div>
        </div>
      </div>

      {/* Route timeline */}
      <div className="px-3">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-secondary/60 px-3 py-2.5">
          <div>
            <div className="text-base font-extrabold leading-tight">{offer.departTime ?? "—"}</div>
            <div className="text-[11px] font-bold">{offer.from}</div>
            <div className="text-[10px] text-muted-foreground">{fromCity ?? offer.city}</div>
          </div>
          <div className="flex flex-1 flex-col items-center px-2">
            <div className="text-[10px] text-muted-foreground">{hours}h {mins ? `${mins}m` : ""}</div>
            <div className="my-0.5 flex w-full items-center">
              <div className="h-px flex-1 bg-border" />
              <Plane className="mx-1 h-3 w-3 -rotate-45 text-flights" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <span className="rounded-full bg-flights-soft px-2 py-0.5 text-[10px] font-semibold text-flights">
              {offer.direct ? "Direct" : `Via ${offer.via}`}
            </span>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold leading-tight">{offer.arriveTime ?? "—"}</div>
            <div className="text-[11px] font-bold">{offer.to}</div>
            <div className="text-[10px] text-muted-foreground">{toCity ?? offer.to}</div>
          </div>
        </div>
      </div>

      {/* Amenities preview */}
      <div className="flex flex-wrap gap-1.5 px-3 pt-2">
        {amenities.slice(0, 3).map((a) => (
          <span
            key={a}
            className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {a}
          </span>
        ))}
        {amenities.length > 3 && (
          <span className="text-[10px] font-semibold text-flights">+{amenities.length - 3} more</span>
        )}
      </div>

      {/* Class options */}
      <div className="grid grid-cols-3 gap-1.5 px-3 pt-2">
        {classes.map((c) => (
          <div
            key={c.cls}
            className="rounded-lg border border-border bg-card px-2 py-1.5 text-center"
          >
            <div className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              {c.cls}
            </div>
            <div className="text-[11px] font-extrabold text-flights">${c.price}</div>
          </div>
        ))}
      </div>

      {/* Footer: contact + CTA — agency only */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border p-3">
        {isAgency ? (
          <>
            <div className="flex items-center gap-1.5">
              <a
                href={whatsappLink(offer.whatsapp, waMsg)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={telLink(offer.phone)}
                onClick={(e) => e.stopPropagation()}
                aria-label="Call"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
            <a
              href={whatsappLink(offer.whatsapp, waMsg)}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-flights px-4 text-xs font-bold text-white shadow-soft active:scale-[0.98]"
            >
              Send via WhatsApp <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </>
        ) : (
          <button
            onClick={onSelect}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-secondary px-4 text-xs font-bold text-muted-foreground active:scale-[0.98]"
          >
            View details only <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </article>
  );
}
