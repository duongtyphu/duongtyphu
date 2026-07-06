# PORTAL 3.0 — P.4 CKOS Experience

Status: **implemented (v1)**

Nguyên tắc chủ đạo của phase này: **CKOS là bộ não tri thức của Companion, không phải thư viện, không
phải blog.** Mọi số liệu hiển thị trong tài liệu và trong sản phẩm dưới đây đều là **số liệu thật, đọc
trực tiếp từ production** tại thời điểm viết — không có số liệu bịa.

---

## 1. Route mới

`src/app/portal/ckos/page.tsx` — trang CKOS Experience Dashboard, Server Component, không đụng
`PortalShell`/`PortalHeader`/`PortalSidebar` (không thêm sidebar item mới, truy cập qua nút "Mở CKOS"
mới thêm ở Dashboard và các nút "Xem" trong khối CKOS quick access).

---

## 2. Tình trạng dữ liệu THẬT tại production (xác nhận qua anon-key trực tiếp, không giả định)

| Canonical type | Bảng | Trạng thái live | Ghi chú |
|---|---|---|---|
| Tool | `tools` | **1 dòng thật** (`tool_1` = ChatGPT) | Production table, không phải `ckos_tools` |
| Lesson | `lessons` | **1 dòng thật** | Production table |
| Case Study | `case_studies` | **0 dòng** | Bảng canonical đã tồn tại (Phase F), nhưng Phase H.7's 8 item dry-run CHƯA được apply |
| Prompt | `ckos_prompt_templates` | **Bảng không tồn tại** | `PGRST205` — Phase G/H.4 schema SQL chưa được apply lên production |
| Workflow | `ckos_workflows` | **Bảng không tồn tại** | `PGRST205` — chưa apply |
| Best Practice | `ckos_best_practices` | **Bảng không tồn tại** | `PGRST205` — chưa apply |
| Resource | `ckos_resources` | **Bảng không tồn tại** | `PGRST205` — chưa apply |

