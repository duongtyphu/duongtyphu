export type AdminNavItem = { label: string; href: string; comingSoon?: boolean };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

/**
 * Canonical Admin sidebar structure. Từ ADM-SPR-201 (Main Shell
 * Foundation), thứ tự nhóm được tổ chức theo đúng "Portal Navigation bắt
 * buộc" (10 mục, khớp portalNavSections) và "Workspace Navigation bắt
 * buộc" (11 mục, đúng thứ tự brief liệt kê: Website → Brand Studio →
 * Media Center → CKOS → Academy → AI Workspace → Projects & Opportunities
 * → Premium → Journey → Companion Studio → Community) — 2 nhóm mới "AI
 * Workspace" và "Journey" được thêm lần đầu ở sprint này. Các nhóm không
 * nằm trong 2 danh sách bắt buộc (Content, Users & Access, Analytics,
 * System Settings) được GIỮ NGUYÊN, không xóa — brief chỉ yêu cầu đảm
 * bảo 2 danh sách bắt buộc tồn tại, không yêu cầu loại bỏ phần còn lại
 * (xem docs/admin/ADMIN_CMS_MAIN_SHELL_FOUNDATION.md).
 *
 * WEB-SPR-201R: đã xoá mục "SEO" độc lập cấp cao nhất (`/admin/seo`,
 * ComingSoon rỗng) — bị thay thế hoàn toàn bởi `/admin/website/seo`
 * (SEO Registry thật, WEB-SPR-005), theo đúng khuyến nghị REMOVE của
 * `docs/admin/ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md` (mục #3, verdict rõ
 * ràng không mơ hồ, khác các mục "NEEDS PMO DECISION" khác trong cùng
 * báo cáo).
 *
 * PORTAL-SPR-301: đã xoá 6/7 mục "Portal Builder" (Dashboard Portal,
 * Bắt đầu tại đây, Hôm nay bạn muốn làm gì, Nội dung nổi bật, CTA, Mục
 * tiêu người dùng) — CRUD thật nhưng ghi vào 6 bảng Supabase
 * (`portal_sections`/`portal_welcome`/`start_here_steps`/
 * `today_action_cards`/`portal_featured`/`portal_cta`/`user_goals`)
 * không route Portal nào đọc, xác nhận lại độc lập ở sprint này (0 kết
 * quả grep `src/app/portal/**`), khớp khuyến nghị REMOVE của
 * `docs/admin/ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md` (mục #1, verdict rõ
 * ràng — "CRUD thật nhưng ghi vào khoảng không"). Giữ lại "Banner"
 * (`portal_banners`) — verdict khác (NEEDS PMO DECISION, không phải
 * REMOVE, vì `NotificationTicker.tsx` đã có sẵn chỉ thiếu 1 dòng mount).
 */
