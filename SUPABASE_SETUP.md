# Supabase Setup & Verification Guide

## Current Status

✅ **Completed:**

- Supabase credentials added to `.env`
- React app configured to connect to Supabase
- Review and Booking components implemented
- Test scripts ready

❌ **Pending:**

- Create tables in Supabase (manual SQL needed)
- Verify connectivity and test inserts/realtime

---

## Step 1: Create Tables in Supabase Dashboard

The `reviews` and `bookings` tables **do not exist** yet. You must create them manually.

### Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select project: `yksghxmsncgxfbfrqnbw`

2. **Navigate to SQL Editor**
   - Click **SQL Editor** (left sidebar)
   - Click **New Query**

3. **Run Migrations**
   - Copy the SQL below and paste into the editor
   - Click **Run**

### SQL to Execute:

```sql
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
```

---

## Step 2: Verify Tables Created

After running the SQL, verify by running:

```bash
npm run verify-tables
```

**Expected output:**

```
✅ reviews table: EXISTS and accessible
✅ bookings table: EXISTS and accessible
✅ Review inserted: <uuid>
✅ Booking inserted: <uuid>
✅ All tests passed!
```

---

## Step 3: Start the Development Server

Once verification passes, start the app:

```bash
npm run dev
```

The app will start at: http://localhost:5173

---

## Step 4: Test the Full Flow

### Test Review Submission:

1. Open http://localhost:5173
2. Scroll to **"What Our Patients Say"** section
3. Click **"Leave A Review"**
4. Fill in: Name, Rating (4-5 stars), Review text
5. Click **Submit Review**
6. Review should appear immediately (4-5 stars auto-approved)

### Test Realtime Updates:

- Open the app in two browser tabs
- Submit a review in one tab
- Should appear in real-time in the other tab

### Test Booking:

1. Scroll to **"Contact & Booking"** section
2. Fill in: Name, Phone, Email, Treatment Type, Preferred Date
3. Click **Book Now**
4. Confirmation message should appear
5. Check Supabase Dashboard > bookings table to verify booking was saved

---

## Useful Commands

```bash
# Start dev server
npm run dev

# Verify tables and basic operations
npm run verify-tables

# Show SQL migrations
npm run create-tables

# Run full Supabase connectivity test
npm run test-supabase

# Build for production
npm run build

# Lint code
npm run lint
```

---

## Troubleshooting

### "Could not find the table 'public.reviews'"

→ Tables haven't been created yet. Run the SQL in Supabase Dashboard.

### "Failed to submit review"

→ Check browser console for errors. Common issues:

- Tables don't exist (see above)
- Realtime disabled in Supabase (check project settings)
- Row-Level Security (RLS) too restrictive (disable for now)

### "Realtime event did not fire"

→ This is usually OK. Realtime may require additional RLS configuration or be disabled by default.

### "Supabase connection timeout"

→ Check that `.env` has the correct URL and key:

```
VITE_SUPABASE_URL=https://yksghxmsncgxfbfrqnbw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_3kBEybCxlnLdJShh432QDw_lfU7W6qy
```

---

## Next Steps

After successful setup:

1. ✅ Test all user flows (booking, reviews)
2. ✅ Verify data persists in Supabase
3. ✅ Test realtime review updates
4. ✅ Consider enabling Row-Level Security (RLS) policies for production
5. ✅ Deploy to Netlify/Vercel with serverless functions for email
