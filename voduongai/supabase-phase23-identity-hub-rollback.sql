-- ============================================================================
-- PHASE 23 — Identity Hub v1.0: Rollback SQL (idempotent, staged)
-- ============================================================================

-- LỰA CHỌN A (khuyến nghị nếu chỉ muốn tắt trigger, giữ lại dữ liệu
-- onboarding đã nhập) — chỉ gỡ trigger tự tạo members row:
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_auth_user();

-- LỰA CHỌN B — gỡ toàn bộ Phase 23, kể cả cột onboarding đã thêm (XOÁ DỮ
-- LIỆU onboarding của mọi user đã điền — chỉ chạy khi chắc chắn cần rollback
-- hoàn toàn, không phải rollback tạm thời):
-- alter table members drop constraint if exists members_interests_check;
-- alter table members drop column if exists avatar_url;
-- alter table members drop column if exists occupation;
-- alter table members drop column if exists ai_goal;
-- alter table members drop column if exists interests;
-- alter table members drop column if exists onboarding_completed_at;

-- Trong MỌI trường hợp: `members.id/full_name/referral_code/is_admin/
-- created_at/date_of_birth/date_of_birth_hidden/identity_type` (cột gốc từ
-- trước Phase 23) và mọi bảng orders/courses/course_lessons KHÔNG bị động
-- tới — Identity Hub v1.0 không sửa/xoá bất kỳ cột nào trong số này.

-- Xác nhận sau rollback (Lựa chọn A):
--   select tgname from pg_trigger where tgname = 'on_auth_user_created';
--   -> kỳ vọng 0 dòng
