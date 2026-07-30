import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const startConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { vendorId: string; postId?: string | null }) => input)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: id, error } = await supabaseAdmin.rpc("start_conversation", {
      _vendor_id: data.vendorId,
      _post_id: data.postId ?? undefined,
      _caller: context.userId,
    } as never);
    if (error) throw new Error(error.message);
    return { conversationId: id as unknown as string };
  });

export const approveVendorApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { applicationId: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("approve_vendor_application", {
      _application_id: data.applicationId,
      _caller: context.userId,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
