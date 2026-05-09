import { BadgeCheck, Star, Phone, MessageCircle, Share2, Plane, Luggage, Briefcase } from "lucide-react";
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
  const code = (offer.name.match(/\b[A-Z]/g) || []).slice(0, 2).join("") || "AL";
  const hours = Math.floor(offer.durationHrs);
  const mins = Math.round((offer.durationHrs - hours) * 60);

  const onShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${offer.name}: ${offer.from} → ${offer.to} from $${offer.price}`;
    if (navigator.share) navigator.share({ title: offer.name, text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Header: code badge + name + airline logo */}
      <div className="flex items-start gap-3 p-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-flights-soft text-xs font-extrabold text-flights">
          {code}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="truncate text-sm font-bold">{offer.name}</h3>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            {offer.verified && (
              <span className="inline-flex items-center gap-0.5 text-flights">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            )}
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-current text-amber-500" /> {offer.rating}
            </span>
          </div>
        </div>
        <div className="text-right text-[10px] text-muted-foreground">
          <div className="font-semibold text-foreground">{offer.name.split(" ")[0]}</div>
          <span className="inline-flex items-center gap-1 rounded-full bg-flights-soft px-1.5 py-0.5 text-[10px] font-semibold text-flights">
            <Plane className="h-3 w-3" /> Intl
          </span>
        </div>
      </div>

      {/* Route timeline */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-secondary/60 px-3 py-2.5">
          <div>
            <div className="text-base font-extrabold leading-tight">{offer.departTime ?? "—"}</div>
            <div className="text-[11px] font-bold text-foreground">{offer.from}</div>
            <div className="text-[10px] text-muted-foreground">{fromCity ?? offer.city}</div>
          </div>
          <div className="flex flex-1 flex-col items-center px-2">
            <div className="text-[10px] text-muted-foreground">{hours}h {mins ? `${mins}m` : ""}</div>
            <div className="my-0.5 h-px w-full bg-border" />
            <span className="rounded-full bg-flights-soft px-2 py-0.5 text-[10px] font-semibold text-flights">
              {offer.direct ? "Direct" : `Via ${offer.via}`}
            </span>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold leading-tight">{offer.arriveTime ?? "—"}</div>
            <div className="text-[11px] font-bold text-foreground">{offer.to}</div>
            <div className="text-[10px] text-muted-foreground">{toCity ?? offer.to}</div>
          </div>
        </div>

        {/* Baggage chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Luggage className="h-3 w-3" /> 20kg check-in
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Briefcase className="h-3 w-3" /> 7kg cabin
          </span>
        </div>
      </div>

      {/* Footer: price + actions */}
      <div className="flex items-end justify-between gap-2 border-t border-border p-3">
        <div>
          <div className="text-[10px] text-muted-foreground">Price per person</div>
          <div className="text-xl font-extrabold text-flights">${offer.price}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={whatsappLink(offer.whatsapp || "252610000000", waMsg)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href={telLink(offer.phone || "+252610000000")}
            onClick={(e) => e.stopPropagation()}
            aria-label="Call"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            onClick={onShare}
            aria-label="Share"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-flights text-white active:scale-95"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={onSelect}
            className="ml-1 inline-flex h-9 items-center justify-center gap-1 rounded-full bg-amber-400 px-3 text-xs font-bold text-amber-950 shadow-soft active:scale-[0.98]"
          >
            <Plane className="h-3.5 w-3.5" /> Request Ticket
          </button>
        </div>
      </div>
    </article>
  );
}
