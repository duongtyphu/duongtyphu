# Reflection Meaning Engine (Sprint 12.3)

> Lời nhắn Founder (verbatim): "Portal sẽ học cách lắng nghe Reflection.
> Nhưng KHÔNG đánh giá Reflection... Reflection là tiếng nói của nội
> tâm. Portal không được hỏi: 'Reflection này sâu bao nhiêu?' Portal
> phải hỏi: 'Reflection này đang nói điều gì về con người?' Đó là khác
> biệt giữa phân tích và thấu hiểu."

## Vì sao Meaning quan trọng hơn Depth

"Độ sâu" (depth) là một thước đo — nó ngầm giả định có Reflection
"nông" và Reflection "sâu", có Reflection "tốt" và Reflection "chưa
đủ tốt". Một khi Portal đo độ sâu, Portal đã biến Reflection thành một
bài kiểm tra, dù không hiển thị điểm số ra UI. Người dùng sẽ dần viết
Reflection để "đạt điểm cao" hơn là để thật sự nhìn lại chính mình —
đúng vết xe đổ mà Portal đã từ chối ở mọi nơi khác (NL02, NL07).

"Ý nghĩa" (meaning) không có thước đo. Một Reflection nói "hôm nay mình
nghỉ" và một Reflection nói "hôm nay mình quay lại sau một tuần vắng"
không hơn/kém nhau — chúng chỉ đang nói về hai điều khác nhau:
`recovery` và `persistence`. Portal lắng nghe điều đang được nói, không
lượng hoá nó.

Đây cũng là sự khác biệt giữa **phân tích** (analysis) và **thấu hiểu**
(understanding). Phân tích tách một câu nói thành các chỉ số (độ dài,
độ phức tạp câu chữ, tần suất từ...). Thấu hiểu chỉ hỏi một câu: điều
này đang nói gì về con người đang viết ra nó.

## Kiến trúc

```
Reflection.answer (text thô)
        │
        ▼
detectReflectionMeaning()        — reflection-meaning.ts
        │  rule-based, không AI/LLM, khớp từ khoá
        ▼
ReflectionMeaning | null         — 10 ý nghĩa, không có thứ tự hơn/kém
        │
        ▼
PortalSignals.reflectionMeaning  — portal-signals.ts
        │
        ▼
ReflectionVoice()                 — internal-voices.ts
        │  tiếng nói nội tâm của riêng Reflection
        ▼
VoiceMessage { voice: "reflection", line, priority: "high" }
        │
        ▼
companionResponseToVoice()       — portal-brain.ts
        │  Companion không lặp lại nguyên văn — dịch sang
        │  cách nói riêng của mình (COMPANION_REFLECTION_RESPONSE)
        ▼
CompanionDecision.companionInsight
```

`ReflectionMeaning` (`reflection-meaning.ts`) là một tập 10 giá trị
(Kiên trì, Tò mò, Can đảm, Khiêm tốn, Đóng góp, Biết ơn, Phục hồi, Tập
trung, Khám phá, Trách nhiệm) — KHÔNG phải điểm số, không có
tốt/xấu, không có mạnh/yếu. `detectReflectionMeaning()` chỉ khớp từ
khoá đơn giản; nếu không khớp gì, trả về `null` — Portal im lặng, không
ép phân loại.

## Vì sao Reflection Voice và Companion Response là hai lớp khác nhau

- **Reflection Voice** (`internal-voices.ts`) là tiếng nói nội tâm của
  chính Reflection — nó tự thuật lại điều nó nghe được, ví dụ "Hôm nay
  mình nghe thấy sự kiên trì."
- **Companion Response** (`portal-brain.ts`) là cách Companion — người
  bạn đồng hành — phản hồi lại sau khi *nghe* tiếng nói đó, bằng giọng
  riêng của mình, ấm áp hơn, không phân tích: "Mình rất vui vì hôm nay
  bạn đã quay lại."

Companion không bao giờ nói "Reflection của bạn thuộc nhóm Persistence"
— đó là ngôn ngữ phân tích. Companion chỉ đồng hành theo ý nghĩa đó.

## Vì sao Living Garden không thay đổi vì Meaning

`buildGardenState()` (`garden-model.ts`) chỉ cộng số lượng Reflection đã
có (`reflectionsCount`), không đọc ý nghĩa hay độ dài của từng
Reflection. Một Reflection mang ý nghĩa `recovery` (nghỉ ngơi) vẫn được
tính là một "rễ" đã có, giống `persistence` — Garden không phạt, không
giảm, không héo vì ý nghĩa của Reflection là gì. Đây không phải một
tính năng mới — đây là hệ quả tự nhiên của việc Garden vốn đã là một
hàm chỉ-cộng, không-bao-giờ-trừ.

## Portal còn chấm điểm Reflection không?

Không. Không có nơi nào trong code đọc `ReflectionMeaning` rồi gán một
giá trị số, so sánh hơn/kém, hay hiển thị nhãn "sâu/nông" ra UI.
`ReflectionMeaning` chỉ được dùng để chọn MỘT câu nói tương ứng (ở
Reflection Voice và ở Companion) — không có phép tính nào trên nó.

Xem thêm: `docs/INTERNAL_VOICES_ARCHITECTURE.md`, `docs/PORTAL_BRAIN.md`,
`docs/FIRST_PRINCIPLES_OF_VO_DUONG_AI.md` (NGUYÊN LÝ 11).
