-- Việc 10 — /portal/hocvienai: tách WORK_NEEDS (12 mục) + FAQ (3 mục)
-- khỏi src/data/portal/ai-workspace.ts và src/app/portal/hocvienai/page.tsx
-- sang bảng Supabase quản qua Admin.
--
-- KHÔNG đụng: Journey Engine (Việc 3, getLiveKnowledgeCollections/Seeds),
-- AI Toolbox (AI_TOOLS, đã Full ở bảng `tools` khác — /portal/aiworkspace).

create table if not exists work_needs (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table work_needs enable row level security;

drop policy if exists "work_needs_public_select" on work_needs;
create policy "work_needs_public_select" on work_needs
  for select using (status = 'Published');

insert into work_needs (id, data, status, "order") values
  ('viet-noi-dung', jsonb_build_object('title', 'Viết nội dung', 'description', 'Bài viết, caption, kịch bản, email — nhanh và đúng giọng văn.', 'icon', '✍️'), 'Published', 0),
  ('thiet-ke-hinh-anh', jsonb_build_object('title', 'Thiết kế hình ảnh', 'description', 'Banner, hình minh hoạ, ảnh sản phẩm bằng AI.', 'icon', '🎨'), 'Published', 1),
  ('tao-video', jsonb_build_object('title', 'Tạo video', 'description', 'Video ngắn, voice, phụ đề — dựng nhanh với AI.', 'icon', '🎬'), 'Published', 2),
  ('marketing', jsonb_build_object('title', 'Marketing', 'description', 'Kế hoạch nội dung, quảng cáo, chiến dịch ra mắt.', 'icon', '📣'), 'Published', 3),
  ('ban-hang', jsonb_build_object('title', 'Bán hàng', 'description', 'Kịch bản tư vấn, email chốt đơn, chăm sóc khách.', 'icon', '🛒'), 'Published', 4),
  ('nghien-cuu', jsonb_build_object('title', 'Nghiên cứu', 'description', 'Tổng hợp thông tin, phân tích thị trường, đối thủ.', 'icon', '🔎'), 'Published', 5),
  ('phan-tich-du-lieu', jsonb_build_object('title', 'Phân tích dữ liệu', 'description', 'Đọc số liệu, tìm insight, tóm tắt báo cáo.', 'icon', '📊'), 'Published', 6),
  ('hoc-tap', jsonb_build_object('title', 'Học tập', 'description', 'Tóm tắt kiến thức, luyện tập, giải thích lại cho dễ hiểu.', 'icon', '📚'), 'Published', 7),
  ('van-phong', jsonb_build_object('title', 'Văn phòng', 'description', 'Soạn thảo văn bản, biên bản họp, email công việc.', 'icon', '🗂️'), 'Published', 8),
  ('coding', jsonb_build_object('title', 'Coding', 'description', 'Viết code, sửa lỗi, giải thích đoạn code khó hiểu.', 'icon', '💻'), 'Published', 9),
  ('automation', jsonb_build_object('title', 'Automation', 'description', 'Kết nối công cụ, tự động hoá quy trình lặp lại.', 'icon', '⚙️'), 'Published', 10),
  ('dau-tu-du-an', jsonb_build_object('title', 'Đầu tư / dự án', 'description', 'Lập kế hoạch, đánh giá rủi ro, theo dõi tiến độ.', 'icon', '📈'), 'Published', 11)
on conflict (id) do nothing;

create table if not exists hocvienai_faq (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table hocvienai_faq enable row level security;

drop policy if exists "hocvienai_faq_public_select" on hocvienai_faq;
create policy "hocvienai_faq_public_select" on hocvienai_faq
  for select using (status = 'Published');

insert into hocvienai_faq (id, data, status, "order") values
  ('faq-1', jsonb_build_object('q', 'Học viện có phải là khoá học không?', 'a', 'Không. Học viện không bán khoá học — Học viện dẫn bạn qua một hành trình thực hành thật, dựa trên tri thức đã có trong Hệ tri thức AI (CKOS).'), 'Published', 0),
  ('faq-2', jsonb_build_object('q', 'Tôi cần hoàn thành bao nhiêu bài để ''xong''?', 'a', 'Học viện không đếm số bài đã hoàn thành. Học viện quan tâm bạn có đang làm việc khác đi so với trước không — đó mới là dấu hiệu trưởng thành thật.'), 'Published', 1),
  ('faq-3', jsonb_build_object('q', 'Companion có chấm điểm tôi không?', 'a', 'Không. Companion đồng hành và gợi ý bước tiếp theo, không chấm điểm, không xếp hạng.'), 'Published', 2)
on conflict (id) do nothing;
