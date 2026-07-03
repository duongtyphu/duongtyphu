# CKOS Quality Report

Đối chiếu Collection **AI Office** (`ai-office`, 8 Knowledge Seed) và Collection **AI Research
& Productivity** (`ai-research-presentation`, 3 Knowledge Seed) với bộ Standard trong thư mục
này. Đây là báo cáo — **không sửa nội dung**, chỉ ghi nhận điểm đạt/chưa đạt.

Phạm vi review: 11 Knowledge Seed hiện có trong
`src/features/knowledge/data/knowledge-seed-journeys.ts`.

---

## Điểm đạt

| Standard | Kết quả |
|---|---|
| **Hero Standard** | Đạt 11/11 — mọi Seed có `subtitle`, `skillsGained` (2-3 mục), `estimatedTime`, `difficulty`, `collectionSlug` hợp lệ. |
| **Prompt Standard** | Đạt 11/11 — mỗi Seed có đúng 5 prompt thật trong `prompts[]`, đều dùng biến `[ngoặc vuông]`, có `promptExampleInput`/`promptExampleOutput` không để trống. |
| **Reflection Standard** | Đạt 11/11 ở tầng hiển thị — `KnowledgeWorkspace.tsx` luôn dựng đúng 3 câu hỏi (2 câu cố định + 1 câu riêng từ `reflectionQuestions[0]`). |
| **Companion Note Standard** | Đạt 11/11 — không phát hiện cụm sáo rỗng bị cấm ("hành trình", "chinh phục", "phiên bản tốt nhất", "cùng nhau") trong bất kỳ `companionNote` nào. |
| **Checklist Standard** | Đạt 10/11 hoàn toàn hành động. 1 mục borderline (xem "Điểm chưa đạt"). |
| **Writing Standard — độ dài** | Đạt phần lớn — `problem`, `coreIdea`, `companionNote` đều trong giới hạn 1-2 câu ở tất cả 11 Seed. |

## Điểm chưa đạt

| # | Vấn đề | Vị trí | Mức độ |
|---|---|---|---|
| 1 | **Example không đúng format chuẩn.** Seed "Tự Động Hóa Công Việc Văn Phòng bằng AI" dùng cặp từ khoá `Không dùng AI: ... Có AI: ...` thay vì `Trước: ... Sau: ...`. Util `splitBeforeAfter()` chỉ nhận diện `Trước:`/`Sau:`, nên Example của Seed này **không được tách thành 2 card Before/After** — hiển thị fallback dạng đoạn văn thường. | `knowledge-seed-journeys.ts`, seed `tu-dong-hoa-cong-viec-van-phong-bang-ai`, field `example` | Trung bình — vi phạm `Example_Standard.md` (chấp nhận 3 dạng nhưng util code chỉ xử lý 1 dạng). Cần đồng bộ hoặc mở rộng `split-before-after.ts` để nhận cả `Không dùng AI:`/`Có AI:` và `Sai:`/`Đúng:`. |
| 2 | **1 mục Checklist borderline lý thuyết.** "Biết rõ 3 điểm chính cần nhấn mạnh?" trong Seed "Tạo Slide PowerPoint bằng AI" — vẫn là câu hỏi tự kiểm tra được nhưng gần ranh giới "hiểu/biết" mà `Checklist_Standard.md` khuyến cáo tránh. | Seed `thiet-ke-powerpoint-nhanh-gon`, field `checklist` | Thấp — không sai hẳn, nên cân nhắc đổi thành "Đã xác định 3 điểm chính cần nhấn mạnh?" (hành động) khi có dịp chỉnh sửa. |
| 3 | **3 Seed mới (Prompt Hiệu Quả, Excel, Automation) chưa có Knowledge Asset riêng.** Các bước trong "Hành trình từng bước" (`steps[]`) đều có `assetId: null` — nội dung đầy đủ nằm trực tiếp trên trang Seed (đúng chuẩn Knowledge Experience), nhưng chưa đồng bộ với kiến trúc Foundation (Sprint 01) vốn kỳ vọng mỗi step trỏ tới 1 KnowledgeAsset độc lập. | `knowledge-seed-data.ts` (thiếu asset cho 3 Seed trên) | Trung bình — không ảnh hưởng trải nghiệm người học hiện tại (đã sửa `SeedStepList.tsx` để cho phép toggle step bắt buộc dù chưa có Asset), nhưng là nợ kỹ thuật nếu sau này Admin cần quản lý riêng từng Asset. |
| 4 | **Không có cơ chế kiểm tra tự động.** Toàn bộ đối chiếu ở báo cáo này được thực hiện thủ công (đọc code + grep), chưa có script/test tự động hoá kiểm tra một Seed mới có tuân theo Standard hay không trước khi merge. | N/A | Trung bình — rủi ro Standard bị trôi dần theo thời gian khi có nhiều người/nhiều Sprint cùng thêm Seed. |
| 5 | **Product Book chưa tách bạch hoàn toàn khỏi CKOS docs.** Theo yêu cầu Sprint 04, `/docs/Product Book/` phải là 6 file riêng biệt; một phần nội dung (Blueprint, Writing Standard) buộc phải lặp lại tinh thần từ `/docs/CKOS/` để mỗi file trong Product Book tự đứng độc lập được. Đây là sự trùng lặp có chủ đích (Product Book là "phiên bản đóng gói" phục vụ đọc tuần tự), không phải lỗi, nhưng cần lưu ý khi cập nhật — sửa 1 nơi phải nhớ đồng bộ nơi còn lại. | `/docs/Product Book/` | Thấp — ghi nhận rủi ro bảo trì. |

## Đề xuất cải thiện (không thực hiện trong Sprint này)

1. Mở rộng `split-before-after.ts` để nhận diện cả 3 dạng Example (`Trước/Sau`, `Không dùng
   AI/Có AI`, `Sai/Đúng`) — sửa 1 file code, không đụng Learning Engine.
2. Viết Knowledge Asset thật cho 3 Seed mới để đồng bộ Foundation.
3. Viết một script kiểm tra tĩnh (lint rule tuỳ biến hoặc unit test) chạy qua toàn bộ
   `knowledgeSeedJourneys` và assert: có `prompts.length >= 5`, `example` khớp 1 trong 3
   pattern, `reflectionQuestions.length === 1`, không chứa cụm từ bị cấm trong
   `companionNote`. Biến Standard từ tài liệu thành rào chắn kỹ thuật thật.
4. Sửa mục Checklist borderline ở Seed PowerPoint khi có đợt chỉnh sửa nội dung tiếp theo.

## Kết luận

Collection AI Office đạt chuẩn CKOS ở mức cao (không có vi phạm nghiêm trọng nào về giọng văn,
tính thực tế, hay cấu trúc Prompt/Reflection/Companion Note). 5 điểm chưa đạt ở trên đều ở mức
trung bình/thấp, không cần chặn phát hành, nhưng nên đưa vào backlog kỹ thuật cho Sprint sau.
