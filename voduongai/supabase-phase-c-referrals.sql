-- ============================================================================
-- PHASE C.2 — Missing Migration Reconstruction: referrals
-- ============================================================================
-- Suy luận schema từ: src/app/portal/referral/page.tsx (getReferralData — SELECT
-- theo referrer_id = auth.uid()).
--
-- GHI CHÚ XÁC MINH BẮT BUỘC:
--   - Không tìm thấy bất kỳ code nào INSERT vào bảng `referrals` trong toàn bộ
--     codebase hiện tại — rất có thể việc tạo dòng referral xảy ra qua 1 trigger/
--     function phía Supabase Dashboard (ví dụ trigger on insert vào `orders`
--     hoặc `members`) không nằm trong repo. CẦN xác minh trực tiếp trên
--     Supabase Dashboard (Database > Triggers/Functions) trước khi coi migration
--     này là đầy đủ — file này chỉ tái dựng được phần SCHEMA BẢNG, không tái
--     dựng được cơ chế tạo dữ liệu nếu nó nằm ngoài repo.
--   - `referrer_id` suy đoán kiểu uuid (khớp `members.id`/`auth.users.id`) dựa
--     trên cách code query `.eq("referrer_id", user.id)` với `user.id` là uuid.
--   - Cũng như submissions: KHÔNG bật RLS ở đây cho tới khi xác nhận trạng thái
--     RLS thật của bảng production hiện tại (xem ghi chú chi tiết trong
--     supabase-phase-c-submissions.sql — cùng logic áp dụng ở đây).
-- ============================================================================

create table if not exists referrals (
  id bigint generated always as identity primary key,
  referrer_id uuid references auth.users(id) on delete cascade,
  referred_email text not null,
  commission_amount numeric not null default 0,
  status text not null default 'pending', -- quan sát được: 'pending' | 'confirmed' | 'paid'
  created_at timestamptz not null default now()
);

comment on table referrals is
  'Hoa hồng giới thiệu (/portal/referral). Migration tái dựng Phase C — '
  'CẦN xác minh cơ chế tạo dữ liệu (trigger/function) không có trong repo.';

-- ⚠️ CHỈ CHẠY SAU KHI XÁC NHẬN TRẠNG THÁI RLS THẬT TRÊN PRODUCTION.
-- alter table referrals enable row level security;
--
-- create policy "members can view own referrals" on referrals
--   for select using (referrer_id = auth.uid());
--
-- Không có policy insert/update công khai — nếu dữ liệu được tạo qua trigger/
-- function nội bộ, trigger chạy với quyền definer nên không bị RLS chặn.
