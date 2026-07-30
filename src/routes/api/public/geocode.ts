import { createFileRoute } from "@tanstack/react-router";

// Simple in-memory geocode cache per worker instance
const cache = new Map<string, { lat: number; lng: number } | null>();

// Basic per-IP rate limiting (per worker instance)
const RATE_LIMIT = 20; // requests
const WINDOW_MS = 60_000; // per minute
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = new URL(request.url).host;
  const check = (value: string | null) => {
    if (!value) return false;
    try {
      return new URL(value).host === host;
    } catch {
      return false;
    }
  };
  // Browsers omit Origin on same-origin GETs, so accept a matching Referer too.
  if (!origin && !referer) return false;
  return check(origin) || check(referer);
}

export const Route = createFileRoute("/api/public/geocode")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const json = (body: unknown, status = 200) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "content-type": "application/json" },
          });

        if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);

        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";
        if (rateLimited(ip)) return json({ error: "rate limited" }, 429);

        const url = new URL(request.url);
        const q = url.searchParams.get("q")?.trim();
        if (!q || q.length < 3 || q.length > 200) {
          return json({ error: "missing query" }, 400);
        }
        if (cache.has(q)) {
          return Response.json(cache.get(q) ?? { error: "not found" });
        }
        const lovableKey = process.env.LOVABLE_API_KEY;
        const connKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!lovableKey || !connKey) {
          return json({ error: "maps not configured" }, 500);
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
            return json({ error: "geocode failed" }, 502);
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
        } catch {
          return json({ error: "geocode error" }, 500);
        }
      },
    },
  },
});
