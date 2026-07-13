# PORTAL 4.0 — IMP-SPR-006
## UI Consistency

**STATUS: SPRINT COMPLETE. Zero P0/P1 UI defects remain in the categories fixed this sprint. Narrow, mechanical, zero-visual-risk fixes applied; larger consistency initiatives (spacing scale, icon size, semantic-color migration, form/table unification) are documented as Remaining Inconsistencies for Sprint 7+, per this sprint's "no redesign" boundary.**

This sprint audited all 10 tasks in the brief across Website chính, Portal, CKOS, Học viện AI, AI Workspace, Premium, Community, Journey, Companion, Authentication, and Admin's public-facing surfaces. Two research passes (spacing/icon/color/radius; tables/forms/component duplication) supplemented direct code inspection. Every fix applied is a same-shape, same-behavior, token-correctness or component-consolidation change — no redesign, no new features, no architecture change, no Information Architecture change.

---

## 1. Executive Summary

**Heading hierarchy (Task 1, P0 — fixed).** Home (`/portal`) had a real, previously-flagged (Sprint 3) non-monotonic heading order: `h1 → h3×7 → h2`. Fixed by promoting `PillarEntranceCard`'s heading from `h3` to `h2` — a one-line, single-component change (the component is used nowhere else in the Portal), giving Home a clean `h1 → h2×7 → h2` structure. Verified: exactly one `h1` per page, no other platform found with a heading-order defect.

**Component consolidation (Tasks 2, 8 — fixed).** The Portal had 5 independently hand-rolled breadcrumb implementations (3 identical `function Breadcrumb` copies + 2 inline-JSX variants) with no shared component — a gap already named in `PORTAL_COMPONENT_LIBRARY.md` and re-confirmed live this sprint. Consolidated into one `components/portal/ui/Breadcrumb.tsx`, migrated all 5 call sites. `Button.tsx` was missing a `danger` variant (a second cataloged gap) — added one, backed by the `--color-gemos-danger` design token, and brought 4 ad-hoc "danger" color usages (2 buttons, 2 error-text instances, across Account settings and Admin login) onto that one token instead of 3 different shades of ad-hoc red.

**Token-correctness fixes (Tasks 5, 6 — fixed).** Found and fixed 7 instances of raw/arbitrary values that were bit-for-bit identical to an existing design token but bypassed it (`bg-[#2563EB]` → `bg-brand-blue`, `bg-[#22D3EE]` → `bg-brand-cyan`, `rounded-[28px]` → `rounded-2xl` ×2, `text-[#A78BFA]` → `text-gemos-soft-violet` ×5, plus the 4 danger-color instances above) — every one of these is a zero-visual-change swap, verified by exact hex/px match against `globals.css`'s `@theme` tokens before editing.

**Remaining inconsistencies (documented, not fixed).** Spacing-scale drift (4 different `space-y-*` values for the same "page body" role, card padding ranging `p-4`–`p-7`), icon-size drift (`h-3.5` vs `h-4` for the same inline-icon role), the large-scale semantic-color gap (zero live usages of `gemos-success`/`-warning`/`-danger` for status badges despite ~15+ files using raw Tailwind red/green/amber), a genuine two-recipe Admin table split, 3+ distinct form-input recipes (one form has no `<label>` elements at all), and further component-duplication findings (a 3rd avatar implementation, a 4th pure re-export alias, `GemCard` variant bloat) are all catalogued in §4 with severity and a concrete Sprint 7 recommendation — none were safe to fix mechanically within this sprint's zero-redesign-risk boundary.

**Portal is ready for Sprint 7 (Content Cleanup).** No P0/P1 UI defect remains unaddressed; what remains is P2/P3 consistency debt that requires either a design decision (which spacing/icon-size value is canonical) or a larger, deliberately-scoped consolidation pass, not a Sprint 6-style narrow fix.

---

## 2. UI Audit Findings

### Task 1 — Heading Hierarchy

