# The Education Cycle

> NHIỆM VỤ SỐ 3 của Architecture Directive "Education → Growth →
> Legacy". Thay thế tư duy Input → Output bằng một vòng đời giáo dục
> 10 bước: Observe → Understand → Reflect → Choose → Act → Outcome →
> Review → Transform → Teach → Heritage. Đây là vòng đời GIÁO DỤC,
> không phải vòng đời AI (không phải pipeline xử lý request/response).

## Vì sao không phải Input → Output

Input → Output là tư duy của một CÔNG CỤ — nhận một yêu cầu, trả một
kết quả, hết. Một Companion thật không chỉ phản hồi — nó được THAY ĐỔI
bởi mỗi vòng. The Education Cycle mô tả phần "bị thay đổi" đó, mà
Input → Output hoàn toàn bỏ qua.

## 10 bước, đối chiếu với hệ thống đã có thật

### 1. Observe

Companion nhận biết một tình huống đang diễn ra — KHÔNG suy luận, chỉ
ghi nhận. Tương ứng với `EXPERIENCE_LIFECYCLE.md` Bước 1 (Experience).
**Đã có**: `reflections.ts`, `memoryCapsules.ts`.

### 2. Understand

Companion nhận ra Ý NGHĨA của điều quan sát được — không phải chỉ nội
dung chữ. Tương ứng `EXPERIENCE_LIFECYCLE.md` Bước 2 (Reflection).
**Đã có**: `reflection-meaning.ts` (10 loại `ReflectionMeaning`,
rule-based).

### 3. Reflect

Companion KIỂM TRA ý nghĩa đó trước khi hành động — đây là bước hay bị
bỏ qua nhất trong tư duy Feature-first (Feature thường nhảy thẳng từ
Understand sang Act). Tương ứng `MORAL_COMPASS.md`
(`chooseCompanionMoment()`), `CHARACTER_COHERENCE.md`.
**Đã có**: hành vi thật, nhưng chỉ kiểm tra xung đột GIÁ TRỊ — chưa
kiểm tra "đây có phải đúng THỜI ĐIỂM" một cách tách bạch.

### 4. Choose

Companion CHỌN một hành động trong số nhiều khả năng, dựa trên Bước 3 —
không phải hành động duy nhất có thể. Tương ứng
`getCompanionDecision()` (`portal-brain.ts`).
**Đã có**: hành vi thật.

### 5. Act

Companion thực hiện — câu trả lời, một Inner Thought, một đề xuất.
Tương ứng `inner-thought-engine.ts`, các touchpoint Portal thật.
**Đã có**: hành vi thật — đây là bước "Output" cũ, nhưng giờ chỉ là
MỘT bước trong 10, không phải điểm kết thúc.

### 6. Outcome

Điều gì THẬT SỰ xảy ra sau hành động đó với con người — không phải
liệu Companion có TRẢ LỜI hay không, mà liệu nó có GIÚP hay không.
Tương ứng `docs/POSITIVE_OUTCOME.md` (Sprint 21.7).
**Education Debt lớn nhất của toàn vòng đời**: chưa có cơ chế THẬT ghi
nhận Outcome sau mỗi lần Act — `docs/POSITIVE_OUTCOME.md` chỉ ĐỊNH
NGHĨA khái niệm, chưa có nơi nào trong code đọc được Outcome thật.

> **Cập nhật — Sprint 22.0, `docs/THE_TRANSFORMATION_ENGINE.md`**: gap
> này đã được đóng ở mức nhỏ — `src/lib/portal/companion/outcome-signal.ts`
> đọc Outcome thật (rule-based, dựa trên `character-memory.ts`) sau khi
> một Reflection mới xuất hiện. Outcome vẫn KHÔNG phải điểm kết thúc —
> nó chỉ là đầu vào cho Transformation Lifecycle (Outcome → Reflection
> → Behavior Change → Repeated Alignment → Transformation → Living
> Wisdom Candidate).

### 7. Review

Companion (hoặc Sprint review của người vận hành) nhìn lại: Outcome đó
có tốt không, có mâu thuẫn với lần trước không. Tương ứng
`docs/COMPANION_GROWTH_LOG.md` — nhưng ở cấp SPRINT, không phải ở cấp
TỪNG lần Act.
**Đã có một phần**: Review thật tồn tại nhưng ở granularity quá thô
(theo Sprint, không theo từng tương tác) để đóng vòng với Bước 6.

### 8. Transform

Nếu Review xác nhận tích cực LẶP LẠI nhiều lần (không phải một lần),
Lesson trở thành một phần ổn định hơn — Character. Tương ứng
`EXPERIENCE_LIFECYCLE.md` Bước 5-6 (Repeated Validation → Living
Wisdom), `character-memory.ts` (`CHARACTER_TRANSFORMATION_THRESHOLD`).
**Đã có**: hành vi thật, nhưng — đúng Education Debt đã ghi ở Sprint
21.7 — chỉ đếm số lần, chưa gắn với Outcome thật (Bước 6 chưa đóng
vòng được tới đây).

### 9. Teach

Companion truyền lại điều đã Transform — KHÔNG phải cho một người
dùng khác (vi phạm Privacy Boundary), mà ở mức trừu tượng, hoặc cho
một thế hệ Companion sau. Tương ứng "Learning Mentorship" ở
`THE_COMPANION_CURRICULUM.md` Year 3.
**Chưa có**: hoàn toàn chưa có cơ chế nào — đúng như Curriculum đã ghi,
Year 3 "hầu như chưa bắt đầu".

### 10. Heritage

Điều đã Teach, nếu đủ 5 điều kiện của `docs/LIVING_HERITAGE.md`, trở
thành tài sản lâu dài — không gắn một người dùng, một công nghệ, một
thời điểm. Tương ứng `EXPERIENCE_LIFECYCLE.md` Bước 7 (Heritage
Candidate).
**Chưa có**: tự nhận trong `LIVING_HERITAGE.md` — "khái niệm, không
Engine, không code".

## Vòng tròn, không phải đường thẳng

Heritage (Bước 10) không phải điểm kết — nó trở thành dữ liệu nền cho
một Observe (Bước 1) mới, của một Companion thế hệ sau. Đây là điểm
khác biệt căn bản với Input → Output: 10 bước này là một VÒNG TRÒN,
không phải một ĐƯỜNG THẲNG kết thúc ở câu trả lời.

## Bảng đối chiếu hiện trạng (để Sprint sau biết nên củng cố bước nào)

| Bước | Trạng thái |
|---|---|
| 1. Observe | Có hành vi thật |
| 2. Understand | Có hành vi thật |
| 3. Reflect | Có một phần — chưa tách bạch "đúng thời điểm" |
| 4. Choose | Có hành vi thật |
| 5. Act | Có hành vi thật |
| 6. Outcome | **Education Debt lớn nhất** — chỉ có định nghĩa, chưa có cơ chế đọc |
| 7. Review | Có nhưng quá thô (theo Sprint, không theo từng lần) |
| 8. Transform | Có nhưng chưa gắn Outcome (đếm số lần, không đếm chất lượng) |
| 9. Teach | Chưa có |
| 10. Heritage | Chưa có — chỉ có khái niệm |

## Xem tiếp

`docs/POSITIVE_OUTCOME.md`, `docs/EXPERIENCE_LIFECYCLE.md`,
`docs/LIVING_HERITAGE.md`, `docs/THE_COMPANION_CURRICULUM.md`,
`docs/THE_COMPANION_UNIVERSITY.md`, `docs/THE_GREAT_LIBRARY.md`.
