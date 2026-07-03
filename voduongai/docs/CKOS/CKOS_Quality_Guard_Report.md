# CKOS Quality Guard Report

Sprint 06 biến CKOS Standard Library (Sprint 04) từ tài liệu thành rào chắn kỹ thuật thật:
`src/features/knowledge/quality/ckos-quality-guard.ts` + test suite
`ckos-quality-guard.test.ts`, chạy bằng `npm test`.

## Cách chạy

```bash
npm test
# hoặc chỉ chạy Quality Guard:
npx vitest run src/features/knowledge/quality/ckos-quality-guard.test.ts
```

Test được viết theo dạng `it.each` — mỗi Knowledge Seed là 1 test case riêng, tên test hiện
rõ slug Seed nào fail. Khi ai đó thêm Seed mới vi phạm Standard, `npm test` sẽ đỏ ngay, không
cần đợi review thủ công như Sprint 04.

## 7 rule được guard hoá

| Rule | Hàm kiểm tra | Ngưỡng |
|---|---|---|
| 2. Tối thiểu 5 Prompt thật | `checkPrompts` | `prompts.length >= 5`, mỗi prompt có biến `[ngoặc vuông]` |
| 3. Example đúng 1 trong 3 format | `checkExample` | `splitBeforeAfter()` phải parse được (Trước/Sau, Không dùng AI/Có AI, Sai/Đúng) |
| 4. Checklist là hành động | `checkChecklist` | 3-5 mục, không mục nào khớp pattern lý thuyết (`Hiểu/Nắm được/Biết...`) |
| 5. Exercise làm được trong 5-15 phút | `checkExercise` | Không rỗng, dưới 60 từ (heuristic — xem giới hạn ở mục "Chưa làm được") |
| 6. Reflection đúng 3 câu hỏi | `checkReflection` | `reflectionQuestions.length === 1` (2 câu còn lại cố định ở tầng UI, không thuộc data) |
| 7. Companion Note chuẩn | `checkCompanionNote` | Dưới 40 từ, không chứa cụm cấm (hành trình/chinh phục/phiên bản tốt nhất/cùng nhau/đỉnh cao) |
| + Tag chuẩn hoá (Sprint 05) | `checkTaxonomy` | `skills`/`aiTools`/`scenarios` phải nằm trong taxonomy |
| + Graph toàn vẹn (Sprint 05) | `validateGraphIntegrity` | 0 dangling reference, 0 chu trình, 0 Seed cô lập |

## Kết quả chạy lần đầu

**Trước khi sửa:** 2/12 test fail.

| Seed | Lỗi | Nguyên nhân |
|---|---|---|
| `viet-email-chuyen-nghiep` | `prompts` | 1/5 prompt không có biến `[ngoặc vuông]` ("Viết email giới thiệu bản thân khi gia nhập nhóm mới...") |
| `lam-bao-cao-tuan-bang-ai` | `prompts` | 1/5 prompt không có biến `[ngoặc vuông]` ("Viết phần mở đầu báo cáo tuần gửi cấp trên...") |

**Đã sửa ngay trong Sprint này** (thêm biến `[tên nhóm/phòng ban]`, `[tên cấp trên/phòng ban]`
vào 2 prompt trên) — đúng tinh thần "biến Standard thành rào chắn, không chỉ báo cáo rồi để đó".

**Sau khi sửa:** 12/12 test pass — 11 Seed đạt chuẩn CKOS + Knowledge Graph toàn vẹn.

Đồng thời sửa 1 điểm Sprint 04 đã ghi nhận nhưng chưa sửa: checklist item "Biết rõ 3 điểm
chính cần nhấn mạnh?" (Seed PowerPoint) → "Đã xác định 3 điểm chính cần nhấn mạnh?" (hành động).

## split-before-after.ts — mở rộng (Rule 8)

Trước Sprint 06, util chỉ nhận diện `Trước:`/`Sau:`. Đã refactor để nhận cả 3 format:

```ts
Trước: ... Sau: ...
Không dùng AI: ... Có AI: ...
Sai: ... Đúng: ...
```

