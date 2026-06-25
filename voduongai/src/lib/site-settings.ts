import { getSupabaseAdmin } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";

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

const defaultSettings: SiteSettings = {
  siteName: siteConfig.name,
  logoUrl: "/icon.svg",
  faviconUrl: "/icon.svg",
  slogan: siteConfig.tagline,
  primaryColor: "#2563EB",
  secondaryColor: "#5B8CFF",
  accentColor: "#FF7A00",
  seoTitle: `${siteConfig.name} — ${siteConfig.tagline}`,
  seoDescription: siteConfig.description,
  footerText: `© VO DUONG AI. All rights reserved.`,
  facebookUrl: siteConfig.links.facebook,
  youtubeUrl: siteConfig.links.youtube,
  tiktokUrl: siteConfig.links.tiktok,
  zaloUrl: siteConfig.links.zalo,
  adminEmailNotify: siteConfig.contact.email,
};

// Cài đặt được quản trị viên chỉnh trong /admin/settings, lưu trong bảng
// Supabase "settings" (id = "settings"). Trang web đọc lại ở đây để các
// thay đổi (tên site, slogan, màu, SEO, social, footer) thật sự hiển thị
// ra ngoài site công khai, không chỉ lưu trong DB rồi không ai dùng tới.
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return defaultSettings;

  const { data } = await supabase.from("settings").select("data").eq("id", "settings").maybeSingle();
  if (!data?.data) return defaultSettings;

  return { ...defaultSettings, ...(data.data as Partial<SiteSettings>) };
}
