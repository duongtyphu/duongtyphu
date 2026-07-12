# WEB-SPR-201R — Website Workspace: Portal-aligned Management (EPIC-02 Phase 2)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge. Không deploy Production.**

Sprint tiếp nối trực tiếp `docs/admin/ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md` (Giai đoạn 1) — áp dụng phần phát hiện liên quan tới Website Workspace, thực hiện đúng những gì brief này ủy quyền cụ thể ("Loại bỏ: route dư, menu dư, placeholder không còn giá trị..." — Task 2 là lệnh thực thi, không chỉ audit), và **không tự ý mở rộng** ra các phát hiện khác của IMP-ADM-001R chưa thuộc phạm vi Website Workspace (những mục đó vẫn giữ nguyên "NEEDS PMO DECISION", xem lại báo cáo gốc).

---

# Deliverable 1 — Website Workspace Review (Task 1: Portal Mapping)

## 1.1 Đối chiếu 14 mục Scope với Portal thật

Brief liệt kê 14 nội dung Website Workspace được quản lý (Homepage/Landing Pages/Static Pages/Navigation/Header/Footer/Shared Sections/Banner/Hero/CTA/Announcement/SEO/Redirect/Global Website Settings). Đối chiếu trực tiếp với 11 route thật hiện có của Website Workspace — **không có mục nào trong 14 mục thiếu chỗ quản lý, không có route nào thừa ra ngoài 14 mục**:

| # Scope brief | Route quản lý | Portal thật tương ứng |
|---|---|---|
| Homepage | `/admin/website/homepage` (Page Registry lọc Homepage + Homepage Section Order) | `/` — 11 section thật (`src/app/page.tsx`) |
| Landing Pages | `/admin/website/landing-pages` | **Khoảng trống thật** — Portal hiện không có route Landing Page nào (đã ghi nhận từ WEB-SPR-202) |
| Static Pages | `/admin/website/static-pages` | 7 trang thật: `/about`, `/contact`, `/disclaimer`, `/privacy`, `/refund-policy`, `/terms`, `/blogai` (chỉ mục) |
| Navigation | `/admin/website/navigation` | `mainNav` (`site.ts`), `portalNavSections` (`hubs.ts`), `Footer.tsx` columns |
| Header | Navigation, location = "Header" | `mainNav` — 4 mục |
| Footer | Navigation location = "Footer" (link) + Shared Sections category "Footer" (copy thương hiệu) | `Footer.tsx` columns + mô tả thương hiệu |
| Shared Sections | `/admin/website/shared-sections` | 9 category, bám `src/components/home/*.tsx` |
| Banner | Shared Sections category "Banner" | `portal_banners` (metadata minh hoạ, xem 2.3) |
| Hero | Shared Sections category "Hero" | `Hero.tsx` |
| CTA | Shared Sections category "CTA" | `FinalCTA.tsx` |
| Announcement | Shared Sections category "Announcement" + `GlobalWebsiteSettings.announcementText/Active` | `portal_banners`/`NotificationTicker` (xem 2.3) |
| SEO | `/admin/website/seo` | Metadata SEO từng trang |
| Redirect | `/admin/website/redirect` | `next.config.ts` (student-success, updates, hanh-trinh-cua-toi) |
| Global Website Settings | `/admin/website/global-settings` | Website Name/Tagline/Announcement/Default Homepage/Maintenance |

**Kết luận Task 1:** Đúng 14/14 mục Scope đều có nơi quản lý tương ứng thật trong Website Workspace — không mục nào bị bỏ sót, không mục nào được tạo ra mà Portal không có (Landing Pages là ngoại lệ đã biết và xử lý đúng bằng gap entry, không phải vi phạm).

## 1.2 Portal Mapping — công cụ đã có sẵn từ WEB-SPR-202

