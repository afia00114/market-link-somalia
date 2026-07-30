import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Search, MessageCircle, ChevronRight, ShoppingBag, Store } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaalsoorHub — Search. Connect. WhatsApp." },
      { name: "description", content: "Somalia's smart marketplace. Discover trusted businesses, real estate, and services. Connect directly via WhatsApp." },
      { property: "og:title", content: "MaalsoorHub — Somalia's Smart Marketplace" },
      { property: "og:description", content: "Discover verified businesses, real estate, hotels, travel agencies, and services across Somalia and East Africa. Search, compare, and connect directly via WhatsApp." },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://market-link-somalia.lovable.app/" },
    ],
  }),
  component: Splash,
});

const SLIDES = [
  { icon: Search, title: "Search trusted businesses", desc: "Find verified providers across real estate, services, jobs, and more — all in one place." },
  { icon: MapPin, title: "Discover providers nearby", desc: "Browse listings by city and district across Somalia and East Africa." },
  { icon: MessageCircle, title: "Contact via WhatsApp", desc: "Skip the middlemen. Chat or call providers directly. Deal happens outside the app." },
];

function Splash() {
  const [stage, setStage] = useState<"splash" | "onboarding" | "choose">("splash");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setStage("onboarding"), 1600);
    return () => clearTimeout(t);
  }, []);

  if (stage === "splash") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center grad-hero text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm shadow-card">
          <MapPin className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">MaalsoorHub — Somalia's Smart Marketplace</h1>
        <p className="mt-2 text-sm font-medium text-white/85">Search. Connect. WhatsApp.</p>
      </main>
    );
  }

  if (stage === "choose") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pb-10 pt-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">How will you use MaalsoorHub?</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose how you'd like to get started.</p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate({ to: "/auth", search: { mode: "signup" } })}
            className="flex w-full items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-soft active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-foreground">I'm a Customer</div>
              <div className="mt-1 text-xs text-muted-foreground">Browse listings, book services, chat with vendors.</div>
            </div>
            <ChevronRight className="mt-2 h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate({ to: "/auth", search: { mode: "signup", next: "/vendor/apply" } })}
            className="flex w-full items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-soft active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Store className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-foreground">I'm a Vendor</div>
              <div className="mt-1 text-xs text-muted-foreground">List your business, get bookings, receive payments.</div>
            </div>
            <ChevronRight className="mt-2 h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth" className="font-semibold text-primary">Sign in</Link>
        </p>
        <button
          onClick={() => navigate({ to: "/home" })}
          className="mt-3 text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Continue as guest
        </button>
      </main>
    );
  }

  const Slide = SLIDES[step];
  const Icon = Slide.icon;
  const last = step === SLIDES.length - 1;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex justify-end p-4">
        <button
          onClick={() => setStage("choose")}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground"
        >
          Skip
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-8 flex h-44 w-44 items-center justify-center rounded-3xl grad-hero text-white shadow-card">
          <Icon className="h-20 w-20" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{Slide.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{Slide.desc}</p>
      </div>
      <div className="flex items-center justify-center gap-2 pb-6">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
      <div className="px-6 pb-10">
        <button
          onClick={() => (last ? setStage("choose") : setStep(step + 1))}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-card active:scale-[0.98]"
        >
          {last ? "Continue" : "Next"} <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
