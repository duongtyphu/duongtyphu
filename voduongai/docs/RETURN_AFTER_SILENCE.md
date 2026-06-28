# Return After Silence

Sprint 17.0 — The Living Ceremonies. Xem `docs/CEREMONY_FRAMEWORK.md`,
`growth-signals.ts` (`deriveComebackSignals`), `growth-milestones.ts`
(`first-comeback`, `quiet-season`).

## Khoảnh khắc

Growth Map (Sprint 14.0) đã có khái niệm "comeback-after-silence" như
một tín hiệu hợp lệ — một khoảng lặng dài không bị coi là thất bại.
Return After Silence là nghi thức dành cho khoảnh khắc một người quay
lại Portal sau một khoảng lặng đáng kể (ví dụ ≥ 21 ngày, theo ngưỡng
`quiet-season` đã định nghĩa) — được chào đón, không bị nhắc nhở hay
thúc đẩy vì đã vắng mặt.

## Bốn nhịp (thiết kế, chưa code)

- **Opening**: Companion không nói "Bạn đã vắng mặt N ngày" — không có
  con số nào. Một câu đơn giản, ví dụ: "Chào bạn, mình rất vui vì bạn
  đã quay lại."
- **Reflection**: nếu có nguyên liệu (Reflection/Memory trước khoảng
  lặng), Companion có thể nhắc lại nhẹ một điều cũ — không liệt kê
  "những gì bạn đã bỏ lỡ", không tạo cảm giác phải bắt kịp.
- **Companion**: không hỏi "vì sao bạn vắng mặt" — sự vắng mặt không
  cần giải thích.
- **Closing**: một câu mở lối tự nhiên trở lại hành trình, không ép
  quay lại ngay một nhiệm vụ cụ thể.

## Boundary

Không bao giờ dùng ngôn ngữ tội lỗi/FOMO ("bạn đã bỏ lỡ", "đừng để
mất tiến độ"). Không gửi thông báo/email nhắc nhở trước khi người dùng
tự quay lại — nghi thức này chỉ kích hoạt SAU KHI người dùng đã tự
quyết định trở lại, không phải một cơ chế kéo người dùng quay lại.

## Trạng thái

Chỉ ở mức thiết kế trong Sprint 17.0 — chưa code.
