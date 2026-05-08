import { MessageCircle, Phone, ArrowLeft, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { whatsappLink, telLink } from "@/lib/contact";

export function SummaryShare({
  providerName,
  whatsapp,
  phone,
  email,
  subject = "Request from MaalsoorHub",
  summary,
  onBack,
}: {
  providerName: string;
  whatsapp: string;
  phone: string;
  email?: string;
  subject?: string;
  summary: string;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };
  return (
    <div className="px-4 pt-4">
      <button onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <ArrowLeft className="h-3 w-3" /> Edit request
      </button>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="text-xs font-semibold text-muted-foreground">Sending to</div>
        <div className="mt-0.5 text-sm font-bold text-foreground">{providerName}</div>
        <div className="mt-3 text-xs font-semibold text-muted-foreground">Message preview</div>
        <pre className="mt-1 whitespace-pre-wrap rounded-xl bg-secondary p-3 text-xs text-foreground">{summary}</pre>
      </div>
      <a
        href={whatsappLink(whatsapp, summary)}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" /> Send via WhatsApp
      </a>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <a href={telLink(phone)} className="flex h-11 items-center justify-center gap-1 rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-soft active:scale-[0.98]">
          <Phone className="h-4 w-4" /> Call
        </a>
        <a href={mailto} className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs font-semibold text-foreground active:scale-[0.98]">
          <Mail className="h-4 w-4" /> Email
        </a>
        <button onClick={copy} className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs font-semibold text-foreground active:scale-[0.98]">
          {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
        </button>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        MaalsoorHub does not process payments. You'll arrange directly with the provider.
      </p>
    </div>
  );
}
