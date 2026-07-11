# CKOS MANAGEMENT — IMP-ADM-004 (ADM-SPR-004, CKOS Management Canonicalization)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Sprint thứ tư của EPIC-02, thực thi theo **Founder Decision (Mandatory)**: mọi Admin/CRUD/UI/dữ liệu tồn tại trước đây được coi là prototype, có thể loại bỏ; không cần tương thích ngược; không cần migration; ưu tiên chất lượng kiến trúc hơn tương thích. Sprint này hoàn tất việc canonical hóa mà ADM-SPR-003 đã cố tình để lại dang dở (4 module Tools/Prompts/Resources/Case Studies được giữ nguyên CRUD cũ vì lo ngại mất dữ liệu — lo ngại đó không còn hiệu lực theo quyết định của Founder).

**Kết quả:** tất cả 9 module CKOS (thực tế 13 collection — Resources có 4 collection anh em: Template/Ebook/Checklist/SOP) giờ dùng chung **một** framework, **một** editor, **một** metadata standard, **một** lifecycle, **một** relationship model, **một** hệ tìm kiếm, **một** version model. Không còn CRUD/editor/metadata form nào bị trùng lặp trong phạm vi CKOS.

---

## 1. Canonical CKOS Framework

Tất cả 13 collection giờ đi qua **`KnowledgeCrudPage`** (`src/components/admin/ckos/KnowledgeCrudPage.tsx`) — cấu hình hoàn toàn khai báo (declarative), mỗi trang chỉ truyền props, không viết lại logic:

| # | Module | Route | Collection | Cách bảo toàn tương thích với Portal |
|---|---|---|---|---|
| 1 | Goals | `/admin/ckos/goals` | `ckos-goals` | Module mới, không cần bảo toàn gì |
| 2 | Tools | `/admin/tools` | `tools` (bảng Supabase thật) | `titleKey="name"`, `summaryKey="shortDescription"`, `bodyKey="longDescription"` |
| 3 | Prompts | `/admin/prompts` | `prompts` (bảng Supabase thật) | `summaryKey="description"`, `bodyKey="content"` |
| 4 | Workflows | `/admin/ckos/workflows` | `ckos-workflows` | Module mới |
| 5 | Evaluations | `/admin/ckos/evaluations` | `ckos-evaluations` | Module mới |
| 6 | Resources | `/admin/resources` | `resources` (bảng Supabase thật) | `titleKey="name"`, `summaryKey="description"` |
| 6a | — Template | `/admin/templates` | `templates` (bảng Supabase thật) | như trên |
| 6b | — Ebook | `/admin/ebooks` | `ebooks` (bảng Supabase thật) | như trên |
| 6c | — Checklist | `/admin/checklists` | `checklists` (bảng Supabase thật) | như trên |
| 6d | — SOP | `/admin/sop` | `sop` (bảng Supabase thật) | như trên |
| 7 | Case Studies | `/admin/case-study` | `case-study` → bảng `case_study` (jsonb, đã có sẵn, trước đây orphan) | Xem §12 — có đánh đổi thật, đã ghi rõ |
| 8 | Best Practices | `/admin/ckos/best-practices` | `ckos-best-practices` | Module mới |
| 9 | FAQs | `/admin/ckos/faqs` | `ckos-faqs` | Module mới |

**CrudPage.tsx (framework cũ) vẫn còn**, nhưng **không còn trang CKOS nào dùng nó** — chỉ còn phục vụ ~20 trang Admin ngoài phạm vi CKOS (orders, coupons, leads, blog, roadmap, v.v.), đúng ranh giới sprint này ("all 9 CKOS modules share ONE architecture" — không yêu cầu hợp nhất với các trang ngoài CKOS).

---

## 2. Shared CRUD

List → Detail(modal) → Create → Edit → Delete → Duplicate → Archive — giống hệt nhau ở cả 13 collection, không có bản sao nào. Điểm khác biệt duy nhất giữa các module là **cấu hình field**, không phải code logic.

