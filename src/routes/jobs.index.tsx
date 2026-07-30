import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Search, MapPin, BadgeCheck, Briefcase, CalendarClock,
  ChevronRight, Plus, Building2, MessageCircle, Phone, ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  JOB_SECTORS, JOB_CATEGORIES, JOB_LISTINGS, JOB_LOCATIONS, JOB_TYPES,
  type JobSectorKey, type JobListing,
} from "@/data/jobs";
import { whatsappLink, telLink } from "@/lib/contact";

const SUPPORT_WA = "252611234567";
const SUPPORT_PHONE = "+252611234567";

export const Route = createFileRoute("/jobs/")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/jobs";
    const title = "Jobs in Somalia — NGO, Govt & Private | MaalsoorHub";
    const description =
      "Browse verified job vacancies in Somalia across NGOs, government ministries and private companies. Apply by email or WhatsApp.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: JOB_LISTINGS.length,
              itemListElement: JOB_LISTINGS.slice(0, 20).map((j, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${j.title} — ${j.organisation}`,
                url: `https://market-link-somalia.lovable.app/jobs/${j.id}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: JobsPage,
});

function JobsPage() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<JobSectorKey | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const items = useMemo(
    () =>
      JOB_LISTINGS.filter((j) => {
        if (sector && j.sector !== sector) return false;
        if (cat && j.category !== cat) return false;
        if (city && j.city !== city) return false;
        if (type && j.type !== type) return false;
        if (q && !`${j.title} ${j.organisation} ${j.city}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        return true;
      }),
    [q, sector, cat, city, type],
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = { ngo: 0, government: 0, private: 0 };
    JOB_LISTINGS.forEach((j) => (m[j.sector] += 1));
    return m;
  }, []);

  const clearAll = () => {
    setSector(null);
    setCat(null);
    setCity(null);
    setType(null);
    setQ("");
  };
  const hasFilters = !!(sector || cat || city || type || q);

  return (
    <AppShell>
      <header className="grad-jobs rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            aria-label="Go back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Jobs & Careers</h1>
            <p className="truncate text-xs text-white/80">NGO · Government · Private sector</p>
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold leading-tight">
          Find Your Next Job in Somalia
        </h2>
        <p className="mt-1 text-xs text-white/85">
          Verified vacancies from NGOs, ministries and companies — apply in one tap.
        </p>

        <label className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Search jobs"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search job title, organisation, city…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </header>

      {/* SECTORS */}
      <section className="px-4 pt-5">
        <SectionHeader
          title="Browse by Sector"
          actionLabel={sector ? "Clear" : undefined}
          onAction={() => setSector(null)}
        />
        <div className="mt-3 grid gap-2">
          {JOB_SECTORS.map((s) => {
            const Ic = s.icon;
            const active = sector === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSector(active ? null : s.key)}
                aria-pressed={active}
                className={`flex items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-soft transition-all ${
                  active ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}>
                  <Ic className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.short}</div>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {counts[s.key]} jobs
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 pt-6">
        <SectionHeader
          title="Job Categories"
          actionLabel={cat ? "Clear" : undefined}
          onAction={() => setCat(null)}
        />
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {JOB_CATEGORIES.map((c) => {
            const Ic = c.icon;
            const active = cat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCat(active ? null : c.key)}
                aria-pressed={active}
                className="flex w-20 flex-shrink-0 flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft transition-all ${
                    active ? "bg-primary ring-2 ring-primary/30" : "border border-border bg-card"
                  }`}
                >
                  <Ic className={`h-6 w-6 ${active ? "text-primary-foreground" : "text-primary"}`} />
                </span>
                <span
                  className={`text-center text-[11px] font-medium ${active ? "text-primary" : "text-foreground"}`}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* TYPE + CITY CHIPS */}
      <section className="px-4 pt-5">
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(active ? null : t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {JOB_LOCATIONS.map((c) => {
            const active = city === c;
            return (
              <button
                key={c}
                onClick={() => setCity(active ? null : c)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <MapPin className="h-3.5 w-3.5" /> {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* LISTINGS */}
      <section className="px-4 pt-6">
        <SectionHeader
          title={`${items.length} Open Vacanc${items.length === 1 ? "y" : "ies"}`}
          actionLabel={hasFilters ? "Reset" : undefined}
          onAction={clearAll}
        />
        <div className="mt-3 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No jobs match your filters.
            </div>
          ) : (
            items.map((j) => <JobCard key={j.id} j={j} />)
          )}
        </div>
      </section>

      {/* POST A JOB */}
      <section className="px-4 pt-6">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground">Are you hiring?</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Post a vacancy for your NGO, ministry or company.
            </p>
          </div>
          <Link
            to="/post"
            className="ml-3 inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Post Job
          </Link>
        </div>
      </section>

      {/* SAFETY */}
      <section className="px-4 pt-6">
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-4">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary" />
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground">Never pay for a job</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Genuine employers never ask for money to process an application. Report suspicious posts.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="px-4 pb-8 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="text-sm font-bold">Need help applying?</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Our team can help you prepare your CV and apply.
          </p>
          <div className="mt-3 space-y-2">
            <a
              href={whatsappLink(SUPPORT_WA, "Hello, I need help with a job application on MaalsoorHub.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-whatsapp/10 px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-[hsl(142_70%_38%)]">
                <MessageCircle className="h-4 w-4" /> WhatsApp · Chat with us
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a href={telLink(SUPPORT_PHONE)} className="flex items-center justify-between rounded-xl bg-primary-soft px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Phone className="h-4 w-4" /> Call · {SUPPORT_PHONE}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {actionLabel && (
        <button onClick={onAction} className="text-xs font-semibold text-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function JobCard({ j }: { j: JobListing }) {
  const sector = JOB_SECTORS.find((s) => s.key === j.sector)!;
  return (
    <Link
      to="/jobs/$id"
      params={{ id: j.id }}
      className="block rounded-2xl border border-border bg-card p-3 shadow-soft hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${sector.tone}`}>
          {j.logoText}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="truncate text-sm font-bold text-foreground">{j.title}</h4>
            {j.featured && (
              <span className="flex-shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                Featured
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span className="truncate">{j.organisation}</span>
            {j.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip icon={Briefcase} text={sector.label} />
            <Chip icon={MapPin} text={j.city} />
            <Chip icon={CalendarClock} text={j.type} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{j.salary ?? "Salary negotiable"}</span>
            <span>Posted {j.posted}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Chip({ icon: Ic, text }: { icon: typeof MapPin; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Ic className="h-3 w-3" /> {text}
    </span>
  );
}
