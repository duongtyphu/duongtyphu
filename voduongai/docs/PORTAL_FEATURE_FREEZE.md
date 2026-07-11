# PORTAL 4.0 — IMP-SPR-008
## Portal Feature Freeze Review

**STATUS: REVIEW COMPLETE. This is a synthesis and recommendation, not a self-executed decision — per the brief's explicit "Không tự quyết định Feature Freeze," the READY/NOT READY verdict below is a recommendation submitted for PMO's official decision, not a decision this sprint makes unilaterally.**

This is the closing review of EPIC-01 — Portal v1.0, synthesizing Sprint 4 (Architecture Standardization), Sprint 5 (Visual QA + Typography Verification), Sprint 6 (UI Consistency), and Sprint 7 (Content Cleanup) into one final assessment. No code was changed this sprint beyond re-verification — per the brief, Task scope is entirely "xác nhận / kiểm tra / lập danh sách / đánh giá" (confirm/check/list/assess), with UI fixes authorized only for Critical bugs, and none were found. Re-ran `npm run lint`/`build`/`test` against the current `claude/vietnamese-greeting-zkzn2p` branch (HEAD at commit `f31daf7`, Sprint 7's final commit) to confirm no regression exists between Sprint 7 and this review: lint clean (0 errors, 5 pre-existing unrelated warnings), build succeeds (all routes compile), 139/139 tests pass.

Per the brief's scope, **Admin CMS itself is not evaluated** in this review — it appears only where it affects Portal (the ADR-007 Admin Ownership finding, which concerns data tables shared with Portal commerce, not Admin's own UI/functionality).

---

## 1. Executive Summary

Four sprints of QA work (Architecture, Visual QA/Typography, UI Consistency, Content Cleanup) closed every item that was safe to close without a Product Owner decision. What's left is not neglect — it's a consistent, three-sprint-running finding: **5 architecture-level ownership questions remain genuinely undecided**, and Sprint 7 confirmed via a direct PMO instruction that they are still undecided, not merely unimplemented. Two of those five (ADR-004 Purchasable Entity, ADR-007 Admin Ownership) carry real business risk today — a confirmed revenue-integrity gap (customers can pay and receive nothing) and a live data-corruption risk (two admin systems writing to the same tables with no coordination).

