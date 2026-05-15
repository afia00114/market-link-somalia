import { createFileRoute, Link, useParams, useSearch, notFound } from "@tanstack/react-router";
import { CheckCircle2, Check, MessageCircle, Mail, Phone } from "lucide-react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { LISTINGS } from "@/data/listings";

const searchSchema = z.object({
  service: z.string().optional(),
  price: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().optional(),
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
  const { service, price, date, time, notes } = useSearch({ from: "/listing/$id/booked" });

  return (
    <AppShell hideNav>
      <section className="px-5 pt-10 text-center">
        {/* Confetti dots */}
        <div className="relative mx-auto h-32 w-32">
          <Confetti />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-card">
              <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold">Request Sent!</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          {item.provider.name} has received your request.
        </p>
      </section>

      <section className="px-5 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-bold">What happens next?</h2>
          <ul className="mt-2 space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span>Provider will contact you soon</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span>We sent the summary to both you and the provider</span>
            </li>
          </ul>
        </div>

        {(service || date) && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-bold">Summary</h2>
            <div className="mt-2 space-y-1.5 text-xs">
              {service && <Row label="Service" value={service} />}
              <Row label="Provider" value={item.provider.name} />
              {(date || time) && <Row label="Date & Time" value={`${date ?? "—"}${time ? `, ${time}` : ""}`} />}
              {price && <Row label="Estimated Price" value={price} bold />}
              {notes && <Row label="Notes" value={notes} />}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-xs font-semibold text-muted-foreground">Summary sent via</h3>
          <div className="mt-2 flex gap-2">
            <Channel icon={MessageCircle} label="WhatsApp" />
            <Channel icon={Mail} label="Email" />
            <Channel icon={Phone} label="SMS" />
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 pt-6">
        <Link
          to="/listing/$id" params={{ id: item.id }}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98]"
        >
          View Request
        </Link>
        <Link
          to="/home"
          className="mt-3 block text-center text-sm font-semibold text-primary"
        >
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

function Channel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-semibold">
      <Icon className="h-3.5 w-3.5 text-primary" /> {label}
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
