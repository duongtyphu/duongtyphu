-- ============================================================================
-- PHASE C.2 — Missing Migration Reconstruction: documents
-- ============================================================================
-- Suy luận schema từ: src/app/portal/resources/page.tsx (getLiveDocuments —
-- SELECT public, filter active=true, order theo display_order).
--
-- GHI CHÚ XÁC MINH BẮT BUỘC:
--   - Đây là "Tài nguyên miễn phí" — về mặt Content Mapping (Phase B) có khả
--     năng trùng mục đích với bảng `resources` (jsonb, đã có migration ở
--     supabase-phase2-migration.sql) — KHÔNG được coi 2 bảng này là một, và
--     KHÔNG merge ở bước này (việc đó thuộc Phase C.5 — chỉ lập kế hoạch).
--   - `display_order` suy đoán kiểu int; không thấy cột `created_at` được
--     SELECT trong code nhưng thêm vào theo convention chung để có audit trail
--     tối thiểu — nếu cột này không tồn tại thật trên production, dòng
--     `alter table ... add column if not exists created_at ...` vẫn an toàn
--     (không phá dữ liệu hiện có, chỉ thêm cột mới với giá trị mặc định).
-- ============================================================================

create table if not exists documents (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  url text not null,
  icon text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

comment on table documents is
  'Tài nguyên miễn phí (/portal/resources — bảng "documents", khác với bảng '
  '"resources" jsonb đã có migration). Migration tái dựng Phase C.';

-- ⚠️ CHỈ CHẠY SAU KHI XÁC NHẬN TRẠNG THÁI RLS THẬT TRÊN PRODUCTION.
-- Đây là nội dung công khai (marketing/tài nguyên miễn phí) nên public SELECT
-- là hợp lý về mặt sản phẩm — nhưng vẫn cần xác nhận RLS hiện tại trước khi bật
-- lần đầu để tránh vô tình thắt chặt quyền nếu bảng đang mở hoàn toàn (RLS tắt).
-- alter table documents enable row level security;
--
-- create policy "public can read active documents" on documents
--   for select using (active = true);
--
-- Không có policy insert/update/delete công khai — quản trị tài nguyên (nếu có)
-- nên đi qua service role (getSupabaseAdmin), tương tự các bảng "thật" khác.
