import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck, ShieldOff, Smartphone, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile/security")({
  head: () => ({
    meta: [
      { title: "Account security — MaalsoorHub" },
      { name: "description", content: "Manage two-factor authentication and protect your MaalsoorHub account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Security,
});

type Factor = { id: string; friendly_name?: string; status: string; factor_type: string };

function Security() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [factors, setFactors] = useState<Factor[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Enrollment state
  const [enrolling, setEnrolling] = useState<null | { id: string; qr: string; secret: string }>(null);
  const [code, setCode] = useState("");
  const [friendly, setFriendly] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/auth", search: { mode: "signin", next: "/profile/security" } });
  }, [loading, isAuthenticated, navigate]);

  async function refresh() {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      setError(error.message);
      return;
    }
    setFactors(data?.all ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function startEnroll() {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: friendly.trim() || `Authenticator (${new Date().toLocaleDateString()})`,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setEnrolling({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    } finally {
      setBusy(false);
    }
  }

  async function verifyEnroll() {
    if (!enrolling) return;
    setError(null);
    setBusy(true);
    try {
      const { data: ch, error: e1 } = await supabase.auth.mfa.challenge({ factorId: enrolling.id });
      if (e1) {
        setError(e1.message);
        return;
      }
      const { error: e2 } = await supabase.auth.mfa.verify({
        factorId: enrolling.id,
        challengeId: ch.id,
        code: code.trim(),
      });
      if (e2) {
        setError(e2.message);
        return;
      }
      setEnrolling(null);
      setCode("");
      setFriendly("");
      setInfo("Two-factor authentication is now enabled.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function cancelEnroll() {
    if (!enrolling) return;
    await supabase.auth.mfa.unenroll({ factorId: enrolling.id });
    setEnrolling(null);
    setCode("");
  }

  async function removeFactor(id: string) {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
      if (error) {
        setError(error.message);
        return;
      }
      setInfo("Authenticator removed.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const verified = factors.filter((f) => f.status === "verified");

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-8 pt-6 text-white shadow-card">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm opacity-90">
          <ArrowLeft className="h-4 w-4" /> Profile
        </Link>
        <h1 className="mt-3 text-xl font-bold">Account security</h1>
        <p className="mt-1 text-sm opacity-90">Add a second step at sign-in for extra protection.</p>
      </header>

      <section className="space-y-4 px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center gap-2">
            {verified.length > 0 ? (
              <ShieldCheck className="h-5 w-5 text-primary" />
            ) : (
              <ShieldOff className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="text-sm font-semibold">
              Two-factor authentication: {verified.length > 0 ? "On" : "Off"}
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Use an authenticator app like Google Authenticator, 1Password, or Authy.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
        )}
        {info && (
          <div className="rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary">{info}</div>
        )}

        {verified.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your authenticators
            </div>
            {verified.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-soft">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{f.friendly_name || "Authenticator"}</span>
                </div>
                <button
                  onClick={() => removeFactor(f.id)}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1 text-xs font-semibold text-destructive disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {!enrolling ? (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="text-sm font-semibold">Add an authenticator</div>
            <input
              type="text"
              placeholder="Device name (e.g. iPhone)"
              value={friendly}
              onChange={(e) => setFriendly(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={startEnroll}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Start setup
            </button>
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="text-sm font-semibold">Scan the QR code</div>
            <p className="text-xs text-muted-foreground">
              Open your authenticator app and scan this code, or paste the secret manually.
            </p>
            <div
              className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl bg-white p-2"
              dangerouslySetInnerHTML={{ __html: enrolling.qr }}
            />
            <div className="rounded-xl bg-secondary px-3 py-2 text-center font-mono text-xs">
              {enrolling.secret}
            </div>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-center text-lg tracking-widest outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={cancelEnroll}
                disabled={busy}
                className="flex-1 rounded-2xl border border-border py-3 text-sm font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={verifyEnroll}
                disabled={busy || code.length !== 6}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify & enable
              </button>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
