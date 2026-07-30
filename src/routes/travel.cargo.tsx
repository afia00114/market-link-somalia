import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Field, TextInput, Chip, Select } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { CARGO_PROVIDERS, type CargoProvider, type CargoMode } from "@/data/travel";
import { whatsappLink, telLink } from "@/lib/contact";
import { MessageCircle, Phone, ArrowLeft, Check, X, Search } from "lucide-react";

export const Route = createFileRoute("/travel/cargo")({
  head: () => ({
    meta: [
      { title: "Cargo & Shipping — MaalsoorHub" },
      { name: "description", content: "Send parcels and freight by air, sea or road with verified cargo agents. Compare rates, customs support and tracking." },
      { property: "og:title", content: "Cargo & Shipping — MaalsoorHub" },
      { property: "og:description", content: "Verified cargo providers — compare rates and contact directly via WhatsApp or call." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/travel/cargo" },
    ],
    links: [{ rel: "canonical", href: "https://market-link-somalia.lovable.app/travel/cargo" }],
  }),
  component: CargoPage,
});

const MODES: ("All" | CargoMode)[] = ["All", "Air", "Sea", "Road"];

function CargoPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState<"All" | CargoMode>("All");
  const [weight, setWeight] = useState<number>(10);
  const [picked, setPicked] = useState<CargoProvider | null>(null);

  const results = useMemo(() => {
    const f = from.trim().toLowerCase();
    const t = to.trim().toLowerCase();
    let r = CARGO_PROVIDERS.filter((p) => {
      if (mode !== "All" && !p.modes.includes(mode)) return false;
      if (!f && !t) return true;
      return p.routes.some((rt) => {
        const lc = rt.toLowerCase();
        return (!f || lc.includes(f)) && (!t || lc.includes(t));
      });
    });
    r = [...r].sort((a, b) => (a.rateFromPerKg ?? 999) - (b.rateFromPerKg ?? 999));
    return r;
  }, [from, to, mode]);

  const estimate = (p: CargoProvider) =>
    p.rateFromPerKg ? Math.round(p.rateFromPerKg * weight) : null;

  return (
    <AppShell>
      <PageHeader title="Cargo & Shipping" subtitle="Air · Sea · Road" />

      <section className="space-y-3 px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Origin">
            <TextInput value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Mogadishu, Dubai…" />
          </Field>
          <Field label="Destination">
            <TextInput value={to} onChange={(e) => setTo(e.target.value)} placeholder="Nairobi, Hargeisa…" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Mode">
            <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
              {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="Weight (kg)">
            <TextInput
              type="number"
              min={1}
              value={weight}
              onChange={(e) => setWeight(Math.max(1, Number(e.target.value) || 1))}
            />
          </Field>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Search className="h-3.5 w-3.5" />
          {results.length} provider{results.length === 1 ? "" : "s"} match your search
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No cargo providers match these filters.
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((p) => {
              const est = estimate(p);
              return (
                <ProviderRow
                  key={p.id}
                  logo={p.logo}
                  name={p.name}
                  verified={p.verified}
                  rating={p.rating}
                  reviews={p.reviews}
                  city={p.city}
                  badges={
                    <>
                      {p.modes.map((m) => <MiniBadge key={m} tone="primary">{m}</MiniBadge>)}
                      {p.doorToDoor && <MiniBadge>Door-to-door</MiniBadge>}
                      {p.trackingAvailable && <MiniBadge tone="accent">Tracking</MiniBadge>}
                    </>
                  }
                  right={
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground">from</div>
                      <div className="text-base font-extrabold text-primary">${p.rateFromPerKg}/kg</div>
                      {est !== null && (
                        <div className="text-[10px] text-muted-foreground">~${est} for {weight}kg</div>
                      )}
                    </div>
                  }
                  onClick={() => setPicked(p)}
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
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-border bg-card p-2 text-center">
                  <div className="text-[10px] uppercase text-muted-foreground">Per kg</div>
                  <div className="mt-0.5 text-sm font-bold">${picked.rateFromPerKg}</div>
                </div>
                <div className="rounded-xl border border-border bg-card p-2 text-center">
                  <div className="text-[10px] uppercase text-muted-foreground">Per CBM</div>
                  <div className="mt-0.5 text-sm font-bold">${picked.rateFromPerCbm}</div>
                </div>
                <div className="rounded-xl border border-border bg-card p-2 text-center">
                  <div className="text-[10px] uppercase text-muted-foreground">Modes</div>
                  <div className="mt-0.5 text-sm font-bold">{picked.modes.join(" · ")}</div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-bold">Services</h4>
                <ul className="space-y-1.5 text-[13px]">
                  {[
                    { label: "Door-to-door pickup & delivery", on: picked.doorToDoor },
                    { label: "Customs clearance support", on: picked.customsSupport },
                    { label: "Shipment tracking", on: picked.trackingAvailable },
                  ].map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full ${s.on ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>
                        {s.on ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </span>
                      <span className={s.on ? "" : "text-muted-foreground line-through"}>{s.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-bold">Available routes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {picked.routes.map((r) => (
                    <MiniBadge key={r}>{r}</MiniBadge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappLink(
                    picked.whatsapp,
                    `Hello ${picked.name}, I need a cargo quote via MaalsoorHub.\n\nFrom: ${from || "TBD"}\nTo: ${to || "TBD"}\nMode: ${mode}\nWeight: ${weight} kg`,
                  )}
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
