# Foundation Data Layer

Sprint B1 — sprint đầu tiên của EPIC 03 sau khi Blueprint được khóa
(`docs/EPIC03_BLUEPRINT_LOCK.md`). Tài liệu kiến trúc dữ liệu — **không
code, không sửa UI, không AI Agent, không Dashboard, không Mission mới,
không đổi Menu, không Placeholder/Demo**. Mục tiêu duy nhất: khóa Schema
+ Relationship + Event Bus + Ownership để Sprint B2 trở đi implement thẳng,
không cần thiết kế lại dữ liệu.

**Product Principle**: Dữ liệu chỉ có một nguồn sự thật (Single Source of
Truth). Mọi module đều dùng chung dữ liệu. Không module nào tự quản lý dữ
liệu riêng. Companion, Workspace, Academy, Knowledge Library, Portfolio và
Growth chỉ là các góc nhìn khác nhau của cùng một hành trình học tập.

Tài liệu này **áp dụng trực tiếp** các đề xuất chuẩn hóa tên gọi đã thống
nhất ở `EPIC03_BLUEPRINT_LOCK.md` mục 4.1 (`CompanionReview`,
`PortfolioItem`, `CapabilityProfile`/`CapabilityRecord`, `UnlockRule` vs
`UnlockRecord`) — không đặt tên mới khác đi.

---

## 1. Architecture

```
                    ┌─────────────────────────────┐
                    │   Universal Context (mục 4)  │
                    └──────────────┬───────────────┘
                                   ↓
   Học viện AI ──┐                                ┌── Thư viện tri thức
                 │                                │
   AI Workspace ─┼──────────► Companion ◄─────────┤
                 │        (Orchestrator duy nhất)  │
                 └────────────────┬────────────────┘
                                  ↓
                        WorkspaceSession (mục 5)
                                  ↓
                    Output → OutputVersion (mục 6)
                                  ↓
                  Review → Reflection → PortfolioItem (mục 7)
                                  ↓
                        GrowthEvent (mục 8 — Backbone)
                            ↓          ↓
                CapabilityRecord   ImpactRecord (mục 9, 10)
                            ↓
                       UnlockRecord
                            ↓
              Mission/Journey tiếp theo (quay lại Học viện AI/AI Workspace)
```

Nguyên tắc kiến trúc (bắt buộc, không đổi trong Sprint B):
1. **Một nguồn sự thật** — mọi module đọc/ghi qua đúng model đã định
   nghĩa ở mục 2, không tạo bảng/localStorage-key riêng song song.
2. **Companion là điểm hội tụ duy nhất** — không module nào tự xử lý
   thực hành riêng (đã xác lập từ Sprint 02, khẳng định lại ở đây).
3. **Event Bus, không gọi trực tiếp** — module downstream (Capability/
   Impact/Nhật ký/Hành trình/Khu vườn) chỉ đọc `GrowthEvent`, không được
   module upstream (Workspace) gọi hàm trực tiếp để cập nhật (mục 11, 12).

---

## 2. Shared Models

23 model dùng chung toàn Portal — không model nào trùng lặp:

```
User
   ↓
CompetencyProfile
   ↓
Journey
   ↓
Collection
   ↓
Mission
   ↓
LearningAsset
   ↓
KnowledgeResource
   ↓
PromptPack
   ↓
TemplatePack
   ↓
WorkspaceSession
   ↓
WorkspaceStep
   ↓
CompanionConversation
   ↓
AgentExecution
   ↓
Output
   ↓
OutputVersion
   ↓
Reflection
   ↓
CompanionReview
   ↓
PortfolioItem
   ↓
GrowthEvent
   ↓
CapabilityRecord
   ↓
ImpactRecord
   ↓
UnlockRecord
```

