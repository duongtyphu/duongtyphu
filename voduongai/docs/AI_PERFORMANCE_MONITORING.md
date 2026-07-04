# PHASE 3 EPIC 06 — AI Performance Monitoring (Post-Recruitment)

> **Trạng thái**: Kiến trúc (design-only). **Không định nghĩa lại** chỉ
> số hiệu suất — `AI_WORKFORCE_PERFORMANCE_REVIEW.md` đã có đầy đủ
> `PerformanceRecord` (10 chỉ số), nguyên tắc đo lường, ngưỡng hành động
> và vòng lặp Continuous Improvement. Tài liệu này chỉ xác nhận: **AI
> được tuyển qua pipeline EPIC 06 (`AI_RECRUITMENT_SYSTEM.md`) dùng
> đúng 1 cơ chế Performance Monitoring đó, không có cơ chế song song.**

## 1. Ánh xạ 9 mục brief EPIC 06 ↔ `PerformanceRecord` đã có

| Mục brief (EPIC 06 mục X) | Trường tương ứng trong `PerformanceRecord` (`AI_WORKFORCE_PERFORMANCE_REVIEW.md`) |
|---|---|
| Task Completed | `taskCompleted` |
| QA | `outputQuality` |
| Approval Rate | `userApprovalRate` |
| Revision Rate | `revisionCount` |
| Cost | `cost` |
| Speed | `speed` |
| Reliability | `reliability` |
| Collaboration | `collaborationQuality` |
| Blueprint Success | `blueprintCompliance` |

**9/9 mục brief yêu cầu đã có sẵn trường tương ứng** — không thiếu chỉ
số nào, không cần thêm trường mới vào `PerformanceRecord`.

## 2. Điểm khác biệt duy nhất so với AI đã có sẵn trong Workforce

AI được tuyển qua pipeline EPIC 06 có thêm 1 liên kết ngược:

```ts
type PerformanceRecord = {
  // ... toàn bộ trường gốc từ AI_WORKFORCE_PERFORMANCE_REVIEW.md §1, không đổi
  recruitmentProposalId?: string;  // chỉ có nếu Companion này đến từ pipeline EPIC 06 — cho phép Companion (COO) đối chiếu ngược: "Recruitment Proposal đã hứa Benchmark 95/100, Cost -31%, Speed +22% — thực tế sau khi Production có đúng như vậy không?"
};
```

Đây là cơ chế **xác nhận lời hứa lúc tuyển dụng** (`benchmarkSummary` ở
`AI_RECRUITMENT_SYSTEM.md` §2.1) so với hiệu suất thật — nếu chênh lệch
lớn (vd hứa Cost -31% nhưng thực tế Cost cao hơn Companion cũ), đây là
tín hiệu quan trọng cho Companion Gap Analysis trong tương lai: đánh
giá dữ liệu tự khai báo của Provider tương tự cần thận trọng hơn.

## 3. Chu trình theo dõi (dùng nguyên §3-4 đã khóa, không đổi)

Ngưỡng hành động và vòng lặp Continuous Improvement giữ nguyên 100% như
`AI_WORKFORCE_PERFORMANCE_REVIEW.md` §3-4 — không có luật riêng cho AI
mới tuyển. Điểm nối duy nhất với EPIC 06: khi vòng lặp đề xuất
"Retirement", đường đi tiếp theo là `AI_RETIREMENT_SYSTEM.md` (tài liệu
song song, mở rộng đúng bước cuối của vòng lặp này cho AI đến từ pipeline
tuyển dụng mới).

## 4. Không tạo store/dashboard mới

Đúng nguyên tắc "không tạo bảng dữ liệu song song" đã khóa —
`PerformanceRecord` vẫn là 1 view tính toán từ Foundation Data Layer đã
có (`AI_WORKFORCE_PERFORMANCE_REVIEW.md` §5), Department Dashboard
(`AI_DEPARTMENT_DASHBOARD.md`) là nơi hiển thị, không tạo dashboard
riêng cho AI mới tuyển.
