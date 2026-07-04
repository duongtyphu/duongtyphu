# PHASE 3 — EPIC 05: Open AI Workforce Platform

> **Trạng thái**: Kiến trúc mở (design-only). Không có code runtime nào được
> tạo trong Sprint này. Đây là bản thiết kế để mọi AI Provider/Agent tương
> lai có thể **đăng ký (register)** vào hệ thống thay vì bị hard-code từng
> cái một — tiếp nối trực tiếp `AI_AGENT_INTEGRATION_MVP.md` (đã có 1
> Provider Adapter thật: `createWorkforceApiProvider()`, 2 Agent thật:
> Writer/Reviewer) nhưng **không mở rộng số Agent** trong sprint này.

## 0. Mục tiêu & Ràng buộc

**Mục tiêu**: thiết kế kiến trúc mở để AI Workforce có thể mở rộng
**không giới hạn** — mọi AI mới (model mới, provider mới, agent chuyên
môn mới) trong tương lai chỉ cần **đăng ký vào Registry**, Companion tự
biết cách Discover/Evaluate/Benchmark/Recruit/Train/Certify/Deploy/
Monitor/Optimize/Retire nó, không cần sửa code Companion hay UI Workspace.

**Ràng buộc (không được làm ở sprint này)**:
- Không tích hợp hàng loạt AI Provider mới (vẫn chỉ có Workforce API
  Provider từ MVP).
- Không tạo Agent Store/Marketplace công khai cho end-user.
- Không tự động hoá Recruit/Deploy — mọi bước có tác động thật (đưa 1 AI
  vào Workforce đang chạy) đều cần một hành động xác nhận có kiểm soát
  (admin/Companion-gated), không phải cron job tự chạy.
- Không phá kiến trúc đã khóa: `startCompanionWorkspace`, Workspace
  Session/Output store, Event Bus, Portfolio, Capability Engine đều giữ
  nguyên. EPIC 05 là một lớp **registry + lifecycle** nằm cạnh, không đè
  lên các lớp đó.

**Nguyên tắc gốc** (kế thừa từ Sprint B4 "AI-Agnostic Architecture"): tên
vendor AI (Anthropic/OpenAI/Google/...) không bao giờ xuất hiện trong dữ
liệu user-facing. Registry lưu vendor ở tầng server-only; mọi thứ Companion
và UI nhìn thấy là danh/mã nội bộ (`providerId`, `capabilityId`, ...).

---

## 1. Bức tranh tổng thể — 10 năng lực của Companion

Brief yêu cầu Companion có 10 khả năng quản trị AI Workforce. Mỗi khả
năng ánh xạ vào đúng 1 giai đoạn của **AI Lifecycle** (§8) và được phục vụ
bởi 1 hoặc nhiều Registry/Framework (§2–7):

| # | Khả năng Companion | Lifecycle Stage | Registry/Framework phục vụ |
|---|---|---|---|
| 1 | Discover AI | `discovered` | AI Provider Registry |
| 2 | Evaluate AI | `evaluating` | AI Capability Registry + Compatibility Matrix |
| 3 | Benchmark AI | `benchmarking` | AI Benchmark Framework |
| 4 | Recruit AI | `recruited` | AI Workforce Registry |
| 5 | Train AI | `training` | AI Workforce Registry (task history) |
| 6 | Certify AI | `certified` | AI Certification Framework |
| 7 | Deploy AI | `deployed` | AI Deployment Framework |
| 8 | Monitor AI | `active` | AI Workforce Registry (telemetry) |
| 9 | Optimize AI | `active` (re-tune) | AI Benchmark Framework (re-run) |
| 10 | Retire AI | `retired` | AI Lifecycle (terminal state) |

Không có khả năng nào trong 10 khả năng trên được thực hiện **tự động
không kiểm soát** — mỗi transition trong Lifecycle (§8) yêu cầu một
"decision record" (ai/cái gì quyết định chuyển trạng thái, khi nào) để
tránh vi phạm "không cho Agent tự ý mở rộng Workforce".

---

## 2. AI Provider Registry

