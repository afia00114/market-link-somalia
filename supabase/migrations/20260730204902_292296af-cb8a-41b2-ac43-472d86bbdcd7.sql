REVOKE ALL ON FUNCTION public.approve_vendor_application(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.start_conversation(uuid, uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_vendor_application(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.start_conversation(uuid, uuid, uuid) TO service_role;