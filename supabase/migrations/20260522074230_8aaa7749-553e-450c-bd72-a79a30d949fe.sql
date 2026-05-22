REVOKE EXECUTE ON FUNCTION public.approve_vendor_application(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.approve_vendor_application(uuid) TO authenticated;