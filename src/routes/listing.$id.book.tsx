import { createFileRoute, useNavigate, useParams, notFound } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Calendar,
  Clock,
  Wrench,
  Sparkles,
  Star,
  ShieldCheck,
  MessageCircle,
  MapPin,
  StickyNote,
  Camera,
  X,
  User,
  Phone,
  Home,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LISTINGS } from "@/data/listings";
import { whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/listing/$id/book")({
  component: BookListingPage,
  loader: ({ params }) => {
    const item = LISTINGS.find((l) => l.id === params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Book — ${loaderData?.item.provider.name ?? "Provider"}` },
      {
        name: "description",
        content: `Book ${loaderData?.item.title ?? "a service"} in 3 quick steps. Verified provider, instant WhatsApp confirmation.`,
      },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Listing not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-sm">{error.message}</div>,
});

type Service = { id: string; name: string; price: string; popular?: boolean };

function defaultServicesFor(title: string, subtitle: string): Service[] {
  const t = (title + " " + subtitle).toLowerCase();
  if (t.includes("plumb")) return [
    { id: "install", name: "Plumbing Installation", price: "$15 - $30" },
    { id: "repair", name: "Pipe Repair", price: "$10 - $25", popular: true },
    { id: "leak", name: "Leak Detection", price: "$10 - $20" },
    { id: "bath", name: "Bathroom Installation", price: "$20 - $50" },
  ];
  if (t.includes("electric")) return [
    { id: "wiring", name: "House Wiring", price: "$20 - $50" },
    { id: "fix", name: "Outlet / Switch Fix", price: "$10 - $25", popular: true },
    { id: "panel", name: "Panel Upgrade", price: "$40 - $80" },
    { id: "light", name: "Lighting Install", price: "$15 - $35" },
  ];
  if (t.includes("clean")) return [
    { id: "deep", name: "Deep Clean", price: "$40 - $80", popular: true },
    { id: "regular", name: "Regular Clean", price: "$20 - $40" },
    { id: "office", name: "Office Cleaning", price: "$30 - $60" },
    { id: "move", name: "Move-out Clean", price: "$50 - $100" },
  ];
  return [
    { id: "consult", name: "Consultation", price: "$10 - $25" },
    { id: "standard", name: "Standard Service", price: "$25 - $60", popular: true },
    { id: "premium", name: "Premium Service", price: "$60 - $120" },
  ];
}

const TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function BookListingPage() {
  const { id } = useParams({ from: "/listing/$id/book" });
  const item = LISTINGS.find((l) => l.id === id)!;
  const navigate = useNavigate();
  const services = useMemo(() => defaultServicesFor(item.title, item.subtitle), [item]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<string>(
    services.find((s) => s.popular)?.id ?? services[0].id
  );
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("10:00");
  const [notes, setNotes] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const service = services.find((s) => s.id === selected)!;
  const minDate = todayISO();

  function onPickPhotos(files: FileList | null) {
    if (!files) return;
    const next: string[] = [];
    Array.from(files).slice(0, 4 - photos.length).forEach((f) => {
      next.push(URL.createObjectURL(f));
    });
    setPhotos((p) => [...p, ...next].slice(0, 4));
  }

  function send() {
    const msg = [
      `*Service Booking Request*`,
      `Provider: ${item.provider.name}`,
      `Service: ${service.name} (${service.price})`,
      `Date: ${date || "Not specified"}`,
      `Time: ${time || "Not specified"}`,
      `Customer: ${name}`,
      `Phone: ${phone}`,
      address ? `Address: ${address}` : "",
      notes ? `Notes: ${notes}` : "",
      photos.length ? `Photos attached: ${photos.length}` : "",
    ].filter(Boolean).join("\n");
    window.open(whatsappLink(item.provider.whatsapp, msg), "_blank", "noopener,noreferrer");
    navigate({
      to: "/listing/$id/booked",
      params: { id: item.id },
      search: { service: service.name, price: service.price, date, time, notes: notes || undefined },
    });
  }

  const phoneOk = phone.replace(/\D/g, "").length >= 7;
  const canContinue =
    step === 1
      ? !!selected
      : step === 2
        ? !!date && !!time && name.trim().length > 1 && phoneOk
        : true;

  return (
    <AppShell hideNav>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/listing/$id", params: { id: item.id } })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition hover:bg-secondary/80"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold leading-tight">Book / Request</h1>
            <p className="text-[11px] text-muted-foreground">Step {step} of 3</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      {/* Provider summary */}
      <section className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <img
            src={item.image}
            alt={item.provider.name}
            className="h-14 w-14 flex-none rounded-xl object-cover"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold">{item.provider.name}</p>
              <ShieldCheck className="h-3.5 w-3.5 flex-none text-primary" />
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{item.provider.rating}</span>
                <span>({item.provider.reviews})</span>
              </span>
              {item.district && (
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {item.district}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((n, i) => {
            const active = step >= (n as 1 | 2 | 3);
            const done = step > n;
            return (
              <div key={n} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : n}
                  </div>
                  <span
                    className={`mt-1 text-[11px] font-semibold ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {n === 1 ? "Service" : n === 2 ? "Details" : "Confirm"}
                  </span>
                </div>
                {i < 2 && (
                  <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className={`absolute inset-y-0 left-0 bg-primary transition-all duration-300 ${
                        step > n ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Select service */}
      {step === 1 && (
        <section className="px-4 pt-6">
          <h2 className="mb-3 text-sm font-bold">Select a service</h2>
          <div className="space-y-2">
            {services.map((s) => {
              const on = s.id === selected;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`group flex w-full items-center gap-3 rounded-2xl border bg-card p-3.5 text-left transition ${
                    on
                      ? "border-primary shadow-sm ring-2 ring-primary/15"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl transition ${
                      on ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Wrench className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold">{s.name}</span>
                      {s.popular && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-600">
                          <Sparkles className="h-2.5 w-2.5" /> Popular
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      Estimated price range
                    </span>
                  </span>
                  <span className="flex flex-none items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{s.price}</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                        on ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {on && <Check className="h-3 w-3 text-primary-foreground" />}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Step 2: Date/Time + Notes */}
      {step === 2 && (
        <section className="space-y-6 px-4 pt-6">
          <div>
            <h2 className="mb-2 text-sm font-bold">Pick a date</h2>
            <label className="relative flex h-12 items-center rounded-xl border border-border bg-card px-3 focus-within:border-primary">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-bold">Preferred time</h2>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((t) => {
                const on = t === time;
                return (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`flex h-11 items-center justify-center gap-1 rounded-xl border text-sm font-semibold transition ${
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer contact */}
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-bold">Your contact details</h2>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">Full name</span>
              <div className="flex h-11 items-center rounded-xl border border-border bg-background px-3 focus-within:border-primary">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Hassan"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">Phone / WhatsApp</span>
              <div className="flex h-11 items-center rounded-xl border border-border bg-background px-3 focus-within:border-primary">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="+252 61 234 5678"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                Address <span className="font-normal">(optional)</span>
              </span>
              <div className="flex h-11 items-center rounded-xl border border-border bg-background px-3 focus-within:border-primary">
                <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="District, street, building…"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>
          </div>

          {/* Photos */}
          <div>
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <Camera className="h-3.5 w-3.5" />
              Add photos <span className="font-normal text-muted-foreground">(optional · up to 4)</span>
            </h2>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => onPickPhotos(e.target.files)}
            />
            <div className="grid grid-cols-4 gap-2">
              {photos.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                  <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/70 text-white"
                    aria-label="Remove photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">Add</span>
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              Photos help the provider give you a better quote.
            </p>
          </div>

          <div>
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <StickyNote className="h-3.5 w-3.5" />
              Notes <span className="font-normal text-muted-foreground">(optional)</span>
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 300))}
              rows={4}
              placeholder="Need someone to fix the kitchen pipe leak…"
              className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-1 text-right text-[10px] text-muted-foreground">
              {notes.length}/300
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Summary */}
      {step === 3 && (
        <section className="space-y-3 px-4 pt-6">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-bold">Booking summary</h2>
            <SummaryRow label="Service" value={service.name} />
            <SummaryRow label="Provider" value={item.provider.name} />
            <SummaryRow
              label="Date & Time"
              value={`${date || "—"}${date && time ? ` · ${time}` : ""}`}
            />
            {notes && <SummaryRow label="Notes" value={notes} />}
            <SummaryRow label="Estimated price" value={service.price} bold />
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-foreground">
            <MessageCircle className="mt-0.5 h-4 w-4 flex-none text-primary" />
            <p>
              We'll open WhatsApp so you can send this request to{" "}
              <span className="font-semibold">{item.provider.name}</span>. They'll confirm
              availability and final price.
            </p>
          </div>
        </section>
      )}

      {/* Footer actions */}
      <div className="sticky bottom-0 z-20 mt-8 flex gap-2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            className="h-12 flex-1 rounded-xl bg-secondary text-sm font-bold transition active:scale-[0.98]"
          >
            Back
          </button>
        ) : null}
        {step < 3 ? (
          <button
            onClick={() => canContinue && setStep((s) => (s + 1) as 1 | 2 | 3)}
            disabled={!canContinue}
            className="h-12 flex-[2] rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30 transition active:scale-[0.98] disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={send}
            className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30 transition active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" />
            Confirm & Send Request
          </button>
        )}
      </div>
    </AppShell>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-right text-xs ${
          bold ? "font-extrabold text-primary" : "font-semibold text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