**Cơ chế bảo toàn tương thích Portal (kỹ thuật cốt lõi của sprint này):** `KnowledgeCrudPage` nhận `titleKey`/`summaryKey`/`bodyKey` tùy chọn — 3 field UI "Title/Summary/Body" luôn hiển thị giống nhau, nhưng khi lưu, được ghi vào đúng tên field vật lý mà Portal/CKOS Runtime đang đọc (VD: Tools ghi `name` thay vì `title`). Nhờ vậy có thể canonical hóa hoàn toàn UI/UX mà **không cần đổi bất kỳ dòng code Portal nào** và **không làm hỏng dữ liệu cũ**.

Các field trình bày riêng của từng module (VD: Tools có `pricing`/`ctaLink`/`rating`; Case Studies có `client_name`/`result_metric`) được giữ lại qua prop `extraFields` (tái sử dụng `FieldConfig` từ `src/lib/admin/fields.ts` — không phát minh kiểu dữ liệu mới), render trong khối "Trường riêng của module này" trong form.

---

## 3. Shared Editor

Không đổi so với ADM-SPR-003: `KnowledgeEditor` (Markdown + thanh công cụ định dạng: đậm/nghiêng/tiêu đề/danh sách/khối code/liên kết/hình ảnh/video/tệp đính kèm) — giờ dùng cho field Body của **cả 13 collection**, kể cả 4 module vừa canonical hóa (Tools' `longDescription`, Prompts' `content`, Resources' để trống chờ mở rộng, Case Studies' `body`). Không có editor riêng cho module nào.

---

## 4. Shared Metadata

Mọi item ở cả 13 collection giờ đều có đủ 11 field bắt buộc: Title, Slug, Summary, Category, Tags, Status, Version, Author, Reviewer, Publish Date, Updated Date — không ngoại lệ (đúng yêu cầu Task 3 "No exceptions"). Với Tools/Prompts/Resources — các field này **cộng thêm** vào field trình bày cũ (`pricing`, `content`, v.v.), không thay thế; dữ liệu cũ (nếu còn) chỉ đơn giản có giá trị rỗng cho các field mới cho tới khi Admin sửa.

---

## 5. Shared Lifecycle

**Draft → In Review → Changes Requested → Approved → Published → Archived** — áp dụng cho cả 13 collection, kể cả 4 module trước đây chỉ có 3 trạng thái (Draft/Published/Hidden). Giá trị `"Published"` giữ nguyên chuỗi/ngữ nghĩa — mọi nơi Portal đang lọc `status === "Published"` tiếp tục hoạt động đúng. Giá trị `"Hidden"` cũ (nếu còn sót trên item cũ) không còn nằm trong danh sách chính thức nhưng không gây lỗi — Badge hiển thị tông xám mặc định cho tới khi Admin sửa lại Status, không có dữ liệu nào bị hỏng.

---

## 6. Shared Relationship

`RelationshipPicker` + `useAllKnowledgeCollections` giờ tìm kiếm xuyên suốt **toàn bộ 13 collection** (trước đây ADM-SPR-003 chỉ có 6/9 do Tools/Prompts/Resources chưa có field `title` đọc được an toàn — nay đã giải quyết triệt để nhờ `titleKey` alias). Case Studies cũng đã tham gia đầy đủ (trước đây đọc qua Server Action riêng, giờ đọc qua `useCollection` thống nhất như mọi module khác).

---

## 7. Shared Search

Không đổi kiến trúc so với ADM-SPR-003 — tìm theo Title/Summary/Tags, lọc Status/Category/Author, sắp xếp Updated Date — nay áp dụng đồng nhất cho cả 13 collection thay vì chỉ 5. Không có hệ tìm kiếm full-text riêng nào được thêm.

---

## 8. Shared Version

`version` + `changelog` (Task 7: Version/Previous Version/Change Log) nay có ở cả 13 collection. Trước đây Tools/Prompts/Resources/Case Studies không có khái niệm version — giờ mọi lần Sửa đều tự tăng version và (nếu Admin điền Ghi chú thay đổi) thêm một dòng changelog. Không xây diff engine (đúng brief).

