// Server-only payroll data. Never import from client code.
export type ServiceRow = {
  sn: number;
  code: string;
  date: string;
  magacada: string;
  macamil: string;
  price: number;
  discount: number;
};

export type EmployeeRow = {
  code: string;
  month: string;
  name: string;
  earn: number;
};

const CUSTOMERS = [
  "Shankaroon Mohamed Nur Abdi", "Daud Mohamed Abdirahman Alin", "Mohamed Ahmed Garar Abikar",
  "Mohamed Sheikh Idle Nunow", "Abdi Mahdi Abdullahi Jelle", "Aadan Ahmed Garar Abikar",
  "Nunow Adan Ged Mohamed", "Sharmaarke Adan Mohamed Ahmed", "Zakaria Jimale Yarkow Hassan",
  "Safa Mohamed Nuur Ali", "Liban Yahya Mohamed Ibrahim", "Suleqa Hassan Ibrahim Abdirahman",
  "Nadifo Maxamad Nur Ali", "Abdiwadud Ahmed Osman Mohamud", "Zakaria Abass Mohamud Hassan",
  "Jelle Mohamed Osman Ali", "Yusra Ali Adan Hassan", "Ibrahim Yusuf Maxamed Xasan",
  "Yussuf Ahmed Yerrow Abikar", "Siyat Ibrahim Issak Adan", "Mohamed Noor Abukar Hassan",
  "Siyad Abdirahman Mohamud Mohamed", "Abdi Rakau Adan Salat", "Yusuf Mohamed Hassan Abdulle",
  "Abdirisak Aden Ibrahim Hirsi", "Ramla Yusuf Mohamed Hassan",
];

export const SERVICES: ServiceRow[] = CUSTOMERS.map((macamil, i) => ({
  sn: i + 1,
  code: "20156",
  date: `5/${i + 1}/2026`,
  magacada: "Mohamud Ali",
  macamil,
  price: 10,
  discount: 1,
}));

export const EMPLOYEES: EmployeeRow[] = (
  [
    ["Mohamud Ali", 144], ["Ahmed Mohamed Ali Warsame", 144], ["Habiba Ali Abdulle Isaaq", 144],
    ["Muktar Mohamed Kassim Aden", 144], ["Nasteh Burhan Hassan Jamac", 144], ["Mumina Hussein Mohamed Ali", 144],
    ["Ubah Hassan Adan Jibril", 144], ["Kaltuma Dubow Rashid Odowa", 144], ["ISMAIL HAJI MOHAMED ABDILAHI", 144],
    ["Fartun Hassan Ali Yussuf", 144], ["Munino Hassan Mohamuud Aden", 144], ["Fahma Jelle Mohamed Osman", 135],
    ["Borrow Ali Ibrahim Ali", 126], ["Sahra Abdirahman Ismail Hassan", 117], ["Ahmed Mohamed Mohamud Bare", 108],
    ["Sacda Hassan Abayle Ahmed", 99], ["Barwaaqo Mohamed Osmaan Ali", 90], ["Faadimo Adan Mohamed Osmaan", 81],
    ["Abdimalik Yusuf Maxamed Xasan", 72], ["Halima Mayow Isaaq Mursal", 63], ["Mohamed Abdi Degow Hilowle", 54],
    ["Hamdi Jele Mohamed Osman", 45], ["Hussein Ali Abdi Hussein", 36], ["Yakub Hussein Mohamed Ali", 27],
    ["Bishar Dubow Ahmed Yussuf", 18],
  ] as [string, number][]
).map(([name, earn], i) => ({
  code: String(20156 + i),
  month: "May-26",
  name,
  earn,
}));
