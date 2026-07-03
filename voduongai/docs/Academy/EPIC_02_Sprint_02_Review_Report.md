# EPIC 02 — Sprint 02 Review Report
## Learning Journey Engine™

Đánh giá dựa trên trạng thái thật: `tsc --noEmit` sạch, `npm run lint` không lỗi mới,
`npx vitest run` 30/30 pass (27 CKOS + 3 Academy mới), `npm run build` thành công, smoke-test
`/portal/academy` qua curl không lỗi 500 (307 → login, đúng hành vi middleware).

## Definition of Done — đối chiếu

| Tiêu chí | Trạng thái | Bằng chứng |
|---|---|---|
| Journey Blueprint | ✅ | `Learning_Journey_Blueprint.md` |
| Journey Engine | ✅ | `src/features/academy/services/journey.service.ts` + 3 test pass |
| Journey Timeline | ✅ | `JourneyTimeline.tsx` — 5 mốc cảm nhận (🌱📘✍️🚀🌿), không phải timeline thời gian |
| Companion Guidance | ✅ | `CompanionGuidance.tsx` + `getCompanionJourneyGuidance()` — không câu nào chứa số liệu |
| Growth Checkpoint | ✅ | `GrowthCheckpoint.tsx` + `Growth_Checkpoint_Standard.md` — 2 câu hỏi cố định, không chấm điểm |
| Journey Rules | ✅ | `JourneyRules.md` — ngưỡng % → giai đoạn, quy tắc giọng nói |
| Documentation | ✅ | 3 tài liệu mới + 3 Template + Growth Checkpoint Standard |
| Assets | ✅ | Journey/Checkpoint/GrowthPrompt Template trong `docs/Academy/Templates/` |

## Đối chiếu "Không được làm"

| Điều cấm | Vi phạm? |
|---|---|
| Video | Không |
| Quiz | Không |
| Certificate | Không |
| Dashboard kiểu LMS | Không — Journey Card không có progress bar/%, chỉ có stage label + guidance |
| Course List | Không — Journey Card thay thế hoàn toàn tư duy "danh sách khoá học" bằng "hành trình" |
| Lesson List | Không — không danh sách Seed/Lesson nào hiển thị trực tiếp trên trang Academy |
| Admin | Không |
| Companion Studio | Không |

## Product Principle — đối chiếu trực tiếp

> "Nếu người học chỉ thấy mình hoàn thành Lesson. Sprint thất bại."

Kiểm tra: `JourneyCard.tsx` không hiển thị số Lesson đã hoàn thành, không progress bar %,
không "X/Y bài học". Chỉ hiển thị: tên Journey, mục tiêu, nhãn giai đoạn (VD: "Đang thực
hành"), Companion Guidance bằng lời, Journey Timeline bằng biểu tượng cảm nhận.

> "Nếu người học cảm nhận được mình đang trưởng thành. Sprint thành công."

Cơ chế: `JourneyTimeline` hiển thị vị trí trực quan trong 5 mốc cảm nhận; `CompanionGuidance`
luôn gợi ý 1 hành động cụ thể tiếp theo bằng lời tự nhiên; `GrowthCheckpoint` mở đúng lúc
(giai đoạn GROWTH/READY) để người học tự phản tư — không hệ thống nào tự gắn nhãn "bạn đã
trưởng thành" thay họ.

## Tích hợp vào Portal

Đã thay phần "Chương trình học" cứng (course-card LMS cũ dạng danh sách 3 chương trình) bằng
section "Hành trình của bạn" render `JourneyCard` cho từng CKOS Collection tại
`/portal/academy` (route giữ nguyên). Các route khác (`/portal/ai-academy`,
`/portal/vdai-academy`, `/portal/personal-brand`) — thuộc "module khác" — **không bị đụng**,
vẫn giữ nguyên toàn bộ nội dung và liên kết cũ.

## Rủi ro/hạn chế còn lại

1. Ngưỡng % → giai đoạn (15/45/70) là ước lượng ban đầu, chưa có dữ liệu người dùng thật để
   kiểm chứng có phù hợp cảm nhận thật hay không — cần theo dõi và tinh chỉnh ở Sprint sau.
2. `JourneyCard`/`GrowthCheckpoint` mới chỉ hiển thị cho 2 Journey (tương ứng 2 CKOS Collection
   hiện có) — số lượng nhỏ, chưa kiểm chứng UI ở quy mô nhiều Journey hơn.
3. Chưa có test cho `GrowthCheckpoint`/`useJourneyReady` (chỉ test `journey.service.ts`) — do
   2 hook này chủ yếu là I/O localStorage, khó test hữu ích bằng unit test thuần trong phạm vi
   Sprint này.

## Kết luận

Sprint 02 đạt đủ Definition of Done, không vi phạm điều cấm, tuân thủ đúng Academy
Constitution (đọc CKOS, không tạo tri thức mới, không chấm điểm). Sprint 03 có thể tiếp tục
mở rộng Journey Engine (VD: Lesson UI thật dựa trên Lesson Blueprint đã có từ Sprint 01).
