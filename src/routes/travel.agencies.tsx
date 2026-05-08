import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, PrimaryBtn, Chip } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { AGENCIES, type Agency } from "@/data/travel";
import { whatsappLink, telLink } from "@/lib/contact";
import { MessageCircle, Phone, Mail, Clock, Search, BadgeCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/travel/agencies")({
  head: () => ({ meta: [{ title: "Travel Agencies — MaalsoorHub" }] }),
  component: AgenciesPage,
});

type Sort = "rating" | "services" | "reviews";

function AgenciesPage() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<string>();
  const [city, setCity] = useState("");
  const [sort, setSort] = useState<Sort>("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [picked, setPicked] = useState<Agency>();

  const results = useMemo(() => {
    let r = AGENCIES.filter((a) => !country || a.countryCode === country);
    if (city) r = r.filter((a) => a.city.toLowerCase().includes(city.toLowerCase()));
    if (verifiedOnly) r = r.filter((a) => a.verified);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "services") r = [...r].sort((a, b) => b.services.length - a.services.length);
    if (sort === "reviews") r = [...r].sort((a, b) => b.reviews - a.reviews);
    return r;
  }, [country, city, sort, verifiedOnly]);

  return (
    <AppShell>
      <PageHeader title="Travel Agencies" subtitle="Browse and contact directly" />
      <Stepper steps={["Country", "Filter", "Results", "Profile"]} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && (
          <CountrySelect selected={country} onSelect={(c) => { setCountry(c.code); setStep(1); }} />
        )}
        {step === 1 && (
          <div className="space-y-3">
            <Field label="City (optional)"><TextInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mogadishu, Nairobi…" /></Field>
            <PrimaryBtn onClick={() => setStep(2)}><Search className="mr-2 h-4 w-4" /> Show agencies</PrimaryBtn>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Top Rated</Chip>
              <Chip active={sort === "reviews"} onClick={() => setSort("reviews")}>💬 Most Reviewed</Chip>
              <Chip active={sort === "services"} onClick={() => setSort("services")}>Most Services</Chip>
              <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>✅ Verified only</Chip>
            </div>
            <div className="text-xs text-muted-foreground">{results.length} agencies</div>
            <div className="space-y-2">
              {results.map((a) => (
                <ProviderRow
                  key={a.id} logo={a.logo} name={a.name} verified={a.verified} rating={a.rating} reviews={a.reviews} city={a.city}
                  badges={<>{a.services.slice(0, 3).map((s) => <MiniBadge key={s} tone="primary">{s}</MiniBadge>)}</>}
                  onClick={() => { setPicked(a); setStep(3); }}
                />
              ))}
            </div>
          </div>
        )}
        {step === 3 && picked && (
          <div className="space-y-3">
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to results
            </button>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <img src={picked.logo} alt={picked.name} className="h-32 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-1">
                  <h2 className="text-base font-bold">{picked.name}</h2>
                  {picked.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{picked.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {picked.services.map((s) => <MiniBadge key={s} tone="primary">{s}</MiniBadge>)}
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-foreground">
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> {picked.hours}</div>
                  <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {picked.phone}</div>
                  {picked.email && <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {picked.email}</div>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={whatsappLink(picked.whatsapp, `Hello ${picked.name}, I found you on MaalsoorHub and would like to discuss your travel services.`)} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
              <a href={telLink(picked.phone)} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft active:scale-[0.98]">
                <Phone className="h-5 w-5" /> Call
              </a>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
