-- Phase 23: fix P0 bug — new-user signup (magic-link) fails because
-- handle_new_auth_user() inserts into public.members without `email`,
-- which is NOT NULL. Every new signup (any email that doesn't already
-- exist) raised a Postgres not-null violation inside the AFTER INSERT
-- trigger, rolling back the whole auth.users insert and surfacing as a
-- generic 500 from GoTrue.
--
-- Applied directly via Supabase MCP (apply_migration) on 2026-07-29,
-- tracked here for history per project convention. See CLAUDE.md
-- "BUG P0 ĐÃ SỬA — Đăng ký mới (magic-link) hoàn toàn không hoạt động"
-- for full investigation, repro, and verification notes.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.members (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;

-- Data repair: backfill the one confirmed orphaned real user who hit
-- this bug before the fix (auth.users row existed, public.members did
-- not). full_name preserved from raw_user_meta_data, not invented.
insert into public.members (id, email, full_name)
select id, email, coalesce(raw_user_meta_data->>'full_name', email)
from auth.users
where id = '654c1dac-87b6-490e-a741-b82206bea1f1'
on conflict (id) do nothing;
