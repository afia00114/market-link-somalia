import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type VendorRole = "guest" | "user" | "vendor" | "admin";

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  category_key: string;
  description: string | null;
  location: string | null;
  phone: string;
  whatsapp: string | null;
  avatar_url: string | null;
  is_active: boolean;
  evc_number: string | null;
  edahab_number: string | null;
  zaad_number: string | null;
}

export interface VendorApplication {
  id: string;
  status: string;
  business_name: string;
  category_key: string;
  admin_notes: string | null;
  created_at: string;
}

export function useVendor() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [application, setApplication] = useState<VendorApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) {
      setRoles([]);
      setVendorProfile(null);
      setApplication(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: rolesData }, { data: profileData }, { data: appData }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase.from("vendor_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("vendor_applications")
        .select("id,status,business_name,category_key,admin_notes,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    setRoles((rolesData ?? []).map((r) => r.role as string));
    setVendorProfile((profileData as VendorProfile | null) ?? null);
    setApplication((appData as VendorApplication | null) ?? null);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [user?.id, authLoading]);

  return {
    user,
    roles,
    isVendor: roles.includes("vendor"),
    isAdmin: roles.includes("admin"),
    vendorProfile,
    application,
    loading: authLoading || loading,
    refresh,
  };
}
