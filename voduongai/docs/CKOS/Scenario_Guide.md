# Scenario Guide

Quy tắc cho **Business Scenario Map** (Feature 05) — mỗi Knowledge Seed thuộc về ít nhất 1
tình huống kinh doanh cụ thể, dùng field `scenarios[]`.

## Vì sao Scenario khác Skill và Collection

- **Collection** = chủ đề nội dung lớn (VD: "AI Office").
- **Skill** = năng lực học được (VD: "Time Management").
- **Scenario** = **ai đang cần thứ này, trong bối cảnh công việc nào** — cùng 1 Seed có thể
  phục vụ nhiều Scenario khác nhau tuỳ người đọc là ai.

Ví dụ: Seed "Viết Email Chuyên Nghiệp bằng AI" thuộc Collection "AI Office", dạy Skill
"Writing"/"Communication", nhưng phục vụ cả Scenario "Công việc văn phòng" lẫn "Chăm sóc
khách hàng" — vì cả nhân viên văn phòng lẫn nhân viên CSKH đều cần viết email tốt.

## Danh sách Scenario hiện tại

Xem bảng đầy đủ trong `Tag_Standard.md`. Tóm tắt: `office-work`, `management`,
`customer-service`, `research-scenario`, `presentation-scenario` (đã có Seed), và
`marketing`, `sales`, `affiliate` (chuẩn bị sẵn, chưa có Seed).

## Quy tắc gắn Scenario cho Seed mới

1. Mỗi Seed gắn 1-2 Scenario — không quá 3 (nếu một Seed áp dụng cho quá nhiều tình huống,
   nó có thể đang mô tả một kỹ năng quá chung chung).
2. Chỉ gắn Scenario mà nội dung Seed thực sự minh hoạ được (Example/Exercise phải khớp với
   Scenario đã gắn — nếu Seed viết Example cho "công việc văn phòng" nhưng gắn Scenario
   "Marketing", đó là gắn sai).
3. Khi một Scenario mới cần dùng (VD: viết Seed đầu tiên cho chủ đề Marketing), kiểm tra
   Scenario đó đã có trong `SCENARIO_TAXONOMY` chưa trước khi viết Seed — nếu chưa, thêm vào
   taxonomy trước (xem `Tag_Standard.md`), không tự tạo chuỗi tuỳ ý trong data Seed.

## Scenario và Collection tương lai

3 Scenario `marketing`, `sales`, `affiliate` được chuẩn bị trước trong taxonomy vì
`CKOS_Blueprint.md` (§8 Future Roadmap) dự kiến chuỗi Collection AI Office → AI Content → AI
Marketing → AI Business. Việc chuẩn bị Scenario trước giúp Collection tương lai không phải
sửa taxonomy — chỉ cần viết Seed và gắn tag đã có sẵn.

**Sprint 05 không tạo Seed nào cho 3 Scenario này** — đây là chuẩn bị hạ tầng, không phải nội
dung mới.
