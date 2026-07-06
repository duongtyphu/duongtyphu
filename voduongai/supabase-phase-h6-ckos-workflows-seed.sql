-- ============================================================================
-- PHASE H.6 — Static Workflow Seed SQL (SEED, NOT APPLIED)
-- ============================================================================
-- Sinh trực tiếp từ kết quả CHẠY THẬT (dry-run) của
-- scripts/phase-h6-seed-workflows.ts — mọi title/step dưới đây được copy
-- nguyên văn từ 3 nguồn thật (AI_WORKFLOWS, knowledgeSeedJourneys,
-- roadmapSeed), KHÔNG bịa nội dung. Idempotent: mỗi workflow bọc trong
-- kiểm tra NOT EXISTS theo (legacy_source_id, source_system).
-- Yêu cầu: chạy SAU supabase-phase-g-ckos-core-tables.sql và
-- supabase-phase-h5-ckos-workflows-schema.sql (cần cột legacy_source_id/
-- source_system/category đã được thêm ở Phase H.5).
-- ============================================================================

-- ── Làm video ngắn (ai_workflows, 7 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'lam-video-ngan' and source_system = 'ai_workflows') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Làm video ngắn', 'lam-video-ngan', 'Quy trình làm video ngắn với sự hỗ trợ của: ChatGPT, Canva.', 'Published', NULL, 'lam-video-ngan', 'ai_workflows', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Nghiên cứu', NULL, 'Published'),
      (wf_id, 2, 'Kịch bản', NULL, 'Published'),
      (wf_id, 3, 'Thu âm', NULL, 'Published'),
      (wf_id, 4, 'Hình ảnh', NULL, 'Published'),
      (wf_id, 5, 'Dựng video', NULL, 'Published'),
      (wf_id, 6, 'Phụ đề', NULL, 'Published'),
      (wf_id, 7, 'Đăng bài', NULL, 'Published');
  end if;
end $$;

-- ── Viết Ebook (ai_workflows, 6 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'viet-ebook' and source_system = 'ai_workflows') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Viết Ebook', 'viet-ebook', 'Quy trình viết ebook với sự hỗ trợ của: ChatGPT, NotebookLM, Canva.', 'Published', NULL, 'viet-ebook', 'ai_workflows', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Ý tưởng', NULL, 'Published'),
      (wf_id, 2, 'Dàn ý', NULL, 'Published'),
      (wf_id, 3, 'Nghiên cứu', NULL, 'Published'),
      (wf_id, 4, 'Bản nháp', NULL, 'Published'),
      (wf_id, 5, 'Thiết kế', NULL, 'Published'),
      (wf_id, 6, 'Xuất bản', NULL, 'Published');
  end if;
end $$;

-- ── Xây Landing Page (ai_workflows, 7 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'xay-landing-page' and source_system = 'ai_workflows') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Xây Landing Page', 'xay-landing-page', 'Quy trình xây landing page với sự hỗ trợ của: ChatGPT, Gamma.', 'Published', NULL, 'xay-landing-page', 'ai_workflows', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Khách hàng', NULL, 'Published'),
      (wf_id, 2, 'Vấn đề', NULL, 'Published'),
      (wf_id, 3, 'Giải pháp', NULL, 'Published'),
      (wf_id, 4, 'Nội dung', NULL, 'Published'),
      (wf_id, 5, 'Thiết kế', NULL, 'Published'),
      (wf_id, 6, 'Đánh giá', NULL, 'Published'),
      (wf_id, 7, 'Đăng bài', NULL, 'Published');
  end if;
end $$;

-- ── Affiliate Content (ai_workflows, 6 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'affiliate-content' and source_system = 'ai_workflows') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Affiliate Content', 'affiliate-content', 'Quy trình affiliate content với sự hỗ trợ của: ChatGPT, Claude.', 'Published', NULL, 'affiliate-content', 'ai_workflows', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Ngách', NULL, 'Published'),
      (wf_id, 2, 'Khách hàng', NULL, 'Published'),
      (wf_id, 3, 'Điểm nhấn', NULL, 'Published'),
      (wf_id, 4, 'Nội dung', NULL, 'Published'),
      (wf_id, 5, 'CTA', NULL, 'Published'),
      (wf_id, 6, 'Theo dõi', NULL, 'Published');
  end if;
