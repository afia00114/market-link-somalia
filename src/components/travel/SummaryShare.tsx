import { MessageCircle, Phone, ArrowLeft } from "lucide-react";
import { whatsappLink, telLink } from "@/lib/contact";

export function SummaryShare({
  providerName,
  whatsapp,
  phone,
  summary,
  onBack,
}: {
  providerName: string;
  whatsapp: string;
  phone: string;
  summary: string;
  onBack: () => void;
}) {
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
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={whatsappLink(whatsapp, summary)}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
        <a
          href={telLink(phone)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
        >
          <Phone className="h-5 w-5" /> Call now
        </a>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        MaalsoorHub does not process payments. You'll arrange directly with the provider.
      </p>
    </div>
  );
}
