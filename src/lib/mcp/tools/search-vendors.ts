import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "search_vendors",
  title: "Search vendors",
  description:
    "Search active MaalsoorHub vendors by business name, category or location (e.g. plumbing, hotels, real-estate in Mogadishu).",
  inputSchema: {
    query: z.string().optional().describe("Free text matched against business name and description."),
    category_key: z.string().optional().describe("Category slug, e.g. 'real-estate', 'hotels', 'services'."),
    location: z.string().optional().describe("City or district, e.g. 'Mogadishu'."),
    limit: z.number().int().optional().describe("Max rows to return, default 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category_key, location, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("vendor_profiles")
      .select("id,business_name,category_key,description,location,is_active")
      .eq("is_active", true)
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));
    if (category_key) q = q.eq("category_key", category_key);
    if (location) q = q.ilike("location", `%${location}%`);
    if (query) q = q.or(`business_name.ilike.%${query}%,description.ilike.%${query}%`);
    const { data, error } = await q;
    if (error) return errorResult(error.message);
    return textResult({ vendors: data ?? [] });
  },
});
