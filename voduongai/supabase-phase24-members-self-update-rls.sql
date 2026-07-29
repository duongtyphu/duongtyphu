-- Phase 24: fix P0 bug — every newly registered user gets stuck forever
-- bouncing between /onboarding and /portal, and /portal/account's "Save"
-- button silently does nothing for non-admin users.
--
-- Root cause: `members` had RLS enabled with only a SELECT policy for
-- regular users ("auth.uid() = id") plus an "admin_all" FOR ALL policy
-- gated on is_app_admin(). There was NO UPDATE policy for a user to edit
-- their own row. completeOnboarding() (src/app/onboarding/actions.ts) and
-- updateProfile() (src/app/portal/account/actions.ts) both call
-- `.from("members").update(...).eq("id", user.id)` through the anon-key +
-- session-cookie server client (src/lib/supabase-server.ts) — RLS silently
-- filtered the row from the UPDATE (0 rows affected, NO error returned),
-- so the code proceeded as if it succeeded. middleware.ts's onboarding
-- gate then saw onboarding_completed_at still null on the next request and
-- redirected back to /onboarding — an infinite loop. Founder's own account
-- never hit this because is_admin=true already matches "admin_all".
--
-- Applied directly via Supabase MCP (apply_migration) on 2026-07-29,
-- tracked here for history per project convention.

create policy "users can update own profile" on public.members
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Guard against privilege escalation via this new self-update path: a
-- regular user could otherwise flip is_admin/email/id/status/referral_code
-- to arbitrary values on their own row in the same UPDATE call. Lock those
-- columns to their old value unless the actor is an app admin OR the
-- service_role key (Admin panel actions use getSupabaseAdmin(), which
-- must still be able to change is_admin/status/etc. freely and should not
-- be affected by this trigger).
create or replace function public.guard_members_self_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if auth.role() <> 'service_role' and not public.is_app_admin() then
    new.id := old.id;
    new.email := old.email;
    new.is_admin := old.is_admin;
    new.status := old.status;
    new.created_at := old.created_at;
    new.referral_code := old.referral_code;
    new.referred_by := old.referred_by;
  end if;
  return new;
end;
$function$;

drop trigger if exists members_guard_self_update on public.members;
create trigger members_guard_self_update
  before update on public.members
  for each row execute function public.guard_members_self_update();

-- Verify after running:
--   select polname, polcmd from pg_policy where polrelid = 'public.members'::regclass;
--     -> expect "users can update own profile" (cmd 'w') alongside the
--        existing read-only policies and admin_all.
--   select tgname from pg_trigger where tgname = 'members_guard_self_update';
--     -> expect 1 row.
