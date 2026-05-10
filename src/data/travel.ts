import {
  Plane,
  ShieldCheck,
  MessageCircle,
  Phone,
  Mail,
  Star,
  Search,
  Users,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const routes = [
  {
    route: "MGQ → NBO",
    price: "$250",
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
  },
  {
    route: "MGQ → DXB",
    price: "$280",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  },
  {
    route: "MGQ → IST",
    price: "$320",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
  },
  {
    route: "MGQ → JED",
    price: "$310",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
];

const agencies = [
  {
    name: "Skyway Travel & Tours",
    rating: 4.7,
    price: "$250",
  },
  {
    name: "Al-Barakah Travels",
    rating: 4.5,
    price: "$245",
  },
  {
    name: "Somali Sky Travel",
    rating: 4.3,
    price: "$255",
  },
  {
    name: "Horizon Travel Agency",
    rating: 4.2,
    price: "$260",
  },
];

export default function FlightsDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* LEFT SIDEBAR */}
        <div className="xl:col-span-3 bg-white rounded-3xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Plane />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">
}