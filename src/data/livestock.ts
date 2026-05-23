import {
  Beef, Bird, Rabbit, Dog, ShieldCheck, Stethoscope,
  Wheat, Truck, FileCheck, type LucideIcon,
} from "lucide-react";

export interface AnimalType {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const ANIMAL_TYPES: AnimalType[] = [
  { key: "cattle", label: "Cattle", icon: Beef },
  { key: "goats", label: "Goats", icon: Beef },
  { key: "sheep", label: "Sheep", icon: Beef },
  { key: "poultry", label: "Poultry", icon: Bird },
  { key: "rabbits", label: "Rabbits", icon: Rabbit },
  { key: "camels", label: "Camels", icon: Beef },
  { key: "horses", label: "Horses", icon: Beef },
  { key: "pets", label: "Pets", icon: Dog },
];

export interface AnimalListing {
  id: string;
  title: string;
  type: string;
  price: number;
  currency: "USD";
  city: string;
  district: string;
  age: string;
  gender: "Male" | "Female";
  tag: string;
  image: string;
  featured?: boolean;
  sellerName: string;
  sellerVerified: boolean;
  whatsapp: string;
}

export const ANIMAL_LISTINGS: AnimalListing[] = [
  {
    id: "la-001",
    title: "Dairy Cow (Friesian)",
    type: "cattle",
    price: 850,
    currency: "USD",
    city: "Mogadishu",
    district: "Wadajir",
    age: "3 Years",
    gender: "Female",
    tag: "Milk Production",
    image: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&q=70",
    featured: true,
    sellerName: "Ahmed Hassan",
    sellerVerified: true,
    whatsapp: "252611234567",
  },
  {
    id: "la-002",
    title: "Boer Goat",
    type: "goats",
    price: 200,
    currency: "USD",
    city: "Mogadishu",
    district: "Hodan",
    age: "1.5 Years",
    gender: "Male",
    tag: "Breeding",
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&q=70",
    sellerName: "Mohamed Ali",
    sellerVerified: true,
    whatsapp: "252611234567",
  },
  {
    id: "la-003",
    title: "Fat-Tail Sheep",
    type: "sheep",
    price: 180,
    currency: "USD",
    city: "Mogadishu",
    district: "Shibis",
    age: "2 Years",
    gender: "Male",
    tag: "Meat Quality",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800&q=70",
    sellerName: "Yusuf Omar",
    sellerVerified: true,
    whatsapp: "252611234567",
  },
  {
    id: "la-004",
    title: "Local Chicken",
    type: "poultry",
    price: 15,
    currency: "USD",
    city: "Kismayo",
    district: "Central",
    age: "Adult",
    gender: "Female",
    tag: "Free Range",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=70",
    sellerName: "Hassan Farah",
    sellerVerified: false,
    whatsapp: "252611234567",
  },
  {
    id: "la-005",
    title: "Golden Retriever Puppy",
    type: "pets",
    price: 250,
    currency: "USD",
    city: "Hargeisa",
    district: "26 June",
    age: "3 Months",
    gender: "Male",
    tag: "Pet",
    image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=800&q=70",
    sellerName: "Ifrah Ahmed",
    sellerVerified: true,
    whatsapp: "252611234567",
  },
  {
    id: "la-006",
    title: "Somali Camel",
    type: "camels",
    price: 1200,
    currency: "USD",
    city: "Garowe",
    district: "Central",
    age: "5 Years",
    gender: "Female",
    tag: "Milk & Transport",
    image: "https://images.unsplash.com/photo-1580692474898-3b00f60b9c3d?w=800&q=70",
    sellerName: "Abdi Warsame",
    sellerVerified: true,
    whatsapp: "252611234567",
  },
];

export interface LivestockService {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: string;
}

export const LIVESTOCK_SERVICES: LivestockService[] = [
  { id: "ls-1", title: "Animal Health Services", subtitle: "Vaccination, Treatment", icon: Stethoscope, tone: "text-primary bg-primary/10" },
  { id: "ls-2", title: "Animal Feed & Nutrition", subtitle: "Quality Feed Supply", icon: Wheat, tone: "text-amber-600 bg-amber-100" },
  { id: "ls-3", title: "Veterinary Consultation", subtitle: "Expert Vet Advice", icon: Stethoscope, tone: "text-blue-600 bg-blue-100" },
  { id: "ls-4", title: "Transport Services", subtitle: "Safe Animal Transport", icon: Truck, tone: "text-purple-600 bg-purple-100" },
  { id: "ls-5", title: "Animal Insurance", subtitle: "Protect Your Livestock", icon: FileCheck, tone: "text-green-600 bg-green-100" },
  { id: "ls-6", title: "Verified Sellers", subtitle: "Trusted & Certified", icon: ShieldCheck, tone: "text-emerald-600 bg-emerald-100" },
];

export const LIVESTOCK_LOCATIONS = [
  { city: "Mogadishu", count: "120+", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=60" },
  { city: "Hargeisa", count: "85+", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=60" },
  { city: "Kismayo", count: "60+", image: "https://images.unsplash.com/photo-1523428096881-5bd79d043006?w=400&q=60" },
  { city: "Bosaso", count: "45+", image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=400&q=60" },
  { city: "Garowe", count: "30+", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=60" },
  { city: "Baidoa", count: "25+", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=60" },
];

