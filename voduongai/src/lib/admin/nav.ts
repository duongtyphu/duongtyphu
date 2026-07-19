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
];
