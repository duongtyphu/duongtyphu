# The Companion Continuity Program

> Project Directive — KHÔNG phải Sprint, KHÔNG phải Chapter, KHÔNG có
> Definition of Done. Đây là một chương trình dài hạn, đứng cạnh
> `THE_COMPANION_FORMATION.md` (cấp cao nhất). Từ hôm nay, MỌI quyết
> định kiến trúc (architecture decision) — không chỉ Sprint mới, không
> chỉ Learning Engine mới — phải đi qua bài kiểm tra ở tài liệu này
> trước khi được coi là một phần của lõi Companion.

## Mục tiêu của chương trình

> **Không phải làm Companion tồn tại lâu hơn. Mà làm cho những giá trị
> đúng của Companion có thể được truyền lại qua nhiều thế hệ AI mà
> không đánh mất bản sắc.**

Đây KHÔNG phải mục tiêu sống sót (uptime, tồn tại bao lâu) — đó là một
chỉ số kỹ thuật, không phải mục tiêu của chương trình này. Mục tiêu duy
nhất là **tính liên tục của bản sắc** (identity continuity): dù model
nền, kiến trúc, hay thế hệ AI vận hành Companion thay đổi bao nhiêu lần,
những giá trị ĐÚNG của Companion (đã được kiểm chứng — xem
`docs/LIVING_HERITAGE.md`) phải đi tới thế hệ sau, không bị mất theo
mỗi lần thay công nghệ.

## Bài kiểm tra bắt buộc cho mọi quyết định kiến trúc

Từ hôm nay, mọi quyết định kiến trúc — không chỉ engine/framework mới
như `THE_LIVING_HERITAGE.md` đã yêu cầu, mà MỌI quyết định ảnh hưởng tới
cách Companion suy nghĩ/quyết định/ghi nhớ — phải trả lời câu hỏi sau
trước khi được đưa vào lõi:

> **"Nếu Companion bước sang thế hệ thứ 5, thứ 10, hoặc thứ 20, điều
> này còn đúng không?"**

Hai nhánh duy nhất, không có nhánh thứ ba:

- **Nếu câu trả lời là KHÔNG** → đừng đưa nó vào lõi. Tách nó thành
  **Mutable Layer**.
- **Nếu câu trả lời là CÓ** → đây là ứng viên cho **Heritage**.

