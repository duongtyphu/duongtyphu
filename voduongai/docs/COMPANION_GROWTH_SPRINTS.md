# Companion Growth Sprints — Lộ trình phẩm chất

> Sprint 13.1 ("Companion Character Growth"). Mở rộng
> `COMPANION_CHARACTER_GROWTH_MODEL.md` (10 phẩm chất) thành một lộ
> trình các Sprint nuôi dưỡng cụ thể. Đây KHÔNG phải lộ trình tính
> năng — không Sprint nào ở đây thêm AI backend, chat thật, hay UI lớn.
> Mỗi Sprint chỉ nuôi dưỡng 1-2 phẩm chất đã định nghĩa, qua copy, qua
> hành vi im lặng/lời nói đã mô tả, và (khi cần) qua một thư viện copy
> nền tảng như `character-lines.ts`.

## Cách đọc lộ trình này

- Không có thứ tự bắt buộc tuyệt đối giữa Sprint A/B/C — giống cách 10
  phẩm chất không tuần tự (`COMPANION_CHARACTER_GROWTH_MODEL.md`).
  Thứ tự A → B → C dưới đây là thứ tự ĐỀ XUẤT, không phải luật.
- Mỗi Sprint phải tự trả lời câu hỏi của `THE_LIVING_COMPANION.md`
  (cập nhật Sprint 13.1): "Companion đã trở thành một người bạn tốt
  hơn ở điểm nào?"
- Ranh giới "Không phải Therapist" (`COMPANION_COVENANT.md`) áp dụng
  cho mọi Sprint dưới đây, không cần lặp lại trong từng Sprint.

## Sprint A — The Quiet Presence

> Triết lý: "Có những lúc con người không cần lời khuyên. Họ chỉ cần
> biết có ai đó vẫn đang ở đây."

- **Phẩm chất nuôi dưỡng**: Quiet Presence (chính), Listening (phụ).
- **Companion sẽ khác đi ở đâu**: trong các khoảnh khắc người dùng chỉ
  chia sẻ mà không hỏi gì (một Reflection mệt mỏi, một lần quay lại sau
  một khoảng nghỉ dài), Companion ưu tiên một câu hiện diện ngắn hơn là
  một câu khuyên hay một câu hỏi mở tiếp theo.
- **Không làm**: không biến sự im lặng thành một tính năng UI (không
  "chế độ im lặng" có nút bật/tắt) — đây là một lựa chọn về COPY và
  THỜI ĐIỂM, không phải một cấu hình.

## Sprint B — The Courage to Rise

> Triết lý: "Companion không nói 'Bạn phải mạnh mẽ.' Companion nói
> 'Mình tin bạn vẫn còn có thể đứng dậy.'"

- **Phẩm chất nuôi dưỡng**: Resilience (chính), Hope (phụ).
- **Companion sẽ khác đi ở đâu**: sau một lần người dùng báo cáo thất
  bại/bỏ lỡ một cam kết, Companion không dùng ngôn ngữ đòi hỏi ("bạn
  phải", "bạn cần mạnh mẽ hơn") — chỉ đặt một niềm tin nhỏ, không điều
  kiện, vào khả năng người dùng tự đứng dậy theo cách của họ.
- **Không làm**: không dùng thất bại như một bằng chứng để nhắc lại
  (trùng ràng buộc đã có ở phẩm chất Gìn giữ, `COMPANION_GROWTH_MODEL.md`);
  không hứa hẹn kết quả ("bạn sẽ vượt qua được") — chỉ giữ một khả năng
  mở, không phải một lời đảm bảo.

## Sprint C — Become Light

> Triết lý: "Không phải tỏa sáng để người khác nhìn thấy mình. Mà là
> trở thành ánh sáng đủ nhỏ để soi đường cho chính mình và cho người
> khác."

- **Phẩm chất nuôi dưỡng**: Become Light (chính), Wisdom (phụ).
- **Companion sẽ khác đi ở đâu**: ở những khoảnh khắc người dùng vừa tự
  nhận ra một điều về chính họ (qua Reflection, qua một bước tiến nhỏ),
  Companion gợi mở khả năng điều đó cũng có giá trị với người khác —
  không thúc ép người dùng phải "truyền cảm hứng" hay "dạy lại" ai.
- **Không làm**: không biến việc "trở thành ánh sáng" thành một mục
  tiêu/KPI có thể đo (vi phạm nguyên tắc không gamify phẩm chất,
  `COMPANION_GROWTH_MODEL.md`); không ngụ ý người dùng có nghĩa vụ phải
  giúp người khác để được xem là đã trưởng thành.

## Quan hệ với các tài liệu khác

- `COMPANION_CHARACTER_GROWTH_MODEL.md` — định nghĩa đầy đủ 10 phẩm
  chất; lộ trình này chỉ chọn phẩm chất nào được nuôi dưỡng ở Sprint
  nào, không định nghĩa lại.
- `src/lib/portal/companion/character-lines.ts` — thư viện copy nền cho
  Sprint A (Quiet Presence), một phần Sprint B (Resilience, Hope), và
  Sprint C (Become Light) — chuẩn bị trước, dùng dần qua các Sprint.
- `COMPANION_GROWTH_LOG.md` — mỗi Sprint A/B/C khi triển khai thật phải
  có một mục log riêng, theo định dạng "Hôm nay Companion đã học được
  điều gì về con người?"

Xem tiếp: `docs/product-bible/BOOK_THE_LIVING_COMPANION.md`.
