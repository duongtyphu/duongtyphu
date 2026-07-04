# Learning Operating System Blueprint

Tài liệu khóa Blueprint cho EPIC 03, kết nối toàn bộ 7 tài liệu chuẩn đã
thiết kế (A1–A7) thành một hệ điều hành học tập thống nhất, trước khi bắt
đầu Sprint B (implementation). Tài liệu kiến trúc — không code, không sửa
UI, không route, không AI API, không Agent thật, không dữ liệu giả, không
đổi menu.

**Product Principle**: VO DUONG AI không phải nhiều trang học tập rời
rạc. VO DUONG AI là một Learning Operating System. Mọi kiến thức dẫn đến
thực hành. Mọi thực hành tạo ra Output. Mọi Output trở thành Evidence.
Mọi Evidence cập nhật Capability. Mọi Growth Event phản ánh sự trưởng
thành. Companion là người điều phối toàn bộ hành trình đó.

---

## 1. Executive Summary

7 tài liệu chuẩn (A1–A7) đã thiết kế riêng lẻ từng lớp của hệ thống:

| Task | Tài liệu | Lớp thiết kế |
|---|---|---|
| — | `LEARNING_OS_PRINCIPLE.md` | Triết lý nền tảng |
| A3 | `LEARNING_JOURNEY_STANDARD.md` | Hành trình năng lực |
| A1 | `MISSION_LIBRARY_STANDARD.md` | Đơn vị công việc |
| A2 | `LEARNING_ASSET_STANDARD.md` | Đơn vị học tập |
| A4 | `AI_CURRICULUM_STANDARD.md` | Quy trình thực thi 13 bước |
| A5 | `ASSESSMENT_CAPABILITY_STANDARD.md` + `CAPABILITY_EVIDENCE_FRAMEWORK.md` | Đo năng lực |
| A6 | `AI_IMPACT_ROI_STANDARD.md` | Đo giá trị |
| A7 | `GOLDEN_REFERENCE_MISSION_PACK.md` | 10 Mission áp dụng thật |

Tài liệu này (A8) là **lớp tích hợp** — không định nghĩa lại bất kỳ khái
niệm nào đã có, chỉ chứng minh và mô tả cách toàn bộ các lớp trên **vận
hành cùng nhau như một hệ thống duy nhất**, với 3 trụ cột kỹ thuật xuyên
suốt: **Universal Context System** (mọi CTA dùng chung 1 context),
**Growth Event Backbone** (mọi hành động sinh 1 event, nhiều nơi đọc), và
**Companion là Orchestrator duy nhất** (không module nào tự xử lý thực
hành riêng).

---

## 2. Core Architecture

```
Học viện AI         = nơi HỌC
AI Workspace         = nơi BẮT ĐẦU LÀM
Thư viện tri thức     = nơi TRA CỨU
Companion              = LỚP ĐIỀU PHỐI (không phải menu, không phải chatbot)
Workspace                = nơi THỰC HÀNH và LƯU KẾT QUẢ
Portfolio                  = nơi LƯU THÀNH QUẢ
Growth Event                = DỮ LIỆU TĂNG TRƯỞNG
Nhật ký/Hành trình/Khu vườn   = nơi PHẢN ÁNH SỰ TRƯỞNG THÀNH
```

Nguyên tắc kiến trúc: 3 module đầu (Học viện AI/AI Workspace/Thư viện tri
thức) là **3 cửa vào khác nhau**, nhưng đều hội tụ về **cùng một
Workspace** qua **cùng một Companion** — không có "Workspace của Học viện
AI" và "Workspace của AI Workspace" riêng biệt. Đây là điểm đã xác lập từ
Sprint 02 (`CONNECTED_LEARNING_ECOSYSTEM.md`) và được giữ nguyên, mở rộng
thêm Portfolio/Growth Event/Capability/Impact ở lớp sau Workspace.

---

## 3. Master Learning Loop

