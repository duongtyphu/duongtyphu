-- Phase 2 migration: 16 content tables for VO DUONG AI admin collections
-- Run this whole script once in the Supabase SQL Editor.

-- ===== prompts =====
create table if not exists prompts (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table prompts enable row level security;
drop policy if exists "public read published" on prompts;
create policy "public read published" on prompts for select using (status = 'Published');

insert into prompts (id, data, status) values
  ('prompt_1', '{"id":"prompt_1","title":"Viết content viral cho Facebook","slug":"viral-content","category":"Content","description":"Tạo bài viết Facebook thu hút tương tác.","content":"Viết 1 bài Facebook về [chủ đề] theo phong cách kể chuyện, có hook mở đầu gây tò mò...","exampleOutput":"Hôm qua tôi vừa...","tags":["content","facebook"],"level":"Cơ bản","tier":"Free","featured":true,"copyCount":482,"status":"Published"}'::jsonb, 'Published'),
  ('prompt_2', '{"id":"prompt_2","title":"Phân tích đối thủ Affiliate","slug":"phan-tich-doi-thu","category":"Affiliate","description":"Phân tích chiến lược của đối thủ Affiliate.","content":"Phân tích website [URL] và liệt kê chiến lược Affiliate đang dùng...","exampleOutput":"1. Họ dùng landing page...","tags":["affiliate","research"],"level":"Trung cấp","tier":"Premium","featured":false,"copyCount":213,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== tools =====
create table if not exists tools (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table tools enable row level security;
drop policy if exists "public read published" on tools;
create policy "public read published" on tools for select using (status = 'Published');

insert into tools (id, data, status) values
  ('tool_1', '{"id":"tool_1","name":"ChatGPT","slug":"chatgpt","logo":"chatgpt","category":"AI","shortDescription":"Trợ lý AI viết nội dung, nghiên cứu nhanh.","longDescription":"ChatGPT giúp viết bài, nghiên cứu và lên kế hoạch nội dung mỗi ngày.","useCase":"Viết nội dung, brainstorm ý tưởng","audience":"Người mới bắt đầu với AI","pros":["Trả lời nhanh, hiểu tiếng Việt tốt","Có app di động"],"cons":["Bản miễn phí giới hạn lượt hỏi"],"pricing":"Freemium","link":"https://chatgpt.com","affiliateUrl":"","workflow":"Sáng viết outline content bằng ChatGPT → chỉnh lại giọng văn cho phù hợp thương hiệu → đăng lên các kênh.","relatedPromptId":"prompt_1","relatedResourceHref":"/portal/templates","ctaText":"Dùng thử ChatGPT","ctaLink":"https://chatgpt.com","badge":"Tôi đang dùng","rating":4.8,"featured":true,"tier":"Free","status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== templates =====
create table if not exists templates (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table templates enable row level security;
drop policy if exists "public read published" on templates;
create policy "public read published" on templates for select using (status = 'Published');

insert into templates (id, data, status) values
  ('tpl_1', '{"id":"tpl_1","name":"Template mẫu cho người mới","slug":"tpl-mau","type":"Template","description":"Template hướng dẫn bắt đầu nhanh với AI.","category":"Nhập môn","tags":["ai","starter"],"tier":"Free","requiresSignup":false,"featured":true,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== ebooks =====
create table if not exists ebooks (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ebooks enable row level security;
drop policy if exists "public read published" on ebooks;
create policy "public read published" on ebooks for select using (status = 'Published');

insert into ebooks (id, data, status) values
  ('ebook_1', '{"id":"ebook_1","name":"Ebook mẫu cho người mới","slug":"ebook-mau","type":"Ebook","description":"Ebook hướng dẫn bắt đầu nhanh với AI.","category":"Nhập môn","tags":["ai","starter"],"tier":"Free","requiresSignup":false,"featured":true,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== checklists =====
create table if not exists checklists (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table checklists enable row level security;
drop policy if exists "public read published" on checklists;
create policy "public read published" on checklists for select using (status = 'Published');

insert into checklists (id, data, status) values
  ('checklist_1', '{"id":"checklist_1","name":"Checklist mẫu cho người mới","slug":"checklist-mau","type":"Checklist","description":"Checklist hướng dẫn bắt đầu nhanh với AI.","category":"Nhập môn","tags":["ai","starter"],"tier":"Free","requiresSignup":false,"featured":true,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== sop =====
create table if not exists sop (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table sop enable row level security;
drop policy if exists "public read published" on sop;
create policy "public read published" on sop for select using (status = 'Published');

insert into sop (id, data, status) values
  ('sop_1', '{"id":"sop_1","name":"SOP mẫu cho người mới","slug":"sop-mau","type":"SOP","description":"SOP hướng dẫn bắt đầu nhanh với AI.","category":"Nhập môn","tags":["ai","starter"],"tier":"Free","requiresSignup":false,"featured":true,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== resources =====
create table if not exists resources (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table resources enable row level security;
drop policy if exists "public read published" on resources;
create policy "public read published" on resources for select using (status = 'Published');

insert into resources (id, data, status) values
  ('res_1', '{"id":"res_1","name":"Tài nguyên mẫu cho người mới","slug":"res-mau","type":"Tài nguyên","description":"Tài nguyên hướng dẫn bắt đầu nhanh với AI.","category":"Nhập môn","tags":["ai","starter"],"tier":"Free","requiresSignup":false,"featured":true,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== blog =====
create table if not exists blog (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table blog enable row level security;
drop policy if exists "public read published" on blog;
create policy "public read published" on blog for select using (status = 'Published');

insert into blog (id, data, status) values
  ('blog_1', '{"id":"blog_1","title":"5 cách dùng AI để tăng năng suất công việc","slug":"5-cach-dung-ai-tang-nang-suat","excerpt":"Ứng dụng AI vào công việc hàng ngày để tiết kiệm thời gian.","content":"","category":"AI","tags":["ai","productivity"],"author":"Võ Đương","status":"Published","publishedAt":"2026-05-01","featured":true}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== case_study =====
create table if not exists case_study (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table case_study enable row level security;
drop policy if exists "public read published" on case_study;
create policy "public read published" on case_study for select using (status = 'Published');

insert into case_study (id, data, status) values
  ('case_1', '{"id":"case_1","title":"Học viên A tăng thu nhập Affiliate gấp 3 lần sau 60 ngày","slug":"case-study-affiliate-x3","summary":"Case study thực chiến Affiliate Marketing.","body":"","status":"Published","publishedAt":"2026-04-12","featured":true}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== news =====
create table if not exists news (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table news enable row level security;
drop policy if exists "public read published" on news;
create policy "public read published" on news for select using (status = 'Published');

insert into news (id, data, status) values
  ('news_1', '{"id":"news_1","title":"Cập nhật hệ sinh thái VO DUONG AI tháng 6","slug":"cap-nhat-thang-6","summary":"Tổng hợp thay đổi mới nhất trong hệ sinh thái.","body":"","status":"Published","publishedAt":"2026-06-01","featured":false}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== updates =====
create table if not exists updates (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table updates enable row level security;
drop policy if exists "public read published" on updates;
create policy "public read published" on updates for select using (status = 'Published');

insert into updates (id, data, status) values
  ('update_1', '{"id":"update_1","title":"Thêm 3 Prompt mới cho Content & Affiliate","slug":"them-3-prompt-moi","type":"Prompt mới","shortContent":"Bổ sung Prompt viết content viral và phân tích đối thủ Affiliate.","content":"Đã thêm 3 prompt mới vào Thư viện Prompt, tập trung vào content viral và nghiên cứu đối thủ Affiliate.","publishedAt":"2026-06-20","author":"VO DUONG AI","featured":true,"status":"Published"}'::jsonb, 'Published'),
  ('update_2', '{"id":"update_2","title":"Cập nhật công cụ: thêm HeyGen vào Thư viện công cụ","slug":"them-heygen","type":"Công cụ mới","shortContent":"HeyGen giúp tạo video AI avatar khi không có thời gian quay video thật.","content":"HeyGen đã được thêm vào Thư viện công cụ với hướng dẫn sử dụng chi tiết.","publishedAt":"2026-06-15","author":"VO DUONG AI","featured":false,"status":"Published"}'::jsonb, 'Published'),
  ('update_3', '{"id":"update_3","title":"Ra mắt module Affiliate Hub mới với lộ trình từng bước","slug":"ra-mat-affiliate-hub-moi","type":"Cập nhật hệ sinh thái","shortContent":"Affiliate Hub nâng cấp thành trung tâm doanh thu với 7 section đầy đủ.","content":"Affiliate Hub mới gồm: Bắt đầu Affiliate, Chọn ngách, Chọn sản phẩm, Xây nội dung, Công cụ Affiliate, Case Study, Top sản phẩm tháng này.","publishedAt":"2026-06-10","author":"VO DUONG AI","featured":true,"status":"Published"}'::jsonb, 'Published'),
  ('update_4', '{"id":"update_4","title":"Thêm bài học mới trong Học viện AI: Prompt Engineering cơ bản","slug":"prompt-engineering-co-ban","type":"Khóa học mới","shortContent":"Bài học mới giúp học viên viết prompt hiệu quả hơn.","content":"Bài học Prompt Engineering cơ bản đã có trong Học viện AI.","publishedAt":"2026-06-01","author":"VO DUONG AI","featured":false,"status":"Published"}'::jsonb, 'Published'),
  ('update_5', '{"id":"update_5","title":"Cập nhật Template kế hoạch content 30 ngày","slug":"cap-nhat-template-content-30-ngay","type":"Tài nguyên mới","shortContent":"Template kế hoạch content 30 ngày đã được cập nhật.","content":"Template kế hoạch content 30 ngày trong Thư viện Template đã được cập nhật với cấu trúc mới.","publishedAt":"2026-05-25","author":"VO DUONG AI","featured":false,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== community =====
create table if not exists community (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table community enable row level security;
drop policy if exists "public read published" on community;
create policy "public read published" on community for select using (status = 'Published');

insert into community (id, data, status) values
  ('ch_1', '{"id":"ch_1","platform":"Facebook","label":"Facebook Group","url":"https://www.facebook.com/groups/24279131375123067","status":"Active"}'::jsonb, 'Active'),
  ('ch_2', '{"id":"ch_2","platform":"YouTube","label":"YouTube Channel","url":"https://www.youtube.com/@voduongofficial","status":"Active"}'::jsonb, 'Active'),
  ('ch_3', '{"id":"ch_3","platform":"TikTok","label":"TikTok","url":"https://www.tiktok.com/@vdai_academy","status":"Active"}'::jsonb, 'Active'),
  ('ch_4', '{"id":"ch_4","platform":"Zalo","label":"Zalo Group","url":"https://zalo.me/g/fcudmw102","status":"Active"}'::jsonb, 'Active'),
  ('ch_5', '{"id":"ch_5","platform":"Telegram","label":"Telegram","url":"","status":"Inactive"}'::jsonb, 'Inactive')
on conflict (id) do nothing;

-- ===== student_success_stories =====
create table if not exists student_success_stories (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table student_success_stories enable row level security;
drop policy if exists "public read published" on student_success_stories;
create policy "public read published" on student_success_stories for select using (status = 'Published');

insert into student_success_stories (id, data, status) values
  ('story_1', '{"id":"story_1","studentName":"Minh Anh","title":"Tăng 3x lượt tương tác sau 30 ngày dùng Prompt content viral","shortDescription":"Content Creator áp dụng Prompt AI để viết bài nhanh và hiệu quả hơn.","content":"Trước đây Minh Anh mất cả buổi để viết 1 bài Facebook. Sau khi áp dụng Prompt viết content viral trong Thư viện Prompt, thời gian viết bài giảm xuống còn 15 phút và lượt tương tác tăng gấp 3 lần.","result":"Tăng 3x lượt tương tác sau 30 ngày","toolsUsed":["chatgpt","canva"],"relatedResource":"/portal/prompts","featured":true,"status":"Published"}'::jsonb, 'Published'),
  ('story_2', '{"id":"story_2","studentName":"Quốc Huy","title":"Có đơn hàng Affiliate đầu tiên sau 2 tuần áp dụng lộ trình","shortDescription":"Affiliate Marketer mới bắt đầu, đi theo lộ trình Affiliate Hub.","content":"Quốc Huy không biết bắt đầu từ đâu với Affiliate Marketing. Sau khi đi theo lộ trình trong Affiliate Hub — chọn ngách, chọn sản phẩm, xây nội dung — anh có đơn hàng đầu tiên chỉ sau 2 tuần.","result":"Đơn hàng Affiliate đầu tiên sau 2 tuần","toolsUsed":["hostinger"],"relatedResource":"/portal/affiliate-hub","featured":true,"status":"Published"}'::jsonb, 'Published'),
  ('story_3', '{"id":"story_3","studentName":"Thanh Trúc","title":"Ra mắt ebook đầu tiên và bán được trong tháng đầu tiên","shortDescription":"Freelancer đóng gói kiến thức thành sản phẩm số đầu tiên.","content":"Thanh Trúc dùng Học viện AI và Thư viện Template để hoàn thành ebook đầu tiên nhanh hơn nhiều so với tự mò mẫm, và đã bán được ngay trong tháng ra mắt.","result":"Bán được ebook đầu tiên trong tháng ra mắt","toolsUsed":["chatgpt","canva"],"relatedResource":"/portal/templates","featured":false,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== ai_academy =====
create table if not exists ai_academy (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ai_academy enable row level security;
drop policy if exists "public read published" on ai_academy;
create policy "public read published" on ai_academy for select using (status = 'Published');

insert into ai_academy (id, data, status) values
  ('ai_1', '{"id":"ai_1","title":"AI là gì và vì sao bạn cần học ngay","slug":"ai-la-gi","shortDescription":"Tổng quan về AI cho người mới.","content":"","category":"Nhập môn","level":"Cơ bản","duration":"12 phút","tier":"Free","status":"Published","order":1}'::jsonb, 'Published'),
  ('ai_2', '{"id":"ai_2","title":"Viết Prompt hiệu quả với ChatGPT","slug":"viet-prompt-hieu-qua","shortDescription":"Kỹ thuật prompt căn bản.","content":"","category":"Prompt","level":"Cơ bản","duration":"18 phút","tier":"Free","status":"Published","order":2}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== affiliate_academy =====
create table if not exists affiliate_academy (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table affiliate_academy enable row level security;
drop policy if exists "public read published" on affiliate_academy;
create policy "public read published" on affiliate_academy for select using (status = 'Published');

insert into affiliate_academy (id, data, status) values
  ('aff_1', '{"id":"aff_1","title":"Affiliate Marketing là gì","slug":"affiliate-la-gi","shortDescription":"Khái niệm cơ bản về Affiliate.","content":"","category":"Nhập môn","level":"Cơ bản","duration":"15 phút","tier":"Free","status":"Published","order":1}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== personal_brand =====
create table if not exists personal_brand (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table personal_brand enable row level security;
drop policy if exists "public read published" on personal_brand;
create policy "public read published" on personal_brand for select using (status = 'Published');

insert into personal_brand (id, data, status) values
  ('pb_1', '{"id":"pb_1","title":"Xây thương hiệu cá nhân từ con số 0","slug":"thuong-hieu-ca-nhan","shortDescription":"Lộ trình xây kênh cá nhân.","content":"","category":"Nhập môn","level":"Cơ bản","duration":"20 phút","tier":"Free","status":"Published","order":1}'::jsonb, 'Published')
on conflict (id) do nothing;

