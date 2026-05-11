// Local-storage backed booking store. No backend / no in-app payments,
// matching the existing "contact provider directly" pattern of the app.

export type BookingChannel = "whatsapp" | "call";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;                // local booking id
  ref: string;               // human-readable ref (e.g. MH-AB12CD)
  createdAt: string;         // ISO

  // Service identification
  service: "flight";         // (room to add hotel/tour later)
  offerId: string;
  providerName: string;
  providerPhone?: string;

  // Trip
  route: string;             // "Mogadishu (MGQ) → Dubai (DXB)"
  departDate?: string;
  returnDate?: string;
  travelClass: string;
  passengers: number;

  // Passenger
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  notes?: string;

  // Money
  unitPrice: number;
  total: number;
  currency: string;          // "USD"

  channel: BookingChannel;
  status: BookingStatus;
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

export function saveBooking(b: Omit<Booking, "id" | "ref" | "createdAt" | "status"> & { status?: BookingStatus }): Booking {
  const id = `bk_${Math.random().toString(36).slice(2, 10)}`;
  const ref = `MH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const full: Booking = {
    ...b,
    id,
    ref,
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
