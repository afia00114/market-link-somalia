// Somali mobile money helpers (EVC Plus, eDahab, Zaad).

export type MobileMoneyMethod = "evc" | "edahab" | "zaad";

export interface MobileMoneyMeta {
  key: MobileMoneyMethod;
  label: string;
  operator: string;
  /** Builds the USSD string the customer dials to send money. */
  ussd: (number: string, amount?: number | string) => string;
  hint: string;
}

const digits = (v: string) => v.replace(/\D/g, "");

export const MOBILE_MONEY: Record<MobileMoneyMethod, MobileMoneyMeta> = {
  evc: {
    key: "evc",
    label: "EVC Plus",
    operator: "Hormuud",
    ussd: (n, a) => `*712*${digits(n)}*${a ?? ""}#`,
    hint: "Dial the code below, confirm with your EVC PIN, then paste the SMS reference.",
  },
  edahab: {
    key: "edahab",
    label: "eDahab",
    operator: "Somtel",
    ussd: (n, a) => `*110*${digits(n)}*${a ?? ""}#`,
    hint: "Dial the code below or use the eDahab app, then paste the SMS reference.",
  },
  zaad: {
    key: "zaad",
    label: "Zaad",
    operator: "Telesom",
    ussd: (n, a) => `*220*${digits(n)}*${a ?? ""}#`,
    hint: "Dial the code below, confirm with your Zaad PIN, then paste the SMS reference.",
  },
};

export const MOBILE_MONEY_ORDER: MobileMoneyMethod[] = ["evc", "edahab", "zaad"];

export function methodLabel(method: string): string {
  return MOBILE_MONEY[method as MobileMoneyMethod]?.label ?? method.toUpperCase();
}

/** tel: link that pre-fills the USSD dialer (# must be encoded). */
export function ussdDialLink(ussd: string): string {
  return `tel:${ussd.replace(/#/g, "%23")}`;
}
