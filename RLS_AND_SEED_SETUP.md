# Quick Setup: Disable RLS & Seed Reviews

## STEP 1: Disable RLS in Supabase Dashboard

RLS (Row-Level Security) is currently **blocking all inserts**. You must disable it for development.

### Option A: Using Supabase Dashboard UI (Recommended)

1. Go to: https://supabase.com/dashboard
2. Select your project: `yksghxmsncgxfbfrqnbw`
3. Navigate to: **Authentication** → **Policies**
4. Find table `reviews` → Click the toggle to **Disable RLS**
5. Find table `bookings` → Click the toggle to **Disable RLS**

### Option B: Using SQL (Faster)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click: **SQL Editor** → **New Query**
4. Copy and paste:

```sql
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
```

5. Click **Run**

---

## STEP 2: Seed Sample Reviews

Once RLS is disabled, run:

```bash
npm run seed-reviews
```

**Expected output:**

```
✅ Successfully inserted 6 sample reviews!
```

---

## STEP 3: Start Development Server

```bash
npm run dev
```

The app will run at: **http://localhost:5173**

---

## STEP 4: View the Marquee Reviews

1. Open http://localhost:5173
2. Scroll to **"What Our Patients Say"** section
3. See two rows of reviews scrolling in opposite directions
4. Hover to pause scrolling

---

## STEP 5: Test Realtime Updates

1. Scroll to **"Leave A Review"** form
2. Fill in: Name, Rating (5 stars), Review text
3. Click **Submit Review**
4. Watch the marquee update in real-time!

---

## Troubleshooting

**"new row violates row-level security policy"**
→ RLS is still enabled. Complete STEP 1 above.

**Seed fails with network error**
→ Check your internet connection and Supabase URL in `.env`

**Marquee not scrolling**
→ You need at least 6 reviews. Complete STEP 2.

**Reviews not persisting after page reload**
→ Check browser console (F12) for Supabase errors.

---

**Next:** Complete the steps above, then share a screenshot of the marquee reviews section!
