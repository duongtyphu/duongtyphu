# Birthday Ceremony Framework (Sprint 18.1)

Khung sườn cho cách Companion tri ân sinh nhật của một người dùng. Xem
`docs/LIFE_MOMENTS_ENGINE.md`. Sprint này KHÔNG cần code đủ tất cả các
phần dưới đây — chỉ cần framework rõ ràng để các sprint sau triển khai
dần.

## Điều kiện kích hoạt

Birthday Ceremony chỉ có thể xảy ra khi người dùng đã tự điền ngày sinh
trong hồ sơ của họ. Companion không bao giờ đoán, không bao giờ hỏi ép
nếu thông tin này chưa có (xem `life-moment-detector.ts#detectBirthday`).
Hiện tại hệ thống chưa có trường ngày sinh trên `members` — phần lưu
ngày sinh là một việc cần làm ở sprint riêng (xem Technical Debt trong
Sprint Review), không phải việc của sprint này.

## 1. Birthday Greeting

Một lời chào ngắn, chân thành, xuất hiện một lần trong ngày sinh nhật —
hiện đã có (`LifeMomentBubble` + dòng `birthday` trong
`life-moment-lines.ts`). Không chiếm toàn Portal, có thể đóng, không
lặp lại nhiều lần trong cùng một ngày.

## 2. Birthday Reflection (chưa code)

Một câu hỏi reflection đặc biệt, dùng cùng cơ chế với
`src/lib/portal/reflections.ts`, nhưng với một câu hỏi dành riêng cho
sinh nhật — ví dụ: "Một năm vừa qua, điều gì bạn muốn nhớ nhất?" Không
bắt buộc trả lời, không gắn điểm số/đánh giá vào câu trả lời.

## 3. Birthday Memory Capsule

Người dùng có thể tự nguyện lưu lại sinh nhật này như một Memory
Capsule, dùng `MemoryCapsuleKind = "birthday"` (đã thêm ở
`src/lib/portal/memoryCapsules.ts`, Sprint 18.1 — Nhiệm vụ 07). Không
tự động lưu — chỉ lưu khi người dùng chủ động chọn "Giữ lại khoảnh khắc
này".

## 4. Birthday Leaf (chưa code)

Một ẩn dụ nhỏ, tương tự "The Founder Leaf" (`docs/ORIGIN_ROOM.md`) —
một dấu vết nhẹ trong Living Garden đánh dấu rằng một sinh nhật đã được
Companion ghi nhận cùng người dùng. Không phải badge, không phải biểu
tượng thành tích — chỉ là một dấu vết hữu cơ trong khu vườn
(`docs/LIVING_GARDEN.md`), nếu được triển khai ở sprint sau.

## Boundary

- Không gửi thông báo qua email/push cho sinh nhật — Birthday Ceremony
  chỉ xuất hiện khi người dùng đang ở Portal.
- Không hỏi tuổi, không hiển thị tuổi cụ thể trừ khi người dùng tự nói
  ra trong reflection của họ.
- Không dùng sinh nhật như một cái cớ để bán khoá học/gói nâng cấp.
- Không lặp lại Birthday Ceremony nhiều lần trong cùng một ngày, kể cả
  khi người dùng tải lại trang nhiều lần.
- Nếu người dùng chưa từng điền ngày sinh, Companion không bao giờ chủ
  động hỏi theo cách tạo áp lực ("Bạn chưa cho mình biết sinh nhật của
  bạn") — việc điền ngày sinh, nếu có, phải hoàn toàn tự nguyện và nằm
  trong trang hồ sơ cá nhân, không phải một câu hỏi do Companion ép ra.
