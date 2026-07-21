export type AdminNavItem = { label: string; href: string };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

/**
 * Nguồn sự thật cho AdminSidebar + AdminSearch. Chỉ liệt kê route THẬT SỰ
 * tồn tại — khung admin đang được dựng lại từng phần (xem
 * docs kế hoạch), thêm entry mới ở đây mỗi khi 1 collection có page.tsx
 * riêng, không thêm trước để tránh link chết trong chính sidebar.
 */
export const adminNavGroups: AdminNavGroup[] = [
  {
    group: null,
    items: [
      { label: "Tổng quan", href: "/admin/dashboard" },
      { label: "Companion", href: "/admin/companion" },
    ],
  },
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
    // UI language layer (Folder → Card → Content) — chỉ đổi nhãn hiển thị,
    // không đổi route/collectionKey/schema. Mỗi mục dưới đây là 1 "Folder".
    group: "Hệ tri thức (CKOS)",
    items: [
      { label: "Prompt (Folder)", href: "/admin/ckos/prompts" },
      { label: "SOP / Workflow (Folder)", href: "/admin/ckos/sop" },
      { label: "Resource (Folder)", href: "/admin/ckos/resources" },
      { label: "Template (Folder)", href: "/admin/ckos/templates" },
      { label: "Ebook (Folder)", href: "/admin/ckos/ebooks" },
      { label: "Checklist (Folder)", href: "/admin/ckos/checklists" },
      { label: "Lesson (Folder)", href: "/admin/ckos/lessons" },
      { label: "Thư viện AI (Folder)", href: "/admin/ckos/knowledge-collections" },
      { label: "Câu chuyện thành công (Folder)", href: "/admin/ckos/case-studies" },
      { label: "Thực hành tốt (Folder)", href: "/admin/ckos/best-practices" },
    ],
  },
];