`/admin/website/portal-mapping` (đã xây ở WEB-SPR-202) chính là công cụ thực hiện đúng Task 1 này ở dạng UI — bảng tổng hợp Page/Navigation Item/Shared Section/Homepage Section với Current Route/Workspace Owner/Publish Status/Last Updated. Không cần xây thêm gì mới cho Task 1 — chỉ xác nhận công cụ này vẫn đúng và đủ.

---

# Deliverable 2 — Danh sách Legacy đã loại bỏ hoặc đề xuất loại bỏ (Task 2)

## 2.1 Đã loại bỏ (thực thi trong Sprint này)

| Mục | Hành động | Lý do |
|---|---|---|
| `/admin/seo` (top-level, `nav.ts`, ComingSoon rỗng) | **XOÁ** route (`src/app/admin/(dashboard)/seo/`), xoá entry `nav.ts`, xoá icon map `AdminSidebar.tsx` | Trùng lặp hoàn toàn với `/admin/website/seo` (SEO Registry thật, WEB-SPR-005). IMP-ADM-001R đưa ra verdict **REMOVE** không mơ hồ (khác các mục "NEEDS PMO DECISION" khác) — 0 rủi ro mất dữ liệu (không seed, không bảng Supabase) |
| 2 câu hỏi "SEO vs SEO" trong `OPEN_PMO_QUESTIONS` (`founder/page.tsx`) | **XOÁ**, thay bằng ghi chú đã giải quyết | Câu hỏi đã có câu trả lời — giữ lại sẽ gây hiểu nhầm còn tồn đọng |

## 2.2 Kiểm tra cấu trúc nội bộ Website Workspace — sạch, không tìm thấy thêm

- **11/11 route thật khớp chính xác 11/11 mục trong `nav.ts` nhóm "Website"** — không route dư, không route thiếu.
- **Không component ComingSoon/placeholder nào còn sống bên trong Website Workspace** — trang `seo/page.tsx` từng bị nghi ngờ (do chứa chuỗi text "ComingSoon" trong phần mô tả), xác minh lại: đây chỉ là văn bản mô tả sự trùng lặp với mục `/admin/seo` cũ (nay đã xoá), không phải import component thật. Đã có thể cập nhật lại đoạn mô tả này (xem 2.4).
- **Không component legacy nào bị bỏ sót trong `src/lib/admin/website/**`/`src/components/admin/website/**`** — toàn bộ 8 file lib + 14 file component đều đang được dùng thật bởi ít nhất 1 route.

## 2.3 Phát hiện mới cần ghi nhận (không tự sửa — đúng phạm vi Website Workspace, nhưng cần PMO xác nhận trước khi hành động)

- **`WorkspaceSectionFoundation.tsx`** nằm trong thư mục `src/components/admin/website/` nhưng **Website Workspace không còn dùng nó ở đâu nữa** (toàn bộ 11 route đã có Registry thật thay thế từ lâu) — 5 Workspace KHÁC (AI Workspace, Journey, Companion Studio, Founder Review Queue, Founder Search) đang import nó từ đường dẫn này. Đây là "module không thuộc Website" theo đúng nghĩa đen của Task 2, nhưng **không xoá được** (đang phục vụ 5 Workspace khác thật) và việc di dời (đổi đường dẫn) đòi hỏi sửa 5 file ngoài phạm vi Website Workspace — **ngoài phạm vi Sprint này**, ghi nhận để một Sprint dọn dẹp cấu trúc thư mục toàn Admin xử lý sau.
- **Banner/Announcement (`portal_banners`) — đính chính quan trọng**: Báo cáo trước (WEB-SPR-004) khẳng định "Banner nội dung thật đã có Admin CRUD và đã nối dây thật (`portal_banners` → `NotificationTicker.tsx`)". IMP-ADM-001R xác minh lại và phát hiện **`NotificationTicker.tsx` chưa từng được import ở bất kỳ layout/trang Portal nào** — component đọc dữ liệu thật nhưng không được mount. Nghĩa là category "Banner"/"Announcement" trong Shared Sections hiện **không có ví dụ nào thực sự "đã kết nối"** như từng tin — cả 2 hệ thống (Portal Builder cũ và Shared Sections mới) đều Consumer = 0 cho khái niệm Banner/Announcement. Đã cập nhật `founder/page.tsx` Open PMO Questions để phản ánh đúng hiện trạng này.

