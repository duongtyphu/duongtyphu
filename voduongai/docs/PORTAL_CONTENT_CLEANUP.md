# PORTAL 4.0 — IMP-SPR-007
## Content Cleanup

**STATUS: SPRINT COMPLETE, WITH AN EXPLICIT PMO-DIRECTED SCOPE REDUCTION. Tasks 1, 2, 3, 9, 10 executed. Tasks 4-8 (Tool Catalog, Goal Model, Memory Ownership, Admin Ownership, Purchasable Entity/ADR-004) are BLOCKED — PMO explicitly declined to authorize implementation of any of the five architecture-adjacent decisions this sprint's brief assumed were already confirmed.**

**Update (IMP-ADR-001, later):** Founder/PMO have since officially approved ADR-004 (Course is the Canonical Purchasable Entity) and ADR-007 (`src/app/admin` is the Canonical Admin System). This document is preserved as-written for historical accuracy of what was blocked at the time this sprint ran; see `docs/PORTAL_ARCHITECTURE_STANDARDIZATION.md` §11 and `docs/PORTAL_FEATURE_FREEZE.md` for the current, authoritative status. ADR-006, ADR-008, and Goal Model remain open, unaffected by that later decision.

Before starting, this sprint surfaced a real conflict: the brief's Tasks 4-8 instruct executing "confirmed" architecture decisions (Academy vs. Workspace ownership, a single canonical Tool catalog, a merged Goal model, resolved Memory ownership, ADR-004's purchasable entity) — but `docs/PORTAL_ARCHITECTURE_STANDARDIZATION.md` (Sprint 4) recorded these as **open ADRs requiring a Product Owner decision**, and no such decision had been communicated back into this session. Rather than guess at business-critical, hard-to-reverse decisions (which live commerce table is canonical, which of two Admin apps survives), this sprint asked PMO directly. **PMO's answer: treat Tasks 4-8 as blocked, do not assume or implement any of the five decisions, proceed only with the unambiguous content-layer tasks.** This report reflects that direction.

---

## 1. Executive Summary

**Task 1 (Founder Content) — done.** Founder data was duplicated across `FounderSpotlight.tsx` (Premium) and `CommunityGuides.tsx` (Community) — content-synced once already in Sprint 3, but still two independently-hand-maintained copies. Extracted to one canonical `src/data/portal/founder.ts`; both components now import from it. Single source of truth achieved.

**Task 2 (FAQ Consistency) — done.** Found the actual defect behind Sprint 3's "FAQ/refund-terms wording differs" flag: it wasn't a wording mismatch between Premium's FAQ and the refund policy — it was the static `refund-policy.html` **internally contradicting itself** (§3 states concrete "100% refund within 7 days" terms as active policy; §7 called the same policy "chưa được công bố chính thức," i.e. not yet officially published). The live Next.js `/refund-policy` page (the one actually linked from checkout) was already correctly worded. Fixed the stale static page to match.

**Task 3 (Academy vs. Workspace) — investigated, already correctly implemented, no change needed.** The brief assumed a boundary violation needed fixing. Investigation found this exact boundary was already deliberately decided and documented in an earlier, pre-existing `docs/AI_WORKSPACE_ACADEMY_CONTENT_AUDIT.md` — `WorkNeedSection` and an AI_TOOLS-based tool-discovery section were intentionally classified as *learning/discovery* content and placed on Academy, distinct from Workspace's execution-focused Toolbox (which keeps its own separate "Dùng cùng Companion" action). Verified the current code still matches that decision exactly (no duplication on Workspace's own page). Sprint 3's "Academy density from Workspace content" framing was accurate as an observation but incomplete — it didn't have this decision doc. No fix was needed; the record is now corrected.

**Tasks 4-8 — BLOCKED per explicit PMO instruction.** No schema, business logic, checkout flow, ownership model, or runtime architecture was touched. See §6.

**Task 9 (Content Consistency) — done.** Found and removed one further confirmed-dead component (`ReflectionJournalCard.tsx`, superseded by `MyStoryBook.tsx`'s own `WriteNook`, per that file's own code comment). Investigated a second candidate (`UnderstandingNoteCard.tsx`) and determined it's a real, working, currently-unmounted component with no evidence of being superseded — left in place rather than guessed at, consistent with this sprint's overall "don't guess" posture.

