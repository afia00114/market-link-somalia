import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/travel/PageHeader";
import { Stepper } from "@/components/travel/Stepper";
import { CountryPickerSheet } from "@/components/travel/CountryPickerSheet";
import { AirportCombobox } from "@/components/travel/AirportCombobox";
import { DatePickerField } from "@/components/travel/DatePickerField";
import { NumberStepper } from "@/components/travel/NumberStepper";
import { FlightFiltersSheet, type FlightFilters } from "@/components/travel/FlightFiltersSheet";
import { FlightResultCard } from "@/components/travel/FlightResultCard";
import { Field, TextInput, Select, TextArea, PrimaryBtn, Chip } from "@/components/travel/FormUI";
import { SummaryShare } from "@/components/travel/SummaryShare";
import { FLIGHT_OFFERS, AIRPORTS, INTL_DESTINATIONS, COUNTRIES, type FlightOffer } from "@/data/travel";
import { Plane, BadgeCheck, ArrowLeft, Search, MessagesSquare, ShieldCheck, BadgePercent, Headphones, Wallet, AlertTriangle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/travel/flights")({
  head: () => ({ meta: [{ title: "Airline Tickets — MaalsoorHub" }] }),
  component: FlightsPage,
});

const DEFAULT_FILTERS: FlightFilters = {
  sort: "price",
  priceRange: [0, 0],
  airlines: [],
  directOnly: false,
  verifiedOnly: false,
};

