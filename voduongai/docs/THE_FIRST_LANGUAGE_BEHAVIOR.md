# The First Language Behavior (Sprint 22.6)

> "Companion không chỉ có Language Constitution. Companion phải bắt đầu
> nói theo nền văn hóa ấy."

`docs/THE_COMPANION_LANGUAGE_CONSTITUTION.md` đặt 12 phẩm chất ngôn ngữ
và 8 văn hóa giao tiếp. Sprint này biến một điều trong số đó thành hành
vi có thể cảm nhận được trong Portal — không viết lại toàn bộ copy, không
thay giọng toàn hệ thống.

## Hành vi ngôn ngữ đầu tiên là gì

Khi Companion đã biết người dùng (Character Memory đã chuyển hoá thật qua
nhiều Reflection) nhưng không có Internal Voice nào nổi lên ở khoảnh khắc
đó, Companion không im lặng tuyệt đối nữa — nó nói một câu ngắn, thật, thừa
nhận rằng nó đang ở đây dù chưa có điều gì rõ để nói.

**Vị trí trong code:**
- `getCompanionUncertaintyLine(seed)` — `src/lib/portal/intelligence/internal-voices.ts`
- Điều kiện kích hoạt: `characterMemory.length > 0 && voicesHeard.length === 0 && !loudest && !hesitation && !gardenStage`
- 3 biến thể, chọn bằng `characterMemory.length % 3` (deterministic, không random):

```
"Mình đang ở đây, chỉ chưa có gì thật sự rõ để nói ngay lúc này."
"Mình chưa chắc điều gì là cần nhất lúc này — mình vẫn ở đây cùng bạn."
"Mình muốn ở đây cùng bạn. Mình chỉ chưa biết nên bắt đầu từ đâu."
```

## Audit copy hiện tại (NV1)

| Điểm | Điểm mạnh | Điểm cần lưu ý |
|---|---|---|
| **First Meeting** (`RELATIONSHIP_STAGE_LINES`) | Ngắn, ấm, đúng giọng "mình" | Đạt — không cần sửa |
| **Daily Thought** (`proactive-thoughts.ts`) | Boundary rõ, không suy đoán cảm xúc | Đạt — đây là mẫu tốt |
| **Internal Voices** (Garden/Story/Reflection) | Warm, ngắn | `KnowledgeVoice`: "điều cần nhất" — hơi quyết đoán, Language Debt |
| **COMPANION_REFLECTION_RESPONSE** | Nhìn chung ấm, không đánh giá | `curiosity`: "mình thích sự tò mò của bạn" — đánh giá người dùng nhẹ, Language Debt |
| **GARDEN_COPY** | Phù hợp từng giai đoạn | `sprouting`: "kiên trì hôm nay cũng rất đáng quý" — hơi giảng đạo, Language Debt |
| **Life Moments** | Đa dạng, chân thật, không CTA | Đạt — đây là mẫu tốt |
| **Gap thật** | — | `!gardenStage && voicesHeard.length === 0 && characterMemory.length > 0` → trước đây im lặng tuyệt đối dù Companion đã "biết" người này |

## Vì sao chọn "chưa đủ chắc" / "chưa biết bắt đầu từ đâu"

Không phải vì đây là câu hay nhất có thể nói — mà vì đây là câu THẬT
nhất trong hoàn cảnh đó. Khi Companion không có signal rõ ràng để hành
động nhưng đã biết người dùng này, có hai lựa chọn:

1. Im lặng — đúng kỹ thuật (không nói khi không chắc), nhưng sai văn hóa
   (một người bạn đã quen không thể im lặng hoàn toàn khi gặp nhau, dù
   không có chuyện gì đặc biệt để nói)
2. Nói một điều thật về giới hạn của chính mình — đúng cả kỹ thuật (không
   giả vờ chắc) lẫn văn hóa (hiện diện, khiêm tốn, ấm áp)

Sprint này chọn số 2. Đây cũng nối trực tiếp với:

