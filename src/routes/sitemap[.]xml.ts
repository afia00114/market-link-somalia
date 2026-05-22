import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/data/categories";
import { PROPERTIES } from "@/data/properties";
import { HOSPITALS } from "@/data/health";
import { HOTELS } from "@/data/hotels";
import { LISTINGS } from "@/data/listings";
import { AGENCIES, FLIGHT_OFFERS, PILGRIM_PACKAGES, TOUR_PACKAGES, CAR_OFFERS, VISA_SERVICES } from "@/data/travel";

const BASE_URL = "https://market-link-somalia.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data: vendors } = await supabase
          .from("vendor_profiles")
          .select("id")
          .eq("is_active", true);

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/home", changefreq: "weekly", priority: "0.9" },
          { path: "/explore", changefreq: "weekly", priority: "0.8" },
          { path: "/auth", changefreq: "monthly", priority: "0.4" },
          { path: "/forgot-password", changefreq: "yearly", priority: "0.2" },
          { path: "/reset-password", changefreq: "yearly", priority: "0.2" },
          { path: "/admin/vendors", changefreq: "monthly", priority: "0.2" },
          { path: "/health/directory", changefreq: "weekly", priority: "0.6" },
          { path: "/subscribe", changefreq: "monthly", priority: "0.5" },
          { path: "/vendor/apply", changefreq: "monthly", priority: "0.6" },
          { path: "/real-estate", changefreq: "weekly", priority: "0.8" },
          { path: "/travel", changefreq: "weekly", priority: "0.8" },
          { path: "/travel/agencies", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/flights", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/visa", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/hajj-umrah", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/tours", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/car-rental", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/bus", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/cargo", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/my-tickets", changefreq: "weekly", priority: "0.5" },
          { path: "/hotels", changefreq: "weekly", priority: "0.8" },
          { path: "/health", changefreq: "weekly", priority: "0.8" },
          { path: "/messages", changefreq: "weekly", priority: "0.5" },
          { path: "/profile", changefreq: "weekly", priority: "0.5" },
          { path: "/post", changefreq: "monthly", priority: "0.5" },
          { path: "/employee-dashboard", changefreq: "weekly", priority: "0.5" },
          { path: "/my-payments", changefreq: "weekly", priority: "0.4" },
          { path: "/vendor/dashboard", changefreq: "weekly", priority: "0.4" },
          ...CATEGORIES.map((c) => ({ path: `/category/${c.key}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...PROPERTIES.map((p) => ({ path: `/property/${p.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...HOSPITALS.map((h) => ({ path: `/health/${h.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...HOTELS.map((h) => ({ path: `/hotels/${h.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...HOTELS.map((h) => ({ path: `/hotels/${h.id}/book`, changefreq: "monthly" as const, priority: "0.4" })),
          ...LISTINGS.map((l) => ({ path: `/listing/${l.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...LISTINGS.map((l) => ({ path: `/listing/${l.id}/book`, changefreq: "monthly" as const, priority: "0.4" })),
          ...LISTINGS.map((l) => ({ path: `/listing/${l.id}/booked`, changefreq: "monthly" as const, priority: "0.3" })),
          ...AGENCIES.map((a) => ({ path: `/travel/agencies/${a.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...FLIGHT_OFFERS.map((f) => ({ path: `/travel/book/${f.id}`, changefreq: "monthly" as const, priority: "0.4" })),
          ...FLIGHT_OFFERS.map((f) => ({ path: `/travel/flights/${f.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...PILGRIM_PACKAGES.map((p) => ({ path: `/travel/hajj-umrah/${p.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...TOUR_PACKAGES.map((t) => ({ path: `/travel/tours/${t.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...CAR_OFFERS.map((c) => ({ path: `/travel/car-rental/${c.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...VISA_SERVICES.map((v) => ({ path: `/travel/visa/${v.id}`, changefreq: "weekly" as const, priority: "0.6" })),
          ...(vendors ?? []).map((v: { id: string }) => ({ path: `/vendors/${v.id}`, changefreq: "weekly" as const, priority: "0.6" })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
