-- PREMIUM EXPERIENCE RECONSTRUCTION — mở đăng ký đủ 5 chương trình Premium.
-- Chạy một lần trong Supabase SQL Editor (sau supabase-course-pricing.sql).
--
-- Trang /portal/premium khớp chương trình với bảng `courses` theo tên
-- (ilike): chương trình nào CHƯA có dòng khớp sẽ hiển thị "Sắp mở đăng ký"
-- thay vì CTA thanh toán (createOrder tra giá server-side từ bảng này).
-- Script dưới đây chỉ thêm 3 khoá học mới nếu chưa có: AI Cơ bản,
-- AI Nâng cao, OpenClaw. KHÔNG đụng vào giá V-SOLO (7.800.000đ) /
-- V-SCALE (26.000.000đ) — Product Owner giữ giá này; hai chương trình đó
-- đang được ép "Sắp mở đăng ký" trong code (premium-programs.ts,
-- comingSoon: true) và trang Admin sẽ quản lý việc mở bán sau.
-- Giá mọi khoá vẫn chỉnh được bất cứ lúc nào tại /admin/course-pricing.

insert into courses (name, status, price)
select 'Lớp học AI Cơ bản', 'open', 1500000
where not exists (select 1 from courses where name ilike '%cơ bản%' or name ilike '%co ban%' or name ilike '%basic%');

insert into courses (name, status, price)
select 'Lớp học AI Nâng cao', 'open', 3999999
where not exists (select 1 from courses where name ilike '%nâng cao%' or name ilike '%nang cao%' or name ilike '%advanced%');

insert into courses (name, status, price)
select 'Lớp học OpenClaw', 'open', 599999
where not exists (select 1 from courses where name ilike '%claw%');

-- Kiểm tra kết quả:
-- select id, name, status, price from courses order by id;
