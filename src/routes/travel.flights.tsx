import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, Select, TextArea, PrimaryBtn, Chip } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { FLIGHT_OFFERS, COUNTRIES, type FlightOffer } from "@/data/travel";
import { Plane } from "lucide-react";

export const Route = createFileRoute("/travel/flights")({
  head: () => ({ meta: [{ title: "Airline Tickets — MaalsoorHub" }] }),
  component: FlightsPage,
});

type Sort = "price" | "rating" | "direct" | "high";

function FlightsPage() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<string>();
  const [from, setFrom] = useState("MGQ");
  const [to, setTo] = useState("NBO");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState<Sort>("price");
  const [picked, setPicked] = useState<FlightOffer>();
  const [form, setForm] = useState({ name: "", phone: "", pax: 1, cls: "Economy", notes: "" });
  const [shared, setShared] = useState(false);

  const results = useMemo(() => {
    let r = FLIGHT_OFFERS.filter((f) => f.from === from && f.to === to);
    if (sort === "price") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "direct") r = r.filter((f) => f.direct);
    return r;
  }, [from, to, sort]);

  const summary = picked
    ? `Hello ${picked.name},\n\nI found you on MaalsoorHub. I'd like to book a flight:\n\n✈️ Route: ${from} → ${to}\n📅 Date: ${date || "Flexible"}\n👥 Passengers: ${form.pax}\n💺 Class: ${form.cls}\n💵 Listed: $${picked.price}\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n${form.notes ? `📝 Notes: ${form.notes}\n` : ""}\nPlease confirm availability and payment.`
    : "";

  const steps = ["Country", "Search", "Results", "Details", "Send"];

  return (
    <AppShell>
      <PageHeader title="Airline Tickets" subtitle="Find & book flights" />
      <Stepper steps={steps} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && (
          <CountrySelect
            label="Where are you flying from?"
            selected={country}
            onSelect={(c) => { setCountry(c.code); setTimeout(() => setStep(1), 150); }}
          />
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="From (airport code)"><TextInput value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} placeholder="MGQ" /></Field>
              <Field label="To (airport code)"><TextInput value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} placeholder="NBO" /></Field>
            </div>
            <Field label="Travel date (optional)"><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <PrimaryBtn onClick={() => setStep(2)}><Plane className="mr-2 h-4 w-4" /> Search flights</PrimaryBtn>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Lowest Price</Chip>
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Highest Rating</Chip>
              <Chip active={sort === "direct"} onClick={() => setSort("direct")}>✈️ Direct only</Chip>
              <Chip active={sort === "high"} onClick={() => setSort("high")}>🔝 Highest Price</Chip>
            </div>
            <div className="text-xs text-muted-foreground">{results.length} agencies found · {from} → {to}</div>
            <div className="space-y-2">
              {results.map((f) => (
                <ProviderRow
                  key={f.id} logo={f.logo} name={f.name} verified={f.verified} rating={f.rating} reviews={f.reviews} city={f.city}
                  badges={<>
                    <MiniBadge tone="primary">{f.direct ? "Direct" : "1 stop"}</MiniBadge>
                    <MiniBadge>{f.durationHrs}h</MiniBadge>
                  </>}
                  right={<div className="text-right"><div className="text-base font-extrabold text-primary">${f.price}</div><div className="text-[10px] text-muted-foreground">per person</div></div>}
                  onClick={() => { setPicked(f); setStep(3); }}
                />
              ))}
              {results.length === 0 && <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">No flights match your filters.</div>}
            </div>
          </div>
        )}

        {step === 3 && picked && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="font-bold">{picked.name}</div>
              <div className="text-muted-foreground">{from} → {to} · ${picked.price} · {picked.direct ? "Direct" : "1 stop"}</div>
            </div>
            <Field label="Your name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cabdi Yusuf" /></Field>
            <Field label="Phone (WhatsApp)"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+252 61 ..." /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Passengers"><TextInput type="number" min={1} value={form.pax} onChange={(e) => setForm({ ...form, pax: Number(e.target.value) })} /></Field>
              <Field label="Class">
                <Select value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>
                  <option>Economy</option><option>Business</option><option>First</option>
                </Select>
              </Field>
            </div>
            <Field label="Special requests"><TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Window seat, meal preference…" /></Field>
            <PrimaryBtn onClick={() => { setShared(true); setStep(4); }} disabled={!form.name || !form.phone}>Continue</PrimaryBtn>
          </div>
        )}

        {step === 4 && picked && shared && (
          <SummaryShare providerName={picked.name} whatsapp={picked.whatsapp} phone={picked.phone} summary={summary} onBack={() => setStep(3)} />
        )}
      </section>

      {COUNTRIES.length === 0 && null}
    </AppShell>
  );
}
