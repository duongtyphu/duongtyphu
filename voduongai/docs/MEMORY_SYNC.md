# Memory Sync (Sprint 003 — code thật, MỚI)

> Brief yêu cầu: sau Complete, Workspace ghi `Learning, Reflection,
> Knowledge, Best Practice, Capability Improvement`. Đây là module MỚI
> của Sprint 003 — `src/lib/portal/foundation/memory-store.ts`.

## Memory Contract (thật)

```ts
type MemoryEntry = {
  memoryId: string;
  outputId: string;
  portfolioItemId: string;
  sessionId: string;
  learning: string;              // từ Reflection Owner đã gửi (nguyên văn)
  reflection: string;              // câu hỏi + câu trả lời đầy đủ
  knowledge: string;                // Golden Mission hoặc Competency liên quan
  bestPractice: string;              // agentReview.strengths nếu có Reviewer Agent
  capabilityImprovement: string;      // portfolioItem.capabilityMapping
  createdAt: string;
};
```

## Trigger — "Sau Complete"

"Complete" = Output đã được `promoteEligibleOutputs()` chấp nhận vào
Portfolio (đã Review + đã Reflection). `WorkspaceMvp.tsx` gọi
`syncMemoryForPortfolioItem(portfolioItem, output)` ngay sau
`promoteEligibleOutputs()` trong `handleSubmitReflection()`.

## Nguyên tắc

- **Không suy diễn/bịa nội dung** — `learning`/`reflection` lấy nguyên
  văn từ `OutputRecord.reflections` (Reflection Owner đã tự gõ),
  `bestPractice` lấy từ `agentReview.strengths` thật (rỗng nếu chưa có
  Reviewer Agent chạy qua Output đó).
- **Idempotent** — `syncMemoryForPortfolioItem()` kiểm tra `portfolioItemId`
  đã có Memory chưa trước khi tạo mới; gọi lại nhiều lần không tạo bản
  ghi trùng (đã verify trong E2E test).
- **Không copy Output** — chỉ tham chiếu `outputId`/`portfolioItemId`,
  giữ đúng nguyên tắc Single Source of Truth đã khóa.
- **Event**: emit `MEMORY_UPDATED` (Growth Event mới, Sprint 003).

## API

```ts
listMemoryEntries(sessionId?: string): MemoryEntry[]
syncMemoryForPortfolioItem(portfolioItem: PortfolioItemRecord, output: OutputRecord): MemoryEntry
```

## Known Limitations

1. Lưu `localStorage` (client-side) — cùng giới hạn như mọi Foundation
   Data Layer khác trước Sprint chuyển sang Supabase thật.
2. Chưa có UI hiển thị Memory riêng (không có "Memory Panel" trong
   `WorkspaceMvp.tsx`) — brief chỉ yêu cầu Workspace "ghi" Memory, không
   yêu cầu UI hiển thị; verify qua test + `listMemoryEntries()`.
3. `bestPractice` rỗng nếu Output chưa qua Reviewer Agent (28/30 Companion
   hiện dùng chung Reviewer Agent qua route `"reviewer"`, chỉ áp dụng khi
   Owner chủ động chạy).
