-- ============================================================================
-- PHASE E.2 — Fix Case Study Content Invisibility
-- ============================================================================
-- Tình trạng đã xác minh (Phase D.4, live qua anon key):
--   - Admin ghi vào `case_study` (jsonb, qua CRUD generic /api/admin/collections/
--     case-study) — bảng này có 1 dòng thật, status='Published':
--       title: "Học viên A tăng thu nhập Affiliate gấp 3 lần sau 60 ngày"
--       summary: "Case study thực chiến Affiliate Marketing."
--   - Public page /portal/case-studies VÀ search index (search-extras.ts) đều
--     đọc `case_studies` (typed) — bảng này RỖNG.
--   - Kết quả: case study Admin đã đăng vô hình với người dùng.
--
-- Quyết định tạm thời (đã duyệt trong work order): canonical cho route public
-- là `case_studies` (page đang đọc bảng này) — sync 1 chiều case_study -> case_studies.
--
-- An toàn:
--   - CHỈ INSERT, không UPDATE, không DELETE — không đụng tới dữ liệu đã có
--     sẵn trong case_studies (hiện đang rỗng nên không có gì để mất, nhưng
--     script viết tổng quát để chạy lại nhiều lần vẫn an toàn — idempotent).
--   - Dedup theo `title` (case_study không có cột `slug` riêng ở tầng ngoài,
--     chỉ có trong data jsonb — dùng title vì đó là trường duy nhất có ý nghĩa
--     "định danh nội dung" ở cả 2 phía) — nếu case_studies đã có 1 dòng cùng
--     title, script SKIP (không insert trùng), không ghi đè.
--   - KHÔNG xoá, KHÔNG archive `case_study` — bảng nguồn giữ nguyên 100% sau
--     khi chạy, để Admin vẫn thấy đúng những gì họ đã nhập (cho tới khi Phase F
--     chuyển hẳn write path).
--   - Chỉ đồng bộ dòng có `status = 'Published'` — không đưa nội dung Draft
--     lên trang public.
--
-- Field mapping (case_study.data jsonb -> case_studies typed columns):
--   data->>'title'   -> title
--   data->>'summary' -> summary
--   (không có trường tương ứng trong case_study.data cho client_name,
--    result_metric, thumbnail_url, link_url — để NULL, Admin có thể bổ sung
--    sau qua Phase F khi có UI ghi trực tiếp case_studies)
--   status='Published' -> active = true
--   created_at (giữ nguyên timestamp gốc, không dùng now())
-- ============================================================================

insert into case_studies (title, summary, active, created_at)
select
  cs.data ->> 'title',
  cs.data ->> 'summary',
  true,
  cs.created_at
from case_study cs
where cs.status = 'Published'
  and cs.data ->> 'title' is not null
  and not exists (
    select 1 from case_studies existing
    where existing.title = cs.data ->> 'title'
  );

-- Kiểm tra sau khi chạy (chạy tay để xác nhận kết quả):
--   select id, title, summary, active from case_studies order by created_at desc;
--   -- kỳ vọng: thấy dòng "Học viên A tăng thu nhập Affiliate gấp 3 lần sau 60 ngày"

-- Rollback (nếu cần lùi lại — CHỈ xoá đúng (các) dòng vừa được script này
-- thêm vào, xác định qua title trùng khớp, KHÔNG xoá dữ liệu case_studies có
-- từ trước nếu có):
--   delete from case_studies
--   where title in (select data->>'title' from case_study where status = 'Published');
