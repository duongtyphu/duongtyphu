# PORTAL 4.0 — IMP-SPR-004
## Portal Architecture Standardization

**STATUS: AUDIT & ANALYSIS ONLY. No code was changed to produce this document, per the brief's explicit "Chỉ phân tích. Không sửa." instruction. This report is submitted for PMO review — no architecture change, merge, or decision recorded here is final until approved.**

This report grounds every claim in actual code (file:line citations), not in aspirational product-vision documents. Where earlier docs (`THE_PORTAL_ARCHITECTURE_FREEZE.md`, `PORTAL_DESIGN_SYSTEM.md`, `PORTAL_3_0_DESIGN_SYSTEM.md`, `PORTAL_COMPONENT_LIBRARY.md`) already established a fact, this report cites and reuses it rather than re-deriving it. Findings from the three prior QA sprints (`PORTAL_NAVIGATION_AUDIT.md`, `PORTAL_CTA_USER_FLOW_AUDIT.md`, `PORTAL_CONTENT_ARCHITECTURE_AUDIT.md`) are incorporated and, in several places, **root-caused at the schema/dependency level for the first time in this sprint**.

---

## 1. Executive Summary

The Portal's **shell and navigation layer is genuinely frozen and healthy** — one layout, one sidebar source, no circular module dependencies, Companion behaves as a clean one-directional hub. The **content and CTA layer is honest but structurally incomplete** (scored 6/10 and 5.5/10 in prior sprints, unchanged by this audit). What this sprint adds is a **data-ownership and admin layer that is meaningfully fragmented**: three unreconciled "Tool" catalogs, two disconnected "Goal" models, two disconnected "Memory" systems, two independent Admin apps writing to overlapping Supabase tables, and — the single most consequential finding — a `orders` table with three parallel foreign keys (`lesson_id`/`product_id`/`course_id`) pointing at three tables that were never fully reconciled, which is the exact schema-level mechanism behind Sprint 2's P0 finding ("a confirmed course purchase delivers no content").

A second major finding: `/portal/vdai-academy` is a real, Supabase-backed, actively-linked (9 files) commerce surface — separate from `/portal/hocvienai` (Academy) and separate from `/portal/premium` — that does not appear in the sidebar at all. It has its own checkout logic against a `lessons` table that neither Premium's `courses`-based flow nor `my-products`' rendering logic fully agree on.

**Bottom line**: the Portal is not ready for Architecture Freeze yet. The shell/navigation foundation is solid enough to freeze today; the data-ownership layer is not — freezing it now would lock in three-way duplication that gets more expensive to unwind with every subsequent sprint. See §12 (Architecture Freeze Recommendation) for the specific gate list.

---

## 2. Current Architecture

### 2.1 Shell (frozen, verified healthy)

Per `THE_PORTAL_ARCHITECTURE_FREEZE.md` §II and reconfirmed by this sprint's dependency-graph research: a single `src/app/portal/layout.tsx` renders `PortalShell`, which composes `PortalHeader`, `PortalSidebar` (desktop) / mobile drawer (`variant="mobile"`, same component), `<main>{children}</main>`, `NotificationTicker`, `FirstFootprintCeremony`, `OnboardingJourney`, and a globally-injected `CompanionPresence`. No platform directory has its own `layout.tsx` (verified: only one `layout.tsx` exists under `src/app/portal/`). No platform overrides or wraps the shell.

