# VO DUONG AI — Landing Page Technical Remediation Report

**Sprint:** Technical Remediation Sprint (post Master Audit, domain work deferred)
**Source of truth:** `docs/website/VO_DUONG_AI_LANDING_PAGE_MASTER_AUDIT.md`,
`docs/website/VO_DUONG_AI_LANDING_PAGE_AUDIT_BACKLOG.md`, audit commit `54e8bfc`.
**Status:** Implementation complete. **Not committed** — awaiting PMO review per sprint closing instruction.

---

## 1. Executive Summary

9 verified audit findings were fixed in code: the horizontal-overflow root cause (P1-A), the
authenticated-route leak in the sitemap (P1-B), one independent overflow issue in the final CTA
(F-11), a WCAG contrast failure across three low-opacity text instances (F-06), a missing web
manifest (F-08), a missing skip-to-content link (F-17), a heading-hierarchy skip in the footer
(F-18), and missing `rel="noopener noreferrer"` / `target` on the footer's external social links
(F-19). All fixes are scoped to the exact component responsible, verified individually via
ESLint/TypeScript, and re-verified together via a full production build and Playwright checks
against the local dev server (8 responsive breakpoints, keyboard-navigation trace, console-error
capture, before/after screenshots). No design, copy, background color, or CTA-decision changes
were made. All custom-domain-dependent items (canonical, OG URL, `metadataBase`, sitemap base URL)
remain untouched per the PMO domain-deferral correction. Nothing was committed, pushed, or deployed.

## 2. Audit Issues Implemented

| ID | Issue | File(s) | Result |
|----|-------|---------|--------|
| P1-A | Horizontal overflow (negative-inset glow divs leaking past viewport) | `PortalPreview.tsx`, `FounderStory.tsx` | Fixed — `scrollWidth === clientWidth` at all 8 viewports |
| F-11 | FinalCTA paragraph `whitespace-nowrap` overflowing at narrow widths | `FinalCTA.tsx` | Fixed |
| P1-B | Sitemap listing auth-gated `/portal/*` routes | `sitemap.ts` | Fixed — 0 auth-gated URLs remain |
| F-06 | WCAG AA contrast failure (`text-white/15` on navy) | `TrustStats.tsx` (×2), `EcosystemPillars.tsx` (×1) | Fixed — measured 5.34:1 (was 1.45–1.53:1) |
| F-08 | Missing web app manifest | `app/manifest.ts` (new) | Fixed — served at `/manifest.webmanifest` |
| F-17 | No skip-to-content link | `layout.tsx`, `ChromeGate.tsx` | Fixed — keyboard-verified |
| F-18 | Footer heading hierarchy skip (H2 → H4) | `Footer.tsx` | Fixed — H2 → H3, no skips left |
| F-19 | Footer external links missing `target`/`rel` safety attributes | `Footer.tsx` | Fixed — `target="_blank" rel="noopener noreferrer"` on all 4 external social links |

## 3. Audit Issues Deferred

**Explicitly out of scope per PMO domain-deferral correction** (not sprint failures):
- P1-C and all canonical / Open Graph / Twitter Card / `metadataBase` / sitemap base URL / robots.txt
  base URL work — all tied to `siteConfig.url`, which still points at the unconnected custom domain.
- Any Vercel Production environment configuration.

**Explicitly out of scope per sprint §2/§5** (not sprint failures):
- Hybrid Light-Dark redesign, navy background change, light/dark toggle, section reordering, layout
  redesign, marketing copy rewrite.
- The "🎁 Nhận tài liệu AI" decorative element in `FinalCTA.tsx` — left completely untouched (no
  href, no link, no form), per the Founder's explicit F-02 correction that this is intentionally
  decorative, not a functional CTA.
- Unverified TrustStats numbers, CMS, DNS/domain activation, production Lighthouse (not measurable
  in this sandbox).

**Deferred by my own judgment, beyond what was explicitly named — flagged here for PMO visibility:**
- **F-09 (Organization/WebSite JSON-LD schema):** the existing `layout.tsx` JSON-LD is a `Person`
  schema only. Adding `Organization`/`WebSite` schema would mean embedding `siteConfig.url` (the
  still-dead custom domain) into more structured data consumed by search engines — this runs
  counter to the spirit of "no domain/URL-identity SEO work now," even though F-09 wasn't named
  explicitly in the domain-deferral exclusion list. Recommend revisiting in the future "Domain, SEO
  & Social Launch Readiness" sprint.
