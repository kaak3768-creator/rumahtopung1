# Supabase + Hosting Setup

## Current integration status (read this first)
This ZIP is still a responsive website starter. The frontend's login and most website data actions in `assets/db.js`, `assets/script.js`, and `assets/admin.js` still use browser `localStorage`. The Supabase SQL is a database foundation, not yet a full frontend migration. **Do not consider the website production-ready or multi-device data-synced until the auth and CRUD integration is completed.**

## Supabase project
1. Create a project at https://supabase.com and choose a region near your users.
2. In SQL Editor, run the complete `SUPABASE_SCHEMA.sql`.
3. In Authentication > Providers, enable Email. Decide whether email confirmation is enabled; for live sites it is recommended.
4. In Project Settings > API, copy Project URL and the publishable/anon key. Never copy service_role or secret keys into browser code.
5. `supabase-config.example.js` is a template. Copy to `supabase-config.js` and replace both values. This configuration file alone does not wire the current localStorage login to Supabase.
6. Create your admin account through Supabase Auth, then grant admin in SQL Editor with the comment template at the end of `SUPABASE_SCHEMA.sql`, using the exact email you registered.

## Deploy to Netlify (static site)
1. Keep `index.html`, `admin.html`, `assets/`, and configuration file together.
2. Upload project folder to Netlify Drop or push to Git and import.
3. If using Git, do not commit real configuration keys if you want to manage them privately; however the anon/public key is intended for frontend and must be protected by RLS, while service-role keys are never public.
4. Set your Supabase Auth Site URL to the final Netlify URL and add that URL (and any preview URL you use) to Authentication > URL Configuration > Redirect URLs.
5. Test using two different browsers/devices, including signup, email confirmation, logout, password reset, public data visibility, and admin permissions.

## Before launch
- Remove demo admin credentials and sample users/content.
- Replace sample WhatsApp number, sample testimonials/therapists, and business details.
- Review the RLS policies and tighten public insert rules with validation/rate limiting or a server-side endpoint as appropriate.
- Complete the frontend Supabase Auth and database CRUD migration before advertising multi-device login or shared admin data.
- HTTPS is required; Netlify provides it automatically for deployed sites.

## Migration status reminder
This deployment guide is preparation only. See `MIGRATION_STATUS.md` for the remaining integration work. Do not use the localStorage demo auth/data for a public production site or claim multi-device synchronization yet.


## Supabase bridge scaffold (in progress)
- The HTML now loads Supabase JS v2, `assets/supabase-config.js`, and `assets/supabase-bridge.js`.
- Bridge exposes `window.TPCloud` auth and CRUD helpers after config is supplied.
- **Important:** the existing page workflows are still wired to legacy synchronous `DB`/`localStorage`. The bridge is not yet connected to those workflows, so this build is not a live cloud database version and does not provide cross-device data sync yet.
- Do not deploy this as a finished production system until auth, form writes, admin CRUD, and database access policies are migrated and tested.
