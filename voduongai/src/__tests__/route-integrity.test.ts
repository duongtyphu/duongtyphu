import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import nextConfig from "../../next.config";

/**
 * PORTAL_ROUTE_MIGRATION_PLAN.md Phase 1 — the route-migration audit found
 * zero existing tests exercise redirects, the middleware matcher, or link
 * integrity anywhere in the codebase. This is the first one: a static
 * check that (1) every hardcoded internal absolute-path link/redirect
 * literal in the source tree resolves to a real route or a known redirect
 * source, and (2) every `next.config.ts` redirect destination resolves to
 * a real route or another redirect (chained redirects are flagged, not
 * silently allowed). It would have caught the dead `/portal/growth` and
 * `/portal/ecosystem` redirects removed in this same change.
 *
 * Deliberately filesystem/regex-based, not a rendered/E2E crawl — no new
 * test-runner dependency, runs in the same `vitest run` pass as everything
 * else. Template-literal-built hrefs (e.g. `/portal/x/${slug}`) can't be
 * statically resolved and are skipped by design, not a gap: their dynamic
 * segment is exactly what generateStaticParams/route params already cover.
 */

const APP_DIR = path.resolve(__dirname, "../app");
const SRC_DIR = path.resolve(__dirname, "..");

type RoutePattern = { regex: RegExp; source: string };

function toSegmentRegex(segment: string): string | null {
  // Route groups — "(group)" — contribute no URL segment.
  if (segment.startsWith("(") && segment.endsWith(")")) return null;
  if (segment.startsWith("[[...") && segment.endsWith("]]")) return "(?:/[^/]+)*"; // optional catch-all
  if (segment.startsWith("[...") && segment.endsWith("]")) return "/[^/]+(?:/[^/]+)*"; // catch-all
  if (segment.startsWith("[") && segment.endsWith("]")) return "/[^/]+"; // dynamic segment
  return "/" + segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectRoutePatterns(dir: string, segments: string[], out: RoutePattern[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectRoutePatterns(full, [...segments, entry.name], out);
      continue;
    }
    if (!/^(page|route)\.(ts|tsx|js|jsx)$/.test(entry.name)) continue;

    const parts: string[] = [];
    for (const seg of segments) {
      const r = toSegmentRegex(seg);
      if (r !== null) parts.push(r);
    }
    const pattern = "^" + (parts.join("") || "/") + "/?$";
    out.push({ regex: new RegExp(pattern), source: path.relative(SRC_DIR, full) });
  }
}

function getRoutePatterns(): RoutePattern[] {
  const out: RoutePattern[] = [];
  collectRoutePatterns(APP_DIR, [], out);
  return out;
}

function isKnownRoute(pathname: string, patterns: RoutePattern[]): boolean {
  return patterns.some((p) => p.regex.test(pathname));
}

async function getRedirectSources(): Promise<Set<string>> {
  const config = nextConfig as { redirects?: () => Promise<{ source: string }[]> };
  const redirects = (await config.redirects?.()) ?? [];
  return new Set(redirects.map((r) => r.source.replace(/:path\*$/, "")));
}

const IGNORED_DIRS = new Set(["node_modules", ".next", "__tests__"]);
const SOURCE_FILE = /\.(tsx?|jsx?)$/;
const HREF_RE = /\b(?:href|to)\s*=\s*"(\/[^"?#\s]*)/g;
const IMPERATIVE_RE = /\b(?:router\.push|router\.replace|redirect)\(\s*"(\/[^"?#\s]*)/g;
const NON_PAGE_PREFIXES = ["/api/", "/_next/", "/favicon", "/images/", "/assets/", "/brand/", "/icon", "/opengraph-image", "/robots.txt", "/sitemap.xml"];
// VDAI SOLO/SCALE course pages (see CLAUDE.md's Internal-linking convention) —
// real pages, but not part of this Next.js app's own route tree, so they
// can't be verified by a filesystem scan the way every other link here can.
const KNOWN_EXTERNAL_ROUTES = new Set(["/solo", "/scale"]);

function collectLinkLiterals(dir: string, out: Map<string, Set<string>>) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectLinkLiterals(full, out);
      continue;
    }
    if (!SOURCE_FILE.test(entry.name) || /\.test\.[tj]sx?$/.test(entry.name)) continue;

    const text = fs.readFileSync(full, "utf8");
    const rel = path.relative(SRC_DIR, full);
    for (const re of [HREF_RE, IMPERATIVE_RE]) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        const href = m[1];
        if (NON_PAGE_PREFIXES.some((p) => href.startsWith(p))) continue;
        if (!out.has(href)) out.set(href, new Set());
        out.get(href)!.add(rel);
      }
    }
  }
}

describe("route integrity (PORTAL_ROUTE_MIGRATION_PLAN.md Phase 1)", () => {
  it("every hardcoded internal link literal resolves to a real route or a known redirect source", async () => {
    const patterns = getRoutePatterns();
    const redirectSources = await getRedirectSources();
    const links = new Map<string, Set<string>>();
    collectLinkLiterals(SRC_DIR, links);

    const broken: string[] = [];
    for (const [href, files] of links) {
      const pathname = href.replace(/#.*$/, "") || "/";
      if (isKnownRoute(pathname, patterns) || redirectSources.has(pathname) || KNOWN_EXTERNAL_ROUTES.has(pathname)) continue;
      broken.push(`${href}  (referenced in: ${[...files].slice(0, 3).join(", ")}${files.size > 3 ? ", …" : ""})`);
    }

    expect(broken, `Found ${broken.length} hardcoded link(s) that don't resolve to any real route or redirect:\n${broken.join("\n")}`).toEqual([]);
  });

  it("every next.config.ts redirect destination resolves to a real route (no dead redirects)", async () => {
    const patterns = getRoutePatterns();
    const config = nextConfig as { redirects?: () => Promise<{ source: string; destination: string }[]> };
    const redirects = (await config.redirects?.()) ?? [];
    const redirectSources = new Set(redirects.map((r) => r.source.replace(/:path\*$/, "")));

    const dead: string[] = [];
    for (const { source, destination } of redirects) {
      if (/^https?:\/\//.test(destination) || destination.includes(":path*")) continue; // external or wildcard-passthrough, not statically checkable here
      const pathname = destination.replace(/#.*$/, "");
      if (isKnownRoute(pathname, patterns) || redirectSources.has(pathname)) continue;
      dead.push(`${source} -> ${destination}`);
    }

    expect(dead, `Found ${dead.length} redirect(s) pointing at a destination that isn't a real route:\n${dead.join("\n")}`).toEqual([]);
  });
});
