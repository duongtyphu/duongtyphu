import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { tools } from "@/data/tools";
import { prompts } from "@/data/prompts";
import { freeResources } from "@/data/resources";
import { blogPosts } from "@/data/blog";

const routes = [
  "/",
  "/about",
  "/blogai",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/portal",
  "/portal/companion",
  "/portal/su-menh-companion",
  "/portal/hetrithucai",
  "/portal/hocvienai",
  "/portal/aiworkspace",
  "/portal/duan-cohoi",
  "/portal/ai-academy",
  "/portal/vdai-academy",
  "/portal/affiliate-hub",
  "/portal/tools",
  "/portal/prompts",
  "/portal/resources",
  "/portal/premium",
  "/portal/my-products",
  "/portal/congdongai",
  "/portal/nhatkyhoctap",
  "/portal/hanhtrinhcuatoi",
  "/portal/khuvuoncuaban",
  ...tools.map((t) => `/portal/tools/${t.id}`),
  ...prompts.map((p) => `/portal/prompts/${p.id}`),
  ...freeResources.map((r) => `/portal/resources/${r.id}`),
  ...blogPosts.map((p) => `/blogai/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
