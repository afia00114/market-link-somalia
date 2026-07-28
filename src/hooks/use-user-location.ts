import { useCallback, useEffect, useState } from "react";
import type { LatLng } from "@/lib/geo";

type Status = "idle" | "prompt" | "loading" | "granted" | "denied" | "unavailable";

const STORAGE_KEY = "user-location-v1";

export function useUserLocation() {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // Hydrate from previous session so distances render immediately.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { coords: LatLng; ts: number };
        // 24h cache
        if (Date.now() - parsed.ts < 24 * 60 * 60 * 1000) {
          setCoords(parsed.coords);
          setStatus("granted");
          return;
        }
      }
    } catch {
      /* ignore */
    }
    if (typeof navigator !== "undefined" && !navigator.geolocation) {
      setStatus("unavailable");
    } else {
      setStatus("prompt");
    }
  }, []);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(next);
        setStatus("granted");
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ coords: next, ts: Date.now() }));
        } catch {
          /* ignore */
        }
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  return { coords, status, request };
}
