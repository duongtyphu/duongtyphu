# PORTAL 4.0 — IMP-SPR-005
## Visual QA + Typography Verification

**STATUS: AUDIT COMPLETE. No P0 visual bugs found. Zero code changes required — the typography migration (IMP-2026-TYPO-001) introduced no visible regression on any surface this sprint could reach.**

This sprint verifies, visually and at the source level, that removing Google Fonts and switching to the System UI Font Stack did not break any interface. Per the brief: no features added, no architecture changed, no content cleanup — only typography-caused display bugs were in scope to fix.

---

## 1. Executive Summary

**Typography is verified correct on every page reachable in this environment**: the computed `font-family` on `document.body` was captured live via headless Chromium and confirmed to be exactly `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` on all 16 distinct URLs tested (static site, Next.js Portal routes, both login surfaces, admin), across all 3 required viewports (390/768/1440px) — 48 direct captures plus 27 supplementary SSR-only captures, 75 total. Zero Google Fonts network requests occurred anywhere. Zero `font-weight: 300`/`font-light` usages exist anywhere in the repository (re-confirmed this sprint, same result as IMP-2026-TYPO-001).

**No P0 visual bugs were found.** No text overflow, no broken buttons, no clipped badges, no misalignment on any page this sprint could directly render.

**One environment limitation, not a bug**: this sandbox has no configured Supabase credentials, so authenticated Portal platform pages (Home dashboard, CKOS, Academy, Premium, Community, Journey, Companion, AI Workspace) and the Next.js Admin Dashboard (`/admin/(dashboard)/**`) cannot be rendered past their client-side auth/data gate — this is pre-existing sandbox behavior, unrelated to typography, and was already documented in prior sprints of this Portal QA series. Where live rendering wasn't possible, this report substitutes a targeted source-level review (§2, §3) specifically for typography-migration regression risk (leftover hardcoded fonts, fixed-width text containers that a font-metric change could newly overflow) — the same fallback methodology used in Sprints 1-4 of this series.

**Recommendation**: proceed to Sprint 6. Carry the one P2 item (§5) — a supplementary manual visual pass with real credentials — as a lightweight verification step, not a blocker.

---

## 2. Typography Verification

### 2.1 Live-rendered verification (headless Chromium, computed styles)

| Surface | URL(s) tested | `body` computed `font-family` | Google Fonts requests | Result |
|---|---|---|---|---|
| Website chính (static) | `index.html`, `privacy.html` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | 0 | ✅ PASS |
| Authentication (static) | `login.html`, `register.html` | Same stack | 0 | ✅ PASS |
| Authentication (Next.js) | `/login`, `/admin/login` | Same stack | 0 | ✅ PASS |
| Admin (legacy static) | `admin.html` (redirects to `login.html` when unauthenticated, by its own existing design — see §3) | Same stack | 0 (after aborting one unrelated blocked-CDN request, see §4) | ✅ PASS |
| Portal (Next.js, error-boundary state) | `/portal`, `/portal/hocvienai`, `/portal/ckos`, `/portal/premium`, `/portal/congdongai`, `/portal/hanhtrinhcuatoi`, `/portal/companion`, `/portal/aiworkspace`, `/portal/duan-cohoi` | Same stack (confirmed on the rendered error-boundary fallback, since no Supabase session exists in this sandbox — see §3) | 0 | ✅ PASS |

Every single measurement returned byte-identical to the mandated stack — **zero drift, zero partial-migration pages found**.

### 2.2 Source-level verification (repo-wide, re-run this sprint)

- `fonts.googleapis.com` / `fonts.gstatic.com`: **0 matches**, repo-wide.
- `Plus_Jakarta_Sans` / `font-jakarta`: **0 matches** in `src/`.
- `font-weight: 300` / `font-light`: **0 matches**, repo-wide (static site + Portal + Admin + Companion source).
- Component-level hardcoded `font-family` overrides in `src/components/portal/**`, `src/app/portal/**`, `src/app/admin/**`, Companion-related components: **0 matches** (the only `font-family` declarations found anywhere are `inherit` or `var(--font-sans)`/`var(--font-display)`, exactly as intended).

### 2.3 Font weight / heading / paragraph checks

