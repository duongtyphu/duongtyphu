-- ============================================================================
-- PHASE H.5 — Workflow Intelligence: Verify SQL (read-only)
-- ============================================================================

-- 1. Đối chiếu số lượng nguồn `sop` (Published) vs đã migrate.
select
  (select count(*) from sop where status = 'Published') as source_sop_count,
  (select count(*) from ckos_workflows where source_system = 'sop_table') as migrated_from_sop;

-- 2. Duplicate check — trùng slug.
select slug, count(*) as cnt from ckos_workflows group by slug having count(*) > 1;

-- 3. Duplicate check — trùng (legacy_source_id, source_system).
select legacy_source_id, source_system, count(*) as cnt
from ckos_workflows
where legacy_source_id is not null
group by legacy_source_id, source_system
having count(*) > 1;

-- 4. Orphan check — workflow không có bước nào (vi phạm bản chất "nhiều
--    bước" của Workflow Intelligence — kỳ vọng 0 dòng nếu migrate.sql chạy
--    đúng, vì mỗi workflow từ sop_table có đúng 1 step placeholder).
select w.id, w.title, w.source_system
from ckos_workflows w
left join ckos_workflow_steps st on st.workflow_id = w.id
where st.id is null;

-- 5. Cảnh báo chất lượng dữ liệu — workflow chỉ có ĐÚNG 1 bước (dấu hiệu
--    "workflow giả" từ nguồn phẳng sop_table, không phải lỗi kỹ thuật nhưng
--    cần biết để không nhầm là "workflow hoàn chỉnh").
select w.id, w.title, w.source_system, count(st.id) as step_count
from ckos_workflows w
join ckos_workflow_steps st on st.workflow_id = w.id
group by w.id, w.title, w.source_system
having count(st.id) = 1 and w.source_system = 'sop_table';
-- Đây LÀ kỳ vọng đúng cho mọi dòng nguồn 'sop_table' (đã cảnh báo trong
-- migrate.sql) — không phải bug, chỉ là giới hạn dữ liệu nguồn.

-- 6. Orphan check — quan hệ trỏ tới workflow không tồn tại.
select 'ckos_tool_workflows' as rel, tw.tool_id, tw.workflow_id
from ckos_tool_workflows tw
left join ckos_workflows w on w.id = tw.workflow_id
where w.id is null
union all
select 'ckos_workflow_prompts', wp.prompt_id, wp.workflow_id
from ckos_workflow_prompts wp
left join ckos_workflows w on w.id = wp.workflow_id
where w.id is null;

-- 7. Missing metadata.
select id, title, slug,
  (description is null or description = '') as missing_description,
  (category is null) as missing_category
from ckos_workflows
where description is null or description = '' or category is null;

-- 8. Tổng quan theo source_system.
select source_system, count(*) as cnt
from ckos_workflows
group by source_system
order by cnt desc;
