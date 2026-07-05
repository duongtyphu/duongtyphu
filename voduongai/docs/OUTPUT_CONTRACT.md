# Output Contract (Sprint 003 — code thật)

> Brief yêu cầu Output có: `id, title, summary, content, attachments,
> evidence, qualityScore, createdBy, provider, department, companion,
> taskId, projectId, blueprintId, createdAt`. Dưới đây là ánh xạ THẬT
> vào cấu trúc đã có (Kernel không đổi) — không tạo type song song.

## Ánh xạ vào code thật

| Trường Contract (brief) | Nơi có thật hôm nay |
|---|---|
| `id` | `OutputRecord.outputId` (`workspace-session-store.ts`) |
| `title` | `session.context.title` (Blueprint name) — Output chưa có title riêng, dùng title Session |
| `summary` | `WriterAgentResult.summary` (chỉ có khi Writer Agent chạy) — 28/30 Companion chưa có field này riêng |
| `content` | `OutputVersionRecord.content` (version mới nhất) |
| `attachments` | Chưa có field riêng — Output hiện tại chỉ là text/link, không có upload file (ngoài phạm vi Sprint 003, không phải Kernel) |
| `evidence` | `OutputRecord.reflections` + `agentReview` + Growth Event liên quan (`CAPABILITY_EVIDENCE_FRAMEWORK.md`) |
| `qualityScore` | `agentReview.approvalRecommendation` (định tính: approve/revise) — chưa có điểm số 0-100 thật |
| `createdBy` | Suy ra từ Agent Run Log (`agent-run-store.ts` → `agentRole`/`position`) |
| `provider` | `ProviderExecuteResult.providerId` (trả về trong `CompanionTaskResult.providerId`) |
| `department` | `CompanionRecord.department` (Workforce Registry) |
| `companion` | `CompanionRecord.position`/`employeeId` |
| `taskId` | `AgentRunRecord.runId` (Agent Run Log) |
| `projectId` | `WorkspaceSessionRecord.sessionId` |
| `blueprintId` | `session.context.missionId` (Golden Mission) |
| `createdAt` | `OutputRecord.createdAt` |

## Đường đi runtime thật

```ts
// companion-manager.ts
type CompanionTaskResult = { employeeId, position, department, output, model, providerId, isMock };

// companion-manager.ts — Output Contract chuẩn hoá (Sprint 002, dùng thật ở Sprint 003)
type CompanionOutputContract = { employeeId, type: OutputType, content: string };
function toOutputContract(companion, result): CompanionOutputContract;

// workspace-session-store.ts — Sprint 003
async function runCompanionAgentForOutput(sessionId, employeeId, input):
  Promise<{ session, output: OutputRecord } | null>;
```

`runCompanionAgentForOutput()` gọi `assignTask()` → `toOutputContract()`
→ `saveOutputVersion()` (Kernel, không đổi) → `OutputRecord` thật xuất
hiện trong `session.outputs`.

## Known Limitations

- Không có `id`/`title`/`summary`/`attachments`/`qualityScore` (số) như
  1 field riêng biệt trong `OutputRecord` — brief's Contract là khái
  niệm hợp nhất từ nhiều nguồn dữ liệu thật đã có, không phải 1 bảng
  mới. Tạo 1 bảng `OutputContractRecord` song song sẽ vi phạm nguyên
  tắc "Single Source of Truth" đã khóa từ Sprint B1 — không làm.
- `qualityScore` số (0-100) chưa tồn tại — chỉ có định tính
  (approve/revise) từ Reviewer Agent. Thêm điểm số thật cần Benchmark/QA
  đo được, thuộc phạm vi EPIC 06, ngoài Sprint 003.
