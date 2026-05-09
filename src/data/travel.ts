import {
  Plane, Building2, FileCheck, Star, Map, Car,
  type LucideIcon,
} from "lucide-react";

export interface Country { code: string; name: string; flag: string; dial: string }

export const COUNTRIES: Country[] = [
  { code: "SO", name: "Somalia", flag: "🇸🇴", dial: "252" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", dial: "254" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", dial: "251" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", dial: "253" },
  { code: "UG", name: "Uganda", flag: "🇺🇬", dial: "256" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", dial: "255" },
  { code: "AE", name: "UAE", flag: "🇦🇪", dial: "971" },
  { code: "TR", name: "Türkiye", flag: "🇹🇷", dial: "90" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dial: "966" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", dial: "20" },
];

export type TravelSubKey =
  | "flights" | "agencies" | "visa" | "hajj-umrah" | "tours" | "car-rental";

export interface TravelSub {
  key: TravelSubKey;
  label: string;
  emoji: string;
  short: string;
  icon: LucideIcon;
  href: string;
  description: string;
  offers: string[];
  highlights: { label: string; value: string }[];
}

export const TRAVEL_SUBS: TravelSub[] = [
  {
    key: "flights", label: "Airline Tickets", emoji: "✈️", short: "Find & book flights", icon: Plane, href: "/travel/flights",
    description: "Compare verified airlines and travel agencies for one-way and round trips across East Africa, the Gulf, and beyond.",
    offers: [
      "Domestic & international flights",
      "One-way and round-trip search",
      "Filter by price, duration & airline",
      "Direct or via stopover options",
      "Baggage & refund policy details",
      "Confirm via WhatsApp or call",
    ],
    highlights: [
      { label: "Providers", value: "20+ agencies" },
      { label: "Routes", value: "Local + Intl." },
      { label: "Booking", value: "WhatsApp / Call" },
    ],
  },
  {
    key: "agencies", label: "Travel Agencies", emoji: "🏢", short: "Browse all agencies", icon: Building2, href: "/travel/agencies",
    description: "Browse all verified travel agencies, view their services, ratings, and contact them directly.",
    offers: [
      "Verified agency profiles",
      "Ratings & customer reviews",
      "Available services per agency",
      "Office location & hours",
      "Linked flights, tours & visas",
      "Direct WhatsApp & call",
    ],
    highlights: [
      { label: "Agencies", value: "30+ listed" },
      { label: "Verification", value: "Manual check" },
      { label: "Coverage", value: "All major cities" },
    ],
  },
  {
    key: "visa", label: "Visa Services", emoji: "🛂", short: "Tourist & business visas", icon: FileCheck, href: "/travel/visa",
    description: "Apply for tourist, business, study and work visas with the help of trusted agents.",
    offers: [
      "Tourist & business visas",
      "Document checklist per country",
      "Processing time & fees",
      "Application status tracking",
      "Upload-ready document slots",
      "Agent assistance via WhatsApp",
    ],
    highlights: [
      { label: "Countries", value: "40+ supported" },
      { label: "Types", value: "Tourist / Biz / Study" },
      { label: "Processing", value: "3–15 days" },
    ],
  },
  {
    key: "hajj-umrah", label: "Hajj & Umrah", emoji: "🕋", short: "Pilgrimage packages", icon: Star, href: "/travel/hajj-umrah",
    description: "Verified Hajj and Umrah packages with hotel tiers, daily schedule, and flexible payment plans.",
    offers: [
      "Economy, standard & VIP tiers",
      "Hotel distance to Haram",
      "Daily schedule & rituals",
      "Visa, transport & meals included",
      "Payment plan options",
      "Group leader contact",
    ],
    highlights: [
      { label: "Tiers", value: "Economy → VIP" },
      { label: "Duration", value: "10–25 days" },
      { label: "Includes", value: "Visa + Hotel" },
    ],
  },
  {
    key: "tours", label: "Tour Packages", emoji: "🗺️", short: "Safari, beach, culture", icon: Map, href: "/travel/tours",
    description: "Curated tour packages covering safari, beach, cultural and city experiences across the region.",
    offers: [
      "Safari, beach & cultural tours",
      "Day-by-day itineraries",
      "Group & private options",
      "Inclusions & exclusions list",
      "Transport & guide arrangement",
      "Reserve via WhatsApp",
    ],
    highlights: [
      { label: "Categories", value: "Safari / Beach / Culture" },
      { label: "Length", value: "1–14 days" },
      { label: "Group size", value: "Private or shared" },
    ],
  },
  {
    key: "car-rental", label: "Car Rental", emoji: "🚗", short: "Rent any vehicle", icon: Car, href: "/travel/car-rental",
    description: "Rent sedans, SUVs, vans and 4x4s with or without driver, with clear insurance and fuel policies.",
    offers: [
      "Sedans, SUVs, vans & 4x4",
      "With or without driver",
      "Daily, weekly & monthly rates",
      "Insurance & mileage details",
      "Fuel policy & deposit info",
      "Pickup & delivery options",
    ],
    highlights: [
      { label: "Fleet", value: "100+ vehicles" },
      { label: "Rate", value: "From $25 / day" },
      { label: "Driver", value: "Optional" },
    ],
  },
];

export interface Provider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  city: string;
  countryCode: string;
  whatsapp: string; // E.164 no +
  phone: string;
  email?: string;
  verified: boolean;
}

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;

// AIRPORTS — by country
export interface Airport { code: string; city: string; country: string; international?: boolean }
export const AIRPORTS: Record<string, Airport[]> = {
  SO: [
    { code: "MGQ", city: "Mogadishu", country: "SO" },
    { code: "HGA", city: "Hargeisa", country: "SO" },
    { code: "BSA", city: "Bosaso", country: "SO" },
    { code: "GLK", city: "Galkayo", country: "SO" },
  ],
  KE: [{ code: "NBO", city: "Nairobi", country: "KE" }, { code: "MBA", city: "Mombasa", country: "KE" }],
  ET: [{ code: "ADD", city: "Addis Ababa", country: "ET" }],
  DJ: [{ code: "JIB", city: "Djibouti", country: "DJ" }],
  UG: [{ code: "EBB", city: "Entebbe", country: "UG" }],
  TZ: [{ code: "DAR", city: "Dar es Salaam", country: "TZ" }, { code: "ZNZ", city: "Zanzibar", country: "TZ" }],
  AE: [{ code: "DXB", city: "Dubai", country: "AE", international: true }, { code: "AUH", city: "Abu Dhabi", country: "AE", international: true }],
  TR: [{ code: "IST", city: "Istanbul", country: "TR", international: true }],
  SA: [{ code: "JED", city: "Jeddah", country: "SA", international: true }, { code: "RUH", city: "Riyadh", country: "SA", international: true }],
  EG: [{ code: "CAI", city: "Cairo", country: "EG", international: true }],
};

export const INTL_DESTINATIONS: Airport[] = [
  { code: "NBO", city: "Nairobi", country: "KE" },
  { code: "ADD", city: "Addis Ababa", country: "ET" },
  { code: "DXB", city: "Dubai", country: "AE", international: true },
  { code: "AUH", city: "Abu Dhabi", country: "AE", international: true },
  { code: "IST", city: "Istanbul", country: "TR", international: true },
  { code: "JED", city: "Jeddah", country: "SA", international: true },
  { code: "RUH", city: "Riyadh", country: "SA", international: true },
  { code: "CAI", city: "Cairo", country: "EG", international: true },
  { code: "JIB", city: "Djibouti", country: "DJ" },
  { code: "EBB", city: "Entebbe", country: "UG" },
];

// FLIGHTS — agency offerings per route
export interface FlightOffer extends Provider {
  from: string; to: string; price: number; durationHrs: number; direct: boolean;
  departTime?: string; arriveTime?: string; via?: string; yearsInBusiness?: number;
}
export const FLIGHT_OFFERS: FlightOffer[] = [
  { id: "fl1", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, from: "MGQ", to: "NBO", price: 180, durationHrs: 2.5, direct: true, departTime: "08:00", arriveTime: "10:30", yearsInBusiness: 14 },
  { id: "fl2", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", verified: true, from: "MGQ", to: "NBO", price: 195, durationHrs: 3.2, direct: false, departTime: "06:45", arriveTime: "09:55", via: "ADD", yearsInBusiness: 9 },
  { id: "fl3", name: "Banadir Flights", logo: u("1569154941061-e231b4725ef1"), rating: 4.8, reviews: 540, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340102", phone: "+252 61 234 0102", verified: true, from: "MGQ", to: "NBO", price: 210, durationHrs: 2.5, direct: true, departTime: "14:30", arriveTime: "17:00", yearsInBusiness: 18 },
  { id: "fl3b", name: "Horizon Travel", logo: u("1542296332-2e4473faf563"), rating: 4.9, reviews: 412, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556677", phone: "+252 63 455 6677", verified: true, from: "HGA", to: "NBO", price: 230, durationHrs: 3.5, direct: false, departTime: "07:15", arriveTime: "10:45", via: "ADD", yearsInBusiness: 12 },
  { id: "fl4", name: "EastAfrica Tickets", logo: u("1542296332-2e4473faf563"), rating: 4.4, reviews: 145, city: "Nairobi", countryCode: "KE", whatsapp: "254712340103", phone: "+254 712 340 103", verified: true, from: "MGQ", to: "DXB", price: 320, durationHrs: 5.0, direct: true, departTime: "23:55", arriveTime: "04:55", yearsInBusiness: 7 },
  { id: "fl5", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, from: "MGQ", to: "DXB", price: 350, durationHrs: 4.5, direct: true, departTime: "10:20", arriveTime: "14:50", yearsInBusiness: 14 },
  { id: "fl6", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", verified: true, from: "MGQ", to: "IST", price: 480, durationHrs: 7.0, direct: false, departTime: "02:15", arriveTime: "09:15", via: "DXB", yearsInBusiness: 9 },
  { id: "fl6b", name: "Banadir Flights", logo: u("1569154941061-e231b4725ef1"), rating: 4.8, reviews: 540, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340102", phone: "+252 61 234 0102", verified: true, from: "MGQ", to: "JED", price: 420, durationHrs: 4.0, direct: true, departTime: "23:30", arriveTime: "03:30", yearsInBusiness: 18 },
  { id: "fl7", name: "Sky Wings", logo: u("1530521954074-e64f6810b32d"), rating: 4.6, reviews: 88, city: "Nairobi", countryCode: "KE", whatsapp: "254712340104", phone: "+254 712 340 104", verified: true, from: "NBO", to: "DXB", price: 290, durationHrs: 4.8, direct: true, departTime: "16:00", arriveTime: "20:48", yearsInBusiness: 6 },
];

// AGENCIES (general directory)
export interface Agency extends Provider { services: string[]; description: string; hours: string }
export const AGENCIES: Agency[] = [
  { id: "ag1", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", email: "info@salaamtravel.so", verified: true, services: ["Flights", "Visa", "Hotels", "Hajj"], description: "Full-service travel agency since 2010.", hours: "Sat–Thu, 8am–8pm" },
  { id: "ag2", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", email: "hello@hornav.so", verified: true, services: ["Flights", "Tours"], description: "Specialist in East Africa routes.", hours: "Daily, 9am–7pm" },
  { id: "ag3", name: "Barakah Tours", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", email: "barakah@example.com", verified: true, services: ["Hajj", "Umrah", "Visa"], description: "Trusted pilgrimage operator.", hours: "Daily, 8am–9pm" },
  { id: "ag4", name: "Jambo Travel", logo: u("1469854523086-cc02fe5d8800"), rating: 4.6, reviews: 412, city: "Nairobi", countryCode: "KE", whatsapp: "254712340105", phone: "+254 712 340 105", email: "jambo@travel.ke", verified: true, services: ["Flights", "Hotels", "Safari"], description: "Kenya's safari & flight specialists.", hours: "Mon–Sat, 8am–6pm" },
  { id: "ag5", name: "Hargeisa Wings", logo: u("1530521954074-e64f6810b32d"), rating: 4.4, reviews: 156, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556677", phone: "+252 63 455 6677", email: "info@hargeisawings.so", verified: true, services: ["Flights", "Visa", "Car Rental"], description: "Northern Somalia's go-to agency.", hours: "Sat–Thu, 8am–7pm" },
  { id: "ag6", name: "Bosaso Travels", logo: u("1542296332-2e4473faf563"), rating: 4.3, reviews: 92, city: "Bosaso", countryCode: "SO", whatsapp: "252908112233", phone: "+252 90 811 2233", email: "hello@bosasotravels.so", verified: false, services: ["Flights", "Tours"], description: "Local agency serving Puntland routes.", hours: "Daily, 9am–6pm" },
  { id: "ag7", name: "Addis Sky Travel", logo: u("1547471080-7cc2caa01a7e"), rating: 4.7, reviews: 285, city: "Addis Ababa", countryCode: "ET", whatsapp: "251911445566", phone: "+251 911 445 566", email: "book@addissky.et", verified: true, services: ["Flights", "Hotels", "Tours", "Visa"], description: "ET corridor specialist with 15+ years.", hours: "Mon–Sat, 8am–8pm" },
  { id: "ag8", name: "Djibouti Connect", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 134, city: "Djibouti", countryCode: "DJ", whatsapp: "253771122334", phone: "+253 77 112 2334", email: "contact@djconnect.dj", verified: true, services: ["Flights", "Visa", "Hotels"], description: "Gulf & Horn of Africa connections.", hours: "Daily, 8am–8pm" },
  { id: "ag9", name: "Dubai Falcon Tours", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.8, reviews: 720, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", email: "info@dubaifalcon.ae", verified: true, services: ["Hotels", "Tours", "Visa", "Car Rental"], description: "UAE inbound tours for East African travelers.", hours: "Daily, 24/7" },
  { id: "ag10", name: "Istanbul Gate Travel", logo: u("1519817914152-22d216bb9170"), rating: 4.6, reviews: 410, city: "Istanbul", countryCode: "TR", whatsapp: "905321234567", phone: "+90 532 123 4567", email: "hello@istanbulgate.tr", verified: true, services: ["Hotels", "Tours", "Visa"], description: "Türkiye packages with Somali-speaking guides.", hours: "Daily, 9am–9pm" },
];


// VISA
export interface VisaService extends Provider {
  destination: string; visaType: "Tourist" | "Business" | "Transit"; processingDays: string; fee: number; successRate: number; requirements: string[];
}
export const VISA_SERVICES: VisaService[] = [
  { id: "vs1", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, destination: "TR", visaType: "Tourist", processingDays: "5–7 days", fee: 120, successRate: 96, requirements: ["Passport (6+ mo)", "Photo", "Hotel booking"] },
  { id: "vs2", name: "Visa Express SO", logo: u("1569124589354-615739ae007b"), rating: 4.6, reviews: 188, city: "Mogadishu", countryCode: "SO", whatsapp: "252612360001", phone: "+252 61 236 0001", verified: true, destination: "AE", visaType: "Tourist", processingDays: "3–5 days", fee: 95, successRate: 98, requirements: ["Passport", "Photo", "Flight ticket"] },
  { id: "vs3", name: "Barakah Tours", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, destination: "SA", visaType: "Tourist", processingDays: "7–10 days", fee: 180, successRate: 94, requirements: ["Passport", "Vaccination", "Photo"] },
  { id: "vs4", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", verified: true, destination: "TR", visaType: "Business", processingDays: "URGENT 48h", fee: 220, successRate: 92, requirements: ["Passport", "Invitation letter"] },
  { id: "vs5", name: "Visa Express SO", logo: u("1569124589354-615739ae007b"), rating: 4.6, reviews: 188, city: "Mogadishu", countryCode: "SO", whatsapp: "252612360001", phone: "+252 61 236 0001", verified: true, destination: "EG", visaType: "Tourist", processingDays: "5–7 days", fee: 110, successRate: 95, requirements: ["Passport", "Photo", "Hotel booking"] },
  { id: "vs6", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, destination: "AE", visaType: "Business", processingDays: "URGENT 24h", fee: 180, successRate: 97, requirements: ["Passport", "Trade license", "Invitation"] },
  { id: "vs7", name: "Hargeisa Wings", logo: u("1530521954074-e64f6810b32d"), rating: 4.4, reviews: 156, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556677", phone: "+252 63 455 6677", verified: true, destination: "ET", visaType: "Tourist", processingDays: "On arrival", fee: 50, successRate: 99, requirements: ["Passport", "Photo"] },
  { id: "vs8", name: "Addis Sky Travel", logo: u("1547471080-7cc2caa01a7e"), rating: 4.7, reviews: 285, city: "Addis Ababa", countryCode: "ET", whatsapp: "251911445566", phone: "+251 911 445 566", verified: true, destination: "TR", visaType: "Tourist", processingDays: "7–10 days", fee: 130, successRate: 94, requirements: ["Passport", "Photo", "Bank statement", "Hotel booking"] },
  { id: "vs9", name: "Dubai Falcon Tours", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.8, reviews: 720, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", verified: true, destination: "AE", visaType: "Transit", processingDays: "24–48h", fee: 60, successRate: 99, requirements: ["Passport", "Onward ticket"] },
  { id: "vs10", name: "Barakah Tours", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, destination: "SA", visaType: "Business", processingDays: "10–14 days", fee: 240, successRate: 90, requirements: ["Passport", "Invitation", "Trade license"] },
  { id: "vs11", name: "Djibouti Connect", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 134, city: "Djibouti", countryCode: "DJ", whatsapp: "253771122334", phone: "+253 77 112 2334", verified: true, destination: "DJ", visaType: "Tourist", processingDays: "On arrival", fee: 90, successRate: 100, requirements: ["Passport", "Photo"] },
];

// HAJJ / UMRAH
export type PilgrimType = "Hajj" | "Umrah";
export type PilgrimTier = "Economy" | "Standard" | "VIP";
export interface PilgrimPackage extends Provider {
  type: PilgrimType; tier: PilgrimTier; price: number; durationDays: number; groupSize: number; inclusions: string[];
}
export const PILGRIM_PACKAGES: PilgrimPackage[] = [
  { id: "pp1", name: "Barakah Tours", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, type: "Umrah", tier: "Economy", price: 1450, durationDays: 10, groupSize: 30, inclusions: ["Flights", "Hotel 3★", "Transport", "Meals"] },
  { id: "pp2", name: "Barakah Tours", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, type: "Umrah", tier: "Standard", price: 1950, durationDays: 14, groupSize: 25, inclusions: ["Flights", "Hotel 4★", "Transport", "Meals", "Guide"] },
  { id: "pp3", name: "Barakah Tours", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, type: "Umrah", tier: "VIP", price: 3200, durationDays: 14, groupSize: 15, inclusions: ["Flights", "Hotel 5★ near Haram", "Private transport", "All meals", "Guide"] },
  { id: "pp4", name: "Madina Travel", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.7, reviews: 88, city: "Mogadishu", countryCode: "SO", whatsapp: "252612370001", phone: "+252 61 237 0001", verified: true, type: "Hajj", tier: "Standard", price: 6500, durationDays: 30, groupSize: 40, inclusions: ["Flights", "Hotel", "Transport", "Meals", "Guide"] },
  { id: "pp5", name: "Madina Travel", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.7, reviews: 88, city: "Mogadishu", countryCode: "SO", whatsapp: "252612370001", phone: "+252 61 237 0001", verified: true, type: "Hajj", tier: "VIP", price: 12500, durationDays: 30, groupSize: 20, inclusions: ["Flights", "5★ Hotel", "Private transport", "All meals", "Personal guide"] },
  { id: "pp6", name: "Al-Haramayn Travel", logo: u("1542296332-2e4473faf563"), rating: 4.8, reviews: 220, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556680", phone: "+252 63 455 6680", verified: true, type: "Umrah", tier: "Standard", price: 1850, durationDays: 12, groupSize: 28, inclusions: ["Flights", "Hotel 4★", "Transport", "Meals", "Scholar guide"] },
  { id: "pp7", name: "Al-Haramayn Travel", logo: u("1542296332-2e4473faf563"), rating: 4.8, reviews: 220, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556680", phone: "+252 63 455 6680", verified: true, type: "Hajj", tier: "Standard", price: 6800, durationDays: 28, groupSize: 35, inclusions: ["Flights", "Hotel 4★", "Transport", "All meals", "Scholar"] },
  { id: "pp8", name: "Saafi Pilgrim", logo: u("1611892440504-42a792e24d32"), rating: 4.6, reviews: 165, city: "Mogadishu", countryCode: "SO", whatsapp: "252612370002", phone: "+252 61 237 0002", verified: true, type: "Umrah", tier: "Economy", price: 1350, durationDays: 9, groupSize: 35, inclusions: ["Flights", "Hotel 3★", "Transport", "Breakfast"] },
  { id: "pp9", name: "Saafi Pilgrim", logo: u("1611892440504-42a792e24d32"), rating: 4.6, reviews: 165, city: "Mogadishu", countryCode: "SO", whatsapp: "252612370002", phone: "+252 61 237 0002", verified: true, type: "Umrah", tier: "VIP", price: 3500, durationDays: 14, groupSize: 12, inclusions: ["Flights", "Hotel 5★ Haram view", "Private transport", "All meals", "Guide", "Ziyarat tour"] },
  { id: "pp10", name: "Noor Hajj Services", logo: u("1582719478250-c89cae4dc85b"), rating: 4.9, reviews: 310, city: "Nairobi", countryCode: "KE", whatsapp: "254712370003", phone: "+254 712 370 003", verified: true, type: "Hajj", tier: "Economy", price: 5800, durationDays: 32, groupSize: 50, inclusions: ["Flights", "Hotel 3★", "Transport", "Meals"] },
  { id: "pp11", name: "Noor Hajj Services", logo: u("1582719478250-c89cae4dc85b"), rating: 4.9, reviews: 310, city: "Nairobi", countryCode: "KE", whatsapp: "254712370003", phone: "+254 712 370 003", verified: true, type: "Umrah", tier: "VIP", price: 3100, durationDays: 14, groupSize: 15, inclusions: ["Flights", "Hotel 5★", "Private car", "All meals", "Guide"] },
];

// TOURS
export type TourType = "Safari" | "Beach" | "Cultural" | "Adventure" | "City";
export interface TourPackage extends Provider {
  destinationCountry: string; tourType: TourType; days: number; pricePerPerson: number; private: boolean; itinerary: string[]; inclusions: string[];
}
export const TOUR_PACKAGES: TourPackage[] = [
  { id: "tp1", name: "Jambo Travel", logo: u("1469854523086-cc02fe5d8800"), rating: 4.8, reviews: 412, city: "Nairobi", countryCode: "KE", whatsapp: "254712340105", phone: "+254 712 340 105", verified: true, destinationCountry: "KE", tourType: "Safari", days: 5, pricePerPerson: 850, private: false, itinerary: ["Maasai Mara", "Lake Nakuru", "Amboseli"], inclusions: ["Lodge", "Meals", "4x4 Transport", "Guide"] },
  { id: "tp2", name: "Jambo Travel", logo: u("1469854523086-cc02fe5d8800"), rating: 4.8, reviews: 412, city: "Nairobi", countryCode: "KE", whatsapp: "254712340105", phone: "+254 712 340 105", verified: true, destinationCountry: "KE", tourType: "Safari", days: 7, pricePerPerson: 1450, private: true, itinerary: ["Maasai Mara", "Samburu", "Tsavo"], inclusions: ["Luxury camp", "All meals", "Private 4x4", "Guide"] },
  { id: "tp3", name: "Zanzibar Voyages", logo: u("1503917988258-f87a78e3c995"), rating: 4.7, reviews: 320, city: "Zanzibar", countryCode: "TZ", whatsapp: "255712380001", phone: "+255 712 380 001", verified: true, destinationCountry: "TZ", tourType: "Beach", days: 5, pricePerPerson: 720, private: false, itinerary: ["Stone Town", "Nungwi Beach", "Spice Tour"], inclusions: ["Resort", "Breakfast", "Transfers"] },
  { id: "tp4", name: "Addis Discover", logo: u("1547471080-7cc2caa01a7e"), rating: 4.5, reviews: 96, city: "Addis Ababa", countryCode: "ET", whatsapp: "251911380002", phone: "+251 911 380 002", verified: true, destinationCountry: "ET", tourType: "Cultural", days: 3, pricePerPerson: 480, private: true, itinerary: ["Lalibela", "Axum"], inclusions: ["Hotel", "Meals", "Guide", "Domestic flight"] },
  { id: "tp5", name: "Dubai Falcon Tours", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.8, reviews: 720, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", verified: true, destinationCountry: "AE", tourType: "City", days: 4, pricePerPerson: 650, private: false, itinerary: ["Burj Khalifa", "Desert Safari", "Dubai Mall", "Marina Cruise"], inclusions: ["4★ Hotel", "Breakfast", "City tours", "Transfers"] },
  { id: "tp6", name: "Dubai Falcon Tours", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.8, reviews: 720, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", verified: true, destinationCountry: "AE", tourType: "Adventure", days: 6, pricePerPerson: 1250, private: true, itinerary: ["Desert Safari", "Hatta Mountains", "Abu Dhabi", "Dubai Marina"], inclusions: ["5★ Hotel", "All meals", "Private guide", "All activities"] },
  { id: "tp7", name: "Istanbul Gate Travel", logo: u("1519817914152-22d216bb9170"), rating: 4.6, reviews: 410, city: "Istanbul", countryCode: "TR", whatsapp: "905321234567", phone: "+90 532 123 4567", verified: true, destinationCountry: "TR", tourType: "Cultural", days: 5, pricePerPerson: 780, private: false, itinerary: ["Hagia Sophia", "Blue Mosque", "Bosphorus Cruise", "Grand Bazaar"], inclusions: ["4★ Hotel", "Breakfast", "Tours", "Transfers", "Somali-speaking guide"] },
  { id: "tp8", name: "Istanbul Gate Travel", logo: u("1519817914152-22d216bb9170"), rating: 4.6, reviews: 410, city: "Istanbul", countryCode: "TR", whatsapp: "905321234567", phone: "+90 532 123 4567", verified: true, destinationCountry: "TR", tourType: "City", days: 7, pricePerPerson: 1180, private: true, itinerary: ["Istanbul", "Cappadocia", "Antalya"], inclusions: ["4★ Hotels", "Breakfast", "Domestic flights", "Tours"] },
  { id: "tp9", name: "Cairo Pharaoh Tours", logo: u("1582719478250-c89cae4dc85b"), rating: 4.7, reviews: 280, city: "Cairo", countryCode: "EG", whatsapp: "201001234567", phone: "+20 100 123 4567", verified: true, destinationCountry: "EG", tourType: "Cultural", days: 6, pricePerPerson: 920, private: false, itinerary: ["Pyramids of Giza", "Egyptian Museum", "Luxor", "Nile Cruise"], inclusions: ["4★ Hotel", "All meals", "Domestic flight", "Guide"] },
  { id: "tp10", name: "Zanzibar Voyages", logo: u("1503917988258-f87a78e3c995"), rating: 4.7, reviews: 320, city: "Zanzibar", countryCode: "TZ", whatsapp: "255712380001", phone: "+255 712 380 001", verified: true, destinationCountry: "TZ", tourType: "Adventure", days: 8, pricePerPerson: 1380, private: true, itinerary: ["Serengeti", "Ngorongoro", "Zanzibar Beach"], inclusions: ["Lodges", "All meals", "4x4", "Domestic flight", "Guide"] },
  { id: "tp11", name: "Jambo Travel", logo: u("1469854523086-cc02fe5d8800"), rating: 4.8, reviews: 412, city: "Nairobi", countryCode: "KE", whatsapp: "254712340105", phone: "+254 712 340 105", verified: true, destinationCountry: "KE", tourType: "Beach", days: 4, pricePerPerson: 580, private: false, itinerary: ["Mombasa", "Diani Beach", "Watamu"], inclusions: ["Beach resort", "Breakfast", "Transfers"] },
  { id: "tp12", name: "Kampala Explorer", logo: u("1611892440504-42a792e24d32"), rating: 4.5, reviews: 145, city: "Kampala", countryCode: "UG", whatsapp: "256712380004", phone: "+256 71 238 0004", verified: true, destinationCountry: "UG", tourType: "Adventure", days: 5, pricePerPerson: 980, private: false, itinerary: ["Bwindi Gorilla Trek", "Lake Victoria", "Murchison Falls"], inclusions: ["Lodge", "Meals", "4x4", "Permits", "Guide"] },
];

// CAR RENTAL
export type CarType = "Economy" | "SUV" | "Luxury" | "Minibus" | "4x4";
export interface CarOffer extends Provider {
  model: string; carType: CarType; dailyRate: number; transmission: "Manual" | "Automatic"; features: string[]; mileageLimit: string; deposit: number;
}
export const CAR_OFFERS: CarOffer[] = [
  { id: "cr1", name: "Banadir Rentals", logo: u("1503376780353-7e6692767b70"), rating: 4.7, reviews: 142, city: "Mogadishu", countryCode: "SO", whatsapp: "252612390001", phone: "+252 61 239 0001", verified: true, model: "Toyota Corolla 2022", carType: "Economy", dailyRate: 35, transmission: "Automatic", features: ["AC", "Bluetooth"], mileageLimit: "200km/day", deposit: 200 },
  { id: "cr2", name: "Banadir Rentals", logo: u("1503376780353-7e6692767b70"), rating: 4.7, reviews: 142, city: "Mogadishu", countryCode: "SO", whatsapp: "252612390001", phone: "+252 61 239 0001", verified: true, model: "Toyota Land Cruiser V8", carType: "Luxury", dailyRate: 180, transmission: "Automatic", features: ["AC", "GPS", "Driver opt."], mileageLimit: "Unlimited", deposit: 800 },
  { id: "cr3", name: "Mogadishu 4x4", logo: u("1494976388531-d1058494cdd8"), rating: 4.6, reviews: 78, city: "Mogadishu", countryCode: "SO", whatsapp: "252612390002", phone: "+252 61 239 0002", verified: true, model: "Toyota Hilux 4x4", carType: "4x4", dailyRate: 95, transmission: "Manual", features: ["AC", "GPS"], mileageLimit: "300km/day", deposit: 500 },
  { id: "cr4", name: "Nairobi Wheels", logo: u("1542362567-b07e54358753"), rating: 4.8, reviews: 230, city: "Nairobi", countryCode: "KE", whatsapp: "254712390003", phone: "+254 712 390 003", verified: true, model: "Nissan X-Trail", carType: "SUV", dailyRate: 75, transmission: "Automatic", features: ["AC", "GPS", "Bluetooth"], mileageLimit: "250km/day", deposit: 400 },
  { id: "cr5", name: "Nairobi Wheels", logo: u("1542362567-b07e54358753"), rating: 4.8, reviews: 230, city: "Nairobi", countryCode: "KE", whatsapp: "254712390003", phone: "+254 712 390 003", verified: true, model: "Toyota Hiace 14-seat", carType: "Minibus", dailyRate: 130, transmission: "Manual", features: ["AC", "Driver included"], mileageLimit: "Unlimited", deposit: 500 },
  { id: "cr6", name: "Banadir Rentals", logo: u("1503376780353-7e6692767b70"), rating: 4.7, reviews: 142, city: "Mogadishu", countryCode: "SO", whatsapp: "252612390001", phone: "+252 61 239 0001", verified: true, model: "Hyundai Sonata 2023", carType: "Economy", dailyRate: 45, transmission: "Automatic", features: ["AC", "Bluetooth", "USB"], mileageLimit: "200km/day", deposit: 250 },
  { id: "cr7", name: "Hargeisa Auto", logo: u("1494976388531-d1058494cdd8"), rating: 4.5, reviews: 65, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556679", phone: "+252 63 455 6679", verified: true, model: "Toyota RAV4 2022", carType: "SUV", dailyRate: 70, transmission: "Automatic", features: ["AC", "GPS", "Bluetooth"], mileageLimit: "200km/day", deposit: 350 },
  { id: "cr8", name: "Hargeisa Auto", logo: u("1494976388531-d1058494cdd8"), rating: 4.5, reviews: 65, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556679", phone: "+252 63 455 6679", verified: true, model: "Mercedes-Benz E-Class", carType: "Luxury", dailyRate: 220, transmission: "Automatic", features: ["AC", "GPS", "Leather", "Driver included"], mileageLimit: "Unlimited", deposit: 1000 },
  { id: "cr9", name: "Mogadishu 4x4", logo: u("1494976388531-d1058494cdd8"), rating: 4.6, reviews: 78, city: "Mogadishu", countryCode: "SO", whatsapp: "252612390002", phone: "+252 61 239 0002", verified: true, model: "Land Cruiser Prado", carType: "4x4", dailyRate: 150, transmission: "Automatic", features: ["AC", "GPS", "Driver opt."], mileageLimit: "Unlimited", deposit: 700 },
  { id: "cr10", name: "Addis Auto Hire", logo: u("1547471080-7cc2caa01a7e"), rating: 4.6, reviews: 110, city: "Addis Ababa", countryCode: "ET", whatsapp: "251911390004", phone: "+251 911 390 004", verified: true, model: "Toyota Vitz", carType: "Economy", dailyRate: 30, transmission: "Manual", features: ["AC"], mileageLimit: "150km/day", deposit: 150 },
  { id: "cr11", name: "Addis Auto Hire", logo: u("1547471080-7cc2caa01a7e"), rating: 4.6, reviews: 110, city: "Addis Ababa", countryCode: "ET", whatsapp: "251911390004", phone: "+251 911 390 004", verified: true, model: "Hyundai H1 Minibus", carType: "Minibus", dailyRate: 110, transmission: "Manual", features: ["AC", "Driver included"], mileageLimit: "Unlimited", deposit: 400 },
  { id: "cr12", name: "Dubai Drive", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.9, reviews: 1280, city: "Dubai", countryCode: "AE", whatsapp: "971501234570", phone: "+971 50 123 4570", verified: true, model: "BMW 5 Series", carType: "Luxury", dailyRate: 280, transmission: "Automatic", features: ["AC", "GPS", "Leather", "Sunroof"], mileageLimit: "250km/day", deposit: 1500 },
  { id: "cr13", name: "Dubai Drive", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.9, reviews: 1280, city: "Dubai", countryCode: "AE", whatsapp: "971501234570", phone: "+971 50 123 4570", verified: true, model: "Nissan Patrol Y62", carType: "4x4", dailyRate: 320, transmission: "Automatic", features: ["AC", "GPS", "7 seats"], mileageLimit: "300km/day", deposit: 1500 },
  { id: "cr14", name: "Djibouti Rent-a-Car", logo: u("1503376780353-7e6692767b70"), rating: 4.4, reviews: 58, city: "Djibouti", countryCode: "DJ", whatsapp: "253771122336", phone: "+253 77 112 2336", verified: true, model: "Toyota Hilux", carType: "4x4", dailyRate: 105, transmission: "Manual", features: ["AC", "GPS", "Snorkel"], mileageLimit: "300km/day", deposit: 500 },
];
