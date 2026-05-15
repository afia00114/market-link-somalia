import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clipboard, MessageCircle, Mail, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Booking } from "@/lib/bookings";
import {
  bookingMailtoLink,
  bookingTelLink,
  bookingWhatsappLink,
  buildBookingMessage,
} from "@/lib/booking/message";

interface Props {
  booking: Booking;
  accent?: string; // tailwind colour, e.g. "primary" or "flights"
  /** Where the user goes after viewing the success screen */
  homeTo?: "/home" | "/travel" | "/travel/my-tickets";
}

export function BookingSuccess({ booking, accent = "primary", homeTo = "/travel/my-tickets" }: Props) {
  const [copied, setCopied] = useState(false);

  const lines: Array<[string, string | number | undefined]> = Object.entries(
    booking.details ?? {},
  )
    .filter(([k]) => k !== "title")
    .map(([k, v]) => [titleCase(k), v as string | number | undefined]);

  const message = buildBookingMessage({
    providerName: booking.providerName,
    ref: booking.ref,
    title: booking.title ?? booking.details?.title?.toString(),
    lines,
    total: booking.total,
    currency: booking.currency,
    passengerName: booking.passengerName,
    passengerEmail: booking.passengerEmail,
    passengerPhone: booking.passengerPhone,
    notes: booking.notes,
  });

  const subject = `Booking ${booking.ref} — ${booking.providerName}`;
  const waLink = bookingWhatsappLink(
    booking.providerWhatsapp || booking.providerPhone || "",
    message,
  );
  const mailLink = bookingMailtoLink(undefined, subject, message);
  const callLink = booking.providerPhone ? bookingTelLink(booking.providerPhone) : null;

  function copy() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(booking.ref).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <section className="space-y-4 px-4 pb-24 pt-6">
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
        <div
          className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-${accent}/15 animate-in zoom-in duration-300`}
        >
          <CheckCircle2 className={`h-9 w-9 text-${accent}`} strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-extrabold">Booking request saved!</h2>
        <p className="mx-auto mt-1.5 max-w-xs text-xs text-muted-foreground">
          We've stored your request safely. Send it to{" "}
          <span className="font-semibold text-foreground">{booking.providerName}</span> using your
          preferred channel below.
        </p>
        <button
          onClick={copy}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-bold transition hover:bg-secondary/70"
          aria-label="Copy booking reference"
        >
          Ref: {booking.ref}
          {copied ? (
            <span className={`text-${accent}`}>Copied!</span>
          ) : (
            <Clipboard className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {(booking.title || booking.total != null) && (
        <div className="rounded-2xl border border-border bg-card p-4">
          {booking.title && (
            <div className="mb-2 text-sm font-bold">{booking.title}</div>
          )}
          {lines.map(([k, v]) =>
            v ? (
              <Row key={k} k={k} v={String(v)} />
            ) : null,
          )}
          {booking.total != null && (
            <Row
              k="Estimated total"
              v={`${booking.currency ?? "USD"} ${booking.total.toLocaleString()}`}
              bold
              accent={accent}
            />
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-bold">Send to provider</h3>
        <div className="space-y-2">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp font-bold text-whatsapp-foreground active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" /> Send via WhatsApp
          </a>
          <a
            href={mailLink}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" /> Send via Email
          </a>
          {callLink && (
            <a
              href={callLink}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold active:scale-[0.98]"
            >
              <Phone className="h-4 w-4" /> Call {booking.providerPhone}
            </a>
          )}
        </div>
      </div>

      <Link
        to={homeTo}
        className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-${accent} font-bold text-white active:scale-[0.98]`}
      >
        View my bookings <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function Row({
  k,
  v,
  bold,
  accent = "primary",
}: {
  k: string;
  v: string;
  bold?: boolean;
  accent?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-2 last:border-0 last:pb-0 first:pt-0">
      <span className="text-[11px] font-semibold text-muted-foreground">{k}</span>
      <span className={`text-right text-sm ${bold ? `font-extrabold text-${accent}` : "font-medium"}`}>
        {v}
      </span>
    </div>
  );
}

function titleCase(k: string) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}
