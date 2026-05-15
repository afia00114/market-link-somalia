
drop policy "Anyone can create bookings" on public.bookings;

create policy "Guests can insert anonymous bookings"
  on public.bookings for insert
  to anon
  with check (user_id is null);

create policy "Users can insert own bookings"
  on public.bookings for insert
  to authenticated
  with check (user_id is null or user_id = auth.uid());
