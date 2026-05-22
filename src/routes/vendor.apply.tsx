import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
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

function VendorApply() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { application, isVendor, loading, refresh } = useVendor();

  const [businessName, setBusinessName] = useState("");
  const [categoryKey, setCategoryKey] = useState(CATEGORIES[0].key);
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) return;
    if (businessName.trim().length < 2) return setError("Business name too short");
    if (phone.trim().length < 5) return setError("Phone is required");

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
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-bold">Become a Vendor</h1>
      </header>

      <section className="px-4 py-4">
        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">Loading…</div>
        ) : isVendor ? (
          <StatusCard
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
            title="You're an approved vendor"
            text="Manage your profile and posts in your vendor dashboard."
            actionLabel="Open dashboard"
            onAction={() => navigate({ to: "/vendor/dashboard" })}
          />
        ) : application ? (
          <ApplicationStatus app={application} />
        ) : (
          <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Tell us about your business. An admin will review and approve your application.
            </p>
            <Field label="Business name" value={businessName} onChange={setBusinessName} required />
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
            </div>
            <Field label="Phone" value={phone} onChange={setPhone} required inputMode="tel" placeholder="+252…" />
            <Field label="WhatsApp (optional)" value={whatsapp} onChange={setWhatsapp} inputMode="tel" />
            <Field label="Location (city, area)" value={location} onChange={setLocation} />
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">About your business</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                placeholder="Services you offer, experience, coverage area…"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          </form>
        )}
      </section>
    </AppShell>
  );
}

function ApplicationStatus({ app }: { app: { status: string; business_name: string; category_key: string; admin_notes: string | null } }) {
  const icon =
    app.status === "approved" ? <CheckCircle2 className="h-6 w-6 text-green-600" /> :
    app.status === "rejected" ? <XCircle className="h-6 w-6 text-destructive" /> :
    <Clock className="h-6 w-6 text-amber-600" />;
  const title =
    app.status === "approved" ? "Approved" :
    app.status === "rejected" ? "Application rejected" :
    "Application pending review";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{app.business_name} · {app.category_key}</div>
        </div>
      </div>
      {app.admin_notes && (
        <p className="mt-3 rounded-xl bg-secondary p-3 text-xs">{app.admin_notes}</p>
      )}
    </div>
  );
}

function StatusCard({ icon, title, text, actionLabel, onAction }: {
  icon: React.ReactNode; title: string; text: string; actionLabel: string; onAction: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">{icon}<div><div className="text-sm font-semibold">{title}</div><div className="text-xs text-muted-foreground">{text}</div></div></div>
      <button onClick={onAction} className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">{actionLabel}</button>
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
