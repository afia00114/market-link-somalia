export interface SomaliCity {
  name: string;
  areas: string[];
}

export const SOMALI_CITIES: SomaliCity[] = [
  {
    name: "Mogadishu",
    areas: [
      "Hodan", "Howlwadaag", "Wadajir", "Kaxda", "Hamar Weyne", "Hamar Jajab",
      "Waberi", "Dharkenley", "Yaqshid", "Karaan", "Shibis", "Bondhere",
      "Abdiaziz", "Heliwa", "Daynile", "Shangani",
    ],
  },
  {
    name: "Hargeisa",
    areas: ["Ahmed Dhagah", "Ibrahim Koodbuur", "Mohamoud Haybe", "26 June", "Ganbadhe", "New Hargeisa"],
  },
  { name: "Bosaso", areas: ["Bulsho", "Sacadaq", "Waberi", "Baraxley", "Airport Road"] },
  { name: "Kismayo", areas: ["Farjano", "Calanley", "Shaqaalaha", "Fanoole", "Gulwade"] },
  { name: "Galkayo", areas: ["Garsoor", "Horumar", "Israac", "Wadajir"] },
  { name: "Baidoa", areas: ["Berdaale", "Howlwadaag", "Isha", "Horseed"] },
  { name: "Garowe", areas: ["Waberi", "Jawle", "Hodan", "Israac"] },
  { name: "Borama", areas: ["Dilla Road", "Kanaan", "Wajaale Road", "Central"] },
];

export function areasForCity(city: string): string[] {
  return SOMALI_CITIES.find((c) => c.name === city)?.areas ?? [];
}
