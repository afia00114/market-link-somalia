export type EntSubKey =
  | "sports"
  | "futsal"
  | "stadiums"
  | "tournaments"
  | "events"
  | "cinemas"
  | "kids"
  | "gaming"
  | "recreation";

export interface EntSubcategory {
  key: EntSubKey;
  label: string;
  short: string;
  emoji: string;
}

export const ENT_SUBCATEGORIES: EntSubcategory[] = [
  { key: "sports", label: "Sports & Fitness", short: "Gyms, courts & clubs", emoji: "🏋️" },
  { key: "futsal", label: "Futsal Pitches", short: "5-a-side turf pitches", emoji: "⚽" },
  { key: "stadiums", label: "Stadiums", short: "Full-size fields", emoji: "🏟️" },
  { key: "tournaments", label: "Tournaments", short: "Register your team", emoji: "🏆" },
  { key: "events", label: "Events & Concerts", short: "Shows & live music", emoji: "🎤" },
  { key: "cinemas", label: "Cinemas", short: "Movies & screenings", emoji: "🎬" },
  { key: "kids", label: "Kids Activities", short: "Play areas & parties", emoji: "🎈" },
  { key: "gaming", label: "Gaming Centers", short: "PlayStation & VR", emoji: "🎮" },
  { key: "recreation", label: "Recreation Venues", short: "Pools, parks & beaches", emoji: "🏖️" },
];

export interface EntField {
  id: string;
  name: string;
  surface: string;
  size: string;
  capacity: number;
  indoor: boolean;
  pricePerHour: number;
  /** hours (24h) that are pre-booked in the seed data, keyed by weekday 0-6 */
  busy: Record<number, number[]>;
}

