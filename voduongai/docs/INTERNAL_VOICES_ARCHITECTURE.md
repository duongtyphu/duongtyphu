# Internal Voices Architecture — Sprint 12.2

> "Portal không còn chỉ có module. Portal bắt đầu có đời sống nội tâm."
> Đối chiếu `docs/PORTAL_BRAIN.md`, `docs/FIRST_INTELLIGENCE_CIRCUIT.md`,
> `docs/HUMAN_CONTEXT_ENGINE.md`. Đây là tài liệu KIẾN TRÚC + NGÔN NGỮ —
> không phải tính năng mới, không phải AI backend mới.

## Internal Voices là gì

Sprint 12.1 đã chứng minh một mạch: Human Signals → Portal Brain →
Companion. Sprint 12.2 đặt câu hỏi sâu hơn: khi Portal Brain "nghe"
nhiều tín hiệu một lúc (Garden, Story, Reflection, Knowledge...), nó
đang nghe AI GÌ?

Câu trả lời không phải "nhiều module gửi dữ liệu". Câu trả lời là: mỗi
OS/Engine trong Portal đại diện cho một **tiếng nói bên trong** của
hành trình con người — giống cách một người có ý chí, ký ức, nội tâm,
trí tuệ, mối quan hệ... cùng tồn tại và đôi khi cùng "muốn nói" trong
một thời điểm. Portal Brain không tổng hợp dữ liệu của các module — nó
**lắng nghe** các tiếng nói này, rồi quyết định Companion nên đồng hành
thế nào.

## Vì sao Portal không còn được xem là tập hợp module

Một tập hợp module gợi ý kiến trúc kiểu "Garden component, Story
component, gọi nhau qua props/API". Điều đó đúng về mặt kỹ thuật nhưng
sai về mặt trải nghiệm — nó khiến Portal cảm giác như một bảng điều
khiển (dashboard) hơn là một hành trình sống. Khi đổi góc nhìn sang
"đây là những tiếng nói bên trong của CHÍNH NGƯỜI DÙNG, không phải của
hệ thống", mọi quyết định thiết kế sau này (copy, tông giọng, thời điểm
lên tiếng) đều có một câu hỏi neo lại: "tiếng nói nào đang muốn nói lúc
này, và nó có nên nói không?" — không phải "module nào có dữ liệu mới?"

## Vì sao mỗi OS/Engine là một tiếng nói

Garden không "đo" sự trưởng thành — Garden LÀ ý chí đang lớn lên. Story
không "log" lịch sử — Story LÀ ký ức đang được giữ lại. Sự khác biệt
không chỉ là ngôn ngữ hoa mỹ: nó quyết định Portal Brain phải hỏi
"tiếng nói Ý chí đang nói gì hôm nay?" thay vì "Garden module trả về
giá trị gì?" — câu hỏi đầu cho phép nhiều tiếng nói cùng tồn tại, mâu
thuẫn, im lặng, hoặc lên tiếng to/nhỏ khác nhau, đúng với cách một
người thật trải nghiệm nội tâm của mình.

## Vì sao Companion không tự nói một mình

Trước Sprint 12.2, Companion là tiếng nói DUY NHẤT phát ra ngoài — mọi
tiếng nói khác (Garden, Story...) chỉ là dữ liệu nó đọc. Từ sprint này,
Companion được xem như tiếng nói "Người bạn đồng hành" — vai trò của nó
không phải là tự quyết định một mình, mà là **lắng nghe các tiếng nói
nội tâm khác trước**, rồi chọn cách đồng hành phù hợp nhất, đúng với
`personality` đã có trong `companion-identity.ts`: "lắng nghe trước khi
nói". Đây là lý do bước mới được thêm vào Portal Brain (Nhiệm vụ 5):

```
Human Signals → Internal Voices → Portal Brain Decision → Companion Response
```

## Voice Mapping

