import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TRAVEL_SUBS } from "@/data/travel";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "Travel & Tourism — MaalsoorHub" },
      { name: "description", content: "Flights, visas, Hajj & Umrah, tours and car rental from verified East Africa providers." },
      { property: "og:title", content: "Travel & Tourism — MaalsoorHub" },
      { property: "og:description", content: "Search trusted travel providers and contact via WhatsApp." },
    ],
  }),
  component: TravelHub,
});

function TravelHub() {
  return (
    <AppShell>
      <header className="grad-travel rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">Travel & Tourism</h1>
            <p className="text-xs text-white/85">Flights · Visa · Tours · Cars</p>
          </div>
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" /> All providers verified · No in‑app payments
        </div>
      </header>

      <section className="px-4 py-4">
        <h2 className="mb-3 text-sm font-bold">What do you need?</h2>
        <div className="grid grid-cols-2 gap-3">
          {TRAVEL_SUBS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.key}
                to={s.href}
                className="group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft transition active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary-soft" />
                <div className="relative flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xl">{s.emoji}</span>
                </div>
                <div className="relative">
                  <div className="text-sm font-bold leading-tight">{s.label}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{s.short}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-secondary p-4">
          <h3 className="text-sm font-bold">How it works</h3>
          <ol className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>1. Choose a service & country</li>
            <li>2. Search and compare verified providers</li>
            <li>3. Send your request via WhatsApp or Call</li>
            <li>4. Provider confirms and you arrange payment directly</li>
          </ol>
        </div>
      </section>
    </AppShell>
  );
}
