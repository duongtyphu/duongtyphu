# Admin Foundation v2 — IMP-ADM-100 (Admin CMS Foundation Architecture Freeze)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge. Không code CRUD/Database/API/Runtime — tài liệu thiết kế thuần.**

Tiếp theo `docs/admin/ADMIN_INFORMATION_ARCHITECTURE_V2.md` (Task 1-5). Tài liệu này trình bày Task 6-10 — 5 hệ thống cross-cutting (xuyên suốt mọi Workspace), cộng phần tổng hợp câu hỏi cần PMO quyết định trước khi bất kỳ Sprint kỹ thuật nào triển khai các đề xuất này.

---

## Bối cảnh: từ "xây Workspace độc lập" sang "Admin CMS thống nhất"

Từ ADM-SPR-002 đến BRAND-SPR-001, mỗi Workspace được xây như một đơn vị gần như độc lập — có Shell riêng (`WebsiteWorkspaceShell`, `BrandWorkspaceShell`), navigation riêng (`website/navigation.ts`, `brand/navigation.ts`), Status model tuy dùng chung (`NAVIGATION_STATUSES`) nhưng mỗi Registry tự import lại. Cách này đúng cho giai đoạn "chứng minh pattern hoạt động" (Website là Workspace đầu tiên, Brand Studio là Workspace thứ hai) — nhưng nếu tiếp tục nhân rộng cho 7+ Workspace, sẽ tạo ra N bản Shell/Navigation gần giống hệt nhau, không có điểm nhìn tổng ("Founder muốn thấy toàn cảnh Admin, không phải mở từng Workspace"). 5 hệ thống dưới đây là lớp **cross-cutting** đứng trên các Workspace, giải quyết đúng vấn đề đó.

**Ràng buộc chung cho cả 5 đề xuất:** không Database mới, không API mới, không Runtime — mọi đề xuất dưới đây mô tả cấu trúc dữ liệu/khái niệm, không phải implementation. Nơi nào cần "aggregator" (gộp dữ liệu nhiều Workspace), đề xuất đều nói rõ đây là việc của Sprint kỹ thuật tương lai, không phải sprint này.

---

## Task 6 — Đề xuất Global Search

**Vấn đề:** không có cách nào tìm một Page/Asset/Prompt/Lead cụ thể mà không biết nó thuộc Workspace nào trước.

**Đề xuất — Search Index Contract (không phải search engine thật):**

Mỗi Registry (Page/Navigation/Shared Section/SEO/Redirect của Website; Asset/Typography/Color/Theme của Brand Studio; và tương lai là Academy/Premium sau canonical hóa) triển khai một hàm thuần `toSearchEntry(item): { id, title, workspace, section, href, category? }` — không cần thay đổi schema hiện có, chỉ cần một adapter nhỏ per-Registry.

Ở tầng Admin tổng, Global Search **giai đoạn Foundation** chỉ là: gộp toàn bộ `toSearchEntry()` của các Registry đã bật (qua `useCollection` từng cái, y hệt cách Website Dashboard đã gộp 6 collection ở WEB-SPR-006), lọc theo chuỗi tìm kiếm client-side (không cần index server/Elasticsearch/vector search). Đủ dùng vì tổng số item hiện tại còn nhỏ (hàng chục, không phải hàng nghìn).

**Không làm ở Foundation:** không AI semantic search, không fuzzy ranking, không search index riêng cho pattern legacy (Supabase `actions.ts` — Premium Orders/Leads...) — các Registry đó cần được canonical hóa trước khi tham gia Global Search, ghi nhận là giới hạn đã biết.

---

## Task 7 — Đề xuất Global Command Palette

**Đề xuất:** Cmd+K/Ctrl+K mở palette gồm 2 loại kết quả, không cần dữ liệu mới:

1. **Điều hướng** — danh sách mọi Workspace + section, lấy trực tiếp từ Workspace Registry (đề xuất ở IA v2 Task 4) — gõ "brand color" nhảy thẳng tới `/admin/brand/color-palette`.
2. **Nội dung** — tái dùng đúng Search Index Contract (Task 6) — gõ tên 1 Page/Asset cụ thể, chọn để mở thẳng vào Edit.

