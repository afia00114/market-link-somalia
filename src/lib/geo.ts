// Rough coordinates for common Somali districts/cities to power
// "how close is this provider" style distance chips (Uber-like).
// These are approximate centroids — good enough for a nearby feel.
const PLACES: Record<string, { lat: number; lng: number }> = {
  // Mogadishu districts
  "hodan": { lat: 2.0469, lng: 45.3182 },
  "wadajir": { lat: 2.0161, lng: 45.3006 },
  "karaan": { lat: 2.0736, lng: 45.3390 },
  "yaaqshid": { lat: 2.0708, lng: 45.3520 },
  "hamar weyne": { lat: 2.0353, lng: 45.3419 },
  "hamar jajab": { lat: 2.0396, lng: 45.3376 },
  "shibis": { lat: 2.0490, lng: 45.3400 },
  "boondheere": { lat: 2.0537, lng: 45.3330 },
  "waaberi": { lat: 2.0250, lng: 45.3200 },
  "dharkenley": { lat: 2.0060, lng: 45.3140 },
  "howl wadaag": { lat: 2.0430, lng: 45.3100 },
  "kaxda": { lat: 2.0790, lng: 45.2500 },
  "daynile": { lat: 2.0850, lng: 45.2700 },
  // Cities (fallbacks)
  "mogadishu": { lat: 2.0469, lng: 45.3182 },
  "hargeisa": { lat: 9.5600, lng: 44.0650 },
  "bosaso": { lat: 11.2842, lng: 49.1816 },
  "kismayo": { lat: -0.3582, lng: 42.5454 },
  "garowe": { lat: 8.4028, lng: 48.4839 },
  "baidoa": { lat: 3.1136, lng: 43.6497 },
  "berbera": { lat: 10.4396, lng: 45.0143 },
  "galkayo": { lat: 6.7728, lng: 47.4306 },
};

export type LatLng = { lat: number; lng: number };

export function coordsFor(city?: string | null, district?: string | null): LatLng | null {
  const d = district?.trim().toLowerCase();
  const c = city?.trim().toLowerCase();
  if (d && PLACES[d]) return PLACES[d];
  if (c && PLACES[c]) return PLACES[c];
  return null;
}

// Haversine — kilometers between two points.
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round(km * 1000 / 50) * 50)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}
