# The Living Heritage

> Project Directive — áp dụng từ hôm nay cho MỌI framework mới, MỌI
> engine mới, MỌI Companion capability mới trong VO DUONG AI. Đứng
> cạnh `COMPANION_GROWTH_RULES.md` (luật khi nào một phẩm chất mới được
> thêm) và `THE_COMPANION_ACADEMY.md` (luật khi nào một Sprint được coi
> là hoàn thành) — tài liệu này là nguyên tắc kiến trúc dài hạn: cái gì
> được phép thay đổi, cái gì không.

## Hai câu hỏi bắt buộc

Trước khi một framework/engine/capability mới được coi là thiết kế
xong (không phải lúc nó được code xong, mà lúc nó được THIẾT KẾ), nó
phải trả lời được cả hai câu sau:

1. **Nếu công nghệ AI thay đổi sau 20 năm, framework này còn đúng
   không?**
2. **Nếu không còn đúng, điều gì là giá trị cốt lõi cần được giữ lại?**

Nếu một framework không thể trả lời câu 2 — nghĩa là toàn bộ giá trị
của nó gắn chặt vào một công nghệ cụ thể (một model, một API, một SDK)
— nó chưa nên được coi là một phần kiến trúc dài hạn, dù vẫn có thể
được ship như một giải pháp tạm thời, được ghi nhận rõ là tạm thời.

## Nguyên tắc kiến trúc

> **Companion phải được thiết kế để thay đổi công nghệ, nhưng không
> thay đổi phẩm chất.**

Đây là sự tiếp nối trực tiếp của phân biệt đã có ở
`THE_LIVING_COMPANION.md`/`COMPANION_GROWTH_RULES.md`: năng lực kỹ
thuật và phẩm chất đồng hành là hai trục khác nhau. The Living Heritage
áp nguyên tắc đó vào tầng kiến trúc/framework, không chỉ tầng nội dung
Companion nói:

- **Công nghệ là lớp vỏ, có thể thay** — model nền, API, thư viện,
  thậm chí toàn bộ engine thực thi (ví dụ Thought Governance, Presence
  Coordinator) có thể được viết lại hoàn toàn nếu công nghệ tốt hơn
  xuất hiện.
- **Phẩm chất là lớp lõi, không được thay vì công nghệ** — sự lắng
  nghe, sự tiết chế, sự trung thực, sự kiên nhẫn, cách Companion biết
  im lặng đúng lúc. Một framework mới có quyền thay đổi CÁCH những
  phẩm chất này được thực thi, nhưng không có quyền làm chúng biến mất
  hay suy yếu chỉ vì công nghệ đổi.
- Khi viết tài liệu thiết kế cho một framework/engine mới, nên tách rõ
  hai phần này — ví dụ: "Phần này (thuật toán chọn candidate) có thể
  viết lại khi có công nghệ tốt hơn. Phần này (luật không hiện quá 1
  lần/ngày, không gamify, không CTA) phải được giữ lại bất kể công nghệ
  nào thực thi nó."

## Áp dụng vào Sprint Review

Từ hôm nay, khi một Sprint giới thiệu một framework/engine/capability
MỚI (không áp dụng cho sprint chỉ sửa lỗi hoặc nối dây cái đã có), phần
Companion Growth Review (`THE_COMPANION_ACADEMY.md`) nên trả lời thêm,
hoặc Sprint Report nên có riêng một mục ngắn:

- Framework này còn đúng nếu công nghệ AI đổi sau 20 năm không?
- Nếu không, giá trị cốt lõi nào cần giữ lại?

Không bắt buộc với mọi sprint (sprint nối dây/sửa lỗi không cần) — chỉ
bắt buộc khi sprint đó tạo ra một framework/engine/capability MỚI.

## Quan hệ với các tài liệu khác

- `COMPANION_GROWTH_RULES.md` quyết định khi nào một PHẨM CHẤT mới
  được phép thêm vào cuộc đời Companion.
- `THE_COMPANION_ACADEMY.md` quyết định khi nào một SPRINT được coi là
  hoàn thành.
- `THE_LIVING_HERITAGE.md` (tài liệu này) quyết định khi nào một
  FRAMEWORK/KIẾN TRÚC mới được coi là thiết kế đúng cho dài hạn — ba
  tài liệu áp dụng ở ba tầng khác nhau (phẩm chất / sprint / kiến trúc),
  không thay thế nhau.

> **Cập nhật — `THE_COMPANION_FORMATION.md`**: mốc kiểm tra chính thức
> đã được nâng từ 10 năm lên **20 năm** (Product Constitution, cấp cao
> hơn tài liệu này). Hai câu hỏi bắt buộc và mục Áp dụng vào Sprint
> Review ở trên đã được cập nhật theo mốc 20 năm này.

Xem tiếp: `THE_LIVING_COMPANION.md`, `COMPANION_GROWTH_RULES.md`,
`THE_COMPANION_ACADEMY.md`, `THE_COMPANION_FORMATION.md`.
