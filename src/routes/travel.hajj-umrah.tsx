import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, PrimaryBtn, Chip, TextArea } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { PILGRIM_PACKAGES, type PilgrimPackage, type PilgrimType, type PilgrimTier } from "@/data/travel";

export const Route = createFileRoute("/travel/hajj-umrah")({
  head: () => ({
    meta: [
      { title: "Hajj & Umrah Packages — MaalsoorHub" },
      { name: "description", content: "Browse Hajj and Umrah packages from verified Somali agencies. Compare tiers, durations, and inclusions, and book directly via WhatsApp." },
      { property: "og:title", content: "Hajj & Umrah Packages — MaalsoorHub" },
      { property: "og:description", content: "Compare verified Hajj and Umrah packages and contact agencies via WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/travel/hajj-umrah" },
    ],
    links: [{ rel: "canonical", href: "https://market-link-somalia.lovable.app/travel/hajj-umrah" }],
  }),
  component: HajjPage,
});

type Sort = "price" | "rating" | "duration";

function HajjPage() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<PilgrimType>("Umrah");
  const [country, setCountry] = useState<string>();
  const [tier, setTier] = useState<PilgrimTier | "All">("All");
  const [sort, setSort] = useState<Sort>("price");
  const [picked, setPicked] = useState<PilgrimPackage>();
  const [form, setForm] = useState({ name: "", phone: "", passport: "", pilgrims: 1, special: "" });
  const [shared, setShared] = useState(false);

  const results = useMemo(() => {
    let r = PILGRIM_PACKAGES.filter((p) => p.type === type);
    if (tier !== "All") r = r.filter((p) => p.tier === tier);
    if (sort === "price") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "duration") r = [...r].sort((a, b) => a.durationDays - b.durationDays);
    return r;
  }, [type, tier, sort]);

  const summary = picked
    ? `Assalamu Alaikum ${picked.name},\n\nPilgrimage request via MaalsoorHub:\n\n🕋 Service: ${picked.type} (${picked.tier})\n📅 Duration: ${picked.durationDays} days\n💵 Listed: $${picked.price}/pilgrim\n🧳 Inclusions: ${picked.inclusions.join(", ")}\n👥 Pilgrims: ${form.pilgrims}\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n📔 Passport: ${form.passport}\n${form.special ? `📝 Special needs: ${form.special}\n` : ""}\nPlease confirm seats and payment instructions.`
    : "";

  return (
    <AppShell>
      <PageHeader title="Hajj & Umrah" subtitle="Pilgrimage packages" />
      <Stepper steps={["Service", "Country", "Package", "Form", "Send"]} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold">Choose service</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["Hajj", "Umrah"] as PilgrimType[]).map((t) => (
                <button key={t} onClick={() => { setType(t); setStep(1); }}
                  className={`rounded-2xl border p-4 text-left transition ${type === t ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                  <div className="text-2xl">{t === "Hajj" ? "🕋" : "🌙"}</div>
                  <div className="mt-2 text-sm font-bold">{t}</div>
                  <div className="text-[11px] text-muted-foreground">{t === "Hajj" ? "Annual pilgrimage" : "Year-round pilgrimage"}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && <CountrySelect label="Travelling from" selected={country} onSelect={(c) => { setCountry(c.code); setStep(2); }} />}
        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {(["All", "Economy", "Standard", "VIP"] as const).map((t) => (
                <Chip key={t} active={tier === t} onClick={() => setTier(t)}>{t}</Chip>
              ))}
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Lowest</Chip>
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Top Rated</Chip>
              <Chip active={sort === "duration"} onClick={() => setSort("duration")}>🗓 Shortest</Chip>
            </div>
            <div className="text-xs text-muted-foreground">{results.length} {type} packages</div>
            <div className="space-y-2">
              {results.map((p) => (
                <ProviderRow
                  key={p.id} logo={p.logo} name={p.name} verified={p.verified} rating={p.rating} reviews={p.reviews} city={p.city}
                  badges={<><MiniBadge tone="primary">{p.tier}</MiniBadge><MiniBadge>{p.durationDays} days</MiniBadge><MiniBadge>Group {p.groupSize}</MiniBadge></>}
                  right={<div className="text-right"><div className="text-base font-extrabold text-primary">${p.price}</div><div className="text-[10px] text-muted-foreground">/pilgrim</div></div>}
                  footer={<div className="border-t border-border bg-secondary px-3 py-2 text-[11px] text-muted-foreground">Includes: {p.inclusions.join(" · ")}</div>}
                  onClick={() => { setPicked(p); setStep(3); }}
                />
              ))}
            </div>
          </div>
        )}
        {step === 3 && picked && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="font-bold">{picked.name} · {picked.tier} {picked.type}</div>
            </div>
            <Field label="Full name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Passport number"><TextInput value={form.passport} onChange={(e) => setForm({ ...form, passport: e.target.value })} /></Field>
            <Field label="Number of pilgrims"><TextInput type="number" min={1} value={form.pilgrims} onChange={(e) => setForm({ ...form, pilgrims: Number(e.target.value) })} /></Field>
            <Field label="Special needs"><TextArea value={form.special} onChange={(e) => setForm({ ...form, special: e.target.value })} placeholder="Wheelchair, dietary needs…" /></Field>
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