```
Người dùng chọn Journey
   ↓
Học Mission trong Học viện AI (Learning Asset: Knowledge + Guided Example)
   ↓
Bấm "Thực hành cùng Companion"
   ↓
Companion nhận Context (Universal Context System — mục 6)
   ↓
Mở Workspace
   ↓
Điều phối AI Agent nếu cần (theo AI Agent Standard — Learning Asset Standard mục 9)
   ↓
Người dùng tạo Output
   ↓
Companion Review (không chấm điểm — Assessment & Capability Standard mục 8)
   ↓
Người dùng Reflection
   ↓
Lưu Output vào Portfolio
   ↓
Sinh Growth Event (Growth Event Backbone — mục 9)
   ↓
Cập nhật Capability (Capability & Impact Connection — mục 10)
   ↓
Đo AI Impact
   ↓
Mở khóa Mission tiếp theo (Unlock System — mục 11)
   ↓
Ghi vào Nhật ký học tập / Hành trình của tôi / Khu vườn của bạn
```

Đây là bản hợp nhất của: Mission Flow (Mission Library Standard mục 5),
Curriculum Flow 13 bước (AI Curriculum Standard mục 3), và Assessment
Lifecycle (Assessment & Capability Standard mục 3) — **cùng một luồng**,
không phải 3 luồng song song. Master Learning Loop là phiên bản đầy đủ
nhất, áp dụng cho mọi Mission không phân biệt Category.

---

## 4. Module Connection Map

```
Học viện AI
   → Mission
      → Learning Asset
         → Companion ("Thực hành cùng Companion")
            → Workspace

AI Workspace
   → Companion Desk ("Giao việc cho Companion")
      → Workspace

Thư viện tri thức
   → Checklist / Template / Prompt / SOP
      → "Dùng ngay cùng Companion"
         → Workspace

Workspace
   → Output
      → Review
         → Reflection
            → Portfolio
               → Growth Event

Growth Event
   → Nhật ký học tập
   → Hành trình của tôi
   → Khu vườn của bạn
   → Capability
   → AI Impact
```

Nguyên tắc: mỗi mũi tên trên là một **kết nối bắt buộc**, không phải tùy
chọn — một module không kết nối đúng chuỗi trên (vd một CTA trong Thư viện
tri thức không dẫn qua Companion mà đi thẳng nơi khác) là vi phạm kiến
trúc, cần sửa trước khi Publish (đối chiếu Quality Checklist ở các tài
liệu A2/A4/A6).

---

## 5. Shared Data Model

Model tổng thể — **chưa implement**, mô tả để chuẩn bị Sprint B:

