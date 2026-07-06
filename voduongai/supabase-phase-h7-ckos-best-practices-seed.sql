-- ============================================================================
-- PHASE H.7 — Best Practice Seed SQL (generated from REAL dry-run output of
-- scripts/phase-h7-seed-best-practices-case-studies.ts — NOT APPLIED)
-- ============================================================================
-- Sinh từ 13 guide THẬT trong knowledgeSeedData (type=GUIDE), không bịa nội
-- dung. Idempotent theo (legacy_source_id, source_system).
-- KHÔNG bao gồm CONSTITUTION/RULES (Companion/Cộng đồng) — theo quyết định
-- ADR-001 (Phase H.2): giữ nguyên tại chỗ, chỉ tham chiếu, không sao chép.

-- ── Cách dùng AI để viết email chuyên nghiệp ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-viet-email-chuyen-nghiep-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để viết email chuyên nghiệp', 'viet-email-chuyen-nghiep-bang-ai', 'Hướng dẫn dùng AI soạn email công việc rõ ràng, đúng giọng văn, tiết kiệm thời gian.', 'Thay vì soạn email từ đầu, hãy mô tả bối cảnh (ai nhận, mục đích, thông tin cần có) cho AI, sau đó chỉnh giọng văn cho phù hợp văn hoá công ty bạn. AI giỏi nhất khi bạn cho nó ngữ cảnh cụ thể, không phải yêu cầu chung chung.', 'Published', 'guide-viet-email-chuyen-nghiep-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để lọc và làm sạch dữ liệu Excel ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-loc-du-lieu-excel-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để lọc và làm sạch dữ liệu Excel', 'loc-du-lieu-excel-bang-ai', 'Nhờ AI viết công thức, phát hiện dữ liệu bất thường và làm sạch bảng tính nhanh gấp nhiều lần.', 'Mô tả cấu trúc bảng dữ liệu hiện có và kết quả bạn muốn, AI sẽ gợi ý công thức hoặc các bước xử lý. Luôn kiểm tra lại công thức trên một mẫu nhỏ trước khi áp dụng toàn bộ file.', 'Published', 'guide-loc-du-lieu-excel-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để thiết kế PowerPoint nhanh gọn ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-thiet-ke-powerpoint-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để thiết kế PowerPoint nhanh gọn', 'thiet-ke-powerpoint-bang-ai', 'Biến outline ý tưởng thành slide có cấu trúc rõ ràng chỉ trong vài phút.', 'Viết outline nội dung trước (không cần đẹp), để AI đề xuất cấu trúc slide, tiêu đề từng trang và gợi ý hình ảnh minh hoạ. Con người vẫn cần biên tập lại phần thẩm mỹ cuối cùng.', 'Published', 'guide-thiet-ke-powerpoint-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để viết báo cáo công việc hàng tuần ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-viet-bao-cao-tuan-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để viết báo cáo công việc hàng tuần', 'viet-bao-cao-tuan-bang-ai', 'Biến ghi chú rời rạc trong tuần thành báo cáo mạch lạc, đúng trọng tâm.', 'Gom các ghi chú, số liệu, kết quả công việc trong tuần lại, đưa cho AI để tổng hợp theo cấu trúc: Đã làm — Kết quả — Vướng mắc — Kế hoạch tuần tới.', 'Published', 'guide-viet-bao-cao-tuan-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để ghi chú và tổng hợp cuộc họp ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-ghi-chu-cuoc-hop-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để ghi chú và tổng hợp cuộc họp', 'ghi-chu-cuoc-hop-bang-ai', 'Không cần vừa nghe vừa ghi — để AI tổng hợp ý chính và việc cần làm sau họp.', 'Ghi âm hoặc gõ nhanh các ý trong họp, sau đó nhờ AI tổng hợp thành: quyết định chính, việc cần làm, người phụ trách, deadline.', 'Published', 'guide-ghi-chu-cuoc-hop-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để đọc hiểu tài liệu PDF dài ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-doc-hieu-pdf-dai-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để đọc hiểu tài liệu PDF dài', 'doc-hieu-pdf-dai-bang-ai', 'Tóm tắt, trích xuất ý chính và hỏi đáp trực tiếp với tài liệu dài thay vì đọc từng trang.', 'Tải PDF lên công cụ AI hỗ trợ, yêu cầu tóm tắt theo mục lục, sau đó đặt câu hỏi cụ thể vào phần bạn cần thay vì đọc toàn bộ.', 'Published', 'guide-doc-hieu-pdf-dai-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để viết nội dung thu hút hơn ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-viet-noi-dung-thu-hut-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để viết nội dung thu hút hơn', 'viet-noi-dung-thu-hut-bang-ai', 'Biến nội dung khô khan thành nội dung có cảm xúc và dễ đọc hơn, vẫn giữ đúng thông tin gốc.', 'Viết bản nháp thô trước, sau đó nhờ AI viết lại theo giọng văn mong muốn (thân thiện, chuyên nghiệp, hài hước...). Luôn kiểm tra lại tính chính xác thông tin sau khi AI viết lại.', 'Published', 'guide-viet-noi-dung-thu-hut-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để quản lý thời gian làm việc hiệu quả hơn ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-quan-ly-thoi-gian-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để quản lý thời gian làm việc hiệu quả hơn', 'quan-ly-thoi-gian-bang-ai', 'Nhờ AI sắp xếp ưu tiên công việc trong ngày dựa trên deadline và mức độ quan trọng.', 'Liệt kê toàn bộ việc cần làm hôm nay kèm deadline, nhờ AI sắp xếp thứ tự ưu tiên theo ma trận quan trọng/khẩn cấp.', 'Published', 'guide-quan-ly-thoi-gian-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để nghiên cứu một chủ đề nhanh chóng ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-nghien-cuu-nhanh-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để nghiên cứu một chủ đề nhanh chóng', 'nghien-cuu-nhanh-bang-ai', 'Tổng hợp thông tin từ nhiều nguồn thành bức tranh tổng quan trong thời gian ngắn.', 'Đặt câu hỏi nghiên cứu rõ ràng, yêu cầu AI liệt kê các góc nhìn khác nhau và nguồn tham khảo, sau đó tự kiểm chứng lại thông tin quan trọng.', 'Published', 'guide-nghien-cuu-nhanh-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để soạn bộ câu hỏi thường gặp (FAQ) cho công việc ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-tra-loi-cau-hoi-thuong-gap-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để soạn bộ câu hỏi thường gặp (FAQ) cho công việc', 'tra-loi-cau-hoi-thuong-gap-bang-ai', 'Tổng hợp các câu hỏi khách hàng/đồng nghiệp hay hỏi thành bộ FAQ chuẩn hoá.', 'Liệt kê các câu hỏi bạn thường được hỏi lại nhiều lần, nhờ AI viết câu trả lời ngắn gọn, nhất quán, dễ hiểu cho từng câu.', 'Published', 'guide-tra-loi-cau-hoi-thuong-gap-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách viết prompt hiệu quả theo cấu trúc 4 phần ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-viet-prompt-hieu-qua' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách viết prompt hiệu quả theo cấu trúc 4 phần', 'viet-prompt-hieu-qua', 'Xây dựng prompt theo cấu trúc Ai — Làm gì — Định dạng — Giọng văn để AI trả lời đúng ý ngay lần đầu.', 'Một prompt hiệu quả luôn trả lời rõ 4 câu hỏi: Ai (vai trò/bối cảnh), Làm gì (nhiệm vụ cụ thể), Định dạng nào (độ dài/cấu trúc), Giọng văn ra sao. Xây prompt theo đúng thứ tự này, sau đó đọc kết quả AI trả về và tinh chỉnh phần còn thiếu.', 'Published', 'guide-viet-prompt-hieu-qua', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách dùng AI để lọc và phân tích dữ liệu Excel ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-phan-tich-excel-bang-ai' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách dùng AI để lọc và phân tích dữ liệu Excel', 'phan-tich-excel-bang-ai', 'Mô tả cấu trúc dữ liệu cho AI để nhờ viết công thức hoặc rút insight, luôn kiểm tra trên mẫu nhỏ trước.', 'Mô tả cấu trúc bảng dữ liệu hiện có (tên cột, dữ liệu mẫu) và kết quả mong muốn, AI sẽ gợi ý công thức hoặc các bước xử lý. Luôn kiểm tra lại trên một mẫu nhỏ trước khi áp dụng toàn bộ file.', 'Published', 'guide-phan-tich-excel-bang-ai', 'knowledge_seed_guide', now());
  end if;
end $$;

-- ── Cách nhận diện và tự động hoá việc lặp lại bằng AI ──
do $$
begin
  if not exists (select 1 from ckos_best_practices where legacy_source_id = 'guide-tu-dong-hoa-cong-viec-van-phong' and source_system = 'knowledge_seed_guide') then
    insert into ckos_best_practices (title, slug, description, principle, status, legacy_source_id, source_system, published_at)
    values ('Cách nhận diện và tự động hoá việc lặp lại bằng AI', 'tu-dong-hoa-cong-viec-van-phong', 'Liệt kê việc lặp lại, viết thành quy trình cố định, chèn AI vào đúng bước tốn thời gian nhất.', 'Liệt kê việc lặp lại mỗi tuần, viết lại thành quy trình cố định 3-4 bước, chèn AI vào bước tốn thời gian nhất, sau đó đo lại thời gian tiết kiệm được sau 1 tuần áp dụng.', 'Published', 'guide-tu-dong-hoa-cong-viec-van-phong', 'knowledge_seed_guide', now());
  end if;
end $$;

