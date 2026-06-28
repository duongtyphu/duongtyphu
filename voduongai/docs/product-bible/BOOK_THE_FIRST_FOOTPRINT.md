# Book — The First Footprint

Sprint 16.0. Đây là một chương rất quan trọng của Product Bible.

## Câu hỏi lớn nhất

"Người vừa bước vào Portal lần đầu tiên cảm thấy gì?"

Không phải "sản phẩm này có gì". Không phải "tôi nên bấm vào đâu".
Cảm giác đầu tiên phải là: **"Tôi không phải là một traffic. Tôi là
một con người được chào đón."**

## Product Decision

Không phải ai đến Portal cũng sẽ ở lại. Nhưng bất kỳ ai đã đến Portal
đều xứng đáng mang theo một điều gì đó có ý nghĩa — một suy nghĩ, một
hạt giống, một lời hứa, hoặc một khoảnh khắc đáng nhớ. Nếu một người
chỉ ghé Portal đúng một lần và rời đi với một trong những điều đó, đó
vẫn là một thành công của VO DUONG AI.

## The First Footprint là gì, và vì sao nó cần tồn tại

The First Footprint là nghi thức chào đón đầu tiên của Portal — diễn ra
trước cả `OnboardingJourney` (luồng chọn mục tiêu phục vụ activation).
Nó không điều hướng người dùng đi đâu. Nó không hỏi "bạn muốn gì từ
chúng tôi". Nó chỉ tạo một khoảng lặng để hỏi "bạn muốn nói gì với
chính mình", rồi giữ lại điều đó như một món quà lưu niệm.

Chi tiết kiến trúc: `docs/THE_FIRST_FOOTPRINT_CEREMONY.md`,
`FirstFootprintCeremony.tsx`, `first-footprint-mirror.ts`.

## Boundary

Không ép viết, không ép đăng ký, không ép chia sẻ, không AI phân tích,
không AI đánh giá, không gamification. Đây là nghi thức, không phải
funnel. Xem chi tiết tại `docs/THE_FIRST_FOOTPRINT_CEREMONY.md`.

## The Gift — Memory Capsule "The First Footprint"

Điều người dùng viết (nếu họ chọn viết) được giữ lại như một Memory
Capsule đặc biệt — không phải dữ liệu hành vi để phân tích, mà một món
quà lưu niệm có thể được nhìn lại nhiều tháng sau qua Mirror, như một
điểm khởi đầu để đối chiếu với hiện tại — không để chấm điểm sự tiến
bộ, chỉ để nhắc "đây là nơi bạn từng đứng".

## Vị trí của The First Footprint trong hành trình Portal

The First Footprint đứng trước `OnboardingJourney`, không thay thế nó.
Onboarding vẫn cần thiết — nó phục vụ mục tiêu sản phẩm (activation).
The First Footprint phục vụ một mục tiêu khác, đến trước: chào đón một
con người, không phải phân loại một traffic. Đây cũng là điểm khởi đầu
sớm nhất mà Mirror (Sprint 15.0) có thể nhìn lại — dấu chân đầu tiên
trong toàn bộ hành trình trưởng thành của một người dùng.

## Companion Promise — deliverable quan trọng nhất

Lời hứa đầu tiên giữa Companion và người dùng: "Mình không biết rồi đây
bạn sẽ trở thành ai. Nhưng mình hứa sẽ luôn trân trọng dấu chân đầu
tiên này." Đây không phải một dòng UI ngẫu nhiên — đây là cam kết nền
tảng cho mọi tương tác Companion sau này.
