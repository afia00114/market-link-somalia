import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MapPin, Radio, Play, Square, Navigation } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { loadGoogleMaps, directionsUrl } from "@/lib/maps/loader";

export const Route = createFileRoute("/tracking/$ref")({
  head: ({ params }) => ({
    meta: [
      { title: `Live Tracking · ${params.ref} — MaalsoorHub` },
      { name: "description", content: "Track your provider's live location in real time." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackingPage,
});

type TrackingRow = {
  lat: number;
  lng: number;
  updated_at: string;
  status: string;
  provider_user_id: string | null;
};

function TrackingPage() {
  const { ref } = useParams({ from: "/tracking/$ref" });
  const { user } = useAuth();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const [tracking, setTracking] = useState<TrackingRow | null>(null);
  const sb: any = supabase;
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isProvider = !!user && tracking?.provider_user_id === user.id;

  // Initial fetch + realtime subscription
  useEffect(() => {
    let alive = true;
    sb
      .from("booking_tracking")
      .select("lat,lng,updated_at,status,provider_user_id")
      .eq("booking_ref", ref)
      .maybeSingle()
      .then(({ data }) => {
        if (alive && data) setTracking(data as TrackingRow);
      });

    const channel = supabase
      .channel(`tracking:${ref}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_tracking", filter: `booking_ref=eq.${ref}` },
        (payload) => {
          const row = payload.new as TrackingRow;
          if (row) setTracking(row);
        },
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [ref]);

  // Init map
  useEffect(() => {
    if (!tracking || !mapDivRef.current) return;
    loadGoogleMaps().then((g) => {
      if (!mapDivRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new g.maps.Map(mapDivRef.current, {
          center: { lat: tracking.lat, lng: tracking.lng },
          zoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
        });
        markerRef.current = new g.maps.Marker({
          position: { lat: tracking.lat, lng: tracking.lng },
          map: mapRef.current,
          title: "Provider",
        });
      } else {
        const pos = { lat: tracking.lat, lng: tracking.lng };
        markerRef.current?.setPosition(pos);
        mapRef.current.panTo(pos);
      }
    }).catch((e) => setError(e.message));
  }, [tracking]);

  const startSharing = async () => {
    if (!user) {
      setError("Sign in to share your location.");
      return;
    }
    if (!navigator.geolocation) {
      setError("Geolocation not supported on this device.");
      return;
    }
    setError(null);
    setSharing(true);

    const push = async (pos: GeolocationPosition) => {
      const row = {
        booking_ref: ref,
        provider_user_id: user.id,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? null,
        heading: pos.coords.heading ?? null,
        speed: pos.coords.speed ?? null,
        status: "active",
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("booking_tracking")
        .upsert(row, { onConflict: "booking_ref" });
      if (error) setError(error.message);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      push,
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  };

  const stopSharing = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
    if (user) {
      await supabase
        .from("booking_tracking")
        .update({ status: "ended" })
        .eq("booking_ref", ref)
        .eq("provider_user_id", user.id);
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const lastUpdated = tracking?.updated_at
    ? new Date(tracking.updated_at).toLocaleTimeString()
    : null;

  return (
    <AppShell hideNav>
      <header className="grad-hero rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link to="/home" aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold">Live Tracking</h1>
            <p className="truncate text-[11px] text-white/80">Booking #{ref}</p>
          </div>
          {tracking?.status === "active" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Live
            </span>
          )}
        </div>
      </header>

      <section className="px-4 pt-4">
        <div
          ref={mapDivRef}
          className="h-[52vh] w-full overflow-hidden rounded-2xl border border-border bg-secondary"
        >
          {!tracking && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-6 w-6" />
              Waiting for provider to share location…
            </div>
          )}
        </div>

        {tracking && (
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card p-3 text-xs">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              <div>
                <div className="font-semibold">
                  {tracking.status === "active" ? "Live update" : "Session ended"}
                </div>
                {lastUpdated && (
                  <div className="text-muted-foreground">Last update {lastUpdated}</div>
                )}
              </div>
            </div>
            <a
              href={directionsUrl({ lat: tracking.lat, lng: tracking.lng })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground"
            >
              <Navigation className="h-3.5 w-3.5" /> Directions
            </a>
          </div>
        )}

        {error && (
          <div className="mt-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}
      </section>

      {/* Provider controls */}
      {(isProvider || !tracking) && user && (
        <section className="px-4 pt-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-bold">Provider controls</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Share your live location with the customer for this booking. Keep this tab open while on the way.
            </p>
            {!sharing ? (
              <button
                onClick={startSharing}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Play className="h-4 w-4" /> Start sharing location
              </button>
            ) : (
              <button
                onClick={stopSharing}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground"
              >
                <Square className="h-4 w-4" /> Stop sharing
              </button>
            )}
          </div>
        </section>
      )}

      {!user && (
        <section className="px-4 pt-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <Link to="/auth" className="font-semibold text-primary">Sign in</Link> as the provider to share your live location on this booking.
          </div>
        </section>
      )}

      <div className="h-6" />
    </AppShell>
  );
}
