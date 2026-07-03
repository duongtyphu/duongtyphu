# Journey Unlock Framework™ — Blueprint

Product Constitution. Áp dụng cho toàn bộ Portal — không riêng Academy: CKOS, Academy, Project
& Opportunities, Premium, Journey, Garden, Companion đều dùng chung một framework duy nhất
(Legacy Asset của Sprint 04.5). Tài liệu này là nền, được khoá trước khi bất kỳ Sprint nào code
tính năng theo Constitution này.

**Sprint 04.5 finalize**: framework layer đổi tên từ bản nháp Sprint 04 sang tên chính thức
(`LOCKED` thay cho `VISIBLE`, `NEXT JOURNEY` thay cho `NEXT`) — xem mục "6 lớp Unlock" bên
dưới. Đây là tên DUY NHẤT được dùng từ nay về sau.

## Vấn đề Constitution này giải quyết

Portal hiện tại (CKOS, Academy, Opportunities...) có xu hướng cho người dùng thấy **toàn bộ**
nội dung ngay khi họ vào một khu vực: toàn bộ Seed trong Collection, toàn bộ Mission trong
Journey, toàn bộ Prompt Pack. Khi người dùng "xem hết" một khu vực, cảm giác còn lại là
"mình đã xem hết Portal" — không còn lý do quay lại.

> Người học không được cảm thấy: "Mình đã xem hết Portal."
> Người học phải luôn cảm thấy: "Có điều gì đó đang chờ mình ở phía trước."

Journey Unlock System không phải một tính năng game hoá. Nó là cách tổ chức lại **nhịp độ hé
lộ tri thức** để mỗi khu vực Portal luôn có một lớp nữa phía sau lớp đang thấy.

## 6 lớp Unlock (tên chính thức — Sprint 04.5)

```
LOCKED → DISCOVER → PRACTICE → REFLECTION → UNLOCK → NEXT JOURNEY
```

| Lớp | Ý nghĩa | Người dùng thấy gì |
|---|---|---|
| **LOCKED** | Phần chưa khả dụng, nhưng gợi ý sự tồn tại của nó — không phải "trống rỗng/ẩn hoàn toàn" | Tiêu đề, mô tả ngắn, lý do nó tồn tại — đủ để tò mò, không đủ để "xem hết" |
| **DISCOVER** | Companion chủ động giới thiệu một điều cụ thể (không phải toàn bộ danh sách) | Một Prompt, một Case Study, một đoạn tri thức — Companion nói, không phải banner |
| **PRACTICE** | Người dùng làm một việc thật (không phải đọc thêm) | Bài tập, Mission, áp dụng vào công việc thật |
| **REFLECTION** | Người dùng tự nhìn lại điều vừa trải nghiệm | Câu hỏi Reflection (đã có sẵn cơ chế ở CKOS/Academy) |
| **UNLOCK** | Một thứ mới trở nên khả dụng, Companion là người báo | Không dùng chữ "Đã mở khóa" — xem `COMPANION_UNLOCK_LANGUAGE.md` |
| **NEXT JOURNEY** | Ngay sau Unlock, luôn có một gợi ý về hành trình tiếp theo (chưa mở) | Không để người dùng đứng yên sau khi nhận thưởng — luôn có một LOCKED mới xuất hiện phía trước |

**Quy tắc cứng**: không lớp nào được bỏ qua. Không có "Unlock ngay khi vào trang" (bỏ qua
DISCOVER/PRACTICE/REFLECTION) — nếu làm vậy, Unlock trở thành một banner quảng cáo, vi phạm
Constitution. `NEXT JOURNEY` luôn phải trỏ tới một `LOCKED` khác — vòng lặp không bao giờ kết
thúc ở "hết rồi" (xem `PORTAL_UNLOCK_REVIEW.md` cho ví dụ áp dụng theo từng module).

## Những thứ có thể mở khóa (Unlockable Assets)

| Loại | Nguồn dữ liệu hiện có (map để Sprint sau code) |
|---|---|
| Prompt Pack | `KnowledgeSeed.prompts` (CKOS) |
| Checklist | `KnowledgeSeed.checklist`, `src/data/*` checklist collections |
| Template | Library `templates` collection |
| Case Study | `case_study`/`student-success-stories` collection |
| Mission mới | `LearningJourney` (Academy — `journey.types.ts`) |
| Learning Path | `Collection` (CKOS) |
| Companion Secret | Nội dung mới — xem "Surprise" bên dưới, không cần data model riêng ban đầu, có thể dùng `character-memory.ts`/`living-stories.ts` đã có |
| AI Specialist mới | `agent-registry.ts` (Companion Orchestration System™) — Specialist "ẩn" chỉ xuất hiện sau khi Unlock |
| Premium Challenge | Premium module |
| Project Challenge | Opportunities module |
| Knowledge Collection | CKOS Collection |
| Reflection Insight | Tổng hợp từ nhiều Reflection đã viết (`reflections` table) |
| Companion Story | `living-stories.ts` (đã có Story Matching Engine — Sprint 13.2) |

