export interface Room {
  id: string;
  name: string;
  pricePerNight: number;
  guests: number;
  bed: string;
  image: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  region: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  verified: boolean;
  featured?: boolean;
  image: string;
  gallery: string[];
  about: string;
  amenities: string[];
  rooms: Room[];
  phone: string;
  whatsapp: string;
  tags?: ("near-me" | "top-rated" | "featured")[];
}

const img = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=800&q=70&auto=format&fit=crop`;

export const HOTELS: Hotel[] = [
  {
    id: "jazeera-palace",
    name: "Jazeera Palace Hotel",
    city: "Mogadishu",
    region: "Banaadir",
    rating: 4.6,
    reviews: 124,
    pricePerNight: 80,
    verified: true,
    featured: true,
    image: img("1566073771259-6a8506099945"),
    gallery: [
      img("1566073771259-6a8506099945"),
      img("1611892440504-42a792e24d32"),
      img("1582719478250-c89cae4dc85b"),
      img("1551882547-ff40c63fe5fa"),
    ],
    about:
      "Jazeera Palace Hotel offers a comfortable stay with excellent hospitality, modern facilities and a beautiful view of the ocean.",
    amenities: ["Free WiFi", "Pool", "Breakfast", "Airport Pickup", "Restaurant", "Parking", "Gym", "Laundry", "24/7 Reception"],
    rooms: [
      { id: "deluxe", name: "Deluxe Room", pricePerNight: 80, guests: 2, bed: "King Bed", image: img("1611892440504-42a792e24d32") },
      { id: "standard", name: "Standard Room", pricePerNight: 60, guests: 2, bed: "Queen Bed", image: img("1582719478250-c89cae4dc85b") },
      { id: "family", name: "Family Suite", pricePerNight: 120, guests: 4, bed: "2 Beds", image: img("1551882547-ff40c63fe5fa") },
    ],
    phone: "+252611234567",
    whatsapp: "252611234567",
    tags: ["featured", "top-rated"],
  },
  {
    id: "syl-hotel",
    name: "SYL Hotel & Resort",
    city: "Mogadishu",
    region: "Banaadir",
    rating: 4.4,
    reviews: 88,
    pricePerNight: 65,
    verified: true,
    image: img("1564501049412-61c2a3083791"),
    gallery: [img("1564501049412-61c2a3083791"), img("1542314831-068cd1dbfeeb")],
    about: "Modern resort hotel near the city center with full amenities and friendly staff.",
    amenities: ["Free WiFi", "Pool", "Breakfast", "Restaurant", "Parking"],
    rooms: [
      { id: "standard", name: "Standard Room", pricePerNight: 65, guests: 2, bed: "Queen Bed", image: img("1611892440504-42a792e24d32") },
      { id: "deluxe", name: "Deluxe Room", pricePerNight: 95, guests: 2, bed: "King Bed", image: img("1582719478250-c89cae4dc85b") },
    ],
    phone: "+252612345678",
    whatsapp: "252612345678",
    tags: ["top-rated"],
  },
  {
    id: "maansoor-hotel",
    name: "Maansoor Hotel",
    city: "Hargeisa",
    region: "Maroodi Jeex",
    rating: 4.2,
    reviews: 63,
    pricePerNight: 50,
    verified: true,
    image: img("1571896349842-33c89424de2d"),
    gallery: [img("1571896349842-33c89424de2d")],
    about: "Comfortable hotel in Hargeisa with great service and central location.",
    amenities: ["Free WiFi", "Breakfast", "Restaurant", "24/7 Reception"],
    rooms: [
      { id: "standard", name: "Standard Room", pricePerNight: 50, guests: 2, bed: "Queen Bed", image: img("1611892440504-42a792e24d32") },
    ],
    phone: "+252634567890",
    whatsapp: "252634567890",
    tags: ["near-me"],
  },
];

export function getHotel(id: string) {
  return HOTELS.find((h) => h.id === id);
}
