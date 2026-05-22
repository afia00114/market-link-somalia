
CREATE TABLE public.hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  name text NOT NULL,
  type text,
  city text NOT NULL,
  region text,
  country text NOT NULL DEFAULT 'Somalia',
  district text,
  address text,
  phone text,
  whatsapp text,
  email text,
  website text,
  image_url text,
  gallery text[] DEFAULT '{}'::text[],
  services text[] DEFAULT '{}'::text[],
  departments text[] DEFAULT '{}'::text[],
  about text,
  rating numeric(2,1),
  reviews_count int NOT NULL DEFAULT 0,
  is_24_7 boolean NOT NULL DEFAULT false,
  is_verified boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_hospitals_city ON public.hospitals (city);
CREATE INDEX idx_hospitals_country ON public.hospitals (country);
CREATE INDEX idx_hospitals_published ON public.hospitals (is_published);

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published hospitals"
ON public.hospitals FOR SELECT
USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage hospitals"
ON public.hospitals FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
