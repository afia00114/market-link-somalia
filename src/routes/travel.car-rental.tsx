import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, PrimaryBtn, Chip, TextArea, Select } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { CAR_OFFERS, type CarOffer, type CarType } from "@/data/travel";

export const Route = createFileRoute("/travel/car-rental")({
  head: () => ({
    meta: [
      { title: "Car Rental in Somalia — MaalsoorHub" },
      { name: "description", content: "Rent cars from verified agencies across Somalia and East Africa. Compare daily rates, automatic vs manual, and book directly via WhatsApp." },
      { property: "og:title", content: "Car Rental in Somalia — MaalsoorHub" },
      { property: "og:description", content: "Compare and book car rentals from verified providers via WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/travel/car-rental" },
    ],
    links: [{ rel: "canonical", href: "https://market-link-somalia.lovable.app/travel/car-rental" }],
  }),
  component: CarRentalPage,
});

type Sort = "price" | "rating";

function CarRentalPage() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<string>();
  const [city, setCity] = useState("");
  const [pickUp, setPickUp] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [pickUpLoc, setPickUpLoc] = useState("Airport");
  const [carType, setCarType] = useState<CarType | "All">("All");
  const [sort, setSort] = useState<Sort>("price");
  const [autoOnly, setAutoOnly] = useState(false);
  const [picked, setPicked] = useState<CarOffer>();
  const [form, setForm] = useState({ name: "", phone: "", license: "", deliveryAddr: "", notes: "" });
  const [shared, setShared] = useState(false);

  const results = useMemo(() => {
    let r = CAR_OFFERS.filter((c) => !country || c.countryCode === country);
    if (city) r = r.filter((c) => c.city.toLowerCase().includes(city.toLowerCase()));
    if (carType !== "All") r = r.filter((c) => c.carType === carType);
    if (autoOnly) r = r.filter((c) => c.transmission === "Automatic");
    if (sort === "price") r = [...r].sort((a, b) => a.dailyRate - b.dailyRate);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [country, city, carType, sort, autoOnly]);

  const summary = picked
    ? `Hello ${picked.name},\n\nCar rental request via MaalsoorHub:\n\n🚗 Car: ${picked.model} (${picked.carType})\n⚙️ Transmission: ${picked.transmission}\n💵 Listed: $${picked.dailyRate}/day · Deposit $${picked.deposit}\n📍 Pick-up: ${pickUpLoc} (${city})\n📅 ${pickUp || "TBD"} → ${dropOff || "TBD"}\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n${form.license ? `🪪 License: ${form.license}\n` : ""}${form.deliveryAddr ? `🏠 Delivery: ${form.deliveryAddr}\n` : ""}${form.notes ? `📝 Notes: ${form.notes}\n` : ""}\nPlease confirm availability and rental terms.`
    : "";

  return (
    <AppShell>
      <PageHeader title="Car Rental" subtitle="Rent any vehicle" />
      <Stepper steps={["Country", "Trip", "Results", "Form", "Send"]} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && <CountrySelect selected={country} onSelect={(c) => { setCountry(c.code); setStep(1); }} />}
        {step === 1 && (
          <div className="space-y-3">
            <Field label="City"><TextInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mogadishu, Nairobi…" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pick-up date"><TextInput type="date" value={pickUp} onChange={(e) => setPickUp(e.target.value)} /></Field>
              <Field label="Drop-off date"><TextInput type="date" value={dropOff} onChange={(e) => setDropOff(e.target.value)} /></Field>
            </div>
            <Field label="Pick-up location">
              <Select value={pickUpLoc} onChange={(e) => setPickUpLoc(e.target.value)}>
                <option>Airport</option><option>City center</option><option>Hotel delivery</option>
              </Select>
            </Field>
            <Field label="Car type">
              <Select value={carType} onChange={(e) => setCarType(e.target.value as any)}>
                <option value="All">All types</option>
                {(["Economy", "SUV", "Luxury", "Minibus", "4x4"] as CarType[]).map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <PrimaryBtn onClick={() => setStep(2)}>Search cars</PrimaryBtn>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Lowest</Chip>
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Top Rated</Chip>
              <Chip active={autoOnly} onClick={() => setAutoOnly((v) => !v)}>⚙️ Automatic only</Chip>
            </div>
            <div className="text-xs text-muted-foreground">{results.length} cars available</div>
            <div className="space-y-2">
              {results.map((c) => (
                <ProviderRow
                  key={c.id} logo={c.logo} name={`${c.model}`} verified={c.verified} rating={c.rating} reviews={c.reviews} city={c.city}
                  badges={<><MiniBadge tone="primary">{c.carType}</MiniBadge><MiniBadge>{c.transmission}</MiniBadge>{c.features.slice(0, 2).map((f) => <MiniBadge key={f}>{f}</MiniBadge>)}</>}
                  right={<div className="text-right"><div className="text-base font-extrabold text-primary">${c.dailyRate}</div><div className="text-[10px] text-muted-foreground">/day</div></div>}
                  footer={<div className="border-t border-border bg-secondary px-3 py-2 text-[11px] text-muted-foreground">{c.name} · {c.mileageLimit} · Deposit ${c.deposit}</div>}
                  onClick={() => { setPicked(c); setStep(3); }}
                />
              ))}
            </div>
          </div>
        )}
        {step === 3 && picked && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="font-bold">{picked.model} · {picked.name}</div>
              <div className="text-muted-foreground">${picked.dailyRate}/day · Deposit ${picked.deposit} · {picked.mileageLimit}</div>
            </div>
            <Field label="Full name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Driver's license # (optional)"><TextInput value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} /></Field>
            <Field label="Delivery address (if applicable)"><TextInput value={form.deliveryAddr} onChange={(e) => setForm({ ...form, deliveryAddr: e.target.value })} /></Field>
            <Field label="Special requests"><TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Child seat, GPS, driver…" /></Field>
            <PrimaryBtn onClick={() => { setShared(true); setStep(4); }} disabled={!form.name || !form.phone}>Continue</PrimaryBtn>
          </div>
        )}
        {step === 4 && picked && shared && (
          <SummaryShare providerName={picked.name} whatsapp={picked.whatsapp} phone={picked.phone} summary={summary} onBack={() => setStep(3)} />
        )}
      </section>
    </AppShell>
  );
}
