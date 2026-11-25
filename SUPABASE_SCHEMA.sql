-- Totok Punggung Medan: schema foundation for Supabase (Postgres)
-- Run this in Supabase Dashboard > SQL Editor. Public-facing tables use RLS.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_site_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = auth.uid()
  );
$$;


create table if not exists public.therapists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  experience_years integer not null default 0 check (experience_years between 0 and 60),
  specialties text[] not null default '{}',
  description text,
  photo_url text,
  whatsapp text not null,
  status text not null default 'review' check (status in ('verified','review','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text,
  price integer not null check (price >= 0),
  previous_price integer check (previous_price is null or previous_price >= 0),
  description text,
  image_url text,
  image_urls text[] not null default '{}',
  stock_status text not null default 'available' check (stock_status in ('available','sold_out')),
  created_at timestamptz not null default now()
);
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text,
  duration text,
  price integer not null default 0 check (price >= 0),
  modules text[] not null default '{}',
  description text,
  created_at timestamptz not null default now()
);
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  intro text,
  body text,
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  brand text not null default 'Totok Punggung Medan',
  whatsapp text,
  service_hours text,
  updated_at timestamptz not null default now()
);
create table if not exists public.therapist_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  whatsapp text not null,
  experience_years integer not null default 0 check (experience_years between 0 and 60),
  specialties text,
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  topic text,
  message text not null,
  status text not null default 'new' check (status in ('new','processing','done')),
  created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  contact text,
  items jsonb not null default '[]'::jsonb,
  total integer not null check (total >= 0),
  status text not null default 'new' check (status in ('new','processing','done')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.therapists enable row level security;
alter table public.products enable row level security;
alter table public.courses enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;
alter table public.therapist_applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.orders enable row level security;

-- Public visitors can read the published directory/catalog/content only.
create policy "public read therapists" on public.therapists for select using (status = 'verified' or public.is_site_admin());
create policy "public read products" on public.products for select using (true);
create policy "public read courses" on public.courses for select using (true);
create policy "public read articles" on public.articles for select using (true);
create policy "public read site settings" on public.site_settings for select using (true);
-- Public forms can submit records; they cannot read or edit the submissions.
create policy "public submit therapist application" on public.therapist_applications for insert with check (true);
create policy "public submit contact message" on public.contact_messages for insert with check (true);
create policy "public submit order" on public.orders for insert with check (true);
-- Admin access to submissions and CRUD for content is checked against admin_users.
create policy "admins manage admin list" on public.admin_users for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage therapists" on public.therapists for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage products" on public.products for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage courses" on public.courses for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage articles" on public.articles for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage site settings" on public.site_settings for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins read and manage applications" on public.therapist_applications for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins read and manage messages" on public.contact_messages for all using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins read and manage orders" on public.orders for all using (public.is_site_admin()) with check (public.is_site_admin());

insert into public.site_settings (id, brand, service_hours) values (1, 'Totok Punggung Medan', 'Setiap hari, 08.00–20.00 WIB') on conflict (id) do nothing;


-- Multi-device account profiles (linked to Supabase Auth, not localStorage).
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
-- Authenticated users may read their own profile only. Username lookup for login
-- is intentionally provided through a narrowly scoped RPC returning the email.
create policy "users read own profile" on public.user_profiles
  for select to authenticated using (user_id = auth.uid());
create policy "users insert own profile" on public.user_profiles
  for insert to authenticated with check (user_id = auth.uid());
create policy "users update own profile" on public.user_profiles
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.login_email_for_username(p_username text)
returns text language sql stable security definer set search_path = public
as $$
  select u.email from public.user_profiles p
  join auth.users u on u.id = p.user_id
  where lower(p.username) = lower(trim(p_username))
  limit 1;
$$;
revoke all on function public.login_email_for_username(text) from public;
grant execute on function public.login_email_for_username(text) to anon, authenticated;

-- Admin membership must be granted by an owner using the SQL editor, never by
-- an untrusted browser client. Example after signup:
-- insert into public.admin_users(user_id,email)
-- select id,email from auth.users where email='YOUR_ADMIN_EMAIL';

-- To grant admin after creating an account through Supabase Auth, run:
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'YOUR_ADMIN_EMAIL';
