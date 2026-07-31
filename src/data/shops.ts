import type { LucideIcon } from "lucide-react";
import {
  Wheat, Zap, Shirt, Stethoscope, Hammer, Sofa, Sparkles, ShoppingBasket,
} from "lucide-react";

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  inStock: number;
  popular?: boolean;
}

export interface ShopDepartment {
  key: string;
  label: string;
  icon: LucideIcon;
}

export interface Shop {
  id: string; // matches listing id in src/data/listings.ts
  name: string;
  tagline: string;
  type: string;
  city: string;
  district?: string;
  rating: number;
  reviews: number;
  deliveryFee: number;
  deliveryMins: string;
  minOrder: number;
  image: string;
  whatsapp: string;
  phone: string;
  verified?: boolean;
  departments: ShopDepartment[];
  products: ShopProduct[];
}

const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=70`;

const DEPTS: Record<string, ShopDepartment> = {
  groceries: { key: "groceries", label: "Groceries", icon: Wheat },
  household: { key: "household", label: "Household", icon: ShoppingBasket },
  electronics: { key: "electronics", label: "Electronics", icon: Zap },
  accessories: { key: "accessories", label: "Accessories", icon: Sparkles },
  clothing: { key: "clothing", label: "Clothing", icon: Shirt },
  pharmacy: { key: "pharmacy", label: "Medicine", icon: Stethoscope },
  hardware: { key: "hardware", label: "Hardware", icon: Hammer },
  furniture: { key: "furniture", label: "Furniture", icon: Sofa },
  beauty: { key: "beauty", label: "Beauty", icon: Sparkles },
};

const GROCERY: ShopProduct[] = [
  { id: "g-rice", name: "Basmati Rice 5kg", description: "Premium long grain rice", price: 9.5, unit: "bag", category: "groceries", image: img("photo-1586201375761-83865001e31c"), inStock: 40, popular: true },
  { id: "g-oil", name: "Cooking Oil 3L", description: "Sunflower cooking oil", price: 6.0, unit: "bottle", category: "groceries", image: img("photo-1474979266404-7eaacbcd87c5"), inStock: 25 },
  { id: "g-sugar", name: "Sugar 2kg", description: "White refined sugar", price: 2.5, unit: "pack", category: "groceries", image: img("photo-1581441363689-1f3c3c414635"), inStock: 60 },
  { id: "g-flour", name: "Wheat Flour 5kg", description: "All-purpose baking flour", price: 5.0, unit: "bag", category: "groceries", image: img("photo-1509440159596-0249088772ff"), inStock: 30 },
  { id: "g-tomato", name: "Fresh Tomatoes 1kg", description: "Locally farmed tomatoes", price: 1.2, unit: "kg", category: "groceries", image: img("photo-1546094096-0df4bcaaa337"), inStock: 80, popular: true },
  { id: "g-banana", name: "Bananas 1kg", description: "Sweet ripe bananas", price: 1.0, unit: "kg", category: "groceries", image: img("photo-1571771894821-ce9b6c11b08e"), inStock: 70 },
  { id: "g-soap", name: "Laundry Soap 4-pack", description: "Strong stain removal", price: 3.2, unit: "pack", category: "household", image: img("photo-1585421514738-01798e348b17"), inStock: 45 },
  { id: "g-tissue", name: "Tissue Rolls 10-pack", description: "Soft 2-ply tissue", price: 4.0, unit: "pack", category: "household", image: img("photo-1584556812952-905ffd0c611a"), inStock: 35 },
];

const ELECTRONICS: ShopProduct[] = [
  { id: "e-phone", name: "Smartphone 128GB", description: "Dual SIM, 6.6\" display, 1-year warranty", price: 189, unit: "unit", category: "electronics", image: img("photo-1511707171634-5f897ff02aa9"), inStock: 12, popular: true },
  { id: "e-tv", name: 'Smart TV 43"', description: "Full HD LED with WiFi apps", price: 245, unit: "unit", category: "electronics", image: img("photo-1593359677879-a4bb92f829d1"), inStock: 6 },
  { id: "e-laptop", name: "Laptop Core i5", description: "8GB RAM, 256GB SSD", price: 430, unit: "unit", category: "electronics", image: img("photo-1496181133206-80ce9b88a853"), inStock: 4 },
  { id: "e-solar", name: "Solar Power Bank", description: "20,000mAh with torch", price: 28, unit: "unit", category: "electronics", image: img("photo-1609592424577-8b6b1b1a1a1a"), inStock: 22 },
  { id: "e-earbuds", name: "Wireless Earbuds", description: "Bluetooth 5.3, charging case", price: 19, unit: "pair", category: "accessories", image: img("photo-1590658268037-6bf12165a8df"), inStock: 40, popular: true },
  { id: "e-charger", name: "Fast Charger 25W", description: "USB-C fast charging adapter", price: 9, unit: "unit", category: "accessories", image: img("photo-1583863788434-e58a36330cf0"), inStock: 55 },
];

const CLOTHING: ShopProduct[] = [
  { id: "c-abaya", name: "Embroidered Abaya", description: "Premium fabric, free size", price: 35, unit: "piece", category: "clothing", image: img("photo-1594633312681-425c7b97ccd1"), inStock: 18, popular: true },
  { id: "c-dirac", name: "Somali Dirac Set", description: "Traditional dirac with garbasaar", price: 45, unit: "set", category: "clothing", image: img("photo-1595777457583-95e059d581b8"), inStock: 10 },
  { id: "c-shirt", name: "Men's Cotton Shirt", description: "Slim fit, sizes S–XXL", price: 14, unit: "piece", category: "clothing", image: img("photo-1602810318383-e386cc2a3ccf"), inStock: 30 },
  { id: "c-kids", name: "Kids Outfit Set", description: "2-piece set, ages 2–10", price: 12, unit: "set", category: "clothing", image: img("photo-1519238263530-99bdd11df2ea"), inStock: 25 },
  { id: "c-shoes", name: "Leather Sandals", description: "Handmade, sizes 39–45", price: 22, unit: "pair", category: "accessories", image: img("photo-1603487742131-4160ec999306"), inStock: 20 },
  { id: "c-scarf", name: "Silk Hijab Scarf", description: "Assorted colours", price: 8, unit: "piece", category: "accessories", image: img("photo-1601924994987-69e26d50dc26"), inStock: 60 },
];

const PHARMACY: ShopProduct[] = [
  { id: "p-para", name: "Paracetamol 500mg", description: "Pack of 20 tablets", price: 1.5, unit: "pack", category: "pharmacy", image: img("photo-1584308666744-24d5c474f2ae"), inStock: 120, popular: true },
  { id: "p-amox", name: "Amoxicillin 500mg", description: "Pack of 12 capsules (prescription)", price: 4.5, unit: "pack", category: "pharmacy", image: img("photo-1587854692152-cbe660dbde88"), inStock: 60 },
  { id: "p-ors", name: "ORS Rehydration Salts", description: "Box of 10 sachets", price: 2.0, unit: "box", category: "pharmacy", image: img("photo-1471864190281-a93a3070b6de"), inStock: 90 },
  { id: "p-vitc", name: "Vitamin C 1000mg", description: "30 effervescent tablets", price: 5.5, unit: "tube", category: "pharmacy", image: img("photo-1550572017-edd951aa8f72"), inStock: 40 },
  { id: "p-bp", name: "Blood Pressure Monitor", description: "Digital arm monitor", price: 26, unit: "unit", category: "pharmacy", image: img("photo-1576091160399-112ba8d25d1d"), inStock: 8 },
  { id: "p-diaper", name: "Baby Diapers (Medium)", description: "Pack of 40", price: 11, unit: "pack", category: "household", image: img("photo-1515488042361-ee00e0ddd4e4"), inStock: 35 },
];

const HARDWARE: ShopProduct[] = [
  { id: "h-cement", name: "Cement 50kg", description: "Portland cement bag", price: 8.5, unit: "bag", category: "hardware", image: img("photo-1503387762-592deb58ef4e"), inStock: 200, popular: true },
  { id: "h-paint", name: "Wall Paint 20L", description: "Interior emulsion, white", price: 42, unit: "bucket", category: "hardware", image: img("photo-1562259949-e8e7689d7828"), inStock: 15 },
  { id: "h-pipe", name: "PVC Pipe 3m", description: "Ø 32mm water pipe", price: 4.5, unit: "piece", category: "hardware", image: img("photo-1581092160562-40aa08e78837"), inStock: 120 },
  { id: "h-drill", name: "Electric Drill 650W", description: "Hammer drill with bits", price: 55, unit: "unit", category: "hardware", image: img("photo-1504148455328-c376907d081c"), inStock: 9 },
  { id: "h-cable", name: "Electric Cable 100m", description: "2.5mm copper roll", price: 68, unit: "roll", category: "hardware", image: img("photo-1521224616346-91bbb3d0138b"), inStock: 11 },
];

const FURNITURE: ShopProduct[] = [
  { id: "f-sofa", name: "5-Seater Sofa Set", description: "Fabric sofa with cushions", price: 480, unit: "set", category: "furniture", image: img("photo-1555041469-a586c61ea9bc"), inStock: 5, popular: true },
  { id: "f-bed", name: "Queen Bed Frame", description: "Solid wood with headboard", price: 260, unit: "unit", category: "furniture", image: img("photo-1505693416388-ac5ce068fe85"), inStock: 7 },
  { id: "f-dining", name: "Dining Table + 6 Chairs", description: "Wooden dining set", price: 390, unit: "set", category: "furniture", image: img("photo-1617806118233-18e1de247200"), inStock: 4 },
  { id: "f-desk", name: "Office Desk", description: "1.2m desk with drawers", price: 130, unit: "unit", category: "furniture", image: img("photo-1524758631624-e2822e304c36"), inStock: 12 },
  { id: "f-mattress", name: "Foam Mattress", description: "Queen size, 20cm thick", price: 145, unit: "unit", category: "furniture", image: img("photo-1631049307264-da0ec9d70304"), inStock: 10 },
];

const BEAUTY: ShopProduct[] = [
  { id: "b-oud", name: "Oud Perfume 100ml", description: "Long-lasting oriental oud", price: 32, unit: "bottle", category: "beauty", image: img("photo-1541643600914-78b084683601"), inStock: 20, popular: true },
  { id: "b-lotion", name: "Body Lotion 400ml", description: "Shea butter moisturiser", price: 7.5, unit: "bottle", category: "beauty", image: img("photo-1556228720-195a672e8a03"), inStock: 45 },
  { id: "b-makeup", name: "Makeup Kit", description: "Palette, brushes and gloss", price: 24, unit: "kit", category: "beauty", image: img("photo-1596462502278-27bfdc403348"), inStock: 15 },
  { id: "b-hair", name: "Hair Oil 200ml", description: "Coconut & argan blend", price: 6, unit: "bottle", category: "beauty", image: img("photo-1608248543803-ba4f8c70ae0b"), inStock: 50 },
  { id: "b-henna", name: "Henna Cone Pack", description: "Pack of 6 cones", price: 4.5, unit: "pack", category: "beauty", image: img("photo-1595475207225-428b62bda831"), inStock: 60 },
];

const deptsFor = (products: ShopProduct[]) => {
  const keys = Array.from(new Set(products.map((p) => p.category)));
  return keys.map((k) => DEPTS[k]).filter(Boolean);
};

const shop = (s: Omit<Shop, "departments">): Shop => ({ ...s, departments: deptsFor(s.products) });

export const SHOPS: Shop[] = [
  shop({
    id: "sh1", name: "Bakaaraha Fresh Market", tagline: "Fresh produce & daily basics",
    type: "Groceries", city: "Mogadishu", district: "Howlwadaag",
    rating: 4.7, reviews: 340, deliveryFee: 1.5, deliveryMins: "30–45 min", minOrder: 5,
    image: img("photo-1542838132-92c53300491e"), whatsapp: "252615550101", phone: "+252 61 555 0101",
    verified: true, products: GROCERY,
  }),
  shop({
    id: "sh2", name: "Hodan Electronics Center", tagline: "Phones, TVs & accessories",
    type: "Electronics", city: "Mogadishu", district: "Hodan",
    rating: 4.6, reviews: 218, deliveryFee: 2, deliveryMins: "1–2 hrs", minOrder: 10,
    image: img("photo-1498049794561-7780e7231661"), whatsapp: "252615550102", phone: "+252 61 555 0102",
    verified: true, products: ELECTRONICS,
  }),
  shop({
    id: "sh3", name: "Nuur Fashion House", tagline: "New arrivals every week",
    type: "Clothing", city: "Hargeisa", district: "Ahmed Dhagah",
    rating: 4.8, reviews: 176, deliveryFee: 2, deliveryMins: "Same day", minOrder: 10,
    image: img("photo-1441986300917-64674bd600d8"), whatsapp: "252634440103", phone: "+252 63 444 0103",
    verified: true, products: CLOTHING,
  }),
  shop({
    id: "sh4", name: "Shifo Pharmacy & Health Store", tagline: "Open 24/7 · fast delivery",
    type: "Pharmacy", city: "Mogadishu", district: "Wadajir",
    rating: 4.9, reviews: 402, deliveryFee: 1, deliveryMins: "20–40 min", minOrder: 3,
    image: img("photo-1587854692152-cbe660dbde88"), whatsapp: "252615550104", phone: "+252 61 555 0104",
    verified: true, products: PHARMACY,
  }),
  shop({
    id: "sh5", name: "Barwaaqo Hardware Supplies", tagline: "Wholesale building supplies",
    type: "Hardware", city: "Bosaso",
    rating: 4.5, reviews: 121, deliveryFee: 5, deliveryMins: "Same day", minOrder: 20,
    image: img("photo-1581092160562-40aa08e78837"), whatsapp: "252905550105", phone: "+252 90 555 0105",
    products: HARDWARE,
  }),
  shop({
    id: "sh6", name: "Hoyga Furniture Gallery", tagline: "Free city delivery",
    type: "Furniture", city: "Mogadishu", district: "Kaxda",
    rating: 4.6, reviews: 94, deliveryFee: 0, deliveryMins: "1–3 days", minOrder: 50,
    image: img("photo-1555041469-a586c61ea9bc"), whatsapp: "252615550106", phone: "+252 61 555 0106",
    products: FURNITURE,
  }),
  shop({
    id: "sh7", name: "Qurux Beauty Shop", tagline: "Cosmetics, oud & skincare",
    type: "Beauty", city: "Hargeisa",
    rating: 4.7, reviews: 158, deliveryFee: 1.5, deliveryMins: "Same day", minOrder: 5,
    image: img("photo-1596462502278-27bfdc403348"), whatsapp: "252634440107", phone: "+252 63 444 0107",
    products: BEAUTY,
  }),
  shop({
    id: "sh8", name: "Kismayo Mini Supermarket", tagline: "Everyday low prices",
    type: "Groceries", city: "Kismayo",
    rating: 4.4, reviews: 87, deliveryFee: 1.5, deliveryMins: "30–60 min", minOrder: 5,
    image: img("photo-1604719312566-8912e9227c6a"), whatsapp: "252615550108", phone: "+252 61 555 0108",
    products: [...GROCERY, ...BEAUTY.slice(0, 3)],
  }),
];

export function getShop(id: string) {
  return SHOPS.find((s) => s.id === id);
}
