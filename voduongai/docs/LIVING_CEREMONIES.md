# Living Ceremonies

Sprint 17.0 — The Living Ceremonies. Xem nền tảng tại
`docs/THE_FIRST_FOOTPRINT_CEREMONY.md`, `docs/THE_MIRROR_OF_GROWTH.md`,
`docs/THE_TREE_OF_BEGINNINGS.md`.

## Vì sao VO DUONG AI cần nhiều hơn một nghi thức

Sprint 16.0 tạo ra The First Footprint — nghi thức chào đón đầu tiên.
Nó chứng minh một điều: một khoảnh khắc được thiết kế như một nghi
thức (Opening → nội dung → Companion → Closing), chứ không như một
màn hình tính năng, mang lại một cảm giác khác hẳn cho người dùng. Sau
Sprint đó, câu hỏi tự nhiên là: nếu một khoảnh khắc xứng đáng là một
nghi thức, thì còn những khoảnh khắc nào khác trong VO DUONG AI cũng
xứng đáng như vậy?

Sprint 17.0 trả lời câu hỏi đó không bằng cách thêm từng feature riêng
lẻ, mà bằng cách định nghĩa toàn bộ các nghi thức của VO DUONG AI như
một hệ thống chung — Living Ceremonies.

## Living Ceremonies là gì

Living Ceremonies là tập hợp những khoảnh khắc trong hành trình của
một con người tại VO DUONG AI mà Portal chọn không xử lý như một tính
năng (mở màn hình, hiển thị dữ liệu, đóng màn hình), mà như một nghi
thức có cấu trúc: một sự mở đầu có chủ ý, một nội dung được phản chiếu
chứ không đo lường, một sự hiện diện của Companion, và một kết thúc rõ
ràng. Khung cấu trúc chung được định nghĩa tại `CEREMONY_FRAMEWORK.md`.

## Danh sách các nghi thức (Sprint 17.0)

- **First Footprint Ceremony** — `FIRST_FOOTPRINT_CEREMONY.md` (tham
  chiếu `THE_FIRST_FOOTPRINT_CEREMONY.md`, Sprint 16.0) — nghi thức
  chào đón đầu tiên khi một người bước vào Portal.
- **First Garden Ceremony** — `FIRST_GARDEN_CEREMONY.md` — khoảnh khắc
  một người lần đầu nhìn thấy Living Garden của chính mình có dấu hiệu
  sống (không còn ở trạng thái "dormant" trống).
- **First Story Ceremony** — `FIRST_STORY_CEREMONY.md` — khoảnh khắc
  một câu chuyện của Companion lần đầu được giữ lại thành ký ức.
- **First Mirror Ceremony** — `FIRST_MIRROR_CEREMONY.md` — lần đầu
  Mirror mở ra để phản chiếu lại hành trình. Đây là nghi thức đầu tiên
  được code hóa trong Sprint này.
- **Return After Silence** — `RETURN_AFTER_SILENCE.md` — khoảnh khắc
  một người quay lại sau một khoảng lặng dài, được chào đón không phải
  bằng nhắc nhở hay thúc đẩy, mà bằng sự đón nhận.
- **First Letter Ceremony** — `FIRST_LETTER_CEREMONY.md` — khoảnh khắc
  lá thư phản chiếu đầu tiên của Companion (Companion Reflection Letter,
  Sprint 15.0) được mở ra và đọc.
- **Tree Ceremony** — `TREE_CEREMONY.md` — khoảnh khắc một chiếc lá rời
  đi tại The Tree of Beginnings (Sprint 16.1), được xử lý như một sự
  trở về, không phải một lần xóa.

## Mục tiêu của Sprint này

Sau Sprint 17.0, VO DUONG AI không còn chỉ có những tính năng riêng lẻ
từng được thiết kế đẹp. VO DUONG AI có một hệ thống văn hóa chung —
một cách nhất quán để nhận ra, định hình, và tôn trọng những khoảnh
khắc con người xứng đáng nhiều hơn một màn hình UI.

## Phạm vi Sprint 17.0

Sprint này định nghĩa khung của toàn bộ Living Ceremonies và viết đầy
đủ tài liệu cho mỗi nghi thức trong danh sách trên. Trong số đó, Mirror
Integration (`FIRST_MIRROR_CEREMONY.md`) là nghi thức đầu tiên được
hiện thực hóa bằng code — với đầy đủ bốn nhịp Opening, Reflection,
Companion, Closing — theo đúng khung tại `CEREMONY_FRAMEWORK.md`. Các
nghi thức còn lại trong Sprint này chỉ ở mức tài liệu/thiết kế, chưa
code, để mỗi nghi thức được hiện thực hóa đúng lúc, đúng Sprint, không
vội vàng dựng hàng loạt UI cùng lúc.
