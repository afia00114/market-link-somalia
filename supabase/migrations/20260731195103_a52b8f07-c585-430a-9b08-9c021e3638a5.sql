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
    AND auth.uid() IS NOT NULL
    AND (vp.is_active = true OR vp.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
$$;

REVOKE ALL ON FUNCTION public.get_vendor_payment_numbers(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_vendor_payment_numbers(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_vendor_payment_numbers(uuid) TO service_role;