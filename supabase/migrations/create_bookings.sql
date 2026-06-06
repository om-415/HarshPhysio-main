-- Create bookings table for Harsh Physio Clinic
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  name text,
  phone text,
  email text,
  treatment_type text,
  preferred_date timestamptz,
  message text,
  status text default 'pending', -- pending / confirmed / completed / cancelled
  created_at timestamptz default now()
);
