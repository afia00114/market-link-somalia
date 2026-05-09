import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DetailHeader } from "@/components/travel/DetailHeader";
import { InfoList, ContactBar } from "@/components/travel/InfoList";
import { PILGRIM_PACKAGES } from "@/data/travel";
import { Calendar, Hotel, Plane, Users, BadgeCheck, Star } from "lucide-react";

export const Route = createFileRoute("/travel/hajj-umrah/$id")({
  component: PilgrimDetail,
  loader: ({ params }) => {
    const p = PILGRIM_PACKAGES.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.p.name} — ${loaderData?.p.type} Package` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-sm">Package not found. <Link to="/travel/hajj-umrah" className="text-primary">Back</Link></div>
    </AppShell>
  ),
});

function PilgrimDetail() {
  const { id } = useParams({ from: "/travel/hajj-umrah/$id" });
  const p = PILGRIM_PACKAGES.find((x) => x.id === id)!;

  const schedule = p.type === "Hajj"
    ? [
        { day: "Day 1–3", title: "Arrival in Jeddah", desc: "Transfer to Makkah, settle in hotel" },
        { day: "Day 4–8", title: "Umrah & preparation", desc: "Perform Umrah, group orientation" },
        { day: "Day 9", title: "Day of Arafah", desc: "Travel to Arafah, key Hajj rite" },
        { day: "Day 10–13", title: "Mina & rituals", desc: "Stoning, sacrifice, tawaf al-ifadah" },
        { day: "Day 14+", title: "Madinah ziyarah", desc: "Visit Prophet's Mosque, return home" },
      ]
    : [
        { day: "Day 1", title: "Arrival in Jeddah", desc: "Transfer to Makkah" },
        { day: "Day 2", title: "Perform Umrah", desc: "Tawaf, Sa'i, Halq" },
        { day: `Day 3–${Math.floor(p.durationDays / 2)}`, title: "Worship in Makkah", desc: "Daily prayers in Haram" },
        { day: "Following days", title: "Travel to Madinah", desc: "8-day stay near Prophet's Mosque" },
        { day: `Day ${p.durationDays}`, title: "Return", desc: "Transfer to Jeddah airport" },
      ];

  return (
    <AppShell hideNav>
      <DetailHeader title={p.name} subtitle={`${p.tier} ${p.type} · ${p.durationDays} days`} image={p.logo} />

      <section className="space-y-3 px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-bold">
              {p.name}
              {p.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <div className="text-2xl font-extrabold text-primary">${p.price}<span className="text-xs font-medium text-muted-foreground">/pilgrim</span></div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-semibold">{p.rating}</span>
            <span className="text-muted-foreground">({p.reviews})</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <h3 className="mb-3 text-sm font-bold">Daily schedule</h3>
          <ol className="space-y-3">
            {schedule.map((s, i) => (
              <li key={i} className="flex gap-3 border-l-2 border-primary/30 pl-3">
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase text-primary">{s.day}</div>
                  <div className="text-xs font-semibold">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <InfoList
          title="Hotel & flight"
          rows={[
            { icon: Hotel, label: "Accommodation", value: p.tier === "VIP" ? "5★ near Haram" : p.tier === "Standard" ? "4★ hotel" : "3★ hotel" },
            { icon: Plane, label: "Flights", value: "Round-trip included" },
            { icon: Users, label: "Group size", value: `${p.groupSize} pilgrims` },
            { icon: Calendar, label: "Duration", value: `${p.durationDays} days` },
          ]}
        />

        <div className="rounded-2xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-bold">Inclusions</h3>
          <div className="flex flex-wrap gap-1">
            {p.inclusions.map((i) => (
              <span key={i} className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">{i}</span>
            ))}
          </div>
        </div>

        <InfoList
          title="Payment schedule"
          rows={[
            { label: "Deposit (booking)", value: `$${Math.round(p.price * 0.2)}` },
            { label: "60 days before", value: `$${Math.round(p.price * 0.4)}` },
            { label: "Final payment", value: `$${Math.round(p.price * 0.4)}` },
          ]}
        />
      </section>

      <section className="sticky bottom-0 z-20 mt-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <ContactBar whatsapp={p.whatsapp} phone={p.phone} label="Join group" />
      </section>
    </AppShell>
  );
}
