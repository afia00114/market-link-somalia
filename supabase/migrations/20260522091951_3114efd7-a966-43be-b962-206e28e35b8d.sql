
-- Conversations
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  vendor_id uuid NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.vendor_posts(id) ON DELETE SET NULL,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (customer_id, vendor_id, post_id)
);

CREATE INDEX idx_conversations_customer ON public.conversations(customer_id, last_message_at DESC);
CREATE INDEX idx_conversations_vendor ON public.conversations(vendor_id, last_message_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user a participant of this conversation?
CREATE OR REPLACE FUNCTION public.is_conversation_member(_conversation_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations c
    LEFT JOIN public.vendor_profiles vp ON vp.id = c.vendor_id
    WHERE c.id = _conversation_id
      AND (c.customer_id = _user_id OR vp.user_id = _user_id)
  )
$$;

CREATE POLICY "Members read conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (
    customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = vendor_id AND vp.user_id = auth.uid())
  );

CREATE POLICY "Customers create conversations" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Members update conversations" ON public.conversations
  FOR UPDATE TO authenticated
  USING (
    customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.vendor_profiles vp WHERE vp.id = vendor_id AND vp.user_id = auth.uid())
  );

-- Messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conv ON public.messages(conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read messages" ON public.messages
  FOR SELECT TO authenticated
  USING (public.is_conversation_member(conversation_id, auth.uid()));

CREATE POLICY "Members send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND public.is_conversation_member(conversation_id, auth.uid())
  );

CREATE POLICY "Recipients mark read" ON public.messages
  FOR UPDATE TO authenticated
  USING (public.is_conversation_member(conversation_id, auth.uid()));

-- Bump conversation last_message_at on new message
CREATE OR REPLACE FUNCTION public.bump_conversation_on_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bump_conversation
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_conversation_on_message();

-- Start-or-get conversation
CREATE OR REPLACE FUNCTION public.start_conversation(_vendor_id uuid, _post_id uuid DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
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
$$;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
