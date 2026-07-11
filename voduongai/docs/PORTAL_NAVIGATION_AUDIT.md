# PORTAL 4.0 — PORTAL MASTER QA — SPRINT 1
## Navigation & Information Architecture Audit

**STATUS: AUDIT COMPLETE. Narrow, mechanical navigation fixes applied per the brief's "Only fix navigation inconsistencies" instruction — no redesign, no new features.**

All 9 platforms (Home, Companion, CKOS, Academy, AI Workspace, Projects & Opportunities, Premium, Journey, Community) and their child pages were audited against the 10 checks in the brief. Findings below are grounded in the actual code — sidebar source (`src/lib/portal/hubs.ts`), every `page.tsx` under `src/app/portal/**`, `PortalBackLink`/`PortalShell`/`PortalSidebar`, and a full cross-pillar link trace.

---

## 1. Navigation Structure Quality Score: **6 / 10**

**What's solid (the foundation is real, not superficial):**
- Sidebar active-state logic (`pathname === href || pathname.startsWith(href + "/")`) is technically correct at arbitrary depth — a page 3 levels deep under Projects & Opportunities correctly lights up the right sidebar item. No false positives between sibling pillars.
- Icon system: all 10 sidebar items use distinct `lucide-react` icons, zero raw SVG, zero duplication.
- Mobile sidebar renders the exact same nav data as desktop — no drift between the two.
- Journey's 5 doors (Mirror, My Story, Learning Journal, Journey Map, Garden) have **100% consistent** `PortalBackLink` coverage, all pointing to the same parent with the same label — this is the model the rest of the Portal should match.
- All 24 `next.config.ts` redirects resolve to real, live destinations (confirmed clean, no dead redirects — the two found and fixed in an earlier sprint stayed fixed).
- CKOS and Journey Hub each have exactly one clear primary CTA — no competition.
- Home is correctly non-competing **by design** (it's a directory/reception page, not a funnel — 10 uniformly-weighted text links is the right pattern there, not a bug).

**What's holding the score down (real, user-facing gaps — detailed in §2–7):**
- Breadcrumbs exist on only 2 of 9 platforms, and one of those two had a factual mislabeling bug (now fixed).
- Back-button coverage is inconsistent everywhere except Journey — a mix of `PortalBackLink`, hand-rolled links, and nothing at all, sometimes on sibling pages of the same platform.
- 5 pages have no discoverable entry point anywhere in the app.
- 3 of the 8 audited hub pages (AI Workspace, Premium, Community) have a CTA-flow problem — either too many competing "primary" actions or, on Community, a primary CTA that's literally disabled.
- Several of the "learning journey" cross-links the brief specifically asked about (Check 5) don't exist.

---

## 2. Breadcrumb Audit

**Coverage: 2 of 9 platforms** (AI Workspace, Projects & Opportunities) have a breadcrumb anywhere in their child pages. Academy and Premium have no child/detail routes at all (not applicable). The other 6 platforms (Home, Companion, CKOS, Journey, Community — and Home isn't a child page) have **zero** breadcrumbs anywhere.

**Structural correctness where breadcrumbs do exist**: hierarchy matches the URL depth correctly — e.g. `/portal/duan-cohoi/digiu/alphamind` renders **Portal → Dự án & Cơ hội → Hệ sinh thái DigiU → Khoá học Alphamind**, a full 4-level match, no skipped levels. The final (current-page) item is consistently non-clickable everywhere.

**Bug found and fixed**: the AI Workspace breadcrumb's root item read **"Học viện"** (linked to `/portal`) in 6 places across 3 files (`aiworkspace/[slug]/page.tsx` ×4, `aiworkspace/bai-viet/[slug]/page.tsx`, `components/portal/ai-space/WorkspaceMvp.tsx`) — but "Học viện" is the literal, specific display name of the **Academy** pillar (`/portal/hocvienai`), a different destination than where the link actually pointed (`/portal` = Home). A user clicking that crumb on a Workspace tool page would reasonably expect to land in Academy and would land on Home instead. The Projects & Opportunities breadcrumb correctly used **"Portal"** as its root label for the same `/portal` link. **Fixed**: all 6 occurrences now read "Portal", matching the correct, already-established convention.

**Not fixed (structural, out of "fix inconsistencies" scope)**:
- Three separate files each independently redeclare an identical `function Breadcrumb({items})` helper — real duplication, but consolidating them into one shared component is a new-component decision that requires Product Owner approval per `PORTAL_COMPONENT_LIBRARY.md` §12 (this exact gap — "no shared Portal breadcrumb component" — was already named there).
- `GoalDetail.tsx`'s breadcrumb has no root crumb at all (starts one level in) — a third, even thinner convention. Not touched, since adding a level is closer to a small feature addition than a bug fix.
- 6 of 9 platforms having zero breadcrumb is a coverage gap, not a defect in what exists — building 6 new breadcrumbs is out of this sprint's "fix, don't build" scope.

---

## 3. Back Button Audit

`PortalBackLink` (`ui/PortalBackLink.tsx`) is the canonical, standardized component. Coverage is uneven:

| Platform | Back button coverage |
|---|---|
| **Journey** (5 doors) | **Full, consistent** — all 5 use `PortalBackLink` → `/portal/hanhtrinhcuatoi`, same label |
| **CKOS** | Partial — `tools/[id]`, `resources/[id]`, `prompts/[id]`, `hetrithucai/[slug]` use `PortalBackLink`; `digital-assets/[slug]`/`digital-assets/category/[categorySlug]` hand-roll a `← ĐẦU TƯ CÙNG TÔI` link instead (see §7 — this subtree is a confirmed orphan/deprecated-in-place feature, not fixed here); `hetrithucai/collection/[slug]` has none |
| **AI Workspace** | Partial — `aiworkspace/bai-viet/[slug]` uses `PortalBackLink`; the 3 `aiworkspace/[slug]` detail variants use hand-rolled bottom-of-page "Quay lại hub"/"Về hub" links with a right-pointing arrow (inconsistent icon direction for a "back" action) — not converted here since it's positioned/styled as a bottom CTA, not a top-of-page back link; converting its role would edge toward redesign |
| **Projects & Opportunities** | Weak — `duan-cohoi/bai-viet/[slug]` uses `PortalBackLink`, but `duan-cohoi/[ecosystemSlug]` and `duan-cohoi/[ecosystemSlug]/[subProjectSlug]` have **no back button at all**, relying only on their breadcrumb |
| **Companion** | **None** — `su-menh-companion` and `su-menh-companion/companion-qua-hinh-anh` (both real children of `/portal/companion`) have zero back navigation of any kind |
| **Community** | None — no child/detail routes exist under `congdongai/**` today |
| **Premium, Academy** | N/A — no child/detail routes |

**Also found**: `aiworkspace/bai-viet/[slug]/page.tsx` renders **both** a breadcrumb and a `PortalBackLink` on the same page — redundant duplicate "go back" affordances. Flagged, not resolved (removing either is a judgment call on which to keep, not a clear-cut fix).

**Fixed (mobile tap-target size, applies portal-wide since `PortalBackLink` is the shared component)**: the link previously had no padding at all — its hit area was just the intrinsic size of 12px text plus a 14px icon, well under any mobile touch-target guideline. Added `py-2` with a compensating `-mt-2`/`mb-4` so the tap area roughly doubles in height with **zero visual position change** (icon/label render in exactly the same place). This is a CSS-only, page-invisible fix applied once at the shared component, so it benefits every page using `PortalBackLink` without touching any page individually.

---

## 4. Internal Link Audit

Traced the 7 specific cross-pillar pairs the brief named:

| Link | Status |
|---|---|
| CKOS → Academy | **Found** — `ckos/page.tsx`, "Tiếp tục học" + "Đi tới →" (KnowledgeJourneyStrip) |
| Academy → AI Workspace | **Found** — `hocvienai/page.tsx`, hero's dominant CTA "Vào AI Workspace" plus 3 more |
| AI Workspace → Journey | **Not found** anywhere in the AI Workspace pillar |
| Projects & Opportunities → Premium | **Not found** — the hub page ends on Companion quote cards with no link to Premium at all |
| Community → Journey | **Not found** |
| Premium → Checkout | **Found** — every `PremiumProgramCard` with an open course links to `/portal/checkout?...`, conditional on real Supabase availability data (correctly honest — shows "Sắp mở đăng ký" instead when not open) |
| Journey → Community | **Not found** |

**4 of the 7 requested "learning journey" connections don't exist.** These are real content/IA decisions (which pillar should link where) rather than broken-link bugs — not added here, since inventing new cross-links is closer to "new navigation feature" than "fixing an inconsistency." Recommended for a scoped follow-up (§8).

**Dead link found, not fixed**: `aiworkspace/page.tsx`'s footer CTA — its most visually prominent button, "Xem khoá học VDAI SOLO" — links to `/solo`, which does not exist as a route anywhere in this Next.js app (confirmed: no `/solo` directory under `src/app`, no `next.config.ts` redirect for it). `CLAUDE.md`'s own content convention treats VDAI SOLO as a real destination, suggesting it may intentionally live outside this repo (a separate marketing/sales deployment) rather than being a genuine bug — an earlier sprint's link-integrity test already allowlisted `/solo` and `/scale` on this assumption. **Not changed here**: this needs a factual Product Owner confirmation (is `/solo` a real external URL, or is this actually broken?) before anyone touches it — guessing a replacement destination would be fabricating a link, exactly what this project's standards forbid.

**Redundant double-hop redirects found and fixed**: 19 internal call sites across 11 files (`lib/portal/onboarding.ts`, `data/portal/ai-workspace.ts`, `data/admin/roadmap.ts`, `data/admin/startHere.ts` ×4, `data/admin/todayActions.ts` ×2, `data/admin/userGoals.ts` ×2, `app/sitemap.ts`, `components/portal/TodayGoals.tsx` ×2, `app/portal/start-here/page.tsx` ×2, `components/portal/RoadmapInteractive.tsx` ×2, `components/home/AcademyTeaser.tsx`) pointed at `/portal/ai-academy` or `/portal/personal-brand` — two routes that exist solely to `redirect("/portal/hocvienai")` at render time (a real "Academy Reset" product decision, per their own code comments). Every one of those 19 links now points directly at `/portal/hocvienai`, removing an unnecessary extra page load/redirect hop on every one of those journeys. The `sitemap.ts` entry for `/portal/ai-academy` was removed outright (not replaced) since `/portal/hocvienai` was already listed separately — avoids a duplicate sitemap entry. The two redirect-stub pages themselves were left in place (not deleted) as a safety net for any external/bookmarked links, matching this project's existing pattern for other legacy aliases.

---

## 5. CTA Flow Audit

Checked every hub page for competing/absent primary actions:

| Page | Verdict |
|---|---|
| **Journey Hub** | Best practice — exactly 1 primary CTA, explicitly engineered in-code to avoid a second one competing at the page end |
| **CKOS** | Clean — 1 clear primary CTA ("Vào Thư viện AI") |
| **Home** | Correct by design — 10 uniformly low-weight links, appropriate for a directory page, not a funnel |
| **Academy** | Minor inconsistency — no button uses `variant="primary"` at all (unlike CKOS/Journey); the hero's "Vào AI Workspace" functions as the de facto lead CTA by visual weight alone, not a real defect but worth normalizing later |
| **AI Workspace** | **Flag** — 3 strongly-styled CTAs at 3 different scroll depths pull in 3 different directions (start with Companion inline → mid-page hard submit box → external paid-course upsell at the very bottom); the bottom-most and most dominant of the three is also the dead `/solo` link above |
| **Projects & Opportunities** | **Flag** — opposite problem: zero CTA at all by the end of the page (closes on static quote cards) |
| **Premium** | **Flag** — 5 program cards each carry an identically-weighted solid gradient "buy" button with no visual hierarchy marking a recommended one, plus a consult CTA and a conditional advisor CTA, all below an otherwise well-structured hero |
| **Community** | **Flag, most serious** — the only two button-shaped elements on the page (top and bottom, both reading "Tham gia cộng đồng") are `aria-disabled`, non-functional placeholders. The page currently has no working primary action of its own — only secondary-weight pills pointing elsewhere |

None of these were changed — resolving a competing-CTA or missing-CTA problem is a content/priority decision (which action should win), not a mechanical navigation fix, and is flagged for Product Owner input in §8.

---

## 6. Mobile Navigation Audit

- **Menu**: mobile drawer renders identical nav items/order to desktop — confirmed no drift. Closes correctly on `Escape` and on route change (both verified in code).
- **Focus trap**: **not present** — Tab can escape the open drawer into the page content behind the backdrop. Not fixed here (implementing a real focus trap is new interactive behavior, not a class/href tweak — flagged for §8).
- **Touch targets, found and fixed**:
  - Drawer close button was `h-8 w-8` (32×32px), under the 44×44px WCAG 2.5.5 guideline — **increased to `h-11 w-11` (44×44px)**, a simple size bump with headroom in the drawer header, no layout risk.
  - `PortalBackLink`'s tap area (§3) — fixed portal-wide via the shared component.
- **Breadcrumbs on mobile**: inherit the same desktop coverage gaps (§2) — no separate mobile-specific breadcrumb issue found.
- **Spacing**: sidebar `NavLink` row height/padding (`px-3 py-2.5`) is identical between desktop and mobile variants — not a regression, but also not mobile-optimized (no extra tap padding on touch viewports specifically). Not changed — a broader touch-target pass across the whole nav item list is bigger than this sprint's scope; the two touch-target fixes above were chosen because they were unambiguous, isolated, and zero-risk.

---

## 7. Orphan Page Report

Classified per the brief's KEEP / MERGE / REDIRECT / ARCHIVE / DELETE framework. **No page was deleted or reclassified in code — this is a report; reclassification action needs Product Owner sign-off.**

| Page | Finding | Recommended classification |
|---|---|---|
| `/portal/achievements` | Real content page, zero internal links pointing to it anywhere | **REDIRECT candidate** — likely should be linked from Community or Home, or merged into an existing "your progress" surface |
| `/portal/earn` | Real hub page linking out to 4 real sub-pages, but nothing links into it | **REDIRECT candidate** — same shape as `achievements`; a real feature hidden behind no entry point |
| `/portal/support` | Real, functional support-ticket form, zero entry point anywhere (no header icon, no menu) | **KEEP + add entry point** — this is a working feature users currently cannot discover |
| `/portal/origin` | `robots: { index: false }`, a Companion lore/easter-egg page, referenced only in a doc comment | **KEEP as-is** — the noindex flag strongly suggests intentional hiddenness, not an accidental orphan |
| `/portal/digital-assets` (+ `[slug]`, `category/[categorySlug]`) | Explicitly deprecated-in-place per a real, already-recorded Product Owner instruction found in code (`duan-cohoi/[ecosystemSlug]/page.tsx`'s own comment: *"NOTHING here links to /portal/digital-assets/** at all... article detail pages were moved out of that namespace"*) | **ARCHIVE** — the decision to retire this route was already made; the route itself was just never physically archived/redirected the way `student-success`/`updates` were |
| `/portal/ai-academy`, `/portal/personal-brand` | Redirect stubs, now correctly the target of zero internal links after this sprint's fix (§4) | **KEEP as redirect stubs** — matches this project's existing convention for legacy aliases |
| `/portal/hanh-trinh-cua-toi` | Already archived + redirected (confirmed still healthy) | KEEP as-is, no action |
| `/portal/student-success`, `/portal/updates` | Already archived + redirected (confirmed still healthy) | KEEP as-is, no action |

**Duplicate-destination pages** (pre-existing findings, re-confirmed, not newly discovered this sprint): `/portal/companion` vs. `/portal/ai-assistant` (both present as "talk to Companion," documented in `COMPANION_EXPERIENCE_ARCHITECTURE.md` §8 as needing a Product Owner merge decision — unchanged).

---

## 8. Recommended Improvements

Ranked by leverage, none implemented (all require either Product Owner content/priority decisions or exceed "fix, don't build" scope):

1. **Confirm `/solo`**: is it a real external URL or a genuinely broken link? This is the single highest-visibility item found (most prominent CTA on the AI Workspace page) and the fastest to resolve once someone with the actual answer weighs in.
2. **Give `/portal/support` a real entry point** — it's a working feature with zero discoverability today. Lowest-risk of the "add an entry point" recommendations since it doesn't require picking where in an existing IA it belongs (a Help/Support affordance is a common, low-ambiguity addition to a header/account menu).
3. **Formally retire `/portal/digital-assets`** the same way `student-success`/`updates` already were (a `next.config.ts` redirect + `@archived` tag) — the decision is already made per its own code comment, only the mechanical archive step is missing.
4. **Decide Community's primary CTA** — right now the page's two most prominent buttons do nothing. Even a temporary honest state ("chưa mở — để lại email" or similar) would beat a disabled button in the same visual slot as a real CTA.
5. **Pick one program to lead on the Premium page**, or accept 5 equal-weight options as intentional — currently reads as unintentional given every other hub page in the audit has a clear single lead action.
6. **Consolidate the 3 duplicate `Breadcrumb` helper functions** into one shared component (already named as a gap in `PORTAL_COMPONENT_LIBRARY.md`) — needs Product Owner approval to introduce per that document's own Quality Rules, but would prevent this sprint's exact mislabeling bug from recurring independently in each copy.
7. **Extend breadcrumb coverage** to the other 6 platforms, and **normalize back-button coverage** on Companion/Community/CKOS's weaker spots (`hetrithucai/collection/[slug]`, `digital-assets/**`, `duan-cohoi/[ecosystemSlug]{,/[subProjectSlug]}`) — largest-effort item on this list, scope it as its own follow-up sprint rather than folding into future unrelated work.
8. **Add the 4 missing cross-pillar "learning journey" links** (AI Workspace → Journey, Projects & Opportunities → Premium, Community → Journey, Journey → Community) — a content/IA decision on exact placement and copy, not a mechanical fix.
9. **Add a real focus trap to the mobile drawer** — currently Tab can escape into background content while the drawer is open; a genuine accessibility gap, but implementing focus-trapping is new interactive logic rather than a class-name fix.

---

## Appendix — Fixes applied in this sprint (mechanical only, per "Only fix navigation inconsistencies")

1. Breadcrumb root-label bug: "Học viện" → "Portal" in 6 places across 3 files (AI Workspace's breadcrumb + `WorkspaceMvp.tsx`).
2. 19 internal links across 11 files repointed from the `/portal/ai-academy`/`/portal/personal-brand` redirect stubs directly to `/portal/hocvienai`; the now-redundant sitemap entry for `/portal/ai-academy` removed.
3. Mobile drawer close button enlarged from 32×32px to 44×44px (WCAG 2.5.5 minimum).
4. `PortalBackLink`'s tap area doubled via padding + compensating negative margin, zero visual position change, applied once at the shared component (benefits every page using it).

Verified: `npm run lint` clean, `npm run build` succeeds (all routes compile), `npm run test` 139/139 pass (including the route-integrity test added in the Route Migration sprint, which independently re-confirms no link was broken by these changes).
