# Harsh Physio Clinic

A premium physiotherapy website built with React, TypeScript, Tailwind CSS, and Supabase.

## Production Readiness Audit

### Status

- ✅ `npm run build` passes successfully
- ✅ `npm run lint` reports zero errors
- ✅ No frontend runtime console errors detected on the reviews page
- ✅ Reviews section uses realtime subscriptions and fallback sample reviews
- ✅ Booking form validates required fields and opens WhatsApp
- ⚠️ `bookings` insert is currently blocked by Supabase RLS in the current configuration

### Key Notes

- Public frontend uses only `VITE_SUPABASE_*` vars
- Secret keys are only used by serverless functions and should remain in secret storage
- SEO metadata and schema markup are present in `index.html`

---

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Framer Motion
- Lucide React

---

## Required Environment Variables

Copy `.env.example` to `.env` and update values.

### Required for frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Optional

- `GOOGLE_API_KEY`
- `GOOGLE_PLACE_ID`

### Serverless / notifications

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE`
- `SMTP_FROM`
- `CLINIC_EMAIL`
- `CLINIC_PHONE`
- `VITE_API_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Local Setup

```bash
npm install
cp .env.example .env
# update .env values
npm run dev
```

Open: `http://localhost:5173`

---

## Supabase Setup

1. Create a Supabase project.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run migrations for `reviews` and `bookings`.
4. If you use RLS, add project policies for `bookings` insert or allow the frontend anon role.
5. For production, keep `SUPABASE_SERVICE_ROLE_KEY` secret and only use it in server-side code.

Use `SUPABASE_RLS_POLICY.sql` for recommended policy examples.

---

## Review + Booking Behavior

### Reviews

- Pulls up to 12 approved reviews from Supabase
- Uses realtime `INSERT` subscriptions
- Displays fallback reviews when database entries are missing
- Renders two marquee rows with opposite scroll directions

### Booking Form

- Requires name and phone
- Optional email and preferred date
- Saves booking to Supabase
- Opens WhatsApp chat with a prefilled message
- Sends booking notification through serverless email endpoint

---

## Performance

- Production build verified
- Build output has some large chunks; consider code-splitting for further optimization
- Contact iframe uses `loading="lazy"`

---

## SEO

- Page title and description configured
- Open Graph tags and Twitter card metadata present
- `application/ld+json` schema markup included

---

## Security

- No secret keys are exposed in frontend source
- Frontend uses only public Supabase anon key
- Protected serverless operations should use platform secret storage

---

## Deployment Guide

See `DEPLOYMENT_GUIDE.md` for platform-specific instructions.

---

## Helpful Scripts

```bash
npm run dev
npm run build
npm run lint
npm run verify-tables
npm run disable-rls
npm run seed-reviews
npm run test-supabase
```
