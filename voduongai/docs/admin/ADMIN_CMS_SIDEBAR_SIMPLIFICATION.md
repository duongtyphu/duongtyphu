# Admin CMS — Audit &amp; quyết định tinh gọn Sidebar

**Trạng thái: ĐỀ XUẤT, chờ PMO review. Không tự merge, không tự sửa code.**

Sprint: PMO DIRECTIVE — ADMIN CMS v1.1 UI REFINEMENT, Yêu cầu 1/2/10 (audit toàn bộ Sidebar trước khi sửa). Đây là bằng chứng cho đề xuất cấu trúc mới ở `ADMIN_CMS_INFORMATION_ARCHITECTURE_v2.md`.

**Cách đọc bảng:** mỗi dòng là 1 mục Sidebar hiện tại (`src/lib/admin/nav.ts`, 18 nhóm, 100 mục). Cột "Thực trạng" là kết quả audit trực tiếp code (không suy đoán) — có/không CRUD thật, có/không route Portal nào thật sự hiển thị dữ liệu đó. Cột "Quyết định đề xuất" là 1 trong 4: **GIỮ** (không đổi), **GỘP** (nhập vào mục khác, không mất route), **ẨN** (bỏ khỏi Sidebar, không xoá route/dữ liệu), **ĐỔI TÊN** (chỉ đổi nhãn hiển thị).

---

## Nhóm "Founder" (4 mục)

| Mục | Thực trạng | Quyết định đề xuất |
|---|---|---|
| Founder Workspace | Dashboard chỉ đọc, dữ liệu thật (registry Portal + Workspace Owner + publish pipeline) | GỘP vào "Tổng quan" cùng Dashboard cũ |
| Workspace Owner Panel | Dashboard chỉ đọc, dữ liệu tĩnh (`workspaceOwnership.ts`) — khái niệm "Workspace sở hữu module nào" là ngôn ngữ kỹ thuật, không phải nhu cầu vận hành hằng ngày của Founder | ẨN khỏi Sidebar (giữ route, không xoá dữ liệu) |
| Global Search | Placeholder — code tự ghi "chưa triển khai tìm kiếm thật" | ẨN khỏi Sidebar (chưa làm thật, không đưa lên UI Founder thấy) |
| Review Queue | Dashboard chỉ đọc, dữ liệu thật (pipeline Draft→Review→Published→Archived, 15 collection) | GỘP + ĐỔI TÊN → "Xuất bản" (mục cấp 1 riêng) |

## Nhóm "Portal Management" (4 mục)