end $$;

-- ── Viết Email Chuyên Nghiệp bằng AI (knowledge_seed_journeys, 8 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-viet-email-chuyen-nghiep' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Viết Email Chuyên Nghiệp bằng AI', 'viet-email-chuyen-nghiep', 'Giúp bạn viết email công việc rõ ràng, đúng giọng văn và tiết kiệm thời gian.', 'Published', 'ai-office', 'seed-viet-email-chuyen-nghiep', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để viết email chuyên nghiệp', NULL, 'Published'),
      (wf_id, 2, 'Viết email xin phản hồi sau cuộc họp', NULL, 'Published'),
      (wf_id, 3, 'Checklist kiểm tra email trước khi gửi', NULL, 'Published'),
      (wf_id, 4, 'Mẫu email từ chối một cách lịch sự', NULL, 'Published'),
      (wf_id, 5, 'Quy trình xử lý email hằng ngày bằng AI', NULL, 'Published'),
      (wf_id, 6, 'Từ 30 phút xuống 5 phút khi viết email bằng AI', NULL, 'Published'),
      (wf_id, 7, 'Viết 3 phiên bản của cùng một email bằng AI', NULL, 'Published'),
      (wf_id, 8, 'Bạn sẽ áp dụng điều vừa học vào công việc nào hôm nay?', NULL, 'Published');
  end if;
end $$;

-- ── Viết Báo Cáo Tuần bằng AI (knowledge_seed_journeys, 8 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-lam-bao-cao-tuan-bang-ai' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Viết Báo Cáo Tuần bằng AI', 'lam-bao-cao-tuan-bang-ai', 'Biến ghi chú rời rạc trong tuần thành báo cáo mạch lạc, đúng trọng tâm, nộp đúng hạn.', 'Published', 'ai-office', 'seed-lam-bao-cao-tuan-bang-ai', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để viết báo cáo công việc hàng tuần', NULL, 'Published'),
      (wf_id, 2, 'Tổng hợp báo cáo tuần từ ghi chú rời rạc', NULL, 'Published'),
      (wf_id, 3, 'Checklist trước khi nộp báo cáo tuần', NULL, 'Published'),
      (wf_id, 4, 'Mẫu báo cáo tuần bằng AI', NULL, 'Published'),
      (wf_id, 5, 'Quy trình viết báo cáo tuần bằng AI', NULL, 'Published'),
      (wf_id, 6, 'Giảm một nửa thời gian làm báo cáo tuần nhờ quy trình chuẩn', NULL, 'Published'),
      (wf_id, 7, 'Tổng hợp 1 báo cáo thật bằng AI ngay hôm nay', NULL, 'Published'),
      (wf_id, 8, 'Bạn đã tiết kiệm được bao nhiêu thời gian nhờ AI tuần này?', NULL, 'Published');
  end if;
end $$;

-- ── Tạo Slide PowerPoint bằng AI (knowledge_seed_journeys, 8 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-thiet-ke-powerpoint-nhanh-gon' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Tạo Slide PowerPoint bằng AI', 'thiet-ke-powerpoint-nhanh-gon', 'Biến outline ý tưởng thành slide có cấu trúc rõ ràng, tự tin khi trình bày.', 'Published', 'ai-office', 'seed-thiet-ke-powerpoint-nhanh-gon', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để thiết kế PowerPoint nhanh gọn', NULL, 'Published'),
      (wf_id, 2, 'Viết outline slide thuyết trình từ một chủ đề', NULL, 'Published'),
      (wf_id, 3, 'Checklist trước khi thuyết trình', NULL, 'Published'),
      (wf_id, 4, 'Mẫu slide mở đầu bài thuyết trình', NULL, 'Published'),
      (wf_id, 5, 'Framework đánh giá chất lượng một slide thuyết trình', NULL, 'Published'),
      (wf_id, 6, 'Tự tin hơn khi thuyết trình nhờ chuẩn bị outline bằng AI', NULL, 'Published'),
      (wf_id, 7, 'Thực hành dựng trọn 1 bộ slide bằng AI', NULL, 'Published'),
      (wf_id, 8, 'Bạn sẽ áp dụng điều vừa học vào công việc nào hôm nay?', NULL, 'Published');
  end if;
end $$;

-- ── Tóm tắt PDF bằng AI (knowledge_seed_journeys, 6 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-tom-tat-tai-lieu-pdf-dai' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Tóm tắt PDF bằng AI', 'tom-tat-tai-lieu-pdf-dai', 'Đọc hiểu tài liệu dài nhanh hơn — tóm tắt, trích xuất ý chính, hỏi đáp trực tiếp.', 'Published', 'ai-office', 'seed-tom-tat-tai-lieu-pdf-dai', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để đọc hiểu tài liệu PDF dài', NULL, 'Published'),
      (wf_id, 2, 'Tóm tắt tài liệu PDF dài theo mục lục', NULL, 'Published'),
      (wf_id, 3, 'Checklist trước khi chia sẻ tài liệu PDF', NULL, 'Published'),
      (wf_id, 4, 'Mẫu tóm tắt tài liệu trong 1 trang', NULL, 'Published'),
      (wf_id, 5, 'Tóm tắt 1 tài liệu dài bạn đang nợ đọc', NULL, 'Published'),
      (wf_id, 6, 'Việc nào bạn đang lặp lại nhiều nhất mỗi tuần?', NULL, 'Published');
  end if;
end $$;

-- ── Quản Lý Thời Gian Làm Việc (knowledge_seed_journeys, 7 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-quan-ly-thoi-gian-lam-viec' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Quản Lý Thời Gian Làm Việc', 'quan-ly-thoi-gian-lam-viec', 'Sắp xếp ưu tiên công việc rõ ràng, giảm cảm giác quá tải mỗi ngày.', 'Published', 'ai-research-presentation', 'seed-quan-ly-thoi-gian-lam-viec', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để quản lý thời gian làm việc hiệu quả hơn', NULL, 'Published'),
      (wf_id, 2, 'Sắp xếp ưu tiên công việc trong ngày', NULL, 'Published'),
      (wf_id, 3, 'Checklist cuối ngày làm việc', NULL, 'Published'),
      (wf_id, 4, 'Mẫu kế hoạch một ngày làm việc', NULL, 'Published'),
      (wf_id, 5, 'Framework ma trận ưu tiên công việc (quan trọng/khẩn cấp)', NULL, 'Published'),
      (wf_id, 6, '1 ngày làm việc theo ưu tiên do AI sắp xếp', NULL, 'Published'),
      (wf_id, 7, 'AI đã thay đổi cách bạn làm việc như thế nào so với 1 tháng trước?', NULL, 'Published');
  end if;
end $$;

-- ── Họp với AI (knowledge_seed_journeys, 7 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-ghi-chu-va-tong-hop-cuoc-hop' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Họp với AI', 'ghi-chu-va-tong-hop-cuoc-hop', 'Không bỏ sót việc cần làm sau họp — tổng hợp quyết định và hành động rõ ràng.', 'Published', 'ai-office', 'seed-ghi-chu-va-tong-hop-cuoc-hop', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để ghi chú và tổng hợp cuộc họp', NULL, 'Published'),
      (wf_id, 2, 'Tổng hợp việc cần làm sau cuộc họp', NULL, 'Published'),
      (wf_id, 3, 'Checklist chuẩn bị cuộc họp hiệu quả', NULL, 'Published'),
      (wf_id, 4, 'Mẫu agenda cuộc họp hiệu quả', NULL, 'Published'),
      (wf_id, 5, 'Quy trình chuẩn bị và kết thúc một cuộc họp', NULL, 'Published'),
      (wf_id, 6, 'Không còn bỏ sót việc cần làm sau cuộc họp', NULL, 'Published'),
      (wf_id, 7, 'Bạn sẽ áp dụng điều vừa học vào công việc nào hôm nay?', NULL, 'Published');
  end if;
end $$;

-- ── Nghiên Cứu Một Chủ Đề Nhanh Chóng (knowledge_seed_journeys, 8 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-nghien-cuu-mot-chu-de-nhanh-chong' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Nghiên Cứu Một Chủ Đề Nhanh Chóng', 'nghien-cuu-mot-chu-de-nhanh-chong', 'Tổng hợp thông tin từ nhiều nguồn thành bức tranh tổng quan trong thời gian ngắn.', 'Published', 'ai-research-presentation', 'seed-nghien-cuu-mot-chu-de-nhanh-chong', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để nghiên cứu một chủ đề nhanh chóng', NULL, 'Published'),
      (wf_id, 2, 'Tổng quan nhanh về một chủ đề cần nghiên cứu', NULL, 'Published'),
      (wf_id, 3, 'Checklist trước khi kết luận một nghiên cứu', NULL, 'Published'),
      (wf_id, 4, 'Mẫu ghi chú khi nghiên cứu một chủ đề', NULL, 'Published'),
      (wf_id, 5, 'Framework đánh giá độ tin cậy thông tin do AI cung cấp', NULL, 'Published'),
      (wf_id, 6, 'Rút ngắn thời gian nghiên cứu chủ đề mới từ 2 ngày xuống nửa ngày', NULL, 'Published'),
      (wf_id, 7, 'Nghiên cứu 1 chủ đề mới trong đúng 30 phút', NULL, 'Published'),
      (wf_id, 8, 'Điều gì khiến bạn còn chưa tin tưởng khi dùng AI?', NULL, 'Published');
  end if;
end $$;

-- ── Soạn Bộ FAQ Cho Công Việc (knowledge_seed_journeys, 7 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-soan-bo-faq-cho-cong-viec' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Soạn Bộ FAQ Cho Công Việc', 'soan-bo-faq-cho-cong-viec', 'Tổng hợp câu hỏi hay gặp thành bộ trả lời chuẩn, nhất quán cho cả nhóm.', 'Published', 'ai-research-presentation', 'seed-soan-bo-faq-cho-cong-viec', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để soạn bộ câu hỏi thường gặp (FAQ) cho công việc', NULL, 'Published'),
      (wf_id, 2, 'Soạn câu trả lời chuẩn cho câu hỏi thường gặp', NULL, 'Published'),
      (wf_id, 3, 'Checklist trước khi công bố bộ FAQ', NULL, 'Published'),
      (wf_id, 4, 'Mẫu bộ câu hỏi thường gặp (FAQ) nội bộ', NULL, 'Published'),
      (wf_id, 5, 'Quy trình cập nhật bộ FAQ nội bộ định kỳ', NULL, 'Published'),
      (wf_id, 6, 'Áp dụng bộ FAQ này với 1 khách hàng/đồng nghiệp thật', NULL, 'Published'),
      (wf_id, 7, 'Bạn sẽ áp dụng điều vừa học vào công việc nào hôm nay?', NULL, 'Published');
  end if;
end $$;

-- ── Viết Prompt Hiệu Quả (knowledge_seed_journeys, 5 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-viet-prompt-hieu-qua' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Viết Prompt Hiệu Quả', 'viet-prompt-hieu-qua', 'Học cách viết prompt rõ ràng, có bối cảnh, để AI trả lời đúng ý bạn ngay từ lần đầu.', 'Published', 'ai-office', 'seed-viet-prompt-hieu-qua', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách viết prompt hiệu quả theo cấu trúc 4 phần', NULL, 'Published'),
      (wf_id, 2, 'Prompt mẫu: viết lại yêu cầu mơ hồ thành prompt rõ ràng', NULL, 'Published'),
      (wf_id, 3, 'Checklist một prompt hiệu quả', NULL, 'Published'),
      (wf_id, 4, 'Viết lại 1 prompt bạn hay dùng theo cấu trúc 4 phần', NULL, 'Published'),
      (wf_id, 5, 'Prompt cũ của bạn thường thiếu phần nào?', NULL, 'Published');
  end if;
end $$;

-- ── Phân Tích Excel bằng AI (knowledge_seed_journeys, 5 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-phan-tich-excel-bang-ai' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Phân Tích Excel bằng AI', 'phan-tich-excel-bang-ai', 'Nhờ AI đọc, lọc và rút insight từ bảng dữ liệu Excel nhanh hơn nhiều lần so với tự làm thủ công.', 'Published', 'ai-office', 'seed-phan-tich-excel-bang-ai', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách dùng AI để lọc và phân tích dữ liệu Excel', NULL, 'Published'),
      (wf_id, 2, 'Prompt mẫu: viết công thức Excel theo mô tả', NULL, 'Published'),
      (wf_id, 3, 'Checklist trước khi gửi file Excel', NULL, 'Published'),
      (wf_id, 4, 'Nhờ AI viết công thức cho 1 việc bạn đang làm thủ công', NULL, 'Published'),
      (wf_id, 5, 'Công thức/thao tác nào bạn tốn nhiều thời gian nhất mỗi tuần?', NULL, 'Published');
  end if;
end $$;

-- ── Tự Động Hóa Công Việc Văn Phòng bằng AI (knowledge_seed_journeys, 5 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'seed-tu-dong-hoa-cong-viec-van-phong-bang-ai' and source_system = 'knowledge_seed_journeys') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Tự Động Hóa Công Việc Văn Phòng bằng AI', 'tu-dong-hoa-cong-viec-van-phong-bang-ai', 'Nhận diện việc lặp lại và dùng AI + quy trình chuẩn để giảm thời gian làm thủ công.', 'Published', 'ai-office', 'seed-tu-dong-hoa-cong-viec-van-phong-bang-ai', 'knowledge_seed_journeys', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Cách nhận diện và tự động hoá việc lặp lại bằng AI', NULL, 'Published'),
      (wf_id, 2, 'Prompt mẫu: đề xuất quy trình tự động hoá công việc lặp lại', NULL, 'Published'),
      (wf_id, 3, 'Checklist xây quy trình tự động hoá', NULL, 'Published'),
      (wf_id, 4, 'Viết quy trình 3-4 bước có AI hỗ trợ cho 1 việc lặp lại', NULL, 'Published'),
      (wf_id, 5, 'Việc nào đang lặp lại nhiều nhất mà chưa được tự động hoá?', NULL, 'Published');
  end if;
end $$;

-- ── Lộ trình thành công (roadmap_seed, 6 bước) ──
do $$
declare
  wf_id uuid;
begin
  if not exists (select 1 from ckos_workflows where legacy_source_id = 'roadmap' and source_system = 'roadmap_seed') then
    insert into ckos_workflows (title, slug, description, status, category, legacy_source_id, source_system, published_at)
    values ('Lộ trình thành công', 'lo-trinh-thanh-cong', 'Lộ trình 8 bước từ làm quen AI tới mở rộng hệ sinh thái.', 'Published', NULL, 'roadmap', 'roadmap_seed', now())
    returning id into wf_id;

    insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
    values
      (wf_id, 1, 'Làm quen AI', 'Hiểu AI là gì và ứng dụng vào công việc.', 'Published'),
      (wf_id, 2, 'Sử dụng Prompt', 'Khai thác thư viện Prompt AI hiệu quả.', 'Published'),
      (wf_id, 3, 'Xây nội dung', 'Tạo nội dung chất lượng bằng AI.', 'Published'),
      (wf_id, 4, 'Xây thương hiệu cá nhân', 'Phát triển thương hiệu cá nhân trên social.', 'Published'),
      (wf_id, 5, 'Affiliate Marketing', 'Bắt đầu kiếm tiền với Affiliate.', 'Published'),
      (wf_id, 6, 'Tạo sản phẩm số', 'Xây sản phẩm số đầu tiên của bạn.', 'Published');
  end if;
end $$;

