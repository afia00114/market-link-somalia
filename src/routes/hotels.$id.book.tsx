import { createFileRoute, Link, useParams, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, Calendar, MessageCircle, Phone, CheckCircle2 } from "lucide-react";
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

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
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

  function buildMessage() {
    return [
      `*Booking Request — ${hotel.name}*`,
      `Room: ${room.name} ($${room.pricePerNight}/night)`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
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

  if (sent) {
    return (
      <AppShell hideNav>
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/hotels/$id", params: { id: hotel.id } })}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="flex-1 text-center text-base font-bold">Request Sent</h1>
            <div className="w-9" />
          </div>
        </header>
        <section className="px-4 pt-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-3 text-lg font-bold">Your request is on its way</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {sent.channel === "whatsapp"
              ? "We opened WhatsApp with your booking details. If it didn't open, copy the message below and send it to the hotel."
              : "We are calling the hotel. Share the details below when you speak with them."}
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-card p-3 text-left text-xs">
{sent.message}
          </pre>
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
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold">Booking Request</h1>
          <div className="w-9" />
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <img src={room.image} alt={room.name} className="h-14 w-16 rounded-lg object-cover" />
          <div className="flex-1">
            <div className="text-sm font-bold">{hotel.name}</div>
            <div className="text-xs text-muted-foreground">{room.name}</div>
          </div>
          <div className="text-sm font-bold text-primary">
            ${room.pricePerNight}<span className="text-[10px] font-medium text-muted-foreground">/night</span>
          </div>
        </div>
      </section>

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

        <Field label="Phone Number" required error={errors.phone}>
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

        {hotel.rooms.length > 1 && (
          <Field label="Room">
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {hotel.rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name} — ${r.pricePerNight}/night</option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Check-in" required error={errors.checkIn}>
            <DateInput value={checkIn} onChange={setCheckIn} min={today} />
          </Field>
          <Field label="Check-out" required error={errors.checkOut}>
            <DateInput value={checkOut} onChange={setCheckOut} min={checkIn || today} />
          </Field>
        </div>

        <Field label="Guests" required>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </Field>

        <Field label="Special Request (Optional)">
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Any special requests…"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        {nights > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5 text-sm">
            <span className="text-muted-foreground">{nights} night{nights > 1 ? "s" : ""} × ${room.pricePerNight}</span>
            <span className="font-bold text-primary">${total}</span>
          </div>
        )}
      </section>

      <section className="px-4 pb-8 pt-5 space-y-2">
        <button
          type="button"
          onClick={sendWhatsApp}
          disabled={!valid}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3.5 text-sm font-bold text-whatsapp-foreground disabled:opacity-50"
        >
          <MessageCircle className="h-4 w-4" /> Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={callHotel}
          disabled={!valid}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary disabled:opacity-50"
        >
          <Phone className="h-4 w-4" /> Call Hotel Instead
        </button>
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          Your request is sent directly to the hotel. No payment is taken here.
        </p>
        <Link
          to="/hotels/$id"
          params={{ id: hotel.id }}
          className="mt-2 block text-center text-xs font-medium text-muted-foreground"
        >
          Back to hotel
        </Link>
      </section>
    </AppShell>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </div>
      {children}
      {error && <div className="mt-1 text-[11px] font-medium text-destructive">{error}</div>}
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