export const adminNavGroups: AdminNavGroup[] = [
  { group: null, items: [{ label: "Dashboard", href: "/admin/dashboard" }] },
  {
    group: "Founder",
    items: [
      { label: "Founder Workspace", href: "/admin/founder" },
      { label: "Workspace Owner Panel", href: "/admin/founder/owners" },
      { label: "Global Search", href: "/admin/founder/search" },
      { label: "Review Queue", href: "/admin/founder/review-queue" },
    ],
  },
  {
    group: "Portal Management",
    items: [
      { label: "Portal Dashboard", href: "/admin/portal" },
      { label: "Portal Areas", href: "/admin/portal/areas" },
      { label: "Page Registry", href: "/admin/portal/pages" },
      { label: "Content Registry", href: "/admin/portal/content" },
    ],
  },
  {
    group: "Portal Navigation",
    items: [
      { label: "Trang chủ Học viện", href: "/admin/portal/areas?area=home" },
      { label: "Companion", href: "/admin/portal/areas?area=companion" },
      { label: "Hệ tri thức AI (CKOS)", href: "/admin/portal/areas?area=ckos" },
      { label: "Học viện AI", href: "/admin/portal/areas?area=hocvienai" },
      { label: "AI Workspace", href: "/admin/portal/areas?area=aiworkspace" },
      { label: "Dự án & Cơ hội", href: "/admin/portal/areas?area=duan-cohoi" },
      { label: "Premium", href: "/admin/portal/areas?area=premium" },
      { label: "Hành trình của tôi", href: "/admin/portal/areas?area=hanhtrinh" },
      { label: "Sứ mệnh Companion", href: "/admin/portal/areas?area=su-menh-companion" },
      { label: "Cộng đồng", href: "/admin/portal/areas?area=congdongai" },
    ],
  },
  {
    group: "Website",
    items: [
      { label: "Dashboard", href: "/admin/website" },
      { label: "Pages", href: "/admin/website/pages" },
      { label: "Navigation", href: "/admin/website/navigation" },
      { label: "Homepage", href: "/admin/website/homepage" },
      { label: "Landing Pages", href: "/admin/website/landing-pages" },
      { label: "Static Pages", href: "/admin/website/static-pages" },
      { label: "Shared Sections", href: "/admin/website/shared-sections" },
      { label: "SEO", href: "/admin/website/seo" },
      { label: "Redirect", href: "/admin/website/redirect" },
      { label: "Global Settings", href: "/admin/website/global-settings" },
      { label: "Portal Mapping", href: "/admin/website/portal-mapping" },
    ],
  },
  {
    group: "Brand Studio",
    items: [
      { label: "Dashboard", href: "/admin/brand" },
      { label: "Logo", href: "/admin/brand/logo" },
      { label: "Wordmark", href: "/admin/brand/wordmark" },
      { label: "Typography", href: "/admin/brand/typography" },
      { label: "Color Palette", href: "/admin/brand/color-palette" },
      { label: "Theme", href: "/admin/brand/theme" },
      { label: "Icons", href: "/admin/brand/icons" },
      { label: "Open Graph", href: "/admin/brand/open-graph" },
      { label: "Brand Assets Registry", href: "/admin/brand/assets" },
      { label: "Global Brand Settings", href: "/admin/brand/settings" },
    ],
  },
  {
    group: "Media Center",
    items: [
      { label: "Dashboard", href: "/admin/media-center" },
      { label: "Media Library", href: "/admin/media-center/library" },
      { label: "Images", href: "/admin/media-center/images" },
      { label: "Videos", href: "/admin/media-center/videos" },
      { label: "Documents", href: "/admin/media-center/documents" },
      { label: "Audio", href: "/admin/media-center/audio" },
      { label: "Folder Management", href: "/admin/media-center/folders" },
      { label: "Collections", href: "/admin/media-center/collections" },
      { label: "Tags", href: "/admin/media-center/tags" },
      { label: "Media Settings", href: "/admin/media-center/settings" },
    ],
  },
  {
    group: "CKOS",
    items: [
      { label: "CKOS Dashboard", href: "/admin/ckos" },
      { label: "Goals", href: "/admin/ckos/goals" },
      { label: "Công cụ AI (Tools)", href: "/admin/tools" },
      { label: "Prompt AI (Prompts)", href: "/admin/prompts" },
      { label: "Workflows", href: "/admin/ckos/workflows" },
      { label: "Evaluations", href: "/admin/ckos/evaluations" },
      { label: "Tài nguyên (Resources)", href: "/admin/resources" },
      { label: "Case Study", href: "/admin/case-study" },
      { label: "Best Practices", href: "/admin/ckos/best-practices" },
      { label: "FAQs", href: "/admin/ckos/faqs" },
      { label: "Knowledge Seed", href: "/admin/knowledge-seed" },
    ],
  },
  {
    group: "Academy",
    items: [
      { label: "Lộ trình thành công", href: "/admin/roadmap" },
      { label: "Nhiệm vụ hôm nay", href: "/admin/daily-missions" },
      { label: "Dự án thực chiến", href: "/admin/projects" },
    ],
  },
  { group: null, items: [{ label: "AI Workspace", href: "/admin/ai-workspace", comingSoon: true }] },
  {
    group: "Projects & Opportunities",
    items: [
      { label: "Tổng quan", href: "/admin/digital-assets" },
      { label: "Hệ sinh thái DigiU", href: "/admin/digital-assets/category/digiu" },
      { label: "Đầu tư cổ phần tại SolarGroup", href: "/admin/digital-assets/category/equity" },
      { label: "Sàn giao dịch Crypto", href: "/admin/digital-assets/category/crypto" },
      { label: "Blockchain", href: "/admin/digital-assets/category/blockchain" },
      { label: "Trading", href: "/admin/digital-assets/category/trading" },
      { label: "Link dự án (tất cả)", href: "/admin/digital-assets/links" },
      { label: "Dự án", href: "/admin/digital-assets/projects" },
      { label: "Bài viết", href: "/admin/digital-assets/articles" },
      { label: "Cấu hình danh mục", href: "/admin/digital-assets/categories" },
      { label: "Báo cáo", href: "/admin/digital-assets/analytics" },
    ],
  },
  {
    group: "Premium",
    items: [
      { label: "Sản phẩm số", href: "/admin/premium" },
      { label: "Học phí V-SOLO / V-SCALE", href: "/admin/course-pricing" },
      { label: "Đơn hàng", href: "/admin/orders" },
      { label: "Mã giảm giá", href: "/admin/coupons" },
      { label: "Dịch vụ", href: "/admin/services" },
      { label: "Hỗ trợ", href: "/admin/support" },
      { label: "Leads", href: "/admin/leads" },
      { label: "Affiliate Hub", href: "/admin/affiliate-hub" },
      { label: "Top sản phẩm Affiliate", href: "/admin/affiliate-hub/top-products" },
      { label: "Sản phẩm Affiliate", href: "/admin/affiliate/products" },
      { label: "Link Affiliate", href: "/admin/affiliate/links" },
      { label: "Báo cáo Affiliate", href: "/admin/affiliate/analytics" },
    ],
  },
  { group: null, items: [{ label: "Journey", href: "/admin/journey", comingSoon: true }] },
  { group: null, items: [{ label: "Companion Studio", href: "/admin/companion-studio", comingSoon: true }] },
  { group: null, items: [{ label: "Community", href: "/admin/community" }] },
  {
    group: "Content",
    items: [
      { label: "Blog AI", href: "/admin/blog" },
      { label: "Thành công học viên", href: "/admin/student-success" },
      { label: "Tin tức & Cập nhật", href: "/admin/updates" },
      { label: "Tin nội bộ", href: "/admin/news" },
      { label: "Template", href: "/admin/templates" },
      { label: "Ebook", href: "/admin/ebooks" },
      { label: "Checklist", href: "/admin/checklists" },
      { label: "SOP", href: "/admin/sop" },
      { label: "Tài nguyên đã lưu", href: "/admin/saved" },
      { label: "Banner", href: "/admin/portal-builder/banner" },
    ],
  },
  { group: null, items: [{ label: "Users & Access", href: "/admin/users" }] },
  { group: null, items: [{ label: "Analytics", href: "/admin/reports" }] },
  { group: null, items: [{ label: "System Settings", href: "/admin/settings" }] },
];
