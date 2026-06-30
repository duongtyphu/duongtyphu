/**
 * Vietnamese translations — ngôn ngữ mặc định, luôn đầy đủ.
 * Mọi key ở đây là ground truth. en.ts map sang cùng key shape.
 */
export const vi = {
  nav: {
    home: "Trang chủ",
    // Legacy (giữ lại, có thể dùng lại)
    journey: "Hành trình",
    knowledge: "Tri thức",
    build: "Xây dựng",
    connect: "Kết nối",
    legacy: "Di sản",
    // Portal Knowledge Architecture — 3 hành trình
    sectionLearning: "Học hỏi",
    sectionBuilding: "Xây dựng",
    sectionGrowth: "Trưởng thành",
    aiWorkspace: "Không gian AI",
    knowledgeLibrary: "Thư viện tri thức",
    learningJournal: "Nhật ký học tập",
    academy: "Học viện",
    projectsOpportunities: "Dự án & Cơ hội",
    community: "Cộng đồng",
    companion: "Companion",
    myJourney: "Hành trình của tôi",
    language: "Ngôn ngữ",
  },
  language: {
    label: "Ngôn ngữ",
    vi: "Tiếng Việt",
    en: "English",
    comingSoon: "Sắp ra mắt",
    switchTo: "Chuyển sang",
  },
  account: {
    settings: "Cài đặt tài khoản",
    backToSite: "Về website chính",
    logout: "Đăng xuất",
  },
  search: {
    placeholder: "Tìm trong Portal...",
    noResults: "Không tìm thấy kết quả phù hợp.",
    label: "Tìm kiếm toàn Portal",
  },
  portal: {
    menuLabel: "Menu Portal",
    closeMenu: "Đóng menu",
    notifications: "Thông báo",
    savedContent: "Nội dung đã lưu",
    toggleMenu: "Mở hoặc thu gọn menu",
    search: "Tìm kiếm",
    closeSearch: "Đóng tìm kiếm",
    account: "Tài khoản",
  },
} as const;

export type PortalTranslations = typeof vi;
