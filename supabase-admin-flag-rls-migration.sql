-- Migration: make every legacy admin RLS policy recognize members.is_admin,
-- not just the hardcoded email duongvv.vn@gmail.com.
--
-- Context: the modern Next.js app (voduongai) treats `members.is_admin` as
-- the real admin flag (see voduongai/supabase-admin-auth.sql), but every RLS
-- policy written for the legacy admin.html panel still hardcodes
-- `auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com'`. Today there is only one
-- admin and the email matches, so this is not currently exploitable — but if
-- a second admin is ever granted access via `is_admin = true` with a
-- different email, all 18 policies below would silently reject them.
--
-- Approach: is_app_admin() returns TRUE if EITHER the old hardcoded email
-- matches OR members.is_admin is true for the current user — a pure OR/
-- superset of the existing condition. No existing access is removed, so this
-- cannot lock out the current admin or open up any table that wasn't already
-- admin-writable. Safe to run without a maintenance window.
--
-- Run this in Supabase SQL Editor. Idempotent — safe to re-run.

create or replace function public.is_app_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com'
    or exists (
      select 1 from public.members m
      where m.id = auth.uid() and m.is_admin
    );
$$;

-- members
drop policy if exists "admin_all" on public.members;
create policy "admin_all" on public.members for all
  using (public.is_app_admin());

-- documents
drop policy if exists "docs_admin" on public.documents;
create policy "docs_admin" on public.documents for all
  using (public.is_app_admin());

-- courses
drop policy if exists "courses_admin" on public.courses;
create policy "courses_admin" on public.courses for all
  using (public.is_app_admin());

-- lessons
drop policy if exists "Admin all lessons" on public.lessons;
create policy "Admin all lessons" on public.lessons for all
  using (public.is_app_admin());

-- products
drop policy if exists "Admin all products" on public.products;
create policy "Admin all products" on public.products for all
  using (public.is_app_admin());

-- orders
drop policy if exists "Admin all orders" on public.orders;
create policy "Admin all orders" on public.orders for all
  using (public.is_app_admin());

-- referrals (two separate policies were created across two earlier files)
drop policy if exists "Admin full access to referrals" on public.referrals;
create policy "Admin full access to referrals" on public.referrals for all
  using (public.is_app_admin());

drop policy if exists "referrals_admin" on public.referrals;
create policy "referrals_admin" on public.referrals for all
  using (public.is_app_admin());

-- email_log
drop policy if exists "email_log_admin" on public.email_log;
create policy "email_log_admin" on public.email_log for all
  using (public.is_app_admin());

-- leads
drop policy if exists "admin all - leads" on public.leads;
create policy "admin all - leads" on public.leads for all
  using (public.is_app_admin());

-- course_schedules
drop policy if exists "admin all - course_schedules" on public.course_schedules;
create policy "admin all - course_schedules" on public.course_schedules for all
  using (public.is_app_admin());

-- coupons
drop policy if exists "admin all - coupons" on public.coupons;
create policy "admin all - coupons" on public.coupons for all
  using (public.is_app_admin());

-- case_studies
drop policy if exists "admin all - case_studies" on public.case_studies;
create policy "admin all - case_studies" on public.case_studies for all
  using (public.is_app_admin());

-- experts
drop policy if exists "admin all - experts" on public.experts;
create policy "admin all - experts" on public.experts for all
  using (public.is_app_admin());

-- blog_posts
drop policy if exists "admin all - blog_posts" on public.blog_posts;
create policy "admin all - blog_posts" on public.blog_posts for all
  using (public.is_app_admin());

-- prompt_templates
drop policy if exists "admin all - prompt_templates" on public.prompt_templates;
create policy "admin all - prompt_templates" on public.prompt_templates for all
  using (public.is_app_admin());

-- submissions
drop policy if exists "admin all - submissions" on public.submissions;
create policy "admin all - submissions" on public.submissions for all
  using (public.is_app_admin());

-- notifications
drop policy if exists "admin all - notifications" on public.notifications;
create policy "admin all - notifications" on public.notifications for all
  using (public.is_app_admin());

-- support_tickets
drop policy if exists "admin all - support_tickets" on public.support_tickets;
create policy "admin all - support_tickets" on public.support_tickets for all
  using (public.is_app_admin());

-- ── Rollback (restores the exact pre-migration policies) ──
-- drop policy if exists "admin_all" on public.members;
-- create policy "admin_all" on public.members for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "docs_admin" on public.documents;
-- create policy "docs_admin" on public.documents for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "courses_admin" on public.courses;
-- create policy "courses_admin" on public.courses for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "Admin all lessons" on public.lessons;
-- create policy "Admin all lessons" on public.lessons for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "Admin all products" on public.products;
-- create policy "Admin all products" on public.products for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "Admin all orders" on public.orders;
-- create policy "Admin all orders" on public.orders for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "Admin full access to referrals" on public.referrals;
-- create policy "Admin full access to referrals" on public.referrals for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "referrals_admin" on public.referrals;
-- create policy "referrals_admin" on public.referrals for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "email_log_admin" on public.email_log;
-- create policy "email_log_admin" on public.email_log for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - leads" on public.leads;
-- create policy "admin all - leads" on public.leads for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - course_schedules" on public.course_schedules;
-- create policy "admin all - course_schedules" on public.course_schedules for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - coupons" on public.coupons;
-- create policy "admin all - coupons" on public.coupons for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - case_studies" on public.case_studies;
-- create policy "admin all - case_studies" on public.case_studies for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - experts" on public.experts;
-- create policy "admin all - experts" on public.experts for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - blog_posts" on public.blog_posts;
-- create policy "admin all - blog_posts" on public.blog_posts for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - prompt_templates" on public.prompt_templates;
-- create policy "admin all - prompt_templates" on public.prompt_templates for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - submissions" on public.submissions;
-- create policy "admin all - submissions" on public.submissions for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - notifications" on public.notifications;
-- create policy "admin all - notifications" on public.notifications for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop policy if exists "admin all - support_tickets" on public.support_tickets;
-- create policy "admin all - support_tickets" on public.support_tickets for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
-- drop function if exists public.is_app_admin();
