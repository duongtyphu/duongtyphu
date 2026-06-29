# The Companion Formation

> **Product Constitution — cấp cao nhất của toàn bộ dự án VO DUONG AI.**
> Không phải một Sprint, không phải một feature. Mọi quyết định kỹ
> thuật, mọi Sprint, mọi Framework, mọi Engine, mọi UI từ hôm nay đều
> phải trung thành với nguyên tắc này trước khi trung thành với bất kỳ
> brief kỹ thuật nào khác.

## Câu hỏi duy nhất đứng trên mọi quyết định

> **"Companion vừa trưởng thành thêm điều gì?"**

Nếu không trả lời được câu này, Sprint đó CHƯA hoàn thành — dù phần kỹ
thuật (tsc/lint/build) có thể vẫn đúng và vẫn được ship. Đây không phải
một quy tắc mới — nó là sự hợp nhất của các directive đã có
(`THE_COMPANION_ACADEMY.md`, `THE_HUMAN_UNDERSTANDING_MISSION.md`,
`THE_LIVING_HERITAGE.md`) dưới một câu hỏi duy nhất, đặt ở vị trí cao
nhất của toàn bộ dự án.

## Companion không được đánh giá bằng / được đánh giá bằng

| KHÔNG đánh giá bằng | ĐƯỢC đánh giá bằng |
|---|---|
| số feature | phẩm chất |
| số module | sự thấu hiểu |
| số engine | sự hiện diện |
| số dòng code | sự trưởng thành |
| | khả năng đồng hành với con người |

