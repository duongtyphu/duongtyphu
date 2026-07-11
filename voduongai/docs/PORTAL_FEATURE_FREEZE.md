# PORTAL 4.0 — IMP-SPR-008 (updated by IMP-ADR-001)
## Portal Feature Freeze Review

**STATUS: UPDATED. Founder/PMO have officially approved ADR-004 and ADR-007 (IMP-ADR-001), closing the load-bearing blockers this review's original (Sprint 8) version identified. This document is now updated to reflect that decision. Per IMP-ADR-001's explicit scope, this is a documentation-only update — no code, schema, or business logic changed. The READY/NOT READY verdict below remains a recommendation submitted for PMO's official decision, not a decision this session makes unilaterally — see §9.**

This is the closing review of EPIC-01 — Portal v1.0, synthesizing Sprint 4 (Architecture Standardization), Sprint 5 (Visual QA + Typography Verification), Sprint 6 (UI Consistency), Sprint 7 (Content Cleanup), and now IMP-ADR-001 (Architecture Decision Finalization) into one final assessment. Re-ran `npm run lint`/`build`/`test` against the current branch to confirm no regression: lint clean (0 errors, 5 pre-existing unrelated warnings), build succeeds (all routes compile), 139/139 tests pass.

Per the original brief's scope, **Admin CMS itself is not evaluated** in this review — it appears only where it affects Portal (the ADR-007 Admin Ownership finding, now resolved at the decision level).

---

## 1. Executive Summary

Four QA sprints (Architecture, Visual QA/Typography, UI Consistency, Content Cleanup) closed every item that was safe to close without a Product Owner decision, and consistently, independently flagged the same 2-3 architecture-ownership items as the actual remaining blockers: ADR-004 (Purchasable Entity) and ADR-007 (Admin Ownership), with ADR-005 (`vdai-academy`) as a direct consequence of ADR-004. **Founder and PMO have now officially approved both ADR-004 and ADR-007** (IMP-ADR-001):

- **ADR-004 — APPROVED.** Course is the Canonical Purchasable Entity. Lesson is not sold directly (belongs only to a Course). Product is reserved for standalone products/services. Orders must point to one primary purchasable entity in the future architecture.
- **ADR-007 — APPROVED.** `src/app/admin` (Next.js Admin) is the official Admin CMS. Legacy Admin (`admin.html`) moves to Legacy status, no new features. EPIC-02 builds exclusively on the Canonical Admin.
- **ADR-005 — addressed by consequence** of ADR-004's "Lesson isn't sold directly" rule: `vdai-academy`'s current model is no longer the target architecture.

**Portal Health Score: 6.5/10** (up from 6.0/10 at the close of Sprint 8, up from Sprint 4's 5.5/10 baseline — the decision-level resolution of the two load-bearing architecture blockers materially reduces Portal's largest remaining risk, even though physical implementation of both decisions is still pending, deferred work).

**Recommendation: READY FOR FEATURE FREEZE.** With ADR-004 and ADR-007 approved, none of the specific blockers Sprint 4, Sprint 7, and Sprint 8 each independently identified remain open. See §9 for the full reasoning and the caveats that come with this recommendation — approval-in-writing is not the same as implementation-complete, and that distinction matters for what "frozen" means going forward.

**Release Readiness (shift resources to Admin CMS): YES**, conditioned on EPIC-02 building exclusively on the now-canonical `src/app/admin`, per ADR-007. See §8.

---

## 2. Architecture Status

**Stable, no drift, confirmed still true (unchanged across all 4 sprints + this update):**
- Shell/layout system (`PortalShell`/`PortalHeader`/`PortalSidebar`/`PortalSearch`) — frozen, zero violations.
- Module dependency graph — acyclic, Companion confirmed as a one-directional hub.
- Reflection/Journal/Practice/Workflow/Community-Post ownership boundaries — clean, single-owner, no conflicts.
- Academy vs. AI Workspace content boundary — confirmed (Sprint 7) already correctly implemented per a pre-existing decision doc.