- **F-04, F-05, F-07, F-10, F-12–F-16, F-20, F-21:** deferred because each falls into one of: needs
  a Founder content/product decision, is architecturally invasive beyond a narrow fix, depends on
  deploy credentials/external services, or lacked sufficient code-level evidence to action safely
  within this sprint's "no scope creep" constraint. None were force-fit into scope.

## 4. Files Changed

```
 docs/website/VO_DUONG_AI_LANDING_PAGE_AUDIT_BACKLOG.md | 18 +++++-----
 docs/website/VO_DUONG_AI_LANDING_PAGE_MASTER_AUDIT.md  | 40 ++++++++++++----------
 src/app/layout.tsx                                     |  6 ++++
 src/app/sitemap.ts                                     | 29 +++-------------
 src/components/home/EcosystemPillars.tsx               |  2 +-
 src/components/home/FinalCTA.tsx                       |  2 +-
 src/components/home/FounderStory.tsx                   |  2 +-
 src/components/home/PortalPreview.tsx                  |  2 +-
 src/components/home/TrustStats.tsx                     |  4 +--
 src/components/site/ChromeGate.tsx                     |  2 +-
 src/components/site/Footer.tsx                         | 11 +++---
 11 files changed, 56 insertions(+), 62 deletions(-)
```
Plus one new file: `src/app/manifest.ts` (untracked, not yet staged).

The two `docs/website/*.md` diffs are **pre-existing uncommitted edits from the earlier F-02 PMO
correction phase** (F-02 P1→P2 downgrade) — not part of this sprint's work, included here only
because `git diff --stat` reports the full working tree.

## 5. Root Cause & Fix per Issue

- **P1-A — Horizontal overflow.** Root cause (re-verified, matches audit): `PortalPreview.tsx` and
  `FounderStory.tsx` render decorative blurred glow `<div>`s with negative-inset Tailwind utilities
  (`-inset-10`, `-inset-16`, `-inset-12`, `-inset-8`) with no ancestor `overflow-hidden`, so they
  paint past the viewport edge and expand `document.documentElement.scrollWidth`. Fix: added
  `overflow-hidden` to the outer `<section>` in both files — the exact pattern already proven safe
  in `Hero.tsx` (`className="relative overflow-hidden pt-16 pb-10 ..."`). Confirmed this does not
  clip anything that needs to escape the section (no focus rings, dropdowns, or sticky elements
  live inside these sections).
- **F-11 — FinalCTA paragraph overflow.** Root cause: the paragraph had an unconditional
  `whitespace-nowrap`, forcing its full-sentence width (measured ~478px) regardless of viewport,
  independent of the P1-A glow-div issue. Fix: removed `whitespace-nowrap`, leaving responsive text
  sizing (`text-[11px] sm:text-sm md:text-base`) to wrap naturally. The decorative button in the
  same file was not touched.
- **P1-B — Sitemap authenticated routes.** Root cause: `sitemap.ts` statically listed all `/portal/*`
  routes plus dynamically-generated tool/prompt/resource sub-paths, none of which are reachable by
  an anonymous crawler — `src/middleware.ts` + `PROTECTED_ROUTE_PREFIXES` redirect any unauthenticated
  request under `/portal` to `/login`. Fix: removed the `/portal/*` entries and the now-unused
  `tools`/`prompts`/`freeResources` imports, added a comment explaining why, left `siteConfig.url`
  and every other public route untouched.