| Model | Mô tả ngắn | Nguồn định nghĩa gốc (A1–A9) |
|---|---|---|
| `User` | Định danh người học | Mới ở A8/A9, hiện repo dùng Supabase Auth |
| `CompetencyProfile` | Trạng thái năng lực tổng hợp của 1 User theo mọi Competency | Gộp từ `CapabilityProfile` (A8) — đổi tên `CompetencyProfile` để tránh trùng với `CapabilityRecord` (mục 9) |
| `Journey` | Khung hành trình năng lực | A3 mục 3 |
| `Collection` | Nhóm Mission theo chủ đề con | A3 mục 4 |
| `Mission` | Đơn vị công việc thật | A1 mục 3 |
| `LearningAsset` | Nội dung + thực hành lấp đầy Mission | A2 mục 15 |
| `KnowledgeResource` | Checklist/Framework/Case Study/SOP dùng chung (đổi tên từ `Resource` ở A8 để rõ nghĩa hơn) | A2 mục 6, A8 mục 5 |
| `PromptPack` | Bộ Prompt thực hành | A2 mục 6, A8 mục 5 |
| `TemplatePack` | File mẫu dùng ngay (đổi tên từ `Template` ở A8 cho nhất quán với `PromptPack`) | A2 mục 6 |
| `WorkspaceSession` | Một lần thực hành cụ thể | A8 mục 5, chi tiết ở mục 5 |
| `WorkspaceStep` | Từng bước trong Curriculum Flow của 1 Session | A8 mục 5, A4 mục 3 |
| `CompanionConversation` | Lịch sử tương tác Companion trong 1 Session (đổi tên từ "coachingLog" ở A4 mục 19 cho rõ là 1 model) | A4 mục 19 |
| `AgentExecution` | 1 lần Companion điều phối AI Agent (đổi tên từ `AgentRun` ở A8 cho rõ nghĩa) | A2 mục 9, A8 mục 5 |
| `Output` | Kết quả thật đã tạo | A2 mục 10, chi tiết ở mục 6 |
| `OutputVersion` | Lịch sử chỉnh sửa 1 Output | A8 mục 5 |
| `Reflection` | Người học tự nhận biết | A2 mục 12 |
| `CompanionReview` | Nhận xét của Companion (tên chuẩn hóa theo A9 mục 4.1) | A2 mục 11, A9 |
| `PortfolioItem` | 1 Output được lưu vào Portfolio (tên chuẩn hóa theo A9 mục 4.1) | A8 mục 5, chi tiết ở mục 7 |
| `GrowthEvent` | Sự kiện trưởng thành — Backbone | A8 mục 9, chi tiết ở mục 8 |
| `CapabilityRecord` | 1 lần cập nhật năng lực (khác `CompetencyProfile` — đây là log từng lần, `CompetencyProfile` là trạng thái hiện tại) | A5, chi tiết ở mục 9 |
| `ImpactRecord` | 1 lần đo AI Impact (tên chuẩn hóa theo A9 mục 4.1 — gộp các model con ở A6) | A6, A8, chi tiết ở mục 10 |
| `UnlockRecord` | 1 lần Mission/Journey được mở cho 1 User (tách khỏi `UnlockRule` — xem mục 3) | A9 mục 4.1, chi tiết ở mục 3 |

**Lưu ý đặt tên khác với A8 gốc** (để giải quyết Gap Analysis ở A9): `Resource`→`KnowledgeResource`, `Template`→`TemplatePack`, `AgentRun`→`AgentExecution`, `PortfolioEntry`→`PortfolioItem`, `Capability`→`CompetencyProfile` (trạng thái) tách khỏi `CapabilityRecord` (log sự kiện), `ImpactRecord` giữ nguyên làm bảng chính — đây là **chuẩn hóa cuối cùng**, Sprint B2 trở đi dùng đúng tên trong bảng trên, không dùng lại tên cũ ở A1–A8.

---

## 3. Relationship

```
Journey        1 ──── N   Collection
Collection     1 ──── N   Mission
Mission        1 ──── N   LearningAsset
Mission        1 ──── N   WorkspaceSession    // nhiều người/nhiều lần thực hành cùng 1 Mission
LearningAsset  N ──── N   KnowledgeResource    // 1 Asset dùng nhiều Resource, 1 Resource phục vụ nhiều Asset
LearningAsset  N ──── N   PromptPack
LearningAsset  N ──── N   TemplatePack
WorkspaceSession 1 ── N   WorkspaceStep
WorkspaceSession 1 ── N   CompanionConversation
WorkspaceSession 1 ── N   AgentExecution
WorkspaceSession 1 ── N   Output
Output         1 ──── N   OutputVersion
Output         1 ──── 1   CompanionReview        // review mới nhất; lịch sử review cũ nằm trong OutputVersion nếu cần
Output         1 ──── N   Reflection
Output         1 ──── 0..1 PortfolioItem          // chỉ Output đạt chuẩn mới có PortfolioItem
PortfolioItem  N ──── 1   CompetencyProfile         // mỗi PortfolioItem gắn 1 Competency
GrowthEvent    N ──── 1   User, 0..1 Mission, 0..1 WorkspaceSession, 0..1 Output
GrowthEvent    1 ──── 0..1 CapabilityRecord           // 1 event có thể sinh 1 log Capability
GrowthEvent    1 ──── 0..1 ImpactRecord                // 1 event có thể sinh 1 log Impact
CapabilityRecord N ── 1   CompetencyProfile              // nhiều log cộng dồn thành 1 trạng thái hiện tại
UnlockRule     1 ──── N   UnlockRecord                     // 1 rule định nghĩa có thể tạo nhiều bản ghi mở khóa (nhiều User)
UnlockRecord   N ──── 1   Mission | Journey                  // Mission/Journey nào được mở
```

