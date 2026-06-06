-- Recommended Supabase policies for public frontend use.
-- Use only if you understand the security implications of anonymous writes.

-- Allow public select on reviews if RLS is enabled.
create policy "Allow public select on reviews"
  on public.reviews
  for select
  using (true);

-- Allow anonymous inserts into reviews.
create policy "Allow public insert on reviews"
  on public.reviews
  for insert
  with check (true);

-- Allow anonymous inserts into bookings.
create policy "Allow public insert on bookings"
  on public.bookings
  for insert
  with check (true);

-- If you want to allow read access on bookings for service-side functions only,
-- do not expose select policies publicly unless needed.

-- Enable RLS explicitly if not already enabled.
alter table public.reviews enable row level security;
alter table public.bookings enable row level security;
