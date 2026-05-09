import {
  Heart, Brain, Bone, Baby, Activity, Smile, Stethoscope, Eye, Pill, FlaskConical,
  type LucideIcon,
} from "lucide-react";

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface Department {
  key: string;
  label: string;
  icon: LucideIcon;
  tone: string; // text color class
}

export const DEPARTMENTS: Department[] = [
  { key: "cardiology", label: "Cardiology", icon: Heart, tone: "text-rose-500" },
  { key: "neurology", label: "Neurology", icon: Brain, tone: "text-purple-500" },
  { key: "orthopedics", label: "Orthopedics", icon: Bone, tone: "text-sky-500" },
  { key: "pediatrics", label: "Pediatrics", icon: Baby, tone: "text-emerald-500" },
  { key: "gynecology", label: "Gynecology", icon: Activity, tone: "text-pink-500" },
  { key: "dental", label: "Dental", icon: Smile, tone: "text-cyan-500" },
  { key: "general", label: "General Surgery", icon: Stethoscope, tone: "text-indigo-500" },
  { key: "eye", label: "Eye Care", icon: Eye, tone: "text-blue-500" },
];

export interface HealthPackage {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}

export const HEALTH_PACKAGES: HealthPackage[] = [
  { id: "hp1", title: "Full Body Checkup", price: "$60", description: "Complete health screening", icon: Heart, tone: "bg-rose-100 text-rose-600" },
  { id: "hp2", title: "Diabetes Care Package", price: "$45", description: "Consultation + Tests", icon: FlaskConical, tone: "bg-emerald-100 text-emerald-600" },
  { id: "hp3", title: "Cardiac Screening", price: "$75", description: "ECG, Consultation, Tests", icon: Activity, tone: "bg-purple-100 text-purple-600" },
  { id: "hp4", title: "Maternal Care", price: "$90", description: "Prenatal checkup & ultrasound", icon: Baby, tone: "bg-pink-100 text-pink-600" },
];

export interface Hospital {
  id: string;
  name: string;
  type: string; // e.g. Multi-Specialty Hospital
  rating: number;
  reviews: number;
  district: string;
  city: string;
  image: string;
  gallery?: string[];
  verified: boolean;
  open24: boolean;
  services: string[];
  departments: string[]; // department keys
  about: string;
  whatsapp: string;
  phone: string;
  email: string;
}

export const HOSPITALS: Hospital[] = [
  {
    id: "mogadishu-turkish",
    name: "Mogadishu Turkish Hospital",
    type: "Multi-Specialty Hospital",
    rating: 4.6,
    reviews: 128,
    district: "Wadajir",
    city: "Mogadishu",
    image: u("1586773860418-d37222d8fce3"),
    gallery: [u("1586773860418-d37222d8fce3"), u("1538108149393-fbbd81895907"), u("1519494026892-80bbd2d6fd0d")],
    verified: true,
    open24: true,
    services: ["24/7 Emergency", "Pharmacy", "Laboratory", "ICU"],
    departments: ["cardiology", "neurology", "orthopedics", "pediatrics", "general", "dental"],
    about: "Mogadishu Turkish Hospital is a leading healthcare institution providing world-class medical services with modern facilities and experienced specialists.",
    whatsapp: "252611234567",
    phone: "+252 61 123 4567",
    email: "info@turkishhospital.so",
  },
  {
    id: "benadir-hospital",
    name: "Benadir Hospital",
    type: "Multi-Specialty Hospital",
    rating: 4.4,
    reviews: 96,
    district: "Hodan",
    city: "Mogadishu",
    image: u("1538108149393-fbbd81895907"),
    gallery: [u("1538108149393-fbbd81895907"), u("1519494026892-80bbd2d6fd0d")],
    verified: true,
    open24: true,
    services: ["Emergency", "Radiology", "Pharmacy", "Lab"],
    departments: ["pediatrics", "gynecology", "general", "orthopedics"],
    about: "Benadir Hospital offers compassionate, comprehensive care with a focus on women and children's health.",
    whatsapp: "252612345678",
    phone: "+252 61 234 5678",
    email: "contact@benadir.so",
  },
  {
    id: "somali-national",
    name: "Somali National Hospital",
    type: "Government Hospital",
    rating: 4.2,
    reviews: 78,
    district: "Shibis",
    city: "Mogadishu",
    image: u("1519494026892-80bbd2d6fd0d"),
    verified: true,
    open24: true,
    services: ["Emergency", "Maternity", "Lab", "Pharmacy"],
    departments: ["general", "gynecology", "pediatrics"],
    about: "The Somali National Hospital provides accessible public healthcare across a wide range of specialties.",
    whatsapp: "252613456789",
    phone: "+252 61 345 6789",
    email: "info@snh.gov.so",
  },
  {
    id: "medipark",
    name: "Medipark General Hospital",
    type: "Multi-Specialty Hospital",
    rating: 4.7,
    reviews: 540,
    district: "Hodan",
    city: "Mogadishu",
    image: u("1504439468489-c8920d796a29"),
    verified: true,
    open24: true,
    services: ["24/7 ER", "Maternity", "Surgery", "Pharmacy"],
    departments: ["cardiology", "neurology", "general", "orthopedics", "eye"],
    about: "Medipark is a multi-specialty hospital with emergency, maternity and advanced surgical services.",
    whatsapp: "252618889900",
    phone: "+252 61 888 9900",
    email: "info@medipark.so",
  },
  {
    id: "alshifa-clinic",
    name: "AlShifa Specialist Clinic",
    type: "Specialist Clinic",
    rating: 4.6,
    reviews: 220,
    district: "Bakara",
    city: "Mogadishu",
    image: u("1631815588090-d4bfec5b1ccb"),
    verified: true,
    open24: false,
    services: ["Pharmacy", "Lab", "Consultation"],
    departments: ["dental", "eye", "general"],
    about: "AlShifa offers specialist outpatient care with on-site pharmacy and lab.",
    whatsapp: "252611112233",
    phone: "+252 61 111 2233",
    email: "hello@alshifa.so",
  },
];

export const POPULAR_LOCATIONS = [
  { city: "Mogadishu", count: 45, image: u("1582034986517-30d4e4b6d7e9") },
  { city: "Hargeisa", count: 18, image: u("1543353071-873f17a7a088") },
  { city: "Kismayo", count: 12, image: u("1502602898657-3e91760cbb34") },
  { city: "Bosaso", count: 8, image: u("1518684079-3c830dcef090") },
  { city: "Garowe", count: 7, image: u("1519677100203-a0e668c92439") },
];

export function getHospital(id: string) {
  return HOSPITALS.find((h) => h.id === id);
}
