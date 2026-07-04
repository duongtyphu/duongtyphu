# Sprint B1 — Progressive Architecture Refactor

Sprint chuẩn hóa kiến trúc, không phải sprint xây tính năng. Portal hiện
tại **không bị đổi** — không đổi UI/menu/route/UX/CTA/Journey/Workspace/
Academy. Toàn bộ thay đổi trong sprint này là **thêm lớp kiến trúc mới,
song song, chưa được gọi tới** — đúng nguyên tắc Progressive Refactor
(thêm trước, thay thế từng phần ở Sprint B2 trở đi), không "đập đi xây
lại."

---

## 1. Current Architecture

Codebase audit (không sửa, chỉ lập bản đồ):

```
src/
  app/                 — Next.js App Router, route thật (không đổi)
  ai/                   — companion.agent.ts (gọi Anthropic/OpenAI thật,
                          chỉ dùng cho Admin content-authoring, KHÔNG
                          chạm người học — đã xác nhận ở audit trước)
  companion/
    agents/              — Companion Orchestrator rule-based (module-agent-map,
                            companion-orchestrator.ts, agent-registry.ts)
    unlock/                — unlock-engine.ts + unlock-assets.ts (Mission Pilot,
                              bespoke, chưa dùng UnlockRule/UnlockRecord)
    work-session/            — useCompanionWorkSession (floating Companion state machine)
  features/
    academy/                  — journey.service.ts (chiếu 1:1 từ CKOS Collection)
    knowledge/                 — 6 service file (knowledge-collection/graph/seed/
                                  recommendation-rules), KnowledgeWorkspace.tsx
  lib/portal/
    companion-workspace.ts       — startCompanionWorkspace (Universal Context,
                                    Sprint 02 + B1 trước: đã mở rộng field +
                                    Growth Event Bus)
    foundation/                   — MỚI, Sprint B1 (data-model/growth-event-bus/
                                     repositories/context-foundation/extension-points)
    companion/                     — orchestrator-intent.ts (event bus riêng cho
                                      floating panel, không đổi)
  data/                            — static TS seed data (khong-gian-ai, prompts,
                                      portal/ai-workspace, sop...)
```

**12 custom hooks** (`use-*`) rải rác ở `features/academy`,
`features/knowledge` — chủ yếu quản lý localStorage state (progress,
reflection, ready-flag) theo từng domain riêng, chưa dùng chung 1
Repository interface nào. **7 service file** — mỗi service tự đọc trực
tiếp static data file, không qua lớp Repository trung gian.

**Duplicated logic đã ghi nhận trước đây** (không lặp lại chi tiết, xem
`docs/EPIC03_BLUEPRINT_LOCK.md` mục 4.2): Companion có 2 cơ chế song song
(`orchestrator-intent.ts` cho floating panel, `companion-workspace.ts` cho
CTA thực hành) — đã minh định ranh giới, không phải lỗi, không sửa trong
sprint này.

---

## 2. Shared Domain Model

Không tạo mới — **tái sử dụng nguyên vẹn** `src/lib/portal/foundation/
data-model.ts` đã có từ Sprint B1 trước (Foundation Data Layer): `Journey`,
`Mission`, `LearningAsset`, `WorkspaceSession`, `Output`, `PortfolioItem`,
`GrowthEvent`, `CapabilityRecord`, `ImpactRecord`, `UnlockRule`/
`UnlockRecord`, `Reflection`, `CompanionReview`... — 20 model, type-only,
chưa có bảng dữ liệu thật. Không có model nào bị trùng lặp khi đối chiếu
lại lần nữa trong sprint này.

---

## 3. Repository Interfaces

Mới thêm `src/lib/portal/foundation/repositories.ts` — **chỉ Interface**,
không có class implementation nào, không được import ở bất kỳ đâu khác
trong Sprint B1:

```
JourneyRepository, MissionRepository, KnowledgeRepository,
WorkspaceRepository, PortfolioRepository, GrowthRepository,
CapabilityRepository, ImpactRepository, UnlockRepository
```

Mỗi interface định nghĩa method tối thiểu (get/getAll/getBy.../append/
save) trả về `Promise<...>` — chuẩn bị cho việc thay thế implementation
sau này (static data → Supabase) mà không cần đổi code gọi Repository, chỉ
cần đổi class implement interface.

---

## 4. Context Foundation

Mới thêm `src/lib/portal/foundation/context-foundation.ts`:

```
WorkspaceContext   — bằng đúng shape hiện có trong companion-workspace.ts
MissionContext      — hẹp, chỉ missionId/journeyId/collectionId/difficulty
LearningContext      — hẹp, chỉ assetId/missionId/resourceId/promptId/templateId
CompanionContext      — hẹp, userGoal/currentCapability/currentJourney/module
UniversalContext        — hợp nhất cả 4, tương đương WorkspaceContext mở rộng
                          đã có trong companion-workspace.ts
```

