-- Việc 9 — "Hành trình của tôi", Cửa 4: Bản đồ hành trình (RỦI RO CAO NHẤT).
-- Tách CHỈ static chrome an toàn (title/subtitle/nhãn mục/CTA/footer) khỏi
-- JourneyMapAtlas.tsx.
--
-- KHÔNG đụng (đã audit kỹ, xác nhận có rủi ro thật, giữ nguyên 100% trong
-- code):
-- - CHAPTER_DESTINATIONS — mảng {href,label}, KHÔNG có key, gắn với chương
--   chỉ bằng vị trí index (CHAPTER_DESTINATIONS[i] khớp JOURNEY_CHAPTER_NAMES[i]).
--   Đưa vào bảng CMS generic (cho kéo-thả/xoá) sẽ: kéo-thả lặng lẽ gán sai
--   chương↔đích; xoá 1 dòng crash trang (CHAPTER_DESTINATIONS[i] → undefined.href,
--   không có bounds check).
-- - PORTAL_CONNECTIONS — field `module` (không phải `label`) là KEY TRA CỨU
--   THẬT vào getModuleActivitySummary() (đếm session thật, growth-view.ts).
--   Founder gõ nhầm module trong CMS sẽ không crash, chỉ âm thầm báo
--   "Chưa chạm tới" mãi mãi dù có dữ liệu thật thay đổi khi CMS.
-- - JOURNEY_CHAPTER_NAMES (dùng chung 3 cửa, đã loại trừ từ Cửa 3).
-- - currentChapter.name/evidence, connections[].count, "Đã chạm tới/Chưa
--   chạm tới", "Đang đồng hành/Chưa tham gia", nextDirection.text (3 biến
--   thể) — toàn bộ dữ liệu/template động thật.

create table if not exists map_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table map_chrome enable row level security;

drop policy if exists "map_chrome_public_select" on map_chrome;
create policy "map_chrome_public_select" on map_chrome
  for select using (status = 'Published');

insert into map_chrome (id, data, status, "order") values (
  'map',
  jsonb_build_object(
    'title', 'Bản đồ hành trình của bạn',
    'subtitle', 'Không đo tốc độ. Chỉ cho biết bạn đang ở đâu, và hướng nào đang mở ra tiếp theo.',
    'emptyStateLine', 'Mỗi cuộc hành trình đều bắt đầu trước khi có dấu chân đầu tiên.',
    'emptyStateCtaLabel', 'Đặt dấu chân đầu tiên',
    'currentPositionLabel', 'Vị trí hiện tại',
    'noChapterYetLine', 'Chương đầu tiên của bạn chưa được viết — nó bắt đầu từ hoạt động thật đầu tiên.',
    'chaptersSectionLabel', 'Năm chương cuộc đời',
    'statesCaption', 'Ba trạng thái duy nhất: chưa bắt đầu, đang sống, đã đi qua — không phần trăm, không XP, không Level.',
    'connectionsSectionLabel', 'Kết nối tới Portal',
    'premiumConnectionLabel', 'Premium',
    'nextDirectionSectionLabel', 'Hướng tiếp theo',
    'closingLine', 'Con đường này có vẻ đã sẵn sàng, bất cứ khi nào bạn sẵn sàng.'
  ),
  'Published',
  0
)
on conflict (id) do nothing;
