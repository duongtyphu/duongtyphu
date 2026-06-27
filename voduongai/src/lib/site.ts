import { portalHubs } from "@/lib/portal/hubs";

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

// The Portal sidebar now shows only the 6 GemOS hubs (see
// src/lib/portal/hubs.ts) — every legacy feature page still exists and is
// reachable from inside its hub's module grid, it just no longer has its
// own top-level sidebar entry.
export const portalNavGroups = [
  {
    group: null as string | null,
    items: portalHubs.map((h) => ({ label: h.label, href: h.href })),
  },
];

// Search index: hub entries plus every module inside each hub that has a
// real destination (modules without an href are "coming soon" and aren't
// indexed).
export const portalNav = [
  ...portalHubs.map((h) => ({ label: h.label, href: h.href })),
  ...portalHubs.flatMap((h) =>
    h.modules.filter((m) => m.href).map((m) => ({ label: m.label, href: m.href as string }))
  ),
];
