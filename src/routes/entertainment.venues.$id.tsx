import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, BadgeCheck, MapPin, Star, Phone, MessageCircle, Share2, Flag, Clock, Users, Ruler,
  ShieldCheck, CalendarDays, ChevronRight, CheckCircle2, Heart, Info,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ImageZoom } from "@/components/ImageZoom";
import { getVenue } from "@/data/entertainment";
import { whatsappLink, telLink } from "@/lib/contact";
import {
  PAY_METHODS, bookedHours, formatDateLong, formatHour, makeRef, saveRecord, todayISO, useFavorites,
  type PayMethod, type PayStatus,
} from "@/lib/entertainment-store";

export const Route = createFileRoute("/entertainment/venues/$id")({
  head: ({ params }) => {
    const v = getVenue(params.id);
    const url = `https://market-link-somalia.lovable.app/entertainment/venues/${params.id}`;
    const title = v ? `${v.name} — ${v.district}, ${v.city} | MaalsoorHub` : "Venue | MaalsoorHub";
    const description = v
      ? `${v.about} Book by the hour, see amenities, rules, hours and reviews on MaalsoorHub.`
      : "Entertainment venue on MaalsoorHub.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...(v ? [{ property: "og:image", content: v.image }, { name: "twitter:image", content: v.image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: VenuePage,
});

type Step = "browse" | "slots" | "summary" | "details" | "payment";

function VenuePage() {
  const { id } = useParams({ from: "/entertainment/venues/$id" });
  const venue = getVenue(id);
  const navigate = useNavigate();
  const { isFav, toggle } = useFavorites();

  const [step, setStep] = useState<Step>("browse");
  const [fieldId, setFieldId] = useState<string | null>(venue?.fields[0]?.id ?? null);
  const [date, setDate] = useState(todayISO());
  const [hours, setHours] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [team, setTeam] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [payMethod, setPayMethod] = useState<PayMethod>("evc");
  const [payStatus, setPayStatus] = useState<PayStatus>("unpaid");

  const field = venue?.fields.find((f) => f.id === fieldId) ?? null;

  const weekday = useMemo(() => new Date(`${date}T00:00:00`).getDay(), [date]);
  const seedBusy = field?.busy[weekday] ?? [];
  const localBusy = venue && field ? bookedHours(venue.id, field.id, date) : [];
  const nowHour = new Date().getHours();
  const isToday = date === todayISO();

  if (!venue) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <p className="text-sm font-bold text-foreground">Venue not found</p>
          <Link to="/entertainment" className="mt-3 inline-block text-xs font-bold text-primary underline">
            Back to Entertainment
          </Link>
        </div>
      </AppShell>
    );
  }

  const slotHours = Array.from({ length: venue.closeHour - venue.openHour }, (_, i) => venue.openHour + i);
  const slotState = (h: number): "available" | "selected" | "booked" | "unavailable" => {
    if (hours.includes(h)) return "selected";
    if (localBusy.includes(h)) return "booked";
    if (seedBusy.includes(h)) return "booked";
    if (isToday && h <= nowHour) return "unavailable";
    return "available";
  };

  const total = field ? hours.length * field.pricePerHour : 0;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function toggleHour(h: number) {
    setHours((cur) => (cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h].sort((a, b) => a - b)));
  }

  function validateDetails() {
    const e: string[] = [];
    if (name.trim().length < 3) e.push("Enter the full name for the booking.");
    if (!/^[+0-9 ]{7,}$/.test(phone.trim())) e.push("Enter a valid phone number.");
    setErrors(e);
    return e.length === 0;
  }

  function confirmBooking() {
    if (!field) return;
    // Prevent overlapping bookings, in case another tab booked the same slot.
    const taken = bookedHours(venue.id, field.id, date);
    const clash = hours.filter((h) => taken.includes(h));
    if (clash.length) {
      setErrors([`Slot ${formatHour(clash[0])} was just booked. Please pick another time.`]);
      setStep("slots");
      setHours((cur) => cur.filter((h) => !taken.includes(h)));
      return;
    }
    const ref = makeRef("BK");
    saveRecord({
      kind: "venue",
      ref,
      venueId: venue.id,
      venueName: venue.name,
      fieldId: field.id,
      fieldName: field.name,
      date,
      hours,
      pricePerHour: field.pricePerHour,
      total,
      customer: { name: name.trim(), phone: phone.trim(), team: team.trim() || undefined, notes: notes.trim() || undefined },
      payMethod,
      payStatus,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
    navigate({ to: "/entertainment/booking/$ref", params: { ref } });
  }

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: venue!.name, url: shareUrl });
      else await navigator.clipboard.writeText(shareUrl);
    } catch {
      /* user cancelled */
    }
  }

  return (
    <AppShell>
      <div className="relative">
        <ImageZoom src={venue.image} alt={venue.name} className="h-52 w-full object-cover" />
        <Link
          to="/entertainment"
          aria-label="Back to Entertainment"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            aria-label="Save venue"
            aria-pressed={isFav(venue.id)}
            onClick={() => toggle(venue.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur"
          >
            <Heart className={`h-4 w-4 ${isFav(venue.id) ? "fill-rose-500 text-rose-500" : "text-foreground"}`} />
          </button>
          <button
            type="button"
            aria-label="Share venue"
            onClick={share}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur"
          >
            <Share2 className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>

      <section className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-tight text-foreground">{venue.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {venue.district}, {venue.city}
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
            from ${venue.priceFrom}/{venue.priceUnit}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {venue.rating.toFixed(1)} ({venue.reviewCount})
          </span>
          {venue.verified && (
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified venue
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {formatHour(venue.openHour)} – {formatHour(venue.closeHour)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{venue.about}</p>
      </section>

      {venue.gallery.length > 1 && (
        <section className="mt-4">
          <h2 className="px-4 text-sm font-bold text-foreground">Gallery</h2>
          <div className="mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
            {venue.gallery.map((g, i) => (
              <ImageZoom key={i} src={g} alt={`${venue.name} photo ${i + 1}`} className="h-24 w-36 flex-shrink-0 rounded-xl object-cover" />
            ))}
          </div>
        </section>
      )}

      <section className="mt-5 px-4">
        <h2 className="text-sm font-bold text-foreground">Amenities</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {venue.amenities.map((a) => (
            <span key={a} className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground">
              {a}
            </span>
          ))}
        </div>
      </section>

      {venue.bookable && field && (
        <section className="mx-4 mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Book this venue</h2>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Step {["browse", "slots", "summary", "details", "payment"].indexOf(step) + 1} of 5
            </span>
          </div>

          {step === "browse" && (
            <>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Select a pitch / field</p>
              <div className="mt-2 space-y-2">
                {venue.fields.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFieldId(f.id);
                      setHours([]);
                    }}
                    aria-pressed={fieldId === f.id}
                    className={`w-full rounded-xl border p-3 text-left ${
                      fieldId === f.id ? "border-primary bg-primary-soft" : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{f.name}</span>
                      <span className="text-sm font-bold text-primary">${f.pricePerHour}/hr</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Ruler className="h-3 w-3" /> {f.size} · {f.surface}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {f.capacity} people
                      </span>
                      <span>{f.indoor ? "Indoor" : "Outdoor"}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep("slots")}
                className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
              >
                Choose date & time <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {step === "slots" && (
            <>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Date</p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {Array.from({ length: 10 }, (_, i) => todayISO(i)).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDate(d);
                      setHours([]);
                    }}
                    aria-pressed={date === d}
                    className={`flex-shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold ${
                      date === d ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {formatDateLong(d).replace(/,\s\d{4}$/, "")}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]">
                <Legend className="bg-background border-border" label="Available" />
                <Legend className="bg-primary border-primary" label="Selected" />
                <Legend className="bg-rose-500/20 border-rose-500/40" label="Booked" />
                <Legend className="bg-muted border-border" label="Unavailable" />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {slotHours.map((h) => {
                  const st = slotState(h);
                  const disabled = st === "booked" || st === "unavailable";
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={disabled}
                      aria-pressed={st === "selected"}
                      aria-label={`${formatHour(h)} ${st}`}
                      onClick={() => toggleHour(h)}
                      className={`rounded-xl border px-2 py-2.5 text-xs font-bold ${
                        st === "selected"
                          ? "border-primary bg-primary text-primary-foreground"
                          : st === "booked"
                            ? "cursor-not-allowed border-rose-500/40 bg-rose-500/20 text-rose-600 line-through"
                            : st === "unavailable"
                              ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                              : "border-border bg-background text-foreground"
                      }`}
                    >
                      {formatHour(h)}
                    </button>
                  );
                })}
              </div>

              {errors.length > 0 && <ErrorBox errors={errors} />}

              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setStep("browse")} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-bold text-foreground">
                  Back
                </button>
                <button
                  type="button"
                  disabled={hours.length === 0}
                  onClick={() => {
                    setErrors([]);
                    setStep("summary");
                  }}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
                >
                  Continue ({hours.length}h)
                </button>
              </div>
            </>
          )}

          {step === "summary" && (
            <>
              <div className="mt-3 space-y-2 rounded-xl bg-background p-3 text-sm">
                <Row label="Venue" value={venue.name} />
                <Row label="Field" value={field.name} />
                <Row label="Date" value={formatDateLong(date)} />
                <Row label="Time" value={hours.map(formatHour).join(", ")} />
                <Row label="Duration" value={`${hours.length} hour${hours.length > 1 ? "s" : ""}`} />
                <Row label="Rate" value={`$${field.pricePerHour}/hour`} />
                <div className="flex items-center justify-between border-t border-border pt-2 text-base font-extrabold text-foreground">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{venue.cancellation}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setStep("slots")} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-bold text-foreground">
                  Back
                </button>
                <button type="button" onClick={() => setStep("details")} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                  Add your details
                </button>
              </div>
            </>
          )}

          {step === "details" && (
            <>
              <div className="mt-3 space-y-3">
                <Field label="Full name *">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Cabdi Maxamed" />
                </Field>
                <Field label="Phone number *">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+252 61 000 0000" inputMode="tel" />
                </Field>
                <Field label="Team name (optional)">
                  <input value={team} onChange={(e) => setTeam(e.target.value)} className="input" placeholder="Hodan Stars" />
                </Field>
                <Field label="Notes for the venue (optional)">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input" placeholder="We need bibs and a match ball" />
                </Field>
              </div>
              {errors.length > 0 && <ErrorBox errors={errors} />}
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setStep("summary")} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-bold text-foreground">
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => validateDetails() && setStep("payment")}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
                >
                  Continue to payment
                </button>
              </div>
            </>
          )}

          {step === "payment" && (
            <>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-[11px] text-amber-700 dark:text-amber-400">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  MaalsoorHub does not process money. Pay the venue directly and record the method below — the venue confirms
                  the payment.
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Payment method</p>
              <div className="mt-2 space-y-2">
                {PAY_METHODS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    aria-pressed={payMethod === m.key}
                    onClick={() => setPayMethod(m.key)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${
                      payMethod === m.key ? "border-primary bg-primary-soft" : "border-border bg-background"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-bold text-foreground">{m.label}</span>
                      <span className="block text-[11px] text-muted-foreground">{m.hint}</span>
                    </span>
                    {payMethod === m.key && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Payment status</p>
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
                    {s === "unpaid" ? "Pay at venue" : "I have sent the payment"}
                  </button>
                ))}
              </div>
              {errors.length > 0 && <ErrorBox errors={errors} />}
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setStep("details")} className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-bold text-foreground">
                  Back
                </button>
                <button type="button" onClick={confirmBooking} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                  Confirm booking · ${total}
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {!venue.bookable && (
        <section className="mx-4 mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h2 className="text-sm font-bold text-foreground">Sessions & tickets</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This venue sells session tickets. Pick an upcoming session from the Entertainment page or contact the venue.
          </p>
          <Link to="/entertainment" className="mt-3 inline-block text-xs font-bold text-primary underline">
            Browse sessions
          </Link>
        </section>
      )}

      <section className="mt-6 px-4">
        <h2 className="text-sm font-bold text-foreground">Venue rules</h2>
        <ul className="mt-2 space-y-1.5">
          {venue.rules.map((r) => (
            <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" /> {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-sm font-bold text-foreground">Location</h2>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-card p-3 text-sm shadow-soft"
        >
          <span className="flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-primary" /> {venue.district}, {venue.city}
          </span>
          <span className="text-xs font-bold text-primary">Open map</span>
        </a>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-sm font-bold text-foreground">Reviews</h2>
        {venue.reviews.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">No reviews yet — be the first after your visit.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {venue.reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{r.author}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Star className="h-3 w-3 fill-current" /> {r.rating}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.text}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{r.date}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-4 mb-24 mt-6 rounded-2xl border border-border bg-card p-4 text-xs shadow-soft">
        <h2 className="text-sm font-bold text-foreground">Cancellation & rescheduling</h2>
        <p className="mt-1 text-muted-foreground">{venue.cancellation}</p>
        <Link to="/entertainment/bookings" className="mt-2 inline-flex items-center gap-1 font-bold text-primary underline">
          <CalendarDays className="h-3.5 w-3.5" /> Manage my bookings
        </Link>
        <a
          href={whatsappLink(venue.whatsapp, `Hello ${venue.name}, I want to report a problem with your listing on MaalsoorHub.`)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-1 text-muted-foreground underline"
        >
          <Flag className="h-3.5 w-3.5" /> Report this venue
        </a>
      </section>

      <div className="fixed inset-x-0 bottom-16 z-40 mx-auto flex max-w-md gap-2 border-t border-border bg-background/95 p-3 backdrop-blur">
        <a
          href={telLink(venue.phone)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-bold text-foreground"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={whatsappLink(venue.whatsapp, `Hello ${venue.name}, I would like to book at your venue.`)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </AppShell>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-3 w-3 rounded border ${className}`} /> {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ErrorBox({ errors }: { errors: string[] }) {
  return (
    <div role="alert" className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-600">
      {errors.map((e) => (
        <p key={e}>{e}</p>
      ))}
    </div>
  );
}
