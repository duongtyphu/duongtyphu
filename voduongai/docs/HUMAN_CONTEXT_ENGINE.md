# Human Context Engine

> Sprint 12.0 — Nhiệm vụ 03. Thiết kế kiến trúc cho khái niệm "Human
> Context" — KHÔNG triển khai AI/ML thật trong sprint này. Phục vụ NL01
> (Con người luôn quan trọng hơn công nghệ) và NL06 (Companion đồng
> hành, không dùng cùng một cách nói cho tất cả).

## Human Context là gì

Human Context là một **trạng thái suy ra được** (derived state) — không
lưu trữ riêng, không phải một trường trong database — mô tả người dùng
đang ở đâu trên hành trình của họ NGAY LÚC NÀY, để Companion và các hệ
thống khác phản hồi đúng, không phản hồi giống nhau cho mọi người.

Cùng triết lý với `GardenInputs`/`GardenState` (`garden-model.ts`):
Human Context **đọc lại** dữ liệu đã có (Reflection, Garden, Journey,
Mission, hoạt động gần đây), không tạo nguồn dữ liệu mới.

## 8 ngữ cảnh tối thiểu

| Context key | Tín hiệu suy ra (từ dữ liệu đã có) |
|---|---|
| `new` (Người mới) | Chưa có Reflection nào, chưa có Garden state (Garden `isEmpty === true`) |
| `returning` (Người quay lại) | `recentActiveDays` có khoảng trống lớn rồi mới hoạt động lại (đã có khái niệm tương tự ở Companion state `comeback`) |
| `learning` (Người đang học) | `learningTouchpoints` tăng trong khoảng gần nhất, chưa có/ít `actionsCompleted` tương ứng |
| `practicing` (Người đang thực hành) | `actionsCompleted` tăng, có Reflection gắn với hành động cụ thể (không chỉ đọc) |
| `losing_momentum` (Người đang mất động lực) | `recentActiveDays` giảm liên tục so với trung bình trước đó, không có Reflection mới |
| `just_completed` (Người vừa hoàn thành một bước) | Một `GrowthPathStep`/`MissionDay` vừa chuyển từ `current`/`upcoming` sang `completed` |
| `stuck` (Người đang bế tắc) | Có Reflection nhưng lặp lại cùng một chủ đề/khó khăn nhiều lần không tiến triển sang hành động |
| `thriving` (Người đang phát triển rất tốt) | Garden ở `rising`/`blooming`/`radiant` VÀ có cả Reflection, hành động, chia sẻ trong cùng giai đoạn gần nhất |

Đây là danh sách tối thiểu theo yêu cầu Sprint — không phải danh sách
đóng. Khi thêm context mới, áp dụng cùng nguyên tắc: phải suy ra được từ
dữ liệu đã tồn tại, không thêm trường thu thập mới riêng cho mục đích
phân loại người dùng (tránh biến Human Context thành một hệ thống theo
dõi/giám sát trái với NL06).

## Vì sao không dùng một cách nói cho tất cả

`companion-identity.ts` hiện có 6 trạng thái hiển thị
(`idle/listening/thinking/encouraging/celebrating/comeback`) nhưng được
chọn chỉ dựa vào **route** (`getStateForPath`) — một người mới và một
người đang mất động lực, nếu cùng đứng ở `/portal/knowledge`, hiện nhận
đúng một trạng thái `thinking` giống nhau. Đây chính là khoảng trống
Human Context Engine lấp vào: trạng thái Companion nên là giao của
**route hiện tại** VÀ **Human Context**, không chỉ route.

Ví dụ minh hoạ (không phải copy cuối cùng, chỉ minh hoạ nguyên tắc):

- `new` + `/portal/knowledge` → trạng thái `encouraging`, lời mời nhẹ,
  không giả định người dùng đã biết gì.
- `losing_momentum` + bất kỳ route nào → trạng thái `listening`, không
  thúc ép, không nhắc "bạn đã bỏ lỡ" (vi phạm NL06/NL07 nếu mang tính áp
  lực).
- `just_completed` + bất kỳ route nào → trạng thái `celebrating`, nhưng
  ăn mừng nhỏ, không pháo hoa/popup to (đã cấm ở `LIVING_GARDEN.md`).
- `stuck` → Companion hỏi mở, không đưa giải pháp ngay (đúng
  `personality`: "hỏi nhiều hơn trả lời").

## Vị trí trong kiến trúc

Human Context là đầu vào ĐẦU TIÊN mà Portal Brain (`PORTAL_BRAIN.md`)
đọc trước khi quyết định bất kỳ điều gì khác — không phải một module
ngang hàng với Garden/Story/Knowledge, mà là lớp diễn giải con người
đứng trước tất cả các lớp đó.

```
Dữ liệu thô (Reflection/Garden/Journey/Mission/hoạt động gần đây)
        ↓
Human Context Engine  (suy ra: new/returning/learning/practicing/
                        losing_momentum/just_completed/stuck/thriving)
        ↓
Portal Brain  (dùng Human Context để quyết định Companion nói gì,
               Garden nhấn yếu tố nào, Knowledge gợi ý gì, Next Step là gì)
```

## Điều tuyệt đối không làm

- Không lưu Human Context như một "nhãn" gắn cố định cho người dùng
  (ví dụ một cột `user_segment` trong DB) — nó phải được tính lại mỗi
  lần cần dùng, từ dữ liệu hiện tại, vì con người thay đổi liên tục.
- Không hiển thị context cho người dùng dưới dạng nhãn ("Bạn đang ở
  trạng thái: mất động lực") — chỉ dùng nội bộ để Companion/Portal chọn
  cách phản hồi, đúng nguyên tắc đã áp dụng cho bảng nguyên lý↔Garden ở
  `LIVING_GARDEN.md`.
- Không dùng Human Context để hạn chế quyền truy cập nội dung (ví dụ
  "người mới không được xem bài nâng cao") — Human Context chỉ định
  hướng GIỌNG NÓI và GỢI Ý, không phải hàng rào.
