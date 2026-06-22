import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/portal",
  "/portal/ai-academy",
  "/portal/vdai-academy",
  "/portal/affiliate-hub",
  "/portal/tools",
  "/portal/prompts",
  "/portal/resources",
  "/portal/premium",
  "/portal/my-products",
  "/portal/community",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
