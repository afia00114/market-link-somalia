import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Heart,
  List,
  Star,
  Settings as SettingsIcon,
  ShieldCheck,
  ChevronRight,
  User,
  Ticket,
  Trash2,
  X,
  LogIn,
  Info,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { listBookings, type Booking } from "@/lib/bookings";
import {
  listFavorites,
  removeFavorite,
  subscribeFavorites,
  type Favorite,
} from "@/lib/favorites";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — MaalsoorHub" },
      { name: "description", content: "Your MaalsoorHub account: saved listings, bookings, reviews, and settings." },
      { property: "og:title", content: "Profile — MaalsoorHub" },
      { property: "og:description", content: "Your MaalsoorHub account, saved listings, and bookings." },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/profile" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://market-link-somalia.lovable.app/profile" }],
  }),
  component: Profile,
});

type SheetKind = null | "saved" | "reviews" | "verify" | "settings" | "signin";

function Profile() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favs, setFavs] = useState<Favorite[]>([]);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setBookings(listBookings());
      setFavs(listFavorites());
    };
    refresh();
    const off = subscribeFavorites(refresh);
    const onBookings = () => refresh();
    window.addEventListener("mh:bookings:changed", onBookings);
    window.addEventListener("storage", onBookings);
    return () => {
      off();
      window.removeEventListener("mh:bookings:changed", onBookings);
      window.removeEventListener("storage", onBookings);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const myListingsCount = bookings.filter((b) => b.service === "listing").length;

  const rows = [
    {
      key: "saved",
      icon: Heart,
      label: "Saved",
      hint: favs.length ? `${favs.length} item${favs.length === 1 ? "" : "s"}` : "None yet",
      onClick: () => setSheet("saved"),
    },
    {
      key: "tickets",
      icon: Ticket,
      label: "My Bookings",
      hint: bookings.length ? `${bookings.length} total` : "No bookings",
      onClick: () => navigate({ to: "/travel/my-tickets" }),
    },
    {
      key: "post",
      icon: List,
      label: "My Listings",
      hint: myListingsCount ? `${myListingsCount} active` : "Post your first",
      onClick: () => navigate({ to: "/post" }),
    },
    {
      key: "reviews",
      icon: Star,
      label: "My Reviews",
      hint: "Coming soon",
      onClick: () => setSheet("reviews"),
    },
    {
      key: "verify",
      icon: ShieldCheck,
      label: "Verification Status",
      hint: "Unverified",
      onClick: () => setSheet("verify"),
    },
    {
      key: "settings",
      icon: SettingsIcon,
      label: "Settings",
      hint: "Language & preferences",
      onClick: () => setSheet("settings"),
    },
  ];

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-8 pt-6 text-white shadow-card">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Profile</h1>
          <LanguageSwitcher variant="light" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <User className="h-8 w-8" />
          </div>
          <div>
            <div className="text-base font-bold">Guest User</div>
            <button
              onClick={() => setSheet("signin")}
              className="mt-1 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in / Register
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <Stat label="Saved" value={favs.length} />
          <Stat label="Bookings" value={bookings.length} />
          <Stat label="Listings" value={myListingsCount} />
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="space-y-2">
          {rows.map(({ key, icon: Icon, label, hint, onClick }) => (
            <button
              key={key}
              onClick={onClick}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft transition-transform active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[11px] text-muted-foreground">{hint}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          MaalsoorHub v1.0 · Search. Connect. WhatsApp.
        </p>
      </section>

      {notice && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-card">
            <Info className="h-3.5 w-3.5" />
            {notice}
          </div>
        </div>
      )}

      {sheet && (
        <Sheet onClose={() => setSheet(null)} title={sheetTitle(sheet)}>
          {sheet === "saved" && (
            <SavedList
              favs={favs}
              onOpen={(f) => {
                setSheet(null);
                if (f.kind === "listing") navigate({ to: "/listing/$id", params: { id: f.id } });
                else if (f.kind === "hotel") navigate({ to: "/hotels/$id", params: { id: f.id } });
                else if (f.kind === "property") navigate({ to: "/property/$id", params: { id: f.id } });
              }}
              onRemove={(f) => {
                removeFavorite(f.kind, f.id);
                setNotice("Removed from saved");
              }}
            />
          )}
          {sheet === "reviews" && (
            <EmptyState
              title="Reviews are coming soon"
              text="Once we ship reviews, the ones you leave on providers will show up here."
            />
          )}
          {sheet === "verify" && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-secondary p-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">Unverified</div>
                  <div className="text-[11px] text-muted-foreground">
                    Verify your phone and ID to unlock the verified badge on listings.
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSheet(null);
                  setNotice("Verification will be available soon");
                }}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Start verification
              </button>
            </div>
          )}
          {sheet === "settings" && (
            <div className="space-y-3">
              <Row label="Language">
                <LanguageSwitcher variant="dark" />
              </Row>
              <Link
                to="/messages"
                onClick={() => setSheet(null)}
                className="flex items-center justify-between rounded-xl bg-secondary p-3 text-sm"
              >
                <span className="font-medium">Messages</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <button
                onClick={() => {
                  if (!confirm("Clear all saved items and local bookings?")) return;
                  localStorage.removeItem("mh.favorites.v1");
                  localStorage.removeItem("mh.bookings.v1");
                  window.dispatchEvent(new CustomEvent("mh:favorites:changed"));
                  window.dispatchEvent(new CustomEvent("mh:bookings:changed"));
                  setSheet(null);
                  setNotice("Local data cleared");
                }}
                className="flex w-full items-center justify-between rounded-xl bg-secondary p-3 text-sm text-destructive"
              >
                <span className="font-medium">Clear local data</span>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          {sheet === "signin" && (
            <EmptyState
              title="Accounts coming soon"
              text="For now you can browse, save and book as a guest — your data stays on this device."
            />
          )}
        </Sheet>
      )}
    </AppShell>
  );
}

function sheetTitle(s: Exclude<SheetKind, null>) {
  return s === "saved"
    ? "Saved"
    : s === "reviews"
    ? "My Reviews"
    : s === "verify"
    ? "Verification"
    : s === "settings"
    ? "Settings"
    : "Sign in";
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/15 px-2 py-2 backdrop-blur">
      <div className="text-lg font-extrabold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary p-3 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </div>
  );
}

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl bg-card p-4 pb-6 shadow-card animate-in slide-in-from-bottom"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Info className="h-6 w-6" />
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">{text}</p>
    </div>
  );
}

function SavedList({
  favs,
  onOpen,
  onRemove,
}: {
  favs: Favorite[];
  onOpen: (f: Favorite) => void;
  onRemove: (f: Favorite) => void;
}) {
  if (!favs.length) {
    return (
      <EmptyState
        title="No saved items"
        text="Tap the heart on any listing, hotel or property to save it here."
      />
    );
  }
  return (
    <ul className="space-y-2">
      {favs.map((f) => (
        <li
          key={`${f.kind}:${f.id}`}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-2"
        >
          <button onClick={() => onOpen(f)} className="flex flex-1 items-center gap-3 text-left">
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-secondary">
              {f.image ? (
                <img src={f.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] uppercase text-muted-foreground">
                  {f.kind}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{f.title ?? f.id}</div>
              <div className="text-[11px] capitalize text-muted-foreground">{f.kind}</div>
            </div>
          </button>
          <button
            onClick={() => onRemove(f)}
            aria-label="Remove"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