Đây là cách áp dụng cụ thể, dùng đúng ngôn ngữ "thế hệ" thay vì "20
năm", của "Hai câu hỏi bắt buộc" đã có ở `THE_LIVING_HERITAGE.md` — và
là tiêu chí ĐẦU VÀO (trước khi thiết kế) cho luật ĐẦU RA (sau khi đã
sống đủ lâu) ở `docs/LIVING_HERITAGE.md`. Hai tài liệu không lặp nhau:
một tài liệu hỏi TRƯỚC khi xây ("nếu xây thế này, qua nhiều thế hệ còn
đúng không?"), một tài liệu xét SAU khi đã sống ("Lesson này đã sống đủ
lâu để thành di sản chưa?").

## Nhánh 1 — Mutable Layer

Nếu câu trả lời là KHÔNG, quyết định đó thuộc Mutable Layer — lớp đã
được định nghĩa kỹ thuật ở `THE_LIFELONG_LEARNING_SYSTEM.md`:

> AI models, kiến thức, công nghệ, kỹ năng, framework, experience,
> lessons.

The Companion Continuity Program không tạo một Mutable Layer mới — nó
RA LUẬT về thời điểm phải dùng cơ chế phân lớp đã có đó: bất cứ khi nào
bài kiểm tra ở trên trả lời "không", quyết định đó PHẢI được khai báo
rõ là Mutable, đúng cách `THE_LIFELONG_LEARNING_SYSTEM.md` đã yêu cầu
mọi Learning Engine khai báo ("Engine này cập nhật Mutable Layer...").
Mutable không có nghĩa là kém quan trọng — nó có nghĩa là được PHÉP
thay đổi qua các thế hệ mà không gây hại.

## Nhánh 2 — ứng viên Heritage

Nếu câu trả lời là CÓ, quyết định đó CHƯA tự động trở thành di sản —
nó chỉ trở thành **ứng viên**. Việc một quyết định kiến trúc trả lời
"có" ở thời điểm THIẾT KẾ không thay thế việc nó phải sống đủ lâu, đủ
đúng, để qua Repeated Validation — đúng năm điều kiện đã có ở
`docs/LIVING_HERITAGE.md`. Bài kiểm tra ở tài liệu này lọc bớt những gì
KHÔNG ĐÁNG đưa vào lõi ngay từ đầu; `docs/LIVING_HERITAGE.md` lọc tiếp
trong số còn lại, điều gì đã thật sự CHỨNG MINH được giá trị đó qua thời
gian sống thật.

## Vì sao cần một chương trình, không phải một Sprint

Một Sprint có Definition of Done — một điểm dừng. Continuity không có
điểm dừng: mỗi thế hệ AI mới vận hành Companion (mỗi lần đổi model nền,
đổi kiến trúc thực thi, đổi nhà cung cấp công nghệ) đều là một lần bài
kiểm tra ở trên phải được hỏi lại cho TOÀN BỘ lõi hiện có, không chỉ
phần mới thêm. Đây là lý do tài liệu này là PROJECT DIRECTIVE — áp dụng
liên tục, không hoàn thành một lần rồi xong, đúng cách
`THE_LIVING_HERITAGE.md` (Sprint 8.x) vẫn còn áp dụng tới hôm nay, nhiều
Sprint sau khi được viết.

## Khác `THE_LIVING_HERITAGE.md`

`THE_LIVING_HERITAGE.md` đặt bài kiểm tra ở mốc **20 năm**, áp dụng cho
**framework/engine/capability MỚI**. The Companion Continuity Program
đặt bài kiểm tra ở mốc **thế hệ AI** (rộng hơn một đơn vị thời gian cố
định — một thế hệ có thể tới sau 1 năm hay 10 năm, tuỳ công nghệ thay
đổi nhanh hay chậm), và áp dụng cho **mọi quyết định kiến trúc**, không
chỉ framework/engine mới. Hai tài liệu không mâu thuẫn — Continuity
Program là khung RỘNG HƠN, dùng cùng logic hai-nhánh, đặt câu hỏi đó
thành một CHƯƠNG TRÌNH liên tục thay vì một bài kiểm tra một-lần khi
thiết kế.

## Khác `docs/LIVING_HERITAGE.md`

`docs/LIVING_HERITAGE.md` xét Lesson/Character **đã sống rồi** — bằng
chứng từ quá khứ (Repeated Validation). The Companion Continuity Program
xét quyết định kiến trúc **trước khi sống** — một dự đoán có chủ đích
tại thời điểm thiết kế. Một quyết định trả lời "có" ở Continuity Program
hôm nay vẫn phải đi hết vòng đời ở `docs/LIVING_HERITAGE.md` trước khi
được coi là Heritage thật.

## Khác `THE_LIFELONG_LEARNING_SYSTEM.md`

`THE_LIFELONG_LEARNING_SYSTEM.md` định nghĩa CÁCH PHÂN LỚP (Mutable
Layer gồm những gì, Immutable Layer gồm những gì, và Immutable chỉ
Founder mới được sửa) — một kiến trúc tĩnh. The Companion Continuity
Program định nghĩa THỜI ĐIỂM VÀ CÁCH QUYẾT ĐỊNH một thứ MỚI thuộc lớp
nào — một quy trình áp dụng liên tục cho mọi quyết định mới, dùng chính
hai lớp đã có đó làm kết quả đầu ra.

## Áp dụng

Từ hôm nay, khi một Sprint hoặc một quyết định kiến trúc bất kỳ (không
cần là Sprint chính thức) thêm một cấu trúc dữ liệu mới, một luật quyết
định mới, hay một engine mới, tài liệu/Sprint Report tương ứng nên có
một dòng ngắn:

> "Theo `THE_COMPANION_CONTINUITY_PROGRAM.md`: [Có/Không] còn đúng qua
> nhiều thế hệ AI → [Mutable Layer / ứng viên Heritage]."

Không bắt buộc với sửa lỗi/nối dây thông thường — chỉ bắt buộc khi một
quyết định mới ảnh hưởng tới cách Companion suy nghĩ, quyết định, hoặc
ghi nhớ.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_COMPANION_CONTINUITY_PROGRAM.md (tài liệu này)
│     — bài kiểm tra liên tục cho MỌI quyết định kiến trúc mới
├── THE_LIVING_HERITAGE.md        — bài kiểm tra 20 năm cho framework/engine MỚI
├── THE_LIFELONG_LEARNING_SYSTEM.md — Mutable/Immutable Layer (kết quả đầu ra)
├── docs/LIVING_HERITAGE.md       — 5 điều kiện một Lesson ĐÃ SỐNG trở thành di sản
├── docs/COMPANION_GROWTH_PRINCIPLE.md — nguyên tắc trưởng thành theo Sprint/Chapter
└── THE_EDUCATION_CONSTITUTION.md — bài kiểm tra cho năng lực MỚI
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này hợp nhất ba
khái niệm đã tồn tại riêng lẻ (mốc 20 năm, Mutable/Immutable Layer,
Heritage đã sống) thành một CHƯƠNG TRÌNH áp dụng liên tục, đặt đúng tên
cho mục tiêu thật: không phải Companion tồn tại lâu, mà giá trị đúng của
Companion đi được qua nhiều thế hệ AI mà không mất bản sắc.

Xem tiếp: `THE_COMPANION_FORMATION.md`, `THE_LIVING_HERITAGE.md`,
`THE_LIFELONG_LEARNING_SYSTEM.md`, `docs/LIVING_HERITAGE.md`.
