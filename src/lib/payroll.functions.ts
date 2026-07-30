import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPayroll = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { SERVICES, EMPLOYEES } = await import("./payroll.server");
    return { services: SERVICES, employees: EMPLOYEES };
  });
