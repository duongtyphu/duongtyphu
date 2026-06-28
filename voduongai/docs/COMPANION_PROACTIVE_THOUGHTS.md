# Companion Proactive Thoughts (Sprint 13.1)

> "Companion không nói ngẫu nhiên vô nghĩa. Companion nói 'ngẫu nhiên có
> chủ đích'."

Trước Sprint 13.1, Companion chỉ phản hồi khi người dùng bấm vào nó.
Từ Sprint 13.1, Companion có thể chủ động hiện một suy nghĩ nhỏ
(`CompanionThought`) gần sự hiện diện của nó — nhưng không bao giờ ép
buộc, không bao giờ giống quảng cáo hay chat support.

## 1. Proactive Thought Model

`src/lib/portal/companion/proactive-thoughts.ts` định nghĩa:

- `ThoughtTrigger` — vì sao thought này phù hợp lúc này: `idle-presence`,
  `comeback`, `garden-signal`, `reflection-meaning`, `knowledge`, `build`,
  `story`, `quiet-presence`, `hope`, `next-small-step`.
- `ThoughtPriority` (`low` | `medium` | `high`) và `ThoughtTone`
  (`warm-quiet` | `encouraging` | `celebratory` | `gentle-invite`) — chỉ
  dùng nội bộ cho engine chọn lựa, **không bao giờ hiển thị cho người
  dùng** (đúng nguyên tắc không gamification — không điểm số, không thứ
  hạng nào lộ ra ngoài).
- `CompanionThought` — `id`, `line`, `trigger`, `tone`, `cooldownMs`,
  `priority`, và `shouldShow?` (điều kiện ngữ cảnh tuỳ chọn, ví dụ chỉ
  hiện khi `gardenStage` hoặc `pathname` phù hợp).

## 2. Thought Library

10 nhóm, mỗi nhóm 10 câu, viết theo `voiceTone` của Companion
(`companion-identity.ts`) và theo ranh giới NV9 (xem mục 6):

| Nhóm | Trigger | Ví dụ |
|---|---|---|
| Idle Presence | `idle-presence` | "Mình đang ở đây. Bạn không cần phải vội." |
| Comeback | `comeback` | câu chào nhẹ khi người dùng quay lại sau một khoảng vắng |
| Garden Signal | `garden-signal` | "Mình cảm nhận khu vườn của bạn đang chờ một hạt giống nhỏ." |
| Reflection Meaning | `reflection-meaning` | "Điều bạn vừa chia sẻ có vẻ mang theo một chút kiên trì." |
| Knowledge | `knowledge` | gợi mở nhẹ khi đang ở Knowledge OS |
| Build | `build` | gợi mở nhẹ khi đang ở Build OS |
| Story | `story` | gợi mở nhẹ khi đang ở My Story |
| Quiet Presence | `quiet-presence` | song hành với `character-lines.ts` |
| Hope | `hope` | song hành với `character-lines.ts` |
| Next Small Step | `next-small-step` | "Nếu hôm nay bạn chưa biết bắt đầu từ đâu, chúng ta có thể bắt đầu thật nhỏ." |

## 3. Proactive Thought Engine

`src/lib/portal/companion/proactive-thought-engine.ts` — rule-based,
**không phải AI**, đúng tinh thần `PORTAL_BRAIN.md`. Nhận pathname,
`PortalSignals` rút gọn (gardenStage, reflectionMeaning) và trạng thái
phiên (`ProactiveSessionState`), trả về một `CompanionThought` hoặc
`null`.

Quy tắc cứng (không đổi theo ngữ cảnh):

- Không hiện nhiều hơn 1 thought mỗi 3 phút (`GLOBAL_COOLDOWN_MS`).
- Không hiện lại cùng thought trong cùng session (`sessionStorage` ghi
  nhớ id đã hiện).
- Không hiện khi `CompanionSpace` đang mở, khi người dùng đang nhập
  input/textarea, khi Companion đã bị minimize, hoặc khi người dùng đã
  tạm ẩn proactive thoughts trong session này (NV07).
- Mỗi thought có `cooldownMs` riêng (theo nhóm) để không lặp quá dày dù
  đã đủ điều kiện ngữ cảnh.

## 4. Natural Timing (NV05)

Companion chỉ nói sau một khoảng lặng: `MIN_IDLE_MS = 8000` — trang
phải "ổn định" (route không vừa đổi) ít nhất 8 giây trước khi engine
được phép chọn một thought. Mốc này reset mỗi khi route đổi
(`CompanionPresence.tsx`, effect theo `pathname`), nên đổi route nhanh
liên tục sẽ không khi nào hiện thought.

