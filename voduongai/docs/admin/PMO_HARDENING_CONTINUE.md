# PMO RESOLUTION — Continue Production Hardening: Kết quả & Coverage Report

**Ngày:** 2026-07-13 · **Branch:** `claude/vietnamese-greeting-zkzn2p` · **PR:** #48
**Bối cảnh:** PMO đã làm rõ mâu thuẫn "không tính năng mới" vs "100% Portal Coverage" trong IMP-PRODUCTION-HARDENING-1201 — xây Admin Management cho chức năng Portal ĐÃ TỒN TẠI không tính là tính năng mới, được phép triển khai. Sprint này tiếp tục 7 Workstream PMO yêu cầu.

---

## 1. Tổng quan kết quả

| # | Workstream | Trạng thái |
|---|---|---|
| 1 | AI Workspace | **6/9 Section đã CMS-hoá** (Hero, Recommended Workspace, AI Workflow, Prompt Library, Resource, Footer CTA). 2 Section (AI Toolbox, Blog AI) + Companion Desk (không phải danh sách) vẫn hardcode — lý do kỹ thuật cụ thể ở mục 2. |
| 2 | Companion | **Không xử lý trong sprint này** — rủi ro runtime thật, xem mục 3. |
| 3 | Journey (Mission Presentation) | **Hoàn tất 100%** — Genome/Triết lý/Hiến chương/Sứ mệnh/Tiến hóa/Timeline nay CRUD thật tại `/admin/journey/mission`. |
| 4 | CKOS (Lesson Management) | **Sửa lỗi mất dữ liệu Admin** (đăng ký collection thật) — **CHƯA nối Portal đọc** do lệch shape dữ liệu, xem mục 4. |
| 5 | Premium | **2 gap thật đã vá**: Module visibility/sort_order UI, chặn checkout khoá "coming" ở tầng dữ liệu (không chỉ ẩn UI). |
| 6 | Projects & Opportunities | **Xác nhận lại 100%** — đã Canonical từ PROJECTS-SPR-602, không có gì mới cần làm. |
| 7 | Coverage Report | Xem mục 5-6 bên dưới. |

**Verification:** `npm run lint` (0 lỗi, 5 warning `<img>` cũ), `rm -rf .next && npm run build` (thành công, toàn bộ route mới build đúng: `/admin/ai-workspace/{settings,recommended,workflow,prompts,resource}`, `/admin/journey/mission`), `npm run test` (139/139 pass).

---

## 2. Workstream 1 — AI Workspace, chi tiết

**Đã CMS-hoá (collection Supabase thật, Admin CRUD tại `/admin/ai-workspace/*`):**
- Hero + Footer CTA → `ai-workspace-settings` (singleton, `/admin/ai-workspace/settings`)
- Workspace đề xuất (8 mục) → `ai-workspace-recommended`
- Quy trình AI (4 mục) → `ai-workspace-workflow`
- Prompt Library (12 mục) → `ai-workspace-prompts` — **collection RIÊNG**, cố ý không gộp vào bảng `prompts` (CKOS) hay `AI_PROMPTS` (khong-gian-ai) dù cùng khái niệm "Prompt" — hợp nhất 3-4 nguồn Prompt trùng tên là quyết định kiến trúc lớn hơn phạm vi 1 sprint (đã ghi nhận từ AIWS-SPR-501/STABILIZATION-SPR-1101), tạo CRUD đè lên 1 trong các nguồn cũ có rủi ro hỏng dữ liệu Portal khác đang đọc.
- Tài nguyên thực hành (4 mục) → `ai-workspace-resource`

**KHÔNG CMS-hoá (lý do kỹ thuật cụ thể, không phải bỏ sót):** AI Toolbox (`AI_TOOLS`) và Blog AI (`AI_ARTICLES`) trong `src/data/khong-gian-ai/index.ts` được dùng chung bởi `generateStaticParams()` ở 2 route con (`/portal/aiworkspace/[slug]`, `/portal/aiworkspace/bai-viet/[slug]`) — build-time static generation. Chuyển sang CMS đòi hỏi tách Server/Client giống pattern đã dùng cho `ecosystems`/`case-study` (STABILIZATION-SPR-1101/PROJECTS-SPR-602) **cho cả 2 route con này**, không chỉ trang chính — khối lượng công việc lớn hơn nhiều so với 6 Section đã làm, và rủi ro cao hơn vì đụng tới cơ chế build-time routing thật. Để lại nguyên trạng, ghi rõ trong Dashboard Admin thay vì rush.

---

## 3. Workstream 2 — Companion, lý do KHÔNG xử lý

Agent audit xác nhận: trong 5 khối brief liệt kê, **2 khối an toàn** (Persona text, Conversation Strategy) và **3 khối rủi ro thật**:
- **Orchestration Rules** — 5/8 rule có `companionMessage` là **hàm** (không serialize được sang jsonb) → CRUD-hóa buộc phải bỏ nội dung động hoặc xây mini-ngôn ngữ template, tức là **thay đổi hành vi Companion thật**, vi phạm chính "không sửa Product" của Mode này.
- **Agent Registry** — 32 agent ID được `orchestration-rules.ts` tham chiếu chéo; Admin đổi/xoá ID sẽ âm thầm làm rơi Agent khỏi kế hoạch, không báo lỗi.
- **Reflection Strategy** — gắn chặt với TypeScript union `ReflectionMeaning` (10 literal) dùng exhaustiveness-check ở engine khác.

