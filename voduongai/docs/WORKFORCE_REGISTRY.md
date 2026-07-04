# PHASE 4 EPIC 02 — Workforce Registry (code thật)

> Registry runtime — `src/lib/portal/foundation/workforce-registry.ts`.
> Khác `docs/AI_WORKFORCE_REGISTRY.md` (EPIC 05, thiết kế roster tĩnh
> dạng bảng Markdown) — file này mô tả **implementation thật đang chạy**.

## 1. Nguyên tắc: Companion chỉ ĐỌC Registry, không hard-code

Không có UI/Companion Manager nào được viết cứng danh sách 10 Companion
trong logic điều phối — mọi nơi cần biết "Workforce có ai" đều gọi:

```ts
listCompanions(): CompanionRecord[]
getCompanion(employeeId: string): CompanionRecord | undefined
listByDepartment(department: DepartmentId): CompanionRecord[]
```

Thêm Companion #11 trở đi (Wave 2) chỉ cần thêm 1 entry vào
`WAVE1_COMPANION_CATALOG` (đổi tên thành catalog chung khi cài Wave 2) —
không sửa `companion-manager.ts`, không sửa UI đọc Registry.

## 2. Tách "định nghĩa tĩnh" khỏi "trạng thái động"

```
WAVE1_COMPANION_CATALOG (module-level, bất biến)
   — Employee ID/Department/Position/Mission/.../providerPreference/fallbackProvider

        +

localStorage overlay ("vdai_workforce_companion_status")
   — workingStatus/performanceScore (MUTABLE — thay đổi khi Activate/giao Task)

        =

listCompanions() — merge 2 nguồn, trả về CompanionRecord đầy đủ
```

Pattern này giống hệt cách `mission-catalog.ts` (tĩnh) tách khỏi
`workspace-session-store.ts` (động, localStorage) — không tạo cơ chế
lưu trữ song song mới.

## 3. Ví dụ tra cứu (đúng ví dụ trong brief)

```
Research
  ↓
Market Research Companion (EMP-R001)
  ↓
Provider Preference: anthropic (Claude)
  ↓
Fallback: openai
  ↓
Mock (nếu cả 2 đều không khả dụng — ProviderManager tự quyết định, không phải Companion)
```

```ts
const marketResearch = getCompanion("EMP-R001");
// marketResearch.providerPreference === "anthropic"
// marketResearch.fallbackProvider === "openai"
// Provider thật chạy khi có Task: xem companion-manager.ts -> assignTask()
```

## 4. API đầy đủ

| Hàm | Mô tả |
|---|---|
| `listCompanions()` | Toàn bộ 10 Companion, đã merge trạng thái |
| `getCompanion(employeeId)` | 1 Companion cụ thể |
| `listByDepartment(department)` | Lọc theo 1 trong 7 Department |
| `setWorkingStatus(employeeId, next)` | Chuyển trạng thái — validate theo `COMPANION_LIFECYCLE.md`, ném lỗi nếu chuyển sai thứ tự |
| `activateWave1Companions()` | Activate toàn bộ Wave 1 (`inactive → training → certified → active`), phát `COMPANION_ACTIVATED` |

## 5. Không tạo Registry song song

`AI Provider Registry`/`AI Capability Registry` (PHASE 4 EPIC 01,
`src/ai/providers/registry.ts`) mô tả **hạ tầng gọi AI** — Workforce
Registry mô tả **nhân sự AI (vai trò nghiệp vụ)**. 2 Registry độc lập,
nối nhau qua `capability`/`providerPreference` (chuỗi id), không trộn
dữ liệu.

## 6. Known Limitations

1. Overlay trạng thái lưu `localStorage` (client-side, per-browser) —
   không đồng bộ đa thiết bị/đa người dùng trong sprint này (giống mọi
   Foundation Data Layer khác trước Sprint chuyển sang Supabase thật).
2. Chỉ Wave 1 (10 Companion) — Wave 2/3 (20 Companion còn lại trong
   30-Companion Team đã thiết kế ở `AI_COMPANION_REGISTRY.md`) chưa có
   trong catalog runtime, thuộc phạm vi Sprint sau.
