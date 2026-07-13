-- IMP-PRODUCTION-HARDENING-1201 — Workstream I/J bug fix.
-- Fixes a silent persistence bug: `website-global-settings` (Website Workspace,
-- WEB-SPR-201 Task 10) and `media-assets` (Media Center, MEDIA-SPR-201) both
-- already have real Admin write UIs using the standard useCollection() hook,
-- but neither collectionKey was ever registered in SUPABASE_COLLECTIONS —
-- so every save silently went to localStorage only (invisible across
-- browsers/sessions, lost on cache clear). This migration adds the two
-- missing tables using the exact same generic shape as every other
-- collection table (see supabase-phase3-migration.sql), so registering the
-- keys in src/lib/admin/supabaseCollections.ts (done in the same commit)
-- makes both persist for real. Purely additive — no existing table touched,
-- no data loss risk. Run once in the Supabase SQL Editor before merge/deploy.
--
-- Rollback: drop table if exists website_global_settings; drop table if exists media_assets;

create table if not exists website_global_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table website_global_settings enable row level security;
-- Internal Admin config only — no public read policy (mirrors settings/portal-sections pattern).

create table if not exists media_assets (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table media_assets enable row level security;
-- Metadata registry only (no real file storage yet, per MEDIA-SPR-201 scope) — no public read policy.
