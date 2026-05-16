import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { AirportCombobox } from "@/components/travel/AirportCombobox";
import { DatePickerField } from "@/components/travel/DatePickerField";
import { NumberStepper } from "@/components/travel/NumberStepper";
import { FlightFiltersSheet, type FlightFilters } from "@/components/travel/FlightFiltersSheet";
import { FlightResultCard } from "@/components/travel/FlightResultCard";
import { Field, TextInput, Select, TextArea, PrimaryBtn } from "@/components/travel/FormUI";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { FLIGHT_OFFERS, AIRPORTS, INTL_DESTINATIONS, type FlightOffer } from "@/data/travel";
import {
  Plane, BadgeCheck, ArrowLeft, Search, MessagesSquare, ShieldCheck,
  BadgePercent, Headphones, Wallet, AlertTriangle, ArrowRight, Globe, ArrowLeftRight,
  Smartphone, Ticket,
} from "lucide-react";

export const Route = createFileRoute("/travel/flights")({
  head: () => ({
    meta: [
      { title: "Airline Tickets & Flights — MaalsoorHub" },
      { name: "description", content: "Search and compare flights from verified Somali and East African travel agencies. Filter by airline, price, and direct routes — book directly via WhatsApp." },
      { property: "og:title", content: "Airline Tickets & Flights — MaalsoorHub" },
      { property: "og:description", content: "Compare flights from trusted agencies and contact via WhatsApp." },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/travel/flights" },
    ],
    links: [
      { rel: "canonical", href: "https://market-link-somalia.lovable.app/travel/flights" },
    ],
  }),
  component: FlightsPage,
});

const DEFAULT_FILTERS: FlightFilters = {
  sort: "price",
  priceRange: [0, 0],
  airlines: [],
  directOnly: false,
  verifiedOnly: false,
};

const SORT_CHIPS: { key: FlightFilters["sort"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "price", label: "Lowest Price", icon: BadgePercent },
  { key: "rating", label: "Highest Rated", icon: ShieldCheck },
  { key: "duration", label: "Direct Flights", icon: Plane },
  { key: "high", label: "Highest Price", icon: Wallet },
];