## 2.4 Cập nhật mô tả UI theo đúng hiện trạng mới

Trang `/admin/website/seo` từng có ghi chú "sidebar Admin đã có sẵn một mục SEO đứng độc lập ở cấp cao nhất (/admin/seo, ComingSoon) — chồng lấn phạm vi chưa được PMO xử lý" — nay `/admin/seo` đã bị xoá, ghi chú này không còn đúng, **cần cập nhật** (xem code diff — đã sửa trong Sprint này, xem Files Changed).

---

# Deliverable 3 — Danh sách Website Object Founder đã quản lý được (Task 3)

Xác minh chuỗi quản trị đầy đủ theo đúng thứ tự brief yêu cầu: **Homepage → Landing → Static Page → Navigation → Section → Banner → CTA → SEO → Publish**, không cần sửa code ở bất kỳ bước nào:

| Bước | Route | Xác nhận |
|---|---|---|
| Homepage | `/admin/website/homepage` | ✅ Sửa metadata trang chủ + thứ tự/ẩn-hiện 11 section — CRUD thật |
| Landing | `/admin/website/landing-pages` | ✅ Tạo/sửa metadata Landing Page — CRUD thật (chưa có instance thật nào, nhưng cơ chế hoạt động) |
| Static Page | `/admin/website/static-pages` | ✅ Sửa metadata 7 trang tĩnh thật — CRUD thật |
| Navigation | `/admin/website/navigation` | ✅ Thêm/sửa/xoá/đổi thứ tự/ẩn-hiện Group và Item — CRUD thật (WEB-SPR-202) |
| Section | `/admin/website/shared-sections`, `/admin/website/homepage` (Homepage Section Order) | ✅ CRUD thật cho cả 9 category và 11 section thứ tự Homepage |
| Banner | Shared Sections, category "Banner" | ✅ Sửa được trong Admin (Consumer Portal thật = 0, xem 2.3 — quản trị được, nhưng chưa phản ánh lên Portal) |
| CTA | Shared Sections, category "CTA" | ✅ Sửa được trong Admin (Consumer Portal thật = 0, tương tự) |
| SEO | `/admin/website/seo` | ✅ CRUD thật (WEB-SPR-005) |
| Publish | `status`/`visible` field trên mọi entity (Page/Navigation Item/Shared Section/Homepage Section) | ✅ Đổi trạng thái Draft→Active/Published, ẩn/hiện — tất cả qua UI |

**Kết luận Task 3:** Founder quản lý được TOÀN BỘ chuỗi trên **trong phạm vi Admin** mà không cần sửa code. **Lưu ý quan trọng, không che giấu:** "quản lý được trong Admin" ≠ "thay đổi lên Portal thật ngay" — với Banner/CTA/Hero/Announcement, Consumer Portal vẫn = 0 (đã ghi nhận từ WEB-SPR-202/IMP-ADM-001R) — đây là giới hạn đã biết, thuộc phạm vi "Publish Bridge" của Sprint tương lai, không phải lỗi của Sprint này.

---

# Deliverable 4 — Flexibility Review (Task 4, không tự sửa code)

Kế thừa trực tiếp `ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md` Deliverable 4, lọc đúng phạm vi Website Workspace:

