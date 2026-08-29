-- Giai đoạn 5 (Premium 2.0, /v2/premium) — 3 bảng generic mới, cùng khuôn
-- id/data jsonb/status/order đã dùng xuyên suốt dự án. Founder yêu cầu
-- "Admin phải quản lý được tất cả các mục" ở Premium — 3 khối này KHÔNG
-- tồn tại admin-editable ở bất kỳ đâu (kể cả Portal 1.0: PremiumAdvisor/
-- FounderSpotlight đều tĩnh 100% trong code, xem live-premium.ts docblock),
-- nên phải tạo mới, không tái dùng bảng nào có sẵn.
--
-- KHÔNG đụng premium_chrome/premium_payment_steps/premium_faq (đã có sẵn,
-- admin-editable qua /admin/premium/dashboard từ trước) — /v2/premium tái
-- dùng NGUYÊN 2 bảng đó cho khối "Thanh toán hoạt động thế nào?", đúng
-- Single Source of Truth đã áp dụng cho toàn bộ /v2/du-an-co-hoi.

-- 1) Quyền lợi Premium — thay 2 mảng PERK_CARDS hardcode (guest "Vì sao nên
--    nâng cấp"/member "Quyền lợi dành riêng"), phân biệt qua field
--    "audience" trong data (không tách 2 bảng vì cùng shape/cùng mục đích).
create table if not exists premium_perks (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table premium_perks enable row level security;
drop policy if exists "premium_perks_public_select" on premium_perks;
create policy "premium_perks_public_select" on premium_perks
  for select using (status = 'Published');

-- 2) Cố vấn chọn gói ("KHÔNG CHẮC NÊN CHỌN GÌ?") — thay PremiumAdvisor's
--    SITUATIONS (1.0, nhắm 5 chương trình mua đứt cũ) bằng bộ tình huống
--    mới nhắm đúng 3 gói thuê bao thật của /v2/premium
--    (premium-thang/premium-6-thang/premium-12-thang, khớp id thật trong
--    premium_plans). targetPlanId rỗng = định tuyến sang Companion
--    (/v2/companion) thay vì 1 gói cụ thể — đúng hành vi "chưa chắc thì
--    đừng mua, trò chuyện trước" của bản gốc.
create table if not exists premium_advisor_situations (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table premium_advisor_situations enable row level security;
drop policy if exists "premium_advisor_situations_public_select" on premium_advisor_situations;
create policy "premium_advisor_situations_public_select" on premium_advisor_situations
  for select using (status = 'Published');

-- 3) Người đồng hành ("🤝 NGƯỜI ĐỒNG HÀNH") — singleton (1 dòng, id='founder'),
--    port NGUYÊN VĂN nội dung thật từ FounderSpotlight.tsx (1.0) — không bịa,
--    chỉ đưa nội dung đã công bố sẵn vào Admin để Founder tự sửa được.
create table if not exists premium_founder (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table premium_founder enable row level security;
drop policy if exists "premium_founder_public_select" on premium_founder;
create policy "premium_founder_public_select" on premium_founder
  for select using (status = 'Published');

-- Seed: premium_perks (8 guest + 8 member, đều gắn tính năng THẬT đã build
-- trong Portal 2.0 — không bịa số liệu/cam kết không kiểm chứng được).
insert into premium_perks (id, data, status, "order") values
  ('perk_guest_ckos', jsonb_build_object('audience','guest','icon','book','title','Trọn bộ Hệ tri thức AI (CKOS)','description','Toàn bộ Prompt, Workflow, Template, Tài liệu, Checklist và Case Study được tuyển chọn và cập nhật liên tục qua Admin.'), 'Published', 1),
  ('perk_guest_academy', jsonb_build_object('audience','guest','icon','graduation','title','Học viện AI — trọn lộ trình','description','Đầy đủ bài giảng slide theo nhu cầu, công cụ và nghề nghiệp, cùng lưới video bài giảng AI thật — không chỉ 3 bài xem thử.'), 'Published', 2),
  ('perk_guest_workspace', jsonb_build_object('audience','guest','icon','tool','title','AI Workspace không giới hạn','description','Mở khoá toàn bộ nhóm công cụ AI, workflow mẫu và dự án cá nhân — không còn giới hạn 1 workflow/tháng, 3 dự án như tài khoản Free.'), 'Published', 3),
  ('perk_guest_affiliate', jsonb_build_object('audience','guest','icon','handshake','title','Chương trình Affiliate — hoa hồng thật','description','Có ngay mã giới thiệu riêng, theo dõi hoa hồng và lịch sử thanh toán thật ngay khi trở thành Premium Member.'), 'Published', 4),
  ('perk_guest_companion', jsonb_build_object('audience','guest','icon','companion','title','Companion đồng hành sát hơn','description','Companion ghi nhớ tiến độ học thật của bạn và gợi ý đúng công cụ, đúng lúc — không phải trợ lý chung chung.'), 'Published', 5),
  ('perk_guest_community', jsonb_build_object('audience','guest','icon','community','title','Cộng đồng Premium chất lượng cao','description','Kết nối trực tiếp với những người cùng mục tiêu qua các kênh cộng đồng chính thức của VO DUONG AI.'), 'Published', 6),
  ('perk_guest_support', jsonb_build_object('audience','guest','icon','support','title','Ưu tiên hỗ trợ','description','Được ưu tiên phản hồi qua Companion và kênh Zalo chính thức trong suốt quá trình học.'), 'Published', 7),
  ('perk_guest_updates', jsonb_build_object('audience','guest','icon','update','title','Nội dung cập nhật liên tục','description','Đội ngũ VO DUONG AI liên tục bổ sung bài học, công cụ và tài liệu mới — Premium Member luôn có bản mới nhất.'), 'Published', 8),
  ('perk_member_ckos', jsonb_build_object('audience','member','icon','book','title','Hệ tri thức AI (CKOS) — đã mở khoá','description','Toàn bộ Prompt, Workflow, Template, Tài liệu, Checklist và Case Study đang sẵn sàng cho bạn, không giới hạn.'), 'Published', 1),
  ('perk_member_academy', jsonb_build_object('audience','member','icon','graduation','title','Học viện AI — full quyền truy cập','description','Toàn bộ lộ trình bài giảng slide và video đã mở khoá — tiến độ của bạn được Companion theo dõi thật.'), 'Published', 2),
  ('perk_member_workspace', jsonb_build_object('audience','member','icon','tool','title','AI Workspace không giới hạn','description','Tạo bao nhiêu dự án và mở bao nhiêu workflow tuỳ ý — giới hạn của tài khoản Free đã được gỡ bỏ.'), 'Published', 3),
  ('perk_member_affiliate', jsonb_build_object('audience','member','icon','handshake','title','Chương trình Affiliate đang hoạt động','description','Mã giới thiệu, hoa hồng và lịch sử thanh toán của bạn đang được ghi nhận thật ở Chương trình Affiliate.'), 'Published', 4),
  ('perk_member_companion', jsonb_build_object('audience','member','icon','companion','title','Companion đồng hành sát bạn','description','Companion nắm rõ tiến độ và mục tiêu học của bạn để gợi ý đúng bước tiếp theo.'), 'Published', 5),
  ('perk_member_community', jsonb_build_object('audience','member','icon','community','title','Cộng đồng Premium','description','Bạn đang là thành viên của cộng đồng Premium chất lượng cao — kết nối qua các kênh chính thức bên dưới.'), 'Published', 6),
  ('perk_member_support', jsonb_build_object('audience','member','icon','support','title','Hỗ trợ ưu tiên','description','Bạn được ưu tiên phản hồi qua Companion và kênh Zalo chính thức bất cứ khi nào cần.'), 'Published', 7),
  ('perk_member_updates', jsonb_build_object('audience','member','icon','update','title','Luôn nhận nội dung mới nhất','description','Mọi bài học, công cụ và tài liệu mới được thêm vào Portal đều tự động nằm trong quyền truy cập của bạn.'), 'Published', 8)
on conflict (id) do nothing;

-- Seed: premium_advisor_situations (đúng 3 gói thuê bao thật + 1 tình
-- huống "chưa chắc" định tuyến sang Companion, targetPlanId rỗng).
insert into premium_advisor_situations (id, data, status, "order") values
  ('adv_try_first', jsonb_build_object('label','Tôi muốn dùng thử trước khi cam kết dài','recommendation','Bắt đầu với Gói Tháng — trải nghiệm trọn vẹn Premium trong 30 ngày, không cần cam kết dài hạn ngay từ đầu.','targetPlanId','premium-thang','targetLabel','Xem Gói Tháng'), 'Published', 1),
  ('adv_serious', jsonb_build_object('label','Tôi học nghiêm túc và muốn tiết kiệm hơn','recommendation','Gói 6 Tháng là lựa chọn cân bằng nhất — đủ thời gian để đi hết một lộ trình thật, chi phí thấp hơn hẳn so với mua từng tháng.','targetPlanId','premium-6-thang','targetLabel','Xem Gói 6 Tháng'), 'Published', 2),
  ('adv_commit', jsonb_build_object('label','Tôi muốn cam kết trọn vẹn và tiết kiệm tối đa','recommendation','Gói 12 Tháng phù hợp khi bạn đã sẵn sàng đi đường dài — mức tiết kiệm cao nhất trong 3 gói.','targetPlanId','premium-12-thang','targetLabel','Xem Gói 12 Tháng'), 'Published', 3),
  ('adv_tool', jsonb_build_object('label','Tôi muốn thực hành công cụ AI cụ thể ngay','recommendation','AI Workspace không giới hạn đã có trong mọi gói Premium — Gói Tháng là cách nhanh nhất để bắt đầu thực hành ngay hôm nay.','targetPlanId','premium-thang','targetLabel','Xem Gói Tháng'), 'Published', 4),
  ('adv_affiliate', jsonb_build_object('label','Tôi muốn xây hệ thống Affiliate bằng AI','recommendation','Xây một hệ thống Affiliate cần thời gian để thấy kết quả — Gói 6 Tháng cho bạn đủ thời gian triển khai và tối ưu.','targetPlanId','premium-6-thang','targetLabel','Xem Gói 6 Tháng'), 'Published', 5),
  ('adv_unsure', jsonb_build_object('label','Tôi chưa chắc mình cần Premium','recommendation','Không sao cả — chưa chắc là một câu trả lời tốt. Đừng mua khi chưa rõ, hãy trò chuyện trực tiếp với Companion để xác định đúng nhu cầu trước.','targetPlanId','','targetLabel','Trò chuyện với Companion'), 'Published', 6)
on conflict (id) do nothing;

-- Seed: premium_founder (1 dòng, port nguyên văn FounderSpotlight.tsx 1.0).
insert into premium_founder (id, data, status, "order") values
  ('founder', jsonb_build_object(
    'name', 'Võ Đương',
    'role', 'Nhà sáng lập VO DUONG AI',
    'photoUrl', '/images/founder-portrait.jpg',
    'tags', jsonb_build_array('AI ứng dụng','Affiliate Marketing','Automation','AI Strategy','Phát triển hệ thống'),
    'intro', 'Võ Đương là nhà sáng lập VO DUONG AI — nhà đầu tư và người ứng dụng AI thực chiến trong kinh doanh số. Với nền tảng thực chiến trong Affiliate Marketing và xây dựng hệ thống tự động hóa, anh xây VO DUONG AI thành một hệ sinh thái có lộ trình rõ ràng thay vì những thông tin rời rạc.',
    'expertise', jsonb_build_array('Ứng dụng AI trong kinh doanh số và Affiliate Marketing','Xây dựng hệ thống tự động hóa quy trình vận hành','Phát triển kênh nội dung và chiến lược phân phối'),
    'philosophy', 'Học AI không phải để biết — mà để làm được ngay. Mỗi buổi học là một kết quả thực tế.',
    'achievements', jsonb_build_array('Sáng lập và trực tiếp xây dựng hệ sinh thái VO DUONG AI: Portal, Companion, hệ tri thức CKOS và các chương trình đào tạo.','Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam.','Nhiều năm đầu tư và vận hành hệ thống Affiliate/tài sản số bằng AI — nội dung giảng dạy lấy từ chính trải nghiệm này.')
  ), 'Published', 1)
on conflict (id) do nothing;
