# CKOS Canonical Architecture Review

**Status: Review only. No code changed. No migration performed. Awaiting
Product Owner approval before Academy resumes.**

## The finding that changes the framing

Before answering the ten questions, one fact has to be stated plainly,
because it changes what "System A vs. System B" actually means:

**System B (`src/features/knowledge/*`) is not a page that duplicates
CKOS — it is the data engine Academy already runs on.** `getAllLearningJourneys()`
(`src/features/academy/services/journey.service.ts:20-22`) calls
`getAllKnowledgeCollections()` directly and maps each `KnowledgeCollection`
1:1 into a `LearningJourney` (its own comment: *"Mỗi Learning Journey
chiếu 1:1 từ 1 CKOS Collection"*). Every stage computation, every
"what to do next" guidance line, every `JourneyCard` on `/portal/hocvienai`
is a projection of System B's data. **Academy has no knowledge data of
its own.** It is a second UI shell wrapped around the same 11 seeds.

So this is not two knowledge bases fighting for the same shelf space.
It's **one knowledge base (features/knowledge), exposed through three
different doors**, one of which is mislabeled:

| Door | Route | What it shows |
|---|---|---|
| Library view | `/portal/hetrithucai` (+ `/collection/[slug]`, `/[slug]`) | Browse collections → seeds directly |
| Journey view | `/portal/hocvienai` (Academy) | Same collections, reframed as staged "journeys" with Companion guidance |
| CKOS hub tile | `ckos/page.tsx` "best_practice" category → `/portal/hetrithucai` | Mislabeled — routes to Lesson-shaped content under a "Best Practice" name, because Best Practice has zero real content of its own |

Meanwhile **System A** (`/portal/tools`, `/portal/prompts`, `/portal/sop`,
`/portal/resources`, `/portal/case-studies`, backed by `src/data/*.ts` +
a few live Supabase tables) covers genuinely different Intelligence
types — Tool, Prompt, Workflow, Resource, Case Study. Their topics
(Affiliate/marketing prompts, content SOPs, downloadable resources)
do not overlap with System B's 11 seeds (general office-productivity
lessons: email, reports, slides, Excel, meetings). **These two are not
duplicates of each other.** The actual collision is narrower than the
Product Owner's report suggested: it is Lesson content wearing two
different UI shells and one false label, not two full CKOS systems.

---

## 1. Which system should become the canonical CKOS?

Neither system "wins" wholesale, because they aren't competing for the
same ground. But for the one place they do collide — **Lesson-type
content** — **`features/knowledge` is canonical.** Reasons:

- It already has the schema CKOS needs (`whatYouWillGain`, `problem`,
  `coreIdea`, `guideSteps`, `prerequisites`, `nextSeeds`, `relatedSeeds`,
  `commonMistakes`, `reflectionQuestions`, `companionNote`) — the exact
  fields Phase 5's content pass had to bolt onto System A's thin seeds
  by hand, field by field.
- Academy is already built on it in production. Declaring System A
  canonical for Lesson content would mean either breaking Academy or
  maintaining two parallel Lesson datasets forever — both worse than
  today.
- It is ~5.7x more code (6,837 vs. ~1,204 lines) and 3 route levels
  deep (hub → collection → seed) vs. System A's flatter, thinner pages.
  Rebuilding that in System A's shape is strictly more work than fixing
  System A's mislabeled pointer to it.

System A remains canonical for everything it already owns and
System B has never touched: Tool, Prompt, Workflow, Resource, Case
Study. Nothing here recommends folding those into `features/knowledge`.

## 2. What knowledge exists only in System A?

- Tool intelligence: `src/data/admin/tools.ts` (ChatGPT entry, real
  Supabase `tools` table).
- Prompt intelligence: 12 Affiliate/marketing/SEO prompts (`src/data/prompts.ts`),
  each now with real `whenToUse`/`nextStep` (Phase 5).
- Workflow (SOP) intelligence: 4 operational SOPs with real steps
  (`src/data/sop.ts`).
- Resource intelligence: 10 downloadable resources with real
  `whenToUse` (`src/data/resources.ts`).
- Case Study intelligence: the live `case_studies` table + page (0 rows
  today, but the only real plumbing for this type).

None of this exists anywhere in `features/knowledge`. This is the
majority of CKOS's actual "7 Intelligence types" promise.

## 3. What knowledge exists only in System B?

- The 11 rich Lesson seeds themselves (email/reports/slides/PDF/Excel/
  meetings/time-management/FAQ/prompt-writing/office-automation),
  each with the full 14-part content standard.
- The entire Academy Journey computation: stage derivation
  (`stageFromPercent`), progress tracking, "what's next" guidance,
  `isJourneyMarkedReady` readiness flags.
- The taxonomy layer (skills/aiTools/scenarios links) that the type
  system supports, even where not yet fully populated.

If System B disappeared, Academy disappears with it — there is no
fallback data path.

## 4. What would be lost if System A were removed?

