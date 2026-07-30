import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, MapPin, BadgeCheck, Phone, MessageCircle, Building2,
  CalendarClock, Briefcase, Mail, CheckCircle2, ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { JOB_LISTINGS, JOB_SECTORS } from "@/data/jobs";
import { whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/jobs/$id")({
  loader: ({ params }) => {
    const job = JOB_LISTINGS.find((j) => j.id === params.id);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    const j = loaderData?.job;
    if (!j)
      return {
        meta: [{ title: "Job not found — MaalsoorHub" }, { name: "robots", content: "noindex" }],
      };
    const url = `https://market-link-somalia.lovable.app/jobs/${j.id}`;
    const title = `${j.title} at ${j.organisation} — ${j.city} | MaalsoorHub Jobs`;
    const description = `${j.summary} ${j.type} role in ${j.city}. Apply before ${j.deadline}.`.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: j.title,
            description: j.summary,
            employmentType: j.type.toUpperCase().replace("-", "_"),
            validThrough: j.deadline,
            hiringOrganization: { "@type": "Organization", name: j.organisation },
            jobLocation: {
              "@type": "Place",
              address: { "@type": "PostalAddress", addressLocality: j.city, addressCountry: "SO" },
            },
          }),
        },
      ],
    };
  },
  component: JobDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center">
        <h1 className="text-lg font-bold">Job not found</h1>
        <Link to="/jobs" className="mt-3 inline-block text-sm font-semibold text-primary">
          Back to jobs
        </Link>
      </div>
    </AppShell>
  ),
});

function JobDetail() {
  const { job: j } = Route.useLoaderData();
  const sector = JOB_SECTORS.find((s) => s.key === j.sector)!;
  const message = `Hello ${j.organisation}, I would like to apply for the ${j.title} position listed on MaalsoorHub.`;

  return (
    <AppShell>
      <header className="grad-jobs rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            aria-label="Back to jobs"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <div className="truncate text-xs text-white/80">{sector.label} vacancy</div>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold leading-tight">{j.title}</h1>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
          <Building2 className="h-4 w-4" />
          <span className="truncate">{j.organisation}</span>
          {j.verified && <BadgeCheck className="h-4 w-4" />}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <HeroChip icon={MapPin} text={j.city} />
          <HeroChip icon={Briefcase} text={j.type} />
          <HeroChip icon={CalendarClock} text={`Closes ${j.deadline}`} />
        </div>
      </header>

      <section className="px-4 pt-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Fact label="Sector" value={sector.label} />
            <Fact label="Salary" value={j.salary ?? "Negotiable"} />
            <Fact label="Posted" value={j.posted} />
            <Fact label="Deadline" value={j.deadline} />
          </div>
        </div>
      </section>

      <section className="px-4 pt-5">
        <h2 className="text-base font-bold">About the role</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{j.summary}</p>
      </section>

      <Bullets title="Key responsibilities" items={j.responsibilities} />
      <Bullets title="Requirements" items={j.requirements} />

      <section className="px-4 pt-6">
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-4">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            Never pay money to apply. Report any employer who asks for a fee.
          </p>
        </div>
      </section>

      {/* APPLY BAR */}
      <div className="sticky bottom-0 z-10 mt-6 border-t border-border bg-card/95 p-3 backdrop-blur">
        <div className="flex gap-2">
          <a
            href={`mailto:${j.applyEmail}?subject=${encodeURIComponent(`Application: ${j.title}`)}&body=${encodeURIComponent(message)}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" /> Apply by email
          </a>
          <a
            href={whatsappLink(j.whatsapp, message)}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp/15 px-3 py-3 text-sm font-semibold text-[hsl(142_70%_38%)] active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </AppShell>
  );
}

function HeroChip({ icon: Ic, text }: { icon: typeof MapPin; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
      <Ic className="h-3.5 w-3.5" /> {text}
    </span>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Bullets({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="px-4 pt-6">
      <h2 className="text-base font-bold">{title}</h2>
      <ul className="mt-2 space-y-2">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
