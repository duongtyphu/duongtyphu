-- Reconciles the duplicate `coupons` table definition that used to live in
-- voduongai/supabase-coupons.sql (deleted — see SUPABASE_MIGRATIONS.md).
-- That version had a stricter `discount_type` check + NOT NULL defaults that
-- the root supabase-group2.sql table (the one that's actually live, since it
-- ran first) never got. This brings the live table up to that same strictness
-- without touching existing rows. Depends on supabase-group2.sql (#4).

alter table coupons alter column discount_type set not null;
alter table coupons alter column discount_value set not null;
alter table coupons alter column discount_value set default 0;
alter table coupons alter column used_count set not null;
alter table coupons alter column active set not null;
alter table coupons alter column created_at set not null;

do $$
begin
  alter table coupons
    add constraint coupons_discount_type_check
    check (discount_type in ('percent', 'fixed'));
exception
  when duplicate_object then null;
end $$;
