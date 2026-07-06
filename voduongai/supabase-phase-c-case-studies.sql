-- ============================================================================
-- PHASE C.2 — Missing Migration Reconstruction: case_studies
-- ============================================================================
-- Suy luận schema từ:
--   - src/app/portal/case-studies/page.tsx   (getCaseStudies — SELECT public, active=true)
--   - src/lib/portal/search-extras.ts         (search widget — SELECT public, active=true)
--
-- LƯU Ý QUAN TRỌNG (liên quan Phase B.5 / Duplicate Table Resolution):
-- Bảng này (số nhiều, "case_studies") KHÔNG có migration, trong khi bảng
-- "case_study" (số ít, jsonb) ĐÃ có migration ở supabase-phase2-migration.sql.
-- Đây là 2 bảng RIÊNG BIỆT, khả năng cao không đồng bộ dữ liệu — việc hợp nhất
-- (MERGE) 2 bảng này KHÔNG thuộc phạm vi Phase C.2, chỉ được LẬP KẾ HOẠCH ở
-- Phase C.5 (xem Duplicate Table Resolution Plan trong báo cáo Phase C). File
-- này CHỈ ghi lại schema của bảng "case_studies" (số nhiều) đang được code đọc
-- thật, để không mất khả năng tái dựng nếu mất Supabase project — KHÔNG merge,
-- KHÔNG xoá bảng "case_study" (số ít).
--
-- Không tìm thấy bất kỳ đường ghi (INSERT/UPDATE) nào cho bảng này trong toàn
-- bộ codebase — dữ liệu hiện tại (nếu có) được nhập trực tiếp qua Supabase
-- Dashboard, không qua Admin UI của app. Public SELECT policy phù hợp với
-- pattern "active=true" đã quan sát.
-- ============================================================================

create table if not exists case_studies (
  id bigint generated always as identity primary key,
  title text not null,
  client_name text,
  summary text,
  result_metric text,
  thumbnail_url text,
  link_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table case_studies is
  'Case study hiển thị công khai (/portal/case-studies). Migration tái dựng '
  'Phase C — KHÔNG merge với bảng "case_study" (jsonb) cho tới khi Product '
  'Owner duyệt kế hoạch ở Phase C.5.';

-- ⚠️ CHỈ CHẠY SAU KHI XÁC NHẬN TRẠNG THÁI RLS THẬT TRÊN PRODUCTION.
-- alter table case_studies enable row level security;
--
-- create policy "public can read active case studies" on case_studies
--   for select using (active = true);
--
-- Không có policy insert/update/delete công khai — không có Admin UI ghi bảng
-- này trong codebase hiện tại; nếu cần quản trị, nên đi qua service role.
