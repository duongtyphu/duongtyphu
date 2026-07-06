-- ============================================================================
-- PHASE H.7 — Case Study Seed SQL (generated from REAL dry-run output of
-- scripts/phase-h7-seed-best-practices-case-studies.ts — NOT APPLIED)
-- ============================================================================
-- Sinh từ 8 case study THẬT (5 knowledge_seed_case_study + 3 student_success),
-- không bịa nội dung. Idempotent theo (legacy_source_id, source_system).
-- Ghi vào case_studies (canonical, Phase F) — KHÔNG đụng case_study (jsonb
-- legacy) hay sync script Phase E (vẫn xử lý riêng, độc lập).

-- ── Từ 30 phút xuống 5 phút khi viết email bằng AI (knowledge_seed_case_study) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'case-study-tu-30-phut-xuong-5-phut-viet-email' and source_system = 'knowledge_seed_case_study') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Từ 30 phút xuống 5 phút khi viết email bằng AI', 'tu-30-phut-xuong-5-phut-viet-email', 'Câu chuyện một nhân viên văn phòng rút ngắn thời gian viết email báo cáo khách hàng nhờ AI.', 'Trước đây, việc soạn một email báo cáo khách hàng mất khoảng 30 phút vì phải suy nghĩ câu từ và kiểm tra lại nhiều lần. Sau khi áp dụng prompt xin phản hồi và checklist kiểm tra email, thời gian giảm xuống còn khoảng 5 phút, trong khi email vẫn giữ được sự chuyên nghiệp và rõ ràng.', true, 'Published', 'case-study-tu-30-phut-xuong-5-phut-viet-email', 'knowledge_seed_case_study', now());
  end if;
end $$;

-- ── Giảm một nửa thời gian làm báo cáo tuần nhờ quy trình chuẩn (knowledge_seed_case_study) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'case-study-giam-nua-thoi-gian-lam-bao-cao-tuan' and source_system = 'knowledge_seed_case_study') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Giảm một nửa thời gian làm báo cáo tuần nhờ quy trình chuẩn', 'giam-nua-thoi-gian-lam-bao-cao-tuan', 'Một quản lý nhóm nhỏ áp dụng SOP và template báo cáo tuần, giảm thời gian làm báo cáo từ 1 giờ xuống 25 phút.', 'Trước đây, việc tổng hợp báo cáo tuần cho cả nhóm mất khoảng 1 giờ vì phải gom số liệu từ nhiều nguồn. Sau khi áp dụng SOP quy trình viết báo cáo tuần kết hợp với AI tổng hợp, thời gian giảm xuống còn khoảng 25 phút mỗi tuần.', true, 'Published', 'case-study-giam-nua-thoi-gian-lam-bao-cao-tuan', 'knowledge_seed_case_study', now());
  end if;
end $$;

-- ── Không còn bỏ sót việc cần làm sau cuộc họp (knowledge_seed_case_study) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'case-study-khong-con-bo-sot-viec-sau-hop' and source_system = 'knowledge_seed_case_study') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Không còn bỏ sót việc cần làm sau cuộc họp', 'khong-con-bo-sot-viec-sau-hop', 'Một trưởng nhóm dự án giải quyết vấn đề quên việc sau họp nhờ dùng AI tổng hợp biên bản.', 'Trước đây, sau mỗi cuộc họp thường có 1-2 việc bị bỏ sót vì ghi chép thủ công không đầy đủ. Sau khi áp dụng prompt tổng hợp việc cần làm sau họp, toàn bộ việc cần làm được liệt kê rõ ràng kèm người phụ trách ngay trong ngày họp.', true, 'Published', 'case-study-khong-con-bo-sot-viec-sau-hop', 'knowledge_seed_case_study', now());
  end if;
end $$;

