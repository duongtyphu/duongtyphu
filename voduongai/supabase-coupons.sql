-- Coupons table backing checkout's applyCoupon() — was validate-only, no admin UI to create codes.
-- Run this whole script once in the Supabase SQL Editor.

create table if not exists coupons (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_type text not null default 'percent' check (discount_type in ('percent', 'fixed')),
  discount_value numeric not null default 0,
  max_uses int,
  used_count int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table coupons enable row level security;
-- No public policies: only accessed via the service-role client (admin actions + checkout actions).