Nguyên tắc: mọi quan hệ N–N (Asset↔Resource/Prompt/Template) dùng bảng nối
(join table), không nhúng dữ liệu trùng lặp — nhất quán với nguyên tắc tái
sử dụng đã nêu ở Mission Library Standard mục 12.

---

## 4. Universal Context

Context chuẩn — **mọi CTA truyền đúng field này, không tự thêm field
riêng**:

```
UniversalContext {
  userId
  module              // PortalModule hiện có (academy | khong-gian-ai | ckos | ...)
  source
  routeFrom
  journeyId?
  collectionId?
  missionId?
  assetId?
  resourceId?
  promptId?
  templateId?
  userGoal?
  expectedOutput?
  difficulty?
  currentCapability?    // MỚI so với A8 mục 6 — snapshot CompetencyProfile tại thời điểm bấm CTA
  currentJourney?        // MỚI — journeyId người dùng đang đi dở, để Companion biết ngữ cảnh rộng hơn Mission đơn lẻ
  timestamp
}
```

Companion **luôn nhận được** Context này khi bất kỳ `WorkspaceSession`
nào bắt đầu — đây là input duy nhất Companion dùng để quyết định
Coaching/Agent điều phối, không đọc trực tiếp dữ liệu khác ngoài Context +
`CompetencyProfile`/`GrowthEvent` lịch sử của User đó.

`currentCapability`/`currentJourney` là 2 field mới so với Universal
Context System đã định nghĩa ở A8 mục 6 (7 field: `journeyId/collectionId/
missionId/assetId/resourceId/promptId/templateId/difficulty`) — bổ sung
để Companion Personalization (AI Curriculum Standard mục 17) có đủ dữ
liệu ngay từ Before Assessment, không phải tự truy vấn thêm.

---

## 5. Workspace Session Model

```
WorkspaceSession {
  sessionId          // workspace_xxx
  missionId
  userId
  context             // UniversalContext tại thời điểm bắt đầu
  status               // start | paused | resumed | finished
  startedAt
  pausedAt?
  resumedAt?
  finishedAt?
  history[]              // toàn bộ WorkspaceStep đã qua, không xóa khi pause/resume
  currentStep             // bước hiện tại trong Curriculum Flow 13 bước (AI Curriculum Standard mục 3)
  currentAgent?            // AgentExecution đang chạy, nếu có
  currentOutput?            // Output đang được chỉnh sửa (bản nháp mới nhất)
}
```

Nguyên tắc: **Session có thể Pause/Resume** — đây là điểm mới so với A8
(vốn coi WorkspaceSession là tuyến tính từ đầu tới cuối). Pause không xóa
`history[]` — người dùng quay lại đúng `currentStep` đã dừng, không phải
bắt đầu lại từ Assessment. Đây là điều kiện để giải quyết gap "Workspace
chỉ giữ 1 context hiện tại, không có lịch sử nhiều phiên" đã ghi ở
`SMART_AI_CURRICULUM_AUDIT.md`.

---

## 6. Output Model

Output **không chỉ là file**:

```
Output {
  outputId            // output_xxx
  sessionId
  missionId
  journeyId?
  type                 // Document | Spreadsheet | Presentation | ... (Learning Asset Standard mục 10)
  content/fileRef       // artefact thật
  metadata               // vd { wordCount, dimensions, duration } tùy loại Output
  currentVersion
  review                 // CompanionReview mới nhất (1-1, xem mục 3)
  reflection[]             // Reflection gắn với Output này
  impact                    // ImpactRecord liên quan (nếu đã đo)
  createdAt
}
```

`OutputVersion` lưu lịch sử:

```
OutputVersion {
  versionId
  outputId
  versionNumber        // v1, v2, v3...
  content/fileRef
  editedAt
  editReason?           // vd "Cải tiến cùng Companion" (Universal CTA Standard, A8 mục 7)
}
```

