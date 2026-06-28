# Companion Memory Evolution

> Sprint 12.0 — Nhiệm vụ 05. Thiết kế kiến trúc — KHÔNG cần AI Memory
> thật (không có vector DB, không có mô hình ghi nhớ ngữ nghĩa). Phục
> vụ NL05 (Phản chiếu tạo nên trí tuệ), NL06 (Companion đồng hành).

## Companion không chỉ nhớ dữ liệu

Trước Sprint 12.0, "Companion nhớ" chỉ có nghĩa là route hiện tại
(`getStateForPath`) hoặc trạng thái UI (đã minimize Companion thành Nest
hay chưa — Sprint 8.5). Đây là "nhớ giao diện", không phải "nhớ con
người". Sprint 12.0 mở rộng khái niệm nhớ sang 5 loại, vẫn không cần một
hệ AI Memory thật — chỉ cần đọc lại đúng dữ liệu đã có, có cấu trúc rõ
hơn.

## 5 loại "nhớ" và nguồn dữ liệu suy ra

| Companion nhớ điều gì | Suy ra từ |
|---|---|
| Chủ đề người dùng đang theo đuổi | Tổng hợp chủ đề xuất hiện lặp lại trong Reflection + Knowledge đã xem (không cần NLP — match theo tag/chủ đề đã gắn sẵn ở nội dung, đúng `KNOWLEDGE_METADATA_STANDARD.md`) |
| Cách người dùng học | Learning DNA — tỷ lệ thời gian ở Knowledge (đọc/học) so với Build/Practice (làm) |
| Điều người dùng thường Reflection | Cụm chủ đề/câu hỏi lặp lại nhiều nhất trong các Reflection đã viết |
| Điều người dùng đang cố gắng thay đổi | Reflection có ngôn ngữ hướng-tới-tương-lai ("mình muốn...", "mình đang tập...") — đối chiếu lại ở các Reflection sau để thấy có tiến triển không |
| Những bước tiến đáng nhớ | Các điểm chuyển trạng thái: Garden chuyển stage, Mission hoàn thành cột mốc, Growth Path Step chuyển `current` → `completed` |

Không có loại nào trong 5 loại trên cần một bảng dữ liệu hoàn toàn mới —
tất cả đều là cách đọc lại Reflection, Garden, Journey, Mission đã tồn
tại, theo đúng nguyên tắc "không thêm nguồn dữ liệu mới" đã giữ xuyên
suốt từ `LIVING_GARDEN.md`.

## Kiến trúc 3 lớp

```
Lớp 1 — Raw History
  (Reflection đã viết, hành động đã làm, Garden snapshot theo thời gian)
        ↓ tổng hợp định kỳ (không realtime, không cần mỗi request)
Lớp 2 — Memory Summary
  (chủ đề đang theo đuổi, cách học, điều thường Reflection,
   điều đang cố thay đổi, danh sách bước tiến đáng nhớ — tối đa N gần nhất)
        ↓ Companion đọc lớp này, không đọc trực tiếp Lớp 1 mỗi lần
Lớp 3 — Companion Expression
  (một câu nói/trạng thái cụ thể, được chọn dựa trên Memory Summary
   + Human Context hiện tại)
```

Tách lớp 2 ra khỏi lớp 1 quan trọng vì lý do hiệu năng VÀ lý do triết
lý: Companion không nên "đọc lại toàn bộ lịch sử" mỗi lần nói chuyện
(giống một người bạn thật — nhớ những điều đọng lại, không phải nhớ
từng câu chữ đã từng nghe).

## Ví dụ minh hoạ (không phải copy cuối cùng)

> Người dùng đã viết 3 Reflection về "sự tự tin khi nói trước đám đông"
> trong 2 tuần qua, đồng thời vừa hoàn thành một Mission liên quan đến
> thực hành thuyết trình.
>
> Memory Summary: `theme: "tự tin nói trước đám đông"`, `recent_shift:
> "đang cố thực hành nhiều hơn là chỉ đọc lý thuyết"`, `recent_milestone:
> "vừa hoàn thành bài thực hành thuyết trình"`.
>
> Companion Expression (encouraging): "Mình nhận thấy bạn đã thực hành
> nhiều hơn trong những ngày gần đây — đặc biệt là phần bạn từng nói khó
> nhất."

Câu nói trên không cần AI sinh ra theo thời gian thực — nó có thể là một
template được điền từ Memory Summary, đúng cách Companion hiện tại đã
hoạt động (template tĩnh theo trạng thái, xem `companion-identity.ts`).

## Quan hệ với Portal Brain và Human Context

Companion Memory là dữ liệu Portal Brain đưa vào khi quyết định Companion
nên nói gì (`PORTAL_BRAIN.md`) — đứng cạnh Human Context, không thay thế
nó: Human Context trả lời "người này đang ở trạng thái nào NGAY LÚC
NÀY", Companion Memory trả lời "người này đã từng như thế nào, đang theo
đuổi điều gì LÂU DÀI".

## Điều tuyệt đối không làm

- Không cần (và không nên, ở giai đoạn này) một mô hình AI Memory ngữ
  nghĩa thật — risk làm chậm hệ thống và tạo phụ thuộc không cần thiết
  trước khi có nhu cầu thật.
- Không lưu Memory Summary như một "điểm số tổng hợp" hiển thị ra UI —
  Memory Summary chỉ là input nội bộ cho Companion Expression.
- Không để Memory Summary giữ mãi một nhận định cũ nếu người dùng đã rõ
  ràng thay đổi — phải có cơ chế "làm mới" lớp 2 định kỳ, không đông
  cứng vĩnh viễn ở một bản ghi nhớ cũ.
