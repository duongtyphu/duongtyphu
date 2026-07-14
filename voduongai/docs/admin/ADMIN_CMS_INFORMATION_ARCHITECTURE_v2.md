# Admin CMS — Kiến trúc thông tin mới (v2)

**Trạng thái: ĐỀ XUẤT, chờ PMO review. Không tự merge, không tự sửa code.**

Sprint: PMO DIRECTIVE — ADMIN CMS v1.1 UI REFINEMENT. Phạm vi: chỉ Sidebar/Navigation/Group/Menu/Label/UX/IA. Không thêm tính năng, không thêm CRUD/database/collection/migration/workspace mới, không đổi Ownership, không đổi dữ liệu, không đổi API. Không sửa Portal/CKOS/Premium Runtime/Companion Runtime.

Tài liệu này là kết quả Yêu cầu 3 (thiết kế lại Sidebar theo Portal) + Yêu cầu 8 (Portal → Trang → Section → Nội dung → Xuất bản), dựa trên audit thật ở `ADMIN_CMS_SIDEBAR_SIMPLIFICATION.md` (đọc trước tài liệu đó để biết vì sao từng mục được giữ/gộp/xoá).

Kế thừa (không thay thế) 2 chỉ thị đã có: `FOUNDER_DIRECTIVE_ADMIN_SIMPLICITY.md` (5 nguyên tắc: không đưa vào nếu không phục vụ Portal hiện tại; không giữ "biết đâu sau này"; ít nhưng đúng; mở rộng bằng dữ liệu không sửa code; không giữ trùng lặp) và `FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`.

---

## 1. Nguyên tắc thiết kế Sidebar mới

1. **Sidebar đi theo Portal thật, không đi theo cấu trúc source code.** 10 Portal Area (`src/lib/admin/portal/areaRegistry.ts`, nguồn duy nhất) là khung tổ chức chính, không phải tên Workspace kỹ thuật.
2. **Toàn bộ nhãn bằng tiếng Việt, ngôn ngữ Founder.** Không dùng: Dashboard, Workspace, Registry, Collection, Runtime, Theme, Brand Assets, Portal Builder.
3. **2 cấp điều hướng.** Cấp 1 (Sidebar) chỉ còn 16 mục. Cấp 2 (bên trong mỗi mục, dùng tab/section có sẵn) chứa các màn hình con hiện tại — không mất chức năng, chỉ không hiển thị hết ở Sidebar cùng lúc.
4. **Không đưa mục orphan/mock lên Sidebar.** Theo Nguyên tắc 1/2 của Founder Directive — mục nào không có nơi hiển thị thật trên Portal, hoặc đang chạy bằng dữ liệu mock, không thuộc Sidebar chính (xem danh sách "Ẩn khỏi Sidebar" ở tài liệu Sidebar Simplification).
5. **Không đổi Ownership/dữ liệu/route.** Việc gộp nhiều mục cũ vào 1 mục Sidebar là gộp **hiển thị điều hướng**, tất cả route con cũ vẫn còn nguyên, chỉ không còn là dòng riêng ở Sidebar cấp 1.

---

## 2. Cấu trúc Sidebar mới — 16 mục

