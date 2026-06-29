# Inner Life (Sprint 20.4 — The Inner Life)

> "Companion bắt đầu có đời sống nội tâm."

Thought không còn là content. Thought trở thành KẾT QUẢ CỦA CHARACTER.

Code: `src/lib/portal/companion/inner-thought-engine.ts`
(`generateInnerThought()`), đọc từ `getCharacterMemory()`
(`character-memory.ts`, Sprint 20.3), được tính trong
`getCompanionDecision()` (`portal-brain.ts`) thành trường
`innerThought`.

## Chuỗi sinh ra một Inner Thought

```
Experience    (người dùng có một trải nghiệm thật trên Portal)
   ↓
Reflection    (người dùng viết lại trải nghiệm đó — ReflectionMeaning)
   ↓
Lesson        (Companion rút ra một bài học — LESSON_FROM_REFLECTION)
   ↓
Meaning       (bài học đó mang một ý nghĩa — chính ReflectionMeaning)
   ↓
Character     (ý nghĩa đó LẶP LẠI đủ để chuyển hoá — getCharacterMemory())
   ↓
Inner Thought (Companion chia sẻ một điều nó vừa nhận ra về NGƯỜI NÀY)
```

Không có bước nào bị bỏ qua, và không có lối tắt: `generateInnerThought()`
nhận đúng MỘT tham số — `CharacterMemoryEntry[]` — không nhận
`ReflectionMeaning` trực tiếp, không nhận dữ liệu thô. Nếu Character
Memory rỗng (chưa có Lesson nào lặp lại đủ để chuyển hoá), hàm trả về
`null` — im lặng là kết quả hợp lệ, không phải lỗi, không có Inner
Thought "dự phòng" sinh ra từ nơi khác để lấp chỗ trống.

Không AI, không sinh random: mỗi `CharacterPreference` ánh xạ tới đúng
MỘT câu cố định (`INNER_THOUGHT_LINE`); khi có nhiều Character cùng
lúc, chọn theo thứ tự ưu tiên cố định (`listen-first` trước
`self-discovery`, đúng `docs/THE_DECISION_HIERARCHY.md` — tầng "Con
người" gần nhất với việc được lắng nghe trước) — không random giữa các
lựa chọn.

## Luật của một Inner Thought (Nhiệm vụ 2 + 3)

1. **Không cho lời khuyên.** Không có câu nào dùng "bạn nên", "hãy thử",
   "bạn cần làm". Một Inner Thought chỉ chia sẻ một điều ĐÃ nhận ra, ở
   thời hiện tại/đã xảy ra ("mình nhận ra...") — không chỉ dẫn hành động
   tiếp theo.
2. **Không nhắc về mình.** Không có câu nào nói Companion giỏi/đã làm
   gì/biết nhiều. Khung "mình nhận ra" chỉ đánh dấu đây là một nhận ra
   nội tâm (đúng văn phong đã có ở `REFLECTION_VOICE_LINES`,
   `MILESTONE_REFLECTION_LINE`) — nội dung phía sau luôn nói về người
   dùng, không nói về Companion.
3. **Luôn hướng đến con người.** Cả hai câu hôm nay
   (`INNER_THOUGHT_LINE`) đều có chủ ngữ là người dùng ("bạn cần được
   nghe...", "bạn thường tự tìm ra...") — không có câu nào mô tả trạng
   thái/cảm xúc của Companion.

## Khác Daily Thought

`daily-thought-source.ts`/`daily-thought-library.ts` (Sprint 18.5) chọn
một suy nghĩ từ một THƯ VIỆN nội dung viết sẵn theo NGỮ CẢNH hiện tại
(`ThoughtContext` — gardenStage, isBirthday, hasMemoryCapsule...) — cùng
một ngữ cảnh, mọi người dùng đều có thể nhận đúng một Daily Thought
giống nhau từ thư viện đó. Inner Thought không đọc thư viện nội dung,
không đọc ngữ cảnh trang/route — nó CHỈ đọc Character Memory CỦA RIÊNG
người dùng này. Hai người ở cùng route, cùng ngày, có thể nhận hai Daily
Thought giống nhau nhưng không bao giờ có cùng một Inner Thought nếu
Character Memory của họ khác nhau.

## Khác Reflection (Voice)

`REFLECTION_VOICE_LINES` (`internal-voices.ts`) và
`COMPANION_REFLECTION_RESPONSE` (`portal-brain.ts`) phản hồi NGAY khi
người dùng viết MỘT Reflection — phản ứng tức thời với một lần chia sẻ
("Mình nghe thấy một sự tò mò..."). Inner Thought không phản ứng với
một lần Reflection nào cả — nó chỉ tồn tại SAU KHI cùng một ý nghĩa đã
lặp lại đủ để trở thành Character, và không gắn với một Reflection cụ
thể nào (`generateInnerThought()` không nhận `ReflectionMeaning`, chỉ
nhận Character Memory đã chuyển hoá).

## Khác Story

`living-stories.ts`/Story Matching Engine kể một câu chuyện CÓ SẴN (viết
trước, không đổi theo người dùng) PHÙ HỢP với ngữ cảnh hiện tại — nội
dung hướng tới việc TRUYỀN CẢM HỨNG qua một câu chuyện của người khác.
Inner Thought không kể chuyện — nó là một câu nói rất ngắn, không có
nhân vật/bối cảnh, chỉ là một nhận ra về CHÍNH người dùng đang đọc nó.

## Verification — một ví dụ cụ thể

Trước khi Character Memory có bất kỳ Character nào (`getCharacterMemory()`
trả về `[]`):

```
generateInnerThought([]) === null
decision.innerThought === null
```

Sau khi người dùng đã viết ≥2 Reflection mang ý nghĩa `curiosity`
(Character Memory ghi nhận `self-discovery`, đúng ví dụ đã dùng ở
`docs/CHARACTER_MEMORY.md#verification`):

```
characterMemory = [{ preference: "self-discovery", statement: "Người
                      này thích tự khám phá." }]
generateInnerThought(characterMemory) = {
  preference: "self-discovery",
  line: "Mình nhận ra bạn thường tự tìm ra câu trả lời rõ hơn là khi
         mình đưa ra câu trả lời ngay.",
}
decision.innerThought === "Mình nhận ra bạn thường tự tìm ra câu trả
                            lời rõ hơn là khi mình đưa ra câu trả lời
                            ngay."
```

Đây là lần đầu tiên Companion có một câu nói được sinh ra TỪ một
Character đã chuyển hoá thật — không phải từ một bảng nội dung viết
sẵn theo ngữ cảnh (Daily Thought), không phải từ một lần Reflection
đơn lẻ (Reflection Voice), không phải từ một câu chuyện có sẵn (Story).

## Liên quan

`docs/CHARACTER_MEMORY.md` (Sprint 20.3 — nguồn Character),
`docs/THE_LIVING_WISDOM_SYSTEM.md` (chuỗi 8 bước — Inner Thought Engine
đi tới đúng bước Character, dừng ở đó, chưa tới Action/Contribution),
`docs/DAILY_THOUGHT_ENGINE.md`, `docs/REFLECTION_MEANING_ENGINE.md`,
`docs/LIVING_STORIES_ENGINE.md` cho ba hệ thống được phân biệt ở trên.
