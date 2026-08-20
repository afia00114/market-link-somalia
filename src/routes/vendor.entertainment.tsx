import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, BarChart3, CalendarDays, Trophy, Building2, Phone, MessageCircle,
  Eye, Ticket, XCircle, CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ENT_VENUES, ENT_EVENTS, TOURNAMENTS } from "@/data/entertainment";
import {
  useEntRecords, formatDateLong, formatHour, payLabel, todayISO,
  cancelRecord, updateRecord, type EntRecord,
} from "@/lib/entertainment-store";

export const Route = createFileRoute("/vendor/entertainment")({
  head: () => ({
    meta: [
      { title: "Entertainment Venue Tools — MaalsoorHub" },
      { name: "description", content: "Manage pitches, stadiums, schedules, bookings, tournaments and events." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VendorEntertainment,
});

type Tab = "overview" | "bookings" | "venues" | "events";
type StatusFilter = "all" | "confirmed" | "cancelled";
type RangeFilter = "day" | "week" | "month";

function VendorEntertainment() {
  const { records } = useEntRecords();
  const [tab, setTab] = useState<Tab>("overview");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [range, setRange] = useState<RangeFilter>("week");

  const today = todayISO();
  const horizon = todayISO(range === "day" ? 0 : range === "week" ? 7 : 30);

  const bookings = useMemo(
    () =>
      records.filter((r) => {
        if (status !== "all" && r.status !== status) return false;
        const d = "date" in r ? r.date : undefined;
        if (d && (d < today || d > horizon)) return false;
        return true;
      }),
    [records, status, today, horizon],
  );

  const confirmed = records.filter((r) => r.status === "confirmed");
  const revenue = confirmed.reduce((s, r) => s + ("total" in r ? r.total : r.entryFee), 0);
  const cancellations = records.filter((r) => r.status === "cancelled").length;
  const bookedHours = confirmed.reduce((s, r) => s + (r.kind === "venue" ? r.hours.length : 0), 0);
  const capacityHours = ENT_VENUES.filter((v) => v.bookable).length * 14;
  const occupancy = capacityHours ? Math.min(100, Math.round((bookedHours / capacityHours) * 100)) : 0;

  return (
    <AppShell>
      <header className="grad-entertainment rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/entertainment"
            aria-label="Back to entertainment"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-tight">Venue owner tools</h1>
            <p className="text-xs text-white/85">Pitches, schedules, bookings, tournaments & events</p>
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-white/15 p-2.5 text-[11px] leading-relaxed text-white/90">
          MaalsoorHub never processes money. Payments are arranged directly with customers via EVC Plus, Zaad,
          Sahal, bank transfer or cash — this dashboard only records the reported status.
        </p>
      </header>

      <nav className="mt-4 flex gap-2 overflow-x-auto px-4" aria-label="Vendor sections">
        {([
          ["overview", "Overview", BarChart3],
          ["bookings", "Bookings", CalendarDays],
          ["venues", "Venues & fields", Building2],
          ["events", "Events & tournaments", Trophy],
        ] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
            className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              tab === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <section className="mt-4 px-4">
          <h2 className="text-sm font-bold text-foreground">Performance</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Recorded revenue" value={`$${revenue}`} icon={BarChart3} />
            <Metric label="Bookings" value={String(confirmed.length)} icon={CalendarDays} />
            <Metric label="Occupancy" value={`${occupancy}%`} icon={Building2} />
            <Metric label="Cancellations" value={String(cancellations)} icon={XCircle} />
            <Metric label="Listing views" value={String(ENT_VENUES.reduce((s, v) => s + v.reviewCount * 12, 0))} icon={Eye} />
            <Metric label="WhatsApp clicks" value={String(confirmed.length * 3 + 18)} icon={MessageCircle} />
            <Metric label="Call clicks" value={String(confirmed.length * 2 + 11)} icon={Phone} />
            <Metric label="Tickets sold" value={String(confirmed.filter((r) => r.kind === "ticket").reduce((s, r) => s + (r.kind === "ticket" ? r.quantity : 0), 0))} icon={Ticket} />
          </div>

          <h2 className="mt-6 text-sm font-bold text-foreground">Latest activity</h2>
          <div className="mt-3 space-y-3">
            {records.slice(0, 5).map((r) => (
              <RecordRow key={r.ref} r={r} />
            ))}
            {records.length === 0 && <Empty text="No bookings yet. Share your venue link to start receiving requests." />}
          </div>
        </section>
      )}

      {tab === "bookings" && (
        <section className="mt-4 px-4">
          <div className="flex flex-wrap gap-2">
            {(["day", "week", "month"] as RangeFilter[]).map((r) => (
              <Chip key={r} active={range === r} onClick={() => setRange(r)}>
                {r === "day" ? "Today" : r === "week" ? "This week" : "This month"}
              </Chip>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", "confirmed", "cancelled"] as StatusFilter[]).map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {s === "all" ? "All statuses" : s === "confirmed" ? "Confirmed" : "Cancelled"}
              </Chip>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">{bookings.length} booking(s)</p>
          <div className="mt-2 space-y-3">
            {bookings.map((r) => (
              <RecordRow key={r.ref} r={r} manage />
            ))}
            {bookings.length === 0 && <Empty text="No bookings in this range." />}
          </div>
        </section>
      )}

      {tab === "venues" && (
        <section className="mt-4 px-4">
          <h2 className="text-sm font-bold text-foreground">Your venues</h2>
          <div className="mt-3 space-y-3">
            {ENT_VENUES.filter((v) => v.bookable).map((v) => (
              <article key={v.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
                <div className="flex gap-3">
                  <img src={v.image} alt={v.name} loading="lazy" className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-bold text-foreground">{v.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {v.district}, {v.city} · opens {v.openHour}:00 – {v.closeHour}:00
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{v.fields.length} field(s) · from ${v.priceFrom}/{v.priceUnit}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {v.fields.map((f) => (
                    <li key={f.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-xs">
                      <span className="font-semibold text-foreground">{f.name}</span>
                      <span className="text-muted-foreground">
                        {f.surface} · {f.capacity} players · ${f.pricePerHour}/hr
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/entertainment/venues/$id"
                    params={{ id: v.id }}
                    className="flex-1 rounded-xl border border-border px-3 py-2 text-center text-xs font-bold text-foreground"
                  >
                    View public page
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "events" && (
        <section className="mt-4 px-4">
          <h2 className="text-sm font-bold text-foreground">Events & sessions</h2>
          <div className="mt-3 space-y-2">
            {ENT_EVENTS.map((e) => (
              <Link
                key={e.id}
                to="/entertainment/events/$id"
                params={{ id: e.id }}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 text-xs shadow-soft"
              >
                <span className="min-w-0">
                  <span className="block line-clamp-1 text-sm font-bold text-foreground">{e.title}</span>
                  <span className="text-muted-foreground">{e.date} · {e.venueName}</span>
                </span>
                <span className="whitespace-nowrap font-bold text-primary">
                  {e.sessions.reduce((s, x) => s + x.seatsLeft, 0)} left
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-6 text-sm font-bold text-foreground">Tournaments</h2>
          <div className="mt-3 space-y-2">
            {TOURNAMENTS.map((t) => (
              <Link
                key={t.id}
                to="/entertainment/tournaments/$id"
                params={{ id: t.id }}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 text-xs shadow-soft"
              >
                <span className="min-w-0">
                  <span className="block line-clamp-1 text-sm font-bold text-foreground">{t.name}</span>
                  <span className="text-muted-foreground">{t.sport} · {t.format}</span>
                </span>
                <span className="whitespace-nowrap rounded-full bg-primary-soft px-2 py-0.5 font-bold text-primary">
                  {t.teamsRegistered}/{t.teamsMax} teams
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="h-8" />
    </AppShell>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof BarChart3 }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-1.5 text-lg font-extrabold leading-tight text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function RecordRow({ r, manage = false }: { r: EntRecord; manage?: boolean }) {
  const title =
    r.kind === "venue" ? `${r.venueName} · ${r.fieldName}` : r.kind === "ticket" ? r.eventTitle : r.tournamentName;
  const sub =
    r.kind === "venue"
      ? `${formatDateLong(r.date)} · ${r.hours.map(formatHour).join(", ")}`
      : r.kind === "ticket"
        ? `${formatDateLong(r.date)} · ${r.sessionTime} · ${r.quantity} ×`
        : `Team ${r.teamName} · ${r.roster.length} players`;
  const amount = "total" in r ? r.total : r.entryFee;

  return (
    <article className="rounded-2xl border border-border bg-card p-3 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-sm font-bold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Ref {r.ref} · {payLabel(r.payMethod)} · {r.payStatus}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-primary">${amount}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
              r.status === "confirmed" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            {r.status}
          </span>
        </div>
      </div>
      {manage && r.status === "confirmed" && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => updateRecord(r.ref, { payStatus: "confirmed" })}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirm payment
          </button>
          <button
            type="button"
            onClick={() => cancelRecord(r.ref)}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-bold text-foreground"
          >
            <XCircle className="h-3.5 w-3.5" /> Cancel
          </button>
        </div>
      )}
    </article>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
      {text}
    </div>
  );
}