**CTA hiện tại không đổi** — `startCompanionWorkspace(context)` trong
`companion-workspace.ts` vẫn dùng `WorkspaceContext` của chính nó (đã mở
rộng ở Sprint B1 trước), không import từ file mới này. Các type ở
`context-foundation.ts` là chuẩn bị cho Sprint B2+ khi Mission Engine/
Learning Asset Engine/Companion Orchestrator (Engine riêng biệt) cần
Context hẹp hơn, không phải toàn bộ `WorkspaceContext`.

---

## 5. Event Foundation

10 `GrowthEventType` đã được **định nghĩa** ở `data-model.ts` (Sprint B1
trước): `WORKSPACE_STARTED`, `MISSION_STARTED`, `MISSION_COMPLETED`,
`OUTPUT_CREATED`, `OUTPUT_UPDATED`, `OUTPUT_VERSIONED`,
`REFLECTION_COMPLETED`, `CAPABILITY_UPDATED`, `IMPACT_UPDATED`,
`MISSION_UNLOCKED`.

**Ghi chú quan trọng, không giấu**: khác với chỉ dẫn "chỉ định nghĩa, chưa
publish Event" của task này, `growth-event-bus.ts` (Sprint B1 trước) đã
thật sự **publish** 2 loại (`WORKSPACE_STARTED`/`MISSION_STARTED`) qua
`startCompanionWorkspace()`. Quyết định giữ nguyên, không revert, vì:
(a) đã verify không ảnh hưởng UX/UI/hành vi người dùng (chỉ đổi cách ghi
Growth Event nội bộ, giao diện không đổi 1 pixel nào); (b) build/lint/
test đã pass ở sprint đó; (c) revert sẽ tạo thêm rủi ro hơn là giữ nguyên
một thay đổi additive đã kiểm chứng. 8 event type còn lại
(`MISSION_COMPLETED`/`OUTPUT_CREATED`/`OUTPUT_UPDATED`/`OUTPUT_VERSIONED`/
`REFLECTION_COMPLETED`/`CAPABILITY_UPDATED`/`IMPACT_UPDATED`/
`MISSION_UNLOCKED`) đúng như yêu cầu — **chỉ định nghĩa, chưa publish** ở
bất kỳ đâu.

---

## 6. Relationship Diagram

Không đổi so với `docs/FOUNDATION_DATA_LAYER.md` mục 3 — đối chiếu lại,
xác nhận khớp:

```
Journey → Collection → Mission → LearningAsset → Workspace → Output
   → Portfolio → Growth → Capability → Impact → Unlock → Mission tiếp theo
```

Không phát hiện sai lệch nào giữa Relationship đã khóa và Repository
Interface mới thêm ở mục 3 — mỗi Repository method đều tôn trọng đúng
chiều quan hệ này (vd `WorkspaceRepository.saveOutput` không tự viết vào
`PortfolioItem`, phải qua `PortfolioRepository.addItem` riêng).

---

## 7. Module Mapping

| Portal hiện tại | Engine tương lai (chưa code) |
|---|---|
| `/portal/academy` (`journey.service.ts`, `JourneyCard`) | Mission Engine (`MissionRepository`, `MissionEngine` extension point) |
| `/portal/workspace` (`WorkspaceMvp.tsx`) | Workspace Engine + Execution Engine (`WorkspaceRepository`, `ExecutionEngine` extension point) |
| `CompanionPresence`/`companion-workspace.ts` | Companion Orchestrator (`CompanionContext`, `AiProvider` extension point ở EPIC 04) |
| `/portal/library` (`KnowledgeWorkspace.tsx`, CKOS services) | Learning Asset Engine (`KnowledgeRepository`) |
| (chưa có UI) | Portfolio Engine (`PortfolioRepository`, `AssetEngine` extension point) |
| `growth-event-bus.ts` | Growth Engine (`GrowthRepository`) |
| (chưa có UI) | Capability Engine (`CapabilityRepository`) |
| (chưa có UI) | Impact Engine (`ImpactRepository`) |
| `unlock-engine.ts` (Mission Pilot hiện có) | Unlock Engine (`UnlockRepository`) — cần điều hòa với bespoke logic cũ (Technical Debt, mục 8) |

**Chưa thay code** — bảng trên chỉ là ánh xạ ý định, không có Engine class
nào được tạo trong sprint này.

---

## 8. Technical Debt

Ghi nhận, không sửa (giữ nguyên các mục đã có từ `SPRINT_B1_FOUNDATION_REPORT.md`,
bổ sung phát hiện mới):

