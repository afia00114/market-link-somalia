import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "get_vendor",
  title: "Get vendor details",
  description: "Get one MaalsoorHub vendor profile together with its published listings.",
  inputSchema: { vendor_id: z.string().describe("Vendor profile UUID (from search_vendors).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ vendor_id }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const supabase = supabaseForUser(ctx);
    const [{ data: vendor, error: vErr }, { data: posts, error: pErr }] = await Promise.all([
      supabase
        .from("vendor_profiles")
        .select("id,business_name,category_key,description,location,is_active,created_at")
        .eq("id", vendor_id)
        .maybeSingle(),
      supabase
        .from("vendor_posts")
        .select("id,title,description,price,price_unit,currency,location,created_at")
        .eq("vendor_id", vendor_id)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (vErr) return errorResult(vErr.message);
    if (pErr) return errorResult(pErr.message);
    if (!vendor) return errorResult("Vendor not found.");
    return textResult({ vendor, listings: posts ?? [] });
  },
});
