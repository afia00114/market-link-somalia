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
import { Plane, BadgeCheck, ArrowLeft } from "lucide-react";

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

      <section className="px-4 pb-8">
        {/* Step 1 — Country */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Pick the country you're flying <b>from</b>. We'll show airports available there.
            </p>
            <CountryPickerSheet
              label="Departure country"
              selected={country}
              onSelect={(c) => {
                setCountry(c.code);
                const first = AIRPORTS[c.code]?.[0];
                if (first) setFrom(first.code);
              }}
            />
            <PrimaryBtn onClick={() => setStep(1)} disabled={!country}>
              Continue
            </PrimaryBtn>
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
