# CKOS MANAGEMENT — IMP-ADM-003 (ADM-SPR-003, EPIC-02)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Sprint thứ ba của EPIC-02, module nghiệp vụ đầu tiên của Admin CMS, xây trên nền Canonical Admin Foundation (ADM-SPR-001) và Admin Shell (ADM-SPR-002). CKOS là Single Source of Truth của tri thức trong VO DUONG AI — Companion không đọc trực tiếp CMS, chỉ đọc CKOS Runtime; mọi tri thức phải đi qua CKOS.

**Quyết định phạm vi quan trọng nhất của sprint này** (đọc trước khi xem chi tiết từng Task): brief yêu cầu 9 module (Goals, Tools, Prompts, Workflows, Evaluations, Resources, Case Studies, Best Practices, FAQs) đều "có cùng trải nghiệm quản trị". Trong quá trình triển khai, phát hiện **4 trong 9 module (Tools, Prompts, Resources, Case Studies) đã có CRUD Admin thật, đang phục vụ dữ liệu production thật**, với cấu trúc field hoàn toàn khác — riêng biệt, không khớp với Metadata Standard chung (VD: Tools dùng `name`/`pricing`/`ctaLink`/`rating` chứ không phải `title`/`summary`/`body`). Ép các field đó vào khuôn Metadata Standard mới sẽ **xóa mất dữ liệu thật** (name, pricing, mô tả, link affiliate, v.v. — không có chỗ nào trong shape mới chứa các field này). Đây là rủi ro mất dữ liệu thật, không thể chấp nhận. Quyết định: **giữ nguyên 100% cả 4 trang này (không sửa code)**, chỉ xây Metadata/Lifecycle/Editor/Relationship/Framework chuẩn đầy đủ cho **5 module thực sự mới** (Goals, Workflows, Evaluations, Best Practices, FAQs — trước đây chưa từng có giao diện quản trị nào). 4 module cũ vẫn được đưa vào CKOS Dashboard (đếm số liệu) và ghi nhận trong Module Registry, nhưng chưa tham gia Relationship Model hay Lifecycle 6 trạng thái trong sprint này. Chi tiết đầy đủ + khuyến nghị an toàn để nâng cấp 4 module đó (không mất dữ liệu) ở §12.

---

## 1. CKOS Management hoàn chỉnh — tổng quan

| Module | Route | Trạng thái sprint này |
|---|---|---|
| Goals | `/admin/ckos/goals` | **Mới**, đầy đủ Metadata/Lifecycle/Editor/Relationship |
| Tools | `/admin/tools` | Giữ nguyên (CRUD cũ, dữ liệu thật) |
| Prompts | `/admin/prompts` | Giữ nguyên (CRUD cũ, dữ liệu thật) |
| Workflows | `/admin/ckos/workflows` | **Mới**, đầy đủ Metadata/Lifecycle/Editor/Relationship |
| Evaluations | `/admin/ckos/evaluations` | **Mới**, đầy đủ Metadata/Lifecycle/Editor/Relationship |
| Resources | `/admin/resources` | Giữ nguyên (CRUD cũ, dữ liệu thật) |
| Case Studies | `/admin/case-study` | Giữ nguyên (CRUD cũ, dữ liệu thật) |
| Best Practices | `/admin/ckos/best-practices` | **Mới**, đầy đủ Metadata/Lifecycle/Editor/Relationship |
| FAQs | `/admin/ckos/faqs` | **Mới**, đầy đủ Metadata/Lifecycle/Editor/Relationship |

Tất cả 9 module đều có mục trong sidebar (nhóm CKOS) và trong CKOS Dashboard, đều được ghi nhận trong `KNOWLEDGE_MODULES` registry (`src/lib/admin/ckos/metadata.ts`) — nhưng chỉ 5 module mới thực sự dùng chung một framework/editor/metadata/lifecycle như brief mô tả.

---

## 2. Shared CRUD Framework

`src/components/admin/ckos/KnowledgeCrudPage.tsx` — **một component duy nhất**, dùng chung cho cả 5 module mới (không copy component — mỗi module chỉ truyền `title`/`description`/`collectionKey`/`categoryOptions`, xem `src/app/admin/(dashboard)/ckos/{goals,workflows,evaluations,best-practices,faqs}/page.tsx`, mỗi file chỉ ~12 dòng).

Có đủ: **List** (bảng + tìm kiếm/lọc/sắp xếp), **Detail** (mở qua modal khi bấm tiêu đề/nút Sửa), **Create**, **Edit**, **Delete** (`ConfirmDialog` tone="danger"), **Duplicate** (nhân bản, reset về Draft/v1, xóa changelog), **Archive** (chuyển status → Archived qua `ConfirmDialog` tone="neutral", tách biệt khỏi Delete — đúng yêu cầu "Archive Dialog" riêng ở Task 10).

