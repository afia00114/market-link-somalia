import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "list_my_bookings",
  title: "List my bookings",
  description: "List the signed-in user's MaalsoorHub bookings (travel, hotels, services) with status and totals.",
  inputSchema: {
    status: z.string().optional().describe("Filter by booking status, e.g. 'pending', 'confirmed'."),
    limit: z.number().int().optional().describe("Max rows to return, default 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("bookings")
      .select("id,ref,service,provider_name,details,unit_price,total,currency,channel,status,created_at")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return errorResult(error.message);
    return textResult({ bookings: data ?? [] });
  },
});