**Resolved at the decision level by IMP-ADR-001 (implementation still pending, tracked as deferred backlog, §6):**
1. **ADR-004 — Purchasable Entity. APPROVED.** Course is canonical. The `orders`' triple-FK ambiguity (`lesson_id`/`product_id`/`course_id`) now has a clear target architecture to migrate toward; the physical FK/rendering-layer consolidation (fixing `my-products`/`account` to join `courses`) has not been implemented — that remains a future implementation sprint's job, out of this documentation-only update's scope.
2. **ADR-007 — Admin Ownership. APPROVED.** `src/app/admin` is canonical, `admin.html` is Legacy. The physical sunset of `admin.html`'s live writes has not been implemented — both systems technically remain live until that migration happens, but no *new* development may target Legacy per the approved decision, which caps the risk from growing further.
3. **ADR-005 — `vdai-academy` vs. `hocvienai`. ADDRESSED BY CONSEQUENCE of ADR-004.** The eventual resolution (migrate to Course-based purchasing, or retire in favor of Premium's flow) is now implied by ADR-004's rule; the actual page consolidation is unimplemented, deferred work.

**Still genuinely open, not part of this finalization:**
4. **ADR-006 — Tool Catalog.** 3 disconnected catalogs. Not freeze-blocking (Sprint 4's original assessment, unchanged).
5. **ADR-008 — Memory Ownership.** 2 disconnected systems. Not freeze-blocking.
6. **Goal Model.** 2 disconnected systems, one unused. Not freeze-blocking.

**No new Architecture Drift found.** The drift catalog is exactly what Sprint 4 recorded, now with resolution status attached to Drift #2, #3, #5 in `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §9.

---

## 3. UI Status

*(Unchanged from the original Sprint 8 review — nothing in IMP-ADR-001 touches UI.)*

Per Sprint 5 (`PORTAL_VISUAL_QA_AND_TYPOGRAPHY_VERIFICATION.md`) and Sprint 6 (`PORTAL_UI_CONSISTENCY.md`):

**Typography — clean.** System UI Font Stack verified on every reachable page, zero Google Fonts requests, zero `font-weight:300` usages anywhere. No P0/P1 found.

**Heading hierarchy — fixed.** Home's `h1→h3×7→h2` defect fixed in Sprint 6. Exactly one `h1` per page, monotonic order everywhere checked.

**Component consistency — concrete P0/P1s fixed; broader adoption debt remains, correctly triaged as non-blocking:**
- No shared `Input`/`Select`/`Textarea`/`Modal`/`Dialog`/`Alert`/`Toast` component exists anywhere (P1).
- `ProfileForm.tsx` has zero `<label>` elements (P1, accessibility).
- Zero live usages of `gemos-success`/`-warning`/`-danger` semantic color tokens despite ~15+ files needing them (P1).
- Spacing-scale drift, icon-size drift, shadow-token adoption gap (P2).
- Component-duplication debt: 3rd Avatar implementation, 4th re-export alias, `GemCard` variant bloat, duplicated ceremony-overlay markup (P3).

**No P0/P1 UI defect remains open.**

---

## 4. Content Status

*(Unchanged from the original Sprint 8 review — nothing in IMP-ADR-001 touches content.)*

Per Sprint 7 (`PORTAL_CONTENT_CLEANUP.md`):

**Founder content — single source of truth achieved.** `src/data/portal/founder.ts` is the one canonical source.

**FAQ / Refund Policy — reconciled.** The static `refund-policy.html`'s internal self-contradiction fixed to match the already-correct live Next.js page.

**Dead/duplicate content — one further item resolved.** `ReflectionJournalCard.tsx` deleted (confirmed superseded). `UnderstandingNoteCard.tsx` deliberately left in place — no evidence of being dead.

**No P0/P1 content defect remains open.**

---

## 5. Known Issues

**Critical — 0 items.** All 3 items originally listed as Critical (ADR-004, ADR-007, ADR-005) are now resolved at the decision level by IMP-ADR-001. See §6 for their implementation status, which remains real, tracked work — "decided" is not "implemented."

**Major — 5 items** *(down from 6 — Admin's table-recipe split moves entirely to §10 EPIC-02 handover now that ADR-007 gives it an owner)*:
1. **ADR-006 — Tool Catalog**, 3 disconnected schemas. Still open, not freeze-blocking.
2. **ADR-008 — Memory Ownership**, 2 disconnected systems. Still open, not freeze-blocking.
3. **Goal Model**, 2 disconnected systems, one entirely unused. Still open, not freeze-blocking.
4. **Semantic status-color migration** — ~15+ files bypass the design system's own success/warning/danger tokens.
5. **No shared Input/Select/Modal/Toast component library** — every form/dialog is hand-rolled; `ProfileForm.tsx` has no `<label>` elements at all.

**Minor — 6 items**, unchanged:
6. Spacing-scale drift.
7. Icon-size drift.
8. Shadow-token adoption gap.
9. Component-duplication debt (3rd Avatar, 4th re-export alias, `GemCard` variant bloat, ceremony-overlay duplication).
10. `UnderstandingNoteCard.tsx` — status undecided.
11. `GARDEN_DESIGN_SPEC.md` — stale beyond the one citation fixed.

**Zero Critical, zero P0/P1 issues of any kind remain open** — the last 3 Critical items were architecture-decision items, now resolved.

---

## 6. Deferred Backlog

**Now implementation-ready (decision made, execution pending — new category, created by IMP-ADR-001):**
- **ADR-004 implementation**: consolidate `orders`' triple FK onto `course_id` as primary; fix `my-products`/`account` to join `courses`; decide the interim/migration path for existing `product_id`/`lesson_id` orders. This is the actual fix for the confirmed revenue-integrity gap — the decision is made, this is now a normal (if important) implementation sprint, not an open question.
- **ADR-007 implementation**: sunset `admin.html`'s live writes, migrate any Legacy-only functionality to `src/app/admin`, formally decommission the legacy interface. EPIC-02 should treat this as its first concrete task, not a parallel cleanup.
- **ADR-005 implementation**: migrate `vdai-academy` to Course-based purchasing or retire it in favor of Premium's existing flow, consistent with ADR-004.

**Still requires a Product Owner decision before any implementation:**
- ADR-006 — Canonical Tool catalog
- ADR-008 — Memory model (merge or rename to disambiguate)
- Goal Model consolidation

**Implementation-ready, no ADR needed, just needs prioritization:**
- Semantic status-color migration (`gemos-success`/`-warning`/`-danger` adoption)
- Shared `Input`/`Select`/`Textarea`/`Modal`/`Dialog`/`Alert`/`Toast` component library
- `ProfileForm.tsx` missing labels (quick win once Input pattern exists)
- Canonical spacing scale and icon-size values
- Shadow-token adoption sweep

**Low-priority engineering debt (no user-visible impact):**
- 3rd Avatar implementation consolidation
- 4th re-export alias (`GemEmptyState`) removal
- `GemCard` unused `action` variant removal, single-use variant review
- Ceremony-overlay markup deduplication
- `UnderstandingNoteCard.tsx` — wire up or formally retire
- `GARDEN_DESIGN_SPEC.md` full rewrite
- `CommunityGuides`'s `achievements` field — add if Founder's achievements should surface on Community too

**Admin-specific (handed to EPIC-02 — see §10):**
- Admin's table-recipe split (`CrudPage` vs. 5 hand-rolled pages)
- Admin's own 4th form-input recipe (`admin/login/page.tsx`)
- Orphaned admin-authored content never rendered by Portal

---

## 7. Portal Health Score

| Dimension | Score /10 | Basis |
|---|---|---|
| Architecture | **6.5** | Up from 4.5 — the two load-bearing ownership decisions (ADR-004, ADR-007) are now APPROVED, removing the decision-paralysis risk that was this dimension's main drag; score isn't higher because implementation of both decisions (FK consolidation, admin.html sunset) is still pending, and ADR-006/008/Goal Model remain genuinely open |
| UI | **7.0** | Unchanged — heading hierarchy fixed, breadcrumb consolidated, danger-color chaos resolved, token bypasses fixed; real P1/P2 debt remains, correctly triaged as non-blocking |
| Content | **7.0** | Unchanged — Founder SSOT achieved, refund-policy contradiction fixed |
| Performance | **6.0** | Unchanged — no dedicated performance audit has been run across any sprint; absence-of-evidence, not verified-good |
| Accessibility | **6.0** | Unchanged — `ProfileForm.tsx`'s missing labels remains open; no dedicated a11y audit has been run |
| Maintainability | **6.0** | Up from 5.5 — the two approved ADRs give a clear target for the two most expensive pieces of duplication (purchasable entity, admin system) to eventually collapse toward, even before implementation happens; Tool/Memory/Goal duplication remains real |
| **Overall** | **6.5 / 10** | Real, cumulative progress across 4 QA sprints plus the decision-level resolution of Portal's two most consequential open questions — implementation work remains, but the ambiguity that made every other decision harder is gone |

---

## 8. Release Readiness

**Can Portal stop large-scale changes and shift resources to Admin CMS? Recommendation: YES**, conditioned on the following:

The original blocking reason (§8 in the pre-ADR-001 version of this report) was specific: ADR-007 wasn't decided, so EPIC-02 risked being scoped against the wrong foundation. **That reason no longer applies** — ADR-007 is approved, `src/app/admin` is canonical, and EPIC-02's scope is now unambiguous: build exclusively on the Canonical Admin, treat `admin.html` as Legacy (no new features), and plan the Legacy sunset as EPIC-02's own first workstream rather than a separate Portal concern.

**Condition**: this YES assumes EPIC-02 actually honors the ADR-007 decision — if EPIC-02 work drifts back into extending `admin.html`, the entire rationale for this readiness assessment reverses. This should be an explicit EPIC-02 kickoff guardrail, not an assumption.

**Secondary note**: ADR-004's approval resolves the revenue-integrity gap at the decision level, but the actual fix (FK consolidation, `my-products`/`account` join correction) is unimplemented. This is now Portal's own responsibility to schedule (it's a Portal commerce fix, not an Admin CMS task) — it should not be treated as "resolved and done," only as "no longer blocked from being scheduled."

---

## 9. Freeze Recommendation

**RECOMMENDATION: READY FOR FEATURE FREEZE.**

This is a recommendation for PMO's official decision, not a decision made by this review. With ADR-004 and ADR-007 approved (and ADR-005 addressed by consequence), every item that Sprint 4, Sprint 7, and Sprint 8 each independently identified as freeze-blocking is now resolved at the decision level.

**What "READY" means here, precisely — an important caveat:** Feature Freeze, per `THE_PORTAL_ARCHITECTURE_FREEZE.md`'s own framing, is about locking the *shell, navigation pattern, and module boundaries* — not about every piece of implementation work being finished. The shell has been frozen and verified clean since before Sprint 4. What was blocking Freeze specifically was the *ambiguity* of 3 open ownership questions, not the incompleteness of their implementation. That ambiguity is now gone. The actual FK consolidation, the `admin.html` sunset, and the `vdai-academy` migration remain real, scheduled, deferred work (§6) — Freeze does not mean these are done, it means the *direction* is locked and no further architectural debate is open on them.

**Not freeze-blocking, unchanged from every prior sprint's assessment**: ADR-006 (Tool Catalog), ADR-008 (Memory Ownership), and the Goal Model consolidation remain genuinely open decisions, but were already correctly assessed as ordinary backlog, not freeze gates — that assessment doesn't change here.

**If PMO ratifies this recommendation**, the next steps are: (1) formally close this Feature Freeze Review, (2) begin EPIC-02 per §8/§10, (3) schedule the ADR-004/005/007 implementation work as tracked Portal backlog (not urgent-blocking, but real and revenue-relevant for ADR-004 specifically), (4) leave ADR-006/008/Goal Model as ordinary backlog for a future Portal sprint.

---

## 10. Handover to EPIC-02

**Must transfer, not get lost:**

1. **ADR-007 is decided — `src/app/admin` is canonical.** EPIC-02 builds exclusively here. `admin.html` is Legacy: no new features, and its sunset (migrating any Legacy-only functionality, then decommissioning it) should be one of EPIC-02's first concrete workstreams, not a someday-cleanup item.
2. **Admin's two-recipe table split** (`CrudPage`, ~26 sections, vs. 5 hand-rolled pages — `users`, `orders`, `leads`, `coupons`, `course-pricing` — missing row-hover state) — a concrete, scoped UI-consistency task for the now-confirmed Canonical Admin.
3. **Admin's own 4th form-input recipe** (`admin/login/page.tsx`) — relevant once a shared Input component is eventually built; Admin should adopt the same one.
4. **Orphaned admin-authored content**: `portal-banners`, `start-here-steps`, `today-action-cards`, `user-goals` Supabase collections have full CRUD in the Canonical Admin, but zero live Portal consumer renders any of them. Either wire up Portal-side rendering or stop investing further Admin-editor effort here until it's wired up.
5. **The unused admin-side Goal catalog** (`data/admin/userGoals.ts`) — part of the still-open Goal Model decision; whoever picks that up should confirm whether this becomes the real data source or gets retired.
6. **ADR-004's implementation is a Portal task, not an EPIC-02 task** — flagging this explicitly so it doesn't get assumed to be "someone else's problem" once EPIC-02 starts. The `orders`/`courses` FK consolidation and `my-products`/`account` join fix stay owned by whoever maintains Portal commerce.

**Future Portal / Companion backlog (not EPIC-02, but shouldn't be lost either):**
7. **Companion is currently architecturally isolated** — reads only generic, module-tagged session counts, never actual course/tool/journal content, despite an extensive `AGENT_REGISTRY` scaffold marked entirely `status: "planned"`. Any future "Companion knows what you're working on" feature needs new read paths built from scratch.
8. **Semantic color migration, shared form component library, spacing/icon-size canonicalization** — real UI debt, worth a dedicated future Portal sprint.
9. **`GARDEN_DESIGN_SPEC.md` full rewrite** and **`UnderstandingNoteCard.tsx` wire-up-or-retire decision** — small, contained, low-urgency Future Portal items.

**Explicitly confirmed NOT lost, by inclusion in this list**: every item named here was independently traceable in `PORTAL_ARCHITECTURE_STANDARDIZATION.md`, `PORTAL_UI_CONSISTENCY.md`, or `PORTAL_CONTENT_CLEANUP.md` before this review — this handover list is a consolidation for EPIC-02's convenience, not the first record of any of these items.
