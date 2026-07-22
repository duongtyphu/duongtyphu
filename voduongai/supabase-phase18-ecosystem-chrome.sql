-- Nhóm 3, Phần D (mở rộng) — 5 trang chi tiết hệ sinh thái
-- (/portal/duan-cohoi/[ecosystemSlug]). Founder xác nhận: CHỈ tách 2 field
-- chữ an toàn (title/mô tả ngắn), KHÔNG đụng highlights/whoFor/whoNotReady/
-- expectedOutcome/fullIntro/statusBadge hay bất kỳ cấu trúc lồng nào
-- (marketingLinks/subProjects/fields/affiliateOffers/exchanges/
-- potentialAnalysis) — các phần đó vẫn đọc tĩnh 100% từ
-- src/data/portal/ecosystems.ts như trước, không đụng.
--
-- id mỗi dòng = đúng `id` gốc trong ecosystems.ts (eco_digiu, eco_solargroup,
-- eco_crypto, eco_blockchain, eco_trading) — ổn định, không đổi theo slug
-- (slug từng đổi qua "Route Localization", id thì không).

create table if not exists ecosystem_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ecosystem_chrome enable row level security;

drop policy if exists "ecosystem_chrome_public_select" on ecosystem_chrome;
create policy "ecosystem_chrome_public_select" on ecosystem_chrome
  for select using (status = 'Published');

insert into ecosystem_chrome (id, data, status, "order") values
  ('eco_digiu', jsonb_build_object(
    'name', 'Hệ sinh thái DigiU',
    'shortDescription', 'Nền tảng học và kiếm thu nhập số — mình đang đồng hành và chia sẻ trải nghiệm thực tế.'
  ), 'Published', 1),
  ('eco_solargroup', jsonb_build_object(
    'name', 'SolarGroup',
    'shortDescription', 'Cơ hội đầu tư cổ phần dài hạn — mình đang nghiên cứu và chia sẻ góc nhìn cá nhân.'
  ), 'Published', 2),
  ('eco_crypto', jsonb_build_object(
    'name', 'Blockchain & Crypto',
    'shortDescription', 'Kiến thức nền tảng về hai mảng Blockchain và Crypto — bao gồm cả bài học từ sai lầm.'
  ), 'Published', 3),
  ('eco_blockchain', jsonb_build_object(
    'name', 'Làm tiếp thị liên kết (Affiliate)',
    'shortDescription', 'Nơi mình liệt kê các chương trình/khoá học tiếp thị liên kết đang tìm hiểu hoặc quảng bá.'
  ), 'Published', 4),
  ('eco_trading', jsonb_build_object(
    'name', 'Các sàn giao dịch Crypto',
    'shortDescription', 'Danh sách các sàn giao dịch crypto mình đang theo dõi hoặc đã dùng thử.'
  ), 'Published', 5)
on conflict (id) do nothing;
