import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, Select, TextArea, PrimaryBtn, Chip } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { FLIGHT_OFFERS, AIRPORTS, INTL_DESTINATIONS, COUNTRIES, type FlightOffer } from "@/data/travel";
import { Plane, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/travel/flights")({
  head: () => ({ meta: [{ title: "Airline Tickets — MaalsoorHub" }] }),
  component: FlightsPage,
});

type Sort = "price" | "rating" | "high";

function FlightsPage() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<string>("SO");
  const [from, setFrom] = useState("MGQ");
  const [to, setTo] = useState("NBO");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState<"oneway" | "round">("oneway");
  const [sort, setSort] = useState<Sort>("price");
  const [directOnly, setDirectOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [picked, setPicked] = useState<FlightOffer>();
  const [form, setForm] = useState({ name: "", phone: "", adults: 1, children: 0, cls: "Economy", notes: "" });

  const departureAirports = AIRPORTS[country] ?? [];
  const destinationAirports = useMemo(
    () => [...(AIRPORTS[country] ?? []), ...INTL_DESTINATIONS].filter((a) => a.code !== from),
    [country, from],
  );
  const countryName = COUNTRIES.find((c) => c.code === country)?.name ?? country;

  const fromAirport = departureAirports.find((a) => a.code === from);
  const toAirport = [...departureAirports, ...INTL_DESTINATIONS].find((a) => a.code === to);

  const results = useMemo(() => {
    let r = FLIGHT_OFFERS.filter((f) => f.from === from && f.to === to);
    if (directOnly) r = r.filter((f) => f.direct);
    if (verifiedOnly) r = r.filter((f) => f.verified);
    if (sort === "price") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [from, to, sort, directOnly, verifiedOnly]);

  const pax = `${form.adults} adult${form.adults > 1 ? "s" : ""}${form.children ? `, ${form.children} child${form.children > 1 ? "ren" : ""}` : ""}`;
  const summary = picked
    ? `✈️ Flight Request from MaalsoorHub\n\nAgency: ${picked.name}\nCustomer: ${form.name}\nPhone: ${form.phone}\n\nRoute: ${fromAirport?.city ?? from} (${from}) → ${toAirport?.city ?? to} (${to})\nTrip: ${tripType === "round" ? "Round trip" : "One way"}\nDeparture: ${date || "Flexible"}${tripType === "round" ? `\nReturn: ${returnDate || "Flexible"}` : ""}\nPassengers: ${pax}\nClass: ${form.cls}\n${form.notes ? `Special requests: ${form.notes}\n` : ""}\nPlease contact the customer with availability and total price.`
    : "";

  const steps = ["Country", "Route", "Agencies", "Details", "Send"];

  return (
    <AppShell>
      <PageHeader title="Airline Tickets" subtitle="Find & book flights" />
      <Stepper steps={steps} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && (
          <CountrySelect
            label="Where are you flying from?"
            selected={country}
            onSelect={(c) => {
              setCountry(c.code);
              const first = AIRPORTS[c.code]?.[0];
              if (first) setFrom(first.code);
              setTimeout(() => setStep(1), 150);
            }}
          />
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl bg-secondary p-2 text-center text-[11px] text-muted-foreground">
              Showing airports for <b>{countryName}</b>
            </div>
            <Field label="From (departure)">
              <Select value={from} onChange={(e) => setFrom(e.target.value)}>
                {departureAirports.map((a) => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                ))}
              </Select>
            </Field>
            <Field label="To (destination)">
              <Select value={to} onChange={(e) => setTo(e.target.value)}>
                {destinationAirports.map((a) => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code}){a.international ? " 🌍" : ""}</option>
                ))}
              </Select>
            </Field>
            <div className="flex gap-2">
              <Chip active={tripType === "oneway"} onClick={() => setTripType("oneway")}>One way</Chip>
              <Chip active={tripType === "round"} onClick={() => setTripType("round")}>Round trip</Chip>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Departure date">
                <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
              {tripType === "round" && (
                <Field label="Return date">
                  <TextInput type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                </Field>
              )}
            </div>
            <PrimaryBtn onClick={() => setStep(2)}>
              <Plane className="mr-2 h-4 w-4" /> Search agencies
            </PrimaryBtn>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Lowest Price</Chip>
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Highest Rating</Chip>
              <Chip active={sort === "high"} onClick={() => setSort("high")}>🔝 Highest Price</Chip>
              <Chip active={directOnly} onClick={() => setDirectOnly((v) => !v)}>✈️ Direct only</Chip>
              <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>✅ Verified only</Chip>
            </div>
            <div className="text-xs text-muted-foreground">
              {results.length} agencies · {fromAirport?.city ?? from} ({from}) → {toAirport?.city ?? to} ({to})
              {date && ` · ${date}`}
            </div>
            <div className="space-y-2">
              {results.map((f) => (
                <ProviderRow
                  key={f.id}
                  logo={f.logo}
                  name={f.name}
                  verified={f.verified}
                  rating={f.rating}
                  reviews={f.reviews}
                  city={f.city}
                  badges={
                    <>
                      <MiniBadge tone="primary">{f.direct ? "Direct" : `Via ${f.via ?? "1 stop"}`}</MiniBadge>
                      <MiniBadge>{f.durationHrs}h</MiniBadge>
                      {f.departTime && <MiniBadge>{f.departTime}{f.arriveTime ? `→${f.arriveTime}` : ""}</MiniBadge>}
                      {f.yearsInBusiness && <MiniBadge>{f.yearsInBusiness}+ yrs</MiniBadge>}
                    </>
                  }
                  right={
                    <div className="text-right">
                      <div className="text-base font-extrabold text-primary">${f.price}</div>
                      <div className="text-[10px] text-muted-foreground">est. price</div>
                    </div>
                  }
                  onClick={() => { setPicked(f); setStep(3); }}
                />
              ))}
              {results.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No agencies match your filters for this route.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && picked && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="flex items-center gap-1 font-bold">
                {picked.name}
                {picked.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
              </div>
              <div className="text-muted-foreground">
                {fromAirport?.city ?? from} ({from}) → {toAirport?.city ?? to} ({to}) · ${picked.price} · {picked.direct ? "Direct" : `Via ${picked.via}`}
                {picked.departTime && ` · ${picked.departTime}`}
              </div>
            </div>
            <Field label="Full name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ahmed Hassan" /></Field>
            <Field label="Phone (WhatsApp)"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+252 61 ..." /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Adults"><TextInput type="number" min={1} value={form.adults} onChange={(e) => setForm({ ...form, adults: Math.max(1, Number(e.target.value)) })} /></Field>
              <Field label="Children"><TextInput type="number" min={0} value={form.children} onChange={(e) => setForm({ ...form, children: Math.max(0, Number(e.target.value)) })} /></Field>
              <Field label="Class">
                <Select value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>
                  <option>Economy</option><option>Business</option><option>First</option>
                </Select>
              </Field>
            </div>
            <Field label="Special requests (optional)">
              <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Wheelchair assistance, halal meal…" />
            </Field>
            <PrimaryBtn onClick={() => setStep(4)} disabled={!form.name || !form.phone}>Review &amp; share</PrimaryBtn>
          </div>
        )}

        {step === 4 && picked && (
          <SummaryShare
            providerName={picked.name}
            whatsapp={picked.whatsapp}
            phone={picked.phone}
            email={picked.email}
            subject={`Flight request: ${from} → ${to}`}
            summary={summary}
            onBack={() => setStep(3)}
          />
        )}
      </section>
    </AppShell>
  );
}