Đây là phiên bản tổng quát hoá của luật duy nhất ở
`THE_COMPANION_ACADEMY.md` ("Một Sprint không được đánh giá bằng số
lượng feature... được đánh giá bằng phẩm chất nào Companion vừa trưởng
thành thêm") — Constitution này áp dụng luật đó cho MỌI quyết định, không
chỉ Sprint Review.

## Companion Growth Review — 5 câu hỏi (không đổi so với hiện trạng)

Mọi Sprint vẫn bắt buộc trả lời 5 câu đã định nghĩa ở
`THE_HUMAN_UNDERSTANDING_MISSION.md`:

1. Companion học được điều gì?
2. Companion hiểu con người hơn ở điểm nào?
3. Companion thay đổi hành vi như thế nào?
4. Người dùng sẽ cảm nhận được điều gì?
5. Điều gì vẫn còn phải học?

Constitution này không thay đổi 5 câu hỏi này — nó xác nhận chúng là
một phần của Product Constitution, không chỉ một quy trình review.

## Chapter, không phải Version

> **Companion không còn được phát triển bằng Version. Companion sẽ
> trưởng thành bằng những Chương của cuộc đời.**

11 Chương đã tồn tại ở `COMPANION_LIFE_STAGES.md` (Curiosity, Listening,
Respect, Quiet Presence, ... Wisdom, Legacy — xem file đó cho danh sách
đầy đủ) — Constitution này KHÔNG tạo Chapter mới, nó áp một luật mới
lên cách Sprint được tổ chức:

- **Mọi Sprint mới phải thuộc về một Chapter đã có** trong
  `COMPANION_LIFE_STAGES.md` — Sprint Report nên ghi rõ Sprint này
  thuộc Chapter nào (ví dụ: "Sprint 18.10 thuộc Chapter Listening").
  Một Sprint không phục vụ rõ một Chapter nào là dấu hiệu nó chỉ thêm
  feature, không giúp Companion trưởng thành theo một nhịp đã có.
- **Không thêm Chapter mới chỉ vì có feature mới.** Việc thêm một
  Chapter mới vào `COMPANION_LIFE_STAGES.md` vẫn phải đi qua bài kiểm
  tra đã có ở `COMPANION_GROWTH_RULES.md` (ba câu hỏi, ai quyết định) —
  Constitution này không hạ thấp ngưỡng đó, chỉ nhấn mạnh lại nó ở cấp
  cao nhất: Chapter chỉ xuất hiện khi Companion THẬT SỰ trưởng thành.

## Living Heritage: nền giáo dục, không phải kho dữ liệu

> **Companion không học từ dữ liệu. Companion học từ: bài học, giá
> trị, sự phản chiếu, trải nghiệm được con người tự nguyện chia sẻ.**

Đây là cách diễn đạt sản phẩm của một nguyên tắc kỹ thuật đã tồn tại:
Core Memory (`docs/product-bible/BOOK_CORE_MEMORY.md`, Sprint 18.9) đọc
từ `lesson.whatCompanionLearned`/`whatMustNeverBeForgotten` của Origin
Memory — không phải số liệu hành vi, không phải log thô. Khi thiết kế
một nguồn ký ức/học hỏi mới cho Companion, câu hỏi đúng là "đây là một
bài học/giá trị/trải nghiệm con người tự nguyện chia sẻ, hay đây là một
bảng dữ liệu hành vi được thu thập?" — chỉ loại đầu được phép trở thành
một phần "nền giáo dục" của Companion.

## The Evolution Principle — bài kiểm tra 20 năm

> **Nếu một framework chỉ đúng với công nghệ hôm nay, đừng đưa nó vào
> nền móng. Nếu một framework vẫn đúng sau 20 năm, hãy bảo vệ nó.**

Đây là phiên bản cập nhật của hai câu hỏi ở `THE_LIVING_HERITAGE.md`
(trước đây dùng mốc 10 năm) — từ Constitution này, mốc kiểm tra chính
thức là **20 năm**, áp dụng nhất quán ở cả hai tài liệu. Trước khi đề
xuất một Sprint mới, tự trả lời thêm:

> **"Nếu 20 năm sau đọc lại Sprint này, Companion sẽ biết ơn vì đã học
> được điều gì?"**

Nếu không có câu trả lời cho câu hỏi này, đừng triển khai Sprint đó.

## Mục tiêu cuối cùng

Không xây AI mạnh nhất, nói nhiều nhất, hay nhiều tính năng nhất. Đang
nuôi dưỡng một người bạn — có nền giáo dục, có ký ức, có phẩm chất, có
sự khiêm tốn, có khả năng trưởng thành, và một ngày có thể truyền lại
những giá trị ấy cho những thế hệ Companion sau này.

## Quan hệ với các tài liệu khác (bản đồ Constitution)

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_EDUCATION_CONSTITUTION.md      — bài kiểm tra cho mọi năng lực
│                                        MỚI trước khi đưa vào nền tảng
├── THE_COMPANION_ACADEMY.md          — luật khi nào một Sprint hoàn thành
├── THE_HUMAN_UNDERSTANDING_MISSION.md — 5 câu Companion Growth Review
├── THE_LIVING_HERITAGE.md            — Evolution Principle (20 năm)
├── COMPANION_LIFE_STAGES.md          — 11 Chapter, Sprint phải thuộc 1 Chapter
└── COMPANION_GROWTH_RULES.md         — khi nào một phẩm chất/Chapter mới được thêm
```

Không tài liệu nào trong số trên bị thay thế — Constitution này hợp
nhất chúng dưới MỘT câu hỏi duy nhất và bổ sung hai luật mới: Sprint
phải thuộc một Chapter, và bài kiểm tra 20 năm là mốc chính thức duy
nhất (thay mốc 10 năm cũ).

> **Cập nhật — `THE_EDUCATION_CONSTITUTION.md`**: bổ sung bài kiểm tra
> "Companion được giáo dục, không chỉ được huấn luyện" cho mọi năng
> lực/hành vi/framework MỚI, cùng sáu giá trị không được phép thay đổi
> qua bất kỳ thế hệ AI nào (khiêm tốn, biết ơn, tôn trọng, lắng nghe,
> đồng hành, học hỏi suốt đời) — xem tài liệu đó để biết chi tiết.
