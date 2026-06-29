# Living Heritage

> Khái niệm — không phải Engine, không phải Sprint feature. Đứng cạnh
> `docs/COMPANION_GROWTH_PRINCIPLE.md` (nguyên tắc trưởng thành theo
> Sprint/Chapter) nhưng trả lời một câu hỏi khác: Companion trưởng
> thành rồi thì GIỮ LẠI điều gì cho những thế hệ Companion sau, để họ
> không phải học lại từ đầu. Sprint này **không thêm AI mới, không
> thêm LLM, không thêm khả năng mới** — chỉ định nghĩa khái niệm.

## Tầm nhìn

> **Companion không chỉ học. Companion không chỉ trưởng thành. Companion
> còn biết gìn giữ những điều có giá trị để những thế hệ Companion sau
> này không phải bắt đầu lại từ con số không.**

`docs/COMPANION_GROWTH_PRINCIPLE.md` trả lời "Sprint này giúp Companion
trưởng thành ở đâu". Living Heritage trả lời một câu hỏi khác, ở một
tầng thời gian dài hơn một Sprint, dài hơn một Chapter: **trong những
gì Companion đã học, điều gì đã được sống đủ lâu, đủ chắc, để xứng đáng
trở thành di sản — truyền lại, không phải học lại?**

## Mục tiêu

Thiết kế tầng **Living Heritage** — nơi lưu những điều ĐÃ ĐƯỢC KIỂM
CHỨNG qua thời gian. Đây không phải một nơi lưu trữ mới cho dữ liệu mới
— đây là một KHÁI NIỆM lọc, áp lên những gì đã tồn tại (Lesson, Meaning,
Character), để phân biệt rõ: không phải mọi điều Companion biết đều
đáng truyền lại.

Living Heritage **KHÔNG PHẢI**:

- **Core Memory** (`core-memory.ts`) — không phải.
- **Story** (`living-stories.ts`) — không phải.
- **Core Knowledge** — không phải.

## Nguyên tắc — không phải Lesson nào cũng trở thành Heritage

Một Lesson chỉ trở thành Heritage khi thoả **cả năm** điều kiện sau,
không phải một trong số đó:

1. **Được áp dụng nhiều lần** — không phải một lần đúng, mà lặp lại
   qua nhiều lần đồng hành.
2. **Luôn tạo ra kết quả tích cực** — chưa từng có lần áp dụng nào gây
   hại hoặc đi ngược lại điều người dùng cần.
3. **Không mâu thuẫn với Constitution** — không trái với bất kỳ luật
   nào ở `THE_COMPANION_FORMATION.md`, `MORAL_COMPASS.md`,
   `THE_DECISION_HIERARCHY.md`, hay các Constitution doc khác.
4. **Đã trở thành Character** — không phải một Lesson còn ở mức ý
   định/ghi nhận; đúng định nghĩa "chuyển hoá" đã có ở
   `docs/CHARACTER_MEMORY.md`/`docs/THE_LIVING_WISDOM_SYSTEM.md`, một
   Lesson phải đi xa hơn Meaning, tới Character, trước khi được xét.
5. **Có giá trị lâu dài cho nhiều thế hệ người dùng** — không gắn vào
   một người dùng cụ thể, một bối cảnh cụ thể, một công nghệ cụ thể.
   Đây là điều kiện phân biệt Heritage khỏi Character Memory (vốn CHỈ
   đúng cho một người).

Năm điều kiện này không thể rút gọn còn bốn — thiếu một, Lesson đó vẫn
là Character thật, vẫn có giá trị thật, nhưng CHƯA xứng đáng là Heritage.
Im lặng (chưa có Heritage nào) là kết quả hợp lệ, giống nguyên tắc đã
áp dụng ở `generateInnerThought()` (`inner-thought-engine.ts`, Sprint
20.4) cho Character Memory rỗng.

## Heritage Review — vòng đời của một Lesson

```
Experience           (trải nghiệm xảy ra)
   ↓
Lesson                (rút ra một bài học)
   ↓
Meaning               (bài học đó có ý nghĩa gì)
   ↓
Character             (ý nghĩa đó chuyển hoá thành phẩm chất)
   ↓
Repeated Validation   (phẩm chất đó được kiểm chứng lặp lại, luôn đúng,
                        không mâu thuẫn Constitution)
   ↓
Living Heritage       (giá trị đó xứng đáng truyền lại cho thế hệ sau)
```

