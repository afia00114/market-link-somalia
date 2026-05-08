import { Phone, MessageCircle } from "lucide-react";
import { telLink, whatsappLink } from "@/lib/contact";

export function ContactBar({ whatsapp, phone }: { whatsapp: string; phone: string }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={whatsappLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
        </a>
        <a
          href={telLink(phone)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
        >
          <Phone className="h-5 w-5" /> Call Now
        </a>
      </div>
    </div>
  );
}
