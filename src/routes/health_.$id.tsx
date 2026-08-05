import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Star, BadgeCheck, MapPin, Phone, MessageCircle, Mail,
  CalendarCheck, Clock, ShieldCheck, Share2, Copy, Check, X, Stethoscope,
  ChevronRight, Sparkles, User, Users, Sunrise, Sun, Moon, Wallet,
  CreditCard, HeartPulse, RefreshCw, AlertTriangle,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { getHospital, DEPARTMENTS } from "@/data/health";
import { whatsappLink, telLink } from "@/lib/contact";
import { LocationMap } from "@/components/LocationMap";

export const Route = createFileRoute("/health_/$id")({
  loader: ({ params }) => {
    const hospital = getHospital(params.id);
    if (!hospital) throw notFound();
    return { hospital };
  },
  head: ({ params, loaderData }) => {
    const h = loaderData?.hospital;
    const url = `https://market-link-somalia.lovable.app/health/${params.id}`;
    const title = `${h?.name ?? "Hospital"} — MaalsoorHub`.slice(0, 60);
    const description = (h?.about ?? "Hospital details").slice(0, 160);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        ...(h?.image ? [{ property: "og:image", content: h.image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: h ? [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hospital",
            name: h.name,
            description: h.about,
            image: h.image,
            url,
            telephone: h.phone,
            email: h.email,
            address: {
              "@type": "PostalAddress",
              addressLocality: h.city,
              addressRegion: h.district,
              addressCountry: "SO",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: h.rating,
              reviewCount: h.reviews,
            },
          }),
        },
      ] : [],
    };
  },
  component: HospitalDetail,
  notFoundComponent: () => (
    <AppShell><div className="p-8 text-center text-sm">Hospital not found.</div></AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell><div className="p-8 text-center text-sm text-destructive">{error.message}</div></AppShell>
  ),
});