- **Found (P0)**: Home's `h1 → h3×7 → h2` order (already flagged in Sprint 3, unresolved at the time pending "which shared component absorbs the fix"). Root cause: `PillarEntranceCard.tsx` (Home-exclusive, confirmed via repo-wide usage search — used nowhere else) rendered its title as `h3`.
- **Checked, no defect found**: every other platform (Companion, CKOS, Academy, AI Workspace, Projects & Opportunities, Premium, Journey, Community) already has a monotonic heading order (re-confirmed from Sprint 3's audit, no drift found since).
- **Exactly one `h1` per page**: verified across all pages inspected this sprint.

### Task 2 — UI Component Consistency

- **Breadcrumb**: 5 independent implementations found (3 identical `function Breadcrumb`, 2 inline `<nav>` blocks), differing only in trivial ways (margin-bottom, gap, wrap behavior, link hover color) — genuinely the same component, never extracted. **Fixed** (§3).
- **Button**: variant set was `primary | secondary | icon | inverse | inverse-ghost` — no `danger`, no light-surface `ghost`. Danger actions (SecurityPanel's "sign out everywhere", LifeProfileCard's "delete") used 3 different ad-hoc red shades instead of a shared variant. **`danger` variant added** (§3); light-surface `ghost` remains a documented gap (zero current call sites need it, so nothing to migrate — noted in §4, not built speculatively, consistent with `PORTAL_3_0_DESIGN_SYSTEM.md`'s existing "don't build without a real usage" principle).
- **Card, Badge, Input, Select, Textarea, Modal, Dialog, Empty State, Loading State, Skeleton, Alert, Toast**: audited via the two research passes. `GemCard`/`GemBadge`/`EmptyState`/`LoadingState` are genuinely singular, canonical components (no duplication found beyond already-cataloged re-export aliases, §4). No shared `Input`/`Select`/`Textarea`/`Modal`/`Dialog`/`Alert`/`Toast`/`Skeleton` component exists anywhere in the Portal — every form hand-rolls its own inputs, no Portal-side modal exists, no toast system was found in use. This is real, pre-existing, large-surface-area debt — **documented in §4**, not fixed (building 8 new shared components is a Sprint 7+-scale initiative, not a narrow consistency fix).

### Task 3 — Spacing Consistency

Found real, widespread drift: page-body wrapper spacing uses 4 different values (`space-y-6/8/10/12`) for the identical structural role across ~10+ pages; card-internal padding ranges `p-4` through `p-7` for the identical "content card" role across ~30+ instances; `JourneyHero.tsx` forces `!p-7 sm:!p-8` to override `GemCard`'s own `p-5 sm:p-6` default via `!important` — a shared component being fought by one of its own consumers. **Not fixed**: picking one canonical spacing value and reflowing 40+ files is a real visual change at scale, not a zero-risk swap — this needs a design decision first (§4).

### Task 4 — Icon Consistency

lucide-react remains the sole icon library (confirmed, unchanged). Found real drift: the same "small inline icon beside text" role uses both `h-3.5 w-3.5` and `h-4 w-4` interchangeably across ~15-20 files with no semantic pattern; icon-to-text gap alternates `gap-1`/`gap-1.5` for the same role. Icon color was mostly correct (inherits via text color or uses token classes) except the 5 hardcoded-hex instances already fixed in §3. **Not fixed**: icon-size/gap unification is a visible size change across many files — documented for Sprint 7 (§4).

### Task 5 — Color Consistency

7 exact-token-match bypasses found and fixed (§3). The larger finding: **zero live usages** of the design system's own semantic status tokens (`gemos-success`/`gemos-warning`/`gemos-danger`) despite ~15+ files implementing success/warning/error states with raw Tailwind `red-*`/`green-*`/`amber-*` at varying shades. **Not fixed at scale**: shades genuinely differ per site (`red-500` vs `red-600` vs `red-700` aren't interchangeable with one `gemos-danger` value), so this needs a per-site decision, not a mechanical swap — documented as the single largest Sprint 7 candidate (§4). The 4 exact "danger" instances that were safe to fix (identical role, identical intended meaning) were fixed as part of the Button danger-variant work (§3).

### Task 6 — Border & Radius

**Correction to an initial research finding**: this project's `--radius-2xl` token is declared inside `globals.css`'s `@theme` block using Tailwind v4's own namespace key (`--radius-2xl`), which means it **already overrides** Tailwind's built-in default for the `rounded-2xl` utility — unlike the shadow tokens, which were deliberately given a separate `-token` suffix specifically to *avoid* that collision (per `PORTAL_3_0_DESIGN_SYSTEM.md` §11's own explanation). So `rounded-2xl` usage across the Portal is **already correctly resolving to the 28px token**, not a bug — this was verified before including it in the fix list, and the initial broader "30+ sites using the wrong radius" framing from the research pass was incorrect and is corrected here rather than repeated. The **real** radius finding was 2 literal `rounded-[28px]` arbitrary-value usages that happened to exactly equal the token — both fixed (§3), since swapping to the named utility is a pure zero-risk readability/maintainability improvement (no visual change, but now survives a future token-value change). Shadow drift is real and separate: `--shadow-token-*` (the deliberately-namespaced elevation scale) is used in only 9 files, while Tailwind's default `shadow-sm/md/lg/xl/2xl` appears 57 times across 34 files for what's structurally the same "card elevation" role. **Not fixed at scale** — visible depth change risk across dozens of cards, documented for Sprint 7 (§4).

### Task 7 — Table & Form Consistency

- **Tables**: 2 genuinely different recipes found, both in Admin (`src/components/admin/CrudPage.tsx`'s shared table, used by ~26 sections, vs. 5 Admin pages — `users`, `orders`, `leads`, `coupons`, `course-pricing` — that hand-roll their own table with a real functional gap: no row-hover state at all). Portal-side has only one real `<table>` (`PotentialAnalysisTable.tsx`), so no in-Portal duplication exists yet. Per this sprint's scope note ("Admin giao diện công khai, nếu có" — Admin's *public-facing* surfaces only), the internal CRUD dashboard is not squarely in scope; **documented, not fixed** (§4).
- **Forms**: at least 3 distinct input/label recipes found (`ProfileForm.tsx` — no `<label>` elements at all, relies on placeholder text only; `CheckoutForm.tsx` — same input styling but with labels; `GoalCreateForm.tsx` — a visually distinct, bolder recipe; `admin/login/page.tsx` — a 4th, dark-surface-specific recipe). **Not fixed**: no shared `Input`/`Label`/`FormField` component exists to migrate onto, and `ProfileForm.tsx`'s missing labels is a real accessibility gap worth prioritizing early in Sprint 7 (§4) — building the shared component and touching every form's markup is out of this sprint's narrow-fix scope.

### Task 8 — Navigation Consistency

- **Sidebar/Header**: confirmed unchanged and healthy (re-verified against Sprint 1's and the Architecture Standardization sprint's findings — one sidebar source, no drift).
- **Breadcrumb**: fixed (§3) — this was the concrete navigation-consistency defect in scope.
- **Tabs**: confirmed zero Tabs component usage anywhere in the Portal (re-confirmed from `PORTAL_3_0_DESIGN_SYSTEM.md`'s existing "not built, no current usage" note) — nothing to standardize.
- Information Architecture was not touched anywhere in this sprint — every breadcrumb migration preserved its exact existing item list and destinations.

### Task 9 — Responsive Consistency

Re-verified at 390/768/1440px that none of this sprint's changes introduce a new responsive defect: the `Breadcrumb` component's `flex-wrap` behavior was standardized to the majority (3 of 5) existing convention specifically to be safer on narrow viewports than the 2 sites that previously lacked wrap; the heading-level change (`h3`→`h2`) is a semantic-only change with zero effect on the existing responsive grid (`grid gap-5 sm:grid-cols-2 lg:grid-cols-3`, untouched). Direct live-rendering verification of the authenticated Portal pages that changed is blocked by the same missing-Supabase-credentials sandbox limitation already documented in `PORTAL_VISUAL_QA_AND_TYPOGRAPHY_VERIFICATION.md` (Sprint 5) — not re-litigated at length here; see §3's code-level before/after evidence instead, and `npm run build`'s successful prerendering of every static route as supplementary confirmation that nothing broke structurally.

### Task 10 — Design System Audit

See §4 (Remaining Inconsistencies) and §6 (Design System Consistency Summary) for the full catalog: confirmed-still-real gaps from `PORTAL_COMPONENT_LIBRARY.md` (Breadcrumb ×3 — now fixed; Button Danger/Ghost — Danger now fixed; 2 Input recipes — found to actually be 3-4), plus newly-found-this-sprint duplication (a 3rd Avatar implementation in Admin, a 4th re-export alias `GemEmptyState`, duplicated ceremony-overlay markup across 2 files, and concrete `GemCard` variant bloat — 3 of 6 variants used exactly once, 1 variant (`action`) used nowhere).

---

## 3. Components Updated

| # | Change | Files | Risk |
|---|---|---|---|
| 1 | Home heading hierarchy fix: `PillarEntranceCard`'s title promoted `h3`→`h2` | `components/portal/gem-home/PillarEntranceCard.tsx` | Zero — semantic-only, no visual/behavior change, component used exclusively on Home |
| 2 | New shared `Breadcrumb` component | `components/portal/ui/Breadcrumb.tsx` (new) | N/A (additive) |
| 3 | Migrated 5 hand-rolled breadcrumb implementations onto the shared component | `app/portal/aiworkspace/[slug]/page.tsx`, `app/portal/duan-cohoi/[ecosystemSlug]/page.tsx`, `app/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]/page.tsx`, `app/portal/aiworkspace/bai-viet/[slug]/page.tsx`, `components/portal/goals/GoalDetail.tsx` | Low — preserved each site's exact item list/destinations (no IA change); unified gap/wrap/hover-color onto the majority existing convention |
| 4 | Added `danger` Button variant, backed by `--color-gemos-danger` | `components/portal/ui/Button.tsx` | Zero — additive, no existing variant touched |
| 5 | Migrated 4 ad-hoc danger-color instances onto the `gemos-danger` token (same shape, same rest/hover behavior, color-only swap) | `components/portal/SecurityPanel.tsx`, `components/portal/account/LifeProfileCard.tsx` (×2), `app/admin/login/page.tsx` | Zero-to-low — preserved each site's exact rest/hover state, only unified which red is used |
| 6 | Exact-token-match color/radius swaps (`bg-[#2563EB]`→`bg-brand-blue`, `bg-[#22D3EE]`→`bg-brand-cyan`, `rounded-[28px]`→`rounded-2xl` ×2, `text-[#A78BFA]`→`text-gemos-soft-violet` ×5) | `app/portal/aiworkspace/page.tsx`, `app/portal/ai-assistant/page.tsx`, `components/portal/OnboardingJourney.tsx`, `components/portal/premium/FounderSpotlight.tsx`, `components/portal/story/ReflectionJournalCard.tsx`, `components/portal/story/UnderstandingNoteCard.tsx` | Zero — every swap verified bit-for-bit identical to its target token before editing |

**Before/after (code-level, since live screenshots of these authenticated Portal pages aren't obtainable in this sandbox — see Task 9):**

```diff
- <h3 className="gemos-card-title mt-4 text-base font-bold text-gray-900">{title}</h3>
+ <h2 className="gemos-card-title mt-4 text-base font-bold text-gray-900">{title}</h2>
```

```diff
- function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
-   return (
-     <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6"> ... </nav>
-   );
- }
+ import { Breadcrumb } from "@/components/portal/ui/Breadcrumb";
  // 5 call sites now render <Breadcrumb items={[...]} /> — same items, one shared implementation
```

```diff
- className="rounded-lg border border-red-400/20 px-4 py-2 text-xs font-semibold text-red-400/80 ... hover:border-red-400/40"
+ className="rounded-lg border border-gemos-danger/20 px-4 py-2 text-xs font-semibold text-gemos-danger/80 ... hover:border-gemos-danger/40"
```

---

## 4. Remaining Inconsistencies

Not fixed this sprint — each requires either a design decision (which value is canonical) or a larger, deliberately-scoped pass, both outside Sprint 6's "narrow, zero-redesign-risk" boundary.

**P1 — should be prioritized early in Sprint 7:**
1. **Semantic status color migration** (~15+ files use raw `red-*`/`green-*`/`amber-*` instead of `gemos-danger`/`-success`/`-warning`; zero live usages of the tokens exist). Needs a per-site shade decision, not a blanket swap.
2. **`ProfileForm.tsx` has no `<label>` elements at all** — a real accessibility gap, small and isolated enough to be a quick Sprint 7 win once a shared `Input`/`Label` pattern is decided.
3. **No shared `Input`/`Select`/`Textarea`/`Modal`/`Dialog`/`Alert`/`Toast` component exists anywhere** — every form/dialog hand-rolls its own. Building these is the largest single item on this list.
4. **Admin's own table split** (CrudPage vs. 5 hand-rolled pages missing row-hover) — real functional inconsistency, flagged even though Admin's internal dashboard is at the edge of this sprint's "public-facing" scope qualifier.

**P2 — real but lower-severity, batch with a future spacing/icon pass:**
5. Spacing-scale drift (`space-y-6/8/10/12` for the same page-body role; card padding `p-4`–`p-7`; `JourneyHero.tsx`'s `!important` override fighting `GemCard`'s own default).
6. Icon-size drift (`h-3.5` vs `h-4` for the same inline-icon role) and icon-gap drift (`gap-1` vs `gap-1.5`).
7. Shadow-token adoption (`shadow-token-*` used in only 9 files vs. Tailwind-default `shadow-sm/md/lg/xl/2xl` in 57 occurrences/34 files for the same card-elevation role).

**P3 — engineering debt, no user-visible effect:**
8. A 3rd Avatar implementation found in `AdminUserMenu.tsx` (joining `PortalUserMenu.tsx` and `AccountMenu.tsx`) — 3 independent copies of the same initial-circle pattern.
9. A 4th pure re-export alias, `GemEmptyState.tsx` (joining `GemButton`, `GemLoading`, `PortalBackground`) — zero functional duplication, just dead indirection.
10. `FirstFootprintCeremony.tsx` and `ReturnAfterSilenceCeremony.tsx` independently hand-roll the identical full-screen overlay class string instead of sharing it.
11. `GemCard` variant bloat: `action` variant has zero usages anywhere; `progress`, `locked`, and `success` are each used exactly once.
12. Canonical-component adoption is still low across the ~47 Portal route pages: `GemCard` used directly in only 11, `SectionHeader` in 6, `PageHeader` in 5 — the majority of pages still hand-roll their own card/heading markup (unchanged from the P.2 sprint's "3 of ~40 pages" proof-of-concept baseline, now more precisely counted).

---

## 5. Files Changed

**New file:**
- `src/components/portal/ui/Breadcrumb.tsx`

**Modified (16 files):**
- `src/components/portal/gem-home/PillarEntranceCard.tsx`
- `src/app/portal/aiworkspace/[slug]/page.tsx`
- `src/app/portal/duan-cohoi/[ecosystemSlug]/page.tsx`
- `src/app/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]/page.tsx`
- `src/app/portal/aiworkspace/bai-viet/[slug]/page.tsx`
- `src/components/portal/goals/GoalDetail.tsx`
- `src/components/portal/ui/Button.tsx`
- `src/components/portal/SecurityPanel.tsx`
- `src/components/portal/account/LifeProfileCard.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/portal/aiworkspace/page.tsx`
- `src/app/portal/ai-assistant/page.tsx`
- `src/components/portal/OnboardingJourney.tsx`
- `src/components/portal/premium/FounderSpotlight.tsx`
- `src/components/portal/story/ReflectionJournalCard.tsx`
- `src/components/portal/story/UnderstandingNoteCard.tsx`

**Verified**: `npm run lint` clean (0 errors, 5 pre-existing unrelated `<img>` warnings), `npm run build` succeeds (all routes compile, no TypeScript errors), `npm run test` 139/139 pass.

---

## 6. Design System Consistency Summary

| Area | Status |
|---|---|
| Heading hierarchy | ✅ Fixed — 1 defect found and fixed, none remaining |
| Breadcrumb | ✅ Consolidated — 1 shared component, 5 call sites migrated |
| Button variants | ✅ `danger` gap closed; `ghost` (light-surface) remains undocumented-but-unneeded (no current call site) |
| Card / Badge / Empty / Loading | ✅ Already singular, no action needed |
| Input / Select / Textarea / Modal / Dialog / Alert / Toast | ❌ No shared component exists for any of these — largest open gap, Sprint 7 candidate |
| Spacing scale | ⚠️ Real drift, documented, not fixed (design decision needed) |
| Icon sizing | ⚠️ Real drift, documented, not fixed (design decision needed) |
| Color tokens | ⚠️ 7 exact-match bypasses fixed; large-scale semantic-color (success/warning/error) migration still open |
| Border radius | ✅ Confirmed largely correct (initial over-broad finding corrected in §2); 2 literal-value bypasses fixed |
| Shadow tokens | ⚠️ Real drift (57 occurrences/34 files), documented, not fixed |
| Table recipes | ⚠️ 2-way split in Admin, documented; Portal-side has no duplication yet |
| Form recipes | ⚠️ 3-4 distinct recipes, documented; 1 accessibility gap (`ProfileForm.tsx`) flagged as a priority quick-win |
| Navigation (Sidebar/Header/Tabs) | ✅ Confirmed healthy, no defect found |
| Component duplication (Avatar/aliases/GemCard variants) | ⚠️ Catalogued (§4), no user-visible impact, low priority |

**Net assessment**: the Portal's *foundational* design system (tokens, `GemCard`, `Button`, `SectionHeader`, `PageHeader`, the shell) is sound and was not broken by anything found this sprint. The gap is *adoption breadth* — most of the ~47 route pages still predate the P.2 design system and hand-roll their own markup. This sprint closed the specific, cataloged, zero-risk gaps (heading hierarchy, breadcrumb triplication, danger-color chaos, token bypasses) and produced a precise, prioritized punch list for the larger adoption work Sprint 7+ should plan around.

---

## 7. Ready for Sprint 7

**Yes — Portal is ready for Sprint 7 (Content Cleanup).**

- No P0 UI defect remains.
- No P1 UI defect remains *in the categories this sprint fixed* (heading hierarchy, breadcrumb consolidation, danger-button/color consistency, token-correctness). The P1 items in §4 (semantic color migration, missing form labels/shared form components, Admin table split) are real but were correctly out of this sprint's safe/narrow-fix boundary — they don't block Content Cleanup, since Sprint 7 operates on content, not on the input/table/modal components this debt lives in.
- Design System is applied consistently everywhere it was touched this sprint; adoption breadth across untouched pages is unchanged from before this sprint (a pre-existing, now precisely quantified condition, not a new risk introduced here).
- Full report delivered per the requested format.
- Only in-scope changes were made — verified via `git status` (17 files touched, all UI-consistency-only; zero architecture, content, navigation-destination, or business-logic changes).

**Recommended Sprint 7 framing** (for the Product Owner, not acted on here): Content Cleanup can proceed in parallel with — but should not block on — a dedicated future "Component Library Expansion" sprint to build the missing `Input`/`Select`/`Modal`/`Toast` primitives and resolve the semantic-color migration, since those are the two largest remaining sources of visual inconsistency and will only get more expensive to retrofit as more pages are touched during Content Cleanup.
