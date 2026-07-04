# Sprint B3 — Companion Orchestrator

Companion chuyển từ khái niệm "AI Chat" sang **AI Learning Orchestrator**
thật — lớp điều phối đứng giữa Universal Context, Workspace Session, và
Growth Event Bus. Companion không phải nơi học, không phải Workspace,
không phải Thư viện tri thức — Companion chỉ điều phối, đọc dữ liệu đã
có, gợi ý, và phát Event. Không thay đổi UI lớn (chỉ bổ sung 3 khối nhỏ —
Next Action, Review, Reflection — vào đúng trang `/portal/workspace` đã
có từ Sprint B2, không thêm route/menu mới).

---

## 1. Companion Role

Companion **không thay thế**: người học, AI Tool, Workspace, Học viện AI.
Companion **chỉ điều phối** — nhận Context, hiểu Mission, chia bước, gợi ý
hành động tiếp theo, phát Event. Toàn bộ logic nằm ở
`src/lib/portal/foundation/execution-orchestrator.ts` (mới) +
`workspace-session-store.ts` (mở rộng từ Sprint B2) — **Companion không lưu
dữ liệu riêng** ngoài Context tạm thời; mọi state thật (Session/Output/
Reflection) vẫn do Workspace sở hữu, đúng Role & Responsibility Matrix mục
4/11.

---

## 2. Universal Context Intake

Không cần thay đổi cơ chế — `WorkspaceContext` (từ Sprint B1) đã mang đủ
`userId`(chưa có auth thật)/`module`/`routeFrom`/`journeyId`/`collectionId`/
`missionId`/`assetId`/`expectedOutput`/`currentCapability`. Companion đọc
trực tiếp từ `session.context` (đã lưu trong `WorkspaceSessionRecord` từ
Sprint B2) — **không hỏi lại** bất kỳ field nào đã có. `workspaceSessionId`
và `currentStep` được bổ sung tự nhiên vì Companion luôn thao tác trên
`WorkspaceSessionRecord` (đã có `sessionId`/`currentStepId` sẵn).

---

## 3. Mission Understanding

`buildMissionUnderstanding(session)` (`execution-orchestrator.ts`) đọc
`WorkspaceSessionRecord` và trả về: `missionGoal`, `expectedOutput`,
`currentStepId`/`currentStepLabel`, `stepsRemaining` (tính từ vị trí trong
`EXECUTION_TIMELINE`), `canResume` (dựa trên `status !== "completed"`) —
**không bắt đầu lại từ đầu**, vì `findResumableSession()` (Sprint B2) đã
đảm bảo Session được resume đúng bước đang dở.

---

## 4. Execution Planner

`EXECUTION_STEP_TASKS` (chuyển từ `STEP_TASK` cục bộ trong
`WorkspaceMvp.tsx` sang `execution-orchestrator.ts` — giờ là **nguồn duy
nhất**, đúng nguyên tắc Single Source of Truth) chia Mission thành đúng 7
bước đã có từ Sprint B2 (Mission Started → Preparing → Research → Draft →
Review → Revision → Completed), mỗi bước có `doing`/`task` mô tả rõ ràng.
Ví dụ trong brief (Thu thập thông tin/Lập dàn ý/Soạn bản nháp/Rà soát/Xuất
Output) ánh xạ vào các bước Preparing/Research/Draft/Review/Completed đã
có — không tạo thang bước thứ hai song song, tránh 2 nguồn sự thật khác
nhau cho cùng một khái niệm "bước Mission."

---

## 5. Workspace Coordination

Companion không lưu dữ liệu riêng — mọi thứ (Current Step/Current Output/
Version/History/Expected Output) đọc trực tiếp từ
`WorkspaceSessionRecord` (Workspace sở hữu, Sprint B2). `getNextAction()`
và `buildMissionUnderstanding()` chỉ nhận `session` làm input, không có
tham số nào khác — không có state nội bộ nào của Companion tồn tại giữa 2
lần gọi.

---

## 6. Review Coordination

**Chưa có AI Review thật** — chỉ chuẩn hóa luồng:
`startReview(sessionId, outputId)` (mới, `workspace-session-store.ts`)
phát `REVIEW_STARTED`, giữ `reviewStatus = "pending"`. Người dùng tự xác
nhận qua nút "Review cùng Companion →" trên UI (`WorkspaceMvp.tsx`) →
`markOutputReviewed()` chuyển `reviewStatus = "reviewed"`. Đây là **chỗ
cắm sẵn** cho Companion Review thật (EPIC 04+) — khi có AI, chỉ cần thay
nội dung hàm `markOutputReviewed`/thêm bước AI phân tích trước khi đổi
trạng thái, không đổi luồng gọi.

---

## 7. Reflection Coordination

`startReflection(sessionId, outputId)` phát `REFLECTION_STARTED` ngay sau
khi Review hoàn tất (gọi liên tiếp trong `handleMarkReviewed`). 3 câu hỏi
chuẩn (`REFLECTION_QUESTIONS`, `execution-orchestrator.ts`): "Bạn học được
gì?", "AI giúp bạn ở đâu?", "Điều gì cần cải thiện?" — hiển thị dưới dạng 3
ô nhập trong Output Panel. `submitReflection()` lưu câu trả lời vào
`OutputRecord.reflections[]` (field mới), chuyển `reflectionStatus =
"submitted"`, phát `REFLECTION_COMPLETED` (đã có từ Sprint B1) — **dữ liệu
này sẵn sàng cho Sprint B4** (Portfolio MVP đọc Reflection làm 1 phần
Evidence).

