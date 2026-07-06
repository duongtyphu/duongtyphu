-- ============================================================================
-- PHASE H.7 — Best Practice & Case Study: Rollback SQL (idempotent, staged)
-- ============================================================================

-- LỰA CHỌN A — chỉ xoá dữ liệu đã seed ở Phase H.7 (giữ schema, không đụng
-- case_study/case_studies dữ liệu cũ từ trước hay bất kỳ nguồn code nào):
delete from ckos_case_study_best_practices where case_study_id in (
  select id from case_studies where source_system in ('knowledge_seed_case_study', 'student_success')
);
delete from ckos_case_study_resources where case_study_id in (
  select id from case_studies where source_system in ('knowledge_seed_case_study', 'student_success')
);
delete from ckos_case_study_tools where case_study_id in (
  select id from case_studies where source_system in ('knowledge_seed_case_study', 'student_success')
);
delete from ckos_prompt_case_studies where case_study_id in (
  select id from case_studies where source_system in ('knowledge_seed_case_study', 'student_success')
);
delete from ckos_workflow_case_studies where case_study_id in (
  select id from case_studies where source_system in ('knowledge_seed_case_study', 'student_success')
);
delete from case_studies where source_system in ('knowledge_seed_case_study', 'student_success');

delete from ckos_best_practice_tools where best_practice_id in (
  select id from ckos_best_practices where source_system = 'knowledge_seed_guide'
);
delete from ckos_best_practice_resources where best_practice_id in (
  select id from ckos_best_practices where source_system = 'knowledge_seed_guide'
);
delete from ckos_prompt_best_practices where best_practice_id in (
  select id from ckos_best_practices where source_system = 'knowledge_seed_guide'
);
delete from ckos_workflow_best_practices where best_practice_id in (
  select id from ckos_best_practices where source_system = 'knowledge_seed_guide'
);
delete from ckos_best_practices where source_system = 'knowledge_seed_guide';

-- LỰA CHỌN B — drop toàn bộ schema mở rộng H.7 (không đụng ckos_best_practices/
-- case_studies gốc từ Phase F/G):
-- drop table if exists ckos_case_study_best_practices;
-- drop table if exists ckos_case_study_resources;
-- drop table if exists ckos_case_study_tools;
-- drop table if exists ckos_best_practice_resources;
-- drop table if exists ckos_best_practice_tools;
-- alter table ckos_best_practices drop column if exists legacy_source_id;
-- alter table ckos_best_practices drop column if exists source_system;
-- alter table case_studies drop column if exists legacy_source_id;
-- alter table case_studies drop column if exists source_system;

-- Trong MỌI trường hợp: `case_study` (jsonb legacy), `knowledgeSeedData`,
-- `studentSuccessSeed` (file code) KHÔNG bị động tới.

-- Xác nhận sau rollback:
--   select count(*) from ckos_best_practices where source_system = 'knowledge_seed_guide'; -- kỳ vọng 0
--   select count(*) from case_studies where source_system in ('knowledge_seed_case_study','student_success'); -- kỳ vọng 0
