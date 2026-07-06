-- ============================================================================
-- PHASE H.3 — Tool Intelligence: Verify SQL (read-only, run after migrate.sql)
-- ============================================================================
-- Mọi câu lệnh dưới đây CHỈ ĐỌC (select) — an toàn chạy bất kỳ lúc nào để
-- kiểm tra tính toàn vẹn sau migration. Không sửa dữ liệu.

-- 1. Đối chiếu số lượng: mỗi dòng `tools` (Published) phải có đúng 1 dòng
--    `ckos_tools` tương ứng theo legacy_tool_id.
select
  (select count(*) from tools where status = 'Published') as source_published_count,
  (select count(*) from ckos_tools where legacy_tool_id is not null) as migrated_count;
-- Kỳ vọng: 2 số bằng nhau. Nếu migrated_count < source_published_count, kiểm
-- tra mục 2 (thiếu name/slug) bên dưới.

-- 2. Duplicate check — trùng slug (unique constraint đã có ở schema, nhưng
--    kiểm tra tường minh để phát hiện sớm trước khi constraint chặn insert).
select slug, count(*) as cnt
from ckos_tools
group by slug
having count(*) > 1;
-- Kỳ vọng: 0 dòng.

-- 3. Duplicate check — trùng legacy_tool_id (không nên xảy ra do unique index,
--    nhưng kiểm tra tường minh).
select legacy_tool_id, count(*) as cnt
from ckos_tools
where legacy_tool_id is not null
group by legacy_tool_id
having count(*) > 1;
-- Kỳ vọng: 0 dòng.

-- 4. Orphan check — ckos_tools có category_id trỏ tới category không tồn tại
--    (không nên xảy ra do FK, nhưng kiểm tra tường minh phòng trường hợp FK
--    bị vô hiệu hoá tạm thời khi migrate).
select ct.id, ct.title, ct.category_id
from ckos_tools ct
left join ckos_tool_categories cc on cc.id = ct.category_id
where ct.category_id is not null and cc.id is null;
-- Kỳ vọng: 0 dòng.

-- 5. Missing relationship — tool có `legacy_tool_id` gốc từng có
--    `relatedPromptId`/`relatedResourceHref` trong `tools.data` nhưng KHÔNG
--    có dòng tương ứng trong ckos_tool_prompts/ckos_tool_resources (kỳ vọng
--    ĐÚNG theo thiết kế — xem ghi chú trong migrate.sql — liệt kê ra đây chỉ
--    để theo dõi/nhắc việc, không phải lỗi).
select
  t.id as legacy_tool_id,
  t.data ->> 'name' as tool_name,
  t.data ->> 'relatedPromptId' as pending_prompt_relationship,
  t.data ->> 'relatedResourceHref' as pending_resource_relationship
from tools t
where t.status = 'Published'
  and (t.data ->> 'relatedPromptId' is not null or t.data ->> 'relatedResourceHref' is not null);
-- Đây KHÔNG phải lỗi — là danh sách "quan hệ đang chờ" tới khi Prompt/Resource
-- canonical được Product Owner chốt (Phase H.2 ADR-001).

-- 6. Missing metadata — tool thiếu field quan trọng cho hiển thị public
--    (title/slug bắt buộc đã lọc ở migrate.sql; kiểm tra field "nên có").
select id, title, slug,
  (description is null) as missing_description,
  (website_url is null) as missing_website_url,
  (pricing_model is null) as missing_pricing_model,
  (array_length(strengths, 1) is null) as missing_strengths,
  (category_id is null) as missing_category
from ckos_tools
where description is null
   or website_url is null
   or pricing_model is null
   or array_length(strengths, 1) is null
   or category_id is null;
-- Xem xét từng dòng — không tự động coi là lỗi, một số tool hợp lệ có thể
-- thiếu 1-2 field phụ.

-- 7. Tổng quan số lượng theo category (đối chiếu phân bổ hợp lý).
select cc.title as category, count(ct.id) as tool_count
from ckos_tool_categories cc
left join ckos_tools ct on ct.category_id = cc.id
group by cc.title
order by tool_count desc;
