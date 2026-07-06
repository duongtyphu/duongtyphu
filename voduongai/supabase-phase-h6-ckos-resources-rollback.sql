-- ============================================================================
-- PHASE H.6 — Resource Intelligence: Rollback SQL (idempotent, staged)
-- ============================================================================

-- LỰA CHỌN A — xoá toàn bộ dữ liệu đã migrate (giữ schema):
delete from ckos_resources;

-- LỰA CHỌN B — xoá theo từng source_table riêng (nếu chỉ muốn lùi 1 nguồn):
-- delete from ckos_resources where source_table = 'sop';
-- delete from ckos_resources where source_table = 'checklists';
-- delete from ckos_resources where source_table = 'templates';
-- delete from ckos_resources where source_table = 'ebooks';
-- delete from ckos_resources where source_table = 'resources';

-- LỰA CHỌN C — drop toàn bộ bảng (không đụng sop/checklists/templates/
-- ebooks/resources gốc):
-- drop table if exists ckos_resources;

-- Xác nhận sau rollback:
--   select count(*) from ckos_resources;  -- kỳ vọng 0
--   select count(*) from sop;              -- PHẢI không đổi
--   select count(*) from checklists;       -- PHẢI không đổi