-- ── Rút ngắn thời gian nghiên cứu chủ đề mới từ 2 ngày xuống nửa ngày (knowledge_seed_case_study) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'case-study-rut-ngan-thoi-gian-nghien-cuu' and source_system = 'knowledge_seed_case_study') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Rút ngắn thời gian nghiên cứu chủ đề mới từ 2 ngày xuống nửa ngày', 'rut-ngan-thoi-gian-nghien-cuu', 'Một nhân viên phải tìm hiểu chủ đề hoàn toàn mới trong thời gian gấp, dùng AI để rút ngắn quá trình nghiên cứu.', 'Trước đây, việc nghiên cứu một chủ đề hoàn toàn mới để chuẩn bị báo cáo mất khoảng 2 ngày vì phải đọc nhiều nguồn khác nhau. Sau khi dùng AI để tổng hợp góc nhìn tổng quan trước, rồi mới đào sâu vào phần quan trọng, thời gian giảm xuống còn nửa ngày.', true, 'Published', 'case-study-rut-ngan-thoi-gian-nghien-cuu', 'knowledge_seed_case_study', now());
  end if;
end $$;

-- ── Tự tin hơn khi thuyết trình nhờ chuẩn bị outline bằng AI (knowledge_seed_case_study) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'case-study-tu-tin-hon-khi-thuyet-trinh' and source_system = 'knowledge_seed_case_study') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Tự tin hơn khi thuyết trình nhờ chuẩn bị outline bằng AI', 'tu-tin-hon-khi-thuyet-trinh', 'Một nhân viên vốn ngại thuyết trình đã tự tin hơn hẳn sau khi dùng AI hỗ trợ dựng outline trước.', 'Trước đây, việc chuẩn bị thuyết trình thường khiến người này mất nhiều thời gian vì không biết bắt đầu từ đâu. Sau khi dùng prompt viết outline slide, có sẵn cấu trúc rõ ràng để triển khai, giúp tiết kiệm thời gian chuẩn bị và tự tin hơn khi trình bày.', true, 'Published', 'case-study-tu-tin-hon-khi-thuyet-trinh', 'knowledge_seed_case_study', now());
  end if;
end $$;

-- ── Tăng 3x lượt tương tác sau 30 ngày dùng Prompt content viral (student_success) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'story_1' and source_system = 'student_success') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Tăng 3x lượt tương tác sau 30 ngày dùng Prompt content viral', 'story-1', 'Content Creator áp dụng Prompt AI để viết bài nhanh và hiệu quả hơn.', 'Trước đây Minh Anh mất cả buổi để viết 1 bài Facebook. Sau khi áp dụng Prompt viết content viral trong Thư viện Prompt, thời gian viết bài giảm xuống còn 15 phút và lượt tương tác tăng gấp 3 lần.', true, 'Published', 'story_1', 'student_success', now());
  end if;
end $$;

-- ── Có đơn hàng Affiliate đầu tiên sau 2 tuần áp dụng lộ trình (student_success) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'story_2' and source_system = 'student_success') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Có đơn hàng Affiliate đầu tiên sau 2 tuần áp dụng lộ trình', 'story-2', 'Affiliate Marketer mới bắt đầu, đi theo lộ trình Affiliate Hub.', 'Quốc Huy không biết bắt đầu từ đâu với Affiliate Marketing. Sau khi đi theo lộ trình trong Affiliate Hub — chọn ngách, chọn sản phẩm, xây nội dung — anh có đơn hàng đầu tiên chỉ sau 2 tuần.', true, 'Published', 'story_2', 'student_success', now());
  end if;
end $$;

-- ── Ra mắt ebook đầu tiên và bán được trong tháng đầu tiên (student_success) ──
do $$
begin
  if not exists (select 1 from case_studies where legacy_source_id = 'story_3' and source_system = 'student_success') then
    insert into case_studies (title, slug, summary, body, active, status, legacy_source_id, source_system, published_at)
    values ('Ra mắt ebook đầu tiên và bán được trong tháng đầu tiên', 'story-3', 'Freelancer đóng gói kiến thức thành sản phẩm số đầu tiên.', 'Thanh Trúc dùng Học viện AI và Thư viện Template để hoàn thành ebook đầu tiên nhanh hơn nhiều so với tự mò mẫm, và đã bán được ngay trong tháng ra mắt.', true, 'Published', 'story_3', 'student_success', now());
  end if;
end $$;