Không cần "Quick Action" runtime (VD "+ New Page" chạy ngay từ palette) ở Foundation — chỉ điều hướng tới trang có nút đó sẵn. Thêm hành động runtime vào palette là việc của Sprint sau, khi đã có Global Search hoạt động ổn định.

---

## Task 8 — Đề xuất Global Notification Center

**Nền tảng đã có sẵn (không phải xây mới):** `AdminHeader` đã có "notification-area placeholder" từ ADM-SPR-002 — Task này đề xuất NỘI DUNG cho khu vực đó, không phải component mới.

**Đề xuất cấu trúc `AdminNotification`:**

```
{ id, workspace, severity: "info" | "warning" | "critical", message, href?, createdAt }
```

**Nguồn dữ liệu giai đoạn Foundation — thủ công, không phải event bus:** mỗi Workspace khai báo tĩnh danh sách "Phát hiện cần Founder xác nhận" của mình (pattern đã có sẵn ở Brand Studio Dashboard — khối "⚠️ Phát hiện cần Founder xác nhận") dưới dạng mảng `AdminNotification[]` ngay trong code Workspace đó; Notification Center gộp các mảng tĩnh này lại. Đây **không phải** hệ thống sự kiện thời gian thực (không có ai "trigger" một notification khi trạng thái đổi) — chỉ là cách trình bày tập trung những gì đã ghi trong báo cáo sprint, thay vì Founder phải đọc từng file `docs/admin/*_FOUNDATION.md`.

**Ví dụ nội dung ban đầu (nếu triển khai, lấy từ báo cáo đã có, không phải bịa mới):**
- `warning` — Website: "SEO (Website Workspace) chồng lấn với mục SEO độc lập cấp cao nhất" → `/admin/website/seo`
- `warning` — Brand Studio: "Brand Orange có 2 mã màu khác nhau (#FF7A00 vs #F97316)" → `/admin/brand/color-palette`
- `critical` — Admin: "Media Center và Companion Studio được brief IMP-ADM-100 liệt kê là 'hoàn thành' nhưng thực tế chưa có route/CRUD nào" → tài liệu này

**Không làm ở Foundation:** không push notification thật, không real-time, không đánh dấu đã đọc lưu trạng thái (chưa có bảng dữ liệu cho việc đó).

---

## Task 9 — Đề xuất Global Review Queue

**Vấn đề:** Website Page/Shared Section có trạng thái `Review` trong lifecycle, nhưng Founder phải vào từng Workspace, tự lọc theo Status để thấy các mục đang chờ duyệt.

**Đề xuất — Review Manifest (khai báo tĩnh, không phải aggregator runtime):**

Một danh sách khai báo (không phải bảng dữ liệu mới) liệt kê: Registry nào có khái niệm "chờ duyệt", field Status tên gì, giá trị nào coi là "pending":

```
[
  { workspace: "website", collectionKey: "website-pages", statusField: "status", pendingValues: ["Review"] },
  { workspace: "website", collectionKey: "website-shared-sections", statusField: "status", pendingValues: ["Review"] },
  // Navigation/SEO/Redirect (Website) và mọi Registry Brand Studio dùng NAVIGATION_STATUSES
  // (Draft/Active/Inactive/Archived) — KHÔNG có khái niệm "Review", nên KHÔNG xuất hiện
  // trong Review Queue theo đúng bản chất Status model của chúng (đã ghi nhận ở WEB-SPR-003:
  // Navigation là cấu trúc, không cần workflow duyệt nhiều bước).
]
```

Ở tầng UI, Review Queue **giai đoạn Foundation** đơn giản là: với mỗi entry trong manifest, gọi `useCollection(collectionKey)`, lọc theo `pendingValues`, gộp hiển thị — cùng kỹ thuật đã dùng để sửa Website Dashboard ở WEB-SPR-006, không phải cơ chế mới.

**Phát hiện khi thiết kế:** chỉ 2/11 collection (cả Website lẫn Brand Studio) hiện có khái niệm "Review" thật — đa số Registry dùng Status 4 trạng thái không có bước duyệt nhiều cấp. Global Review Queue giai đoạn đầu sẽ khá "mỏng" — giá trị thật sự chỉ đến khi Academy/Premium canonical hóa và có nội dung cần duyệt (VD sản phẩm mới, giá mới trước khi lên live).