| Mục | Thực trạng | Quyết định đề xuất |
|---|---|---|
| Portal Dashboard | Dashboard chỉ đọc trên registry Portal | GỘP vào mục "Portal" duy nhất |
| Portal Areas | CRUD thật (`useCollection`) nhưng **0 route Portal nào đọc dữ liệu này** — cùng dạng "CRUD vào khoảng không" như Portal Builder cũ (đã bị xoá 6/7 mục ở PORTAL-SPR-301) | GỘP vào mục "Portal"; **cần PMO quyết định**: giữ CRUD hay chuyển read-only/archive (xem Vấn đề #4 ở tài liệu IA) |
| Page Registry | Chỉ đọc, tổng hợp lại chính dữ liệu orphan ở trên (trang tự ghi "Chỉ đọc — sửa route là việc của lập trình") | GỘP vào mục "Portal" |
| Content Registry | Chỉ đọc, tổng hợp registry của Website/Brand Studio (không có dữ liệu CKOS/Academy/Premium) | GỘP vào mục "Portal" |

## Nhóm "Portal Navigation" (10 mục — link đọc nhanh tới 10 khu vực Portal)

Toàn bộ 10 mục (Trang chủ Học viện, Companion, CKOS, Học viện AI, AI Workspace, Dự án &amp; Cơ hội, Premium, Hành trình của tôi, Sứ mệnh Companion, Cộng đồng) đều là link đọc nhanh, không phải CRUD riêng — GỘP vào mục "Portal" làm bản đồ điều hướng, không còn là 10 dòng Sidebar riêng.

## Nhóm "Website" (11 mục)

Toàn bộ 11 mục (Dashboard, Pages, Navigation, Homepage, Landing Pages, Static Pages, Shared Sections, SEO, Redirect, Global Settings, Portal Mapping) là CRUD thật, có WCS Approved, không mục nào orphan — GIỮ nguyên chức năng, chỉ GỘP hiển thị Sidebar cấp 1 thành 1 mục "Website" duy nhất (10 mục con → 6 nhóm tab nội bộ, xem IA §4).

## Nhóm "Brand Studio" (10 mục)

Tương tự Website — CRUD thật, WCS Approved. GỘP hiển thị thành 1 mục "Thương hiệu", ĐỔI TÊN từ "Brand Studio".

## Nhóm "Media Center" (10 mục)

CRUD thật, WCS Approved (MEDIA-SPR-202). GỘP hiển thị thành 1 mục "Media", ĐỔI TÊN từ "Media Center".

## Nhóm "CKOS" (11 mục)

CRUD thật (framework `KnowledgeCrudPage`), tất cả có consumer Portal thật. GỘP hiển thị thành 1 mục "Hệ tri thức AI", ĐỔI TÊN từ "CKOS" — nhận thêm Template + Checklist từ nhóm Content cũ.

## Nhóm "Academy" (6 mục)

CRUD thật + 1 view chỉ đọc (Learning Journeys). GIỮ cấu trúc, GỘP hiển thị thành 1 mục "Học viện AI", ĐỔI TÊN từ "Academy".

## "AI Workspace" (mục đơn)

Chưa có CRUD (Not Started, 100% TypeScript hardcode, Dashboard chỉ đọc). GIỮ nguyên vị trí, nhận thêm "Blog AI" (đã có consumer Portal thật ở `/blogai`) từ nhóm Content cũ.

## Nhóm "Projects &amp; Opportunities" (4 mục)

CRUD thật, bám đúng `/portal/duan-cohoi`, đã gọn sẵn từ PROJECTS-SPR-602. GIỮ nguyên, ĐỔI TÊN "Projects &amp; Opportunities" → "Dự án &amp; Cơ hội" (đã là tiếng Việt trong nav.ts, không đổi thêm).

## Nhóm "Premium" (12 mục)

| Mục | Thực trạng | Quyết định đề xuất |
|---|---|---|
| Sản phẩm số | Real CRUD, consumer `/portal/premium` | GỘP tab "Khoá học &amp; Học phí" |
| Học phí V-SOLO/V-SCALE | Real CRUD, consumer `/portal/premium`, `/portal/checkout` | GỘP tab "Khoá học &amp; Học phí" |
| Đơn hàng | Real Supabase, consumer checkout/account/my-products | TÁCH thành mục cấp 1 riêng "Đơn hàng" (theo ví dụ PMO liệt kê) |
| Mã giảm giá | Real Supabase, consumer checkout | GỘP tab "Mã giảm giá &amp; Dịch vụ" |
| Dịch vụ | Real CRUD, consumer `/portal/services` | GỘP tab "Mã giảm giá &amp; Dịch vụ" |
| Hỗ trợ | Real Supabase, consumer `/portal/support` | GỘP tab "Mã giảm giá &amp; Dịch vụ" |
| Leads | Real Supabase, nguồn `/api/leads` | GỘP tab "Leads" |
| Affiliate Hub | Real CRUD, consumer `/portal/affiliate-hub` | GỘP tab "Affiliate" |
| Top sản phẩm Affiliate | Real CRUD, consumer `/portal/affiliate-hub` | GỘP tab "Affiliate" |
| Sản phẩm Affiliate | Real CRUD, consumer `/portal/affiliate-hub` | GỘP tab "Affiliate" |
| Link Affiliate | Real CRUD, **0 route Portal nào đọc** (chỉ 2 trang Admin khác đọc lại) | GỘP tab "Affiliate"; **cần PMO xác nhận** giữ hay ẩn |
| Báo cáo Affiliate | Dashboard, tự ghi "Dữ liệu mock — cấu trúc sẵn sàng kết nối tracking thật" | GỘP tab "Affiliate"; **cần PMO xác nhận** giữ hay ẩn |

## "Companion Studio" (mục đơn)

Chưa có CRUD (Not Started, Dashboard chỉ đọc, mount toàn Portal). ĐỔI TÊN → "Companion".

## Nhóm "Journey &amp; Community" (2 mục)

Dashboard (`/admin/journey`) + Cộng đồng (`/admin/community`, CRUD thật) — 1 Workspace theo Founder Directive Phase 9 (JOURNEY-SPR-901), nhưng đề xuất TÁCH hiển thị Sidebar thành 2 mục cấp 1 "Hành trình" + "Cộng đồng" (không tách Ownership nội bộ).

## Nhóm "Content" (10 mục)

| Mục | Thực trạng | Quyết định đề xuất |
|---|---|---|
| Blog AI | Real CRUD, consumer `/blogai` | GỘP vào "AI Workspace" |
| Thành công học viên | Real CRUD, **orphan** — route Portal cũ đã archive vì nội dung "bịa, không xác thực" | ẨN khỏi Sidebar |
| Tin tức &amp; Cập nhật | Real CRUD, **orphan** — Portal hiển thị bằng mảng hardcode khác, không đọc collection này | ẨN khỏi Sidebar |
| Tin nội bộ | Real CRUD, **orphan** — 0 route nào đọc | ẨN khỏi Sidebar |
| Template | Real CRUD, consumer `/portal/templates` | GỘP vào "Hệ tri thức AI" |
| Ebook | Real CRUD, **orphan** — không route Portal nào hiển thị ebook | ẨN khỏi Sidebar |
| Checklist | Real CRUD, consumer `/portal/checklists` | GỘP vào "Hệ tri thức AI" |
| SOP | Real CRUD, **orphan** — Portal đọc từ file tĩnh khác, không đọc collection này | ẨN khỏi Sidebar |
| Tài nguyên đã lưu | Dashboard, 100% dữ liệu mock (`savedStats.ts`) — không liên quan tính năng "Đã lưu" thật của người dùng | ẨN khỏi Sidebar |
| Banner | Real CRUD, **orphan** — component đọc dữ liệu này (`NotificationTicker`) vẫn còn trong code nhưng không được mount ở đâu | ẨN khỏi Sidebar |

**Kết quả:** nhóm "Content" không còn tồn tại như 1 nhóm Sidebar riêng — 2 mục thật (Template, Checklist) chuyển vào Hệ tri thức AI, 1 mục thật (Blog AI) chuyển vào AI Workspace, 7 mục còn lại ẨN.

## Mục đơn còn lại

| Mục | Thực trạng | Quyết định đề xuất |
|---|---|---|
| Users &amp; Access | Real feature (Supabase Auth, ban/unban) | GIỮ, ĐỔI TÊN → "Người dùng" |
| Analytics | Dashboard nửa thật nửa mock (nhãn "(mock)" ngay trên UI cho khoảng nửa số ô) | GIỮ tạm; **cần PMO xác nhận** vị trí trong Sidebar mới (không nằm trong ví dụ 16 mục của PMO — có thể gộp vào "Tổng quan") |
| System Settings | Real CRUD (có nút Lưu) nhưng **0 nơi đọc dữ liệu này** — Portal đọc branding từ file tĩnh khác | GIỮ, ĐỔI TÊN → "Cài đặt"; **cần PMO xác nhận** giữ CRUD hay archive |

---

## Tổng kết số lượng

- Sidebar hiện tại: **18 nhóm, 100 mục** (đếm cả nhóm rỗng "group: null").
- Đề xuất mới: **17 mục cấp 1** (không đếm mục con — mục con chuyển vào tab nội bộ từng mục).
- Số mục ẨN khỏi Sidebar (giữ route/dữ liệu, không xoá): **10** — Workspace Owner Panel, Global Search, Thành công học viên, Tin tức &amp; Cập nhật, Tin nội bộ, Ebook, SOP, Tài nguyên đã lưu, Banner, và Analytics (nếu PMO chọn gộp vào Tổng quan thay vì giữ riêng).
- Số mục cần PMO xác nhận thêm trước khi code: **5** (Đơn hàng đứng riêng hay trong Premium; Media đứng riêng hay không; Portal Areas CRUD hay read-only; Link Affiliate/Báo cáo Affiliate giữ hay ẩn; System Settings giữ CRUD hay archive) — liệt kê đầy đủ ở `ADMIN_CMS_INFORMATION_ARCHITECTURE_v2.md` §8.
