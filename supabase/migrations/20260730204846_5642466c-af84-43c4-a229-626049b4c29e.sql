CREATE OR REPLACE FUNCTION public.approve_vendor_application(_application_id uuid, _caller uuid DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _app public.vendor_applications%ROWTYPE;
  _vendor_id uuid;
  _uid uuid := coalesce(auth.uid(), _caller);
BEGIN
  IF _uid IS NULL OR NOT public.has_role(_uid, 'admin') THEN
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
$function$;

CREATE OR REPLACE FUNCTION public.start_conversation(_vendor_id uuid, _post_id uuid DEFAULT NULL, _caller uuid DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _uid uuid := coalesce(auth.uid(), _caller);
  _vendor_user uuid;
  _conv_id uuid;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT user_id INTO _vendor_user FROM public.vendor_profiles WHERE id = _vendor_id;
  IF _vendor_user IS NULL THEN RAISE EXCEPTION 'Vendor not found'; END IF;
  IF _vendor_user = _uid THEN RAISE EXCEPTION 'Cannot message yourself'; END IF;

  SELECT id INTO _conv_id FROM public.conversations
   WHERE customer_id = _uid AND vendor_id = _vendor_id
     AND ((post_id IS NULL AND _post_id IS NULL) OR post_id = _post_id)
   LIMIT 1;

  IF _conv_id IS NULL THEN
    INSERT INTO public.conversations (customer_id, vendor_id, post_id)
    VALUES (_uid, _vendor_id, _post_id)
    RETURNING id INTO _conv_id;
  END IF;
  RETURN _conv_id;
END;
$function$;

DROP FUNCTION IF EXISTS public.approve_vendor_application(uuid);
DROP FUNCTION IF EXISTS public.start_conversation(uuid, uuid);

REVOKE ALL ON FUNCTION public.approve_vendor_application(uuid, uuid) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.start_conversation(uuid, uuid, uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_vendor_application(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.start_conversation(uuid, uuid, uuid) TO service_role;