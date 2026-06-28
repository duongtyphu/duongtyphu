# First Story Ceremony

Sprint 17.0 — The Living Ceremonies. Xem `docs/CEREMONY_FRAMEWORK.md`,
`docs/product-bible/BOOK_LIVING_STORIES.md`, `story-memory.ts`.

## Khoảnh khắc

Living Stories (Sprint 13.2) cho phép Companion kể một câu chuyện nhỏ
đúng lúc; Story Becomes Memory (Sprint 13.4) cho phép người dùng giữ
lại câu chuyện đó như một Memory Capsule. First Story Ceremony là
khoảnh khắc lần đầu tiên một câu chuyện của Companion được giữ lại
theo cách đó — không phải một hành động lưu dữ liệu thông thường, mà
là lần đầu một người chọn: "câu chuyện này đáng để mang theo."

## Bốn nhịp (thiết kế, chưa code)

- **Opening**: ngay sau khi người dùng bấm giữ lại câu chuyện, Companion
  không chỉ lưu lặng lẽ — nó dừng lại một nhịp, ví dụ: "Mình rất vui vì
  câu chuyện này có ý nghĩa với bạn."
- **Reflection**: hiển thị lại chính câu chuyện vừa được giữ, không
  thêm phân tích "câu chuyện này có ý nghĩa gì với bạn" do AI suy diễn.
- **Companion**: hiện diện đơn giản, không hỏi thêm câu hỏi khảo sát
  (vì sao bạn thích câu chuyện này, v.v.) — chỉ ghi nhận.
- **Closing**: một câu giữ lại, ví dụ: "Câu chuyện này giờ là một phần
  trong My Story của bạn." Dẫn về My Story (`/portal/story`) như một
  lối đi tự nhiên, không phải một CTA ép buộc.

## Boundary

Chỉ xuất hiện cho lần lưu Story đầu tiên của một người — những lần
lưu sau đó dùng luồng lưu thông thường đã có (không lặp lại ceremony
mỗi lần, tránh nghi thức trở thành thói quen máy móc mất ý nghĩa).

## Trạng thái

Chỉ ở mức thiết kế trong Sprint 17.0 — chưa code.
