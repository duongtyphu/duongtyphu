# Sprint B2 — AI Workspace Execution Engine

AI Workspace chuyển từ nơi hiển thị thông tin (Sprint 01/02: context +
kế hoạch tĩnh + placeholder "Kết quả sẽ hiển thị tại đây") thành nơi
người dùng thật sự thực hiện Mission và tạo ra Output — không đổi UI lớn,
không đổi menu/route/Journey/Academy/Knowledge Library, chỉ nâng cấp
`/portal/workspace`.

---

## 1. Kiến trúc

```
startCompanionWorkspace(context)     // không đổi (Sprint 01/02/B1)
   ↓
/portal/workspace (WorkspaceMvp.tsx)  // đọc context như cũ
   ↓
findResumableSession(context)          // MỚI — tìm Session đang làm dở
   │  có → resumeSession()               (workspace-session-store.ts)
   │  không → createSession()
   ↓
WorkspaceSession thật (localStorage, "vdai_workspace_sessions")
   ↓
Execution Timeline / Task Panel / Output Panel / History  (UI trong cùng 1 trang)
   ↓
emitGrowthEvent(...)                     // growth-event-bus.ts (Sprint B1)
```

Không có Engine/AI thật nào được thêm — toàn bộ vẫn rule-based +
localStorage, đúng nguyên tắc đã giữ xuyên suốt EPIC 02-03 ("chưa gọi AI
thật, chưa có Agent thật").

---

## 2. Workspace Session

`src/lib/portal/foundation/workspace-session-store.ts` (mới) —
`WorkspaceSessionRecord` lưu: `sessionId`, `context` (Mission/Journey/
Source đã có sẵn trong `WorkspaceContext`), `status` (`active`/`paused`/
`completed`), `currentStepId`, `startedAt`/`pausedAt`/`resumedAt`/
`finishedAt`, `history[]`, `outputs[]`.

Lưu trong `localStorage["vdai_workspace_sessions"]` — mảng nhiều Session
(khác Sprint 01/02 chỉ giữ 1 context duy nhất bị ghi đè). `findResumableSession()`
khớp theo `module+source+missionId/itemId+userGoal/title` — nếu người
dùng bấm lại đúng CTA cho cùng 1 việc đang làm dở, Workspace **Resume**
thay vì tạo phiên mới; nếu đã `completed`, tạo phiên mới bình thường.

---

## 3. Execution Timeline

7 bước cố định — `EXECUTION_TIMELINE`: Mission Started → Preparing →
Research → Draft → Review → Revision → Completed. Hiển thị dạng chuỗi
badge (đã qua/đang ở/chưa tới), nút "Bước tiếp theo →" (thao tác thủ
công, chưa có logic AI tự động chuyển bước) — khi tới bước cuối, nút đổi
thành "Hoàn thành Mission" và gọi `completeSession()`.

---

## 4. Output

Output không còn placeholder — có Task Panel (Section "Việc đang thực
hiện", đổi nội dung theo `currentStepId`, không phải checklist tĩnh) và
Output Panel thật: chọn loại Output (Word/Excel/Prompt/Markdown/PDF/
Image/Link/Code/Landing Page), viết/dán nội dung vào `textarea`, bấm "Lưu
phiên bản mới" → `saveOutputVersion()` tạo `OutputRecord` (lần đầu) hoặc
thêm `OutputVersion` mới (từ lần 2). Mỗi Output hiển thị: loại, trạng
thái review (`pending`/`reviewed`), số version, nội dung bản mới nhất,
thời gian cập nhật.

---

## 5. Output Version

`saveOutputVersion()` **không ghi đè** — mỗi lần lưu thêm 1 phần tử vào
`output.versions[]` với `versionNumber` tăng dần (v1, v2, v3...). UI hiện
tại chỉ hiển thị bản mới nhất trong Output Panel (giữ UI đơn giản, không
đổi UI lớn) nhưng toàn bộ lịch sử version đã được lưu đầy đủ trong
`WorkspaceSessionRecord.outputs[].versions[]` — sẵn sàng hiển thị đầy đủ
khi Sprint sau cần.

---

## 6. Context

Không đổi cơ chế Context đã có (`WorkspaceContext` từ Sprint B1) —
Workspace tiếp tục đọc từ `sessionStorage`/query params như cũ, không hỏi
lại Mission/Journey/Output/Expected Result/User Goal. Bổ sung duy nhất:
đường dự phòng qua query params giờ đọc thêm `missionId` (đã có sẵn field
này từ Sprint B1, chỉ là chưa được đọc ở nhánh fallback trước đây).

---

## 7. Event

`WorkspaceSession`/Output sinh Event thật qua `emitGrowthEvent()` (Growth
Event Bus, Sprint B1): `WORKSPACE_RESUMED`, `OUTPUT_CREATED`,
`OUTPUT_UPDATED`, `OUTPUT_VERSIONED`, `WORKSPACE_COMPLETED` — đã thêm 2
loại mới (`WORKSPACE_RESUMED`, `WORKSPACE_COMPLETED`) vào
`GrowthEventType`/`GROWTH_EVENT_CONSUMERS` (`data-model.ts`,
`growth-event-bus.ts`). `WORKSPACE_STARTED`/`MISSION_STARTED` tiếp tục
phát từ `startCompanionWorkspace()` như Sprint B1 — Workspace Session
không phát trùng khi mới tạo, chỉ tự ghi vào `history[]` nội bộ. **Chưa
cần Engine nào đọc các Event này** (đúng brief — chuẩn hóa, không xây
Engine) — vẫn là gap đã ghi ở Sprint B1 Report, giờ có thêm nguồn Event
thật phong phú hơn để Engine tương lai (Sprint B3) tiêu thụ.

---

## 8. History

`WorkspaceSessionRecord.history[]` ghi lại toàn bộ mốc: Mission Started →
Output Created → Output Versioned (v2, v3...) → Workspace Paused/Resumed
→ Completed — hiển thị trong Section "Lịch sử" cuối trang, theo đúng thứ
tự thời gian thật (không phải ví dụ tĩnh như "Mission bắt đầu → Output tạo
→ Review → Reflection..." trong brief — Review/Reflection thật chưa có
Engine ở Sprint B2, chỉ có Output lifecycle thật; xem mục 9-10 dưới).

---

## 9. Review Placeholder (Data Model, chưa AI)

`OutputRecord.reviewStatus`: `not_ready | pending | reviewed`. Khi lưu 1
version mới, trạng thái tự chuyển sang `pending` — **chưa có UI/logic nào
chuyển sang `reviewed`** (đúng brief — chuẩn bị slot, không implement AI
Review). Đây là chỗ Sprint B3+ (Companion Review thật) sẽ ghi vào.

---

## 10. Reflection Placeholder (Data Model, chưa AI)

`OutputRecord.reflectionStatus`: `not_ready | pending | submitted` — có
sẵn trong data model, **chưa có UI nào cho người dùng nhập Reflection**
trong Sprint B2 (đúng brief — chỉ Data Model, không AI, không UI mới cho
phần này cụ thể). Sprint B3+ sẽ thêm UI Reflection thật.

---

## 11. Portfolio Ready

`OutputRecord` đã có đủ field (`outputId`, `type`, `versions`,
`reviewStatus`, `createdAt`) để Sprint B4 (Portfolio MVP) đọc và quyết
định promote sang `PortfolioItem` — không cần đổi cấu trúc `OutputRecord`
khi Portfolio Engine được xây, chỉ cần đọc `session.outputs[]` qua
`AssetEngine.qualifiesForPortfolio()` (interface đã có từ Sprint B1
Progressive Refactor, `extension-points.ts`) — **chưa implement
Portfolio** trong sprint này.

---

## 12. Future Integration

- Sprint B3 (Growth Event Reader): Nhật ký học tập/Hành trình của tôi/Khu
  vườn của bạn bắt đầu đọc `readGrowthEvents()`/`subscribeToGrowthEvents()`
  — giờ đã có nhiều loại Event thật hơn (từ Workspace Session) để hiển
  thị, không chỉ `WORKSPACE_STARTED`.
- Sprint B4 (Portfolio MVP): đọc `session.outputs[]` qua
  `WorkspaceRepository`/`PortfolioRepository` (interface đã có từ Sprint
  B1 Progressive Refactor) để tạo `PortfolioItem` thật.
- Sprint B5-B6: `reviewStatus`/`reflectionStatus` được Capability/Impact/
  Unlock Engine đọc để tính Capability/Impact/Unlock thật.
- `ExecutionEngine` (extension point, EPIC 04): khi có AI Agent thật, thay
  vì người dùng tự viết Output, Companion sẽ gọi `ExecutionEngine.execute()`
  để sinh nháp — `saveOutputVersion()` không đổi API, chỉ đổi nguồn
  `content` (từ người dùng gõ tay → từ AI Agent trả về).

---

## Ghi chú xác thực (Build Safety)

- `npx tsc --noEmit`: sạch, không lỗi.
- `npm run build`: thành công, đầy đủ route hiện có (không route nào bị
  thêm/bớt).
- `npm run lint`: chỉ còn 5 warning `<img>` đã biết từ trước.
- `npx vitest run`: 56/56 test pass, không regression.
- Academy, Knowledge Library, Companion, Admin: **không file nào bị sửa**
  — chỉ 3 file thay đổi trong sprint này: `data-model.ts`/
  `growth-event-bus.ts` (thêm 2 event type), `WorkspaceMvp.tsx` (nâng cấp
  UI trong đúng phạm vi AI Workspace), và 1 file mới
  `workspace-session-store.ts`.
- Kiểm thử tương tác trực tiếp qua trình duyệt **chưa thực hiện được**
  trong môi trường này — `/portal/*` yêu cầu Supabase Auth, môi trường
  hiện tại không có session đăng nhập nên mọi request tới
  `/portal/workspace` bị middleware redirect (307) sang `/login` trước
  khi tới được `WorkspaceMvp.tsx`. Đã bù đắp bằng `tsc`/`build`/`lint`/
  `vitest` đầy đủ; khuyến nghị QA thủ công qua trình duyệt thật (có đăng
  nhập) trước khi coi Sprint B2 là "đã kiểm chứng người dùng thật", không
  chỉ "biên dịch được".

---

Không ảnh hưởng người dùng theo nghĩa: UI tổng thể (breadcrumb, Hero,
Companion Suggestion) giữ nguyên; phần thêm mới (Timeline/Task Panel/
Output Panel/History) thay thế đúng vị trí 2 section tĩnh cũ ("Kế hoạch
bước đầu" + placeholder "Kết quả sẽ hiển thị tại đây") bằng nội dung thật,
không thêm section ở nơi khác trong Portal.