---

## Task 10 — Đề xuất Founder Workspace

**Vai trò:** khác mọi Workspace khác (không quản lý Content Core nào) — là lớp **oversight** duy nhất dành cho Founder, gộp mọi thứ cross-cutting ở trên vào 1 nơi để không phải đọc từng báo cáo sprint để biết "còn gì đang chờ mình quyết định".

**Đề xuất cấu trúc, route `/admin` (tách khỏi `/admin/dashboard` — Dashboard tổng ở IA v2 Task 3 là trang mặc định mọi Admin user thấy; Founder Workspace là chế độ xem sâu hơn, có thể cùng route nhưng thêm section, hoặc route riêng — **cần PMO quyết định cách phân biệt 2 trang**):**

1. **Governance Overview** — bảng trạng thái WCS của mọi Workspace (Approved/Draft/Chưa có), lấy trực tiếp từ field `Status` trong từng file `docs/admin/workspaces/*.md` — Foundation: liệt kê thủ công (README.md của thư mục `workspaces/` đã có quy tắc versioning/approval, chỉ cần trình bày lại dạng bảng).
2. **Global Review Queue** (Task 9) — nhúng trực tiếp.
3. **Notification Center** (Task 8), lọc riêng severity `critical`/`warning`.
4. **Open PMO Questions** — danh sách CÁC câu hỏi "chưa PMO quyết định" đã tích lũy qua mọi sprint (SEO vs SEO, Global Settings vs System Settings, Banner vs Announcement, Brand Orange, theme kép, Content group có nên tách...) — hiện đang nằm rải rác cuối mỗi báo cáo sprint, Founder Workspace là nơi gộp lại MỘT LẦN để dễ xử lý theo lô thay vì xử lý rải rác từng sprint.

**Không làm ở Foundation:** không phân quyền RBAC mới (route này giả định chỉ Founder truy cập, nhưng cơ chế kiểm tra role cụ thể là việc của `middleware.ts`/`requireAdmin` đã có — không thiết kế lại permission ở tài liệu này).

---

## Tổng hợp — Câu hỏi cần PMO/Founder quyết định trước khi triển khai kỹ thuật

Đây là ứng dụng đầu tiên của chính "Open PMO Questions" (Task 10) — danh sách dưới đây nên là nội dung khởi tạo của khối đó khi được xây thật:

1. **Xác nhận lại danh sách "Workspace hoàn thành Product"** trong brief IMP-ADM-100 — Media Center và Companion Studio hiện là `ComingSoon` stub, chưa có gì được xây (Task 1).
2. **Content group hiện tại nên tách thành Workspace riêng ("Content Library"), gộp vào CKOS, hay gộp vào Website?** (IA v2 Task 2)
3. **Portal Builder** — giữ và nối dây thật (7/8 bảng hiện orphan), hay deprecate? (IA v2 Task 2)
4. **SEO độc lập cấp cao nhất** — deprecate vì trùng SEO Registry của Website, hay giữ vì có phạm vi khác? (IA v2 Task 2, nhắc lại từ WEB-SPR-001)
5. **`AdminWorkspaceShell` dùng chung** — có nên tổng quát hóa `WebsiteWorkspaceShell`/`BrandWorkspaceShell` thành 1 component, hay giữ mỗi Workspace tự viết Shell riêng? (IA v2 Task 4)
6. **Founder Workspace vs. Dashboard tổng** — route/UX riêng biệt hay cùng 1 trang nhiều section? (Task 10)
7. **Thứ tự ưu tiên canonical hóa tiếp theo** — CKOS (chỉ thiếu WCS) hay Academy/Premium (thiếu cả WCS lẫn Registry pattern, nhưng có dữ liệu giao dịch thật, rủi ro cao hơn nếu làm sai)?

**Không có khuyến nghị dứt khoát nào ở trên được tự quyết** — đúng nguyên tắc đã áp dụng xuyên suốt EPIC-02: Founder Decision → PMO Clarification → Portal hiện tại → tài liệu cũ.
