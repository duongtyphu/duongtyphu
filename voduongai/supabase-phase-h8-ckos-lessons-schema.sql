-- ============================================================================
-- PHASE H.8 — Lesson Intelligence: Canonical Schema (SCHEMA ONLY, NOT APPLIED)
-- ============================================================================
-- Canonical Lesson Source đã chốt: bảng `lessons` (typed, production,
-- Phase A gốc — supabase-core-schema.sql:79-101), dùng cho /portal/vdai-academy
-- và /portal/my-products, có FK từ orders.lesson_id. KHÔNG tạo bảng
-- `ckos_lessons` song song (giống pattern Tool=`tools`, CaseStudy=`case_studies`
-- ở Phase F/G) — tránh trùng lặp nguồn ghi, tránh phá logic checkout hiện có.
--
-- `lessons` hiện KHÔNG có cột nào theo CKOS Object Standard (Phase G.2) —
-- file này bổ sung additive, an toàn, KHÔNG đổi ý nghĩa `active` (boolean,
-- đang dùng bởi .eq("active", true) ở vdai-academy/page.tsx).
-- ============================================================================

alter table lessons add column if not exists slug text;
alter table lessons add column if not exists status text not null default 'Published'
  check (status in ('Draft','Review','Approved','Published','Archived'));
alter table lessons add column if not exists version int not null default 1;
alter table lessons add column if not exists language text not null default 'vi';
alter table lessons add column if not exists difficulty text;
alter table lessons add column if not exists tags text[] not null default '{}';
alter table lessons add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table lessons add column if not exists updated_at timestamptz not null default now();

-- slug backfill (idempotent, chỉ set nếu còn null) — dùng chính title, không
-- ghi đè nếu đã có slug thủ công từ trước.
update lessons set slug = regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g')
where slug is null;

create unique index if not exists lessons_slug_key on lessons (slug) where slug is not null;

comment on column lessons.status is 'CKOS Object Standard lifecycle field (Phase H.8) — chạy song song với `active` (boolean, đang dùng bởi vdai-academy/page.tsx), KHÔNG thay thế.';

-- ============================================================================
-- Relationship tables — 9 loại theo yêu cầu H.8
-- ============================================================================

-- Lesson → Tool: TÁI SỬ DỤNG `ckos_tool_lessons` (Phase H.3, tool_id/lesson_id).
-- Lesson → Prompt: TÁI SỬ DỤNG `ckos_prompt_lessons` (Phase H.4).
-- Lesson → Workflow: TÁI SỬ DỤNG `ckos_workflow_lessons` (Phase H.5).

-- Lesson → Resource (mới — ckos_resources chưa có chiều Lesson từ Phase H.6)
create table if not exists ckos_resource_lessons (
  resource_id uuid not null references ckos_resources(id) on delete cascade,
  lesson_id bigint not null, -- tham chiếu mềm tới lessons.id (khác domain uuid/bigint)
  created_at timestamptz not null default now(),
  primary key (resource_id, lesson_id)
);
alter table ckos_resource_lessons enable row level security;
create policy "public can read resource-lesson links" on ckos_resource_lessons
  for select using (
    exists (select 1 from ckos_resources r where r.id = resource_id and r.status = 'Published')
  );

-- Lesson → Best Practice (mới)
create table if not exists ckos_best_practice_lessons (
  best_practice_id uuid not null references ckos_best_practices(id) on delete cascade,
  lesson_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (best_practice_id, lesson_id)
);
alter table ckos_best_practice_lessons enable row level security;
create policy "public can read best-practice-lesson links" on ckos_best_practice_lessons
  for select using (
    exists (select 1 from ckos_best_practices b where b.id = best_practice_id and b.status = 'Published')
  );

-- Lesson → Case Study (mới)
create table if not exists ckos_case_study_lessons (
  case_study_id bigint not null references case_studies(id) on delete cascade,
  lesson_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (case_study_id, lesson_id)
);
alter table ckos_case_study_lessons enable row level security;
create policy "public can read case-study-lesson links" on ckos_case_study_lessons
  for select using (
    exists (select 1 from case_studies c where c.id = case_study_id and c.active = true)
  );

-- Lesson → FAQ (mới, greenfield cả hai phía — KHÔNG có bảng `ckos_faqs`
-- canonical nào tồn tại (Phase H.1 xếp FAQ là "technical consolidation",
-- không map Intelligence). Soft reference bằng text vì chưa có canonical id.
create table if not exists ckos_lesson_faqs (
  lesson_id bigint not null,
  faq_ref text not null, -- tham chiếu mềm (vd. slug/question-key) — chưa có bảng FAQ canonical
  created_at timestamptz not null default now(),
  primary key (lesson_id, faq_ref)
);
alter table ckos_lesson_faqs enable row level security;
create policy "public can read lesson-faq links" on ckos_lesson_faqs
  for select using (true);
comment on table ckos_lesson_faqs is 'Greenfield — chưa có bảng FAQ canonical trong repo (xem Phase H.1). faq_ref là tham chiếu mềm dạng text, KHÔNG FK. Bảng schema-only, không seed data ở H.8.';

-- Lesson → Journey (mới, greenfield — Journey là cụm feature Portal
-- (src/components/portal/journey/*, journey-hub.ts), không có canonical id
-- CKOS. Soft reference bằng text (slug/key của Journey).
create table if not exists ckos_lesson_journeys (
  lesson_id bigint not null,
  journey_ref text not null, -- tham chiếu mềm tới Journey (slug/key), chưa có canonical id
  created_at timestamptz not null default now(),
  primary key (lesson_id, journey_ref)
);
alter table ckos_lesson_journeys enable row level security;
create policy "public can read lesson-journey links" on ckos_lesson_journeys
  for select using (true);
comment on table ckos_lesson_journeys is 'Greenfield — Journey (Portal feature) không có canonical id CKOS. journey_ref là tham chiếu mềm dạng text. Bảng schema-only, không seed data ở H.8.';

-- Lesson → Competency (mới, greenfield hoàn toàn — KHÔNG có taxonomy
-- Competency nào tồn tại trong repo gắn với Lesson (grep xác nhận "competency"
-- chỉ xuất hiện ở companion capability/mission engine, không liên quan Lesson).
create table if not exists ckos_lesson_competencies (
  lesson_id bigint not null,
  competency_ref text not null, -- tham chiếu mềm — CHƯA có taxonomy Competency nào trong repo
  created_at timestamptz not null default now(),
  primary key (lesson_id, competency_ref)
);
alter table ckos_lesson_competencies enable row level security;
create policy "public can read lesson-competency links" on ckos_lesson_competencies
  for select using (true);
comment on table ckos_lesson_competencies is 'Greenfield hoàn toàn — KHÔNG có Competency taxonomy nào trong repo. Bảng schema-only, KHÔNG seed data ở H.8 (không có nguồn thật để migrate).';
