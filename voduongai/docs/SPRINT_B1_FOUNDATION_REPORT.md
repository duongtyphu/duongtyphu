# Sprint B1 — Core Platform Foundation Report

Sprint kỹ thuật đầu tiên của EPIC 03, sau khi Blueprint A1–A9 đã khóa
(`docs/EPIC03_BLUEPRINT_LOCK.md`) và Product Guardrails đã có
(`docs/PRODUCT_GUARDRAILS.md`). Không sửa UI, không thêm AI Agent, không
Dashboard, không Placeholder, không Demo Data, không đổi Menu, không mở
rộng Journey — chỉ xây nền tảng kỹ thuật: type-level Data Layer, Universal
Context Engine mở rộng, và Growth Event Bus thật.

---

## 1. Current Architecture

Trước Sprint B1, Portal có 2 cơ chế chạy thật:

- `startCompanionWorkspace(context)` (`src/lib/portal/companion-workspace.ts`)
  — điểm gọi CTA duy nhất trên toàn Portal (từ Sprint 02), lưu context vào
  `sessionStorage` + ghi 1 loại Growth Event (`WORKSPACE_STARTED`) trực
  tiếp vào `localStorage`.
- CKOS Knowledge (`Journey`/`Collection`/`KnowledgeSeed`) — dữ liệu tĩnh
  TypeScript, chưa có khái niệm `Mission` tách biệt (Journey hiện tại =
  chiếu 1:1 từ Collection, không phải Mission theo đúng Mission Library
  Standard).

Sau Sprint B1, kiến trúc bổ sung (không thay thế) 2 lớp mới:

```
Content hiện có (CKOS Journey/Collection/KnowledgeSeed)
   ↓ (chưa migrate — xem mục 9)
Foundation Data Layer types (src/lib/portal/foundation/data-model.ts)
   ↓
Universal Context — WorkspaceContext mở rộng (companion-workspace.ts)
   ↓
Growth Event Bus (src/lib/portal/foundation/growth-event-bus.ts)
   ↓ (chưa có consumer thật — xem mục 8)
Nhật ký học tập / Hành trình của tôi / Khu vườn của bạn (vẫn tĩnh, chưa đổi)
```

---

## 2. Shared Data Model

Đã tạo `src/lib/portal/foundation/data-model.ts` — type-level contract cho
20 model theo đúng `docs/FOUNDATION_DATA_LAYER.md` mục 2: `CompetencyProfile`,
`Journey`, `Collection`, `Mission`, `LearningAsset`, `KnowledgeResource`,
`PromptPack`, `TemplatePack`, `WorkspaceSession`, `WorkspaceStep`, `Output`,
`OutputVersion`, `PortfolioItem`, `Reflection`, `CompanionReview`,
`GrowthEvent`, `CapabilityRecord`, `ImpactRecord`, `UnlockRule`,
`UnlockRecord`, và `UniversalContext`.

**Đây là type-only** — chưa có bảng dữ liệu thật (không DB migration trong
sprint này, đúng "không mở rộng Journey"/"không Demo Data"). Không model
nào trùng lặp — mỗi model có đúng 1 định nghĩa duy nhất, dùng chung
`PortalModule`/`CompetencyLevel` đã có sẵn trong codebase.

---

## 3. Relationship Diagram

```
Journey 1─N Collection 1─N Mission 1─N LearningAsset
Mission 1─N WorkspaceSession 1─N WorkspaceStep
WorkspaceSession 1─N Output 1─N OutputVersion
Output 1─1 CompanionReview, Output 1─N Reflection, Output 0..1─1 PortfolioItem
GrowthEvent N─1 User, 0..1─Mission, 0..1─WorkspaceSession, 0..1─Output
GrowthEvent 1─0..1 CapabilityRecord, 1─0..1 ImpactRecord
UnlockRule 1─N UnlockRecord
```

Không đổi so với thiết kế ở `FOUNDATION_DATA_LAYER.md` mục 3 — implement
đúng nguyên trạng bằng type, không rút gọn quan hệ nào.

---

## 4. Context Engine

`WorkspaceContext` (`companion-workspace.ts`) đã mở rộng thêm — **tất cả
field mới đều tùy chọn, không phá bất kỳ call site nào đang chạy**:

```diff
 WorkspaceContext = {
   module, source, title?, userGoal?, itemId?, itemType?,
   expectedOutput?, routeFrom, timestamp,
+  journeyId?, collectionId?, missionId?, assetId?, resourceId?,
+  promptId?, templateId?, difficulty?, currentCapability?, currentJourney?,
 }
```

`buildWorkspaceUrl()` đã cập nhật để đưa các field mới vào query string
(chỉ khi có giá trị) — `/portal/workspace` (chưa sửa UI) tiếp tục hoạt
động đúng như cũ vì chỉ đọc field đã biết trước, các field mới chỉ "đi
qua" URL mà chưa được UI tiêu thụ (việc đó thuộc Sprint B2).

