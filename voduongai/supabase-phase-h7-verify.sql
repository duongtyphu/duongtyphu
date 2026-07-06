-- ============================================================================
-- PHASE H.7 — Best Practice & Case Study: Verify SQL (read-only)
-- ============================================================================

-- 1. Đối chiếu số lượng — kỳ vọng đúng theo dry-run thật.
select 'best_practices' as intel, source_system, count(*) as cnt
from ckos_best_practices
where source_system = 'knowledge_seed_guide'
group by source_system
union all
select 'case_studies', source_system, count(*)
from case_studies
where source_system in ('knowledge_seed_case_study', 'student_success')
group by source_system;
-- Kỳ vọng: knowledge_seed_guide=13; knowledge_seed_case_study=5; student_success=3.

-- 2. Duplicate check — trùng slug.
select 'best_practices' as t, slug, count(*) from ckos_best_practices group by slug having count(*) > 1
union all
select 'case_studies', slug, count(*) from case_studies group by slug having count(*) > 1;
-- Kỳ vọng: 0 dòng (script dry-run đã xác nhận 0 cảnh báo trùng lặp cho cả 2).

-- 3. Duplicate check — trùng (legacy_source_id, source_system).
select 'best_practices' as t, legacy_source_id, source_system, count(*)
from ckos_best_practices where legacy_source_id is not null
group by legacy_source_id, source_system having count(*) > 1
union all
select 'case_studies', legacy_source_id, source_system, count(*)
from case_studies where legacy_source_id is not null
group by legacy_source_id, source_system having count(*) > 1;

-- 4. Orphan check — quan hệ trỏ tới best_practice/case_study không tồn tại.
select 'ckos_prompt_best_practices' as rel, bp.best_practice_id::text
from ckos_prompt_best_practices bp
where not exists (select 1 from ckos_best_practices b where b.id = bp.best_practice_id)
union all
select 'ckos_workflow_best_practices', best_practice_id::text
from ckos_workflow_best_practices w
where not exists (select 1 from ckos_best_practices b where b.id = w.best_practice_id)
union all
select 'ckos_prompt_case_studies', case_study_id::text
from ckos_prompt_case_studies p
where not exists (select 1 from case_studies c where c.id = p.case_study_id)
union all
select 'ckos_workflow_case_studies', case_study_id::text
from ckos_workflow_case_studies w
where not exists (select 1 from case_studies c where c.id = w.case_study_id);
-- Kỳ vọng: 0 dòng (chưa có dữ liệu quan hệ nào được tạo ở Phase H.7 — xem mục
-- Missing Relationship bên dưới, đúng dự kiến).

-- 5. Missing relationship — Best Practice/Case Study mới migrate CHƯA có bất
--    kỳ quan hệ nào (Tool/Prompt/Workflow/Resource) — đây là tình trạng dự
--    kiến (KHÔNG PHẢI lỗi), vì nguồn tĩnh không có field liên kết tường minh
--    tới Tool/Prompt/Workflow/Resource canonical (chỉ có `relatedAssets`/
--    `aiTools` dạng string tự do, chưa map được sang uuid CKOS).
select bp.id, bp.title, 'no relationship yet' as note
from ckos_best_practices bp
where bp.source_system = 'knowledge_seed_guide'
  and not exists (select 1 from ckos_prompt_best_practices where best_practice_id = bp.id)
  and not exists (select 1 from ckos_workflow_best_practices where best_practice_id = bp.id)
  and not exists (select 1 from ckos_best_practice_tools where best_practice_id = bp.id)
  and not exists (select 1 from ckos_best_practice_resources where best_practice_id = bp.id);

-- 6. Missing metadata.
select id, title, slug,
  (description is null or description = '') as missing_description,
  (principle is null or principle = '') as missing_principle
from ckos_best_practices
where source_system = 'knowledge_seed_guide'
  and (description is null or description = '' or principle is null or principle = '');

select id, title, slug,
  (summary is null or summary = '') as missing_summary,
  (body is null or body = '') as missing_body
from case_studies
where source_system in ('knowledge_seed_case_study', 'student_success')
  and (summary is null or summary = '' or body is null or body = '');

-- 7. Wrong classification check — Best Practice có tên/nội dung gợi ý là Case
--    Study thật (chứa số liệu kết quả cụ thể như "%", "lần", "phút" — dấu
--    hiệu case study bị phân loại nhầm thành best practice) và ngược lại.
select id, title, 'possible case study misfiled as best practice' as note
from ckos_best_practices
where source_system = 'knowledge_seed_guide'
  and (title ~ '[0-9]+ (lần|phút|%|x)' or principle ~ '[0-9]+ (lần|phút|%)');