**One drift found**: the Freeze doc's own "Trạng thái hiện tại (2026-06-30)" table (§VIII) still describes the sidebar as "6 Gem Hub items" sourced from a `portalHubs` array. The actual live sidebar source is `portalNavSections` in the same file (`src/lib/portal/hubs.ts`), which has **8 primary items + 2 secondary items = 10 total** — matching Sprint 1's independently-confirmed count. `portalHubs` (2 entries: `home`, `journey`) is a **separate, mostly-vestigial data structure** in the same file, now used only to feed Journey Hub's door-module list, not the sidebar. The Freeze doc's own audit table is stale on this one point. (Architecture Drift #1, §8.)

### 2.2 Nine platforms + duplicate/orphan surfaces

The sidebar (`portalNavSections`) exposes exactly 9 canonical platforms: Home, Companion, CKOS, Academy, AI Workspace, Projects & Opportunities, Premium, Journey, Community. Alongside these, `src/app/portal/` contains **47 total route directories** — the remainder are either real sub-pages of the 9 platforms, legitimate standalone utility pages (`checkout`, `account`, `goals`, `saved`), already-archived redirect stubs (`hanh-trinh-cua-toi`, `student-success`, `updates` — confirmed healthy in Sprint 1), or **live, undecided duplicates**:

- **`/portal/vdai-academy`** (178 lines, real Supabase `lessons` query + `getPurchasedIds` + `CheckoutButton`) — a substantial, real commerce page, linked from 9 files (`AcademyTeaser.tsx`, `RoadmapInteractive.tsx`, admin `course-pricing/actions.ts`, `sitemap.ts`, `account/page.tsx`, `tools/[id]/page.tsx`, `portalBuilder.ts`, `blog.ts`, `ai-workspace.ts`) but **absent from the sidebar entirely**. Its own code comment calls it "Academy Reset" — a deliberate product decision to strip old LMS UI but keep real checkout — yet nothing in the codebase declares its relationship to `/portal/hocvienai` (Academy, the sidebar's actual "Academy" destination, which per this sprint's ownership research **does not read the `courses`/`lessons` tables at all** and instead wraps CKOS knowledge collections as "Learning Journeys"). Two pages both plausibly named "Academy," doing structurally different things, one invisible in navigation. **(Architecture Drift #2, §8 — this sprint's single highest-leverage finding.)**
- **`/portal/ai-academy`, `/portal/personal-brand`** — 9-10 line redirect stubs to `/portal/hocvienai`, correctly de-linked internally per Sprint 1's fix. Healthy as-is.
- **`/portal/ai-assistant`** — a real, 33-line, functioning page that is a near-duplicate of `/portal/companion`'s purpose (same Companion-opening copy library, same "not a tool, a companion" framing), already flagged in Sprint 1 as needing a Product Owner merge decision. Unresolved.
- **`/portal/digital-assets`** — confirmed deprecated-in-place per its own code comment (Sprint 1 §7); not yet formally archived with a redirect the way `hanh-trinh-cua-toi`/`student-success`/`updates` were.

### 2.3 Admin — two independent systems

Two entirely separate admin applications exist and are **not reconciled**:
1. **`/home/user/duongtyphu/admin.html`** — a legacy, ~150KB static single-page app at the repo root (sibling to `index.html`, outside `voduongai/`), talking directly to Supabase from the browser. Manages `courses`, `lessons`, `blog_posts`, `case_studies`, `coupons`, `course_schedules`, `documents`, `experts`, `leads`, `members`, `notifications`, `orders`, `pdfs`, `products`, `prompt_templates`, `referrals`, `submissions`, `support_tickets`.
2. **`voduongai/src/app/admin/(dashboard)/`** — a real, modern Next.js admin app with ~30 sections (tools, prompts, resources, roadmap, daily-missions, portal-builder, affiliate-hub, digital-assets, premium, coupons, orders, leads, users, support, community, course-pricing, etc.), gated by `requireAdmin`/`requireMember` (`src/lib/admin/requireAdmin.ts`).

These two use **different table-naming conventions for overlapping concepts** (`admin.html`'s `prompt_templates` vs. the Next.js admin's Supabase-backed `prompts` collection; `admin.html`'s `case_studies` vs. the app's own `case_studies` reuse) and **both write to the same `courses` and `products` tables** (`admin.html` directly; the Next.js admin via `course-pricing/actions.ts` and `premium/actions.ts` respectively) with no coordination between them. This is a real, live data-corruption risk, not a cosmetic one — an admin editing `courses` in one app has no way to know the other app also writes there. (Architecture Drift #3, §8.)

### 2.4 CMS pattern (the part that does work well)

`useCollection(key, seed)` (`src/lib/admin/store.ts`) is a genuine two-tier system, not a facade: if `key` is in the `SUPABASE_COLLECTIONS` allowlist (`src/lib/admin/supabaseCollections.ts`, ~40 entries), it reads/writes through `/api/admin/collections/[table]` against real Supabase rows (service-role, RLS-bypassed, auth-checked). If not, it falls back to a per-browser `localStorage` shim seeded from `src/data/admin/*.ts`. This is a deliberate, documented migration pattern (per in-code Phase 2-5 comments), not an accident — but it means "is this admin-editable" is currently answered differently per collection, and (per §7 below) several collections that ARE migrated to Supabase are never actually rendered anywhere in the live Portal.

---

## 3. Module Map

```
                         ┌─────────────────────────────────────┐
                         │        PortalShell (frozen)          │
                         │  Header · Sidebar · CompanionPresence │
                         └───────────────┬───────────────────────┘
                                         │ {children}
        ┌──────────┬──────────┬─────────┼─────────┬───────────┬──────────┬───────────┐
        │          │          │         │         │           │          │           │
      Home     Companion    CKOS    Academy   AI Workspace  Projects  Premium    Journey   Community
   (portal/)  (companion/,  (ckos/,  (hocvienai/  (aiworkspace/  &Opportunities (premium/, (hanhtrinh-  (congdongai/)
              su-menh-      hetrithu- +duplicate  tools/)       (duan-cohoi/)  checkout/,  cuatoi/,
              companion/,   cai/)     vdai-                                   my-products/, story/,
              +duplicate                academy/)                            account/)    mirror/,
              ai-assistant/)                                                               nhatkyhoctap/,
                                                                                             khuvuoncuaban/)

Confirmed dependency edges (this sprint's research, §6):
  CKOS      → Companion   (CompanionMemoryLine, CompanionTaskEntry)
  Academy   → Companion   (CompanionMemoryLine)
  Academy   → AI Workspace (WorkNeedSection, AI_TOOLS — shared khong-gian-ai data)
  Journey   → Companion   (CompanionMemoryLine, mirror-dialogue, OriginLineWhisper)
  AI Workspace → CKOS     (RelatedKnowledgePanel, tools/[id] only)
  [no edges found: Premium, Community, Projects & Opportunities, Home]

Shared hub modules (fan-in only, never fan back into a platform dir):
  lib/access.ts (getPurchasedIds) · lib/portal/foundation/{growth-event-bus,growth-view,journey-chapter}.ts
  lib/portal/{warmth-engine,human-flow,companion-workspace}.ts · components/portal/ui/* (GemCard, Button, ...)
```

Two admin systems sit outside this diagram entirely (§2.3): `admin.html` (legacy, root-level, no relation to the module map above) and `src/app/admin/(dashboard)/` (modern, partially wired to the platforms above via `useCollection`, see §7 Future Admin Mapping / §9 Architecture Drift).

---

## 4. Ownership Matrix

Per-entity canonical owner, backing store, and conflicts — researched by tracing every real type definition and Supabase query in the codebase (file:line evidence retained in this sprint's working notes; representative citations below).

| Entity | Canonical Owner | Backing Store | Status |
|---|---|---|---|
| **Goal** | `/portal/goals` (`goal-runtime.ts`) | `localStorage` (Goal→Epic→Mission runtime), not Supabase | ⚠️ **Conflict**: a second, unrelated `UserGoal` type (`src/data/admin/userGoals.ts`) is admin-CRUD-able but never read by the live `/portal/goals` runtime — two disconnected "Goal" models |
| **Tool** | Ambiguous | 3 separate schemas: `src/data/tools.ts` (marketing-site only), `src/data/admin/tools.ts` (`AdminTool`, the real admin-CRUD catalog), `src/data/khong-gian-ai/index.ts` (`AiTool`/`AI_TOOLS`, shared by AI Workspace **and** Academy) | ⚠️ **Conflict**: 3 non-unified Tool models; only the AI-Workspace/Academy pair actually share one (via a confirmed direct import), the other two are fully independent |
| **Prompt** | `/portal/prompts` (mixed) | Two coexisting models rendered on the *same page*: static `src/data/prompts.ts` and admin-CRUD `src/data/admin/prompts.ts` | ⚠️ **Conflict**: 2 models, 1 page |
| **Workflow** | CKOS | Real Supabase table `ckos_workflows`, `src/app/api/v1/ckos/workflows/route.ts` | ✅ Clean — the `workflow?: string` field on `Tool`/`AdminTool` is an unrelated free-text description, not this entity |
| **Course** | Premium | Supabase `courses` table (`id, name, status, price`) | ✅ Clean boundary with Academy (which deliberately does not touch `courses`) — but see **Membership/orders** row below for the real conflict |
| **Lesson** | None (unused/ambiguous) | `orders.lesson_id` column exists but no `lessons`-table CRUD is wired to it in the live app beyond `vdai-academy`'s direct read; `learning-lessons.ts` is an unrelated "behavioral insight" concept, not course content | ⚠️ Confusing schema artifact — not a real duplication, but a real gap (the column exists, the entity mostly doesn't) |
| **Practice** | `/portal/practice` | Supabase `submissions` table (`practice/actions.ts`) | ✅ Clean |
| **Journal** | Journey (`/portal/nhatkyhoctap`) | Same `reflections` table as Reflection — Journal is a **view**, not an independent entity | ✅ Clean (expected, not a conflict) |
| **Reflection** | Shared type, `src/lib/portal/reflections.ts` | Supabase `reflections` table | ✅ Legitimate multi-module reads (Mirror, Story, Journey Map, Journal, Home) — same shape everywhere, no drift found |
| **Memory** | **Split, unresolved** | (A) `memory_capsules` Supabase table (`memoryCapsules.ts`, `story-memory.ts`) — user-authored reflective capsules. (B) `growth-view.ts`'s `getRecentActivity()` — a `localStorage` event log Companion reads for its "memory line" | ⚠️ **Conflict**: two disconnected systems sharing the word "memory," no shared type, no shared table |
| **Community Post** | None (by design) | Community reuses the same `case_studies` table as `/portal/case-studies` (explicit in-code comment: "không tạo bảng trùng lặp") plus honest empty states for Stories/Workshops/member-map | ✅ Clean and honest — no fabricated UGC model (matches NO-FAKE-DATA principle) |
| **Membership** | No unified type | `members` table (columns vary by call site) + `orders` table, gated through `getPurchasedIds()` (`lib/access.ts`) | ⚠️ **This sprint's central finding**: `orders` has **three parallel FK columns** — `lesson_id`, `product_id`, `course_id` — for three separate, never-reconciled tables. `getPurchasedIds()` is generic over which column to check. Premium's checkout writes `course_id`. `my-products`/`account` render by joining `products(...)` and `lessons(...)` — **never `courses(...)`.** This is the exact schema-level mechanism behind Sprint 2's P0 finding: a `course_id`-keyed order has no row in the join `my-products` actually selects. Not a missing join — a genuine three-way ownership split at the schema level. |

---

## 5. Module Contract

For each of the 9 platforms: Purpose / Owns / Doesn't Own / Dependencies / Consumers / Extension Rules.

**Home** — *Purpose*: welcome/orientation, non-competing directory to all pillars. *Owns*: pillar-entrance grid, greeting copy (`warmth-engine.ts`), today-mission widgets. *Doesn't own*: any content entity — pure aggregator. *Dependencies*: `growth-view.ts`, `warmth-engine.ts`, `human-flow.ts`, shared `ui/*`. *Consumers*: none (leaf, nothing links into Home except the shell logo). *Extension rule*: new pillar-entrance tiles require a shared-component change (`PillarEntranceCard`), not a page-local one — Home's known heading-hierarchy defect (h1→h3×7→h2, Sprint 3 §3) lives here.

**Companion** — *Purpose*: presence, not a tool — "conversation partner" role per `COMPANION_EXPERIENCE_ARCHITECTURE.md`. *Owns*: nothing content-wise; owns the generic activity-log read path (`growth-view.ts`) and its own voice/copy libraries. *Doesn't own*: any platform's actual content (confirmed self-contained this sprint, §7). *Dependencies*: `growth-event-bus.ts`/`growth-view.ts` only. *Consumers*: CKOS, Academy, Journey (all embed `CompanionMemoryLine`); globally present via `CompanionPresence` in the shell. *Extension rule*: Companion may be **imported by** any platform for an embedded widget; a platform must never be imported **by** Companion (verified zero violations — one-directional hub, confirmed by this sprint's dependency audit).

**CKOS** — *Purpose*: knowledge reference ("Knowledge" identity). *Owns*: `ckos_workflows` table, knowledge objects/collections. *Doesn't own*: the Tool catalog it displays (imports `toolsAdminSeed` as a static constant, bypassing `useCollection` — admin edits don't reach it, §9 Drift). *Dependencies*: Companion (embedded widget), shared `ui/*`. *Consumers*: Academy wraps CKOS collections as "Learning Journeys" (confirmed: Academy explicitly does not duplicate CKOS content, it reads it). *Extension rule*: new knowledge content should extend `ckos_workflows`/collections, not spawn a new static data file.

**Academy** — *Purpose*: learning, wrapping CKOS content into structured journeys. *Owns*: nothing at the data layer — deliberately a presentation layer over CKOS. *Doesn't own*: `courses`/`lessons` (that's Premium/`vdai-academy`, a real drift — see §9). *Dependencies*: CKOS (content), AI Workspace (`AI_TOOLS`, `WorkNeedSection` — a confirmed cross-platform import), Companion (embedded widget). *Consumers*: none upstream. *Extension rule*: Academy content changes should happen in CKOS or in Academy's own journey-wrapper layer, never by copying AI Workspace content locally (this is exactly what inflated Academy's density per Sprint 3 §5-6).

**AI Workspace** — *Purpose*: practice, hands-on tool use. *Owns*: `AI_TOOLS`/`khong-gian-ai` data (shared with Academy by design), workspace session tracking (`companion-workspace.ts`, feeds `growth-event-bus`). *Doesn't own*: CKOS's knowledge panels (imports `RelatedKnowledgePanel` directly from CKOS's namespace — a route-to-route coupling smell, §9). *Dependencies*: CKOS (`tools/[id]` only). *Consumers*: Academy (imports its tool data + a UI section). *Extension rule*: new tool metadata belongs in one canonical Tool schema (§4) — today it's unclear which of 3 is canonical, which itself is the extension-rule violation to fix.

**Projects & Opportunities** — *Purpose*: opportunity discovery, explicitly "not investment advice, not ranked." *Owns*: ecosystem/sub-project data (`data/portal/ecosystems`), `digital-asset-categories` (genuinely admin-managed via `useCollection`). *Doesn't own*: nothing borrowed from elsewhere — confirmed zero cross-platform import edges, the cleanest-bounded platform in the Portal. *Dependencies*: none cross-platform. *Consumers*: none. *Extension rule*: this platform is the reference example of correct module isolation — new platforms should be built to this standard.

**Premium** — *Purpose*: transformation/paid outcomes. *Owns*: `courses` table (real admin CRUD via `course-pricing`). *Doesn't own*: content delivery after purchase — the `my-products`/`account` render path joins `products`/`lessons`, not `courses` (§4, the central finding). *Dependencies*: `lib/access.ts` (`getPurchasedIds`). *Consumers*: none upstream; zero cross-platform import edges found (clean boundary, badly-served by the schema gap it doesn't control alone). *Extension rule*: **no new course-type product should be added until the `courses`/`products`/`lessons` split is resolved** (§9, §11 ADR-004) — adding a 4th variant would make this worse, not better. **[IMP-ADR-001: ADR-004 APPROVED, Course is canonical — this extension rule now has a clear target to build toward; the split itself is not yet physically resolved.]**

**Journey** — *Purpose*: reflection, the Portal's most content-rich single platform (5 doors: My Story, Mirror, Journal, Journey Map, Garden). *Owns*: `reflections` table (shared type, legitimately read by 5 call sites), `memory_capsules` (user-authored capsules). *Doesn't own*: Companion's separate localStorage-based "memory" (§4 conflict). *Dependencies*: Companion (embedded widgets across 3 of 5 doors), `growth-view.ts`/`journey-chapter.ts`. *Consumers*: none upstream. *Extension rule*: any new "memory"-named feature must explicitly state whether it extends `memory_capsules` or the Companion activity log — do not add a third memory concept.

**Community** — *Purpose*: belonging. *Owns*: nothing new — deliberately reuses `case_studies` rather than inventing a Community-post table (a correct, documented decision, not a gap). *Doesn't own*: real user-generated content (doesn't exist yet — honest empty states, not fabricated). *Dependencies*: none cross-platform (zero import edges found). *Consumers*: none. *Extension rule*: if Community Posts become real in the future, they should NOT reuse `case_studies` (different entity, different lifecycle) — this is the one place a genuinely new table would be justified, not a violation.