Ngay cả 2 khối "an toàn" (Persona/Conversation Strategy) cũng đòi hỏi rewiring **5 component mount TOÀN CỤC trên mọi trang Portal** (`CompanionPresence`, `CompanionAvatar`, `CompanionGreetingBubble`, `CompanionQuickPanel`, `CompanionSpace`) từ static import sang hook runtime — đây là thay đổi chạm vào bề mặt hiển thị lớn nhất của Companion trên toàn Portal, và môi trường phiên này **không có trình duyệt tương tác để QA sau khi đổi**. Rủi ro một lỗi nhỏ ở đây sẽ hiện trên MỌI trang Portal, không giới hạn 1 khu vực — quyết định không rush, để nguyên trạng, ghi rõ lý do thay vì âm thầm bỏ qua yêu cầu PMO.

---

## 4. Workstream 4 — CKOS Lesson, chi tiết

Admin CRUD "Knowledge Seed" (`/admin/knowledge-seed`, collectionKey `knowledge-seed`) đã tồn tại từ trước nhưng **chưa từng đăng ký Supabase** → mọi lần Founder lưu chỉ vào localStorage (bug tương tự Website Global Settings/Media Center đã vá ở IMP-PRODUCTION-HARDENING-1201). **Đã sửa**: đăng ký `knowledge-seed` → bảng `knowledge_seed` thật (migration kèm theo).

**Chưa làm được — nối Portal đọc bảng này:** shape Admin hiện tại (`AdminKnowledgeSeed`: title/summary/goal/persona/problem/coreIdea/process/samplePrompt/checklist/caseStudy/exercise/tags — dạng bài viết phẳng) **khác về cấu trúc** so với shape Portal cần (`KnowledgeSeed`: steps[]/taxonomy/skills/aiTools/scenarios — dạng hành trình nhiều bước). Portal đọc qua `knowledge-seed.service.ts`, được gọi từ **Server Component** (`/portal/hetrithucai/[slug]`, `/portal/ckos`) — nối Portal đọc đòi hỏi vừa mở rộng type Admin (thêm field steps/taxonomy), vừa tách Server/Client cho 2 route Server Component đó. Đây là khối lượng công việc tương đương 1 sprint riêng — không rush trong lượt này, chỉ dừng ở "không còn mất dữ liệu Admin", chưa đạt "Founder edit → Portal hiện".

---

## 5. Portal Coverage / Workspace Coverage — % chi tiết theo khu vực

| Khu vực | % Coverage (Admin quản lý được → Portal hiển thị) | Thay đổi trong sprint này |
|---|---|---|
| Dự án & Cơ hội | 100% | Không đổi (đã Canonical) |
| Journey — Mission Presentation | 100% | **+100%** (từ 0%) |
| Premium — hạ tầng | ~95% | +2 gap fix (Module visibility/order, checkout status enforcement) |
| AI Workspace | ~65% | **+65%** (6/9 Section, từ 0%) |
| CKOS — Tool/Prompt/Resource/SOP | 100% | Không đổi |
| CKOS — Lesson | ~40% (ghi được, chưa hiện Portal) | +40% (từ 0% — trước sprint này ghi cũng mất) |
| Website Global Settings | Ghi thật, chờ migration | Không đổi (đã fix ở IMP-PRODUCTION-HARDENING-1201) |
| Media Center | Ghi thật, chờ migration | Không đổi |
| Cộng đồng | ~60% (External Links thật, Learning Spaces/News hardcode) | Không đổi |
| Companion | 0% | Không đổi — quyết định không xử lý (mục 3) |
| Sứ mệnh Companion | (đã tính vào Journey ở trên) | — |
| Học viện AI (catalog) | 0% | Không đổi — ngoài phạm vi 7 Workstream PMO liệt kê lần này |
| Brand & Theme runtime | 0% | Không đổi |

**Workspace Coverage (11 Workspace hiện có, không tạo mới):** không đổi số lượng — chỉ 2 Workspace (AI Workspace, Journey & Community) có thêm CRUD thật trong sprint này.

**Founder Management (đo bằng: bao nhiêu % nội dung Portal Founder sửa được KHÔNG cần code):** tăng đáng kể ở AI Workspace và Journey, nhưng **chưa đạt 100% toàn Portal** — Companion, Học viện AI catalog, CKOS Lesson (phần hiển thị), Brand/Theme runtime vẫn cần sửa code.

---

## 6. Kết luận — chưa đạt điều kiện để tiến Migration→Merge→Deploy

Theo đúng chỉ đạo PMO ("Chỉ khi đạt Portal Coverage = 100%, Workspace Coverage = 100%, Founder Management = 100% mới tiếp tục bước Migration→Merge→Deploy"):

**KHÔNG đạt 100% ở cả 3 tiêu chí** — Companion (0%), Học viện AI catalog (0%), Brand/Theme runtime (0%), CKOS Lesson hiển thị Portal (chưa nối), AI Toolbox/Blog AI (chưa CMS-hoá) đều còn tồn đọng với lý do kỹ thuật cụ thể (không phải trì hoãn tùy tiện).

**KHÔNG merge PR #48. KHÔNG deploy Production.** Đã cập nhật PR #48 với toàn bộ thay đổi sprint này — 4 migration SQL hiện cần chạy trước merge (Premium Learning Content, Projects & Opportunities, Production Hardening Collections, PMO Hardening Continue).

**Đề xuất cho lượt tiếp theo (nếu PMO tiếp tục yêu cầu):** ưu tiên (1) tách Server/Client cho AI Toolbox/Blog AI theo đúng pattern đã có tiền lệ, (2) mở rộng CKOS Lesson type + nối Portal, (3) Companion Persona/Conversation Strategy — CHỈ khi có trình duyệt tương tác để QA trực tiếp trước khi merge, do rủi ro global.
