# EPIC 02 — Sprint 01 Review Report
## Academy Foundation™

Đánh giá Sprint 01 của EPIC 02 (Academy Operating System) trước khi cho phép Sprint 02 bắt
đầu. Sprint này **không viết code** (đúng phạm vi "chỉ xây Foundation") — review dựa trên tài
liệu đã tạo và mức độ nhất quán với CKOS đã graduated.

---

## Academy đã có nền móng chưa?

**Có.** 8/8 tài liệu bắt buộc đã hoàn thành trong `/docs/Academy/`:

| Tài liệu | Trạng thái |
|---|---|
| `Academy_Blueprint.md` | ✅ Đầy đủ Vision/Philosophy/Product Goal/Architecture/Learning Flow/Capability Flow/Graduation Flow |
| `Academy_Constitution.md` | ✅ 10 nguyên tắc bất biến |
| `Learning_Philosophy.md` | ✅ Trả lời đủ 5 câu hỏi (Học/Thực hành/Năng lực/Trưởng thành/Companion) |
| `Capability_Framework.md` | ✅ Mô hình 5 tầng, không dùng chấm điểm |
| `Learning_Path_Blueprint.md` | ✅ Định nghĩa Learning Path sinh từ CKOS Collection |
| `Lesson_Blueprint.md` | ✅ Cấu trúc 9 phần của 1 Lesson |
| `Practice_Framework.md` | ✅ Quy định Practice, kế thừa Exercise Standard của CKOS |
| `Growth_Framework.md` | ✅ 4 dấu hiệu trưởng thành, không Score/Điểm/Xếp hạng |

Đồng thời tạo `README.md` điều hướng — trực tiếp áp dụng khuyến nghị #5 từ
`EPIC_01_GRADUATION_REPORT.md` ("thêm README điều hướng cho thư mục tài liệu"), chứng minh
Academy đã học từ bài học của CKOS ngay từ Sprint đầu tiên.

## Có phụ thuộc CKOS đúng không?

**Có, đúng và nhất quán.** Kiểm tra chéo:

- `Academy_Blueprint.md` §4 (Architecture) đặt CKOS là tầng dưới, Academy là tầng đọc trên —
  không mô tả CKOS như một phần con của Academy.
- `Academy_Constitution.md` nguyên tắc #1 ("Academy không tạo tri thức — Academy đọc CKOS")
  và #3 ("Một Lesson = Một Knowledge Seed") ngăn Academy tạo dữ liệu tri thức song song.
- `Learning_Path_Blueprint.md` tường minh: Learning Path **không được** tạo thứ tự khác với
  `seedSlugs[]` đã có trong CKOS Collection, không tạo Lesson không tương ứng Seed nào.
- `Lesson_Blueprint.md` bảng "Định nghĩa từng phần" ánh xạ trực tiếp field CKOS
  (`whatYouWillGain`, `exercise`, `reflectionQuestions`, `companionNote`) vào từng phần Lesson
  — không có phần nào tự phát minh nội dung tri thức mới.
- `Practice_Framework.md` kế thừa nguyên văn ngưỡng 5-15 phút và 4 tiêu chí của CKOS
  `Exercise_Standard.md`, không hạ chuẩn hay đổi ngưỡng.

Không phát hiện tài liệu nào trong 8 file định nghĩa dữ liệu tri thức độc lập với CKOS.

## Có đúng Product Constitution không?

**Có.** Đối chiếu với yêu cầu "Không được làm" của Sprint:

| Điều cấm | Đã vi phạm? |
|---|---|
| Tạo Course | Không — Blueprint dùng "Learning Path" sinh từ Collection, không phải "Course" độc lập |
| Tạo Video | Không — không tài liệu nào nhắc tới video/bài giảng |
| Tạo Quiz | Không — Capability Framework tường minh "không dùng mô hình chấm điểm truyền thống" |
| Tạo Certificate | Không — Growth Framework tường minh "Không có 'chứng chỉ'" |
| Tạo Dashboard | Không — chưa có tài liệu/mô tả nào về màn hình tổng hợp |
| Tạo Admin | Không |
| Tạo Companion Studio | Không |
| Tạo Lesson UI | Không — `Lesson_Blueprint.md` và `Learning_Path_Blueprint.md` đều ghi rõ "Không xây trong Sprint này" |
| Tạo Assignment UI | Không — cùng lý do trên |
| Tạo Learning Journal / Hành trình / Khu vườn | Không — không tài liệu nào đề cập |

**Không có dòng code nào được viết trong Sprint này** — xác nhận bằng `git status`/`git diff`
chỉ gồm file `.md` mới trong `docs/Academy/`, không có thay đổi trong `src/`.

## Có đủ để bắt đầu Sprint 02 không?

**Có.** Sprint 02 (dự kiến: bắt đầu rebuild giao diện Học viện theo Academy Operating System)
có đủ căn cứ để triển khai:

1. Kiến trúc rõ ràng (Blueprint + Constitution) để không lặp lại tư duy LMS cũ.
2. Cấu trúc dữ liệu Lesson đã định nghĩa (9 phần, ánh xạ rõ field CKOS nào tương ứng phần
   nào) — Sprint 02 có thể bắt tay viết type/service ngay mà không cần thiết kế lại từ đầu.
3. Ranh giới rõ với CKOS — giảm rủi ro Sprint 02 vô tình sửa dữ liệu CKOS khi rebuild UI.
4. Nguyên tắc rebuild rõ ràng (Product Decision đầu Sprint: "loại bỏ layout/card/copywriting/
   component/section/dữ liệu demo/tư duy LMS cũ nếu không phù hợp") — Sprint 02 có căn cứ
   quyết định giữ/bỏ code cũ dựa trên Constitution, không phải cảm tính.

### Điều Sprint 02 cần làm rõ thêm trước khi code (không phải thiếu sót của Sprint 01, mà là việc tự nhiên thuộc phạm vi Sprint 02)

1. Kiểm kê chính xác code/component hiện tại của trang Học viện (route, file, data model
   cũ) trước khi quyết định giữ/loại bỏ từng phần theo Constitution.
2. Thiết kế `AcademyLesson`/`LearningPath` type thật (TypeScript) tương ứng Lesson Blueprint —
   Sprint 01 mới dừng ở blueprint khái niệm (markdown), chưa có type code.
3. Quyết định cơ chế lưu Practice/Assignment log (localStorage như CKOS, hay cần backend) —
   Blueprint chưa chỉ định, để ngỏ cho Sprint 02 quyết định dựa trên yêu cầu thực tế.

---

## Kết luận

Sprint 01 (Academy Foundation™) đạt đủ 10/10 tiêu chí Definition of Done, không vi phạm điều
cấm nào, phụ thuộc CKOS đúng cách, và để lại đủ tài sản (Product/Knowledge/Documentation/
Legacy Assets theo đúng Product Constitution "mỗi Sprint phải để lại tài sản"). Sprint 02 có
thể bắt đầu.
