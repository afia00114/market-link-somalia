import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "search_hospitals",
  title: "Search hospitals",
  description: "Search the MaalsoorHub health directory of hospitals and clinics by name, city or type.",
  inputSchema: {
    query: z.string().optional().describe("Free text matched against hospital name."),
    city: z.string().optional().describe("City, e.g. 'Mogadishu'."),
    type: z.string().optional().describe("Facility type, e.g. 'hospital', 'clinic'."),
    limit: z.number().int().optional().describe("Max rows to return, default 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, city, type, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("hospitals")
      .select("id,slug,name,type,city,region,district,address,phone,is_24_7,is_verified")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));
    if (city) q = q.ilike("city", `%${city}%`);
    if (type) q = q.ilike("type", `%${type}%`);
    if (query) q = q.ilike("name", `%${query}%`);
    const { data, error } = await q;
    if (error) return errorResult(error.message);
    return textResult({ hospitals: data ?? [] });
  },
});
