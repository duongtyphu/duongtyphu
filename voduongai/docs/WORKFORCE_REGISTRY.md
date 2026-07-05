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

## 7. Wave 3 (Sprint 002 "Complete Core AI Companion Team") — 30/30 hoàn tất

10 Companion cuối cùng, đúng danh sách đã khóa ở `AI_COMPANION_REGISTRY.md`
— không thêm Companion nào ngoài danh sách:

| employeeId | Department | Position | Capability | Provider Pref → Fallback |
|---|---|---|---|---|
| EMP-R005 | research-knowledge | Customer Research Companion | `research.customer-insight` | gemini → anthropic |
| EMP-C005 | content-communication | Translator Companion | `writing.translation` | anthropic → openai |
| EMP-B004 | business-strategy | Partnership Companion | `business.partnership` | anthropic → openai |
| EMP-D002 | creative-design | Presentation Companion | `design.presentation` | openai → anthropic |
| EMP-D003 | creative-design | Video Companion | `design.video-script` | openai → anthropic |
| EMP-D004 | creative-design | Brand Companion | `design.brand-consistency` | openai → anthropic |
| EMP-T004 | technology-automation | Integration Companion | `automation.integration` | openai → anthropic |
| EMP-O003 | office-productivity | Word Companion | `office.document` | openai → anthropic |
| EMP-O004 | office-productivity | PowerPoint Companion | `office.presentation` | openai → anthropic |
| EMP-O005 | office-productivity | Report Companion | `office.report` | openai → anthropic |

`WORKFORCE_CATALOG = [...WAVE1..., ...WAVE2..., ...WAVE3_COMPANION_CATALOG]`
— **30/30 Companion đã thiết kế ở `AI_COMPANION_REGISTRY.md` nay đều có
runtime thật, đủ 7/7 Department hoàn chỉnh** (Research 5, Content 5,
Business 4, Creative 4, Technology 4, Office 5, Growth 3).
`listCompanions()`/`activateWave1Companions()` đọc/activate cả 3 Wave
cùng lúc (hàm giữ nguyên tên cũ để không đổi API).

## 8. Output Contract (chuẩn bị cho Workspace Integration, chưa triển khai)

Mỗi `CompanionRecord` có thêm `outputType: OutputType` (kiểu đã khóa ở
`workspace-session-store.ts`, Kernel không đổi) — `companion-manager.ts`
export `toOutputContract(companion, result)` trả về
`{ employeeId, type, content }` sẵn sàng truyền thẳng vào
`saveOutputVersion(sessionId, { type, content })` ở Sprint sau. Sprint
này **chỉ chuẩn hoá interface**, không gọi `saveOutputVersion`.

## 9. Known Limitations

1. Overlay trạng thái lưu `localStorage` (client-side, per-browser) —
   không đồng bộ đa thiết bị/đa người dùng trong sprint này (giống mọi
   Foundation Data Layer khác trước Sprint chuyển sang Supabase thật).
2. Một số Companion (Presentation/PowerPoint/Video/Automation/
   Integration/Brand/...) chưa có `OutputType` khớp hoàn hảo trong 9
   giá trị đã khóa (`word`/`excel`/`prompt`/`markdown`/`pdf`/`image`/
   `link`/`code`/`landing_page`) — dùng `"markdown"` làm xấp xỉ gần
   nhất, không thêm giá trị `OutputType` mới (Kernel không đổi).
3. `toOutputContract()` chưa được gọi ở bất kỳ đâu ngoài test — nối vào
   `saveOutputVersion()` thật (Workspace Integration) là việc của Sprint
   sau, không thuộc phạm vi Sprint 002.