function FlightsPage() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<string>("SO");
  const [from, setFrom] = useState("MGQ");
  const [to, setTo] = useState("NBO");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState<"oneway" | "round">("oneway");
  const [filters, setFilters] = useState<FlightFilters>(DEFAULT_FILTERS);
  const [picked, setPicked] = useState<FlightOffer>();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    adults: 1,
    children: 0,
    cls: "Economy",
    notes: "",
  });

  const departureAirports = AIRPORTS[country] ?? [];
  const destinationAirports = useMemo(
    () => [...(AIRPORTS[country] ?? []), ...INTL_DESTINATIONS].filter((a) => a.code !== from),
    [country, from],
  );
  const countryName = COUNTRIES.find((c) => c.code === country)?.name ?? country;

  const fromAirport = departureAirports.find((a) => a.code === from);
  const toAirport = [...departureAirports, ...INTL_DESTINATIONS].find((a) => a.code === to);

  // All offers matching the route (pre-filter), used for filter bounds
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

  // Reset price range when route changes
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      priceRange: [priceMin, priceMax],
      airlines: f.airlines.filter((n) => airlineOptions.includes(n)),
    }));
  }, [priceMin, priceMax, airlineOptions]);

  // Resume from a flight detail page → jump straight into the booking form
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
    ? `✈️ Flight Request from MaalsoorHub\n\nAgency: ${picked.name}\nCustomer: ${form.name}\nPhone: ${form.phone}\n\nRoute: ${fromAirport?.city ?? from} (${from}) → ${toAirport?.city ?? to} (${to})\nTrip: ${tripType === "round" ? "Round trip" : "One way"}\nDeparture: ${dateStr}${tripType === "round" ? `\nReturn: ${returnStr}` : ""}\nPassengers: ${pax}\nClass: ${form.cls}\n${form.notes ? `Special requests: ${form.notes}\n` : ""}\nPlease contact the customer with availability and total price.`
    : "";

  const steps = ["Country", "Route", "Agencies", "Details", "Send"];

  return (
    <AppShell>
      <PageHeader title="Airline Tickets" subtitle="Find & book flights" />
      <Stepper steps={steps} current={step} />

      <section className="px-4 pb-8 space-y-5">
        {/* Hero — always visible */}
        <div className="grad-travel rounded-2xl p-4 text-white shadow-card">
          <h2 className="text-lg font-bold leading-tight">Find Flights. Get Best Deals.</h2>
          <p className="mt-1 text-xs text-white/85">Contact agencies directly — no in-app payments.</p>
          <p className="mt-3 text-[11px] text-white/80">Flying from</p>
          <div className="mt-1">
            <CountryPickerSheet
              label=""
              selected={country}
              onSelect={(c) => {
                setCountry(c.code);
                const first = AIRPORTS[c.code]?.[0];
                if (first) setFrom(first.code);
              }}
            />
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary shadow-soft active:scale-[0.99]"
          >
            <Search className="h-4 w-4" /> {step === 0 ? "Search Flights" : "New Search"}
          </button>
        </div>

        {/* Active step UI */}
        {step === 0 && (
          <div className="space-y-5">
            {/* (sections rendered below — always visible) */}

            {/* USPs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Wallet, t: "No In-App Pay", s: "Pay agency directly" },
                { icon: MessagesSquare, t: "WhatsApp First", s: "Easy chat" },
                { icon: ShieldCheck, t: "Trusted", s: "Verified agencies" },
              ].map(({ icon: Ic, t, s }) => (
                <div key={t} className="rounded-xl border border-border bg-card p-2.5 text-center shadow-soft">
                  <Ic className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 text-[11px] font-bold text-foreground">{t}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{s}</div>
                </div>
              ))}
            </div>

            {/* Popular Routes */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-foreground">Popular Routes</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { f: "MGQ", t: "NBO", price: 250 },
                  { f: "MGQ", t: "DXB", price: 280 },
                  { f: "MGQ", t: "IST", price: 320 },
                  { f: "MGQ", t: "JED", price: 310 },
                ].map((r) => (
                  <button
                    key={r.t}
                    onClick={() => {
                      setFrom(r.f);
                      setTo(r.t);
                      setStep(2);
                    }}
                    className="rounded-xl border border-border bg-card p-3 text-left shadow-soft active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                      {r.f} <ArrowRight className="h-3 w-3 text-muted-foreground" /> {r.t}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">From ${r.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Airlines */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-foreground">Featured Airlines</h3>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {["Turkish", "Qatar", "Ethiopian", "flydubai", "Daallo", "Somali"].map((a) => (
                  <div
                    key={a}
                    className="flex-shrink-0 rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-semibold text-foreground shadow-soft"
                  >
                    {a} Airlines
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <h3 className="text-sm font-bold text-foreground">How It Works</h3>
              <p className="text-[11px] text-muted-foreground">Simple steps to book your flight</p>
              <ol className="mt-3 space-y-2.5">
                {[
                  { t: "Search", s: "Pick route and date" },
                  { t: "Choose Agency", s: "Compare offers" },
                  { t: "Get Contacted", s: "Via WhatsApp, call or email" },
                  { t: "Pay Directly", s: "Discuss price with the agency" },
                ].map((s, i) => (
                  <li key={s.t} className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{s.t}</div>
                      <div className="text-[11px] text-muted-foreground">{s.s}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Why Book With Us */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <h3 className="text-sm font-bold text-foreground">Why Book With Us?</h3>
              <ul className="mt-2 space-y-2">
                {[
                  { icon: ShieldCheck, t: "Trusted & Verified Agencies", s: "All agencies are verified by our team" },
                  { icon: BadgePercent, t: "Best Price Guarantee", s: "Compare offers from multiple agencies" },
                  { icon: MessagesSquare, t: "WhatsApp First", s: "Easy communication on WhatsApp" },
                  { icon: Wallet, t: "No Hidden Charges", s: "Transparent and simple process" },
                  { icon: Headphones, t: "24/7 Support", s: "We are here to help you anytime" },
                ].map(({ icon: Ic, t, s }) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Ic className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">{t}</div>
                      <div className="text-[11px] text-muted-foreground">{s}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Help */}
            <a
              href="https://wa.me/252610000000"
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-white shadow-card"
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

            {/* Important Reminder */}
            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">Important Reminder</div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-200/80">
                  Payments are handled directly between you and the travel agency through WhatsApp, bank transfer,
                  mobile money or office payment. MaalsoorHub does not process any payments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Route */}
        {step === 1 && (
          <div className="space-y-3">
            <button
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Change country
            </button>
            <div className="rounded-xl bg-secondary p-2 text-center text-[11px] text-muted-foreground">
              Showing airports for <b>{countryName}</b>
            </div>
            <Field label="From (departure)">
              <AirportCombobox value={from} onChange={setFrom} options={departureAirports} />
            </Field>
            <Field label="To (destination)">
              <AirportCombobox value={to} onChange={setTo} options={destinationAirports} />
            </Field>
            <div className="flex gap-2">
              <Chip active={tripType === "oneway"} onClick={() => setTripType("oneway")}>
                One way
              </Chip>
              <Chip active={tripType === "round"} onClick={() => setTripType("round")}>
                Round trip
              </Chip>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Departure date">
                <DatePickerField value={departDate} onChange={setDepartDate} placeholder="Select date" />
              </Field>
              {tripType === "round" && (
                <Field label="Return date">
                  <DatePickerField
                    value={returnDate}
                    onChange={setReturnDate}
                    placeholder="Select date"
                    minDate={departDate}
                  />
                </Field>
              )}
            </div>
            <PrimaryBtn onClick={() => setStep(2)}>
              <Plane className="mr-2 h-4 w-4" /> Search agencies
            </PrimaryBtn>
          </div>
        )}

        {/* Step 3 — Agencies */}
        {step === 2 && (
          <div className="space-y-3">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Edit route
            </button>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {filtered.length} agencies · {fromAirport?.city ?? from} ({from}) →{" "}
                {toAirport?.city ?? to} ({to})
                {departDate && ` · ${format(departDate, "d MMM")}`}
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

        {/* Step 4 — Passenger form */}
        {step === 3 && picked && (
          <div className="space-y-3">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back to results
            </button>
            <div className="rounded-2xl border border-border bg-card p-3 text-xs">
              <div className="flex items-center gap-1 font-bold">
                {picked.name}
                {picked.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
              </div>
              <div className="text-muted-foreground">
                {fromAirport?.city ?? from} ({from}) → {toAirport?.city ?? to} ({to}) · ${picked.price} ·{" "}
                {picked.direct ? "Direct" : `Via ${picked.via}`}
                {picked.departTime && ` · ${picked.departTime}`}
              </div>
            </div>

            <Field label="Full name">
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ahmed Hassan"
              />
            </Field>
            <Field label="Phone (WhatsApp)">
              <TextInput
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+252 61 ..."
              />
            </Field>

            <div className="grid grid-cols-1 gap-2">
              <NumberStepper
                label="Adults"
                hint="12+ years"
                min={1}
                max={9}
                value={form.adults}
                onChange={(n) => setForm({ ...form, adults: n })}
              />
              <NumberStepper
                label="Children"
                hint="2–11 years"
                min={0}
                max={9}
                value={form.children}
                onChange={(n) => setForm({ ...form, children: n })}
              />
            </div>

            <Field label="Class">
              <Select value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>
                <option>Economy</option>
                <option>Business</option>
                <option>First</option>
              </Select>
            </Field>

            <Field label="Departure date">
              <DatePickerField value={departDate} onChange={setDepartDate} placeholder="Select date" />
            </Field>

            <Field label="Special requests (optional)">
              <TextArea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Wheelchair assistance, halal meal…"
              />
            </Field>

            <PrimaryBtn onClick={() => setStep(4)} disabled={!form.name || !form.phone}>
              Review &amp; share
            </PrimaryBtn>
          </div>
        )}

        {/* Step 5 — Summary & share */}
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
