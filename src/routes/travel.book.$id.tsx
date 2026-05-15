import { createFileRoute, Link, notFound, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft, Plane, Calendar, MessageCircle, Phone, ShieldCheck,
  CheckCircle2, User, Mail, Smartphone, Users, ArrowRight, Clipboard,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  FLIGHT_OFFERS, AIRPORTS, INTL_DESTINATIONS, flightClassesFor,
} from "@/data/travel";
import { whatsappLink, telLink } from "@/lib/contact";
import { saveBooking, type Booking } from "@/lib/bookings";
import { createBooking } from "@/lib/booking/createBooking.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/travel/book/$id")({
  component: BookFlightPage,
  loader: ({ params }) => {
    const offer = FLIGHT_OFFERS.find((f) => f.id === params.id);
    if (!offer) throw notFound();
    return { offer };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Book — ${loaderData?.offer.name}` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-sm">
        Flight not found. <Link to="/travel/flights" className="text-flights">Back</Link>
      </div>
    </AppShell>
  ),
});

const schema = z.object({
  passengerName: z.string().trim().min(2, "Enter your full name").max(80),
  passengerEmail: z.string().trim().email("Enter a valid email").max(120),
  passengerPhone: z.string().trim().min(7, "Enter a valid phone").max(20),
  passengers: z.number().int().min(1).max(9),
  notes: z.string().trim().max(300).optional(),
});

type Step = "form" | "review" | "done";

function BookFlightPage() {
  const { id } = useParams({ from: "/travel/book/$id" });
  const navigate = useNavigate();
  const offer = FLIGHT_OFFERS.find((f) => f.id === id)!;

  // Pre-selected class from sessionStorage (set by flight detail), fallback to first
  const classes = offer.classes?.length ? offer.classes : flightClassesFor(offer.price);
  const presetCls = (() => {
    try {
      const raw = sessionStorage.getItem("flightBook");
      const v = raw ? JSON.parse(raw) : null;
      return v?.id === offer.id ? (v.cls as string) : null;
    } catch { return null; }
  })();

  const [travelClass, setTravelClass] = useState<string>(presetCls ?? classes[0].cls);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<Step>("form");
  const [saved, setSaved] = useState<Booking | null>(null);

  const allAirports = [...Object.values(AIRPORTS).flat(), ...INTL_DESTINATIONS];
  const fromCity = allAirports.find((a) => a.code === offer.from)?.city ?? offer.from;
  const toCity = allAirports.find((a) => a.code === offer.to)?.city ?? offer.to;
  const route = `${fromCity} (${offer.from}) → ${toCity} (${offer.to})`;
  const departDate = offer.departDate ?? "20 May 2026";
  const returnDate = offer.returnDate;

  const unitPrice = useMemo(
    () => classes.find((c) => c.cls === travelClass)?.price ?? offer.price,
    [classes, travelClass, offer.price],
  );
  const total = unitPrice * passengers;

  const waMessage = useMemo(() => {
    const lines = [
      `Hello ${offer.name},`,
      ``,
      `I'd like to book a flight via MaalsoorHub:`,
      `• Route: ${route}`,
      `• Depart: ${departDate}${returnDate ? `  • Return: ${returnDate}` : ""}`,
      `• Class: ${travelClass}`,
      `• Passengers: ${passengers}`,
      `• Estimated total: $${total.toLocaleString()}`,
      ``,
      `Passenger: ${passengerName || "—"}`,
      `Email: ${passengerEmail || "—"}`,
      `Phone: ${passengerPhone || "—"}`,
      notes ? `Notes: ${notes}` : ``,
      ``,
      saved ? `Booking ref: ${saved.ref}` : ``,
    ].filter(Boolean);
    return lines.join("\n");
  }, [offer, route, departDate, returnDate, travelClass, passengers, total, passengerName, passengerEmail, passengerPhone, notes, saved]);

  function goReview() {
    const parsed = schema.safeParse({ passengerName, passengerEmail, passengerPhone, passengers, notes });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path.join(".")] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep("review");
  }

  function confirmAndSave(channel: "whatsapp" | "call") {
    const booking = saveBooking({
      service: "flight",
      offerId: offer.id,
      providerName: offer.name,
      providerPhone: offer.phone,
      route,
      departDate,
      returnDate,
      travelClass,
      passengers,
      passengerName,
      passengerEmail,
      passengerPhone,
      notes: notes || undefined,
      unitPrice,
      total,
      currency: "USD",
      channel,
    });
    setSaved(booking);
    setStep("done");
  }

  return (
    <AppShell hideNav>
      {/* Hero */}
      <header className="bg-flights-hero px-4 pb-5 pt-4 text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (step === "review" ? setStep("form") : navigate({ to: "/travel/flights/$id", params: { id: offer.id } }))}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-bold">
            {step === "form" && "Passenger details"}
            {step === "review" && "Review your request"}
            {step === "done" && "Request submitted"}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-flights">
            <Plane className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-extrabold">{offer.name}</div>
            <div className="text-[11px] text-white/85">{route}</div>
            <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-white/85">
              <Calendar className="h-3 w-3" /> {departDate}{returnDate ? ` · Return ${returnDate}` : ""}
            </div>
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="mx-4 mt-4 flex items-center gap-2 text-[11px] font-semibold">
        {(["form", "review", "done"] as Step[]).map((s, i) => {
          const active = step === s;
          const done = (["form", "review", "done"] as Step[]).indexOf(step) > i;
          return (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                done ? "bg-flights text-white" : active ? "bg-flights-soft text-flights ring-1 ring-flights" : "bg-secondary text-muted-foreground"
              }`}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={active || done ? "text-foreground" : "text-muted-foreground"}>
                {s === "form" ? "Details" : s === "review" ? "Review" : "Done"}
              </span>
              {i < 2 && <span className="h-px flex-1 bg-border" />}
            </div>
          );
        })}
      </div>

      {/* STEP 1: form */}
      {step === "form" && (
        <section className="space-y-4 px-4 pb-32 pt-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-bold">Travel class</h3>
            <div className="grid grid-cols-1 gap-2">
              {classes.map((c) => {
                const active = travelClass === c.cls;
                return (
                  <button
                    key={c.cls}
                    onClick={() => setTravelClass(c.cls)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left ${
                      active ? "border-flights bg-flights-soft ring-1 ring-flights" : "border-border bg-card"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{c.cls}</div>
                      <div className="text-[11px] text-muted-foreground">{c.bags} bag{c.bags > 1 ? "s" : ""} · {c.seat}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-flights">${c.price}</div>
                      <div className="text-[10px] text-muted-foreground">per person</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-bold">Passenger</h3>

            <Field icon={User} label="Full name" error={errors.passengerName}>
              <input
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="As on passport"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </Field>

            <Field icon={Mail} label="Email" error={errors.passengerEmail}>
              <input
                type="email"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </Field>

            <Field icon={Smartphone} label="Phone" error={errors.passengerPhone}>
              <input
                type="tel"
                inputMode="tel"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                placeholder="+252 61 000 0000"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </Field>

            <Field icon={Users} label="Passengers" error={errors.passengers}>
              <div className="flex w-full items-center justify-between">
                <span className="text-sm">{passengers} traveler{passengers > 1 ? "s" : ""}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-base font-bold"
                    aria-label="Fewer"
                  >−</button>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(9, passengers + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-flights-soft text-flights text-base font-bold"
                    aria-label="More"
                  >+</button>
                </div>
              </div>
            </Field>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="Special requests, meal preferences, etc."
                className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-flights"
              />
              <div className="mt-1 text-right text-[10px] text-muted-foreground">{notes.length}/300</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-flights" />
            We send your request to the airline directly. No in-app payments.
          </div>
        </section>
      )}

      {/* STEP 2: review */}
      {step === "review" && (
        <section className="space-y-4 px-4 pb-32 pt-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-bold">Trip</h3>
            <Row k="Airline" v={offer.name} />
            <Row k="Route" v={route} />
            <Row k="Depart" v={departDate} />
            {returnDate && <Row k="Return" v={returnDate} />}
            <Row k="Class" v={travelClass} />
            <Row k="Passengers" v={String(passengers)} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-bold">Passenger</h3>
            <Row k="Name" v={passengerName} />
            <Row k="Email" v={passengerEmail} />
            <Row k="Phone" v={passengerPhone} />
            {notes && <Row k="Notes" v={notes} />}
          </div>

          <div className="rounded-2xl border border-flights/30 bg-flights-soft p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Estimated total</span>
              <span className="text-xl font-extrabold text-flights">${total.toLocaleString()}</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              ${unitPrice} × {passengers} · final price confirmed by airline
            </div>
          </div>
        </section>
      )}

      {/* STEP 3: done */}
      {step === "done" && saved && (
        <section className="space-y-4 px-4 pb-32 pt-4">
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-flights-soft">
              <CheckCircle2 className="h-7 w-7 text-flights" />
            </div>
            <h2 className="text-base font-extrabold">Request saved</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Send it to the airline now — they’ll confirm seats and arrange payment.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold">
              Booking ref: {saved.ref}
              <button
                onClick={() => navigator.clipboard?.writeText(saved.ref)}
                aria-label="Copy reference"
                className="text-muted-foreground"
              >
                <Clipboard className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-bold">Send to airline</h3>
            <a
              href={whatsappLink(offer.whatsapp || offer.phone?.replace(/\D/g, "") || "252610000000", waMessage)}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp font-bold text-whatsapp-foreground active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" /> Send via WhatsApp
            </a>
            {offer.phone && (
              <a
                href={telLink(offer.phone)}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" /> Call {offer.phone}
              </a>
            )}
          </div>

          <Link
            to="/travel/my-tickets"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-flights font-bold text-white active:scale-[0.98]"
          >
            View my tickets <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {/* Sticky CTA */}
      {step !== "done" && (
        <section className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">{travelClass} · {passengers} pax</div>
              <div className="text-xl font-extrabold text-flights">${total.toLocaleString()}</div>
            </div>
            <div className="text-[11px] text-muted-foreground">Estimated</div>
          </div>
          {step === "form" ? (
            <button
              onClick={goReview}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-flights font-bold text-white shadow-soft active:scale-[0.98]"
            >
              Review request <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => confirmAndSave("call")}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary font-semibold active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" /> Call
              </button>
              <button
                onClick={() => confirmAndSave("whatsapp")}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-bold text-whatsapp-foreground active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}

function Field({
  icon: Icon, label, error, children,
}: { icon: React.ComponentType<{ className?: string }>; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">{label}</label>
      <div className={`flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 ${
        error ? "border-destructive" : "border-border focus-within:border-flights"
      }`}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </div>
      {error && <div className="mt-1 text-[11px] text-destructive">{error}</div>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-2 last:border-0 last:pb-0 first:pt-0">
      <span className="text-[11px] font-semibold text-muted-foreground">{k}</span>
      <span className="text-right text-sm font-medium">{v}</span>
    </div>
  );
}
