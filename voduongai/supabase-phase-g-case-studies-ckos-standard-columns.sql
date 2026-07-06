-- ============================================================================
-- PHASE G.1 — Extend `case_studies` with remaining CKOS Object Standard columns
-- ============================================================================
-- Theo Existing Table Reuse Plan đã chốt ở Phase F: `case_studies` (typed,
-- production, canonical cho /portal/case-studies) TIẾP TỤC đóng vai trò Case
-- Intelligence trong CKOS — không tạo bảng `ckos_case_studies` song song.
--
-- Phase F đã thêm slug/body/published_at/featured. File này bổ sung nốt các
-- cột chuẩn CKOS Object Standard (G.2) còn thiếu: status, version, language,
-- difficulty, tags, metadata, updated_at. Tất cả additive, có default an
-- toàn, KHÔNG đổi cột `active`/`published_at` (date) đã có từ trước — status
-- mới này bổ sung song song với `active` (boolean) hiện có, KHÔNG thay thế,
-- để không phá logic `.eq("active", true)` mà /portal/case-studies đang dùng.
-- Admin CRUD (Phase F actions.ts) có thể cập nhật thêm `status` dần dần ở
-- Phase H mà không bắt buộc phải sửa ngay.
-- ============================================================================

alter table case_studies add column if not exists status text not null default 'Published'
  check (status in ('Draft','Review','Approved','Published','Archived'));
alter table case_studies add column if not exists version int not null default 1;
alter table case_studies add column if not exists language text not null default 'vi';
alter table case_studies add column if not exists difficulty text;
alter table case_studies add column if not exists tags text[] not null default '{}';
alter table case_studies add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table case_studies add column if not exists updated_at timestamptz not null default now();

comment on column case_studies.status is 'CKOS Object Standard lifecycle field (Phase G) — chạy song song với `active`, chưa thay thế logic hiện có của /portal/case-studies.';