Nguyên tắc: `Output.content/fileRef` luôn trỏ tới `OutputVersion` mới
nhất — không lưu trùng nội dung ở cả `Output` và `OutputVersion` mới
nhất, `Output` chỉ giữ tham chiếu.

---

## 7. Portfolio Model

Portfolio **không lưu file** — Portfolio lưu tham chiếu + metadata:

```
PortfolioItem {
  portfolioItemId
  userId
  outputId              // tham chiếu Output thật, không copy nội dung
  outputVersionId         // version cụ thể được đưa vào Portfolio
  competencyId
  journeyId?
  tags[]                   // vd "F&B", "B2B", tự gắn hoặc suy ra từ Mission category
  businessValue?             // từ ImpactRecord liên quan, nếu có
  addedAt
}
```

Nguyên tắc: `PortfolioItem` được tạo **tự động** khi `Output` đạt điều
kiện (có `CompanionReview` + `Reflection`, theo A8 mục 8) — không có bước
"người dùng tự tay thêm vào Portfolio" tách rời khỏi luồng Output.

---

## 8. Growth Event Model — Backbone

`GrowthEvent` là **Backbone** — mọi module downstream chỉ đọc Event, không
gọi hàm trực tiếp lẫn nhau (mục 11, 12):

```
GrowthEvent {
  eventId
  eventType         // xem Event Bus Design, mục 12
  userId
  missionId?
  workspaceSessionId?
  outputId?
  capabilityRecordId?
  impactRecordId?
  visibility          // danh sách module được phép đọc event này (mặc định: tất cả, trừ khi event nhạy cảm)
  modulesUsing[]        // Nhật ký học tập | Hành trình của tôi | Khu vườn của bạn | Capability Engine | Impact Engine | Dashboard
  timestamp
}
```

Nguyên tắc: mỗi `eventType` phải khai báo trước `modulesUsing[]` tối
thiểu 3 module (đối chiếu A8 mục 9, A9 mục 5) — nếu một `eventType` mới
chỉ có 1-2 module dùng, cần xem lại có thực sự cần Event riêng hay gộp vào
`eventType` đã có.

---

## 9. Capability Model

Capability **không điểm số**:

```
CapabilityRecord {          // 1 log — mỗi lần năng lực có tín hiệu thay đổi
  recordId
  userId
  competencyId
  triggerEventId       // GrowthEvent nào sinh ra log này
  evidence {            // Evidence Framework (Capability Evidence Framework mục 1)
    outputId?
    reflectionId?
    reviewId?
    reused?             // boolean — Output này có được dùng lại/làm nền cho Output khác không
  }
  levelBefore, levelAfter   // theo thang 4 hoặc 7 mức (Assessment & Capability Standard mục 9)
  recordedAt
}

CompetencyProfile {         // trạng thái hiện tại, tổng hợp từ toàn bộ CapabilityRecord
  userId
  competencyId
  currentLevel
  contributingRecords[]      // tham chiếu CapabilityRecord đã đóng góp
  updatedAt
}
```

Nguyên tắc: `CompetencyProfile.currentLevel` **không tự thay đổi trực
tiếp** — chỉ được cập nhật bởi Capability Engine đọc `GrowthEvent` mới,
tạo `CapabilityRecord` mới, rồi mới cập nhật `CompetencyProfile` (xem
Ownership, mục 11).

---

## 10. Impact Model

```
ImpactRecord {
  recordId
  userId
  missionId
  outputId?
  before, after           // theo từng Impact Dimension áp dụng (AI Impact & ROI Standard mục 4)
  timeSaved?
  quality?
  businessValue?
  confidence?
  automation?
  measuredAt
}
```

`ImpactRecord` là bảng chính duy nhất — các "view" tính toán (ROI tích
lũy, Long-term Growth Snapshot theo 30/90/180/365 ngày, xem AI Impact &
ROI Standard mục 3/9) được **tính từ tập hợp `ImpactRecord`** của 1 User/
Competency, không phải bảng lưu trữ độc lập cần đồng bộ riêng.

---

## 11. Data Ownership

Xác định module nào được đọc/ghi/cập nhật model nào — **quy tắc cứng**,
không module nào được vượt quyền:

