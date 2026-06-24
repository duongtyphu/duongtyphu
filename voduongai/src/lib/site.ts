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
    group: null,
    items: [{ label: "Tổng quan", href: "/portal" }],
  },
  {
    group: null,
    items: [{ label: "Lộ trình thành công", href: "/portal/roadmap" }],
  },
  {
    group: "Học tập",
    items: [
      { label: "Học viện AI", href: "/portal/ai-academy" },
      { label: "Học viện Affiliate", href: "/portal/vdai-academy" },
      { label: "Thương hiệu cá nhân", href: "/portal/personal-brand" },
      { label: "Nộp bài thực hành", href: "/portal/practice" },
    ],
  },
  {
    group: "Thư viện",
    items: [
      { label: "Prompt AI", href: "/portal/prompts" },
      { label: "Công cụ AI", href: "/portal/tools" },
      { label: "Template", href: "/portal/templates" },
      { label: "Ebook", href: "/portal/resources" },
      { label: "Checklist", href: "/portal/checklists" },
      { label: "SOP", href: "/portal/sop" },
    ],
  },
  {
    group: "Kiếm tiền",
    items: [
      { label: "Affiliate Hub", href: "/portal/affiliate-hub" },
      { label: "Hoa hồng giới thiệu", href: "/portal/referral" },
      { label: "Sản phẩm số", href: "/portal/premium" },
      { label: "Sản phẩm của tôi", href: "/portal/my-products" },
      { label: "Dịch vụ", href: "/portal/services" },
    ],
  },
  {
    group: "Tài sản số",
    items: [{ label: "Trung tâm Tài sản số", href: "/portal/assets" }],
  },
  {
    group: null,
    items: [{ label: "Cộng đồng", href: "/portal/community" }],
  },
  {
    group: "Khám phá",
    items: [
      { label: "Case Study", href: "/portal/case-studies" },
      { label: "Chuyên gia", href: "/portal/experts" },
      { label: "Tin tức nội bộ", href: "/portal/news" },
    ],
  },
  {
    group: null,
    items: [
      { label: "Hỗ trợ", href: "/portal/support" },
      { label: "Tài khoản", href: "/portal/account" },
      { label: "Blog AI", href: "/blog" },
    ],
  },
];

export const portalNav = portalNavGroups.flatMap((g) => g.items);
