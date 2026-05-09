import { createFileRoute, Link, useParams, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Calendar } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getHotel } from "@/data/hotels";
import { whatsappLink } from "@/lib/contact";

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

function BookingPage() {
  const { id } = useParams({ from: "/hotels/$id/book" });
  const hotel = getHotel(id)!;
  const navigate = useNavigate();
  const defaultRoom = hotel.rooms[0];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+252 ");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [request, setRequest] = useState("");
  const [roomId, setRoomId] = useState(defaultRoom.id);

  const room = hotel.rooms.find((r) => r.id === roomId) ?? defaultRoom;
  const valid = name.trim() && phone.trim().length > 4 && checkIn && checkOut;

  function handleSubmit() {
    if (!valid) return;
    const msg = [
      `*Booking Request — ${hotel.name}*`,
      `Room: ${room.name} ($${room.pricePerNight}/night)`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      `Guests: ${guests}`,
      request ? `Special request: ${request}` : "",
    ].filter(Boolean).join("\n");
    window.location.href = whatsappLink(hotel.whatsapp, msg);
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
        <Field label="Full Name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Phone Number" required>
          <input
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

        <Field label="Check-in Date" required>
          <DateInput value={checkIn} onChange={setCheckIn} />
        </Field>

        <Field label="Check-out Date" required>
          <DateInput value={checkOut} onChange={setCheckOut} />
        </Field>

        <Field label="Guests" required>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2">
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold">{guests}</span>
            <button
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
      </section>

      <section className="px-4 pb-8 pt-5">
        <button
          onClick={handleSubmit}
          disabled={!valid}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          Send via WhatsApp
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          You will be redirected to WhatsApp with the message pre-filled.
        </p>
        <Link
          to="/hotels/$id"
          params={{ id: hotel.id }}
          className="mt-3 block text-center text-xs font-medium text-muted-foreground"
        >
          Back to hotel
        </Link>
      </section>
    </AppShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </div>
      {children}
    </label>
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
      <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