---

## 6. Dependency Graph

See the diagram in §3. Full edge list and hub-module list are reproduced there. Restated as findings:

- **Zero circular dependencies found**, verified three independent ways: (a) explicit search for back-imports from Companion into any of the 4 platforms that import it — none found (only route-path *strings* used for navigation links, not module imports); (b) Premium ↔ Community structural near-duplication (`FounderSpotlight.tsx`/`CommunityGuides.tsx`) confirmed to be copy-paste duplication, not a shared/circular import — neither file imports the other or a shared module; (c) all foundation modules (`growth-view.ts`, `journey-chapter.ts`) confirmed to only import sibling files within `lib/portal/foundation/`, never reaching back into a platform directory.
- **Route-to-route coupling smells** (architecture debt, not a violation of the "no circular dependency" rule, but worth correcting before Freeze): `tools/[id]/page.tsx` imports CKOS's `RelatedKnowledgePanel` directly from `components/portal/ckos/` rather than a neutral shared namespace; `hocvienai/page.tsx` imports AI Workspace's `ai-space/AiSpaceSections` directly from AI Workspace's own component folder. Both work today (no cycle), but both mean "AI Workspace" and "CKOS" folders are simultaneously platform-owned AND relied upon as if they were shared infrastructure — a namespace-boundary ambiguity that should be resolved by extracting the shared pieces into a neutral `components/portal/shared/` (or similar) location.
- **One likely dead-code finding** (adjacent to Sprint 3's `knowledge-garden.ts` sweep): `src/components/portal/story/ReflectionJournalCard.tsx` is referenced only in a comment inside `MyStoryBook.tsx`, not actually imported/rendered anywhere live. Flagged for a future dead-code sweep, not fixed here (out of this sprint's audit-only scope).