Đã verify: **không có call site nào trong codebase cần sửa** — toàn bộ
nơi gọi `startCompanionWorkspace(...)` (AiSpaceSections, JourneyCard,
LandingPageMissionPilot, KnowledgeWorkspace, CompanionTaskEntry) tiếp tục
biên dịch đúng vì mọi field mới đều optional.

---

## 5. Event Bus

Đã tạo `src/lib/portal/foundation/growth-event-bus.ts`:

- `emitGrowthEvent(input)` — điểm phát duy nhất, tự sinh `eventId`/
  `timestamp`, tự gắn `modulesUsing[]` theo bảng `GROWTH_EVENT_CONSUMERS`
  (mỗi `eventType` khai báo trước tối thiểu 3 module đọc, đúng Product
  Guardrails luật 7).
- `subscribeToGrowthEvents(onEvent)` — lắng nghe Event mới cùng tab, dùng
  lại pattern `CustomEvent` đã có ở `orchestrator-intent.ts`.
- `readGrowthEvents()` — đọc lịch sử đã lưu (localStorage, giới hạn 200).

**10 event type cuối cùng** (hợp nhất giữa A8 và brief Sprint B1 —
xem ghi chú đối chiếu ở mục 8 dưới): `WORKSPACE_STARTED`, `MISSION_STARTED`,
`MISSION_COMPLETED`, `OUTPUT_CREATED`, `OUTPUT_UPDATED`, `OUTPUT_VERSIONED`,
`REFLECTION_COMPLETED`, `CAPABILITY_UPDATED`, `IMPACT_UPDATED`,
`MISSION_UNLOCKED`.

`companion-workspace.ts` đã nối vào Event Bus: `startCompanionWorkspace()`
giờ gọi `emitGrowthEvent()` thay vì tự ghi `localStorage` riêng — dùng
`MISSION_STARTED` khi context có `missionId`, `WORKSPACE_STARTED` cho mọi
trường hợp còn lại (Companion Desk tự do, chưa gắn Mission cụ thể). Đây là
thay đổi hành vi nhỏ nhưng **tương thích ngược hoàn toàn** — vẫn ghi vào
đúng `localStorage["vdai_growth_events"]`, giới hạn 200, không ai đọc key
này ngoài chính module (đã xác nhận qua audit trước, chưa có consumer thật
— xem mục 8).

---

## 6. Module Connection

Xác nhận lại (không đổi so với A8 mục 4): Học viện AI → Companion →
Workspace → Output → Portfolio → Growth → Capability → Unlock → Journey →
Thư viện tri thức → AI Workspace. Sprint B1 chỉ củng cố đoạn "Companion →
Workspace" bằng Event Bus thật — các đoạn còn lại (Output → Portfolio →
Growth → Capability → Unlock) vẫn là **kết nối trên giấy** (type tồn tại,
chưa có engine đọc/ghi thật) cho tới Sprint B2–B6.

---

## 7. Single Source of Truth

Đã áp dụng: `GROWTH_EVENTS_KEY` (`vdai_growth_events`) tiếp tục là nơi lưu
duy nhất cho Growth Event — không tạo key localStorage thứ hai. Context
(`vdai_workspace_context`) tiếp tục là nơi lưu duy nhất cho
`WorkspaceContext` hiện tại. `data-model.ts` không định nghĩa lại bất kỳ
type nào đã có (`PortalModule`, `WorkspaceItemType`) — chỉ import và mở
rộng.

**Chưa đạt đầy đủ** (ghi nhận trung thực, không che giấu): CKOS
`KnowledgeSeed`/`LearningJourney` vẫn là nguồn dữ liệu content riêng, chưa
hợp nhất vào `Mission`/`LearningAsset` type mới — đây là Technical Debt rõ
ràng, xem mục 8.

---

## 8. Technical Debt

Đối chiếu code hiện tại với Blueprint A1–A9 — ghi nhận, **không sửa ngay**:

| # | Mâu thuẫn/khoảng trống | Tài liệu Blueprint liên quan |
|---|---|---|
| 1 | Chưa có khái niệm `Mission` thật trong content — `LearningJourney` hiện tại vẫn chiếu 1:1 từ `KnowledgeCollection`, không phải tập hợp nhiều Mission như Mission Library Standard mô tả | A1, A3 |
| 2 | 69/80 Knowledge Asset (CKOS) chưa gắn `missionId` — vẫn là gap đã ghi nhận từ `SMART_AI_CURRICULUM_AUDIT.md`, chưa xử lý trong B1 | A1, A9 mục 4.3 |
| 3 | `WorkspaceMvp.tsx` (UI, không sửa trong sprint này) vẫn chỉ hiển thị context + kế hoạch tĩnh — Output chưa được lưu thật, `Output`/`OutputVersion` type mới chưa có engine ghi dữ liệu thật | A2, A8 mục 8, chờ Sprint B2 |
| 4 | `Growth Event Bus` mới đã phát Event thật nhưng **chưa có module nào subscribe** — Nhật ký học tập/Hành trình của tôi/Khu vườn của bạn vẫn đọc dữ liệu tĩnh (`journey-hub.ts`, `knowledge-garden.ts`), chưa gọi `subscribeToGrowthEvents()`/`readGrowthEvents()` | A8 mục 9, chờ Sprint B3 |
| 5 | `unlock-engine.ts`/`unlock-assets.ts` (Mission Pilot hiện có) là một hệ Unlock độc lập, bespoke — chưa dùng `UnlockRule`/`UnlockRecord` type mới; cần điều hòa ở Sprint B6, không phải sửa ngay (đã ghi nhận từ A9 mục 4.2) | A9 mục 4.2, chờ Sprint B6 |
| 6 | `CompetencyProfile`/`CapabilityRecord`/`ImpactRecord` type đã có nhưng chưa có Capability Engine/Impact Engine nào đọc `GrowthEvent` để ghi dữ liệu thật — các model này hiện là "hợp đồng" chưa được hiện thực hóa | A5, A6, chờ Sprint B5 |
| 7 | Event type `MISSION_STARTED` (mới, brief Sprint B1) và `WORKSPACE_STARTED` (đã có từ Sprint 01) từng được xem là có thể hợp nhất thành 1 loại ở `FOUNDATION_DATA_LAYER.md` mục 12 — Sprint B1 **quyết định giữ cả 2, phân biệt theo có/không có `missionId`** (xem mục 5) thay vì hợp nhất, để không phá ngữ nghĩa "Companion Desk tự do, chưa gắn Mission" đang có thật trong AI Workspace. Đây là điều chỉnh nhỏ so với Foundation Data Layer gốc — không phải Architecture Change (không đổi model/relationship, chỉ giữ nguyên 1 event type đã có thay vì xoá) | Ghi chú tương thích với FOUNDATION_DATA_LAYER.md mục 12 |

Không phát hiện mâu thuẫn nào **chặn** Sprint B2 — toàn bộ 7 mục trên là
việc còn thiếu (đã biết trước, có kế hoạch ở Roadmap Sprint B), không phải
lỗi kiến trúc.

---

## 9. Migration Plan

Không migrate dữ liệu trong Sprint B1 (đúng "không mở rộng Journey"). Kế
hoạch cho Sprint B2 trở đi, theo đúng thứ tự Foundation Data Layer mục 13:

1. **Sprint B2**: `WorkspaceSession`/`Output`/`OutputVersion` bắt đầu ghi
   dữ liệu thật khi người dùng tương tác ở `/portal/workspace` — chưa
   động vào CKOS.
2. **Sprint B3**: Nhật ký học tập/Hành trình của tôi/Khu vườn của bạn gọi
   `subscribeToGrowthEvents()`/`readGrowthEvents()` — bắt đầu đọc Event
   thật thay vì dữ liệu tĩnh.
3. **Sprint B7**: CKOS `KnowledgeSeed` (80 asset) được gắn `missionId`
   dần dần, ánh xạ `LearningJourney`/`KnowledgeCollection` hiện có sang
   `Journey`/`Collection`/`Mission` type — cùng lúc bổ sung Mission mẫu
   cho 6 Category còn thiếu (A9 mục 4.3).

Nguyên tắc xuyên suốt: **thêm bảng/type mới, không xóa/phá cơ chế cũ đang
chạy** — mỗi Sprint B chỉ bổ sung 1 lớp, không refactor nhiều lớp cùng
lúc.

---

## 10. Definition of Ready for B2

- ✔ Toàn bộ Portal dùng chung Foundation Data Layer type
  (`src/lib/portal/foundation/data-model.ts`) — không model nào trùng.
- ✔ `startCompanionWorkspace(context)` là Context Engine duy nhất, đã mở
  rộng đủ field mới, không phá call site cũ.
- ✔ Growth Event Bus thật đã hoạt động (`emitGrowthEvent`/
  `subscribeToGrowthEvents`/`readGrowthEvents`), phát đúng 10 event type.
- ✔ Single Source of Truth giữ nguyên — không tạo key/bảng dữ liệu song
  song.
- ✔ Module Connection không đổi so với A8; đoạn Companion→Workspace đã
  củng cố bằng Event Bus thật.
- ✔ Technical Debt đã ghi nhận đủ 7 mục, không mục nào chặn B2.
- ✔ Build/Lint/Typecheck không bị ảnh hưởng: `npx tsc --noEmit` sạch,
  `npm run lint` chỉ còn 5 warning `<img>` đã biết từ trước, `npm run
  build` thành công với đủ route hiện có, `npx vitest run` 56/56 test
  pass.

**Sprint B2 (Workspace Output Storage) có thể bắt đầu.**
