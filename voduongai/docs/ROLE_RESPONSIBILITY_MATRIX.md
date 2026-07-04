# Role & Responsibility Matrix

Tài liệu khóa vai trò/trách nhiệm của toàn bộ Portal, bắt buộc trước khi
triển khai Sprint B2 trở đi (Sprint B2 — AI Workspace Execution Engine —
đã triển khai trước tài liệu này; xem mục 12 đối chiếu tuân thủ). Mọi
Sprint từ B2 đến B5 phải tuân thủ tuyệt đối — không chồng chéo vai trò,
không phá Learning Loop, không chuyển trách nhiệm giữa các module nếu
không có Architecture Change Proposal (`docs/FUTURE_ARCHITECTURE_DECISIONS.md`
mục 4).

---

## 1. Học viện AI (Academy) — ĐÀO TẠO

| | |
|---|---|
| **Nhiệm vụ** | Cung cấp Journey, Mission, Learning Asset, giải thích kiến thức, Ví dụ, Framework, Checklist, Prompt, Template, Case Study, Assignment, điều kiện Unlock |
| **Không được** | Thực hiện Mission, lưu Output, điều phối AI, review Output, lưu Growth, quản lý Workspace |
| **CTA duy nhất** | "Thực hành cùng Companion" → Workspace |
| **Dữ liệu sở hữu** | `Journey`, `Collection`, `Mission`, `LearningAsset` (đọc/ghi — Admin biên tập, Học viện AI chỉ đọc để hiển thị) |
| **Dữ liệu KHÔNG sở hữu** | `WorkspaceSession`, `Output`, `GrowthEvent`, `CapabilityRecord` |

## 2. Thư viện tri thức — TRA CỨU

| | |
|---|---|
| **Nhiệm vụ** | Prompt, SOP, Checklist, Template, PDF, Word, Excel, Case Study, Reference, Workflow |
| **Không được** | Dạy, thực hành, review, lưu Workspace, Capability |
| **CTA** | "Dùng ngay cùng Companion" → Workspace |
| **Dữ liệu sở hữu** | `KnowledgeResource`, `PromptPack`, `TemplatePack` |
| **Dữ liệu KHÔNG sở hữu** | `WorkspaceSession`, `Output`, `CapabilityRecord` |

## 3. AI Workspace — THỰC HIỆN

| | |
|---|---|
| **Nhiệm vụ** | Workspace Session, Timeline, Current Task, Context, Output, Output Version, History, Resume, Execution, Event |
| **Không được** | Dạy, giải thích lý thuyết, đánh giá Capability, Unlock, lưu Journey |
| **Dữ liệu sở hữu** | `WorkspaceSession`, `WorkspaceStep`, `Output`, `OutputVersion` |
| **Dữ liệu KHÔNG sở hữu** | `Journey`/`Mission`/`LearningAsset` (chỉ đọc qua Context, không sửa), `CapabilityRecord`, `UnlockRecord`, `PortfolioItem` |
| **Việc phát Event** | Chỉ được **phát** `GrowthEvent` (qua `emitGrowthEvent`), không được tự ghi `CapabilityRecord`/`ImpactRecord`/`UnlockRecord` trực tiếp |

## 4. Companion — ĐIỀU PHỐI (Orchestrator, không phải Chatbot)

| | |
|---|---|
| **Nhiệm vụ** | Nhận Context, hiểu Mission, chia nhỏ nhiệm vụ, điều phối AI, hướng dẫn, theo dõi, review, reflection, sinh Growth Event, gợi ý Mission tiếp |
| **Không được** | Học thay, làm thay, Unlock thay, quyết định thay người dùng |
| **Dữ liệu sở hữu** | `CompanionConversation`, `AgentExecution`, `CompanionReview` (là bên **tạo ra** review, không phải bên **lưu trữ** — review được lưu vào `Output.review` do Workspace sở hữu) |
| **Ghi chú** | Companion là lớp **xuyên suốt**, không phải 1 module riêng có route/UI cố định — nó điều phối bên trong Học viện AI/AI Workspace/Thư viện tri thức thông qua Universal Context, không có dữ liệu "của riêng Companion" ngoài lịch sử hội thoại/quyết định điều phối |

## 5. Portfolio — LƯU THÀNH QUẢ

| | |
|---|---|
| **Nhiệm vụ** | Lưu Output, Version, Asset, Thành tựu, Reuse |
| **Không được** | Dạy, Workspace (không tự tạo/sửa `WorkspaceSession`), Review (không tự đưa ra nhận xét, chỉ hiển thị `CompanionReview` đã có sẵn từ Output) |
| **Dữ liệu sở hữu** | `PortfolioItem` |
| **Dữ liệu KHÔNG sở hữu** | `Output`/`OutputVersion` gốc (chỉ tham chiếu ID, không copy nội dung — Single Source of Truth) |

## 6. Growth — THEO DÕI TRƯỞNG THÀNH

| | |
|---|---|
| **Nhiệm vụ** | Nhật ký học tập, Hành trình của tôi, Khu vườn của bạn, Timeline, Progress |
| **Không được** | Dạy, Workspace, Output (không tự tạo Output, chỉ hiển thị số liệu suy ra từ `GrowthEvent`) |
| **Dữ liệu sở hữu** | Không sở hữu bảng ghi gốc nào — chỉ **đọc** `GrowthEvent` (Growth Event Backbone) và hiển thị |
| **Ghi chú** | "Growth" ở đây là nhóm 3 trang hiển thị (Nhật ký/Hành trình/Khu vườn), không phải 1 Engine ghi dữ liệu — Engine ghi dữ liệu là Growth Event Bus (`growth-event-bus.ts`), thuộc Foundation, không thuộc riêng module nào trong 9 module ở tài liệu này |

