# Supabase migrations — apply order

This repo's SQL is split across two folders with no single index, so it's
easy to lose track of what's been run and in what order. This file is that
index. If the Supabase project is ever lost, run the files below **in this
order** on a fresh project to fully reproduce the schema (members, orders,
courses, lessons, products, referrals, support, affiliate/content store,
etc).

Everything is idempotent (`create table if not exists`, `drop policy if
exists`), so re-running an already-applied file is safe.

## 1. Root (`/`) — core relational schema

1. `supabase-setup.sql` — members, documents, courses, lessons, products,
   orders + the `handle_new_user` signup trigger.
2. `supabase-referral-email-setup.sql` — adds `referral_code`/`referred_by`
   to members, the auto-generate-code trigger, `referrals`, `email_log`,
   and the order-confirmed → commission trigger. **Depends on #1** (alters
   `members`/`orders`, references them in triggers).
3. `supabase-fixes.sql` — fixes `lessons.course_id` type, adds
   `orders.lesson_id`/`course_id`/`order_code`, `referrals.paid_at`,
   backfills missing referral codes. **Depends on #1 and #2** (alters
   `referrals`, which #2 creates).
4. `supabase-group2.sql` — leads, course_schedules, coupons, case_studies,
   experts, blog_posts. Independent of the above.
5. `supabase-group2-coupon-policy.sql` — one extra policy on `coupons`.
   **Depends on #4.**
6. `supabase-group3-part1.sql` — notifications, support_tickets.
   Independent.
7. `supabase-group3-part2.sql` — prompt_templates, submissions.
   Independent.

## 2. `voduongai/` — Next.js app additions

Run after the root files above (these assume `members`/`orders` already
exist):

8. `supabase-phase2-migration.sql`, `supabase-phase3-migration.sql`,
   `supabase-phase4-migration.sql`, `supabase-phase5-migration.sql` —
   generic `(id, data jsonb, status)` content tables for the admin CMS
   (prompts, tools, portal builder, affiliate, digital assets, services...).
   Independent of the root files, can run anytime.
9. `supabase-admin-auth.sql` — adds `members.is_admin` + read policy, grants
   the owner account admin. **Depends on #1.**
10. `supabase-orders-customer-info.sql` — adds `orders.customer_name`/
    `customer_phone`. **Depends on #1.**
11. `supabase-orders-payment-reference.sql` — adds
    `orders.payment_reference` (SePay webhook). **Depends on #1.**
12. `supabase-saved-items.sql` — `saved_items` bookmark table. Independent.
13. `supabase-digital-asset-links-deactivate.sql` — one-off data fix,
    deactivates placeholder example.com links. **Depends on #8** (phase 4
    creates `digital_asset_links`).
14. `supabase-coupons-fix.sql` — reconciles the `coupons` table (see below).
    **Depends on #4** (`supabase-group2.sql` creates `coupons`).

## Resolved: duplicate `coupons` definition

`voduongai/supabase-coupons.sql` used to create a **second**, slightly
different `coupons` table definition (added a
`check (discount_type in ('percent', 'fixed'))` constraint and NOT NULL
defaults that `supabase-group2.sql`'s version didn't have). Since both used
`create table if not exists`, `supabase-group2.sql`'s version is the one
that's actually live (it ran first). The app code (`coupons/actions.ts`)
confirms `discount_type` values are `"percent" | "fixed"`, matching the
voduongai version's constraint — not group2.sql's stale comment
(`-- percent | amount`). `voduongai/supabase-coupons.sql` has been deleted;
`supabase-coupons-fix.sql` (step 14) brings the live table up to the same
NOT NULL + check-constraint strictness via `ALTER TABLE`, safe to run on
the already-existing table.
