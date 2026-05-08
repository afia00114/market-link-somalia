import { BadgeCheck, Star, MapPin } from "lucide-react";
import type { ReactNode } from "react";

export function ProviderRow({
  logo, name, verified, rating, reviews, city, badges, right, onClick, footer,
}: {
  logo: string; name: string; verified?: boolean; rating: number; reviews: number; city: string;
  badges?: ReactNode; right?: ReactNode; onClick?: () => void; footer?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft active:scale-[0.99]"
    >
      <div className="flex gap-3 p-3">
        <img src={logo} alt={name} loading="lazy" className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="truncate text-sm font-bold">{name}</h3>
                {verified && <BadgeCheck className="h-4 w-4 flex-shrink-0 text-primary" />}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-current text-accent" /> {rating} ({reviews})
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" /> {city}
                </span>
              </div>
              {badges && <div className="mt-1.5 flex flex-wrap gap-1">{badges}</div>}
            </div>
            {right}
          </div>
        </div>
      </div>
      {footer}
    </button>
  );
}

export function MiniBadge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "primary" | "accent" }) {
  const cls =
    tone === "primary" ? "bg-primary-soft text-primary" :
    tone === "accent" ? "bg-[oklch(0.95_0.05_60)] text-accent-foreground" :
    "bg-secondary text-muted-foreground";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{children}</span>;
}
