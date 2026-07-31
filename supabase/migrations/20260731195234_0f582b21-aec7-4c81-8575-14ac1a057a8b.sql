REVOKE SELECT ON public.vendor_profiles FROM anon;
REVOKE SELECT ON public.vendor_profiles FROM authenticated;

GRANT SELECT (
  id, user_id, business_name, category_key, description, location,
  phone, whatsapp, avatar_url, is_active, created_at, updated_at
) ON public.vendor_profiles TO anon;

GRANT SELECT (
  id, user_id, business_name, category_key, description, location,
  phone, whatsapp, avatar_url, is_active, created_at, updated_at
) ON public.vendor_profiles TO authenticated;