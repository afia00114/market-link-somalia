import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

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
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/home", changefreq: "weekly", priority: "0.9" },
          { path: "/explore", changefreq: "weekly", priority: "0.8" },
          { path: "/real-estate", changefreq: "weekly", priority: "0.8" },
          { path: "/travel", changefreq: "weekly", priority: "0.8" },
          { path: "/travel/agencies", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/flights", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/visa", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/hajj-umrah", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/tours", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/car-rental", changefreq: "weekly", priority: "0.7" },
          { path: "/travel/my-tickets", changefreq: "weekly", priority: "0.5" },
          { path: "/hotels", changefreq: "weekly", priority: "0.8" },
          { path: "/health", changefreq: "weekly", priority: "0.8" },
          { path: "/messages", changefreq: "weekly", priority: "0.5" },
          { path: "/profile", changefreq: "weekly", priority: "0.5" },
          { path: "/post", changefreq: "monthly", priority: "0.5" },
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
