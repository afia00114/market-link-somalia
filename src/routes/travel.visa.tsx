import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, PrimaryBtn, Chip, TextArea, Select } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { VISA_SERVICES, COUNTRIES, type VisaService } from "@/data/travel";
import { Search } from "lucide-react";

export const Route = createFileRoute("/travel/visa")({
  head: () => ({ meta: [{ title: "Visa Services — MaalsoorHub" }] }),
  component: VisaPage,
});

type Sort = "price" | "fast" | "rating";

function VisaPage() {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState<string>();
  const [nationality, setNationality] = useState<string>();
  const [visaType, setVisaType] = useState<"All" | "Tourist" | "Business" | "Transit">("All");
  const [sort, setSort] = useState<Sort>("price");
  const [picked, setPicked] = useState<VisaService>();
  const [form, setForm] = useState({ name: "", phone: "", passport: "", travelDate: "", applicants: 1, photoLink: "" });
  const [shared, setShared] = useState(false);

  const processingScore = (s: string): number => {
    const t = s.toLowerCase();
    if (t.includes("on arrival")) return 0;
    if (t.includes("urgent")) {
      const h = t.match(/(\d+)\s*h/);
      if (h) return Number(h[1]) / 24;
    }
    const nums = s.match(/\d+/g);
    if (!nums) return 999;
    return Number(nums[0]); // use minimum days
  };

  const results = useMemo(() => {
    let r = VISA_SERVICES.filter((v) => !destination || v.destination === destination);
    if (visaType !== "All") r = r.filter((v) => v.visaType === visaType);
    if (sort === "price") r = [...r].sort((a, b) => a.fee - b.fee);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "fast") r = [...r].sort((a, b) => processingScore(a.processingDays) - processingScore(b.processingDays));
    return r;
  }, [destination, visaType, sort]);

  const destName = COUNTRIES.find((c) => c.code === destination)?.name ?? destination;
  const natName = COUNTRIES.find((c) => c.code === nationality)?.name ?? nationality;

  const summary = picked
    ? `Hello ${picked.name},\n\nVisa request via MaalsoorHub:\n\n🛂 Destination: ${destName}\n🌍 Nationality: ${natName}\n📋 Type: ${picked.visaType}\n⏱ Processing: ${picked.processingDays}\n💵 Fee (listed): $${picked.fee}\n📅 Travel date: ${form.travelDate || "TBD"}\n👥 Applicants: ${form.applicants}\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n📔 Passport: ${form.passport}\n${form.photoLink ? `📎 Photo: ${form.photoLink}\n` : ""}\nPlease send required documents and payment instructions.`
    : "";

  return (
    <AppShell>
      <PageHeader title="Visa Services" subtitle="Tourist, business, transit" />
      <Stepper steps={["Destination", "Nationality", "Results", "Form", "Send"]} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && <CountrySelect label="Destination country" selected={destination} onSelect={(c) => { setDestination(c.code); setStep(1); }} />}
        {step === 1 && (
          <div className="space-y-3">
            <CountrySelect label="Your nationality (passport)" selected={nationality} onSelect={(c) => setNationality(c.code)} />
            <PrimaryBtn onClick={() => setStep(2)} disabled={!nationality}><Search className="mr-2 h-4 w-4" /> Search agencies</PrimaryBtn>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {(["All", "Tourist", "Business", "Transit"] as const).map((t) => (
                <Chip key={t} active={visaType === t} onClick={() => setVisaType(t)}>{t}</Chip>
              ))}
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Cheapest</Chip>
              <Chip active={sort === "fast"} onClick={() => setSort("fast")}>⚡ Fastest</Chip>
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Top Rated</Chip>
            </div>
            <div className="text-xs text-muted-foreground">{results.length} agencies offer visas to {destName}</div>
            <div className="space-y-2">
              {results.map((v) => (
                <ProviderRow
                  key={v.id} logo={v.logo} name={v.name} verified={v.verified} rating={v.rating} reviews={v.reviews} city={v.city}
                  badges={<><MiniBadge tone="primary">{v.visaType}</MiniBadge><MiniBadge>{v.processingDays}</MiniBadge><MiniBadge tone="accent">{v.successRate}% success</MiniBadge></>}
                  right={<div className="text-right"><div className="text-base font-extrabold text-primary">${v.fee}</div></div>}
                  onClick={() => { setPicked(v); setStep(3); }}
                />
              ))}
            </div>
          </div>
        )}
        {step === 3 && picked && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="font-bold">{picked.name}</div>
              <div className="mt-1 text-muted-foreground">Requirements: {picked.requirements.join(", ")}</div>
            </div>
            <Field label="Full name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Passport number"><TextInput value={form.passport} onChange={(e) => setForm({ ...form, passport: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Intended travel date"><TextInput type="date" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} /></Field>
              <Field label="Applicants"><TextInput type="number" min={1} value={form.applicants} onChange={(e) => setForm({ ...form, applicants: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Passport photo link (optional)" hint="Paste a Drive/Dropbox link if available"><TextInput value={form.photoLink} onChange={(e) => setForm({ ...form, photoLink: e.target.value })} /></Field>
            <PrimaryBtn onClick={() => { setShared(true); setStep(4); }} disabled={!form.name || !form.phone || !form.passport}>Continue</PrimaryBtn>
          </div>
        )}
        {step === 4 && picked && shared && (
          <SummaryShare providerName={picked.name} whatsapp={picked.whatsapp} phone={picked.phone} summary={summary} onBack={() => setStep(3)} />
        )}
      </section>
    </AppShell>
  );
}