Every Tool, Prompt, Workflow, Resource, and Case Study page in the
Portal — five of the seven Intelligence types, all real (if thin)
content, all just strengthened in Phase 5. This is not a redundant
system to prune; it is most of CKOS's actual coverage.

## 5. What would be lost if System B were removed?

Academy itself (its entire data layer, not just a page), the 11 real
Lesson seeds and their rich fields, and the only working example in
the codebase of the full 14-part Companion content standard. This
would be the more destructive removal by a wide margin — it cascades
into a second pillar (Academy), not just CKOS.

## 6. Can both systems coexist?

**Yes — once correctly labeled.** They aren't actually fighting over
the same content; System A never modeled Lesson content and System B
never modeled Tool/Prompt/Workflow/Resource/Case Study content. The
"cannot continue" problem is specifically: (a) the CKOS hub's "Lesson"
card points at Academy (a different pillar's UI, not a CKOS browsing
page) while a "Best Practice" card points at the same underlying Lesson
data under the wrong name, and (b) a visitor who has been through
Academy's journey framing and then clicks into `/portal/hetrithucai`
directly sees the identical 11 seeds presented in a second, disconnected
UI paradigm with no link between the two views. That's confusing, not
architecturally broken.

## 7. What migration strategy do you recommend?

No data migration is needed — both datasets are real and neither is
redundant with the other. The work is **relabeling and cross-linking**,
not merging:

1. Retire "Best Practice" as its own CKOS hub category card pointing to
   `/portal/hetrithucai` under a false name. Best Practice has zero
   real content anywhere (per Phase 5's audit) — the category should
   say so honestly (empty state) rather than borrow Lesson content to
   look populated.
2. Point the CKOS hub's "Lesson" card at `/portal/hetrithucai` (the
   actual library-browsing experience for Lesson content) instead of
   `/portal/hocvienai`. Academy is a different pillar with a different
   purpose (guided, staged journeys with Companion pacing) — it
   shouldn't also be the CKOS hub's literal answer to "what is a Lesson."
3. Add a visible link from `/portal/hetrithucai`'s collection/seed views
   back to the matching Academy journey (and vice versa), so a user
   moving between "browse the knowledge" and "follow the guided
   journey" experiences it as one system with two modes, not two
   accidental copies.
4. No changes to System A at all — it is not part of this collision.

This is a content-routing and cross-linking fix, sized in hours, not a
data migration, sized in days.

## 8. What implementation risks exist?

- **Academy regression risk**: any refactor of `features/knowledge`'s
  public functions (`getAllKnowledgeCollections`, `computeCollectionProgress`,
  etc.) directly risks breaking Academy, since it has no other data
  source. Changes there need Academy smoke-tested every time, not just
  `/portal/hetrithucai`.
- **Silent link rot**: repointing the "Lesson" category card changes a
  URL a user or bookmark may already rely on — low risk pre-launch, but
  worth a redirect if `/portal/hocvienai` was ever the two categories'
  advertised entry point externally.
- **Honesty regression**: removing the "Best Practice" card's borrowed
  content without replacing it with a genuine honest-empty-state risks
  reverting to the "just say no data" pattern Phase 5 explicitly moved
  away from elsewhere in CKOS.

## 9. Which routes survive? Which disappear?

**Survive, unchanged:**
`/portal/tools`, `/portal/tools/[id]`, `/portal/prompts`, `/portal/prompts/[id]`,
`/portal/sop`, `/portal/resources`, `/portal/resources/[id]`,
`/portal/case-studies`, `/portal/hocvienai`, `/portal/hetrithucai`,
`/portal/hetrithucai/collection/[slug]`, `/portal/hetrithucai/[slug]`.

**Nothing disappears.** No route in either system is redundant enough
to delete — System A's routes each own a distinct Intelligence type,
and System B's routes are Academy's only data path. What changes is
only which CKOS hub category card points to which route, plus new
cross-links between `/portal/hetrithucai` and `/portal/hocvienai`.

## 10. What is the final CKOS architecture?

Seven Intelligence types, five owned by System A and one (Lesson) owned
by System B, with Best Practice honestly empty until real content
exists:

- **Tool** → `/portal/tools` (System A)
- **Prompt** → `/portal/prompts` (System A)
- **Workflow** → `/portal/sop` (System A)
- **Resource** → `/portal/resources` (System A)
- **Lesson** → `/portal/hetrithucai` (System B — canonical for this type)
- **Best Practice** → honest empty state on the CKOS hub itself, no
  borrowed route, until `ckos_best_practices` has real rows
- **Case Study** → `/portal/case-studies` (System A)

Academy (`/portal/hocvienai`) is not a CKOS route at all — it is a
separate pillar that *consumes* Lesson data from `features/knowledge`
and re-presents it as a guided, staged journey. It should be understood
and documented as Academy's data dependency on CKOS, not as a second
CKOS. This matches the pillar boundary already defined in
`PORTAL_DNA.md`: CKOS is where you browse and connect knowledge;
Academy is where that same knowledge becomes a staged practice with
Companion pacing. One knowledge base, two legitimate pillar experiences
built on top of it — not two knowledge bases.
