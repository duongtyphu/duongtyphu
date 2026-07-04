# Connected Learning Ecosystem

Sprint 02 — kiến trúc kết nối toàn bộ Portal thành một hệ thống duy nhất.
Không thêm tính năng lớn, không thêm AI Agent/Chat/API. Chỉ chuẩn hóa CTA,
Context, và các điểm kết nối giữa module.

## 1. Product Vision

Portal không phải tập hợp nhiều trang rời rạc — Portal là một hệ sinh thái
học tập. Mỗi module có nhiệm vụ riêng, nhưng Companion là lớp điều phối
xuyên suốt, và Workspace là nơi mọi hành trình hội tụ thành kết quả thật.

```
Companion (AI Layer — không phải menu, không phải chatbot)
   ↓
Học viện AI (HỌC)  →  AI Workspace (LÀM)  →  Thư viện tri thức (TRA CỨU)
   ↓                        ↓                        ↓
                       Workspace (nơi hội tụ)
                             ↓
      Nhật ký học tập → Hành trình của tôi → Khu vườn của bạn
```

## 2. Vai trò từng module

| Module | Route | Vai trò |
|---|---|---|
| Companion | mọi route | AI Layer — xuất hiện khi cần, không phải chatbot/menu |
| Học viện AI | `/portal/academy` | HỌC — lộ trình, hành trình, mission, bài tập thực hành |
| AI Workspace | `/portal/khong-gian-ai` | LÀM — Companion Desk, workspace mẫu, workflow, prompt, toolbox |
| Thư viện tri thức | `/portal/library` | TRA CỨU — framework, checklist, SOP, case study, prompt, template |
| Workspace | `/portal/workspace` | Nơi HỘI TỤ — không thuộc module nào, nơi Companion cùng người dùng tạo kết quả |
| Nhật ký/Hành trình/Khu vườn | — | Ghi nhận Growth Event, chưa xử lý sâu trong sprint này |

## 3. Universal Companion Entry — CTA chuẩn hóa

Mọi CTA "thực hành/giao việc/dùng ngay cùng Companion" trên toàn Portal chỉ
gọi **một** hàm duy nhất:

```ts
startCompanionWorkspace(context) // src/lib/portal/companion-workspace.ts
```

Hàm này: lưu context vào `sessionStorage` (`vdai_workspace_context`), ghi
một Growth Event `WORKSPACE_STARTED` vào `localStorage`, rồi trả về URL
`/portal/workspace?...` để component `router.push()`. Không component nào
tự viết logic điều hướng riêng.

### CTA labels chuẩn (theo Product spec)

| Label | Dùng ở |
|---|---|
| "Thực hành cùng Companion" | Học viện AI (Journey, bài học, Lộ trình học AI, Học theo nhu cầu) |
| "Bắt đầu cùng Companion" / "Bắt đầu Mission" | Học viện AI (Mission pilot) |
| "Dùng ngay cùng Companion" / "Dùng Prompt này" / "Dùng cùng Companion" | Thư viện tri thức, Prompt Library, AI Toolbox |
| "Giao việc cho Companion" | Companion Desk, Companion Task Entry (mọi module) |
| "Bắt đầu Workspace" | AI Workspace — Workspace đề xuất |

### Nơi đã hợp nhất trong Sprint 02

Trước sprint này, Portal có **hai cơ chế song song không liên thông**:
- `startCompanionWorkspace` — chỉ dùng ở AI Workspace, điều hướng sang
  `/portal/workspace`.
- `pushCompanionIntent` — dùng ở Học viện AI/Thư viện tri thức, chỉ mở
  floating Companion Quick Panel tại chỗ, không điều hướng, không lưu
  context bền — một CTA dựng bằng cơ chế này không có tác dụng gì ở phía
  bên kia.

Sprint 02 hợp nhất mọi CTA "thực hành thật" (đưa người dùng vào Workspace)
về `startCompanionWorkspace`:

- `CompanionTaskEntry.tsx` (dùng chung ở Academy/CKOS/Opportunities) —
  chuyển từ `pushCompanionIntent` sang `startCompanionWorkspace` +
  `router.push`.
- `JourneyCard.tsx` ("Bắt đầu Mission") — chuyển sang `startCompanionWorkspace`
  với `module: "academy"`, `itemType: "learning_path"`.
- `LandingPageMissionPilot.tsx` ("Bắt đầu Mission") — chuyển sang
  `startCompanionWorkspace` với `itemType: "mission"` (type mới thêm).
