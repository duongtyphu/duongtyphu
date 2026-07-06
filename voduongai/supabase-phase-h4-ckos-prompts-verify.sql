-- ============================================================================
-- PHASE H.4 — Prompt Intelligence: Verify SQL (read-only, run after migrate.sql)
-- ============================================================================

-- 1. Đối chiếu số lượng nguồn `prompts` (Published) vs đã migrate.
select
  (select count(*) from prompts where status = 'Published') as source_published_count,
  (select count(*) from ckos_prompt_templates where source_system = 'admin_prompts') as migrated_from_admin_prompts;
-- Kỳ vọng: 2 số bằng nhau (tại thời điểm viết báo cáo, `prompts` có đúng 2 dòng Published).

-- 2. Duplicate check — trùng slug.
select slug, count(*) as cnt
from ckos_prompt_templates
group by slug
having count(*) > 1;
-- Kỳ vọng: 0 dòng.

-- 3. Duplicate check — trùng legacy_prompt_id.
select legacy_prompt_id, count(*) as cnt
from ckos_prompt_templates
where legacy_prompt_id is not null
group by legacy_prompt_id
having count(*) > 1;
-- Kỳ vọng: 0 dòng.

-- 4. Duplicate check theo NỘI DUNG (title trùng nhau giữa các source_system
--    khác nhau — quan trọng vì Prompt có 4 nguồn tĩnh, rủi ro cùng 1 prompt
--    được nhập thủ công ở nhiều nơi với tiêu đề giống/gần giống nhau).
select title, array_agg(distinct source_system) as sources, count(*) as cnt
from ckos_prompt_templates
group by title
having count(*) > 1;
-- Nếu có dòng trả về: kiểm tra thủ công đây là trùng lặp thật (2 nguồn tả
-- cùng 1 prompt) hay chỉ trùng tên ngẫu nhiên.

-- 5. Orphan check — quan hệ trỏ tới prompt không tồn tại (không nên xảy ra do
--    FK, kiểm tra tường minh).
select 'ckos_tool_prompts' as rel_table, tp.tool_id, tp.prompt_id
from ckos_tool_prompts tp
left join ckos_prompt_templates p on p.id = tp.prompt_id
where p.id is null
union all
select 'ckos_workflow_prompts', wp.workflow_id, wp.prompt_id
from ckos_workflow_prompts wp
left join ckos_prompt_templates p on p.id = wp.prompt_id
where p.id is null;
-- Kỳ vọng: 0 dòng.

-- 6. Missing relationship — prompt có field liên quan trong `prompts.data`
--    nhưng chưa map do canonical Tool/Workflow chưa migrate xong (theo dõi,
--    KHÔNG phải lỗi).
select
  p.id as legacy_prompt_id,
  p.data ->> 'title' as prompt_title,
  p.data ->> 'category' as category_hint
from prompts p
where p.status = 'Published';
-- Ghi chú: `prompts.data` không có field liên kết Tool/Workflow tường minh
-- (không có `relatedToolId` như bên `tools.data` có `relatedPromptId`) — quan
-- hệ Prompt→Tool cho 2 dòng này hiện KHÔNG xác định được từ dữ liệu nguồn,
-- cần Admin bổ sung thủ công sau khi có UI quan hệ (ngoài phạm vi Phase H.4).

-- 7. Missing metadata — thiếu field quan trọng cho hiển thị public.
select id, title, slug,
  (template is null or template = '') as missing_template,
  (description is null) as missing_description,
  (category is null) as missing_category,
  (pricing_model is null) as missing_pricing_model
from ckos_prompt_templates
where template is null or template = ''
   or description is null
   or category is null
   or pricing_model is null;

-- 8. Tổng quan theo source_system (đối chiếu tỉ lệ đóng góp từng nguồn sau
--    khi cả 4 nguồn được migrate — hiện tại chỉ có 'admin_prompts' vì 3 nguồn
--    static cần seeding script riêng, xem mục 5.2 báo cáo).
select source_system, count(*) as cnt
from ckos_prompt_templates
group by source_system
order by cnt desc;
