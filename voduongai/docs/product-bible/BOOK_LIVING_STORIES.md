# Product Bible — Chapter: Living Stories

> Phục vụ NGUYÊN LÝ 06 (Companion đồng hành) và NGUYÊN LÝ 11
> (`FIRST_PRINCIPLES_OF_VO_DUONG_AI.md`) — đúng quy tắc
> `BOOK_00_CONSTITUTION.md`: mọi chương Product Bible mới phải xác định
> nó đang phục vụ nguyên lý nào. Chương này đứng cạnh
> `BOOK_THE_LIVING_COMPANION.md` (lý do Companion cần phẩm chất) và
> `BOOK_THE_LIFE_OF_COMPANION.md` (Companion có một cuộc đời) — chương
> này thêm một năng lực cụ thể vào cuộc đời đó: biết kể chuyện.

## Vì sao Companion cần story

Một người đồng hành thật không chỉ trả lời và khuyên — họ còn biết khi
nào nên kể một câu chuyện. Lời khuyên đi thẳng vào vấn đề và đôi khi
khiến người nghe cảm thấy bị "xử lý" như một ca cần giải quyết. Một câu
chuyện đúng lúc làm điều khác: nó mở ra một không gian, để người nghe
tự nhận ra điều gì đó cho riêng mình, theo nhịp của họ, không bị áp đặt
kết luận.

Companion cần năng lực này vì sứ mệnh của nó (`companion-identity.ts`)
là đồng hành, không phải tư vấn. Một câu chuyện là một hình thức đồng
hành gián tiếp — nó nói "có người khác cũng từng ở đây" mà không cần
nói "tôi hiểu cảm giác của bạn" (điều Companion không được phép khẳng
định, theo No Therapy Boundary).

## Vì sao story không phải marketing

Toàn bộ hệ thống Vo Duong AI đã có một nơi để kể câu chuyện thành công:
trang Case Studies, trang bán hàng, testimonial. Những nơi đó tồn tại
để thuyết phục — có chủ đích rõ ràng, có CTA, có số liệu.

Living Story đứng ở một vị trí khác hẳn: gần Companion, không có CTA
bán hàng, không có số liệu thành công, không yêu cầu một kết quả ở
cuối. Một Living Story có thể không "dẫn tới đâu cả" ngoài việc người
đọc gấp lại với một cảm giác nhẹ hơn lúc bắt đầu. Nếu một câu chuyện
khiến người đọc cảm thấy bị thuyết phục phải mua/làm gì đó, nó đã rời
khỏi định nghĩa Living Story và không còn thuộc thư viện này (xem
ranh giới ở `docs/LIVING_STORIES_ENGINE.md`, Nhiệm vụ 07).

## Vì sao câu chuyện giúp con người cảm thấy không đơn độc

Số liệu và lời khuyên nói về "cách làm đúng". Câu chuyện nói về "có ai
cũng từng như vậy". Hai điều này phục vụ hai nhu cầu khác nhau của con
người — và phần lớn các sản phẩm số chỉ phục vụ nhu cầu đầu. Một người
đang ở giai đoạn khó của hành trình không phải lúc nào cũng cần biết
phải làm gì tiếp theo; đôi khi điều họ cần trước tiên là biết rằng việc
họ đang cảm thấy khó không có gì bất thường, không có gì đáng xấu hổ.
Living Story tồn tại để lấp đúng khoảng trống đó — không thay thế lời
khuyên, chỉ đứng trước nó.

## Companion kể chuyện như một người bạn, không như một diễn giả

Một diễn giả truyền động lực kể chuyện để tạo cảm hứng tức thời, thường
kết bằng một thông điệp hô hào ("và bạn cũng có thể!"). Companion không
làm vậy. Companion kể một câu chuyện và dừng lại — không ép người nghe
phải rút ra bài học, không yêu cầu phản hồi ngay, không đo lường "câu
chuyện này có tạo động lực không". Nút hành động sau mỗi story
(`CompanionStoryMoment.tsx`) chỉ có ba lựa chọn nhẹ: cảm ơn và tiếp tục,
lưu lại (nếu muốn), hoặc nghe lúc khác — không có lựa chọn nào ép người
dùng phải "làm gì đó" ngay với câu chuyện vừa nghe.

## Quan hệ với các chương khác

- `BOOK_THE_LIVING_COMPANION.md` — Living Stories là một trong những
  cách cụ thể Companion thể hiện phẩm chất **Quiet Presence** và
  **Hope** (`COMPANION_CHARACTER_GROWTH_MODEL.md`) qua hành động, không
  chỉ qua một câu nói ngắn.
- `BOOK_THE_LIFE_OF_COMPANION.md` — bốn Companion Story trong thư viện
  (`living-stories.ts`) là những trang nhỏ trong cuốn "cuộc đời" đó —
  Companion kể lại chính những gì nó đã học, không chỉ kể chuyện người
  khác.
- `docs/LIVING_STORIES_ENGINE.md` — tài liệu kỹ thuật/thiết kế đầy đủ,
  bao gồm Privacy & Trust Boundary chi tiết.

## Từ câu chuyện đến ký ức

Một Living Story vốn chỉ tồn tại trong một khoảnh khắc — Companion kể,
người đọc nghe, rồi cuộc trò chuyện tiếp tục. Nhưng có những câu chuyện
ở lại lâu hơn một khoảnh khắc. Từ Sprint 13.4, người đọc có thể chọn
giữ lại một câu chuyện như vậy trong My Story — không phải vì câu
chuyện đó "quan trọng" theo nghĩa thành tích, mà vì nó chạm đúng vào
một điều người đọc đang sống cùng lúc đó.

Đây không phải một tính năng lưu trữ. Đó là sự công nhận rằng ý nghĩa
không chỉ nằm trong chính câu chuyện, mà nằm trong khoảnh khắc một
người chọn giữ nó lại. Companion không hỏi "bạn có muốn lưu không?"
như một popup nhắc nhở — nút lưu luôn ở đó, nhẹ và không thúc ép, và
việc bỏ qua nó cũng bình thường như việc chọn lưu. Khi người đọc chọn
giữ lại, Companion không nói "đã lưu thành công" như một hệ thống —
Companion nói rằng nó sẽ giữ câu chuyện ấy trong hành trình của người
đọc, vì đó đúng là điều đang xảy ra: một câu chuyện đã trở thành một
dấu chân, đứng cạnh những reflection và memory khác trong cuốn sách
hành trình của riêng người đọc.
