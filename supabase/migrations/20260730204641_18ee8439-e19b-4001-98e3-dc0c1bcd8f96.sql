-- 1) booking_tracking: restrict reads to participants + admins
DROP POLICY IF EXISTS "Public read tracking by ref" ON public.booking_tracking;

CREATE POLICY "Participants read tracking"
ON public.booking_tracking
FOR SELECT
TO authenticated
USING (
  provider_user_id = auth.uid()
  OR customer_user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.ref = booking_tracking.booking_ref
      AND (b.user_id = auth.uid() OR b.passenger_email = (auth.jwt() ->> 'email'))
  )
);

REVOKE SELECT ON public.booking_tracking FROM anon;

-- 2) profiles: no more blanket read for every signed-in user
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;

CREATE POLICY "Users read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Conversation partners read profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.conversations c
    JOIN public.vendor_profiles vp ON vp.id = c.vendor_id
    WHERE (c.customer_id = auth.uid() AND vp.user_id = profiles.id)
       OR (vp.user_id = auth.uid() AND c.customer_id = profiles.id)
  )
);

CREATE POLICY "Admins read profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) internal trigger functions must not be directly callable via the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.bump_conversation_on_message() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.approve_vendor_application(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.start_conversation(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_conversation_member(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;