- `KnowledgeWorkspace.tsx` ("Thực hành cùng Companion", "Nhờ Companion gợi
  ý bước tiếp theo") — chuyển sang `startCompanionWorkspace` với
  `module: "ckos"`, `itemType: "knowledge_seed"` (type mới thêm).

`pushCompanionIntent` (event bus nhẹ) **không bị xoá** — vẫn còn dùng cho
`CompanionTaskEntryPanel.tsx` (form bên trong floating Companion Quick
Panel — đây là giao diện riêng của Companion presence, không phải CTA của
một trang cụ thể) và `OpportunityAgentActions.tsx` (ngoài phạm vi 4 module
chính của sprint này — Dự án & Cơ hội không nằm trong sơ đồ Companion → Học
viện AI → AI Workspace → Thư viện tri thức → Workspace). Không đổi hành vi
này để tránh phá UI ngoài phạm vi sprint.

## 4. Context — luôn biết người dùng đến từ đâu

`WorkspaceContext` (`src/lib/portal/companion-workspace.ts`):

```ts
{
  module: PortalModule,      // "academy" | "khong-gian-ai" | "ckos" | ...
  source: string,             // nơi CTA được bấm, vd "academy-journey"
  title?: string,
  userGoal?: string,
  itemId?: string,
  itemType?: WorkspaceItemType, // work_need | workspace | workflow | prompt
                                 // | tool | learning_path | resource
                                 // | mission | knowledge_seed
  expectedOutput?: string,
  routeFrom: string,          // route gọi CTA (tự điền)
  timestamp: string,          // tự điền
}
```

`module` giờ dùng chung `PortalModule` (đã có sẵn cho Companion
Orchestrator) thay vì literal `"ai-space"` cũ — để một context có thể đến
từ Học viện AI, Thư viện tri thức, hay AI Workspace và vẫn được
`/portal/workspace` hiểu đúng nguồn gốc.

## 5. Workspace — nơi hội tụ

`/portal/workspace` (`WorkspaceMvp.tsx`) không thuộc Học viện AI, AI
Workspace hay Thư viện tri thức. Nó:

- Đọc context từ `sessionStorage` (ưu tiên) hoặc query params (dự phòng
  khi mở link trực tiếp/chia sẻ) — bao gồm cả `module` mới.
- Hiển thị breadcrumb và nút "Quay lại [module]" đúng theo `context.module`
  (không còn cứng "Không gian AI" cho mọi nguồn).
- Hiển thị "Kế hoạch bước đầu" + khung "Kết quả sẽ hiển thị tại đây" (chưa
  xử lý AI thật — giữ nguyên từ Sprint 01).

### Companion chủ động gợi ý (Knowledge Loop)

Khi context đến từ AI Workspace → Companion gợi ý quay lại Học viện AI nếu
thiếu kiến thức. Khi đến từ Học viện AI hoặc Thư viện tri thức → Companion
gợi ý sang AI Workspace để thực hành/áp dụng. Đây là gợi ý tĩnh theo
`module` gốc (bảng `COMPANION_SUGGESTION` trong `WorkspaceMvp.tsx`) — sprint
này CHƯA xây logic gợi ý thông minh (theo đúng yêu cầu), chỉ đặt đúng vị trí
kiến trúc để sprint sau có thể thay bằng logic thật.

## 6. Companion Appearance — không phải popup

Companion presence (`CompanionPresence.tsx`, đã có từ trước) tiếp tục quyết
định khi nào xuất hiện dựa trên: nudge tĩnh theo route
(`route-context.ts`), Presence Coordinator (`choosePresenceMoment`) điều
phối greeting/thought/story/micro-reaction/return-after-silence có cooldown
— không đổi trong sprint này. Sprint 02 chỉ đảm bảo: khi người dùng bấm một
CTA thực hành thật, họ luôn được đưa vào đúng Workspace với đúng Context,
thay vì một số CTA "biến mất" vào floating panel còn số khác điều hướng đi
nơi khác.

## 7. Knowledge Loop tổng thể

```
Học viện AI (Học bài / chọn lộ trình)
   → Thực hành cùng Companion
   → Workspace (Companion nhận Context)
   → Tạo kết quả thật
   → Lưu Growth Event (WORKSPACE_STARTED)
   → [Nhật ký học tập / Hành trình / Khu vườn — đọc Growth Event, sprint sau]

AI Workspace (đang làm, thiếu kiến thức)
   → Companion gợi ý quay lại Học viện AI

Thư viện tri thức (tra cứu xong)
   → Dùng ngay → Workspace → áp dụng thật
```

## 8. Không làm trong sprint này

Không thêm AI API, không thêm Agent thật, không thêm chatbot, không popup
mới, không đổi menu/route, không phá UI hiện có. `pushCompanionIntent`/
floating Companion Quick Panel vẫn giữ nguyên cho phạm vi ngoài 4 module
chính (Dự án & Cơ hội) và cho giao diện riêng của Companion presence.
