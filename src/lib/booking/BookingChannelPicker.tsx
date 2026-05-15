import { MessageCircle, Mail, Phone } from "lucide-react";
import type { BookingChannel } from "@/lib/bookings";

interface Props {
  value: BookingChannel;
  onChange: (c: BookingChannel) => void;
  showCall?: boolean;
  accent?: string; // tailwind colour class root e.g. "primary", "flights"
}

export function BookingChannelPicker({
  value,
  onChange,
  showCall = true,
  accent = "primary",
}: Props) {
  const options: Array<{ id: BookingChannel; label: string; Icon: typeof MessageCircle; hint: string }> = [
    { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle, hint: "Instant chat" },
    { id: "email", label: "Email", Icon: Mail, hint: "Written record" },
  ];
  if (showCall) options.push({ id: "call", label: "Call", Icon: Phone, hint: "Talk now" });

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold">How should we send your request?</h3>
      <div className={`grid grid-cols-${options.length} gap-2`}>
        {options.map(({ id, label, Icon, hint }) => {
          const active = value === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition ${
                active
                  ? `border-${accent} bg-${accent}/10 ring-1 ring-${accent}`
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? `text-${accent}` : "text-muted-foreground"}`} />
              <span className="text-[12px] font-bold">{label}</span>
              <span className="text-[10px] text-muted-foreground">{hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
