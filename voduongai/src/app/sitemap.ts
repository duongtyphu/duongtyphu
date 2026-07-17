import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/data/blog";

// Every "/portal/*" route requires authentication (see PROTECTED_ROUTE_PREFIXES
// in src/lib/protected-routes.ts) — middleware redirects anonymous visitors,
// including crawlers, straight to /login. Listing them here would only get
// them indexed as redirects, wasting crawl budget. Keep this sitemap to
// routes that are actually publicly reachable.
const routes = [
  "/",
  "/about",
  "/blogai",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
  ...blogPosts.map((p) => `/blogai/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
