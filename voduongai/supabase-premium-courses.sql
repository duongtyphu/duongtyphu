-- PREMIUM EXPERIENCE RECONSTRUCTION — mở đăng ký đủ 5 chương trình Premium.
-- Chạy một lần trong Supabase SQL Editor (sau supabase-course-pricing.sql).
--
-- Trang /portal/premium khớp chương trình với bảng `courses` theo tên
-- (ilike): chương trình nào CHƯA có dòng khớp sẽ hiển thị "Sắp mở đăng ký"
-- thay vì CTA thanh toán (createOrder tra giá server-side từ bảng này).
-- Script dưới đây:
--   1) Thêm 3 khoá học mới nếu chưa có: AI Cơ bản, AI Nâng cao, OpenClaw.
--   2) Cập nhật giá V-SOLO / V-SCALE theo brief Premium mới nhất
--      (6.999.999đ / 23.000.000đ — trước đó là 7.800.000đ / 26.000.000đ).
--      Giá vẫn chỉnh được bất cứ lúc nào tại /admin/course-pricing.

insert into courses (name, status, price)
select 'Lớp học AI Cơ bản', 'open', 1500000
where not exists (select 1 from courses where name ilike '%cơ bản%' or name ilike '%co ban%' or name ilike '%basic%');

insert into courses (name, status, price)
select 'Lớp học AI Nâng cao', 'open', 3999999
where not exists (select 1 from courses where name ilike '%nâng cao%' or name ilike '%nang cao%' or name ilike '%advanced%');

insert into courses (name, status, price)
select 'Lớp học OpenClaw', 'open', 599999
where not exists (select 1 from courses where name ilike '%claw%');

update courses set price = 6999999 where name ilike '%solo%';
update courses set price = 23000000 where name ilike '%scale%';

-- Kiểm tra kết quả:
-- select id, name, status, price from courses order by id;
