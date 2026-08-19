import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, BadgeCheck, CalendarDays, MapPin, MessageCircle, Phone, Trophy, Users, Info, Plus, Trash2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getTournament, type Tournament } from "@/data/entertainment";
import { telLink, whatsappLink } from "@/lib/contact";
import { PAY_METHODS, makeRef, saveRecord, type PayMethod, type PayStatus } from "@/lib/entertainment-store";

export const Route = createFileRoute("/entertainment/tournaments/$id")({
  head: ({ params }) => {
    const t = getTournament(params.id);
    const url = `https://market-link-somalia.lovable.app/entertainment/tournaments/${params.id}`;
    const title = t ? `${t.name} — ${t.city} | MaalsoorHub Tournaments` : "Tournament | MaalsoorHub";
    const description = t ? `${t.about} Entry $${t.entryFee}. Fixtures, standings, rules and team registration.` : "Tournament on MaalsoorHub.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...(t ? [{ property: "og:image", content: t.image }, { name: "twitter:image", content: t.image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TournamentPage,
});

function TournamentPage() {
  const { id } = useParams({ from: "/entertainment/tournaments/$id" });
  const t = getTournament(id);
  if (!t) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <p className="text-sm font-bold text-foreground">Tournament not found</p>
          <Link to="/entertainment/tournaments" className="mt-3 inline-block text-xs font-bold text-primary underline">
            All tournaments
          </Link>
        </div>
      </AppShell>
    );
  }
  return <TournamentDetail t={t} />;
}

