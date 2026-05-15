// Local-storage backed booking store (offline-first).
// Mirrors the cloud `bookings` table so guest users still see their history.

export type BookingChannel = "whatsapp" | "call" | "email";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type BookingService = "flight" | "listing" | "hotel";

export interface Booking {
  id: string;
  ref: string;
  createdAt: string;

  service: BookingService;
  offerId: string;
  providerName: string;
  providerPhone?: string;
  providerWhatsapp?: string;
  providerEmail?: string;

  // Free-form per-service details
  title?: string;            // e.g. "Mogadishu (MGQ) → Dubai (DXB)" or hotel/service name
  details?: Record<string, string | number | undefined>;

  // Customer
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  notes?: string;

  // Money
  unitPrice?: number;
  total?: number;
  currency?: string;

  channel: BookingChannel;
  status: BookingStatus;

  // Legacy fields (kept for old flight bookings)
  route?: string;
  departDate?: string;
  returnDate?: string;
  travelClass?: string;
  passengers?: number;
}

const KEY = "mh.bookings.v1";

function read(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as Booking[]) : [];
  } catch {
    return [];
  }
}

function write(list: Booking[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("mh:bookings:changed"));
  } catch {
    /* quota or disabled */
  }
}

export function listBookings(): Booking[] {
  return read().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getBooking(id: string): Booking | undefined {
  return read().find((b) => b.id === id);
}

export function makeBookingRef(): string {
  return `MH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function saveBooking(
  b: Omit<Booking, "id" | "ref" | "createdAt" | "status"> & {
    status?: BookingStatus;
    ref?: string;
  },
): Booking {
  const id = `bk_${Math.random().toString(36).slice(2, 10)}`;
  const full: Booking = {
    ...b,
    id,
    ref: b.ref ?? makeBookingRef(),
    createdAt: new Date().toISOString(),
    status: b.status ?? "pending",
  };
  const list = read();
  list.push(full);
  write(list);
  return full;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const list = read().map((b) => (b.id === id ? { ...b, status } : b));
  write(list);
}

export function removeBooking(id: string) {
  write(read().filter((b) => b.id !== id));
}
