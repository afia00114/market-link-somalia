import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Field, TextInput, Chip } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { BUS_OPERATORS, type BusOperator } from "@/data/travel";
import { whatsappLink, telLink } from "@/lib/contact";
import { MessageCircle, Phone, Search, ArrowLeft, Clock } from "lucide-react";

export const Route = createFileRoute("/travel/bus")({
  head: () => ({
    meta: [
      { title: "Bus Tickets — MaalsoorHub" },
      { name: "description", content: "Book intercity and cross-border bus tickets with verified operators across Somalia and East Africa. Compare classes, schedules and fares." },
      { property: "og:title", content: "Bus Tickets — MaalsoorHub" },
      { property: "og:description", content: "Verified bus operators — compare schedules and contact directly via WhatsApp or call." },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/travel/bus" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://market-link-somalia.lovable.app/travel/bus" }],
  }),
  component: BusPage,
});

type Sort = "price" | "rating" | "duration";

function BusPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<Sort>("price");
  const [picked, setPicked] = useState<BusOperator | null>(null);

  const results = useMemo(() => {
    const f = from.trim().toLowerCase();
    const t = to.trim().toLowerCase();
    let r = BUS_OPERATORS.filter((op) =>
      op.routes.some(
        (rt) =>
          (!f || rt.from.toLowerCase().includes(f)) && (!t || rt.to.toLowerCase().includes(t)),
      ),
    );
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "price") {
      const minPrice = (op: BusOperator) => Math.min(...op.routes.map((x) => x.price));
      r = [...r].sort((a, b) => minPrice(a) - minPrice(b));
    }
    if (sort === "duration") {
      const minDur = (op: BusOperator) => Math.min(...op.routes.map((x) => x.durationHrs));
      r = [...r].sort((a, b) => minDur(a) - minDur(b));
    }
    return r;
  }, [from, to, sort]);

  return (
    <AppShell>
      <PageHeader title="Bus Tickets" subtitle="Intercity & cross-border" />

      <section className="space-y-3 px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="From">
            <TextInput value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Mogadishu, Nairobi…" />
          </Field>
          <Field label="To">
            <TextInput value={to} onChange={(e) => setTo(e.target.value)} placeholder="Kismayo, Mombasa…" />
          </Field>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Cheapest</Chip>
          <Chip active={sort === "duration"} onClick={() => setSort("duration")}>⚡ Fastest</Chip>
          <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Top Rated</Chip>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Search className="h-3.5 w-3.5" />
          {results.length} operator{results.length === 1 ? "" : "s"} match your search
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No bus operators match these stops.
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((op) => {
              const minPrice = Math.min(...op.routes.map((r) => r.price));
              return (
                <ProviderRow
                  key={op.id}
                  logo={op.logo}
                  name={op.name}
                  verified={op.verified}
                  rating={op.rating}
                  reviews={op.reviews}
                  city={op.city}
                  badges={
                    <>
                      <MiniBadge tone="primary">{op.routes.length} route{op.routes.length === 1 ? "" : "s"}</MiniBadge>
                      <MiniBadge>{op.routes[0].classes.join(" / ")}</MiniBadge>
                    </>
                  }
                  right={
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground">from</div>
                      <div className="text-base font-extrabold text-primary">${minPrice}</div>
                    </div>
                  }
                  onClick={() => setPicked(op)}
                />
              );
            })}
          </div>
        )}
      </section>

      {picked && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setPicked(null)}>
          <div
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grad-travel rounded-t-3xl px-5 pb-5 pt-5 text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPicked(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                  aria-label="Close"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <div className="text-base font-bold">{picked.name}</div>
                  <div className="text-xs text-white/85">
                    {picked.city} · ⭐ {picked.rating} ({picked.reviews})
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <h4 className="mb-2 text-sm font-bold">Routes & schedules</h4>
                <div className="space-y-2">
                  {picked.routes.map((rt, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold">
                          {rt.from} <span className="text-muted-foreground">→</span> {rt.to}
                        </div>
                        <div className="text-base font-extrabold text-primary">${rt.price}</div>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {rt.durationHrs}h
                        </span>
                        <span>· Departs: {rt.departTimes.join(", ")}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {rt.classes.map((c) => (
                          <MiniBadge key={c} tone="primary">{c}</MiniBadge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappLink(picked.whatsapp, `Hello ${picked.name}, I'd like to book a bus ticket via MaalsoorHub.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[oklch(0.7_0.18_150)] font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={telLink(picked.phone)}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
