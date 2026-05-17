import { createFileRoute, Link, useParams, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  Calendar,
  MessageCircle,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Users,
  BedDouble,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getHotel } from "@/data/hotels";
import { telLink, whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/hotels/$id/book")({
  component: BookingPage,
  loader: ({ params }) => {
    const hotel = getHotel(params.id);
    if (!hotel) throw notFound();
    return { hotel };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Booking Request — ${loaderData?.hotel.name ?? "Hotel"}` }],
  }),
});

function todayISO(offset = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function formatNice(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function BookingPage() {
  const { id } = useParams({ from: "/hotels/$id/book" });
  const hotel = getHotel(id)!;
  const navigate = useNavigate();
  const defaultRoom = hotel.rooms[0];
  const today = todayISO();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+252 ");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [request, setRequest] = useState("");
  const [roomId, setRoomId] = useState(defaultRoom.id);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState<null | { channel: "whatsapp" | "call"; message: string }>(null);

  const room = hotel.rooms.find((r) => r.id === roomId) ?? defaultRoom;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn).getTime();
    const b = new Date(checkOut).getTime();
    return Math.max(0, Math.round((b - a) / 86400000));
  }, [checkIn, checkOut]);
  const total = nights * room.pricePerNight;

  const errors = {
    name: name.trim().length < 2 ? "Enter your full name" : "",
    phone: phone.replace(/\D/g, "").length < 7 ? "Enter a valid phone number" : "",
    checkIn: !checkIn ? "Pick a check-in date" : checkIn < today ? "Date must be today or later" : "",
    checkOut: !checkOut ? "Pick a check-out date" : checkIn && checkOut <= checkIn ? "Must be after check-in" : "",
  };
  const valid = !errors.name && !errors.phone && !errors.checkIn && !errors.checkOut;

  function applyPreset(kind: "tonight" | "weekend" | "week") {
    if (kind === "tonight") {
      setCheckIn(todayISO(0));
      setCheckOut(todayISO(1));
    } else if (kind === "weekend") {
      const now = new Date();
      const day = now.getDay(); // 0 Sun..6 Sat
      const toFri = (5 - day + 7) % 7 || 7;
      setCheckIn(todayISO(toFri));
      setCheckOut(todayISO(toFri + 2));
    } else {
      setCheckIn(todayISO(0));
      setCheckOut(todayISO(7));
    }
  }

  function buildMessage() {
    return [
      `*Booking Request — ${hotel.name}*`,
      `Room: ${room.name} ($${room.pricePerNight}/night)`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Check-in: ${checkIn} (${formatNice(checkIn)})`,
      `Check-out: ${checkOut} (${formatNice(checkOut)})`,
      `Nights: ${nights}`,
      `Guests: ${guests}`,
      `Estimated total: $${total}`,
      request ? `Special request: ${request}` : "",
    ].filter(Boolean).join("\n");
  }

  function sendWhatsApp() {
    if (!valid) return;
    const msg = buildMessage();
    setSent({ channel: "whatsapp", message: msg });
    window.open(whatsappLink(hotel.whatsapp, msg), "_blank", "noopener,noreferrer");
  }

  function callHotel() {
    if (!valid) return;
    setSent({ channel: "call", message: buildMessage() });
    window.location.href = telLink(hotel.phone);
  }

  async function copyMessage(msg: string) {
    try {
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  if (sent) {
    return (
      <AppShell hideNav>
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/hotels/$id", params: { id: hotel.id } })}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
              aria-label="Back to hotel"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="flex-1 text-center text-base font-bold">Request Sent</h1>
            <div className="w-9" />
          </div>
        </header>
        <section className="px-4 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-3 text-lg font-bold">Your request is on its way</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {sent.channel === "whatsapp"
              ? "We opened WhatsApp with your booking details. If it didn't open, copy the message and send it to the hotel."
              : "We're calling the hotel. Share the details below when you speak with them."}
          </p>

          <div className="mt-4 rounded-2xl border border-border bg-card p-3 text-left">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Booking message
              </span>
              <button
                onClick={() => copyMessage(sent.message)}
                className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[11px] font-semibold"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed">{sent.message}</pre>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={whatsappLink(hotel.whatsapp, sent.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={telLink(hotel.phone)}
              className="flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
          </div>
          <Link
            to="/hotels/$id"
            params={{ id: hotel.id }}
            className="mt-4 block text-center text-xs font-medium text-muted-foreground"
          >
            Back to hotel
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/hotels/$id", params: { id: hotel.id } })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold">Booking Request</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Hotel summary card */}
      <section className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3 p-3">
            <img src={room.image} alt={room.name} className="h-16 w-20 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-bold">{hotel.name}</div>
              <div className="truncate text-xs text-muted-foreground">{hotel.city} · {room.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-primary">${room.pricePerNight}</div>
              <div className="text-[10px] font-medium text-muted-foreground">per night</div>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-border bg-primary/5 px-3 py-2 text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            No payment online · Request sent directly to the hotel
          </div>
        </div>
      </section>

      {/* Room picker */}
      {hotel.rooms.length > 1 && (
        <section className="px-4 pt-4">
          <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <BedDouble className="h-3.5 w-3.5" /> Choose your room
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {hotel.rooms.map((r) => {
              const active = r.id === roomId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoomId(r.id)}
                  className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                    active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card"
                  }`}
                >
                  <img src={r.image} alt="" className="h-12 w-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.bed} · up to {r.guests} guests</div>
                  </div>
                  <div className="text-sm font-bold text-primary">${r.pricePerNight}</div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Dates */}
      <section className="px-4 pt-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> When are you staying?
        </h2>
        <div className="mb-2 flex gap-1.5">
          {([
            ["tonight", "Tonight"],
            ["weekend", "Weekend"],
            ["week", "1 Week"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => applyPreset(k)}
              className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold hover:bg-secondary"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Check-in" required error={errors.checkIn}>
            <DateInput value={checkIn} onChange={setCheckIn} min={today} />
            {checkIn && !errors.checkIn && (
              <div className="mt-1 text-[11px] text-muted-foreground">{formatNice(checkIn)}</div>
            )}
          </Field>
          <Field label="Check-out" required error={errors.checkOut}>
            <DateInput value={checkOut} onChange={setCheckOut} min={checkIn || today} />
            {checkOut && !errors.checkOut && (
              <div className="mt-1 text-[11px] text-muted-foreground">{formatNice(checkOut)}</div>
            )}
          </Field>
        </div>
      </section>

      {/* Guests */}
      <section className="px-4 pt-4">
        <Field label="Guests">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-muted-foreground" />
              {guests} {guests === 1 ? "guest" : "guests"}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary disabled:opacity-40"
                aria-label="Decrease guests"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(20, g + 1))}
                disabled={guests >= 20}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary disabled:opacity-40"
                aria-label="Increase guests"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          {guests > room.guests && (
            <div className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-500">
              This room fits up to {room.guests}. The hotel may suggest a larger room.
            </div>
          )}
        </Field>
      </section>

      {/* Contact */}
      <section className="space-y-3 px-4 pt-4">
        <Field label="Full Name" required error={errors.name}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Phone Number" required error={errors.phone} hint="The hotel will use this to confirm your booking.">
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+252 61 123 4567"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Special Request (Optional)">
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value.slice(0, 500))}
            placeholder="Airport pickup, early check-in, dietary needs…"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="mt-1 text-right text-[10px] text-muted-foreground">{request.length}/500</div>
        </Field>
      </section>

      {/* Spacer for sticky bar */}
      <div className="h-44" />

      {/* Sticky summary + CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 pb-4 pt-3 backdrop-blur safe-bottom">
        <div className="mb-2 flex items-center justify-between text-sm">
          <div>
            {nights > 0 ? (
              <>
                <div className="text-[11px] text-muted-foreground">
                  {nights} night{nights > 1 ? "s" : ""} × ${room.pricePerNight}
                </div>
                <div className="text-lg font-bold text-primary">${total}</div>
              </>
            ) : (
              <div className="text-[11px] text-muted-foreground">Pick dates to see total</div>
            )}
          </div>
          <div className="text-right text-[10px] text-muted-foreground">
            {valid ? "Ready to send" : "Complete the form"}
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={sendWhatsApp}
            disabled={!valid}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-bold text-whatsapp-foreground shadow-soft active:scale-[0.98] disabled:opacity-50"
          >
            <MessageCircle className="h-4 w-4" /> Send via WhatsApp
          </button>
          <button
            type="button"
            onClick={callHotel}
            disabled={!valid}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-primary px-4 text-sm font-bold text-primary active:scale-[0.98] disabled:opacity-40"
            aria-label="Call hotel"
          >
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </div>
      {children}
      {error ? (
        <div className="mt-1 text-[11px] font-medium text-destructive">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-[10px] text-muted-foreground">{hint}</div>
      ) : null}
    </label>
  );
}

function DateInput({ value, onChange, min }: { value: string; onChange: (v: string) => void; min?: string }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
      <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
