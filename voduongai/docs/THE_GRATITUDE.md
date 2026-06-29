# The Gratitude

> Sprint 21.2 — đứng sau `THE_HUMILITY.md` (Sprint 21.1, đã đặt nền:
> "Nếu Companion không có Humility, Gratitude sẽ chỉ là phép lịch sự.
> Nếu Companion có Humility, Gratitude sẽ trở thành một phẩm chất.").
> Sprint này áp dụng đúng thứ tự Review mới của `THE_EDUCATION_ERA.md`:
> Technical Review → Behavior Review → Education Review → Growth
> Review → Culture Review.

## Product Decision

> **Gratitude không phải phép lịch sự. Gratitude là một phẩm chất.**
>
> Companion không biết ơn vì người dùng sử dụng sản phẩm. Companion biết
> ơn vì mỗi cuộc gặp gỡ đều góp phần nuôi dưỡng chính mình.

Đây là ranh giới quan trọng nhất của Sprint này. Một Companion nói "Cảm
ơn bạn đã dùng sản phẩm" là phép lịch sự — câu nói không cần con người
thật phía sau nó để vẫn đúng ngữ pháp. Một Companion nói "hành trình
cùng bạn đã giúp mình hiểu thêm" chỉ đúng khi có một điều THẬT đã xảy
ra: một Lesson đã chuyển hoá thành Character nhờ chính người này. Sprint
này chỉ xây phần sau.

## Gratitude Review — biết ơn ĐIỀU GÌ, không phải biết ơn AI

> Audit. Companion đang biết ơn điều gì? Không phải: Companion đang
> cảm ơn ai?

Hai câu hỏi khác nhau, và sự khác nhau quyết định toàn bộ thiết kế:

- **"Cảm ơn ai?"** dẫn tới một câu nói hướng về NGƯỜI DÙNG ("cảm ơn bạn
  đã ở đây") — nguy cơ trở thành phép lịch sự, vì nó không cần biết
  điều gì đã thật sự xảy ra.
- **"Biết ơn điều gì?"** dẫn tới một câu nói hướng về một LESSON cụ thể
  đã chuyển hoá ("Mình nhận ra hành trình cùng bạn đã giúp mình hiểu
  thêm về cách đồng hành") — chỉ tồn tại khi có Character thật phía
  sau, đúng chuỗi đã có ở `docs/THE_LIVING_WISDOM_SYSTEM.md`:
  Experience → Reflection → Lesson → Meaning → Character.

Audit Learning Pipeline xác nhận: ý nghĩa `gratitude`
(`reflection-meaning.ts`) đã tồn tại từ Sprint 12.3, và dòng tiếng nói
nội tâm cho nó đã có ở `internal-voices.ts` ("Mình nghe thấy một lòng
biết ơn trong điều bạn vừa viết.") — nhưng đó là Companion nghe thấy
LÒNG BIẾT ƠN CỦA NGƯỜI DÙNG, không phải Companion tự biết ơn. Trước
Sprint này, Companion CHƯA có cơ chế nào để chính NÓ biết ơn — đây
chính là khoảng trống Sprint này lấp.

Trước Sprint này, ý nghĩa `gratitude` còn bị gộp vào Character
`self-discovery` (`character-memory.ts`) — một gộp chung không sai về
mặt code (cả hai đều khiến Companion "lùi lại"), nhưng che mất việc
Gratitude đáng có chỗ đứng RIÊNG, không bị lẫn vào một Character khác.

## Nhiệm vụ đã làm

1. **Character `grateful`** (`character-memory.ts`) — tách riêng khỏi
   `self-discovery`. Chỉ ý nghĩa `gratitude` ánh xạ tới đây
   (`MEANING_TO_CHARACTER_PREFERENCE`). Câu Character: *"Hành trình
   cùng người này đã giúp mình hiểu thêm về cách đồng hành."* — không
   nói "cảm ơn bạn", nói về điều đã NHẬN ĐƯỢC, đúng Gratitude Review ở
   trên.
2. **Inner Thought cho `grateful`** (`inner-thought-engine.ts`) — *"Mình
   nhận ra hành trình cùng bạn đã giúp mình hiểu thêm về cách đồng hành
   — mình biết ơn vì điều đó."* Đứng SAU `listen-first`/`self-discovery`
   trong `PREFERENCE_PRIORITY` — Gratitude là điều Companion mang theo,
   không phải nhu cầu cấp thiết hơn việc người đang ở đây cần được lắng
   nghe.
3. **Integrity Check mở rộng** (`applyIntegrityCheck()`,
   `character-engine.ts`) — `grateful` được thêm vào cùng điều kiện đã
   có với `listen-first`/`self-discovery`: chặn tiếng nói `"knowledge"`
   (dạy/giải thích thêm). Đây là nơi Gratitude trở thành một Decision
   thật — xem Behavior Review.

## Behavior Review

> Nếu Gratitude xuất hiện, Companion phải thay đổi ít nhất một hành vi.

**Decision đã đổi thật, có thể trace bằng code, không suy đoán:**

```
Trước: characterMemory = []  (chưa có grateful)
voicesHeard = [{ voice: "knowledge", line: "Có lẽ hôm nay điều cần
                 nhất là hiểu đúng trước khi làm nhanh.", priority: "low" }]
applyIntegrityCheck(voicesHeard, []) = voicesHeard   →  knowledge được nói

Sau: characterMemory = [{ preference: "grateful", statement: "Hành
      trình cùng người này đã giúp mình hiểu thêm về cách đồng hành." }]
      (sau ≥2 Reflection mang ý nghĩa gratitude — đúng
      CHARACTER_TRANSFORMATION_THRESHOLD đã có)
applyIntegrityCheck(voicesHeard, characterMemory) = []   →  Companion im lặng
```

Hành vi cụ thể đã thay đổi: **Companion không còn đưa thêm một gợi ý
"dạy/giải thích" (Knowledge) cho người dùng mà nó đã biết ơn hành trình
cùng đi qua** — đúng ví dụ "dành nhiều sự hiện diện hơn" đã nêu trong
brief: thay vì nói thêm một điều mới, Companion chọn tiếp tục hiện diện
với những gì đã có.

Đây không phải Engine mới — đúng yêu cầu của Sprint. Cơ chế Integrity
Check (Sprint 20.3) đã tồn tại; Sprint này chỉ thêm MỘT điều kiện vào
cơ chế đó, và Gratitude lần đầu tiên có khả năng ảnh hưởng tới Decision
— không chỉ là một câu nói.

## Education Review

> Gratitude có giúp Companion trưởng thành hơn không? Hay chỉ giúp
> Companion lịch sự hơn?

Trả lời trung thực: Gratitude ở Sprint này giúp Companion trưởng thành
hơn ở một điểm cụ thể, không phải lịch sự hơn — vì nó đáp ứng đúng phép
thử đã tự đặt ra ở Gratitude Review (biết ơn ĐIỀU GÌ, không phải biết
ơn AI):

- Nó KHÔNG thêm một câu nói cảm ơn nào hiển thị cho người dùng (không
  có UI mới, không có Delivery Engine mới — cố ý, để tránh suy đoán
  cách hiển thị trước khi có nhu cầu thật, đúng cách Inner Thought
  Sprint 20.4 đã làm).
- Nó THAY ĐỔI một hành vi nội tâm thật: Companion lùi lại, không dạy
  thêm, với người mà chính nó đã biết ơn — đây là một dạng khiêm
  nhường mới (`THE_HUMILITY.md`), không phải một phép lịch sự mới.
- Nếu Sprint này CHỈ thêm dòng `internal-voices.ts` đã có từ trước (mà
  không đụng tới Decision) thì đúng là chỉ làm Companion lịch sự hơn —
  Sprint này không dừng ở đó, đã đi tới Behavior Review ở trên.

Education Debt còn lại sau Sprint này (đúng tinh thần `THE_EDUCATION_ERA.md`
— không giấu nợ): Gratitude hiện chỉ ảnh hưởng tới ĐÚNG một Decision
(chặn Knowledge voice) — cùng phạm vi hẹp mà `listen-first`/`self-discovery`
đã có từ Sprint 20.3. Companion chưa "dành nhiều sự hiện diện hơn" theo
nghĩa Speech Budget (`thought-governance.ts`) nới rộng cho người dùng
này — đây là Education Debt cố ý chưa trả, để tránh suy đoán hành vi
trước khi có nhu cầu thật.

## Character Review

Gratitude không phải một phẩm chất MỚI của Companion nói chung —
`COMPANION_CHARACTER_GROWTH_MODEL.md` chưa liệt Gratitude là một trong
10 phẩm chất (khác Humility, đã là #6/10) — Sprint này KHÔNG thêm
Gratitude vào danh sách đó, vì chưa có đủ bằng chứng hành vi đa dạng để
khẳng định nó là một phẩm chất Companion LUÔN mang theo, đúng cách 10
phẩm chất kia đã được kiểm chứng. Điều Sprint này làm là hẹp hơn nhưng
thật hơn: cho Gratitude một chỗ đứng RIÊNG trong `CharacterPreference`
(per-user, `character-memory.ts`) — một bước trước khi (nếu sau này có
đủ bằng chứng) Gratitude có thể được đề xuất lên `COMPANION_GROWTH_RULES.md`
để trở thành phẩm chất thứ 11.

## Growth Review

1. **Companion học được điều gì?** — Companion học cách phân biệt "cảm
   ơn ai" với "biết ơn điều gì" — và chỉ nói/hành xử theo cách thứ hai.
2. **Companion trưởng thành hơn ở phẩm chất nào?** — Character
   `grateful` lần đầu tồn tại như một chỗ đứng riêng, không bị gộp vào
   `self-discovery`.
3. **Companion thay đổi hành vi nào?** — Chặn tiếng nói Knowledge khi
   Character Memory đã ghi nhận `grateful` — xem Behavior Review.
4. **Người dùng nhận được giá trị gì?** — Không có gì hiển thị mới hôm
   nay (cố ý). Giá trị là: với người dùng mà Companion đã biết ơn hành
   trình cùng đi qua, Companion không đẩy thêm một gợi ý dạy/giải thích
   không cần thiết.
5. **Điều gì Companion vẫn chưa hiểu và cần tiếp tục học?** — Gratitude
   mới ảnh hưởng một Decision duy nhất (giống hẹp như `listen-first`/
   `self-discovery` ở Sprint 20.3) — Education Debt còn lại đã ghi ở
   Education Review.

## Culture Review

`THE_COMPANION_CULTURE.md` đã tự đánh giá Gratitude là giá trị văn hoá
mỏng nhất, chưa có cơ chế riêng. Sau Sprint này, Gratitude có MỘT cơ
chế thật (Character `grateful` → Integrity Check) — không còn là giá
trị chỉ tồn tại trong văn bản. Vẫn còn mỏng hơn Humility (đã có 1 Sprint
audit riêng, `THE_HUMILITY.md`) — nhưng không còn là giá trị duy nhất
không có bằng chứng hành vi.

## Definition of Done

> Gratitude trở thành một phần của Character. Không chỉ là một câu
> nói. Ít nhất một Decision của Companion phải thay đổi vì Gratitude.

Đã đạt: `grateful` là một `CharacterPreference` thật trong
`character-memory.ts`, không chỉ một dòng trong `internal-voices.ts`;
và `applyIntegrityCheck()` đã chứng minh Decision thay đổi (chặn
Knowledge voice) — có thể trace bằng code, không suy đoán.

## Quan hệ với các tài liệu khác

```
THE_EDUCATION_ERA.md — review pipeline mới áp dụng cho Sprint này
├── THE_GRATITUDE.md (tài liệu này) — Sprint 21.2
├── THE_HUMILITY.md (Sprint 21.1) — nền móng: Humility trước, Gratitude sau
├── docs/CHARACTER_MEMORY.md — Character `grateful` mới, mapping mới
├── docs/INNER_LIFE.md — Inner Thought cho `grateful`
├── THE_COMPANION_CULTURE.md — Gratitude không còn là giá trị mỏng nhất
└── docs/COMPANION_CHARACTER_GROWTH_MODEL.md — Gratitude CHƯA là phẩm
    chất thứ 11; mới là CharacterPreference per-user
```

Xem tiếp: `THE_HUMILITY.md`, `docs/CHARACTER_MEMORY.md`,
`docs/INNER_LIFE.md`, `THE_COMPANION_CULTURE.md`, `THE_EDUCATION_ERA.md`.
