# CKOS Knowledge Object Architecture

**Status: Canonical contract. No implementation in this document —
Academy (and every remaining pillar) must be built against this
contract, not around it.**

This document follows directly from `CKOS_CANONICAL_ARCHITECTURE.md`
(approved). That review established: there is one knowledge source,
not two; Academy is a consumer of CKOS, not a second CKOS. This
document defines, for each of the 7 knowledge types, who owns it, how
it's born and retired, and exactly which pillars are allowed to read
it and how — so every future pillar implementation has one contract to
build against instead of inventing its own reading of "CKOS."

---

## How to read the per-type sections

Each type answers the same six questions, in the same order, so the
document can be scanned as a table if needed:

1. **Owner** — which system/table is the single source of truth.
2. **Lifecycle** — how an object is created, updated, and retired.
3. **Direct consumers today** — what actually reads it in production now.
4. **Consumption contract** — for each of the 6 other pillars
   (Academy/Journey/Workspace/Projects/Premium/Companion), can it
   consume this type, and if yes, how (read-only reference? primary
   data source? Companion-only citation?).
5. **Relationships** — which other knowledge types this one legitimately
   links to (per `RelatedKnowledgePanel`'s 7 slots), and whether that
   relationship data is real today or still an honest empty slot.
6. **Current honesty state** — real rows / thin / zero, so no pillar
   builds a feature assuming data that doesn't exist yet.

---

## 1. Tool

1. **Owner**: `src/data/admin/tools.ts` (`toolsAdminSeed`) is the
   fallback; the live Supabase `tools` table (via Admin CRUD) is the
   write path when configured. CKOS hub page (`/portal/ckos`) and
   `/portal/tools` read whichever is live.
2. **Lifecycle**: created/edited via Admin (`status: Draft|Published|Hidden`);
   a Tool is retired by setting `status: Hidden`, never by deletion —
   consistent with the Portal's archive-over-delete rule.
3. **Direct consumers today**: `/portal/tools`, `/portal/tools/[id]`,
   CKOS hub's featured-tool card, `RelatedKnowledgePanel` (via
   `tool.relatedPromptId`/`relatedResourceHref`).
4. **Consumption contract**:
   - Academy: **yes, reference-only** — "Học AI theo công cụ" section
     already links out to Tool pages as a discovery path; Academy does
     not own or duplicate Tool data.
   - Journey: **no direct consumption** — Journey reflects on activity,
     not on the knowledge catalog itself.
   - Workspace: **yes, primary input** — a Workspace session should be
     able to start "from a Tool" (already the case via `startCompanionWorkspace`
     origins); Workspace treats Tool as a launch context, not content
     to display verbatim.
   - Projects: **no** — Tool is not decision-relevant to
     investment/opportunity readiness.
   - Premium: **no** — Premium's own product catalog (`products` table)
     is separate and must not be confused with Tool.
   - Companion: **yes, citation-only** — Companion may reference "the
     tool you just viewed" but must not describe Tool content itself
     (that's the Tool page's job).
5. **Relationships**: Tool → Prompt (real, `relatedPromptId`), Tool →
   Resource (real, `relatedResourceHref`), Tool → Workflow/Lesson/Best
   Practice/Case Study (honest empty slots — no data yet).
6. **Honesty state**: 1 real row (ChatGPT). Thin but real.

## 2. Prompt

1. **Owner**: `src/data/prompts.ts` (12 entries, enriched with
   `whenToUse`/`nextStep` in Phase 5) is canonical for the curated set;
   live Supabase `prompt_templates` table is a secondary, Admin-managed
   stream shown above it on `/portal/prompts`.
2. **Lifecycle**: curated Prompts are content-authored (this file);
   live Prompts follow the same Admin `active` flag pattern as Tool.
   Retiring a curated Prompt means removing it from the file — since
   these are hand-authored editorial objects, not user data, deletion
   here is acceptable (archive-over-delete governs *user-generated or
   historical* content, not editorial copy revision).
