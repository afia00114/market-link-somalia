
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  user_id uuid null,
  service text not null,
  offer_id text,
  provider_name text,
  provider_phone text,
  provider_whatsapp text,
  details jsonb not null default '{}'::jsonb,
  passenger_name text not null,
  passenger_email text not null,
  passenger_phone text not null,
  notes text,
  unit_price numeric,
  total numeric,
  currency text default 'USD',
  channel text not null default 'whatsapp',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Anyone can create bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

create policy "Owners can view own bookings"
  on public.bookings for select
  to authenticated
  using (user_id = auth.uid() or passenger_email = auth.jwt() ->> 'email');

create index bookings_user_id_idx on public.bookings(user_id);
create index bookings_email_idx on public.bookings(passenger_email);
create index bookings_created_at_idx on public.bookings(created_at desc);