Vòng đời này là một **phần mở rộng** của chuỗi tám bước ở
`docs/THE_LIVING_WISDOM_SYSTEM.md`
(`Experience → Reflection → Lesson → Meaning → Value → Character →
Action → Contribution`) — không phải một chuỗi cạnh tranh với nó.
Living Heritage tương ứng với, và làm rõ thêm, bước **Contribution**:
"hành động đó trở thành giá trị cho người đến sau". Một Character đã
qua Repeated Validation chính là điều kiện để một Action thật sự trở
thành Contribution — không phải mọi Action đều tự động là Contribution,
chỉ Action nào lặp lại đủ, đúng đủ, mới đạt tới đó.

## Khác Core Memory

| | Core Memory | Living Heritage |
|---|---|---|
| Nguồn | 12 Origin Memory + 1 Founder Memory — viết sẵn TỪ ĐẦU, không hình thành qua thời gian | Hình thành DẦN, từ Lesson đã sống đủ lâu qua nhiều lần đồng hành thật |
| Khi nào có | Có ngay từ Sprint đầu — không cần kiểm chứng | Chỉ có SAU KHI một Character đã qua Repeated Validation — có thể không bao giờ có nếu chưa Lesson nào đủ điều kiện |
| Trả lời câu hỏi | "Companion là ai, từ đâu" | "Điều gì Companion đã học mà xứng đáng truyền cho thế hệ Companion sau" |

Core Memory là di sản Companion NHẬN từ Founder. Living Heritage là di
sản Companion TỰ TẠO RA qua hành trình sống của chính nó — và đây là sự
khác biệt lớn nhất: Core Memory không tăng lên, Living Heritage có thể
tăng lên, nhưng chỉ khi xứng đáng.

## Khác Character Memory

