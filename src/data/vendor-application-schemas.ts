import type { CategoryKey } from "./categories";

export type FieldSpec =
  | { key: string; label: string; type: "text" | "tel" | "number" | "textarea"; placeholder?: string; required?: boolean; hint?: string }
  | { key: string; label: string; type: "select"; options: string[]; required?: boolean; hint?: string }
  | { key: string; label: string; type: "multiselect-chip"; options: string[]; required?: boolean; hint?: string }
  | { key: string; label: string; type: "toggle"; hint?: string };

export type CategoryAnswers = Record<string, string | string[] | boolean | undefined>;

/** Fields shown on the Contact step (step 3) in addition to phone/whatsapp/location. */
export const CONTACT_FIELDS: Partial<Record<CategoryKey, FieldSpec[]>> = {
  "real-estate": [
    { key: "license_no", label: "License / registration #", type: "text", placeholder: "e.g. RE-2024-1234" },
    { key: "agency_name", label: "Agency name (if different from business)", type: "text" },
    {
      key: "areas_served",
      label: "Areas served",
      type: "multiselect-chip",
      options: ["Mogadishu", "Hargeisa", "Garowe", "Bosaso", "Kismayo", "Berbera", "Burao", "Other"],
      required: true,
    },
    {
      key: "property_types",
      label: "Property types handled",
      type: "multiselect-chip",
      options: ["Houses", "Apartments", "Land", "Commercial", "Short-let"],
      required: true,
    },
  ],
  services: [
    {
      key: "service_type",
      label: "Service type",
      type: "select",
      options: ["Plumbing", "Electrical", "Cleaning", "Repairs", "Construction", "Moving", "Other"],
      required: true,
    },
    { key: "service_area", label: "Service area (city / neighborhood)", type: "text", required: true },
    { key: "callout_fee", label: "Call-out fee (optional)", type: "text", placeholder: "e.g. $10" },
    { key: "available_hours", label: "Available hours", type: "text", placeholder: "Mon–Sat, 8am–8pm" },
  ],
  travel: [
    {
      key: "travel_subtypes",
      label: "Services offered",
      type: "multiselect-chip",
      options: ["Agency", "Flights", "Visa", "Tours", "Car rental", "Cargo", "Hajj & Umrah"],
      required: true,
    },
    { key: "iata_license", label: "IATA / license # (optional)", type: "text" },
    { key: "countries_covered", label: "Countries covered", type: "text", placeholder: "Somalia, Kenya, UAE, Turkey…" },
  ],
  hotels: [
    { key: "hotel_name", label: "Hotel name (if different)", type: "text" },
    { key: "star_rating", label: "Star rating", type: "select", options: ["1", "2", "3", "4", "5", "Unrated"] },
    { key: "rooms_count", label: "Number of rooms", type: "number", placeholder: "e.g. 24" },
    { key: "checkin_time", label: "Check-in time", type: "text", placeholder: "14:00" },
    { key: "checkout_time", label: "Check-out time", type: "text", placeholder: "12:00" },
    {
      key: "amenities",
      label: "Amenities",
      type: "multiselect-chip",
      options: ["WiFi", "Parking", "Restaurant", "AC", "Pool", "Gym", "Airport shuttle", "Laundry"],
    },
  ],
  health: [
    {
      key: "facility_type",
      label: "Facility type",
      type: "select",
      options: ["Hospital", "Clinic", "Pharmacy", "Doctor", "Diagnostic center"],
      required: true,
    },
    {
      key: "specialties",
      label: "Specialties",
      type: "multiselect-chip",
      options: ["General", "Cardiology", "Pediatrics", "Maternity", "Surgery", "Dental", "Eye", "Orthopedics", "Radiology", "Lab"],
    },
    { key: "is_24_7", label: "Open 24/7", type: "toggle" },
    { key: "license_no", label: "License #", type: "text" },
  ],
  food: [
    { key: "cuisine", label: "Cuisine type", type: "text", placeholder: "Somali, Turkish, Italian…" },
    { key: "delivery", label: "Delivery available", type: "toggle" },
    { key: "opening_hours", label: "Opening hours", type: "text", placeholder: "10am–11pm" },
  ],
  vehicles: [
    { key: "dealer_type", label: "Dealer type", type: "select", options: ["New", "Used", "Both", "Parts only"], required: true },
    { key: "brands", label: "Brands handled", type: "text", placeholder: "Toyota, Nissan, Hyundai…" },
    { key: "showroom_address", label: "Showroom address", type: "text" },
  ],
  livestock: [
    {
      key: "animal_types",
      label: "Animal types",
      type: "multiselect-chip",
      options: ["Camels", "Goats", "Cattle", "Sheep", "Poultry"],
      required: true,
    },
    { key: "market_location", label: "Market location", type: "text" },
  ],
  jobs: [
    { key: "industry", label: "Industry", type: "text", placeholder: "Logistics, Tech, NGO…" },
    { key: "company_size", label: "Company size", type: "select", options: ["1–10", "11–50", "51–200", "200+"] },
  ],
  banking: [
    {
      key: "institution_type",
      label: "Institution type",
      type: "select",
      options: ["Bank", "Mobile money", "Forex", "Microfinance"],
      required: true,
    },
    { key: "license_no", label: "License #", type: "text", required: true },
  ],
};

/** Extra qualitative field(s) shown on the About step (step 4). */
export const ABOUT_FIELDS: Partial<Record<CategoryKey, FieldSpec[]>> = {
  "real-estate": [
    { key: "years_experience", label: "Years of experience", type: "number", placeholder: "e.g. 5" },
  ],
  services: [
    { key: "years_experience", label: "Years of experience", type: "number" },
  ],
  health: [
    { key: "departments_note", label: "Notable departments / equipment", type: "textarea", placeholder: "ICU, MRI, ambulance…" },
  ],
};

export function getContactFields(key: string): FieldSpec[] {
  return CONTACT_FIELDS[key as CategoryKey] ?? [];
}
export function getAboutFields(key: string): FieldSpec[] {
  return ABOUT_FIELDS[key as CategoryKey] ?? [];
}

export function validateFields(fields: FieldSpec[], answers: CategoryAnswers): string | null {
  for (const f of fields) {
    if (!("required" in f) || !f.required) continue;
    const v = answers[f.key];
    if (f.type === "multiselect-chip") {
      if (!Array.isArray(v) || v.length === 0) return `Select at least one ${f.label.toLowerCase()}`;
    } else if (f.type === "toggle") {
      // toggles are never strictly required
    } else {
      if (!v || (typeof v === "string" && v.trim().length === 0)) return `${f.label} is required`;
    }
  }
  return null;
}

export function serializeAnswers(fields: FieldSpec[], answers: CategoryAnswers): string[] {
  const out: string[] = [];
  for (const f of fields) {
    const v = answers[f.key];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) continue;
    if (f.type === "toggle") {
      out.push(`${f.label}: ${v ? "Yes" : "No"}`);
    } else if (Array.isArray(v)) {
      out.push(`${f.label}: ${v.join(", ")}`);
    } else {
      out.push(`${f.label}: ${v}`);
    }
  }
  return out;
}
