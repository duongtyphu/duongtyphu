# Living Stories Engine (Sprint 13.2)

> "Companion không kể chuyện để gây ấn tượng. Companion kể chuyện để
> đồng hành."

## Living Stories là gì

Living Stories là tập hợp những câu chuyện ngắn, có chiều sâu, mà
Companion có thể chọn để kể vào đúng lúc — thay cho hoặc bên cạnh một
lời khuyên trực tiếp. Mỗi story được viết trước (không phải AI sinh ra
tự do), được gắn `meaningTags`/`gardenStages`/`suitableRoutes` để
`story-matching-engine.ts` có thể chọn đúng câu chuyện phù hợp với
trạng thái người dùng lúc đó — cùng kiến trúc rule-based đã dùng cho
`proactive-thought-engine.ts` (Sprint 13.1).

## Vì sao Companion cần biết kể chuyện

Một người đồng hành thật không chỉ trả lời câu hỏi và đưa lời khuyên —
đôi khi điều giúp ích nhất là một câu chuyện khiến người nghe thấy
"mình không đơn độc". Lời khuyên nói trực tiếp vào vấn đề; câu chuyện
mở ra một không gian để người dùng tự rút ra ý nghĩa cho riêng mình,
không bị áp đặt.

## Khác gì success story / case study / testimonial

| | Success Story / Case Study / Testimonial | Living Story |
|---|---|---|
| Mục đích | Chứng minh sản phẩm hiệu quả, thuyết phục mua | Đồng hành, giúp người dùng thấy được thấu hiểu |
| Nhân vật | Người dùng thật, có tên/kết quả cụ thể | Companion, hoặc người ẩn danh không thể nhận diện |
| Kết quả | Luôn kết thúc bằng thành công/số liệu | Có thể không có "kết quả" — có thể chỉ là một khoảnh khắc |
| Áp lực ngầm | "Người khác làm được, bạn cũng phải làm được" | Không tạo áp lực, không so sánh |
| Vị trí | Trang Case Studies, trang bán hàng | Gần Companion, đúng lúc, không phải nơi quảng cáo |

Case study đã có trang riêng (`/portal/case-studies`) — Living Story
**không thay thế** case study, và không bao giờ dùng để bán hàng trực
tiếp (xem Nhiệm vụ 07 — Privacy & Trust Boundary).

## Khi nào Companion nên kể chuyện

- Người dùng đã ở lại đủ lâu, ngữ cảnh đủ rõ ràng (không phải lúc vừa
  mở Portal).
- Có một `ReflectionMeaning` hoặc `GardenStage` cụ thể đủ để chọn đúng
  story (Wisdom/Resilience/Garden Story).
- Người dùng có vẻ đang cần được lắng nghe nhiều hơn là cần một câu trả
  lời nhanh (Quiet Story).
- Không có tín hiệu nào rõ ràng nhưng vẫn muốn duy trì sự hiện diện ấm
  áp — lúc đó chỉ dùng Companion Story hoặc Quiet Story nhẹ, không bao
  giờ ép một story không phù hợp.

## Khi nào Companion không nên kể chuyện

- Khi CompanionSpace đang mở ở một mode khác (đang trong luồng khác,
  kể chuyện lúc này sẽ ngắt mạch).
- Khi người dùng đang nhập input/textarea.
- Khi người dùng đã tạm ẩn proactive thoughts trong session (story
  cũng là một dạng proactive speech, phải tôn trọng cùng lựa chọn đó).
- Khi đã kể một story gần đây (cooldown riêng, không trùng cooldown của
  Proactive Thought nhưng cùng tinh thần "không spam").
- Khi không có story nào thật sự phù hợp — im lặng là một lựa chọn hợp
  lệ, không phải lỗi.

## Privacy & Trust Boundary (Nhiệm vụ 07)

Ranh giới bắt buộc, áp dụng cho mọi story hiện tại và mọi story thêm
vào thư viện sau này:

- **Không kể chuyện của người dùng thật nếu chưa có consent.** Toàn bộ
  `Anonymous Human Story` trong V1 đều là biên soạn tổng hợp từ mẫu
  hành vi chung (`boundaryNote` của mỗi story ghi rõ điều này) — không
  trích dữ liệu hội thoại/hành vi thật của bất kỳ người dùng cụ thể
  nào.
- **Nếu sau này dùng câu chuyện người dùng thật, phải ẩn danh và không
  thể nhận diện** — không tên, không chi tiết định danh (nghề nghiệp cụ
  thể, địa điểm, thời gian chính xác), và phải có consent rõ ràng từ
  người dùng trước khi đưa vào thư viện.
- **Không dùng Story để thao túng cảm xúc.** Mọi story chỉ mở ra một
  góc nhìn, không cố tạo cảm giác tội lỗi, sợ bỏ lỡ (FOMO), hay áp lực
  phải hành động ngay.
- **Không dùng Story để bán hàng trực tiếp.** Living Story không bao
  giờ kết bằng CTA mua hàng/nâng cấp — đó là việc của trang sản phẩm,
  không phải của một khoảnh khắc đồng hành.
- **Không dùng Story để chứng minh người dùng phải thành công.** Không
  story nào ngụ ý "ai cũng làm được, nên bạn cũng phải làm được" — xem
  `resilience-anonymous-restart` trong `living-stories.ts` làm ví dụ:
  không tổng kết bằng một lời hứa thành công, chỉ ghi nhận một người
  không bỏ cuộc.

Ranh giới này nối tiếp "No Therapy Boundary" đã có ở
`COMPANION_COVENANT.md` — Story cũng không dùng để chẩn đoán hay khẳng
định cảm xúc người đọc (mọi `Quiet Story`/`Resilience Story` đều viết ở
dạng ẩn dụ phổ quát, không trực tiếp gán cảm xúc cho người dùng).
