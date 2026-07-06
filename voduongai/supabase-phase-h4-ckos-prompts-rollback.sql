-- ============================================================================
-- PHASE H.4 — Prompt Intelligence: Rollback SQL (idempotent, staged)
-- ============================================================================

-- LỰA CHỌN A — Rollback chỉ DỮ LIỆU đã migrate từ `prompts` (giữ schema và
-- bất kỳ dữ liệu nào từ 3 nguồn static đã seed riêng qua script Node/TS):
delete from ckos_tool_prompts where prompt_id in (
  select id from ckos_prompt_templates where source_system = 'admin_prompts'
);
delete from ckos_workflow_prompts where prompt_id in (
  select id from ckos_prompt_templates where source_system = 'admin_prompts'
);
delete from ckos_prompt_lessons where prompt_id in (
  select id from ckos_prompt_templates where source_system = 'admin_prompts'
);
delete from ckos_prompt_missions where prompt_id in (
  select id from ckos_prompt_templates where source_system = 'admin_prompts'
);
delete from ckos_prompt_case_studies where prompt_id in (
  select id from ckos_prompt_templates where source_system = 'admin_prompts'
);
delete from ckos_prompt_best_practices where prompt_id in (
  select id from ckos_prompt_templates where source_system = 'admin_prompts'
);
delete from ckos_prompt_templates where source_system = 'admin_prompts';

-- LỰA CHỌN B — Rollback TOÀN BỘ dữ liệu Prompt Intelligence CKOS (mọi
-- source_system), giữ schema — dùng khi muốn seed lại từ đầu cả 4 nguồn:
-- delete from ckos_tool_prompts where prompt_id in (select id from ckos_prompt_templates);
-- delete from ckos_workflow_prompts where prompt_id in (select id from ckos_prompt_templates);
-- delete from ckos_prompt_lessons;
-- delete from ckos_prompt_missions;
-- delete from ckos_prompt_case_studies;
-- delete from ckos_prompt_best_practices;
-- delete from ckos_prompt_templates;

-- LỰA CHỌN C — Rollback TOÀN BỘ SCHEMA quan hệ Prompt (không đụng
-- `ckos_prompt_templates` gốc từ Phase G, chỉ gỡ phần mở rộng/quan hệ mới):
-- drop table if exists ckos_prompt_best_practices;
-- drop table if exists ckos_prompt_case_studies;
-- drop table if exists ckos_prompt_missions;
-- drop table if exists ckos_prompt_lessons;
-- alter table ckos_prompt_templates drop column if exists category;
-- alter table ckos_prompt_templates drop column if exists pricing_model;
-- alter table ckos_prompt_templates drop column if exists featured;
-- alter table ckos_prompt_templates drop column if exists copy_count;
-- alter table ckos_prompt_templates drop column if exists legacy_prompt_id;
-- alter table ckos_prompt_templates drop column if exists source_system;

-- Trong MỌI trường hợp: bảng `prompts` (jsonb, nguồn Admin ghi thật) và
-- `prompt_templates` (typed, rỗng) KHÔNG bị động tới.

-- Xác nhận sau rollback (chạy tay):
--   select count(*) from ckos_prompt_templates;
--   select count(*) from prompts;  -- PHẢI không đổi so với trước migrate
