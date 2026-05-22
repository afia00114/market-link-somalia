
-- 1. Extend role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendor';

-- 2. vendor_applications
CREATE TABLE public.vendor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  business_name text NOT NULL,
  category_key text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  location text,
  description text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own application"
  ON public.vendor_applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own application"
  ON public.vendor_applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update applications"
  ON public.vendor_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER vendor_applications_updated_at
  BEFORE UPDATE ON public.vendor_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. vendor_profiles
CREATE TABLE public.vendor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  business_name text NOT NULL,
  category_key text NOT NULL,
  description text,
  location text,
  phone text NOT NULL,
  whatsapp text,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active vendors"
  ON public.vendor_profiles FOR SELECT
  USING (is_active = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendor updates own profile"
  ON public.vendor_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin manages vendor profiles"
  ON public.vendor_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER vendor_profiles_updated_at
  BEFORE UPDATE ON public.vendor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. vendor_posts
CREATE TABLE public.vendor_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category_key text NOT NULL,
  price numeric,
  price_unit text,
  currency text DEFAULT 'USD',
  image_url text,
  location text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX vendor_posts_category_idx ON public.vendor_posts(category_key);
CREATE INDEX vendor_posts_vendor_idx ON public.vendor_posts(vendor_id);
ALTER TABLE public.vendor_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts"
  ON public.vendor_posts FOR SELECT
  USING (
    is_published = true
    OR EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = vendor_id AND vp.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Vendor manages own posts"
  ON public.vendor_posts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = vendor_id AND vp.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = vendor_id AND vp.user_id = auth.uid()));

-- 5. Approval function
CREATE OR REPLACE FUNCTION public.approve_vendor_application(_application_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _app public.vendor_applications%ROWTYPE;
  _vendor_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve';
  END IF;

  SELECT * INTO _app FROM public.vendor_applications WHERE id = _application_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found'; END IF;

  INSERT INTO public.vendor_profiles (user_id, business_name, category_key, phone, whatsapp, location, description)
  VALUES (_app.user_id, _app.business_name, _app.category_key, _app.phone, _app.whatsapp, _app.location, _app.description)
  ON CONFLICT (user_id) DO UPDATE
    SET business_name = EXCLUDED.business_name,
        category_key = EXCLUDED.category_key,
        phone = EXCLUDED.phone,
        whatsapp = EXCLUDED.whatsapp,
        location = EXCLUDED.location,
        description = EXCLUDED.description
  RETURNING id INTO _vendor_id;

  INSERT INTO public.user_roles (user_id, role) VALUES (_app.user_id, 'vendor')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.vendor_applications SET status = 'approved' WHERE id = _application_id;

  RETURN _vendor_id;
END;
$$;