---

## 7. Navigation Audit

Fully covered by Sprint 1 (`PORTAL_NAVIGATION_AUDIT.md`, score **6/10**) and re-confirmed structurally sound by this sprint's independent dependency-graph research (sidebar source-of-truth is singular, no drift found in *how* navigation renders). Not re-audited in full here to avoid duplicating that report; the one **new** navigation-relevant finding from this sprint is architectural rather than UI: `/portal/vdai-academy` is a real, heavily-linked page that is **not reachable from the sidebar or any hub page at all** — it is arguably the most severe "orphan" in the Portal (worse than the pages Sprint 1 flagged, since this one has live commerce logic behind it), and was not caught by Sprint 1 because that sprint's orphan-detection was scoped to pages with real content and zero inbound links; this page has **plenty** of inbound links (9 files) but zero *navigational* (sidebar/breadcrumb/hub) discoverability — a different failure mode Sprint 1's methodology didn't target. Carried into §9 Drift and §11 ADR.

---

## 8. Architecture Drift Report

Analysis only — nothing in this section was fixed, per the brief.

**Drift #1 — Freeze doc's own audit table is stale.** `THE_PORTAL_ARCHITECTURE_FREEZE.md` §VIII documents "6 Gem Hub items" in the sidebar; the live count is 10 (`portalNavSections`). Low severity (doesn't affect users), but a canonical doc self-reporting a wrong number undermines the "canonical" claim of this whole exercise. **Fix**: update the Freeze doc's audit table to cite `portalNavSections`, not `portalHubs`.

