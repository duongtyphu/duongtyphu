-- Phase 32 — Schema v2, Bước 6: gộp Nhu cầu (work_needs) + tách Nghề nghiệp.
--
-- Áp dụng qua Supabase MCP (apply_migration), track lại ở đây theo convention.
--
-- ⚠️ ĐÍNH CHÍNH SỐ LIỆU CỦA BÁO CÁO BƯỚC 0 (lỗi do chính tôi gây ra):
-- Báo cáo Bước 0 ghi "PROFESSION_GROUPS 50 mục, gộp lộn 3 loại (10 nghề +
-- 10 công cụ + 30 tình huống) trong 1 mảng". SAI. Đọc lại
-- `src/data/khong-gian-ai/index.ts` theo đúng biên từng mảng:
--   NEED_CATEGORIES    (dòng 23)  =  9 mục
--   PROFESSION_GROUPS  (dòng 223) = 10 mục  <- SẠCH, đúng 10 nghề
--   AI_TOOLS           (dòng 685) = 10 mục  <- mảng RIÊNG
--   AI_PROMPTS         (dòng 961) = 30 mục  <- mảng RIÊNG
-- Con số 50 là do regex quét slug chạy quá biên mảng PROFESSION_GROUPS tới
-- hết file, gộp nhầm cả AI_TOOLS + AI_PROMPTS vào. Không hề có chuyện 3
-- khái niệm bị trộn trong 1 mảng — chúng vốn đã tách sẵn từ đầu.
--
-- Hệ quả cho Bước 6:
--   - "10 nghề"      -> vẫn đúng, tạo `ckos_occupations` bên dưới.
--   - "10 công cụ"   -> không cần xử lý: AI_TOOLS là mảng riêng và ĐÃ
--                       migrate sang bảng `tools` từ trước (đã @deprecated).
--   - "30 tình huống"-> KHÔNG phải khái niệm mới: đó là AI_PROMPTS, tức
--                       PROMPT, đã có sẵn bảng `prompts`. Việc migrate 30
--                       prompt này là quyết định NỘI DUNG (bảng `prompts`
--                       hiện chỉ 2 dòng Published) — CHƯA làm ở migration
--                       này, chờ Founder xác nhận.

-- ---------------------------------------------------------------------------
-- 1. Chuẩn hoá 3 cặp slug lệch giữa work_needs (DB) và NEED_CATEGORIES (tĩnh)
--
-- Chọn slug canonical = slug đang chạy thật ở route `/portal/aiworkspace/[slug]`
-- (NEED_CATEGORIES), vì đó là route production đang phục vụ người dùng:
--   tao-video  -> lam-video
--   coding     -> lap-trinh
--   automation -> tu-dong-hoa
--
-- An toàn: đã grep lại toàn bộ `src/` — `work_needs.id` CHỈ dùng làm React
-- key và `itemId` khi mở phiên Companion workspace (`WorkNeedSection`),
-- KHÔNG phải khoá tra cứu ở bất kỳ đâu.
-- ---------------------------------------------------------------------------
update public.work_needs set id='lam-video' where id='tao-video';
update public.work_needs set id='lap-trinh' where id='coding';
update public.work_needs set id='tu-dong-hoa' where id='automation';

