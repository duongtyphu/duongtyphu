# AI Agent Integration MVP

Kết nối AI Agent thật vào VO DUONG AI để kiểm chứng luồng làm việc bằng
kết quả thật — không mở rộng kiến trúc, không Marketplace, không Agent
Store, không Multi-Agent phức tạp. Chỉ 2 Agent: **Writer Agent** và
**Reviewer Agent**, kiểm chứng trên đúng 1 Blueprint: **Facebook Content
Blueprint** ("Viết bài Facebook bằng AI").

**Product Principle**: AI Agent không phải trung tâm. Blueprint là quy
trình. Companion là điều phối. AI Agent là người thực thi. User là người
phê duyệt cuối. Output thật là bằng chứng.

---

## 1. Provider Adapter

`src/lib/portal/foundation/ai-provider.ts` — lấp đầy đúng extension point
`AiProvider` đã chuẩn bị sẵn từ Sprint B1 Progressive Refactor
(`extension-points.ts`), lần đầu tiên có implementation thật:

```ts
type AiProvider = {
  name; model; provider;      // metadata, không lộ tên hãng AI cụ thể (AI-Agnostic)
  status: "idle" | "running" | "completed" | "failed";
  error?: string;
  execute<TResult>(agentRole: "writer" | "reviewer", input): Promise<TResult>;
};
```

`createWorkforceApiProvider()` là implementation duy nhất — gọi API Route
`/api/ai/workforce` qua `fetch`, **không hard-code API key**, không gọi
model trực tiếp từ client. Client (Workspace UI) không bao giờ biết
Anthropic/OpenAI cụ thể nào đứng sau — chỉ biết "Workforce API Provider."

**Tái sử dụng provider hiện có trong codebase** (đúng brief mục 2): API
Route gọi `callCompanionModel()`/`isAiConfigured()`/`extractJson()` từ
`src/ai/agents/companion.agent.ts` — cơ chế gọi Anthropic/OpenAI **đã có
sẵn** trong Admin Companion Studio (đọc `ANTHROPIC_API_KEY`/
`OPENAI_API_KEY` từ biến môi trường, không đổi 1 dòng nào ở file đó,
không hard-code key ở bất kỳ đâu). Không tạo cơ chế gọi model thứ hai.

---

## 2. Writer Agent

`src/ai/agents/writer-agent.ts` (`"server-only"`, chỉ chạy trong API
Route). Nhận: Goal, Blueprint name, Task name, Context, User input, Output
format. Trả về: `draftOutput`, `summary`, `suggestedTitle`, `notes`.

Nếu `!isAiConfigured()` (chưa có API key trong môi trường) → trả về
**mock được dán nhãn rõ ràng** (`isMock: true`, nội dung bắt đầu bằng
`[MOCK — chưa cấu hình ANTHROPIC_API_KEY/OPENAI_API_KEY]`) — không giả
vờ đây là Output AI thật.

Output từ Writer Agent được lưu vào Workspace qua đúng `saveOutputVersion()`
đã có (Sprint B2) — không viết lại logic lưu Output, chỉ khác nguồn
`content`.

---

## 3. Reviewer Agent

`src/ai/agents/reviewer-agent.ts` (`"server-only"`). Nhận: Draft output,
QA checklist, Goal, Expected Output. Trả về: `strengths[]`, `issues[]`,
`suggestedImprovements[]`, `approvalRecommendation: "approve"|"revise"`,
`versionSuggestion`.

**Reviewer không approve thay User** — `approvalRecommendation` chỉ là gợi
ý hiển thị trong UI kèm dòng chữ "chỉ là gợi ý — quyết định cuối luôn
thuộc bạn." Cũng có mock rõ ràng khi chưa cấu hình API key.

---

## 4. Workspace Flow

Mở rộng `workspace-session-store.ts` (không đổi Sprint B2-B5 đã khóa,
chỉ thêm hàm mới):

```
runWriterAgentForOutput(sessionId, input)
   → startAgentRun("Writer Agent") → gọi Provider.execute("writer", ...)
   → saveOutputVersion() → approvalStatus: "draft" → completeAgentRun()

runReviewerAgentForOutput(sessionId, outputId, input)
   → startAgentRun("Reviewer Agent") → gọi Provider.execute("reviewer", ...)
   → lưu agentReview + approvalStatus ("reviewed" nếu approve, "needs_revision" nếu revise)
   → completeAgentRun()

approveOutput(sessionId, outputId)
   → dùng lại startReview()/markOutputReviewed() đã có (Sprint B3)
   → approvalStatus: "approved"
```