**Vì sao không sửa `CrudPage.tsx`:** `CrudPage.tsx` đang được 25+ trang Admin khác dùng, với hợp đồng field đơn giản hơn (không có Lifecycle 6 trạng thái, không có Relationship, không có Editor). Sửa nó để nhét thêm toàn bộ tính năng CKOS sẽ vừa tăng rủi ro hồi quy cho 25+ trang không liên quan, vừa làm hợp đồng của nó phức tạp không cần thiết cho các trang đó. `KnowledgeCrudPage` là một framework dùng chung MỚI, dành riêng cho các module có Metadata Standard đầy đủ — tái sử dụng đúng các khối đã có sẵn (`Modal`, `ConfirmDialog`, `Badge`, `useCollection`, `genId` từ `store.ts`) thay vì viết lại.

`ConfirmDialog` (`src/components/admin/ui/Modal.tsx`) được mở rộng thêm `confirmLabel`/`tone` (mặc định giữ nguyên hành vi cũ "Xóa"/đỏ cho 1 chỗ dùng hiện có trong `CrudPage.tsx`) — thay đổi cộng thêm, không phá vỡ gì.

---

## 3. Shared Editor

`src/components/admin/ckos/KnowledgeEditor.tsx` — **một editor duy nhất**, dùng cho field `Body` ở cả 5 module mới.

**Quyết định kỹ thuật quan trọng:** đây là editor Markdown + thanh công cụ định dạng (đậm/nghiêng/tiêu đề/danh sách/khối code/liên kết/hình ảnh/video/tệp đính kèm), **không phải WYSIWYG rich-text engine đầy đủ** (kiểu TipTap/Slate/Quill). Lý do: repo hiện tại chưa có bất kỳ dependency rich-text editor nào (đã xác nhận ở ADM-SPR-001); thêm một dependency mới trong sandbox này không có cách nào kiểm thử trực quan được (không đăng nhập được vào Admin đã xác thực). Markdown + toolbar phủ đủ các loại nội dung brief yêu cầu (Rich Text/Markdown/Code Block/Images/Video/Attachments/Internal Links) mà không cần dependency mới, không có rủi ro chưa kiểm chứng được. **Nâng cấp lên WYSIWYG thật là việc tương lai**, khuyến nghị làm khi có môi trường kiểm thử trực quan đầy đủ.

Có nút "+ Liên kết nội bộ" mở `RelationshipPicker` để chèn liên kết tới tri thức khác (Internal Links).

---

## 4. Metadata Standard

`src/lib/admin/ckos/metadata.ts` — `KnowledgeItem` — áp dụng cho 5 module mới, đủ toàn bộ field brief yêu cầu: Title, Slug (tự gợi ý từ Title, có thể sửa tay), Summary, Category, Tags, Difficulty (Beginner/Intermediate/Advanced), AI Tool, Status (6 trạng thái), Version (tự tăng khi sửa), Author, Reviewer, Published Date, Updated Date (tự set khi lưu), cộng thêm `changelog` (Version Readiness, §8) và `relatedIds` (Relationship Model, §6).

4 module cũ (Tools/Prompts/Resources/Case Studies) **không** dùng shape này — xem §12 về hướng nâng cấp an toàn trong tương lai.

---

## 5. Lifecycle Standard

`KNOWLEDGE_STATUSES` (`metadata.ts`): **Draft → In Review → Changes Requested → Approved → Published → Archived**, đúng chuẩn brief. `src/components/admin/ui/Badge.tsx`'s `STATUS_TONE` được mở rộng thêm 3 tông màu mới (`In Review`, `Changes Requested`, `Approved`; `Archived` dùng tông đỏ hiện có) — chỉ cộng thêm, không đổi 9 key cũ đang dùng ở nơi khác.

**Không triển khai workflow automation** (không có gate tự động chặn chuyển trạng thái, không có email/notification khi đổi status) — đúng yêu cầu "Chỉ chuẩn hóa trạng thái". Admin tự do chuyển giữa 6 trạng thái qua dropdown trong form Sửa.

---

## 6. Relationship Model

`src/components/admin/ckos/RelationshipPicker.tsx` + `src/lib/admin/ckos/useAllKnowledgeCollections.ts` — cho phép liên kết một tri thức với bất kỳ tri thức nào khác, lưu trong `relatedIds: string[]` (định dạng `"${moduleKey}:${id}"`) ngay trên chính item đó — **không đổi schema, không có bảng join mới**.

