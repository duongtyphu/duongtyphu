export const siteConfig = {
  name: "VO DUONG AI",
  displayName: "Võ Đương AI",
  tagline: "Học AI • Xây hệ thống • Tạo tài sản số",
  taglineSecondary:
    "Ứng dụng AI thực chiến cho công việc, kinh doanh và tạo giá trị bền vững.",
  url: "https://voduongai.com",
  description:
    "Hệ sinh thái giúp bạn học AI, ứng dụng AI vào công việc, xây thương hiệu cá nhân, làm Affiliate Marketing và tạo tài sản số — quy tụ trong một Portal duy nhất.",
  links: {
    facebook: "https://www.facebook.com/duong.vv",
    youtube: "https://www.youtube.com/@voduongofficial",
    tiktok: "https://www.tiktok.com/@vdai_academy",
    zalo: "https://zalo.me/0909150587",
  },
  community: {
    facebookGroup: "https://www.facebook.com/groups/24279131375123067",
    zaloGroup: "https://zalo.me/g/fcudmw102",
  },
  contact: {
    email: "typhuonline87@gmail.com",
    phone: "0909150587",
  },
};

export const bankConfig = {
  name: "Vietcombank",
  bankCode: "VCB",
  account: "0721000632922",
  owner: "VO VAN DUONG",
};

export const mainNav = [
  { label: "Trang chủ", href: "/" },
  { label: "Tài nguyên", href: "/portal/resources" },
  { label: "Công cụ AI", href: "/portal/tools" },
  { label: "Portal", href: "/portal" },
  { label: "Blog AI", href: "/blog" },
];

export const portalNavGroups = [
  {
    group: "Tổng quan",
    items: [
      { label: "Dashboard", href: "/portal" },
      { label: "Bắt đầu từ đây", href: "/portal/start-here" },
      { label: "Lộ trình thành công", href: "/portal/roadmap" },
    ],
  },
  {
    group: "Học",
    items: [
      { label: "Học viện", href: "/portal/academy" },
      { label: "Thư viện AI", href: "/portal/library" },
      { label: "Thực chiến", href: "/portal/practice" },
    ],
  },
  {
    group: "Phát triển",
    items: [
      { label: "Kiếm thu nhập", href: "/portal/earn" },
      { label: "Dự án & Cơ hội", href: "/portal/opportunities" },
      { label: "Premium", href: "/portal/premium" },
    ],
  },
  {
    group: "Hệ sinh thái",
    items: [
      { label: "AI Assistant", href: "/portal/ai-assistant" },
      { label: "Cộng đồng", href: "/portal/community" },
      { label: "Thành tựu", href: "/portal/achievements" },
      { label: "Tin tức", href: "/portal/updates" },
    ],
  },
  {
    group: "Cá nhân",
    items: [
      { label: "Không gian của tôi", href: "/portal/account" },
      { label: "Đã lưu", href: "/portal/saved" },
      { label: "Hỗ trợ", href: "/portal/support" },
    ],
  },
];

// Legacy/standalone routes still in production, kept reachable via hub pages
// and direct links even though they no longer appear as their own sidebar
// entries (see PortalSidebar / the route map in portal hub pages).
export const portalNav = portalNavGroups.flatMap((g) => g.items);