Danh bạ **nguồn AI** (không phải Agent cụ thể) — mỗi entry mô tả một khả
năng gọi model ở tầng hạ tầng, độc lập với việc nó được dùng để làm gì.

```ts
type AiProviderRegistryEntry = {
  providerId: string;            // mã nội bộ, vd "workforce-api-v1" — KHÔNG chứa tên vendor trong bất kỳ field user-facing nào
  displayName: string;           // tên hiển thị nội bộ, vd "Workforce API Provider" (đã có, từ ai-provider.ts)
  kind: "text-generation" | "text-review" | "embedding" | "vision" | "audio"; // mở rộng dần
  transport: "http-fetch" | "sdk";       // cách gọi — hôm nay chỉ có http-fetch (fetch("/api/ai/workforce"))
  configRequirement: string[];   // tên biến ENV cần có, vd ["ANTHROPIC_API_KEY", "OPENAI_API_KEY"] — không lưu giá trị
  status: "registered" | "unavailable" | "deprecated";
  registeredAt: string;
  execute: AiProvider["execute"]; // tái dùng đúng interface AiProvider đã có (ai-provider.ts) — Registry KHÔNG định nghĩa lại
};
```

**Quan hệ với code đã có**: `AiProvider` (`ai-provider.ts`) là **hợp đồng
thực thi** của 1 provider; `AiProviderRegistryEntry` là **hồ sơ khai báo**
bọc quanh nó. `createWorkforceApiProvider()` hôm nay chính là provider đầu
tiên sẽ được đăng ký với `providerId: "workforce-api-v1"` khi Registry
được cài đặt (Sprint sau, không phải sprint này).

**Cách một Provider mới gia nhập** (không cần sửa Companion):
1. Implement `AiProvider` interface (execute/status/error) — pattern đã
   có sẵn từ `createWorkforceApiProvider()`.
2. Viết một `AiProviderRegistryEntry` mô tả nó.
3. Gọi `registerProvider(entry)` (hàm ghi vào Registry — thiết kế ở
   Sprint cài đặt, không phải sprint thiết kế này).
4. Companion tự thấy Provider mới qua `listProviders()` — không cần sửa
   `WorkspaceMvp.tsx` hay bất kỳ Agent nào.

---

## 3. AI Capability Registry

Danh bạ **năng lực** — mỗi entry mô tả một khả năng chuyên môn cụ thể mà
một AI Agent có thể đảm nhiệm (không phải model, mà là **vai trò**).

```ts
type AiCapabilityRegistryEntry = {
  capabilityId: string;          // vd "writing.draft", "writing.review", "research.summarize"
  label: string;                 // tên hiển thị Vietnamese, vd "Soạn thảo nội dung"
  inputContract: string;         // mô tả schema input tối thiểu Agent cần nhận (tham chiếu tới TS type thật, vd "WriterAgentInput")
  outputContract: string;        // tương tự, vd "WriterAgentResult"
  relatedCompetencyId?: string;  // NỐI với Capability Engine đã có (capability-engine.ts) — vd "AI Writing" — để năng lực AI và năng lực NGƯỜI dùng chung 1 hệ quy chiếu, không tạo taxonomy song song
  maturity: "experimental" | "stable" | "deprecated";
};
```

Ví dụ 2 entry đầu tiên (khớp với 2 Agent MVP đã có, đăng ký hồi cứu —
retro-register, không đổi hành vi runtime):

| capabilityId | label | Agent hiện có đáp ứng |
|---|---|---|
| `writing.draft` | Soạn thảo nội dung | Writer Agent |
| `writing.review` | Rà soát & góp ý nội dung | Reviewer Agent |

**Vì sao tách khỏi Provider Registry**: 1 Provider (1 model) có thể phục
vụ nhiều Capability (model đa năng), và 1 Capability có thể được nhiều
Provider đáp ứng (fallback/so sánh). Trộn 2 khái niệm sẽ khiến
Compatibility Matrix (§4) không biểu diễn được.

---

## 4. AI Compatibility Matrix