-- ---------------------------------------------------------------------------
-- 2. Gộp field giàu hơn của NEED_CATEGORIES vào work_needs
--
-- work_needs trở thành NGUỒN DUY NHẤT cho khái niệm "nhu cầu công việc".
--
-- GIỮ CẢ 2 MÔ TẢ, không đè lên nhau — đây là 2 nội dung thật cho 2 bề mặt
-- khác nhau, đè một cái sẽ đổi giao diện đang chạy:
--   `description`     = câu ngắn hiện trên thẻ ở /portal/hocvienai (giữ nguyên)
--   `longDescription` = đoạn dài hiện ở trang chi tiết /portal/aiworkspace/[slug]
--
-- 4 nhu cầu chỉ có trong work_needs (ban-hang / hoc-tap / van-phong /
-- dau-tu-du-an) không có bản tĩnh tương ứng -> các field mới để RỖNG, không
-- bịa nội dung.
--
-- LƯU Ý dữ liệu có sẵn (KHÔNG phải lỗi do bước này gây ra, giữ verbatim):
-- `ctaHref` của NEED_CATEGORIES trỏ tới `/khong-gian-ai/...` — route này
-- KHÔNG TỒN TẠI trong `src/app`. Đây là link chết có sẵn từ trước trong dữ
-- liệu tĩnh; migrate nguyên trạng, không tự bịa href mới.
-- ---------------------------------------------------------------------------
update public.work_needs set data='{"title":"Viết nội dung","description":"Bài viết, caption, kịch bản, email — nhanh và đúng giọng văn.","icon":"✍️","longDescription":"Dùng AI để tạo bài viết, email, caption, landing page và mọi loại nội dung văn bản nhanh hơn gấp 5-10 lần so với viết tay.","color":"blue","subtasks":["Viết bài Facebook","Viết Blog","Viết Email","Viết Landing Page","Viết SEO","Viết kịch bản"],"recommendedToolSlugs":["chatgpt","claude","gemini"],"relatedArticleSlugs":["quy-trinh-dung-ai-viet-bai-facebook","cach-dung-claude-viet-noi-dung-dai","10-prompt-co-ban-cho-nguoi-moi"],"ctaLabel":"Xem Prompt mẫu","ctaHref":"/khong-gian-ai/prompts?need=viet-noi-dung"}'::jsonb where id='viet-noi-dung';
update public.work_needs set data='{"title":"Thiết kế hình ảnh","description":"Banner, hình minh hoạ, ảnh sản phẩm bằng AI.","icon":"🎨","longDescription":"Tạo banner, thumbnail, poster và infographic chuyên nghiệp bằng AI mà không cần kỹ năng thiết kế chuyên sâu.","color":"purple","subtasks":["Tạo banner mạng xã hội","Tạo thumbnail YouTube","Tạo poster sự kiện","Tạo infographic"],"recommendedToolSlugs":["canva-ai","midjourney"],"relatedArticleSlugs":["ai-image-la-gi-nen-bat-dau-voi-cong-cu-nao"],"ctaLabel":"Khám phá công cụ","ctaHref":"/khong-gian-ai/cong-cu?need=thiet-ke-hinh-anh"}'::jsonb where id='thiet-ke-hinh-anh';
update public.work_needs set data='{"title":"Tạo video","description":"Video ngắn, voice, phụ đề — dựng nhanh với AI.","icon":"🎬","longDescription":"AI hỗ trợ toàn bộ quy trình sản xuất video: từ viết kịch bản, dựng clip, thêm voiceover cho đến tạo short video viral.","color":"red","subtasks":["Viết kịch bản video","Chỉnh sửa video AI","Tạo voiceover tự động","Tạo short video"],"recommendedToolSlugs":["runway","capcut-ai"],"relatedArticleSlugs":[],"ctaLabel":"Xem hướng dẫn","ctaHref":"/khong-gian-ai/prompts?need=lam-video"}'::jsonb where id='lam-video';
update public.work_needs set data='{"title":"Marketing","description":"Kế hoạch nội dung, quảng cáo, chiến dịch ra mắt.","icon":"📣","longDescription":"Lên chiến lược, phân tích đối thủ và tạo nội dung quảng cáo hiệu quả với AI — tiết kiệm chi phí thuê agency.","color":"orange","subtasks":["Lên chiến lược marketing","Tạo content quảng cáo","Phân tích đối thủ","Viết email marketing"],"recommendedToolSlugs":["chatgpt","perplexity","gemini"],"relatedArticleSlugs":["ung-dung-ai-trong-affiliate-marketing","quy-trinh-dung-ai-viet-bai-facebook"],"ctaLabel":"Xem Prompt mẫu","ctaHref":"/khong-gian-ai/prompts?need=marketing"}'::jsonb where id='marketing';
update public.work_needs set data='{"title":"Bán hàng","description":"Kịch bản tư vấn, email chốt đơn, chăm sóc khách.","icon":"🛒","longDescription":"","color":"","subtasks":[],"recommendedToolSlugs":[],"relatedArticleSlugs":[],"ctaLabel":"","ctaHref":""}'::jsonb where id='ban-hang';
update public.work_needs set data='{"title":"Nghiên cứu","description":"Tổng hợp thông tin, phân tích thị trường, đối thủ.","icon":"🔎","longDescription":"Tìm kiếm, tổng hợp và kiểm chứng thông tin từ nhiều nguồn nhanh hơn gấp 10 lần so với tìm kiếm thủ công.","color":"indigo","subtasks":["Tìm kiếm thông tin","Tổng hợp nhiều nguồn","Fact-check thông tin","Nghiên cứu đối thủ"],"recommendedToolSlugs":["perplexity","chatgpt"],"relatedArticleSlugs":["cach-dung-perplexity-nghien-cuu-nhanh-hon","lo-trinh-hoc-ai-cho-nguoi-moi"],"ctaLabel":"Xem Prompt mẫu","ctaHref":"/khong-gian-ai/prompts?need=nghien-cuu"}'::jsonb where id='nghien-cuu';
update public.work_needs set data='{"title":"Phân tích dữ liệu","description":"Đọc số liệu, tìm insight, tóm tắt báo cáo.","icon":"📊","longDescription":"Đưa số liệu thô vào AI và nhận ngay báo cáo phân tích, insight và khuyến nghị hành động trong vài phút.","color":"cyan","subtasks":["Đọc và tóm tắt báo cáo","Phân tích số liệu bán hàng","Tạo insight từ dữ liệu","Vẽ biểu đồ giải thích"],"recommendedToolSlugs":["chatgpt","perplexity"],"relatedArticleSlugs":["cach-dung-ai-phan-tich-du-lieu-co-ban"],"ctaLabel":"Xem Prompt mẫu","ctaHref":"/khong-gian-ai/prompts?need=phan-tich-du-lieu"}'::jsonb where id='phan-tich-du-lieu';
update public.work_needs set data='{"title":"Học tập","description":"Tóm tắt kiến thức, luyện tập, giải thích lại cho dễ hiểu.","icon":"📚","longDescription":"","color":"","subtasks":[],"recommendedToolSlugs":[],"relatedArticleSlugs":[],"ctaLabel":"","ctaHref":""}'::jsonb where id='hoc-tap';
update public.work_needs set data='{"title":"Văn phòng","description":"Soạn thảo văn bản, biên bản họp, email công việc.","icon":"🗂️","longDescription":"","color":"","subtasks":[],"recommendedToolSlugs":[],"relatedArticleSlugs":[],"ctaLabel":"","ctaHref":""}'::jsonb where id='van-phong';
update public.work_needs set data='{"title":"Coding","description":"Viết code, sửa lỗi, giải thích đoạn code khó hiểu.","icon":"💻","longDescription":"Viết code nhanh hơn, debug thông minh hơn và review pull request tự động với sự hỗ trợ của AI.","color":"green","subtasks":["Viết code tự động","Debug lỗi","Đánh giá code","Tạo API"],"recommendedToolSlugs":["cursor","chatgpt","claude"],"relatedArticleSlugs":["cach-dung-cursor-cho-nguoi-moi-hoc-lap-trinh"],"ctaLabel":"Xem Prompt mẫu","ctaHref":"/khong-gian-ai/prompts?need=lap-trinh"}'::jsonb where id='lap-trinh';
update public.work_needs set data='{"title":"Automation","description":"Kết nối công cụ, tự động hoá quy trình lặp lại.","icon":"⚙️","longDescription":"Kết nối các ứng dụng, xây dựng workflow tự động và lên lịch đăng bài không cần can thiệp thủ công.","color":"slate","subtasks":["Kết nối ứng dụng","Tạo workflow tự động","Auto-posting nội dung","Tự động hóa email"],"recommendedToolSlugs":["n8n","make"],"relatedArticleSlugs":["tu-dong-hoa-cong-viec-voi-n8n-la-gi"],"ctaLabel":"Khám phá công cụ","ctaHref":"/khong-gian-ai/cong-cu?need=tu-dong-hoa"}'::jsonb where id='tu-dong-hoa';
update public.work_needs set data='{"title":"Đầu tư / dự án","description":"Lập kế hoạch, đánh giá rủi ro, theo dõi tiến độ.","icon":"📈","longDescription":"","color":"","subtasks":[],"recommendedToolSlugs":[],"relatedArticleSlugs":[],"ctaLabel":"","ctaHref":""}'::jsonb where id='dau-tu-du-an';
update public.work_needs set data='{"title":"Dịch thuật","description":"Dịch văn bản, tài liệu kỹ thuật và trang web sang nhiều ngôn ngữ với chất lượng tự nhiên, giữ nguyên ngữ cảnh.","icon":"🌐","longDescription":"Dịch văn bản, tài liệu kỹ thuật và trang web sang nhiều ngôn ngữ với chất lượng tự nhiên, giữ nguyên ngữ cảnh.","color":"teal","subtasks":["Dịch văn bản thông thường","Dịch tài liệu kỹ thuật","Dịch đa ngôn ngữ","Bản địa hóa nội dung"],"recommendedToolSlugs":["chatgpt","gemini","deepl-ai"],"relatedArticleSlugs":[],"ctaLabel":"Xem Prompt mẫu","ctaHref":"/khong-gian-ai/prompts?need=dich-thuat"}'::jsonb where id='dich-thuat';

