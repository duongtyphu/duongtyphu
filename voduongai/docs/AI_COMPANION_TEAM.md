# AI Companion Team — Architecture

PHASE 3, EPIC 03. Tài liệu kiến trúc — không code, không gọi AI API
(GPT/Claude/Gemini/OpenAI/Anthropic), không sửa/mở rộng kiến trúc đã khóa
ở EPIC 01 (Learning Operating System) và EPIC 02 (Connected Learning
Ecosystem/Companion Orchestrator).

**Product Principle**: Không xây AI để trả lời. Không xây Chatbot. Không
xây Multi-Agent Platform. Chúng ta đang xây một **AI Workforce**. Người
dùng không sở hữu nhiều AI — người dùng sở hữu **một đội ngũ cộng sự AI**.
Companion là COO. AI Companion Team là lực lượng thực thi.

> "VO DUONG AI là Hệ điều hành giúp con người đạt được mục tiêu bằng AI."

**Nguyên tắc từ ngữ**: Không dùng từ "Agent" trong bất kỳ UI/copy nào
người dùng nhìn thấy. Nội bộ (tài liệu kỹ thuật, code tương lai) có thể
dùng "Agent" làm thuật ngữ triển khai — người dùng chỉ thấy **"AI
Companion Team"** hoặc **"Đội ngũ cộng sự AI"**.

---

## 1. Sơ đồ tổ chức

```
Owner (Người dùng — chủ sở hữu mục tiêu)
   ↓
Companion (COO — Chief Operating Officer)
   ↓
Department (7 phòng ban — theo lĩnh vực công việc)
   ↓
Specialist (cộng sự chuyên trách trong từng Department)
   ↓
Capability (năng lực cụ thể mỗi Specialist thực hiện được)
   ↓
AI Model (nền tảng thực thi phía sau — ẩn với người dùng, EPIC 04+)
```

**Vai trò từng tầng**:

- **Owner** — người dùng thật, người đặt mục tiêu (Goal) và là người duy
  nhất quyết định/phê duyệt kết quả cuối cùng.
- **Companion (COO)** — không trực tiếp thực hiện Task. Companion nhận
  Goal từ Owner, hiểu Mission (kế thừa nguyên vẹn từ EPIC 03 Mission
  Library Standard/AI Curriculum Standard đã khóa), lập Blueprint, giao
  việc cho đúng Department, theo dõi, tổng hợp, trình Owner phê duyệt.
  Companion không đổi vai trò so với Blueprint đã khóa
  (`LEARNING_OPERATING_SYSTEM_BLUEPRINT.md` mục 12) — chỉ mở rộng năng
  lực điều phối từ "1 người" sang "điều phối cả một đội ngũ."
- **Department** — 7 phòng ban theo lĩnh vực công việc thật (mục 2,
  `AI_COMPANION_DEPARTMENTS.md`), mỗi phòng ban có Mission/Responsibility/
  KPI riêng.
- **Specialist** — cộng sự chuyên trách trong 1 Department, có Capability
  Matrix riêng (`AI_CAPABILITY_MATRIX.md`), có Profile chuẩn
  (`AI_TEAM_PROFILE_STANDARD.md`).
- **Capability** — năng lực cụ thể, đo được, gắn với Evidence thật —
  KHÔNG khác biệt với khái niệm Capability đã khóa ở EPIC 03
  (`ASSESSMENT_CAPABILITY_STANDARD.md`) — AI Companion Team dùng chung 1
  hệ Capability với người học, không tạo hệ đo lường song song.
- **AI Model** — tầng thực thi kỹ thuật thấp nhất, hoàn toàn ẩn với người
  dùng và ẩn với cả Companion ở góc nhìn tổ chức (Companion chỉ biết
  "Specialist nào," không biết/không cần biết AI Model nào đứng sau) —
  đúng nguyên tắc AI-Agnostic Architecture đã khóa
  (`FUTURE_ARCHITECTURE_DECISIONS.md` mục 1.12).

---

## 2. Quan hệ với kiến trúc đã khóa (EPIC 01/02)

AI Companion Team **không thay thế, không mở rộng** bất kỳ model nào ở
Foundation Data Layer đã khóa. Ánh xạ:

| Khái niệm AI Companion Team | Khái niệm đã khóa tương ứng | Có đổi không |
|---|---|---|
| Owner | `User` (Foundation Data Layer) | Không đổi |
| Companion (COO) | Companion Orchestrator (đã khóa) | Không đổi vai trò, chỉ thêm năng lực điều phối Department |
| Department/Specialist/Capability (Task thực thi) | `AgentExecution`, `ExecutionEngine` (extension point đã chuẩn bị từ Sprint B1) | Lấp đầy đúng extension point đã có sẵn, không tạo model mới |
| Goal → Project → Blueprint → Tasks | Mission → Learning Asset → Practice (Mission Library Standard/AI Curriculum Standard) | Cùng khái niệm, đặt tên theo ngữ cảnh "công việc thật" thay vì "học tập", không phải 2 hệ song song |
| Review → Approval → Portfolio → Memory | Review → Reflection → Portfolio → Growth (đã khóa, Sprint B2-B4) | Dùng nguyên, không đổi |

**Không có model dữ liệu mới nào cần thêm vào Foundation Data Layer** —
AI Companion Team là **lớp tổ chức nhân sự** phủ lên trên `ExecutionEngine`
đã có, trả lời câu hỏi "Companion điều phối AI Agent nào" mà
`extension-points.ts` (Sprint B1) đã chừa sẵn chỗ, chưa trả lời.

---

## 3. Ranh giới không được vượt qua

- Companion **không** trực tiếp thực hiện Task — luôn giao cho đúng 1
  Specialist trong đúng 1 Department.
- Không Department/Specialist nào được phép **tự Unlock/tự Review/tự
  Approve** — quyền phê duyệt cuối cùng luôn thuộc Owner (người dùng),
  đúng nguyên tắc "Companion không quyết định thay người dùng" đã khóa.
- Không gọi AI API thật ở tài liệu này hay bất kỳ đâu trong Sprint này.
- Không đổi Foundation Data Layer, Growth Event Backbone, Mission
  Catalog, Capability Engine đã khóa ở EPIC 03 PHASE 2.

---

Chi tiết từng phần: `AI_COMPANION_DEPARTMENTS.md` (7 Department),
`AI_COMPANION_SPECIALISTS.md` (Specialist theo Department),
`AI_CAPABILITY_MATRIX.md` (năng lực chi tiết), `AI_COLLABORATION_MATRIX.md`
(phối hợp liên phòng ban), `AI_TEAM_RUNTIME.md` (vòng đời Goal→Memory),
`AI_TEAM_PROFILE_STANDARD.md` (chuẩn hồ sơ Specialist),
`AI_TEAM_DASHBOARD.md` (dữ liệu Dashboard theo dõi đội ngũ).
