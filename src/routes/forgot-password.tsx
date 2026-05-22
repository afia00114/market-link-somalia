import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — MaalsoorHub" },
      { name: "description", content: "Request a password reset link for your MaalsoorHub account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPassword,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(160);

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-8 pt-6 text-white shadow-card">
        <Link to="/auth" className="inline-flex items-center gap-1 text-sm opacity-90">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
        <h1 className="mt-3 text-xl font-bold">Reset your password</h1>
        <p className="mt-1 text-sm opacity-90">
          We'll send a link to your email to set a new password.
        </p>
      </header>

      <section className="px-4 pt-4">
        {sent ? (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm shadow-soft">
            <p className="font-semibold">Check your inbox</p>
            <p className="mt-1 text-muted-foreground">
              If an account exists for <span className="font-medium text-foreground">{email}</span>,
              you'll receive a reset link shortly. The link expires in 1 hour.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-primary">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Your account email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            {error && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Send reset link
            </button>
          </form>
        )}
      </section>
    </AppShell>
  );
}