---

## 9. Runtime Output Specification

Không đổi so với ADM-SPR-003 về mặt khái niệm — **`Published CKOS → CKOS Runtime → Companion`** — vẫn là đặc tả, chưa xây Runtime thật (đúng yêu cầu "No runtime implementation. Only canonical output model.").

**Điểm cập nhật quan trọng cho Tools/Prompts/Resources** (đã là bảng Supabase thật từ trước): CKOS Runtime hiện tại (6 route `/api/v1/ckos/*`) đọc trực tiếp bảng `tools` — tức là dữ liệu Admin vừa canonical hóa **đã** nằm đúng trên đường Runtime đọc, không cần thêm bước nào. Goals/Workflows/Evaluations/Best Practices/FAQs vẫn ở tầng `localStorage` như ADM-SPR-003 đã ghi — nối vào bảng `ckos_*` thật vẫn là việc của một sprint tương lai, một khi xác nhận được các bảng đó đã lên production.

---

## 10. Files Changed

**Sửa đổi (12 file):**
- `src/lib/admin/ckos/metadata.ts` — mở rộng `KnowledgeModuleDef` với `titleKey`/`summaryKey`/`bodyKey`/`resourceFamily`; đăng ký đủ 13 collection (9 module + 4 collection anh em của Resources).
- `src/components/admin/ckos/KnowledgeCrudPage.tsx` — viết lại: hỗ trợ key-alias (titleKey/summaryKey/bodyKey), `extraFields`/`extraColumns` (FieldConfig tái sử dụng từ `fields.ts`), `viewHref`, `aiAssist` (Companion viết giúp — port từ CrudPage để không mất tính năng khi migrate Prompts).
- `src/components/admin/ckos/RelationshipPicker.tsx` — đọc title qua `titleKey` per-module thay vì giả định field `title` cố định.
- `src/lib/admin/ckos/useAllKnowledgeCollections.ts` — viết lại: 13 lời gọi `useCollection` tường minh (không còn tách "canonical" vs "legacy"), bỏ nhánh Server Action riêng cho Case Studies.
- `src/app/admin/(dashboard)/ckos/page.tsx` (Dashboard) — tính toán số liệu từ cả 13 collection thống nhất, hiển thị số lượng theo từng module ngay trên thẻ liên kết.
- `src/app/admin/(dashboard)/tools/page.tsx`, `prompts/page.tsx`, `templates/page.tsx`, `ebooks/page.tsx`, `checklists/page.tsx`, `sop/page.tsx`, `resources/page.tsx`, `case-study/page.tsx` — viết lại hoàn toàn, chuyển từ CrudPage/ResourceManager/actions.ts riêng sang `KnowledgeCrudPage` dùng chung.

**Xóa (3 file — "No legacy CRUD remains"):**
- `src/app/admin/(dashboard)/case-study/actions.ts` — Server Actions cho bảng typed `case_studies`, không còn được dùng.
- `src/app/admin/(dashboard)/case-study/CaseStudyForm.tsx` — form tự viết riêng cho Case Studies, thay bằng `KnowledgeCrudPage`.
- `src/components/admin/ResourceManager.tsx` — wrapper CrudPage riêng cho họ Resources, không còn consumer nào sau khi 5 route Resources chuyển sang `KnowledgeCrudPage`.

**Không đổi (xác nhận không bị đụng tới):**
- `CrudPage.tsx`, `ContentManager.tsx` — vẫn phục vụ ~20 trang Admin ngoài CKOS.
- `src/data/admin/{tools,prompts,resources}.ts` — type `AdminTool`/`AdminPrompt`/`AdminResource` + seed data vẫn được **Portal** dùng trực tiếp (`/portal/tools`, `/portal/checklists`, `/portal/templates`, `AdminPromptsSection`, `reports`/`dashboard` Admin) — đã kiểm tra kỹ trước khi quyết định không xóa, dù các trang Admin CKOS không còn import chúng nữa.
- Database, migration, Portal UI, Companion Runtime — không đổi.

---

## 11. Verification

