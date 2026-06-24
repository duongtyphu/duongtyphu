export type AdminNavItem = { label: string; href: string };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

export const adminNavGroups: AdminNavGroup[] = [
  { group: null, items: [{ label: "Tổng quan", href: "/admin/dashboard" }] },
  {
    group: "Portal Builder",
    items: [
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
    group: "Lộ trình",
    items: [
      { label: "Lộ trình thành công", href: "/admin/roadmap" },
      { label: "Nhiệm vụ hôm nay", href: "/admin/daily-missions" },
      { label: "Tiến độ học viên", href: "/admin/student-progress" },
    ],
  },
  {
    group: "Học tập",
    items: [
      { label: "Học viện AI", href: "/admin/ai-academy" },
      { label: "Học viện Affiliate", href: "/admin/affiliate-academy" },
      { label: "Thương hiệu cá nhân", href: "/admin/personal-brand" },
      { label: "Dự án thực chiến", href: "/admin/projects" },
    ],
  },
  {
    group: "Thư viện",
    items: [
      { label: "Prompt AI", href: "/admin/prompts" },
      { label: "Công cụ AI", href: "/admin/tools" },
      { label: "Template", href: "/admin/templates" },
      { label: "Ebook", href: "/admin/ebooks" },
      { label: "Checklist", href: "/admin/checklists" },
      { label: "SOP", href: "/admin/sop" },
      { label: "Tài nguyên đã lưu", href: "/admin/saved" },
    ],
  },
  {
    group: "Affiliate",
    items: [
      { label: "Affiliate Hub", href: "/admin/affiliate-hub" },
      { label: "Sản phẩm Affiliate", href: "/admin/affiliate/products" },
      { label: "Link Affiliate", href: "/admin/affiliate/links" },
      { label: "Tracking", href: "/admin/affiliate/tracking" },
      { label: "Báo cáo Affiliate", href: "/admin/affiliate/analytics" },
    ],
  },
  {
    group: "Nội dung",
    items: [
      { label: "Blog AI", href: "/admin/blog" },
      { label: "Case Study", href: "/admin/case-study" },
      { label: "Thành công học viên", href: "/admin/student-success" },
      { label: "Tin tức & Cập nhật", href: "/admin/updates" },
    ],
  },
  { group: null, items: [{ label: "Cộng đồng", href: "/admin/community" }] },
  { group: null, items: [{ label: "Người dùng", href: "/admin/users" }] },
  { group: null, items: [{ label: "Leads", href: "/admin/leads" }] },
  { group: null, items: [{ label: "Báo cáo", href: "/admin/reports" }] },
  { group: null, items: [{ label: "Cài đặt", href: "/admin/settings" }] },
];