Không tạo loại "vật phẩm" mới ngoài danh sách trên (không badge/coin/gem/XP — xem mục "Không
được dùng").

## Điều kiện mở khóa (Unlock Triggers)

Xem chi tiết rule-matching ở `JOURNEY_UNLOCK_RULES.md`. Danh sách điều kiện gốc:

- Hoàn thành Seed
- Hoàn thành Mission
- Reflection (viết ít nhất 1 câu trả lời thật)
- Practice (đánh dấu đã thực hành — không phải "đã đọc")
- Áp dụng vào công việc thật (Evidence/Work Session READY→CELEBRATING — đã có cơ chế ở
  `celebrateWorkSession()`, Sprint 04)
- Quay lại sau vài ngày (time-based — đã có pattern `first-meeting.ts`/`getRelationshipStage`)
- Hoàn thành Collection
- Hoàn thành Journey

## Companion là người báo Unlock, không phải hệ thống

Mọi Unlock phải đi qua một câu nói của Companion (xem `COMPANION_UNLOCK_LANGUAGE.md`) — không
có popup "🎉 Unlocked!", không có badge notification. Cơ chế hiển thị nên tái dùng đúng pattern
đã có: `CompanionContextualNudge`/`CompanionGreetingBubble` (bong bóng nhỏ, dismiss được, không
che nội dung) — không xây UI mới kiểu "achievement toast".

## Discovery — khám phá, không phải quảng cáo

Xem `DISCOVERY_RULES.md`. Nguyên tắc cốt lõi: Discovery được Companion chủ động đề xuất **một**
điều cụ thể, đúng lúc, không lặp lại nhàm — không phải banner "Có nội dung mới!" cho tất cả
người dùng cùng lúc.

## Real Story

Sau một số Journey nhất định (ngưỡng cụ thể do `JOURNEY_UNLOCK_RULES.md` định nghĩa), Unlock
một "câu chuyện thật": người áp dụng thật (freelancer, marketer, founder, doanh nghiệp nhỏ) —
không phải người nổi tiếng, không phải case study marketing bóng bẩy. Nội dung này nên tái dùng
hạ tầng `student-success-stories`/case-study đã có trong Admin, không tạo collection mới.

## Surprise

Không phải mọi Unlock đều được liệt kê trước cho người dùng biết "sắp có". Một số Unlock chỉ
Companion "biết" — người dùng không thấy danh sách "còn 3 thứ nữa để mở khóa" (điều đó biến
Portal thành checklist game). Xem `REWARD_RULES.md` mục "Ẩn danh sách Unlock".

## Ranh giới với hệ thống đã có

- **Không thay thế** Learning Journey Engine (`journey.service.ts`, stage rule-based theo %) —
  Journey Unlock là một LỚP THÊM, quyết định "cái gì hiện ra khi nào", không phải quyết định
  "giai đoạn Journey nào" (giữ nguyên `JourneyStage` enum).
- **Không thay thế** Companion Orchestration System™ (Sprint 04) — Work Session vẫn là cách
  Companion "làm việc cùng" người dùng; Unlock là cách Companion "cho thêm" người dùng.
- **Tái dùng** cơ chế nudge/dismiss/session-memory đã có (`nudge-session.ts`) làm nền cho tần
  suất Discovery/Unlock — không xây lại bộ nhớ phiên từ đầu.

## Legacy Assets — Sprint 04.5

Framework này (Journey Unlock Framework™) là tài sản nền dùng chung, không riêng cho Academy:

| Module | Áp dụng LOCKED/DISCOVER/PRACTICE/REFLECTION/UNLOCK/NEXT JOURNEY cho |
|---|---|
| CKOS | Seed/Collection/Prompt Pack |
| Academy | Mission/Journey/Evidence |
| Project & Opportunities | Project Challenge/phân tích dự án |
| Premium | Premium Challenge |
| Journey (Hành trình của tôi) | Milestone/Reflection Insight |
| Garden (Khu vườn của bạn) | Growth Recognition gắn với hình ảnh cây lớn lên |
| Companion | Companion Secret/Companion Story |

Xem `PORTAL_UNLOCK_REVIEW.md` cho review chi tiết từng khu vực Portal (nơi nào nên Lock/
Unlock/Discovery/Surprise/Recognition/Reflection).

## Bộ tài liệu đầy đủ (Documentation Assets — Sprint 04.5)

1. `JOURNEY_UNLOCK_BLUEPRINT.md` (tài liệu này)
2. `UNLOCK_RULE_STANDARD.md` — thiết kế Rule Engine (không hardcode)
3. `DISCOVERY_STANDARD.md` — chuẩn Discovery Layer toàn Portal
4. `RECOGNITION_STANDARD.md` — chuẩn Growth Recognition
5. `COMPANION_UNLOCK_LANGUAGE.md` — thư viện câu nói (≥80 câu thật)
6. `REWARD_STANDARD.md` — triết lý phần thưởng, danh sách được phép/cấm
7. `REAL_STORY_STANDARD.md` — chuẩn Case Study/Real Story
8. `JOURNEY_MEMORY_RULE.md` — quy tắc lưu trạng thái hành trình
9. `PORTAL_UNLOCK_REVIEW.md` — review toàn Portal theo framework này

Các tài liệu chi tiết hơn từ Sprint 04 (`JOURNEY_UNLOCK_RULES.md`, `DISCOVERY_RULES.md`,
`REWARD_RULES.md`) vẫn còn hiệu lực — các Standard mới ở trên xây trên nền đó, không thay thế.

## Không code ở tài liệu này

Đây là Constitution — khoá trước khi code. Sprint sau (khi được giao) mới implement:
`unlock-engine.ts`, data model cho "trạng thái unlock của từng user/asset", và UI hiển thị.
Tài liệu này chỉ định nghĩa NGUYÊN TẮC và RULE, không viết code.