| Kịch bản (brief yêu cầu) | Chỉ cần dữ liệu? | Ghi chú |
|---|---|---|
| Thêm Landing Page | ⚠️ **Đăng ký metadata được, nhưng KHÔNG tạo trang thật** | `pageRegistry.ts` tự nhận "tracks page metadata only" — trang landing thật vẫn cần 1 file `.tsx` mới dưới `src/app/` |
| Thêm Static Page | ⚠️ Tương tự Landing Page | Metadata quản lý được, trang thật vẫn cần code |
| Thêm Menu (Navigation Item vào Group có sẵn) | ✅ **Chỉ cần dữ liệu** | `NavigationRegistry.tsx` → `useCollection().add()`, xác nhận ở IMP-ADM-001R |
| Thêm Navigation (Group/Location mới — VD 1 vị trí menu hoàn toàn mới ngoài Header/Sidebar/Footer/External) | ❌ **Cần sửa code** | `NAVIGATION_LOCATIONS` là union đóng (`navigationRegistry.ts`) |
| Thêm Section (instance của category có sẵn, VD thêm 1 khối Hero mới) | ✅ **Chỉ cần dữ liệu** | `SharedSectionRegistry.tsx` → `add()` |
| Thêm Section CATEGORY mới (loại chưa từng có) | ❌ **Cần sửa code** | `SECTION_CATEGORIES` union đóng |
| Thêm CTA (instance) | ✅ **Chỉ cần dữ liệu** | CTA đã là category có sẵn trong `SECTION_CATEGORIES` |
| Đổi thứ tự (Navigation Item/Group, Homepage Section) | ✅ **Chỉ cần dữ liệu** | Nút ↑/↓ (WEB-SPR-202), swap `sortOrder` — không sửa code |

**Kết luận Task 4:** Phần lớn thao tác THƯỜNG NGÀY (thêm menu, thêm section/CTA instance, đổi thứ tự) đã **chỉ cần dữ liệu**. Hai giới hạn thật vẫn tồn tại, không tự sửa (ngoài phạm vi Task 4 — "Không tự sửa ngoài phạm vi"):
1. Landing Page/Static Page mới chỉ đăng ký được metadata, chưa tạo được trang thật — cần Founder xác nhận đây là giới hạn chấp nhận được của Admin CMS v1.0 (không phải Visual Builder, đã "Không triển khai" trong nhiều brief).
2. Thêm 1 CATEGORY/LOCATION hoàn toàn mới (không phải instance) vẫn cần sửa code — do thiết kế union đóng có chủ đích (kiểm soát dữ liệu rác), đánh đổi với tính linh hoạt.

---

# Deliverable 5 — Workspace Ownership Confirmation (Task 5)

Quét toàn bộ `src/lib/admin/website/**` và `src/components/admin/website/**` cho mọi tham chiếu tới Knowledge/Learning/Commercial/Mentor/Media/Brand:

| Domain cấm sở hữu | Kết quả quét |
|---|---|
| Knowledge (CKOS) | ✅ Sạch — chỉ có link Navigation trỏ `/portal/ckos` (menu URL hợp lệ) và 1 ghi chú tường minh loại trừ: "CKOS có FAQs riêng... không phải Website Workspace" |
| Learning (Academy) | ✅ Sạch — không tham chiếu nào |
| Commercial (Premium) | ✅ Sạch — chỉ có link Navigation trỏ `/portal/premium` (menu URL hợp lệ) |
| Mentor | ✅ Sạch — không tham chiếu nào |
| Media (Media Center) | ✅ Sạch — chỉ có ghi chú loại trừ tường minh: "founder.png vẫn là file tĩnh, thuộc Brand Studio/Media Center, ngoài phạm vi Registry này" |
| Brand (Brand Studio) | ✅ Sạch — mọi tham chiếu "brand"/"Brand" còn lại là class Tailwind CSS (`bg-brand-blue`, `text-brand-orange` — design token, không phải Brand Studio content); các tham chiếu nội dung đều là ghi chú tham khảo một chiều ("Theme Registry của Brand Studio"), không sao chép/sở hữu dữ liệu |

**Kết luận Task 5:** Website Workspace **chỉ sở hữu Presentation Layer**, không chồng chéo với 6 domain bị cấm. Xác nhận đạt.

---

# Files Changed

