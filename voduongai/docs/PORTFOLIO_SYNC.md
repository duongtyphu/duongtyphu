# Portfolio Sync (Sprint 003 — code thật, đã có từ Sprint B4)

> Brief yêu cầu: sau Approve, Workspace tạo Portfolio Item gồm `Goal,
> Blueprint, Output, Evidence, Version, Companion, Provider, Completion
> Date`. Cơ chế Auto Sync **đã tồn tại thật** từ Sprint B4
> (`portfolio-store.ts`) — Sprint 003 xác nhận vẫn đúng khi Output đến
> từ bất kỳ 1 trong 30 Companion (không chỉ Writer).

## Điều kiện Auto Sync (đã khóa, không đổi)

`promoteEligibleOutputs(sessionId)` chỉ promote Output khi:
`reviewStatus === "reviewed"` **và** `reflectionStatus === "submitted"`.

## Ánh xạ Contract (brief) ↔ `PortfolioItemRecord` thật

| Trường Contract (brief) | Field thật (`portfolio-store.ts`) |
|---|---|
| Goal | Suy ra từ `session.context.userGoal` (Portfolio không copy, chỉ tham chiếu `sessionId`) |
| Blueprint | `missionId` |
| Output | `outputId` (tham chiếu, không copy nội dung — Single Source of Truth) |
| Evidence | `capabilityMapping` + Growth Event liên quan |
| Version | `version: number` |
| Companion | Suy ra qua Agent Run Log gắn với `outputId` (Sprint 003 mới ghi được cho cả 30 Companion) |
| Provider | Suy ra qua Agent Run Log / `CompanionTaskResult.providerId` tại thời điểm chạy |
| Completion Date | `createdAt`/`updatedAt` |

## Runtime thật (không đổi từ Sprint B4)

```
submitReflection() → promoteEligibleOutputs(sessionId, session)
  → emit PORTFOLIO_CREATED
  → PortfolioItemRecord xuất hiện trong listPortfolioItems()
```

Sprint 003 nối thêm: `WorkspaceMvp.tsx` dùng chính `PortfolioItemRecord`
vừa `promoteEligibleOutputs()` trả về để gọi `syncMemoryForPortfolioItem()`
ngay sau đó (xem `MEMORY_SYNC.md`).

## Known Limitations

- Portfolio Item không lưu tường minh `companionId`/`providerId` như 1
  field riêng — phải suy ra qua Agent Run Log cùng `sessionId`/thời
  điểm. Thêm 2 field này trực tiếp vào `PortfolioItemRecord` là thay đổi
  Kernel (`portfolio-store.ts` đã khóa từ Sprint B4) — ngoài phạm vi
  Sprint 003 ("Không thay đổi Kernel").
