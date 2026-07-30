import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "search_listings",
  title: "Search listings",
  description:
    "Search published MaalsoorHub listings (services, properties, rooms, livestock and more) by text, category, location and price.",
  inputSchema: {
    query: z.string().optional().describe("Free text matched against listing title and description."),
    category_key: z.string().optional().describe("Category slug, e.g. 'real-estate', 'services'."),
    location: z.string().optional().describe("City or district."),
    max_price: z.number().optional().describe("Only listings priced at or below this amount."),
    limit: z.number().int().optional().describe("Max rows to return, default 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category_key, location, max_price, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("vendor_posts")
      .select("id,vendor_id,title,description,category_key,price,price_unit,currency,location,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));
    if (category_key) q = q.eq("category_key", category_key);
    if (location) q = q.ilike("location", `%${location}%`);
    if (typeof max_price === "number") q = q.lte("price", max_price);
    if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    const { data, error } = await q;
    if (error) return errorResult(error.message);
    return textResult({ listings: data ?? [] });
  },
});
