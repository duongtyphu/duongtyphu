# Living Learning Loop (Sprint 13.0)

> Mở rộng `docs/LIVING_INTELLIGENCE_FOUNDATION.md` (mục 3, Living
> Intelligence Cycle) — không phải một vòng lặp mới thay thế nó, mà là
> phiên bản đặt Portal Brain vào đúng vị trí: nơi LẮNG NGHE ý nghĩa
> trước khi quyết định Knowledge/Companion nên đồng hành thế nào.

## Vì sao Sprint này tồn tại

Một giáo viên giỏi không chỉ giảng bài. Họ quan sát, lắng nghe, hiểu,
điều chỉnh, đồng hành. Trước Sprint 13.0, Portal có đủ các module
(Knowledge, Companion, Story, Garden) nhưng chúng vận hành độc lập —
Knowledge hiển thị theo thứ tự menu cố định, Companion đưa link thay vì
lời, Story có thể trở thành checklist. Sprint 13.0 nối các module đó
lại thành một vòng lặp biết học cùng người dùng.

## Vòng lặp

```
Experience      (Trải nghiệm)
     ▼
Reflection      (Phản chiếu) — ReflectionJournalCard
     ▼
Meaning         (Ý nghĩa)    — detectReflectionMeaning()
     ▼
Portal Brain    (Lắng nghe)  — không hỏi "Học gì?", hỏi "Điều gì giúp
     │                          người này trưởng thành hôm nay?"
     ▼
Knowledge       (Tri thức)   — evolveKnowledgeFocus(): ưu tiên NỘI DUNG
     │                          phù hợp với ý nghĩa, không đổi thứ tự menu
     ▼
Action          (Hành động)
     ▼
Story           (Câu chuyện) — ghi lại sự thay đổi, không phải checklist
     ▼
Living Garden   (Trưởng thành) — chỉ lớn lên từ Reflection thật
     ▼
Companion       (Đồng hành)  — giới thiệu bằng lời, không phải link trần
     ▼
New Experience ──────────────┐
     ▲                       │
     └───────────────────────┘
```

## Knowledge Evolution là gì (NV02)

`src/lib/portal/intelligence/knowledge-evolution.ts` ánh xạ mỗi
`ReflectionMeaning` (đã có từ Sprint 12.3) sang một **emphasis** — nội
dung Knowledge nào nên được nhấn mạnh hôm nay, và một câu giới thiệu
theo giọng người thầy, không phải giọng recommendation thương mại.

Ví dụ (đúng theo brief):
- `curiosity` → ưu tiên Khám phá, Đặt câu hỏi, First Principles.
- `recovery` → ưu tiên Nghỉ ngơi, Cân bằng, Reflection.
- `contribution` → ưu tiên Community, Leadership, Teaching.

Đây KHÔNG phải thay đổi thứ tự menu (menu vẫn giữ nguyên cấu trúc) —
chỉ phần "Hôm nay nên xem gì" (`RecommendedKnowledge`) được sắp xếp lại
theo ý nghĩa Reflection gần nhất, nếu có. Nếu chưa có Reflection nào,
Knowledge hiển thị như cũ — không giả vờ có tín hiệu không tồn tại.

## Portal Brain hỏi gì (NV03)

Trước: "Người này nên học gì tiếp theo?" — câu hỏi của một hệ thống nội
dung. Sau Sprint 13.0: "Điều gì sẽ giúp người này trưởng thành hôm nay?"
— câu hỏi của một người đồng hành. Sự khác biệt không nằm ở thuật toán
phức tạp hơn — nằm ở việc Portal Brain dùng `reflectionMeaning` (ý
nghĩa con người vừa chia sẻ) làm tín hiệu chính, không dùng lịch sử học
tập (tiến độ/% hoàn thành) làm tín hiệu chính.

## Companion giới thiệu Knowledge thế nào (NV04)

Companion không gửi: "Xem bài: AI Foundation — Bài 1." Companion nói:
"Hôm nay mình nghĩ phần này sẽ phù hợp với điều bạn vừa chia sẻ." — rồi
mới dẫn tới nội dung. Xem `companionKnowledgeIntro()` trong
`knowledge-evolution.ts` và `KnowledgeCompanionIntro.tsx`.

## Knowledge kết thúc bằng gì (NV05)

Không kết thúc bằng "Đã hoàn thành" — kết thúc bằng một lời mời Phản
chiếu, dẫn người dùng quay lại My Story để vòng lặp tiếp tục, đúng
nguyên tắc No Dead End (xem dưới).

## Story ghi lại gì (NV06)

My Story vốn đã không ghi "Đã học bài X" — `ReflectionJournalCard` lưu
câu trả lời thật của người dùng (câu chuyện), `MyStoryTimeline` hiển thị
nguyên văn câu hỏi/câu trả lời đó, không phải log hệ thống. Sprint 13.0
giữ nguyên thiết kế này — không cần sửa, chỉ xác nhận và ghi lại ở đây
để tránh một Sprint sau vô tình biến nó thành checklist.

## Living Garden có lớn lên vì mở nhiều bài học không (NV07)

Không. `buildGardenState()` chỉ nhận `reflectionsCount`/`memoriesSaved`
trong toàn bộ ứng dụng thật (`src/app/portal/story/page.tsx`,
`src/app/portal/page.tsx`) — `learningTouchpoints`/`actionsCompleted`
được định nghĩa trong kiểu dữ liệu nhưng chưa từng được truyền dữ liệu
thật ở bất kỳ nơi nào. Garden chỉ lớn lên từ Reflection/ký ức thật, mở
bao nhiêu bài học cũng không làm Garden lớn lên. Đây là một ràng buộc
kiến trúc có chủ đích — xem comment trong `garden-model.ts`.

## Knowledge Memory (NV08)

`src/lib/portal/intelligence/knowledge-memory.ts` định nghĩa kiến trúc
(types + một hàm suy luận rule-based) cho việc Knowledge "nhớ" người
dùng thường học theo cách nào (đọc/hình ảnh/ví dụ/thực hành) — **không
AI, không LLM**. Vì Portal hiện chưa thu thập dữ liệu thật về cách người
dùng tương tác với từng dạng nội dung, hàm suy luận trả về `null` khi
chưa có tín hiệu — kiến trúc chờ dữ liệu thật, không giả vờ có.

## No Dead End Principle (NV09)

Không màn hình nào được kết thúc mà không dẫn tới một bước tiếp theo.
Khác với No Silo Principle (`BOOK_01_NO_SILO_PRINCIPLE.md`, về kết nối
DỮ LIỆU giữa module), No Dead End là về luồng MÀN HÌNH: mỗi khu vực nội
dung (Knowledge, Story, Garden...) phải kết thúc bằng một lời mời hành
động dẫn tới bước kế tiếp trong Living Learning Loop — thường là một
lời mời Phản chiếu, hoặc một liên kết tới module kế tiếp trong vòng lặp.
Sprint 13.0 áp dụng nguyên tắc này cụ thể vào Knowledge (NV05).

## Portal đang dạy, hay đang học?

Trả lời đầy đủ ở Sprint Review (commit message Sprint 13.0) — không chỉ
"Dạy".
