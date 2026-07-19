export type AdminNavItem = { label: string; href: string };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

/**
 * Nguồn sự thật cho AdminSidebar + AdminSearch. Chỉ liệt kê route THẬT SỰ
 * tồn tại — khung admin đang được dựng lại từng phần (xem
 * docs kế hoạch), thêm entry mới ở đây mỗi khi 1 collection có page.tsx
 * riêng, không thêm trước để tránh link chết trong chính sidebar.
 */
export const adminNavGroups: AdminNavGroup[] = [
  { group: null, items: [{ label: "Tổng quan", href: "/admin/dashboard" }] },
  {
    group: "Nội dung",
    items: [
      { label: "Công cụ AI", href: "/admin/tools" },
      { label: "Trang chủ Học viện", href: "/admin/home-cards" },
    ],
  },
  {
    // Thứ tự bám theo đúng thứ tự hiển thị của hub /portal/ckos
    // (getKnowledgeCategories()): Prompt, Workflow(SOP), Resource — sau đó
    // nối thêm Template/Ebook/Checklist (cùng họ schema AdminResource,
    // không có card riêng trên hub nhưng có bảng Supabase + route quản lý
    // riêng).
    group: "Hệ tri thức (CKOS)",
    items: [
      { label: "Prompt", href: "/admin/ckos/prompts" },
      { label: "SOP / Workflow", href: "/admin/ckos/sop" },
      { label: "Resource", href: "/admin/ckos/resources" },
      { label: "Template", href: "/admin/ckos/templates" },
      { label: "Ebook", href: "/admin/ckos/ebooks" },
      { label: "Checklist", href: "/admin/ckos/checklists" },
    ],
  },
];
