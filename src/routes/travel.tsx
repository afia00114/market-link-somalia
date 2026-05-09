import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Search, SlidersHorizontal, Check, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { TRAVEL_SUBS, type TravelSub } from "@/data/travel";

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
  const [q, setQ] = useState("");
  const [active, setActive] = useState<TravelSub | null>(null);
  const navigate = useNavigate();
  const matches = q.trim()
    ? TRAVEL_SUBS.filter((s) =>
        (s.label + " " + s.short).toLowerCase().includes(q.toLowerCase()),
      )
    : [];

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
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" /> All providers verified · No in‑app payments
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/95 px-3 py-2.5 text-foreground">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search flights, visas, tours, cars"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur" aria-label="Filter">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      <section className="px-4 py-4">
        {q.trim() && (
          <div className="mb-3 rounded-2xl border border-border bg-card p-2">
            {matches.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">No matches.</div>
            ) : (
              matches.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActive(m)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-secondary"
                >
                  <span className="text-xl">{m.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground">{m.short}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
        <h2 className="mb-3 text-sm font-bold">What do you need?</h2>
        <div className="grid grid-cols-2 gap-3">
          {TRAVEL_SUBS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s)}
                className="group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-3 text-left shadow-soft transition active:scale-[0.98]"
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
              </button>
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

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl p-0 max-h-[85vh] overflow-y-auto">
          <SheetHeader className="sr-only">
            <SheetTitle>{active?.label ?? "Service"}</SheetTitle>
            <SheetDescription>{active?.short ?? ""}</SheetDescription>
          </SheetHeader>
          {active && (
            <>
              <div className="grad-travel rounded-t-3xl px-5 pb-5 pt-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
                    {active.emoji}
                  </div>
                  <div>
                    <div className="text-lg font-bold">{active.label}</div>
                    <div className="text-xs text-white/85">{active.short}</div>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-white/90">{active.description}</p>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div className="grid grid-cols-3 gap-2">
                  {active.highlights.map((h) => (
                    <div key={h.label} className="rounded-xl border border-border bg-card p-2 text-center">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{h.label}</div>
                      <div className="mt-0.5 text-[11px] font-bold leading-tight">{h.value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-bold">What this offers</h4>
                  <ul className="space-y-2">
                    {active.offers.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-[13px]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-secondary p-3 text-[11px] text-muted-foreground">
                  <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-primary" />
                  All providers are verified. You contact them directly — no in-app payments.
                </div>

                <button
                  onClick={() => {
                    const href = active.href;
                    setActive(null);
                    navigate({ to: href as any });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.99]"
                >
                  Continue to {active.label} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
