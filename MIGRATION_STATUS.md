# Supabase migration — honest status and next steps

## What is already ready
- Responsive static frontend (desktop, tablet, mobile)
- Supabase schema draft in `SUPABASE_SCHEMA.sql`
- Public Supabase URL + anon key configuration template (`supabase-config.example.js`)
- Example server environment (`.env.example`)
- Admin CRUD UI and customer registration/login UI exist

## Important: the app is not cloud-connected yet
`assets/db.js` currently reads/writes the app data to browser `localStorage` (`tp_db`, `tp_sess`). The visible login/signup, product/cart/order, therapist application, contact form, and admin editing workflows still use the local browser database. The SQL schema by itself does not connect those features to Supabase. A successful deployment of this starter will not yet provide cross-device login or shared data.

## Target migration checklist
1. Supabase Auth: register/login/logout using Auth sessions; username lookup for login must be handled carefully; passwords must never be stored in application tables or local hashes.
2. `user_profiles`: username, display name, phone, city; profile rows tied to Auth UUID.
3. Public read: products, courses, articles, site settings, verified therapists.
4. Public write-only forms: therapist applications, contact messages, order requests. Anonymous clients must not be allowed to read these submissions.
5. Admin CRUD: only users in `admin_users` can read/update/delete applications, messages, orders or edit website content.
6. Cross-device state: persist session and data in Supabase; keep localStorage only for temporary cart/UI state.
7. Supabase Storage: upload product/therapist images; do not persist large base64 images into Postgres rows.
8. Test in two browsers/devices, verify access policies, then deploy.

## Credentials safety
- The Supabase project URL and public/anon key can be used in frontend config only when Row Level Security (RLS) is enabled and policies are reviewed.
- Never put service-role/secret keys or database passwords in frontend files, the ZIP, Git, or Netlify static environment variables.
- Remove demo admin account and sample content before going live.
