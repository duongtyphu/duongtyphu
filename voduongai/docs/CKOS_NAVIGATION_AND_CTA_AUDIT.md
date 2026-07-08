# CKOS Navigation + CTA + User Flow Audit

**Status: Product audit, findings fixed where fixable. Read as a Product
Owner opening CKOS cold, not as the person who built it.**

Scope: every CKOS page (Overview/hub, Tool, Prompt, Workflow, Lesson,
Resource, Case Study, Best Practice), every internal link, every CTA,
every Companion message, every empty state.

---

## 1. Navigation problems

- **Hero CTA "Tìm trong CKOS" doesn't scroll to the search box.** It
  jumps to the category grid (`#danh-muc-tri-thuc`) instead of the
  actual `#search` section. **Not fixed** — this is intentional, per an
  explicit prior Product Owner directive ("nút 1 chạy thẳng xuống Danh
  mục tri thức"). Flagging it here so it's on record as a deliberate
  choice, not an oversight, in case it's reconsidered later.
- Every other link on the CKOS hub resolves to a real route:
  `/portal/tools`, `/portal/prompts`, `/portal/sop`, `/portal/resources`,
  `/portal/hetrithucai`, `/portal/case-studies`, `/portal/hocvienai`,
  `/portal/duan-cohoi`, `/portal/companion` — all verified to exist.
- No legacy routes, no duplicate routes, no wrong slugs found anywhere
  in the CKOS surface.

## 2. CTA problems — fixed

- **Tool hub's Companion message recommended ChatGPT specifically, but
  its button led to a generic "learning roadmap" page, not ChatGPT.**
  Fixed: the button now goes straight to `/portal/tools/chatgpt`,
  matching what the sentence right above it actually tells the user to
  do.
- **Every category card on the CKOS hub said only "Xem" ("View"),
  regardless of type** — no hint of destination, identical wording on
  the Tool card and the Case Study card. Fixed: each button now reads
  "Xem {loại tri thức} →" (e.g. "Xem Công cụ AI →", "Xem Case Study →").
- **Quick Search's own caption oversold/undersold its real behavior** —
  it claimed to search titles only, but the endpoint already matches
  descriptions/summaries too. Fixed the caption to say what it actually
  does.

## 3. Weak/wrong relationships

- Tool → Prompt/Resource cross-links (ChatGPT → prompt `p3` → resource
  `r1`) verified real and correct.
- All SOP → Prompt links (`p3`, `p10`, `p2`) verified real; the 4th SOP
  correctly has no forced link where none is genuine.
- **Workflow search results all resolve to the same `/portal/sop` URL**
  regardless of which of the 4 SOPs matched — there's no per-SOP detail
  route to deep-link to. **Deferred** — building individual SOP detail
  pages is a real scope increase (new route + content per item), not a
  navigation bug to patch in an audit pass.
- **Best Practice/Goal search results would resolve to `/portal/ckos`
  itself** if those Supabase tables ever got real rows — currently
  unreachable since both tables are empty. **Deferred** — this needs to
  be revisited at the moment `ckos_best_practices`/`ckos_goals` are
  actually seeded, not before.
- The Tool page's `RelatedKnowledgePanel` only ever fills 2 of 7 slots
  (Prompt, Resource) for the one real Tool — the other 5 slots show
  their honest empty state. This is correct behavior per the component's
  own design (no fabricated relations), not a bug.

## 4. Confusing flows

- The Prompt list page mixes 3 sources (live Supabase prompts,
  Admin-managed prompts, static curated prompts) that look like a single
  undifferentiated list. On closer inspection each section does have its
  own heading (`AdminPromptsSection` renders its own "Prompt từ Admin"
  title internally) — this is less confusing in the actual rendered page
  than it first appeared from source alone, so **no change made** beyond
  what's listed below. Only the static "Prompt mẫu" section links to a
  detail page with when-to-use/when-not-to-use guidance; the other two
  are copy-only. This asymmetry is real but out of scope to resolve
  today (would mean building detail pages for admin/live prompts too).

## 5. Dead ends — fixed

Four pages ended immediately after their content grid with no
forward-moving link at the page level (individual item links existed,
but the page itself offered nothing once you'd seen everything in the
grid):

- **Prompt list page** — added a Companion line + a 3-step "what's
  next" strip (Workspace, Workflow, back to CKOS).
- **Resource list page** — added a Companion line + a 3-step strip
  (Workspace, Prompt, back to CKOS).
- **Workflow (SOP) list page** — added a Companion line + a 3-step
  strip (Workspace, Prompt, back to CKOS). Individual SOP cards already
  had their own onward links; this fixes the page-level dead end.
- **Case Study list page (populated state)** — added a 3-step strip
  (Lesson, Workspace, Companion) that only renders when there are real
  case studies to have just read.

## 6. Weak Companion guidance

- Companion coverage across CKOS sub-pages was thin: only the CKOS hub
  and the Tool list page had a `CompanionGuide`/`CompanionMemoryLine`
  before this pass. Prompt, Workflow, Resource, and Case Study pages had
  none. Fixed by adding one Companion line to each of the four
  previously-silent list pages (see Dead ends above) — each line is
  short, points to exactly one next step, and never tells the user to
  "read everything."
- No verbatim-repeated Companion message found between any two CKOS
  pages — every message uses different wording even where two pages
  cover related ground.
- The Lesson pillar (Thư viện AI and its sub-pages) uses a different
  companion-shaped component family (`CompanionDiscovery`, inline
  Companion notes inside `KnowledgeWorkspace`/`KnowledgeCollectionView`)
  rather than `CompanionGuide` — functionally present, just a different
  component lineage than the rest of CKOS. Noted, not changed — this
  reflects the Lesson pillar's own established pattern from earlier
  Knowledge Workspace work, not a gap.

## 7. Pages that still feel unfinished

- **Case Study** — 0 real rows (confirmed, Supabase table empty). The
  empty state is honest and well-written; this is the best-handled
  "unfinished" page in CKOS precisely because it doesn't pretend to be
  finished.
- **Best Practice** — no route, no data. The CKOS hub's inline
  explanation is honest and redirects to the closest real alternative
  (Case Study, Companion). Same verdict: correctly unfinished, not
  badly finished.

Both are intentionally incomplete per the frozen
`CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md` contract — they wait on real
production data, not on more UI work.

## 8. Production readiness score

| Page | Status |
|---|---|
| CKOS Overview/hub | Production-ready |
| Tool (list + detail) | Production-ready |
| Prompt (list + detail) | Production-ready |
| Workflow/SOP (list) | Production-ready |
| Lesson / Thư viện AI (all 3 routes) | Production-ready |
| Resource (list + detail) | Production-ready |
| Case Study | Honestly incomplete (blocked on real data) |
| Best Practice | Honestly incomplete (blocked on schema + real data) |

**5 of 7 knowledge types are fully production-ready. The remaining 2 are
correctly, honestly incomplete rather than badly built — no further UI
work will fix them; only real content/data will.**

## 9. Everything fixed in this pass

- Tool hub Companion CTA now points to the tool it recommends (ChatGPT),
  not a generic roadmap page.
- All 7 category buttons on the CKOS hub now name their destination
  instead of a bare "Xem".
- Quick Search's help caption now accurately describes what it searches.
- Added a Companion line + a "what's next" strip to the Prompt, Resource,
  and Workflow list pages, and a conditional one to the populated Case
  Study state — closing 4 real page-level dead ends.

## 10. Intentionally deferred

- Hero "Tìm trong CKOS" scrolling to the category grid instead of the
  search box — deliberate per prior Product Owner instruction, left as-is.
- Per-SOP detail routes (would resolve the "all Workflow search results
  point to the same URL" issue) — a real scope increase, not a
  navigation bug.
- Best Practice/Goal search results resolving to the CKOS hub itself —
  currently unreachable (no rows exist); revisit only once those tables
  are actually seeded.
- The 3-source Prompt list page's asymmetric depth (only the static
  section has detail pages) — would require building detail pages for
  admin-managed and live prompts, a content/scope decision beyond this
  audit's remit.
