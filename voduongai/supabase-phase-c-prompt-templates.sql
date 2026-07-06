-- ============================================================================
-- PHASE C.2 — Missing Migration Reconstruction: prompt_templates
-- ============================================================================
-- Suy luận schema từ: src/app/portal/prompts/page.tsx (getLivePrompts — SELECT
-- public, active=true).
--
-- LƯU Ý QUAN TRỌNG (liên quan Phase B.5 / Duplicate Table Resolution):
-- Bảng này KHÔNG có migration, trong khi bảng "prompts" (jsonb) ĐÃ có migration
-- ở supabase-phase2-migration.sql và được dùng bởi Hệ tri thức AI/CKOS (Prompt
-- Intelligence, Phase B mục 6). Đây là 2 bảng RIÊNG BIỆT cho cùng khái niệm
-- "prompt" — việc hợp nhất KHÔNG thuộc phạm vi Phase C.2, chỉ lập kế hoạch ở
-- Phase C.5. File này CHỈ ghi lại schema của "prompt_templates" đang được
-- /portal/prompts đọc thật.
--
-- Không tìm thấy đường ghi (INSERT/UPDATE) nào cho bảng này trong codebase —
-- tương tự case_studies, dữ liệu nhập qua Supabase Dashboard trực tiếp.
-- ============================================================================

create table if not exists prompt_templates (
  id bigint generated always as identity primary key,
  title text not null,
  category text,
  content text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table prompt_templates is
  'Prompt hiển thị công khai (/portal/prompts). Migration tái dựng Phase C — '
  'KHÔNG merge với bảng "prompts" (jsonb, CKOS) cho tới khi Product Owner '
  'duyệt kế hoạch ở Phase C.5.';

-- ⚠️ CHỈ CHẠY SAU KHI XÁC NHẬN TRẠNG THÁI RLS THẬT TRÊN PRODUCTION.
-- alter table prompt_templates enable row level security;
--
-- create policy "public can read active prompt templates" on prompt_templates
--   for select using (active = true);
--
-- Không có policy insert/update/delete công khai — không có Admin UI ghi bảng
-- này trong codebase hiện tại; nếu cần quản trị, nên đi qua service role.
