import { createFileRoute, Link, useNavigate, useParams, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Calendar, Clock } from "lucide-react";
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
    meta: [{ title: `Book — ${loaderData?.item.provider.name ?? "Provider"}` }],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Listing not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-sm">{error.message}</div>,
});

type Service = { id: string; name: string; price: string };

function defaultServicesFor(title: string, subtitle: string): Service[] {
  const t = (title + " " + subtitle).toLowerCase();
  if (t.includes("plumb")) return [
    { id: "install", name: "Plumbing Installation", price: "$15 - $30" },
    { id: "repair", name: "Pipe Repair", price: "$10 - $25" },
    { id: "leak", name: "Leak Detection", price: "$10 - $20" },
    { id: "bath", name: "Bathroom Installation", price: "$20 - $50" },
  ];
  if (t.includes("electric")) return [
    { id: "wiring", name: "House Wiring", price: "$20 - $50" },
    { id: "fix", name: "Outlet / Switch Fix", price: "$10 - $25" },
    { id: "panel", name: "Panel Upgrade", price: "$40 - $80" },
    { id: "light", name: "Lighting Install", price: "$15 - $35" },
  ];
  if (t.includes("clean")) return [
    { id: "deep", name: "Deep Clean", price: "$40 - $80" },
    { id: "regular", name: "Regular Clean", price: "$20 - $40" },
    { id: "office", name: "Office Cleaning", price: "$30 - $60" },
    { id: "move", name: "Move-out Clean", price: "$50 - $100" },
  ];
  return [
    { id: "consult", name: "Consultation", price: "$10 - $25" },
    { id: "standard", name: "Standard Service", price: "$25 - $60" },
    { id: "premium", name: "Premium Service", price: "$60 - $120" },
  ];
}

function BookListingPage() {
  const { id } = useParams({ from: "/listing/$id/book" });
  const item = LISTINGS.find((l) => l.id === id)!;
  const navigate = useNavigate();
  const services = useMemo(() => defaultServicesFor(item.title, item.subtitle), [item]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<string>(services[1]?.id ?? services[0].id);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("10:00");
  const [notes, setNotes] = useState<string>("");

  const service = services.find((s) => s.id === selected)!;

  function send() {
    const msg = [
      `*Service Booking Request*`,
      `Provider: ${item.provider.name}`,
      `Service: ${service.name} (${service.price})`,
      `Date: ${date || "Not specified"}`,
      `Time: ${time || "Not specified"}`,
      notes ? `Notes: ${notes}` : "",
    ].filter(Boolean).join("\n");
    window.open(whatsappLink(item.provider.whatsapp, msg), "_blank", "noopener,noreferrer");
    navigate({
      to: "/listing/$id/booked",
      params: { id: item.id },
      search: { service: service.name, price: service.price, date, time, notes: notes || undefined },
    });
  }

  return (
    <AppShell hideNav>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/listing/$id", params: { id: item.id } })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold">Book / Request Service</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Stepper */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    step >= (n as 1 | 2 | 3) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > n ? <Check className="h-4 w-4" /> : n}
                </div>
                <span className="mt-1 text-[11px] font-semibold text-muted-foreground">
                  {n === 1 ? "Service" : n === 2 ? "Details" : "Confirm"}
                </span>
              </div>
              {i < 2 && <div className={`mx-2 h-0.5 flex-1 ${step > n ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select service */}
      {step === 1 && (
        <section className="px-4 pt-6">
          <h2 className="mb-3 text-sm font-bold">Select Service</h2>
          <div className="space-y-2">
            {services.map((s) => {
              const on = s.id === selected;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`flex w-full items-center justify-between rounded-xl border bg-card p-3.5 text-left transition ${
                    on ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  <span className="text-sm font-semibold">{s.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{s.price}</span>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${on ? "border-primary bg-primary" : "border-border"}`}>
                      {on && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
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
        <section className="space-y-5 px-4 pt-6">
          <div>
            <h2 className="mb-2 text-sm font-bold">Preferred Date &amp; Time</h2>
            <div className="grid grid-cols-2 gap-2">
              <label className="relative flex h-11 items-center rounded-xl border border-border bg-card px-3">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <label className="relative flex h-11 items-center rounded-xl border border-border bg-card px-3">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-bold">Add Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Need someone to fix the kitchen pipe leak…"
              className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </section>
      )}

      {/* Step 3: Summary */}
      {step === 3 && (
        <section className="px-4 pt-6">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-bold">Summary</h2>
            <SummaryRow label="Service" value={service.name} />
            <SummaryRow label="Provider" value={item.provider.name} />
            <SummaryRow label="Date &amp; Time" value={`${date || "—"}${time ? `, ${time}` : ""}`} />
            <SummaryRow label="Estimated Price" value={service.price} bold />
            {notes && <SummaryRow label="Notes" value={notes} />}
          </div>
        </section>
      )}

      {/* Footer actions */}
      <div className="sticky bottom-0 mt-8 flex gap-2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            className="h-11 flex-1 rounded-xl bg-secondary text-sm font-bold"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
            className="h-11 flex-[2] rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98]"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={send}
            className="h-11 flex-[2] rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98]"
          >
            Confirm &amp; Send Request
          </button>
        )}
      </div>
    </AppShell>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-0">
      <span className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: label }} />
      <span className={`text-right text-xs ${bold ? "font-extrabold text-primary" : "font-semibold"}`}>{value}</span>
    </div>
  );
}
