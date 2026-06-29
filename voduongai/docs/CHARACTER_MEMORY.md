# Character Memory (Sprint 20.3 — The Living Character)

> "Companion bắt đầu giữ lời hứa với chính mình."

Character Memory là nơi Integrity (phẩm chất thứ 8, `CHARACTER_PROFILE`
ở `character-engine.ts`) trở thành HÀNH VI thật, không chỉ là một khai
báo. Trước Sprint này, Integrity được khai báo ở Sprint 20.2 nhưng chưa
có cơ chế kiểm tra mâu thuẫn thật — Sprint này xây cơ chế đó.

Code: `src/lib/portal/companion/character-memory.ts` (đọc/viết),
`applyIntegrityCheck()` ở `character-engine.ts` (kiểm tra mâu thuẫn),
gọi từ `getCompanionDecision()` ở `portal-brain.ts`.

## Companion Memory không lưu gì

> Không lưu Companion đã nói gì. Lưu Companion đã học được điều gì về
> cách đồng hành với CHÍNH người dùng này.

Character Memory chỉ lưu một câu nói rất ngắn, qualitative, về CÁCH
đồng hành — ví dụ đúng hai câu trong brief gốc:

- "Người này cần được lắng nghe trước." (`listen-first`)
- "Người này thích tự khám phá." (`self-discovery`)

Không có điểm số, không có level, không có gì hiển thị cho người dùng
— đúng nguyên tắc chống gamification của toàn dự án.

## Khác Core Memory

| | Core Memory (`core-memory.ts`) | Character Memory |
|---|---|---|
| Phạm vi | Toàn cục — giống nhau cho mọi người dùng | Riêng từng người dùng (per-device) |
| Nguồn | 12 Origin Memory + 1 Founder Memory, viết sẵn | Lesson lặp lại từ Reflection của chính người đó |
| Nội dung | Câu chuyện gốc của Companion ("Companion đã học gì từ Founder") | Cách đồng hành với MỘT người cụ thể |
| Đổi theo thời gian? | Không — `getCoreMemories()` không nhận tham số, luôn trả về cùng kết quả | Có — tích lũy dần theo Reflection của người dùng |

Core Memory trả lời "Companion là ai". Character Memory trả lời "Companion
nên đồng hành với NGƯỜI NÀY như thế nào".

## Khác Preference

Character Memory **không phải** một bảng cài đặt/sở thích người dùng tự
chọn (ví dụ "thích chủ đề Affiliate hơn AI Academy", "thích nhận thông
báo buổi sáng"). Hai khác biệt cốt lõi:

1. **Người dùng không tự khai báo nó.** Nó được Companion tự RÚT RA từ
   hành vi Reflection lặp lại — không có ô chọn "tôi thích được lắng
   nghe trước" ở đâu trong app.
2. **Nó cần lặp lại để "chuyển hoá".** Một Lesson chỉ trở thành Character
   sau `CHARACTER_TRANSFORMATION_THRESHOLD` lần cùng một ý nghĩa xuất
   hiện — một lần là tình cờ, không phải Character (NHIỆM VỤ 3, brief
   gốc: "Không lưu Preference. Không lưu sở thích.").

## Khác Story

`living-stories.ts`/My Story lưu NỘI DUNG kể lại CHO người dùng (một câu
chuyện họ có thể đọc lại). Character Memory không bao giờ hiển thị cho
người dùng — nó là một trạng thái nội tâm Companion dùng để TỰ kiểm tra
trước khi nói, không phải nội dung để đọc.

## Cơ chế: từ Lesson tới Integrity Check

```
Reflection (người dùng viết) 
  → ReflectionMeaning (đã có từ Sprint 12.3)
  → recordReflectionForCharacterMemory(meaning)   [Sprint 20.3]
  → đếm dồn theo CharacterPreference (listen-first / self-discovery)
  → getCharacterMemory()  trả về Character ĐÃ vượt ngưỡng lặp lại
  → applyIntegrityCheck(candidates, characterMemory)  [character-engine.ts]
  → getCompanionDecision()  [portal-brain.ts]
```

`MEANING_TO_CHARACTER_PREFERENCE` (`character-memory.ts`) ánh xạ rule-based
dựa trên ý nghĩa thật của từng `ReflectionMeaning` đã viết sẵn ở
`LESSON_FROM_REFLECTION` (`portal-brain.ts`):

- **`listen-first`**: `persistence`, `courage`, `humility` — ba ý nghĩa
  mà Lesson của chúng nói trực tiếp về việc người đó cần được NHÌN
  NHẬN/LẮNG NGHE trước khi nhận thêm điều gì khác.
- **`self-discovery`**: `curiosity`, `contribution`, `gratitude`,
  `recovery`, `focus`, `discovery`, `responsibility` — các ý nghĩa còn
  lại đều nói về việc Companion nên LÙI LẠI, không thêm diễn giải, để
  người dùng tự đi tới điều đó.

## Integrity Check thay đổi Decision như thế nào

`applyIntegrityCheck()` chỉ áp dụng cho tiếng nói `"knowledge"` (tiếng
nói duy nhất hôm nay mang tính "dạy/giải thích thêm" — `reviewDecisionCandidate`
ở Sprint 20.1 đã xếp nó là không `helpsGrowth`). Nếu Character Memory đã
ghi nhận `listen-first` HOẶC `self-discovery`, một gợi ý Knowledge mâu
thuẫn trực tiếp với Lesson đã chuyển hoá đó — Companion CHẶN tiếng nói
này, dù nó có là candidate duy nhất.

### Verification — một ví dụ cụ thể

Trước Sprint 20.3, ở `/portal/knowledge` không có `gardenStage` và
không có `reflectionMeaning` đang hoạt động:

```
voicesHeard = [{ voice: "knowledge", line: "Có lẽ hôm nay điều cần nhất
                 là hiểu đúng trước khi làm nhanh.", priority: "low" }]
loudest = knowledge   →  companionInsight = "Có lẽ hôm nay điều cần
                          nhất là hiểu đúng trước khi làm nhanh."
```

Sau khi người dùng đã viết ≥2 Reflection mang ý nghĩa `curiosity` (Lesson:
"Một câu hỏi thật lòng quan trọng hơn một câu trả lời sẵn có" → chuyển
hoá thành Character `self-discovery`: "Người này thích tự khám phá."),
CÙNG MỘT candidate list, cùng route, **không có gì khác đổi ngoài
Character Memory**:

```
characterMemory = [{ preference: "self-discovery", statement: "Người
                      này thích tự khám phá." }]
applyIntegrityCheck([knowledgeVoice], characterMemory) = []
loudest = null   →  companionInsight = null
```

Decision đã đổi — không phải vì `voicesHeard` đổi, không phải vì priority
đổi, mà vì Character Memory của CHÍNH người dùng này mâu thuẫn với việc
Companion chuẩn bị "dạy" thêm một điều. Đây đúng là Định nghĩa hoàn thành
của Sprint 20.3: Companion thay đổi Decision do Character Memory, không
do Priority.

## Liên quan

`docs/CHARACTER_ENGINE.md` (Sprint 20.1 — Character Review, đổi thứ
tự trong cùng priority), `docs/MORAL_COMPASS.md` (Sprint 20.2 — Human
Benefit thắng Priority), `docs/THE_DECISION_HIERARCHY.md` (tầng "Niềm
tin" thắng tầng "Hiệu suất" — Integrity Check là một áp dụng cụ thể của
luật này), `docs/LIVING_LEARNING_AUDIT.md` (đã đề xuất hướng này từ
Sprint 19.1).