| Model | Ai được GHI | Ai được ĐỌC |
|---|---|---|
| `Journey`/`Collection`/`Mission`/`LearningAsset`/`KnowledgeResource`/`PromptPack`/`TemplatePack` | Admin/CMS (nội dung biên tập) | Mọi module |
| `WorkspaceSession`/`WorkspaceStep`/`CompanionConversation`/`AgentExecution` | Chỉ Workspace Engine | Companion, Portfolio (đọc để hiển thị lịch sử) |
| `Output`/`OutputVersion` | Chỉ Workspace Engine (khi người dùng tạo/sửa) | Portfolio, Review Engine, Nhật ký học tập |
| `Reflection`/`CompanionReview` | Chỉ Workspace Engine (ghi lại kết quả từ Companion/người dùng) | Portfolio, Capability Engine |
| `PortfolioItem` | Chỉ Portfolio Engine (tự động, đọc Output đạt chuẩn) | Mọi module hiển thị (Hành trình, Khu vườn, Dashboard) |
| `GrowthEvent` | Chỉ module gốc sinh ra hành động (Workspace/Portfolio/Unlock Engine ghi **event**, không ghi trực tiếp vào bảng đích) | Nhật ký học tập, Hành trình của tôi, Khu vườn của bạn, Capability Engine, Impact Engine, Dashboard |
| `CapabilityRecord`/`CompetencyProfile` | **Chỉ Capability Engine** — đọc `GrowthEvent`, tự tính, tự ghi | Mọi module hiển thị năng lực |
| `ImpactRecord` | **Chỉ Impact Engine** — đọc `GrowthEvent`, tự tính, tự ghi | Mọi module hiển thị Impact |
| `UnlockRule` | Admin/CMS (gắn trên Mission/Journey khi biên tập nội dung) | Unlock Engine |
| `UnlockRecord` | **Chỉ Unlock Engine** — đọc `CapabilityRecord`/`Output`/`GrowthEvent`, đối chiếu `UnlockRule`, tự ghi | Học viện AI, AI Workspace (hiển thị Mission nào đã mở) |

**Ví dụ cụ thể từ brief**: Workspace **không tự cập nhật** `CompetencyProfile`
— Workspace chỉ sinh `GrowthEvent` (vd `OUTPUT_CREATED`). Capability Engine
(module riêng, không phải Workspace) đọc Event đó, tạo `CapabilityRecord`,
rồi cập nhật `CompetencyProfile`. Cùng nguyên tắc áp dụng cho Impact Engine
và Unlock Engine.

---

## 12. Event Bus Design

```
Event Type:
  MISSION_STARTED
  MISSION_COMPLETED
  OUTPUT_CREATED
  OUTPUT_UPDATED
  OUTPUT_VERSIONED
  REVIEW_COMPLETED
  REFLECTION_COMPLETED
  CAPABILITY_UPDATED
  IMPACT_UPDATED
  MISSION_UNLOCKED
```

So với Growth Event Backbone đã liệt kê ở A8 mục 9 (9 loại:
`WORKSPACE_STARTED/MISSION_COMPLETED/OUTPUT_CREATED/OUTPUT_REVIEWED/
OUTPUT_VERSIONED/REFLECTION_SUBMITTED/CAPABILITY_UPDATED/IMPACT_RECORDED/
MISSION_UNLOCKED`), Sprint B1 **hợp nhất còn 10 loại** theo đúng brief:
đổi `WORKSPACE_STARTED`→`MISSION_STARTED` (rõ nghĩa hơn — gắn với Mission,
không chỉ Workspace), `OUTPUT_REVIEWED`→`REVIEW_COMPLETED`,
`REFLECTION_SUBMITTED`→`REFLECTION_COMPLETED`, `IMPACT_RECORDED`→
`IMPACT_UPDATED`, thêm mới `OUTPUT_UPDATED` (phân biệt với `OUTPUT_VERSIONED`
— `OUTPUT_UPDATED` là chỉnh sửa nhỏ trong cùng version, `OUTPUT_VERSIONED`
là tạo version mới có chủ đích qua CTA "Tạo Version 2"). **Đây là bản cuối
cùng** — mọi Sprint B sau dùng đúng 10 tên này.

Nguyên tắc Event Bus: **mọi module nghe Event, không gọi nhau trực tiếp**
— Workspace Engine không import/gọi hàm của Capability Engine; Capability
Engine chỉ subscribe `GrowthEvent` mới. Đây là mở rộng đúng của cơ chế
`window.dispatchEvent`/`CustomEvent` đã có sẵn trong codebase (dùng cho
`orchestrator-intent.ts`) — áp dụng cùng pattern cho toàn bộ Growth Event
Backbone, không phát minh cơ chế mới.

