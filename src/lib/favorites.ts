// Local-storage favorites store (saved listings, hotels, properties)

export type FavoriteKind = "listing" | "hotel" | "property";
export interface Favorite {
  kind: FavoriteKind;
  id: string;
  title?: string;
  image?: string;
  savedAt: string;
}

const KEY = "mh.favorites.v1";
const EVT = "mh:favorites:changed";

function read(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(list: Favorite[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

export function listFavorites(): Favorite[] {
  return read().sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
}

export function isFavorite(kind: FavoriteKind, id: string): boolean {
  return read().some((f) => f.kind === kind && f.id === id);
}

export function toggleFavorite(f: Omit<Favorite, "savedAt">): boolean {
  const list = read();
  const idx = list.findIndex((x) => x.kind === f.kind && x.id === f.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    write(list);
    return false;
  }
  list.push({ ...f, savedAt: new Date().toISOString() });
  write(list);
  return true;
}

export function removeFavorite(kind: FavoriteKind, id: string) {
  write(read().filter((f) => !(f.kind === kind && f.id === id)));
}

export function subscribeFavorites(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}
