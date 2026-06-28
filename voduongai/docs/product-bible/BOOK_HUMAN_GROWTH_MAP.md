# Book — Human Growth Map

Sprint 14.0 — The Human Growth Map.

## Vì sao không đo trưởng thành

Trưởng thành của con người không có một thước đo chung công bằng cho
mọi người. Một khoảng lặng dài có thể là một mùa nghỉ ngơi cần thiết,
không phải một sự sụt giảm. VO DUONG AI không đo sự trưởng thành của
con người — VO DUONG AI giúp con người nhìn thấy sự trưởng thành của
chính mình. Chi tiết đầy đủ tại `docs/HUMAN_GROWTH_PHILOSOPHY.md`.

## Vì sao Growth Map cần tồn tại

Portal đã có Reflection, Story, Garden, Knowledge, Journey, Companion —
nhưng mỗi hệ thống ghi nhận dấu chân của riêng nó, rời rạc. Không có nơi
nào người dùng có thể nhìn lại toàn bộ hành trình như một dòng chảy duy
nhất. Growth Map lấp khoảng trống đó — không bằng cách tạo dữ liệu mới,
mà bằng cách kết nối và kể lại dữ liệu đã có bằng ngôn ngữ con người.

## Growth Map kết nối Companion, Garden, Story, Reflection, Knowledge

- **Reflection** đóng góp dấu chân "điều người dùng nhận ra".
- **Story/Memory Capsule** đóng góp dấu chân "điều người dùng chọn giữ
  lại" và "câu chuyện đúng lúc đã trở thành ký ức".
- **Garden** đóng góp hình ảnh trưởng thành tại một thời điểm.
- **Knowledge** (khi có dữ liệu thật ở sprint sau) sẽ đóng góp dấu chân
  "điều người dùng hiểu thêm".
- **Companion** là người đọc lại toàn bộ các dấu chân này và phản chiếu
  bằng một câu nói — không đánh giá, không so sánh, không chấm điểm.

Kiến trúc: `growth-signals.ts` (chuẩn hoá dữ liệu) →
`growth-timeline.ts` (kể lại theo thời gian) →
`growth-milestones.ts` (ghi nhận lần đầu tiên đáng nhớ) →
`growth-reflection.ts` (Companion chọn một câu phản chiếu).

## Growth Map là một phần của Living Intelligence

Living Intelligence không phải một chỉ số tĩnh — nó là sự vận động qua
Reflection, Action, Growth theo thời gian (`LIVING_INTELLIGENCE_FOUNDATION.md`).
Growth Map là lăng kính giúp người dùng NHÌN THẤY sự vận động đó, không
phải một trụ cột đo lường mới. Nó không thêm áp lực phải "tăng điểm" —
nó chỉ giúp một hành trình đã diễn ra trở nên có thể nhìn lại được.