## 7. Capability — ĐÁNH GIÁ NĂNG LỰC

| | |
|---|---|
| **Nhiệm vụ** | Evidence, Capability, AI Impact, Business Impact, Human Impact |
| **Không được** | Sinh Output, Workspace |
| **Dữ liệu sở hữu** | `CapabilityRecord`, `CompetencyProfile` |
| **Dữ liệu KHÔNG sở hữu** | `Output` (chỉ đọc làm Evidence), `WorkspaceSession` |
| **Ghi chú** | Capability Engine (Sprint B5) chỉ được đọc `GrowthEvent` để tự tính, không được module khác gọi trực tiếp ghi vào (Event-Driven Architecture, `FOUNDATION_DATA_LAYER.md` mục 11) |

## 8. AI Impact — ĐO GIÁ TRỊ

| | |
|---|---|
| **Đo** | Time Saved, Quality, Productivity, Business Value, Human Growth |
| **Không được** | Chấm điểm |
| **Dữ liệu sở hữu** | `ImpactRecord` |
| **Ghi chú** | AI Impact là khái niệm đo lường tách biệt khỏi Capability (mục 7) dù cùng nguồn Evidence — Capability trả lời "làm được chưa," AI Impact trả lời "tốt hơn bao nhiêu" (nhất quán `AI_IMPACT_ROI_STANDARD.md`) |

## 9. Admin — QUẢN TRỊ HỆ THỐNG

| | |
|---|---|
| **Nhiệm vụ** | Quản lý Journey, Mission, Learning Asset, Prompt, Template, Resource, Blog, Analytics |
| **Không được** | Tham gia Learning Loop (Admin không phải là một bước trong luồng người học đi qua) |
| **Dữ liệu sở hữu** | Ghi (write) vào `Journey`/`Collection`/`Mission`/`LearningAsset`/`KnowledgeResource`/`PromptPack`/`TemplatePack` — các module khác chỉ đọc |

---

## 10. Learning Loop

```
Học viện AI → Companion → AI Workspace → Output → Portfolio → Review
   → Reflection → Growth → Capability → Unlock → Mission tiếp theo
```

Không module nào được bỏ qua hoặc phá vỡ Learning Loop — cụ thể:

- AI Workspace không được tự quyết định Unlock (phải qua Unlock Engine
  đọc Capability/Output thật).
- Portfolio không được tự tạo Workspace mới (chỉ nhận Output từ Workspace
  đưa sang).
- Growth không được tự đo Capability/Impact (chỉ hiển thị Event, việc
  tính Capability/Impact thuộc Engine riêng ở mục 7/8).
- Capability/AI Impact không được tự sinh Output (chỉ đọc Output làm bằng
  chứng).

---

## 11. Product Rule

Nếu một tính năng mới không xác định rõ **cả 4 điều** dưới đây — **không
được triển khai**:

1. Thuộc module nào (1 trong 9 module ở mục 1-9).
2. Module nào chịu trách nhiệm (owner ghi dữ liệu — đối chiếu cột "Dữ
   liệu sở hữu" ở từng mục).
3. Dữ liệu lưu ở đâu (model nào trong Foundation Data Layer).
4. Module nào đọc (đối chiếu Data Ownership,
   `FOUNDATION_DATA_LAYER.md` mục 11).

Đây là bộ lọc bổ sung cho `docs/PRODUCT_GUARDRAILS.md` — áp dụng song
song, không thay thế.

---

## 12. Đối chiếu tuân thủ — Sprint B2 (đã triển khai trước tài liệu này)

Sprint B2 (`docs/SPRINT_B2_AI_WORKSPACE_EXECUTION_ENGINE.md`) triển khai
`WorkspaceSession`/`Output`/`OutputVersion` thật trong `WorkspaceMvp.tsx` —
đối chiếu lại với Role Matrix vừa khóa:

- ✔ AI Workspace chỉ làm đúng phần được phép: Session, Timeline, Task
  hiện tại, Context, Output, Version, History, Resume, Event — không có
  đoạn nào dạy lý thuyết, đánh giá Capability, hay Unlock.
- ✔ `reviewStatus`/`reflectionStatus` trong `OutputRecord` chỉ là **field
  dữ liệu chờ**, không có logic Review/Reflection thật chạy trong AI
  Workspace — đúng ranh giới "AI Workspace không được Review" (Review
  thật thuộc về Companion, mục 4).
- ✔ Growth Event (`WORKSPACE_RESUMED`/`OUTPUT_CREATED`/`OUTPUT_UPDATED`/
  `OUTPUT_VERSIONED`/`WORKSPACE_COMPLETED`) chỉ được **phát**, không tự
  ghi vào `CapabilityRecord`/`ImpactRecord`/`UnlockRecord` — đúng nguyên
  tắc Event-Driven, đúng ranh giới mục 3.
- Không phát hiện vi phạm nào cần Architecture Change Proposal.

**Sprint B3 trở đi phải đối chiếu tương tự trước khi bắt đầu** — không
tự ý để 1 module đảm nhận việc thuộc module khác.
