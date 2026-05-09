import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DetailHeader } from "@/components/travel/DetailHeader";
import { InfoList, ContactBar } from "@/components/travel/InfoList";
import { CAR_OFFERS } from "@/data/travel";
import { Shield, Gauge, Fuel, Wallet, Settings, Users, BadgeCheck, Star } from "lucide-react";

export const Route = createFileRoute("/travel/car-rental/$id")({
  component: CarDetail,
  loader: ({ params }) => {
    const c = CAR_OFFERS.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.c.model} — Car Rental` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-sm">Car not found. <Link to="/travel/car-rental" className="text-primary">Back</Link></div>
    </AppShell>
  ),
});

function CarDetail() {
  const { id } = useParams({ from: "/travel/car-rental/$id" });
  const c = CAR_OFFERS.find((x) => x.id === id)!;
  const seats = c.carType === "Minibus" ? 14 : c.carType === "4x4" || c.carType === "SUV" ? 7 : 5;

  return (
    <AppShell hideNav>
      <DetailHeader title={c.model} subtitle={`${c.carType} · ${c.transmission}`} image={c.logo} />

      <section className="space-y-3 px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-bold">
              {c.name}
              {c.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <div className="text-2xl font-extrabold text-primary">${c.dailyRate}<span className="text-xs font-medium text-muted-foreground">/day</span></div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-semibold">{c.rating}</span>
            <span className="text-muted-foreground">({c.reviews})</span>
          </div>
        </div>

        <InfoList
          title="Vehicle specs"
          rows={[
            { icon: Settings, label: "Transmission", value: c.transmission },
            { icon: Users, label: "Seats", value: seats },
            { icon: Fuel, label: "Fuel", value: c.carType === "Luxury" ? "Petrol" : "Diesel/Petrol" },
            { icon: Gauge, label: "Mileage", value: c.mileageLimit },
          ]}
        />

        <InfoList
          title="Insurance options"
          rows={[
            { icon: Shield, label: "Basic (CDW)", value: "Included" },
            { icon: Shield, label: "Theft protection", value: "Included" },
            { icon: Shield, label: "Full coverage", value: "+$15/day" },
          ]}
        />

        <InfoList
          title="Fuel policy"
          rows={[
            { icon: Fuel, label: "Pickup", value: "Full tank" },
            { icon: Fuel, label: "Return", value: "Full tank" },
            { icon: Fuel, label: "Refill fee", value: "Market rate" },
          ]}
        />

        <InfoList
          title="Deposit & terms"
          rows={[
            { icon: Wallet, label: "Deposit", value: `$${c.deposit}` },
            { icon: Wallet, label: "Min age", value: "21 years" },
            { icon: Wallet, label: "License", value: "Valid required" },
            { icon: Wallet, label: "Refund", value: "On safe return" },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-bold">Features</h3>
          <div className="flex flex-wrap gap-1">
            {c.features.map((f) => (
              <span key={f} className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky bottom-0 z-20 mt-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <ContactBar whatsapp={c.whatsapp} phone={c.phone} label="Confirm rental" />
      </section>
    </AppShell>
  );
}
