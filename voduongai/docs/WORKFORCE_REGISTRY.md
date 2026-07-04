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

## 6. Wave 2 (tiếp nối, cùng Sprint continuation)

10 Companion tiếp theo, chạm đủ 7 Department (Creative & Design lần đầu
có Companion chạy thật):

| employeeId | Department | Position | Capability | Provider Pref → Fallback |
|---|---|---|---|---|
| EMP-R003 | research-knowledge | Fact Checker Companion | `research.fact-checking` | anthropic → openai |
| EMP-R004 | research-knowledge | Trend Scout Companion | `research.trend-scouting` | gemini → anthropic |
| EMP-C003 | content-communication | Copywriter Companion | `writing.copywriting` | anthropic → openai |
| EMP-C004 | content-communication | SEO Companion | `writing.seo` | anthropic → openai |
| EMP-B002 | business-strategy | Sales Companion | `business.sales` | anthropic → openai |
| EMP-B003 | business-strategy | Finance Companion | `business.finance` | anthropic → openai |
| EMP-D001 | creative-design | Designer Companion | `design.visual` | openai → anthropic |
| EMP-T003 | technology-automation | Automation Companion | `automation.workflow` | openai → anthropic |
| EMP-O002 | office-productivity | Dashboard Companion | `office.dashboard` | openai → anthropic |
| EMP-G003 | personal-growth | Learning Coach Companion | `growth.learning-coaching` | anthropic → openai |

`WORKFORCE_CATALOG = [...WAVE1_COMPANION_CATALOG, ...WAVE2_COMPANION_CATALOG]`
— `listCompanions()`/`activateWave1Companions()` đọc/activate cả 2 Wave
cùng lúc (hàm giữ nguyên tên cũ để không đổi API, chạy cho toàn Registry).

Tổng 20/30 Companion đã thiết kế ở `AI_COMPANION_REGISTRY.md` nay đã có
runtime thật — đủ 7/7 Department.

## 7. Known Limitations

1. Overlay trạng thái lưu `localStorage` (client-side, per-browser) —
   không đồng bộ đa thiết bị/đa người dùng trong sprint này (giống mọi
   Foundation Data Layer khác trước Sprint chuyển sang Supabase thật).
2. Còn đúng 10 Companion cho Wave 3 (đã thiết kế ở `AI_COMPANION_REGISTRY.md`,
   chưa có runtime): Customer Research Specialist (Research), Translator
   (Content), Partnership Specialist (Business), Presentation Specialist/
   Video Specialist/Brand Specialist (Creative — 3), Integration
   Specialist (Technology), Word Specialist/PowerPoint Specialist/Report
   Specialist (Office — 3). Growth Department đã đủ 3/3 từ Wave 1+2,
   không còn Companion Growth nào cho Wave 3.
