-- Việc 9 — "Hành trình của tôi", Cửa 2: Nhật ký học tập.
-- Tách static chrome khỏi LearningJournalNotebook.tsx (title/eyebrow/
-- empty-state/section labels/footer) + JOURNAL_INTENTIONS (mảng câu hỏi
-- "Ý định học tiếp theo", xoay vòng theo ngày).
--
-- KHÔNG đụng: MODULE_LABEL (enum map PortalModule→label), TODAY_PRIORITY
-- (mảng type+sentence gắn thứ tự ưu tiên theo GrowthEventType enum), dòng
-- "{totalRawOutputs} kết quả thật..." (template nội suy biến runtime) —
-- cả 3 giữ nguyên trong code, xem CLAUDE.md mục "Hành trình của tôi".

create table if not exists journal_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table journal_chrome enable row level security;

drop policy if exists "journal_chrome_public_select" on journal_chrome;
create policy "journal_chrome_public_select" on journal_chrome
  for select using (status = 'Published');

insert into journal_chrome (id, data, status, "order") values (
  'journal',
  jsonb_build_object(
    'eyebrowLabel', 'Nhật ký học tập',
    'title', 'Bản ghi những gì tôi thực sự đã học',
    'emptyStateLine', 'Trang đầu tiên luôn là trang nhiều hy vọng nhất.',
    'emptyStateCtaLabel', 'Bắt đầu bài học đầu tiên',
    'todaySectionLabel', 'Hôm nay',
    'todayFallbackLine', 'Hôm nay chưa có gì để ghi lại — cuốn sổ vẫn đang mở, chờ bạn.',
    'entriesSectionLabel', 'Các trang đã viết',
    'highlightsSectionLabel', 'Khoảnh khắc đáng nhớ',
    'createdSectionLabel', 'Những gì đã tạo ra',
    'createdEmptyLine', 'Chưa có tác phẩm nào — trang này sẽ tự viết khi bạn tạo ra kết quả đầu tiên.',
    'lessonsSectionLabel', 'Những bài học đáng nhớ',
    'continueCtaLabel', 'Tiếp tục trong Workspace',
    'footer', 'Đây là bản ghi việc học của bạn — không phải nhật ký hoạt động của hệ thống.'
  ),
  'Published',
  0
)
on conflict (id) do nothing;

create table if not exists journal_intentions (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table journal_intentions enable row level security;

drop policy if exists "journal_intentions_public_select" on journal_intentions;
create policy "journal_intentions_public_select" on journal_intentions
  for select using (status = 'Published');

insert into journal_intentions (id, data, status, "order") values
  ('journal_i1', jsonb_build_object('content', 'Bạn muốn khám phá điều gì vào ngày mai?'), 'Published', 0),
  ('journal_i2', jsonb_build_object('content', 'Có điều gì bạn muốn thử tiếp, dù chỉ một bước nhỏ?'), 'Published', 1),
  ('journal_i3', jsonb_build_object('content', 'Nếu được chọn một điều để học sâu hơn, đó sẽ là gì?'), 'Published', 2),
  ('journal_i4', jsonb_build_object('content', 'Có kỹ năng nào bạn muốn quay lại luyện thêm?'), 'Published', 3),
  ('journal_i5', jsonb_build_object('content', 'Điều gì hôm nay khiến bạn tò mò muốn tìm hiểu thêm?'), 'Published', 4)
on conflict (id) do nothing;