**Drift #2 — `vdai-academy`/`hocvienai` duplicate Academy surface (P0).** Already flagged as debt in `PORTAL_3_0_DESIGN_SYSTEM.md` §12 item 5 ("P.2 was navigation/design-token scope only, the actual page consolidation is P.5's job") — this sprint confirms it is still unresolved and root-causes *why* it matters: `vdai-academy` has real Supabase commerce logic (`lessons` table, `CheckoutButton`, `getPurchasedIds`) that `hocvienai` (the sidebar's actual "Academy") has no relationship to at all. Two pages, same conceptual name, structurally different purposes, only one discoverable via navigation. See §11 ADR-005. **[IMP-ADR-001: addressed by consequence of ADR-004's approval — Course is canonical, Lesson isn't sold directly, so `vdai-academy`'s current model is no longer the target; actual migration still pending.]**

**Drift #3 — Two independent Admin apps writing to overlapping tables (P0).** `admin.html` (legacy) and `src/app/admin/(dashboard)/` (modern) both write to `courses` and `products` with no coordination and different naming conventions for adjacent concepts (`prompt_templates` vs. `prompts`). Real risk: simultaneous edits in both apps can silently overwrite each other. See §11 ADR-007. **[IMP-ADR-001: ADR-007 APPROVED — `src/app/admin` is canonical, `admin.html` is Legacy, no new Legacy features. Actual sunset of `admin.html`'s live writes still pending implementation.]**

**Drift #4 — Three unreconciled Tool catalogs (P1).** `data/tools.ts` (marketing-only), `data/admin/tools.ts` (the only one with real CRUD), `data/khong-gian-ai/index.ts` (shared correctly between AI Workspace and Academy, but still a third schema). See §11 ADR-006.

**Drift #5 — Orders table's triple foreign key is the root cause of Sprint 2's P0 (P0, carried forward and now root-caused).** `orders.lesson_id`/`product_id`/`course_id` — three columns for three tables that content-rendering logic (`my-products`, `account`) only partially joins (`products`+`lessons`, never `courses`). This is not a missing join to add; it's an unresolved decision about which table is the canonical "thing a customer bought." See §11 ADR-004. **[IMP-ADR-001: ADR-004 APPROVED — Course is the canonical purchasable entity. The FK consolidation/rendering-layer fix itself is still unimplemented, but the decision blocking it from being scoped is resolved.]**

**Drift #6 — Companion's "Memory" is two disconnected systems (P1).** `memory_capsules` (Supabase, user-authored) vs. `growth-view.ts`'s activity log (localStorage, generic). Both are real and both are "correct" for their own narrow purpose, but sharing the word "memory" invites future confusion (a developer building a "Companion remembers your reflections" feature could easily reach for the wrong one). See §11 ADR-008.

**Drift #7 — Two disconnected Goal models (P2).** `goal-runtime.ts` (live, localStorage) vs. `data/admin/userGoals.ts` (admin-CRUD, never read by the live page). Lower severity than the others since neither is broken in isolation — the admin one is simply unused.

**Drift #8 — Two coexisting Prompt models on the same page (P2).** `data/prompts.ts` (static) and `data/admin/prompts.ts` (admin-CRUD) both render on `/portal/prompts`. Lower severity — not visibly broken, but doubles the maintenance surface for one page.

**Drift #9 — Route-to-route namespace coupling (P2).** AI Workspace importing CKOS's component folder directly; Academy importing AI Workspace's component folder directly. No cycle, but blurs the "platform-owned vs. shared" boundary (§6).

**Drift #10 — Admin-built content that nothing renders (P1).** `portal-banners`, `start-here-steps`, `today-action-cards`, `user-goals` collections have full CRUD in `/admin/portal-builder/*` but `NotificationTicker.tsx` (the one component that would render `portal-banners`) is never imported anywhere in `src/app`, and the other three seeds are imported nowhere outside `src/data/admin`/`src/app/admin` itself. Real admin effort with zero user-facing effect today. See §9 Future Admin Mapping.

**Drift #11 — Freeze doc's brand-hex drift, carried from `PORTAL_3_0_DESIGN_SYSTEM.md` §12 item 3 (P2, unchanged).** `PortalHeader.tsx`/`PortalSidebar.tsx` hardcode `#FF7A00` for the logo accent; CLAUDE.md mandates `#F97316` for new pages. Still unresolved, restated here only because this report is meant to be the canonical drift ledger going forward.