-- ---------------------------------------------------------------------------
-- 3. Thêm "Dịch thuật" — nhu cầu chỉ tồn tại ở NEED_CATEGORIES
--
-- Nếu không thêm, khi code chuyển sang đọc work_needs thì
-- /portal/aiworkspace/dich-thuat sẽ 404 (hiện đang chạy được).
-- ---------------------------------------------------------------------------
insert into public.work_needs (id, data, status, "order") values ('dich-thuat', '{"title":"Dịch thuật","description":"Dịch văn bản, tài liệu kỹ thuật và trang web sang nhiều ngôn ngữ với chất lượng tự nhiên, giữ nguyên ngữ cảnh.","icon":"🌐","longDescription":"Dịch văn bản, tài liệu kỹ thuật và trang web sang nhiều ngôn ngữ với chất lượng tự nhiên, giữ nguyên ngữ cảnh.","color":"teal","subtasks":["Dịch văn bản thông thường","Dịch tài liệu kỹ thuật","Dịch đa ngôn ngữ","Bản địa hóa nội dung"],"recommendedToolSlugs":["chatgpt","gemini","deepl-ai"],"relatedArticleSlugs":[],"ctaLabel":"Xem Prompt mẫu","ctaHref":"/khong-gian-ai/prompts?need=dich-thuat"}'::jsonb, 'Published', 12) on conflict (id) do update set data=excluded.data;

