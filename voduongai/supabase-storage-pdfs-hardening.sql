-- Storage hardening for the "pdfs" bucket.
--
-- Context: admin.html (legacy static admin panel) uploads PDFs directly from
-- the browser via the anon key (`_supabase.storage.from('pdfs').upload(...)`)
-- and several tables (lessons.pdf_url, products.pdf_url, documents.url) store
-- the resulting `getPublicUrl()` link. Those existing links must keep working,
-- so this migration does NOT flip the bucket to private — it only:
--   1. Locks mutation (insert/update/delete) down to admins, matching the
--      real role system (`members.is_admin`), not auth.jwt() email hardcoding
--      or client-supplied user_metadata.
--   2. Enforces MIME type + size limit at the Storage API level (so a forged
--      client-side check can't be bypassed by calling the Storage REST API
--      directly with a non-PDF file).
--
-- Rollback: re-run with the corresponding DROP POLICY statements (kept next to
-- each CREATE below as a comment) and:
--   update storage.buckets set allowed_mime_types = null, file_size_limit = null where id = 'pdfs';

-- 1. Bucket-level MIME/size enforcement (server-side — enforced by Supabase
--    Storage itself, not just client code in admin.html).
update storage.buckets
set allowed_mime_types = array['application/pdf'],
    file_size_limit = 20971520 -- 20MB
where id = 'pdfs';

-- 2. Public read — unchanged from current behavior (bucket is public; do not
--    break existing pdf_url / documents.url links).
drop policy if exists "pdfs_public_read" on storage.objects;
create policy "pdfs_public_read"
  on storage.objects for select
  using (bucket_id = 'pdfs');

-- 3. Admin-only upload — no anonymous or member upload.
drop policy if exists "pdfs_admin_insert" on storage.objects;
create policy "pdfs_admin_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'pdfs'
    and exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin)
  );

-- 4. Admin-only update — no member/anonymous overwrite.
drop policy if exists "pdfs_admin_update" on storage.objects;
create policy "pdfs_admin_update"
  on storage.objects for update
  using (
    bucket_id = 'pdfs'
    and exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin)
  );

-- 5. Admin-only delete — no member/anonymous delete.
drop policy if exists "pdfs_admin_delete" on storage.objects;
create policy "pdfs_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'pdfs'
    and exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin)
  );

-- ── Rollback ──
-- drop policy if exists "pdfs_public_read" on storage.objects;
-- drop policy if exists "pdfs_admin_insert" on storage.objects;
-- drop policy if exists "pdfs_admin_update" on storage.objects;
-- drop policy if exists "pdfs_admin_delete" on storage.objects;
-- update storage.buckets set allowed_mime_types = null, file_size_limit = null where id = 'pdfs';
