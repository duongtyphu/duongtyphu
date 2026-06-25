-- ════════════════════════════════════════════════════════════
-- NHÓM 3 (phần 2) — Prompt/Template & Gửi bài thực hành
-- Chạy file này trong Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════

-- 1) PROMPT / TEMPLATE — thư viện prompt AI & template dùng sẵn cho học viên
create table if not exists prompt_templates (
  id bigint generated always as identity primary key,
  title text not null,
  category text,        -- vd: 'Content', 'Nghiên cứu sản phẩm', 'Chăm sóc khách hàng'
  content text not null, -- nội dung prompt/template để học viên copy
  active boolean default true,
  created_at timestamptz default now()
);

-- 2) BÀI THỰC HÀNH — học viên nộp bài, admin chấm & phản hồi
create table if not exists submissions (
  id bigint generated always as identity primary key,
  member_email text not null,
  title text not null,
  content text,          -- nội dung bài làm hoặc mô tả
  link_url text,          -- link bài làm (Google Doc/Drive/ảnh chụp...)
  feedback text,
  status text default 'pending', -- pending | reviewed
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

alter table prompt_templates enable row level security;
alter table submissions       enable row level security;

-- Prompt/template: admin toàn quyền; thành viên đã đăng nhập chỉ đọc bản active
create policy "admin all - prompt_templates" on prompt_templates
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "member read active prompt_templates" on prompt_templates
  for select using (active = true and auth.role() = 'authenticated');

-- Bài thực hành: admin toàn quyền; thành viên chỉ xem/tạo bài của chính mình
create policy "admin all - submissions" on submissions
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "member read own submissions" on submissions
  for select using (auth.jwt() ->> 'email' = member_email);
create policy "member insert own submissions" on submissions
  for insert with check (auth.jwt() ->> 'email' = member_email);