-- ---------------------------------------------------------------------------
-- 4. ckos_occupations — bảng lookup nghề nghiệp
--
-- Seed đúng 10 nghề THẬT từ PROFESSION_GROUPS, copy verbatim slug/title/
-- description/emoji — không bịa thêm nghề nào.
--
-- Dùng để chuẩn hoá `members.occupation` (hiện là text tự do: 14/16 dòng
-- NULL, 2 dòng "Nhà đầu tư"). KHÔNG đổi kiểu cột `members.occupation` ở
-- migration này — đổi sang FK sẽ làm 2 dòng text hiện có mồ côi ngay lập
-- tức; việc chuyển sang chọn-từ-danh-sách làm ở tầng UI trước (Onboarding
-- + /portal/account), khi mọi dòng đã có giá trị khớp slug mới siết kiểu.
-- 2 dòng "Nhà đầu tư" khớp đúng nghề `nha-dau-tu` đã seed.
-- ---------------------------------------------------------------------------
create table if not exists public.ckos_occupations (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  icon        text,
  "order"     int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

insert into public.ckos_occupations (slug, name, description, icon, "order") values
  ('dan-van-phong', 'Dân văn phòng', 'Ứng dụng AI vào Word, Excel, PowerPoint, email, báo cáo, họp và xử lý tài liệu hằng ngày.', '👨‍💼', 0),
  ('nguoi-ban-hang-va-kinh-doanh', 'Người bán hàng & kinh doanh', 'AI hỗ trợ viết mô tả sản phẩm hấp dẫn, trả lời khách hàng nhanh hơn và phân tích dữ liệu bán hàng để tối ưu doanh thu.', '🛒', 1),
  ('affiliate-marketing', 'Affiliate Marketing', 'Dùng AI để nghiên cứu sản phẩm, tạo nội dung review và xây dựng hệ thống affiliate bán chạy hơn mà ít tốn công sức hơn.', '🤝', 2),
  ('content-creator', 'Content Creator', 'AI là cộng sự đắc lực cho content creator — từ ý tưởng nội dung, kịch bản video đến thiết kế thumbnail trong vài phút.', '🎥', 3),
  ('designer', 'Designer', 'AI không thay thế designer mà giúp designer làm việc nhanh hơn — tạo concept, generate tài sản hình ảnh và viết brief.', '🖌️', 4),
  ('lap-trinh-vien', 'Lập trình viên', 'AI giúp lập trình viên viết code nhanh hơn, debug chính xác hơn và hiểu codebase lạ trong vài phút thay vì vài giờ.', '👨‍💻', 5),
  ('sinh-vien', 'Sinh viên', 'AI giúp sinh viên nghiên cứu tài liệu nhanh hơn, tóm tắt sách giáo khoa, dịch tài liệu tiếng Anh và lên kế hoạch học tập.', '🎓', 6),
  ('giao-vien', 'Giáo viên', 'AI hỗ trợ giáo viên soạn bài giảng, tạo bài kiểm tra, giải thích khái niệm khó và dịch tài liệu nước ngoài cho học sinh.', '👩‍🏫', 7),
  ('chu-doanh-nghiep', 'Chủ doanh nghiệp', 'AI giúp chủ doanh nghiệp tiết kiệm thời gian vận hành, phân tích thị trường nhanh và tự động hóa các quy trình lặp đi lặp lại.', '📈', 8),
  ('nha-dau-tu', 'Nhà đầu tư', 'Sử dụng AI để nghiên cứu thông tin, phân tích dữ liệu, tóm tắt tài liệu và ra quyết định thận trọng hơn.', '💰', 9)
on conflict (slug) do nothing;

alter table public.ckos_occupations enable row level security;
create policy "ckos_occupations_read" on public.ckos_occupations
  for select using (true);
create policy "ckos_occupations_admin" on public.ckos_occupations
  for all using (public.is_app_admin()) with check (public.is_app_admin());
