import {
  Plane, Building2, BedDouble, FileCheck, Star, Map, Car,
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
  | "flights" | "agencies" | "hotels" | "visa" | "hajj-umrah" | "tours" | "car-rental";

export interface TravelSub {
  key: TravelSubKey;
  label: string;
  emoji: string;
  short: string;
  icon: LucideIcon;
  href: string;
}

export const TRAVEL_SUBS: TravelSub[] = [
  { key: "flights", label: "Airline Tickets", emoji: "✈️", short: "Find & book flights", icon: Plane, href: "/travel/flights" },
  { key: "agencies", label: "Travel Agencies", emoji: "🏢", short: "Browse all agencies", icon: Building2, href: "/travel/agencies" },
  { key: "hotels", label: "Hotels", emoji: "🏨", short: "Stay anywhere", icon: BedDouble, href: "/travel/hotels" },
  { key: "visa", label: "Visa Services", emoji: "🛂", short: "Tourist & business visas", icon: FileCheck, href: "/travel/visa" },
  { key: "hajj-umrah", label: "Hajj & Umrah", emoji: "🕋", short: "Pilgrimage packages", icon: Star, href: "/travel/hajj-umrah" },
  { key: "tours", label: "Tour Packages", emoji: "🗺️", short: "Safari, beach, culture", icon: Map, href: "/travel/tours" },
  { key: "car-rental", label: "Car Rental", emoji: "🚗", short: "Rent any vehicle", icon: Car, href: "/travel/car-rental" },
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

// FLIGHTS — agency offerings per route
export interface FlightOffer extends Provider {
  from: string; to: string; price: number; durationHrs: number; direct: boolean;
}
export const FLIGHT_OFFERS: FlightOffer[] = [
  { id: "fl1", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, from: "MGQ", to: "NBO", price: 180, durationHrs: 2.5, direct: true },
  { id: "fl2", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", verified: true, from: "MGQ", to: "NBO", price: 195, durationHrs: 3.2, direct: false },
  { id: "fl3", name: "Banadir Flights", logo: u("1569154941061-e231b4725ef1"), rating: 4.8, reviews: 540, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340102", phone: "+252 61 234 0102", verified: true, from: "MGQ", to: "NBO", price: 210, durationHrs: 2.5, direct: true },
  { id: "fl4", name: "EastAfrica Tickets", logo: u("1542296332-2e4473faf563"), rating: 4.4, reviews: 145, city: "Nairobi", countryCode: "KE", whatsapp: "254712340103", phone: "+254 712 340 103", verified: true, from: "MGQ", to: "DXB", price: 320, durationHrs: 5.0, direct: true },
  { id: "fl5", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", verified: true, from: "MGQ", to: "DXB", price: 350, durationHrs: 4.5, direct: true },
  { id: "fl6", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", verified: true, from: "MGQ", to: "IST", price: 480, durationHrs: 7.0, direct: false },
  { id: "fl7", name: "Sky Wings", logo: u("1530521954074-e64f6810b32d"), rating: 4.6, reviews: 88, city: "Nairobi", countryCode: "KE", whatsapp: "254712340104", phone: "+254 712 340 104", verified: true, from: "NBO", to: "DXB", price: 290, durationHrs: 4.8, direct: true },
];

// AGENCIES (general directory)
export interface Agency extends Provider { services: string[]; description: string; hours: string }
export const AGENCIES: Agency[] = [
  { id: "ag1", name: "Salaam Travel", logo: u("1436491865332-7a61a109cc05"), rating: 4.7, reviews: 320, city: "Mogadishu", countryCode: "SO", whatsapp: "252615556677", phone: "+252 61 555 6677", email: "info@salaamtravel.so", verified: true, services: ["Flights", "Visa", "Hotels", "Hajj"], description: "Full-service travel agency since 2010.", hours: "Sat–Thu, 8am–8pm" },
  { id: "ag2", name: "Horn Aviation", logo: u("1556388158-158ea5ccacbd"), rating: 4.5, reviews: 210, city: "Mogadishu", countryCode: "SO", whatsapp: "252612340101", phone: "+252 61 234 0101", email: "hello@hornav.so", verified: true, services: ["Flights", "Tours"], description: "Specialist in East Africa routes.", hours: "Daily, 9am–7pm" },
  { id: "ag3", name: "Barakah Tours", logo: u("1519817914152-22d216bb9170"), rating: 4.9, reviews: 145, city: "Mogadishu", countryCode: "SO", whatsapp: "252617778899", phone: "+252 61 777 8899", email: "barakah@example.com", verified: true, services: ["Hajj", "Umrah", "Visa"], description: "Trusted pilgrimage operator.", hours: "Daily, 8am–9pm" },
  { id: "ag4", name: "Jambo Travel", logo: u("1469854523086-cc02fe5d8800"), rating: 4.6, reviews: 412, city: "Nairobi", countryCode: "KE", whatsapp: "254712340105", phone: "+254 712 340 105", email: "jambo@travel.ke", verified: true, services: ["Flights", "Hotels", "Safari"], description: "Kenya's safari & flight specialists.", hours: "Mon–Sat, 8am–6pm" },
];

// HOTELS
export interface Hotel extends Provider {
  pricePerNight: number; amenities: string[]; distanceKm: number; roomTypes: { name: string; price: number }[];
}
export const HOTELS: Hotel[] = [
  { id: "ho1", name: "Lido Beach Hotel", logo: u("1566073771259-6a8506099945"), rating: 4.5, reviews: 410, city: "Mogadishu", countryCode: "SO", whatsapp: "252616667788", phone: "+252 61 666 7788", verified: true, pricePerNight: 80, amenities: ["WiFi", "Breakfast", "Beach"], distanceKm: 0.2, roomTypes: [{ name: "Single", price: 80 }, { name: "Double", price: 120 }, { name: "Suite", price: 220 }] },
  { id: "ho2", name: "Sahafi Hotel", logo: u("1551882547-ff40c63fe5fa"), rating: 4.7, reviews: 612, city: "Mogadishu", countryCode: "SO", whatsapp: "252612350001", phone: "+252 61 235 0001", verified: true, pricePerNight: 110, amenities: ["WiFi", "Pool", "Gym", "Restaurant"], distanceKm: 1.4, roomTypes: [{ name: "Single", price: 110 }, { name: "Double", price: 160 }, { name: "Suite", price: 280 }] },
  { id: "ho3", name: "Sarova Stanley", logo: u("1564501049412-61c2a3083791"), rating: 4.8, reviews: 1820, city: "Nairobi", countryCode: "KE", whatsapp: "254712350002", phone: "+254 712 350 002", verified: true, pricePerNight: 145, amenities: ["WiFi", "Breakfast", "Pool", "Spa"], distanceKm: 0.5, roomTypes: [{ name: "Single", price: 145 }, { name: "Double", price: 195 }, { name: "Suite", price: 360 }] },
  { id: "ho4", name: "Voyager Beach Resort", logo: u("1571896349842-33c89424de2d"), rating: 4.6, reviews: 940, city: "Mombasa", countryCode: "KE", whatsapp: "254712350003", phone: "+254 712 350 003", verified: true, pricePerNight: 130, amenities: ["WiFi", "Beach", "Pool", "Breakfast"], distanceKm: 0.1, roomTypes: [{ name: "Single", price: 130 }, { name: "Double", price: 180 }, { name: "Suite", price: 320 }] },
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
];
