import {
  Sunrise, UtensilsCrossed, Sandwich, Fish, Coffee, CakeSlice,
  type LucideIcon,
} from "lucide-react";

export interface MenuCategory {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  { key: "breakfast", label: "Breakfast", icon: Sunrise },
  { key: "main", label: "Main Dishes", icon: UtensilsCrossed },
  { key: "fastfood", label: "Fast Food", icon: Sandwich },
  { key: "seafood", label: "Seafood", icon: Fish },
  { key: "drinks", label: "Drinks", icon: Coffee },
  { key: "desserts", label: "Desserts", icon: CakeSlice },
];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  city: string;
  district: string;
  rating: number;
  reviews: number;
  deliveryFee: number;
  deliveryMins: string;
  minOrder: number;
  image: string;
  whatsapp: string;
  phone: string;
  verified?: boolean;
  featured?: boolean;
  menu: MenuItem[];
}

const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=70`;

const COMMON_MENU: MenuItem[] = [
  { id: "m-anjero", name: "Somali Anjero & Tea", description: "Traditional anjero with Somali tea", price: 3, category: "breakfast", image: img("photo-1590301157890-4810ed352733"), popular: true },
  { id: "m-malawax", name: "Malawax & Honey", description: "Malawax served with honey", price: 4, category: "breakfast", image: img("photo-1528207776546-365bb710ee93") },
  { id: "m-chapati", name: "Chapati & Liver", description: "Fresh chapati with beef liver", price: 5.5, category: "breakfast", image: img("photo-1565299624946-b28f40a0ae38") },
  { id: "m-omelette", name: "Omelette Breakfast", description: "Eggs, bread and salad", price: 4.5, category: "breakfast", image: img("photo-1482049016688-2d3e1b311543") },

  { id: "m-chickenbiryani", name: "Chicken Biryani", description: "Spiced rice with chicken", price: 8, category: "main", image: img("photo-1563379091339-03b21ab4a4f8"), popular: true },
  { id: "m-beefbiryani", name: "Beef Biryani", description: "Spiced rice with beef", price: 8.5, category: "main", image: img("photo-1565557623262-b51c2513a641") },
  { id: "m-grilledchicken", name: "Grilled Chicken", description: "Whole grilled chicken", price: 10, category: "main", image: img("photo-1598103442097-8b74394b95c6") },
  { id: "m-ricefish", name: "Rice & Fish", description: "Rice served with grilled fish", price: 9, category: "main", image: img("photo-1467003909585-2f8a72700288") },
  { id: "m-goat", name: "Rice & Goat Meat", description: "Somali bariis with goat meat", price: 9.5, category: "main", image: img("photo-1544025162-d76694265947"), popular: true },
  { id: "m-pasta", name: "Pasta with Chicken", description: "Pasta and grilled chicken", price: 7.5, category: "main", image: img("photo-1621996346565-e3dbc646d9a9") },

  { id: "m-beefburger", name: "Beef Burger", description: "Beef burger with fries", price: 6, category: "fastfood", image: img("photo-1568901346375-23c9450c58cd") },
  { id: "m-chickenburger", name: "Chicken Burger", description: "Chicken burger with fries", price: 6.5, category: "fastfood", image: img("photo-1606755962773-d324e0a13086") },
  { id: "m-shawarma", name: "Shawarma", description: "Chicken or beef shawarma", price: 4.5, category: "fastfood", image: img("photo-1633321702518-7feccafb94d5"), popular: true },
  { id: "m-fries", name: "French Fries", description: "Large fries", price: 2.5, category: "fastfood", image: img("photo-1573080496219-bb080dd4f877") },
  { id: "m-pizza", name: "Pizza Large", description: "Family size pizza", price: 12, category: "fastfood", image: img("photo-1513104890138-7c749659a591") },

  { id: "m-grilledfish", name: "Grilled Fish", description: "Fresh fish with salad", price: 10, category: "seafood", image: img("photo-1519708227418-c8fd9a32b7a2") },
  { id: "m-fishbiryani", name: "Fish Biryani", description: "Rice and fish", price: 9, category: "seafood", image: img("photo-1512058564366-18510be2db19") },
  { id: "m-shrimp", name: "Shrimp Platter", description: "Shrimp with rice", price: 12, category: "seafood", image: img("photo-1625943553852-781c6dd46faa") },

  { id: "m-tea", name: "Somali Tea", description: "Traditional shaah", price: 1, category: "drinks", image: img("photo-1544787219-7f47ccb76574") },
  { id: "m-coffee", name: "Coffee", description: "Fresh coffee", price: 1.5, category: "drinks", image: img("photo-1509042239860-f550ce710b93") },
  { id: "m-mango", name: "Fresh Mango Juice", description: "Natural juice", price: 2.5, category: "drinks", image: img("photo-1546173159-315724a31696"), popular: true },
  { id: "m-avocado", name: "Fresh Avocado Juice", description: "Natural juice", price: 3, category: "drinks", image: img("photo-1623065422902-30a2d299bbe4") },
  { id: "m-water", name: "Mineral Water 500ml", description: "Chilled bottle", price: 0.5, category: "drinks", image: img("photo-1616118132534-381148898bb4") },

  { id: "m-icecream", name: "Ice Cream", description: "Various flavors", price: 2.5, category: "desserts", image: img("photo-1567206563064-6f60f40a2b57") },
  { id: "m-cake", name: "Chocolate Cake", description: "Slice of chocolate cake", price: 3, category: "desserts", image: img("photo-1578985545062-69928b1d9587") },
  { id: "m-fruitsalad", name: "Fruit Salad", description: "Fresh seasonal fruits", price: 3.5, category: "desserts", image: img("photo-1564093497595-593b96d80180") },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r-001",
    name: "Beerlula Restaurant",
    tagline: "Good food, good mood",
    cuisine: "Somali · Grills",
    city: "Mogadishu",
    district: "Hodan",
    rating: 4.8,
    reviews: 412,
    deliveryFee: 1.5,
    deliveryMins: "25–35 min",
    minOrder: 5,
    image: img("photo-1517248135467-4c7edcad34c4"),
    whatsapp: "252611234567",
    phone: "+252611234567",
    verified: true,
    featured: true,
    menu: COMMON_MENU,
  },
  {
    id: "r-002",
    name: "Village Restaurant",
    tagline: "Fresh ingredients, great taste",
    cuisine: "Somali · Seafood",
    city: "Mogadishu",
    district: "Wadajir",
    rating: 4.6,
    reviews: 288,
    deliveryFee: 2,
    deliveryMins: "30–45 min",
    minOrder: 6,
    image: img("photo-1552566626-52f8b828add9"),
    whatsapp: "252612345678",
    phone: "+252612345678",
    verified: true,
    menu: COMMON_MENU.filter((m) => m.category !== "desserts"),
  },
  {
    id: "r-003",
    name: "Bake & Shake",
    tagline: "Fast food done right",
    cuisine: "Fast Food · Burgers",
    city: "Hargeisa",
    district: "Ahmed Dhagah",
    rating: 4.5,
    reviews: 197,
    deliveryFee: 1,
    deliveryMins: "20–30 min",
    minOrder: 4,
    image: img("photo-1571091718767-18b5b1457add"),
    whatsapp: "252613456789",
    phone: "+252613456789",
    featured: true,
    menu: COMMON_MENU.filter((m) => ["fastfood", "drinks", "desserts"].includes(m.category)),
  },
  {
    id: "r-004",
    name: "Blue Sea Kitchen",
    tagline: "Ocean fresh every day",
    cuisine: "Seafood",
    city: "Kismayo",
    district: "Central",
    rating: 4.7,
    reviews: 132,
    deliveryFee: 2.5,
    deliveryMins: "35–50 min",
    minOrder: 8,
    image: img("photo-1414235077428-338989a2e8c0"),
    whatsapp: "252614567890",
    phone: "+252614567890",
    verified: true,
    menu: COMMON_MENU.filter((m) => ["seafood", "main", "drinks"].includes(m.category)),
  },
  {
    id: "r-005",
    name: "Cafe Aroma",
    tagline: "Breakfast & coffee all day",
    cuisine: "Cafe · Breakfast",
    city: "Bosaso",
    district: "Central",
    rating: 4.4,
    reviews: 96,
    deliveryFee: 1.5,
    deliveryMins: "20–30 min",
    minOrder: 3,
    image: img("photo-1445116572660-236099ec97a0"),
    whatsapp: "252615678901",
    phone: "+252615678901",
    menu: COMMON_MENU.filter((m) => ["breakfast", "drinks", "desserts"].includes(m.category)),
  },
];

export const RESTAURANT_CITIES = ["Mogadishu", "Hargeisa", "Kismayo", "Bosaso"];

export function getRestaurant(id: string) {
  return RESTAURANTS.find((r) => r.id === id);
}