| Model | Dùng để làm gì | Thuộc module | Liên kết với | Dữ liệu tối thiểu |
|---|---|---|---|---|
| `User` | Định danh người học | Toàn hệ thống | Mọi model có `userId` | id |
| `Journey` | Khung hành trình năng lực | Học viện AI | `Collection[]`, `Competency[]` | id, name, businessGoal |
| `Collection` | Nhóm Mission theo chủ đề con | Học viện AI | `Journey`, `Mission[]` | id, journeyId |
| `Mission` | Đơn vị công việc thật | Học viện AI/AI Workspace | `LearningAsset`, `Journey`, `Collection` | id, name, category, expectedOutput |
| `LearningAsset` | Nội dung + thực hành lấp đầy Mission | Học viện AI/Thư viện tri thức | `Mission`, `Resource[]` | id, missionId, knowledge, practice |
| `Resource` | Checklist/Template/Prompt/SOP dùng chung | Thư viện tri thức | `LearningAsset`, `Mission` (N–N) | id, type, content/fileRef |
| `PromptPack` | Bộ Prompt thực hành | Thư viện tri thức/AI Workspace | `Mission`, `LearningAsset` | id, prompts[] |
| `Template` | File mẫu dùng ngay | Thư viện tri thức | `Mission`, `LearningAsset` | id, format, fileRef |
| `Checklist` | Danh sách kiểm tra thao tác | Thư viện tri thức | `Mission`, `LearningAsset` | id, items[] |
| `WorkspaceSession` | Một lần thực hành cụ thể | Workspace | `User`, `Mission`, `Context` | id, userId, missionId, context |
| `WorkspaceStep` | Từng bước trong Curriculum Flow của 1 session | Workspace | `WorkspaceSession` | stepType, timestamp |
| `AgentRun` | 1 lần Companion điều phối AI Agent | Workspace | `WorkspaceSession` | agentRole, input, output |
| `Output` | Kết quả thật đã tạo | Workspace | `WorkspaceSession`, `Mission`, `PortfolioItem` | id, outputType, format, content/fileRef |
| `OutputVersion` | Lịch sử chỉnh sửa 1 Output | Workspace | `Output` | version, editedAt |
| `Reflection` | Người học tự nhận biết | Workspace | `WorkspaceSession`, `Mission` | question, answer |
| `CompanionReview` | Nhận xét của Companion | Workspace | `Output` | strengths[], improvements[], suggestion |
| `PortfolioItem` | 1 Output được lưu vào Portfolio | Portfolio | `Output`, `User`, `Competency` | id, userId, competencyId, outputId |
| `GrowthEvent` | Sự kiện trưởng thành | Growth Backbone | `User`, `Mission`, mọi module tiêu thụ | eventType, userId, timestamp |
| `CapabilityProfile` | Năng lực hiện tại của 1 người theo 1 Competency | Capability | `User`, `Competency`, `Evidence[]` | userId, competencyId, level |
| `ImpactRecord` | 1 lần đo AI Impact | AI Impact | `Mission`, `Output`, `User` | metricType, before, after |
| `UnlockRule` | Điều kiện mở Mission/Journey tiếp theo | Unlock | `Mission`, `Journey`, `CapabilityProfile` | condition, targetEntityId |

Data Model này **không tạo mới** — nó tổng hợp và đặt tên thống nhất cho
các schema đã rải rác ở Mission Library Standard mục 3, Learning Asset
Standard mục 15, Learning Journey Standard mục 13, AI Curriculum Standard
mục 19, Capability Evidence Framework mục 3, AI Impact & ROI Standard mục
10. Sprint B (`B1 — Data Model Foundation`) sẽ implement đúng bảng này,
không thiết kế lại từ đầu.

---

## 6. Universal Context System

Mọi CTA "thực hành cùng Companion" dùng chung một context, qua một hàm duy
nhất (đã có từ Sprint 02, mở rộng thêm field ở đây):

```
startCompanionWorkspace(context)

context = {
  userId,
  module,            // "academy" | "khong-gian-ai" | "ckos" | ... (PortalModule hiện có)
  source,             // nơi CTA được bấm — đã có trong hệ thống hiện tại
  routeFrom,           // route gọi CTA — đã có
  journeyId,            // MỚI — bổ sung so với Sprint 02
  collectionId,          // MỚI
  missionId,              // MỚI
  assetId,                 // MỚI
  resourceId,               // MỚI
  promptId,                  // MỚI
  templateId,                  // MỚI
  userGoal,                     // đã có
  expectedOutput,                 // đã có
  difficulty,                       // MỚI
  timestamp                         // đã có, tự điền
}
```

Nguyên tắc: **không module nào tự xử lý thực hành riêng** — mọi CTA ở Học
viện AI, AI Workspace, Thư viện tri thức, Output/Portfolio đều gọi cùng
một hàm, chỉ khác giá trị context truyền vào. Đây là nguyên tắc đã xác lập
ở Sprint 02 (`companion-workspace.ts`), giờ mở rộng thêm 6 field mới
(`journeyId/collectionId/missionId/assetId/resourceId/promptId/templateId/
difficulty`) để Workspace biết đầy đủ nguồn gốc Mission/Asset, không chỉ
biết `module`/`source` như hiện tại.

