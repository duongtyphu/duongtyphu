-- Premium — Dashboard Live-edit (theo yêu cầu riêng của Founder). CHỈ
-- tách phần chữ tĩnh an toàn của /portal/premium: Hero (eyebrow/title 2
-- dòng/subtitle), 2 nhãn section (Lớp học AI / Chương trình hệ thống), 4
-- bước thanh toán, 4 câu FAQ.
--
-- KHÔNG đụng: `/admin/course-pricing` (bảng `courses`, giá + trạng thái mở
-- bán — giữ nguyên không thay đổi theo đúng yêu cầu), PREMIUM_PROGRAMS
-- (5 chương trình, có icon/accent màu — rủi ro giống ecosystems.ts, không
-- đụng), PremiumAdvisor (6 tình huống, targetHref gắn anchor thật),
-- PremiumConsult (số điện thoại/Zalo), FounderSpotlight (hồ sơ Founder).

create table if not exists premium_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table premium_chrome enable row level security;

drop policy if exists "premium_chrome_public_select" on premium_chrome;
create policy "premium_chrome_public_select" on premium_chrome
  for select using (status = 'Published');

insert into premium_chrome (id, data, status, "order") values (
  'premium',
  jsonb_build_object(
    'heroEyebrow', 'Premium — Bước tăng tốc khi bạn đã sẵn sàng',
    'heroTitleLine1', 'Premium không dành cho việc học nhiều hơn.',
    'heroTitleLine2', 'Premium dành cho lúc bạn muốn biến AI thành năng lực thật sự.',
    'heroSubtitle', 'Không phải mua thêm một chồng bài giảng. Đây là nơi bạn chọn đúng một lộ trình — và đi hết nó với người đồng hành thật.',
    'classSectionEyebrow', 'Lớp học AI',
    'classSectionTitle', 'Ba lớp học — ba cấp độ năng lực',
    'systemSectionEyebrow', 'Chương trình hệ thống',
    'systemSectionTitle', 'Xây hệ thống Affiliate bằng AI — một mình hoặc cùng đội nhóm',
    'paymentSectionTitle', 'Thanh toán hoạt động thế nào',
    'faqSectionTitle', 'Câu hỏi thường gặp'
  ),
  'Published',
  0
)
on conflict (id) do nothing;

create table if not exists premium_payment_steps (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table premium_payment_steps enable row level security;

drop policy if exists "premium_payment_steps_public_select" on premium_payment_steps;
create policy "premium_payment_steps_public_select" on premium_payment_steps
  for select using (status = 'Published');

insert into premium_payment_steps (id, data, status, "order") values
  ('step_1', jsonb_build_object('step', '1', 'title', 'Chọn chương trình', 'text', 'Bấm CTA đăng ký trên card — bạn được đưa tới trang thanh toán với đúng chương trình đã chọn.'), 'Published', 1),
  ('step_2', jsonb_build_object('step', '2', 'title', 'Xác nhận thông tin', 'text', 'Điền họ tên, số điện thoại và xác nhận đơn hàng (giá được hệ thống kiểm tra lại phía máy chủ).'), 'Published', 2),
  ('step_3', jsonb_build_object('step', '3', 'title', 'Chuyển khoản', 'text', 'Chuyển khoản theo hướng dẫn ở trang đơn hàng — hệ thống tự động ghi nhận thanh toán.'), 'Published', 3),
  ('step_4', jsonb_build_object('step', '4', 'title', 'Mở khóa tự động', 'text', 'Ngay khi thanh toán được xác nhận, bài giảng video của chương trình được mở khóa trong tài khoản của bạn.'), 'Published', 4)
on conflict (id) do nothing;

create table if not exists premium_faq (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table premium_faq enable row level security;

drop policy if exists "premium_faq_public_select" on premium_faq;
create policy "premium_faq_public_select" on premium_faq
  for select using (status = 'Published');

insert into premium_faq (id, data, status, "order") values
  ('faq_1', jsonb_build_object('q', 'Premium khác phần miễn phí ở đâu?', 'a', 'Phần miễn phí giúp bạn hiểu và thử. Premium là các chương trình có lộ trình, bài giảng video và kết quả đầu ra cụ thể — dành cho lúc bạn muốn biến AI thành năng lực làm việc thật sự, không chỉ kiến thức.'), 'Published', 1),
  ('faq_2', jsonb_build_object('q', 'Thanh toán xong bao lâu thì được học?', 'a', 'Hệ thống ghi nhận chuyển khoản tự động. Ngay khi thanh toán được xác nhận, bài giảng của chương trình bạn mua được mở khóa trong mục Sản phẩm của tôi — không cần chờ duyệt tay.'), 'Published', 2),
  ('faq_3', jsonb_build_object('q', 'Tôi chưa chắc nên chọn chương trình nào?', 'a', 'Đừng chọn khi chưa chắc. Dùng Companion Advisor ở đầu trang để định vị giai đoạn của bạn, hoặc liên hệ Tư vấn 1:1 — trao đổi trước, quyết định sau.'), 'Published', 3),
  ('faq_4', jsonb_build_object('q', 'Chính sách hoàn phí thế nào?', 'a', 'Điều khoản sử dụng, chính sách bảo mật và chính sách hoàn phí được hiển thị ngay tại bước thanh toán — bạn nên đọc trước khi xác nhận đơn hàng.'), 'Published', 4)
on conflict (id) do nothing;
