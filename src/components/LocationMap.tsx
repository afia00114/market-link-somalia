import { useEffect, useRef, useState } from "react";
import { Navigation, MapPin } from "lucide-react";
import { loadGoogleMaps, directionsUrl } from "@/lib/maps/loader";

interface Props {
  address?: string | null;
  coords?: { lat: number; lng: number } | null;
  label?: string;
  height?: number;
  showDirections?: boolean;
  className?: string;
}

export function LocationMap({
  address,
  coords,
  label,
  height = 220,
  showDirections = true,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<{ lat: number; lng: number } | null>(coords ?? null);
  const [error, setError] = useState<string | null>(null);

  // Geocode address on demand via server function
  useEffect(() => {
    if (resolved || !address) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/public/geocode?q=${encodeURIComponent(address)}`,
        );
        const data = await res.json();
        if (!cancelled && data?.lat && data?.lng) {
          setResolved({ lat: data.lat, lng: data.lng });
        } else if (!cancelled) {
          setError("Location not found");
        }
      } catch {
        if (!cancelled) setError("Location lookup failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [address, resolved]);

  // Render map when we have coords
  useEffect(() => {
    if (!resolved || !containerRef.current) return;
    let marker: any = null;
    loadGoogleMaps()
      .then((g) => {
        if (!containerRef.current) return;
        const map = new g.maps.Map(containerRef.current, {
          center: resolved,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
        });
        marker = new g.maps.Marker({
          position: resolved,
          map,
          title: label ?? address ?? "Location",
        });
      })
      .catch((e) => setError(e.message));
    return () => {
      marker?.setMap(null);
    };
  }, [resolved, address, label]);

  const dest = resolved ?? (address ? address : null);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full overflow-hidden rounded-2xl border border-border bg-secondary"
      >
        {!resolved && (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            <MapPin className="mr-1.5 h-4 w-4" />
            {error ?? (address ? "Loading map…" : "No location")}
          </div>
        )}
      </div>
      {showDirections && dest && (
        <a
          href={directionsUrl(dest)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
        >
          <Navigation className="h-4 w-4" /> Get Directions
        </a>
      )}
    </div>
  );
}
