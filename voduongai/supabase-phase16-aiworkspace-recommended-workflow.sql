-- Việc 11 — /portal/aiworkspace: tách RECOMMENDED_WORKSPACES (8 mục) +
-- AI_WORKFLOWS (4 mục) khỏi src/data/portal/ai-workspace.ts sang bảng
-- Supabase quản qua Admin.
--
-- Lưu ý quan trọng khi Founder sửa `id` của recommended_workspace qua
-- Admin: src/lib/portal/foundation/mission-catalog.ts's
-- RECOMMENDED_WORKSPACE_TO_MISSION là map TĨNH RIÊNG (không migrate ở
-- việc này), khoá theo đúng id gốc (5/8 id có map). Đổi id sẽ làm
-- missionId rơi về undefined (không crash, chỉ mất liên kết Mission).
--
-- ai_workflow_sections KHÁC HẲN bảng `sop` (Workflow/SOP đầy đủ đã Full ở
-- /admin/ckos/sop) — đã xác nhận qua audit, không trùng id/schema.

create table if not exists recommended_workspace (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table recommended_workspace enable row level security;

drop policy if exists "recommended_workspace_public_select" on recommended_workspace;
create policy "recommended_workspace_public_select" on recommended_workspace
  for select using (status = 'Published');

insert into recommended_workspace (id, data, status, "order") values
  ('viet-bai-facebook', jsonb_build_object('title', 'Viết bài Facebook', 'goal', 'Viết một bài đăng thu hút tương tác cho trang/nhóm của bạn.', 'expectedOutput', '1 bài đăng Facebook hoàn chỉnh', 'estimatedTime', '15 phút', 'suggestedTools', jsonb_build_array('ChatGPT', 'Claude')), 'Published', 0),
  ('tao-landing-page', jsonb_build_object('title', 'Tạo Landing Page', 'goal', 'Dựng nội dung + bố cục cho một trang đích bán sản phẩm/dịch vụ.', 'expectedOutput', 'Outline landing page + copy từng phần', 'estimatedTime', '45 phút', 'suggestedTools', jsonb_build_array('ChatGPT', 'Gamma')), 'Published', 1),
  ('thiet-ke-banner', jsonb_build_object('title', 'Thiết kế Banner', 'goal', 'Tạo banner quảng cáo hoặc bìa bài viết bằng AI.', 'expectedOutput', '1-3 mẫu banner', 'estimatedTime', '20 phút', 'suggestedTools', jsonb_build_array('Canva', 'Gemini')), 'Published', 2),
  ('lam-video-ngan', jsonb_build_object('title', 'Làm Video ngắn', 'goal', 'Dựng một video ngắn (Reels/TikTok) từ ý tưởng có sẵn.', 'expectedOutput', 'Kịch bản + video ngắn', 'estimatedTime', '60 phút', 'suggestedTools', jsonb_build_array('ChatGPT', 'Canva')), 'Published', 3),
  ('viet-email-ban-hang', jsonb_build_object('title', 'Viết Email bán hàng', 'goal', 'Soạn chuỗi email thuyết phục khách hàng tiềm năng.', 'expectedOutput', 'Chuỗi 3 email', 'estimatedTime', '30 phút', 'suggestedTools', jsonb_build_array('Claude', 'ChatGPT')), 'Published', 4),
  ('phan-tich-khach-hang', jsonb_build_object('title', 'Phân tích khách hàng', 'goal', 'Xây chân dung khách hàng mục tiêu chi tiết.', 'expectedOutput', '1 bản mô tả chân dung khách hàng', 'estimatedTime', '25 phút', 'suggestedTools', jsonb_build_array('Perplexity', 'ChatGPT')), 'Published', 5),
  ('ke-hoach-30-ngay', jsonb_build_object('title', 'Lập kế hoạch nội dung 30 ngày', 'goal', 'Lên lịch nội dung cho một kênh trong 30 ngày tới.', 'expectedOutput', 'Bảng kế hoạch nội dung 30 ngày', 'estimatedTime', '40 phút', 'suggestedTools', jsonb_build_array('ChatGPT', 'NotebookLM')), 'Published', 6),
  ('tao-prompt-chuyen-nghiep', jsonb_build_object('title', 'Tạo Prompt chuyên nghiệp', 'goal', 'Viết một prompt chất lượng cao cho công việc lặp lại của bạn.', 'expectedOutput', '1 prompt template có thể tái sử dụng', 'estimatedTime', '15 phút', 'suggestedTools', jsonb_build_array('ChatGPT', 'Claude')), 'Published', 7)
on conflict (id) do nothing;

create table if not exists ai_workflow_sections (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ai_workflow_sections enable row level security;

drop policy if exists "ai_workflow_sections_public_select" on ai_workflow_sections;
create policy "ai_workflow_sections_public_select" on ai_workflow_sections
  for select using (status = 'Published');

insert into ai_workflow_sections (id, data, status, "order") values
  ('lam-video-ngan', jsonb_build_object('title', 'Làm video ngắn', 'steps', jsonb_build_array('Nghiên cứu', 'Kịch bản', 'Thu âm', 'Hình ảnh', 'Dựng video', 'Phụ đề', 'Đăng bài'), 'suggestedTools', jsonb_build_array('ChatGPT', 'Canva')), 'Published', 0),
  ('viet-ebook', jsonb_build_object('title', 'Viết Ebook', 'steps', jsonb_build_array('Ý tưởng', 'Dàn ý', 'Nghiên cứu', 'Bản nháp', 'Thiết kế', 'Xuất bản'), 'suggestedTools', jsonb_build_array('ChatGPT', 'NotebookLM', 'Canva')), 'Published', 1),
  ('xay-landing-page', jsonb_build_object('title', 'Xây Landing Page', 'steps', jsonb_build_array('Khách hàng', 'Vấn đề', 'Giải pháp', 'Nội dung', 'Thiết kế', 'Đánh giá', 'Đăng bài'), 'suggestedTools', jsonb_build_array('ChatGPT', 'Gamma')), 'Published', 2),
  ('affiliate-content', jsonb_build_object('title', 'Affiliate Content', 'steps', jsonb_build_array('Ngách', 'Khách hàng', 'Điểm nhấn', 'Nội dung', 'CTA', 'Theo dõi'), 'suggestedTools', jsonb_build_array('ChatGPT', 'Claude')), 'Published', 3)
on conflict (id) do nothing;