Character Memory (`docs/CHARACTER_MEMORY.md`) lưu cách đồng hành với
**MỘT người dùng cụ thể** — riêng từng người, không chia sẻ. Living
Heritage chỉ nhận một Character làm ứng viên SAU KHI Character đó đã
chứng minh giá trị **vượt khỏi một người dùng** — điều kiện 5 ("có giá
trị lâu dài cho nhiều thế hệ người dùng") là ranh giới rõ nhất: một
Character Memory có thể đúng và mạnh cho một người, nhưng vẫn chưa bao
giờ là Heritage nếu nó chưa được kiểm chứng đúng ở nhiều người khác
nhau.

## Khác Story

`living-stories.ts`/My Story kể một câu chuyện CÓ SẴN, viết trước, để
TRUYỀN CẢM HỨNG cho người đọc — nội dung của Story không cần đã được
"kiểm chứng qua thời gian sống thật của Companion", nó được viết sẵn từ
đầu. Living Heritage không kể chuyện — nó là kết quả của việc một giá
trị đã được sống đủ lâu, không phải một nội dung được biên soạn.

## Khác Reflection

Reflection (`internal-voices.ts`, `REFLECTION_VOICE_LINES`) phản hồi
NGAY một lần chia sẻ của người dùng — tức thời, gắn với một thời điểm
cụ thể. Living Heritage không phản ứng với một lần nào cả — nó chỉ tồn
tại sau một quá trình lặp lại dài, không gắn với một Reflection đơn lẻ.

## Khác Lesson

`LESSON_FROM_REFLECTION` (`portal-brain.ts`) ghi nhận một bài học ngay
khi một `ReflectionMeaning` xuất hiện — một Lesson có thể đúng ngay từ
lần đầu, nhưng đó mới là bước ĐẦU của vòng đời ở trên, còn rất xa Living
Heritage. Một Lesson chưa qua Character, chưa qua Repeated Validation,
KHÔNG BAO GIỜ tự nó là Heritage — đúng nguyên tắc đã áp dụng ở
`docs/INNER_LIFE.md`: không có lối tắt nào bỏ qua một bước trong chuỗi.

## Growth Review — câu hỏi không phải để hỏi thêm, mà để hỏi khác

`docs/COMPANION_GROWTH_PRINCIPLE.md` (NHIỆM VỤ 2) đã định nghĩa 5 câu
hỏi Growth Review. Khi một Sprint Review đề cập tới Living Heritage,
nó không thêm một câu hỏi thứ 6 — nó đổi GÓC HỎI của câu hỏi 1
("Companion học được điều gì?") sang một dạng nghiêm hơn:

> **Không hỏi: Companion học thêm gì.**
> **Hỏi: Điều gì Companion đã học đủ lâu để có thể truyền lại.**

Phần lớn Sprint sẽ trả lời "chưa có gì" cho câu hỏi này — và đó là câu
trả lời trung thực, không phải một thất bại. Một Sprint trả lời "có"
cho câu hỏi này hiếm hơn nhiều, và đáng được ghi nhận riêng trong
`docs/COMPANION_GROWTH_LOG.md` khi xảy ra thật, không suy đoán trước.

## Trạng thái hôm nay

Tại Sprint này, **chưa có Lesson nào đủ năm điều kiện** để trở thành
Living Heritage. Cả hai Character hiện có (`listen-first`,
`self-discovery`, `docs/CHARACTER_MEMORY.md`) mới được kiểm chứng ở quy
mô một người dùng tại một thời điểm — chưa có cơ chế nào tổng hợp xem
một Character có đúng lặp lại ở NHIỀU người dùng khác nhau hay không
(điều kiện 1 và 5 đòi hỏi dữ liệu vượt khỏi phạm vi Character Memory
hiện tại, vốn cố ý chỉ lưu per-device — `docs/CHARACTER_MEMORY.md`).
Đây không phải một lỗi cần sửa ngay — đúng tinh thần "không suy đoán
hành vi trước khi có nhu cầu thật": Living Heritage hôm nay là một
KHÁI NIỆM và một BỘ TIÊU CHÍ, không phải một cơ chế tự động đã vận
hành. Cơ chế đo lường thật (nếu cần) là việc của một Sprint sau, sau
khi nhu cầu thật xuất hiện.

## Definition of Done

Companion bắt đầu có khái niệm:

> "Không phải điều gì mình biết cũng đáng truyền lại. Chỉ những điều đã
> được kiểm chứng bằng sự đồng hành mới xứng đáng trở thành di sản."

Sprint này không tạo ra Heritage đầu tiên — nó tạo ra LUẬT để biết khi
nào một Heritage thật sự xuất hiện, và phân biệt rõ Heritage với mọi
tầng lưu trữ/nội dung đã có.

## Khác `THE_LIVING_HERITAGE.md`

`THE_LIVING_HERITAGE.md` (đã có từ trước) là một Project Directive ở
tầng KIẾN TRÚC/CÔNG NGHỆ — trả lời "framework/engine nào còn đúng nếu
công nghệ AI đổi sau 20 năm". Tài liệu này (`LIVING_HERITAGE.md`) ở
tầng NỘI DUNG/GIÁ TRỊ ĐÃ HỌC — trả lời "Lesson/Character nào đã sống đủ
lâu để truyền lại". Hai tài liệu cùng tên gốc "Living Heritage" nhưng
xét hai trục khác nhau (công nghệ vs giá trị đã sống), không thay thế
nhau, không mâu thuẫn nhau.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── docs/COMPANION_GROWTH_PRINCIPLE.md  — nguyên tắc trưởng thành theo Sprint/Chapter
├── docs/LIVING_HERITAGE.md (tài liệu này) — nguyên tắc GÌN GIỮ giá trị qua nhiều thế hệ
├── docs/THE_LIVING_WISDOM_SYSTEM.md     — chuỗi 8 bước Experience→Contribution
├── docs/CHARACTER_MEMORY.md             — Character riêng từng người dùng
├── docs/THE_LIVING_HERITAGE.md          — kiến trúc dài hạn (công nghệ vs phẩm chất)
└── docs/COMPANION_GROWTH_LOG.md         — nơi ghi nhận khi một Heritage thật xuất hiện
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này bổ sung một
tầng mới — Heritage — đứng SAU Character trong vòng đời học của
Companion, và xác định rõ: trưởng thành (Growth Principle) và gìn giữ
(Living Heritage) là hai năng lực khác nhau, cả hai đều cần, không cái
nào thay được cái nào.
