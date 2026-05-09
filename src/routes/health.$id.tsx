import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, Star, BadgeCheck, MapPin, Phone, MessageCircle, Mail, CalendarCheck, ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getHospital, DEPARTMENTS } from "@/data/health";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/health/$id")({
  loader: ({ params }) => {
    const hospital = getHospital(params.id);
    if (!hospital) throw notFound();
    return { hospital };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.hospital.name ?? "Hospital"} — MaalsoorHub` },
      { name: "description", content: loaderData?.hospital.about ?? "Hospital details" },
    ],
  }),
  component: HospitalDetail,
  notFoundComponent: () => (
    <AppShell><div className="p-8 text-center text-sm">Hospital not found.</div></AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell><div className="p-8 text-center text-sm text-destructive">{error.message}</div></AppShell>
  ),
});

function HospitalDetail() {
  const { id } = useParams({ from: "/health/$id" });
  const h = getHospital(id)!;
  const depts = DEPARTMENTS.filter((d) => h.departments.includes(d.key));

  return (
    <AppShell hideNav>
      <div className="relative">
        <img src={h.image} alt={h.name} className="h-56 w-full object-cover" />
        <Link to="/health" className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        {h.open24 && (
          <span className="absolute right-4 top-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            24/7 Open
          </span>
        )}
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-1">
          <h1 className="text-lg font-bold">{h.name}</h1>
          {h.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{h.rating}</span> ({h.reviews} reviews)
          </span>
          <span>·</span>
          <span>{h.type}</span>
        </div>
        <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {h.district} District, {h.city}
        </div>
      </div>

      {/* Quick contact */}
      <div className="mt-4 grid grid-cols-4 gap-2 px-4">
        <a href={telLink(h.phone)} className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 shadow-soft">
          <Phone className="h-5 w-5 text-primary" />
          <span className="text-[11px] font-semibold">Call</span>
        </a>
        <a
          href={whatsappLink(h.whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 shadow-soft"
        >
          <MessageCircle className="h-5 w-5 text-[hsl(142_70%_38%)]" />
          <span className="text-[11px] font-semibold">WhatsApp</span>
        </a>
        <a href={`mailto:${h.email}`} className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 shadow-soft">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-[11px] font-semibold">Email</span>
        </a>
        <button className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 shadow-soft">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-[11px] font-semibold">Directions</span>
        </button>
      </div>

      <section className="px-4 pt-5">
        <h2 className="text-sm font-bold">About Hospital</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{h.about}</p>
      </section>

      <section className="px-4 pt-5">
        <h2 className="text-sm font-bold">Services</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {h.services.map((s) => (
            <span key={s} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">
              {s}
            </span>
          ))}
        </div>
      </section>

      {depts.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="text-sm font-bold">Departments</h2>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {depts.map((d) => {
              const Ic = d.icon;
              return (
                <div key={d.key} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-2.5">
                  <Ic className={`h-5 w-5 ${d.tone}`} />
                  <span className="text-center text-[11px] font-medium">{d.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="px-4 pt-5">
        <h2 className="text-sm font-bold">Contact</h2>
        <div className="mt-2 space-y-2 rounded-2xl border border-border bg-card p-3">
          <Row icon={Phone} label="Phone" value={h.phone} />
          <Row icon={Mail} label="Email" value={h.email} />
          <Row icon={MapPin} label="Address" value={`${h.district}, ${h.city}`} />
        </div>
      </section>

      <section className="px-4 pb-24 pt-5">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft">
          <CalendarCheck className="h-4 w-4" /> Book Appointment
        </button>
      </section>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsappLink(h.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </a>
          <a
            href={telLink(h.phone)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft"
          >
            <Phone className="h-5 w-5" /> Call Now
          </a>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ icon: Ic, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Ic className="h-4 w-4 text-primary" /> {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
