-- VDAI Academy — Fix lỗi "Tôi đã chuyển khoản" không hoạt động cho Bài giảng/Khoá học
-- Nguyên nhân: lessons.course_id khai báo kiểu uuid nhưng courses.id là TEXT
-- → bảng lessons có thể đã tạo lỗi/không có khoá ngoại đúng, và bảng orders
--   thiếu cột lesson_id/course_id nên insert đơn hàng bị lỗi.
-- Chạy file này trong Supabase SQL Editor (Dashboard > SQL Editor > New query).

-- 1) Sửa kiểu dữ liệu course_id trong bảng lessons cho khớp với courses.id (TEXT)
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_course_id_fkey;
ALTER TABLE lessons ALTER COLUMN course_id TYPE text USING course_id::text;
ALTER TABLE lessons ADD CONSTRAINT lessons_course_id_fkey
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;

-- 2) Thêm cột giá cho courses (nếu chưa có)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price integer DEFAULT 0;

-- 3) Thêm cột lesson_id / course_id cho bảng orders (nếu chưa có)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS lesson_id bigint REFERENCES lessons(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS course_id text REFERENCES courses(id) ON DELETE SET NULL;

-- 4) Thêm cột paid_at cho referrals (dùng cho tính năng "Đánh dấu đã trả hoa hồng" trong trang Admin)
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- 5) Cho phép Admin (RLS) đọc/sửa toàn bộ bảng referrals để quản lý affiliate
DROP POLICY IF EXISTS "Admin full access to referrals" ON public.referrals;
CREATE POLICY "Admin full access to referrals" ON public.referrals
  FOR ALL USING (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');

-- 6) Tạo lại mã giới thiệu cho các thành viên đã đăng ký TRƯỚC khi trigger
--    set_referral_code được thêm vào (trigger chỉ tự sinh mã cho member MỚI,
--    không hồi tố cho member cũ → đây là lý do link Referral trống trong portal)
UPDATE public.members
SET referral_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
WHERE referral_code IS NULL;

-- 7) Tích hợp SePay (xác nhận chuyển khoản tự động qua webhook)
--    order_code = mã đơn hàng duy nhất (dạng "VDAI{id}") nhúng vào nội dung
--    chuyển khoản, dùng để khớp đúng đơn khi SePay báo có tiền vào.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_code text UNIQUE;