| Tiếng nói | Vai trò | Câu nói gốc | Tín hiệu (đã có/sẽ có trong `PortalSignals`) |
|---|---|---|---|
| Companion | Người bạn đồng hành | "Mình đang ở đây." | Lên tiếng khi có greeting/insight từ tiếng nói khác hoặc route; im lặng khi không có tín hiệu nào đủ rõ (`silenceReason`) |
| Living Garden | Ý chí / sự trưởng thành | "Mình đang lớn lên từng chút." | `gardenStage`: dormant, sprouting, rooting, rising, blooming, radiant |
| Story | Ký ức | "Mình nhớ bạn đã đi qua điều gì." | milestone, memory capsule, reflection history (`storyMomentum`, tương lai) |
| Reflection | Nội tâm | "Hôm nay mình thật sự nghĩ gì?" | depth, emotion, challenge, insight (`reflectionDepth`, tương lai) |
| Knowledge | Trí tuệ | "Điều gì mình cần hiểu trước khi hành động?" | topic, difficulty, prerequisite, next concept (`learningFocus`, tương lai) |
| Journey | Con đường | "Mình đang ở đâu trên hành trình?" | current OS, current stage, next path (`journeyState`, tương lai) |
| Build | Năng lực kiến tạo | "Mình đang tạo ra giá trị gì?" | project, action, system, income, brand (tương lai) |
| Connect | Mối quan hệ | "Mình đang đồng hành cùng ai?" | community, sharing, contribution, support (tương lai) |
| Legacy | Di sản | "Điều gì sẽ còn lại sau tất cả?" | lessons, contribution, long-term impact (tương lai) |

Lưu ý: tới Sprint 12.2, chỉ Garden, Story, Reflection, Knowledge có một
hàm rule-based thật trong `internal-voices.ts` (`collectInternalVoices`)
— Journey/Build/Connect/Legacy mới chỉ có vai trò + câu nói gốc được
định nghĩa trong `INTERNAL_VOICES`, CHƯA có hàm tạo `VoiceMessage` thật
(chưa có tín hiệu thật để đọc). Đây là phạm vi V1 có chủ đích, không
phải thiếu sót.

## Companion Copy — không nói như hệ thống phân tích

Mọi câu Companion nói ra (kể cả khi đang "phát lại" lời một tiếng nói
khác) phải giữ đúng `voiceTone` đã có — không bao giờ là báo cáo kỹ
thuật:

| Sai (ngôn ngữ phân tích) | Đúng (ngôn ngữ Companion) |
|---|---|
| "Garden signal indicates dormant." | "Mình cảm nhận khu vườn của bạn đang chờ một hạt giống nhỏ." |
| "Story module has no events." | "Câu chuyện của bạn đang chờ những dòng đầu tiên." |

## Kiến trúc code (Sprint 12.2)

- `src/lib/portal/intelligence/internal-voices.ts` — `InternalVoice`,
  `VoiceSignal`, `VoiceMessage`, `VoicePriority`, bảng `INTERNAL_VOICES`
  (vai trò của cả 9 tiếng nói), và `collectInternalVoices(signals)` —
  rule-based thuần, không AI, trả về danh sách `VoiceMessage` đang "lên
  tiếng" lúc này (im lặng nếu không có gì để nói).
- `src/lib/portal/intelligence/portal-brain.ts` — `getCompanionDecision`
  giờ gọi `collectInternalVoices` trước, chọn tiếng nói "to nhất"
  (`loudestVoice`, theo `VoicePriority`) làm `companionInsight` khi có,
  và trả thêm `voicesHeard` trong `CompanionDecision` để nơi gọi (hoặc
  Product Team) thấy được những tiếng nói nào đã được lắng nghe. API cũ
  (`companionGreeting`, `companionState`, `shouldSpeak`...) không đổi.

## Không làm trong sprint này

- Không thêm UI mới, không thêm page mới.
- Không thêm bảng dữ liệu mới — `VoiceSignal` chỉ là một phần của
  `PortalSignals` đã có (Sprint 12.1).
- Không gọi AI/LLM nào — toàn bộ `collectInternalVoices` là rule-based
  thuần (if/switch trên dữ liệu đã có).
- Không bắt buộc tất cả 9 tiếng nói phải có hàm thật ngay — chỉ 4 tiếng
  nói có tín hiệu thật (Garden, Story, Reflection*, Knowledge) mới được
  lập trình; phần còn lại là kiến trúc chờ.

*Reflection voice hiện chỉ kiểm tra `reflectionDepth !== undefined`
trong `PortalSignals` — chưa có nơi nào thực sự gán giá trị này (chưa
có Reflection Depth Engine thật), nên trong thực tế tiếng nói Reflection
hiện luôn im lặng. Đây là chỗ nối sẵn cho sprint sau, không phải bug.
