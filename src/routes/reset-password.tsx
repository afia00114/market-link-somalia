import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — MaalsoorHub" },
      { name: "description", content: "Choose a new password for your MaalsoorHub account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

const passwordSchema = z.string().min(8, "Use at least 8 characters").max(72);

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Wait for Supabase to pick up the recovery token from the URL hash.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = passwordSchema.safeParse(pw);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    if (pw !== pw2) return setError("Passwords don't match");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data });
      if (error) {
        setError(error.message);
        return;
      }
      setDone(true);
      setTimeout(() => navigate({ to: "/profile" }), 1500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-8 pt-6 text-white shadow-card">
        <h1 className="text-xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm opacity-90">
          {ready
            ? "Choose a strong password you haven't used before."
            : "Verifying your reset link…"}
        </p>
      </header>

      <section className="px-4 pt-4">
        {!ready ? (
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-soft">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : done ? (
          <div className="rounded-2xl bg-primary-soft p-4 text-sm text-primary">
            Password updated. Redirecting to your profile…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <PwField value={pw} onChange={setPw} placeholder="New password (min 8 chars)" auto="new-password" />
            <PwField value={pw2} onChange={setPw2} placeholder="Confirm new password" auto="new-password" />
            {error && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </button>
          </form>
        )}
      </section>
    </AppShell>
  );
}

function PwField({
  value,
  onChange,
  placeholder,
  auto,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  auto: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-primary">
      <Lock className="h-4 w-4 text-muted-foreground" />
      <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={auto}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}