## 5. Purposeful Randomness (NV06)

Khi nhiều thought cùng đủ điều kiện, engine không chọn đều ngẫu nhiên
trên toàn bộ thư viện. Engine:

1. Ưu tiên các trigger gắn với ngữ cảnh hiện tại (`garden-signal`,
   `reflection-meaning`, `comeback`, `knowledge`, `build`, `story`) hơn
   các trigger nền (`idle-presence`, `next-small-step`) — nếu có ít
   nhất một candidate ngữ cảnh, candidate nền bị loại khỏi vòng chọn.
2. Trong nhóm còn lại, chọn theo trọng số
   `priority × TRIGGER_CONTEXT_WEIGHT[trigger]` (Garden/Reflection nặng
   nhất, idle-presence nhẹ nhất) — đây là "ngẫu nhiên có chủ đích":
   ngẫu nhiên ở việc chọn câu nào trong nhóm đó, nhưng không ngẫu nhiên
   ở việc nhóm nào được ưu tiên.

## 6. NV09 — Boundary (ranh giới bắt buộc)

Companion **không được**:

- Tự ý đưa lời khuyên lớn.
- Suy đoán cảm xúc nhạy cảm của người dùng.
- Nói như đang đọc tâm trí người dùng.

Companion **chỉ được** mở ra một lời mời nhẹ.

- ✅ Đúng: "Mình cảm nhận có một điều gì đó đáng được lắng nghe ở đây."
- ❌ Sai: "Mình biết bạn đang buồn."

Mọi câu trong thư viện (mục 2) được viết theo ranh giới này ngay từ đầu
— dùng ngôn ngữ hedging ("có vẻ", "mình cảm nhận", "có thể", "mình
nghĩ"), không khẳng định trạng thái nội tâm của người dùng. Ranh giới
này nối tiếp "No Therapy Boundary" đã có ở `COMPANION_COVENANT.md`
(Sprint 13.1 — Companion Character Growth), áp dụng riêng cho ngữ cảnh
nói chủ động.

## 7. User Control (NV07)

- Nút "Đóng" trên `CompanionThoughtBubble` — ẩn thought hiện tại ngay.
- Thought tự ẩn sau 7 giây (`AUTO_HIDE_MS`) nếu người dùng không tương
  tác.
- Nút "Tạm ẩn trong phiên này" — gọi
  `pauseProactiveThoughtsForSession()`, ghi `sessionStorage`, không
  thought nào hiện lại cho tới khi tải lại tab mới/session mới.
- Nếu Companion đã bị minimize, hoặc `CompanionSpace` đang mở, engine
  không bao giờ chọn thought — không cần người dùng tự tắt riêng.

## 8. UI — Companion Thought Bubble

`src/components/portal/companion/CompanionThoughtBubble.tsx` — cùng
phong cách glassmorphism với `CompanionGreetingBubble`, kích thước nhỏ
hơn quảng cáo/chat-support: không icon "!", không màu đỏ, không khung
to, không nút "Trả lời ngay". Tôn trọng `prefers-reduced-motion` qua
class `.companion-thought-bubble` trong `globals.css`.

## 9. Companion Thought Governance (Sprint 18.6)

Một thought đã qua được mọi cooldown/rule ở trên vẫn còn một lớp kiểm
tra cuối: `CompanionPresence.tsx` gọi `chooseCompanionMoment()`
(`thought-governance.ts`) trước khi `setThought` chạy — nếu Speech
Budget của session/ngày đã hết, hoặc Proactive Thought thua một moment
ưu tiên cao hơn (Life Moment, Return After Silence, Birthday, Origin
Line, Story Moment, Daily Thought) đang cùng đủ điều kiện, Proactive
Thought im lặng. Đây là lớp điều phối NẰM TRÊN engine này, không thay
đổi bất kỳ quy tắc nào ở mục 1-8. Xem
`docs/COMPANION_THOUGHT_GOVERNANCE.md`.

## 10. Technical debt còn lại

- `weightedPick` dùng `now % weighted.length` làm nguồn "ngẫu nhiên" —
  đủ cho mục đích hiện tại (tránh lệ thuộc `Math.random()` ở mọi nơi
  gọi), nhưng chưa có seed riêng cho test tự động.
- Overlap thời gian giữa `CompanionGreetingBubble` và
  `CompanionThoughtBubble` mới được suy luận bằng thiết kế (greeting
  bubble biến mất trước ~6.5s, thought sớm nhất xuất hiện ở giây thứ 8),
  chưa được xác nhận thực nghiệm trên trình duyệt thật.