Ma trận N×M: **Provider nào đáp ứng được Capability nào, với độ tin cậy
ra sao** — đây là dữ liệu Companion tra cứu để quyết định "nên giao việc
này cho AI nào", KHÔNG phải nơi ra quyết định cuối (quyết định cuối luôn
cần một bước Evaluate/Benchmark thật, không suy diễn từ khai báo).

```ts
type CompatibilityEntry = {
  providerId: string;
  capabilityId: string;
  supportLevel: "untested" | "partial" | "full";
  lastEvaluatedAt?: string;       // rỗng = chưa từng Evaluate thật — Companion KHÔNG được coi "full" nếu chưa evaluate
  evaluationNotes?: string;
};
```

Quy tắc cứng: `supportLevel` mặc định là `"untested"` khi một cặp
Provider×Capability được đăng ký lần đầu. Chỉ chuyển sang `"partial"`/
`"full"` sau khi có kết quả thật từ AI Benchmark Framework (§5) —
matrix không bao giờ được điền tay để "cho đẹp".

---

## 5. AI Benchmark Framework

Cách đo một Provider có làm tốt một Capability hay không, **bằng dữ liệu
thật** (không phải điểm số bịa).

```ts
type BenchmarkCase = {
  capabilityId: string;
  caseId: string;
  input: unknown;                 // input mẫu thật, khớp inputContract của Capability
  expectedCriteria: string[];     // tiêu chí chấm — mô tả bằng ngôn ngữ, không phải so khớp chuỗi cứng (output AI có tính biến thiên)
};

type BenchmarkRun = {
  runId: string;
  providerId: string;
  capabilityId: string;
  caseId: string;
  rawOutput: unknown;              // output thật AI trả về — LƯU LẠI, không chỉ lưu điểm số, để con người kiểm chứng lại được
  score: number;                    // 0-5, người chấm (Reviewer Agent CÓ THỂ hỗ trợ chấm sơ bộ, nhưng Certification ở §6 vẫn cần xác nhận người)
  scoredBy: "human" | "reviewer-agent-assist";
  runAt: string;
};
```

**Nguồn Benchmark Case đầu tiên**: tái dùng chính test case MVP đã có
(`agent-integration-mvp.test.ts`'s Facebook-post goal) làm 1
`BenchmarkCase` mẫu cho `capabilityId: "writing.draft"` — không tạo dữ
liệu benchmark giả mới, dùng lại bằng chứng thật đã kiểm chứng.

**Liên kết Compatibility Matrix**: mỗi `BenchmarkRun` đạt ngưỡng (vd
score ≥ 4/5, quy tắc cụ thể để lại cho Sprint cài đặt) sẽ được phép cập
nhật `CompatibilityEntry.supportLevel` — đây là **nơi duy nhất** được
phép ghi vào Compatibility Matrix.

---

## 6. AI Certification Framework

Cổng xác nhận cuối trước khi một Provider×Capability được phép **Deploy**
vào Workforce thật. Đây chính là nơi cụ thể hoá nguyên tắc "AI Agent
không được tự ý mở rộng — User/Admin luôn là người phê duyệt cuối" (đã
áp dụng ở tầng Output/Approval trong MVP) — áp dụng lại ở tầng
Provider/Capability.

```ts
type CertificationRecord = {
  certificationId: string;
  providerId: string;
  capabilityId: string;
  basedOnBenchmarkRunIds: string[];  // certification KHÔNG được tồn tại nếu không trỏ về ít nhất 1 BenchmarkRun thật
  decidedBy: "admin";                 // luôn là người, không bao giờ "system"/"agent"
  decision: "certified" | "rejected";
  reason: string;
  decidedAt: string;
  expiresAt?: string;                 // certification có hạn — model/provider có thể suy giảm chất lượng theo thời gian, không phải chứng chỉ vĩnh viễn
};
```

Quy tắc: một cặp Provider×Capability **không đủ điều kiện Deploy** (§7)
nếu không có `CertificationRecord` với `decision: "certified"` và chưa
`expiresAt`.

---

## 7. AI Deployment Framework

Đưa một Provider×Capability đã certified vào trạng thái **có thể được
Companion thật sự gọi tới** trong Workspace.