---

## 7. Universal CTA Standard

| Module | CTA chuẩn | Đích đến |
|---|---|---|
| Học viện AI | "Thực hành cùng Companion" | Workspace |
| AI Workspace | "Giao việc cho Companion" / "Bắt đầu Workspace" | Workspace |
| Thư viện tri thức | "Dùng ngay cùng Companion" | Workspace |
| Output/Portfolio | "Cải tiến cùng Companion" / "Tạo Version 2" | Workspace (mở lại Output cũ, tạo `OutputVersion` mới) |

Tất cả đều đi về Workspace — không có ngoại lệ, không có CTA nào dẫn tới
một trang xử lý riêng của module đó. "Cải tiến cùng Companion"/"Tạo
Version 2" là 2 CTA **mới** so với Sprint 02, cần bổ sung khi implement
Portfolio MVP (Sprint B4) — về bản chất vẫn gọi `startCompanionWorkspace`
với `context.missionId`/`assetId` trỏ lại Mission gốc và thêm tham chiếu
`outputId` để Workspace biết đang tạo Version tiếp theo, không phải phiên
mới.

---

## 8. Output & Portfolio Flow

Mọi Mission phải sinh Output — **Output không được mất** (nhất quán tuyệt
đối với Output Standard đã có ở A1/A2/A4).

```
Output {
  type              // Document | Spreadsheet | Presentation | ... (Learning Asset Standard mục 10)
  file/link/content   // artefact thật
  version              // OutputVersion — mỗi lần sửa là 1 version mới, không ghi đè
  createdAt
  sourceWorkspace       // WorkspaceSession sinh ra Output này
  missionId
  review                 // CompanionReview
  reflection              // Reflection
  impact                   // ImpactRecord
  portfolioStatus            // "chưa vào Portfolio" | "đã vào Portfolio"
}
```

Portfolio là **tập hợp Output có giá trị** — không phải mọi Output tự động
vào Portfolio ngay khi tạo (vd Output nháp chưa hoàn chỉnh), nhưng khi đủ
điều kiện (Review đạt "sử dụng được," Reflection đã có) thì tự động thêm
vào Portfolio theo `competencyId` liên quan (Capability Evidence Framework
mục 2). Không có bước "người dùng tự tay upload vào Portfolio" — Portfolio
được xây từ chính luồng Output đã có, không phải tính năng tách rời.

---

## 9. Growth Event Backbone

**Growth Event không được ghi cho có.** Mỗi Growth Event phải được **ít
nhất 3 nơi đọc**: Nhật ký học tập, Hành trình của tôi, Khu vườn của bạn —
có thể thêm Capability, AI Impact, Dashboard (tổng cộng tối đa 6 nơi tiêu
thụ 1 event).

```
Event Type:
  WORKSPACE_STARTED       // đã có từ Sprint 01/02
  MISSION_COMPLETED         // MỚI
  OUTPUT_CREATED             // MỚI
  OUTPUT_REVIEWED              // MỚI
  OUTPUT_VERSIONED               // MỚI
  REFLECTION_SUBMITTED              // MỚI
  CAPABILITY_UPDATED                  // MỚI
  IMPACT_RECORDED                       // MỚI
  MISSION_UNLOCKED                        // MỚI
```

```
GrowthEvent
   ├── Nhật ký học tập     // hiển thị theo dòng thời gian: "Bạn vừa hoàn thành Mission X"
   ├── Hành trình của tôi   // cập nhật vị trí trong Journey
   ├── Khu vườn của bạn       // số liệu trưởng thành thật (thay số liệu tĩnh hiện tại)
   ├── Capability              // cập nhật CapabilityProfile (nếu event liên quan năng lực)
   ├── AI Impact                 // cập nhật ImpactRecord (nếu event là OUTPUT_CREATED/IMPACT_RECORDED)
   └── Dashboard                    // đếm Output theo loại (nếu implement — không bắt buộc Sprint B đầu)
```