- **Lint (`npm run lint`):** 0 lỗi, 5 warning có từ trước (không liên quan sprint này).
- **Type-check + Build (`npm run build`):** thành công, toàn bộ route biên dịch, bao gồm 8 route CKOS vừa viết lại + 6 route CKOS mới từ sprint trước.
- **Test (`npm run test`):** 139/139 pass, không regression.
- **Route CKOS Admin (curl qua dev server):** cả 9 route (tools/prompts/templates/ebooks/checklists/sop/resources/case-study/ckos) trả về 200 (chuyển hướng login đúng thiết kế), không lỗi 500.
- **Route Portal liên quan (curl qua dev server):** `/portal/tools`, `/portal/case-studies`, `/portal/templates`, `/portal/checklists`, `/portal/resources`, `/portal/prompts` đều trả về 200 — xác nhận việc canonical hóa Admin không làm hỏng đường biên dịch/route của Portal (không thể xác minh nội dung hiển thị thực tế do sandbox không có Supabase credentials để đăng nhập/tạo dữ liệu thật).

---

## 12. ADM-SPR-005 Readiness

**SẴN SÀNG có điều kiện** — với một điểm quan trọng cần PMO/Founder biết rõ trước khi coi sprint này là "xong hoàn toàn":

### Đánh đổi thật duy nhất của sprint này: Case Studies

Theo đúng chỉ đạo của Founder ("Legacy Data: DISCARD... Architecture quality has higher priority than compatibility"), Case Studies được chuyển từ bảng typed `case_studies` (Portal `/portal/case-studies` đang đọc trực tiếp) sang bảng jsonb `case_study` đã có sẵn trong hệ thống (dùng chung kiến trúc với 12 collection còn lại). Hệ quả cụ thể:

- **Case study đã publish trước đây (trong bảng `case_studies` cũ) vẫn hiển thị bình thường trên Portal** — bảng đó không bị xóa, không bị đổi.
- **Case study soạn mới qua Admin từ sprint này trở đi sẽ CHƯA xuất hiện trên `/portal/case-studies`** cho tới khi có một sprint riêng (ngoài phạm vi Admin CMS, cần đụng Portal) cập nhật đường đọc của trang đó sang bảng `case_study` mới.
- Đây là lựa chọn có chủ đích, đúng tinh thần "architecture quality > compatibility" — không phải sự cố ngoài ý muốn. Được cân nhắc kỹ hai phương án khác (giữ bảng typed cũ + xây adapter riêng cho Case Studies, hoặc ALTER TABLE thêm cột vào bảng cũ) và chọn phương án này vì không cần chạy migration nào (đúng "Migration: NOT REQUIRED"), không cần quyền truy cập Supabase mà sandbox này không có.

**Khuyến nghị cụ thể cho ADM-SPR-005 hoặc một sprint Portal riêng:** cập nhật `src/app/portal/case-studies/page.tsx` (dòng `.from("case_studies")`) sang đọc bảng `case_study` mới — việc nhỏ, 1 dòng, nhưng đây là thay đổi Portal, cần được giao đúng phạm vi (sprint Admin CMS này không tự ý đụng Portal).

### Không có đánh đổi nào khác

Tools/Prompts/Resources (Template/Ebook/Checklist/SOP) hoàn toàn không có đánh đổi — dữ liệu cũ, đường đọc Portal, CKOS Runtime đều giữ nguyên 100%, chỉ thêm khả năng quản trị mới.

Không phát hiện vấn đề nào khác buộc phải chặn ADM-SPR-005.

---

## Phạm vi tuân thủ (Scope discipline)

Đúng theo Acceptance Criteria: cả 9 module (13 collection) dùng chung một kiến trúc; không còn CRUD/editor/metadata form/lifecycle/relationship nào bị trùng lặp trong phạm vi CKOS; build/test đều pass; tài liệu đã cập nhật phản ánh kiến trúc canonical cuối cùng. Không xây Companion Runtime, không đụng Academy/Premium/User Management/Analytics, không sửa Portal, không có tính năng ngoài CKOS.
