export type AdminNavItem = { label: string; href: string; comingSoon?: boolean };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

/**
 * Canonical Admin sidebar structure — the 14 top-level groups approved by
 * PMO (ADM-SPR-002). Groups with no built module yet render a single
 * `comingSoon` entry pointing at a minimal placeholder page instead of a
 * business module. Item placement within multi-item groups (Content, CKOS,
 * Academy, Premium, Projects & Opportunities) reflects the current data-
 * ownership reality documented in docs/admin/ADMIN_SHELL.md §2 — some pages
 * (Portal Builder, Affiliate, Leads, roadmap/daily-missions) don't map to a
 * single obvious group and were placed using the closest-fit judgment call
 * recorded there, not a new business decision.
 */
export const adminNavGroups: AdminNavGroup[] = [
  { group: null, items: [{ label: "Dashboard", href: "/admin/dashboard" }] },
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
  { group: null, items: [{ label: "Media Center", href: "/admin/media-center", comingSoon: true }] },
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
      { label: "Dashboard Portal", href: "/admin/portal-builder" },
      { label: "Bắt đầu tại đây", href: "/admin/portal-builder/start-here" },
      { label: "Hôm nay bạn muốn làm gì", href: "/admin/portal-builder/today-actions" },
      { label: "Banner", href: "/admin/portal-builder/banner" },
      { label: "Nội dung nổi bật", href: "/admin/portal-builder/featured" },
      { label: "CTA", href: "/admin/portal-builder/cta" },
      { label: "Mục tiêu người dùng", href: "/admin/portal-builder/user-goals" },
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
  { group: null, items: [{ label: "Community", href: "/admin/community" }] },
  { group: null, items: [{ label: "Companion Studio", href: "/admin/companion-studio", comingSoon: true }] },
  { group: null, items: [{ label: "Users & Access", href: "/admin/users" }] },
  { group: null, items: [{ label: "Analytics", href: "/admin/reports" }] },
  { group: null, items: [{ label: "SEO", href: "/admin/seo", comingSoon: true }] },
  { group: null, items: [{ label: "System Settings", href: "/admin/settings" }] },
];