3. **Direct consumers today**: `/portal/prompts`, `/portal/prompts/[id]`,
   Tool detail page (via `relatedPromptId`).
4. **Consumption contract**:
   - Academy: **yes, reference-only** — a Journey stage may point at a
     relevant Prompt as practice material, same pattern as Tool.
   - Journey: **no direct consumption.**
   - Workspace: **yes, primary input** — Prompt's `preview` text is
     literally meant to be copied into a live Workspace session; this
     is Prompt's main functional purpose.
   - Projects: **no.**
   - Premium: **no.**
   - Companion: **yes, citation-only** — may say "try the prompt you
     just read," never fabricate a new prompt inline pretending it's
     from the library.
5. **Relationships**: Prompt → Prompt (real — Phase 5 chained
   `nextStep` across the 12 entries), Prompt → Tool (real, inverse of
   Tool's relation), all other slots honest-empty.
6. **Honesty state**: 12 real, now-substantive entries. No longer thin
   after Phase 5.

## 3. Workflow (SOP)

1. **Owner**: `src/data/sop.ts` (4 entries, enriched with `steps`/`whenToUse`
   in Phase 5). No live Supabase table exists for this type today —
   `ckos_workflows` was designed in Phase H but never deployed.
2. **Lifecycle**: editorial, same authoring pattern as Prompt. No
   detail route exists yet (`/portal/sop/[id]`) — each SOP is currently
   only viewable as a full card on the list page.
3. **Direct consumers today**: `/portal/sop` only.
4. **Consumption contract**:
   - Academy: **yes, reference-only** — a Journey's "Áp dụng" stage is
     a natural place to point at a matching Workflow.
   - Journey: **no direct consumption.**
   - Workspace: **yes, primary input** — a Workflow's steps are meant
     to be followed inside a Workspace session; this is Workflow's
     reason to exist.
   - Projects: **no.**
   - Premium: **no.**
   - Companion: **yes, citation-only.**
5. **Relationships**: currently all honest-empty — no Workflow↔Tool or
   Workflow↔Prompt links exist yet in data, even though conceptually
   they should (e.g. "SOP sản xuất content hàng ngày" should link to
   the Prompt "Lên kế hoạch content 30 ngày"). Flagged as a real content
   gap, not fabricated in this document.
6. **Honesty state**: 4 real entries, thin volume, zero cross-links.
   Weakest-covered type after Best Practice.

## 4. Lesson

1. **Owner**: `src/features/knowledge/*` (`KnowledgeCollection` →
   `KnowledgeSeed`, 11 seeds across 2 collections). **Canonical per the
   approved architecture review** — this is the single source for
   Lesson-type content, full stop.
2. **Lifecycle**: seed/collection objects are code-authored (`knowledge-seed-journeys.ts`),
   versioned like any other source file; a seed's *progress* (per-user
   completion) is tracked separately and is not part of the knowledge
   object itself — the object stays constant, only its consumption
   state changes per user.
3. **Direct consumers today**: `/portal/hetrithucai`,
   `/portal/hetrithucai/collection/[slug]`, `/portal/hetrithucai/[slug]`,
   and — critically — **all of Academy** via `journey.service.ts`.
4. **Consumption contract**:
   - Academy: **yes, primary data source** — this is the relationship
     established by the canonical review. Academy has no independent
     Lesson data; it re-presents `features/knowledge` as staged
     journeys.
   - Journey: **yes, reflection-only** — Journey's reflection prompts
     may reference "a Lesson you completed," reading progress state,
     never re-authoring Lesson content.
   - Workspace: **yes, reference-only** — "resume the Lesson you were
     mid-way through" as a session-start context.
   - Projects: **yes, reference-only** — Phase 4's readiness guidance
     already links an unready Projects visitor toward Academy/Lesson
     content; this is the sanctioned direction (Projects reads
     Lesson-derived readiness, never the reverse).
   - Premium: **no direct read** — Premium's value proposition can
     *describe* that Lessons exist, but must not duplicate seed content
     in Premium's own copy.
   - Companion: **yes, citation-only**, same rule as all other types —
     reference, don't restate.
