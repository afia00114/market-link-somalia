import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Ticket, Trophy, Inbox } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatDateLong, formatHour, payLabel, payStatusLabel, useEntRecords } from "@/lib/entertainment-store";

export const Route = createFileRoute("/entertainment/bookings")({
  head: () => ({
    meta: [
      { title: "My entertainment bookings | MaalsoorHub" },
      { name: "description", content: "Pitch bookings, event tickets and tournament team entries you made on MaalsoorHub." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingsPage,
});

type Tab = "all" | "venue" | "ticket" | "team" | "cancelled";

function BookingsPage() {
  const { records } = useEntRecords();
  const [tab, setTab] = useState<Tab>("all");

  const list = useMemo(
    () =>
      records.filter((r) => {
        if (tab === "cancelled") return r.status === "cancelled";
        if (r.status === "cancelled") return false;
        if (tab === "all") return true;
        return r.kind === tab;
      }),
    [records, tab],
  );

  return (
    <AppShell>
      <header className="grad-entertainment rounded-b-3xl px-4 pb-5 pt-5 text-white">
        <div className="flex items-center gap-3">
          <Link to="/entertainment" aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-extrabold">My bookings</h1>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-4">
        {(
          [
            ["all", "All"],
            ["venue", "Pitches"],
            ["ticket", "Tickets"],
            ["team", "Teams"],
            ["cancelled", "Cancelled"],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={tab === k}
            onClick={() => setTab(k)}
            className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${
              tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mx-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-bold text-foreground">Nothing here yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Book a pitch or a ticket and it will show up here.</p>
          <Link to="/entertainment" className="mt-3 inline-block rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground">
            Explore Entertainment
          </Link>
        </div>
      ) : (
        <div className="space-y-3 px-4 pb-10">
          {list.map((r) => (
            <Link
              key={r.ref}
              to="/entertainment/booking/$ref"
              params={{ ref: r.ref }}
              className="block rounded-2xl border border-border bg-card p-3 shadow-soft active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="line-clamp-1 text-sm font-bold text-foreground">
                    {r.kind === "venue" ? r.venueName : r.kind === "ticket" ? r.eventTitle : r.tournamentName}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {r.kind === "venue" && (
                      <>
                        <CalendarDays className="mr-1 inline h-3 w-3" />
                        {formatDateLong(r.date)} · {r.hours.map(formatHour).join(", ")} · {r.fieldName}
                      </>
                    )}
                    {r.kind === "ticket" && (
                      <>
                        <Ticket className="mr-1 inline h-3 w-3" />
                        {formatDateLong(r.date)} · {r.sessionTime} · {r.quantity} × {r.ticketLabel}
                      </>
                    )}
                    {r.kind === "team" && (
                      <>
                        <Trophy className="mr-1 inline h-3 w-3" />
                        {r.teamName} · {r.roster.length} players
                      </>
                    )}
                  </p>
                </div>
                <span className="whitespace-nowrap text-sm font-extrabold text-primary">
                  ${r.kind === "team" ? r.entryFee : r.total}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                <span className="rounded-full bg-muted px-2 py-0.5 font-bold text-foreground">{r.ref}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-bold ${
                    r.status === "cancelled"
                      ? "bg-rose-500/15 text-rose-600"
                      : r.payStatus === "confirmed"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-amber-500/15 text-amber-600"
                  }`}
                >
                  {r.status === "cancelled" ? "Cancelled" : payStatusLabel[r.payStatus]}
                </span>
                <span className="text-muted-foreground">{payLabel(r.payMethod)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
