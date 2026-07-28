import { createFileRoute } from "@tanstack/react-router";

// Simple in-memory geocode cache per worker instance
const cache = new Map<string, { lat: number; lng: number } | null>();

export const Route = createFileRoute("/api/public/geocode")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q")?.trim();
        if (!q || q.length < 3) {
          return new Response(JSON.stringify({ error: "missing query" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        if (cache.has(q)) {
          return Response.json(cache.get(q) ?? { error: "not found" });
        }
        const lovableKey = process.env.LOVABLE_API_KEY;
        const connKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!lovableKey || !connKey) {
          return new Response(
            JSON.stringify({ error: "maps not configured" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
        try {
          const res = await fetch(
            `https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?address=${encodeURIComponent(q)}`,
            {
              headers: {
                Authorization: `Bearer ${lovableKey}`,
                "X-Connection-Api-Key": connKey,
              },
            },
          );
          if (!res.ok) {
            const body = await res.text();
            return new Response(
              JSON.stringify({ error: `geocode failed: ${body}` }),
              { status: res.status, headers: { "content-type": "application/json" } },
            );
          }
          const data = (await res.json()) as any;
          const loc = data?.results?.[0]?.geometry?.location;
          if (!loc) {
            cache.set(q, null);
            return Response.json({ error: "not found" }, { status: 404 });
          }
          const out = { lat: loc.lat, lng: loc.lng };
          cache.set(q, out);
          return Response.json(out, {
            headers: { "cache-control": "public, max-age=86400" },
          });
        } catch (e: any) {
          return new Response(
            JSON.stringify({ error: e?.message ?? "geocode error" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
