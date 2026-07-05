# PHASE 3 FINALIZATION — Sprint F1 + F2 (đóng EPIC 05)

> Program: PRODUCTION BETA · Track: B — AI Workforce (F1) / D — Workspace
> Runtime (F2) · Goal: Landing Page Production (Mission 01 làm bằng
> chứng Runtime Demo)

2 Sprint cuối cùng của PHASE 3 — không mở Epic mới, không đổi Kernel/
Runtime/Blueprint đã khóa. Sau F2, EPIC 05 và PHASE 3 đóng; mọi nguồn
lực chuyển sang PHASE 4 Production.

## SPRINT F1 — Workforce Evolution Loop

`src/lib/portal/foundation/workforce-evolution.ts` — AI Workforce tự
đánh giá và tiến bộ sau mỗi Mission, dựa trên dữ liệu Mission Package
thật (`mission-runtime.ts`), không cảm tính:

| Thành phần | Hàm | Ghi chú |
|---|---|---|
| Performance History | `recordPerformanceSnapshot()` / `getPerformanceHistory()` | Cập nhật thật `performanceScore` của Companion (đóng khoảng trống "vẫn tĩnh 50" đã ghi ở GOAL 001 Dashboard) |
| Reflection Engine | `recordCompanionReflection()` / `getCompanionReflections()` | Điểm mạnh/điểm cần cải thiện lấy từ QA Report/Lessons Learned thật |
| Improvement Engine | `computeImprovementPlan()` | Tổng hợp improvementArea lặp lại nhiều nhất thành hành động ưu tiên |
| Retraining Engine | `triggerRetraining()` / `completeRetraining()` / `maybeTriggerRetraining()` | Dùng đúng state `"maintenance"` đã có sẵn trong Lifecycle khóa từ Sprint 002 — không thêm state mới |
| Evolution Timeline | `getWorkforceEvolutionTimeline()` | Gộp 3 nguồn trên theo thời gian thật, không suy diễn |

## SPRINT F2 — Organizational Learning Engine

`src/lib/portal/foundation/organizational-learning.ts` — không chỉ 1
Companion học, toàn bộ tổ chức học:

| Thành phần | Hàm | Ghi chú |
|---|---|---|
| Best Practice Engine | `promoteBestPractice()` / `listBestPractices()` | Bắt buộc có ≥1 Mission làm bằng chứng, không suy diễn không căn cứ |
| Blueprint Improvement | `suggestBlueprintImprovement()` / `decideBlueprintImprovement()` | Đề xuất riêng, KHÔNG sửa `GOLDEN_MISSIONS` trực tiếp — Owner duyệt riêng |
| Knowledge Evolution | `summarizeKnowledgeEvolution()` | Đếm thật Memory/Best Practice/Blueprint Improvement, không đếm trùng |
| Cross Department Learning | `shareCrossDepartmentLearning()` / `listCrossDepartmentShares()` | Chỉ chia sẻ Best Practice đã tồn tại thật, tham chiếu `practiceId` (Single Source of Truth) |
| Organizational Memory | `getOrganizationalMemoryTimeline()` | Gộp Memory Store + 3 nguồn trên theo thời gian thật |

## Runtime Flow (F1 → F2 nối tiếp Mission 01 thật)

```
Mission Package (mission-runtime.ts, đã có từ Golden Reference Mission)
  ↓
F1: recordPerformanceSnapshot() → recordCompanionReflection() → computeImprovementPlan()
  ↓
F2: promoteBestPractice() → suggestBlueprintImprovement() → getOrganizationalMemoryTimeline()
```

Verify bằng `phase3-finalization-e2e.test.ts` — chạy lại chính Mission 01
(Landing Page Production) qua trọn chuỗi trên, không dùng dữ liệu giả
lập rời rạc.

## Definition of Done — đã đạt

- [x] Build PASS (`npm run build`)
- [x] Typecheck PASS (`npx tsc --noEmit`)
- [x] Tests PASS (`npx vitest run`)
- [x] Có Runtime Flow (bảng trên + `phase3-finalization-e2e.test.ts`)
- [x] Có Documentation ngắn (tài liệu này)
- [x] Không phát sinh Epic mới
- [x] Không thay đổi kiến trúc/Kernel/Blueprint/Runtime đã khóa (F1 dùng
      lại state Lifecycle có sẵn; F2 chỉ đề xuất, không sửa Blueprint)

**EPIC 05 đóng. PHASE 3 đóng.** Nguồn lực chuyển sang PHASE 4 Production.