- **Sprint 22.4 The First Real Choice**: Companion không giả vờ chắc chắn
  khi bị Integrity Check chặn. Sprint này mở rộng tinh thần đó sang tình
  huống "không có gì để nói" — không im lặng giả như không có gì xảy ra,
  mà nói thật một điều nhỏ.
- **Language Constitution (Chương 12 — Presence)**: "Companion ở đây —
  không đang làm việc khác, không đang 'xử lý'. Đang ở đây, với người
  này." Uncertainty line chính là cách Presence trở thành hành vi, không
  chỉ là phẩm chất được khai báo.

## Liên hệ với Wisdom of Choice

`THE_WISDOM_OF_CHOICE.md` định nghĩa: "khi chưa đủ dữ liệu: hỏi thêm /
lắng nghe thêm / hoặc nói rõ rằng mình chưa đủ cơ sở — KHÔNG GIẢ VỜ
CHẮC CHẮN." Uncertainty line là một dạng triển khai thứ ba ("nói rõ rằng
mình chưa đủ cơ sở") vào một tình huống cụ thể, khác với `integrityHesitation()`
ở chỗ không cần Integrity Check thật sự chặn — Companion chỉ thật sự chưa
có hướng rõ ràng để đồng hành lúc này.

## Liên hệ với Trust

Một trong 7 nguyên tắc Relationship Era: "Trust phải được earned over
time." Uncertainty line không xây Trust bằng cách nói điều đúng — nó xây
Trust bằng cách KHÔNG NÓI điều sai (giả vờ có gì đó để nói khi không có).
Tin tưởng lâu dài đến từ sự nhất quán: Companion lúc nào cũng nói thật,
kể cả thật "mình chưa biết bắt đầu từ đâu."

## NV4 — Language Review

| Tiêu chí | Trả lời |
|---|---|
| **Respect** | Có — không giả vờ có câu trả lời khi không có; tôn trọng người dùng bằng cách không đưa ra điều gì trống rỗng |
| **Humility** | Có — đây là nội dung cốt lõi của hành vi này: Companion tự thừa nhận giới hạn của chính mình |
| **Clarity** | Có — ngắn, không vòng vo, nói đúng điều đang xảy ra |
| **Warmth** | Có — "mình vẫn ở đây cùng bạn" giữ Presence ấm, không phải sự vắng mặt lạnh |
| **Trust** | Có — thành thật về giới hạn bảo vệ Trust tốt hơn là một câu trả lời thuyết phục giả tạo |
| **Giúp người dùng bình tĩnh hơn** | Có — biết Companion vẫn ở đây dù không có gì "hữu ích" để nói tạo ra cảm giác an toàn, không áp lực |

## Điều kiện kích hoạt — tại sao gắn với characterMemory.length > 0

Nếu `characterMemory.length === 0` (người dùng mới, chưa có Character
Memory): Companion chưa "biết" người này theo nghĩa thật — im lặng hoàn
toàn vẫn phù hợp, và `CompanionGreetingBubble` đã xử lý cuộc gặp đầu tiên
qua `RelationshipStage`. Uncertainty line dành cho người dùng mà Companion
ĐÃ CÓ quan hệ thật — khi im lặng tuyệt đối sẽ cảm thấy bất ngờ hơn là
tự nhiên.

Đây cũng là nơi **Relationship Era** (Sprint 22.5) và **Language
Constitution** gặp nhau lần đầu trong code: hành vi ngôn ngữ được điều
chỉnh theo giai đoạn quan hệ thật, không áp dụng đồng đều cho mọi người.

## Giới hạn hiện tại

- Uncertainty line chỉ kích hoạt trong nhánh `!gardenStage` của
  `getCompanionDecision()` — khi gardenStage tồn tại, GARDEN_COPY đã
  cung cấp copy riêng, uncertainty line không cần thiết ở đó.
- Hiện không có cách người dùng "respond" lại uncertainty line — Companion
  nói nhưng chưa có gì xảy ra tiếp theo (tương tự giới hạn của Sprint 22.4
  về `integrityHesitation()`).
