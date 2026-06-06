# Deployment Guide

## Overview

This app is designed to deploy to Netlify or Vercel with static hosting and optional serverless functions.

## Prerequisites

- Node.js installed
- Supabase project configured
- Netlify or Vercel account

## Environment Variables

Configure the following values in your target deployment platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-site.netlify.app/.netlify/functions or https://your-site.vercel.app/api
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SMTP_SECURE=false
SMTP_FROM=clinic@example.com
CLINIC_EMAIL=clinic@example.com
CLINIC_PHONE=+91 63919 89878
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Important

- `VITE_SUPABASE_ANON_KEY` is public and used by the frontend only.
- `SUPABASE_SERVICE_ROLE_KEY` is secret and must never be exposed to frontend code.

## Build Command

Use:

```bash
npm run build
```

## Publish Directory

Set the publish directory to:

```text
dist
```

## Netlify

1. Connect your Git repository.
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`
4. Add required environment variables under Site settings → Build & deploy → Environment.
5. If using Netlify functions, configure function path and use the Netlify CLI if needed.

## Vercel

1. Connect your Git repository.
2. Set the framework preset to Vite.
3. Add required environment variables in Project Settings → Environment Variables.
4. Deploy.

## Supabase RLS

If Supabase Row Level Security is enabled for `bookings`, add a policy to allow anonymous insert. Example in `SUPABASE_RLS_POLICY.sql`.

## Verification After Deploy

- Visit the site and confirm the homepage loads.
- Submit a review and verify it appears in the reviews section.
- Submit a booking and verify it is stored in Supabase.
- Confirm WhatsApp booking prefill works.

## Notes

- The app includes fallback reviews to avoid empty review sections.
- If booking insert fails, verify Supabase RLS policy and table permissions.
- Keep SMTP credentials secret and store them in platform environment variables only.
