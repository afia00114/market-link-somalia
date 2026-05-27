import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, MapPin, BadgeCheck, Phone, MessageCircle, ShieldCheck,
  Share2, Heart, Calendar, Tag, User,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ANIMAL_LISTINGS, ANIMAL_TYPES } from "@/data/livestock";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/livestock/$id")({
  loader: ({ params }) => {
    const animal = ANIMAL_LISTINGS.find((a) => a.id === params.id);
    if (!animal) throw notFound();
    return { animal };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.animal;
    if (!a) return { meta: [{ title: "Listing — MaalsoorHub" }] };
    const url = `https://market-link-somalia.lovable.app/livestock/${a.id}`;
    const title = `${a.title} — $${a.price} in ${a.city} | MaalsoorHub`;
    const description = `${a.title} for sale in ${a.district}, ${a.city}. ${a.age} · ${a.gender}. Contact verified seller directly via WhatsApp.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: a.image },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: LivestockDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center">
        <h1 className="text-lg font-bold">Listing not found</h1>
        <Link to="/livestock" className="mt-3 inline-block text-sm font-semibold text-primary">
          ← Back to Animal Market
        </Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <div className="p-8 text-center text-sm text-muted-foreground">
        <p>Couldn't load listing: {error.message}</p>
        <button onClick={reset} className="mt-3 text-primary font-semibold">Retry</button>
      </div>
    </AppShell>
  ),
});

function LivestockDetail() {
  const { animal: a } = Route.useLoaderData();
  const [fav, setFav] = useState(false);
  const typeLabel = ANIMAL_TYPES.find((t) => t.key === a.type)?.label ?? a.type;

  const onShare = async () => {
    const shareData = { title: a.title, text: `${a.title} — $${a.price}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <AppShell>
      {/* HERO IMAGE */}
      <div className="relative">
        <img src={a.image} alt={a.title} className="h-72 w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link to="/livestock" aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setFav((v) => !v)}
              aria-label="Save"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
            >
              <Heart className={`h-5 w-5 ${fav ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button
              onClick={onShare}
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        {a.featured && (
          <span className="absolute bottom-3 left-4 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            FEATURED
          </span>
        )}
      </div>

      {/* HEADER INFO */}
      <section className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-foreground">{a.title}</h1>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {a.district}, {a.city}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-primary">${a.price}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{a.currency}</div>
          </div>
        </div>
        <span className="mt-2 inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
          {a.tag}
        </span>
      </section>

      {/* QUICK FACTS */}
      <section className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Tag, label: "Type", value: typeLabel },
            { icon: Calendar, label: "Age", value: a.age },
            { icon: User, label: "Gender", value: a.gender },
          ].map(({ icon: Ic, label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-3 text-center">
              <Ic className="mx-auto h-4 w-4 text-primary" />
              <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
              <div className="text-xs font-bold text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="px-4 pt-5">
        <h2 className="text-base font-bold">Description</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Healthy {typeLabel.toLowerCase()} ({a.title}) available in {a.city}. {a.age} old, {a.gender.toLowerCase()},
          ideal for {a.tag.toLowerCase()}. Contact the seller directly to arrange a visit, verify the animal,
          and agree on a fair price.
        </p>
      </section>

      {/* SELLER */}
      <section className="px-4 pt-5">
        <h2 className="text-base font-bold">Seller Information</h2>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-base font-bold text-primary">
            {a.sellerName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <div className="text-sm font-bold text-foreground">{a.sellerName}</div>
              {a.sellerVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {a.sellerVerified ? "Verified Seller" : "Seller"} · {a.city}
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY TIP */}
      <section className="px-4 pt-5">
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-4">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary" />
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground">Stay Safe</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Always meet in a safe public location, inspect the animal in person, and never pay before verifying.
            </p>
          </div>
        </div>
      </section>

      {/* spacer for contact bar */}
      <div className="h-28" />

      {/* CONTACT BAR */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsappLink(a.whatsapp, `Hello ${a.sellerName}, is the ${a.title} ($${a.price}) still available?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </a>
          <a
            href={telLink(`+${a.whatsapp}`)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
          >
            <Phone className="h-5 w-5" /> Call Seller
          </a>
        </div>
      </div>
    </AppShell>
  );
}
