# BOOK_LIVING_EXPERIENCES — Sprint 18.7

"Companion bắt đầu có nhiều trải nghiệm hơn để suy nghĩ."

## Companion không suy nghĩ từ dữ liệu

Một hệ thống dựa trên dữ liệu sẽ hỏi: "có tín hiệu nào available không?
Nếu có, render một câu phù hợp." Đó là cách một dashboard hoạt động —
không phải cách một người bạn nghĩ ra điều để nói.

Companion suy nghĩ từ trải nghiệm. Trước khi có một câu để nói, Companion
phải có một điều đã thật sự xảy ra với nó: nhìn thấy một góc vườn đổi
khác, đọc lại một câu chuyện cũ, nhớ ra một capsule ký ức. Mỗi điều đó là
một **Observation** — và từ Observation đó, Companion rút ra một
**Meaning**. Chỉ khi có cả hai, mới có một **Thought Seed** đáng để nói
ra.

```
Observation  →  Meaning  →  Thought Seed
(điều vừa      (ý nghĩa      (câu Companion
 nhận ra)       rút ra)       thật sự nói)
```

## 8 nguồn trải nghiệm (ExperienceSource)

Story, Memory, Journey, Knowledge, Reflection, Garden, Life Moments,
Origin — `living-experience.ts`. Mỗi nguồn có một danh sách
`LivingExperience` cụ thể, không trừu tượng, không chung chung kiểu "hôm
nay là một ngày tốt".

## Vì sao không phải random

Một Daily Thought không được chọn ngẫu nhiên trong toàn bộ thư viện rồi
đi tìm lý do hợp lý hoá nó. Thứ tự luôn là: tín hiệu context có thật
(`mapContextToSource`) → nguồn trải nghiệm phù hợp
(`toExperienceSource`) → một `LivingExperience` cụ thể trong nguồn đó
(`experiencesBySource`) → câu nào trong thư viện gắn với đúng
`experienceId` đó được phép nói. Không có bước nào trong chuỗi này là
`Math.random()` hay "chọn bất kỳ câu nào còn lại".

## Definition of Done

Mỗi `DailyThought` trong `daily-thought-library.ts` có một `experienceId`
trỏ tới đúng một `LivingExperience` trong `living-experience.ts` — nghĩa
là mọi Daily Thought Companion từng nói đều truy ngược được về ít nhất
một trải nghiệm có thật, không có câu nào "trôi tự do" không gắn với
trải nghiệm nào.

*Liên quan: `docs/DAILY_THOUGHT_ENGINE.md`, `living-experience.ts`,
`daily-thought-source.ts`, `daily-thought-library.ts`,
`proactive-thought-engine.ts`.*
