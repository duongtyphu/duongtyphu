-- STABILIZATION-SPR-1101 Task 2 — Premium Course Commerce & Learning Access.
--
-- Trước migration này, bảng `courses` (supabase-course-pricing.sql) chỉ có
-- id/name/status/description/price — KHÔNG có model nội dung học nào
-- (topic/module/lesson/video/pdf). Học viên thanh toán thành công 1 trong 3
-- "Lớp học" (Lớp AI Cơ bản/Nâng cao/OpenClaw) nhận huy hiệu "Đã sở hữu"
-- nhưng KHÔNG có route/component nào ở Portal để xem nội dung — không chỉ
-- thiếu CRUD, UI học viên cũng chưa từng tồn tại.
--
-- QUAN TRỌNG: đây là migration ADDITIVE — không đổi/xoá cột nào đã có,
-- không phá dữ liệu `orders` đang chạy (nếu có). `orders.course_id` (text,
-- không FK) được GIỮ NGUYÊN; thêm cột mới `course_ref_id` (bigint, FK thật
-- tới courses.id) và backfill an toàn (chỉ ghi các giá trị text hiện có
-- castable sang số, bỏ qua giá trị không hợp lệ thay vì lỗi cả migration).
--
-- RLS: KHÔNG có policy public select cho course_modules/course_lessons —
-- nội dung học (link video/pdf) chỉ đọc được qua service-role (Portal dùng
-- getSupabaseAdmin() sau khi tự xác minh entitlement trong code, cùng
-- pattern /portal/my-products đã dùng) — tránh rò rỉ link nội dung trả phí
-- qua anon key public REST API.
--
-- Rollback: drop table course_lessons; drop table course_modules;
--           alter table orders drop column course_ref_id;

alter table orders add column if not exists course_ref_id bigint references courses(id);

update orders
set course_ref_id = course_id::bigint
where course_id ~ '^[0-9]+$'
  and course_ref_id is null;

create table if not exists course_modules (
  id bigint generated always as identity primary key,
  course_id bigint not null references courses(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table course_modules enable row level security;

create table if not exists course_lessons (
  id bigint generated always as identity primary key,
  module_id bigint not null references course_modules(id) on delete cascade,
  title text not null,
  -- Video/PDF/Document/Download — URL do Founder tự nhập qua Admin (không
  -- có file upload/CDN ở phase này, giống cơ chế products.video_url/pdf_url
  -- đã có).
  video_url text,
  pdf_url text,
  document_url text,
  download_url text,
  -- Prompt/Template reference — text tự do dạng "prompts:<id>"/"templates:<id>"
  -- (cùng format relatedIds của CKOS RelationshipPicker) để Founder ghi chú
  -- liên kết tới 1 Prompt/Template CKOS có sẵn, không tạo bảng quan hệ mới.
  prompt_ref text,
  template_ref text,
  exercise_note text,
  bonus_note text,
  sort_order int not null default 0,
  visible boolean not null default true,
  status text not null default 'Draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table course_lessons enable row level security;

create index if not exists course_modules_course_id_idx on course_modules(course_id);
create index if not exists course_lessons_module_id_idx on course_lessons(module_id);
create index if not exists orders_course_ref_id_idx on orders(course_ref_id);
