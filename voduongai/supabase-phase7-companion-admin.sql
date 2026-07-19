-- Phase 7 migration: Companion Admin CMS (AI Mentor) — 9 bảng mới, cùng
-- khuôn generic (id text/data jsonb/status/order) như Phase 2-6, để tái
-- dùng nguyên API /api/admin/collections/[table] — không viết backend mới.
--
-- 2 bảng companion_persona / companion_conversation_strategy đã tồn tại từ
-- trước (mồ côi — không nằm trong SUPABASE_COLLECTIONS, không code nào đọc)
-- nhưng CHƯA có RLS policy nào (xác nhận qua pg_policies) — migration này bổ
-- sung policy đọc-công-khai-khi-Published cho 2 bảng đó (an toàn, chỉ thêm,
-- không đổi dữ liệu), cho nhất quán với mọi collection khác, dù Portal
-- chưa đọc bảng nào trong Phase 7 này.
--
-- KHÔNG tự apply — chờ Founder duyệt riêng trước khi chạy trong Supabase
-- SQL Editor / apply_migration.
--
-- Ghi chú thiết kế companion_versions: không thêm cột riêng (version_number,
-- changed_by...) — vì không có CHECK constraint nào trên cột `status` ở họ
-- bảng generic này (xác nhận qua pg_constraint), nên lịch sử phiên bản 5
-- trạng thái (Draft/Review/Approved/Published/Archived) lưu thẳng vào cột
-- `status` có sẵn; version/changedBy/approvedBy/changeSummary/snapshot nằm
-- trong `data` jsonb. Rollback = đọc `data.snapshot` của 1 dòng cũ, ghi đè
-- lên các bảng singleton hiện tại qua update() có sẵn, rồi tự thêm 1 dòng
-- companion_versions mới ghi lại chính hành động rollback đó (không sửa/xoá
-- lịch sử cũ).

-- ===== Bổ sung RLS cho 2 bảng đã có =====
alter table companion_persona enable row level security;
drop policy if exists "public read published" on companion_persona;
create policy "public read published" on companion_persona for select using (status = 'Published');

alter table companion_conversation_strategy enable row level security;
drop policy if exists "public read published" on companion_conversation_strategy;
create policy "public read published" on companion_conversation_strategy for select using (status = 'Published');

