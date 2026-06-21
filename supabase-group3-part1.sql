-- ════════════════════════════════════════════════════════════
-- NHÓM 3 (phần 1) — Thông báo & Trung tâm hỗ trợ
-- Chạy file này trong Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════

-- 1) THÔNG BÁO — admin gửi broadcast tới toàn bộ học viên, hiện ở Portal
create table if not exists notifications (
  id bigint generated always as identity primary key,
  title text not null,
  message text,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2) TRUNG TÂM HỖ TRỢ — học viên gửi câu hỏi/yêu cầu hỗ trợ, admin trả lời
create table if not exists support_tickets (
  id bigint generated always as identity primary key,
  member_email text not null,
  subject text not null,
  message text not null,
  reply text,
  status text default 'open', -- open | replied | closed
  created_at timestamptz default now(),
  replied_at timestamptz
);

alter table notifications    enable row level security;
alter table support_tickets  enable row level security;

-- Thông báo: admin toàn quyền, thành viên đã đăng nhập chỉ đọc bản active
create policy "admin all - notifications" on notifications
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "member read active notifications" on notifications
  for select using (active = true and auth.role() = 'authenticated');

-- Hỗ trợ: admin toàn quyền; thành viên chỉ xem/tạo ticket của chính mình
create policy "admin all - support_tickets" on support_tickets
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "member read own tickets" on support_tickets
  for select using (auth.jwt() ->> 'email' = member_email);
create policy "member insert own tickets" on support_tickets
  for insert with check (auth.jwt() ->> 'email' = member_email);
