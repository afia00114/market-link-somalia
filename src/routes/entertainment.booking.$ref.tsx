import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2, MapPin, CalendarPlus, Share2, Phone, MessageCircle, XCircle, Ticket, Trophy, ArrowLeft, Copy,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getVenue, getEntEvent, getTournament } from "@/data/entertainment";
import { whatsappLink, telLink } from "@/lib/contact";
import {
  cancelRecord, formatDateLong, formatHour, getRecord, payLabel, payStatusLabel, type EntRecord,
} from "@/lib/entertainment-store";

export const Route = createFileRoute("/entertainment/booking/$ref")({
  head: () => ({
    meta: [
      { title: "Booking confirmation | MaalsoorHub Entertainment" },
      { name: "description", content: "Your MaalsoorHub entertainment booking confirmation, payment status and venue contacts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { ref } = useParams({ from: "/entertainment/booking/$ref" });
  const [record, setRecord] = useState<EntRecord | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRecord(getRecord(ref) ?? null);
  }, [ref]);

  if (record === undefined) {
    return (
      <AppShell>
        <div className="space-y-3 p-4">
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        </div>
      </AppShell>
    );
  }

  if (record === null) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <XCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-bold text-foreground">Booking not found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Bookings are stored on this device. Open the link on the device you booked with.
          </p>
          <Link to="/entertainment/bookings" className="mt-3 inline-block text-xs font-bold text-primary underline">
            My bookings
          </Link>
        </div>
      </AppShell>
    );
  }

  const cancelled = record.status === "cancelled";
  const venue = record.kind === "venue" ? getVenue(record.venueId) : undefined;
  const evt = record.kind === "ticket" ? getEntEvent(record.eventId) : undefined;
  const trn = record.kind === "team" ? getTournament(record.tournamentId) : undefined;
  const phone = venue?.phone ?? evt?.phone ?? trn?.phone ?? "";
  const wa = venue?.whatsapp ?? evt?.whatsapp ?? trn?.whatsapp ?? "";

  const title =
    record.kind === "venue" ? record.venueName : record.kind === "ticket" ? record.eventTitle : record.tournamentName;

  function calendarLink() {
    if (record?.kind !== "venue") return null;
    const start = `${record.date.replace(/-/g, "")}T${String(record.hours[0]).padStart(2, "0")}0000`;
    const end = `${record.date.replace(/-/g, "")}T${String(record.hours[record.hours.length - 1] + 1).padStart(2, "0")}0000`;
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: `${record.venueName} — ${record.fieldName}`,
      dates: `${start}/${end}`,
      details: `MaalsoorHub booking ${record.ref}`,
    });
    return `https://calendar.google.com/calendar/render?${q.toString()}`;
  }

  async function shareReceipt() {
    const text = `MaalsoorHub booking ${record!.ref} — ${title}`;
    try {
      if (navigator.share) await navigator.share({ title: "Booking receipt", text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <AppShell>
      <header className="grad-entertainment rounded-b-3xl px-4 pb-6 pt-5 text-white">
        <div className="flex items-center gap-3">
          <Link
            to="/entertainment/bookings"
            aria-label="Back to my bookings"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-extrabold">{cancelled ? "Booking cancelled" : "Booking confirmed"}</h1>
        </div>
        <div className="mt-5 flex flex-col items-center text-center">
          {cancelled ? <XCircle className="h-12 w-12" /> : <CheckCircle2 className="h-12 w-12" />}
          <p className="mt-2 text-base font-bold">{title}</p>
          <p className="mt-1 text-xs text-white/85">Booking ID</p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(record.ref);
              setCopied(true);
            }}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-extrabold tracking-wider backdrop-blur"
          >
            {record.ref} <Copy className="h-3.5 w-3.5" />
          </button>
          {copied && <span className="mt-1 text-[11px] text-white/85">Copied</span>}
        </div>
      </header>

      <section className="mx-4 mt-4 space-y-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        {record.kind === "venue" && (
          <>
            <Row label="Venue" value={record.venueName} />
            <Row label="Field" value={record.fieldName} />
            <Row label="Date" value={formatDateLong(record.date)} />
            <Row label="Time" value={record.hours.map(formatHour).join(", ")} />
            <Row label="Duration" value={`${record.hours.length} hour${record.hours.length > 1 ? "s" : ""}`} />
            <Row label="Booked for" value={record.customer.team ?? record.customer.name} />
          </>
        )}
        {record.kind === "ticket" && (
          <>
            <Row label="Event" value={record.eventTitle} />
            <Row label="Venue" value={record.venueName} />
            <Row label="Date" value={formatDateLong(record.date)} />
            <Row label="Session" value={record.sessionTime} />
            <Row label="Quantity" value={`${record.quantity} × ${record.ticketLabel}`} />
          </>
        )}
        {record.kind === "team" && (
          <>
            <Row label="Tournament" value={record.tournamentName} />
            <Row label="Team" value={record.teamName} />
            <Row label="Manager" value={record.manager} />
            <Row label="Players" value={`${record.roster.length} registered`} />
          </>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2 text-base font-extrabold text-foreground">
          <span>Total</span>
          <span>${record.kind === "team" ? record.entryFee : record.total}</span>
        </div>
        <div className="rounded-xl bg-background p-3 text-xs">
          <p className="font-bold text-foreground">Payment (recorded, not processed by MaalsoorHub)</p>
          <p className="mt-1 text-muted-foreground">
            {payLabel(record.payMethod)} · {payStatusLabel[record.payStatus]}
          </p>
        </div>
      </section>

      <section className="mx-4 mt-4 grid grid-cols-2 gap-2">
        {venue && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground"
          >
            <MapPin className="h-4 w-4 text-primary" /> Directions
          </a>
        )}
        {calendarLink() && (
          <a
            href={calendarLink()!}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground"
          >
            <CalendarPlus className="h-4 w-4 text-primary" /> Add to calendar
          </a>
        )}
        <button
          type="button"
          onClick={shareReceipt}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground"
        >
          <Share2 className="h-4 w-4 text-primary" /> Share receipt
        </button>
        {phone && (
          <a
            href={telLink(phone)}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground"
          >
            <Phone className="h-4 w-4 text-primary" /> Call
          </a>
        )}
        {wa && (
          <a
            href={whatsappLink(wa, `Hello, this is about MaalsoorHub booking ${record.ref}.`)}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp the organiser
          </a>
        )}
      </section>

      {!cancelled && (
        <section className="mx-4 mt-4 rounded-2xl border border-border bg-card p-4 text-xs shadow-soft">
          <p className="font-bold text-foreground">Need to change this booking?</p>
          <p className="mt-1 text-muted-foreground">
            {venue?.cancellation ?? "Contact the organiser to reschedule or cancel."}
          </p>
          <div className="mt-3 flex gap-2">
            {record.kind === "venue" && (
              <Link
                to="/entertainment/venues/$id"
                params={{ id: record.venueId }}
                className="flex-1 rounded-xl border border-border px-3 py-2.5 text-center font-bold text-foreground"
              >
                Reschedule
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                cancelRecord(record.ref);
                setRecord(getRecord(record.ref) ?? null);
              }}
              className="flex-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2.5 font-bold text-rose-600"
            >
              Cancel booking
            </button>
          </div>
        </section>
      )}

      <section className="mx-4 mb-10 mt-4 flex gap-2">
        <Link
          to="/entertainment/bookings"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground"
        >
          <Ticket className="h-4 w-4" /> My bookings
        </Link>
        <Link
          to="/entertainment/tournaments"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground"
        >
          <Trophy className="h-4 w-4" /> Tournaments
        </Link>
      </section>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}
