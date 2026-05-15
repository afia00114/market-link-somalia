import type { CategoryKey } from "./categories";

export interface Listing {
  id: string;
  category: CategoryKey;
  title: string;
  subtitle: string; // e.g. subcategory or short tag
  price?: string; // pre-formatted ("$25/hr", "From $120", "Negotiable")
  city: string;
  district?: string;
  image: string;
  description: string;
  provider: {
    name: string;
    badge: "Verified Provider" | "Verified Agent" | "Verified Agency" | "Verified Owner" | "Verified Business";
    rating: number;
    reviews: number;
    whatsapp: string; // E.164 no +
    phone: string;
  };
}

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const LISTINGS: Listing[] = [
  // SERVICES
  {
    id: "s1", category: "services", title: "Fast Plumbing Solutions", subtitle: "Plumbing · 24/7",
    price: "From $25/hr", city: "Mogadishu", district: "Hodan",
    image: u("1581092918056-0c4c3acd3789"),
    description: "Licensed plumbers for leaks, installations and emergency repairs.",
    provider: { name: "Fast Plumbing", badge: "Verified Business", rating: 4.8, reviews: 212, whatsapp: "252612223344", phone: "+252 61 222 3344" },
  },
  {
    id: "s2", category: "services", title: "BrightSpark Electricians", subtitle: "Electrical · Wiring",
    price: "From $30/visit", city: "Mogadishu", district: "Wadajir",
    image: u("1565608087341-404b25492fee"),
    description: "Certified electricians for homes, offices and shops.",
    provider: { name: "BrightSpark", badge: "Verified Business", rating: 4.7, reviews: 154, whatsapp: "252613334455", phone: "+252 61 333 4455" },
  },
  {
    id: "s3", category: "services", title: "ShineHome Cleaning", subtitle: "Cleaning · Deep clean",
    price: "From $40", city: "Mogadishu", district: "Karaan",
    image: u("1581578731548-c64695cc6952"),
    description: "Trusted home and office cleaning teams.",
    provider: { name: "ShineHome", badge: "Verified Business", rating: 4.9, reviews: 98, whatsapp: "252614445566", phone: "+252 61 444 5566" },
  },
  {
    id: "s4", category: "services", title: "CoolBreeze AC Repair", subtitle: "AC Repair · Install & service",
    price: "From $35/visit", city: "Mogadishu", district: "Hodan",
    image: u("1581094794329-c8112a89af12"),
    description: "Split & central AC installation, gas refill, and maintenance.",
    provider: { name: "CoolBreeze", badge: "Verified Business", rating: 4.7, reviews: 76, whatsapp: "252614445577", phone: "+252 61 444 5577" },
  },
  {
    id: "s5", category: "services", title: "ColorPro Painting Co.", subtitle: "Painting · Interior & exterior",
    price: "From $2/sqm", city: "Mogadishu", district: "Wadajir",
    image: u("1562259949-e8e7689d7828"),
    description: "Professional painters for homes, offices and shops.",
    provider: { name: "ColorPro", badge: "Verified Business", rating: 4.6, reviews: 54, whatsapp: "252614445588", phone: "+252 61 444 5588" },
  },
  {
    id: "s6", category: "services", title: "Master Carpentry Works", subtitle: "Carpentry · Furniture & doors",
    price: "From $50", city: "Mogadishu", district: "Karaan",
    image: u("1504148455328-c376907d081c"),
    description: "Custom furniture, doors, kitchens and wood repairs.",
    provider: { name: "Master Wood", badge: "Verified Business", rating: 4.8, reviews: 89, whatsapp: "252614445599", phone: "+252 61 444 5599" },
  },
  {
    id: "s7", category: "services", title: "BuildRight Masonry", subtitle: "Masonry · Tiling & plaster",
    price: "From $5/sqm", city: "Mogadishu", district: "Yaaqshid",
    image: u("1503387762-592deb58ef4e"),
    description: "Skilled masons for tiling, plastering and small construction.",
    provider: { name: "BuildRight", badge: "Verified Business", rating: 4.7, reviews: 41, whatsapp: "252614445510", phone: "+252 61 444 5510" },
  },
  {
    id: "s8", category: "services", title: "QuickFix Plumbing 24h", subtitle: "Plumbing · Emergency",
    price: "From $20/hr", city: "Mogadishu", district: "Wadajir",
    image: u("1607472586893-edb57bdc0e39"),
    description: "Emergency leak repair, pipe replacement, water tank install.",
    provider: { name: "QuickFix", badge: "Verified Business", rating: 4.6, reviews: 132, whatsapp: "252614445521", phone: "+252 61 444 5521" },
  },
  {
    id: "s9", category: "services", title: "PowerLine Electrical", subtitle: "Electrical · Solar & wiring",
    price: "From $40/visit", city: "Mogadishu", district: "Hodan",
    image: u("1521224616346-91bbb3d0138b"),
    description: "Solar installation, generator wiring and electrical safety checks.",
    provider: { name: "PowerLine", badge: "Verified Business", rating: 4.8, reviews: 67, whatsapp: "252614445532", phone: "+252 61 444 5532" },
  },
  {
    id: "s10", category: "services", title: "Sparkle Office Cleaning", subtitle: "Cleaning · Office contracts",
    price: "From $80/wk", city: "Mogadishu", district: "Hamarweyne",
    image: u("1527515637462-cff94eecc1ac"),
    description: "Recurring office cleaning contracts with trained staff.",
    provider: { name: "Sparkle", badge: "Verified Business", rating: 4.7, reviews: 58, whatsapp: "252614445543", phone: "+252 61 444 5543" },
  },

  // TRAVEL
  {
    id: "t1", category: "travel", title: "Mogadishu → Nairobi Flights", subtitle: "Flights · One-way",
    price: "From $180", city: "Mogadishu",
    image: u("1436491865332-7a61a109cc05"),
    description: "Daily flights with leading East African carriers. Book via WhatsApp.",
    provider: { name: "Salaam Travel", badge: "Verified Business", rating: 4.6, reviews: 320, whatsapp: "252615556677", phone: "+252 61 555 6677" },
  },
  {
    id: "t2", category: "travel", title: "Lido Beach Hotel", subtitle: "Hotel · Mogadishu",
    price: "$80/night", city: "Mogadishu", district: "Lido",
    image: u("1566073771259-6a8506099945"),
    description: "Beachfront rooms with breakfast included.",
    provider: { name: "Lido Beach Hotel", badge: "Verified Business", rating: 4.5, reviews: 410, whatsapp: "252616667788", phone: "+252 61 666 7788" },
  },
  {
    id: "t3", category: "travel", title: "Umrah Package — 10 Days", subtitle: "Tours · Umrah",
    price: "$1,450", city: "Mogadishu",
    image: u("1519817914152-22d216bb9170"),
    description: "All-inclusive Umrah package with flights, visa, and hotel.",
    provider: { name: "Barakah Tours", badge: "Verified Business", rating: 4.9, reviews: 145, whatsapp: "252617778899", phone: "+252 61 777 8899" },
  },

  // HEALTH
  {
    id: "h1", category: "health", title: "Medipark General Hospital", subtitle: "Hospital · 24/7 ER",
    price: "Consult $20", city: "Mogadishu", district: "Hodan",
    image: u("1586773860418-d37222d8fce3"),
    description: "Multi-specialty hospital with emergency, maternity and surgery.",
    provider: { name: "Medipark", badge: "Verified Business", rating: 4.7, reviews: 540, whatsapp: "252618889900", phone: "+252 61 888 9900" },
  },
  {
    id: "h2", category: "health", title: "Dr. Hassan Dental Clinic", subtitle: "Dental · Clinic",
    price: "From $15", city: "Mogadishu", district: "Wadajir",
    image: u("1588776814546-1ffcf47267a5"),
    description: "Modern dental clinic — cleaning, fillings, braces.",
    provider: { name: "Dr. Hassan", badge: "Verified Provider", rating: 4.8, reviews: 88, whatsapp: "252619990011", phone: "+252 61 999 0011" },
  },
  {
    id: "h3", category: "health", title: "AlShifa Pharmacy", subtitle: "Pharmacy · Delivery",
    price: "Free delivery", city: "Mogadishu", district: "Bakara",
    image: u("1587854692152-cbe660dbde88"),
    description: "Wide range of medicines, fast home delivery via WhatsApp.",
    provider: { name: "AlShifa", badge: "Verified Business", rating: 4.6, reviews: 220, whatsapp: "252611112233", phone: "+252 61 111 2233" },
  },

  // FOOD
  {
    id: "f1", category: "food", title: "Village Restaurant", subtitle: "Somali · Dine-in",
    price: "$5–15", city: "Mogadishu", district: "Hamarweyne",
    image: u("1466978913421-dad2ebd01d17"),
    description: "Authentic Somali cuisine — pasta, suqaar, fresh juices.",
    provider: { name: "Village", badge: "Verified Business", rating: 4.7, reviews: 612, whatsapp: "252612345001", phone: "+252 61 234 5001" },
  },
  {
    id: "f2", category: "food", title: "Pizza House Mogadishu", subtitle: "Pizza · Delivery",
    price: "From $8", city: "Mogadishu", district: "Wadajir",
    image: u("1513104890138-7c749659a591"),
    description: "Wood-fired pizzas delivered hot to your door.",
    provider: { name: "Pizza House", badge: "Verified Business", rating: 4.5, reviews: 380, whatsapp: "252612345002", phone: "+252 61 234 5002" },
  },
  {
    id: "f3", category: "food", title: "Bariis Iskukaris Catering", subtitle: "Catering · Events",
    price: "From $4/plate", city: "Mogadishu",
    image: u("1555939594-58d7cb561ad1"),
    description: "Catering for weddings and events. Order via WhatsApp.",
    provider: { name: "Hooyo Catering", badge: "Verified Business", rating: 4.8, reviews: 142, whatsapp: "252612345003", phone: "+252 61 234 5003" },
  },

  // VEHICLES
  {
    id: "v1", category: "vehicles", title: "Toyota Land Cruiser 2018", subtitle: "SUV · Used",
    price: "$38,000", city: "Mogadishu",
    image: u("1494976388531-d1058494cdd8"),
    description: "Excellent condition, full service history, low mileage.",
    provider: { name: "Cabdi Motors", badge: "Verified Agent", rating: 4.7, reviews: 64, whatsapp: "252612346001", phone: "+252 61 234 6001" },
  },
  {
    id: "v2", category: "vehicles", title: "Toyota Hiace Minibus", subtitle: "Van · 14 seats",
    price: "$22,500", city: "Mogadishu",
    image: u("1503376780353-7e6692767b70"),
    description: "Ideal for transport business, recently serviced.",
    provider: { name: "Banadir Auto", badge: "Verified Business", rating: 4.6, reviews: 47, whatsapp: "252612346002", phone: "+252 61 234 6002" },
  },
  {
    id: "v3", category: "vehicles", title: "Bajaj TVS Tuk-Tuk", subtitle: "Tuk-Tuk · New",
    price: "$3,200", city: "Mogadishu",
    image: u("1449965408869-eaa3f722e40d"),
    description: "Brand new tuk-tuks available, financing via partner bank.",
    provider: { name: "TVS Somalia", badge: "Verified Business", rating: 4.8, reviews: 130, whatsapp: "252612346003", phone: "+252 61 234 6003" },
  },

  // LIVESTOCK
  {
    id: "l1", category: "livestock", title: "Healthy Camels for Sale", subtitle: "Camels · 5 head",
    price: "$1,200/each", city: "Galkayo",
    image: u("1564506474803-32f5fa4d3d72"),
    description: "Healthy adult camels, ready for sale or transport.",
    provider: { name: "Geel Farm", badge: "Verified Owner", rating: 4.9, reviews: 22, whatsapp: "252612347001", phone: "+252 61 234 7001" },
  },
  {
    id: "l2", category: "livestock", title: "Dairy Cattle (Friesian)", subtitle: "Cattle · Dairy",
    price: "$900/head", city: "Afgoye",
    image: u("1500595046743-cd271d694d30"),
    description: "Productive dairy cows, vaccinated, ready for delivery.",
    provider: { name: "Shabelle Dairy", badge: "Verified Business", rating: 4.7, reviews: 35, whatsapp: "252612347002", phone: "+252 61 234 7002" },
  },
  {
    id: "l3", category: "livestock", title: "Goats — Mixed Breed", subtitle: "Goats · 20 head",
    price: "$120/each", city: "Baidoa",
    image: u("1516467508483-a7212febe31a"),
    description: "Healthy goats, suitable for Eid or breeding.",
    provider: { name: "Bay Livestock", badge: "Verified Owner", rating: 4.6, reviews: 18, whatsapp: "252612347003", phone: "+252 61 234 7003" },
  },

  // JOBS
  {
    id: "j1", category: "jobs", title: "Senior Accountant", subtitle: "Finance · Full-time",
    price: "$800–1,200/mo", city: "Mogadishu",
    image: u("1554224155-6726b3ff858f"),
    description: "Leading firm hiring CPA-qualified accountant. 3+ years experience.",
    provider: { name: "Horn Consulting", badge: "Verified Business", rating: 4.7, reviews: 41, whatsapp: "252612348001", phone: "+252 61 234 8001" },
  },
  {
    id: "j2", category: "jobs", title: "Software Developer (React)", subtitle: "Tech · Remote OK",
    price: "$1,500–2,500/mo", city: "Mogadishu",
    image: u("1517694712202-14dd9538aa97"),
    description: "Build modern web apps. React, TypeScript, Node.",
    provider: { name: "Hormuud Tech", badge: "Verified Business", rating: 4.8, reviews: 88, whatsapp: "252612348002", phone: "+252 61 234 8002" },
  },
  {
    id: "j3", category: "jobs", title: "Customer Support Agent", subtitle: "Support · Full-time",
    price: "$400–600/mo", city: "Mogadishu",
    image: u("1556761175-5973dc0f32e7"),
    description: "Friendly support staff for telecom company. Somali + English.",
    provider: { name: "Telesom Careers", badge: "Verified Business", rating: 4.5, reviews: 60, whatsapp: "252612348003", phone: "+252 61 234 8003" },
  },

  // BANKING
  {
    id: "b1", category: "banking", title: "Salaam Somali Bank", subtitle: "Bank · Personal & SME",
    price: "Open account", city: "Mogadishu",
    image: u("1601597111158-2fceff292cdc"),
    description: "Sharia-compliant banking, savings, and SME financing.",
    provider: { name: "Salaam Bank", badge: "Verified Business", rating: 4.7, reviews: 980, whatsapp: "252612349001", phone: "+252 61 234 9001" },
  },
  {
    id: "b2", category: "banking", title: "Dahabshiil Money Transfer", subtitle: "Forex · Remittance",
    price: "Best rates", city: "Mogadishu",
    image: u("1565514020179-026b92b84bb6"),
    description: "Send and receive money across 150+ countries.",
    provider: { name: "Dahabshiil", badge: "Verified Business", rating: 4.8, reviews: 2100, whatsapp: "252612349002", phone: "+252 61 234 9002" },
  },
  {
    id: "b3", category: "banking", title: "Takaful Insurance Plans", subtitle: "Insurance · Health & Auto",
    price: "From $10/mo", city: "Mogadishu",
    image: u("1450101499163-c8848c66ca85"),
    description: "Affordable Sharia-compliant insurance plans.",
    provider: { name: "Takaful Somalia", badge: "Verified Business", rating: 4.6, reviews: 130, whatsapp: "252612349003", phone: "+252 61 234 9003" },
  },
];

export function listingsByCategory(key: CategoryKey): Listing[] {
  return LISTINGS.filter((l) => l.category === key);
}
