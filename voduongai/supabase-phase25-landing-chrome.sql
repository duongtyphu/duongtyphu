-- Phase 25: Landing Page CMS — bảng landing_chrome
-- Quản lý nội dung Admin cho trang chủ marketing công khai (src/app/page.tsx
-- + src/components/home/**), theo yêu cầu Founder "Xây Quản lý Landing Page".
--
-- Phạm vi CHỈ field text an toàn (eyebrow badge/tiêu đề/mô tả/CTA label) của
-- 8 section — KHÔNG đụng: các mảng ITEMS/STEPS/FEATURES/VALUES/LIST gắn
-- icon cố định (số lượng + icon PNG dùng chung, sửa tự do có rủi ro lệch
-- layout), toàn bộ QuizAssessment (QUESTIONS/LEVELS có logic tính điểm phía
-- sau, số câu trả lời gắn với công thức chấm điểm), danh sách `tools` (dữ
-- liệu dùng chung `@/data/tools`, ngoài phạm vi landing riêng), ảnh
-- founder.png (không có hạ tầng upload). href của mọi CTA giữ nguyên
-- hardcode `/login` trong code — không cho sửa link nội bộ qua Admin để
-- tránh tạo link chết.
--
-- id mỗi dòng = tên section (ổn định, khớp thứ tự hiển thị thật trong
-- HomeClient.tsx): hero, ecosystem-pillars, portal-preview, skills-showcase,
-- tools-i-use, trust-stats, ecosystem, final-cta.

create table if not exists landing_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table landing_chrome enable row level security;
drop policy if exists "public read published" on landing_chrome;
create policy "public read published" on landing_chrome for select using (status = 'Published');

insert into landing_chrome (id, data, status, "order") values
  ('hero', jsonb_build_object(
    'eyebrowBadge', 'Thương hiệu cá nhân · Hệ sinh thái AI',
    'headlineLine1', 'Học AI đúng hướng.',
    'headlineLine2', 'Xây hệ thống vững chắc.',
    'headlineHighlight', 'Tạo tài sản số bền vững.',
    'subheadline', 'VO DUONG AI là hệ sinh thái học tập AI giúp bạn học đúng, thực hành đúng và từng bước xây dựng hệ thống làm việc, thương hiệu cá nhân và tài sản số bền vững trong kỷ nguyên trí tuệ nhân tạo.',
    'ctaLabel', 'Bắt đầu ngay hôm nay',
    'tagline', 'Miễn phí tham gia • Học mọi lúc • Đồng hành cùng Companion AI'
  ), 'Published', 1),

  ('ecosystem-pillars', jsonb_build_object(
    'eyebrowBadge', '🌐 Hệ sinh thái',
    'heading', 'Tất cả những gì bạn cần, trong một hệ sinh thái',
    'roadmapHeading', 'Lộ trình học tập dành cho mọi người',
    'roadmapDesc', 'Dù bạn là người mới bắt đầu hay đã có kinh nghiệm, chúng tôi có lộ trình phù hợp để bạn tiến xa hơn mỗi ngày.',
    'roadmapCtaLabel', 'Xem tất cả lộ trình'
  ), 'Published', 2),

  ('portal-preview', jsonb_build_object(
    'eyebrowBadge', '🧭 Khám phá Học Viện',
    'heading', 'Nền tảng toàn diện, trải nghiệm liền mạch',
    'ctaLabel', 'Khám phá nền tảng'
  ), 'Published', 3),

  ('skills-showcase', jsonb_build_object(
    'eyebrowBadge', '🎯 10 Kỹ năng AI cần có',
    'heading', 'Những kỹ năng thiết yếu giúp bạn tạo lợi thế cạnh tranh trong kỷ nguyên AI.',
    'youtubeId', 'zH5IvC-A6iI'
  ), 'Published', 4),

  ('tools-i-use', jsonb_build_object(
    'eyebrowBadge', '🛠️ Thực chiến',
    'heading', 'Những công cụ tôi thực sự đang dùng'
  ), 'Published', 5),

  ('trust-stats', jsonb_build_object(
    'eyebrowBadge', '🌐 Cộng đồng',
    'heading', 'Hệ sinh thái dành cho người Việt',
    'description', 'Kết nối tri thức, công cụ, cơ hội và cộng đồng để cùng nhau phát triển và tạo ra tác động tích cực.'
  ), 'Published', 6),

  ('ecosystem', jsonb_build_object(
    'eyebrowBadge', 'Hệ sinh thái của tôi',
    'founderQuote', 'AI không thay thế bạn, nhưng những người biết sử dụng AI sẽ thay thế bạn',
    'founderQuoteAttribution', '— Võ Đương',
    'founderBioParagraph1', 'Tôi là một nhà đầu tư vào các dự án công nghệ, tôi tin rằng AI sẽ là một trong những kỹ năng sống còn trong thế kỷ 21. Tôi xây dựng VO DUONG AI như một hệ sinh thái cá nhân nơi tập hợp những kiến thức, tài liệu, công cụ và bao gồm những kinh nghiệm mà chính tôi đã từng trải nghiệm mỗi ngày trong công việc và sự nghiệp.',
    'founderBioParagraph2', 'Mục tiêu của tôi rất đơn giản: giúp bạn tiếp cận với AI nhanh hơn, dễ hiểu hơn, xây dựng hệ thống online bền vững và từng bước tạo ra tài sản số cho tương lai.',
    'founderTitle', 'Nhà sáng lập VÕ ĐƯƠNG AI'
  ), 'Published', 7),

  ('final-cta', jsonb_build_object(
    'heading', 'Bắt đầu hành trình chinh phục các kỹ năng AI của bạn ngay hôm nay.',
    'ctaLabel', 'Bắt đầu ngay hôm nay'
  ), 'Published', 8)
on conflict (id) do nothing;
