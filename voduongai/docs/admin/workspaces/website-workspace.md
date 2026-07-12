# Website Workspace — Workspace Canonical Specification

## 1. Executive Summary

Website Workspace là nơi quản trị toàn bộ nội dung "mặt tiền" công khai của VO DUONG AI — trang chủ marketing, trang landing, trang tĩnh, menu điều hướng, khối nội dung dùng chung (footer/CTA/banner), SEO, redirect, và cấu hình hiển thị toàn site. Vai trò của Workspace này là biến những gì hiện đang là code (hardcoded trong `src/components/home/*.tsx`, `src/lib/site.ts`, `src/lib/portal/hubs.ts`...) thành nội dung Founder tự quản lý được, không cần deploy code cho các thay đổi nội dung thường ngày. Giá trị lớn nhất: đây là nơi tập trung nội dung marketing có ảnh hưởng trực tiếp tới chuyển đổi (Hero, CTA, Founder Story, Trust Stats) — hiện có Coverage thấp nhất (~10%, theo `docs/admin/PORTAL_COVERAGE_AUDIT.md` §8) trong khi giá trị kinh doanh cao nhất.

## 2. Mission

Đảm bảo Founder có thể tự vận hành toàn bộ trải nghiệm website công khai — từ trang chủ tới từng trang landing chiến dịch — mà không cần yêu cầu deploy code, đồng thời không đánh đổi chất lượng/độ chính xác của nội dung pháp lý và kỹ thuật (những phần cố tình giữ ngoài phạm vi CRUD tự do, xem Mục 4).

## 3. Scope

Đúng 10 nhóm Canonical Information Architecture (đã khóa từ WEB-SPR-001, PMO Clarification xác nhận không đổi tên/thêm/bớt):

1. **Dashboard** — tổng quan Website Workspace (số liệu, thay đổi gần nhất, lối tắt).
2. **Pages** — Website Page Registry, danh sách tổng hợp mọi trang (Homepage/Landing Pages/Static Pages).
3. **Navigation** — menu điều hướng site công khai và sidebar Portal.
4. **Homepage** — trang chủ marketing công khai (Hero, Trust Stats, Founder Story, Problem/Solution, Academy Teaser, Final CTA).
5. **Landing Pages** — trang landing chuyên biệt (chương trình, chiến dịch).
6. **Static Pages** — trang tĩnh (Giới thiệu, Liên hệ; trang pháp lý xem Mục 4).
7. **Shared Sections** — khối nội dung dùng chung nhiều nơi (Footer, CTA, Banner/Announcement).
8. **SEO** — metadata SEO (title/description/OG) cho từng trang thuộc Workspace này.
9. **Redirect** — quản lý chuyển hướng URL.
10. **Global Settings** — Website Settings, Global Presentation Settings, Homepage Configuration, Visibility Configuration.

## 4. Out of Scope

- **Nội dung Portal đã đăng nhập** (CKOS, Academy, AI Workspace, Premium, Projects & Opportunities, Community, Companion, My Journey) — mỗi khu vực có Workspace riêng.
- **Nội dung pháp lý** (Terms/Privacy/Refund Policy/Disclaimer) — dù nằm trong nhóm "Static Pages" theo IA, phần *nội dung* pháp lý không đưa vào CRUD tự do; Website Workspace chỉ theo dõi metadata (trạng thái/hiển thị) của các trang này, không chỉnh sửa nội dung pháp lý. Khuyến nghị giữ nguyên từ `docs/admin/PORTAL_COVERAGE_AUDIT.md` §5.
- **Thiết kế hình ảnh/thương hiệu** (logo, favicon, bảng màu, thư viện media) — thuộc Brand Studio/Media Center.
- **Xây dựng nội dung trực quan của trang** (Visual Builder/Block Editor/Section Editor/Landing Builder/AI Generator) — chưa có ở bất kỳ Sprint nào tính đến nay (WEB-SPR-001/002 chỉ có Foundation + Page Registry metadata).

## 5. Information Architecture

10 nhóm ở Mục 3, mỗi nhóm là một route thật dưới `/admin/website/*`:

| Nhóm | Route |
|---|---|
| Dashboard | `/admin/website` |
| Pages | `/admin/website/pages` |
| Navigation | `/admin/website/navigation` |
| Homepage | `/admin/website/homepage` |
| Landing Pages | `/admin/website/landing-pages` |
| Static Pages | `/admin/website/static-pages` |
| Shared Sections | `/admin/website/shared-sections` |
| SEO | `/admin/website/seo` |
| Redirect | `/admin/website/redirect` |
| Global Settings | `/admin/website/global-settings` |

Điều hướng nội bộ: thanh tab ngang qua đúng 10 nhóm (`WebsiteWorkspaceShell`), lồng trong Shared Admin Layout/Breadcrumb/Header/Permission/Notification chung của toàn Admin. Nguồn IA duy nhất trong code: `src/lib/admin/website/navigation.ts`.

