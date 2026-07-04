# AI Workforce Registry — Workforce Level 1 Roster + Onboarding mở

Tài liệu kiến trúc — không code. Đây là **registry tổng hợp cấp
Workforce** (khác `AI_COMPANION_REGISTRY.md` — nơi định nghĩa chi tiết
từng Companion): roster 30 Companion dưới góc nhìn vận hành, và quy
trình để Companion #31 trở đi gia nhập **mà không cần sửa hệ thống**
(yêu cầu #8 của brief).

## 1. Quan hệ 3 tầng Registry (không trộn lẫn)

```
AI Provider Registry / AI Capability Registry     (OPEN_AI_WORKFORCE_PLATFORM.md)
   — hạ tầng gọi AI: model nào, gọi thế nào, đã certify chưa
              │  1 Companion có thể dùng 0..N Capability đã certify
              ▼
AI Companion Registry                              (AI_COMPANION_REGISTRY.md)
   — vai trò nghiệp vụ: 30 Companion, Mission/Input/Output/Quality/...
              │  roster tổng hợp, tra cứu vận hành
              ▼
AI Workforce Registry (tài liệu này)
   — "ai đang có mặt trong Workforce, trạng thái gì" — Companion (COO) đọc để điều phối
```

## 2. Workforce Roster schema

```ts
type WorkforceRosterEntry = {
  companionId: string;              // trỏ về AI Companion Registry
  department: DepartmentId;
  status: "designed" | "agent-ready" | "agent-live" | "retired";
  agentBinding?: {                   // rỗng nếu status = "designed" (chưa có Agent thật)
    capabilityId: string;            // trỏ về AI Capability Registry (OPEN_AI_WORKFORCE_PLATFORM.md)
    deploymentId?: string;           // trỏ về DeploymentRecord khi đã Deploy thật
  };
  onboardedAt: string;
  lastReviewedAt?: string;           // lần gần nhất Owner/Admin rà soát lại Profile Companion này
};

function getWorkforceRoster(): WorkforceRosterEntry[]   // hàm đọc-tổng-hợp, không ghi — giống getWorkforceRoster đã phác thảo ở OPEN_AI_WORKFORCE_PLATFORM.md §9, dùng chung 1 định nghĩa
```

## 3. Roster hiện tại (Workforce Level 1 — 30 entry)

| companionId | department | status | agentBinding.capabilityId |
|---|---|---|---|
| market-research-specialist | research-knowledge | designed | — |
| customer-research-specialist | research-knowledge | designed | — |
| fact-checker | research-knowledge | designed | — |
| knowledge-analyst | research-knowledge | designed | — |
| trend-scout | research-knowledge | designed | — |
| writer | content-communication | **agent-live** | `writing.draft` |
| editor | content-communication | designed | — |
| copywriter | content-communication | designed | — |
| translator | content-communication | designed | — |
| seo-specialist | content-communication | designed | — |
| strategy-specialist | business-strategy | designed | — |
| sales-specialist | business-strategy | designed | — |
| finance-specialist | business-strategy | designed | — |
| partnership-specialist | business-strategy | designed | — |
| designer | creative-design | designed | — |
| presentation-specialist | creative-design | designed | — |
| video-specialist | creative-design | designed | — |
| brand-specialist | creative-design | designed | — |
| developer | technology-automation | designed | — |
| qa-specialist | technology-automation | designed | — |
| automation-specialist | technology-automation | designed | — |
| integration-specialist | technology-automation | designed | — |
| excel-specialist | office-productivity | designed | — |
| word-specialist | office-productivity | designed | — |
| powerpoint-specialist | office-productivity | designed | — |
| dashboard-specialist | office-productivity | designed | — |
| report-specialist | office-productivity | designed | — |
| goal-coach | personal-growth | designed | — |
| reflection-coach | personal-growth | designed | — |
| learning-coach | personal-growth | designed | — |

*(Reviewer Agent giữ nguyên là 1 bước quy trình cross-cutting —
`agentBinding.capabilityId: "writing.review"`, `status: "agent-live"` —
không xuất hiện như 1 dòng roster riêng vì không phải 1 trong 30
Companion nghiệp vụ, xem ghi chú cuối `AI_COMPANION_REGISTRY.md`.)*

**29/30 = "designed"**, **1/30 = "agent-live"** (Writer) — phản ánh
đúng thực tế: MVP trước đó (`AI_AGENT_INTEGRATION_MVP.md`) chỉ kết nối
Agent thật cho đúng 1 Blueprint mẫu, sprint này chỉ **thiết kế** 29
Companion còn lại, không gọi AI thật cho bất kỳ ai trong số đó (đúng
ràng buộc "KHÔNG gọi AI thật" của brief).

## 4. Onboarding — cách Companion #31 trở đi gia nhập mà KHÔNG sửa hệ thống

Đây là phần trả lời trực tiếp yêu cầu #8. Quy trình 5 bước, tất cả đều
là **thêm dữ liệu vào Registry**, không sửa `WorkspaceMvp.tsx`, không
sửa `workspace-session-store.ts`, không sửa Companion (COO) orchestrator:

1. **Định nghĩa Companion mới** theo đúng khuôn 10 mục của
   `CompanionRegistryEntry` (Mission/Responsibility/.../Supported
   Blueprint Types) — thêm 1 entry vào `AI_COMPANION_REGISTRY.md`,
   `status: "designed"`.
2. **Gắn vào đúng 1 trong 7 Department đã khóa** — nếu nhu cầu mới
   không khớp Department nào trong 7, đó là tín hiệu cần xem lại phạm
   vi Department (hiếm, cần quyết định của Owner/Admin, không tự động).
3. **(Tuỳ chọn) Nối Agent thật** — nếu muốn Companion mới có Agent thật
   chạy, làm theo đúng chu trình `OPEN_AI_WORKFORCE_PLATFORM.md` §10
   (đăng ký Provider/Capability → Benchmark → Certify → Deploy) rồi cập
   nhật `agentBinding` trong Roster. Nếu chưa cần Agent thật ngay,
   Companion vẫn hợp lệ ở `status: "designed"` (đóng vai trò hướng dẫn
   thủ công / checklist cho Owner, giống 29 Companion hiện tại).
4. **Thêm vào Collaboration Matrix** — khai báo `receivesFrom`/
   `handsOffTo` trong `AI_COMPANION_COLLABORATION.md`, và nếu Companion
   phục vụ 1 Blueprint cụ thể, chèn vào đúng vị trí trong chuỗi ở §3 của
   file đó.
5. **Cập nhật Roster** (`AI_WORKFORCE_REGISTRY.md` §3) — thêm 1 dòng.
   Companion (COO) đọc Roster này để biết Companion nào tồn tại; vì
   Roster là dữ liệu (không phải code rẽ nhánh cứng), Companion (COO)
   không cần sửa logic để "biết" về Companion mới.

**Điều kiện để bước 5 hoàn toàn không đụng code**: khi Registry được cài
đặt thật (Sprint cài đặt sau, không phải sprint này), Companion (COO)
phải đọc Roster qua 1 hàm chung (`getWorkforceRoster()`), **không** được
hard-code danh sách 30 tên Companion trong logic điều phối — đây là yêu
cầu kiến trúc bắt buộc cho Sprint cài đặt kế tiếp, ghi nhận ở đây để
không bị quên.

## 5. Ai được quyền Onboard (kiểm soát, không tự động)

- **Không Companion nào tự thêm Companion khác vào Roster.**
- Việc thêm Companion mới là hành động của **Admin/Owner** (qua 1 quy
  trình thiết kế — không phải Agent tự chạy), giữ đúng nguyên tắc "AI
  Agent không được tự ý mở rộng Workforce" đã khóa từ
  `OPEN_AI_WORKFORCE_PLATFORM.md` §8.
- Learning Coach/Trend Scout **có thể đề xuất** "Owner có vẻ cần thêm 1
  Companion về X" (dựa trên nhu cầu lặp lại chưa có Companion phụ
  trách) — nhưng đó chỉ là **gợi ý**, quyết định Onboard vẫn thuộc
  Admin/Owner.

## 6. Known Limitations (Workforce Level 1)

1. 29/30 Companion chưa có Agent thật — hoạt động như checklist/hướng
   dẫn quy trình cho Owner tự làm hoặc chờ Sprint cài đặt tiếp theo nối
   Agent thật qua Deployment Framework.
2. Roster hiện là tài liệu tĩnh (Markdown), chưa phải store runtime —
   Sprint cài đặt sẽ cần 1 file `.ts` (`workforce-registry.ts`, tương tự
   `mission-catalog.ts`) để Companion (COO) đọc được thật, việc này
   **không nằm trong phạm vi sprint thiết kế hiện tại**.
3. Không có cơ chế "retire" một Companion thật (`status: "retired"` mới
   là giá trị enum, chưa có quy trình vận hành retire — sẽ thiết kế
   cùng lúc với Sprint cài đặt AI Lifecycle thật).