Đây chính là cơ chế vá gap đã ghi nhận ở `SMART_AI_CURRICULUM_AUDIT.md`
(Growth Event hiện chỉ ghi, không ai đọc) — Sprint B3 (`Growth Event
Reader`) sẽ implement đúng backbone này, không thiết kế lại.

---

## 10. Capability & Impact Connection

**Capability không tăng vì xem Video.** Capability tăng vì: Output,
Practice, Review, Reflection, Reuse (Reuse = Output được dùng lại/làm nền
cho Output khác, tín hiệu bổ sung so với 4 nguồn đã có ở A5 — cho thấy
Output đủ tốt để tái sử dụng).

**AI Impact đo từ**: before, after, timeSaved, qualityImproved,
productivityGain, confidenceGain, businessValue — nhất quán với Impact
Dimensions đã có ở A6, không thêm khái niệm mới, chỉ liệt kê lại làm rõ
kết nối 2 chiều: mỗi `GrowthEvent` loại `OUTPUT_CREATED`/`IMPACT_RECORDED`
đồng thời cập nhật cả `CapabilityProfile` lẫn `ImpactRecord` — hai bảng dữ
liệu khác nhau, cùng một nguồn sự kiện.

---

## 11. Unlock System

**Unlock không theo "xem xong bài học."** Unlock theo: Mission Completed,
Output Created, Reflection Submitted, Capability Reached, Impact Recorded
— dùng chung cơ chế điều kiện linh hoạt đã có (`requiresMission`/
`requiresCapability`/`requiresAny`/`requiresAll` — Mission Library
Standard mục 6/7).

Ví dụ: Hoàn thành "Proposal cơ bản" (Golden Reference Mission 2) → mở
"Proposal nâng cao." Không mở vì đã "xem xong Video giới thiệu Proposal
nâng cao."

---

## 12. Companion Role

Companion là **Orchestrator của toàn hệ thống** — không phải menu, không
phải chatbot, xuất hiện đúng lúc (nhất quán với Companion Presence đã có).

**Companion làm**:
- Nhận Context (Universal Context System, mục 6)
- Hiểu mục tiêu (từ `userGoal`/Assessment)
- Chia bước (Companion Coaching — AI Curriculum Standard mục 8)
- Điều phối AI Agent (theo vai trò chức năng — Learning Asset Standard mục
  9)
- Hướng dẫn thực hành
- Review Output (không chấm điểm)
- Hỏi Reflection
- Gợi ý Mission tiếp theo (Unlock/Personalization — AI Curriculum Standard
  mục 17)
- Ghi Growth Event

**Companion không làm**:
- Học thay người dùng
- Quyết định thay người dùng (chỉ gợi ý, không ép)
- Xuất hiện ngẫu nhiên (theo cơ chế Presence Coordinator đã có)
- Spam popup

---

## 13. Implementation Roadmap — Sprint B

Đề xuất thứ tự triển khai sau A8, mỗi Sprint B là một khối độc lập có thể
verify riêng:

| Sprint | Tên | Nội dung chính |
|---|---|---|
| B1 | Data Model Foundation | Implement Shared Data Model (mục 5) — schema thật (DB/type), chưa có UI |
| B2 | Workspace Output Storage | `WorkspaceMvp` lưu Output thật (không chỉ hiển thị context) + `OutputVersion` |
| B3 | Growth Event Reader | Nhật ký học tập/Hành trình của tôi/Khu vườn của bạn đọc `GrowthEvent` thật (mục 9) |
| B4 | Portfolio MVP | Portfolio hiển thị `PortfolioItem` thật từ Output đã lưu (mục 8) |
| B5 | Capability & Impact MVP | `CapabilityProfile`/`ImpactRecord` cập nhật thật từ Growth Event (mục 10) |
| B6 | Unlock MVP | `UnlockRule` thật, áp dụng cho Mission/Journey (mục 11) |
| B7 | Connect 10 Golden Missions | Đưa 10 Mission ở `GOLDEN_REFERENCE_MISSION_PACK.md` vào vận hành thật qua B1–B6 |