-- ===== companion_conversation_examples =====
-- Tab "Hội thoại" — mẫu hội thoại / tình huống đặc biệt.
create table if not exists companion_conversation_examples (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_conversation_examples enable row level security;
drop policy if exists "public read published" on companion_conversation_examples;
create policy "public read published" on companion_conversation_examples for select using (status = 'Published');

-- ===== companion_knowledge_refs =====
-- Tab "Tri thức" — CHỈ lưu tham chiếu {sourceCollection, sourceId}, KHÔNG
-- copy nội dung CKOS. sourceId luôn lưu dạng text (kể cả khi nguồn gốc là
-- case_studies.id kiểu bigint — ép String() phía client trước khi ghi).
create table if not exists companion_knowledge_refs (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_knowledge_refs enable row level security;
drop policy if exists "public read published" on companion_knowledge_refs;
create policy "public read published" on companion_knowledge_refs for select using (status = 'Published');

-- ===== companion_memory_policy =====
-- Tab "Trí nhớ" — CHÍNH SÁCH ghi nhớ (loại thông tin/điều kiện ghi/thời
-- gian lưu/điều kiện quên/quyền riêng tư), KHÔNG phải dữ liệu trí nhớ thật
-- của người dùng nào. Seed 6 dòng cố định theo đúng liệt kê của Founder.
create table if not exists companion_memory_policy (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_memory_policy enable row level security;
drop policy if exists "public read published" on companion_memory_policy;
create policy "public read published" on companion_memory_policy for select using (status = 'Published');

insert into companion_memory_policy (id, data, status, "order") values
  ('memory_goal', '{"id":"memory_goal","memoryType":"Mục tiêu","allowed":true,"writeCondition":"Người dùng tự khai báo mục tiêu qua widget chọn mục tiêu","retention":"Đến khi người dùng đổi mục tiêu khác","forgetCondition":"Người dùng xoá/đổi mục tiêu","privacyNote":"Chỉ hiển thị cho chính người dùng đó"}'::jsonb, 'Published', 1),
  ('memory_preference', '{"id":"memory_preference","memoryType":"Sở thích","allowed":true,"writeCondition":"Suy ra từ hành vi sử dụng thật (không hỏi trực tiếp)","retention":"Không giới hạn, cập nhật liên tục","forgetCondition":"Người dùng yêu cầu xoá dữ liệu tài khoản","privacyNote":"Không chia sẻ ra ngoài phạm vi cá nhân hoá nội dung"}'::jsonb, 'Published', 2),
  ('memory_progress', '{"id":"memory_progress","memoryType":"Tiến độ học","allowed":true,"writeCondition":"Ghi nhận khi hoàn thành 1 hoạt động thật trong Workspace/Học viện","retention":"Không giới hạn","forgetCondition":"Người dùng yêu cầu xoá dữ liệu tài khoản","privacyNote":"Chỉ hiển thị cho chính người dùng đó"}'::jsonb, 'Published', 3),
  ('memory_reflection', '{"id":"memory_reflection","memoryType":"Reflection","allowed":true,"writeCondition":"Người dùng tự viết câu trả lời cho câu hỏi phản tư","retention":"Không giới hạn","forgetCondition":"Người dùng tự xoá từng mục","privacyNote":"Nội dung nhạy cảm — không dùng cho mục đích khác ngoài cá nhân hoá đồng hành"}'::jsonb, 'Published', 4),
  ('memory_conversation_context', '{"id":"memory_conversation_context","memoryType":"Ngữ cảnh hội thoại","allowed":false,"writeCondition":"Chưa áp dụng — chưa có Chat runtime","retention":"Chưa áp dụng","forgetCondition":"Chưa áp dụng","privacyNote":"Sẽ xác định lại khi Chat runtime được xây dựng"}'::jsonb, 'Published', 5),
  ('memory_long_term', '{"id":"memory_long_term","memoryType":"Trí nhớ dài hạn (Mentor Memory)","allowed":false,"writeCondition":"Chưa áp dụng — chưa có Memory Engine","retention":"Chưa áp dụng","forgetCondition":"Chưa áp dụng","privacyNote":"Sẽ xác định lại khi Memory Engine được xây dựng"}'::jsonb, 'Published', 6)
on conflict (id) do nothing;

-- ===== companion_coaching_strategy =====
-- Tab "Dẫn dắt & Huấn luyện" — chiến lược chung (singleton, id='current').
create table if not exists companion_coaching_strategy (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_coaching_strategy enable row level security;
drop policy if exists "public read published" on companion_coaching_strategy;
create policy "public read published" on companion_coaching_strategy for select using (status = 'Published');

-- ===== companion_training_scenarios =====
-- Tab "Dẫn dắt & Huấn luyện" — tình huống huấn luyện mẫu.
create table if not exists companion_training_scenarios (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_training_scenarios enable row level security;
drop policy if exists "public read published" on companion_training_scenarios;
create policy "public read published" on companion_training_scenarios for select using (status = 'Published');

-- ===== companion_capabilities =====
-- Tab "Công cụ" — danh mục năng lực trung thực. `data.readiness` là trạng
-- thái THẬT của năng lực ("Đã có"/"Sắp phát triển") — KHÁC với cột `status`
-- ngoài (Draft/Published = trạng thái xuất bản của chính dòng danh mục này).
-- Đã rà soát toàn bộ codebase trước khi seed: KHÔNG có tool-calling
-- harness/chat runtime nào tồn tại cho Companion end-user hôm nay — cả 11
-- dòng đều "Sắp phát triển", không bịa 1 dòng "Đã có" nào cho đủ số.
create table if not exists companion_capabilities (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_capabilities enable row level security;
-- Không thêm policy đọc công khai — đây là danh mục nội bộ Founder, không
-- phải nội dung Portal hiển thị (khớp đúng bảng #8-11 "không public" trong
-- plan đã duyệt).

insert into companion_capabilities (id, data, status, "order") values
  ('cap_ckos_search', '{"id":"cap_ckos_search","label":"Tìm kiếm Hệ tri thức (CKOS)","readiness":"Sắp phát triển","description":"Companion tự tìm Tool/Prompt/Workflow/Resource phù hợp trong CKOS theo ngữ cảnh hội thoại."}'::jsonb, 'Published', 1),
  ('cap_course_recommendation', '{"id":"cap_course_recommendation","label":"Gợi ý khoá học","readiness":"Sắp phát triển","description":"Companion tự đề xuất lộ trình/bài học Học viện AI phù hợp."}'::jsonb, 'Published', 2),
  ('cap_tool_recommendation', '{"id":"cap_tool_recommendation","label":"Gợi ý công cụ AI","readiness":"Sắp phát triển","description":"Companion tự đề xuất Tool AI phù hợp với việc người dùng đang làm."}'::jsonb, 'Published', 3),
  ('cap_learning_progress', '{"id":"cap_learning_progress","label":"Theo dõi tiến độ học tập","readiness":"Sắp phát triển","description":"Companion đọc được tiến độ học tập thật để cá nhân hoá gợi ý."}'::jsonb, 'Published', 4),
  ('cap_reflection', '{"id":"cap_reflection","label":"Ghi nhận suy ngẫm (Reflection)","readiness":"Sắp phát triển","description":"Companion chủ động hỏi/ghi nhận reflection trong hội thoại."}'::jsonb, 'Published', 5),
  ('cap_agent', '{"id":"cap_agent","label":"Tác vụ tự động (Agent)","readiness":"Sắp phát triển","description":"Companion tự thực hiện 1 chuỗi hành động thay người dùng."}'::jsonb, 'Published', 6),
  ('cap_tool_calling', '{"id":"cap_tool_calling","label":"Gọi công cụ (Tool Calling)","readiness":"Sắp phát triển","description":"Companion gọi được các hàm/API bên ngoài trong lúc hội thoại."}'::jsonb, 'Published', 7),
  ('cap_mcp', '{"id":"cap_mcp","label":"Kết nối MCP","readiness":"Sắp phát triển","description":"Companion kết nối được các MCP server bên ngoài."}'::jsonb, 'Published', 8),
  ('cap_calendar', '{"id":"cap_calendar","label":"Lịch & nhắc việc","readiness":"Sắp phát triển","description":"Companion tạo/nhắc lịch thay người dùng."}'::jsonb, 'Published', 9),
  ('cap_email', '{"id":"cap_email","label":"Gửi email","readiness":"Sắp phát triển","description":"Companion soạn/gửi email thay người dùng."}'::jsonb, 'Published', 10),
  ('cap_voice', '{"id":"cap_voice","label":"Giọng nói","readiness":"Sắp phát triển","description":"Companion trò chuyện được bằng giọng nói."}'::jsonb, 'Published', 11)
on conflict (id) do nothing;

-- ===== companion_safety_rules =====
-- Tab "An toàn" — quy tắc an toàn/ứng xử.
create table if not exists companion_safety_rules (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_safety_rules enable row level security;
-- Không thêm policy đọc công khai — cấu hình an toàn nội bộ, không phải
-- nội dung Portal hiển thị (khớp đúng bảng #8-11 "không public" trong plan
-- đã duyệt).

-- ===== companion_test_sessions =====
-- Tab "Kiểm tra Companion" — log kiểm thử CỦA ADMIN, tách biệt vật lý hoàn
-- toàn khỏi reflections/memory_capsules (bảng người dùng thật). Không public
-- read (không phải nội dung Portal).
create table if not exists companion_test_sessions (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_test_sessions enable row level security;
-- Không thêm policy đọc công khai — chỉ Admin (service role) đọc được.

-- ===== companion_versions =====
-- Tab "Phiên bản & Xuất bản" — lịch sử publish. Không public read.
create table if not exists companion_versions (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_versions enable row level security;
-- Không thêm policy đọc công khai — chỉ Admin (service role) đọc được.