**Portal Health Score: 6.0/10** (up from Sprint 4's 5.5/10 baseline — UI and Content both improved materially; Architecture is unchanged because it was never in scope for those two sprints to touch).

**Recommendation: NOT READY for Feature Freeze.** This is not a new finding — it is Sprint 4's and Sprint 7's conclusion, independently re-confirmed a third time by this review, with nothing having changed in the interim to justify a different answer. See §9.

**Release Readiness (shift resources to Admin CMS): NO**, and not simply because Architecture is imperfect — specifically because ADR-007 (which admin system is canonical) is a prerequisite decision for scoping EPIC-02 correctly, not a parallel-track item. Starting Admin CMS work before deciding which existing admin system it builds on risks building on the wrong foundation. See §8.

---

## 2. Architecture Status

Per Sprint 4 (`PORTAL_ARCHITECTURE_STANDARDIZATION.md`), re-confirmed unchanged by Sprint 7 (`PORTAL_CONTENT_CLEANUP.md` §3-4, since Tasks 4-8 were explicitly blocked and nothing touched schema/ownership):

**Stable, no drift, confirmed still true:**
- Shell/layout system (`PortalShell`/`PortalHeader`/`PortalSidebar`/`PortalSearch`) — frozen, zero violations across all 4 sprints.
- Module dependency graph — acyclic, Companion confirmed as a one-directional hub (imported by CKOS/Academy/Journey, never imports back).
- Reflection/Journal/Practice/Workflow/Community-Post ownership boundaries — clean, single-owner, no conflicts.
- Academy vs. AI Workspace content boundary — Sprint 7 investigated this specifically and confirmed it was already correctly implemented per a pre-existing decision doc (`AI_WORKSPACE_ACADEMY_CONTENT_AUDIT.md`), not the open question Sprint 3's original framing suggested.

**Not stable — 5 open ownership decisions, unchanged since Sprint 4, explicitly re-confirmed still open by PMO instruction in Sprint 7:**
1. **ADR-004 — Purchasable Entity.** `orders`' `lesson_id`/`product_id`/`course_id` triple foreign key, three tables never reconciled. Root cause of the P0 first found in Sprint 2 of the earlier QA series (confirmed course purchases deliver no content).
2. **ADR-005 — `vdai-academy` vs. `hocvienai`.** A real, Supabase-backed, actively-linked (9 files) commerce surface with zero sidebar discoverability, structurally separate from the Academy pillar.
3. **ADR-006 — Tool Catalog.** 3 disconnected catalogs (`data/tools.ts`, `data/admin/tools.ts`, `data/khong-gian-ai/index.ts`).
4. **ADR-007 — Admin Ownership.** 2 independent admin apps (`admin.html` legacy, `src/app/admin/(dashboard)/` modern) both writing to `courses`/`products` with no coordination.
5. **ADR-008 — Memory Ownership.** 2 disconnected "memory" systems (`memory_capsules` Supabase table vs. Companion's `growth-view.ts` localStorage activity log) — Sprint 7 noted this got slightly more fragile in passing (a function in `character-memory.ts` lost its only caller when a superseded component was deleted, though the function itself was deliberately left untouched rather than guessed at).

Plus one unnumbered item: **Goal Model** — 2 disconnected systems (`goal-runtime.ts` live vs. `data/admin/userGoals.ts` unused admin catalog).

**No new Architecture Drift found this review.** The drift catalog is exactly what Sprint 4 recorded, re-verified accurate.

---

## 3. UI Status

Per Sprint 5 (`PORTAL_VISUAL_QA_AND_TYPOGRAPHY_VERIFICATION.md`) and Sprint 6 (`PORTAL_UI_CONSISTENCY.md`):

**Typography — clean.** System UI Font Stack verified on every reachable page (75 captures, 16 URLs × 3 viewports: 390/768/1440px), zero Google Fonts requests, zero `font-weight:300` usages anywhere in the repo. No P0/P1 found in Sprint 5; nothing has touched typography since.

**Heading hierarchy — fixed.** Home's `h1→h3×7→h2` defect (originally flagged Sprint 3) was fixed in Sprint 6 — `PillarEntranceCard`'s title promoted to `h2`. Verified: exactly one `h1` per page, monotonic order everywhere checked across all 4 sprints.

**Component consistency — the concrete P0/P1s are fixed; broader adoption debt remains.** Sprint 6 consolidated 5 hand-rolled breadcrumb implementations into one shared component, added a `danger` Button variant (closing a cataloged gap), and fixed 7 token-bypass color/radius instances. What remains, all correctly classified P1/P2/P3 (not P0/P1-blocking, per Sprint 6's own risk assessment) and left for a future dedicated sprint:
- No shared `Input`/`Select`/`Textarea`/`Modal`/`Dialog`/`Alert`/`Toast` component exists anywhere — every form/dialog hand-rolls its own (P1).
- `ProfileForm.tsx` has zero `<label>` elements (P1, accessibility gap, isolated and easy to fix once a shared Input pattern exists).
- Zero live usages of the `gemos-success`/`-warning`/`-danger` semantic color tokens despite ~15+ files needing them (P1).
- Spacing-scale drift, icon-size drift, shadow-token adoption gap (P2).
- Component-duplication debt: a 3rd Avatar implementation, a 4th re-export alias, `GemCard` variant bloat, duplicated ceremony-overlay markup (P3).

**Responsive — no defect found at 390/768/1440px** on anything directly renderable in the sandbox across Sprints 5-6; Sprint 5's sandbox limitation (authenticated Portal pages can't be live-rendered without real Supabase credentials) remains the one verification gap, documented and unchanged.

**No P0/P1 UI defect remains open.**

---

## 4. Content Status

Per Sprint 7 (`PORTAL_CONTENT_CLEANUP.md`):

**Founder content — single source of truth achieved.** `src/data/portal/founder.ts` is now the one canonical source; `FounderSpotlight.tsx` (Premium) and `CommunityGuides.tsx` (Community) both consume it. No more independently-maintained copies.

**FAQ / Refund Policy — reconciled.** The real defect (found in Sprint 7, not what Sprint 3 originally assumed) was an internal self-contradiction within the static `refund-policy.html` itself — one section stated concrete active refund terms, another called the same policy "not yet officially published." The live Next.js `/refund-policy` page (the one actually linked from checkout) was already correct; the stale static page was fixed to match.

**Dead/duplicate content — one further item resolved.** `ReflectionJournalCard.tsx` deleted (confirmed superseded by `MyStoryBook.tsx`'s own `WriteNook`). `UnderstandingNoteCard.tsx` investigated and deliberately left in place — real, working, unmounted, no evidence of being dead rather than intentionally-incomplete (Sprint 7 correctly declined to guess).

**Remaining, not content-cleanup's job to resolve:** `CommunityGuides`'s missing `achievements` field (a scope decision, not a defect); `GARDEN_DESIGN_SPEC.md`'s broader staleness beyond the one citation fixed (needs a dedicated documentation refresh, flagged not attempted).

**No P0/P1 content defect remains open.**

---

## 5. Known Issues

**Critical (P0) — 3 items, all architecture-ownership decisions, none touched across 4 sprints by explicit design:**
1. **ADR-004 — Purchasable Entity unresolved.** Confirmed revenue-integrity gap: a customer can complete payment for a course and receive no content, because `orders.course_id`-keyed rows are never joined by the `my-products`/`account` rendering logic (which only joins `products`/`lessons`).
2. **ADR-007 — Admin Ownership unresolved.** Two independent admin systems (legacy `admin.html`, modern `src/app/admin/(dashboard)/`) both write to `courses`/`products` with no coordination — a live risk of one admin's edit silently overwriting the other's.
3. **ADR-005 — `vdai-academy` duplicate commerce surface.** Real money flows through a page with zero navigational discoverability, structurally disconnected from both Premium and the Academy pillar it's confusingly named after.

**Major (P1) — 6 items:**
4. **ADR-006 — Tool Catalog**, 3 disconnected schemas.
5. **ADR-008 — Memory Ownership**, 2 disconnected systems.
6. **Goal Model**, 2 disconnected systems, one entirely unused.
7. **Semantic status-color migration** — ~15+ files bypass the design system's own success/warning/danger tokens.
8. **No shared Input/Select/Modal/Toast component library** — every form/dialog is hand-rolled; `ProfileForm.tsx` has no `<label>` elements at all.
9. **Admin's own table-recipe split** (`CrudPage` vs. 5 hand-rolled pages missing row-hover) — real, but explicitly out of this review's scope (Admin CMS not evaluated); carried to §10 handover instead of counted against Portal's own score.

**Minor (P2/P3) — 6 items:**
10. Spacing-scale drift (4 different `space-y-*` values for the same page-body role).
11. Icon-size drift (`h-3.5` vs. `h-4` for the same inline-icon role).
12. Shadow-token adoption gap (`shadow-token-*` used in 9 files vs. Tailwind-default `shadow-*` in 57 occurrences/34 files for the same role).
13. Component-duplication debt: 3rd Avatar implementation, 4th re-export alias, `GemCard` variant bloat (3 of 6 variants single-use, 1 unused), duplicated ceremony-overlay markup.
14. `UnderstandingNoteCard.tsx` — real component, unmounted, status undecided.
15. `GARDEN_DESIGN_SPEC.md` — stale beyond the one citation fixed in Sprint 7 (old route name, old component list).

**Zero Critical UI or Content issues remain** — this review's own scope permitted fixing Critical UI bugs on sight, and none were found (Sprint 6 already closed the ones that existed).

---

## 6. Deferred Backlog

Everything below was explicitly identified and explicitly NOT implemented, by direct PMO instruction (Sprint 7) or because it was correctly out of a given sprint's narrow-fix scope (Sprint 6). Nothing here is "forgotten" — it's each item's first appearance in a backlog, not a repeat of work that should have happened already.

**Requires a Product Owner decision before any implementation (the 5 ADRs + Goal Model):**
- ADR-004 — Purchasable Entity (courses/products/lessons consolidation)
- ADR-005 — `vdai-academy` vs. `hocvienai` relationship
- ADR-006 — Canonical Tool catalog
- ADR-007 — Canonical Admin system
- ADR-008 — Memory model (merge or rename to disambiguate)
- Goal Model consolidation

**Implementation-ready once a design decision is made (no ADR needed, just needs prioritization):**
- Semantic status-color migration (`gemos-success`/`-warning`/`-danger` adoption)
- Shared `Input`/`Select`/`Textarea`/`Modal`/`Dialog`/`Alert`/`Toast` component library
- `ProfileForm.tsx` missing labels (quick win once Input pattern exists)
- Canonical spacing scale and icon-size values
- Shadow-token adoption sweep

**Low-priority engineering debt (no user-visible impact):**
- 3rd Avatar implementation consolidation
- 4th re-export alias (`GemEmptyState`) removal
- `GemCard` unused `action` variant removal, single-use variant review
- Ceremony-overlay markup deduplication (`FirstFootprintCeremony`/`ReturnAfterSilenceCeremony`)
- `UnderstandingNoteCard.tsx` — wire up or formally retire
- `GARDEN_DESIGN_SPEC.md` full rewrite against the current `GardenExperience.tsx` implementation
- `CommunityGuides`'s `achievements` field — add if Founder's achievements should surface on Community too

**Admin-specific (handed to EPIC-02, not scored against Portal — see §10):**
- Admin's table-recipe split (`CrudPage` vs. 5 hand-rolled pages)
- Admin's own 4th form-input recipe (`admin/login/page.tsx`)
- Orphaned admin-authored content never rendered by Portal (`portal-banners`, `start-here-steps`, `today-action-cards`, `user-goals` collections — real CRUD, zero live consumers)

---

## 7. Portal Health Score

| Dimension | Score /10 | Basis |
|---|---|---|
| Architecture | **4.5** | Unchanged since Sprint 4 — shell/dependency graph clean, but 5 real ownership conflicts remain fully open, 2 with active business risk |
| UI | **7.0** | Up from Sprint 4's blended assessment — heading hierarchy fixed, breadcrumb consolidated, danger-color chaos resolved, token bypasses fixed; real but correctly-triaged P1/P2 debt remains (no shared form components, semantic color adoption) |
| Content | **7.0** | Up from Sprint 4 — Founder SSOT achieved, refund-policy self-contradiction fixed, one further dead component removed; minor open items are genuine scope decisions, not defects |
| Performance | **6.0** | No dedicated performance audit has been run across any of the 4 sprints — builds stay clean and no red flags have surfaced incidentally, but this is an absence-of-evidence score, not a verified-good one |
| Accessibility | **6.0** | Global focus-visible ring and badge-contrast fixes shipped pre-Sprint-4 remain solid; Sprint 6 found (but didn't fix) a real gap — `ProfileForm.tsx` has no labels at all; no dedicated a11y audit has been run |
| Maintainability | **5.5** | Up slightly from Sprint 4 — breadcrumb triplication resolved — but Tool/Goal/Memory/Admin-ownership duplication (the 5 ADRs) is exactly the kind of debt that makes every future change on those surfaces more expensive |
| **Overall** | **6.0 / 10** | Meaningful, real progress on everything that was safe to fix without a Product Owner decision; held at this level by the same 5 architecture-ownership questions three sprints running |

*(Scalability, Admin Readiness, and Companion Readiness were scored in Sprint 4's own 11-dimension breakdown but are outside this sprint's requested 6-dimension Health Score and Admin-CMS-excluded scope; see `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §12 for those, unchanged since Sprint 4.)*

---

## 8. Release Readiness

**Can Portal stop large-scale changes and shift resources to Admin CMS? Recommendation: NO.**

This is not a blanket "nothing is done" verdict — it's specific: **ADR-007 (canonical Admin system) is not a parallel-track item, it's a prerequisite for scoping EPIC-02 correctly.** EPIC-02 is Admin CMS work. Starting that work before deciding whether it builds on the legacy `admin.html` or the modern `src/app/admin/(dashboard)/` — while both are still live and both still write to the same tables — risks EPIC-02 either building on the wrong foundation or actively worsening the exact data-corruption risk ADR-007 already flags today.

Secondary reason: ADR-004 (Purchasable Entity) is a live revenue-integrity gap, not a code-quality concern — every day it stays open is a day a real customer could pay and receive nothing. Shifting engineering focus away from Portal before this is at minimum *decided* (not necessarily fully implemented) leaves a known, real financial/trust risk unattended.

**What would make this a YES**: a decision-only session closing ADR-004 and ADR-007 in writing (per Sprint 4's original recommendation, restated in Sprint 7, restated again here) — full implementation isn't required to unblock a resource shift, but a recorded decision is, since it determines what EPIC-02 is actually building toward.

---

## 9. Freeze Recommendation

**RECOMMENDATION: NOT READY FOR FEATURE FREEZE.**

This is a recommendation for PMO's official decision, not a decision made by this review. It is the third independent arrival at the same conclusion (Sprint 4 originally, Sprint 7 re-confirmed, this review re-confirms again), with a consistent, unchanged reason across all three: **the same 2-3 architecture-ownership items (ADR-004, ADR-007, and ADR-005 as its direct consequence) remain open**, and nothing in this review found new information that would change that assessment in either direction.

**What has changed, and is a genuine, freeze-relevant improvement**: UI and Content are both meaningfully better than Sprint 4's baseline, with zero P0/P1 defects remaining in either category. If Architecture Freeze is ever separated from Portal Feature Freeze as a concept (i.e., "the shell/UI/content are frozen, but 3 specific commerce/admin data decisions remain open and tracked separately"), that narrower freeze would be defensible today. This review does not make that call — it's a structural option worth PMO's consideration, not a recommendation.

**What Feature Freeze needs before it can honestly be declared READY:**
1. ADR-004 decided (Purchasable Entity) — written decision, not full implementation.
2. ADR-007 decided (Admin Ownership) — written decision, not full implementation.
3. A statement on ADR-005 (`vdai-academy`), since it's a direct consequence of #1.

ADR-006, ADR-008, and the Goal Model consolidation are real but were already correctly assessed (Sprint 4) as not freeze-blocking — they can be scheduled as ordinary backlog work after Freeze.

---

## 10. Handover to EPIC-02

**Must transfer, not get lost:**

1. **ADR-007 resolution is EPIC-02's actual first task**, not a Portal loose end — whichever admin system EPIC-02 chooses to build on needs to be the answer to this ADR, decided before EPIC-02's own scoping begins.
2. **Admin's two-recipe table split** (`CrudPage`, used by ~26 sections, vs. 5 hand-rolled pages — `users`, `orders`, `leads`, `coupons`, `course-pricing` — missing row-hover state) — a concrete, scoped UI-consistency task for whichever admin system survives ADR-007.
3. **Admin's own 4th form-input recipe** (`admin/login/page.tsx`'s dark-surface input styling, distinct from all 3 Portal-side recipes) — relevant once a shared Input component is eventually built; Admin should adopt the same one, not maintain a permanently-separate 4th recipe.
4. **Orphaned admin-authored content**: `portal-banners`, `start-here-steps`, `today-action-cards`, `user-goals` Supabase collections have full CRUD built in the modern Admin app, but zero live Portal consumer renders any of them (`NotificationTicker.tsx`, the one component that would render `portal-banners`, is never imported anywhere in `src/app`). Either wire up the Portal-side rendering or stop investing further Admin-editor effort on these specific collections until it's wired up.
5. **The unused admin-side Goal catalog** (`data/admin/userGoals.ts`) — never read by the live `/portal/goals` runtime. Part of the deferred Goal Model ADR, but concretely: whoever picks up that ADR should start by confirming whether this admin collection is meant to become the real data source (in which case the live runtime needs to start reading it) or should be retired.

**Future Portal / Companion backlog (not EPIC-02, but shouldn't be lost either):**
6. **Companion is currently architecturally isolated** (Sprint 4 finding, unchanged) — it reads only generic, module-tagged session counts, never actual course/tool/journal content, despite an extensive `AGENT_REGISTRY`/orchestration scaffold already built with every entry marked `status: "planned"`. Any future "Companion knows what you're working on" feature needs new read paths built from scratch; today, Companion should keep speaking only in the generic terms it already honestly uses.
7. **Semantic color migration, shared form component library, spacing/icon-size canonicalization** (§6) — real UI debt, correctly not attempted at scale in Sprint 6, worth a dedicated future Portal sprint once Architecture's ADRs are closed and a UI investment is prioritized again.
8. **`GARDEN_DESIGN_SPEC.md` full rewrite** and **`UnderstandingNoteCard.tsx` wire-up-or-retire decision** — small, contained, low-urgency Future Portal items.

**Explicitly confirmed NOT lost, by inclusion in this list**: every item named in this section was independently traceable in `PORTAL_ARCHITECTURE_STANDARDIZATION.md`, `PORTAL_UI_CONSISTENCY.md`, or `PORTAL_CONTENT_CLEANUP.md` before this review — this handover list is a consolidation for EPIC-02's convenience, not the first record of any of these items.
