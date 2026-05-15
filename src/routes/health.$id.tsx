import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Star, BadgeCheck, MapPin, Phone, MessageCircle, Mail,
  CalendarCheck, Clock, ShieldCheck, Share2, Copy, Check, X, Stethoscope,
  ChevronRight, Sparkles,
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
      { property: "og:title", content: loaderData?.hospital.name ?? "Hospital" },
      { property: "og:description", content: loaderData?.hospital.about ?? "" },
      { property: "og:image", content: loaderData?.hospital.image ?? "" },
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
  const depts = useMemo(() => DEPARTMENTS.filter((d) => h.departments.includes(d.key)), [h]);
  const gallery = h.gallery && h.gallery.length > 0 ? h.gallery : [h.image];
  const [activeImg, setActiveImg] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <AppShell hideNav>
      {/* Hero */}
      <div className="relative">
        <img src={gallery[activeImg]} alt={h.name} className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Link to="/health" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.share?.({ title: h.name, url: window.location.href }).catch(() => {})}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute left-4 top-16 flex flex-wrap gap-1.5">
          {h.open24 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-soft">
              <Clock className="h-3 w-3" /> 24/7 Open
            </span>
          )}
          {h.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-soft">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-extrabold drop-shadow">{h.name}</h1>
            {h.verified && <BadgeCheck className="h-5 w-5 text-sky-300" />}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-white/90">
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{h.rating}</span>
              <span className="opacity-80">({h.reviews})</span>
            </span>
            <span className="opacity-60">·</span>
            <span className="inline-flex items-center gap-1">
              <Stethoscope className="h-3 w-3" /> {h.type}
            </span>
          </div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-white/85">
            <MapPin className="h-3 w-3" /> {h.district}, {h.city}
          </div>
        </div>
      </div>

      {/* Gallery thumbs */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 no-scrollbar">
          {gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === activeImg ? "border-primary" : "border-transparent opacity-70"
              }`}
            >
              <img src={g} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Quick contact tiles */}
      <div className="grid grid-cols-4 gap-2 px-4 pt-4">
        <QuickTile icon={Phone} label="Call" tone="text-primary" href={telLink(h.phone)} />
        <QuickTile
          icon={MessageCircle}
          label="WhatsApp"
          tone="text-[hsl(142_70%_38%)]"
          href={whatsappLink(h.whatsapp)}
          external
        />
        <QuickTile icon={Mail} label="Email" tone="text-primary" href={`mailto:${h.email}`} />
        <CopyTile value={h.phone} />
      </div>

      {/* About */}
      <section className="px-4 pt-5">
        <h2 className="text-sm font-bold">About</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{h.about}</p>
      </section>

      {/* What we offer */}
      <section className="px-4 pt-5">
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">What we offer</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {h.services.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft">
                <Check className="h-3.5 w-3.5 text-primary" />
              </span>
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      {depts.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="text-sm font-bold">Departments</h2>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {depts.map((d) => {
              const Ic = d.icon;
              return (
                <div key={d.key} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Ic className={`h-5 w-5 ${d.tone}`} />
                  </span>
                  <span className="text-center text-[11px] font-semibold leading-tight">{d.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Contact card */}
      <section className="px-4 pt-5">
        <h2 className="text-sm font-bold">Contact</h2>
        <div className="mt-2 space-y-1 rounded-2xl border border-border bg-card p-1">
          <ContactRow icon={Phone} label="Phone" value={h.phone} copyValue={h.phone} />
          <ContactRow icon={MessageCircle} label="WhatsApp" value={`+${h.whatsapp}`} copyValue={h.whatsapp} />
          <ContactRow icon={Mail} label="Email" value={h.email} copyValue={h.email} />
          <ContactRow icon={MapPin} label="Address" value={`${h.district}, ${h.city}`} copyValue={`${h.district}, ${h.city}`} />
        </div>
      </section>

      {/* Booking CTA card */}
      <section className="px-4 pb-28 pt-5">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground shadow-soft">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            <h3 className="text-sm font-extrabold">Book an Appointment</h3>
          </div>
          <p className="mt-1 text-[11px] text-primary-foreground/90">
            Send a booking request directly to {h.name}. They'll confirm via your preferred channel.
          </p>
          <button
            onClick={() => setBookingOpen(true)}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-primary active:scale-[0.98]"
          >
            Request Appointment <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        <div className="grid grid-cols-3 gap-2">
          <a
            href={whatsappLink(h.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-whatsapp text-sm font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" /> Chat
          </a>
          <a
            href={telLink(h.phone)}
            className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-secondary text-sm font-semibold shadow-soft active:scale-[0.98]"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <button
            onClick={() => setBookingOpen(true)}
            className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
          >
            <CalendarCheck className="h-4 w-4" /> Book
          </button>
        </div>
      </div>

      {bookingOpen && (
        <BookingSheet hospital={h} onClose={() => setBookingOpen(false)} />
      )}
    </AppShell>
  );
}

/* ---------- Pieces ---------- */

function QuickTile({
  icon: Ic, label, tone, href, external,
}: { icon: typeof Phone; label: string; tone: string; href: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card py-3 shadow-soft active:scale-[0.97]"
    >
      <Ic className={`h-5 w-5 ${tone}`} />
      <span className="text-[11px] font-semibold">{label}</span>
    </a>
  );
}

function CopyTile({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card py-3 shadow-soft active:scale-[0.97]"
    >
      {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-primary" />}
      <span className="text-[11px] font-semibold">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function ContactRow({
  icon: Ic, label, value, copyValue,
}: { icon: typeof Phone; label: string; value: string; copyValue: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary/50">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft">
          <Ic className="h-4 w-4 text-primary" />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="truncate text-xs font-semibold">{value}</div>
        </div>
      </div>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(copyValue).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary active:scale-95"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/* ---------- Booking sheet ---------- */

function BookingSheet({
  hospital: h, onClose,
}: { hospital: ReturnType<typeof getHospital> extends infer T ? NonNullable<T> : never; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dept, setDept] = useState<string>(h.departments[0] ?? "");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const deptLabel = DEPARTMENTS.find((d) => d.key === dept)?.label ?? dept;
  const ref = useMemo(
    () => `MH-${Date.now().toString(36).slice(-6).toUpperCase()}`,
    [],
  );

  const message = [
    `Hello ${h.name},`,
    ``,
    `I'd like to request an appointment via MaalsoorHub.`,
    `• Department: ${deptLabel}`,
    date ? `• Preferred date: ${date}` : "",
    ``,
    `Name: ${name || "—"}`,
    `Phone: ${phone || "—"}`,
    notes ? `Notes: ${notes}` : "",
    ``,
    `Booking ref: ${ref}`,
  ].filter(Boolean).join("\n");

  const subject = `Appointment Request — ${ref}`;
  const valid = name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 7;

  function copy() {
    navigator.clipboard?.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl bg-card p-5 shadow-soft animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-extrabold">Request Appointment</h3>
            <p className="text-[11px] text-muted-foreground">at {h.name}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmed Hassan"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Phone number">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+252 ..."
              inputMode="tel"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Department">
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              {h.departments.map((k) => {
                const d = DEPARTMENTS.find((x) => x.key === k);
                return <option key={k} value={k}>{d?.label ?? k}</option>;
              })}
            </select>
          </Field>
          <Field label="Preferred date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Symptoms or anything the hospital should know..."
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </Field>
        </div>

        <div className="mt-4 rounded-xl bg-secondary/60 px-3 py-2 text-[11px] text-muted-foreground">
          Booking ref: <span className="font-bold text-foreground">{ref}</span>
        </div>

        <h4 className="mt-4 text-xs font-bold">Send request via</h4>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <a
            href={valid ? whatsappLink(h.whatsapp, message) : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!valid}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold ${
              valid ? "bg-whatsapp text-whatsapp-foreground active:scale-[0.98]" : "bg-secondary text-muted-foreground pointer-events-none"
            }`}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={valid ? telLink(h.phone) : undefined}
            aria-disabled={!valid}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold ${
              valid ? "bg-primary text-primary-foreground active:scale-[0.98]" : "bg-secondary text-muted-foreground pointer-events-none"
            }`}
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={valid ? `mailto:${h.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}` : undefined}
            aria-disabled={!valid}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-sm font-bold ${
              valid ? "bg-card active:scale-[0.98]" : "bg-secondary text-muted-foreground pointer-events-none"
            }`}
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <button
            onClick={copy}
            disabled={!valid}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-sm font-bold ${
              valid ? "bg-card active:scale-[0.98]" : "bg-secondary text-muted-foreground"
            }`}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {!valid && (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Add your name and phone to enable sending.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
