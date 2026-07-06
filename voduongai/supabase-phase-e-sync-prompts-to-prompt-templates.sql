-- ============================================================================
-- PHASE E.3 — Fix Prompt Content Invisibility (Option A: sync prompts -> prompt_templates)
-- ============================================================================
-- Tình trạng đã xác minh (Phase D.4, live qua anon key):
--   - Admin ghi vào `prompts` (jsonb, qua CRUD generic /api/admin/collections/
--     prompts) — bảng này có 2 dòng thật, cả 2 status='Published':
--       1. "Viết content viral cho Facebook" (category: Content, tier: Free)
--       2. "Phân tích đối thủ Affiliate" (category: Affiliate, tier: Premium)
--   - Public page /portal/prompts đọc `prompt_templates` (typed, cột phẳng
--     id/title/category/content/active) — bảng này RỖNG, nên trang chỉ hiện
--     12 prompt tĩnh hardcode trong src/data/prompts.ts, không phải nội dung
--     Admin thật.
--
-- QUYẾT ĐỊNH: Option A (sync 1 chiều), KHÔNG chọn Option B (sửa page đọc
-- thẳng từ `prompts`). Lý do:
--   1. Rủi ro thấp hơn nhiều — chỉ thêm dữ liệu, KHÔNG đổi code/logic trang
--      /portal/prompts đang chạy production thật (đúng tinh thần Phase E:
--      "không refactor UI diện rộng").
--   2. Schema 2 bên khác nhau đáng kể: `prompts.data` (jsonb) có nhiều field
--      hơn hẳn `prompt_templates` (tags, tier, level, slug, featured,
--      copyCount, description, exampleOutput) — Option B sẽ cần viết lại
--      cách page.tsx parse dữ liệu (từ cột phẳng sang jsonb->>'field'), MỘT
--      thay đổi code thật trên trang public đang hoạt động, rủi ro cao hơn
--      và khó test đầy đủ trong môi trường hiện tại (không có staging/preview
--      để so sánh trước/sau).
--   3. Nhất quán với hướng đã chọn cho case_study/case_studies (Phase E.2) —
--      cùng 1 pattern xử lý cho cả 2 cặp bảng trùng, dễ audit/rollback đồng bộ.
--   4. Nhược điểm đã biết và CHẤP NHẬN: tạm thời vẫn duy trì 2 nguồn dữ liệu
--      song song (prompts + prompt_templates) — đây là nợ kỹ thuật cố ý để
--      lại cho Phase F (chuẩn hoá canonical write/read path), không giải
--      quyết dứt điểm ở Phase E theo đúng phạm vi được giao.
--
-- An toàn: CHỈ INSERT, dedup theo title, không UPDATE/DELETE, không đụng
-- `prompts` (nguồn) hay dữ liệu có sẵn trong `prompt_templates` nếu có.
-- Chỉ đồng bộ dòng status='Published'.
--
-- Field mapping (prompts.data jsonb -> prompt_templates typed columns):
--   data->>'title'    -> title
--   data->>'category' -> category
--   data->>'content'  -> content
--   status='Published' -> active = true
--   created_at (giữ nguyên timestamp gốc)
-- Các field còn lại trong prompts.data (tags, tier, level, slug, featured,
-- copyCount, description, exampleOutput) KHÔNG có cột tương ứng trong
-- prompt_templates — không đồng bộ được ở dạng này, đây là 1 lý do nữa để
-- Phase F cần quyết định kiến trúc canonical rõ ràng thay vì tiếp tục vá tạm.
-- ============================================================================

insert into prompt_templates (title, category, content, active, created_at)
select
  p.data ->> 'title',
  p.data ->> 'category',
  p.data ->> 'content',
  true,
  p.created_at
from prompts p
where p.status = 'Published'
  and p.data ->> 'title' is not null
  and not exists (
    select 1 from prompt_templates existing
    where existing.title = p.data ->> 'title'
  );

-- Kiểm tra sau khi chạy:
--   select id, title, category, active from prompt_templates order by created_at desc;
--   -- kỳ vọng: thấy "Viết content viral cho Facebook" và "Phân tích đối thủ Affiliate"

-- Rollback:
--   delete from prompt_templates
--   where title in (select data->>'title' from prompts where status = 'Published');