Xác nhận trực tiếp bằng `curl` anon-key vào Supabase REST trước khi viết code — không suy đoán từ báo
cáo các phase trước. Điều này đồng nghĩa: **CKOS Experience hôm nay hiển thị 2/7 danh mục có dữ liệu
thật, 5/7 danh mục ở trạng thái "Trống" thật** — đúng như yêu cầu 2 của brief ("nếu production chưa có
dữ liệu → empty state thật, không fake").

---

## 3. CKOS Dashboard

`src/app/portal/ckos/page.tsx` lắp ráp:

1. **Quick Search** (`CkosQuickSearch.tsx`) — xem mục 4.
2. **Companion Recommendation** — dùng `getHumanFlowState()` (cùng engine thật đã dùng ở Companion
   Experience P.3), không tạo state mới.
3. **Continue Learning** (`CkosJourneyStatus.tsx`) — dùng `getJourneyProgress()` (`foundation/growth-view.ts`,
   đọc `WorkspaceSession` thật, trả rỗng nếu chưa có hoạt động).
4. **Recently Viewed** — **không có tính năng theo dõi lịch sử xem trong codebase hiện tại** (đã grep
   xác nhận, không có view-tracking system nào tồn tại). Hiển thị trạng thái thật: "CKOS chưa có tính
   năng theo dõi lịch sử xem" — không vẽ danh sách giả.
5. **Suggested Knowledge** — lấy 1 tool Published thật (`toolsAdminSeed`, có `ChatGPT`) làm gợi ý.
6. **Knowledge Categories** — 7 thẻ, mỗi thẻ query `count(*)` thật cho bảng tương ứng (xem bảng mục 2),
   badge hiển thị số thật hoặc "Trống" khi 0.
7. **Featured Collections** — 6 bộ sưu tập theo **chủ đề/mục tiêu** (không phải category kỹ thuật):
   AI Writing, Productivity, Affiliate, Prompt Engineering, Marketing, Automation. Mỗi collection là
   một điểm vào Quick Search với từ khoá gợi ý sẵn (`/portal/ckos?q=...`) — không gán số đếm giả cho
   từng collection vì dữ liệu thật hiện có (1 Tool, 1 Lesson) chưa đủ để tính một con số ý nghĩa cho
   từng chủ đề; thà không hiển thị số còn hơn hiển thị số bịa.

---

## 4. CKOS Search

**Search Runtime đã tồn tại một phần** — `/api/v1/ckos/search` (Phase G.3) là một cross-table fan-out
thật (query song song `ckos_goals`/`ckos_prompt_templates`/`ckos_workflows`/`ckos_best_practices`/
`case_studies`/`tools`, lọc theo `q`, gộp kết quả trong bộ nhớ, KHÔNG xếp hạng theo độ liên quan, KHÔNG
index). Đây chính là "Search Runtime chưa hoàn thành" mà brief nhắc tới.

**Quyết định**: thay vì xây thêm một Search Runtime mới (bị cấm ở mục Không), `CkosQuickSearch.tsx` nối
trực tiếp vào endpoint thật này — verify sống bằng `curl`:
```
curl "http://localhost:3000/api/v1/ckos/search?q=chatgpt"
→ {"items":[{"type":"tool","id":"tool_1","title":"ChatGPT", ...}],"total":1}
```
UI hiển thị rõ disclaimer trung thực: *"Search hiện đang ở mức nền tảng — tìm theo từ khoá xuất hiện
trong tiêu đề, chưa xếp hạng theo mức độ liên quan."* — không giả vờ đây là semantic search hay có
relevance ranking.

---

## 5. Related Knowledge — chuẩn bị vị trí cho 7 loại quan hệ

`src/components/portal/ckos/RelatedKnowledgePanel.tsx` — component dùng chung, nhận 7 prop tuỳ chọn
(`tools`/`prompts`/`workflows`/`resources`/`lessons`/`bestPractices`/`caseStudies`). Mỗi prop rỗng/`undefined`
→ hiển thị empty state riêng cho đúng loại quan hệ đó (không gộp chung một empty state mơ hồ).

**Đã lắp** làm bản mẫu tham chiếu tại `/portal/tools/[id]` (trang chi tiết Tool) — đây là route hiện có
duy nhất phù hợp để chứng minh pattern trong thời gian còn giới hạn của phase này:
- **Related Prompt**: nếu `tool.relatedPromptId` có giá trị thật (field đã tồn tại trong
  `AdminTool` type) → hiển thị 1 item thật, không bịa tiêu đề chi tiết (chỉ dùng nhãn chung "Prompt gợi
  ý dùng cùng công cụ này" trỏ đúng `id` thật).
- **Related Resource**: tương tự với `tool.relatedResourceHref` nếu có.
- **5 loại còn lại** (Tool/Workflow/Lesson/Best Practice/Case Study liên quan): **không có trường quan
  hệ nào trong dữ liệu Tool hiện tại** → hiển thị empty state thật ("Chưa có ... — quan hệ này chưa
  được thiết lập cho mục này").

Với `ChatGPT` (tool duy nhất có thật), `relatedPromptId`/`relatedResourceHref` hiện đều rỗng trong dữ
liệu seed → khi mở `/portal/tools/chatgpt`, cả 7 ô đều hiển thị empty state thật. Đây là trạng thái
chính xác của dữ liệu hôm nay, không phải lỗi.

**Việc còn lại** (ngoài phạm vi P.4): lắp `RelatedKnowledgePanel` vào các trang chi tiết còn lại
(Prompt/Workflow/Resource/Lesson/Best Practice/Case Study detail) khi các trang đó tồn tại và khi dữ
liệu quan hệ thật được áp dụng lên production (H.3–H.8 vẫn ở trạng thái dry-run).

---

## 6. Design System (P.2) — dùng thật, không có markup rời

Toàn bộ trang `/portal/ckos` và `RelatedKnowledgePanel` dùng: `PageHeader`, `SectionHeader`, `GemCard`,
`GemBadge`, `Button` (`primary`/`secondary`) — không viết class Tailwind rời cho card/badge/heading nào
mới trong phase này.

---

## 7. Giới hạn tuân thủ (theo brief)

- Không có số liệu/tiến độ/thống kê giả — mọi count là `count(*)` thật hoặc rỗng/undefined trung thực.
- Không đổi schema Supabase, không migrate production (không có `INSERT`/`ALTER TABLE` nào trong phase này).
- Không xây Search Runtime mới — tái sử dụng route Phase G.3 đã có, chỉ nối UI vào.
- Không đụng `PortalShell`/`PortalHeader`/`PortalSidebar`/`hubs.ts` — route mới truy cập qua liên kết
  trong nội dung trang (Dashboard → "Mở CKOS"), không thêm sidebar item.

---

## 8. Verification

- `tsc --noEmit`: clean trên toàn bộ file thay đổi/mới.
- `eslint`: clean (1 warning có sẵn từ trước, không liên quan — `<img>` ở trang Tool detail, không phải
  do phase này gây ra).
- `next dev`: boot không lỗi; `curl` xác nhận `/portal/ckos`, `/portal/tools/chatgpt`, `/portal` đều
  trả 307 redirect `/login` đúng như mọi route Portal khác (không có 500); `curl` trực tiếp
  `/api/v1/ckos/search?q=chatgpt` và `/api/v1/ckos/tools` xác nhận dữ liệu thật trả về đúng.
- Responsive: mọi grid dùng cùng pattern mobile-first đã thiết lập (`sm:grid-cols-2 lg:grid-cols-3/4`),
  không phát sinh breakpoint mới.

---

## 9. Nợ hiển thị còn lại (visual/data debt)

1. 5/7 danh mục CKOS (Prompt/Workflow/Resource/Best Practice — và Case Study dù có bảng nhưng 0 dòng)
   sẽ hiển thị "Trống" cho tới khi một Product Owner duyệt apply SQL từ Phase H.3–H.8 lên production.
2. Featured Collections hiện không có số đếm hiển thị (xem mục 3.7) — khi đủ dữ liệu thật, có thể tính
   count thật bằng cách gọi `/api/v1/ckos/search?q=<keyword>` phía server và hiển thị `total` thật.
3. `RelatedKnowledgePanel` mới lắp ở 1/7+ trang chi tiết (Tool) — cần lắp thêm khi các trang chi tiết
   khác (Prompt/Workflow/Resource/Lesson/Best Practice/Case Study) có route riêng.
4. Recently Viewed cần một view-tracking system thật (chưa tồn tại) trước khi có thể hiển thị nội dung
   — hiện đang cố ý để trống trung thực thay vì xây tính năng theo dõi mới (ngoài phạm vi P.4).
