CREATE TABLE public.subscription_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text NOT NULL UNIQUE,
  plan text NOT NULL,
  method text NOT NULL,
  payer_name text NOT NULL,
  payer_phone text NOT NULL,
  payer_email text,
  amount numeric,
  currency text DEFAULT 'USD',
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit subscription requests"
ON public.subscription_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);