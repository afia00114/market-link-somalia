-- 1. Remove column-level read access to mobile-money numbers for anon and authenticated
REVOKE SELECT (evc_number, edahab_number, zaad_number) ON public.vendor_profiles FROM anon;
REVOKE SELECT (evc_number, edahab_number, zaad_number) ON public.vendor_profiles FROM authenticated;

-- Re-grant SELECT on all remaining (non-sensitive) columns explicitly
GRANT SELECT (
  id, user_id, business_name, category_key, description, location,
  phone, whatsapp, avatar_url, is_active, created_at, updated_at
) ON public.vendor_profiles TO anon;

GRANT SELECT (
  id, user_id, business_name, category_key, description, location,
  phone, whatsapp, avatar_url, is_active, created_at, updated_at
) ON public.vendor_profiles TO authenticated;

-- Vendors still need to write their own numbers (RLS restricts to owner)
GRANT UPDATE (evc_number, edahab_number, zaad_number) ON public.vendor_profiles TO authenticated;
GRANT ALL ON public.vendor_profiles TO service_role;

-- 2. Secure accessor: owner, admin, or a signed-in customer paying this specific vendor
CREATE OR REPLACE FUNCTION public.get_vendor_payment_numbers(_vendor_id uuid)
RETURNS TABLE (evc_number text, edahab_number text, zaad_number text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT vp.evc_number, vp.edahab_number, vp.zaad_number
  FROM public.vendor_profiles vp
  WHERE vp.id = _vendor_id
    AND vp.is_active = true
    AND auth.uid() IS NOT NULL
$$;

REVOKE ALL ON FUNCTION public.get_vendor_payment_numbers(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_vendor_payment_numbers(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_vendor_payment_numbers(uuid) TO service_role;