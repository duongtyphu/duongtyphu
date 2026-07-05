# Sprint 003 — Workspace Runtime Integration

> Báo cáo triển khai. Workspace không còn chỉ hiển thị — nó là nơi AI
> Workforce thật sự làm việc: Companion nhận Task, Provider chạy (Mock
> trong sandbox này), Output quay về, Review/Approval/Portfolio/Memory
> chạy tự động theo đúng Event. Không đổi Kernel/Blueprint/Workforce/
> AI Service Registry — chỉ nối các phần đã có sẵn lại với nhau.

## Runtime Flow đã chạy được thật

```
Owner → Goal (startCompanionWorkspace) → Companion (COO, chọn Blueprint)
  → Project/Blueprint (WorkspaceSessionRecord + missionId)
  → Task (EXECUTION_TIMELINE)
  → Department → AI Companion (workforce-registry.ts, 30 Companion)
  → AI Service Manager (aiServiceManager.execute qua companion-manager.ts)
  → Provider (Mock trong sandbox này)
  → Output (saveOutputVersion — Kernel không đổi)
  → Review (runReviewerAgentForOutput, đã có từ MVP)
  → Owner Approval (approveOutput — nay phát OUTPUT_APPROVED)
  → Portfolio (promoteEligibleOutputs, đã có từ Sprint B4)
  → Memory (memory-store.ts, MỚI — Sprint 003)
```

## Đã triển khai gì (code thật)

| Thành phần | File | Trạng thái |
|---|---|---|
| Companion → Output Kernel | `workspace-session-store.ts` → `runCompanionAgentForOutput()` | ✅ mới — chạy Task cho BẤT KỲ 1 trong 30 Companion, không chỉ Writer |
| Output Contract chuẩn hoá (Sprint 002) → dùng thật | `companion-manager.ts` → `toOutputContract()` | ✅ nay được gọi thật trong `runCompanionAgentForOutput` |
| Owner Approval event tường minh | `workspace-session-store.ts` → `approveOutput()` | ✅ phát `OUTPUT_APPROVED` (event mới) |
| Memory Sync | `memory-store.ts` (mới) → `syncMemoryForPortfolioItem()` | ✅ ghi Memory thật từ Reflection/Review, idempotent theo `portfolioItemId` |
| AI Workforce module (UI) | `WorkspaceMvp.tsx` | ✅ dropdown chọn 1/30 Companion đã Activate, nút "Giao Task cho Companion" |
| Agent Run Log cho cả 30 Companion | `agent-run-store.ts` (`AgentRole` mở rộng thành `string`) | ✅ |
| Event Timeline | `growth-event-bus.ts`/`growth-view.ts` | ✅ 2 event mới: `OUTPUT_APPROVED`, `MEMORY_UPDATED` |

## Mapping 10 Workspace Module (brief) ↔ đã có/mới

| Module (brief) | Trạng thái |
|---|---|
| Goal Panel | Đã có từ Sprint B2 (`context.userGoal`, `session.status`) |
| Project Panel | Đã có (Execution Timeline hiển thị Blueprint/Milestone) |
| Task Queue | Đã có (Task Panel theo `EXECUTION_STEP_TASKS`) |
| **AI Workforce** | **Mới** — dropdown 30 Companion + "Giao Task cho Companion" |
| Output Center | Đã có (Draft/Version/History), giữ nguyên |
| Review Center | Đã có (Reviewer Agent + agentReview display) |
| Approval Center | Đã có (`handleApproveOutput`), nay phát `OUTPUT_APPROVED` |
| **Portfolio Sync** | Đã có (`promoteEligibleOutputs`, tự động sau Reflection) |
| **Memory Sync** | **Mới** — `syncMemoryForPortfolioItem()`, gọi ngay sau Portfolio Sync |
| Event Timeline | Đã có (History section) + 2 event mới |

Không panel nào bị redesign — chỉ thêm đúng phần còn thiếu (AI Workforce
selector, Memory Sync), đúng chỉ đạo "Ưu tiên Runtime, không cần đẹp".

## Test End-to-End (bắt buộc, đã PASS)

`src/lib/portal/foundation/__tests__/workspace-runtime-integration.test.ts`
— Goal **"Tạo bài Facebook giới thiệu VO DUONG AI"** chạy trọn:
Companion (Writer Companion, EMP-C001) → Mock Provider → Output →
Reviewer → Approve → Reflection → Portfolio → Memory, verify đủ Event
Timeline (`COMPANION_ACTIVATED`/`AGENT_RUN_STARTED`/`AGENT_RUN_COMPLETED`/
`OUTPUT_CREATED`/`OUTPUT_REVIEWED`/`USER_APPROVAL_REQUIRED`/
`OUTPUT_APPROVED`/`PORTFOLIO_CREATED`/`MEMORY_UPDATED`).

```bash
npx vitest run src/lib/portal/foundation/__tests__/workspace-runtime-integration.test.ts
```

## Xác thực

```bash
npx tsc --noEmit      # sạch
rm -rf .next && npm run build   # thành công
npm run lint          # sạch (5 warning <img> đã biết)
npx vitest run        # 104/104 pass
```

## Known Limitations

1. 28/30 Companion vẫn dùng đường `"companion-task"` generic (chưa có
   Agent server-side chuyên biệt dựng Prompt riêng) — Output là `raw`
   text thô từ Mock/Provider, không phải JSON có cấu trúc như Writer/
   Reviewer.
2. Memory Sync chỉ chạy khi UI gọi (`WorkspaceMvp.tsx` sau Reflection)
   — chưa có cơ chế nền tự quét Portfolio Item chưa có Memory.
3. AI Workforce dropdown chỉ hiển thị Companion `active`/`idle` — nếu
   Workforce chưa Activate (session đầu tiên), `WorkspaceMvp.tsx` tự gọi
   `activateWave1Companions()` (idempotent) trước khi hiển thị danh sách.

Chi tiết Contract xem `OUTPUT_CONTRACT.md`/`REVIEW_CONTRACT.md`/
`PORTFOLIO_SYNC.md`/`MEMORY_SYNC.md`/`EVENT_BUS_RUNTIME.md`.
