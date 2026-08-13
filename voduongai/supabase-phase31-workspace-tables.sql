-- Phase 31 — Schema v2, Bước 5: 6 bảng AI Workspace.
--
-- Áp dụng qua Supabase MCP (apply_migration), track lại ở đây theo convention.
-- RLS + policy tạo NGAY trong cùng migration.
--
-- Nguồn dữ liệu thay thế: `src/lib/portal/foundation/workspace-session-store.ts`
-- (100% localStorage). Cấu trúc thật đã đọc lại từng type trước khi thiết kế
-- (KHÔNG suy đoán từ bản mô tả) — 5 điểm dưới đây LỆCH so với đặc tả v2 và
-- đã sửa lại cho khớp dữ liệu thật, ghi rõ lý do tại từng chỗ:
--
--   (a) 3 trạng thái Output là 3 FIELD ĐỘC LẬP, không phải 1 cột `status`
--       nhận 3 giá trị.
--   (b) `context` thuộc SESSION (project), không thuộc từng Output.
--   (c) Reflection có `question` + `answer`, không chỉ 1 đoạn text.
--   (d) Session có `currentStepId` + 4 mốc thời gian (started/paused/
--       resumed/finished) — thiếu thì migrate mất dữ liệu.
--   (e) `history[]` KHÔNG suy ra được từ steps + versions → cần bảng riêng.

