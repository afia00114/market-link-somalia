import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { whatsappLink, telLink } from "@/lib/contact";
import { formatLivePrice, type LivePost } from "@/hooks/use-live-posts";

export function LivePostCard({ p }: { p: LivePost }) {
  const price = formatLivePrice(p);
  const place = p.location ?? p.vendor?.location ?? "";
  const wa = p.vendor?.whatsapp ?? p.vendor?.phone ?? "";
  return (
    <article className="overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-soft">
      <Link to="/posts/$id" params={{ id: p.id }} className="flex gap-3 p-3 active:scale-[0.99]">
        {p.image_url ? (
          <img src={p.image_url} alt={p.title} loading="lazy" className="h-24 w-24 flex-shrink-0 rounded-xl object-cover" />
        ) : (
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-bold text-foreground">{p.title}</h3>
            {price && <span className="whitespace-nowrap text-xs font-bold text-primary">{price}</span>}
          </div>
          {p.description && <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{p.description}</div>}
          {place && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{place}</span>
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">
              <BadgeCheck className="h-3 w-3" /> {p.vendor?.business_name ?? "Vendor"}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              New
            </span>
          </div>
        </div>
      </Link>
      {wa && (
        <div className="flex border-t border-border">
          <a
            href={whatsappLink(wa, `Hello, I'm interested in "${p.title}" on MaalsoorHub.`)}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[hsl(142_70%_38%)] hover:bg-secondary"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <span className="w-px bg-border" />
          <a
            href={telLink(p.vendor?.phone ?? wa)}
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:bg-secondary"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      )}
    </article>
  );
}
