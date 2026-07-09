-- PREMIUM — tạo đủ 5 dòng khoá học cho trang /portal/premium.
-- Chạy một lần trong Supabase SQL Editor (sau supabase-course-pricing.sql).
--
-- Từ nâng cấp "Admin bật/tắt mở bán": trang Premium đọc cột
-- `courses.status` — 'open' = card hiện CTA thanh toán, giá trị khác
-- ('coming'...) = card hiển thị "Sắp mở đăng ký". Admin bật/tắt và chỉnh
-- giá trực tiếp tại /admin/course-pricing, KHÔNG cần sửa code hay chạy
-- lại SQL.
--
-- Script dưới đây:
--   1) Thêm 3 khoá học mới nếu chưa có (AI Cơ bản, AI Nâng cao, OpenClaw)
--      với status 'coming' — Admin chủ động bật "Đang mở bán" khi sẵn sàng.
--   2) Đưa V-SOLO / V-SCALE về 'coming' MỘT LẦN theo chỉ đạo Product Owner
--      hiện tại (đang "Sắp mở đăng ký", giữ giá 7.800.000đ / 26.000.000đ).
--      Sau đó việc mở bán hoàn toàn do Admin quyết định trên trang Admin.

insert into courses (name, status, price)
select 'Lớp học AI Cơ bản', 'coming', 1500000
where not exists (select 1 from courses where name ilike '%cơ bản%' or name ilike '%co ban%' or name ilike '%basic%');

insert into courses (name, status, price)
select 'Lớp học AI Nâng cao', 'coming', 3999999
where not exists (select 1 from courses where name ilike '%nâng cao%' or name ilike '%nang cao%' or name ilike '%advanced%');

insert into courses (name, status, price)
select 'Lớp học OpenClaw', 'coming', 599999
where not exists (select 1 from courses where name ilike '%claw%');

update courses set status = 'coming' where name ilike '%solo%' or name ilike '%scale%';

-- Kiểm tra kết quả:
-- select id, name, status, price from courses order by id;
