-- Base schema for the core relational tables: members, products, lessons,
-- orders. These are NOT part of the generic (id, data jsonb, status) admin
-- store — they're real Postgres tables with typed columns, queried directly
-- by checkout/account/admin code — but unlike every other table in this repo,
-- no CREATE TABLE for them ever existed here. Only incremental ALTER TABLE
-- files (supabase-orders-customer-info.sql, supabase-orders-payment-reference.sql,
-- supabase-admin-auth.sql) were committed, assuming the base tables already
-- existed from manual Supabase Dashboard setup. If the Supabase project were
-- ever lost, the codebase alone could not rebuild the database — this file
-- closes that gap.
--
-- Safe to run on a fresh project AND on the existing production project
-- (every statement is idempotent: `if not exists` / `drop ... if exists`).
-- Run this BEFORE supabase-orders-customer-info.sql / supabase-orders-payment-reference.sql
-- if setting up from scratch (those two are still required after this one).

-- ===== members =====
-- One row per Supabase Auth user. id mirrors auth.users(id).
create table if not exists members (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  referral_code text unique,
  created_at timestamptz not null default now()
);

alter table members enable row level security;

drop policy if exists "members can read own row" on members;
create policy "members can read own row"
  on members for select
  using (auth.uid() = id);

-- ===== products =====
-- Premium digital products sold via /portal/premium (admin-managed in /admin/premium).
create table if not exists products (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  type text not null default 'Product',
  icon text,
  price numeric not null default 0,
  video_url text,
  pdf_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

drop policy if exists "public read active products" on products;
create policy "public read active products"
  on products for select
  using (active = true);

-- ===== lessons =====
-- Standalone paid lessons sold via /portal/vdai-academy.
create table if not exists lessons (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  video_url text,
  pdf_url text,
  price numeric not null default 0,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table lessons enable row level security;

drop policy if exists "public read active lessons" on lessons;
create policy "public read active lessons"
  on lessons for select
  using (active = true);

-- ===== orders =====
-- One row per checkout (product, lesson, or course). Created by the service-role
-- client in checkout/actions.ts; updated by the SePay webhook and admin panel.
create table if not exists orders (
  id bigint generated always as identity primary key,
  member_email text not null,
  product_name text,
  amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  order_code text,
  product_id bigint references products(id) on delete set null,
  lesson_id bigint references lessons(id) on delete set null,
  course_id text,
  customer_name text,
  customer_phone text,
  payment_reference text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- Portal pages (account/my-products/checkout) read via the anon-key, RLS-respecting
-- client, scoped to the signed-in user's own email. This policy was missing
-- entirely before — without it, RLS-on-with-no-policy would hide all rows
-- (breaking the portal), or RLS-off would leak every member's orders.
drop policy if exists "members can read own orders" on orders;
create policy "members can read own orders"
  on orders for select
  using (member_email = auth.jwt() ->> 'email');

-- Writes (insert/update) only ever happen via the service-role client
-- (checkout creation, SePay webhook, admin order management) — no insert/update
-- policy is added, so RLS blocks those operations for the anon/authenticated role.
