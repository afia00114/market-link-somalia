
-- 1) Hide vendor payment account numbers from anonymous visitors (column-level)
REVOKE SELECT (evc_number, edahab_number) ON public.vendor_profiles FROM anon;
-- authenticated already retains SELECT via table-level grant; RLS still applies

-- 2) Restrict profiles read to authenticated users
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- 3) Admin SELECT for bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4) Admin SELECT for subscription_requests
CREATE POLICY "Admins can view subscription requests"
ON public.subscription_requests FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5) Reviews: require authentication to submit, keep public read
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
CREATE POLICY "Authenticated users can submit reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 6) Subscription requests: tighten INSERT check (avoid literal TRUE lint, keep public submit)
DROP POLICY IF EXISTS "Anyone can submit subscription requests" ON public.subscription_requests;
CREATE POLICY "Anyone can submit subscription requests"
ON public.subscription_requests FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(payer_name) > 0
  AND length(payer_phone) > 0
  AND length(plan) > 0
  AND length(method) > 0
);

-- 7) Realtime channel authorization: restrict subscriptions to channel members
-- Channel topics convention: 'conversation:<conversation_id>', 'payments:<user_id>'
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read own realtime channels" ON realtime.messages;
CREATE POLICY "Authenticated can read own realtime channels"
ON realtime.messages FOR SELECT
TO authenticated
USING (
  -- Conversation channels: topic = 'conversation:<uuid>' — must be a member
  (
    realtime.topic() LIKE 'conversation:%'
    AND public.is_conversation_member(
      (split_part(realtime.topic(), ':', 2))::uuid,
      auth.uid()
    )
  )
  OR
  -- Payments channel: topic = 'payments:<user_id>'
  (
    realtime.topic() LIKE 'payments:%'
    AND split_part(realtime.topic(), ':', 2) = auth.uid()::text
  )
  OR
  -- Admins can subscribe to anything
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- 8) Lock down SECURITY DEFINER helpers from direct API execution
-- Trigger functions (called by Postgres, never by API):
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.bump_conversation_on_message() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;

-- Internal helpers used only inside RLS policies (executed by policy evaluator):
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) FROM anon, authenticated, public;

-- RPCs that should remain callable by signed-in users:
REVOKE EXECUTE ON FUNCTION public.approve_vendor_application(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.start_conversation(uuid, uuid) FROM anon, public;
-- (authenticated retains EXECUTE for these two — checks are performed inside the function)
