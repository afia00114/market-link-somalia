import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, PrimaryBtn, Chip, TextArea, Select } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { TOUR_PACKAGES, COUNTRIES, type TourPackage, type TourType } from "@/data/travel";

export const Route = createFileRoute("/travel/tours")({
  head: () => ({ meta: [{ title: "Tour Packages — MaalsoorHub" }] }),
  component: ToursPage,
});

type Sort = "price" | "rating" | "duration";

function ToursPage() {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState<string>();
  const [tourType, setTourType] = useState<TourType | "All">("All");
  const [days, setDays] = useState<number | "any">("any");
  const [sort, setSort] = useState<Sort>("price");
  const [picked, setPicked] = useState<TourPackage>();
  const [form, setForm] = useState({ name: "", phone: "", travelers: 2, startDate: "", notes: "" });
  const [shared, setShared] = useState(false);

  const results = useMemo(() => {
    let r = TOUR_PACKAGES.filter((p) => !destination || p.destinationCountry === destination);
    if (tourType !== "All") r = r.filter((p) => p.tourType === tourType);
    if (days !== "any") r = r.filter((p) => p.days === days);
    if (sort === "price") r = [...r].sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "duration") r = [...r].sort((a, b) => a.days - b.days);
    return r;
  }, [destination, tourType, days, sort]);

  const destName = COUNTRIES.find((c) => c.code === destination)?.name ?? destination;

  const summary = picked
    ? `Hello ${picked.name},\n\nTour booking via MaalsoorHub:\n\n🗺 Destination: ${destName}\n🏷 Tour: ${picked.tourType} · ${picked.days} days · ${picked.private ? "Private" : "Shared"}\n📋 Itinerary: ${picked.itinerary.join(" → ")}\n🧳 Includes: ${picked.inclusions.join(", ")}\n💵 Listed: $${picked.pricePerPerson}/person\n👥 Travelers: ${form.travelers}\n📅 Start: ${form.startDate || "Flexible"}\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n${form.notes ? `📝 Requests: ${form.notes}\n` : ""}\nPlease confirm availability and payment.`
    : "";

  return (
    <AppShell>
      <PageHeader title="Tour Packages" subtitle="Safari · Beach · Cultural" />
      <Stepper steps={["Destination", "Filters", "Results", "Form", "Send"]} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && <CountrySelect label="Destination country" selected={destination} onSelect={(c) => { setDestination(c.code); setStep(1); }} />}
        {step === 1 && (
          <div className="space-y-3">
            <Field label="Tour type">
              <Select value={tourType} onChange={(e) => setTourType(e.target.value as any)}>
                <option value="All">All types</option>
                {(["Safari", "Beach", "Cultural", "Adventure", "City"] as TourType[]).map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Duration">
              <Select value={String(days)} onChange={(e) => setDays(e.target.value === "any" ? "any" : Number(e.target.value))}>
                <option value="any">Any length</option>
                <option value="3">3 days</option><option value="5">5 days</option><option value="7">7 days</option>
              </Select>
            </Field>
            <PrimaryBtn onClick={() => setStep(2)}>Show tours</PrimaryBtn>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {(["All", "Safari", "Beach", "Cultural", "Adventure", "City"] as const).map((t) => (
                <Chip key={t} active={tourType === t} onClick={() => setTourType(t)}>{t}</Chip>
              ))}
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Lowest</Chip>
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Top Rated</Chip>
              <Chip active={sort === "duration"} onClick={() => setSort("duration")}>🗓 Shortest</Chip>
            </div>
            <div className="text-xs text-muted-foreground">{results.length} tours</div>
            <div className="space-y-2">
              {results.map((p) => (
                <ProviderRow
                  key={p.id} logo={p.logo} name={p.name} verified={p.verified} rating={p.rating} reviews={p.reviews} city={p.city}
                  badges={<><MiniBadge tone="primary">{p.tourType}</MiniBadge><MiniBadge>{p.days} days</MiniBadge><MiniBadge>{p.private ? "Private" : "Shared"}</MiniBadge></>}
                  right={<div className="text-right"><div className="text-base font-extrabold text-primary">${p.pricePerPerson}</div><div className="text-[10px] text-muted-foreground">/person</div></div>}
                  footer={<div className="border-t border-border bg-secondary px-3 py-2 text-[11px] text-muted-foreground">{p.itinerary.join(" → ")}</div>}
                  onClick={() => { setPicked(p); setStep(3); }}
                />
              ))}
            </div>
          </div>
        )}
        {step === 3 && picked && (
          <div className="space-y-3">
            <Field label="Your name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Travelers"><TextInput type="number" min={1} value={form.travelers} onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })} /></Field>
              <Field label="Preferred start"><TextInput type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            </div>
            <Field label="Special requests"><TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
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
