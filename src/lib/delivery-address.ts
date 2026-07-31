export interface DeliveryAddress {
  city: string;
  area: string;
  street: string;
  landmark?: string;
  phone: string;
  notes?: string;
}

const STORAGE_KEY = "delivery-address-v1";

export const EMPTY_ADDRESS: DeliveryAddress = {
  city: "",
  area: "",
  street: "",
  landmark: "",
  phone: "",
  notes: "",
};

export function loadAddress(): DeliveryAddress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeliveryAddress;
    if (!parsed?.city || !parsed?.street) return null;
    return { ...EMPTY_ADDRESS, ...parsed };
  } catch {
    return null;
  }
}

export function saveAddress(address: DeliveryAddress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
  } catch {
    /* ignore */
  }
}

export type AddressErrors = Partial<Record<keyof DeliveryAddress, string>>;

export function validateAddress(a: DeliveryAddress): AddressErrors {
  const e: AddressErrors = {};
  if (!a.city) e.city = "Select a city";
  if (!a.area) e.area = "Select an area";
  if (a.street.trim().length < 3) e.street = "Add a street or house description";
  if (!/^[+\d][\d\s().-]{6,19}$/.test(a.phone.trim())) e.phone = "Enter a valid phone number";
  return e;
}

export function isAddressComplete(a: DeliveryAddress) {
  return Object.keys(validateAddress(a)).length === 0;
}

export function formatAddress(a: DeliveryAddress) {
  return [a.street, a.landmark, a.area, a.city].filter(Boolean).join(", ");
}
