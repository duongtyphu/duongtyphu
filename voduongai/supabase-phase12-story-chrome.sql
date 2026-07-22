-- Việc 9 — "Hành trình của tôi", Cửa 3: My Story.
-- Tách static chrome khỏi MyStoryBook.tsx (title/subtitle/empty-state/
-- nhãn mục/CTA/footer + chuỗi trong 2 sub-component WriteNook/RemovableEntry).
--
-- KHÔNG đụng: JOURNEY_CHAPTER_NAMES (dùng chung 3 cửa, index gắn với
-- evidence sentence động), KIND_LABEL (enum map MemoryCapsuleKind→label),
-- companionLine/understandingNote/growthPattern/qualities/buildLetter(...)
-- (dữ liệu động thật từ reflections/capsules) — xem CLAUDE.md mục
-- "Hành trình của tôi". "Lá thư tháng {monthLabel}" — chỉ phần tiền tố
-- "Lá thư tháng" là chrome tĩnh, {monthLabel} vẫn nội suy động trong code.

create table if not exists story_chrome (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table story_chrome enable row level security;

drop policy if exists "story_chrome_public_select" on story_chrome;
create policy "story_chrome_public_select" on story_chrome
  for select using (status = 'Published');

insert into story_chrome (id, data, status, "order") values (
  'story',
  jsonb_build_object(
    'title', 'My Story',
    'subtitle', 'Câu chuyện đang được viết bằng chính những điều bạn học, tạo ra và gìn giữ.',
    'emptyStateLine1', 'Mọi cuốn sách hay đều bắt đầu bằng một trang đầu còn trắng.',
    'emptyStateLine2', 'Trang này sẽ tự viết khi bạn học, tạo ra hoặc gìn giữ điều gì đó thật trong Portal.',
    'monthlyLetterLabel', 'Lá thư tháng',
    'momentsSectionLabel', 'Những khoảnh khắc quan trọng',
    'turningPointsSectionLabel', 'Bước ngoặt',
    'lessonsSectionLabel', 'Những bài học đã thay đổi tôi',
    'createdSectionLabel', 'Những gì tôi đã tạo ra',
    'createdEmptyLine', 'Chưa có tác phẩm nào — trang này sẽ tự viết khi bạn tạo ra kết quả đầu tiên trong Workspace.',
    'capsulesSectionLabel', 'Những điều bạn tự gìn giữ',
    'storageNotReadyLine', 'Khu vực lưu ký ức đang được chuẩn bị. Bạn vẫn có thể đọc lại hành trình của mình.',
    'writeNookSectionLabel', 'Viết một trang mới',
    'nextChapterPrompt', 'Chương tiếp theo bạn muốn bắt đầu là gì?',
    'nextChapterCtaLabel', 'Bắt đầu viết tiếp',
    'mirrorPromptPrefix', 'Muốn nhìn sâu hơn?',
    'mirrorLinkLabel', 'Mở Mirror',
    'writeNookNotReadyLine', 'Khu vực lưu ký ức đang được chuẩn bị — bạn có thể quay lại viết sau.',
    'thankYouLine', 'Cảm ơn bạn đã dành chút thời gian để suy ngẫm hôm nay — dòng đó đã được cất vào cuốn sách.',
    'reflectionPlaceholder', 'Không cần dài, chỉ cần thật...',
    'saveReflectionCtaLabel', 'Lưu dòng này vào cuốn sách',
    'momentPrompt', 'Có một khoảnh khắc khác đáng giữ lại hôm nay?',
    'momentPlaceholder', 'Điều gì đáng nhớ với bạn?',
    'saveMomentCtaLabel', 'Cất giữ vào cuốn sách',
    'savedMomentLabel', 'Đã cất giữ',
    'noReflectionsLine', 'Chưa có suy ngẫm nào được lưu — dòng đầu tiên luôn là dòng khó viết nhất.',
    'removeLabel', 'Gỡ khỏi cuốn sách',
    'removeConfirmLabel', 'Chắc chắn?',
    'removeCtaLabel', 'Xoá',
    'keepCtaLabel', 'Giữ lại'
  ),
  'Published',
  0
)
on conflict (id) do nothing;