---

## 8. Growth Event Emission

Companion (qua `workspace-session-store.ts`) chỉ **phát** Event, không xử
lý. 2 loại mới thêm ở Sprint B3: `REVIEW_STARTED`, `REFLECTION_STARTED` —
mở rộng `GrowthEventType` (nay 14 loại) và `GROWTH_EVENT_CONSUMERS`
(`data-model.ts`/`growth-event-bus.ts`). **Ghi chú đối chiếu**:
`MISSION_RESUMED` trong brief dùng chung `WORKSPACE_RESUMED` đã có từ
Sprint B2 (cùng ý nghĩa — Session được resume) — không thêm Event trùng
lặp ý nghĩa, tránh 2 loại Event cho cùng 1 hành động thật.

---

## 9. Next Action Engine

`getNextAction(session)` trả về **đúng 1** hành động, theo thứ tự ưu
tiên: Session chưa hoàn thành → "Tiếp tục Mission"; đã hoàn thành nhưng
chưa có Output → "Tạo Version 2"; có Output nhưng chưa review → "Review
cùng Companion"; đã review nhưng chưa reflect → "Chia sẻ Reflection"; đã
xong hết → "Chuyển sang Mission tiếp theo" (placeholder — chưa có Mission
Engine thật để gợi ý Mission cụ thể, xem mục 12). Hiển thị 1 dòng banner
duy nhất ở đầu khu vực Session trong `WorkspaceMvp.tsx` — không liệt kê
nhiều lựa chọn.

---

## 10. Universal Entry Point

`COMPANION_ENTRY_LABELS` (`execution-orchestrator.ts`) chuẩn hóa 6 label
CTA đã/sẽ dùng trên Portal: "Thực hành cùng Companion", "Dùng ngay cùng
Companion", "Giao việc cho Companion", "Tiếp tục Mission", "Tạo Version
2", "Review cùng Companion" — tất cả đều dẫn về cùng cơ chế
(`startCompanionWorkspace`/các hàm điều phối trong
`workspace-session-store.ts`). "Tiếp tục Mission" và "Review cùng
Companion" giờ đã có hành vi thật (qua `getNextAction`/nút Review trong
UI); "Tạo Version 2" đã có từ Sprint B2 (nút "Lưu phiên bản mới" khi
`outputId` đã tồn tại).

---

## 11. State Diagram

```
Session: active ──pause──> paused ──resume──> active ──complete──> completed

Output:  (chưa có) ──save──> reviewStatus=pending
                                  │
                          startReview (REVIEW_STARTED)
                                  │
                          markOutputReviewed ──> reviewStatus=reviewed
                                  │
                          startReflection (REFLECTION_STARTED)
                                  │
                          submitReflection ──> reflectionStatus=submitted
                                                 (REFLECTION_COMPLETED)
```

Mỗi mũi tên trong sơ đồ trên tương ứng đúng 1 hàm trong
`workspace-session-store.ts` — không có chuyển trạng thái nào xảy ra
ngoài các hàm này (Single Source of Truth cho state machine).

---

## 12. Future Multi-Agent Integration

`AGENT_ROLES_READY` (`execution-orchestrator.ts`): Research Agent → Writer
Agent → Reviewer Agent → Designer Agent — **chỉ là danh mục chuẩn bị**,
không implement, không gọi ở bất kỳ đâu, khớp với `AiProvider`/
`ExecutionEngine` (extension points đã có từ Sprint B1 Progressive
Refactor). Khi EPIC 04 xây Multi-Agent Orchestration thật: `handleSaveOutput`
sẽ gọi `ExecutionEngine.execute({ agentRole, instruction })` thay vì đọc
trực tiếp `draftContent` người dùng gõ tay — `saveOutputVersion()` không
đổi API, chỉ đổi nguồn `content`. Mission Engine thật (đọc `UnlockRule`
thật để biết "Mission tiếp theo" cụ thể là gì) sẽ thay thế nhánh
`next_mission` placeholder trong `getNextAction()`.

---

## Ghi chú xác thực (Build Safety)

- `npx tsc --noEmit`: sạch.
- `npm run build`: thành công, route list không đổi.
- `npm run lint`: chỉ 5 warning `<img>` đã biết từ trước.
- `npx vitest run`: 56/56 pass.
- File thay đổi: `data-model.ts`/`growth-event-bus.ts` (2 event type
  mới), `workspace-session-store.ts` (4 hàm điều phối mới + field
  `reflections`), `WorkspaceMvp.tsx` (Next Action banner + Review/
  Reflection UI trong đúng Output Panel đã có, không thêm section/route
  mới), 1 file mới `execution-orchestrator.ts`. Academy/Knowledge
  Library/Admin: không đổi.
- Tương tự Sprint B2: chưa QA được qua trình duyệt thật (môi trường không
  có session Supabase Auth đăng nhập, `/portal/*` bị middleware redirect)
  — đã bù bằng `tsc`/`build`/`lint`/`vitest` đầy đủ.

---

Companion vẫn không phải chatbot — không có ô chat tự do nào được thêm,
không có hội thoại vô tận, không sinh Output thay người dùng, không tự
Unlock/đổi Journey. Người học luôn là người tạo ra kết quả; Companion chỉ
đảm bảo người học luôn biết mình đang làm gì, nên làm gì tiếp theo, và đã
tiến bộ tới đâu.
