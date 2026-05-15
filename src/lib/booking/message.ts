// Helpers to build the customer message and contact links per channel.
import { whatsappLink, telLink } from "@/lib/contact";

export interface BookingMessageInput {
  providerName: string;
  ref: string;
  title?: string;
  lines: Array<[label: string, value: string | number | undefined | null]>;
  total?: number;
  currency?: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  notes?: string;
}

export function buildBookingMessage(b: BookingMessageInput): string {
  const lines: string[] = [
    `Hello ${b.providerName},`,
    ``,
    `I'd like to book via MaalsoorHub:`,
  ];
  if (b.title) lines.push(`• ${b.title}`);
  for (const [k, v] of b.lines) {
    if (v === undefined || v === null || v === "") continue;
    lines.push(`• ${k}: ${v}`);
  }
  if (b.total != null) {
    lines.push(`• Estimated total: ${b.currency ?? "USD"} ${b.total.toLocaleString()}`);
  }
  lines.push(``);
  lines.push(`Customer: ${b.passengerName}`);
  lines.push(`Email: ${b.passengerEmail}`);
  lines.push(`Phone: ${b.passengerPhone}`);
  if (b.notes) lines.push(`Notes: ${b.notes}`);
  lines.push(``);
  lines.push(`Booking ref: ${b.ref}`);
  return lines.join("\n");
}

export function bookingWhatsappLink(phoneOrWa: string, message: string) {
  const digits = phoneOrWa.replace(/\D/g, "") || "252610000000";
  return whatsappLink(digits, message);
}

export function bookingMailtoLink(
  to: string | undefined,
  subject: string,
  body: string,
) {
  const safeTo = to ?? "";
  return `mailto:${safeTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function bookingTelLink(phone: string) {
  return telLink(phone);
}
