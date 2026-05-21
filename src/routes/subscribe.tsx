import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/subscribe")({
  head: () => ({
    meta: [
      { title: "Subscribe — MaalsoorHub" },
      { name: "description", content: "Subscribe to MaalsoorHub with EVC Plus, Zaad, Sahal, eDahab or Mastercard." },
    ],
  }),
  component: SubscribePage,
});

type PlanKey = "monthly" | "annually";
type MethodKey = "evcplus" | "zaad" | "sahal" | "edahab" | "mastercard";

const PLANS: { key: PlanKey; name: string; price: number; per: string; badge?: string }[] = [
  { key: "monthly", name: "Monthly", price: 5, per: "/month" },
  { key: "annually", name: "Annually", price: 50, per: "/year", badge: "Save 17%" },
];

const METHODS: { key: MethodKey; name: string; hint: string; phoneHint: string }[] = [
  { key: "evcplus", name: "EVC Plus", hint: "Hormuud", phoneHint: "61 / 62 / 63 …" },
  { key: "zaad", name: "Zaad", hint: "Telesom", phoneHint: "65 …" },
  { key: "sahal", name: "Sahal", hint: "Golis", phoneHint: "90 …" },
  { key: "edahab", name: "eDahab", hint: "Somtel", phoneHint: "62 / 65 …" },
  { key: "mastercard", name: "Mastercard / Visa", hint: "International card", phoneHint: "Contact number" },
];

function genRef() {
  return "SUB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function SubscribePage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanKey>("monthly");
  const [method, setMethod] = useState<MethodKey>("evcplus");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ ref: string } | null>(null);

  const selectedPlan = useMemo(() => PLANS.find((p) => p.key === plan)!, [plan]);
  const selectedMethod = useMemo(() => METHODS.find((m) => m.key === method)!, [method]);

  async function submit() {
    setError(null);
    if (name.trim().length < 2) return setError("Please enter your full name");
    if (phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid phone number");
    if (!agree) return setError("Please accept the terms to continue");

    setSubmitting(true);
    const ref = genRef();
    const { error: e } = await supabase.from("subscription_requests").insert({
      ref,
      plan,
      method,
      payer_name: name.trim(),
      payer_phone: phone.trim(),
      payer_email: email.trim() || null,
      amount: selectedPlan.price,
      currency: "USD",
      notes: notes.trim() || null,
    });
    setSubmitting(false);
    if (e) {
      setError(e.message);
      return;
    }
    setSuccess({ ref });
  }

  if (success) {
    const waMsg = `Hello MaalsoorHub, I'd like to subscribe.\n\n• Plan: ${selectedPlan.name} ($${selectedPlan.price})\n• Method: ${selectedMethod.name}\n• Name: ${name}\n• Phone: ${phone}\n• Ref: ${success.ref}`;
    return (
      <AppShell>
        <div className="px-4 pt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">Request received</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Our team will reach out shortly to confirm your <b>{selectedPlan.name}</b> subscription via <b>{selectedMethod.name}</b>.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
            Ref: <span className="font-mono">{success.ref}</span>
          </div>
          <div className="mt-6 space-y-2">
            <a
              href={whatsappLink("252610000000", waMsg)}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Confirm on WhatsApp
            </a>
            <button
              onClick={() => navigate({ to: "/home" })}
              className="block w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
            >
              Back to home
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <div className="flex items-center gap-2">
          <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold">Subscribe</h1>
        </div>
        <p className="mt-3 text-xs text-white/85">
          Unlock verified badges, priority placement, and unlimited listings.
        </p>
      </header>

      <section className="px-4 pt-5">
        <h2 className="mb-2 text-sm font-bold text-foreground">Choose a plan</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {PLANS.map((p) => {
            const active = p.key === plan;
            return (
              <button
                key={p.key}
                onClick={() => setPlan(p.key)}
                className={`rounded-2xl border p-3 text-left transition ${
                  active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{p.name}</span>
                  {p.badge && (
                    <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-lg font-bold text-foreground">
                  ${p.price}
                  <span className="text-xs font-medium text-muted-foreground">{p.per}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-5">
        <h2 className="mb-2 text-sm font-bold text-foreground">Payment method</h2>
        <div className="space-y-2">
          {METHODS.map((m) => {
            const active = m.key === method;
            return (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                }`}
              >
                <div className="grad-hero flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white">
                  {m.name.split(" ")[0].slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.hint}</div>
                </div>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-5">
        <h2 className="mb-2 text-sm font-bold text-foreground">Your details</h2>
        <div className="space-y-2">
          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ahmed Ali"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>
          <Field label={`${selectedMethod.name} number`} hint={selectedMethod.phoneHint}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="+252 61 ..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>
          <Field label="Email (optional)">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>
          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything we should know?"
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>
        </div>

        <label className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span>I agree to be contacted to confirm payment and activate my subscription.</span>
        </label>

        {error && (
          <div className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-border bg-card p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total today</span>
            <span className="text-lg font-bold text-foreground">
              ${selectedPlan.price}
              <span className="text-xs font-medium text-muted-foreground">{selectedPlan.per}</span>
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            No charge yet — we'll confirm before activating.
          </div>
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Submitting..." : `Subscribe with ${selectedMethod.name}`}
        </button>
      </section>
    </AppShell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-3 py-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
