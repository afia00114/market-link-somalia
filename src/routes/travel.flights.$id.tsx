import { createFileRoute, Link, notFound, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  FLIGHT_OFFERS, AIRPORTS, INTL_DESTINATIONS,
  DEFAULT_AMENITIES, flightClassesFor,
} from "@/data/travel";
import { whatsappLink, telLink } from "@/lib/contact";
import {
  Plane, BadgeCheck, Star, Wifi, Utensils, BatteryCharging, Armchair,
  Tv, Crown, Luggage, Briefcase, Calendar, Clock, ArrowLeft, ArrowRight,
  Share2, Bookmark, MessageCircle, Phone, ShieldCheck, MapPin,
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
        Flight not found. <Link to="/travel/flights" className="text-flights">Back</Link>
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
  const navigate = useNavigate();
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
  const code = (offer.name.match(/\b[A-Z]/g) || []).slice(0, 2).join("") || "AL";
  const hours = Math.floor(offer.durationHrs);
  const mins = Math.round((offer.durationHrs - hours) * 60);
  const selectedPrice = classes.find((c) => c.cls === selectedCls)?.price ?? offer.price;
  const waMsg = `Hello ${offer.name}, I'd like to book a ${selectedCls} ticket from ${fromCity} (${offer.from}) to ${toCity} (${offer.to}) on ${departDate}.`;

  return (
    <AppShell hideNav>
      {/* Blue gradient hero */}
      <header className="bg-flights-hero text-white">
        <div className="flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => navigate({ to: "/travel/flights" })}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 text-sm font-bold">
            <Plane className="h-4 w-4" /> Flight Detail
          </div>
          <div className="flex gap-2">
            <button aria-label="Save" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur active:scale-95">
              <Bookmark className="h-4 w-4" />
            </button>
            <button aria-label="Share" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur active:scale-95">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Airline identity card overlapping bottom */}
        <div className="px-4 pb-6 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-base font-extrabold text-flights shadow-soft">
              {code}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-extrabold leading-tight">{offer.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                {offer.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-semibold backdrop-blur">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-semibold backdrop-blur">
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> {offer.rating} · {offer.reviews}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-semibold backdrop-blur">
                  <Plane className="h-3 w-3" /> Intl
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Route timeline card (overlap) */}
      <section className="-mt-4 px-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-flights" /> {departDate}</span>
            <span className="rounded-full bg-flights-soft px-2 py-0.5 text-flights">
              {offer.direct ? "Direct" : `1 stop · via ${offer.via}`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-2xl font-extrabold leading-none">{offer.departTime ?? "—"}</div>
              <div className="mt-1 text-xs font-bold">{offer.from}</div>
              <div className="text-[11px] text-muted-foreground">{fromCity}</div>
            </div>
            <div className="flex flex-1 flex-col items-center px-2">
              <div className="text-[10px] font-semibold text-muted-foreground">{hours}h{mins ? ` ${mins}m` : ""}</div>
              <div className="my-1 flex w-full items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-flights" />
                <span className="h-px flex-1 bg-flights/40" />
                <Plane className="h-3.5 w-3.5 -rotate-90 text-flights" />
                <span className="h-px flex-1 bg-flights/40" />
                <span className="h-2 w-2 rounded-full bg-flights" />
              </div>
              <div className="text-[10px] text-muted-foreground">{offer.direct ? "Non-stop" : `Via ${offer.via}`}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold leading-none">{offer.arriveTime ?? "—"}</div>
              <div className="mt-1 text-xs font-bold">{offer.to}</div>
              <div className="text-[11px] text-muted-foreground">{toCity}</div>
            </div>
          </div>

          {/* Return leg */}
          <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <ArrowRight className="h-3 w-3 text-flights" />
              <span className="font-semibold">Return</span>
              <span className="text-muted-foreground">· {returnDate}</span>
            </div>
            <span className="font-bold">{returnTime}</span>
          </div>

          {/* Baggage chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-flights-soft px-2 py-1 text-[11px] font-medium text-flights">
              <Luggage className="h-3 w-3" /> 20kg check-in
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-flights-soft px-2 py-1 text-[11px] font-medium text-flights">
              <Briefcase className="h-3 w-3" /> 7kg cabin
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" /> On-time 92%
            </span>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-4 pt-4">
        <div className="grid grid-cols-4 gap-2 text-[10px]">
          {[
            { icon: ShieldCheck, t: "Verified" },
            { icon: MessageCircle, t: "WhatsApp" },
            { icon: BadgeCheck, t: "No prepay" },
            { icon: Bookmark, t: "Save" },
          ].map((x) => (
            <div key={x.t} className="flex flex-col items-center gap-1 rounded-xl bg-secondary px-2 py-2 font-medium text-muted-foreground">
              <x.icon className="h-4 w-4 text-flights" />
              <span>{x.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="px-4 pt-5">
        <h3 className="mb-2 text-sm font-bold">Amenities</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {amenities.map((a) => {
            const Icon = AMENITY_ICONS[a] ?? Plane;
            return (
              <div key={a} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-flights-soft">
                  <Icon className="h-4 w-4 text-flights" />
                </div>
                <span className="text-[11px] font-medium leading-tight">{a}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Available Classes */}
      <section className="px-4 pt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold">Available Classes</h3>
          <span className="text-[11px] text-muted-foreground">Select to update price</span>
        </div>
        <div className="space-y-2">
          {classes.map((c) => {
            const active = selectedCls === c.cls;
            return (
              <button
                key={c.cls}
                onClick={() => setSelectedCls(c.cls)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  active ? "border-flights bg-flights-soft ring-1 ring-flights" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm font-bold">
                      {c.cls}
                      {active && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-flights px-1.5 py-0.5 text-[9px] font-semibold text-white">
                          <BadgeCheck className="h-2.5 w-2.5" /> Selected
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {c.bags} Bag{c.bags > 1 ? "s" : ""} · {c.seat}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-flights">${c.price}</div>
                    <div className="text-[10px] text-muted-foreground">per person</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Route summary text */}
      <section className="px-4 pb-32 pt-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-2 flex items-center gap-1 text-sm font-bold">
            <MapPin className="h-4 w-4 text-flights" /> About this route
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {offer.name} operates {offer.direct ? "a direct flight" : `a connecting flight via ${offer.via}`} from {fromCity} ({offer.from}) to {toCity} ({offer.to}). Total travel time is approximately {hours}h{mins ? ` ${mins}m` : ""}. Confirm baggage policy and visa requirements with the airline before traveling.
          </p>
        </div>
      </section>

      {/* Sticky CTA */}
      <section className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <div className="text-[10px] text-muted-foreground">{selectedCls} · per person</div>
            <div className="text-xl font-extrabold text-flights">${selectedPrice}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={whatsappLink(offer.whatsapp || "252610000000", waMsg)}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={telLink(offer.phone || "+252610000000")}
              aria-label="Call"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
        <button
          onClick={() => {
            try { sessionStorage.setItem("flightBook", JSON.stringify({ id: offer.id, cls: selectedCls })); } catch { /* ignore */ }
            navigate({ to: "/travel/flights", search: { book: offer.id } as never });
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-flights font-bold text-white shadow-soft active:scale-[0.98]"
        >
          <Plane className="h-4 w-4" /> Request Ticket
        </button>
      </section>
    </AppShell>
  );
}
