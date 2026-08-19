import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TOURNAMENTS, type TournamentStatus } from "@/data/entertainment";

const URL = "https://market-link-somalia.lovable.app/entertainment/tournaments";

export const Route = createFileRoute("/entertainment/tournaments/")({
  head: () => {
    const title = "Football & Futsal Tournaments in Somalia | MaalsoorHub";
    const description =
      "Browse upcoming, live and completed futsal and football tournaments in Mogadishu, Hargeisa and Bosaso. Register your team, see fixtures, standings and prizes.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: URL },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: URL }],
    };
  },
  component: TournamentsPage,
});

const STATUS_LABEL: Record<TournamentStatus, string> = { upcoming: "Upcoming", live: "Live", completed: "Completed" };

function TournamentsPage() {
  const [status, setStatus] = useState<TournamentStatus | "all">("all");
  const list = useMemo(() => TOURNAMENTS.filter((t) => status === "all" || t.status === status), [status]);

  return (
    <AppShell>
      <header className="grad-entertainment rounded-b-3xl px-4 pb-5 pt-5 text-white">
        <div className="flex items-center gap-3">
          <Link to="/entertainment" aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-extrabold">Tournaments</h1>
            <p className="text-xs text-white/85">Register your team and follow the results</p>
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-4">
        {(["all", "upcoming", "live", "completed"] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={status === s}
            onClick={() => setStatus(s)}
            className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${
              status === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mx-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <Trophy className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-bold text-foreground">No tournaments in this state</p>
        </div>
      ) : (
        <div className="space-y-3 px-4 pb-10">
          {list.map((t) => {
            const full = t.teamsRegistered >= t.teamsMax;
            return (
              <Link
                key={t.id}
                to="/entertainment/tournaments/$id"
                params={{ id: t.id }}
                className="block overflow-hidden rounded-2xl border border-border bg-card shadow-soft active:scale-[0.99]"
              >
                <div className="relative">
                  <img src={t.image} alt={t.name} loading="lazy" className="h-28 w-full object-cover" />
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                      t.status === "live" ? "bg-rose-600" : t.status === "upcoming" ? "bg-emerald-600" : "bg-slate-600"
                    }`}
                  >
                    {STATUS_LABEL[t.status]}
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-1 text-sm font-bold text-foreground">{t.name}</h2>
                    <span className="whitespace-nowrap text-xs font-bold text-primary">${t.entryFee} entry</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {t.venueName}, {t.city}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> {t.startDate} → {t.endDate}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {t.teamsRegistered}/{t.teamsMax} teams
                    </span>
                    {t.organiserVerified && (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <BadgeCheck className="h-3 w-3" /> Verified organiser
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] font-bold text-foreground">
                    {full ? "Registration full" : `${t.teamsMax - t.teamsRegistered} slots left`} · {t.sport} · {t.format}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