5. **Relationships**: `prerequisites`/`nextSeeds`/`relatedSeeds` fields
   already exist on `KnowledgeSeed` — real, structured relationships,
   the most complete relationship model of any type. Cross-links to
   Tool/Prompt/Workflow are not yet wired (an honest gap, not a
   fabrication) even though the schema could support them.
6. **Honesty state**: 11 real, rich entries — the deepest single-type
   content in CKOS, and the only type with a working prerequisite
   graph.

## 5. Resource

1. **Owner**: `src/data/resources.ts` (10 entries, enriched with
   `whenToUse` in Phase 5) for the curated library; live Supabase
   `documents` table for Admin-managed downloadable docs, shown above
   it on `/portal/resources`.
2. **Lifecycle**: same editorial-file pattern as Prompt/Workflow for
   the curated set; `documents` follows Admin `active` flag lifecycle.
3. **Direct consumers today**: `/portal/resources`, `/portal/resources/[id]`,
   Tool detail page (via `relatedResourceHref`).
4. **Consumption contract**:
   - Academy: **yes, reference-only.**
   - Journey: **no.**
   - Workspace: **yes, reference-only** — a downloadable template can
     seed a Workspace session's starting draft.
   - Projects: **yes, reference-only** — a Resource like a checklist
     can be pointed to from a Projects readiness gap, same pattern as
     Lesson.
   - Premium: **no** — Premium's own paid materials are a distinct
     product-tier concept, not a Resource-type object.
   - Companion: **yes, citation-only.**
5. **Relationships**: Resource → Tool (real, inverse of Tool's
   relation); all others honest-empty.
6. **Honesty state**: 10 real entries, now substantive after Phase 5.

## 6. Case Study

1. **Owner**: live Supabase `case_studies` table exclusively — no
   static fallback file exists, and none should be created (a Case
   Study is by definition a real, attributable outcome; a hand-authored
   fallback would violate the "no invented data" rule at its core).