export interface EntReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface EntVenue {
  id: string;
  name: string;
  sub: EntSubKey;
  city: string;
  district: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  popular: boolean;
  priceFrom: number;
  priceUnit: string;
  phone: string;
  whatsapp: string;
  about: string;
  amenities: string[];
  rules: string[];
  openHour: number;
  closeHour: number;
  lat: number;
  lng: number;
  bookable: boolean;
  fields: EntField[];
  reviews: EntReview[];
  cancellation: string;
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

const PITCH = img("1552667466-07770ae110d0");
const PITCH2 = img("1529900748604-07564a03e7a6");
const STADIUM = img("1522778119026-d647f0596c20");
const GYM = img("1534438327276-14e5300c3a48");
const CINEMA = img("1489599849927-2ee91cede3ba");
const CONCERT = img("1470229722913-7c0e2dbbafd3");
const KIDS = img("1587654780291-39c9404d746b");
const GAMING = img("1511512578047-dfb367046420");
const BEACH = img("1507525428034-b723cf961d3e");

export const ENT_VENUES: EntVenue[] = [
  {
    id: "ent-futsal-banadir",
    name: "Banadir Futsal Arena",
    sub: "futsal",
    city: "Mogadishu",
    district: "Hodan",
    image: PITCH,
    gallery: [PITCH, PITCH2, STADIUM],
    rating: 4.8,
    reviewCount: 214,
    verified: true,
    featured: true,
    popular: true,
    priceFrom: 15,
    priceUnit: "hour",
    phone: "+252 61 555 0110",
    whatsapp: "252615550110",
    about:
      "Two floodlit artificial-turf pitches in the heart of Hodan. Free parking, changing rooms and a shaded spectator area. Popular for evening 5-a-side leagues.",
    amenities: ["Floodlights", "Changing rooms", "Free parking", "Drinking water", "Spectator seats", "First aid"],
    rules: ["No metal studs", "Arrive 10 minutes early", "No smoking inside the pitch", "Max 12 players per booking"],
    openHour: 8,
    closeHour: 23,
    lat: 2.0469,
    lng: 45.3182,
    bookable: true,
    cancellation: "Free cancellation up to 6 hours before kick-off. Later cancellations keep 50% as venue credit.",
    fields: [
      {
        id: "pitch-a",
        name: "Pitch A (Main)",
        surface: "Artificial turf",
        size: "40m × 20m",
        capacity: 12,
        indoor: false,
        pricePerHour: 20,
        busy: { 0: [18, 19], 1: [20], 2: [17, 21], 3: [19], 4: [16, 20, 21], 5: [15, 18, 19], 6: [17, 20] },
      },
      {
        id: "pitch-b",
        name: "Pitch B (Indoor)",
        surface: "Indoor turf",
        size: "30m × 16m",
        capacity: 10,
        indoor: true,
        pricePerHour: 15,
        busy: { 0: [20], 1: [17, 18], 2: [19], 3: [15, 21], 4: [18], 5: [16, 20], 6: [19, 21] },
      },
    ],
    reviews: [
      { id: "r1", author: "Cabdi M.", rating: 5, text: "Best turf in Mogadishu, lights are strong at night.", date: "2026-07-12" },
      { id: "r2", author: "Yasin A.", rating: 4, text: "Great pitch, parking gets full on Fridays.", date: "2026-06-28" },
    ],
  },
  {
    id: "ent-futsal-shabelle",
    name: "Shabelle Turf Center",
    sub: "futsal",
    city: "Mogadishu",
    district: "Kaaraan",
    image: PITCH2,
    gallery: [PITCH2, PITCH],
    rating: 4.5,
    reviewCount: 132,
    verified: true,
    featured: false,
    popular: true,
    priceFrom: 12,
    priceUnit: "hour",
    phone: "+252 61 555 0122",
    whatsapp: "252615550122",
    about: "Neighbourhood futsal center with three small-sided pitches and a cafeteria.",
    amenities: ["Floodlights", "Cafeteria", "Changing rooms", "Ball rental"],
    rules: ["No metal studs", "Respect the next booking slot"],
    openHour: 9,
    closeHour: 23,
    lat: 2.0721,
    lng: 45.3335,
    bookable: true,
    cancellation: "Free cancellation up to 4 hours before your slot.",
    fields: [
      {
        id: "turf-1",
        name: "Turf 1",
        surface: "Artificial turf",
        size: "35m × 18m",
        capacity: 10,
        indoor: false,
        pricePerHour: 12,
        busy: { 0: [19], 1: [18, 21], 2: [20], 3: [17], 4: [19, 20], 5: [16], 6: [18] },
      },
      {
        id: "turf-2",
        name: "Turf 2",
        surface: "Artificial turf",
        size: "30m × 16m",
        capacity: 10,
        indoor: false,
        pricePerHour: 10,
        busy: { 0: [17], 1: [20], 2: [18], 3: [21], 4: [15], 5: [19, 20], 6: [16] },
      },
    ],
    reviews: [{ id: "r1", author: "Hodan I.", rating: 5, text: "Cheap and always clean.", date: "2026-05-19" }],
  },
  {
    id: "ent-stadium-hargeisa",
    name: "Hargeisa Sports Stadium",
    sub: "stadiums",
    city: "Hargeisa",
    district: "Ahmed Dhagah",
    image: STADIUM,
    gallery: [STADIUM, PITCH],
    rating: 4.7,
    reviewCount: 98,
    verified: true,
    featured: true,
    popular: false,
    priceFrom: 60,
    priceUnit: "hour",
    phone: "+252 63 444 0100",
    whatsapp: "252634440100",
    about: "Full-size grass stadium hosting league matches, school finals and community tournaments.",
    amenities: ["Grandstand 4,000 seats", "Floodlights", "Locker rooms", "Ambulance on call", "PA system", "Referee room"],
    rules: ["Booking includes 30 min warm-up", "Organiser is responsible for crowd control", "No fireworks"],
    openHour: 7,
    closeHour: 22,
    lat: 9.562,
    lng: 44.077,
    bookable: true,
    cancellation: "Free cancellation up to 48 hours before the match date.",
    fields: [
      {
        id: "main-field",
        name: "Main Field",
        surface: "Natural grass",
        size: "105m × 68m",
        capacity: 4000,
        indoor: false,
        pricePerHour: 90,
        busy: { 0: [16], 1: [], 2: [15, 16], 3: [], 4: [16, 17], 5: [9, 10, 16], 6: [15] },
      },
      {
        id: "training-field",
        name: "Training Field",
        surface: "Artificial turf",
        size: "90m × 50m",
        capacity: 500,
        indoor: false,
        pricePerHour: 60,
        busy: { 0: [], 1: [17], 2: [18], 3: [16], 4: [], 5: [10, 17], 6: [16] },
      },
    ],
    reviews: [{ id: "r1", author: "Cabdiraxmaan", rating: 5, text: "Proper stadium, great pitch condition.", date: "2026-07-01" }],
  },
  {
    id: "ent-stadium-bosaso",
    name: "Bosaso Municipal Ground",
    sub: "stadiums",
    city: "Bosaso",
    district: "Central",
    image: img("1459865264687-595d652de67e"),
    gallery: [img("1459865264687-595d652de67e"), STADIUM],
    rating: 4.2,
    reviewCount: 41,
    verified: false,
    featured: false,
    popular: false,
    priceFrom: 45,
    priceUnit: "hour",
    phone: "+252 90 777 0155",
    whatsapp: "252907770155",
    about: "Community stadium used for regional cups and school sports days.",
    amenities: ["Seating 1,500", "Locker rooms", "Parking"],
    rules: ["Bring your own match balls", "Clean the field after use"],
    openHour: 7,
    closeHour: 20,
    lat: 11.284,
    lng: 49.183,
    bookable: true,
    cancellation: "Free cancellation up to 24 hours before the booking.",
    fields: [
      {
        id: "ground",
        name: "Municipal Ground",
        surface: "Sand & grass mix",
        size: "100m × 64m",
        capacity: 1500,
        indoor: false,
        pricePerHour: 45,
        busy: { 0: [16], 1: [], 2: [17], 3: [], 4: [16], 5: [9, 16], 6: [] },
      },
    ],
    reviews: [],
  },
  {
    id: "ent-gym-oceanfit",
    name: "Ocean Fit Gym & Courts",
    sub: "sports",
    city: "Mogadishu",
    district: "Abdiaziz",
    image: GYM,
    gallery: [GYM, PITCH],
    rating: 4.6,
    reviewCount: 176,
    verified: true,
    featured: false,
    popular: true,
    priceFrom: 8,
    priceUnit: "session",
    phone: "+252 61 555 0180",
    whatsapp: "252615550180",
    about: "Modern gym with a basketball court, ladies-only hours and certified trainers.",
    amenities: ["Cardio zone", "Free weights", "Ladies hours", "Showers", "Personal trainers"],
    rules: ["Bring indoor shoes", "Wipe equipment after use"],
    openHour: 6,
    closeHour: 22,
    lat: 2.043,
    lng: 45.328,
    bookable: true,
    cancellation: "Sessions can be rescheduled any time before the start.",
    fields: [
      {
        id: "court",
        name: "Basketball Court",
        surface: "Hardwood",
        size: "28m × 15m",
        capacity: 20,
        indoor: true,
        pricePerHour: 18,
        busy: { 0: [18], 1: [19], 2: [17], 3: [20], 4: [18], 5: [10, 17], 6: [19] },
      },
    ],
    reviews: [{ id: "r1", author: "Sahra", rating: 5, text: "Ladies hours are well respected.", date: "2026-06-05" }],
  },
  {
    id: "ent-cinema-jazeera",
    name: "Jazeera Cinema Lounge",
    sub: "cinemas",
    city: "Mogadishu",
    district: "Wadajir",
    image: CINEMA,
    gallery: [CINEMA, CONCERT],
    rating: 4.4,
    reviewCount: 88,
    verified: true,
    featured: true,
    popular: true,
    priceFrom: 5,
    priceUnit: "ticket",
    phone: "+252 61 555 0190",
    whatsapp: "252615550190",
    about: "Two screening rooms with Somali-subtitled films, family sessions and private hire.",
    amenities: ["Air conditioning", "Snack bar", "Family section", "Private hire"],
    rules: ["No outside food", "Silence phones during the show"],
    openHour: 12,
    closeHour: 23,
    lat: 2.02,
    lng: 45.31,
    bookable: false,
    cancellation: "Tickets are transferable up to 2 hours before the session.",
    fields: [],
    reviews: [],
  },
  {
    id: "ent-kids-jannah",
    name: "Jannah Kids Play World",
    sub: "kids",
    city: "Hargeisa",
    district: "26 June",
    image: KIDS,
    gallery: [KIDS],
    rating: 4.9,
    reviewCount: 143,
    verified: true,
    featured: false,
    popular: true,
    priceFrom: 4,
    priceUnit: "child",
    phone: "+252 63 444 0177",
    whatsapp: "252634440177",
    about: "Indoor soft-play, trampolines and birthday party packages for ages 2–12.",
    amenities: ["Soft play", "Trampolines", "Party rooms", "Cafe for parents", "Supervisors"],
    rules: ["Socks required", "One guardian per child under 4"],
    openHour: 9,
    closeHour: 21,
    lat: 9.56,
    lng: 44.06,
    bookable: false,
    cancellation: "Party bookings can be moved once, free of charge.",
    fields: [],
    reviews: [],
  },
  {
    id: "ent-gaming-arena",
    name: "Level Up Gaming Arena",
    sub: "gaming",
    city: "Mogadishu",
    district: "Hamar Weyne",
    image: GAMING,
    gallery: [GAMING],
    rating: 4.3,
    reviewCount: 67,
    verified: false,
    featured: false,
    popular: false,
    priceFrom: 2,
    priceUnit: "hour",
    phone: "+252 61 555 0166",
    whatsapp: "252615550166",
    about: "PlayStation 5 booths, racing simulators and FIFA tournaments every weekend.",
    amenities: ["PS5 booths", "VR headsets", "Racing rigs", "Air conditioning"],
    rules: ["Under 12 must come with an adult", "No food near consoles"],
    openHour: 10,
    closeHour: 24,
    lat: 2.033,
    lng: 45.34,
    bookable: false,
    cancellation: "Walk-in venue — no cancellation needed.",
    fields: [],
    reviews: [],
  },
  {
    id: "ent-recreation-lido",
    name: "Lido Beach Recreation Club",
    sub: "recreation",
    city: "Mogadishu",
    district: "Abdiaziz",
    image: BEACH,
    gallery: [BEACH, CONCERT],
    rating: 4.7,
    reviewCount: 260,
    verified: true,
    featured: true,
    popular: true,
    priceFrom: 3,
    priceUnit: "entry",
    phone: "+252 61 555 0144",
    whatsapp: "252615550144",
    about: "Beachfront club with shaded cabanas, volleyball nets, family picnic area and weekend live music.",
    amenities: ["Cabanas", "Volleyball", "Lifeguards", "Restaurant", "Family area"],
    rules: ["Modest swimwear", "No glass bottles on the sand"],
    openHour: 8,
    closeHour: 22,
    lat: 2.0525,
    lng: 45.3402,
    bookable: false,
    cancellation: "Entry tickets are valid for the selected day only.",
    fields: [],
    reviews: [],
  },
];

export interface EntEvent {
  id: string;
  title: string;
  kind: "event" | "cinema" | "recreation" | "kids";
  venueId: string;
  venueName: string;
  city: string;
  district: string;
  image: string;
  date: string;
  sessions: { id: string; time: string; seatsLeft: number }[];
  pricePerTicket: number;
  ticketLabel: string;
  about: string;
  organiser: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
}

export const ENT_EVENTS: EntEvent[] = [
  {
    id: "evt-somali-night",
    title: "Somali Heritage Music Night",
    kind: "event",
    venueId: "ent-recreation-lido",
    venueName: "Lido Beach Recreation Club",
    city: "Mogadishu",
    district: "Abdiaziz",
    image: CONCERT,
    date: "2026-09-05",
    sessions: [
      { id: "s1", time: "19:00", seatsLeft: 120 },
      { id: "s2", time: "21:30", seatsLeft: 40 },
    ],
    pricePerTicket: 12,
    ticketLabel: "ticket",
    about: "An evening of live oud, hees hore and modern Somali bands on the beachfront stage.",
    organiser: "Hiddo Events",
    phone: "+252 61 555 0144",
    whatsapp: "252615550144",
    verified: true,
  },
  {
    id: "evt-cinema-family",
    title: "Family Matinee — Animated Double Bill",
    kind: "cinema",
    venueId: "ent-cinema-jazeera",
    venueName: "Jazeera Cinema Lounge",
    city: "Mogadishu",
    district: "Wadajir",
    image: CINEMA,
    date: "2026-08-29",
    sessions: [
      { id: "s1", time: "14:00", seatsLeft: 60 },
      { id: "s2", time: "17:00", seatsLeft: 22 },
      { id: "s3", time: "20:00", seatsLeft: 0 },
    ],
    pricePerTicket: 5,
    ticketLabel: "seat",
    about: "Two animated features with Somali subtitles. Free popcorn for children under 10.",
    organiser: "Jazeera Cinema",
    phone: "+252 61 555 0190",
    whatsapp: "252615550190",
    verified: true,
  },
  {
    id: "evt-kids-party",
    title: "Weekend Kids Fun Day",
    kind: "kids",
    venueId: "ent-kids-jannah",
    venueName: "Jannah Kids Play World",
    city: "Hargeisa",
    district: "26 June",
    image: KIDS,
    date: "2026-08-30",
    sessions: [
      { id: "s1", time: "10:00", seatsLeft: 35 },
      { id: "s2", time: "15:00", seatsLeft: 18 },
    ],
    pricePerTicket: 4,
    ticketLabel: "child",
    about: "Face painting, bouncy castles and a magic show. Guardians enter free.",
    organiser: "Jannah Play",
    phone: "+252 63 444 0177",
    whatsapp: "252634440177",
    verified: true,
  },
  {
    id: "evt-beach-day",
    title: "Lido Beach Day Pass",
    kind: "recreation",
    venueId: "ent-recreation-lido",
    venueName: "Lido Beach Recreation Club",
    city: "Mogadishu",
    district: "Abdiaziz",
    image: BEACH,
    date: "2026-08-28",
    sessions: [
      { id: "s1", time: "08:00", seatsLeft: 200 },
      { id: "s2", time: "14:00", seatsLeft: 150 },
    ],
    pricePerTicket: 3,
    ticketLabel: "entry",
    about: "Day access to cabanas, volleyball courts and the family picnic zone.",
    organiser: "Lido Club",
    phone: "+252 61 555 0144",
    whatsapp: "252615550144",
    verified: true,
  },
];

export type TournamentStatus = "upcoming" | "live" | "completed";

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  format: string;
  status: TournamentStatus;
  venueName: string;
  city: string;
  district: string;
  image: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  teamsMax: number;
  teamsRegistered: number;
  entryFee: number;
  prizes: string[];
  rules: string[];
  organiser: string;
  organiserVerified: boolean;
  phone: string;
  whatsapp: string;
  about: string;
  fixtures: { id: string; round: string; home: string; away: string; time: string; score?: string }[];
  standings: { team: string; played: number; won: number; drawn: number; lost: number; points: number }[];
}

