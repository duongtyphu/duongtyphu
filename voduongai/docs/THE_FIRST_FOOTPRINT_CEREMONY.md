# The First Footprint Ceremony

Sprint 16.0. Xem nền tảng tại `docs/HUMAN_GROWTH_PHILOSOPHY.md`,
`docs/HUMAN_GROWTH_MAP.md`, `docs/THE_MIRROR_OF_GROWTH.md`.

## Vì sao không dùng onboarding truyền thống

Onboarding truyền thống tồn tại để rút ngắn đường tới activation — nó
hỏi mục tiêu, trình độ, thời gian để ĐIỀU HƯỚNG người dùng nhanh nhất
tới một tính năng. Đó là lý do `OnboardingJourney.tsx` (Sprint trước)
vẫn tồn tại và vẫn cần thiết — nó phục vụ mục tiêu sản phẩm.

Nhưng trước khi điều hướng ai đó đi đâu, VO DUONG AI muốn làm một điều
khác trước: chào đón họ như một con người, không phải một traffic cần
được phân loại. The First Footprint không hỏi "bạn muốn gì từ chúng
tôi" — nó chỉ tạo một khoảng lặng để hỏi "bạn muốn nói gì với chính
mình". Đây không phải một bước trong funnel, không đo conversion.

## Vì sao đây là một nghi thức

Một nghi thức không tối ưu tốc độ — nó tôn trọng một khoảnh khắc. Nó có
một sự yên tĩnh nhất định, một sự chủ ý nhất định, và một kết thúc rõ
ràng (một lời hứa, một món quà) thay vì chỉ "đóng popup". The First
Footprint được thiết kế là một không gian riêng — không sidebar, không
dashboard, không card, không CTA cạnh tranh sự chú ý.

## Vai trò của Companion

Companion là người duy nhất "nói" trong nghi thức này. Không có banner,
không có giới thiệu sản phẩm. Companion mở đầu bằng một lời cảm ơn, đặt
một câu hỏi, rồi đưa ra một lời hứa — không đánh giá điều người dùng
viết, không phân tích bằng AI, không chấm điểm.

## Vai trò của Seed of Growth

Hạt giống (Seed of Growth) là hình ảnh visual rất nhỏ, rất tĩnh — không
phải XP, không phải điểm khởi đầu của một thanh tiến trình. Nó chỉ là
một dấu hiệu: "có một điều vừa được gieo xuống". Nó không thuộc state
machine của Garden thật (`garden-model.ts`) — Garden thật chỉ phản ứng
với dữ liệu tích lũy theo thời gian; hạt giống ở đây là một khoảnh khắc
biểu tượng một lần, độc lập.

## Vai trò của dấu chân đầu tiên

Dấu chân đầu tiên (điều người dùng viết, nếu họ chọn viết) được giữ lại
như một Memory Capsule đặc biệt — "The First Footprint". Nó không phải
dữ liệu để phân tích hành vi. Nó là một món quà lưu niệm có thể được
nhìn lại qua Mirror (`docs/THE_MIRROR_OF_GROWTH.md`) nhiều tháng sau,
như một điểm khởi đầu để đối chiếu với hiện tại — không để chấm điểm sự
tiến bộ, chỉ để nhắc "đây là nơi bạn từng đứng".

## Boundary (Nhiệm vụ 09)

The First Footprint là một nghi thức, không phải một funnel. Vì vậy nó
KHÔNG:

- ép viết — người dùng có quyền bỏ qua câu hỏi ở bất kỳ bước nào;
- ép đăng ký — nghi thức diễn ra bên trong Portal đã đăng nhập, không
  dùng để mời chào tạo tài khoản;
- ép chia sẻ — không có nút "chia sẻ", không mời gọi lan truyền;
- dùng AI để phân tích điều người dùng viết;
- dùng AI để đánh giá hoặc chấm điểm điều người dùng viết;
- dùng gamification — không level, không điểm số, không achievement,
  không badge, không thanh tiến trình.

Companion chỉ chào đón, lắng nghe, và hứa — không làm gì khác.
