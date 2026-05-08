export const WA_DEFAULT_MSG =
  "Hello, I found your listing on MaalsoorHub and I'm interested in your service.";

export function whatsappLink(phoneE164NoPlus: string, message = WA_DEFAULT_MSG) {
  return `https://wa.me/${phoneE164NoPlus}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function formatPrice(value: number, unit?: "month") {
  const s = `$${value.toLocaleString()}`;
  return unit === "month" ? `${s}/mo` : s;
}
