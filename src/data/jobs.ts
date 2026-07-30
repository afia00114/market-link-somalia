import {
  HeartHandshake, Landmark, Building2, GraduationCap, Stethoscope,
  Laptop, Truck, Wallet, type LucideIcon,
} from "lucide-react";

export type JobSectorKey = "ngo" | "government" | "private";

export interface JobSector {
  key: JobSectorKey;
  label: string;
  short: string;
  icon: LucideIcon;
  tone: string;
}

export const JOB_SECTORS: JobSector[] = [
  {
    key: "ngo",
    label: "NGO / INGO",
    short: "Humanitarian & development roles",
    icon: HeartHandshake,
    tone: "bg-[hsl(142_60%_94%)] text-[hsl(142_70%_32%)]",
  },
  {
    key: "government",
    label: "Government",
    short: "Ministries, agencies & public service",
    icon: Landmark,
    tone: "bg-primary-soft text-primary",
  },
  {
    key: "private",
    label: "Private Sector",
    short: "Companies, banks, telecom & retail",
    icon: Building2,
    tone: "bg-[hsl(35_90%_94%)] text-[hsl(30_90%_40%)]",
  },
];

export const JOB_CATEGORIES: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "admin", label: "Admin & HR", icon: Building2 },
  { key: "health", label: "Health", icon: Stethoscope },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "it", label: "IT & Tech", icon: Laptop },
  { key: "finance", label: "Finance", icon: Wallet },
  { key: "logistics", label: "Logistics", icon: Truck },
];

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Volunteer";

export interface JobListing {
  id: string;
  title: string;
  organisation: string;
  sector: JobSectorKey;
  category: string;
  type: JobType;
  city: string;
  salary?: string;
  deadline: string;
  posted: string;
  verified: boolean;
  featured?: boolean;
  logoText: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  applyEmail: string;
  whatsapp: string;
}

export const JOB_LOCATIONS = [
  "Mogadishu", "Hargeisa", "Garowe", "Kismayo", "Baidoa", "Bosaso",
];

