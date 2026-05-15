export type Lang = "en" | "so" | "sw";

export const LANGUAGES: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "so", label: "Somali", native: "Soomaali", flag: "🇸🇴" },
  { code: "sw", label: "Swahili", native: "Kiswahili", flag: "🇰🇪" },
];

export type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.post": "Post",
    "nav.messages": "Messages",
    "nav.profile": "Profile",
    "home.title": "Find. Connect. WhatsApp.",
    "home.subtitle": "Connect with trusted providers near you.",
    "home.search": "Search properties, services, jobs…",
    "home.browseCategories": "Browse Categories",
    "home.featuredListings": "Featured Listings",
    "home.verifiedBusinesses": "Verified Businesses",
    "common.seeAll": "See all",
    "common.language": "Language",
  },
  so: {
    "nav.home": "Bogga",
    "nav.explore": "Sahmi",
    "nav.post": "Dhig",
    "nav.messages": "Fariimaha",
    "nav.profile": "Profile",
    "home.title": "Hel. Xidhiidh. WhatsApp.",
    "home.subtitle": "La xidhiidh bixiyeyaal lagu kalsoon yahay oo kuu dhow.",
    "home.search": "Raadi guryo, adeegyo, shaqooyin…",
    "home.browseCategories": "Fiiri Qaybaha",
    "home.featuredListings": "Liisinka Caanka Ah",
    "home.verifiedBusinesses": "Ganacsiyo La Xaqiijiyey",
    "common.seeAll": "Dhammaan eeg",
    "common.language": "Luqadda",
  },
  sw: {
    "nav.home": "Nyumbani",
    "nav.explore": "Chunguza",
    "nav.post": "Chapisha",
    "nav.messages": "Ujumbe",
    "nav.profile": "Wasifu",
    "home.title": "Tafuta. Unganisha. WhatsApp.",
    "home.subtitle": "Ungana na watoa huduma wanaoaminika karibu nawe.",
    "home.search": "Tafuta mali, huduma, kazi…",
    "home.browseCategories": "Vinjari Kategoria",
    "home.featuredListings": "Matangazo Maalum",
    "home.verifiedBusinesses": "Biashara Zilizothibitishwa",
    "common.seeAll": "Tazama zote",
    "common.language": "Lugha",
  },
};
