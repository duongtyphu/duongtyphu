-- Temporarily hides the 24 placeholder digital-asset links that still point
-- to example.com (live in production since supabase-phase4-migration.sql).
-- Sets BOTH the top-level `status` column (enforced by the public RLS policy
-- `status in ('Published','Active')`) and the nested `data->status` field
-- (read by the admin panel) so the rows disappear from the portal but stay
-- in the DB for the admin to edit with real URLs and re-activate later.
update digital_asset_links
set status = 'Inactive',
    data = jsonb_set(data, '{status}', '"Inactive"')
where id in (
  'dal_1','dal_2','dal_3','dal_4','dal_5','dal_6','dal_7','dal_8','dal_9','dal_10',
  'dal_11','dal_12','dal_13','dal_14','dal_15','dal_16','dal_17','dal_18','dal_19','dal_20',
  'dal_21','dal_22','dal_23','dal_24','dal_25','dal_26'
);