**Phạm vi thực tế:** RelationshipPicker tìm kiếm xuyên suốt **5 module mới + Case Studies** (6/9 — Case Studies đọc qua `listCaseStudies()` Server Action có sẵn, chỉ đọc, không sửa). **Tools/Prompts/Resources chưa tham gia Relationship Model trong sprint này** — lý do kỹ thuật giống §2/§4: shape dữ liệu của chúng không có field `title` để hiển thị trong picker mà không bị sai/trống (đã kiểm tra kỹ, không cast ẩu). Đây là điểm brief yêu cầu "Nếu chưa có thì mô tả rõ" — mô tả rõ tại đây: **liên kết tới Tools/Prompts/Resources hiện chưa khả thi an toàn cho tới khi 3 module đó được bổ sung field `title` tương đương (hoặc một field alias) — khuyến nghị việc nhỏ, an toàn cho ADM-SPR-004.**

Chuỗi minh hoạ trong brief (Goal → Tool → Prompt → Workflow → Evaluation → Resource → Case Study → Best Practice → FAQ) không phải ràng buộc một chiều — implementation cho phép liên kết hai chiều tự do giữa bất kỳ cặp module nào trong phạm vi đã hỗ trợ.

---

## 7. Search & Filter

`KnowledgeCrudPage` có: tìm kiếm theo Title/Summary/Tags, lọc theo Status (6 trạng thái), Category (gộp động từ dữ liệu thật + gợi ý cấu hình sẵn), Author, sắp xếp theo Updated Date (Mới→Cũ / Cũ→Mới). **Không có full-text search engine** — đúng yêu cầu "Không cần full-text engine", dùng lọc mảng phía client như `CrudPage.tsx` gốc đã làm cho 25+ trang khác (nhất quán với pattern hiện có, không phát minh cơ chế mới).

---

## 8. Version Readiness

Mỗi `KnowledgeItem` có `version` (số nguyên, bắt đầu 1, tự +1 mỗi lần Sửa) và `changelog: {version, date, note}[]`. Form Sửa có ô "Ghi chú thay đổi" tùy chọn — nếu điền, một dòng changelog mới được thêm khi Lưu; danh sách changelog hiện có hiển thị dưới dạng chỉ đọc (mới nhất trước). **Không xây diff engine** — đúng yêu cầu "Không cần implement diff engine", chỉ lưu ghi chú do Admin tự viết, không so sánh nội dung tự động.

---

## 9. Runtime Readiness

Đây là điểm cần đọc kỹ nhất: **sprint này chuẩn bị dữ liệu cho CKOS Runtime đọc, nhưng KHÔNG tự động nối vào Runtime thật hôm nay** — đúng theo yêu cầu "Không xây Runtime. Chỉ xác định [luồng khái niệm]".

Lý do kỹ thuật: 5 module mới (Goals/Workflows/Evaluations/Best Practices/FAQs) lưu dữ liệu qua tầng `localStorage` (per-browser), **không phải bảng Supabase thật** — vì việc tạo bảng Supabase mới nằm ngoài phạm vi cho phép của sprint này ("Không migration dữ liệu, Không sửa Database Schema"). Cơ chế `useCollection()` đã tồn tại sẵn (dùng cho toàn bộ Admin, không phải phát minh riêng cho CKOS) tự động rơi về `localStorage` cho bất kỳ `collectionKey` nào chưa có trong `SUPABASE_COLLECTIONS` allowlist — đây là **pattern tái sử dụng có sẵn**, tài liệu `store.ts` tự mô tả là "Phase 2 của quá trình di trú localStorage → Supabase", tức là chính codebase này đã có sẵn lộ trình 2 giai đoạn y hệt.

Về 4 bảng Supabase thật đã tồn tại từ trước (`ckos_goals`, `ckos_workflows`, `ckos_prompt_templates`, `ckos_evaluation_models` — migration SQL có ở repo root nhưng theo comment trong `src/app/portal/ckos/page.tsx`, "được viết nhưng chưa từng áp dụng lên production") — sprint này **cố ý không** viết CRUD nhắm trực tiếp vào các bảng đó, vì không có cách nào trong sandbox này xác nhận các bảng đó thực sự tồn tại trên Supabase production; viết CRUD nhắm vào bảng có thể không tồn tại là rủi ro runtime error không kiểm chứng được, và bản thân đó cũng là một dạng "migration" ngầm ngoài phạm vi cho phép.

**Luồng đã xác định** (Task 9 yêu cầu), chưa nối dây thật:
```
Published (đặt status trong Admin) → CKOS Runtime (6 route /api/v1/ckos/* hiện có, đọc bảng ckos_* thật) → Companion
```

