export type SiteSettings = {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  slogan: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  seoTitle: string;
  seoDescription: string;
  footerText: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  zaloUrl: string;
  adminEmailNotify: string;
};

export const settingsSeed: SiteSettings = {
  siteName: "VO DUONG AI",
  logoUrl: "/icon.svg",
  faviconUrl: "/icon.svg",
  slogan: "Học AI • Xây hệ thống • Tạo tài sản số",
  primaryColor: "#2563EB",
  secondaryColor: "#5B8CFF",
  accentColor: "#FF7A00",
  seoTitle: "VO DUONG AI — Học AI, xây hệ thống, tạo tài sản số",
  seoDescription: "Hệ sinh thái giúp bạn học AI, ứng dụng AI vào công việc và xây dựng tài sản số.",
  footerText: "© VO DUONG AI. All rights reserved.",
  facebookUrl: "https://www.facebook.com/duong.vv",
  youtubeUrl: "https://www.youtube.com/@voduongofficial",
  tiktokUrl: "https://www.tiktok.com/@vdai_academy",
  zaloUrl: "https://zalo.me/0909150587",
  adminEmailNotify: "duongvv.vn@gmail.com",
};

export const trafficSeed = [
  { day: "T2", visits: 320, clicks: 48, leads: 6 },
  { day: "T3", visits: 410, clicks: 61, leads: 9 },
  { day: "T4", visits: 380, clicks: 52, leads: 7 },
  { day: "T5", visits: 460, clicks: 70, leads: 11 },
  { day: "T6", visits: 510, clicks: 84, leads: 13 },
  { day: "T7", visits: 290, clicks: 39, leads: 5 },
  { day: "CN", visits: 340, clicks: 46, leads: 6 },
];
