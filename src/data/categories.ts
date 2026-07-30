import {
  Home, Wrench, Plane, HeartPulse, BedDouble, Beef, Briefcase,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey =
  | "real-estate" | "services" | "travel" | "hotels" | "health"
  | "food" | "vehicles" | "livestock" | "jobs" | "banking";

export interface Category {
  key: CategoryKey;
  label: string;
  short: string;
  count: number;
  icon: LucideIcon;
  gradient: string;
  href: string;
}

export const CATEGORIES: Category[] = [
  { key: "real-estate", label: "Real Estate", short: "Houses, land & more", count: 1240, icon: Home, gradient: "grad-realestate", href: "/real-estate" },
  { key: "services", label: "Services", short: "Trusted local pros", count: 860, icon: Wrench, gradient: "grad-services", href: "/category/services" },
  { key: "travel", label: "Travel & Tourism", short: "Flights · Visa · Tours · Cars", count: 312, icon: Plane, gradient: "grad-travel", href: "/travel" },
  { key: "hotels", label: "Hotels", short: "Book rooms via WhatsApp", count: 156, icon: BedDouble, gradient: "grad-hotels", href: "/hotels" },
  { key: "health", label: "Health & Medical", short: "Hospitals & clinics", count: 198, icon: HeartPulse, gradient: "grad-health", href: "/health" },
  { key: "livestock", label: "Animal Market", short: "Buy & sell livestock", count: 370, icon: Beef, gradient: "grad-livestock", href: "/livestock" },
  { key: "jobs", label: "Jobs & Careers", short: "NGO · Government · Private", count: 240, icon: Briefcase, gradient: "grad-jobs", href: "/jobs" },
];
