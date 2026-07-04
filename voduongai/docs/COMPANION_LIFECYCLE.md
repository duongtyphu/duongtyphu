# PHASE 4 EPIC 02 — Companion Lifecycle (code thật)

> `CompanionWorkingStatus` — `src/lib/portal/foundation/workforce-registry.ts`.
> Cụ thể hoá AI Lifecycle đã thiết kế (`OPEN_AI_WORKFORCE_PLATFORM.md` §8)
> ở mức 1 Companion nghiệp vụ (khác Lifecycle Provider/Capability đã có).

## 1. Sơ đồ trạng thái

```
inactive
   │  activateWave1Companions() / setWorkingStatus(..., "training")
   ▼
training
   │
   ▼
certified
   │
   ▼
active ──────────────┐
   │  ▲               │
   │  │ (busy xong)    │
   ▼  │                ▼
busy ─┘             maintenance
   │                    │
   ▼                    ▼
idle                 active / retired
   │
   ├──► busy (nhận Task mới)
   ├──► active
   └──► maintenance

active/idle/maintenance ──► retired  (trạng thái cuối, không quay lại)
```

## 2. Bảng chuyển trạng thái hợp lệ (`ALLOWED_TRANSITIONS`)

| Từ | Được chuyển sang |
|---|---|
| `inactive` | `training` |
| `training` | `certified` |
| `certified` | `active` |
| `active` | `busy`, `idle`, `maintenance`, `retired` |
| `busy` | `idle`, `active` |
| `idle` | `busy`, `active`, `maintenance` |
| `maintenance` | `active`, `retired` |
| `retired` | *(không có — trạng thái cuối)* |

`setWorkingStatus(employeeId, next)` ném lỗi rõ ràng nếu `next` không
nằm trong danh sách hợp lệ của trạng thái hiện tại — không có chuyển
trạng thái "tắt" (vd `inactive` → `active` thẳng) được chấp nhận.

## 3. `activateWave1Companions()` — Activate hàng loạt

Đưa mọi Companion đang `inactive` đi hết `training → certified → active`
trong 1 lần gọi, phát đúng 1 `COMPANION_ACTIVATED`/Companion khi tới
`active` (không phát 1 event/bước trung gian — đây là hành động vận
hành "Activate vào Production Runtime", không phải mô phỏng quy trình
đào tạo nhiều ngày thật của `AI_TRAINING_ENGINE.md`/`AI_CERTIFICATION_SYSTEM.md`
— 2 tài liệu đó vẫn là quy trình đầy đủ áp dụng khi tuyển Companion mới
qua `AI_RECRUITMENT_SYSTEM.md`, Wave 1 ở đây được xem là đã qua vòng
thiết kế Sprint R1/EPIC05 và được Activate thẳng vào Production theo
quyết định của Sprint này).

## 4. Task Assignment và Lifecycle

`assignTask()` (`companion-manager.ts`) chỉ nhận Task nếu
`workingStatus` đang `active` hoặc `idle`:

```ts
if (companion.workingStatus !== "active" && companion.workingStatus !== "idle") {
  throw new Error(...); // Companion "training"/"certified"/"maintenance"/"retired" không nhận Task
}
```

Trong lúc xử lý Task: `active/idle → busy` → (xong) `busy → active`.
Nếu Provider lỗi, Companion vẫn được đưa về `active` (không kẹt ở
`busy`) trước khi lỗi được ném tiếp cho caller xử lý.

## 5. Không Companion nào tự chuyển trạng thái của Companion khác

`setWorkingStatus` chỉ được gọi bởi `companion-manager.ts` (khi giao/
hoàn thành Task) hoặc bởi hành động Admin/Owner tường minh (Activate,
đưa vào bảo trì, Retire) — không có cơ chế 1 Companion tự thay đổi
trạng thái Companion khác, giữ đúng nguyên tắc "Companion không được tự
ý mở rộng/thay đổi Workforce" đã khóa từ EPIC 05/06.