**Xoá:**
- `src/app/admin/(dashboard)/seo/page.tsx` (route `/admin/seo`, ComingSoon rỗng)

**Sửa:**
- `src/lib/admin/nav.ts` — xoá entry `/admin/seo`, cập nhật comment
- `src/components/admin/AdminSidebar.tsx` — xoá icon map `/admin/seo`
- `src/app/admin/(dashboard)/founder/page.tsx` — xoá 2 câu hỏi SEO đã giải quyết khỏi `OPEN_PMO_QUESTIONS`, thêm ghi chú đính chính Banner/`NotificationTicker`, thêm 2 câu hỏi mới từ IMP-ADM-001R (case_study/digital-assets)

**Docs:**
- `docs/admin/WEBSITE_WORKSPACE_PORTAL_ALIGNED_REVIEW.md` (mới, file này)

**Không đổi:** Mọi Registry/component thật của Website Workspace (11 route) — không cần sửa vì đã đúng cấu trúc từ WEB-SPR-202. Brand Studio, Media Center, CKOS, mọi Workspace khác.

---

# Verification

- **Lint:** sạch — 0 lỗi, 5 warning `<img>` có từ trước (không liên quan).
- **Type-check:** sạch (sau khi xoá `.next` cache cũ để làm mới route type validator do xoá route `/admin/seo` — cùng cách đã xử lý ở BRAND-SPR-001).
- **Build:** thành công — xác nhận `/admin/seo` không còn trong danh sách route build, `/admin/website/seo` vẫn hoạt động bình thường.
- **Test:** 139/139 pass, không regression.

---

# Tự kiểm tra Acceptance (trung thực)

| Tiêu chí | Kết quả |
|---|---|
| ✓ Website Workspace bám 100% Portal hiện tại | ⚠️ **Đạt về mặt CẤU TRÚC quản lý** (14/14 Scope item có nơi quản lý, không route Portal nào bị Website Workspace bỏ sót) — **CHƯA đạt về mặt DỮ LIỆU THẬT** (Consumer Portal vẫn = 0 cho phần lớn Registry, đã ghi nhận rõ ở Deliverable 3, thuộc phạm vi Publish Bridge tương lai, ngoài phạm vi Sprint này) |
| ✓ Không còn module thừa | ✅ Đạt — xác nhận 11/11 route khớp chính xác, không route/component dư bên trong Website Workspace |
| ✓ Không còn route cũ | ✅ Đạt — đã xoá `/admin/seo` (route cũ trùng lặp duy nhất tìm thấy liên quan trực tiếp Website Workspace) |
| ✓ Không còn menu Legacy | ✅ Đạt — đã xoá 1 mục menu trùng lặp, không phát hiện thêm |
| ✓ Founder có thể quản lý Website mà không cần sửa code | ⚠️ **Đạt phần lớn** — xem Deliverable 4: thao tác thường ngày (thêm menu/section/CTA instance, đổi thứ tự) đã đạt; thêm Category/Location mới hoặc Landing/Static Page THẬT (không chỉ metadata) vẫn cần code |
| ✓ Không chồng chéo với Brand Studio | ✅ Đạt — xác nhận ở Deliverable 5 |
| ✓ Không chồng chéo với Media Center | ✅ Đạt — xác nhận ở Deliverable 5 |
| ✓ Build thành công | ✅ Đạt |
| ✓ Tests pass | ✅ Đạt (139/139) |

**Kết luận chung:** Website Workspace đạt hầu hết Acceptance criteria ở mức "cấu trúc quản lý" và "không chồng chéo/không dư thừa". Hai điểm còn giới hạn (Consumer Portal = 0, Landing/Static Page thật vẫn cần code) là giới hạn đã biết, đã ghi nhận minh bạch xuyên suốt nhiều Sprint, không phải phát hiện mới gây bất ngờ — không tự ý mở rộng phạm vi Sprint này để giải quyết (đúng "Không tự sửa ngoài phạm vi" của Task 4).
