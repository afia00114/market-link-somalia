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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", search: { mode: "signup", next: "/vendor/apply" } });
    }
  }, [authLoading, user, navigate]);

  const selectedCategory = useMemo(
    () => CATEGORIES.find((c) => c.key === categoryKey) ?? CATEGORIES[0],
    [categoryKey],
  );

  const validateStep = (s: Step): string | null => {
    if (s === 1) {
      if (businessName.trim().length < 2) return "Enter your business name";
    }
    if (s === 2) {
      if (phone.trim().length < 5) return "Phone is required";
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

  const submit = async () => {
    setError(null);
    if (!user) return;
    for (const s of [1, 2] as Step[]) {
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
      description: description.trim() || null,
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
                    onChange={(e) => setCategoryKey(e.target.value as typeof categoryKey)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-muted-foreground">{selectedCategory.short}</p>
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card title="How can customers reach you?" icon={<Phone className="h-5 w-5 text-primary" />}>
                <Field label="Phone" value={phone} onChange={setPhone} required inputMode="tel" placeholder="+252…" />
                <Field label="WhatsApp (optional)" value={whatsapp} onChange={setWhatsapp} inputMode="tel" placeholder="+252…" />
                <Field label="Location (city, area)" value={location} onChange={setLocation} placeholder="Mogadishu, Hodan" />
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
              </Card>
            )}

            {step === 4 && (
              <Card title="Review your application" icon={<Building2 className="h-5 w-5 text-primary" />}>
                <Row label="Business" value={businessName || "—"} />
                <Row label="Category" value={selectedCategory.label} />
                <Row label="Phone" value={phone || "—"} />
                <Row label="WhatsApp" value={whatsapp || "—"} />
                <Row label="Location" value={location || "—"} icon={<MapPin className="h-3.5 w-3.5" />} />
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
  const icon = isApproved ? <CheckCircle2 className="h-7 w-7 text-green-600" />
    : isRejected ? <XCircle className="h-7 w-7 text-destructive" />
    : <Clock className="h-7 w-7 text-amber-600" />;
  const title = isApproved ? "Approved" : isRejected ? "Application rejected" : "Application pending review";
  const text = isApproved
    ? "Set up your vendor profile to start posting listings."
    : isRejected
    ? "See the admin notes below and feel free to reapply."
    : "We'll notify you as soon as an admin reviews your application.";

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">{app.business_name} · {app.category_key}</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{text}</p>
        {app.admin_notes && (
          <p className="mt-3 rounded-xl bg-secondary p-3 text-xs">{app.admin_notes}</p>
        )}
        {isApproved && (
          <div className="mt-4 flex gap-2">
            <button onClick={onEditProfile} className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold">
              Edit profile
            </button>
            <button onClick={onDashboard} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
              Go to dashboard
            </button>
          </div>
        )}
      </div>
      {!isApproved && (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">What happens next?</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>An admin reviews your business details.</li>
            <li>Once approved, you'll unlock your vendor dashboard.</li>
            <li>Complete your vendor profile and start posting listings.</li>
          </ol>
        </div>
      )}
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