function FlightsPage() {
  const [step, setStep] = useState<0 | 2 | 3 | 4>(0);
  const [from, setFrom] = useState("MGQ");
  const [to, setTo] = useState("NBO");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState<"oneway" | "round">("oneway");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");
  const [filters, setFilters] = useState<FlightFilters>(DEFAULT_FILTERS);
  const [picked, setPicked] = useState<FlightOffer>();
  const [form, setForm] = useState({ name: "", phone: "", adults: 1, children: 0, cls: "Economy", notes: "" });
  const [extras, setExtras] = useState<string[]>([]);

  const allAirports = useMemo(
    () => [...Object.values(AIRPORTS).flat(), ...INTL_DESTINATIONS],
    [],
  );
  const fromOptions = useMemo(() => allAirports.filter((a) => a.code !== to), [allAirports, to]);
  const toOptions = useMemo(() => allAirports.filter((a) => a.code !== from), [allAirports, from]);
  const fromAirport = allAirports.find((a) => a.code === from);
  const toAirport = allAirports.find((a) => a.code === to);
  const isIntl = !!toAirport?.international || fromAirport?.country !== toAirport?.country;

  const routeOffers = useMemo(
    () => FLIGHT_OFFERS.filter((f) => f.from === from && f.to === to),
    [from, to],
  );
  const priceMin = useMemo(
    () => (routeOffers.length ? Math.floor(Math.min(...routeOffers.map((o) => o.price))) : 0),
    [routeOffers],
  );
  const priceMax = useMemo(
    () => (routeOffers.length ? Math.ceil(Math.max(...routeOffers.map((o) => o.price))) : 0),
    [routeOffers],
  );
  const airlineOptions = useMemo(
    () => Array.from(new Set(routeOffers.map((o) => o.name))).sort(),
    [routeOffers],
  );

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      priceRange: [priceMin, priceMax],
      airlines: f.airlines.filter((n) => airlineOptions.includes(n)),
    }));
  }, [priceMin, priceMax, airlineOptions]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("flightBook");
      if (!raw) return;
      const { id, cls } = JSON.parse(raw) as { id: string; cls?: string };
      const offer = FLIGHT_OFFERS.find((o) => o.id === id);
      if (offer) {
        setPicked(offer);
        setFrom(offer.from);
        setTo(offer.to);
        if (cls) setForm((f) => ({ ...f, cls }));
        setStep(3);
      }
      sessionStorage.removeItem("flightBook");
    } catch { /* ignore */ }
  }, []);

  const filtered = useMemo(() => {
    let r = routeOffers;
    if (filters.directOnly) r = r.filter((f) => f.direct);
    if (filters.verifiedOnly) r = r.filter((f) => f.verified);
    if (filters.airlines.length) r = r.filter((f) => filters.airlines.includes(f.name));
    r = r.filter((f) => f.price >= filters.priceRange[0] && f.price <= filters.priceRange[1]);
    if (filters.sort === "price") r = [...r].sort((a, b) => a.price - b.price);
    else if (filters.sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    else if (filters.sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    else if (filters.sort === "duration") r = [...r].sort((a, b) => a.durationHrs - b.durationHrs);
    return r;
  }, [routeOffers, filters]);

  const activeCount =
    (filters.sort !== "price" ? 1 : 0) +
    (filters.directOnly ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.airlines.length ? 1 : 0) +
    (filters.priceRange[0] > priceMin || filters.priceRange[1] < priceMax ? 1 : 0);

  const dateStr = departDate ? format(departDate, "EEE, d MMM yyyy") : "Flexible";
  const returnStr = returnDate ? format(returnDate, "EEE, d MMM yyyy") : "Flexible";
  const pax = `${form.adults} adult${form.adults > 1 ? "s" : ""}${
    form.children ? `, ${form.children} child${form.children > 1 ? "ren" : ""}` : ""
  }`;
  const summary = picked
    ? `✈️ Flight Request from MaalsoorHub\n\nAgency: ${picked.name}\nCustomer: ${form.name}\nPhone: ${form.phone}\n\nRoute: ${fromAirport?.city ?? from} (${from}) → ${toAirport?.city ?? to} (${to})\nTrip: ${tripType === "round" ? "Round trip" : "One way"}\nDeparture: ${dateStr}${tripType === "round" ? `\nReturn: ${returnStr}` : ""}\nPassengers: ${pax}\nClass: ${form.cls}\n${extras.length ? `Add-ons: ${extras.join(", ")}\n` : ""}${form.notes ? `Special requests: ${form.notes}\n` : ""}\nPlease contact the customer with availability and total price.`
    : "";

  return (
    <AppShell>
      {/* Blue hero header */}
      <header className="bg-flights-hero relative overflow-hidden rounded-b-3xl px-4 pb-20 pt-5 text-white shadow-card">
        <Link to="/travel" className="inline-flex items-center gap-1 text-xs font-medium text-white/85">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <div className="relative z-10 mt-3 max-w-[70%]">
          <h1 className="text-xl font-extrabold leading-tight">Find Flights.<br/>Get Best Deals.</h1>
          <p className="mt-1 text-xs text-white/85">Contact agencies directly</p>
        </div>
        <Plane className="absolute right-2 top-6 h-24 w-24 -rotate-12 text-white/20" />
      </header>

      <section className="space-y-5 px-4 pb-8">
        {/* Search form */}
        <div className="-mt-16 space-y-3 rounded-2xl border border-border bg-card p-3 shadow-card">
          <div className="flex rounded-xl bg-secondary p-1">
            {(["oneway", "round"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTripType(t)}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                  tripType === t ? "bg-flights text-white shadow-soft" : "text-muted-foreground"
                }`}
              >
                {t === "oneway" ? "One Way" : "Round Trip"}
              </button>
            ))}
          </div>

          <div className="relative grid grid-cols-2 gap-2">
            <Field label="From">
              <AirportCombobox value={from} onChange={setFrom} options={fromOptions} />
            </Field>
            <Field label="To">
              <AirportCombobox value={to} onChange={setTo} options={toOptions} />
            </Field>
            <button
              type="button"
              onClick={() => { const f = from; setFrom(to); setTo(f); }}
              aria-label="Swap"
              className="absolute left-1/2 top-[30px] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-flights shadow-soft active:scale-95"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Departure">
              <DatePickerField value={departDate} onChange={setDepartDate} placeholder="Select date" />
            </Field>
            {tripType === "round" ? (
              <Field label="Return">
                <DatePickerField value={returnDate} onChange={setReturnDate} placeholder="Select date" minDate={departDate} />
              </Field>
            ) : (
              <Field label="Class">
                <Select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </Select>
              </Field>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className={tripType === "round" ? "" : "col-span-2"}>
              <NumberStepper label="Passengers" min={1} max={9} value={passengers} onChange={setPassengers} />
            </div>
            {tripType === "round" && (
              <Field label="Class">
                <Select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </Select>
              </Field>
            )}
          </div>

          <button
            onClick={() => setStep(2)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-flights font-bold text-white shadow-soft active:scale-[0.99]"
          >
            <Search className="h-4 w-4" /> Find Agencies
          </button>
        </div>

        {/* Results */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold leading-tight">
                  {filtered.length} Flight{filtered.length === 1 ? "" : "s"} Found
                </h2>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    {from} <ArrowRight className="h-3 w-3 text-muted-foreground" /> {to}
                  </span>
                  <span>·</span>
                  <span>{dateStr}</span>
                  {isIntl && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-flights-soft px-1.5 py-0.5 font-semibold text-flights">
                      <Globe className="h-3 w-3" /> Intl
                    </span>
                  )}
                </div>
              </div>
              <FlightFiltersSheet
                filters={filters}
                onChange={setFilters}
                priceMin={priceMin}
                priceMax={priceMax}
                airlineOptions={airlineOptions}
                resultsCount={filtered.length}
                activeCount={activeCount}
              />
            </div>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SORT_CHIPS.map(({ key, label, icon: Ic }) => {
                const active = key === "duration"
                  ? filters.directOnly
                  : filters.sort === key && !filters.directOnly;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === "duration") {
                        setFilters((f) => ({ ...f, directOnly: !f.directOnly }));
                      } else {
                        setFilters((f) => ({ ...f, sort: key, directOnly: false }));
                      }
                    }}
                    className={`flex flex-shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                      active
                        ? "border-flights bg-flights-soft text-flights"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <Ic className="h-3 w-3" /> {label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              {filtered.map((f) => (
                <FlightResultCard
                  key={f.id}
                  offer={f}
                  fromCity={fromAirport?.city}
                  toCity={toAirport?.city}
                  onSelect={() => {
                    setPicked(f);
                    setStep(3);
                  }}
                />
              ))}
              {filtered.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No agencies match your filters for this route.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking form */}
        {step === 3 && picked && (
          <div className="space-y-3">
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to results
            </button>
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="flex items-center gap-1 font-bold">
                {picked.name}
                {picked.verified && <BadgeCheck className="h-3.5 w-3.5 text-flights" />}
              </div>
              <div className="text-muted-foreground">
                {fromAirport?.city ?? from} ({from}) → {toAirport?.city ?? to} ({to}) · ${picked.price} ·{" "}
                {picked.direct ? "Direct" : `Via ${picked.via}`}
                {picked.departTime && ` · ${picked.departTime}`}
              </div>
            </div>

            <Field label="Full name">
              <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ahmed Hassan" />
            </Field>
            <Field label="Phone (WhatsApp)">
              <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+252 61 ..." />
            </Field>
            <NumberStepper label="Adults" hint="12+ years" min={1} max={9} value={form.adults} onChange={(n) => setForm({ ...form, adults: n })} />
            <NumberStepper label="Children" hint="2–11 years" min={0} max={9} value={form.children} onChange={(n) => setForm({ ...form, children: n })} />
            <Field label="Class">
              <Select value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>
                <option>Economy</option>
                <option>Business</option>
                <option>First</option>
              </Select>
            </Field>
            <Field label="Available options">
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  "Extra baggage (23kg)",
                  "Halal meal",
                  "Vegetarian meal",
                  "Window seat",
                  "Aisle seat",
                  "Extra legroom",
                  "Wheelchair assistance",
                  "Travel insurance",
                  "Lounge access",
                  "Priority boarding",
                  "Hotel pickup",
                  "Flexible date change",
                ].map((opt) => {
                  const active = extras.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() =>
                        setExtras((xs) => (active ? xs.filter((x) => x !== opt) : [...xs, opt]))
                      }
                      className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[11px] font-medium transition ${
                        active
                          ? "border-flights bg-flights-soft text-flights"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md border ${
                          active ? "border-flights bg-flights text-white" : "border-border bg-card"
                        }`}
                        aria-hidden
                      >
                        {active && <BadgeCheck className="h-3 w-3" />}
                      </span>
                      <span className="leading-tight">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Special requests (optional)">
              <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Wheelchair assistance, halal meal…" />
            </Field>
            <PrimaryBtn onClick={() => setStep(4)} disabled={!form.name || !form.phone}>
              Review &amp; share
            </PrimaryBtn>
          </div>
        )}

        {/* Summary */}
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

        {/* Always-visible info sections */}
        <div className="space-y-5 pt-2">
          <div>
            <h3 className="mb-2 text-sm font-bold">Popular Routes</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { f: "MGQ", t: "NBO", price: 250 },
                { f: "MGQ", t: "DXB", price: 280 },
                { f: "MGQ", t: "IST", price: 320 },
                { f: "MGQ", t: "JED", price: 310 },
              ].map((r) => (
                <button
                  key={r.t}
                  onClick={() => { setFrom(r.f); setTo(r.t); setStep(2); }}
                  className="rounded-xl border border-border bg-card p-3 text-left shadow-soft active:scale-[0.99]"
                >
                  <div className="flex items-center gap-1 text-sm font-bold">
                    {r.f} <ArrowRight className="h-3 w-3 text-muted-foreground" /> {r.t}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">From ${r.price}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="text-sm font-bold">How It Works</h3>
            <p className="text-[11px] text-muted-foreground">Simple steps to book your flight</p>
            <ol className="mt-3 space-y-2.5">
              {[
                { t: "Search Flights", s: "Enter your route, travel date and class" },
                { t: "Choose an Agency", s: "Compare offers from verified travel agencies" },
                { t: "Contact Agency", s: "Reach the agency via WhatsApp, call or email to confirm seat availability and final price" },
                { t: "Pay via Mobile Money", s: "Pay the agency directly using EVC Plus, Zaad, Sahal or eDahab. Bank transfer and office payment also accepted" },
                { t: "Receive Your Ticket", s: "Agency sends your official e-ticket (PDF) to your email or WhatsApp" },
              ].map((s, i) => (
                <li key={s.t} className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-flights text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-xs font-semibold">{s.t}</div>
                    <div className="text-[11px] text-muted-foreground">{s.s}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-flights" />
              <h3 className="text-sm font-bold">Mobile Payment Methods</h3>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              After confirming with the agency, pay directly using any of these mobile money services:
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { name: "EVC Plus", op: "Hormuud" },
                { name: "Zaad", op: "Telesom" },
                { name: "Sahal", op: "Golis" },
                { name: "eDahab", op: "Somtel" },
              ].map((p) => (
                <div key={p.name} className="rounded-xl border border-border bg-secondary/40 px-3 py-2">
                  <div className="text-xs font-bold">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground">{p.op}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-primary-soft p-2.5">
              <div className="flex items-start gap-2">
                <Ticket className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <p className="text-[11px] leading-relaxed text-primary">
                  Always request the agency's official merchant number and confirm the name before sending money. Keep the transaction SMS as your receipt until your ticket is issued.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="text-sm font-bold">Why Book With Us?</h3>
            <ul className="mt-2 space-y-2">
              {[
                { icon: ShieldCheck, t: "Trusted & Verified Agencies", s: "All agencies are verified by our team" },
                { icon: BadgePercent, t: "Best Price Guarantee", s: "Compare offers from multiple agencies" },
                { icon: MessagesSquare, t: "WhatsApp First", s: "Easy communication on WhatsApp" },
                { icon: Wallet, t: "No Hidden Charges", s: "Transparent and simple process" },
                { icon: Headphones, t: "24/7 Support", s: "We are here to help you anytime" },
              ].map(({ icon: Ic, t, s }) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Ic className="mt-0.5 h-4 w-4 flex-shrink-0 text-flights" />
                  <div>
                    <div className="text-xs font-semibold">{t}</div>
                    <div className="text-[11px] text-muted-foreground">{s}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="https://wa.me/252610000000"
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl bg-flights p-4 text-white shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Need Help With Booking?</div>
                <div className="text-[11px] text-white/85">Chat with our support team on WhatsApp</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/15 py-2 text-xs font-semibold backdrop-blur">
              <MessagesSquare className="h-4 w-4" /> Chat on WhatsApp
            </div>
          </a>
        </div>
      </section>
    </AppShell>
  );
}
