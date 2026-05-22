import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { ArrowLeft, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
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

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const nextPath = search.next || "/profile";
  const [mode, setMode] = useState<"signin" | "signup">(search.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in? bounce to next or profile.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: nextPath });
    });
  }, [navigate, nextPath]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const emailRes = emailSchema.safeParse(email);
    if (!emailRes.success) return setError(emailRes.error.issues[0].message);
    const passRes = passwordSchema.safeParse(password);
    if (!passRes.success) return setError(passRes.error.issues[0].message);

    setBusy(true);
    try {
      if (mode === "signup") {
        const nameRes = nameSchema.safeParse(name);
        if (!nameRes.success) {
          setError(nameRes.error.issues[0].message);
          return;
        }
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
        navigate({ to: nextPath });
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
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
      navigate({ to: nextPath });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
      setBusy(false);
    }
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

        <form onSubmit={handleSubmit} className="space-y-3">
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

          {error && (
            <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary">
              {info}
            </div>
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

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "New to MaalsoorHub?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setError(null);
              setInfo(null);
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