**Not drift — confirmed correct-by-design, restated so future sprints don't "fix" them:** the `/solo` external route (Sprint 1, allowlisted intentionally), Community's reuse of `case_studies` instead of a new table (§4), Academy's zero local content ownership (§5, correct wrapper pattern), Journey's shared `reflections` table across 5 call sites (§4, legitimate reuse not duplication).

---

## 9. Future Admin Mapping (Deliverable 7)

| Portal Module | → | Admin Module | Current State |
|---|---|---|---|
| Home | → | Portal Home Manager | Collections exist with full CRUD (`portal-banners`, `start-here-steps`, `today-action-cards`, `user-goals`) but are **orphaned** — nothing in the live Portal renders them (Drift #10). Fix is to wire rendering, not to build new admin. |
| Companion | → | Companion Studio | **Does not exist.** No `useCollection` usage anywhere in Companion's code. Would need to be built net-new — voice-string governance (`warmth-engine.ts`), proactive-thought config, etc. |
| CKOS | → | CKOS Management | Partially exists (`ckos_workflows` has a real API route) but CKOS's homepage tool card bypasses `useCollection` entirely (imports `toolsAdminSeed` as a static constant) — admin edits to `tools` never reach CKOS. Fix the bypass before calling this "done." |
| Academy | → | Academy Manager | **Split and incomplete.** Course price/open-status is editable via the modern `course-pricing` admin section; full lesson/course content is only editable via the **legacy `admin.html`**, which nothing in the Next.js app coordinates with. Must resolve Drift #2/#3 before this mapping can be called real. |
| AI Workspace | → | Workspace Tools Manager | **Does not exist.** No `useCollection` usage found. Would consume whichever Tool schema is chosen canonical (Drift #4) once unified. |
| Projects & Opportunities | → | Projects Manager | **Already real** — `digital-asset-categories` via `useCollection`, live today. The reference example for what "done" looks like. |
| Premium | → | Premium/Course Pricing Manager | **Already real** — `courses` editable via `course-pricing`/`premium` admin sections. Blocked from being fully useful by Drift #5 (content delivery gap downstream of purchase). |
| Journey | → | Journey Content Manager | **Partially real** — `roadmap-steps`/`daily-missions` are live admin-editable content. Mirror/Story/Garden are (correctly) NOT admin-editable, since they're derived from real user activity — this should stay that way, not be "completed." |
| Community | → | Community Manager | A `community` Supabase collection and admin page exist, but `/portal/congdongai` never calls `useCollection` — the admin surface writes to a table nothing reads. Same shape as Drift #10; needs the read side wired, not more admin surface. |

---

## 10. Future Companion Mapping (Deliverable 8)

**Today (verified, not aspirational):**

```
Every platform → growth-event-bus.ts (localStorage, append-only, 200-event cap)
                        │
                        ▼
                 growth-view.ts (read-only aggregator: getRecentActivity(),
                                  getGardenSummary(), getJourneyProgress())
                        │
                        ▼
        Companion (CompanionMemoryLine, companion/page.tsx, MirrorChamber)
```

Companion today reads **generic, module-tagged session counts** ("Hoàn thành Không gian làm việc" — a session finished, tagged `module: "ckos"`/`"academy"`/`"khong-gian-ai"`) — never an actual course name, tool name, or journal excerpt. This was independently verified by grepping for cross-platform content imports inside Companion's lib/component code: the only matches are route-path *strings* used for navigation link text (`route-context.ts`), not data reads. A rule-based `AGENT_REGISTRY`/orchestration system exists at `src/companion/agents/*` that maps routes to module labels, but **every entry is `status: "planned"`** — it is aspirational scaffolding, not a live data pipeline. `human-flow.ts` even says so in its own comment: *"Mock-data version... same shape will later read from real progress data."*

**Proposed future flow** (the brief's own example, annotated with what it would actually require):

```
Companion
  ↓  [NEW — does not exist today]
CKOS        (read real knowledge-object titles/categories the user engaged with,
             not just a "ckos" module tag)
  ↓  [NEW]
Academy     (read real Learning Journey names/progress, not just an "academy" tag)
  ↓  [PARTIALLY EXISTS — growth-view already aggregates Journey activity,
      but generically; would need to become content-specific]
Journey
  ↓  [NEW]
Workspace   (read real tool names / session output titles, not just a
             "khong-gian-ai" tag)
```

**Recommendation**: until these new read paths are built, Companion should continue to speak only in the generic terms it already honestly uses ("bạn vừa hoàn thành một phiên làm việc") rather than implying content-awareness it doesn't have — this is a direct application of the NO-FAKE-DATA principle already enforced elsewhere in the Portal (Sprint 3 §11), extended to Companion's *capabilities claims*, not just its copy.

---

## 11. Architecture Decision Records (ADR)

**Status update — Architecture Decision Finalization (IMP-ADR-001):** Founder and PMO have officially approved ADR-004 and ADR-007, closing the two decisions Sprint 4 originally flagged as the freeze-blocking priority (§13 item 1 and 3) and Sprint 7/8 both independently re-confirmed as still open. Both are recorded as **APPROVED** below, verbatim per the official decision. No code, schema, or business logic changed as part of recording this decision — per IMP-ADR-001's explicit scope, this is a documentation update only; implementation (the `orders` FK consolidation, the `admin.html` sunset) remains future work now unblocked by a clear direction. ADR-005 (`vdai-academy`'s relationship to `hocvienai`) is a direct consequence of ADR-004's "Lesson không bán trực tiếp" rule — `vdai-academy`'s current lesson-direct-sale model is no longer the target architecture, so ADR-005 is treated as **addressed by consequence** (see its entry below), though the actual page consolidation is still unimplemented, deferred work. ADR-006, ADR-008, and the Goal Model remain open — this finalization only covers the two decisions Founder/PMO explicitly approved.

**Status update — Content Cleanup Sprint 7 (historical):** Sprint 7's brief assumed ADR-004 through ADR-008 had been confirmed and asked to implement them. PMO explicitly declined at the time: *"Do NOT implement or assume any Product Owner decisions..."* — all five were OPEN as of Sprint 7. That has now changed for ADR-004 and ADR-007 only, per the finalization above.

Decisions already made and confirmed correct by this audit (ratify, don't reopen):

- **ADR-001 — Portal Shell is frozen.** One layout, one `PortalShell`, no per-platform overrides. Confirmed zero violations. *Status: RATIFIED.*
- **ADR-002 — Companion is a one-directional data/UI hub.** Platforms may import Companion widgets; Companion must never import a platform. Confirmed zero violations (dependency-graph research, §6). *Status: RATIFIED — recommend codifying explicitly in `THE_PORTAL_ARCHITECTURE_FREEZE.md`, since it's currently true by convention only, not written down.*
- **ADR-003 — Reflection is the single canonical model for reflective content.** Journal/Mirror/Story read the same `reflections` table/type; this is correct reuse, not drift. *Status: RATIFIED.*

**Approved by Founder/PMO — IMP-ADR-001:**

- **ADR-004 — Canonical Purchasable Entity.** *Status: APPROVED.* Official decision: **Course is the Canonical Purchasable Entity.** Lesson is not sold directly — Lesson belongs only to a Course. Product is reserved for standalone products/services independent of Course/Lesson. Orders must point to one primary purchasable entity in the future architecture. This resolves the `courses`/`products`/`lessons` + `orders`' triple-FK ambiguity that was the root cause of Sprint 2's P0 (confirmed course purchases delivering no content) — the decision itself doesn't move data or add a constraint yet (out of this sprint's scope; a future implementation sprint executes the actual FK/rendering-layer consolidation), but it removes the ownership ambiguity that was blocking that work from being scoped.
- **ADR-007 — Canonical Admin System.** *Status: APPROVED.* Official decision: **`src/app/admin` (Next.js Admin) is the official Admin CMS.** Legacy Admin (`admin.html` and related legacy interfaces) moves to Legacy status — no new features may be built on it. EPIC-02 (Admin CMS) develops exclusively on the Canonical Admin. This resolves the two-independent-admin-apps risk (both previously writing to `courses`/`products` with no coordination) at the decision level; the actual sunset of `admin.html` (stopping its live writes) is future implementation work, out of this sprint's scope.
- **ADR-005 — `vdai-academy`'s relationship to `hocvienai`.** *Status: ADDRESSED BY CONSEQUENCE of ADR-004.* ADR-004's "Lesson không bán trực tiếp — Lesson chỉ thuộc Course" rule means `vdai-academy`'s current model (selling individual Lessons directly against a `lessons` table) is not the target architecture. The eventual resolution is implied — `vdai-academy` should migrate to Course-based purchasing or be retired in favor of Premium's existing Course flow — but the actual page consolidation/migration has not been implemented and remains deferred work, tracked as a consequence of ADR-004 rather than as its own open decision requiring separate Founder/PMO input.

Still open, not part of this finalization:

- **ADR-006 [NEEDS DECISION] — Canonical Tool catalog.** Recommend `data/admin/tools.ts` (`AdminTool`) as canonical, since it's the only one with real CRUD; migrate AI Workspace/Academy's `khong-gian-ai` catalog onto it, and either retire or clearly re-scope `data/tools.ts` (marketing-only use may be legitimate to keep separate — that's a valid outcome too, but it must be a decision, not an accident).
- **ADR-008 [NEEDS DECISION] — Memory model.** Either merge `memory_capsules` and the Companion activity log under one concept, or keep them separate but rename one (e.g. Companion's should be called "Activity Log," not "Memory") so future builders don't conflate them.
- **Goal Model [NEEDS DECISION]** — `goal-runtime.ts` (live, localStorage) vs. `data/admin/userGoals.ts` (admin-CRUD, unused) remain two disconnected systems; not formally numbered as an ADR in Sprint 4 but tracked identically.
- **ADR-009 [LOW-RISK, RECOMMEND RATIFYING] — Orphan/deprecated-page pattern.** The existing pattern (redirect stub + `next.config.ts` redirect + `@archived` tag, as used for `hanh-trinh-cua-toi`/`student-success`/`updates`) works and should be the mandatory mechanism for retiring any route — apply it to `digital-assets` (Sprint 1 finding, still pending) as the next real-world test of this ADR.
- **ADR-010 [PROCESS, RECOMMEND RATIFYING] — Periodic dead-code sweep.** Sprint 3 found and removed one orphaned fake-data file (`knowledge-garden.ts`); Sprint 7 found and removed a second (`ReflectionJournalCard.tsx`). Recommend a lightweight recurring check (could be a CI script cross-referencing `src/data/**`/`src/components/**` against actual import graphs) rather than relying on it being caught incidentally during unrelated audits.

---

## 12. Portal Readiness Score

**Note (IMP-ADR-001):** the Architecture score below predates ADR-004/ADR-007's approval. With those two decisions now made, see `docs/PORTAL_FEATURE_FREEZE.md` §7 for the updated Portal Health Score reflecting this finalization — the table below is left as originally recorded, for historical accuracy of what Sprint 4 measured at the time.

| Dimension | Score /10 | Basis |
|---|---|---|
| Architecture | **4.5** | Shell/dependency graph clean (no cycles); data-ownership layer has 5+ real unresolved conflicts (§4, §8) |
| Navigation | **6.0** | Unchanged from Sprint 1 — solid mechanics, real coverage gaps, now +1 newly-found orphan (`vdai-academy`) not previously caught |
| Content | **6.0** | Unchanged from Sprint 3 |
| Typography | **8.0** | IMP-2026-TYPO-001 shipped and verified this session — single system font stack, zero external font loading, repo-wide |
| UI / Component Library | **6.0** | Real, documented library (`PORTAL_COMPONENT_LIBRARY.md`) with named gaps (breadcrumb triplication, 4 card recipes reduced to 1 in only 3 of ~40 pages) |
| Performance | **6.0** | Not independently re-audited this sprint; no new red flags surfaced; builds/tests remain clean across all 3 prior sprints |
| Accessibility | **6.0** | Global focus-visible ring + contrast fixes shipped (P.2); mobile-drawer focus-trap gap still open (Sprint 1) |
| Maintainability | **5.0** | Real, load-bearing duplication (3 Tool catalogs, 2 Admin apps, breadcrumb helper ×3) actively increases the cost of every future change |
| Scalability | **5.5** | `useCollection`'s Supabase/localStorage two-tier pattern is a reasonable scaffold; undermined by orphaned admin collections (Drift #10) and no unified `Member` type |
| Admin Readiness | **3.5** | 2 of 9 platforms fully wired (Projects, Premium), 3 partial (Academy, Journey, CKOS-partial), 4 not wired at all (Companion, AI Workspace, Community, Home-orphaned) |
| Companion Readiness | **3.0** | Architecturally clean (isolated, no fake claims) but functionally isolated — real cross-platform "Companion knows your content" capability does not exist yet, only planned scaffolding |
| **Overall** | **5.5 / 10** | Solid frozen foundation, honest content and Companion behavior, held back by a genuinely fragmented data-ownership layer that compounds with each new sprint until resolved |

---

## 13. Founder Recommendation

**If there is exactly one week before Feature Freeze, in priority order:**

1. **Decide ADR-004 (purchasable entity).** This is the one item with real revenue attached — customers can pay today and receive nothing. Even a decision to "temporarily show an honest pending-fulfillment message" (Sprint 2's own suggested interim fix) beats leaving this unresolved through a Freeze.
2. **Decide ADR-005 (`vdai-academy` vs. `hocvienai`).** A second real-money commerce surface with zero navigational discoverability is not something to freeze silently — either surface it properly or fold it into Premium's flow.
3. **Decide ADR-007 (canonical Admin system).** Two apps writing to the same tables is a live data-integrity risk that gets worse the longer both stay active — this doesn't require finishing a migration in a week, just declaring which one is authoritative going forward and freezing changes to the other.
4. **Decide ADR-006 (canonical Tool catalog).** Lower urgency than 1-3 (nothing is broken for users today), but it's the cheapest of the five decisions to make now and the most expensive to unwind later — every new tool/prompt feature built on top of 3 schemas compounds the debt.
5. **Ratify ADR-002 and ADR-009 in writing.** Two things already working well (the Companion one-directional-hub rule, the archive-in-place deprecation pattern) currently exist only as consistent practice, not as a written rule new contributors can be held to. Writing them down costs almost nothing and locks in what's already good before Freeze — the cheapest win on this list.

---

## 14. Architecture Freeze Recommendation

**Updated by IMP-ADR-001 — see `docs/PORTAL_FEATURE_FREEZE.md` for the authoritative, current Freeze recommendation.** The verdict below is preserved as originally written (Sprint 4) for historical record; it predates ADR-004/007's approval.

~~**Portal is NOT yet ready for Architecture Freeze.**~~

**What's ready to freeze today, as-is:** the shell/layout system (`PortalShell`/`PortalHeader`/`PortalSidebar`/`PortalSearch`, per `THE_PORTAL_ARCHITECTURE_FREEZE.md`), the module dependency structure (confirmed acyclic, Companion confirmed one-directional), the component library's canonical primitives (`GemCard`/`Button`/`SectionHeader`/`PageHeader`), and the Reflection/Journal/Practice/Workflow/Community-Post ownership boundaries (all confirmed clean, §4-5).

**What was required to be resolved before Freeze could honestly be declared (as of Sprint 4):**
1. ~~ADR-004 (purchasable entity)~~ — **APPROVED, IMP-ADR-001.** Course is canonical; see §11.
2. ~~ADR-005 (`vdai-academy`)~~ — **ADDRESSED BY CONSEQUENCE of ADR-004, IMP-ADR-001.** See §11.
3. ~~ADR-007 (canonical Admin)~~ — **APPROVED, IMP-ADR-001.** `src/app/admin` is canonical; `admin.html` is Legacy. See §11.
4. A written version of ADR-002 (Companion one-directional rule) added to `THE_PORTAL_ARCHITECTURE_FREEZE.md` itself — **still outstanding**, a documentation-only task, not freeze-blocking on its own (ADR-002 is already RATIFIED and followed; this is about writing down an existing, working convention, not deciding anything new).

ADR-006, ADR-008, ADR-009, ADR-010, and Drift #1/#9/#11 remain real but lower-severity — they do not block a Freeze decision, logged as post-Freeze roadmap items, unchanged by this finalization.

With items 1-3 now resolved at the decision level, see `docs/PORTAL_FEATURE_FREEZE.md` for the current, authoritative Freeze recommendation reflecting IMP-ADR-001.

---

## Appendix — Research method

This report was produced by: (1) re-reading all three prior QA sprint reports and the existing Design System/Component Library/Architecture Freeze docs in full; (2) three parallel, independent code-research passes — data/module ownership (entity-by-entity type and Supabase-query tracing), module dependency graph (cross-platform import tracing + explicit circular-dependency check), and Admin/CMS + Companion data-flow (useCollection pattern, both Admin apps, Companion's foundation-layer read paths); (3) targeted manual verification of the `orders` table schema and `vdai-academy`'s inbound links, which surfaced this sprint's central finding. No file was edited. No test/build/lint was run, since no code changed.