## 6. Portal Coverage

Theo `docs/admin/PORTAL_COVERAGE_AUDIT.md`:

| Portal Component | Hiện trạng | Workspace mapping |
|---|---|---|
| Home marketing sections (Hero/TrustStats/FounderStory/Problem/Solution/AcademyTeaser/FinalCTA) | 100% hardcoded, `src/components/home/*.tsx` | Homepage |
| Nav menu công khai (`site.ts`), sidebar Portal (`hubs.ts`) | 100% hardcoded | Navigation |
| Footer công khai (`Footer.tsx`) | 100% hardcoded | Shared Sections |
| Banner (`portal_banners`) | **Đã nối dây thật** (NotificationTicker) | Shared Sections |
| CTA/Featured/Sections/Welcome/Today-actions/Start-here (`portal_cta`, `portal_featured`, `portal_sections`, `portal_welcome`, `today_action_cards`, `start_here_steps`) | **Orphan** — Admin CRUD tồn tại (Portal Builder cũ) nhưng không route Portal nào đọc | Shared Sections (CTA/Banner/Featured) / Academy hoặc My Journey (today-actions/start-here — chưa xác định dứt điểm) |
| Per-page SEO metadata | Hardcoded literal mỗi `page.tsx` | SEO |
| Redirect (student-success, updates, hanh-trinh-cua-toi) | Hardcoded `next.config.ts` | Redirect |
| Site settings (tên, logo URL, SEO mặc định, social, footer text) | Supabase `settings`, `/admin/settings` | Global Settings (chồng lấn với System Settings — xem Mục 8) |

Coverage Score hiện tại (ADM-SPR-005): **~10%** — thấp nhất trong 15 Workspace được đề xuất.

## 7. Content Ownership

| Entity | Editable Workspace | Consumer Workspace/Portal | Publish Target | Visibility Rule |
|---|---|---|---|---|
| Website Page (registry metadata) | Website Workspace | Portal rendering (chưa nối dây — WEB-SPR-002 chỉ có metadata) | Route tương ứng loại trang | `visible` field trên từng Page |
| Navigation menu | Website Workspace | Toàn Portal + site công khai | Header/Sidebar | Luôn hiển thị khi Published |
| Footer/CTA/Banner (Shared Sections) | Website Workspace | Toàn Portal + site công khai | Vị trí tương ứng trên trang | Theo trạng thái Published của từng khối |
| SEO metadata | Website Workspace | Search engine, social preview | `<head>` từng trang | Không áp dụng (luôn public) |
| Redirect rule | Website Workspace | Toàn site (middleware/routing) | N/A | Không áp dụng |

**Consumer hiện tại là 0** cho phần lớn entity ở trên — WEB-SPR-001/002 mới xây registry/metadata, chưa có Sprint nào nối Portal đọc dữ liệu thật từ Website Workspace. Đây là khoảng cách Content Ownership quan trọng nhất cần một Sprint riêng ("Website Publish Bridge") giải quyết.

## 8. Dependency

- **Owns:** Page metadata (Homepage/Landing/Static), Navigation menu, Shared Sections (Footer/CTA/Banner/Announcement), SEO metadata (phạm vi Website), Redirect rules, Global Presentation Settings.
- **Consumes:** `docs/admin/PORTAL_COVERAGE_AUDIT.md` (nguồn xác định phạm vi thật), Founder Directive Greenfield Admin (nguyên tắc thiết kế).
- **Provides:** (tương lai) Page metadata cho Portal render trang công khai; Navigation config cho toàn site.
- **Dependency Matrix (chồng lấn đã phát hiện, chưa xử lý):**

