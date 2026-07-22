-- Việc 9 — "Hành trình của tôi", Cửa 5 (cuối cùng): Khu vườn của bạn.
-- Tách CHỈ 5 field static chrome đã chốt khỏi GardenExperience.tsx.
--
-- KHÔNG đụng (đã audit kỹ, Founder xác nhận quyết định):
-- - companionLine (companionLineFor()) — template nội suy biến runtime
--   (${act}, lastActivity thật) + gate theo period thật. 8 biến thể.
-- - treeStage()/stage.name/stage.line — ngưỡng số liệu thật
--   (missionsCompleted/journeysTouched/competenciesPracticed/totalOutputs).
-- - buildElements() — mảng phần tử vườn, mỗi meaning nội suy đếm số thật.
-- - Cặp CTA (nhãn+href): "Gieo hạt mầm đầu tiên"/"/portal/hocvienai" ↔
--   "Tưới cho khu vườn hôm nay"/"/portal/workspace" — GIỮ NGUYÊN 100%
--   TRONG CODE, không tách bất kỳ phần nào. Đây là 1 Link duy nhất, nhãn
--   VÀ href cùng đổi theo `gardenEmpty` (dẫn xuất từ treeStage(summary)
--   === null) — nhất quán với quyết định đã áp dụng cho nextDirection.text
--   ở Cửa 4 (Bản đồ hành trình): giữ nguyên cả khối điều kiện trong code,
--   không tách rời nhãn khỏi điều kiện chọn nhãn, tránh rủi ro Admin sửa
--   1 nửa cặp mà không hiểu nó gắn với nửa kia.

create table if not exists garden_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table garden_chrome enable row level security;

drop policy if exists "garden_chrome_public_select" on garden_chrome;
create policy "garden_chrome_public_select" on garden_chrome
  for select using (status = 'Published');

insert into garden_chrome (id, data, status, "order") values (
  'garden',
  jsonb_build_object(
    'title', 'Khu vườn của bạn',
    'subtitle', 'Nơi những gì bạn đã học và nuôi dưỡng trở thành một khu vườn sống.',
    'footer', 'Khu vườn của bạn phản chiếu đúng những gì bạn đã thật sự làm — không hơn, không kém.',
    'emptyStateNoTree', 'Khu vườn mọc từ việc học thật. Hạt mầm đầu tiên đang chờ bạn.',
    'emptyStateNoMoments', 'Viên ngọc vẫn đang chờ những trải nghiệm đầu tiên của bạn.'
  ),
  'Published',
  0
)
on conflict (id) do nothing;