export const JOB_LISTINGS: JobListing[] = [
  {
    id: "jb-001",
    title: "Field Health Coordinator",
    organisation: "Somali Relief Foundation",
    sector: "ngo",
    category: "health",
    type: "Full-time",
    city: "Mogadishu",
    salary: "$1,200 – $1,600 / month",
    deadline: "2026-08-30",
    posted: "2 days ago",
    verified: true,
    featured: true,
    logoText: "SRF",
    summary:
      "Lead community health programmes across Banadir region, supervise field teams and report to donors.",
    responsibilities: [
      "Supervise mobile health teams and clinics",
      "Prepare weekly and monthly donor reports",
      "Coordinate with the Ministry of Health and partners",
    ],
    requirements: [
      "Bachelor's degree in Public Health or Medicine",
      "3+ years NGO field experience",
      "Fluent Somali and English",
    ],
    applyEmail: "jobs@srf.org",
    whatsapp: "252611234567",
  },
  {
    id: "jb-002",
    title: "Procurement Officer",
    organisation: "Ministry of Planning",
    sector: "government",
    category: "finance",
    type: "Full-time",
    city: "Mogadishu",
    salary: "Government scale",
    deadline: "2026-09-10",
    posted: "5 days ago",
    verified: true,
    featured: true,
    logoText: "MoP",
    summary:
      "Manage public procurement processes in line with national procurement law and donor requirements.",
    responsibilities: [
      "Prepare tender documents and evaluation reports",
      "Maintain supplier records and contracts",
      "Ensure compliance with procurement regulations",
    ],
    requirements: [
      "Degree in Business, Finance or related field",
      "2+ years procurement experience",
      "Knowledge of public procurement law",
    ],
    applyEmail: "hr@mop.gov.so",
    whatsapp: "252611234567",
  },
  {
    id: "jb-003",
    title: "Software Developer (React)",
    organisation: "Hormuud Tech",
    sector: "private",
    category: "it",
    type: "Full-time",
    city: "Mogadishu",
    salary: "$900 – $1,400 / month",
    deadline: "2026-08-25",
    posted: "1 day ago",
    verified: true,
    featured: true,
    logoText: "HT",
    summary:
      "Build and maintain customer-facing web products used by thousands of users every day.",
    responsibilities: [
      "Develop new features with React and TypeScript",
      "Work with designers and backend engineers",
      "Write tests and review code",
    ],
    requirements: [
      "2+ years web development experience",
      "Strong JavaScript / React skills",
      "Good communication in English",
    ],
    applyEmail: "careers@hormuudtech.so",
    whatsapp: "252611234567",
  },
  {
    id: "jb-004",
    title: "Monitoring & Evaluation Assistant",
    organisation: "Save Horn Aid",
    sector: "ngo",
    category: "admin",
    type: "Contract",
    city: "Baidoa",
    salary: "$700 / month",
    deadline: "2026-09-05",
    posted: "3 days ago",
    verified: false,
    logoText: "SHA",
    summary:
      "Support data collection, verification and reporting for food security projects in Bay region.",
    responsibilities: [
      "Conduct beneficiary surveys",
      "Clean and enter data into Kobo Toolbox",
      "Support monthly M&E reporting",
    ],
    requirements: [
      "Diploma or degree in statistics or social science",
      "Experience with mobile data collection tools",
      "Willingness to travel to field sites",
    ],
    applyEmail: "recruit@savehornaid.org",
    whatsapp: "252611234567",
  },
  {
    id: "jb-005",
    title: "Primary School Teacher",
    organisation: "Hargeisa Education Board",
    sector: "government",
    category: "education",
    type: "Full-time",
    city: "Hargeisa",
    deadline: "2026-09-15",
    posted: "1 week ago",
    verified: true,
    logoText: "HEB",
    summary:
      "Teach primary grades and support the national curriculum roll-out in public schools.",
    responsibilities: [
      "Deliver daily lessons following the national curriculum",
      "Assess and report pupil progress",
      "Engage parents and community",
    ],
    requirements: [
      "Teaching certificate or education degree",
      "1+ year classroom experience",
      "Strong Somali literacy",
    ],
    applyEmail: "jobs@heb.gov.so",
    whatsapp: "252611234567",
  },
  {
    id: "jb-006",
    title: "Logistics Supervisor",
    organisation: "Bosaso Port Services",
    sector: "private",
    category: "logistics",
    type: "Full-time",
    city: "Bosaso",
    salary: "$800 – $1,000 / month",
    deadline: "2026-08-28",
    posted: "4 days ago",
    verified: true,
    logoText: "BPS",
    summary:
      "Oversee warehouse operations, fleet scheduling and customs documentation at the port.",
    responsibilities: [
      "Plan daily truck and warehouse operations",
      "Track inventory and shipment documents",
      "Supervise a team of 10 staff",
    ],
    requirements: [
      "3+ years logistics experience",
      "Knowledge of customs procedures",
      "Computer literacy (Excel)",
    ],
    applyEmail: "hr@bosasoport.so",
    whatsapp: "252611234567",
  },
  {
    id: "jb-007",
    title: "Nutrition Nurse",
    organisation: "Garowe General Hospital",
    sector: "government",
    category: "health",
    type: "Contract",
    city: "Garowe",
    salary: "$600 / month",
    deadline: "2026-09-01",
    posted: "6 days ago",
    verified: true,
    logoText: "GGH",
    summary:
      "Provide nutrition screening and treatment for children under five in the stabilisation centre.",
    responsibilities: [
      "Screen and admit malnutrition cases",
      "Administer treatment protocols",
      "Counsel caregivers on infant feeding",
    ],
    requirements: [
      "Registered nurse qualification",
      "Experience in nutrition programmes",
      "Ability to work shifts",
    ],
    applyEmail: "hr@ggh.gov.so",
    whatsapp: "252611234567",
  },
  {
    id: "jb-008",
    title: "Sales & Marketing Intern",
    organisation: "Kismayo Trading Co.",
    sector: "private",
    category: "admin",
    type: "Internship",
    city: "Kismayo",
    deadline: "2026-08-22",
    posted: "Today",
    verified: false,
    logoText: "KTC",
    summary:
      "Learn practical sales, customer service and social media marketing in a growing trading company.",
    responsibilities: [
      "Support the sales team with customer follow-up",
      "Create simple social media posts",
      "Maintain the customer database",
    ],
    requirements: [
      "Recent graduate or final-year student",
      "Good communication skills",
      "Basic computer skills",
    ],
    applyEmail: "info@kismayotrading.so",
    whatsapp: "252611234567",
  },
];

export const JOB_TYPES: JobType[] = [
  "Full-time", "Part-time", "Contract", "Internship", "Volunteer",
];