---

## 13. Migration Strategy

Ánh xạ từ dữ liệu hiện có (Sprint 01/02 và CKOS) sang Foundation Data
Layer — **không phá dữ liệu cũ, chỉ mở rộng**:

| Dữ liệu hiện có | Ánh xạ sang model mới |
|---|---|
| `WorkspaceContext` (`companion-workspace.ts`, sessionStorage) | Trở thành `UniversalContext` (mục 4) — thêm field mới (`currentCapability`/`currentJourney`), giữ nguyên field cũ |
| `vdai_workspace_context` (sessionStorage, 1 context duy nhất) | Nâng cấp thành `WorkspaceSession.context`, với `WorkspaceSession` hỗ trợ nhiều phiên/lịch sử (mục 5) — không xóa cơ chế sessionStorage, chỉ bổ sung thêm bảng lưu lâu dài |
| `vdai_growth_events` (localStorage, chỉ ghi `WORKSPACE_STARTED`) | Trở thành `GrowthEvent` thật (mục 8, mục 12) — mở rộng thêm 9 `eventType` còn lại |
| `LearningJourney`/`KnowledgeCollection` (CKOS, static TS) | Ánh xạ trực tiếp sang `Journey`/`Collection` (mục 2) — không cần đổi cấu trúc gốc, chỉ thêm field còn thiếu (`businessGoal`, `capabilityRequirement`... theo Learning Journey Standard mục 13) |
| `KnowledgeSeed` (CKOS, 80 asset) | Ánh xạ sang `LearningAsset` (mục 2) — 11/80 đã gắn `Mission`/`Journey` qua Collection hiện có, 69 còn lại cần gắn `missionId` khi Sprint B7 tổ chức lại (theo Gap Analysis A9 mục 4.3) |
| `unlock-engine.ts`/`unlock-assets.ts` (Mission Pilot hiện có) | `UnlockRule` (định nghĩa) + `UnlockRecord` (bản ghi) — logic hiện có (Evidence tự khai + Reflection) trở thành 1 trường hợp cụ thể của `UnlockRule`, không thay thế, chỉ tổng quát hóa |
| Companion Orchestrator rule-based hiện có (`companion-orchestrator.ts`) | Tiếp tục làm engine sinh `CompanionConversation`/quyết định `AgentExecution` — không thay bằng AI thật trong Sprint B1 |

Nguyên tắc migration: **thêm bảng mới, giữ nguyên cơ chế cũ đang chạy** —
Sprint B1 chỉ khóa Schema, việc thực sự chuyển dữ liệu (nếu cần) diễn ra ở
Sprint B2 (Workspace Output Storage) trở đi, không phải trong B1.

---

## 14. Future Scaling

Kiến trúc phải chịu được (không đổi Schema):

```
100.000 Users
1.000 Journey
10.000 Mission
100.000 WorkspaceSession
1.000.000 Output
```

Đảm bảo bằng:
1. **Mọi quan hệ đều qua ID tham chiếu**, không nhúng dữ liệu lồng nhau
   sâu — `Output` không copy nội dung `Mission`, chỉ giữ `missionId`.
2. **`GrowthEvent` là append-only** — không update/xóa event cũ, chỉ
   thêm mới; `CompetencyProfile`/`ImpactRecord` là bảng tổng hợp tính từ
   Event, có thể tính lại (replay) nếu cần mà không mất dữ liệu gốc.
3. **`WorkspaceSession.history[]`/`OutputVersion` không giới hạn số
   lượng** về mặt thiết kế — giới hạn thực tế (nếu có, vd hiệu năng) là
   quyết định implementation ở Sprint B2, không phải giới hạn kiến trúc.
4. **Category/Competency/EventType đều là danh mục mở** (nhất quán với
   Future Expansion Strategy đã nêu ở A1/A3/A7) — thêm 1.000 Mission mới
   không cần đổi cấu trúc `Mission`, chỉ thêm bản ghi.
5. **Data Ownership (mục 11) ngăn ghi chồng chéo** ở quy mô lớn — mỗi
   Engine (Capability/Impact/Unlock) chỉ ghi đúng bảng của mình, tránh
   race condition khi nhiều User cùng lúc kích hoạt nhiều Event.

---

Foundation Data Layer đã khóa Schema + Relationship + Event Bus +
Ownership. Sprint B2 (Workspace Output Storage) có thể bắt đầu implement
thẳng theo tài liệu này, không cần thiết kế lại dữ liệu.
