-- ============================================================================
-- PHASE H.5 — Workflow Intelligence: Rollback SQL (idempotent, staged)
-- ============================================================================

-- LỰA CHỌN A — chỉ xoá dữ liệu migrate từ `sop_table`:
delete from ckos_workflow_steps where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_tool_workflows where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_workflow_prompts where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_workflow_lessons where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_workflow_missions where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_workflow_resources where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_workflow_best_practices where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_workflow_case_studies where workflow_id in (
  select id from ckos_workflows where source_system = 'sop_table'
);
delete from ckos_workflows where source_system = 'sop_table';

-- LỰA CHỌN B — xoá toàn bộ Workflow Intelligence CKOS (mọi source_system):
-- (tương tự trên nhưng bỏ điều kiện where source_system = 'sop_table')

-- LỰA CHỌN C — drop toàn bộ phần mở rộng schema (không đụng ckos_workflows/
-- ckos_workflow_steps gốc từ Phase G):
-- drop table if exists ckos_workflow_case_studies;
-- drop table if exists ckos_workflow_best_practices;
-- drop table if exists ckos_workflow_resources;
-- drop table if exists ckos_workflow_missions;
-- drop table if exists ckos_workflow_lessons;
-- alter table ckos_workflows drop column if exists legacy_source_id;
-- alter table ckos_workflows drop column if exists source_system;
-- alter table ckos_workflows drop column if exists category;

-- Trong MỌI trường hợp: bảng `sop` (jsonb, nguồn Admin ghi thật) KHÔNG bị
-- động tới.

-- Xác nhận sau rollback:
--   select count(*) from ckos_workflows;
--   select count(*) from sop;  -- PHẢI không đổi
