# PHASE 4 EPIC 02 — Core Workforce Runtime (Activate Core AI Companion Team)

> Tổng quan Sprint — nối `WORKFORCE_REGISTRY.md`, `COMPANION_PROFILE_STANDARD.md`,
> `COMPANION_LIFECYCLE.md`, `COMPANION_RUNTIME.md` thành 1 bức tranh. Đây
> là bước đầu tiên biến AI Workforce từ kiến trúc thiết kế (EPIC 03/05/06)
> thành hệ thống hoạt động thật, dùng đúng nền tảng Provider Layer vừa
> hoàn thành (PHASE 4 EPIC 01).

## 0. Ràng buộc đã tuân thủ

- Không đổi Kernel (Workspace Session/Output/Approval/Portfolio Store).
- Không đổi Blueprint (`mission-catalog.ts`, `EXECUTION_TIMELINE`).
- Không đổi Workforce Architecture đã khóa (7 Department, Collaboration
  Matrix, Registry 3 tầng của EPIC 05/06).
- Chỉ **Activate** — biến 10/30 Companion đã thiết kế thành Runtime chạy
  được, qua đúng Provider Layer (PHASE 4 EPIC 01), với Mock Provider
  trong sandbox này.

## 1. Wave 1 — 10 Companion, 6 Department

| Department | Companion |
|---|---|
| Research (`research-knowledge`) | Market Research Companion, Knowledge Research Companion |
| Content (`content-communication`) | Writer Companion, Editor Companion |
| Business (`business-strategy`) | Strategy Companion |
| Technology (`technology-automation`) | Coding Companion, QA Companion |
| Office (`office-productivity`) | Excel Companion |
| Growth (`personal-growth`) | Goal Coach Companion, Reflection Coach Companion |

Không có Companion nào thuộc Department `creative-design` trong Wave 1
— đúng phạm vi brief (10 Companion cụ thể được liệt kê, không tự thêm).

## 2. Kiến trúc runtime mới (additive, không sửa code đã khóa)

```
src/lib/portal/foundation/
  workforce-registry.ts   — Workforce Registry (10 CompanionRecord, Lifecycle)
  companion-manager.ts    — Task Assignment (assignTask)

src/app/api/ai/workforce/route.ts
  + agentRole "companion-task"  — đường Task Assignment chung, gọi providerManager.execute()

src/ai/providers/
  model-router.ts    — + fallbackProvider param, + 4 capability family mới (strategy/qa/office/growth)
  provider-manager.ts — + fallbackProvider truyền qua

src/lib/portal/foundation/data-model.ts / growth-event-bus.ts / growth-view.ts
  + COMPANION_ACTIVATED / COMPANION_TASK_ASSIGNED / COMPANION_TASK_COMPLETED
```

Không file nào thuộc `workspace-session-store.ts`/`mission-catalog.ts`/
`execution-orchestrator.ts`/`portfolio-store.ts` bị sửa.

## 3. Definition of Done — đối chiếu

| Tiêu chí | Đạt ở đâu |
|---|---|
| Workforce Registry hoạt động | `workforce-registry.ts` — `listCompanions()`/`getCompanion()`/`listByDepartment()`, verify qua test |
| 10 Companion được Activate | `activateWave1Companions()` — verify: 10/10 chuyển sang `active`, đủ 10 `COMPANION_ACTIVATED` |
| Companion Manager có thể giao Task | `companion-manager.assignTask()` — verify 5 Companion nêu trong brief đều nhận Task |
| ProviderManager được gọi đúng | route `companion-task` gọi thẳng `providerManager.execute()` (PHASE 4 EPIC 01), verify qua test + curl thật |
| Output trả về Runtime | `CompanionTaskResult` — verify cấu trúc đúng, `isMock`/`providerId` chính xác |
| Không phá Build | `npm run build` thành công |
| Không phá Test | `npx vitest run` — 85/85 pass (74 cũ + 11 mới, 0 regression) |

## 4. Product Principle — thể hiện trong code

- **"AI Companion là nhân sự"**: `CompanionRecord` có `employeeId`/
  `position`/`department` — không phải 1 config kỹ thuật vô danh.
- **"Provider chỉ là động cơ"**: `providerPreference`/`fallbackProvider`
  chỉ là gợi ý truyền qua tham số — `ModelRouter` toàn quyền quyết định.
- **"Companion điều hành Workforce"**: `assignTask()` là điểm duy nhất
  Task đi qua trước khi chạm Provider — không route nào bỏ qua Companion
  Manager để gọi thẳng `providerManager`.
- **"User sở hữu toàn bộ Workforce"**: mọi chuyển trạng thái Lifecycle
  (Activate/Retire/Maintenance) đều là hành động tường minh (Admin/Owner
  gọi `setWorkingStatus`/`activateWave1Companions`), không Companion nào
  tự thay đổi trạng thái của chính nó hay Companion khác ngoài vòng đời
  Task (`busy`↔`active` trong lúc xử lý).

## 5. Xác thực đã chạy (Sprint này)

- `npx tsc --noEmit` — sạch.
- `npm run build` — thành công.
- `npm run lint` — sạch (5 warning `<img>` đã biết từ trước).
- `npx vitest run` — **85/85 pass** (11 test mới:
  `workforce-activation.test.ts`).
- `curl` thật vào dev server đang chạy — `/api/ai/workforce` với
  `agentRole: "companion-task"` trả đúng kết quả Mock Provider.

## 6. Bước tiếp theo (không thuộc phạm vi Sprint này)

Xem `COMPANION_RUNTIME.md` §5 Known Limitations — Wave 2/Wave 3 (20
Companion còn lại), nối Companion vào Workspace Output/Review/Portfolio
UI thật, Agent chuyên biệt cho từng Companion, cập nhật
`performanceScore` thật.