```ts
type DeploymentRecord = {
  deploymentId: string;
  providerId: string;
  capabilityId: string;
  certificationId: string;         // bắt buộc trỏ tới 1 Certification còn hiệu lực
  scope: "internal-test" | "workforce-production"; // deploy có thể giới hạn phạm vi trước khi ra production toàn bộ
  deployedBy: "admin";
  deployedAt: string;
  status: "active" | "paused" | "rolled_back";
};
```

**Cách Deploy nối vào Workforce thật**: khi `status: "active"`, Companion
tra `DeploymentRecord` (qua `capabilityId`) thay vì gọi thẳng
`createWorkforceApiProvider()` như MVP đang làm — đây là điểm thay thế
duy nhất trong toàn bộ thiết kế mà code chạy thật (Sprint cài đặt) sẽ
đụng tới `WorkspaceMvp.tsx`/`workspace-session-store.ts`, và nó là một
phép thay thế 1-1 (gọi qua registry thay vì gọi trực tiếp), không đổi
luồng Output/Review/Approval/Portfolio đã khóa.

**Rollback**: `status: "rolled_back"` là lối thoát an toàn — Companion
phát hiện degrade (qua Monitor, §8) có thể đề xuất rollback, nhưng
chuyển trạng thái vẫn do admin xác nhận (không tự động).

---

## 8. AI Lifecycle

Vòng đời đầy đủ của **một cặp Provider×Capability**, hợp nhất tất cả
Registry/Framework ở trên thành 1 state machine tuyến tính (không có
bước nào được bỏ qua):

```
discovered
   │  (AI Provider Registry: registerProvider + registerCapability)
   ▼
evaluating
   │  (AI Capability Registry + Compatibility Matrix: supportLevel bắt đầu "untested")
   ▼
benchmarking
   │  (AI Benchmark Framework: chạy BenchmarkCase thật, ghi BenchmarkRun)
   ▼
certified  ──────────► rejected (terminal — quay lại "evaluating" nếu muốn thử lại sau cải tiến)
   │  (AI Certification Framework: admin quyết định dựa trên BenchmarkRun)
   ▼
deployed
   │  (AI Deployment Framework: DeploymentRecord, status "active")
   ▼
active  ◄──────────────┐
   │  (Monitor: Workforce Registry ghi telemetry mỗi lần Agent chạy thật)
   │  (Optimize: phát hiện degrade → quay lại "benchmarking" để re-certify, KHÔNG tự chuyển active→active ngầm)
   └──────────────────►┘
   ▼
retired
   (Admin quyết định — deployment status "rolled_back" vĩnh viễn, capability rời khỏi danh sách Companion có thể chọn)
```

Mỗi mũi tên là một **transition event** ghi vào Growth Event Bus đã có
(tái dùng, không tạo hệ thống log song song) — 5 event type mới cần
thêm khi cài đặt thật (không thêm ở sprint thiết kế này để tránh vi phạm
"chỉ xây kiến trúc, không tích hợp"):

- `AI_PROVIDER_DISCOVERED`
- `AI_CAPABILITY_BENCHMARKED`
- `AI_CAPABILITY_CERTIFIED`
- `AI_CAPABILITY_DEPLOYED`
- `AI_CAPABILITY_RETIRED`

(Đặt tên theo đúng convention `GrowthEventType` đã có — SCREAMING_SNAKE
mô tả hành động hoàn tất — để khi cài đặt thật chỉ cần nối vào
`GROWTH_EVENT_CONSUMERS` như đã làm với 5 event của MVP.)

---

## 9. AI Workforce Registry

Registry tổng hợp — góc nhìn "đội ngũ AI đang hoạt động" mà Companion và
Admin dùng để quản trị, tổng hợp từ 4 Registry/Framework ở trên (không
lưu dữ liệu trùng lặp, chỉ là view tổng hợp theo `providerId`+`capabilityId`):

