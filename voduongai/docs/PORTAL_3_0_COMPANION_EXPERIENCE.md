# PORTAL 3.0 — P.3 Companion Experience

Status: **v1 — implemented**

---

## 1. Correction to the brief's premise (important)

The brief named `companion-manager.ts` and `mission-runtime.ts` as the runtime to reuse for "today's
suggestion." A full read of both (plus `mission-catalog.ts`, `goal-runtime.ts`) found they are **not**
the right layer:

- `companion-manager.ts` (Phase 4 Epic 02) is **Workforce Task Assignment** — it routes work to AI
  "Companions" acting as employees inside the Owner-facing Goal/Mission/Workforce business system
  (`assignTask(employeeId, input)`, async, calls a provider API, mutates `workingStatus`). It has no
  concept of "a learner's next best action."
- `mission-runtime.ts` tracks the Analysis→Research→Planning→Review→QA pipeline of **one Mission you
  already have the ID for** — not a discovery/recommendation source.
- `goal-runtime.ts`/`mission-catalog.ts` are Owner/business-goal CRUD and a static mission catalog —
  adjacent, but not what powers consumer-facing "Daily Focus."

The actual, already-shipped engine behind Gem Home's Daily Focus/Next Best Action is
**`src/lib/portal/human-flow.ts`** (`getHumanFlowState(currentOS, dominantChallenge?)`) — synchronous,
pure, real (not mock — the mock is only in the currentOS input, seeded later from actual progress
data per its own code comment), same function already used in production on `/portal`. Journey/
Reflection data comes from **`src/lib/portal/foundation/growth-view.ts`** (`getJourneyProgress()`,
`getGardenSummary()`) — genuinely read-only over real `GrowthEvent`/`WorkspaceSession` data, returns
zero/empty when the user has no activity (no fabricated numbers).

**Per requirement 4 ("don't build new state/runtime if companion-manager.ts/mission-runtime.ts is
enough") — since neither is actually the right engine, the correct action is reusing the engines that
ARE already sufficient (`human-flow.ts`, `growth-view.ts`), not building new state and not forcing the
named-but-wrong files into a role they don't fit.** No new runtime, no new localStorage schema, no new
Supabase table was created for this phase.

---

## 2. What shipped

**New file**: `src/components/portal/companion/CompanionExperience.tsx` (client component).
**Changed file**: `src/app/portal/companion/page.tsx` — inserted `<CompanionExperience />` immediately
after the Hero section, before the existing Genome/Constitution/Philosophy content. The philosophical
content (Genome, Constitution, Mission, Logo Evolution, Living Core demo) is **kept as-is**, just moved
below the actionable experience — Companion now leads with direction, and the "who Companion is" story
follows for anyone who wants to go deeper.

### The 7 required sections, each backed by a real source

| Section | Data source | Notes |
|---|---|---|
| Daily Focus | `getHumanFlowState()` → `currentStage`/`progressNarrative`/`hardTimeLine` | `GemCard variant="featured"` |
| Next Best Action | `getHumanFlowState()` → `nextBestAction`/`reason`/`recommendedRoute`/`recommendedCTA` | `GemCard variant="action"` + `Button variant="primary"` |
| Continue Learning | `getJourneyProgress()` — finds the first non-completed journey entry | Falls back to an honest empty state ("bạn chưa bắt đầu hành trình nào") + CTA to Academy, never fabricates a journey |
| CKOS Suggestions | live `fetch("/api/v1/ckos/tools")` + `fetch("/api/v1/ckos/prompts")` (client-side, existing public read routes from Phase G) | Prompts route currently returns empty (no data migrated into `ckos_prompt_templates` yet — Phase H.4 is dry-run only) — handled with the same honest empty state, not hidden |
| Journey / Reflection prompt | `getGardenSummary()` (missions completed / journeys touched / outputs) + `human-flow.momentumMessage` | Real counts, zero when no activity |
| Workspace Suggestions | static copy + CTA to `/portal/workspace` | Workspace itself has no "suggested session" API yet — honest static prompt, not a fake suggestion |
| Every pillar → 1 next action | new static `PILLAR_SUGGESTIONS` array (CKOS/Academy/Projects & Opportunities/Premium/Journey/Workspace) | Satisfies requirement 6 explicitly — one card per pillar, each with a real route |
| Quick Actions | static Button row → Prompt/Tool/Checklist/SOP/Case Study library pages | All routes already exist and are live |

### Design System (P.2) usage
Every section uses `GemCard`, `SectionHeader` (eyebrow + title), `Button` (`primary`/`secondary`
variants), and `GemBadge` (`premium` tone on the Premium pillar card) — no new one-off markup, no new
CSS class introduced. This is the first real content built entirely on P.2's tokens/components from a
blank page rather than refactoring existing markup onto them.

---

## 3. "Companion as guide, not chatbot" (requirement 5)

No chat input, no message thread, no "ask me anything" box was added. Every section is declarative —
a statement of where the user is and what to do next, with one clear CTA — mirroring how `CompanionGuide.tsx`
(the existing reusable callout used on Academy/Premium pages) already frames Companion: a short guiding
message plus a next action, never a conversation UI. `CompanionPresence` (the floating widget, unchanged,
still globally present per the Portal Architecture Freeze) remains the only actual chat-adjacent surface
in the shell — this page reinforces the "guide" framing rather than duplicating a chat surface.

---

## 4. Verification

- `tsc --noEmit`: clean (no errors introduced).
- `eslint` on both changed/new files: clean.
- `next dev` boot: no compile/runtime errors; `/portal/companion` correctly 307-redirects to
  `/login?next=%2Fportal%2Fcompanion` (same auth-gate behavior as every other Portal route — confirms
  the route itself resolves without a 500, consistent with how P.2's changes were verified under the
  same auth constraint).
- Responsive: every grid in `CompanionExperience` uses the same mobile-first pattern already
  established in the audited pages (`grid gap-4 md:grid-cols-2`, `sm:grid-cols-2 lg:grid-cols-3`) — no
  new breakpoint behavior invented; single column on mobile, 2–3 columns from `sm`/`md`/`lg` up.

---

## 5. Explicitly not done (scope discipline, per the brief's limits)

- No Supabase schema change, no new table, no migration.
- No Agent Runtime — CKOS Suggestions is a plain `fetch` of already-existing public read routes, not a
  new recommendation engine.
- `PortalShell`/`PortalHeader`/`PortalSidebar`/`PortalSearch`/`CompanionPresence` untouched.
- `companion-manager.ts`/`mission-runtime.ts`/`goal-runtime.ts` untouched — confirmed wrong layer (§1),
  not modified or repurposed.

---

## 6. Remaining debt for later phases

1. CKOS Suggestions will show its empty state in production until a future phase actually applies the
   H.3–H.8 seed SQL (still dry-run only) — this is expected, not a P.3 bug.
2. `dominantChallenge` (the reflection-based override in `human-flow.ts`) is not wired into this client
   component — it requires server-fetched `Reflection[]` data (as Gem Home's server component does);
   `CompanionExperience` currently calls `getHumanFlowState("knowledge")` without the override. A future
   pass could convert the Daily Focus/Next Best Action fetch into a small server action to pick this up.
3. "Continue Learning" reads `getJourneyProgress()`, which is sourced from `WorkspaceSession` data (the
   Workforce/Mission runtime), not from Academy/lesson completion directly — accurate today, but P.5
   (Academy Experience) should confirm this is still the right signal once Academy's own progress model
   is finalized.