`OutputRecord` có thêm 2 field mới (additive, không phá dữ liệu cũ):
`agentReview?: AgentReviewResult` và `approvalStatus?: "draft" | "reviewed"
| "needs_revision" | "approved"`.

**Workspace UI hiển thị** (`WorkspaceMvp.tsx`, không UI đẹp, chỉ rõ ràng):
badge trạng thái Output (Draft/Reviewed/Needs Revision/Approved), nút
"Chạy Writer Agent"/"Chạy Reviewer Agent" (có trạng thái loading), khối
hiển thị `agentReview` (điểm mạnh/vấn đề/gợi ý cải thiện/khuyến nghị), nút
"Duyệt (Approve)" chỉ xuất hiện sau khi có `agentReview`, và 1 section
"Agent Run Log" liệt kê từng lần Agent chạy (role, trạng thái, lỗi nếu
có, có phải mock hay không).

---

## 5. Event Log

5 loại Event mới cộng vào Growth Event Backbone đã khóa (từ 16 → 21 loại):
`AGENT_RUN_STARTED`, `AGENT_RUN_COMPLETED`, `AGENT_RUN_FAILED`,
`OUTPUT_REVIEWED`, `USER_APPROVAL_REQUIRED` — mỗi loại khai báo đủ 3 module
tiêu thụ (`learning-journal`/`my-journey`/`living-garden`), đúng Product
Guardrails luật 7. `OUTPUT_REVIEWED` (Reviewer Agent review) tách biệt
với `REVIEW_COMPLETED` đã có (Review Flow thủ công, Sprint B3) — 2 nguồn
gốc khác nhau, không hợp nhất.

`USER_APPROVAL_REQUIRED` chỉ phát khi Reviewer Agent gợi ý `"approve"` —
nếu gợi ý `"revise"`, hệ thống không phát Event này (đã kiểm chứng bằng
test, xem mục Test Result).

---

## 6. Approval Flow

```
draft → reviewed (Reviewer Agent gợi ý approve) → approved (User bấm Approve)
draft → needs_revision (Reviewer Agent gợi ý revise) → [User tự chỉnh sửa/chạy lại Writer Agent]
```

**Không tự đưa vào Portfolio nếu User chưa duyệt** — `approveOutput()` chỉ
đặt `reviewStatus: "reviewed"` (điều kiện Portfolio đã khóa từ Sprint B4),
**không tự động promote**. Portfolio vẫn cần thêm điều kiện Reflection đã
khóa (xem mục Known Limitations).

---

## 7. Portfolio

Khi Output đủ điều kiện (đúng kiến trúc đã khóa — `reviewStatus:
"reviewed"` VÀ `reflectionStatus: "submitted"`), `promoteEligibleOutputs()`
(Sprint B4, không đổi) tự động tạo `PortfolioItem`, phát `PORTFOLIO_CREATED`.
Workspace Session hoàn thành khi User bấm "Hoàn thành Mission" (`completeSession()`
đã có từ Sprint B2, không đổi).

---

## 8. Test Case & Test Result

**Test Case** (đúng mục 9 của brief): Goal "Viết một bài Facebook giới
thiệu VO DUONG AI" → Blueprint "Facebook Content Blueprint" (mission
`viet-content-facebook` đã map ở `mission-catalog.ts`) → Writer Agent tạo
draft → Reviewer Agent review (gợi ý approve) → User approve → Reflection
→ Output vào Portfolio.

**Test Result**:

1. **Xác nhận qua HTTP thật** (dev server chạy thật, không mock ở tầng
   này): gọi `POST /api/ai/workforce` với `agentRole: "writer"` và
   `agentRole: "reviewer"` — cả 2 trả về `{"ok": true, "result": {...,
   "isMock": true}}`. **`isMock: true`** vì môi trường này không có
   `ANTHROPIC_API_KEY`/`OPENAI_API_KEY` cấu hình thật (đã xác nhận —
   không có key nào trong `.env.local`) — route/Agent code chạy đúng,
   fallback mock đúng như thiết kế, có dán nhãn rõ ràng.
