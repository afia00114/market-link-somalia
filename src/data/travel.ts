import { Plane, Building2, FileCheck, Star, Map, Car, type LucideIcon } from "lucide-react";

export interface Country {
  code: string;
  name: string;
  flag: string;
  dial: string;
}

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

export type TravelSubKey = "flights" | "agencies" | "visa" | "hajj-umrah" | "tours" | "car-rental";

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
    key: "flights",
    label: "Airline Tickets",
    emoji: "✈️",
    short: "Find & book flights",
    icon: Plane,
    href: "/travel/flights",
    description:
      "Compare verified airlines and travel agencies for one-way and round trips across East Africa, the Gulf, and beyond.",
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
    key: "agencies",
    label: "Travel Agencies",
    emoji: "🏢",
    short: "Browse all agencies",
    icon: Building2,
    href: "/travel/agencies",
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
    key: "visa",
    label: "Visa Services",
    emoji: "🛂",
    short: "Tourist & business visas",
    icon: FileCheck,
    href: "/travel/visa",
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
    key: "hajj-umrah",
    label: "Hajj & Umrah",
    emoji: "🕋",
    short: "Pilgrimage packages",
    icon: Star,
    href: "/travel/hajj-umrah",
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
    key: "tours",
    label: "Tour Packages",
    emoji: "🗺️",
    short: "Safari, beach, culture",
    icon: Map,
    href: "/travel/tours",
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
    key: "car-rental",
    label: "Car Rental",
    emoji: "🚗",
    short: "Rent any vehicle",
    icon: Car,
    href: "/travel/car-rental",
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
export interface Airport {
  code: string;
  city: string;
  country: string;
  international?: boolean;
}
export const AIRPORTS: Record<string, Airport[]> = {
  SO: [
    { code: "MGQ", city: "Mogadishu", country: "SO" },
    { code: "HGA", city: "Hargeisa", country: "SO" },
    { code: "BSA", city: "Bosaso", country: "SO" },
    { code: "GLK", city: "Galkayo", country: "SO" },
  ],
  KE: [
    { code: "NBO", city: "Nairobi", country: "KE" },
    { code: "MBA", city: "Mombasa", country: "KE" },
  ],
  ET: [{ code: "ADD", city: "Addis Ababa", country: "ET" }],
  DJ: [{ code: "JIB", city: "Djibouti", country: "DJ" }],
  UG: [{ code: "EBB", city: "Entebbe", country: "UG" }],
  TZ: [
    { code: "DAR", city: "Dar es Salaam", country: "TZ" },
    { code: "ZNZ", city: "Zanzibar", country: "TZ" },
  ],
  AE: [
    { code: "DXB", city: "Dubai", country: "AE", international: true },
    { code: "AUH", city: "Abu Dhabi", country: "AE", international: true },
  ],
  TR: [{ code: "IST", city: "Istanbul", country: "TR", international: true }],
  SA: [
    { code: "JED", city: "Jeddah", country: "SA", international: true },
    { code: "RUH", city: "Riyadh", country: "SA", international: true },
  ],
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
export type FlightAmenity =
  | "Free Wi-Fi"
  | "In-flight Meals"
  | "USB Charging"
  | "Extra Legroom"
  | "Entertainment"
  | "Lounge Access"
  | "Check-in Baggage";
export interface FlightClassOption {
  cls: "Economy" | "Business" | "First Class";
  price: number;
  bags: number;
  seat: string;
}
export interface FlightOffer extends Provider {
  from: string;
  to: string;
  price: number;
  durationHrs: number;
  direct: boolean;
  departTime?: string;
  arriveTime?: string;
  via?: string;
  yearsInBusiness?: number;
  departDate?: string;
  returnDate?: string;
  returnTime?: string;
  amenities?: FlightAmenity[];
  classes?: FlightClassOption[];
}

export const DEFAULT_AMENITIES: FlightAmenity[] = [
  "Free Wi-Fi",
  "In-flight Meals",
  "USB Charging",
  "Extra Legroom",
  "Entertainment",
  "Lounge Access",
  "Check-in Baggage",
];
export function flightClassesFor(basePrice: number): FlightClassOption[] {
  return [
    { cls: "Economy", price: basePrice, bags: 1, seat: "Standard Seat" },
    { cls: "Business", price: Math.round(basePrice * 2.7), bags: 2, seat: "Lie-Flat Seat" },
    { cls: "First Class", price: Math.round(basePrice * 4.3), bags: 3, seat: "Private Suite" },
  ];
}

// ----- ADDED: ALL EAST AFRICAN AIRLINES AS SAMPLE FLIGHT OFFERS -----
// Define logos for each airline (using Unsplash IDs)
const airlineLogos: Record<string, string> = {
  "Ethiopian Airlines": u("1436491865332-7a61a109cc05"),
  "Kenya Airways": u("1556388158-158ea5ccacbd"),
  RwandAir: u("1569154941061-e231b4725ef1"),
  "Uganda Airlines": u("1542296332-2e4473faf563"),
  "Air Tanzania": u("1530521954074-e64f6810b32d"),
  "Jubba Airways": u("1519817914152-22d216bb9170"),
  "Daallo Airlines": u("1611892440504-42a792e24d32"),
  "African Express Airways": u("1582719478250-c89cae4dc85b"),
};

// Helper to create an airline flight offer
function airlineOffer(
  id: string,
  name: string,
  from: string,
  to: string,
  price: number,
  durationHrs: number,
  direct: boolean,
  departTime: string,
  arriveTime: string,
  via?: string,
): FlightOffer {
  const ratingMap: Record<string, number> = {
    "Ethiopian Airlines": 4.8,
    "Kenya Airways": 4.7,
    RwandAir: 4.6,
    "Uganda Airlines": 4.4,
    "Air Tanzania": 4.3,
    "Jubba Airways": 4.5,
    "Daallo Airlines": 4.2,
    "African Express Airways": 4.1,
  };
  const reviewsMap: Record<string, number> = {
    "Ethiopian Airlines": 1250,
    "Kenya Airways": 980,
    RwandAir: 560,
    "Uganda Airlines": 210,
    "Air Tanzania": 340,
    "Jubba Airways": 430,
    "Daallo Airlines": 290,
    "African Express Airways": 180,
  };
  return {
    id,
    name,
    logo: airlineLogos[name],
    rating: ratingMap[name] || 4.5,
    reviews: reviewsMap[name] || 300,
    city: from === "MGQ" || from === "HGA" ? "Mogadishu" : from === "NBO" ? "Nairobi" : "Addis Ababa",
    countryCode: from === "MGQ" || from === "HGA" ? "SO" : from === "NBO" ? "KE" : "ET",
    whatsapp: "", // not needed for airline sample, but keep placeholder
    phone: "",
    verified: true,
    from,
    to,
    price,
    durationHrs,
    direct,
    departTime,
    arriveTime,
    via,
    yearsInBusiness: 20,
  };
}

// Create the East African airline offers
const eastAfricanAirlinesOffers: FlightOffer[] = [
  // Ethiopian Airlines
  airlineOffer("et-mgq-add", "Ethiopian Airlines", "MGQ", "ADD", 160, 2.0, true, "07:30", "09:30"),
  airlineOffer("et-add-nbo", "Ethiopian Airlines", "ADD", "NBO", 190, 2.2, true, "10:30", "12:45"),
  airlineOffer("et-mgq-dxb", "Ethiopian Airlines", "MGQ", "DXB", 340, 4.5, false, "01:00", "07:30", "ADD"),
  airlineOffer("et-hga-add", "Ethiopian Airlines", "HGA", "ADD", 210, 1.5, true, "08:20", "09:50"),
  // Kenya Airways
  airlineOffer("kq-mgq-nbo", "Kenya Airways", "MGQ", "NBO", 185, 2.5, true, "09:00", "11:30"),
  airlineOffer("kq-nbo-dxb", "Kenya Airways", "NBO", "DXB", 295, 4.8, true, "16:20", "21:10"),
  airlineOffer("kq-nbo-jed", "Kenya Airways", "NBO", "JED", 410, 4.2, true, "22:50", "03:10"),
  airlineOffer("kq-mba-zanzibar", "Kenya Airways", "MBA", "ZNZ", 180, 1.2, true, "12:10", "13:25"),
  // RwandAir
  airlineOffer("wb-mgq-kgl", "RwandAir", "MGQ", "EBB", 270, 3.0, false, "06:45", "11:45", "KGL"),
  airlineOffer("wb-nbo-kgl", "RwandAir", "NBO", "EBB", 230, 2.0, true, "14:20", "16:20"),
  airlineOffer("wb-kgl-dxb", "RwandAir", "EBB", "DXB", 380, 4.5, true, "20:30", "03:00"),
  // Uganda Airlines
  airlineOffer("ur-mgq-ebb", "Uganda Airlines", "MGQ", "EBB", 260, 2.8, false, "05:15", "10:00", "NBO"),
  airlineOffer("ur-ebb-nbo", "Uganda Airlines", "EBB", "NBO", 150, 1.2, true, "11:30", "12:45"),
  airlineOffer("ur-ebb-dxb", "Uganda Airlines", "EBB", "DXB", 340, 4.6, true, "18:40", "01:20"),
  // Air Tanzania
  airlineOffer("tc-dar-mgq", "Air Tanzania", "DAR", "MGQ", 310, 3.2, true, "09:00", "12:15"),
  airlineOffer("tc-dar-nbo", "Air Tanzania", "DAR", "NBO", 140, 1.3, true, "15:20", "16:50"),
  airlineOffer("tc-dar-dxb", "Air Tanzania", "DAR", "DXB", 450, 5.2, true, "20:10", "03:30"),
  // Jubba Airways (Somali regional)
  airlineOffer("j6-mgq-nbo", "Jubba Airways", "MGQ", "NBO", 170, 2.5, true, "07:00", "09:30"),
  airlineOffer("j6-mgq-add", "Jubba Airways", "MGQ", "ADD", 155, 2.2, true, "13:00", "15:20"),
  airlineOffer("j6-hga-add", "Jubba Airways", "HGA", "ADD", 200, 1.6, true, "10:40", "12:20"),
  airlineOffer("j6-mgq-dxb", "Jubba Airways", "MGQ", "DXB", 330, 4.2, true, "21:15", "03:35"),
  // Daallo Airlines
  airlineOffer("d3-mgq-nbo", "Daallo Airlines", "MGQ", "NBO", 175, 2.8, true, "16:00", "18:45"),
  airlineOffer("d3-hga-dxb", "Daallo Airlines", "HGA", "DXB", 420, 3.5, true, "23:30", "05:00"),
  airlineOffer("d3-mgq-add", "Daallo Airlines", "MGQ", "ADD", 165, 2.3, true, "11:20", "13:50"),
  // African Express Airways
  airlineOffer("xw-mgq-nbo", "African Express Airways", "MGQ", "NBO", 160, 3.0, false, "04:30", "09:30", "HGA"),
  airlineOffer("xw-mgq-add", "African Express Airways", "MGQ", "ADD", 150, 2.6, true, "14:15", "16:45"),
];

// Merge existing FLIGHT_OFFERS with new East African airlines
export const FLIGHT_OFFERS: FlightOffer[] = [
  // Existing agency-based offers
  {
    id: "fl1",
    name: "Salaam Travel",
    logo: u("1436491865332-7a61a109cc05"),
    rating: 4.7,
    reviews: 320,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252615556677",
    phone: "+252 61 555 6677",
    verified: true,
    from: "MGQ",
    to: "NBO",
    price: 180,
    durationHrs: 2.5,
    direct: true,
    departTime: "08:00",
    arriveTime: "10:30",
    yearsInBusiness: 14,
  },
  {
    id: "fl2",
    name: "Horn Aviation",
    logo: u("1556388158-158ea5ccacbd"),
    rating: 4.5,
    reviews: 210,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252612340101",
    phone: "+252 61 234 0101",
    verified: true,
    from: "MGQ",
    to: "NBO",
    price: 195,
    durationHrs: 3.2,
    direct: false,
    departTime: "06:45",
    arriveTime: "09:55",
    via: "ADD",
    yearsInBusiness: 9,
  },
  {
    id: "fl3",
    name: "Banadir Flights",
    logo: u("1569154941061-e231b4725ef1"),
    rating: 4.8,
    reviews: 540,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252612340102",
    phone: "+252 61 234 0102",
    verified: true,
    from: "MGQ",
    to: "NBO",
    price: 210,
    durationHrs: 2.5,
    direct: true,
    departTime: "14:30",
    arriveTime: "17:00",
    yearsInBusiness: 18,
  },
  {
    id: "fl3b",
    name: "Horizon Travel",
    logo: u("1542296332-2e4473faf563"),
    rating: 4.9,
    reviews: 412,
    city: "Hargeisa",
    countryCode: "SO",
    whatsapp: "252634556677",
    phone: "+252 63 455 6677",
    verified: true,
    from: "HGA",
    to: "NBO",
    price: 230,
    durationHrs: 3.5,
    direct: false,
    departTime: "07:15",
    arriveTime: "10:45",
    via: "ADD",
    yearsInBusiness: 12,
  },
  {
    id: "fl4",
    name: "EastAfrica Tickets",
    logo: u("1542296332-2e4473faf563"),
    rating: 4.4,
    reviews: 145,
    city: "Nairobi",
    countryCode: "KE",
    whatsapp: "254712340103",
    phone: "+254 712 340 103",
    verified: true,
    from: "MGQ",
    to: "DXB",
    price: 320,
    durationHrs: 5.0,
    direct: true,
    departTime: "23:55",
    arriveTime: "04:55",
    yearsInBusiness: 7,
  },
  {
    id: "fl5",
    name: "Salaam Travel",
    logo: u("1436491865332-7a61a109cc05"),
    rating: 4.7,
    reviews: 320,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252615556677",
    phone: "+252 61 555 6677",
    verified: true,
    from: "MGQ",
    to: "DXB",
    price: 350,
    durationHrs: 4.5,
    direct: true,
    departTime: "10:20",
    arriveTime: "14:50",
    yearsInBusiness: 14,
  },
  {
    id: "fl6",
    name: "Horn Aviation",
    logo: u("1556388158-158ea5ccacbd"),
    rating: 4.5,
    reviews: 210,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252612340101",
    phone: "+252 61 234 0101",
    verified: true,
    from: "MGQ",
    to: "IST",
    price: 480,
    durationHrs: 7.0,
    direct: false,
    departTime: "02:15",
    arriveTime: "09:15",
    via: "DXB",
    yearsInBusiness: 9,
  },
  {
    id: "fl6b",
    name: "Banadir Flights",
    logo: u("1569154941061-e231b4725ef1"),
    rating: 4.8,
    reviews: 540,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252612340102",
    phone: "+252 61 234 0102",
    verified: true,
    from: "MGQ",
    to: "JED",
    price: 420,
    durationHrs: 4.0,
    direct: true,
    departTime: "23:30",
    arriveTime: "03:30",
    yearsInBusiness: 18,
  },
  {
    id: "fl7",
    name: "Sky Wings",
    logo: u("1530521954074-e64f6810b32d"),
    rating: 4.6,
    reviews: 88,
    city: "Nairobi",
    countryCode: "KE",
    whatsapp: "254712340104",
    phone: "+254 712 340 104",
    verified: true,
    from: "NBO",
    to: "DXB",
    price: 290,
    durationHrs: 4.8,
    direct: true,
    departTime: "16:00",
    arriveTime: "20:48",
    yearsInBusiness: 6,
  },
  // --- New East African Airlines ---
  ...eastAfricanAirlinesOffers,
];

// AGENCIES (general directory) — unchanged, keep original
export interface Agency extends Provider {
  services: string[];
  description: string;
  hours: string;
}
export const AGENCIES: Agency[] = [
  {
    id: "ag1",
    name: "Salaam Travel",
    logo: u("1436491865332-7a61a109cc05"),
    rating: 4.7,
    reviews: 320,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252615556677",
    phone: "+252 61 555 6677",
    email: "info@salaamtravel.so",
    verified: true,
    services: ["Flights", "Visa", "Hotels", "Hajj"],
    description: "Full-service travel agency since 2010.",
    hours: "Sat–Thu, 8am–8pm",
  },
  {
    id: "ag2",
    name: "Horn Aviation",
    logo: u("1556388158-158ea5ccacbd"),
    rating: 4.5,
    reviews: 210,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252612340101",
    phone: "+252 61 234 0101",
    email: "hello@hornav.so",
    verified: true,
    services: ["Flights", "Tours"],
    description: "Specialist in East Africa routes.",
    hours: "Daily, 9am–7pm",
  },
  {
    id: "ag3",
    name: "Barakah Tours",
    logo: u("1519817914152-22d216bb9170"),
    rating: 4.9,
    reviews: 145,
    city: "Mogadishu",
    countryCode: "SO",
    whatsapp: "252617778899",
    phone: "+252 61 777 8899",
    email: "barakah@example.com",
    verified: true,
    services: ["Hajj", "Umrah", "Visa"],
    description: "Trusted pilgrimage operator.",
    hours: "Daily, 8am–9pm",
  },
  {
    id: "ag4",
    name: "Jambo Travel",
    logo: u("1469854523086-cc02fe5d8800"),
    rating: 4.6,
    reviews: 412,
    city: "Nairobi",
    countryCode: "KE",
    whatsapp: "254712340105",
    phone: "+254 712 340 105",
    email: "jambo@travel.ke",
    verified: true,
    services: ["Flights", "Hotels", "Safari"],
    description: "Kenya's safari & flight specialists.",
    hours: "Mon–Sat, 8am–6pm",
  },
  {
    id: "ag5",
    name: "Hargeisa Wings",
    logo: u("1530521954074-e64f6810b32d"),
    rating: 4.4,
    reviews: 156,
    city: "Hargeisa",
    countryCode: "SO",
    whatsapp: "252634556677",
    phone: "+252 63 455 6677",
    email: "info@hargeisawings.so",
    verified: true,
    services: ["Flights", "Visa", "Car Rental"],
    description: "Northern Somalia's go-to agency.",
    hours: "Sat–Thu, 8am–7pm",
  },
  {
    id: "ag6",
    name: "Bosaso Travels",
    logo: u("1542296332-2e4473faf563"),
    rating: 4.3,
    reviews: 92,
    city: "Bosaso",
    countryCode: "SO",
    whatsapp: "252908112233",
    phone: "+252 90 811 2233",
    email: "hello@bosasotravels.so",
    verified: false,
    services: ["Flights", "Tours"],
    description: "Local agency serving Puntland routes.",
    hours: "Daily, 9am–6pm",
  },
  {
    id: "ag7",
    name: "Addis Sky Travel",
    logo: u("1547471080-7cc2caa01a7e"),
    rating: 4.7,
    reviews: 285,
    city: "Addis Ababa",
    countryCode: "ET",
    whatsapp: "251911445566",
    phone: "+251 911 445 566",
    email: "book@addissky.et",
    verified: true,
    services: ["Flights", "Hotels", "Tours", "Visa"],
    description: "ET corridor specialist with 15+ years.",
    hours: "Mon–Sat, 8am–8pm",
  },
  {
    id: "ag8",
    name: "Djibouti Connect",
    logo: u("1556388158-158ea5ccacbd"),
    rating: 4.5,
    reviews: 134,
    city: "Djibouti",
    countryCode: "DJ",
    whatsapp: "253771122334",
    phone: "+253 77 112 2334",
    email: "contact@djconnect.dj",
    verified: true,
    services: ["Flights", "Visa", "Hotels"],
    description: "Gulf & Horn of Africa connections.",
    hours: "Daily, 8am–8pm",
  },
  {
    id: "ag9",
    name: "Dubai Falcon Tours",
    logo: u("1591604129939-f1efa4d9f7fa"),
    rating: 4.8,
    reviews: 720,
    city: "Dubai",
    countryCode: "AE",
    whatsapp: "971501234567",
    phone: "+971 50 123 4567",
    email: "info@dubaifalcon.ae",
    verified: true,
    services: ["Hotels", "Tours", "Visa", "Car Rental"],
    description: "UAE inbound tours for East African travelers.",
    hours: "Daily, 24/7",
  },
  {
    id: "ag10",
    name: "Istanbul Gate Travel",
    logo: u("1519817914152-22d216bb9170"),
    rating: 4.6,
    reviews: 410,
    city: "Istanbul",
    countryCode: "TR",
    whatsapp: "905321234567",
    phone: "+90 532 123 4567",
    email: "hello@istanbulgate.tr",
    verified: true,
    services: ["Hotels", "Tours", "Visa"],
    description: "Türkiye packages with Somali-speaking guides.",
    hours: "Daily, 9am–9pm",
  },
];

// ============= VISA =============
export interface VisaService extends Provider {
  visaType: string;
  destination: string;
  fee: number;
  processingDays: string;
  successRate: number;
  requirements: string[];
}
export const VISA_SERVICES: VisaService[] = [
  { id: "v1", name: "Salaam Visa Center", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, visaType: "Tourist", destination: "AE", fee: 180, processingDays: "5–7 days", successRate: 96, requirements: ["Passport (6+ months)", "Photo", "Flight booking", "Hotel reservation"] },
  { id: "v2", name: "Horn Visa Services", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", verified: true, visaType: "Tourist", destination: "TR", fee: 90, processingDays: "3–5 days", successRate: 98, requirements: ["Passport", "Photo", "Bank statement"] },
  { id: "v3", name: "Addis Sky Visa", logo: u("1547471080-7cc2caa01a7e"), rating: 4.6, reviews: 180, city: "Addis Ababa", countryCode: "ET", whatsapp: "251911445566", phone: "+251 911 445 566", verified: true, visaType: "Business", destination: "SA", fee: 220, processingDays: "7–10 days", successRate: 92, requirements: ["Passport", "Invitation letter", "Company docs", "Photo"] },
  { id: "v4", name: "Dubai Falcon Visa", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.8, reviews: 520, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", verified: true, visaType: "Tourist", destination: "AE", fee: 150, processingDays: "2–4 days", successRate: 99, requirements: ["Passport", "Photo", "Flight booking"] },
];

// ============= HAJJ / UMRAH =============
export type PilgrimType = "Hajj" | "Umrah";
export type PilgrimTier = "Economy" | "Standard" | "VIP";
export interface PilgrimPackage extends Provider {
  type: PilgrimType;
  tier: PilgrimTier;
  durationDays: number;
  groupSize: number;
  price: number;
  inclusions: string[];
}
export const PILGRIM_PACKAGES: PilgrimPackage[] = [
  { id: "p1", name: "Barakah Umrah Economy", logo: u("1519817914152-22d216bb9170"), rating: 4.7, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, type: "Umrah", tier: "Economy", durationDays: 12, groupSize: 30, price: 1800, inclusions: ["Flights", "3★ Hotel", "Transfers", "Visa", "Guide"] },
  { id: "p2", name: "Barakah Umrah Standard", logo: u("1519817914152-22d216bb9170"), rating: 4.8, reviews: 102, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, type: "Umrah", tier: "Standard", durationDays: 14, groupSize: 25, price: 2600, inclusions: ["Flights", "4★ Hotel", "Transfers", "Visa", "Meals", "Guide"] },
  { id: "p3", name: "Barakah Umrah VIP", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 64, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", verified: true, type: "Umrah", tier: "VIP", durationDays: 14, groupSize: 15, price: 4200, inclusions: ["Flights", "5★ Hotel near Haram", "Private transfers", "Visa", "All meals", "Scholar guide"] },
  { id: "p4", name: "Salaam Hajj Standard", logo: u("1436491865332-7a61a109cc05"), rating: 4.8, reviews: 88, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, type: "Hajj", tier: "Standard", durationDays: 21, groupSize: 40, price: 6500, inclusions: ["Flights", "4★ Hotel", "Mina tents", "Visa", "Meals", "Guide"] },
  { id: "p5", name: "Salaam Hajj VIP", logo: u("1436491865332-7a61a109cc05"), rating: 4.9, reviews: 42, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, type: "Hajj", tier: "VIP", durationDays: 21, groupSize: 20, price: 9800, inclusions: ["Flights", "5★ Hotel", "VIP Mina tents", "Visa", "All meals", "Scholar guide"] },
];

// ============= TOURS =============
export type TourType = "Safari" | "Beach" | "Cultural" | "Adventure" | "City";
export interface TourPackage extends Provider {
  tourType: TourType;
  destinationCountry: string;
  days: number;
  private: boolean;
  pricePerPerson: number;
  itinerary: string[];
  inclusions: string[];
}
export const TOUR_PACKAGES: TourPackage[] = [
  { id: "t1", name: "Jambo Travel", logo: u("1469854523086-cc02fe5d8800"), rating: 4.8, reviews: 312, city: "Nairobi", countryCode: "KE", whatsapp: "254712340105", phone: "+254 712 340 105", verified: true, tourType: "Safari", destinationCountry: "KE", days: 5, private: false, pricePerPerson: 890, itinerary: ["Nairobi", "Maasai Mara", "Lake Nakuru", "Amboseli", "Nairobi"], inclusions: ["Hotel", "Meals", "Park fees", "Guide", "Transport"] },
  { id: "t2", name: "Dubai Falcon Tours", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.7, reviews: 580, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", verified: true, tourType: "City", destinationCountry: "AE", days: 4, private: true, pricePerPerson: 720, itinerary: ["Dubai Marina", "Burj Khalifa", "Desert Safari", "Old Dubai"], inclusions: ["Hotel", "Breakfast", "City tours", "Transfers"] },
  { id: "t3", name: "Istanbul Gate Travel", logo: u("1519817914152-22d216bb9170"), rating: 4.6, reviews: 410, city: "Istanbul", countryCode: "TR", whatsapp: "905321234567", phone: "+90 532 123 4567", verified: true, tourType: "Cultural", destinationCountry: "TR", days: 6, private: false, pricePerPerson: 950, itinerary: ["Istanbul", "Bursa", "Cappadocia", "Konya", "Pamukkale", "Istanbul"], inclusions: ["Hotel", "Meals", "Guide", "Transport", "Entry fees"] },
  { id: "t4", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 130, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", verified: true, tourType: "Beach", destinationCountry: "SO", days: 3, private: true, pricePerPerson: 380, itinerary: ["Mogadishu", "Lido Beach", "Jazeera Beach"], inclusions: ["Hotel", "Breakfast", "Transport", "Guide"] },
  { id: "t5", name: "Addis Sky Travel", logo: u("1547471080-7cc2caa01a7e"), rating: 4.7, reviews: 220, city: "Addis Ababa", countryCode: "ET", whatsapp: "251911445566", phone: "+251 911 445 566", verified: true, tourType: "Adventure", destinationCountry: "ET", days: 7, private: false, pricePerPerson: 1150, itinerary: ["Addis Ababa", "Lalibela", "Gondar", "Simien Mts", "Bahir Dar", "Axum", "Addis"], inclusions: ["Hotel", "Meals", "Guide", "Domestic flights", "Entry fees"] },
];

// ============= CAR RENTAL =============
export type CarType = "Economy" | "SUV" | "Luxury" | "Minibus" | "4x4";
export interface CarOffer extends Provider {
  model: string;
  carType: CarType;
  transmission: "Automatic" | "Manual";
  dailyRate: number;
  mileageLimit: string;
  deposit: number;
  features: string[];
}
export const CAR_OFFERS: CarOffer[] = [
  { id: "c1", name: "Mogadishu Auto", logo: u("1542296332-2e4473faf563"), rating: 4.5, reviews: 96, city: "Mogadishu", countryCode: "SO", whatsapp: "252615001122", phone: "+252 61 500 1122", verified: true, model: "Toyota Corolla 2022", carType: "Economy", transmission: "Automatic", dailyRate: 45, mileageLimit: "200 km/day", deposit: 200, features: ["A/C", "Bluetooth", "USB", "Insurance"] },
  { id: "c2", name: "Hargeisa Wings Cars", logo: u("1530521954074-e64f6810b32d"), rating: 4.6, reviews: 78, city: "Hargeisa", countryCode: "SO", whatsapp: "252634556677", phone: "+252 63 455 6677", verified: true, model: "Toyota Land Cruiser 2023", carType: "4x4", transmission: "Automatic", dailyRate: 120, mileageLimit: "Unlimited", deposit: 500, features: ["A/C", "4WD", "GPS", "Insurance", "Driver opt."] },
  { id: "c3", name: "Dubai Falcon Rentals", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.8, reviews: 410, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", verified: true, model: "Nissan Patrol 2024", carType: "SUV", transmission: "Automatic", dailyRate: 150, mileageLimit: "250 km/day", deposit: 800, features: ["A/C", "Leather", "Sunroof", "GPS", "Insurance"] },
  { id: "c4", name: "Nairobi Drive", logo: u("1469854523086-cc02fe5d8800"), rating: 4.4, reviews: 156, city: "Nairobi", countryCode: "KE", whatsapp: "254712005566", phone: "+254 712 005 566", verified: true, model: "Toyota Hiace 2022", carType: "Minibus", transmission: "Manual", dailyRate: 95, mileageLimit: "300 km/day", deposit: 400, features: ["A/C", "14 seats", "Roof rack", "Insurance"] },
  { id: "c5", name: "Dubai Falcon Luxury", logo: u("1591604129939-f1efa4d9f7fa"), rating: 4.9, reviews: 220, city: "Dubai", countryCode: "AE", whatsapp: "971501234567", phone: "+971 50 123 4567", verified: true, model: "Mercedes S-Class 2024", carType: "Luxury", transmission: "Automatic", dailyRate: 380, mileageLimit: "200 km/day", deposit: 1500, features: ["A/C", "Leather", "Premium sound", "Chauffeur opt.", "Insurance"] },
];
