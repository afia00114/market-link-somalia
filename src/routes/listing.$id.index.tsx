import { createFileRoute, Link, useNavigate, useParams, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, BadgeCheck, MapPin, Clock, DollarSign, Languages,
  Star, MessageCircle, Phone, CalendarPlus, Heart, Share2, Briefcase,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LISTINGS } from "@/data/listings";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/listing/$id/")({
  component: ListingDetailPage,
  loader: ({ params }) => {
    const item = LISTINGS.find((l) => l.id === params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.item.provider.name ?? "Provider"} — MaalsoorHub` },
      { name: "description", content: loaderData?.item.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <h1 className="text-lg font-bold">Listing not found</h1>
      <Link to="/home" className="mt-3 inline-block text-primary">Go home</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8 text-sm">{error.message}</div>,
});

function ListingDetailPage() {
  const { id } = useParams({ from: "/listing/$id" });
  const item = LISTINGS.find((l) => l.id === id)!;
  const navigate = useNavigate();
  const p = item.provider;

  const gallery = [item.image, item.image, item.image];
  const jobsCompleted = Math.round(p.reviews * 2.4);

  return (
    <AppShell hideNav>
      {/* Hero image */}
      <div className="relative h-72 w-full">
        <img src={item.image} alt={p.name} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <button
            onClick={() => navigate({ to: "/category/$key", params: { key: item.category } })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft active:scale-95" aria-label="Save">
              <Heart className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft active:scale-95" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card overlay */}
      <section className="-mt-6 rounded-t-3xl bg-background px-4 pt-5">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
          <BadgeCheck className="h-3.5 w-3.5" /> {p.badge}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold">{p.name}</h1>
        <p className="text-sm text-muted-foreground">{item.subtitle}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current text-accent" />
            <span className="font-bold text-foreground">{p.rating}</span> ({p.reviews} reviews)
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" /> {jobsCompleted} jobs completed
          </span>
        </div>

        {/* Info rows */}
        <ul className="mt-4 space-y-3">
          <InfoRow icon={MapPin} title="10 min away" subtitle={`${item.district ? item.district + ", " : ""}${item.city}`} />
          <InfoRow icon={DollarSign} title={item.price ?? "Contact for pricing"} subtitle="Price range" />
          <InfoRow icon={Clock} title="Open now" subtitle="Closes 8:00 PM" tone="success" />
          <InfoRow icon={Languages} title="Languages" subtitle="Somali, English, Arabic" />
        </ul>

        {/* Gallery */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {gallery.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" className="h-16 w-full rounded-xl object-cover" />
          ))}
          <div className="relative h-16 w-full overflow-hidden rounded-xl">
            <img src={item.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-foreground/55 text-sm font-bold text-white">+12</div>
          </div>
        </div>

        {/* About */}
        <div className="mt-5">
          <h2 className="text-base font-bold">About</h2>
          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        </div>
      </section>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 mt-6 grid grid-cols-3 gap-2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        <a
          href={whatsappLink(p.whatsapp, `Hello ${p.name}, I'm interested in ${item.title}.`)}
          target="_blank" rel="noreferrer"
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-whatsapp text-sm font-bold text-whatsapp-foreground active:scale-95"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={telLink(p.phone)}
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-secondary text-sm font-bold text-foreground active:scale-95"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <Link
          to="/listing/$id/book" params={{ id: item.id }}
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-95"
        >
          <CalendarPlus className="h-4 w-4" /> Book
        </Link>
      </div>
    </AppShell>
  );
}

function InfoRow({
  icon: Icon, title, subtitle, tone,
}: { icon: any; title: string; subtitle: string; tone?: "success" }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className={`text-sm font-bold ${tone === "success" ? "text-emerald-600" : ""}`}>{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </li>
  );
}