function HospitalDetail() {
  const { id } = useParams({ from: "/health_/$id" });
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

      {/* Location map */}
      <section className="px-4 pt-5">
        <h2 className="mb-2 text-sm font-bold">Location</h2>
        <LocationMap address={`${h.name}, ${h.district}, ${h.city}`} label={h.name} />
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
  const [forSelf, setForSelf] = useState(true);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [phone, setPhone] = useState("");
  const [visit, setVisit] = useState<"first" | "followup" | "urgent">("first");
  const [dept, setDept] = useState<string>(h.departments[0] ?? "");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const [payment, setPayment] = useState<"cash" | "mobile" | "insurance">("cash");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);

  const deptLabel = DEPARTMENTS.find((d) => d.key === dept)?.label ?? dept;
  const ref = useMemo(
    () => `MH-${Date.now().toString(36).slice(-6).toUpperCase()}`,
    [],
  );

  const errors = {
    name: name.trim().length < 2 ? "Enter the patient's full name" : "",
    phone: phone.replace(/\D/g, "").length < 7 ? "Enter a reachable phone number" : "",
    age: age !== "" && (Number(age) < 0 || Number(age) > 120) ? "Enter an age between 0 and 120" : "",
    gender: gender === "" ? "Select the patient's gender" : "",
  };
  const valid = !errors.name && !errors.phone && !errors.age && !errors.gender;

  const visitLabel = visit === "first" ? "First visit" : visit === "followup" ? "Follow-up" : "Urgent";
  const slotLabel = slot === "morning" ? "Morning (8am–12pm)" : slot === "afternoon" ? "Afternoon (12pm–4pm)" : "Evening (4pm–8pm)";
  const payLabel = payment === "cash" ? "Cash" : payment === "mobile" ? "Mobile money" : "Insurance";

  const message = [
    `Hello ${h.name},`,
    ``,
    `I'd like to request an appointment via MaalsoorHub.`,
    `• Department: ${deptLabel}`,
    `• Visit type: ${visitLabel}`,
    date ? `• Preferred date: ${date}` : "",
    `• Preferred time: ${slotLabel}`,
    `• Payment: ${payLabel}`,
    ``,
    `Patient: ${name || "—"}${forSelf ? "" : " (booked by a relative)"}`,
    age ? `Age: ${age}` : "",
    gender ? `Gender: ${gender === "male" ? "Male" : "Female"}` : "",
    `Phone: ${phone || "—"}`,
    notes ? `Reason / symptoms: ${notes}` : "",
    ``,
    `Booking ref: ${ref}`,
  ].filter(Boolean).join("\n");

  const subject = `Appointment Request — ${ref}`;

  function copy() {
    navigator.clipboard?.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const showErr = (msg: string) => (touched && msg ? msg : "");

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

        {/* Who is this for */}
        <SectionTitle icon={Users} title="Who is this appointment for?" step={1} />
        <div className="grid grid-cols-2 gap-2">
          <PickTile icon={User} label="Myself" active={forSelf} onClick={() => setForSelf(true)} />
          <PickTile icon={Users} label="Someone else" active={!forSelf} onClick={() => setForSelf(false)} />
        </div>

        {/* Patient details */}
        <SectionTitle icon={HeartPulse} title="Patient details" step={2} />
        <div className="space-y-3">
          <Field label="Full name" required error={showErr(errors.name)}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 80))}
              placeholder="e.g. Ahmed Hassan"
              autoComplete="name"
              className={`h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary ${
                showErr(errors.name) ? "border-destructive" : "border-border"
              }`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Age" error={showErr(errors.age)}>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="e.g. 34"
                inputMode="numeric"
                className={`h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary ${
                  showErr(errors.age) ? "border-destructive" : "border-border"
                }`}
              />
            </Field>
            <Field label="Phone number" required error={showErr(errors.phone)}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.slice(0, 20))}
                placeholder="+252 ..."
                inputMode="tel"
                autoComplete="tel"
                className={`h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary ${
                  showErr(errors.phone) ? "border-destructive" : "border-border"
                }`}
              />
            </Field>
          </div>

          <Field label="Gender" required error={showErr(errors.gender)}>
            <div className="grid grid-cols-2 gap-2">
              <PickTile icon={User} label="Male" active={gender === "male"} onClick={() => setGender("male")} />
              <PickTile icon={User} label="Female" active={gender === "female"} onClick={() => setGender("female")} />
            </div>
          </Field>
        </div>

        {/* Visit */}
        <SectionTitle icon={Stethoscope} title="Reason for the visit" step={3} />
        <div className="grid grid-cols-3 gap-2">
          <PickTile icon={Sparkles} label="First visit" active={visit === "first"} onClick={() => setVisit("first")} />
          <PickTile icon={RefreshCw} label="Follow-up" active={visit === "followup"} onClick={() => setVisit("followup")} />
          <PickTile icon={AlertTriangle} label="Urgent" active={visit === "urgent"} onClick={() => setVisit("urgent")} tone="text-amber-500" />
        </div>

        <div className="mt-3">
          <Field label="Choose department — tap a picture" required>
            <div className="grid grid-cols-3 gap-2">
              {h.departments.map((k) => {
                const d = DEPARTMENTS.find((x) => x.key === k);
                const Ic = d?.icon ?? Stethoscope;
                const active = dept === k;
                return (
                  <button
                    type="button"
                    key={k}
                    onClick={() => setDept(k)}
                    aria-pressed={active}
                    aria-label={d?.label ?? k}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition active:scale-[0.97] ${
                      active
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full ${active ? "bg-primary/15" : "bg-secondary"}`}>
                      <Ic className={`h-6 w-6 ${d?.tone ?? "text-primary"}`} />
                    </span>
                    <span className="text-center text-[11px] font-semibold leading-tight">
                      {d?.label ?? k}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="mt-3">
          <Field label="Reason / symptoms (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              rows={2}
              placeholder="Symptoms, allergies, current medication, or anything the hospital should know..."
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-1 text-right text-[10px] text-muted-foreground">{notes.length}/500</div>
          </Field>
        </div>

        {/* When */}
        <SectionTitle icon={CalendarCheck} title="When would you like to come?" step={4} />
        <div className="space-y-3">
          <Field label="Preferred date">
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Preferred time">
            <div className="grid grid-cols-3 gap-2">
              <PickTile icon={Sunrise} label="Morning" active={slot === "morning"} onClick={() => setSlot("morning")} />
              <PickTile icon={Sun} label="Afternoon" active={slot === "afternoon"} onClick={() => setSlot("afternoon")} />
              <PickTile icon={Moon} label="Evening" active={slot === "evening"} onClick={() => setSlot("evening")} />
            </div>
          </Field>
        </div>

        {/* Payment */}
        <SectionTitle icon={Wallet} title="How will you pay?" step={5} />
        <div className="grid grid-cols-3 gap-2">
          <PickTile icon={Wallet} label="Cash" active={payment === "cash"} onClick={() => setPayment("cash")} />
          <PickTile icon={Phone} label="Mobile money" active={payment === "mobile"} onClick={() => setPayment("mobile")} />
          <PickTile icon={CreditCard} label="Insurance" active={payment === "insurance"} onClick={() => setPayment("insurance")} />
        </div>

        <div className="mt-4 rounded-xl bg-secondary/60 px-3 py-2 text-[11px] text-muted-foreground">
          Booking ref: <span className="font-bold text-foreground">{ref}</span>
        </div>

        <h4 className="mt-4 text-xs font-bold">Send request via</h4>
        <div className="mt-2 grid grid-cols-2 gap-2" onClickCapture={() => setTouched(true)}>
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
          <button
            onClick={() => setTouched(true)}
            className="mt-2 w-full text-center text-[11px] text-muted-foreground"
          >
            Add the patient's name, phone and gender to enable sending.
          </button>
        )}
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Ic, title, step,
}: { icon: typeof Phone; title: string; step: number }) {
  return (
    <div className="mb-2 mt-5 flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-[10px] font-extrabold text-primary">
        {step}
      </span>
      <Ic className="h-4 w-4 text-primary" />
      <h4 className="text-xs font-bold">{title}</h4>
    </div>
  );
}

function PickTile({
  icon: Ic, label, active, onClick, tone,
}: { icon: typeof Phone; label: string; active: boolean; onClick: () => void; tone?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 transition active:scale-[0.97] ${
        active ? "border-primary bg-primary/10 ring-2 ring-primary" : "border-border bg-card hover:bg-secondary"
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-primary/15" : "bg-secondary"}`}>
        <Ic className={`h-4.5 w-4.5 ${tone ?? "text-primary"}`} />
      </span>
      <span className="text-center text-[11px] font-semibold leading-tight">{label}</span>
    </button>
  );
}

function Field({
  label, children, required, error,
}: { label: string; children: React.ReactNode; required?: boolean; error?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </div>
      {children}
      {error && <div className="mt-1 text-[11px] font-medium text-destructive">{error}</div>}
    </label>
  );
}

