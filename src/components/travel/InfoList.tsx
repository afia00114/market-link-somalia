import type { LucideIcon } from "lucide-react";

export interface InfoRow {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
}

export function InfoList({ rows, title }: { rows: InfoRow[]; title?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      {title && <h3 className="mb-2 text-sm font-bold">{title}</h3>}
      <ul className="space-y-2">
        {rows.map((r, i) => {
          const Icon = r.icon;
          return (
            <li key={i} className="flex items-start gap-2 text-xs">
              {Icon && <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />}
              <span className="flex-1 text-muted-foreground">{r.label}</span>
              <span className="font-medium text-foreground">{r.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ContactBar({ whatsapp, phone, label = "WhatsApp" }: { whatsapp: string; phone: string; label?: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
      >
        {label}
      </a>
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
      >
        Call
      </a>
    </div>
  );
}
