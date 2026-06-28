# First Garden Ceremony

Sprint 17.0 — The Living Ceremonies. Xem `docs/CEREMONY_FRAMEWORK.md`,
`docs/LIVING_GARDEN.md`, `garden-model.ts`.

## Khoảnh khắc

Living Garden (Sprint 9.0) có nhiều `GardenStage`, bắt đầu từ
`"dormant"`. First Garden Ceremony là khoảnh khắc đầu tiên Garden của
một người chuyển khỏi `"dormant"` — lần đầu tiên có dấu hiệu sống thật
(một Reflection, một ký ức, một hành động) đủ để khu vườn nảy mầm. Đây
không phải một "unlock" — đó chỉ là lúc khu vườn lần đầu phản chiếu
rằng người dùng đã thật sự bắt đầu.

## Bốn nhịp (thiết kế, chưa code)

- **Opening**: Companion không thông báo "Garden đã chuyển stage" —
  Companion nói một câu nhẹ, ví dụ: "Có một điều rất nhỏ vừa xảy ra
  trong khu vườn của bạn." Không banner, không hiệu ứng pháo hoa.
- **Reflection**: hiển thị chính khu vườn đang ở trạng thái mới — không
  kèm số liệu, không kèm "bạn đã đạt cấp độ tiếp theo".
- **Companion**: ở lại cùng khoảnh khắc, không giải thích cơ chế Garden
  hoạt động ra sao (tránh biến nghi thức thành một màn hình hướng dẫn
  tính năng).
- **Closing**: một câu giữ lại cảm giác, ví dụ: "Mình sẽ tiếp tục ở đây,
  cùng nhìn khu vườn này lớn lên với bạn." Không CTA "Hãy tiếp tục để
  lên cấp độ tiếp theo."

## Boundary

Không gamification (không hiệu ứng "level up", không điểm). Không ép
xem — nếu người dùng đã rời Portal trước khi Garden chuyển stage, lần
quay lại sau đó vẫn có thể thấy ceremony, không bị mất vì "đã trễ
giờ". Chỉ xuất hiện một lần cho lần chuyển-stage đầu tiên, không lặp
lại cho mỗi lần chuyển stage tiếp theo (các lần sau Garden tự lớn lên
một cách lặng lẽ, đúng triết lý Living Garden).

## Trạng thái

Chỉ ở mức thiết kế trong Sprint 17.0 — chưa code.