2. **Lifecycle**: created only when a real result exists AND the
   person involved has consented to publication (this constraint is
   now stated in the page's own empty-state copy, Phase 5). Retired via
   `active: false`, never deleted, per archive-over-delete.
3. **Direct consumers today**: `/portal/case-studies` only.
4. **Consumption contract**:
   - Academy: **yes, reference-only**, once real rows exist — "see how
     someone else applied this Lesson" is a legitimate Academy pointer.
   - Journey: **no.**
   - Workspace: **no** — Case Study is read-only proof, not a session
     input.
   - Projects: **yes, primary decision input** — this is Case Study's
     most important consumer relationship: Projects' readiness
     checklist explicitly wants "what practical problem does this
     solve, does it actually work" evidence, which is exactly what a
     Case Study is for.
   - Premium: **yes, reference-only** — a Case Study can support "why
     this program works" without Premium fabricating its own proof
     points.
   - Companion: **yes, citation-only.**
5. **Relationships**: Case Study → Tool/Lesson/Workflow (should exist
   once populated — a Case Study is fundamentally "these knowledge
   objects, applied, with this result") — currently honest-empty
   because there is no data at all yet.
6. **Honesty state**: **zero real rows.** This is CKOS's most
   underbuilt type by volume, though its empty state (Phase 5) is
   honest about why.

## 7. Best Practice

1. **Owner**: intended to be a live Supabase `ckos_best_practices`
   table — designed in Phase H, **never deployed to production.** No
   file-based fallback exists or should be created for the same reason
   as Case Study: a "Best Practice" claims someone verified this is the
   right way to do something, which cannot be honestly hand-waved.
2. **Lifecycle**: not yet defined in practice — blocked entirely on the
   schema being deployed. This document does not authorize deploying
   it; that remains a separate decision.
3. **Direct consumers today**: **none** — per the approved canonical
   review, the CKOS hub's former "Best Practice" category card
   borrowed Lesson content from `/portal/hetrithucai` under this name;
   that mislabeling is what the canonical review flagged for
   correction, not a real consumer relationship.
4. **Consumption contract**: **not applicable until real data exists.**
   No pillar should be built assuming Best Practice content is
   available. Once populated, its contract will most resemble Lesson's
   (Academy/Workspace/Projects reference-only, Companion citation-only)
   because a Best Practice is conceptually "a validated technique,"
   adjacent to a Lesson's "how to learn a technique."
5. **Relationships**: none possible yet — all seven slots are honest-empty
   by necessity, not by choice.
6. **Honesty state**: **zero rows, zero schema deployed.** The CKOS hub
   must show this type's honest-empty state rather than route
   elsewhere, per the canonical review's recommendation.

---

## The Knowledge Object Consumption Matrix

| Type | Academy | Journey | Workspace | Projects | Premium | Companion |
|---|---|---|---|---|---|---|
| Tool | reference | — | **primary** | — | — | citation |
| Prompt | reference | — | **primary** | — | — | citation |
| Workflow | reference | — | **primary** | — | — | citation |
| Lesson | **primary** | reflection | reference | reference | — | citation |
| Resource | reference | — | reference | reference | — | citation |
| Case Study | reference* | — | — | **primary** | reference* | citation |
| Best Practice | n/a* | n/a* | n/a* | n/a* | n/a* | n/a* |

`*` = contract defined now, not yet exercised because no real data
exists (Case Study) or no schema exists (Best Practice). "—" means the
type is deliberately out of scope for that pillar — not a gap, a
boundary.

**Reading the matrix**: no knowledge type has more than one "primary"
consumer. This is intentional — it's what keeps Academy a consumer
rather than a second CKOS. Every other relationship is "reference" (link
to the canonical page, don't duplicate its content) or "citation"
(Companion may mention it exists, never restate its content as if
Companion authored it).

---

## The Final Knowledge Flow

```
Knowledge          CKOS holds the 7 types above — the raw material.
     ↓
Learning           Academy consumes Lesson (primary) plus Tool/Prompt/
                   Workflow/Resource (reference) to stage a Journey.
     ↓
Practice           Workspace consumes Tool/Prompt/Workflow (primary) —
                   knowledge becomes a real Output, not a read page.
     ↓
Reflection         Journey looks back at what Practice produced —
                   it does not re-read CKOS directly, it reflects on
                   the real activity Practice generated.
     ↓
Opportunity        Projects consumes Case Study (primary) plus Lesson/
                   Resource (reference) to gate real-world decisions —
                   readiness is judged against real evidence, not hope.
     ↓
Growth             Premium and Journey's growth view close the loop:
                   Premium references Case Study/Lesson to justify the
                   next stage of commitment; Journey's real activity
                   history is the only "growth" measurement anywhere
                   in the product.
```

Companion sits beside every step of this flow, not inside it — at each
arrow, Companion may cite what just happened, but the flow itself runs
on real knowledge objects and real user activity, never on anything
Companion invents. This is the same discipline `PORTAL_DNA.md` names as
the product's core differentiator, now made into an explicit contract:
**knowledge flows one direction, gets consumed by exactly one primary
pillar at a time, and Companion only ever talks about what already
happened in that flow.**

---

## What this authorizes and what it doesn't

This document authorizes future pillar work (starting with Academy) to
be built strictly against the ownership/consumption contract above —
e.g., Academy may keep treating Lesson as primary, may add
reference-only links to Tool/Prompt/Workflow/Resource, but must not
grow its own parallel Lesson data, and must not silently start
"primary"-consuming a type contracted to another pillar (e.g. Academy
must not become a second primary consumer of Case Study — that stays
Projects').

It does **not** authorize: deploying `ckos_best_practices`, writing
Case Study fallback data, building the Workflow↔Prompt/Tool
relationship data (flagged as a gap, not solved here), or any UI
implementation. Those are separate, future decisions.
