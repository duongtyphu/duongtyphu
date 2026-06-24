-- Phase 3 migration: 10 Portal Builder / Roadmap config tables
-- Run this whole script once in the Supabase SQL Editor.

-- ===== portal_banners =====
create table if not exists portal_banners (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table portal_banners enable row level security;
drop policy if exists "public read published" on portal_banners;
create policy "public read published" on portal_banners for select using (status in ('Published', 'Active'));

insert into portal_banners (id, data, status) values
  ('banner_1', '{"id":"banner_1","message":"Chào mừng các học viên đến với các khoá học tại V-Academy! Chúc các bạn tiếp thu được tất cả kiến thức.","icon":"🔔","link":"/portal/vdai-academy","type":"Info","status":"Active"}'::jsonb, 'Active')
on conflict (id) do nothing;

-- ===== portal_cta =====
create table if not exists portal_cta (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table portal_cta enable row level security;
drop policy if exists "public read published" on portal_cta;
create policy "public read published" on portal_cta for select using (status in ('Published', 'Active'));

insert into portal_cta (id, data, status) values
  ('cta_1', '{"id":"cta_1","text":"Xem lộ trình của tôi","href":"/portal/roadmap","type":"Primary","buttonStyle":"Pill","location":"Dashboard","status":"Active"}'::jsonb, 'Active'),
  ('cta_2', '{"id":"cta_2","text":"Xem Affiliate Hub","href":"/portal/affiliate-hub","type":"Secondary","buttonStyle":"Pill","location":"Dashboard","status":"Active"}'::jsonb, 'Active')
on conflict (id) do nothing;

-- ===== portal_featured =====
create table if not exists portal_featured (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table portal_featured enable row level security;
drop policy if exists "public read published" on portal_featured;
create policy "public read published" on portal_featured for select using (status in ('Published', 'Active'));

insert into portal_featured (id, data, status) values
  ('feat_1', '{"id":"feat_1","title":"ChatGPT","type":"Công cụ","relatedItem":"chatgpt","priority":1,"status":"Published"}'::jsonb, 'Published'),
  ('feat_2', '{"id":"feat_2","title":"Prompt viết content viral","type":"Prompt","relatedItem":"viral-content","priority":2,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== today_action_cards =====
create table if not exists today_action_cards (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table today_action_cards enable row level security;
drop policy if exists "public read published" on today_action_cards;
create policy "public read published" on today_action_cards for select using (status in ('Published', 'Active'));

insert into today_action_cards (id, data, status) values
  ('today_1', '{"id":"today_1","title":"Học AI","description":"Bắt đầu với các bài học AI cơ bản và Prompt thực chiến.","icon":"🤖","gradient":"from-brand-blue/20 to-brand-blue/0","ctaText":"Khám phá ngay","ctaHref":"/portal/ai-academy","order":1,"featured":true,"status":"Published"}'::jsonb, 'Published'),
  ('today_2', '{"id":"today_2","title":"Làm Affiliate","description":"Tìm lộ trình, công cụ và sản phẩm phù hợp để bắt đầu tiếp thị liên kết.","icon":"🤝","gradient":"from-brand-violet/20 to-brand-violet/0","ctaText":"Khám phá ngay","ctaHref":"/portal/affiliate-hub","order":2,"featured":true,"status":"Published"}'::jsonb, 'Published'),
  ('today_3', '{"id":"today_3","title":"Xây thương hiệu cá nhân","description":"Lên kế hoạch nội dung, xây hình ảnh cá nhân và phát triển cộng đồng.","icon":"👤","gradient":"from-brand-orange/20 to-brand-orange/0","ctaText":"Khám phá ngay","ctaHref":"/portal/personal-brand","order":3,"featured":false,"status":"Published"}'::jsonb, 'Published'),
  ('today_4', '{"id":"today_4","title":"Đầu tư tài sản số","description":"Khám phá DigiU, Blockchain, Crypto, Trading và tư duy tài sản số.","icon":"💎","gradient":"from-emerald-400/20 to-emerald-400/0","ctaText":"Khám phá ngay","ctaHref":"/portal/digital-assets","order":4,"featured":false,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== start_here_steps =====
create table if not exists start_here_steps (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table start_here_steps enable row level security;
drop policy if exists "public read published" on start_here_steps;
create policy "public read published" on start_here_steps for select using (status in ('Published', 'Active'));

insert into start_here_steps (id, data, status) values
  ('start_1', '{"id":"start_1","title":"Làm quen với AI","description":"Hiểu các công cụ AI phổ biến và cách viết prompt hiệu quả.","icon":"🤖","order":1,"relatedResource":"/portal/ai-academy","relatedTool":"chatgpt","ctaText":"Bắt đầu bước này","ctaHref":"/portal/ai-academy","status":"Published"}'::jsonb, 'Published'),
  ('start_2', '{"id":"start_2","title":"Học cách dùng Prompt","description":"Khai thác thư viện Prompt để áp dụng AI vào công việc hàng ngày.","icon":"✨","order":2,"relatedResource":"/portal/prompts","relatedTool":"claude","ctaText":"Bắt đầu bước này","ctaHref":"/portal/prompts","status":"Published"}'::jsonb, 'Published'),
  ('start_3', '{"id":"start_3","title":"Xây nội dung và thương hiệu cá nhân","description":"Lên kế hoạch nội dung, định vị và xây hình ảnh cá nhân nhất quán.","icon":"👤","order":3,"relatedResource":"/portal/personal-brand","relatedTool":"canva","ctaText":"Bắt đầu bước này","ctaHref":"/portal/personal-brand","status":"Published"}'::jsonb, 'Published'),
  ('start_4', '{"id":"start_4","title":"Bắt đầu Affiliate Marketing","description":"Chọn ngách, chọn sản phẩm phù hợp và xây hệ thống Affiliate đầu tiên.","icon":"🤝","order":4,"relatedResource":"/portal/affiliate-hub","relatedTool":"hostinger","ctaText":"Bắt đầu bước này","ctaHref":"/portal/affiliate-hub","status":"Published"}'::jsonb, 'Published'),
  ('start_5', '{"id":"start_5","title":"Tạo sản phẩm số và tài sản số","description":"Đóng gói kiến thức thành sản phẩm số, tích lũy tài sản số dài hạn.","icon":"💎","order":5,"relatedResource":"/portal/premium","relatedTool":"","ctaText":"Bắt đầu bước này","ctaHref":"/portal/premium","status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== user_goals =====
create table if not exists user_goals (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table user_goals enable row level security;
drop policy if exists "public read published" on user_goals;
create policy "public read published" on user_goals for select using (status in ('Published', 'Active'));

insert into user_goals (id, data, status) values
  ('goal_1', '{"id":"goal_1","goalKey":"ai","label":"Học AI","description":"Bắt đầu với Học viện AI và Prompt thực chiến.","icon":"🤖","suggestionText":"Bắt đầu với Học viện AI và Prompt thực chiến.","suggestedRoute":"/portal/ai-academy","relatedTool":"chatgpt","order":1,"status":"Published"}'::jsonb, 'Published'),
  ('goal_2', '{"id":"goal_2","goalKey":"affiliate","label":"Làm Affiliate","description":"Vào Affiliate Hub để chọn ngách và sản phẩm phù hợp.","icon":"🤝","suggestionText":"Vào Affiliate Hub để chọn ngách và sản phẩm phù hợp.","suggestedRoute":"/portal/affiliate-hub","order":2,"status":"Published"}'::jsonb, 'Published'),
  ('goal_3', '{"id":"goal_3","goalKey":"brand","label":"Xây thương hiệu cá nhân","description":"Lên kế hoạch nội dung và xây hình ảnh cá nhân.","icon":"👤","suggestionText":"Lên kế hoạch nội dung và xây hình ảnh cá nhân.","suggestedRoute":"/portal/personal-brand","relatedTool":"canva","order":3,"status":"Published"}'::jsonb, 'Published'),
  ('goal_4', '{"id":"goal_4","goalKey":"product","label":"Tạo sản phẩm số","description":"Khám phá Sản phẩm số để đóng gói kiến thức của bạn.","icon":"📦","suggestionText":"Khám phá Sản phẩm số để đóng gói kiến thức của bạn.","suggestedRoute":"/portal/premium","order":4,"status":"Published"}'::jsonb, 'Published'),
  ('goal_5', '{"id":"goal_5","goalKey":"assets","label":"Đầu tư tài sản số","description":"Tìm hiểu DigiU, Blockchain, Crypto, Trading.","icon":"💎","suggestionText":"Tìm hiểu DigiU, Blockchain, Crypto, Trading.","suggestedRoute":"/portal/digital-assets","order":5,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== roadmap_steps =====
create table if not exists roadmap_steps (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table roadmap_steps enable row level security;
drop policy if exists "public read published" on roadmap_steps;
create policy "public read published" on roadmap_steps for select using (status in ('Published', 'Active'));

insert into roadmap_steps (id, data, status) values
  ('step_1', '{"id":"step_1","title":"Làm quen AI","description":"Hiểu AI là gì và ứng dụng vào công việc.","icon":"🤖","order":1,"status":"Published"}'::jsonb, 'Published'),
  ('step_2', '{"id":"step_2","title":"Sử dụng Prompt","description":"Khai thác thư viện Prompt AI hiệu quả.","icon":"✨","order":2,"status":"Published"}'::jsonb, 'Published'),
  ('step_3', '{"id":"step_3","title":"Xây nội dung","description":"Tạo nội dung chất lượng bằng AI.","icon":"📝","order":3,"status":"Published"}'::jsonb, 'Published'),
  ('step_4', '{"id":"step_4","title":"Xây thương hiệu cá nhân","description":"Phát triển thương hiệu cá nhân trên social.","icon":"👤","order":4,"status":"Published"}'::jsonb, 'Published'),
  ('step_5', '{"id":"step_5","title":"Affiliate Marketing","description":"Bắt đầu kiếm tiền với Affiliate.","icon":"🤝","order":5,"status":"Published"}'::jsonb, 'Published'),
  ('step_6', '{"id":"step_6","title":"Tạo sản phẩm số","description":"Xây sản phẩm số đầu tiên của bạn.","icon":"📦","order":6,"status":"Published"}'::jsonb, 'Published'),
  ('step_7', '{"id":"step_7","title":"Tạo tài sản số","description":"Tích lũy tài sản số dài hạn.","icon":"💎","order":7,"status":"Draft"}'::jsonb, 'Draft'),
  ('step_8', '{"id":"step_8","title":"Mở rộng hệ sinh thái","description":"Scale hệ thống và đội nhóm.","icon":"🚀","order":8,"status":"Draft"}'::jsonb, 'Draft')
on conflict (id) do nothing;

-- ===== daily_missions =====
create table if not exists daily_missions (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table daily_missions enable row level security;
drop policy if exists "public read published" on daily_missions;
create policy "public read published" on daily_missions for select using (status in ('Published', 'Active'));

insert into daily_missions (id, data, status) values
  ('mission_1', '{"id":"mission_1","title":"Đọc 1 bài trong Học viện AI hoặc Affiliate","description":"Mở rộng kiến thức mỗi ngày.","taskType":"Học","points":10,"link":"/portal/ai-academy","status":"Active","repeatsDaily":true,"order":1}'::jsonb, 'Active'),
  ('mission_2', '{"id":"mission_2","title":"Copy 1 prompt và áp dụng ngay vào công việc","description":"Thực hành với Prompt AI.","taskType":"Copy Prompt","points":10,"link":"/portal/prompts","status":"Active","repeatsDaily":true,"order":2}'::jsonb, 'Active'),
  ('mission_3', '{"id":"mission_3","title":"Xem lại bước hiện tại trong Lộ trình thành công","description":"Theo dõi tiến độ lộ trình.","taskType":"Hoàn thành bài học","points":5,"link":"/portal/roadmap","status":"Active","repeatsDaily":true,"order":3}'::jsonb, 'Active')
on conflict (id) do nothing;

-- ===== affiliate_hub_sections =====
create table if not exists affiliate_hub_sections (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table affiliate_hub_sections enable row level security;
drop policy if exists "public read published" on affiliate_hub_sections;
create policy "public read published" on affiliate_hub_sections for select using (status in ('Published', 'Active'));

insert into affiliate_hub_sections (id, data, status) values
  ('ahub_1', '{"id":"ahub_1","key":"start","title":"Bắt đầu Affiliate","description":"Affiliate Marketing là gì, lộ trình cho người mới, sai lầm cần tránh.","icon":"🚀","relatedResource":"/portal/start-here","ctaText":"Xem lộ trình","ctaHref":"/portal/start-here","order":1,"status":"Published"}'::jsonb, 'Published'),
  ('ahub_2', '{"id":"ahub_2","key":"niche","title":"Chọn ngách","description":"Cách chọn ngách bằng AI, checklist chọn ngách, prompt nghiên cứu thị trường.","icon":"🎯","relatedPrompt":"prompt_2","ctaText":"Mở Thư viện Prompt","ctaHref":"/portal/prompts","order":2,"status":"Published"}'::jsonb, 'Published'),
  ('ahub_3', '{"id":"ahub_3","key":"product","title":"Chọn sản phẩm","description":"Tiêu chí chọn sản phẩm, sản phẩm đề xuất, công cụ nên dùng.","icon":"🛒","ctaText":"Xem công cụ","ctaHref":"/portal/tools","order":3,"status":"Published"}'::jsonb, 'Published'),
  ('ahub_4', '{"id":"ahub_4","key":"content","title":"Xây nội dung","description":"Kế hoạch nội dung 30 ngày, prompt viết bài, template review sản phẩm.","icon":"📝","relatedResource":"/portal/templates","ctaText":"Xem Template","ctaHref":"/portal/templates","order":4,"status":"Published"}'::jsonb, 'Published'),
  ('ahub_5', '{"id":"ahub_5","key":"tools","title":"Công cụ Affiliate","description":"Hosting, AI Tools, Email marketing, Landing page, Automation.","icon":"🧰","ctaText":"Xem Thư viện công cụ","ctaHref":"/portal/tools","order":5,"status":"Published"}'::jsonb, 'Published'),
  ('ahub_6', '{"id":"ahub_6","key":"case-study","title":"Case Study","description":"Cách xây một phễu Affiliate, workflow thực tế.","icon":"📊","ctaText":"Xem Case Study","ctaHref":"/portal/case-studies","order":6,"status":"Published"}'::jsonb, 'Published'),
  ('ahub_7', '{"id":"ahub_7","key":"top-products","title":"Top sản phẩm tháng này","description":"Sản phẩm Affiliate nổi bật tháng này — xem hướng dẫn và dùng thử.","icon":"🏆","ctaText":"Xem hướng dẫn","ctaHref":"/portal/affiliate-hub","order":7,"status":"Published"}'::jsonb, 'Published')
on conflict (id) do nothing;

-- ===== affiliate_hub_top_products =====
create table if not exists affiliate_hub_top_products (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table affiliate_hub_top_products enable row level security;
drop policy if exists "public read published" on affiliate_hub_top_products;
create policy "public read published" on affiliate_hub_top_products for select using (status in ('Published', 'Active'));

insert into affiliate_hub_top_products (id, data, status) values
  ('ahubtop_1', '{"id":"ahubtop_1","productId":"affp_1","productName":"Hostinger","badge":"Recommended","order":1,"guideHref":"/portal/tools/hostinger","trialHref":"https://hostinger.com","status":"Active"}'::jsonb, 'Active')
on conflict (id) do nothing;

