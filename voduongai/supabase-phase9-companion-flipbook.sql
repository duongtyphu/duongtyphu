-- Phase 9 migration: bảng companion_flipbook_pages (Việc 6, Nhóm B, Phần 2)
-- — cùng khuôn generic (id/data jsonb/status/order) như Phase 2-8.
--
-- Founder xác nhận: 7 trang flipbook ("Companion qua hình ảnh") tách riêng
-- khỏi 6 khối ở Phần 1 — CHỈ quản title/thứ tự hiển thị, KHÔNG quản/upload
-- ảnh qua Admin (ảnh vẫn qua quy trình thiết kế/upload asset riêng như
-- hiện tại). `src` lưu lại để Admin đối chiếu (hiển thị, không sửa được
-- qua UI — field không có trong danh sách field chỉnh sửa của trang Admin).
--
-- Giữ nguyên id = đúng `id` trong COMPANION_ARTWORK_SEQUENCE
-- (src/lib/companion-world/artwork-pages.ts) để không gãy tham chiếu chéo
-- nếu có nơi khác dùng slug này.
--
-- Run this whole script once in the Supabase SQL Editor.

create table if not exists companion_flipbook_pages (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_flipbook_pages enable row level security;
drop policy if exists "public read published" on companion_flipbook_pages;
create policy "public read published" on companion_flipbook_pages for select using (status = 'Published');

insert into companion_flipbook_pages (id, data, status, "order") values
  ('companion-home', '{"title":"Xin chào, mình là Companion","src":"/assets/companion-pages/companion-home.webp"}'::jsonb, 'Published', 1),
  ('nhung-dieu-minh-tin', '{"title":"Những điều mình tin","src":"/assets/companion-pages/nhung-dieu-minh-tin.webp"}'::jsonb, 'Published', 2),
  ('cuoc-doi-companion', '{"title":"Cuộc đời Companion","src":"/assets/companion-pages/cuoc-doi-companion.webp"}'::jsonb, 'Published', 3),
  ('book-notes', '{"title":"Book Notes","src":"/assets/companion-pages/book-notes.webp"}'::jsonb, 'Published', 4),
  ('tam-su', '{"title":"Tâm sự cùng bạn","src":"/assets/companion-pages/tam-su-cung-ban.webp"}'::jsonb, 'Published', 5),
  ('nhung-buc-thu', '{"title":"Những bức thư Companion","src":"/assets/companion-pages/nhung-buc-thu-companion.webp"}'::jsonb, 'Published', 6),
  ('di-san', '{"title":"Di sản Companion","src":"/assets/companion-pages/di-san-companion.webp"}'::jsonb, 'Published', 7)
on conflict (id) do nothing;
