import { createFileRoute, Link, useParams, useSearch, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Check, MessageCircle, Mail, Phone, Copy } from "lucide-react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { LISTINGS } from "@/data/listings";
import { whatsappLink, telLink } from "@/lib/contact";

const searchSchema = z.object({
  service: z.string().optional(),
  price: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const Route = createFileRoute("/listing/$id/booked")({
  component: BookedPage,
  validateSearch: (s) => searchSchema.parse(s),
  loader: ({ params }) => {
    const item = LISTINGS.find((l) => l.id === params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Request Sent — ${loaderData?.item.provider.name ?? ""}` }],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Listing not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-sm">{error.message}</div>,
});

function BookedPage() {
  const { id } = useParams({ from: "/listing/$id/booked" });
  const item = LISTINGS.find((l) => l.id === id)!;
  const { service, price, date, time, notes, name, phone, address } = useSearch({
    from: "/listing/$id/booked",
  });
  const [copied, setCopied] = useState(false);

  const message = [
    `*Service Booking Request*`,
    `Provider: ${item.provider.name}`,
    service ? `Service: ${service}${price ? ` (${price})` : ""}` : "",
    date ? `Date: ${date}${time ? ` · ${time}` : ""}` : "",
    name ? `Customer: ${name}` : "",
    phone ? `Phone: ${phone}` : "",
    address ? `Address: ${address}` : "",
    notes ? `Notes: ${notes}` : "",
    ``,
    `Sent via MaalsoorHub`,
  ]
    .filter(Boolean)
    .join("\n");

  const subject = `Booking request — ${item.provider.name}`;
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const wa = whatsappLink(item.provider.whatsapp, message);
  const tel = telLink(item.provider.whatsapp);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <AppShell hideNav>
      <section className="px-5 pt-10 text-center">
        <div className="relative mx-auto h-32 w-32">
          <Confetti />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-card">
              <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold">Request Ready!</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Send your request to <span className="font-semibold text-foreground">{item.provider.name}</span> using your preferred channel.
        </p>
      </section>

      {(service || date) && (
        <section className="px-5 pt-6">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-bold">Summary</h2>
            <div className="mt-2 space-y-1.5 text-xs">
              {service && <Row label="Service" value={service} />}
              <Row label="Provider" value={item.provider.name} />
              {(date || time) && (
                <Row label="Date & Time" value={`${date ?? "—"}${time ? ` · ${time}` : ""}`} />
              )}
              {name && <Row label="Name" value={name} />}
              {phone && <Row label="Phone" value={phone} />}
              {address && <Row label="Address" value={address} />}
              {price && <Row label="Estimated Price" value={price} bold />}
              {notes && <Row label="Notes" value={notes} />}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pt-5">
        <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Send via
        </h3>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp font-bold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" /> Send via WhatsApp
        </a>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <a
            href={tel}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-xs font-bold active:scale-[0.98]"
          >
            <Phone className="h-4 w-4 text-primary" /> Call
          </a>
          <a
            href={mailto}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-xs font-bold active:scale-[0.98]"
          >
            <Mail className="h-4 w-4 text-primary" /> Email
          </a>
          <button
            onClick={copyAll}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-xs font-bold active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-primary" /> Copy
              </>
            )}
          </button>
        </div>
      </section>

      <section className="px-5 pb-10 pt-6 space-y-2">
        <Link
          to="/tracking/$ref"
          params={{ ref: item.id }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
        >
          Open Live Tracking
        </Link>
        <Link
          to="/listing/$id"
          params={{ id: item.id }}
          className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-bold active:scale-[0.98]"
        >
          Back to Listing
        </Link>
        <Link to="/home" className="mt-3 block text-center text-sm font-semibold text-primary">
          Back to Home
        </Link>
      </section>
    </AppShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right ${bold ? "font-extrabold text-primary" : "font-semibold"}`}>{value}</span>
    </div>
  );
}

function Confetti() {
  const dots = [
    { c: "bg-amber-400", t: "8%", l: "10%" },
    { c: "bg-emerald-500", t: "20%", l: "85%" },
    { c: "bg-sky-500", t: "55%", l: "5%" },
    { c: "bg-rose-500", t: "70%", l: "90%" },
    { c: "bg-violet-500", t: "5%", l: "55%" },
    { c: "bg-amber-500", t: "85%", l: "30%" },
    { c: "bg-emerald-400", t: "90%", l: "70%" },
    { c: "bg-sky-400", t: "35%", l: "95%" },
    { c: "bg-rose-400", t: "0%", l: "30%" },
  ];
  return (
    <div className="absolute inset-0">
      {dots.map((d, i) => (
        <span key={i} className={`absolute h-1.5 w-1.5 rounded-full ${d.c}`} style={{ top: d.t, left: d.l }} />
      ))}
    </div>
  );
}