function TournamentDetail({ t }: { t: Tournament }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "fixtures" | "standings">("overview");
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");
  const [roster, setRoster] = useState<string[]>([""]);
  const [payMethod, setPayMethod] = useState<PayMethod>("evc");
  const [payStatus, setPayStatus] = useState<PayStatus>("unpaid");
  const [errors, setErrors] = useState<string[]>([]);

  const full = t.teamsRegistered >= t.teamsMax;
  const pastDeadline = new Date(t.registrationDeadline) < new Date();
  const closed = t.status !== "upcoming";
  const cannotRegister = full || pastDeadline || closed;
  const blockedReason = full
    ? "Registration is full."
    : pastDeadline
      ? `Registration closed on ${t.registrationDeadline}.`
      : closed
        ? `This tournament is ${t.status}.`
        : "";

  function submit() {
    const e: string[] = [];
    if (teamName.trim().length < 2) e.push("Enter your team name.");
    if (manager.trim().length < 3) e.push("Enter the manager's full name.");
    if (!/^[+0-9 ]{7,}$/.test(phone.trim())) e.push("Enter a valid contact phone number.");
    const players = roster.map((r) => r.trim()).filter(Boolean);
    if (players.length < 5) e.push("Add at least 5 players to the roster.");
    setErrors(e);
    if (e.length) return;
    const ref = makeRef("TM");
    saveRecord({
      kind: "team",
      ref,
      tournamentId: t.id,
      tournamentName: t.name,
      teamName: teamName.trim(),
      manager: manager.trim(),
      phone: phone.trim(),
      roster: players,
      entryFee: t.entryFee,
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
        <img src={t.image} alt={t.name} className="h-44 w-full object-cover" />
        <Link
          to="/entertainment/tournaments"
          aria-label="Back to tournaments"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
      </div>

      <section className="px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-lg font-extrabold leading-tight text-foreground">{t.name}</h1>
          <span
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold text-white ${
              t.status === "live" ? "bg-rose-600" : t.status === "upcoming" ? "bg-emerald-600" : "bg-slate-600"
            }`}
          >
            {t.status}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {t.venueName} · {t.district}, {t.city}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" /> {t.startDate} → {t.endDate}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" /> {t.teamsRegistered}/{t.teamsMax} teams
          </span>
          <span className="inline-flex items-center gap-1">
            <Trophy className="h-3 w-3" /> {t.sport} · {t.format}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Organised by <span className="font-bold text-foreground">{t.organiser}</span>{" "}
          {t.organiserVerified && <BadgeCheck className="inline h-3.5 w-3.5 text-emerald-600" />}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{t.about}</p>
      </section>

      <div className="mt-4 flex gap-2 px-4">
        {(["overview", "fixtures", "standings"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={tab === k}
            onClick={() => setTab(k)}
            className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold capitalize ${
              tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <section className="mt-4 space-y-4 px-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h2 className="text-sm font-bold text-foreground">Prizes</h2>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {t.prizes.map((p) => (
                <li key={p}>🏆 {p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h2 className="text-sm font-bold text-foreground">Rules</h2>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {t.rules.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs shadow-soft">
            <h2 className="text-sm font-bold text-foreground">Entry</h2>
            <p className="mt-1 text-muted-foreground">
              Entry fee <span className="font-bold text-foreground">${t.entryFee}</span> per team · deadline{" "}
              <span className="font-bold text-foreground">{t.registrationDeadline}</span>
            </p>
          </div>
        </section>
      )}

      {tab === "fixtures" && (
        <section className="mt-4 space-y-2 px-4">
          {t.fixtures.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
              Fixtures will be published after registration closes.
            </p>
          ) : (
            t.fixtures.map((f) => (
              <div key={f.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
                <p className="text-[11px] font-bold text-primary">{f.round}</p>
                <div className="mt-1 flex items-center justify-between text-sm font-bold text-foreground">
                  <span>{f.home}</span>
                  <span className="text-xs text-muted-foreground">{f.score ?? "vs"}</span>
                  <span>{f.away}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{f.time}</p>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "standings" && (
        <section className="mt-4 px-4">
          {t.standings.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
              No standings yet.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <table className="w-full text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">Team</th>
                    <th className="px-2 py-2">P</th>
                    <th className="px-2 py-2">W</th>
                    <th className="px-2 py-2">D</th>
                    <th className="px-2 py-2">L</th>
                    <th className="px-3 py-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {t.standings.map((s) => (
                    <tr key={s.team} className="border-t border-border">
                      <td className="px-3 py-2 font-semibold text-foreground">{s.team}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{s.played}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{s.won}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{s.drawn}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{s.lost}</td>
                      <td className="px-3 py-2 text-center font-bold text-foreground">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {open && (
        <section className="mx-4 mt-5 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h2 className="text-sm font-bold text-foreground">Register your team</h2>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Team name *</span>
              <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="input" placeholder="Hodan Stars" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Manager full name *</span>
              <input value={manager} onChange={(e) => setManager(e.target.value)} className="input" placeholder="Cabdi Maxamed" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Contact phone *</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" inputMode="tel" placeholder="+252 61 000 0000" />
            </label>
            <div>
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Player roster (min 5) *</span>
              <div className="space-y-2">
                {roster.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={p}
                      onChange={(e) => setRoster((r) => r.map((x, j) => (j === i ? e.target.value : x)))}
                      className="input flex-1"
                      placeholder={`Player ${i + 1}`}
                      aria-label={`Player ${i + 1}`}
                    />
                    <button
                      type="button"
                      aria-label={`Remove player ${i + 1}`}
                      onClick={() => setRoster((r) => (r.length > 1 ? r.filter((_, j) => j !== i) : r))}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRoster((r) => [...r, ""])}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> Add player
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-[11px] text-amber-700 dark:text-amber-400">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>Entry fees are paid directly to the organiser. MaalsoorHub only records the method and status.</span>
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
                {s === "unpaid" ? "Will pay later" : "Entry fee sent"}
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

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-bold text-foreground">
              Cancel
            </button>
            <button type="button" onClick={submit} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
              Submit registration
            </button>
          </div>
        </section>
      )}

      <section className="mx-4 mb-24 mt-5 grid grid-cols-2 gap-2">
        <a href={telLink(t.phone)} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-xs font-bold text-foreground">
          <Phone className="h-4 w-4 text-primary" /> Call organiser
        </a>
        <a
          href={whatsappLink(t.whatsapp, `Hello ${t.organiser}, I want to ask about ${t.name} on MaalsoorHub.`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-bold text-white"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </section>

      {!open && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-md border-t border-border bg-background/95 p-3 backdrop-blur">
          <button
            type="button"
            disabled={cannotRegister}
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cannotRegister ? blockedReason : `Register team · $${t.entryFee}`}
          </button>
        </div>
      )}
    </AppShell>
  );
}
