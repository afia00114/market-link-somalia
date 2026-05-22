import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Store,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useVendor } from "@/hooks/use-vendor";
import { CATEGORIES } from "@/data/categories";
import {
  getAboutFields,
  getContactFields,
  serializeAnswers,
  validateFields,
  type CategoryAnswers,
} from "@/data/vendor-application-schemas";
import { CategoryFields } from "@/components/vendor/CategoryFields";

export const Route = createFileRoute("/vendor/apply")({
  head: () => ({
    meta: [
      { title: "Become a Vendor — MaalsoorHub" },
      { name: "description", content: "Apply to list your business and services on MaalsoorHub." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VendorApply,
});

type Step = 0 | 1 | 2 | 3 | 4;
const STEP_LABELS = ["Welcome", "Business", "Contact", "About", "Review"] as const;

function VendorApply() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { application, isVendor, loading, refresh } = useVendor();

  const [step, setStep] = useState<Step>(0);
  const [businessName, setBusinessName] = useState("");
  const [categoryKey, setCategoryKey] = useState(CATEGORIES[0].key);
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryAnswers, setCategoryAnswers] = useState<CategoryAnswers>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", search: { mode: "signup", next: "/vendor/apply" } });
    }
  }, [authLoading, user, navigate]);

  const selectedCategory = useMemo(
    () => CATEGORIES.find((c) => c.key === categoryKey) ?? CATEGORIES[0],
    [categoryKey],
  );

  const contactFields = useMemo(() => getContactFields(categoryKey), [categoryKey]);
  const aboutFields = useMemo(() => getAboutFields(categoryKey), [categoryKey]);

  // Reset category-specific answers when category changes.
  const changeCategory = (k: typeof categoryKey) => {
    setCategoryKey(k);
    setCategoryAnswers({});
  };

  const updateAnswer = (key: string, value: string | string[] | boolean) => {
    setCategoryAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (s: Step): string | null => {
    if (s === 1) {
      if (businessName.trim().length < 2) return "Enter your business name";
    }
    if (s === 2) {
      if (phone.trim().length < 5) return "Phone is required";
      const err = validateFields(contactFields, categoryAnswers);
      if (err) return err;
    }
    if (s === 3) {
      const err = validateFields(aboutFields, categoryAnswers);
      if (err) return err;
    }
    return null;
  };

  const goNext = () => {
    setError(null);
    const err = validateStep(step);
    if (err) return setError(err);
    setStep((s) => Math.min(4, s + 1) as Step);
  };
  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1) as Step);
  };

  const buildDescription = () => {
    const sections: string[] = [];
    const detailLines = [
      ...serializeAnswers(contactFields, categoryAnswers),
      ...serializeAnswers(aboutFields, categoryAnswers),
    ];
    if (detailLines.length > 0) {
      sections.push(`[${selectedCategory.label} details]\n${detailLines.join("\n")}`);
    }
    const about = description.trim();
    if (about) sections.push(`[About]\n${about}`);
    return sections.join("\n\n") || null;
  };

  const submit = async () => {
    setError(null);
    if (!user) return;
    for (const s of [1, 2, 3] as Step[]) {
      const err = validateStep(s);
      if (err) { setStep(s); return setError(err); }
    }
    setSubmitting(true);
    const { error: insErr } = await supabase.from("vendor_applications").insert({
      user_id: user.id,
      business_name: businessName.trim(),
      category_key: categoryKey,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || null,
      location: location.trim() || null,
      description: buildDescription(),
    });
    setSubmitting(false);
    if (insErr) return setError(insErr.message);
    await refresh();
  };

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm opacity-90">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mt-3 text-xl font-bold">Become a Vendor</h1>
        <p className="mt-1 text-sm opacity-90">Reach thousands of customers across Somalia.</p>
      </header>

      <section className="px-4 py-4">
        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">Loading…</div>
        ) : isVendor ? (
          <ApprovedCard onAction={() => navigate({ to: "/vendor/dashboard" })} />
        ) : application ? (
          <ApplicationStatus
            app={application}
            onEditProfile={() => navigate({ to: "/profile" })}
            onDashboard={() => navigate({ to: "/vendor/dashboard" })}
          />
        ) : (
          <div className="space-y-4">
            <Stepper current={step} />

            {step === 0 && <WelcomeStep onStart={() => setStep(1)} />}

            {step === 1 && (
              <Card title="Tell us about your business" icon={<Store className="h-5 w-5 text-primary" />}>
                <Field label="Business name" value={businessName} onChange={setBusinessName} required placeholder="e.g. Maalsoor Travel" />
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
                  <select
                    value={categoryKey}
                    onChange={(e) => changeCategory(e.target.value as typeof categoryKey)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-muted-foreground">{selectedCategory.short}</p>
                </div>
                {contactFields.length > 0 && (
                  <p className="rounded-lg bg-primary-soft/60 px-3 py-2 text-[11px] text-primary">
                    We'll ask a few extra questions tailored to <span className="font-semibold">{selectedCategory.label}</span> in the next steps.
                  </p>
                )}
              </Card>
            )}

            {step === 2 && (
              <Card title="How can customers reach you?" icon={<Phone className="h-5 w-5 text-primary" />}>
                <Field label="Phone" value={phone} onChange={setPhone} required inputMode="tel" placeholder="+252…" />
                <Field label="WhatsApp (optional)" value={whatsapp} onChange={setWhatsapp} inputMode="tel" placeholder="+252…" />
                <Field label="Location (city, area)" value={location} onChange={setLocation} placeholder="Mogadishu, Hodan" />
                {contactFields.length > 0 && (
                  <>
                    <div className="my-2 flex items-center gap-2">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {selectedCategory.label} details
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <CategoryFields fields={contactFields} answers={categoryAnswers} onChange={updateAnswer} />
                  </>
                )}
              </Card>
            )}

            {step === 3 && (
              <Card title="Describe your services" icon={<Sparkles className="h-5 w-5 text-primary" />}>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">About your business</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                    placeholder="Services you offer, experience, coverage area, opening hours…"
                  />
                  <p className="mt-1 text-right text-[11px] text-muted-foreground">{description.length}/1000</p>
                </div>
                {aboutFields.length > 0 && (
                  <CategoryFields fields={aboutFields} answers={categoryAnswers} onChange={updateAnswer} />
                )}
              </Card>
            )}

            {step === 4 && (
              <Card title="Review your application" icon={<Building2 className="h-5 w-5 text-primary" />}>
                <Row label="Business" value={businessName || "—"} />
                <Row label="Category" value={selectedCategory.label} />
                <Row label="Phone" value={phone || "—"} />
                <Row label="WhatsApp" value={whatsapp || "—"} />
                <Row label="Location" value={location || "—"} icon={<MapPin className="h-3.5 w-3.5" />} />
                {[...contactFields, ...aboutFields].map((f) => {
                  const v = categoryAnswers[f.key];
                  let display = "—";
                  if (f.type === "toggle") display = v === true ? "Yes" : "No";
                  else if (Array.isArray(v)) display = v.length > 0 ? v.join(", ") : "—";
                  else if (typeof v === "string" && v.trim()) display = v;
                  return <Row key={f.key} label={f.label} value={display} multiline />;
                })}
                <Row label="About" value={description || "—"} multiline />
                <p className="pt-2 text-[11px] text-muted-foreground">
                  An admin will review your application. You'll be notified once approved and can then complete your vendor profile.
                </p>
              </Card>
            )}

            {error && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
            )}

            {step > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={goBack}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold"
                >
                  Back
                </button>
                {step < 4 ? (
                  <button
                    onClick={goNext}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit application"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Stepper({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEP_LABELS.map((label, i) => {
        const active = i <= current;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full ${active ? "bg-primary" : "bg-secondary"}`} />
            <span className={`text-[10px] ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  const perks = [
    { icon: <Store className="h-4 w-4" />, text: "Get a verified vendor profile" },
    { icon: <Sparkles className="h-4 w-4" />, text: "Post listings & receive bookings" },
    { icon: <Phone className="h-4 w-4" />, text: "Chat with customers in-app" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Store className="h-6 w-6" />
        </div>
        <h2 className="mt-3 text-lg font-bold">Grow your business with MaalsoorHub</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Apply to become a vendor in 4 quick steps. Approval usually takes less than 24 hours.
        </p>
        <ul className="mt-4 space-y-2">
          {perks.map((p) => (
            <li key={p.text} className="flex items-center gap-2 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary">{p.icon}</span>
              {p.text}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onStart}
        className="flex w-full items-center justify-center gap-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
      >
        Start application <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, multiline, icon }: { label: string; value: string; multiline?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`flex items-center gap-1 text-right text-sm ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {icon}{value}
      </span>
    </div>
  );
}

function ApprovedCard({ onAction }: { onAction: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-7 w-7 text-green-600" />
        <div>
          <div className="text-sm font-semibold">You're an approved vendor</div>
          <div className="text-xs text-muted-foreground">Manage your profile and posts in your dashboard.</div>
        </div>
      </div>
      <button onClick={onAction} className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
        Open vendor dashboard
      </button>
    </div>
  );
}

function ApplicationStatus({
  app,
  onEditProfile,
  onDashboard,
}: {
  app: { status: string; business_name: string; category_key: string; admin_notes: string | null };
  onEditProfile: () => void;
  onDashboard: () => void;
}) {
  const isApproved = app.status === "approved";
  const isRejected = app.status === "rejected";

  const category = CATEGORIES.find((c) => c.key === app.category_key)?.label ?? app.category_key;

  const tone = isApproved
    ? { iconBg: "bg-green-50", iconColor: "text-green-600", dot: "bg-green-500", ping: "bg-green-400", label: "Approved", labelColor: "text-green-700" }
    : isRejected
    ? { iconBg: "bg-destructive/10", iconColor: "text-destructive", dot: "bg-destructive", ping: "bg-destructive/60", label: "Action needed", labelColor: "text-destructive" }
    : { iconBg: "bg-amber-50", iconColor: "text-amber-600", dot: "bg-amber-500", ping: "bg-amber-400", label: "Review in progress", labelColor: "text-primary" };

  const Icon = isApproved ? CheckCircle2 : isRejected ? XCircle : Clock;
  const title = isApproved ? "You're approved!" : isRejected ? "Application not approved" : "Application pending review";
  const text = isApproved
    ? "Welcome aboard. Set up your vendor profile to start posting listings."
    : isRejected
    ? "Please see the admin notes below. You're welcome to reapply with updated details."
    : "We've received your application! Our team typically reviews new vendor requests within 24–48 hours.";

  const steps = [
    { n: "01", title: "Administrative verification", desc: "An admin reviews your business documents and details.", state: isApproved ? "done" : "active" },
    { n: "02", title: "Dashboard activation", desc: "Once approved, you'll gain full access to your vendor tools.", state: isApproved ? "active" : "upcoming" },
    { n: "03", title: "Start selling", desc: "Complete your profile and publish your first business listings.", state: "upcoming" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-start gap-4">
          <div className={`relative rounded-2xl p-3 ${tone.iconBg}`}>
            <Icon className={`h-7 w-7 ${tone.iconColor}`} />
            {!isApproved && !isRejected && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${tone.ping} opacity-75`} />
                <span className={`relative inline-flex h-3 w-3 rounded-full ${tone.dot}`} />
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <p className="text-sm font-medium text-muted-foreground">
              {app.business_name} · {category}
            </p>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{text}</p>

        {app.admin_notes && (
          <p className="mb-6 rounded-xl border border-border bg-secondary p-3 text-xs text-foreground">
            <span className="font-semibold">Admin notes: </span>{app.admin_notes}
          </p>
        )}

        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3">
          <div className={`h-2 w-2 rounded-full ${tone.dot}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</span>
          <span className={`ml-auto text-sm font-semibold ${tone.labelColor}`}>{tone.label}</span>
        </div>

        {isApproved && (
          <div className="mt-5 flex gap-2">
            <button onClick={onEditProfile} className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold">
              Edit profile
            </button>
            <button onClick={onDashboard} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
              Go to dashboard
            </button>
          </div>
        )}
      </div>

      {/* Timeline */}
      {!isRejected && (
        <div className="space-y-4">
          <h3 className="px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">What happens next?</h3>
          <div className="relative">
            <div className="absolute bottom-6 left-[19px] top-6 w-[2px] bg-border" />
            {steps.map((s, i) => {
              const active = s.state === "active";
              const done = s.state === "done";
              const dim = s.state === "upcoming";
              return (
                <div key={s.n} className={`relative flex items-start gap-4 ${i < steps.length - 1 ? "pb-8" : ""}`}>
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background shadow-sm ${
                      done ? "bg-green-50" : active ? "bg-primary-soft" : "bg-secondary"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <span className={`text-sm font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>{s.n}</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className={`text-[15px] font-semibold ${dim ? "text-muted-foreground" : "text-foreground"}`}>{s.title}</p>
                    <p className={`text-sm ${dim ? "text-muted-foreground/70" : "text-muted-foreground"}`}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reassurance footer */}
      <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary-soft/50 p-4">
        <Phone className="h-5 w-5 text-primary" />
        <p className="text-xs font-medium text-primary">Need help? Contact our support team any time.</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, inputMode, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; inputMode?: "tel" | "text"; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}{required && " *"}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        inputMode={inputMode}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
      />
    </div>
  );
}
