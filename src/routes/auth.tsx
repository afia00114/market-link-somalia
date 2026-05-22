import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { ArrowLeft, Loader2, Mail, Lock, User as UserIcon, Phone, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AppShell } from "@/components/AppShell";

const authSearchSchema = z.object({
  mode: fallback(z.enum(["signin", "signup"]), "signin").default("signin"),
  next: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/auth")({
  validateSearch: zodValidator(authSearchSchema),
  head: () => {
    const title = "Sign in — MaalsoorHub";
    const description = "Sign in or create a MaalsoorHub account to save listings, manage bookings, and reach providers faster.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(160);
const passwordSchema = z.string().min(6, "At least 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your name").max(80);
// E.164: starts with +, 8-15 digits total
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format e.g. +252612345678");

type Tab = "email" | "phone";

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const nextPath = search.next || "/profile";
  const [tab, setTab] = useState<Tab>("email");
  const [mode, setMode] = useState<"signin" | "signup">(search.mode);

  // Email/password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // MFA step-up state
  const [mfa, setMfa] = useState<null | { factorId: string; challengeId: string }>(null);
  const [mfaCode, setMfaCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in (at AAL2 or no MFA enrolled)? bounce.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (!aal || aal.currentLevel === aal.nextLevel) {
        navigate({ to: nextPath });
      } else {
        // MFA challenge required
        const { data: list } = await supabase.auth.mfa.listFactors();
        const factor = list?.totp?.[0];
        if (!factor) {
          navigate({ to: nextPath });
          return;
        }
        const { data: ch } = await supabase.auth.mfa.challenge({ factorId: factor.id });
        if (ch) setMfa({ factorId: factor.id, challengeId: ch.id });
      }
    });
  }, [navigate, nextPath]);

  function resetMessages() {
    setError(null);
    setInfo(null);
  }

  async function postSignIn() {
    // After signInWithPassword, check if step-up is required.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.currentLevel !== aal.nextLevel) {
      const { data: list } = await supabase.auth.mfa.listFactors();
      const factor = list?.totp?.[0];
      if (factor) {
        const { data: ch, error } = await supabase.auth.mfa.challenge({ factorId: factor.id });
        if (error) {
          setError(error.message);
          return;
        }
        setMfa({ factorId: factor.id, challengeId: ch.id });
        return;
      }
    }
    navigate({ to: nextPath });
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    const emailRes = emailSchema.safeParse(email);
    if (!emailRes.success) return setError(emailRes.error.issues[0].message);
    const passRes = passwordSchema.safeParse(password);
    if (!passRes.success) return setError(passRes.error.issues[0].message);

    setBusy(true);
    try {
      if (mode === "signup") {
        const nameRes = nameSchema.safeParse(name);
        if (!nameRes.success) return setError(nameRes.error.issues[0].message);
        const { error } = await supabase.auth.signUp({
          email: emailRes.data,
          password: passRes.data,
          options: {
            emailRedirectTo: `${window.location.origin}${nextPath}`,
            data: { display_name: nameRes.data, full_name: nameRes.data },
          },
        });
        if (error) {
          setError(
            error.message.toLowerCase().includes("registered")
              ? "This email is already registered. Try signing in."
              : error.message,
          );
          return;
        }
        setInfo("Check your inbox to confirm your email, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailRes.data,
          password: passRes.data,
        });
        if (error) {
          setError(
            error.message.toLowerCase().includes("invalid")
              ? "Wrong email or password."
              : error.message,
          );
          return;
        }
        await postSignIn();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: parsed.data,
        options: { shouldCreateUser: true },
      });
      if (error) {
        const m = error.message.toLowerCase();
        if (m.includes("phone provider") || m.includes("not enabled") || m.includes("disabled")) {
          setError("Phone sign-in isn't enabled yet. Please use email or Google for now.");
        } else {
          setError(error.message);
        }
        return;
      }
      setOtpSent(true);
      setInfo("We sent a 6-digit code to your phone.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    if (otp.length !== 6) return setError("Enter the 6-digit code");
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: parsed.data,
        token: otp,
        type: "sms",
      });
      if (error) {
        setError(error.message);
        return;
      }
      await postSignIn();
    } finally {
      setBusy(false);
    }
  }

  async function handleMfaVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!mfa) return;
    resetMessages();
    if (mfaCode.length !== 6) return setError("Enter the 6-digit code");
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: mfa.factorId,
        challengeId: mfa.challengeId,
        code: mfaCode,
      });
      if (error) {
        setError(error.message);
        return;
      }
      navigate({ to: nextPath });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    resetMessages();
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}${nextPath}`,
      });
      if (result.error) {
        setError(result.error.message ?? "Google sign-in failed");
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      await postSignIn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  // MFA step-up view (replaces normal forms)
  if (mfa) {
    return (
      <AppShell>
        <header className="grad-hero rounded-b-3xl px-4 pb-8 pt-6 text-white shadow-card">
          <h1 className="text-xl font-bold">Two-factor verification</h1>
          <p className="mt-1 text-sm opacity-90">
            Enter the 6-digit code from your authenticator app.
          </p>
        </header>
        <section className="px-4 pt-4">
          <form onSubmit={handleMfaVerify} className="space-y-3">
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-transparent text-center text-2xl tracking-[0.5em] outline-none"
                autoFocus
              />
            </div>
            {error && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
            )}
            <button
              type="submit"
              disabled={busy || mfaCode.length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify
            </button>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                setMfa(null);
                setMfaCode("");
              }}
              className="w-full text-center text-xs text-muted-foreground"
            >
              Cancel and sign out
            </button>
          </form>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-8 pt-6 text-white shadow-card">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm opacity-90">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mt-3 text-xl font-bold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm opacity-90">
          {mode === "signin"
            ? "Sign in to save listings and manage bookings."
            : "Join MaalsoorHub to connect with verified providers."}
        </p>
      </header>

      <section className="px-4 pt-4">
        <button
          onClick={handleGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-semibold shadow-soft active:scale-[0.99] disabled:opacity-60"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wide text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Tabs */}
        <div className="mb-3 flex rounded-2xl bg-secondary p-1">
          <TabBtn active={tab === "email"} onClick={() => { setTab("email"); resetMessages(); }}>
            <Mail className="h-4 w-4" /> Email
          </TabBtn>
          <TabBtn active={tab === "phone"} onClick={() => { setTab("phone"); resetMessages(); }}>
            <Phone className="h-4 w-4" /> Phone
          </TabBtn>
        </div>

        {tab === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field
                icon={<UserIcon className="h-4 w-4" />}
                type="text"
                placeholder="Full name"
                value={name}
                onChange={setName}
                autoComplete="name"
              />
            )}
            <Field
              icon={<Mail className="h-4 w-4" />}
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={setPassword}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />

            {mode === "signin" && (
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-semibold text-primary">
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
            )}
            {info && (
              <div className="rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary">{info}</div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        )}

        {tab === "phone" && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3">
            <Field
              icon={<Phone className="h-4 w-4" />}
              type="tel"
              placeholder="+252612345678"
              value={phone}
              onChange={(v) => { setPhone(v); setOtpSent(false); setOtp(""); }}
              autoComplete="tel"
            />
            {otpSent && (
              <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit code"
                  className="w-full bg-transparent text-center text-2xl tracking-[0.4em] outline-none"
                  autoFocus
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
            )}
            {info && (
              <div className="rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary">{info}</div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {otpSent ? "Verify code" : "Send code"}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); resetMessages(); }}
                className="w-full text-center text-xs text-muted-foreground"
              >
                Use a different number
              </button>
            )}
          </form>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "New to MaalsoorHub?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              resetMessages();
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="font-semibold text-primary"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </section>
    </AppShell>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
        active ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-primary">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.8 0 19.5-8.7 19.5-19.5 0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.7 13-4.6l-6-5.1c-1.9 1.3-4.3 2.2-7 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6 5.1C40.7 35.6 43.5 30.2 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