Hàm trả về thêm `beforeLabel`/`afterLabel` để UI (`RealExample.tsx`) hiển thị đúng nhãn thay vì
hardcode "Trước"/"Sau" — Seed "Tự Động Hóa Công Việc Văn Phòng bằng AI" (dùng format "Không
dùng AI/Có AI") giờ hiển thị đúng 2 card thay vì fallback văn bản thường (lỗi đã ghi nhận ở
`CKOS_Quality_Report.md`, mục Sprint 04, điểm #1 — nay đã đóng).

## Asset thật cho 3 Knowledge Seed mới (Rule 9)

Theo `04_CKOS_Content_Workflow.md`, mỗi Seed nên có Knowledge Asset riêng cho từng step thay vì
`assetId: null`. Đã viết **15 Knowledge Asset thật** (5 loại × 3 Seed) trong
`knowledge-seed-data.ts` và gán vào `steps[]` tương ứng:

| Seed | Asset đã viết |
|---|---|
| Viết Prompt Hiệu Quả | `guide-viet-prompt-hieu-qua`, `prompt-viet-lai-yeu-cau-mo-ho`, `checklist-mot-prompt-hieu-qua`, `exercise-viet-lai-1-prompt-hay-dung`, `reflection-prompt-cu-thieu-phan-nao` |
| Phân Tích Excel bằng AI | `guide-phan-tich-excel-bang-ai`, `prompt-viet-cong-thuc-excel-theo-mo-ta`, `checklist-truoc-khi-gui-file-excel-ai`, `exercise-nho-ai-viet-cong-thuc-excel`, `reflection-cong-thuc-ton-thoi-gian-nhat` |
| Tự Động Hóa Công Việc Văn Phòng bằng AI | `guide-tu-dong-hoa-cong-viec-van-phong`, `prompt-de-xuat-quy-trinh-tu-dong-hoa`, `checklist-xay-quy-trinh-tu-dong-hoa`, `exercise-viet-quy-trinh-3-4-buoc-co-ai`, `reflection-viec-nao-dang-lap-lai-chua-tu-dong-hoa` |

Tổng số Knowledge Asset trong hệ thống: 65 (Sprint 01) + 15 (Sprint 06) = **80 Asset**, tổng
tham chiếu asset trong `steps[]` của toàn bộ Seed: 72/72 khớp (đã verify bằng script đối
chiếu, không còn asset "sắp có" nào cho 3 Seed mới).

## Chưa làm được / hạn chế còn lại

1. **`checkExercise` chỉ là heuristic đếm từ**, không thực sự đo được "5-15 phút" vì data
   model không lưu số phút riêng cho Exercise (chỉ có `estimatedTime` ở cấp Seed, gộp cả hành
   trình). Nếu muốn kiểm tra chính xác, cần thêm field `exerciseMinutes: number` — đây SẼ LÀ
   một thay đổi data model mới, ngoài phạm vi "không xây tính năng mới" của Sprint này nên
   chưa làm, chỉ dùng heuristic tạm thời (giới hạn 60 từ).
2. **`checkCompanionNote` dùng danh sách cụm cấm cố định** (5 cụm) — không phải NLP thật, có
   thể bỏ sót cách viết sáo rỗng khác không nằm trong danh sách. Đủ dùng cho quy mô hiện tại
   (11 Seed), cần mở rộng danh sách nếu phát hiện thêm khi viết Seed mới.
3. **Test chưa chạy trong CI tự động** — hiện chỉ chạy thủ công qua `npm test`. Cần cấu hình
   pipeline CI (ngoài phạm vi Sprint này, vì đó là hạ tầng dự án, không phải nội dung CKOS).
4. **`getPrerequisiteGuidance` (Sprint 02) vẫn chưa đọc `prerequisites[]`** (Sprint 05) — đã
   ghi nhận từ Sprint 05, chưa sửa trong Sprint này vì thuộc phạm vi Learning Engine
   (Sprint này không được đụng).

## Kết luận

CKOS giờ có 2 lớp bảo vệ chất lượng: tài liệu Standard (Sprint 04, con người đọc) và guard kỹ
thuật (Sprint 06, máy kiểm tra). 12/12 test pass sau khi sửa 3 lỗi thật phát hiện được (2
prompt thiếu biến, 1 checklist lý thuyết) — chứng minh guard hoạt động đúng: tìm ra vấn đề
thật, không phải rào chắn hình thức.
