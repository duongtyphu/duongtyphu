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
--
-- CẬP NHẬT — Phase D.4 (Duplicate Data Verification): đã xác minh trực tiếp
-- qua PostgREST (anon key, read-only, không đổi dữ liệu) rằng bảng này ĐÃ TỒN
-- TẠI thật trên production với 3 dòng dữ liệu thật (title/description/url/
-- icon/display_order/active/created_at đúng như suy đoán ban đầu), NHƯNG có
-- thêm 1 cột KHÔNG được suy luận ra từ code ban đầu: `bg_color` (text, ví dụ
-- "#F0FDF4"). Đã bổ sung cột này vào migration bên dưới — đây là ví dụ cụ thể
-- của "schema production khác schema file" theo quy tắc Phase D.2 #6, đã được
-- phát hiện và sửa trước khi coi migration này là đầy đủ.
-- ============================================================================

create table if not exists documents (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  url text not null,
  icon text,
  bg_color text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Idempotent — an toàn nếu bảng đã tồn tại từ trước mà thiếu cột này.
alter table documents add column if not exists bg_color text;

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