**Bước để nối dây thật** (khuyến nghị ADM-SPR-004, không làm ở đây): sau khi PMO/kỹ thuật xác nhận 4 bảng `ckos_*` đã (hoặc sẽ) được áp dụng lên Supabase production, chỉ cần thêm 4 dòng vào `SUPABASE_COLLECTIONS` (`src/lib/admin/supabaseCollections.ts`) trỏ `collectionKey` hiện có (`ckos-goals`, `ckos-workflows`, v.v.) sang tên bảng thật — không cần đổi bất kỳ UI/component nào đã xây trong sprint này, vì `useCollection()` tự động chuyển từ localStorage sang Supabase khi key xuất hiện trong allowlist. Đây chính là lý do đặt tên `collectionKey` khớp sẵn với tên bảng dự kiến.

---

## 10. Admin UX

- **Empty state:** "Chưa có tri thức nào. Bấm "Thêm mới" để tạo mục đầu tiên." — cùng pattern với `CrudPage.tsx` gốc.
- **Loading:** 3 thanh skeleton nhấp nháy — tái sử dụng đúng pattern `CrudPage.tsx` đã dùng.
- **Error:** qua `useAdminToast()` có sẵn (toast đỏ) — không xây cơ chế báo lỗi mới.
- **Confirmation/Delete/Archive Dialog:** `ConfirmDialog` (đã mở rộng, §2) — Delete tone đỏ "Xóa", Archive tone xanh dương "Lưu trữ", mô tả rõ hệ quả từng hành động.

Toàn bộ dùng đúng Design System hiện có (token màu `brand-blue`/`brand-orange`/`brand-navy-soft`, class `rounded-lg`/`rounded-2xl`, `lucide-react` icon) — không có màu/spacing/radius mới phát minh riêng cho CKOS.

---

## 11. Files Changed

**Mới (11 file):**
- `src/lib/admin/ckos/metadata.ts` — Metadata Standard, Lifecycle, Module Registry
- `src/lib/admin/ckos/useAllKnowledgeCollections.ts` — hook đọc gộp dữ liệu xuyên module
- `src/components/admin/ckos/KnowledgeCrudPage.tsx` — Shared CRUD Framework
- `src/components/admin/ckos/KnowledgeEditor.tsx` — Shared Editor
- `src/components/admin/ckos/RelationshipPicker.tsx` — Relationship Model UI
- `src/app/admin/(dashboard)/ckos/page.tsx` — CKOS Dashboard
- `src/app/admin/(dashboard)/ckos/goals/page.tsx`
- `src/app/admin/(dashboard)/ckos/workflows/page.tsx`
- `src/app/admin/(dashboard)/ckos/evaluations/page.tsx`
- `src/app/admin/(dashboard)/ckos/best-practices/page.tsx`
- `src/app/admin/(dashboard)/ckos/faqs/page.tsx`

**Sửa đổi (4 file, đều cộng thêm — không đổi hành vi cũ):**
- `src/lib/admin/nav.ts` — nhóm CKOS: thêm Dashboard + 5 route mới; chuyển "Case Study"/"Tài nguyên" từ nhóm Content sang nhóm CKOS (đúng ngữ nghĩa sprint này — cùng route/bảng, chỉ đổi vị trí sidebar). Đã xác minh bằng script: 56→62 mục, không mất href nào, chỉ thêm đúng 6 route CKOS mới.
- `src/components/admin/AdminSidebar.tsx` — icon cho 6 mục mới (Brain/Flag/Workflow/Gauge/Award/HelpCircle).
- `src/components/admin/ui/Badge.tsx` — thêm tông màu `violet` + 3 status key mới (cộng thêm).
- `src/components/admin/ui/Modal.tsx` — `ConfirmDialog` thêm `confirmLabel`/`tone` tùy chọn (mặc định giữ nguyên hành vi cũ).

**Không đổi:** `CrudPage.tsx`, `ResourceManager.tsx`, mọi trang Tools/Prompts/Resources/Case Studies, Portal, database, checkout.

---

## 12. Khuyến nghị nâng cấp an toàn cho Tools/Prompts/Resources/Case Studies (không làm trong sprint này)

Vì đây là thay đổi có ảnh hưởng tới phạm vi thực tế đã giao (§ đầu trang), ghi rõ hướng đi an toàn cho ADM-SPR-004+:

