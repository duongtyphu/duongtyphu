-- ============================================================================
-- PHASE C.2 — Missing Migration Reconstruction: submissions
-- ============================================================================
-- Bảng này đang được dùng THẬT trong production nhưng trước đây chỉ tồn tại
-- trên Supabase Dashboard, không có migration nào trong repo (Phase A finding).
-- File này CHỈ ghi lại schema đang chạy thật để có thể tái dựng — KHÔNG đổi
-- hành vi hiện tại, KHÔNG drop, KHÔNG rename.
--
-- Suy luận schema từ:
--   - src/app/portal/practice/actions.ts        (submitPracticeWork — INSERT)
--   - src/app/portal/practice/page.tsx           (getSubmissions — SELECT)
--   - src/app/admin/(dashboard)/projects/actions.ts (listSubmissions/gradeSubmission)
--
-- GHI CHÚ XÁC MINH BẮT BUỘC (chưa có quyền truy cập trực tiếp Supabase
-- Dashboard/Management API trong môi trường audit này — SUPABASE_SERVICE_ROLE_KEY
-- không được cấu hình sẵn khi thực hiện Phase C):
--   1. Kiểu dữ liệu chính xác của `id` (bigint identity là suy đoán hợp lý theo
--      convention chung của các bảng "thật" khác trong supabase-core-schema.sql,
--      nhưng CẦN xác nhận qua Dashboard trước khi coi migration này là "final").
--   2. Chưa xác nhận RLS hiện tại trên bảng `submissions` đang BẬT hay TẮT.
--      Code hiện đọc/ghi bảng này bằng anon-key session client
--      (getSupabaseServer, KHÔNG phải getSupabaseAdmin) và lọc theo
--      `member_email = email hiện tại` — điều này CHỈ hoạt động đúng nếu:
--        (a) RLS đang TẮT (mọi authenticated user đọc/ghi được toàn bộ bảng,
--            code tự lọc ở tầng ứng dụng), HOẶC
--        (b) RLS đang BẬT với 1 policy cho phép authenticated user
--            select/insert dựa trên email của chính họ.
--      Policy bên dưới viết theo phương án (b) vì đó là pattern an toàn hơn —
--      NHƯNG nếu bảng thật đang ở trạng thái (a), việc bật RLS lần đầu ở đây
--      sẽ THAY ĐỔI hành vi (thắt chặt quyền truy cập) — vi phạm nguyên tắc
--      "không đổi behavior hiện tại" của Phase C nếu áp dụng vào bảng đã tồn
--      tại. VÌ VẬY: nếu bảng `submissions` đã tồn tại thật trong production,
--      KHÔNG chạy phần "enable row level security" + policy bên dưới cho tới
--      khi đã xác nhận trạng thái RLS thật qua Supabase Dashboard.
--      Nếu bảng CHƯA tồn tại (môi trường mới/disaster recovery), toàn bộ file
--      này an toàn để chạy nguyên vẹn.
-- ============================================================================

create table if not exists submissions (
  id bigint generated always as identity primary key,
  member_email text not null,
  title text not null,
  content text not null,
  link_url text,
  feedback text,
  status text not null default 'pending', -- convention quan sát được: 'pending' | 'reviewed'
  created_at timestamptz not null default now()
);

comment on table submissions is
  'Bài nộp thực hành (Dự án thực chiến, /portal/practice). Migration tái dựng '
  'Phase C — xác minh RLS thật trước khi bật lần đầu trên bảng production.';

-- ⚠️ CHỈ CHẠY PHẦN DƯỚI ĐÂY SAU KHI ĐÃ XÁC NHẬN TRẠNG THÁI RLS THẬT (xem ghi chú trên).
-- alter table submissions enable row level security;
--
-- create policy "members can view own submissions" on submissions
--   for select using (member_email = auth.jwt() ->> 'email');
--
-- create policy "members can submit own work" on submissions
--   for insert with check (member_email = auth.jwt() ->> 'email');
--
-- Không có policy public update/delete — chấm điểm (feedback/status) chỉ qua
-- getSupabaseAdmin() trong admin/projects/actions.ts (service role, bypass RLS).
