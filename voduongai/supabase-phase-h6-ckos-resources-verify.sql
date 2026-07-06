-- ============================================================================
-- PHASE H.6 — Resource Intelligence: Verify SQL (read-only)
-- ============================================================================

-- 1. Đối chiếu số lượng theo từng bảng nguồn.
select
  (select count(*) from sop where status = 'Published') as sop_source,
  (select count(*) from ckos_resources where source_table = 'sop') as sop_migrated,
  (select count(*) from checklists where status = 'Published') as checklists_source,
  (select count(*) from ckos_resources where source_table = 'checklists') as checklists_migrated,
  (select count(*) from templates where status = 'Published') as templates_source,
  (select count(*) from ckos_resources where source_table = 'templates') as templates_migrated,
  (select count(*) from ebooks where status = 'Published') as ebooks_source,
  (select count(*) from ckos_resources where source_table = 'ebooks') as ebooks_migrated,
  (select count(*) from resources where status = 'Published') as resources_source,
  (select count(*) from ckos_resources where source_table = 'resources') as resources_migrated;

-- 2. Duplicate check — trùng slug (across mọi resource_kind — tên có thể
--    trùng nếu 1 SOP và 1 Template vô tình cùng slug).
select slug, count(*) as cnt, array_agg(resource_kind) as kinds
from ckos_resources
group by slug
having count(*) > 1;

-- 3. Duplicate check — trùng (legacy_resource_id, source_table).
select legacy_resource_id, source_table, count(*) as cnt
from ckos_resources
where legacy_resource_id is not null
group by legacy_resource_id, source_table
having count(*) > 1;

-- 4. Orphan resource — quan hệ (nếu Phase H.3/H.5 relationship tables được
--    nâng cấp sang FK thật, xem ADR-005) trỏ tới resource không tồn tại.
--    Hiện tại `ckos_tool_resources`/`ckos_workflow_resources` dùng soft
--    reference (text), nên không có FK để kiểm tra orphan tự động — liệt kê
--    thủ công để đối chiếu:
select tr.resource_id as referenced_resource_id
from ckos_tool_resources tr
where not exists (
  select 1 from ckos_resources r where r.legacy_resource_id = tr.resource_id
)
union
select wr.resource_id
from ckos_workflow_resources wr
where not exists (
  select 1 from ckos_resources r where r.legacy_resource_id = wr.resource_id
);
-- Mọi dòng trả về là "orphan tiềm ẩn" — resource_id được tham chiếu nhưng
-- không khớp bất kỳ legacy_resource_id nào đã migrate.

-- 5. Missing metadata.
select id, title, slug, resource_kind,
  (description is null or description = '') as missing_description,
  (category is null) as missing_category
from ckos_resources
where description is null or description = '' or category is null;

-- 6. Wrong classification check — resource có tên gợi ý "quy trình nhiều
--    bước" (chứa từ khoá "quy trình", "bước", "workflow") nhưng được xếp
--    resource_kind != 'sop' — cảnh báo để xem lại phân loại thủ công.
select id, title, resource_kind
from ckos_resources
where (title ilike '%quy trình%' or title ilike '%bước%')
  and resource_kind not in ('sop');

-- 7. Tổng quan theo resource_kind.
select resource_kind, count(*) as cnt
from ckos_resources
group by resource_kind
order by cnt desc;