2. **Xác nhận toàn bộ luồng end-to-end** qua
   `src/lib/portal/foundation/__tests__/agent-integration-mvp.test.ts` —
   2 test case:
   - Test 1: mock `fetch` trả kết quả Writer/Reviewer hợp lệ
     (`approvalRecommendation: "approve"`) — chạy đúng thứ tự
     `startCompanionWorkspace → runWriterAgentForOutput →
     runReviewerAgentForOutput → approveOutput → submitReflection →
     promoteEligibleOutputs`, xác nhận: Output có 1 version, `approvalStatus`
     đúng từng bước, `PortfolioItem` được tạo với `missionId` đúng, đủ 6
     loại Event mới/liên quan (`AGENT_RUN_STARTED/COMPLETED`,
     `OUTPUT_CREATED`, `OUTPUT_REVIEWED`, `USER_APPROVAL_REQUIRED`,
     `PORTFOLIO_CREATED`), Agent Run Log có đúng 2 Agent (Writer + Reviewer),
     **không có Agent thứ 3 nào**.
   - Test 2: Reviewer gợi ý `"revise"` — xác nhận `approvalStatus:
     "needs_revision"`, **không** phát `USER_APPROVAL_REQUIRED`, Portfolio
     vẫn rỗng (chưa Approve/Reflection).
3. **Toàn bộ Test PASS**: `npx vitest run` → 59/59 (56 cũ + 1 test
   end-to-end Phase 2 + 2 test mới của AI Agent Integration MVP).

Không có dữ liệu giả nào được tạo để báo pass — mock chỉ áp dụng ở ranh
giới mạng (`fetch`) trong test tự động, và ở tầng Provider khi thật sự
thiếu API key (dán nhãn rõ, không giả làm kết quả AI thật).

---

## 9. Known Limitations

1. **Chưa có API key thật trong môi trường này** — mọi lần gọi Writer/
   Reviewer Agent thật sự chạy đều trả về mock đã dán nhãn. Khi triển
   khai với `ANTHROPIC_API_KEY`/`OPENAI_API_KEY` thật, Agent sẽ gọi model
   thật qua đúng cùng 1 đường code — không cần đổi gì thêm.
2. **Portfolio vẫn yêu cầu Reflection** — brief MVP mô tả luồng "Approve →
   Portfolio" trực tiếp, nhưng kiến trúc đã khóa (Sprint B4/B5) yêu cầu
   thêm Reflection thật trước khi Portfolio nhận Output. Đã giữ nguyên
   điều kiện này (đúng "không thay đổi kiến trúc đã khóa"), không nới
   lỏng chỉ để khớp brief MVP theo nghĩa đen — luồng thật là Approve →
   Reflection (UI đã có sẵn từ Sprint B3) → Portfolio tự động.
3. **Chỉ 2 Agent, 1 Blueprint** — đúng phạm vi MVP, không mở rộng thêm
   Agent/Blueprint nào khác trong Sprint này.
4. **Không có cơ chế retry/rate-limit** cho lỗi gọi model — `AGENT_RUN_FAILED`
   chỉ ghi nhận lỗi, chưa có logic thử lại tự động (ngoài phạm vi MVP).
5. **Prompt Writer/Reviewer Agent còn đơn giản** (chưa tối ưu chất lượng
   Output thật khi có API key) — đủ cho mục tiêu MVP là kiểm chứng luồng
   hệ thống, chưa phải chuẩn Prompt Engineering sản xuất.

---

## Ghi chú xác thực (Build Safety)

- `npx tsc --noEmit`: sạch.
- `npm run build`: thành công, thêm đúng 1 route mới `/api/ai/workforce`
  (route API, không phải route Portal — không đổi menu/route Portal nào).
- `npm run lint`: chỉ 5 warning `<img>` đã biết từ trước.
- `npx vitest run`: 59/59 pass (56 cũ + phase2-e2e-loop + 2 test AI Agent
  Integration MVP).
- Không đổi EPIC 01/02/03 đã khóa — chỉ thêm field/hàm mới (additive) vào
  `workspace-session-store.ts`/`data-model.ts`/`growth-event-bus.ts`,
  thêm 5 file mới (`ai-provider.ts`, `agent-run-store.ts`,
  `writer-agent.ts`, `reviewer-agent.ts`, API route), không sửa route
  Portal nào, không đổi menu.