-- ---------------------------------------------------------------------------
-- 1. workspace_projects — dự án / phiên làm việc
--
-- ⚠️ Tên KHÁC `projects` (5 dòng, thuộc "Dự án & Cơ hội") — 2 khái niệm
-- hoàn toàn khác nhau, tuyệt đối không dùng chung. Bảng `projects` cũ KHÔNG
-- bị đụng tới trong migration này.
--
-- LỖI #4 đã sửa: `workflow_id` kiểu TEXT (khớp `ai_workflow_sections.id` là
-- text — bảng generic), không phải uuid.
--
-- (b) `context jsonb` đặt Ở ĐÂY, không phải ở bảng outputs như đặc tả v2 mô
--     tả: `WorkspaceContext` (20 field: module/source/userGoal/journeyId/
--     collectionId/missionId/assetId/promptId/difficulty...) là thuộc tính
--     của CẢ PHIÊN, gán 1 lần khi tạo session — đặt ở outputs sẽ nhân bản
--     cùng một giá trị cho mọi output của phiên đó.
--     Giữ nguyên dạng jsonb (không bung 20 cột) — đúng như đặc tả đã chốt.
--
-- (d) `current_step_id` + 4 mốc thời gian: có thật trong
--     `WorkspaceSessionRecord`, thiếu thì không migrate lại được phiên đang
--     dở (đang ở bước nào, đã tạm dừng lúc nào).
--
-- `status`: đặc tả dùng 'in_progress'/'completed'/'paused'; store thật dùng
-- 'active'/'paused'/'completed'. Giữ theo đặc tả, migrate map active ->
-- in_progress.
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_projects (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.members(id) on delete cascade,
  title            text not null,
  description      text,
  status           text not null default 'in_progress'
                     check (status in ('in_progress','completed','paused')),
  workflow_id      text references public.ai_workflow_sections(id) on delete set null,
  progress_percent int  not null default 0 check (progress_percent between 0 and 100),
  is_sample        boolean not null default false,
  context          jsonb not null default '{}'::jsonb,
  current_step_id  text,
  started_at       timestamptz not null default now(),
  paused_at        timestamptz,
  resumed_at       timestamptz,
  finished_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists workspace_projects_user_idx on public.workspace_projects (user_id);

alter table public.workspace_projects enable row level security;
create policy "workspace_projects_own" on public.workspace_projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workspace_projects_admin" on public.workspace_projects
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 2. workspace_project_steps — 7 bước Execution
--
-- Khớp `ExecutionStepId` thật: mission_started / preparing / research /
-- draft / review / revision / completed (EXECUTION_TIMELINE, 7 bước).
-- `step_name` là nhãn hiển thị tiếng Việt tương ứng.
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_project_steps (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.workspace_projects(id) on delete cascade,
  step_number  int  not null,
  step_id      text not null check (step_id in (
                 'mission_started','preparing','research','draft',
                 'review','revision','completed'
               )),
  step_name    text not null,
  status       text not null default 'pending'
                 check (status in ('pending','in_progress','completed')),
  completed_at timestamptz,
  unique (project_id, step_id)
);

create index if not exists workspace_project_steps_project_idx
  on public.workspace_project_steps (project_id);

alter table public.workspace_project_steps enable row level security;
create policy "workspace_project_steps_own" on public.workspace_project_steps
  for all using (exists (
    select 1 from public.workspace_projects p
    where p.id = project_id and p.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.workspace_projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));
create policy "workspace_project_steps_admin" on public.workspace_project_steps
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 3. workspace_project_outputs — Output, vòng đời ĐỘC LẬP với step
--
-- (a) ĐÍNH CHÍNH quan trọng so với đặc tả v2: đặc tả gộp thành 1 cột
--     `status` nhận "review/reflection/approval". Đọc `OutputRecord` thật
--     cho thấy đây là **3 field ĐỘC LẬP, mỗi field 1 tập giá trị riêng**,
--     tồn tại đồng thời:
--       - reviewStatus:     not_ready | pending | reviewed
--       - reflectionStatus: not_ready | pending | submitted
--       - approvalStatus:   draft | reviewed | needs_revision | approved
--     Gộp 1 cột sẽ mất thông tin (không biểu diễn được "đã review xong
--     nhưng chưa reflection"). Tách đúng 3 cột.
--
-- `type` khớp đúng 9 giá trị `OutputType` thật.
-- `agent_review jsonb` giữ nguyên `AgentReviewResult` (strengths/issues/
-- suggestedImprovements/approvalRecommendation/versionSuggestion/isMock).
-- `content` KHÔNG có ở đây — nội dung thật nằm ở từng version (bảng 4),
-- bản hiện hành = version có version_number lớn nhất.
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_project_outputs (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references public.workspace_projects(id) on delete cascade,
  type              text not null check (type in (
                      'word','excel','prompt','markdown','pdf',
                      'image','link','code','landing_page'
                    )),
  review_status     text not null default 'not_ready'
                      check (review_status in ('not_ready','pending','reviewed')),
  reflection_status text not null default 'not_ready'
                      check (reflection_status in ('not_ready','pending','submitted')),
  approval_status   text not null default 'draft'
                      check (approval_status in ('draft','reviewed','needs_revision','approved')),
  agent_review      jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists workspace_project_outputs_project_idx
  on public.workspace_project_outputs (project_id);

alter table public.workspace_project_outputs enable row level security;
create policy "workspace_project_outputs_own" on public.workspace_project_outputs
  for all using (exists (
    select 1 from public.workspace_projects p
    where p.id = project_id and p.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.workspace_projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));
create policy "workspace_project_outputs_admin" on public.workspace_project_outputs
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 4. workspace_output_versions — lịch sử phiên bản của 1 Output
--
-- `created_at` map từ `editedAt` của `OutputVersionRecord` (cùng ý nghĩa:
-- thời điểm bản này được tạo/sửa) — giữ tên theo đặc tả v2.
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_output_versions (
  id             uuid primary key default gen_random_uuid(),
  output_id      uuid not null references public.workspace_project_outputs(id) on delete cascade,
  version_number int  not null,
  content        text not null default '',
  created_at     timestamptz not null default now(),
  unique (output_id, version_number)
);

create index if not exists workspace_output_versions_output_idx
  on public.workspace_output_versions (output_id);

alter table public.workspace_output_versions enable row level security;
create policy "workspace_output_versions_own" on public.workspace_output_versions
  for all using (exists (
    select 1 from public.workspace_project_outputs o
    join public.workspace_projects p on p.id = o.project_id
    where o.id = output_id and p.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.workspace_project_outputs o
    join public.workspace_projects p on p.id = o.project_id
    where o.id = output_id and p.user_id = auth.uid()
  ));
create policy "workspace_output_versions_admin" on public.workspace_output_versions
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 5. workspace_output_reflections — suy ngẫm của user về 1 Output
--
-- (c) ĐÍNH CHÍNH so với đặc tả v2 (chỉ có `reflection_text`):
--     `ReflectionAnswer` thật là **{question, answer, submittedAt}**. Bỏ
--     `question` sẽ mất câu hỏi gốc — không biết user đang trả lời điều gì.
--     Giữ đủ cả 2, `answer` chính là `reflection_text` trong đặc tả.
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_output_reflections (
  id           uuid primary key default gen_random_uuid(),
  output_id    uuid not null references public.workspace_project_outputs(id) on delete cascade,
  question     text not null default '',
  answer       text not null default '',
  submitted_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists workspace_output_reflections_output_idx
  on public.workspace_output_reflections (output_id);

alter table public.workspace_output_reflections enable row level security;
create policy "workspace_output_reflections_own" on public.workspace_output_reflections
  for all using (exists (
    select 1 from public.workspace_project_outputs o
    join public.workspace_projects p on p.id = o.project_id
    where o.id = output_id and p.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.workspace_project_outputs o
    join public.workspace_projects p on p.id = o.project_id
    where o.id = output_id and p.user_id = auth.uid()
  ));
create policy "workspace_output_reflections_admin" on public.workspace_output_reflections
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 6. workspace_project_history — nhật ký sự kiện của phiên
--
-- (e) KẾT LUẬN TỰ ĐÁNH GIÁ (đặc tả v2 giao Claude Code tự quyết + báo cáo):
--     **CẦN bảng riêng.** Đặc tả gợi ý "có thể suy ra từ
--     workspace_output_versions + workspace_project_steps cộng lại" —
--     KHÔNG suy ra được đầy đủ:
--       - `HistoryEntry` ghi cả sự kiện KHÔNG phải step và KHÔNG phải
--         version: tạm dừng, tiếp tục, hoàn thành phiên.
--       - Tạm dừng/tiếp tục có thể xảy ra NHIỀU LẦN trong 1 phiên, nhưng
--         `WorkspaceSessionRecord` chỉ giữ `pausedAt`/`resumedAt` dạng 1
--         giá trị đơn (bị ghi đè mỗi lần) — `history[]` là NƠI DUY NHẤT
--         còn lưu được đủ các lần đó.
--       - `workspace_project_steps` có `unique (project_id, step_id)` nên
--         cũng chỉ giữ được lần cuối của mỗi bước, không giữ được chuỗi
--         quay lui draft -> review -> revision -> draft.
--     Bảng append-only, 3 cột, chi phí gần như bằng 0 so với việc mất vĩnh
--     viễn nhật ký phiên.
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_project_history (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.workspace_projects(id) on delete cascade,
  label       text not null,
  occurred_at timestamptz not null default now()
);

create index if not exists workspace_project_history_project_idx
  on public.workspace_project_history (project_id, occurred_at);

alter table public.workspace_project_history enable row level security;
create policy "workspace_project_history_own" on public.workspace_project_history
  for all using (exists (
    select 1 from public.workspace_projects p
    where p.id = project_id and p.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.workspace_projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));
create policy "workspace_project_history_admin" on public.workspace_project_history
  for all using (public.is_app_admin()) with check (public.is_app_admin());