```ts
type WorkforceRosterEntry = {
  providerId: string;
  capabilityId: string;
  lifecycleStage: "discovered" | "evaluating" | "benchmarking" | "certified" | "rejected" | "deployed" | "active" | "retired";
  currentDeployment?: DeploymentRecord;
  currentCertification?: CertificationRecord;
  latestBenchmarkScore?: number;
  taskRunCount: number;            // Monitor: đếm số lần thật sự được gọi (nối agent-run-store.ts đã có, mở rộng agentRole từ chuỗi cố định "Writer Agent"|"Reviewer Agent" thành tra cứu theo capabilityId)
  lastActiveAt?: string;
};

function getWorkforceRoster(): WorkforceRosterEntry[]  // hàm đọc-tổng-hợp, không ghi
```

**Quan hệ với `agent-run-store.ts` đã có**: hôm nay `AgentRole` là union
cố định 2 giá trị (`"Writer Agent" | "Reviewer Agent"`). Khi Registry
được cài đặt thật (Sprint sau), `AgentRunRecord.agentRole` sẽ đổi từ
union cố định sang tra `capabilityId` trong Capability Registry — đây là
**thay đổi duy nhất cần thiết** ở tầng code hiện có để mở khóa "không
giới hạn số Agent"; không đổi cấu trúc Event/Approval/Portfolio.

---

## 10. Đăng ký AI mới — quy trình 1 cửa

Tổng hợp lại: khi có 1 AI mới (model mới, hoặc 1 Agent chuyên môn mới)
muốn gia nhập AI Workforce, toàn bộ việc cần làm là:

1. Đăng ký **Provider** (nếu là model/nguồn AI mới) vào AI Provider
   Registry — không đụng code Companion.
2. Đăng ký **Capability** (nếu là vai trò mới) vào AI Capability
   Registry, có `relatedCompetencyId` nối về Capability Engine của
   người dùng.
3. Compatibility Matrix tự tạo entry `"untested"` cho cặp mới.
4. Chạy Benchmark thật → có `BenchmarkRun`.
5. Admin Certify dựa trên Benchmark thật.
6. Admin Deploy → Companion thấy `"active"` trong Workforce Roster,
   tự động có thể giao việc thuộc `capabilityId` đó — **không cần sửa
   `WorkspaceMvp.tsx`, không cần sửa Writer/Reviewer Agent, không cần
   sửa route `/api/ai/workforce`.**

Đây chính là "mọi AI mới chỉ cần đăng ký vào Registry là Companion có thể
quản lý" — không có bước nào trong quy trình trên yêu cầu sửa code
Workspace/Companion hiện có.

---

## 11. Việc KHÔNG làm ở Sprint này (nhắc lại rõ)

- Không cài đặt bất kỳ bảng dữ liệu/localStorage key nào cho các type ở
  trên — toàn bộ type trong tài liệu này là **thiết kế**, chưa phải code
  chạy được.
- Không thêm Provider/Agent thứ 3.
- Không đổi `AgentRole` union hiện có trong `agent-run-store.ts`.
- Không thêm event type mới vào `GrowthEventType` (danh sách 5 event ở
  §8 là đề xuất cho Sprint cài đặt, chưa thêm vào `data-model.ts`).
- Không tạo UI Admin cho Registry.

## 12. Sprint cài đặt tiếp theo (đề xuất, không phải quyết định)

Khi được yêu cầu cài đặt (không phải sprint này), thứ tự an toàn nhất
theo đúng nguyên tắc "additive, không phá kiến trúc đã khóa":

1. AI Provider Registry + AI Capability Registry (thuần dữ liệu, không
   đổi hành vi runtime — chỉ mô tả lại 1 Provider + 2 Capability đã có).
2. Compatibility Matrix + Benchmark Framework (đọc dữ liệu MVP đã có làm
   benchmark case đầu tiên).
3. Certification + Deployment Framework (quyết định admin thật, chưa
   nối vào runtime).
4. Nối `DeploymentRecord` vào `workspace-session-store.ts` thay thế lời
   gọi trực tiếp `createWorkforceApiProvider()` — bước duy nhất chạm
   runtime, thực hiện sau cùng khi 3 bước trên đã kiểm chứng.
