-- Human Story Engine (Sprint 7.0): reflections + memory capsules.
-- Run this whole script once in the Supabase SQL Editor.

create table if not exists reflections (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

alter table reflections enable row level security;

drop policy if exists "members manage own reflections" on reflections;
create policy "members manage own reflections"
  on reflections for all
  using (auth.uid() = member_id)
  with check (auth.uid() = member_id);

create table if not exists memory_capsules (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  description text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table memory_capsules enable row level security;

drop policy if exists "members manage own memory capsules" on memory_capsules;
create policy "members manage own memory capsules"
  on memory_capsules for all
  using (auth.uid() = member_id)
  with check (auth.uid() = member_id);