Nguyên tắc thứ tự: B1 là nền tảng bắt buộc trước mọi Sprint sau (không có
Data Model, không thể lưu Output/Growth Event). B2–B6 có thể xen kẽ thứ
tự tùy độ ưu tiên sản phẩm, nhưng B7 luôn là Sprint cuối — vì cần B1–B6
hoàn chỉnh để 10 Golden Mission chạy thật, không phải chạy trên khung
thiếu.

---

## 14. Risks & Guardrails

| Rủi ro | Guardrail |
|---|---|
| Growth Event tiếp tục chỉ ghi, không ai đọc (lặp lại tình trạng hiện tại) | B3 phải là điều kiện bắt buộc trước khi tuyên bố "Growth Loop hoạt động" — không Publish Mission mới nào tuyên bố có Growth tracking nếu B3 chưa xong |
| Output tiếp tục chỉ hiển thị context, không lưu thật (lặp lại `WorkspaceMvp` hiện tại) | B2 phải hoàn thành trước B4/B5 — Portfolio/Capability không thể đọc Output nếu Output chưa được lưu thật |
| Companion bị kéo thành 2 hệ thống song song (lặp lại tình trạng `pushCompanionIntent` vs `startCompanionWorkspace` trước Sprint 02) | Universal Context System (mục 6) là điểm gọi DUY NHẤT — mọi Sprint B không được tạo thêm cơ chế Companion thứ hai |
| Unlock/Capability bị lẫn với chấm điểm khi implement thật | Mọi Sprint B liên quan Capability/Unlock phải đối chiếu lại "không dùng điểm số" trước khi code — nhắc lại từ Assessment & Capability Standard mục 1 |
| Mission mới được tạo không theo Blueprint (lặp lại rủi ro nội dung rời rạc) | Mọi Mission mới (kể cả ngoài 10 Golden) phải qua Quality Checklist ở A2/A4/A6/A7 trước khi Publish |
| Sprint B triển khai UI trước khi Data Model ổn định | B1 luôn đi trước — không code UI Portfolio/Dashboard trước khi Data Model (mục 5) được implement và review |

---

## 15. Definition of Ready for Sprint B

Sprint B sẵn sàng bắt đầu khi:

- ✔ Toàn bộ A1–A8 đã có trong `docs/` và không mâu thuẫn nhau (đã kiểm tra
  — mọi khái niệm dùng chung định nghĩa xuyên suốt 8 tài liệu).
- ✔ Shared Data Model (mục 5) đã map rõ với cấu trúc dữ liệu hiện có
  (`KnowledgeSeed`/`LearningJourney`/`WorkspaceContext`) — không cần thiết
  kế lại từ đầu khi implement B1.
- ✔ Universal Context System (mục 6) đã định nghĩa đủ field mới cần thêm
  vào `WorkspaceContext` hiện tại (7 field mới: `journeyId/collectionId/
  missionId/assetId/resourceId/promptId/templateId/difficulty`).
- ✔ Growth Event Backbone (mục 9) đã liệt kê đủ `eventType` mới cần thêm.
- ✔ 10 Golden Reference Mission (A7) đã sẵn sàng làm dữ liệu thật đầu tiên
  cho B7, không cần chờ thiết kế thêm Mission nào khác.
- ✔ Risks & Guardrails (mục 14) đã được xác nhận — đặc biệt nguyên tắc
  "Universal Context System là điểm gọi duy nhất," không tạo cơ chế
  Companion thứ hai trong Sprint B.

Khi cả 6 điều kiện trên đạt — Sprint B1 (Data Model Foundation) có thể bắt
đầu ngay, không cần thêm tài liệu thiết kế nào trước đó.