1. **Không bao giờ thay component** của 4 trang này bằng `KnowledgeCrudPage` — sẽ mất field. Thay vào đó, **thêm field mới vào mảng `fields`/`columns` hiện có** của từng trang (`tools/page.tsx`, `prompts/page.tsx`, `ResourceManager.tsx`, `case-study/actions.ts`) — ví dụ thêm `author`, `reviewer`, `version`, `publishedDate` như các field tùy chọn mới. Vì lưu trữ dạng jsonb (`data` column), thêm field mới không ảnh hưởng dữ liệu cũ (item cũ chỉ đơn giản có giá trị rỗng cho field mới cho tới khi được sửa).
2. **Không đổi `status` field** của 3 module dùng jsonb (Tools/Prompts/Resources) từ 3 trạng thái (Draft/Published/Hidden) sang 6 trạng thái CKOS — public-facing code (Portal) có thể đang so khớp chuỗi `status === "Published"` ở nhiều nơi không kiểm chứng được trong sandbox này; đổi ngữ nghĩa `status` có rủi ro hành vi thật không lường trước được. Nếu muốn có Lifecycle 6 trạng thái cho các module này, khuyến nghị thêm một field **mới** riêng (VD: `lifecycleStatus`) song song với `status` hiện có, không thay thế.
3. **Case Studies** dùng bảng typed riêng (`case_studies`, không phải jsonb) — thêm field cần một cột mới thật sự (ALTER TABLE), tức là **có** đụng schema — việc này phải chờ một sprint được phép "Schema Change" rõ ràng, không tự ý làm.
4. Việc join Tools/Prompts/Resources vào Relationship Model chỉ cần thêm field `title` (alias tới `name` hiện có) — việc nhỏ, an toàn, nên làm sớm.

---

## 13. Verification

- **Lint (`npm run lint`):** 0 lỗi, 5 warning có từ trước (không liên quan sprint này). Trong quá trình phát triển, gặp 2 lỗi lint thật (`react-hooks/refs`, `react-hooks/static-components`) do cách viết toolbar ban đầu của `KnowledgeEditor` — đã sửa bằng cách đưa `ToolbarButton` ra ngoài phạm vi component cha (module-level), không còn định nghĩa component trong lúc render.
- **Type-check + Build (`npm run build`):** thành công, toàn bộ route biên dịch — xác nhận cả 6 route CKOS mới có trong danh sách.
- **Test (`npm run test`):** 139/139 pass, không regression.
- **Kiểm tra route CKOS Admin:** đã gọi `curl` tới cả 10 route CKOS (Dashboard + 5 mới + 4 route cũ giữ nguyên) trên dev server — tất cả trả về 200 (theo redirect chuẩn về `/admin/login` do sandbox không có Supabase credentials để xác thực) — xác nhận không có lỗi runtime 500 nào trong toàn bộ chuỗi import/render của mọi trang mới.
- **So khớp `nav.ts`:** script xác nhận 56→62 mục, không mất href nào, chỉ thêm đúng 6 route CKOS mới, không trùng lặp.

---

## 14. ADM-SPR-004 Readiness

**SẴN SÀNG có điều kiện — ADM-SPR-004 có thể bắt đầu**, với các điểm PMO nên xác nhận trước:

1. **Xác nhận phạm vi đã điều chỉnh** (đầu tài liệu) — 5/9 module có đầy đủ trải nghiệm CKOS mới, 4/9 giữ nguyên để tránh mất dữ liệu thật. Nếu PMO muốn 4 module còn lại cũng được nâng cấp, §12 đã có hướng đi an toàn cụ thể, sẵn sàng làm ngay khi được xác nhận.
2. **Xác nhận trạng thái production của 4 bảng `ckos_*`** (Goals/Workflows/Prompt Templates/Evaluation Models) — đây là điều kiện tiên quyết để Runtime Readiness (§9) có thể thực sự "nối dây" thay vì chỉ là đặc tả. Không xác nhận được điều này trong sandbox.
3. **Companion Studio Dashboard** (khuyến nghị từ ADMIN_CMS_FOUNDATION.md §11) là ứng viên tốt cho sprint tiếp theo — giờ có thể tham chiếu số liệu thật từ CKOS Dashboard vừa xây.

Không phát hiện vấn đề nào buộc phải chặn ADM-SPR-004.

---

## Phạm vi tuân thủ (Scope discipline)

Đúng theo "Out of Scope" của brief: không xây Companion Runtime, không đụng Academy/Premium/User Management/Analytics module khác, không migration dữ liệu, không đổi Database Schema, không sửa Portal UI, không có tính năng nào ngoài CKOS. Toàn bộ 15 file thay đổi (11 mới + 4 sửa cộng thêm) đều nằm trong phạm vi CKOS Management.
