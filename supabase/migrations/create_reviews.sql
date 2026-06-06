-- Create unified reviews table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  name text,
  rating numeric,
  review_text text,
  review_date timestamptz,
  profile_photo text,
  source text, -- 'google' or 'web'
  google_review_id text, -- unique id from Google to prevent duplicates
  approved boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_reviews_google_id on public.reviews(google_review_id);
create index if not exists idx_reviews_approved on public.reviews(approved);
