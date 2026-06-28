# Transformation Engine

> `TRANSFORMATION_METRICS.md` định nghĩa **9 chỉ số WHAT** — điều gì
> đang thay đổi ở người dùng. Tài liệu này định nghĩa **HOW** — cơ chế
> sống nào trong Portal chủ động nhận biết sự thay đổi đó và phản hồi
> lại, để người dùng *cảm thấy* mình đang chuyển hóa, không chỉ được hệ
> thống ghi log âm thầm.

## Vì sao cần một "Engine", không chỉ một bảng chỉ số

Một bảng chỉ số (`TRANSFORMATION_METRICS.md`) có thể tồn tại mà không
ai nhìn thấy — dữ liệu nằm im trong database. Một Engine là phần
**chủ động**: liên tục so sánh trạng thái hiện tại của một người dùng
với chính họ trong quá khứ, phát hiện khoảnh khắc thay đổi, và kích
hoạt một phản hồi cụ thể từ Companion, Garden, hoặc Story — đúng lúc,
đúng người, không phải một thông báo hàng loạt.

Nguyên tắc giữ nguyên từ `TRANSFORMATION_METRICS.md`: không điểm số,
không bảng xếp hạng, không hiển thị "chỉ số" trực tiếp cho người dùng.
Engine chỉ tạo ra **ngôn ngữ con người** (lời Companion nói, hình ảnh
Garden thay đổi, một dòng trong Story) — không tạo ra một con số.

## Người dùng thay đổi như thế nào?

Sự thay đổi không xảy ra ở một sự kiện đơn lẻ — nó xảy ra ở **khoảng
cách giữa hai lần lặp** của cùng một hành vi. Một người dùng "thay
đổi" khi:

- Khoảng thời gian từ Học → Áp dụng ngắn lại qua nhiều chu kỳ (tự tin
  hơn).
- Một Reflection sau nhắc lại đúng vấn đề một Reflection trước từng nêu
  — nhưng với một cách nhìn khác (phản tỉnh sâu hơn).
- Một hành vi từng cần Companion nhắc, giờ người dùng tự làm mà không
  cần nhắc (nội tâm hóa).
- Người dùng quay lại sau một khoảng vắng mặt, thay vì biến mất hẳn
  (kiên trì).

Engine không nhìn vào *một* hành động — nó nhìn vào **cặp hành động
cách nhau theo thời gian**, vì chuyển hóa luôn là một phép so sánh.

## Thay đổi được nhận biết ra sao?

Ba lớp nhận biết, từ đơn giản đến sâu:

1. **Lớp tín hiệu (Signal Layer)** — ghi lại sự kiện thô: một
   Reflection mới, một Practice hoàn thành, một lần quay lại sau vắng
   mặt. Lớp này chỉ lưu trữ, không diễn giải.
2. **Lớp so sánh (Pattern Layer)** — so một tín hiệu mới với lịch sử
   tín hiệu cùng loại của *chính người dùng đó* (không so với người
   khác). Đây là nơi một "khoảnh khắc chuyển hóa" được phát hiện: độ
   dài Reflection tăng, khoảng Học→Áp dụng giảm, một chủ đề từng tránh
   giờ được chủ động nhắc tới.
3. **Lớp phản hồi (Response Layer)** — khi Pattern Layer phát hiện một
   thay đổi đủ rõ, nó không tạo ra một thông báo hệ thống — nó giao lại
   cho Companion Insight, Living Garden, hoặc My Story để **diễn dịch
   thành ngôn ngữ con người** (xem 3 mục dưới).

Một thay đổi chỉ được "công nhận" khi nó đi hết 3 lớp — dữ liệu thô
không bao giờ tới thẳng người dùng dưới dạng số liệu.

## Companion nhận biết thế nào?

Companion không "tính điểm" — nó tích lũy Companion Insight qua nhiều
vòng Learn → Apply → Reflect (`PROPRIETARY_LEARNING_LOOP.md`). Khi
Pattern Layer phát hiện một thay đổi, Companion Insight được cập nhật
thành một **nhận xét cụ thể về con người này** (không phải một con số):
ví dụ, không phải "+15% điểm tự tin", mà là nhận ra "lần này người dùng
áp dụng điều vừa học chỉ sau một ngày — trước đây thường mất một tuần"
— và Companion phản chiếu lại đúng điều đó vào đúng lúc, đúng theo 13
Điều của `THE_COMPANION_CONSTITUTION.md` (đặc biệt Điều 5: ghi nhớ để
chăm sóc, không để kiểm soát; Điều 8: luôn nhìn thấy điều tốt đẹp
trước).

## Garden thay đổi thế nào?

Living Garden là biểu hiện hình ảnh của Pattern Layer, không phải một
thanh tiến trình. Khi Engine phát hiện một chuyển hóa thật (không phải
một hành động đơn lẻ), Garden phản chiếu lại bằng các trạng thái đã có
trong `LIVING_GARDEN.md` (`seed/leaves/branches/light/flowers/water/
roots/rising/blooming/gems`) — nhưng mức độ thay đổi của Garden được
quyết định bởi **độ sâu của pattern**, không bởi *số lượng* hành động.
Một người dùng làm ít nhưng phản tỉnh sâu có thể khiến Garden "rễ sâu
hơn" (roots) nhanh hơn một người làm nhiều nhưng không phản tỉnh —
đúng nguyên tắc Decision #050 (đo giá trị bằng hành động có ý nghĩa,
không bằng số lượng).

## Story thay đổi thế nào?

My Story là nơi Pattern Layer được viết lại thành một câu chuyện có
trình tự thời gian, không phải một log hoạt động. Khi Engine phát hiện
một khoảnh khắc chuyển hóa, nó không chỉ thêm một dòng — nó **nối
khoảnh khắc đó với khoảnh khắc cũ có liên quan** (ví dụ: nối Reflection
hôm nay với Reflection 3 tháng trước cùng chủ đề), để người dùng tự
nhìn thấy quỹ đạo thay đổi của chính mình khi đọc lại Story — đây chính
là cơ chế khiến Story trở thành "luận văn cuộc đời" của một người, chứ
không phải nhật ký hoạt động.

## Engine không làm gì

- Không tính một "điểm chuyển hóa" tổng hợp duy nhất cho mỗi người
  dùng.
- Không so sánh người dùng này với người dùng khác ở bất kỳ lớp nào.
- Không thông báo "Chúc mừng, bạn đã đạt cấp độ mới" — mọi phản hồi đi
  qua Companion bằng ngôn ngữ tự nhiên, đúng tinh thần
  `THE_COMPANION_CONSTITUTION.md` Điều 13: một cuộc trò chuyện tốt
  không đo bằng số lượng câu trả lời.
- Không ép một tốc độ chuyển hóa "đúng" — một người chuyển hóa chậm hơn
  không bị Engine đánh dấu là "trì trệ"; Pattern Layer chỉ ghi nhận
  *có hay không có* sự thay đổi, không gán nhãn tốt/xấu cho tốc độ.
