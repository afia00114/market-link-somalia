import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, MapPin, Minus, Plus, Info, MessageCircle, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getEntEvent, type EntEvent } from "@/data/entertainment";
import { telLink, whatsappLink } from "@/lib/contact";
import { PAY_METHODS, formatDateLong, makeRef, saveRecord, type PayMethod, type PayStatus } from "@/lib/entertainment-store";

export const Route = createFileRoute("/entertainment/events/$id")({
  head: ({ params }) => {
    const e = getEntEvent(params.id);
    const url = `https://market-link-somalia.lovable.app/entertainment/events/${params.id}`;
    const title = e ? `${e.title} — ${e.city} | MaalsoorHub Entertainment` : "Event | MaalsoorHub";
    const description = e ? `${e.about} ${e.date} at ${e.venueName}. Reserve your ${e.ticketLabel}s on MaalsoorHub.` : "Event on MaalsoorHub.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...(e ? [{ property: "og:image", content: e.image }, { name: "twitter:image", content: e.image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: EventPage,
});

function EventPage() {
  const { id } = useParams({ from: "/entertainment/events/$id" });
  const evt = getEntEvent(id);
  if (!evt) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <p className="text-sm font-bold text-foreground">Event not found</p>
          <Link to="/entertainment" className="mt-3 inline-block text-xs font-bold text-primary underline">
            Back to Entertainment
          </Link>
        </div>
      </AppShell>
    );
  }
  return <EventDetail evt={evt} />;
}

function EventDetail({ evt }: { evt: EntEvent }) {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(evt.sessions.find((s) => s.seatsLeft > 0)?.id ?? evt.sessions[0].id);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("evc");
  const [payStatus, setPayStatus] = useState<PayStatus>("unpaid");
  const [errors, setErrors] = useState<string[]>([]);

  const session = evt.sessions.find((s) => s.id === sessionId) ?? evt.sessions[0];
  const total = qty * evt.pricePerTicket;
  const maxQty = Math.min(10, session.seatsLeft);

  function submit() {
    const e: string[] = [];
    if (session.seatsLeft === 0) e.push("This session is sold out — pick another time.");
    if (qty < 1 || qty > maxQty) e.push(`Choose between 1 and ${maxQty} ${evt.ticketLabel}s.`);
    if (name.trim().length < 3) e.push("Enter your full name.");
    if (!/^[+0-9 ]{7,}$/.test(phone.trim())) e.push("Enter a valid phone number.");
    setErrors(e);
    if (e.length) return;
    const ref = makeRef("TK");
    saveRecord({
      kind: "ticket",
      ref,
      eventId: evt.id,
      eventTitle: evt.title,
      venueName: evt.venueName,
      date: evt.date,
      sessionTime: session.time,
      quantity: qty,
      unitPrice: evt.pricePerTicket,
      total,
      ticketLabel: evt.ticketLabel,
      customer: { name: name.trim(), phone: phone.trim(), notes: notes.trim() || undefined },
      payMethod,
      payStatus,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
    navigate({ to: "/entertainment/booking/$ref", params: { ref } });
  }

  return (
    <AppShell>
      <div className="relative">
        <img src={evt.image} alt={evt.title} className="h-44 w-full object-cover" />
        <Link
          to="/entertainment"
          aria-label="Back to Entertainment"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
      </div>

      <section className="px-4 pt-4">
        <h1 className="text-lg font-extrabold leading-tight text-foreground">{evt.title}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {evt.venueName} · {evt.district}, {evt.city}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDateLong(evt.date)} · organised by <span className="font-bold text-foreground">{evt.organiser}</span>{" "}
          {evt.verified && <BadgeCheck className="inline h-3.5 w-3.5 text-emerald-600" />}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{evt.about}</p>
      </section>

      <section className="mx-4 mt-5 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <h2 className="text-sm font-bold text-foreground">Choose a session</h2>
        <div className="mt-2 space-y-2">
          {evt.sessions.map((s) => {
            const soldOut = s.seatsLeft === 0;
            return (
              <button
                key={s.id}
                type="button"
                disabled={soldOut}
                aria-pressed={sessionId === s.id}
                onClick={() => {
                  setSessionId(s.id);
                  setQty(1);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm font-bold ${
                  soldOut
                    ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                    : sessionId === s.id
                      ? "border-primary bg-primary-soft text-foreground"
                      : "border-border bg-background text-foreground"
                }`}
              >
                <span>{s.time}</span>
                <span className="text-xs font-semibold">{soldOut ? "Sold out" : `${s.seatsLeft} left`}</span>
              </button>
            );
          })}
        </div>

        <h2 className="mt-4 text-sm font-bold text-foreground">
          How many {evt.ticketLabel}s?
        </h2>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center text-lg font-extrabold text-foreground">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(maxQty || 1, q + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="ml-auto text-sm font-extrabold text-primary">${total}</span>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Full name *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Cabdi Maxamed" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Phone number *</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" inputMode="tel" placeholder="+252 61 000 0000" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Notes (optional)</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input" placeholder="Seats together please" />
          </label>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-[11px] text-amber-700 dark:text-amber-400">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>MaalsoorHub does not process payments. Pay the organiser and record the method below.</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {PAY_METHODS.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={payMethod === m.key}
              onClick={() => setPayMethod(m.key)}
              className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${
                payMethod === m.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {(["unpaid", "reported"] as PayStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={payStatus === s}
              onClick={() => setPayStatus(s)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-bold ${
                payStatus === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
              }`}
            >
              {s === "unpaid" ? "Pay at the door" : "Payment sent"}
            </button>
          ))}
        </div>

        {errors.length > 0 && (
          <div role="alert" className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-600">
            {errors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}

        <button type="button" onClick={submit} className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
          Confirm · ${total}
        </button>
      </section>

      <section className="mx-4 mb-10 mt-4 grid grid-cols-2 gap-2">
        <a href={telLink(evt.phone)} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground">
          <Phone className="h-4 w-4 text-primary" /> Call
        </a>
        <a
          href={whatsappLink(evt.whatsapp, `Hello, I have a question about "${evt.title}" on MaalsoorHub.`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-bold text-white"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </section>
    </AppShell>
  );
}
