-- ============================================================================
-- PHASE 23 — Identity Hub v1.0
-- ============================================================================
-- Mục tiêu: `members` là bảng profile DUY NHẤT của toàn hệ sinh thái (Website,
-- Học viện, Companion, Premium, AI Workspace, Dự án & Cơ hội, Admin). Không
-- tạo bảng `profiles` song song — chỉ mở rộng `members` (đã đúng mô hình 1
-- row/user, đã có RLS `auth.uid() = id`, xem supabase-core-schema.sql).
--
-- KHÔNG đụng bất kỳ bảng membership/entitlement/course enrollment nào
-- (orders/courses/course_sections/course_lessons) — dữ liệu đó tách biệt
-- hoàn toàn với authentication/profile theo đúng yêu cầu Identity Hub v1.0.
--
-- An toàn: mọi `alter table` dùng `add column if not exists` (idempotent,
-- chạy lại không lỗi), không có `drop`/`not null` ép buộc trên dữ liệu cũ,
-- không phá bất kỳ cột/bảng nào đang dùng thật. Rollback tương ứng ở
-- supabase-phase23-identity-hub-rollback.sql.
--
-- LƯU Ý: file này viết sẵn để Founder tự review + tự chạy trên Supabase
-- Dashboard (SQL Editor) hoặc CLI — KHÔNG được tự động apply vào Production
-- từ phiên làm việc này (đúng yêu cầu "không tự thay đổi dữ liệu thật").
-- ============================================================================

-- ===== Onboarding fields trên members =====
-- avatar_url: ảnh đại diện (URL đã host sẵn, dự án chưa có upload — dán URL,
--   cùng convention `imageUrl`/`thumbnail_url` đã dùng ở các module khác).
-- occupation: nghề nghiệp (free text, nhập lúc onboarding).
-- ai_goal: mục tiêu học AI (free text, mô tả ngắn của người dùng).
-- interests: các lựa chọn multi-select — học tập/công việc/kinh doanh/
--   Affiliate Marketing/thương hiệu cá nhân — lưu dạng mảng slug ổn định
--   (xem CHECK constraint bên dưới), không phải label tiếng Việt hiển thị
--   (label đổi được ở tầng UI mà không cần migrate dữ liệu).
-- onboarding_completed_at: null = CHƯA hoàn thành onboarding lần đầu; có
--   giá trị = đã hoàn thành. Đây là cột middleware dùng để gate
--   `/portal/*` sang `/portal/onboarding` cho user mới.
alter table members add column if not exists avatar_url text;
alter table members add column if not exists occupation text;
alter table members add column if not exists ai_goal text;
alter table members add column if not exists interests text[] not null default '{}';
alter table members add column if not exists onboarding_completed_at timestamptz;

alter table members drop constraint if exists members_interests_check;
alter table members add constraint members_interests_check
  check (
    interests <@ array['hoc-tap', 'cong-viec', 'kinh-doanh', 'affiliate-marketing', 'thuong-hieu-ca-nhan']::text[]
  );

-- ===== Trigger: tự tạo members row khi có user mới trong auth.users =====
-- Đây là gap thật đã audit thấy — `supabase-admin-auth.sql` tự thừa nhận
-- "insert nếu chưa có row (in case no signup trigger created it)" nhưng
-- KHÔNG file nào trong repo từng tạo trigger đó. Không có trigger này thì
-- "một user profile duy nhất" không được đảm bảo — user đăng ký qua Google/
-- magic-link/password xong có thể hoàn toàn không có `members` row cho tới
-- khi 1 đoạn code nào đó tình cờ insert lên (rủi ro `.single()` ở nhiều nơi
-- trong app trả về null thay vì lỗi rõ ràng).
--
-- `security definer` cần thiết vì trigger chạy trên `auth.users` (schema
-- `auth`, không phải `public`) — user thường không có quyền ghi vào
-- `public.members` tại thời điểm INSERT đang xảy ra trên `auth.users`.
-- `on conflict (id) do nothing` — an toàn tuyệt đối, không bao giờ ghi đè
-- dữ liệu members đã có (kể cả is_admin đã set tay).
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- `members.email` is `not null` — omitting it here raises a not-null
  -- violation inside this AFTER INSERT trigger, which rolls back the
  -- whole `auth.users` insert and breaks EVERY new signup (Register,
  -- Google OAuth, magic-link alike) with a generic 500 from GoTrue.
  -- Confirmed live on this same Supabase project (uosxpxolsvwcafxvnroy,
  -- shared with the admin-rebuild branch) before this fix — see
  -- admin-rebuild's CLAUDE.md "BUG P0 ĐÃ SỬA" entry for the full repro.
  insert into public.members (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ===== Xác nhận sau khi chạy (tự kiểm tra thủ công trên SQL Editor) =====
-- select column_name from information_schema.columns where table_name = 'members';
--   -> kỳ vọng thấy avatar_url/occupation/ai_goal/interests/onboarding_completed_at
-- select tgname from pg_trigger where tgname = 'on_auth_user_created';
--   -> kỳ vọng 1 dòng
-- Test thật (KHÔNG chạy tự động ở đây): tạo 1 user test qua Supabase Auth
-- (Dashboard hoặc signUp() thật), sau đó:
--   select id, full_name, onboarding_completed_at from members where id = '<user id vừa tạo>';
--   -> kỳ vọng 1 dòng tự động xuất hiện, onboarding_completed_at = null
