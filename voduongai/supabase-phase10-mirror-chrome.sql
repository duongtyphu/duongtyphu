-- Phase 10 migration: 2 bảng cho "Hành trình của tôi" — cửa Mirror (Việc 9).
-- Cùng khuôn generic (id/data jsonb/status/order) như các phase trước.
--
-- CHỈ tách phần static chrome đã xác nhận an toàn qua audit code thật:
-- title, 2 dòng empty-state + CTA label, footer, và MIRROR_QUESTIONS
-- (mảng câu hỏi xoay vòng theo ngày). KHÔNG đụng `invitation` (dòng mở của
-- Companion — buildCompanionMirrorInvitation(), tính từ growthSignals thật
-- của member, hoàn toàn động) hay bất kỳ phần dữ liệu động nào khác
-- (reflections/memory_capsules/growth-view.ts/localStorage).

-- ===== mirror_chrome =====
-- 1 dòng duy nhất (id='mirror') — thay các chuỗi hardcode trong
-- MirrorChamber.tsx: title "Mirror", 2 dòng empty-state, CTA label
-- "Bắt đầu để lại dấu chân đầu tiên", footer.
create table if not exists mirror_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table mirror_chrome enable row level security;
drop policy if exists "public read published" on mirror_chrome;
create policy "public read published" on mirror_chrome for select using (status = 'Published');

insert into mirror_chrome (id, data, status, "order") values
  ('mirror', '{"title":"Mirror","emptyStateLine1":"Hôm nay chiếc gương vẫn còn rất yên tĩnh.","emptyStateLine2":"Nó sẽ phản chiếu những điều bạn thật sự sống.","emptyStateCtaLabel":"Bắt đầu để lại dấu chân đầu tiên","footer":"Mirror không chấm điểm, không so sánh — chỉ phản chiếu đúng những gì bạn thật sự sống."}'::jsonb, 'Published', 1)
on conflict (id) do nothing;

-- ===== mirror_questions =====
-- Thay MIRROR_QUESTIONS (mảng string, 7 câu, xoay vòng theo ngày qua
-- todaysMirrorQuestion() trong mirror-question.ts).
create table if not exists mirror_questions (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table mirror_questions enable row level security;
drop policy if exists "public read published" on mirror_questions;
create policy "public read published" on mirror_questions for select using (status = 'Published');

insert into mirror_questions (id, data, status, "order") values
  ('mirror_q1', '{"content":"Bạn muốn tiếp tục nuôi dưỡng điều gì?"}'::jsonb, 'Published', 1),
  ('mirror_q2', '{"content":"Điều gì khiến bạn bất ngờ nhất về chính mình?"}'::jsonb, 'Published', 2),
  ('mirror_q3', '{"content":"Phần nào của bạn xứng đáng được chú ý nhiều hơn?"}'::jsonb, 'Published', 3),
  ('mirror_q4', '{"content":"Tuần này bạn trưởng thành ở điều gì?"}'::jsonb, 'Published', 4),
  ('mirror_q5', '{"content":"Điều gì bạn muốn làm tốt hơn?"}'::jsonb, 'Published', 5),
  ('mirror_q6', '{"content":"Điều gì khiến bạn tự hào?"}'::jsonb, 'Published', 6),
  ('mirror_q7', '{"content":"Điều gì bạn muốn Companion đồng hành tiếp?"}'::jsonb, 'Published', 7)
on conflict (id) do nothing;
