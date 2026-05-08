import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountrySelect } from "@/components/travel/CountrySelect";
import { Field, TextInput, PrimaryBtn, Chip, TextArea } from "@/components/travel/FormUI";
import { ProviderRow, MiniBadge } from "@/components/travel/ProviderRow";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { HOTELS, type Hotel } from "@/data/travel";
import { Search } from "lucide-react";

export const Route = createFileRoute("/travel/hotels")({
  head: () => ({ meta: [{ title: "Hotels — MaalsoorHub" }] }),
  component: HotelsPage,
});

type Sort = "price" | "rating" | "amenities";

function HotelsPage() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<string>();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [sort, setSort] = useState<Sort>("price");
  const [picked, setPicked] = useState<Hotel>();
  const [room, setRoom] = useState<{ name: string; price: number }>();
  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const [shared, setShared] = useState(false);

  const results = useMemo(() => {
    let r = HOTELS.filter((h) => !country || h.countryCode === country);
    if (city) r = r.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    if (sort === "price") r = [...r].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "amenities") r = [...r].sort((a, b) => b.amenities.length - a.amenities.length);
    return r;
  }, [country, city, sort]);

  const summary = picked && room
    ? `Hello ${picked.name},\n\nBooking request via MaalsoorHub:\n\n🏨 Hotel: ${picked.name} (${picked.city})\n🛏 Room: ${room.name} — $${room.price}/night\n📅 Check-in: ${checkIn || "TBD"}\n📅 Check-out: ${checkOut || "TBD"}\n👥 Guests: ${guests} · Rooms: ${rooms}\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n${form.notes ? `📝 Requests: ${form.notes}\n` : ""}\nPlease confirm availability and total price.`
    : "";

  return (
    <AppShell>
      <PageHeader title="Hotels" subtitle="Stay anywhere" />
      <Stepper steps={["Country", "Search", "Results", "Room", "Send"]} current={step} />

      <section className="px-4 pb-8">
        {step === 0 && <CountrySelect selected={country} onSelect={(c) => { setCountry(c.code); setStep(1); }} />}

        {step === 1 && (
          <div className="space-y-3">
            <Field label="City / district"><TextInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nairobi, Mombasa…" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Check-in"><TextInput type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></Field>
              <Field label="Check-out"><TextInput type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Guests"><TextInput type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></Field>
              <Field label="Rooms"><TextInput type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} /></Field>
            </div>
            <PrimaryBtn onClick={() => setStep(2)}><Search className="mr-2 h-4 w-4" /> Search hotels</PrimaryBtn>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={sort === "price"} onClick={() => setSort("price")}>💰 Lowest Price</Chip>
              <Chip active={sort === "rating"} onClick={() => setSort("rating")}>⭐ Top Rated</Chip>
              <Chip active={sort === "amenities"} onClick={() => setSort("amenities")}>🏊 Best Amenities</Chip>
            </div>
            <div className="text-xs text-muted-foreground">{results.length} hotels</div>
            <div className="space-y-2">
              {results.map((h) => (
                <ProviderRow
                  key={h.id} logo={h.logo} name={h.name} verified={h.verified} rating={h.rating} reviews={h.reviews} city={h.city}
                  badges={<>{h.amenities.slice(0, 3).map((a) => <MiniBadge key={a}>{a}</MiniBadge>)}</>}
                  right={<div className="text-right"><div className="text-base font-extrabold text-primary">${h.pricePerNight}</div><div className="text-[10px] text-muted-foreground">per night</div></div>}
                  onClick={() => { setPicked(h); setRoom(undefined); setStep(3); }}
                />
              ))}
            </div>
          </div>
        )}

        {step === 3 && picked && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="font-bold">{picked.name} · {picked.city}</div>
              <div className="text-muted-foreground">{picked.amenities.join(" · ")}</div>
            </div>
            <h3 className="text-sm font-bold">Choose room type</h3>
            <div className="space-y-2">
              {picked.roomTypes.map((rt) => {
                const sel = room?.name === rt.name;
                return (
                  <button key={rt.name} onClick={() => setRoom(rt)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${sel ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                    <span className="text-sm font-semibold">{rt.name}</span>
                    <span className="text-sm font-bold text-primary">${rt.price}/night</span>
                  </button>
                );
              })}
            </div>
            <Field label="Your name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="WhatsApp phone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Special requests"><TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Late check-in, extra bed…" /></Field>
            <PrimaryBtn onClick={() => { setShared(true); setStep(4); }} disabled={!room || !form.name || !form.phone}>Continue</PrimaryBtn>
          </div>
        )}

        {step === 4 && picked && shared && (
          <SummaryShare providerName={picked.name} whatsapp={picked.whatsapp} phone={picked.phone} summary={summary} onBack={() => setStep(3)} />
        )}
      </section>
    </AppShell>
  );
}
