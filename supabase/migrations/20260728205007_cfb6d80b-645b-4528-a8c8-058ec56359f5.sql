CREATE TABLE IF NOT EXISTS public.booking_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text NOT NULL UNIQUE,
  provider_user_id uuid,
  customer_user_id uuid,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  accuracy double precision,
  heading double precision,
  speed double precision,
  status text NOT NULL DEFAULT 'active',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.booking_tracking TO authenticated;
GRANT SELECT ON public.booking_tracking TO anon;
GRANT ALL ON public.booking_tracking TO service_role;

ALTER TABLE public.booking_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read tracking by ref"
  ON public.booking_tracking FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Provider inserts own tracking"
  ON public.booking_tracking FOR INSERT
  TO authenticated
  WITH CHECK (provider_user_id = auth.uid());

CREATE POLICY "Provider updates own tracking"
  ON public.booking_tracking FOR UPDATE
  TO authenticated
  USING (provider_user_id = auth.uid())
  WITH CHECK (provider_user_id = auth.uid());

ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_tracking;
ALTER TABLE public.booking_tracking REPLICA IDENTITY FULL;