- Body text: `font-size: 16px; font-weight: 400; line-height: 1.55` (Portal) / `line-height: 1.7` (static site, unchanged, per IMP-2026-TYPO-001's "don't blindly change scale" instruction) — both confirmed still in effect, no regression.
- Headings observed on every reachable page (static home hero, login/register titles, admin login title, Portal error-boundary title) render at their designed weight (`font-extrabold`/`font-bold`) with no unexpected thinning or unexpected bolding.
- No heading was observed wrapping onto an unexpected number of lines at any of the 3 required viewports (390/768/1440).
- Button text (`Đăng nhập`, `Nhận miễn phí`, `Gửi liên kết đăng nhập`, etc.) renders fully inside its button shape at every viewport tested — no truncation, no button-width inflation.
- Input/label pairs (email/password fields on both login surfaces) remain vertically centered and evenly spaced — no shift from the font change.

---

## 3. Visual QA Findings

### 3.1 Directly verified (screenshots captured, reviewed at all 3 viewports)

- **Website chính** (`index.html`): hero, nav, CTA buttons, feature checklist — clean. No overflow, no misalignment, no badge clipping.
- **Static Auth** (`login.html`, `register.html`): card layout, Google-SSO button, form inputs, footer link — clean at 390/768/1440.
- **Next.js Auth** (`/login`): header, hero card, footer with 4 link columns — clean, footer columns re-flow correctly at 390px (stacks) vs. 1440px (4-column row).
- **Next.js Admin login** (`/admin/login`): dedicated dark "Admin Console" card — clean, correctly distinct in visual language from the customer-facing login (confirmed intentional, matches the two-admin-system finding in `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §2.3 — not a bug, a pre-existing architecture fact).
- **Legacy Admin** (`admin.html`): confirmed its own existing (pre-typography, unrelated to this sprint) client-side auth gate correctly redirects an unauthenticated visitor to `login.html` — that page, reached via this path, renders clean.
- **Static privacy page** (`privacy.html`, representative of the legal-page template used by `terms.html`/`refund-policy.html`/`thank-you.html`/`404.html`, all updated identically in IMP-2026-TYPO-001): clean, no layout defect.
- **Portal error-boundary state** (all 9 platform routes): every route renders the same graceful, correctly-styled Vietnamese error card (`Đã có lỗi xảy ra` / `Thử lại` / `Về trang chủ`) rather than a raw crash — confirming the app's error boundary itself is typography-correct, and that no platform-specific route throws a *different*, un-styled failure.

No text overflow, no layout shift, no misalignment, no broken buttons, and no clipped badges were found on any of the above.

### 3.2 Not directly renderable in this sandbox (source-reviewed instead)

Authenticated Portal platform content (Home dashboard, CKOS, Academy, Premium, Community, Journey, Companion, AI Workspace, Projects & Opportunities) and the Next.js Admin Dashboard (`/admin/(dashboard)/**`) require a real Supabase session. Two navigation strategies were tried this sprint to work around this:
1. **Full JS, no credentials**: every Portal route hits the same client-side `@supabase/ssr` initialization error, caught by Next's error boundary (§3.1) — confirmed to be an environment/credentials issue (`"Your project's URL and API key are required to create a Supabase client"`), not a rendering defect, and not new — this exact limitation was already documented in this Portal QA series' earlier sprints.
2. **JavaScript disabled (SSR-only)**: every Portal route rendered only a client-mounted `"Đang tải..."` loading shell with no further content — confirming these pages are effectively fully client-rendered inside the shell, so there is no meaningful SSR fallback to inspect either.

Given neither path exposes real dashboard content in this environment, this sprint substitutes the following, consistent with the fallback method used throughout this QA series:
- Confirmed (§2.2) that the global `body { font-family: var(--font-sans) }` rule is declared once, unconditionally, in the root stylesheet loaded by the app's root layout — it is not gated by auth state, Supabase availability, or any client-only branch, so it mechanically applies to every page in the app, authenticated or not.
- Swept every Portal/Admin/Companion component directory for leftover hardcoded `font-family` (§2.2) — none found.
- Checked for the single highest-risk category of font-swap regression — a fixed-pixel-width text container combined with `truncate` (i.e., a label that fit exactly before and could newly clip after a font-metric change) — across `src/components/portal/**`. Found exactly 2 files matching that pattern (`PortalSidebar.tsx`, `PortalUserMenu.tsx`); both inspected and confirmed **not at risk** — one truncates inside a flexible (`min-w-0`) container, not a fixed width; the other intentionally truncates arbitrary-length user data (name/email), which was already designed to truncate before this sprint, not a new regression.

---

## 4. Responsive Findings

Tested at the 3 required viewports (390px, 768px, 1440px) on every directly-renderable surface (§3.1).

| Check | Result |
|---|---|
| Heading line-wrap consistent across viewports | ✅ No unexpected wraps found |
| Button width/shape stable across viewports | ✅ No button-width inflation from text or font change |
| Badge/pill text clipping | ✅ None found (no badges present on the directly-renderable surfaces; source-level check in §3.2 covers the rest) |
| Sidebar/nav overflow | N/A this sprint — sidebar only renders in the authenticated Portal shell, not directly reachable (§3.2); source-checked, no risk found |
| Footer column re-flow (390 → 1440) | ✅ Correct — stacks on mobile, 4-column row on desktop, tested on `/login` |
| Form input/button vertical alignment | ✅ Stable across all 3 viewports on both login surfaces |
| Card height consistency | N/A this sprint — no card grids present on directly-renderable surfaces |

One incidental, unrelated finding surfaced by network-level testing (not a viewport issue, noted for completeness): the static site's `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/...">` tag is unreachable in this sandbox's network policy, causing `admin.html`'s live-Supabase features to be untestable end-to-end here — this is a sandbox network limitation, not a typography-caused or even a real-environment bug (in production, this CDN is reachable).

---

## 5. Bug List (P0 / P1 / P2)

**P0 — none found.**

**P1 — none found.**

**P2 — 1 item (process recommendation, not a code defect):**

1. **Sandbox coverage gap — recommend a supplementary manual visual pass before Sprint 6.** This sprint could not directly render authenticated Portal platform pages or the Admin Dashboard (§3.2) due to missing Supabase credentials in this environment — a limitation of the sandbox, not of the typography change. Source-level review found no regression risk, but source review is a proxy, not a substitute for seeing the real rendered page. **Recommend**: before Sprint 6 begins, someone with a real Supabase-configured environment (or staging) do a 15-minute pass specifically on: CKOS/Premium card grids and badges, Admin Dashboard KPI cards and tables, and Companion's chat bubble/composer/prompt-suggestion chips — the checklist items this sprint's environment couldn't reach. This is a verification step, not a known bug.

---

## 6. Files Affected

**None.** No code was changed this sprint — zero P0/P1 bugs were found that required a fix. This document (`docs/PORTAL_VISUAL_QA_AND_TYPOGRAPHY_VERIFICATION.md`) is the only new file.

---

## 7. Sprint 6 Recommendations

1. **Proceed to Sprint 6 — typography is verified clean.** No blocking issue exists.
2. **Run the P2 supplementary manual pass** (§5) early in Sprint 6 or just before it, ideally as a 15-minute spot-check with real credentials rather than a formal sprint — specifically targeting CKOS/Premium cards, Admin KPI/table/badge components, and Companion's chat surfaces, which this sprint's sandbox couldn't reach.
3. **Carry forward, not new to this sprint**: `PORTAL_ARCHITECTURE_STANDARDIZATION.md`'s pending ADRs (canonical purchasable entity, `vdai-academy` vs. `hocvienai`, canonical Admin system) remain open and are unaffected by this sprint's findings — this Visual QA pass did not surface anything that changes those recommendations.
4. **No typography-specific follow-up work is needed.** The migration (IMP-2026-TYPO-001) is confirmed complete and stable; Sprint 6 does not need to reserve time for typography fixes.

---

## Appendix — Method

Verification used a headless Chromium instance (Playwright, the pre-installed sandbox browser) driving both a local static-file server (root site) and the Next.js dev server (`npm run dev`, Portal), at 390px/768px/1440px viewports. 48 full captures (16 URLs × 3 viewports) recorded computed `font-family`, console errors, and a screenshot; a further 27 SSR-only captures (JavaScript disabled) were taken across all 9 Portal platform routes to rule out a hidden SSR-level regression once client-side rendering was confirmed blocked by the sandbox's missing Supabase credentials. Two dev-server states were tried for the Portal (unconfigured/"public demo" and placeholder-credentialed) to characterize exactly where and why authenticated content couldn't be reached — both confirmed to be pre-existing, credential-related, and unrelated to typography. `npm run lint`, `npm run build`, and `npm run test` were re-run after all findings were gathered: lint clean (0 errors, 5 pre-existing unrelated `<img>` warnings), build succeeds (all routes compile), 139/139 tests pass. No files were modified.
