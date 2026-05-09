import { createFileRoute, Link, notFound, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DetailHeader } from "@/components/travel/DetailHeader";
import { ContactBar } from "@/components/travel/InfoList";
import {
  FLIGHT_OFFERS, AIRPORTS, INTL_DESTINATIONS,
  DEFAULT_AMENITIES, flightClassesFor,
} from "@/data/travel";
import {
  Plane, BadgeCheck, Star, Wifi, Utensils, BatteryCharging, Armchair,
  Tv, Crown, Luggage, Calendar, Clock, MapPin, ShieldCheck, Share2, Bookmark,
} from "lucide-react";

export const Route = createFileRoute("/travel/flights/$id")({
  component: FlightDetail,
  loader: ({ params }) => {
    const offer = FLIGHT_OFFERS.find((f) => f.id === params.id);
    if (!offer) throw notFound();
    return { offer };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.offer.name} — Flight Detail` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-sm">
        Flight not found. <Link to="/travel/flights" className="text-primary">Back</Link>
      </div>
    </AppShell>
  ),
});

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Free Wi-Fi": Wifi,
  "In-flight Meals": Utensils,
  "USB Charging": BatteryCharging,
  "Extra Legroom": Armchair,
  "Entertainment": Tv,
  "Lounge Access": Crown,
  "Check-in Baggage": Luggage,
};

function FlightDetail() {
  const { id } = useParams({ from: "/travel/flights/$id" });
  const offer = FLIGHT_OFFERS.find((f) => f.id === id)!;
  const allAirports = [...Object.values(AIRPORTS).flat(), ...INTL_DESTINATIONS];
  const fromCity = allAirports.find((a) => a.code === offer.from)?.city ?? offer.from;
  const toCity = allAirports.find((a) => a.code === offer.to)?.city ?? offer.to;

  const amenities = offer.amenities?.length ? offer.amenities : DEFAULT_AMENITIES;
  const classes = offer.classes?.length ? offer.classes : flightClassesFor(offer.price);
  const [selectedCls, setSelectedCls] = useState(classes[0].cls);
  const departDate = offer.departDate ?? "20 May 2026";
  const returnDate = offer.returnDate ?? "23 May 2026";
  const returnTime = offer.returnTime ?? "19:30";

  return (
    <AppShell hideNav>
      <DetailHeader
        title={offer.name}
        subtitle={`${fromCity} (${offer.from}) → ${toCity} (${offer.to})`}
        image={offer.logo}
      />

      {/* Trust + actions */}
      <section className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {offer.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Airline
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {offer.rating} ({offer.reviews} reviews)
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary" aria-label="Save">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Discover top airlines, compare fares, and send booking requests directly via WhatsApp or call.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] sm:grid-cols-4">
          {["No In-App Payments", "WhatsApp Booking", "Verified Airlines", "Save & Share"].map((t) => (
            <div key={t} className="flex items-center justify-center rounded-lg bg-secondary px-2 py-1.5 font-medium text-muted-foreground">
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Route card */}
      <section className="px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-1 text-sm font-bold">
            <MapPin className="h-4 w-4 text-primary" /> Route
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">From</div>
              <div className="text-lg font-extrabold">{offer.departTime ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{fromCity} ({offer.from})</div>
            </div>
            <div className="flex flex-col items-center text-[10px] text-muted-foreground">
              <Plane className="h-4 w-4 text-primary" />
              <span>{offer.durationHrs}h</span>
              <span className="font-semibold">{offer.direct ? "Direct" : `Via ${offer.via}`}</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">To</div>
              <div className="text-lg font-extrabold">{offer.arriveTime ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{toCity} ({offer.to})</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Depart:</span>
              <span className="font-semibold">{departDate} · {offer.departTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Return:</span>
              <span className="font-semibold">{returnDate} · {returnTime}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{offer.direct ? "Direct Flight" : `1 Stop (${offer.via})`} · {offer.durationHrs}h {Math.round((offer.durationHrs % 1) * 60)}m</span>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="px-4 pt-4">
        <h3 className="mb-2 text-sm font-bold">Amenities</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {amenities.map((a) => {
            const Icon = AMENITY_ICONS[a] ?? Plane;
            return (
              <div key={a} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 text-center">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-medium leading-tight">{a}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Available Classes */}
      <section className="px-4 pb-32 pt-4">
        <h3 className="mb-2 text-sm font-bold">Available Classes</h3>
        <div className="space-y-2">
          {classes.map((c) => {
            const active = selectedCls === c.cls;
            return (
              <button
                key={c.cls}
                onClick={() => setSelectedCls(c.cls)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">{c.cls}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.bags} Bag{c.bags > 1 ? "s" : ""} · {c.seat}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-primary">${c.price}</div>
                    {active && (
                      <div className="flex items-center justify-end gap-0.5 text-[10px] font-semibold text-primary">
                        <BadgeCheck className="h-3 w-3" /> Selected
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sticky CTA */}
      <section className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{selectedCls}</span>
          <span className="text-base font-extrabold text-primary">
            ${classes.find((c) => c.cls === selectedCls)?.price}
          </span>
        </div>
        <ContactBar whatsapp={offer.whatsapp} phone={offer.phone} label="Book Now" />
      </section>
    </AppShell>
  );
}
