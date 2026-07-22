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
      // Vị trí cũ (trước đợt xoá admin df156f3): giữa Daily Missions và
      // Projects trong sidebar cũ — nhóm "Nội dung" hiện tại là chỗ khớp
      // nhất (không thuộc 7 Intelligence của CKOS). Icon Wallet đã có sẵn
      // trong AdminSidebar.tsx navIcons["/admin/course-pricing"], không
      // cần thêm.
      { label: "Giá khoá học Premium", href: "/admin/course-pricing" },
      // Việc 5 (Nhóm B), phương án (a): chỉ quản 9 field hiện có của bảng
      // `projects`, đã nối lại đúng nguồn đọc ở /portal/duan-cohoi (trang
      // hub). Trang chi tiết [ecosystemSlug]/[subProjectSlug] vẫn tĩnh —
      // xem CLAUDE.md mục "Dự án & Cơ hội".
      { label: "Dự án & Cơ hội", href: "/admin/projects" },
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
      { label: "CKOS Dashboard", href: "/admin/ckos" },
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
  {
    // Việc 6 (Nhóm B) — Founder xác nhận cần tự sửa 6 khối nội dung ở
    // /portal/su-menh-companion. Tên hiển thị tiếng Việt Founder-friendly,
    // không lộ tên field kỹ thuật (mission-items/constitution/genome...).
    group: "Sứ mệnh Companion",
    items: [
      { label: "Sứ mệnh", href: "/admin/su-menh-companion/mission" },
      { label: "Triết lý", href: "/admin/su-menh-companion/philosophy" },
      { label: "Điều lệ", href: "/admin/su-menh-companion/constitution" },
      { label: "Bộ gene", href: "/admin/su-menh-companion/genome" },
      { label: "Hành trình tiến hoá", href: "/admin/su-menh-companion/evolution" },
      { label: "Dòng thời gian", href: "/admin/su-menh-companion/timeline" },
      // Phần 2 — tách riêng khỏi 6 khối văn bản trên (bản chất khác hẳn:
      // ảnh nghệ thuật có sẵn, chỉ quản title/thứ tự, không quản ảnh).
      { label: "Ảnh Companion (thứ tự & tiêu đề)", href: "/admin/su-menh-companion/flipbook" },
      // THÍ ĐIỂM (pilot) — inline editing cách A, chỉ 2 vùng đại diện
      // (Điều lệ, Bộ gene). KHÔNG thay thế 2 mục VisualEditor ở trên —
      // Founder tự đánh giá có đáng nhân rộng cho các module khác không.
      { label: "🧪 Sửa trực tiếp (Thí điểm)", href: "/admin/su-menh-companion/live-edit" },
    ],
  },
  {
    // Việc 9 — 5 cửa của "Hành trình của tôi", tách dần từng cửa (Mirror
    // trước, an toàn nhất). CHỈ static chrome — KHÔNG đụng dữ liệu động
    // (reflections/memory_capsules/growth-view.ts/localStorage) — xem
    // CLAUDE.md mục "Hành trình của tôi".
    group: "Hành trình của tôi",
    items: [
      { label: "Mirror — Nội dung tĩnh", href: "/admin/hanh-trinh-cua-toi/mirror-chrome" },
      { label: "Mirror — Câu hỏi", href: "/admin/hanh-trinh-cua-toi/mirror-questions" },
      { label: "Nhật ký học tập — Nội dung tĩnh", href: "/admin/hanh-trinh-cua-toi/journal-chrome" },
      { label: "Nhật ký học tập — Ý định học tiếp", href: "/admin/hanh-trinh-cua-toi/journal-intentions" },
      { label: "My Story — Nội dung tĩnh", href: "/admin/hanh-trinh-cua-toi/story-chrome" },
      { label: "Bản đồ hành trình — Nội dung tĩnh", href: "/admin/hanh-trinh-cua-toi/map-chrome" },
      { label: "Khu vườn của bạn — Nội dung tĩnh", href: "/admin/hanh-trinh-cua-toi/garden-chrome" },
    ],
  },
  {
    // Việc 10 — nguồn gốc src/data/portal/ai-workspace.ts (WORK_NEEDS/FAQ),
    // tách theo đúng trang portal hiển thị /portal/hocvienai — xem CLAUDE.md
    // mục "Việc 10 + Việc 11". Tách thành nhóm riêng, khớp cách Portal tự
    // tách "Học viện AI" và "AI Workspace" thành 2 mục riêng trong menu
    // (portalNavSections, src/lib/portal/hubs.ts), không gộp chung 1 nhóm.
    group: "Học viện AI",
    items: [
      { label: "Theo nhu cầu công việc", href: "/admin/hocvienai/work-needs" },
      { label: "Câu hỏi thường gặp", href: "/admin/hocvienai/faq" },
    ],
  },
  {
    // Việc 11 — cùng nguồn ai-workspace.ts (RECOMMENDED_WORKSPACES/
    // AI_WORKFLOWS), thuộc /portal/aiworkspace — xem CLAUDE.md.
    group: "AI Workspace",
    items: [
      { label: "Workspace đề xuất", href: "/admin/aiworkspace/recommended-workspace" },
      { label: "Quy trình AI (Workflow)", href: "/admin/aiworkspace/ai-workflow-sections" },
    ],
  },
];