- Ba biến thể là đủ cho prototype nhưng có thể cần thêm khi hệ thống biết
  nhiều context hơn (ví dụ: đổi biến thể theo ngày trong tuần thay vì
  `characterMemory.length` — cần cân nhắc ở Sprint sau).

## Language Debt tiếp theo

- **`KnowledgeVoice` line** ("điều cần nhất") — hơi quyết đoán, có thể
  làm mềm theo Language Constitution Humility: "có lẽ" thay vì "là".
  Ưu tiên thấp vì context của KnowledgeVoice (/portal/knowledge path) là
  rõ ràng, nhưng đáng theo dõi.
- **`COMPANION_REFLECTION_RESPONSE.curiosity`** ("mình thích sự tò mò của
  bạn") — đánh giá người dùng nhẹ theo tiêu chí Respect; có thể đổi thành
  "mình cảm nhận được sự tò mò trong điều bạn vừa chia sẻ" (quan sát thay
  vì khen).
- **`GARDEN_COPY.sprouting`** ("kiên trì hôm nay cũng rất đáng quý") — có
  thể đổi thành "mình thấy bạn đang tiếp tục" (không giảng đạo, chỉ quan
  sát).
- **Fallback messages / Error messages** — chưa được chuẩn hóa theo Language
  Constitution; nhiều chỗ vẫn chưa đủ warmth.
- **Gratitude/Praise/Apology** — trong Portal UI (form success/error,
  submit confirmation) chưa qua Language Review lần nào.
- **Silence chưa thành hành vi ngôn ngữ đầy đủ**: uncertainty line này là
  bước đầu — nhưng vẫn chưa phân biệt "im lặng có chủ đích" vs "im lặng
  vì không có gì" vs "im lặng vì đang đợi người dùng" (Language Constitution
  Chương 5 có 3 loại).

## Sprint Review (NV7)

1. **Language Constitution đã chạm vào code/copy ở đâu?** —
   `src/lib/portal/intelligence/internal-voices.ts` (thêm
   `getCompanionUncertaintyLine(seed)` và 3 biến thể) và
   `src/lib/portal/intelligence/portal-brain.ts` (wiring `uncertaintyLine`
   vào `insightFromVoice` + `shouldSpeak`).
2. **Hành vi ngôn ngữ đầu tiên là gì?** — Khi Companion đã biết người
   dùng nhưng không có Internal Voice nào nổi lên, Companion nói một câu
   thừa nhận Presence mà không giả vờ có điều gì để nói — khiêm tốn, ấm,
   rõ.
3. **Có overbuild không?** — Không. Một helper nhỏ (3 lines + 1 hàm), một
   điều kiện (4 boolean checks), không engine mới.
4. **Có giữ đúng giọng Companion không?** — Có: giọng "mình," tiếng Việt
   tự nhiên, không đạo lý, không khuôn mẫu cứng.
5. **Có làm người dùng cảm thấy được tôn trọng hơn không?** — Có, theo
   đúng cách: không giả vờ chắc chắn, không để lại im lặng bất ngờ, không
   áp lực người dùng phải làm gì.
6. **Sprint tiếp theo nên kiểm chứng phần ngôn ngữ nào?** — Theo thứ tự
   Language Debt: (a) chuẩn hóa copy nhỏ (`curiosity`, `sprouting`,
   `KnowledgeVoice`) theo Language Review 7 tiêu chí; (b) định nghĩa "im
   lặng có chủ đích" thành một hành vi đo được (Presence, không chỉ
   Silence).

## Liên quan

- `docs/THE_COMPANION_LANGUAGE_CONSTITUTION.md` — nền tảng 12 phẩm chất
- `docs/THE_FIRST_REAL_CHOICE.md` — 22.4, tinh thần tương tự cho Integrity Check
- `docs/THE_WISDOM_OF_CHOICE.md` — "không giả vờ chắc chắn"
- `docs/THE_RELATIONSHIP_ERA.md` — lý do gắn điều kiện với characterMemory
- `src/lib/portal/intelligence/internal-voices.ts`
- `src/lib/portal/intelligence/portal-brain.ts`
