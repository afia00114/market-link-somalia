export type PropertySub =
  | "Houses" | "Apartments" | "Villas" | "Land" | "Shops"
  | "Offices" | "Warehouses" | "Commercial Buildings" | "Hotels" | "Farms";

export type Deal = "Buy" | "Rent";

export interface Property {
  id: string;
  title: string;
  sub: PropertySub;
  deal: Deal;
  price: number;
  priceUnit?: "month";
  city: string;
  district: string;
  beds: number;
  baths: number;
  area: number; // m²
  parking: boolean;
  furnished: boolean;
  status: "Available" | "Sold" | "Rented" | "Reserved" | "Under Construction";
  image: string;
  images: string[];
  description: string;
  agent: {
    name: string;
    company: string;
    verified: true;
    badge: "Verified Agent" | "Verified Agency" | "Verified Developer" | "Verified Owner";
    avatar: string;
    whatsapp: string; // E.164 without +
    phone: string;
    rating: number;
    reviews: number;
  };
}

const img = (id: number, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const HOUSE_1 = "1568605114967-8130f3a36994";
const HOUSE_2 = "1572120360610-d971b9d7767c";
const HOUSE_3 = "1600585154340-be6161a56a0c";
const APT_1 = "1545324418-cc1a3fa10c00";
const VILLA_1 = "1613490493576-7fde63acd811";
const LAND_1 = "1500382017468-9049fed747ef";
const SHOP_1 = "1555529669-e69e7aa0ba9a";

export const PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "3 Bedroom House in Hodan",
    sub: "Houses", deal: "Buy", price: 60000,
    city: "Mogadishu", district: "Hodan",
    beds: 3, baths: 2, area: 180, parking: true, furnished: false,
    status: "Available",
    image: img(HOUSE_1.replace("photo-","") as unknown as number),
    images: [HOUSE_1, HOUSE_2, HOUSE_3].map(i => `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=1400&q=80`),
    description: "Beautiful 3 bedroom house in Hodan district. Spacious rooms, modern finishes, secure compound with parking.",
    agent: {
      name: "Ahmed Yusuf", company: "Hodan Realty", verified: true, badge: "Verified Agent",
      avatar: `https://i.pravatar.cc/120?img=12`,
      whatsapp: "252612345678", phone: "+252 61 234 5678", rating: 4.8, reviews: 124,
    },
  },
  {
    id: "p2",
    title: "2 Bedroom Apartment, Wadajir",
    sub: "Apartments", deal: "Rent", price: 450, priceUnit: "month",
    city: "Mogadishu", district: "Wadajir",
    beds: 2, baths: 1, area: 95, parking: false, furnished: true,
    status: "Available",
    image: `https://images.unsplash.com/photo-${APT_1}?auto=format&fit=crop&w=1400&q=80`,
    images: [APT_1, HOUSE_2].map(i => `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=1400&q=80`),
    description: "Furnished apartment with sea breeze, walking distance to shops and schools.",
    agent: {
      name: "Hodan Estates", company: "Hodan Estates", verified: true, badge: "Verified Agency",
      avatar: `https://i.pravatar.cc/120?img=32`,
      whatsapp: "252615550101", phone: "+252 61 555 0101", rating: 4.6, reviews: 88,
    },
  },
  {
    id: "p3",
    title: "Villa with Pool, Jazeera",
    sub: "Villas", deal: "Buy", price: 180000,
    city: "Mogadishu", district: "Jazeera",
    beds: 5, baths: 4, area: 420, parking: true, furnished: true,
    status: "Available",
    image: `https://images.unsplash.com/photo-${VILLA_1}?auto=format&fit=crop&w=1400&q=80`,
    images: [VILLA_1, HOUSE_3, HOUSE_1].map(i => `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=1400&q=80`),
    description: "Luxury beachfront villa with private pool, garden, and staff quarters.",
    agent: {
      name: "Coastline Developers", company: "Coastline Developers", verified: true, badge: "Verified Developer",
      avatar: `https://i.pravatar.cc/120?img=58`,
      whatsapp: "252617778899", phone: "+252 61 777 8899", rating: 4.9, reviews: 56,
    },
  },
  {
    id: "p4",
    title: "Modern House, Karaan",
    sub: "Houses", deal: "Buy", price: 55000,
    city: "Mogadishu", district: "Karaan",
    beds: 4, baths: 3, area: 220, parking: true, furnished: false,
    status: "Available",
    image: `https://images.unsplash.com/photo-${HOUSE_3}?auto=format&fit=crop&w=1400&q=80`,
    images: [HOUSE_3, HOUSE_2].map(i => `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=1400&q=80`),
    description: "Newly built family home with modern kitchen and rooftop terrace.",
    agent: {
      name: "Karaan Properties", company: "Karaan Properties", verified: true, badge: "Verified Agency",
      avatar: `https://i.pravatar.cc/120?img=14`,
      whatsapp: "252619991122", phone: "+252 61 999 1122", rating: 4.7, reviews: 41,
    },
  },
  {
    id: "p5",
    title: "Land for Sale, Afgoye",
    sub: "Land", deal: "Buy", price: 25000,
    city: "Shabelle", district: "Afgoye",
    beds: 0, baths: 0, area: 1200, parking: false, furnished: false,
    status: "Available",
    image: `https://images.unsplash.com/photo-${LAND_1}?auto=format&fit=crop&w=1400&q=80`,
    images: [LAND_1].map(i => `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=1400&q=80`),
    description: "Fertile agricultural land near main road, suitable for farming or development.",
    agent: {
      name: "Cabdi Owner", company: "Authorized Owner", verified: true, badge: "Verified Owner",
      avatar: `https://i.pravatar.cc/120?img=22`,
      whatsapp: "252612001122", phone: "+252 61 200 1122", rating: 4.5, reviews: 12,
    },
  },
  {
    id: "p6",
    title: "Retail Shop, Bakara",
    sub: "Shops", deal: "Rent", price: 800, priceUnit: "month",
    city: "Mogadishu", district: "Bakara",
    beds: 0, baths: 1, area: 60, parking: false, furnished: false,
    status: "Available",
    image: `https://images.unsplash.com/photo-${SHOP_1}?auto=format&fit=crop&w=1400&q=80`,
    images: [SHOP_1].map(i => `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=1400&q=80`),
    description: "Prime location retail shop in busy Bakara market.",
    agent: {
      name: "Bakara Realty", company: "Bakara Realty", verified: true, badge: "Verified Agency",
      avatar: `https://i.pravatar.cc/120?img=45`,
      whatsapp: "252613334455", phone: "+252 61 333 4455", rating: 4.4, reviews: 33,
    },
  },
];

export const REAL_ESTATE_SUBS: { label: PropertySub; emoji: string }[] = [
  { label: "Houses", emoji: "🏠" },
  { label: "Apartments", emoji: "🏢" },
  { label: "Villas", emoji: "🏡" },
  { label: "Land", emoji: "🌳" },
  { label: "Shops", emoji: "🛍️" },
  { label: "Offices", emoji: "🏬" },
  { label: "Warehouses", emoji: "🏭" },
  { label: "Commercial Buildings", emoji: "🏛️" },
  { label: "Hotels", emoji: "🏨" },
  { label: "Farms", emoji: "🌾" },
];
