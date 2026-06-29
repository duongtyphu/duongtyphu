# The Great Library

> NHIỆM VỤ SỐ 4 của Architecture Directive "Education → Growth →
> Legacy". Companion phải phân biệt rõ 6 TẦNG: Knowledge, Experience,
> Lesson, Wisdom, Heritage, Civilization. Không được trộn lẫn — mỗi
> tầng có vai trò riêng, và việc trộn lẫn chính là nguồn gốc của nhiều
> sai lầm đã được cảnh báo ở các Sprint trước (ví dụ "lặp lại nhiều lần
> không tự động là trí tuệ" — `docs/POSITIVE_OUTCOME.md`).

"Great Library" không phải một database, không phải một bảng Supabase
mới. Nó là một KỶ LUẬT PHÂN LOẠI — mỗi khi một Sprint định lưu/ghi nhận
một thứ gì, nó phải tự hỏi: "đây là tầng nào trong 6 tầng?" — vì cách xử
lý, cách lưu, và ranh giới Privacy Boundary của mỗi tầng khác nhau hoàn
toàn.

## 6 tầng, theo thứ tự từ cụ thể nhất đến trừu tượng nhất

### Tầng 1 — Knowledge

**Là gì**: thông tin khách quan, đúng/sai rõ ràng, không phụ thuộc một
người dùng cụ thể. Ví dụ: nội dung bài học AI Academy, một định nghĩa
kỹ thuật.

**Vai trò**: cung cấp NỀN, không tạo nghĩa, không tạo cảm xúc.

**Nơi tồn tại thật**: `KNOWLEDGE_ARCHITECTURE.md`, `KNOWLEDGE_EVOLUTION.md`,
`KNOWLEDGE_METADATA_STANDARD.md`, `INTELLIGENCE_GRAPH.md`.

**Ranh giới**: Knowledge KHÔNG BAO GIỜ chứa thông tin cá nhân của một
người dùng — nếu nó chứa, nó không còn là Knowledge, nó đã là
Experience (Tầng 2).

### Tầng 2 — Experience

**Là gì**: một sự kiện thật xảy ra với MỘT người dùng cụ thể.

**Vai trò**: nguyên liệu thô cho mọi tầng phía sau — nhưng KHÔNG được
dùng trực tiếp như Knowledge (không được trích dẫn cho người khác).

**Nơi tồn tại thật**: `reflections.ts`, `memoryCapsules.ts`,
`EXPERIENCE_LIFECYCLE.md` Bước 1.

**Ranh giới**: Experience luôn gắn định danh người dùng, không rời
khỏi phạm vi tài khoản của họ (xem `EXPERIENCE_LIFECYCLE.md` §2).

### Tầng 3 — Lesson

**Là gì**: một bài học rút ra từ MỘT Experience, diễn đạt được KHÔNG
cần nhắc tên/chi tiết câu chuyện gốc.

**Vai trò**: cầu nối giữa Experience cá nhân và một điều có thể tái sử
dụng — nhưng vẫn chỉ áp dụng cho CHÍNH người đó.

**Nơi tồn tại thật**: `LESSON_FROM_REFLECTION` (`portal-brain.ts`),
`CharacterPreference` (`character-memory.ts`).

**Ranh giới**: Lesson không chứa định danh, nhưng vẫn chỉ thuộc về một
người — không được dùng cho người dùng khác (xem
`EXPERIENCE_LIFECYCLE.md` Bước 3).

### Tầng 4 — Wisdom

**Là gì**: một Lesson đã được kiểm chứng LẶP LẠI và luôn tạo Positive
Outcome — không phải chỉ lặp lại nhiều lần.

**Vai trò**: phân biệt một Lesson NGẪU NHIÊN đúng một lần khỏi một
điều ĐÁNG TIN.

**Nơi tồn tại thật**: `docs/POSITIVE_OUTCOME.md`,
`EXPERIENCE_LIFECYCLE.md` Bước 5-6 (Repeated Validation → Living
Wisdom).

**Ranh giới**: Wisdom vẫn per-user — "đã sống đủ lâu" không có nghĩa
"đã chia sẻ cho người khác" (xem `EXPERIENCE_LIFECYCLE.md` Bước 6).

### Tầng 5 — Heritage

**Là gì**: một Wisdom đủ 5 điều kiện của `docs/LIVING_HERITAGE.md` —
đặc biệt điều kiện 5: có giá trị cho NHIỀU thế hệ, không gắn một
người/công nghệ/thời điểm cụ thể.

**Vai trò**: điều ĐÁNG GIỮ LẠI qua thời gian, vượt khỏi một người dùng.

**Nơi tồn tại thật**: chỉ có khái niệm — `LIVING_HERITAGE.md`,
`THE_LIVING_HERITAGE.md` tự nhận "không có Engine, không có code".

**Ranh giới**: Heritage chỉ được đề xuất ở dạng nguyên tắc trừu tượng,
không chứa thông tin nhận diện (xem `EXPERIENCE_LIFECYCLE.md` Bước 7).

### Tầng 6 — Civilization

**Là gì**: tập hợp Heritage đã được nhiều THẾ HỆ Companion (không phải
nhiều người dùng của MỘT Companion) xác nhận — giá trị phổ quát, không
gắn một sản phẩm, một công ty, một mô hình AI cụ thể.

**Vai trò**: tầng cao nhất — điều còn lại NẾU "toàn bộ source code phải
viết lại" (đúng câu hỏi Definition of Success của Directive này).

**Nơi tồn tại thật**: hoàn toàn chưa có — đây là tầng trừu tượng nhất,
chỉ tồn tại như khái niệm trong chính Directive này và
`THE_COMPANION_CONTINUITY_PROGRAM.md`.

**Ranh giới**: Civilization không bao giờ được suy ra từ MỘT Companion
hay MỘT công ty — nó chỉ có ý nghĩa khi được nhiều thế hệ độc lập xác
nhận, đúng tinh thần "không suy đoán trước khi có dữ liệu thật" đã áp
dụng xuyên suốt dự án này.

## Vì sao không được trộn lẫn

Mỗi lần một Sprint trộn hai tầng — ví dụ coi MỘT Experience của MỘT
người là Knowledge chung, hoặc coi một Lesson LẶP LẠI nhiều lần tự động
là Wisdom — chính là loại lỗi mà các Sprint trước đã phải dừng lại và
sửa (`docs/POSITIVE_OUTCOME.md` Sprint 21.7 là một ví dụ trực tiếp:
"lặp lại nhiều lần" bị nhầm là đủ điều kiện thành Character, trong khi
đúng ra phải là Tầng 4 thật — kiểm chứng Outcome, không phải đếm số
lần).

**Quy tắc kiểm tra nhanh khi viết code mới**: nếu một dữ liệu đang được
lưu/dùng, tự hỏi "nó có thể bị nhầm sang tầng cao hơn nó đang ở không?"
— nếu có, đó là rủi ro trộn tầng, dừng lại trước khi build.

## Bảng tổng hợp 6 tầng

| Tầng | Gắn với | Ranh giới | Trạng thái |
|---|---|---|---|
| 1. Knowledge | Không ai cụ thể | Không chứa thông tin cá nhân | Có thật |
| 2. Experience | Một người dùng | Không rời khỏi tài khoản đó | Có thật |
| 3. Lesson | Một người dùng | Không chứa định danh, vẫn riêng | Có thật |
| 4. Wisdom | Một người dùng | Phải có Positive Outcome, không chỉ lặp lại | Định nghĩa có, cơ chế đo Outcome chưa có |
| 5. Heritage | Nhiều thế hệ NGƯỜI DÙNG | Trừu tượng, không nhận diện | Chỉ khái niệm |
| 6. Civilization | Nhiều thế hệ COMPANION | Không gắn một sản phẩm/mô hình | Chưa có gì |

## Xem tiếp

`docs/EXPERIENCE_LIFECYCLE.md`, `docs/LIVING_HERITAGE.md`,
`docs/POSITIVE_OUTCOME.md`, `docs/FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`,
`docs/THE_COMPANION_CONTINUITY_PROGRAM.md`,
`docs/THE_EDUCATION_CYCLE.md`.