**Task 10 (Documentation) — done.** Updated `PORTAL_CONTENT_ARCHITECTURE_AUDIT.md` (Founder/refund/Academy findings marked resolved with accurate history), `PORTAL_ARCHITECTURE_STANDARDIZATION.md` (ADR section now states the Sprint 7 blocked-status explicitly, so the next reader doesn't need to cross-reference two documents to know these are still open), and two design-system reference docs that cited the now-deleted `ReflectionJournalCard.tsx`/stale Garden implementation details.

**Portal readiness for Feature Freeze**: see §7 — **not a "yes," and this sprint doesn't change that verdict.** The 5 blocked items are exactly the items Sprint 4 already identified as freeze-blocking; they remain unresolved, now for a second sprint in a row, by explicit PMO choice rather than by omission.

---

## 2. Content Cleanup Summary

| # | Item | Result |
|---|---|---|
| Founder biography | Duplicated across 2 files | ✅ Single source (`data/portal/founder.ts`) |
| Refund policy self-contradiction | `refund-policy.html` §7 vs. §3 | ✅ Fixed — removed the contradictory "chưa công bố chính thức" qualifier |
| Academy/Workspace content boundary | Assumed unresolved | ✅ Confirmed already correct (pre-existing decision, verified still implemented) |
| `ReflectionJournalCard.tsx` | Confirmed superseded duplicate | ✅ Deleted |
| `UnderstandingNoteCard.tsx` | Investigated, inconclusive | ⚠️ Left in place — real component, no evidence of being dead vs. intentionally-incomplete |
| Stale doc references to deleted Sprint 3 files | 2 design-system reference docs | ✅ Updated to point at current implementations |
| Tool Catalog merge | 3 disconnected catalogs (Sprint 4 finding) | 🚫 BLOCKED — not touched |
| Goal Model merge | 2 disconnected systems (Sprint 4 finding) | 🚫 BLOCKED — not touched |
| Memory Ownership | 2 disconnected systems (Sprint 4 finding) | 🚫 BLOCKED — not touched |
| Admin Ownership | 2 independent admin apps (Sprint 4 finding) | 🚫 BLOCKED — not touched |
| Purchasable Entity (ADR-004) | `orders`' 3-way FK split (Sprint 4 finding) | 🚫 BLOCKED — not touched |

---

## 3. Ownership Updates

**Resolved this sprint:**
- **Founder content**: now unambiguously owned by `src/data/portal/founder.ts`. `FounderSpotlight.tsx` and `CommunityGuides.tsx` are both pure consumers. Adding/changing Founder facts now requires editing exactly one file.

**Confirmed already correct (no ownership change needed):**
- **Academy vs. Workspace content**: Academy owns the *learning/discovery* framing of shared tool data (`AI_TOOLS`); Workspace owns the *execution* framing (`AI Toolbox theo nhiệm vụ`, the "Dùng cùng Companion" action). This is documented, intentional data reuse with distinct roles — the same pattern as `Reflection` being legitimately read by 5 different Journey call sites (per `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §4) — not an ownership conflict.

**Explicitly NOT touched, remains as recorded in Sprint 4 (`PORTAL_ARCHITECTURE_STANDARDIZATION.md` §4, §8):**
- **Tool**: still 3 disconnected catalogs (`data/tools.ts`, `data/admin/tools.ts`, `data/khong-gian-ai/index.ts`).
- **Goal**: still 2 disconnected systems (`goal-runtime.ts` live/localStorage vs. `data/admin/userGoals.ts` unused admin catalog).
- **Memory**: still 2 disconnected systems (`memory_capsules` Supabase table vs. Companion's `growth-view.ts` localStorage activity log).
- **Admin**: still 2 independent apps (`admin.html` legacy vs. `src/app/admin/(dashboard)/`), both still writing to `courses`/`products` with no coordination.
- **Purchasable entity**: `orders.lesson_id`/`product_id`/`course_id` triple-FK split unchanged; `my-products`/`account` still don't join `courses`.

---

## 4. ADR Implementation

**None implemented this sprint.** Per PMO's explicit instruction, ADR-004 (Purchasable Entity), ADR-006 (Tool Catalog), ADR-007 (Admin Ownership), and ADR-008 (Memory Ownership) — plus the unnumbered Goal Model item — remain exactly as recorded in `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §11: **NEEDS DECISION**, not yet made. `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §11 now carries an explicit status note recording this sprint's PMO instruction, so the block is visible in the architecture doc itself, not only in this report.

ADR-001, ADR-002, ADR-003 (Shell frozen, Companion one-directional hub, Reflection single-source) remain RATIFIED and unaffected — nothing this sprint touched the shell, Companion's dependency direction, or the Reflection model.

---

## 5. Files Changed

**New file:**
- `src/data/portal/founder.ts` — Founder single source of truth.

**Modified (8 files):**
- `refund-policy.html` — removed the self-contradicting "chưa công bố chính thức" qualifier in §7.
- `src/components/portal/premium/FounderSpotlight.tsx` — now imports `FOUNDER` from the shared data file instead of declaring its own copy.
- `src/components/portal/community/CommunityGuides.tsx` — same; `GUIDES` array now derives from the shared `FOUNDER`.
- `src/lib/portal/companion/character-memory.ts` — removed a now-dangling file-name reference in a comment (to the deleted `ReflectionJournalCard.tsx`).
- `src/design-system/07-components/README.md` — updated 2 stale component citations to point at the current implementation (`MyStoryBook.tsx`'s `WriteNook`) instead of the deleted file.
- `src/design-system/10-reference/GARDEN_DESIGN_SPEC.md` — added an accuracy note flagging the doc's file list and route path as stale (predates the current `GardenExperience.tsx` implementation and the `/portal/khuvuoncuaban` route rename); did not attempt a full rewrite (out of this sprint's scope).
- `docs/PORTAL_CONTENT_ARCHITECTURE_AUDIT.md` — marked the Founder-duplication, refund-FAQ, and Academy/Workspace findings resolved with accurate history.
- `docs/PORTAL_ARCHITECTURE_STANDARDIZATION.md` — added an explicit Sprint 7 status note to §11 recording the PMO-directed block on ADR-004/006/007/008.

**Deleted (1 file):**
- `src/components/portal/story/ReflectionJournalCard.tsx` — confirmed superseded by `MyStoryBook.tsx`'s own `WriteNook` (that file's own comment states the merge explicitly); was the sole caller of `recordReflectionForCharacterMemory`, which is now unused but was **not** removed (touching `character-memory.ts`'s function surface borders on the blocked Memory Ownership item — left alone deliberately).

**Verified**: `npm run lint` clean (0 errors, 5 pre-existing unrelated `<img>` warnings), `npm run build` succeeds (all routes compile, including `/portal/story` which renders the modified `MyStoryBook.tsx`), `npm run test` 139/139 pass.

---

## 6. Remaining Issues

**Blocked, unchanged from Sprint 4 — the real content of this sprint's constraint:**
1. **ADR-004 — Purchasable Entity.** `orders`' `lesson_id`/`product_id`/`course_id` split remains unresolved. This is still the schema-level cause of the P0 first found in Sprint 2 (confirmed course purchases deliver no content).
2. **ADR-006 — Tool Catalog.** 3 disconnected catalogs remain.
3. **ADR-007 — Admin Ownership.** 2 independent admin apps remain, still both writing to overlapping tables with no coordination.
4. **ADR-008 — Memory Ownership.** 2 disconnected "memory" systems remain (now slightly more visible as a live risk, since `character-memory.ts`'s `recordReflectionForCharacterMemory` lost its only caller this sprint without the function itself being touched — a candidate for the eventual Memory Ownership decision, not acted on now).
5. **Goal Model.** 2 disconnected systems remain; the unused admin-side `UserGoal` catalog was left in place rather than guessed at.
6. **`vdai-academy` vs. `hocvienai`** (ADR-005) — also still open; not explicitly named in Sprint 7's brief but shares root cause with ADR-004 and was equally out of this sprint's authorized scope.

**Newly identified, not blocking:**
7. `UnderstandingNoteCard.tsx` — real, working, currently-unmounted component. Needs a product decision (wire it up, or confirm it's abandoned) rather than a content-cleanup guess.
8. `src/design-system/10-reference/GARDEN_DESIGN_SPEC.md` is meaningfully stale beyond the one citation fixed this sprint (old route name, old component list, likely stale color/copy details too) — flagged for a dedicated documentation-refresh pass, not fixed in full here.

**From prior sprints, still open (unaffected by this sprint):** the full `PORTAL_UI_CONSISTENCY.md` remaining-inconsistencies list (semantic color migration, missing shared form components, spacing/icon-size drift) — none of that is content, so Content Cleanup correctly left it untouched.

---

## 7. Feature Freeze Readiness

**Portal is NOT ready for Sprint 8 — Feature Freeze — and this sprint does not change that verdict from Sprint 4's.**

What Content Cleanup accomplished: the *pure content* layer (Founder bio, refund-policy wording, Academy/Workspace content boundary, one dead component) is now clean, verified, and documented. That work was real and is done.

What remains exactly where Sprint 4 left it: the five architecture-adjacent ownership questions (Purchasable Entity, Admin Ownership, Tool Catalog, Goal Model, Memory Ownership) are **still open Product Owner decisions**, not implementation debt this or any "cleanup" sprint can close by itself. Per `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §12's original Freeze gate list, at minimum ADR-004 (Purchasable Entity) and ADR-007 (Admin Ownership) must be **decided** — even if not fully implemented — before Architecture v1.0 can be declared frozen, because freezing around an unresolved P0 revenue-integrity gap (customers can pay and receive nothing) and an unresolved dual-admin data-corruption risk would lock in exactly the kind of confusion the Freeze is meant to prevent.

**Recommendation for whoever runs Sprint 8**: do not attempt Feature Freeze until a decision-only session (Product Owner + technical lead, not a content or UI sprint) explicitly closes ADR-004 and ADR-007 in writing — Sprint 4 and Sprint 7 have now both indepedently arrived at the same conclusion: these two are the load-bearing blockers, everything else on the open list is real but lower-urgency debt that can be logged and scheduled post-Freeze.
