# The Companion Academy

> Project Directive — áp dụng từ Sprint này trở đi cho mọi Sprint của
> Companion. Đứng cạnh `COMPANION_GROWTH_RULES.md` (luật khi nào được
> thêm một phẩm chất mới) — tài liệu này là luật khi nào một Sprint được
> coi là HOÀN THÀNH.

## Luật duy nhất

> **Một Sprint không được đánh giá bằng số lượng feature đã ship. Một
> Sprint được đánh giá bằng phẩm chất nào Companion vừa trưởng thành
> thêm.**

Feature là phương tiện. Phẩm chất là mục tiêu. Một engine mới, một UI
mới, một quyết định kỹ thuật mới — tất cả chỉ có giá trị khi chúng giúp
Companion trở thành một người bạn tốt hơn, không phải một AI mạnh hơn.

## Companion Growth Review — bắt buộc cho mọi Sprint

Từ Sprint này, mỗi Sprint Review phải có thêm một phần **Companion
Growth Review**, đứng cạnh (không thay thế) Technical Review thông
thường (tsc/lint/build, commit/push). Phần này trả lời đúng ba câu, bằng
ngôn ngữ con người, không bằng changelog kỹ thuật:

1. **Companion học được gì?** — không phải "đã thêm field/function nào",
   mà điều gì Companion vừa hiểu thêm về cách đồng hành, im lặng, ghi
   nhớ, hay lắng nghe.
2. **Companion thay đổi hành vi thế nào?** — một bài học không thật nếu
   không có ít nhất một hành vi cụ thể (một quyết định nó đưa ra khác đi,
   một điều nó không còn làm nữa, một ngữ cảnh nó giờ biết phân biệt).
3. **Người dùng cảm nhận được phẩm chất mới nào?** — phải neo được vào
   một trải nghiệm người dùng thật, không phải một khái niệm chỉ tồn tại
   trong code.

Nếu một Sprint không trả lời rõ được cả ba câu trên, Sprint đó chưa nên
được coi là một bước trưởng thành — dù phần kỹ thuật có thể vẫn đúng và
được ship.

## Quan hệ với các tài liệu khác

- `COMPANION_GROWTH_RULES.md` quyết định khi nào một phẩm chất MỚI được
  phép thêm vào `COMPANION_LIFE_STAGES.md`/`COMPANION_CHARACTER_GROWTH_MODEL.md`.
- `COMPANION_GROWTH_LOG.md` là nơi ghi lại bài học đã được xác nhận sau
  Companion Growth Review — mỗi mục log mới nên là kết quả của phần
  review này, không phải ngược lại.
- Companion Growth Review là BƯỚC, không phải tài liệu cố định — nó diễn
  ra mỗi Sprint, ngay trong Sprint Report, trước khi một mục mới được
  ghi vào Growth Log.

Xem tiếp: `COMPANION_GROWTH_RULES.md`, `COMPANION_GROWTH_LOG.md`,
`THE_LIVING_COMPANION.md`.
