-- Phase 6 migration: 3 bảng mới cho Admin rebuild — home_cards, projects,
-- founder_profile. Cùng khuôn generic (id/data jsonb/status/order) như
-- Phase 2-5, để tái dùng nguyên API /api/admin/collections/[table].
--
-- LƯU Ý: migration này CHỈ tạo bảng + đổ dữ liệu migrate nguyên trạng từ
-- code hardcode hiện tại. Component đọc dữ liệu (portal/page.tsx,
-- duan-cohoi/page.tsx, FounderStory.tsx, FounderSpotlight.tsx,
-- CommunityGuides.tsx) CHƯA được sửa để đọc từ bảng này — vẫn đọc hardcode
-- như cũ cho tới khi có thay đổi code riêng.
--
-- founder_profile: theo quyết định "giữ 2 ảnh founder riêng theo ngữ cảnh"
-- (không gộp về 1 ảnh) — photoUrlLanding = /founder.png (Landing page),
-- photoUrlDefault = /images/founder-portrait.jpg (Premium + Cộng đồng, xác
-- nhận CommunityGuides.tsx dùng đúng ảnh này, không phải ảnh thứ 3).
--
-- Run this whole script once in the Supabase SQL Editor.

-- ===== home_cards =====
-- Thay 7 PillarEntranceCard hardcode trong src/app/portal/page.tsx (dòng
-- 122-201). "order" cột ngoài = thứ tự hiển thị JSX gốc (1-7).
create table if not exists home_cards (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table home_cards enable row level security;
drop policy if exists "public read published" on home_cards;
create policy "public read published" on home_cards for select using (status = 'Published');

insert into home_cards (id, data, status, "order") values
  ('card_ckos', '{"id":"card_ckos","icon":"brain","accent":"violet","title":"Hệ tri thức AI (CKOS)","description":"Tool, Prompt, Quy trình và Bài học được kết nối với nhau — không phải một thư viện tĩnh để lướt qua.","href":"/portal/ckos","startedMode":"module","module":"ckos","companionLine":"Thử tìm một Tool hoặc Prompt cho đúng việc bạn đang làm hôm nay.","ctaLabel":"Mở Hệ tri thức AI (CKOS)","status":"Published"}'::jsonb, 'Published', 1),
  ('card_academy', '{"id":"card_academy","icon":"graduation-cap","accent":"blue","title":"Học viện AI","description":"Biến tri thức thành năng lực qua thực hành thật — không phải một danh sách bài học để đọc hết.","href":"/portal/hocvienai","startedMode":"module","module":"academy","companionLine":"Chọn một hành trình, làm đúng một bước hôm nay, rồi dừng lại.","ctaLabel":"Vào Học viện","status":"Published"}'::jsonb, 'Published', 2),
  ('card_aiworkspace', '{"id":"card_aiworkspace","icon":"cpu","accent":"slate","title":"AI Workspace","description":"Nơi một ý tưởng trở thành một Output thật — bản nháp, kế hoạch, kết quả dùng được ngay.","href":"/portal/aiworkspace","startedMode":"module","module":"khong-gian-ai","companionLine":"Mang theo một việc cụ thể — không cần chuẩn bị gì thêm.","ctaLabel":"Mở AI Workspace","status":"Published"}'::jsonb, 'Published', 3),
  ('card_duan_cohoi', '{"id":"card_duan_cohoi","icon":"line-chart","accent":"emerald","title":"Dự án & Cơ hội","description":"Trung tâm cơ hội giúp bạn quyết định đúng — không phải một trang bán hàng.","href":"/portal/duan-cohoi","startedMode":"module","module":"opportunities","companionLine":"Đọc Tiêu chí chia sẻ trước khi xem bất kỳ dự án nào.","ctaLabel":"Xem Dự án & Cơ hội","status":"Published"}'::jsonb, 'Published', 4),
  ('card_premium', '{"id":"card_premium","icon":"crown","accent":"amber","title":"Premium","description":"Giai đoạn tiếp theo khi bạn đã sẵn sàng đi xa hơn — không phải một quảng cáo nâng cấp.","href":"/portal/premium","startedMode":null,"module":null,"companionLine":"Học thử miễn phí trước — Premium sẽ vẫn ở đây khi bạn thấy cách làm việc phù hợp.","companionLineOwned":"Chỉ nâng cấp khi thực sự cần nhân bản hoặc chuyển giao cho người khác.","ctaLabel":"Xem Premium","status":"Published"}'::jsonb, 'Published', 5),
  ('card_hanhtrinh', '{"id":"card_hanhtrinh","icon":"compass","accent":"teal","title":"Hành trình của tôi","description":"Nơi nhìn lại những gì thật sự đã xảy ra — không phải điểm số hay % ước lượng.","href":"/portal/hanhtrinhcuatoi","startedMode":"aggregate","module":null,"companionLine":"Ghé qua khi bạn muốn biết mình đã thực sự đi được bao xa, không chỉ đang làm gì hôm nay.","ctaLabel":"Xem hành trình","status":"Published"}'::jsonb, 'Published', 6),
  ('card_companion', '{"id":"card_companion","icon":"heart-handshake","accent":"rose","title":"Companion","description":"Không phải chatbot — một sự hiện diện, nhớ những gì thật sự đã xảy ra với bạn.","href":"/portal/companion","startedMode":"recent","module":null,"companionLine":"Ghé qua khi bạn cần một khoảng lặng, không chỉ khi cần câu trả lời.","ctaLabel":"Mở Companion","status":"Published"}'::jsonb, 'Published', 7)
on conflict (id) do nothing;

-- ===== projects =====
-- Thay `const ECOSYSTEMS` hardcode trong src/app/portal/duan-cohoi/page.tsx.
-- LƯU Ý: `statusLabel` trong data (vd "Đang theo dõi") KHÁC với cột ngoài
-- `status` (Draft/Published — trạng thái xuất bản) — không nhầm 2 khái niệm.
create table if not exists projects (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table projects enable row level security;
drop policy if exists "public read published" on projects;
create policy "public read published" on projects for select using (status = 'Published');

insert into projects (id, data, status, "order") values
  ('proj_digiu', '{"id":"proj_digiu","key":"digiu","icon":"layers","name":"Hệ sinh thái DigiU","description":"Nền tảng học và kiếm thu nhập số — mình đang đồng hành và chia sẻ trải nghiệm thực tế.","href":"/portal/duan-cohoi/digiu","statusLabel":"Đang theo dõi","fitCriteria":"Người mới muốn bắt đầu kiếm thu nhập số, chấp nhận vài tháng đầu chưa có kết quả rõ ràng.","avoidCriteria":"Người cần thu nhập ngay lập tức, hoặc chưa từng dùng công cụ AI cơ bản nào.","expectation":"Kỹ năng vận hành một kênh nội dung số bằng AI — không phải cam kết thu nhập cụ thể."}'::jsonb, 'Published', 1),
  ('proj_solargroup', '{"id":"proj_solargroup","key":"solargroup","icon":"building-2","name":"SolarGroup","description":"Cơ hội đầu tư cổ phần dài hạn — mình đang nghiên cứu và chia sẻ góc nhìn cá nhân.","href":"/portal/duan-cohoi/solargroup","statusLabel":"Đang nghiên cứu","fitCriteria":"Người có vốn nhàn rỗi thật sự sẵn sàng để lâu dài, chấp nhận không rút được ngay khi cần.","avoidCriteria":"Người cần thanh khoản ngắn hạn, hoặc chưa từng đọc một bản cáo bạch/whitepaper đầu tư nào.","expectation":"Hiểu rõ hơn cách một mô hình cổ phần dài hạn vận hành — không phải cam kết lợi nhuận."}'::jsonb, 'Published', 2),
  ('proj_crypto', '{"id":"proj_crypto","key":"crypto","icon":"bitcoin","name":"Blockchain & Crypto","description":"Kiến thức nền tảng về hai mảng Blockchain và Crypto — bao gồm cả bài học từ sai lầm.","href":"/portal/duan-cohoi/blockchain-crypto","statusLabel":"Chia sẻ trải nghiệm","fitCriteria":"Người tò mò về công nghệ mới, chấp nhận rủi ro cao và biến động giá lớn.","avoidCriteria":"Người chưa từng tự quản lý một ví số, hoặc coi đây là cách làm giàu nhanh.","expectation":"Kiến thức nền về blockchain/crypto và cách tự bảo vệ tài sản số — không phải lợi nhuận giao dịch."}'::jsonb, 'Published', 3),
  ('proj_affiliate', '{"id":"proj_affiliate","key":"blockchain","icon":"link-2","name":"Làm tiếp thị liên kết (Affiliate)","description":"Các chương trình/khoá học tiếp thị liên kết mình đang tìm hiểu hoặc quảng bá.","href":"/portal/duan-cohoi/lam-affilate","statusLabel":"Đang theo dõi","fitCriteria":"Người muốn tìm hiểu các chương trình tiếp thị liên kết cụ thể mình đang theo dõi.","avoidCriteria":"Người tìm kiếm một danh sách link tiếp thị đã có sẵn và hoạt động ngay hôm nay.","expectation":"Biết rõ những chương trình affiliate mình đang tìm hiểu — không phải cam kết thu nhập."}'::jsonb, 'Published', 4),
  ('proj_trading', '{"id":"proj_trading","key":"trading","icon":"line-chart","name":"Các sàn giao dịch Crypto","description":"Danh sách các sàn giao dịch crypto mình đang theo dõi hoặc đã dùng thử.","href":"/portal/duan-cohoi/sangiaodich","statusLabel":"Chia sẻ kiến thức","fitCriteria":"Người đã hiểu kiến thức nền về crypto, muốn biết các sàn giao dịch cụ thể mình đang theo dõi.","avoidCriteria":"Người chưa hiểu kiến thức nền về crypto/ví số — nên đọc Blockchain & Crypto trước.","expectation":"Biết rõ các sàn giao dịch mình đang theo dõi/đã dùng — không phải khuyến nghị nên chọn sàn nào."}'::jsonb, 'Published', 5)
on conflict (id) do nothing;

-- ===== founder_profile =====
-- Singleton (1 dòng duy nhất, id='founder') — gộp 3 bản hardcode lệch nhau
-- ở FounderStory.tsx (Landing), FounderSpotlight.tsx (Premium),
-- CommunityGuides.tsx (Cộng đồng) thành 1 nguồn sự thật cho phần CHỮ.
-- Ảnh KHÔNG gộp — giữ đúng 2 giá trị gốc trong 2 cột riêng, xem ghi chú đầu
-- file. `bioLong` là mảng 4 đoạn từ FounderStory.tsx (Landing); `bioShort`
-- lấy nguyên văn từ FounderSpotlight.tsx/CommunityGuides.tsx (2 nơi này vốn
-- đã giống hệt nhau). `title`="Nhà sáng lập VO DUONG AI" theo đúng
-- wording ở Premium/Cộng đồng (2/3 nơi dùng, khác 1 chữ so với Landing:
-- "Nhà sáng lập Võ Đương AI"). `badge` lấy dòng credential đặc trưng của
-- Landing ("Nhà sáng lập" ở Cộng đồng coi như trùng lặp với title, không
-- migrate riêng).
--
-- CHƯA migrate: `expertise`/`philosophy`/`achievements` — các field này chỉ
-- có ở FounderSpotlight.tsx/CommunityGuides.tsx, KHÔNG nằm trong schema đã
-- chốt (name/title/badge/photoUrlDefault/photoUrlLanding/bioShort/bioLong/
-- tags) — vẫn hardcode trong 2 file đó cho tới khi có quyết định khác.
create table if not exists founder_profile (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table founder_profile enable row level security;
drop policy if exists "public read published" on founder_profile;
create policy "public read published" on founder_profile for select using (status = 'Published');

insert into founder_profile (id, data, status, "order") values
  ('founder', '{"id":"founder","name":"Võ Đương","title":"Nhà sáng lập VO DUONG AI","badge":"Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam","photoUrlDefault":"/images/founder-portrait.jpg","photoUrlLanding":"/founder.png","bioShort":"Võ Đương là nhà sáng lập VO DUONG AI — nhà đầu tư và người ứng dụng AI thực chiến trong kinh doanh số. Với nền tảng thực chiến trong Affiliate Marketing và xây dựng hệ thống tự động hóa, anh xây VO DUONG AI thành một hệ sinh thái có lộ trình rõ ràng thay vì những thông tin rời rạc.","bioLong":["Tôi là Võ Đương — nhà đầu tư, người ứng dụng AI thực chiến và hiện đang đồng hành phát triển cộng đồng DigiU Việt Nam với vai trò Đại diện Quốc gia khu vực Miền Nam.","Trong nhiều năm làm việc, đầu tư và xây dựng hệ thống, tôi nhận ra rằng vấn đề lớn nhất không phải là thiếu công cụ hay thiếu khóa học. Vấn đề là có quá nhiều thông tin rời rạc, quá nhiều lựa chọn và rất ít lộ trình rõ ràng để người mới bắt đầu có thể áp dụng ngay vào thực tế.","Tôi xây Võ Đương AI như một hệ sinh thái tập hợp những công cụ, tài liệu, kinh nghiệm và phương pháp mà chính tôi đang sử dụng mỗi ngày trong công việc, kinh doanh, AI và Affiliate Marketing.","Mục tiêu của tôi rất đơn giản: giúp bạn học AI nhanh hơn, xây hệ thống hiệu quả hơn và từng bước tạo ra tài sản số bền vững cho tương lai."],"tags":["AI ứng dụng","Affiliate Marketing","Automation","AI Strategy","Phát triển hệ thống"]}'::jsonb, 'Published', 0)
on conflict (id) do nothing;
