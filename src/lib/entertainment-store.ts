/**
 * Local demo state for the Entertainment module.
 * MaalsoorHub never processes money — payment fields only RECORD an external
 * method (EVC Plus, Zaad, Sahal, bank transfer, cash) and its reported status.
 */
import { useCallback, useEffect, useState } from "react";

export type PayMethod = "evc" | "zaad" | "sahal" | "bank" | "cash";
export type PayStatus = "unpaid" | "reported" | "confirmed";

export const PAY_METHODS: { key: PayMethod; label: string; hint: string }[] = [
  { key: "evc", label: "EVC Plus", hint: "Hormuud mobile money" },
  { key: "zaad", label: "Zaad", hint: "Telesom mobile money" },
  { key: "sahal", label: "Sahal", hint: "Golis mobile money" },
  { key: "bank", label: "Bank transfer", hint: "Salaam / Premier bank" },
  { key: "cash", label: "Cash at venue", hint: "Pay the venue directly" },
];

export const payLabel = (m: PayMethod) => PAY_METHODS.find((p) => p.key === m)?.label ?? m;

export const payStatusLabel: Record<PayStatus, string> = {
  unpaid: "Not paid yet",
  reported: "Payment reported — awaiting venue confirmation",
  confirmed: "Confirmed by venue",
};

export type BookingStatus = "confirmed" | "cancelled";

export interface VenueBooking {
  kind: "venue";
  ref: string;
  venueId: string;
  venueName: string;
  fieldId: string;
  fieldName: string;
  date: string; // yyyy-mm-dd
  hours: number[]; // 24h start hours
  pricePerHour: number;
  total: number;
  customer: { name: string; phone: string; team?: string; notes?: string };
  payMethod: PayMethod;
  payStatus: PayStatus;
  status: BookingStatus;
  createdAt: string;
}

export interface TicketBooking {
  kind: "ticket";
  ref: string;
  eventId: string;
  eventTitle: string;
  venueName: string;
  date: string;
  sessionTime: string;
  quantity: number;
  unitPrice: number;
  total: number;
  ticketLabel: string;
  customer: { name: string; phone: string; notes?: string };
  payMethod: PayMethod;
  payStatus: PayStatus;
  status: BookingStatus;
  createdAt: string;
}

export interface TeamEntry {
  kind: "team";
  ref: string;
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  manager: string;
  phone: string;
  roster: string[];
  entryFee: number;
  payMethod: PayMethod;
  payStatus: PayStatus;
  status: BookingStatus;
  createdAt: string;
}

export type EntRecord = VenueBooking | TicketBooking | TeamEntry;

const KEY = "maalsoor.ent.records.v1";
const FAV_KEY = "maalsoor.ent.favs.v1";
const EVT = "maalsoor-ent-change";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* storage full or blocked — demo state only */
  }
}

export function loadRecords(): EntRecord[] {
  return read<EntRecord[]>(KEY, []);
}

export function makeRef(prefix: string) {
  const n = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${n}`;
}

export function saveRecord(rec: EntRecord) {
  const all = loadRecords().filter((r) => r.ref !== rec.ref);
  write(KEY, [rec, ...all]);
  return rec;
}

export function getRecord(ref: string) {
  return loadRecords().find((r) => r.ref === ref);
}

export function updateRecord(ref: string, patch: Partial<EntRecord>) {
  const all = loadRecords();
  const next = all.map((r) => (r.ref === ref ? ({ ...r, ...patch } as EntRecord) : r));
  write(KEY, next);
}

export function cancelRecord(ref: string) {
  updateRecord(ref, { status: "cancelled" } as Partial<EntRecord>);
}

/** Hours already taken for a field/date by local demo bookings. */
export function bookedHours(venueId: string, fieldId: string, date: string): number[] {
  return loadRecords()
    .filter(
      (r): r is VenueBooking =>
        r.kind === "venue" && r.status === "confirmed" && r.venueId === venueId && r.fieldId === fieldId && r.date === date,
    )
    .flatMap((r) => r.hours);
}

export function useEntRecords() {
  const [records, setRecords] = useState<EntRecord[]>([]);
  const refresh = useCallback(() => setRecords(loadRecords()), []);
  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, [refresh]);
  return { records, refresh };
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    setFavs(read<string[]>(FAV_KEY, []));
    const h = () => setFavs(read<string[]>(FAV_KEY, []));
    window.addEventListener(EVT, h);
    return () => window.removeEventListener(EVT, h);
  }, []);
  const toggle = useCallback((id: string) => {
    const cur = read<string[]>(FAV_KEY, []);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(FAV_KEY, next);
    setFavs(next);
  }, []);
  return { favs, toggle, isFav: (id: string) => favs.includes(id) };
}

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function formatHour(h: number) {
  const suffix = h >= 12 ? "PM" : "AM";
  const base = h % 12 === 0 ? 12 : h % 12;
  return `${base}:00 ${suffix}`;
}

export function formatDateLong(iso: string) {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
