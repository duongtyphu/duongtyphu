import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Every "/portal/*" route requires authentication (see PROTECTED_ROUTE_PREFIXES
// in src/lib/protected-routes.ts) — middleware redirects anonymous visitors,
// including crawlers, straight to /login. Listing them here would only get
// them indexed as redirects, wasting crawl budget. Keep this sitemap to
// routes that are actually publicly reachable.
//
// Blog AI ("/blogai" + individual posts) is intentionally excluded — the
// blog no longer lives as a public marketing surface; posts now live only
// inside the authenticated Portal, so they follow the same exclusion as
// every other "/portal/*" route above.
const routes = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
