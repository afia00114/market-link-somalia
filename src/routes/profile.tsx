import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Heart, List, Star, Settings, ShieldCheck, ChevronRight, User } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const items = [
  { icon: Heart, label: "Saved Listings" },
  { icon: List, label: "My Listings" },
  { icon: Star, label: "My Reviews" },
  { icon: ShieldCheck, label: "Verification Status" },
  { icon: Settings, label: "Settings" },
];

function Profile() {
  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-8 pt-6 text-white shadow-card">
        <h1 className="text-lg font-bold">Profile</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <User className="h-8 w-8" />
          </div>
          <div>
            <div className="text-base font-bold">Guest User</div>
            <button className="mt-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
              Sign in / Register
            </button>
          </div>
        </div>
      </header>
      <section className="px-4 pt-4">
        <div className="space-y-2">
          {items.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-muted-foreground">MaalsoorHub v1.0 · Search. Connect. WhatsApp.</p>
      </section>
    </AppShell>
  );
}
