import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DetailHeader } from "@/components/travel/DetailHeader";
import { InfoList, ContactBar } from "@/components/travel/InfoList";
import { AGENCIES, FLIGHT_OFFERS, TOUR_PACKAGES } from "@/data/travel";
import { BadgeCheck, Star, Clock, Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/travel/agencies/$id")({
  component: AgencyDetail,
  loader: ({ params }) => {
    const a = AGENCIES.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return { a };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.a.name} — Agency` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-sm">Agency not found. <Link to="/travel/agencies" className="text-primary">Back</Link></div>
    </AppShell>
  ),
});

function AgencyDetail() {
  const { id } = useParams({ from: "/travel/agencies/$id" });
  const a = AGENCIES.find((x) => x.id === id)!;
  const flights = FLIGHT_OFFERS.filter((f) => f.name === a.name).slice(0, 3);
  const tours = TOUR_PACKAGES.filter((t) => t.name === a.name).slice(0, 3);

  return (
    <AppShell hideNav>
      <DetailHeader title={a.name} subtitle={a.city} image={a.logo} />

      <section className="space-y-3 px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1 text-sm font-bold">
            {a.name}
            {a.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-semibold">{a.rating}</span>
            <span className="text-muted-foreground">({a.reviews} reviews)</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{a.description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {a.services.map((s) => (
              <span key={s} className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>
            ))}
          </div>
        </div>

        <InfoList
          title="Contact & hours"
          rows={[
            { icon: MapPin, label: "Location", value: a.city },
            { icon: Clock, label: "Hours", value: a.hours },
            { icon: Phone, label: "Phone", value: a.phone },
            ...(a.email ? [{ icon: Mail, label: "Email", value: a.email }] : []),
          ]}
        />

        {flights.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-3">
            <h3 className="mb-2 text-sm font-bold">Available flights</h3>
            <ul className="space-y-2">
              {flights.map((f) => (
                <li key={f.id} className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-xs">
                  <div>
                    <div className="font-semibold">{f.from} → {f.to}</div>
                    <div className="text-muted-foreground">{f.direct ? "Direct" : `Via ${f.via}`} · {f.durationHrs}h</div>
                  </div>
                  <Link to="/travel/flights/$id" params={{ id: f.id }} className="font-bold text-primary">${f.price}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tours.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-3">
            <h3 className="mb-2 text-sm font-bold">Tour packages</h3>
            <ul className="space-y-2">
              {tours.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-xs">
                  <div>
                    <div className="font-semibold">{t.tourType} · {t.days} days</div>
                    <div className="text-muted-foreground line-clamp-1">{t.itinerary.join(" → ")}</div>
                  </div>
                  <Link to="/travel/tours/$id" params={{ id: t.id }} className="font-bold text-primary">${t.pricePerPerson}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="sticky bottom-0 z-20 mt-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <ContactBar whatsapp={a.whatsapp} phone={a.phone} email={a.email} />
      </section>
    </AppShell>
  );
}
