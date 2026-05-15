import type { LucideIcon } from "lucide-react";
import { MessageCircle, Phone, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

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

export function ContactBar({
  whatsapp,
  phone,
  email,
  label = "WhatsApp",
}: {
  whatsapp: string;
  phone: string;
  email?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        [phone, email].filter(Boolean).join(" · "),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft transition active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" /> {label}
      </a>
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft transition active:scale-[0.98]"
      >
        <Phone className="h-5 w-5" /> Call
      </a>
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary active:scale-[0.98]"
        >
          <Mail className="h-4 w-4" /> Email
        </a>
      )}
      <button
        type="button"
        onClick={copy}
        className={`flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary active:scale-[0.98] ${
          email ? "" : "col-span-2"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-primary" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy contact
          </>
        )}
      </button>
    </div>
  );
}