| # | Tên hiển thị mới | Trỏ tới (route gốc) | Thay cho (Sidebar cũ) | Ghi chú |
|---|---|---|---|---|
| 1 | **Tổng quan** | `/admin/founder` | "Dashboard" (`/admin/dashboard`) + "Founder Workspace" | Gộp 2 màn hình tổng quan thành 1 cửa vào duy nhất — xem chi tiết mục 3 |
| 2 | **Website** | `/admin/website` | Nhóm "Website" (11 mục) | 11 mục con → 6 nhóm tab nội bộ (mục 4) |
| 3 | **Thương hiệu** | `/admin/brand` | Nhóm "Brand Studio" (10 mục) | 10 mục con → 6 nhóm tab nội bộ |
| 4 | **Media** | `/admin/media-center` | Nhóm "Media Center" (10 mục) | 10 mục con → 4 nhóm tab nội bộ |
| 5 | **Portal** | `/admin/portal` | Nhóm "Portal Management" (4 mục) + Nhóm "Portal Navigation" (10 mục, đọc) | Gộp thành 1 cửa vào — bản đồ Portal → Trang → Section → Nội dung, xem mục 5 |
| 6 | **Hệ tri thức AI** | `/admin/ckos` | Nhóm "CKOS" (11 mục) | 11 mục con → 5 nhóm tab nội bộ, nhận thêm Template/Checklist từ nhóm Content cũ |
| 7 | **Học viện AI** | `/admin/academy` | Nhóm "Academy" (6 mục) | Giữ nguyên cấu trúc, chỉ đổi tên hiển thị |
| 8 | **AI Workspace** | `/admin/ai-workspace` | Mục đơn "AI Workspace" | Giữ nguyên, nhận thêm "Blog AI" từ nhóm Content cũ |
| 9 | **Dự án & Cơ hội** | `/admin/projects-opportunities` | Nhóm "Projects & Opportunities" (4 mục) | Giữ nguyên, đã gọn sẵn |
| 10 | **Premium** | `/admin/premium` | Nhóm "Premium" (12 mục, trừ Đơn hàng) | 11 mục còn lại → 4 nhóm tab nội bộ, xem mục 6 |
| 11 | **Đơn hàng** | `/admin/orders` | "Đơn hàng" (trước nằm trong nhóm Premium) | Tách thành mục cấp 1 riêng — theo đúng ví dụ PMO liệt kê; xem "Vấn đề cần PMO xác nhận" #1 |
| 12 | **Companion** | `/admin/companion-studio` | Mục đơn "Companion Studio" | Đổi tên hiển thị, bớt chữ "Studio" |
| 13 | **Hành trình** | `/admin/journey` | Nửa đầu nhóm "Journey & Community" | Tách hiển thị khỏi "Cộng đồng" — chỉ tách Sidebar, không tách Ownership (vẫn 1 Workspace) |
| 14 | **Cộng đồng** | `/admin/community` | Nửa sau nhóm "Journey & Community" | nt |
| 15 | **Người dùng** | `/admin/users` | "Users & Access" | Đổi tên |
| 16 | **Xuất bản** | `/admin/founder/review-queue` | "Review Queue" (trước nằm trong nhóm Founder) | Tách thành mục cấp 1 riêng — đúng Yêu cầu 3 của PMO, và đúng mô hình "Portal → Trang → Section → Nội dung → Xuất bản" (Yêu cầu 8) |
| 17 | **Cài đặt** | `/admin/settings` | "System Settings" | Đổi tên; **cần PMO xác nhận** vì đây là CRUD chưa có nơi đọc thật (xem Sidebar Simplification #4) |

**17 mục, không phải 16** — lệch 1 so với ví dụ PMO vì tách "Media" thành mục riêng theo đúng Yêu cầu 4 ("Founder chỉ cần thấy: Website / Thương hiệu / Media"). Ví dụ Sidebar ở Yêu cầu 3 không liệt kê Media nhưng Yêu cầu 4 lại nhắc tên riêng — xem "Vấn đề cần PMO xác nhận" #2.

---

## 3. "Tổng quan" — gộp Dashboard + Founder Workspace

Hiện có 2 màn hình tổng quan riêng biệt cùng dẫn tới oversight toàn Admin:

- `/admin/dashboard` — Dashboard gốc, tổng hợp số liệu 1 vài collection.
- `/admin/founder` — Founder Workspace, xây lại kỹ hơn ở FOUNDER-SPR-1001, tổng hợp registry Portal + Workspace Owner + publish pipeline.

Founder không cần 2 "trang chủ" khác nhau khi mở Admin. Đề xuất gộp thành 1 mục "Tổng quan" duy nhất — **cần PMO chọn route nào giữ làm chính** (đề xuất: giữ `/admin/founder` vì dữ liệu đầy đủ hơn, `/admin/dashboard` trở thành alias/redirect).

"Workspace Owner Panel" (`/admin/founder/owners`) và "Global Search" (`/admin/founder/search`) — xem quyết định riêng ở Sidebar Simplification (không lên Sidebar cấp 1).

---

## 4. "Website" — 11 mục cũ gộp thành 6 nhóm tab nội bộ

| Nhóm tab mới | Gộp từ (mục Sidebar cũ) |
|---|---|
| Trang | Pages, Homepage, Landing Pages, Static Pages |
| Điều hướng | Navigation |
| Nội dung dùng chung | Shared Sections |
| SEO & Chuyển hướng | SEO, Redirect |
| Liên kết Portal | Portal Mapping |
| Cài đặt | Global Settings |

Tương tự cho "Thương hiệu" (10 → 6 nhóm: Logo thương hiệu, Màu & Kiểu chữ, Giao diện & Biểu tượng, Hình ảnh chia sẻ, Thư viện tài sản, Cài đặt) và "Media" (10 → 4 nhóm: Thư viện, Thư mục & Bộ sưu tập, Nhãn, Cài đặt) — chi tiết từng route ở `ADMIN_CMS_ROUTE_MAPPING.md`.

---

## 5. "Portal" — theo đúng mô hình Portal → Trang → Section → Nội dung → Xuất bản

Audit (`ADMIN_CMS_SIDEBAR_SIMPLIFICATION.md` #2) phát hiện: "Portal Areas" là CRUD thật nhưng **không route Portal nào đọc** (cùng dạng "CRUD vào khoảng không" như Portal Builder cũ đã bị xoá trước đây); "Page Registry" và "Content Registry" là 2 màn hình chỉ đọc, tổng hợp lại registry khác.

Đề xuất: gộp 4 mục cũ (Portal Dashboard, Portal Areas, Page Registry, Content Registry) + 10 mục "Portal Navigation" (đọc, dẫn nhanh tới từng khu vực Portal) thành **1 mục Sidebar "Portal"**, dẫn vào 1 bản đồ duy nhất thể hiện đúng cấu trúc Portal → Trang → Section → Nội dung → Xuất bản. Việc "Portal Areas" có tiếp tục là CRUD hay chuyển thành bản đồ chỉ-đọc — **cần PMO quyết định** (xem Sidebar Simplification #2).

---

## 6. "Premium" — tách lõi Course Commerce khỏi Affiliate

11 mục còn lại (sau khi tách "Đơn hàng" ra riêng) gộp thành 4 nhóm tab:

| Nhóm tab mới | Gộp từ |
|---|---|
| Khoá học & Học phí | Sản phẩm số, Học phí V-SOLO/V-SCALE |
| Mã giảm giá & Dịch vụ | Mã giảm giá, Dịch vụ, Hỗ trợ |
| Leads | Leads |
| Affiliate | Affiliate Hub, Top sản phẩm Affiliate, Sản phẩm Affiliate, Link Affiliate, Báo cáo Affiliate |

"Affiliate" gộp 5 mục cũ thành 1 nhóm tab bên trong Premium thay vì 5 dòng Sidebar riêng. "Link Affiliate" (orphan, không route Portal nào đọc) và "Báo cáo Affiliate" (chạy bằng dữ liệu mock) vẫn giữ trong tab này — **cần PMO xác nhận có giữ lại hay không** (xem Sidebar Simplification #5).

---

## 7. Nhóm "Content" cũ — không còn tồn tại như 1 nhóm riêng

Audit cho thấy 6/10 mục trong nhóm "Content" cũ không có nơi hiển thị thật trên Portal (orphan) hoặc chỉ là số liệu mock. 4 mục còn giá trị được phân bổ lại đúng nơi:

| Mục cũ | Điểm đến mới |
|---|---|
| Blog AI | AI Workspace (đúng theo AIWS-SPR-501, Blog AI vốn là 1 section của AI Workspace) |
| Template | Hệ tri thức AI (gộp cùng "Tài nguyên") |
| Checklist | Hệ tri thức AI (gộp cùng "Tài nguyên") |
| Tài nguyên đã lưu | Xoá khỏi Sidebar (dashboard chạy 100% mock, không phải nội dung thật) |
| Thành công học viên, Tin tức & Cập nhật, Tin nội bộ, Ebook, SOP, Banner | Ẩn khỏi Sidebar — không route Portal nào đọc (orphan), không xoá dữ liệu/route |

Chi tiết verdict từng mục ở `ADMIN_CMS_SIDEBAR_SIMPLIFICATION.md` #3.

---

## 8. Vấn đề cần PMO xác nhận trước khi code

1. **"Đơn hàng" đứng riêng hay nằm trong Premium?** Ví dụ Sidebar ở Yêu cầu 3 liệt kê "Đơn hàng" như 1 mục cấp 1 riêng — đề xuất đã theo đúng ví dụ đó (mục 11). Nhưng xét về nghiệp vụ, Đơn hàng là 1 khâu trong luồng Course Commerce của Premium. Nếu PMO muốn tối giản số dòng Sidebar hơn nữa, có thể gộp lại vào Premium (tab "Đơn hàng & Mã giảm giá").
2. **"Media" có nên là mục Sidebar cấp 1 riêng không?** Yêu cầu 3 (ví dụ 16 mục) không liệt kê Media, nhưng Yêu cầu 4 nhắc "Website / Thương hiệu / Media" như 3 điểm đến ngang hàng. Đề xuất hiện tại: giữ Media là mục cấp 1 riêng (17 mục tổng, không phải 16).
3. **"Hành trình" và "Cộng đồng" tách 2 dòng Sidebar nhưng vẫn 1 Workspace ("Journey & Community")** — đúng theo Founder Directive Phase 9 (JOURNEY-SPR-901) đã gộp Ownership. Xác nhận: đây chỉ là hiển thị Sidebar khác Ownership nội bộ, không mâu thuẫn.
4. **"Portal Areas" CRUD orphan — giữ CRUD hay chuyển read-only?** Xem mục 5.
5. **"Cài đặt" (System Settings) và "Link Affiliate"/"Báo cáo Affiliate" là CRUD/dashboard chưa có nơi đọc thật hoặc chạy mock** — giữ trên Sidebar (chờ nối dây sau) hay ẩn tạm thời? Đề xuất mặc định: **giữ nhưng gắn nhãn rõ**, không tự ý ẩn dữ liệu Founder có thể đang dùng nội bộ mà audit chưa phát hiện hết — chờ PMO xác nhận cuối cùng.