export const TOURNAMENTS: Tournament[] = [
  {
    id: "trn-ramadan-cup",
    name: "Banadir Futsal Champions Cup",
    sport: "Futsal",
    format: "Group stage + knockout, 5-a-side",
    status: "upcoming",
    venueName: "Banadir Futsal Arena",
    city: "Mogadishu",
    district: "Hodan",
    image: PITCH,
    startDate: "2026-09-12",
    endDate: "2026-09-27",
    registrationDeadline: "2026-09-05",
    teamsMax: 16,
    teamsRegistered: 11,
    entryFee: 50,
    prizes: ["1st: $1,500 + trophy", "2nd: $700", "3rd: $300", "Top scorer: $150"],
    rules: ["Max 10 players per roster", "Players must be 16+", "Two 20-minute halves", "Three yellow cards = one match ban"],
    organiser: "Banadir Sports Council",
    organiserVerified: true,
    phone: "+252 61 555 0110",
    whatsapp: "252615550110",
    about: "The biggest 5-a-side cup in Mogadishu, played under floodlights over three weekends.",
    fixtures: [
      { id: "f1", round: "Group A", home: "Hodan Stars", away: "Kaaraan FC", time: "2026-09-12 19:00" },
      { id: "f2", round: "Group A", home: "Shabelle United", away: "Xamar Boys", time: "2026-09-12 20:30" },
      { id: "f3", round: "Group B", home: "Wadajir SC", away: "Dayniile FC", time: "2026-09-13 19:00" },
    ],
    standings: [],
  },
  {
    id: "trn-hargeisa-league",
    name: "Hargeisa Community League",
    sport: "Football",
    format: "Round robin, 11-a-side",
    status: "live",
    venueName: "Hargeisa Sports Stadium",
    city: "Hargeisa",
    district: "Ahmed Dhagah",
    image: STADIUM,
    startDate: "2026-08-01",
    endDate: "2026-09-15",
    registrationDeadline: "2026-07-20",
    teamsMax: 12,
    teamsRegistered: 12,
    entryFee: 120,
    prizes: ["Champion: $3,000", "Runner-up: $1,200", "Fair play: $300"],
    rules: ["Registered squads of 18", "ID verification at each match", "Home team supplies match balls"],
    organiser: "Hargeisa FA",
    organiserVerified: true,
    phone: "+252 63 444 0100",
    whatsapp: "252634440100",
    about: "Twelve district clubs playing every weekend for the community shield.",
    fixtures: [
      { id: "f1", round: "Week 4", home: "26 June FC", away: "Ahmed Dhagah SC", time: "2026-08-22 16:00", score: "2 - 1" },
      { id: "f2", round: "Week 5", home: "Maroodi Jeex", away: "Ga'an Libaax", time: "2026-08-29 16:00" },
    ],
    standings: [
      { team: "26 June FC", played: 4, won: 3, drawn: 1, lost: 0, points: 10 },
      { team: "Maroodi Jeex", played: 4, won: 3, drawn: 0, lost: 1, points: 9 },
      { team: "Ahmed Dhagah SC", played: 4, won: 2, drawn: 1, lost: 1, points: 7 },
      { team: "Ga'an Libaax", played: 4, won: 0, drawn: 1, lost: 3, points: 1 },
    ],
  },
  {
    id: "trn-bosaso-cup",
    name: "Bosaso Coastal Cup",
    sport: "Football",
    format: "Straight knockout",
    status: "completed",
    venueName: "Bosaso Municipal Ground",
    city: "Bosaso",
    district: "Central",
    image: img("1459865264687-595d652de67e"),
    startDate: "2026-06-05",
    endDate: "2026-06-28",
    registrationDeadline: "2026-05-25",
    teamsMax: 8,
    teamsRegistered: 8,
    entryFee: 80,
    prizes: ["Champion: $1,000", "Runner-up: $400"],
    rules: ["Knockout, extra time then penalties"],
    organiser: "Bosaso Youth Sports",
    organiserVerified: false,
    phone: "+252 90 777 0155",
    whatsapp: "252907770155",
    about: "Annual coastal knockout cup for Bari region clubs.",
    fixtures: [{ id: "f1", round: "Final", home: "Bari Stars", away: "Coastal FC", time: "2026-06-28 16:00", score: "3 - 2" }],
    standings: [],
  },
];

export const ENT_CITIES = Array.from(new Set(ENT_VENUES.map((v) => v.city)));

export const getVenue = (id: string) => ENT_VENUES.find((v) => v.id === id);
export const getEntEvent = (id: string) => ENT_EVENTS.find((e) => e.id === id);
export const getTournament = (id: string) => TOURNAMENTS.find((t) => t.id === id);
export const subLabel = (k: EntSubKey) => ENT_SUBCATEGORIES.find((s) => s.key === k)?.label ?? k;