| Website Workspace | Workspace/mục khác | Loại chồng lấn | Trạng thái |
|---|---|---|---|
| SEO (Mục 3, #8) | "SEO" độc lập cấp cao nhất (ADM-SPR-002, `/admin/seo`) | Trùng tên, phạm vi chưa rõ ràng — SEO của Website Workspace hay SEO toàn site? | Chưa PMO quyết định |
| Global Settings (Mục 3, #10) | "System Settings" (`/admin/settings`, có từ trước EPIC-02) | Chồng lấn một phần (tên site/logo/favicon/SEO mặc định/social/footer text) | Chưa PMO quyết định |
| Shared Sections | Brand Studio (thư viện media, logo) | Banner/CTA có thể cần ảnh từ Media Center | Chưa xác định ranh giới chính xác |

## 9. Workflow

**Page Lifecycle (Product Workflow, không phải Technical Workflow):**

```
Draft → Review → Approved → Published → Archived
```

Một Page được soạn (Draft), gửi để xem xét (Review), được duyệt nội dung (Approved), xuất bản công khai (Published), và có thể lưu trữ khi không còn dùng (Archived). Chưa có bước tự động (gate/approval workflow engine) — chuyển trạng thái hiện là hành động thủ công của người có quyền Admin.

## 10. Dashboard Vision

Founder mở Website Workspace Dashboard và thấy ngay: tổng số trang đang quản lý, bao nhiêu đang Draft/Published/chờ Review, những thay đổi gần đây nhất (ai sửa gì, khi nào), và lối tắt để tạo/sửa nhanh các loại trang phổ biến. Mục tiêu là Founder không cần hỏi kỹ thuật "trang X đang ở trạng thái gì" — Dashboard trả lời ngay. *(Không mô tả UI cụ thể — xem sprint report kỹ thuật `WEBSITE_WORKSPACE_FOUNDATION.md` cho chi tiết implementation.)*

## 11. Automation Vision

Định hướng tương lai (chưa implement):
- Gợi ý SEO tự động (phân tích nội dung trang, đề xuất meta description).
- Tự tạo Redirect khi đổi Slug một trang đang Published (tránh gãy link).
- Lên lịch Publish/Unpublish theo thời gian (visible from/to).
- Cảnh báo nội dung "cũ" (trang không cập nhật quá N tháng) cho Founder xem lại.
- Đồng bộ hai chiều với Portal khi trang thay đổi trạng thái Published (tự động deploy/revalidate).

## 12. Future Expansion

| Hướng mở rộng | Đánh giá |
|---|---|
| Mobile | Chưa có API surface public nào cho nội dung Website — cần xây khi có nhu cầu app di động đọc nội dung này. |
| CRM | Không áp dụng trực tiếp cho Website Workspace (thuộc phạm vi một Workspace CRM tương lai, nếu có). |
| Marketplace | Không áp dụng trực tiếp. |
| API | Là ứng viên tự nhiên cho Public Content API trong tương lai (Page Registry đã có shape rõ ràng — Title/Slug/Status/SEO). |
| Enterprise | Không áp dụng cho Website công khai (Enterprise/multi-seat là khái niệm Portal nội bộ). |
| Multi-language | Website hiện 100% tiếng Việt, không có field ngôn ngữ trên Page Registry — cần mở rộng schema khi có yêu cầu đa ngôn ngữ. |
| Multi-site | Page Registry hiện giả định 1 site duy nhất — cần thêm khái niệm "site" nếu VDAI mở site con trong tương lai. |
| White Label | Chưa có cơ chế theme/tenant nào — ngoài phạm vi hiện tại. |

## 13. Product Decisions

- Page Registry dùng **một schema chung** cho cả 3 loại trang (Homepage/Landing/Static), phân biệt bằng `pageType` — không tạo schema riêng từng loại (WEB-SPR-002 Task 2).
- Trang pháp lý nằm trong IA "Static Pages" nhưng nội dung không mở CRUD tự do (Mục 4).
- Lifecycle Page dùng đúng 5 trạng thái (không có "Changes Requested" như CKOS) — mỗi Workspace có lifecycle riêng phù hợp nội dung của mình.

## 14. Founder Decisions

- **Website Workspace Product Package v1.0 — Approved.** Đây là Workspace đầu tiên được phép triển khai kỹ thuật trong EPIC-WEB-001 (WEB-SPR-001 Founder Directive).
- **Greenfield Admin Architecture** áp dụng cho toàn bộ Website Workspace — không kế thừa Legacy Admin/Portal Builder cũ, không giữ compatibility với dữ liệu test (`docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`).

## 15. PMO Decisions

- **Canonical Information Architecture — 10 nhóm, khóa.** PMO Clarification (WEB-SPR-001) xác nhận danh sách ở Mục 3/5 là nguồn chính thức duy nhất — không tự đổi tên/thêm/bớt.
- Thứ tự ưu tiên khi phát hiện khác biệt: **Founder Decision → PMO Clarification → Portal hiện tại → tài liệu cũ.**
- 2 điểm chồng lấn (Mục 8) — SEO và Global Settings — **chưa được PMO xử lý**, ghi nhận từ WEB-SPR-001, nhắc lại ở WEB-SPR-002, vẫn đang chờ quyết định tại thời điểm viết WCS này.

---

## Status

**Approved** — Product Package v1.0 đã được Founder/PMO phê duyệt trước WEB-SPR-001. WCS này (định dạng theo WCS Standard v1.0) tổng hợp lại quyết định đã có, không phải một quyết định mới.

## Version

1.0

## Approval Date

Trước khi WEB-SPR-001 bắt đầu (ngày chính xác không được ghi lại bằng văn bản trong repo — Product Package được phê duyệt ở cấp Founder/PMO ngoài repository, theo đúng `docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md` Mục 1 tinh thần "chưa chuẩn hóa thành tài liệu trong repository" áp dụng tương tự cho Product Package này).

## Last Updated

2026-07-12 (IMP-GOV-001, WCS Standard v1.0 hóa lần đầu — tổng hợp từ WEB-SPR-001 + WEB-SPR-002 + PORTAL_COVERAGE_AUDIT.md).
