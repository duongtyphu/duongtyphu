# PHASE 4 EPIC 02 — Companion Profile Standard

> Chuẩn hồ sơ bắt buộc cho mọi AI Companion trong `workforce-registry.ts`
> (code thật) — cụ thể hoá `AI_TEAM_PROFILE_STANDARD.md` (Specialist,
> thiết kế) và `docs/companions/research/market-research/PROFILE.md`
> (Sprint R1, 15 mục) thành 19 trường dữ liệu **chạy được**. Không có
> Companion nào trong Registry được thiếu bất kỳ trường nào dưới đây.

## 1. `CompanionRecord` — 19 trường bắt buộc

```ts
type CompanionRecord = {
  employeeId: string;              // "EMP-R001" — mã nhân sự ổn định, không đổi qua các Sprint
  department: DepartmentId;         // 1 trong 7 Department đã khóa (AI_COMPANION_DEPARTMENTS.md)
  position: string;                  // "Market Research Companion"
  mission: string;                    // 1 câu — vì sao Companion này tồn tại
  responsibilities: string[];          // 2-4 trách nhiệm cụ thể
  capability: string[];                 // capabilityId (AI Capability Registry, OPEN_AI_WORKFORCE_PLATFORM.md §3)
  supportedBlueprint: string[];          // missionId (mission-catalog.ts) — rỗng = hỗ trợ chéo
  supportedTasks: string[];               // loại Task cụ thể Companion nhận
  inputContract: string[];                 // tên trường Input, dấu "?" = tuỳ chọn
  outputContract: string[];                 // tên trường Output
  qaChecklist: string[];                     // tiêu chí QA bắt buộc trước khi Output được coi là đạt chuẩn
  evidenceStandard: string[];                 // loại Evidence áp dụng (CAPABILITY_EVIDENCE_FRAMEWORK.md §1)
  portfolioMapping: { primaryCompetencyId: string };
  providerPreference: string;                  // providerId ưu tiên — CHỈ LÀ GỢI Ý, không tự quyết định
  fallbackProvider: string;                      // providerId dự phòng — thử sau providerPreference, trước Mock
  workingStatus: CompanionWorkingStatus;          // Lifecycle — xem COMPANION_LIFECYCLE.md
  trainingStatus: "not_started" | "in_progress" | "completed";
  certificationStatus: "not_certified" | "certified";
  performanceScore: number;                        // 0-100 — trung tính (50) cho tới khi có dữ liệu Task thật
};
```

## 2. Nguyên tắc viết Profile

1. `mission` viết theo 1 câu, không lặp lại Mission Department.
2. `capability`/`supportedTasks` phải cụ thể — không viết chung chung
   ("giỏi viết"). Capability id theo đúng convention
   `<family>.<action>` (vd `writing.draft`, `research.market-analysis`)
   để `ModelRouter` (PHASE 4 EPIC 01) định tuyến đúng theo nhóm.
3. `providerPreference`/`fallbackProvider` là **gợi ý**, không phải chỉ
   thị bắt buộc — `ProviderManager`/`ModelRouter` luôn có quyền chọn
   khác nếu Provider ưu tiên không khả dụng (đúng Product Principle:
   "Companion không phụ thuộc vào bất kỳ hãng AI nào").
4. `evidenceStandard` không được để trống — tối thiểu `Output` +
   `Workspace` (hoặc `Companion Review`) theo ngưỡng tối thiểu đã khóa
   ở `CAPABILITY_EVIDENCE_FRAMEWORK.md`.
5. `performanceScore` khởi tạo `50` (trung tính) cho mọi Companion mới
   — không bịa điểm cao/thấp khi chưa có dữ liệu Task thật.
6. Không Profile nào nêu tên vendor AI cụ thể trong `mission`/
   `responsibilities`/`capability` (AI-Agnostic đã khóa) — tên vendor
   chỉ xuất hiện ở `providerPreference`/`fallbackProvider` dưới dạng
   `providerId` nội bộ (`anthropic`/`openai`/`gemini`/`mock`), là chi
   tiết vận hành server-side, không phải nội dung nghiệp vụ.

## 3. 10 Companion Wave 1 — tóm tắt (chi tiết đầy đủ trong `workforce-registry.ts`; xem `WORKFORCE_REGISTRY.md` §6 cho Wave 2)

| employeeId | Department | Position | Capability | Provider Pref → Fallback |
|---|---|---|---|---|
| EMP-R001 | research-knowledge | Market Research Companion | `research.market-analysis` | anthropic → openai |
| EMP-R002 | research-knowledge | Knowledge Research Companion | `research.knowledge-synthesis` | gemini → anthropic |
| EMP-C001 | content-communication | Writer Companion | `writing.draft` | anthropic → openai |
| EMP-C002 | content-communication | Editor Companion | `writing.edit` | anthropic → openai |
| EMP-B001 | business-strategy | Strategy Companion | `strategy.planning` | anthropic → openai |
| EMP-T001 | technology-automation | Coding Companion | `coding.general` | openai → anthropic |
| EMP-T002 | technology-automation | QA Companion | `qa.review` | openai → anthropic |
| EMP-O001 | office-productivity | Excel Companion | `office.spreadsheet` | openai → anthropic |
| EMP-G001 | personal-growth | Goal Coach Companion | `growth.goal-coaching` | anthropic → openai |
| EMP-G002 | personal-growth | Reflection Coach Companion | `growth.reflection-coaching` | anthropic → openai |

Nội dung đầy đủ (Mission/Responsibilities/Contract/QA Checklist/Evidence
Standard/Portfolio Mapping) kế thừa trực tiếp từ `AI_COMPANION_REGISTRY.md`
và `docs/companions/research/market-research/PROFILE.md` — không phát
minh lại, chỉ hiện thực hoá thành dữ liệu chạy được trong
`src/lib/portal/foundation/workforce-registry.ts`.
