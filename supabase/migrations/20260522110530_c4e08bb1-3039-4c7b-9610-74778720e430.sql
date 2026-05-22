
-- 1. Add mobile money fields to vendor_profiles
ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS evc_number text,
  ADD COLUMN IF NOT EXISTS edahab_number text;

-- 2. Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  vendor_id uuid NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.vendor_posts(id) ON DELETE SET NULL,
  booking_ref text,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD','SOS')),
  method text NOT NULL CHECK (method IN ('evc','edahab')),
  reference text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_vendor ON public.payments(vendor_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON public.payments(customer_id, created_at DESC);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Customer creates own payment
CREATE POLICY "Customers create own payments"
ON public.payments FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Customer reads own
CREATE POLICY "Customers read own payments"
ON public.payments FOR SELECT TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = payments.vendor_id AND vp.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- Vendor (or admin) updates status
CREATE POLICY "Vendor updates own payments"
ON public.payments FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = payments.vendor_id AND vp.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = payments.vendor_id AND vp.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- Admin full manage
CREATE POLICY "Admin manages payments"
ON public.payments FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
