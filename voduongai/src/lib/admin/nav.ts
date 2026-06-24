export type AdminNavItem = { label: string; href: string };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

export const adminNavGroups: AdminNavGroup[] = [
  { group: null, items: [{ label: "Tổng quan", href: "/admin/dashboard" }] },
  {
    group: "Portal Builder",
    items: [{ label: "Portal Builder", href: "/admin/portal-builder" }],
  },
  {
    group: "Lộ trình",
    items: [
      { label: "Lộ trình thành công", href: "/admin/roadmap" },
      { label: "Nhiệm vụ hôm nay", href: "/admin/daily-missions" },
    ],
  },
  {
    group: "Học tập",
    items: [
      { label: "Học viện AI", href: "/admin/ai-academy" },
      { label: "Học viện Affiliate", href: "/admin/affiliate-academy" },
      { label: "Thương hiệu cá nhân", href: "/admin/personal-brand" },
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
      { label: "Tài nguyên", href: "/admin/resources" },
    ],
  },
  {
    group: "Affiliate",
    items: [
      { label: "Sản phẩm Affiliate", href: "/admin/affiliate/products" },
      { label: "Link Affiliate", href: "/admin/affiliate/links" },
      { label: "Báo cáo Affiliate", href: "/admin/affiliate/analytics" },
    ],
  },
  {
    group: "Nội dung",
    items: [
      { label: "Blog AI", href: "/admin/blog" },
      { label: "Case Study", href: "/admin/case-study" },
      { label: "Tin tức nội bộ", href: "/admin/news" },
    ],
  },
  { group: null, items: [{ label: "Cộng đồng", href: "/admin/community" }] },
  { group: null, items: [{ label: "Người dùng", href: "/admin/users" }] },
  { group: null, items: [{ label: "Leads", href: "/admin/leads" }] },
  { group: null, items: [{ label: "Báo cáo", href: "/admin/reports" }] },
  { group: null, items: [{ label: "Cài đặt", href: "/admin/settings" }] },
];
