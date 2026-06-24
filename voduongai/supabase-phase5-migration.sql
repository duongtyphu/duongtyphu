-- Phase 5 migration: Services (was localStorage-only, now Supabase-backed)
-- Run this whole script once in the Supabase SQL Editor.

create table if not exists services (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table services enable row level security;
drop policy if exists "public read published" on services;
create policy "public read published" on services for select using (status in ('Published', 'Active'));

insert into services (id, data, status, "order") values
  ('service_1', '{"id":"service_1","title":"Tư vấn 1:1 với Võ Đương AI","description":"Tư vấn riêng để xây lộ trình AI và Affiliate phù hợp với hoàn cảnh, nguồn lực của bạn.","ctaLabel":"Liên hệ tư vấn","ctaType":"email","ctaValue":"","order":1,"status":"Published"}'::jsonb, 'Published', 1)
on conflict (id) do nothing;
