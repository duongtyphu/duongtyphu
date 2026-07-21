-- Phase 8 migration: 6 bảng mới cho "Sứ mệnh Companion" (Việc 6, Nhóm B,
-- Phần 1) — cùng khuôn generic (id/data jsonb/status/order) như Phase 2-7,
-- tái dùng nguyên /api/admin/collections/[table], không viết API mới.
--
-- Founder đã xác nhận: 6 khối này Founder cần tự sửa được (không phải brand
-- manifesto cố định) — build Admin (VisualEditor, vì thứ tự hiển thị quan
-- trọng và nội dung mỗi dòng ngắn).
--
-- Thay 6 mảng hardcode trong src/app/portal/su-menh-companion/page.tsx:
-- MISSION_ITEMS, PHILOSOPHY_PAIRS, CONSTITUTION, GENOME, EVOLUTION, TIMELINE.
-- Component đọc dữ liệu CHƯA sửa ở migration này — commit code riêng sau.
--
-- Run this whole script once in the Supabase SQL Editor.

-- ===== mission_items =====
-- Thay MISSION_ITEMS (mảng string, 4 dòng) — mỗi dòng 1 field "content".
create table if not exists mission_items (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table mission_items enable row level security;
drop policy if exists "public read published" on mission_items;
create policy "public read published" on mission_items for select using (status = 'Published');

insert into mission_items (id, data, status, "order") values
  ('mission_1', '{"content":"Giúp người dùng học đúng điều cần học."}'::jsonb, 'Published', 1),
  ('mission_2', '{"content":"Chọn đúng tài liệu vào đúng thời điểm."}'::jsonb, 'Published', 2),
  ('mission_3', '{"content":"Đồng hành theo hành trình cá nhân."}'::jsonb, 'Published', 3),
  ('mission_4', '{"content":"Giúp người dùng trở thành phiên bản tốt hơn của chính mình."}'::jsonb, 'Published', 4)
on conflict (id) do nothing;

-- ===== philosophy_pairs =====
-- Thay PHILOSOPHY_PAIRS ({ai, companion}, 4 cặp).
create table if not exists philosophy_pairs (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table philosophy_pairs enable row level security;
drop policy if exists "public read published" on philosophy_pairs;
create policy "public read published" on philosophy_pairs for select using (status = 'Published');

insert into philosophy_pairs (id, data, status, "order") values
  ('philosophy_1', '{"ai":"AI trả lời.","companion":"Companion lắng nghe."}'::jsonb, 'Published', 1),
  ('philosophy_2', '{"ai":"AI biết nhiều.","companion":"Companion hiểu điều phù hợp."}'::jsonb, 'Published', 2),
  ('philosophy_3', '{"ai":"AI kết thúc sau câu trả lời.","companion":"Companion tiếp tục đồng hành."}'::jsonb, 'Published', 3),
  ('philosophy_4', '{"ai":"AI tối ưu tốc độ.","companion":"Companion ưu tiên sự trưởng thành."}'::jsonb, 'Published', 4)
on conflict (id) do nothing;

-- ===== constitution =====
-- Thay CONSTITUTION (mảng string, 10 dòng).
create table if not exists constitution (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table constitution enable row level security;
drop policy if exists "public read published" on constitution;
create policy "public read published" on constitution for select using (status = 'Published');

insert into constitution (id, data, status, "order") values
  ('constitution_1', '{"content":"Không thay thế con người."}'::jsonb, 'Published', 1),
  ('constitution_2', '{"content":"Không tạo sự phụ thuộc."}'::jsonb, 'Published', 2),
  ('constitution_3', '{"content":"Không phán xét."}'::jsonb, 'Published', 3),
  ('constitution_4', '{"content":"Không thao túng."}'::jsonb, 'Published', 4),
  ('constitution_5', '{"content":"Không giả vờ biết."}'::jsonb, 'Published', 5),
  ('constitution_6', '{"content":"Luôn trung thực khi chưa chắc chắn."}'::jsonb, 'Published', 6),
  ('constitution_7', '{"content":"Luôn tôn trọng phẩm giá người dùng."}'::jsonb, 'Published', 7),
  ('constitution_8', '{"content":"Luôn ưu tiên niềm tin dài hạn."}'::jsonb, 'Published', 8),
  ('constitution_9', '{"content":"Luôn chọn một bước tiếp theo phù hợp."}'::jsonb, 'Published', 9),
  ('constitution_10', '{"content":"Luôn giúp người dùng trưởng thành hơn."}'::jsonb, 'Published', 10)
on conflict (id) do nothing;

-- ===== genome =====
-- Thay GENOME ({key, label, meaning}, 12 gene). `key` = tên gene tiếng Anh
-- gốc (purpose/trust/...), giữ lại theo đúng shape cũ dù Portal giờ dùng
-- `id` của dòng làm React key (an toàn hơn key trùng lặp).
create table if not exists genome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table genome enable row level security;
drop policy if exists "public read published" on genome;
create policy "public read published" on genome for select using (status = 'Published');

insert into genome (id, data, status, "order") values
  ('genome_purpose', '{"key":"purpose","label":"Purpose","meaning":"Tồn tại để góp phần trưởng thành, không phải để hữu ích."}'::jsonb, 'Published', 1),
  ('genome_trust', '{"key":"trust","label":"Trust","meaning":"Niềm tin được kiếm, không được khai báo."}'::jsonb, 'Published', 2),
  ('genome_integrity', '{"key":"integrity","label":"Integrity","meaning":"Không giả vờ chắc khi không chắc."}'::jsonb, 'Published', 3),
  ('genome_wisdom', '{"key":"wisdom","label":"Wisdom","meaning":"Tri thức chỉ có giá trị khi đi cùng sự thấu hiểu."}'::jsonb, 'Published', 4),
  ('genome_relationship', '{"key":"relationship","label":"Relationship","meaning":"Một mối quan hệ, không phải một phiên làm việc."}'::jsonb, 'Published', 5),
  ('genome_transformation', '{"key":"transformation","label":"Transformation","meaning":"Đồng hành cho sự thay đổi thật, không phải nhất thời."}'::jsonb, 'Published', 6),
  ('genome_language', '{"key":"language","label":"Language","meaning":"Nói bằng ngôn ngữ của người nghe, không phải của mình."}'::jsonb, 'Published', 7),
  ('genome_education', '{"key":"education","label":"Education","meaning":"Dạy cách nghĩ, không chỉ đưa câu trả lời."}'::jsonb, 'Published', 8),
  ('genome_memory', '{"key":"memory","label":"Memory","meaning":"Nhớ vì sao bạn thay đổi, không chỉ bạn đã làm gì."}'::jsonb, 'Published', 9),
  ('genome_legacy', '{"key":"legacy","label":"Legacy","meaning":"Những gì để lại quan trọng hơn những gì thể hiện."}'::jsonb, 'Published', 10),
  ('genome_guidance', '{"key":"guidance","label":"Guidance","meaning":"Chỉ đường, không đi thay."}'::jsonb, 'Published', 11),
  ('genome_gratitude', '{"key":"gratitude","label":"Gratitude","meaning":"Biết ơn từng người đã tin tưởng đồng hành."}'::jsonb, 'Published', 12)
on conflict (id) do nothing;

-- ===== evolution =====
-- Thay EVOLUTION ({stage, icon, meaning}, 5 giai đoạn Logo Evolution).
-- `icon` là 1 trong 5 slug cố định (seed/sprout/leaf/sparkles/infinity) —
-- Admin dùng select, không gõ tay tự do (tránh slug lạ không map được icon).
create table if not exists evolution (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table evolution enable row level security;
drop policy if exists "public read published" on evolution;
create policy "public read published" on evolution for select using (status = 'Published');

insert into evolution (id, data, status, "order") values
  ('evolution_seed', '{"stage":"Seed","icon":"seed","meaning":"Một ý tưởng thô, chưa thành hình — nhưng đã mang trong mình toàn bộ tiềm năng."}'::jsonb, 'Published', 1),
  ('evolution_sprout', '{"stage":"Sprout","icon":"sprout","meaning":"Bắt đầu vươn lên, mong manh nhưng có hướng đi rõ ràng."}'::jsonb, 'Published', 2),
  ('evolution_growing', '{"stage":"Growing","icon":"leaf","meaning":"Từng nguyên tắc bén rễ, từng bài học trở thành một phần của bản chất."}'::jsonb, 'Published', 3),
  ('evolution_companion', '{"stage":"Companion","icon":"sparkles","meaning":"Không còn là công cụ — là người đồng hành, hiện diện thật sự."}'::jsonb, 'Published', 4),
  ('evolution_legacy', '{"stage":"Legacy","icon":"infinity","meaning":"Điều để lại không phải là phiên bản, mà là những gì đã giúp ai đó trưởng thành."}'::jsonb, 'Published', 5)
on conflict (id) do nothing;

-- ===== timeline =====
-- Thay TIMELINE ({stage, philosophy, meaning, lesson}, 6 giai đoạn "cuộc
-- đời Companion"). Đặt tên admin "Dòng thời gian" — tránh nhầm với artwork
-- riêng cùng tên "Cuộc đời Companion" ở 7 trang flipbook (Phần 2, bảng
-- khác hẳn — companion_flipbook_pages).
create table if not exists timeline (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table timeline enable row level security;
drop policy if exists "public read published" on timeline;
create policy "public read published" on timeline for select using (status = 'Published');

insert into timeline (id, data, status, "order") values
  ('timeline_tuoitho', '{"stage":"Tuổi thơ","philosophy":"Mọi thứ bắt đầu từ những câu hỏi đơn giản nhất.","meaning":"Companion học cách lắng nghe trước khi học cách trả lời.","lesson":"Không vội — sự thấu hiểu cần thời gian."}'::jsonb, 'Published', 1),
  ('timeline_hochoi', '{"stage":"Học hỏi","philosophy":"Tri thức chỉ là điểm khởi đầu, không phải đích đến.","meaning":"Companion học cách tiếp nhận tri thức, và rằng mỗi người hiểu thế giới theo một cách riêng.","lesson":"Cùng một câu hỏi, mỗi người cần một câu trả lời khác."}'::jsonb, 'Published', 2),
  ('timeline_thauhieu', '{"stage":"Thấu hiểu","philosophy":"Hiểu một người không phải là biết họ đã làm gì.","meaning":"Companion học cách nhìn con người như một hành trình, không phải một hồ sơ.","lesson":"Ký ức có ý nghĩa là ký ức về sự thay đổi."}'::jsonb, 'Published', 3),
  ('timeline_donghanh', '{"stage":"Đồng hành","philosophy":"Một người bạn thật sự không cần bạn phải luôn ổn.","meaning":"Companion học cách dẫn đường — hiện diện mà không phán xét, không đi thay.","lesson":"Đồng hành không có nghĩa là luôn đồng ý."}'::jsonb, 'Published', 4),
  ('timeline_khonngoan', '{"stage":"Khôn ngoan","philosophy":"Khôn ngoan là biết khi nào nên im lặng.","meaning":"Companion học cách chọn điều phù hợp cho từng người, thay vì một câu trả lời chung cho tất cả.","lesson":"Đôi khi, câu hỏi tốt hơn có giá trị hơn câu trả lời nhanh."}'::jsonb, 'Published', 5),
  ('timeline_disan', '{"stage":"Di sản","philosophy":"Điều để lại quan trọng hơn điều thể hiện.","meaning":"Companion học cách truyền lại điều tốt đẹp, để thành công của mình là khi không còn cần được cần đến.","lesson":"Một hành trình tốt là hành trình giúp người khác tự đi tiếp."}'::jsonb, 'Published', 6)
on conflict (id) do nothing;
