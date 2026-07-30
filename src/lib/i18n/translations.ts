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
    "home.title": "MaalsoorHub — Somalia's Smart Marketplace",
    "home.subtitle": "Search verified businesses, real estate, services, jobs and more across Somalia and East Africa.",
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
    "home.title": "MaalsoorHub — Suuqa Caqliga ee Soomaaliya",
    "home.subtitle": "Raadi ganacsi la xaqiijiyey, guryo, adeegyo, shaqooyin iyo waxyaabo kale oo Soomaaliya iyo Bariga Afrika.",
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
    "home.title": "MaalsoorHub — Soko la Akili la Somalia",
    "home.subtitle": "Tafuta biashara zilizothibitishwa, mali, huduma, kazi na zaidi kote Somalia na Afrika Mashariki.",
    "home.search": "Tafuta mali, huduma, kazi…",
    "home.browseCategories": "Vinjari Kategoria",
    "home.featuredListings": "Matangazo Maalum",
    "home.verifiedBusinesses": "Biashara Zilizothibitishwa",
    "common.seeAll": "Tazama zote",
    "common.language": "Lugha",
  },
};
