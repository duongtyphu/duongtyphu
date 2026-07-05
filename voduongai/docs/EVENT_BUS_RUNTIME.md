# Event Bus Runtime (Sprint 003)

> Workspace chỉ giao tiếp qua Growth Event Bus (`growth-event-bus.ts`,
> đã khóa từ Sprint B1) — không module nào gọi trực tiếp module khác.
> Sprint 003 thêm đúng 2 event mới, dùng lại toàn bộ hạ tầng Event Bus
> đã có (không tạo Event Bus thứ 2).

## Event Timeline thật — Runtime Flow đầy đủ

```
COMPANION_ACTIVATED        (workforce-registry.ts — activateWave1Companions)
AGENT_RUN_STARTED           (agent-run-store.ts — mọi Companion, kể cả 30/30)
OUTPUT_CREATED               (workspace-session-store.ts — saveOutputVersion)
AGENT_RUN_COMPLETED           (agent-run-store.ts)
OUTPUT_REVIEWED                 (workspace-session-store.ts — runReviewerAgentForOutput)
USER_APPROVAL_REQUIRED           (workspace-session-store.ts — khi Reviewer gợi ý "approve")
OUTPUT_APPROVED                   (workspace-session-store.ts — approveOutput, MỚI Sprint 003)
REVIEW_COMPLETED                   (workspace-session-store.ts — markOutputReviewed, luồng thủ công)
REFLECTION_COMPLETED                 (workspace-session-store.ts — submitReflection)
PORTFOLIO_CREATED                     (portfolio-store.ts — promoteEligibleOutputs)
MEMORY_UPDATED                          (memory-store.ts — syncMemoryForPortfolioItem, MỚI Sprint 003)
```

## 2 Event mới của Sprint 003

| Event | Emit tại | Vì sao cần |
|---|---|---|
| `OUTPUT_APPROVED` | `workspace-session-store.ts` → `approveOutput()` | Trước Sprint 003, bước Approve không có Event riêng — chỉ ẩn trong `markOutputReviewed`. Event Timeline cần đúng "APPROVED" tường minh theo Runtime Flow của brief. |
| `MEMORY_UPDATED` | `memory-store.ts` → `syncMemoryForPortfolioItem()` | Memory Sync là module mới — cần Event riêng để Event Timeline phản ánh đúng bước "Complete → Memory". |

Cả 2 đăng ký đủ ≥3 consumer (`learning-journal`, `my-journey`,
`living-garden`, `OUTPUT_APPROVED` thêm `portfolio`) theo đúng Product
Guardrails đã khóa từ Sprint B1 (`FOUNDATION_DATA_LAYER.md` mục 8).

## Ví dụ chuỗi Event thật (brief)

```
OUTPUT_CREATED → Review Center nhận (Owner/Companion chạy Reviewer Agent)
  → REVIEW_COMPLETED/OUTPUT_REVIEWED → Approval Center nhận
    → OUTPUT_APPROVED → Portfolio Sync nhận
      → PORTFOLIO_CREATED → Memory Sync nhận
        → MEMORY_UPDATED
```

Đây chính xác là chuỗi được verify trong
`workspace-runtime-integration.test.ts` — không mô phỏng, đọc trực tiếp
từ `readGrowthEvents()` sau khi chạy Runtime Flow thật.

## Nguyên tắc "không gọi trực tiếp" — kiểm tra thật

- `workspace-session-store.ts` không import `portfolio-store.ts` hay
  `memory-store.ts` để tự gọi promote/sync — cả hai được gọi từ tầng UI
  (`WorkspaceMvp.tsx`) sau khi nhận kết quả, đúng ranh giới Data
  Ownership đã khóa (mỗi module chỉ ghi dữ liệu của chính nó).
- `companion-manager.ts` không import `workspace-session-store.ts` —
  chiều phụ thuộc chỉ 1 hướng (`workspace-session-store.ts` gọi
  `companion-manager.ts`, không ngược lại), tránh vòng lặp module.

## Known Limitations

- Event Bus vẫn dựa trên `localStorage` + `CustomEvent` same-tab (đã
  khóa từ Sprint B1) — không đồng bộ đa tab/đa thiết bị trong sprint này.
