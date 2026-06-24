-- Saved items: sync Portal "bookmark" feature across devices (was localStorage-only).
-- Run this whole script once in the Supabase SQL Editor.

create table if not exists saved_items (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  kind text not null,
  title text not null,
  href text not null,
  meta text,
  created_at timestamptz not null default now(),
  unique (member_id, item_id)
);

alter table saved_items enable row level security;

drop policy if exists "members manage own saved items" on saved_items;
create policy "members manage own saved items"
  on saved_items for all
  using (auth.uid() = member_id)
  with check (auth.uid() = member_id);
