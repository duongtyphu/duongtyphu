# Book — The Mirror of Growth

Sprint 15.0. Đây là một trong những chương quan trọng nhất của Product
Bible.

## Câu hỏi lớn nhất

"Nếu một người đồng hành cùng Portal nhiều năm, điều gì còn lại?"

Không phải số bài học. Không phải số Reflection. Không phải số Story.
Không phải số Garden. Không phải số ngày online. Điều còn lại phải là:
**"Mình đã trưởng thành."**

Portal không có quyền chấm điểm sự trưởng thành. Portal chỉ có quyền
phản chiếu nó.

## Product Decision

VO DUONG AI không tồn tại để nói cho con người biết họ là ai. VO DUONG
AI tồn tại để giúp họ tự nhận ra mình đã trở thành ai.

## Mirror là gì, và vì sao nó cần tồn tại

Mirror là tấm gương — không phải dashboard, không phải analytics,
không phải một timeline kỹ thuật. Nó tồn tại vì Portal đã tích lũy đủ
dấu chân thật (Reflection, Story, Memory, Garden) qua các Sprint trước,
nhưng chưa có cách nào để những dấu chân đó được nhìn lại như một câu
chuyện liền mạch, có ý nghĩa con người. Không có Mirror, mọi dữ liệu chỉ
là dữ liệu. Có Mirror, dữ liệu trở thành một sự nhận ra.

Chi tiết kiến trúc: `docs/THE_MIRROR_OF_GROWTH.md`,
`growth-reflection-engine.ts`, `mirror-narrative.ts`,
`mirror-dialogue.ts`, `reflection-letter.ts`.

## Mirror Rules

Không được chấm điểm, xếp hạng, tạo cảm giác thua kém, thao túng cảm
xúc, hoặc ép người dùng đọc. Mirror chỉ phản chiếu — không bao giờ đánh
giá hay so sánh. Xem chi tiết tại `docs/THE_MIRROR_OF_GROWTH.md`.

## Vị trí của Mirror trong Living Intelligence

Mirror không phải một trụ cột mới của Living Intelligence
(`LIVING_INTELLIGENCE_FOUNDATION.md`) — nó là lớp cao nhất nhìn lại toàn
bộ các trụ cột đã có (Reflection, Action, Growth) và kể chúng thành một
câu chuyện con người có thể cảm nhận được, không chỉ "biết". Nó cũng là
phần thực hành rõ nhất của Human Growth Map (Sprint 14.0): nếu Growth
Map là bản đồ, Mirror là khoảnh khắc một người dừng lại và thật sự nhìn
vào bản đồ đó.

## Companion Reflection Letter — deliverable quan trọng nhất

Một lá thư Companion viết khi nhìn lại hành trình của một người dùng —
không phải thông báo, không phải automation. Khung 5 phần (Opening,
Early Days, Turning Point, Today, Closing) được định nghĩa đầy đủ tại
`docs/COMPANION_REFLECTION_LETTER_FRAMEWORK.md`. Đây là nơi triết lý của
Sprint này được thể hiện rõ nhất bằng văn bản thật, không qua code.
