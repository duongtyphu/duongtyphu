-- Phase 29 — Schema v2, Bước 3: 4 bảng CKOS mới.
--
-- Áp dụng qua Supabase MCP (apply_migration), track lại ở đây theo convention.
--
-- NGUYÊN TẮC RLS (bắt buộc, rút từ audit): bật RLS VÀ tạo policy NGAY trong
-- cùng migration. Dự án đang có 11 bảng "bật RLS nhưng 0 policy" → không ai
-- đọc được kể cả admin; không lặp lại tình trạng đó.
--
-- Dùng `public.is_app_admin()` (đã có sẵn) cho policy admin — không tự viết
-- lại điều kiện kiểm tra quyền.
--
-- Tên bảng đã kiểm tra `to_regclass()` trước: cả 4 đều chưa tồn tại, không
-- đụng 9 bảng mồ côi (`ai_workspace_*`, `knowledge_seed` số ít).

-- ---------------------------------------------------------------------------
-- 1. ckos_categories — danh mục tri thức
--
-- Hiện 7 danh mục đang hardcode trong `getKnowledgeCategories()`
-- (src/app/portal/ckos/page.tsx). Seed đúng 7 dòng đó, COPY VERBATIM
-- key/label/href thật — không bịa thêm danh mục nào.
--
-- Cột `href` KHÔNG có trong bản mô tả schema nhưng bắt buộc phải có: 7 danh
-- mục thật đều mang 1 href điều hướng riêng, thiếu cột này thì bảng không
-- thay thế được phần hardcode. Ghi rõ ở đây vì đây là chỗ mở rộng so với
-- đặc tả.
--
-- Cột `icon` để rỗng: `/portal/ckos` KHÔNG dùng tên icon cho 7 danh mục này
-- (mỗi loại có "chất cảm" riêng dựng bằng class/JSX), nên không có giá trị
-- thật nào để seed — để trống thay vì bịa tên icon.
-- ---------------------------------------------------------------------------
create table if not exists public.ckos_categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  icon         text,
  href         text,
  "order"      int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

insert into public.ckos_categories (slug, name, href, "order") values
  ('tool',          'Công cụ AI',    '/portal/aiworkspace#ai-toolbox', 0),
  ('prompt',        'Prompt',        '/portal/prompts',                1),
  ('workflow',      'Workflow',      '/portal/sop',                    2),
  ('resource',      'Resource',      '/portal/resources',              3),
  ('lesson',        'Lesson',        '/portal/hetrithucai',            4),
  ('best_practice', 'Best Practice', '/portal/ckos/best-practices',    5),
  ('case_study',    'Case Study',    '/portal/case-studies',           6)
on conflict (slug) do nothing;

alter table public.ckos_categories enable row level security;

create policy "ckos_categories_read" on public.ckos_categories
  for select using (true);
create policy "ckos_categories_admin" on public.ckos_categories
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 2. ckos_tags — tag chuẩn hoá
--
-- Hiện tag chỉ là mảng string tự do trong `data.tags` của prompts/templates/
-- checklists/ebooks — không chuẩn hoá, không lọc chéo được ở tầng DB.
-- Bảng để RỖNG: chưa có danh sách tag chuẩn nào được duyệt, seed từ mảng tự
-- do hiện có sẽ tạo ra tag rác (viết hoa/thường/dấu không thống nhất).
-- ---------------------------------------------------------------------------
create table if not exists public.ckos_tags (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  created_at  timestamptz not null default now()
);

alter table public.ckos_tags enable row level security;

create policy "ckos_tags_read" on public.ckos_tags
  for select using (true);
create policy "ckos_tags_admin" on public.ckos_tags
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 3. ckos_content_tags — junction polymorphic
--
-- LỖI #5 đã sửa: `content_id` kiểu TEXT (không phải uuid). Nội dung CKOS nằm
-- rải nhiều bảng với kiểu id khác nhau — knowledge_seeds/best_practices/sop/
-- resources/prompts là text, case_studies là bigint, documents là int — nên
-- ép hết về text khi insert.
--
-- KHÔNG đặt FK cứng cho `content_id` (đa bảng nguồn). `content_type` giới
-- hạn bằng CHECK để tránh gõ sai tên loại — 9 loại đúng bằng 7 danh mục
-- CKOS + template/ebook (2 loại có tag thật nhưng không phải danh mục riêng).
-- ---------------------------------------------------------------------------
create table if not exists public.ckos_content_tags (
  id           uuid primary key default gen_random_uuid(),
  tag_id       uuid not null references public.ckos_tags(id) on delete cascade,
  content_type text not null check (content_type in (
                 'knowledge_seed','best_practice','case_study','sop',
                 'resource','prompt','template','ebook','checklist','tool'
               )),
  content_id   text not null,
  created_at   timestamptz not null default now(),
  unique (tag_id, content_type, content_id)
);

create index if not exists ckos_content_tags_content_idx
  on public.ckos_content_tags (content_type, content_id);

alter table public.ckos_content_tags enable row level security;

create policy "ckos_content_tags_read" on public.ckos_content_tags
  for select using (true);
create policy "ckos_content_tags_admin" on public.ckos_content_tags
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 4. ckos_folders — thư mục cá nhân của user
--
-- RLS theo đúng pattern `saved_items` đã có sẵn ("members manage own saved
-- items"): user chỉ thấy/sửa folder của chính mình; admin toàn quyền.
-- ---------------------------------------------------------------------------
create table if not exists public.ckos_folders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.members(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists ckos_folders_user_idx on public.ckos_folders (user_id);

alter table public.ckos_folders enable row level security;

create policy "ckos_folders_own" on public.ckos_folders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ckos_folders_admin" on public.ckos_folders
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 5. saved_items.folder_id — cho phép xếp mục đã lưu vào thư mục
--
-- ON DELETE SET NULL (không phải CASCADE): xoá thư mục KHÔNG được xoá luôn
-- nội dung user đã lưu — mục lưu quay về trạng thái "chưa xếp thư mục".
-- ---------------------------------------------------------------------------
alter table public.saved_items
  add column if not exists folder_id uuid references public.ckos_folders(id) on delete set null;

create index if not exists saved_items_folder_idx on public.saved_items (folder_id);
