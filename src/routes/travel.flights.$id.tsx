import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DetailHeader } from "@/components/travel/DetailHeader";
import { InfoList, ContactBar } from "@/components/travel/InfoList";
import { FLIGHT_OFFERS, AIRPORTS, INTL_DESTINATIONS } from "@/data/travel";
import { Plane, Clock, Luggage, Shield, CreditCard, BadgeCheck, Star } from "lucide-react";

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
      <div className="p-8 text-center text-sm">Flight not found. <Link to="/travel/flights" className="text-primary">Back</Link></div>
    </AppShell>
  ),
});

function FlightDetail() {
  const { id } = useParams({ from: "/travel/flights/$id" });
  const offer = FLIGHT_OFFERS.find((f) => f.id === id)!;
  const allAirports = [...Object.values(AIRPORTS).flat(), ...INTL_DESTINATIONS];
  const fromCity = allAirports.find((a) => a.code === offer.from)?.city ?? offer.from;
  const toCity = allAirports.find((a) => a.code === offer.to)?.city ?? offer.to;

  return (
    <AppShell hideNav>
      <DetailHeader title={offer.name} subtitle={`${fromCity} → ${toCity}`} image={offer.logo} />

      <section className="space-y-3 px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Departure</div>
              <div className="text-xl font-extrabold">{offer.departTime ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{fromCity} ({offer.from})</div>
            </div>
            <div className="flex flex-col items-center text-[10px] text-muted-foreground">
              <Plane className="h-4 w-4 text-primary" />
              <span>{offer.durationHrs}h</span>
              <span>{offer.direct ? "Direct" : `Via ${offer.via}`}</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Arrival</div>
              <div className="text-xl font-extrabold">{offer.arriveTime ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{toCity} ({offer.to})</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-1 text-xs">
              {offer.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="font-semibold">{offer.rating}</span>
              <span className="text-muted-foreground">({offer.reviews})</span>
            </div>
            <div className="text-2xl font-extrabold text-primary">${offer.price}</div>
          </div>
        </div>

        <InfoList
          title="Stopover"
          rows={[
            { icon: Clock, label: "Total duration", value: `${offer.durationHrs} hours` },
            { icon: Plane, label: "Stops", value: offer.direct ? "Non-stop" : `1 stop (${offer.via})` },
            ...(offer.via ? [{ icon: Clock, label: "Layover", value: "~1h 30m" }] : []),
          ]}
        />

        <InfoList
          title="Baggage allowance"
          rows={[
            { icon: Luggage, label: "Carry-on", value: "7 kg" },
            { icon: Luggage, label: "Checked", value: "23 kg" },
            { icon: Luggage, label: "Extra", value: "$15/kg" },
          ]}
        />

        <InfoList
          title="Refund policy"
          rows={[
            { icon: Shield, label: "Cancellation", value: "Up to 48h before" },
            { icon: Shield, label: "Refund fee", value: "$50" },
            { icon: Shield, label: "Date change", value: "Allowed once" },
          ]}
        />

        <InfoList
          title="Payment options"
          rows={[
            { icon: CreditCard, label: "EVC Plus", value: "Accepted" },
            { icon: CreditCard, label: "Bank transfer", value: "Accepted" },
            { icon: CreditCard, label: "Cash on confirm", value: "At office" },
          ]}
        />
      </section>

      <section className="sticky bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <ContactBar whatsapp={offer.whatsapp} phone={offer.phone} label="Confirm booking" />
        <Link
          to="/travel/flights"
          className="mt-2 block text-center text-[11px] font-medium text-muted-foreground"
        >
          Back to results
        </Link>
      </section>
    </AppShell>
  );
}
