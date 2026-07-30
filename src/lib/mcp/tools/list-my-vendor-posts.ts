import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "list_my_vendor_posts",
  title: "List my vendor listings",
  description:
    "List listings belonging to the signed-in user's vendor profile, including unpublished drafts. Returns an empty list if the user is not a vendor.",
  inputSchema: {
    limit: z.number().int().optional().describe("Max rows to return, default 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const supabase = supabaseForUser(ctx);
    const { data: vendor, error: vErr } = await supabase
      .from("vendor_profiles")
      .select("id,business_name,category_key,is_active")
      .eq("user_id", ctx.getUserId())
      .maybeSingle();
    if (vErr) return errorResult(vErr.message);
    if (!vendor) return textResult({ vendor: null, listings: [], note: "No vendor profile for this account." });
    const { data, error } = await supabase
      .from("vendor_posts")
      .select("id,title,description,category_key,price,price_unit,currency,location,is_published,created_at")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));
    if (error) return errorResult(error.message);
    return textResult({ vendor, listings: data ?? [] });
  },
});
