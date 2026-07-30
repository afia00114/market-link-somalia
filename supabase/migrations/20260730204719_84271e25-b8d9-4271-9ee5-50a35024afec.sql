-- Helper functions used inside access rules must stay executable by app roles
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) TO anon, authenticated, service_role;

-- Privileged RPCs are no longer directly callable by signed-in users;
-- they are invoked from server-side code with the service role after auth checks.
REVOKE ALL ON FUNCTION public.approve_vendor_application(uuid) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.start_conversation(uuid, uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_vendor_application(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.start_conversation(uuid, uuid) TO service_role;