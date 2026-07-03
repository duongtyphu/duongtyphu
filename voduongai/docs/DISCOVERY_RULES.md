# Discovery Rules

Discovery ≠ Unlock. Discovery là Companion **chủ động giới thiệu** một điều đã sẵn có (không
cần điều kiện mở khóa) — mục đích là tạo cảm giác khám phá, không phải quảng cáo tính năng.

## Phân biệt Discovery và Unlock

| | Discovery | Unlock |
|---|---|---|
| Điều kiện | Không cần hoàn thành gì trước | Cần trigger cụ thể (xem `JOURNEY_UNLOCK_RULES.md`) |
| Nội dung | Một thứ ĐÃ tồn tại, người dùng chưa để ý | Một thứ MỚI trở nên khả dụng |
| Tần suất | Ngẫu nhiên có chủ đích, không lặp lại nhàm | Một lần duy nhất mỗi (user, asset) |
| Câu Companion | "Mình có một Prompt đặc biệt." | "Mình nghĩ bạn đã sẵn sàng." |

## Nguyên tắc "không phải quảng cáo"

1. **Một Discovery, không phải danh sách.** Không bao giờ nói "Có 5 nội dung mới" — luôn là
   MỘT thứ cụ thể, có tên, có lý do.
2. **Đúng lúc, không đồng loạt.** Discovery không phải banner hiện cho mọi người cùng lúc — nó
   xuất hiện dựa theo hành vi/route/thời điểm của riêng người đó (tái dùng cơ chế route/session
   đã có ở `route-context.ts`/`nudge-session.ts`).
3. **Không lặp lại cùng một Discovery.** Mỗi Discovery item chỉ được đề xuất 1 lần cho 1 người
   dùng (khác với Contextual Nudge — nudge có thể lặp lại theo session/route, Discovery thì
   không).
4. **Giới hạn tần suất tổng.** Không quá 1 Discovery / phiên truy cập Portal — nếu Companion vừa
   nói một Discovery, không nói thêm Discovery khác trong cùng phiên (tránh cảm giác spam).
5. **Không trùng thời điểm với Nudge/Work Session.** Discovery không hiện đồng thời với
   Contextual Nudge hay khi đang có Work Session đang chạy — Companion không nói 2 việc cùng
   lúc (đúng nguyên tắc "1 moment tại 1 thời điểm" đã áp dụng ở Presence Coordinator, Sprint
   18.8).

## Các câu mở đầu Discovery (ví dụ, không phải danh sách đầy đủ — xem Companion Unlock
Language để mở rộng)

- "Mình có một Prompt đặc biệt."
- "Có một Case Study rất hay."
- "Mình nghĩ hôm nay bạn sẽ thích điều này."

Mỗi câu mở đầu PHẢI đi kèm một hành động cụ thể ngay sau đó (không được kết thúc câu ở đây rồi
im lặng) — ví dụ: "Mình có một Prompt đặc biệt cho việc bạn đang làm. Xem thử không?"

## Loại nội dung phù hợp cho Discovery (không cần điều kiện Unlock)

- Một Prompt trong Prompt Pack mà người dùng chưa từng mở
- Một bài viết/Case Study liên quan tới Seed/Mission người dùng vừa xem
- Một Companion Story (câu chuyện của chính Companion — đã có `living-stories.ts`, Story
  Matching Engine từ Sprint 13.2) mà người dùng chưa gặp
- Một Tool trong "Không gian AI" liên quan tới việc người dùng đang làm

**Không phù hợp cho Discovery**: bất kỳ nội dung nào cần trigger theo `JOURNEY_UNLOCK_RULES.md`
— nếu nội dung đó có điều kiện, nó phải đi qua luồng Unlock, không phải Discovery (Discovery
không có "điều kiện ẩn" — nếu có điều kiện, nó là Unlock).

## Chọn nội dung Discovery như thế nào (rule-based)

1. Ưu tiên nội dung liên quan tới route/module hiện tại (giống cách `route-context.ts` map route
   → nudge).
2. Loại trừ nội dung đã Discovery cho người dùng này rồi (lưu tương tự `UnlockRecord`, xem
   Unlock Rules — có thể dùng chung cơ chế "đã thấy" thay vì bảng riêng).
3. Nếu nhiều ứng viên hợp lệ, chọn ứng viên **mới nhất được thêm vào hệ thống** trước (nội dung
   mới có xác suất "đúng lúc" cao hơn) — quy tắc đơn giản, rule-based, không cần thuật toán gợi ý
   phức tạp ở giai đoạn này.

## Ranh giới

- Discovery không bao giờ dùng để giới thiệu tính năng/sản phẩm thương mại (đó là việc của
  Portal Builder/Marketing, không phải Companion).
- Discovery không thay thế Companion Story/Proactive Thought đã có — nó là MỘT loại moment
  trong cùng Presence Coordinator, cạnh tranh cùng budget hiển thị với các moment khác (Thought
  Governance, Sprint 18.6).