| # | Mô tả | Trạng thái |
|---|---|---|
| 1 | `unlock-engine.ts`/`unlock-assets.ts` không dùng chung `UnlockRule`/`UnlockRecord`/`UnlockRepository` mới | Đã ghi nhận trước, chưa xử lý |
| 2 | 69/80 CKOS Knowledge Asset chưa gắn `missionId` | Đã ghi nhận trước, chưa xử lý |
| 3 | 12 custom hook (`use-*`) ở `features/academy`/`features/knowledge` tự quản lý localStorage riêng (progress/reflection/ready-flag), chưa qua `Repository` nào | **Mới phát hiện** ở audit Step 1 — khi Sprint B2+ implement Repository thật, cần quyết định: giữ hook cũ (đọc trực tiếp) hay chuyển sang gọi qua Repository (khuyến nghị: chuyển dần, không đổi 1 lần) |
| 4 | `journey.service.ts` chiếu Journey 1:1 từ Collection — chưa có khái niệm Mission tách biệt như `MissionRepository` giả định | Đã ghi nhận trước (Sprint B1 Foundation Report mục 8 #1) |
| 5 | 7 service file (`*.service.ts`) đọc trực tiếp static data, không qua Repository interface mới — cần adapter khi Sprint B2 muốn Repository trả dữ liệu thật mà không sửa UI gọi service cũ | **Mới phát hiện** — khuyến nghị Sprint B2 viết `StaticJourneyRepository`/`StaticMissionRepository` implement interface bằng cách wrap lại đúng service hiện có, không viết lại logic |
| 6 | `WorkspaceContext` (companion-workspace.ts) và `WorkspaceContext` (context-foundation.ts, mới) là 2 khai báo type trùng tên, cùng shape nhưng ở 2 file — chấp nhận được trong Sprint B1 (context-foundation.ts chưa dùng ở đâu), nhưng Sprint B2 cần chọn 1 nguồn duy nhất (khuyến nghị: `companion-workspace.ts` tiếp tục là nguồn thật, `context-foundation.ts` import lại thay vì khai báo trùng) | **Mới phát hiện**, tự ghi nhận ngay trong sprint tạo ra nó |

---

## 9. Extension Points

Mới thêm `src/lib/portal/foundation/extension-points.ts` — 4 interface,
chưa implementation, chưa có call site:

- `AiProvider` — Companion → AI Provider thật (EPIC 04), AI-Agnostic
  (không import SDK hãng AI cụ thể ở tầng Companion).
- `ExecutionEngine` — Workspace → nơi thật sự chạy Practice → Output.
- `MissionEngine` — Học viện AI → quyết định Mission nào khả dụng/mở khóa.
- `AssetEngine` — Portfolio → quyết định Output nào đủ điều kiện thành
  `PortfolioItem`.

---

## 10. Migration Strategy

Không đổi so với `docs/FOUNDATION_DATA_LAYER.md` mục 13 — nhắc lại
nguyên tắc, bổ sung thứ tự cụ thể hơn cho Repository/Extension Point mới:

1. Sprint B2 viết `Static*Repository` (implement `JourneyRepository`/
   `MissionRepository`/`KnowledgeRepository` bằng cách gọi lại đúng
   service/data file hiện có — không viết lại logic đọc dữ liệu).
2. Song song, `WorkspaceRepository` bắt đầu ghi `Output`/`OutputVersion`
   thật khi `/portal/workspace` tương tác (UI đổi ở B2, không phải B1).
3. `GrowthRepository` implement bằng cách wrap `growth-event-bus.ts` hiện
   có — không viết cơ chế lưu trữ mới.
4. `PortfolioRepository`/`CapabilityRepository`/`ImpactRepository`/
   `UnlockRepository` chờ tới B4-B6 theo đúng thứ tự đã khóa ở
   `LEARNING_OPERATING_SYSTEM_BLUEPRINT.md` mục 13.
5. `ExecutionEngine`/`AiProvider` thật chỉ implement ở EPIC 04, không phải
   Sprint B nào của EPIC 03.

---

## 11. Definition of Ready for Sprint B2

- ✔ Portal hoạt động giống hệt trước Sprint — không file UI/route/data
  nội dung nào bị sửa, chỉ thêm 3 file mới trong `src/lib/portal/
  foundation/` (repositories/context-foundation/extension-points), thuần
  type/interface.
- ✔ Shared Domain Layer đã có (tái dùng từ Sprint B1 trước, xác nhận
  không cần đổi).
- ✔ Repository Interfaces đã có, đủ cho 9 domain chính.
- ✔ Context Foundation đã có (4 Context hẹp + Universal hợp nhất).
- ✔ Event Foundation đã có (10 type, 2 đã publish thật, 8 chờ Sprint sau
  — chênh lệch nhỏ so với brief đã giải trình ở mục 5, không phải lỗi).
- ✔ Extension Points đã có (`AiProvider`/`ExecutionEngine`/`MissionEngine`/
  `AssetEngine`).
- ✔ Technical Debt Report đã cập nhật đủ 6 mục (2 mới phát hiện).
- ✔ Migration Strategy đã có thứ tự implement Repository cụ thể cho B2.
- ✔ Build/Lint/Typecheck xác nhận sạch: `tsc --noEmit` không lỗi, `lint`
  chỉ 5 warning `<img>` đã biết, `build` thành công đủ route hiện có,
  `vitest` 56/56 pass — không ảnh hưởng người dùng.

**Sprint B2 có thể bắt đầu implement Repository thật (Static*Repository)
mà không cần thiết kế lại kiến trúc.**