- **F-06 — Low contrast text.** Root cause: three informational captions used `text-white/15` (measured
  1.45:1–1.53:1 against the `.mesh-navy` `#020817` background — far below WCAG AA's 4.5:1). Fix:
  raised opacity to `text-white/50` (safe margin above the 45% threshold where the ratio crosses
  4.5:1), verified 5.34:1 via a canvas-based luminance measurement script. No background or brand
  color was touched.
- **F-08 — Missing manifest.** Root cause: no `app/manifest.ts` file existed, so no
  `<link rel="manifest">` was emitted. Fix: added a minimal `MetadataRoute.Manifest` using only
  relative/local values (`start_url: "/"`, local icon, and the existing navy `background_color`/
  `theme_color`) — no dependency on the undeployed custom domain.
- **F-17 — No skip link.** Root cause: `layout.tsx`'s `<body>` had no skip-to-content affordance, and
  `ChromeGate.tsx`'s `<main>` had no `id` to target. Fix: added a `sr-only focus:not-sr-only` anchor
  as the very first element in `<body>`, targeting `#main-content`; added `id="main-content"` to
  `<main>` in `ChromeGate.tsx`. **Caught during verification:** the initial fix jumped the URL hash
  but left keyboard focus on `<body>` (confirmed via Playwright: `document.activeElement.tagName`
  was `BODY` after activating the link) because a plain `<main>` isn't programmatically focusable.
  Added `tabIndex={-1}` (plus `focus:outline-none` to suppress the default focus ring on the whole
  content region) so activating the skip link now correctly moves focus to `#main-content` —
  re-verified via Playwright.
- **F-18 — Footer heading skip.** Root cause: `Footer.tsx`'s three column headings used `<h4>` while
  no `<h3>` exists anywhere before them in document order (page sections use `<h2>`, card titles use
  `<h3>`), producing an H2→H4 skip. Fix: changed all three `<h4>` to `<h3>`, keeping className/styling
  identical. Verified the full page's heading sequence now has zero level skips.
- **F-19 — Missing link safety attributes.** Root cause: the four external social links (Facebook,
  YouTube, TikTok, Zalo) in `Footer.tsx` had no `target` or `rel`, unlike every other external link
  in the codebase (`portal/*` pages consistently use `target="_blank" rel="noopener noreferrer"`).
  Fix: added `target="_blank" rel="noopener noreferrer"` conditionally, excluding the `mailto:` link
  (opening mail links in a new tab is not the established pattern and not a security concern).

## 6. Acceptance Criteria Result

| Criterion | Result |
|---|---|
| `scrollWidth === clientWidth` at 320/375/390/430/768/1024/1280/1440px | ✅ Pass at all 8 |
| No auth-gated/redirect-only routes in sitemap | ✅ 0 remain (7 static + blog posts only) |
| Contrast ≥ 4.5:1 for the 3 flagged instances | ✅ 5.34:1 measured |
| Manifest served with correct fields | ✅ `/manifest.webmanifest` returns valid JSON |
| Skip link reachable, hidden by default, visible on focus, moves focus to main | ✅ All confirmed |
| No heading-level skips | ✅ Confirmed via full heading-sequence dump |
| Footer external links carry `target="_blank" rel="noopener noreferrer"` | ✅ 4/4 |
| Navy background / layout unchanged | ✅ Screenshot comparison shows no visual regression |
| No decorative-CTA/copy/background changes | ✅ Confirmed via diff — none touched |

## 7. Test Results

- `npx eslint .` — 0 errors, 5 pre-existing warnings (all `@next/next/no-img-element` in unrelated
  Portal files, not touched by this sprint).
- `npx tsc --noEmit` — clean, no errors.
- `npm run build` — succeeded (Turbopack, Next.js 16.2.9). Compiled successfully, 249 static pages
  generated, no build errors. Pre-existing warnings only (workspace-root lockfile notice,
  `middleware`→`proxy` deprecation notice) — unrelated to this sprint's changes.

## 8. Responsive Matrix

| Viewport | scrollWidth | clientWidth | Result |
|---|---|---|---|
| 320px | 320 | 320 | PASS |
| 375px | 375 | 375 | PASS |
| 390px | 390 | 390 | PASS |
| 430px | 430 | 430 | PASS |
| 768px | 768 | 768 | PASS |
| 1024px | 1024 | 1024 | PASS |
| 1280px | 1280 | 1280 | PASS |
| 1440px | 1440 | 1440 | PASS |

## 9. SEO / Sitemap Verification

- `curl http://localhost:3000/sitemap.xml` — returns only `/`, `/about`, `/blogai`, `/contact`,
  `/privacy`, `/terms`, `/refund-policy`, and blog post slugs. Zero `/portal/*` entries.
- `curl http://localhost:3000/robots.txt` — unchanged, still disallows `/admin`, `/portal/checkout`,
  `/api/`; consistent with the trimmed sitemap (no orphaned crawl directives referencing removed
  sitemap entries).
- `curl http://localhost:3000/manifest.webmanifest` — returns valid manifest JSON with correct name,
  `background_color`/`theme_color` matching the navy theme, and the existing `/icon.svg`.

## 10. Metadata / Site URL Configuration

**No changes made** — `siteConfig.url`, canonical URL, Open Graph URL, and `metadataBase` remain
exactly as they were, per the PMO domain-deferral correction. These all still resolve against the
not-yet-connected `voduongai.com` domain and must be addressed in the future "Domain, SEO & Social
Launch Readiness" sprint, not before.

## 11. Accessibility Changes

- Added a skip-to-content link (keyboard-reachable, visually hidden until focused, correctly moves
  focus to `<main id="main-content" tabIndex={-1}>`).
- Fixed a heading-hierarchy skip in the footer (H4 → H3).
- Fixed a WCAG AA contrast failure on 3 low-opacity caption texts (now 5.34:1, was 1.45–1.53:1).
- Added `target="_blank" rel="noopener noreferrer"` to 4 external footer links (security/UX
  consistency, not a WCAG criterion but bundled with the footer accessibility pass per audit item
  F-19).

## 12. Visual Regression Result

Before/after screenshots (desktop 1280px, mobile 375px) of `PortalPreview`, `FounderStory`, and the
`Footer` sections show no visual differences beyond the intended fixes — navy background, spacing,
typography, and layout are pixel-consistent with the pre-sprint state. No clipping regressions from
the new `overflow-hidden` containers (glow effects still render fully within their sections).

## 13. Remaining Blockers

None for the items implemented in this sprint. All P1-C / domain-dependent items remain blocked on
the Founder connecting `voduongai.com` — tracked as deferred, not a blocker of this sprint's
deliverable.

## 14. Environment Variables Needed

None. Every fix in this sprint uses only relative paths, local assets, or existing configuration
(`siteConfig`, `getSiteSettings()`). No new environment variable is required to deploy these changes.

## 15. Production Deployment Checklist

- [ ] PMO review of this report and the diff.
- [ ] Commit the 9 changed files + 1 new file (`manifest.ts`) with a scoped commit message.
- [ ] Push to the appropriate branch, open PR if required by team process.
- [ ] Re-run `npm run build` in CI to confirm parity.
- [ ] After merge/deploy, re-verify `/manifest.webmanifest`, `/sitemap.xml`, skip link, and contrast
      against the live URL (this sprint only verified against local dev + `curl` against production
      for static file checks, per the sandbox's external-HTTPS limitation for Playwright).
- Domain/canonical/OG/metadataBase items remain **excluded** from this checklist — tracked separately
  for the future domain-launch sprint.

## 16. Rollback Notes

Every change in this sprint is a small, independent, file-scoped diff (see §4/§5) with no shared
dependency between fixes. Any single fix can be reverted independently via `git checkout -- <file>`
without affecting the others. `src/app/manifest.ts` is a new, additive file — rollback is a plain
delete. No migrations, no schema changes, no deletions of other files.

## 17. Final Recommendation

All 8 implemented fixes are narrow, individually verified, and match their audit issue IDs with no
scope creep. TypeScript, ESLint, and the production build are clean; responsive QA passes at all 8
required viewports; accessibility fixes are keyboard-verified; visual regression check shows no
unintended changes. **Recommend approval to commit** as a single scoped commit (or one commit per
logical group, PMO's preference), with the explicit understanding that the two `docs/website/*.md`
diffs already existed before this sprint (F-02 correction) and are not new work product from this
phase.

---

## Post-Sprint Verification Summary (for PMO)

- **Issues fixed:** P1-A, F-11, P1-B, F-06, F-08, F-17, F-18, F-19 (8 items).
- **Issues deferred:** P1-C + all domain-dependent SEO/metadata items (explicitly excluded per PMO
  domain-deferral correction); Hybrid Light-Dark redesign, decorative CTA, copy rewrite, CMS, DNS
  (explicitly out of scope per sprint brief); F-09 and F-04/F-05/F-07/F-10/F-12–F-16/F-20/F-21
  (deferred by judgment, rationale in §3).
- **Files changed:** see §4 (9 modified + 1 new; 2 of the modified are pre-existing uncommitted doc
  edits from an earlier phase, not new this sprint).
- **TypeScript:** clean. **ESLint:** clean (0 errors; pre-existing unrelated warnings only).
  **Production build:** succeeded.
- **Responsive QA:** 8/8 viewports pass, zero horizontal overflow.
- **Sitemap/metadata verification:** sitemap contains 0 auth-gated routes; manifest serves
  correctly; robots.txt consistent; canonical/OG/metadataBase untouched (deferred).
- **Environment variables needed:** none.
- **Git status:** see `git status --short` / `git diff --stat` in §4 above — nothing committed,
  nothing pushed, no PR opened, no merge, no deploy.
- **Recommendation:** ready for PMO review and commit approval (§17).

**This sprint now stops and awaits PMO review, per the sprint's closing instruction.**
