
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_ref text,
  service text not null,
  offer_id text not null,
  provider_name text not null,
  rating_quality smallint not null check (rating_quality between 1 and 5),
  rating_timeliness smallint not null check (rating_timeliness between 1 and 5),
  rating_communication smallint not null check (rating_communication between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 1000),
  reviewer_name text not null check (char_length(reviewer_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create unique index reviews_unique_per_booking
  on public.reviews (booking_ref)
  where booking_ref is not null;

create index reviews_offer_idx on public.reviews (service, offer_id);
create index reviews_provider_idx on public.reviews (provider_name);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews for select
  to anon, authenticated
  using (true);

create policy "Anyone can submit reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (true);
