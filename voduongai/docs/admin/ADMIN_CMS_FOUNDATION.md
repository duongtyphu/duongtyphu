# ADMIN CMS FOUNDATION — IMP-ADM-001 (ADM-SPR-001, EPIC-02)

**STATUS: SUBMITTED FOR PMO REVIEW. Not self-approved, not self-merged.**

This is the first sprint of EPIC-02 (Admin Foundation & Canonicalization), opened immediately after Founder/PMO approved ADR-004 and ADR-007 in IMP-ADR-001. Per that approval, `src/app/admin` (Next.js Admin) is now the official Canonical Admin CMS and `admin.html` (legacy static site) is Legacy — read-only reference, no new features. This sprint's job was research + narrow safe foundation fixes + specification writing, not building business modules. Per the brief: **no database schema changes, no production data migration, no legacy Admin deletion, no Companion runtime, no full CRUD build-out.**

Research was conducted via four parallel read-only audits: (1) Canonical Admin Inventory, (2) Data Ownership Inventory across all domains, (3) Admin Shell + Role/Permission current-state audit, (4) Premium + Companion deep implementation dive. Findings are synthesized below.

---

## 1. Executive Summary

The Canonical Admin (`src/app/admin`) is materially more mature than its "just get started" framing suggested: 49 routes, a real (if partial) shared shell (`AdminShell`/`AdminSidebar`/`AdminHeader`), a working auth guard at both the network edge (`middleware.ts`) and the server-action layer (`requireAdmin.ts`), and three reusable page-shell patterns (`CrudPage`, `ResourceManager`, `ContentManager`) covering 31 of 49 pages. It is a legitimate foundation to build EPIC-02 on, not a blank slate.

The single most important finding this sprint is that **legacy `admin.html` is not actually a passive "read-only reference" today — it is a fully live, functional admin application that still writes to production Supabase tables**, on at least 11 confirmed overlapping or colliding write paths with the Canonical Admin (§13, Risk R1). This is a live data-integrity and security risk, independent of and in addition to the ADR-007 decision itself: ADR-007 says legacy Admin *should* stop receiving new features, but nothing has yet stopped it from being *used* for the features it already has, by anyone who still has the URL and a login. Its auth model is also materially weaker — client-side only, with a hardcoded email string as an OR-bypass condition (§13, Risk R2).

Beyond that: there is no role/permission model beyond a single `members.is_admin` boolean (§8); no true content lifecycle beyond an ad-hoc, UI-only Draft/Published/Hidden badge convention that many collections don't even persist server-side (§9, and Risk R4); Premium's commercial data model does not yet reflect ADR-004 (Course/Lesson/Product remain three disconnected concepts with no FK consolidation — expected, since that implementation was explicitly deferred, not part of this sprint); and Companion Studio has no admin surface at all today — persona, memory, and the 32-entry `AGENT_REGISTRY` are 100% code-owned, all `status:"planned"`, and invisible to any admin user (§11).

This sprint applied one class of safe, mechanical fix — 4 orphan Admin pages that existed and worked but had no sidebar entry are now linked (§6) — and otherwise limited itself to documentation, matching the brief's explicit scope boundary. No schema changes, no new modules, no legacy deletion, no runtime changes were made.

**Readiness for ADM-SPR-002: CONDITIONAL YES.** See §15 for the full reasoning and the two items PMO should decide before that sprint starts.

---

## 2. Canonical Admin Decision (restated from IMP-ADR-001)

Per Founder/PMO's official approval, recorded in `PORTAL_ARCHITECTURE_STANDARDIZATION.md` §11 and `PORTAL_FEATURE_FREEZE.md`:

- **`src/app/admin` (Next.js Admin) is the official, canonical Admin CMS.** All EPIC-02 development happens here.
- **`admin.html` (legacy static site) is Legacy.** No new features. Not deleted in this sprint. Sunset plan required (§12) but sunset execution is out of scope here.
- **ADR-004 (Course is the Canonical Purchasable Entity)** is approved at the decision level; Premium Management (§10) is written against that target model, while flagging everywhere the current implementation still diverges from it.

This document treats both as settled inputs, not open questions.

---

## 3. Current Admin Inventory

**49 routes** under `src/app/admin/(dashboard)/**` plus `/admin`, `/admin/login`. Full route table (path → file → data → page-shell pattern) is preserved in the sprint's research notes; the shape:

| Pattern | Count | Examples |
|---|---|---|
| `CrudPage.tsx` (generic collection CRUD) | 25 | blog, roadmap, prompts, tools, templates, updates, digital-assets/category/[key], portal-builder/* |
| `ResourceManager.tsx` (thin CrudPage wrapper) | 5 | templates, ebooks, checklists, sop, resources |
| `ContentManager.tsx` (single consumer, possibly redundant with ResourceManager) | 1 | news |
| Hand-rolled CUSTOM (Server Actions against typed, pre-existing tables) | 18 | orders, coupons, leads, users, support, premium, course-pricing, projects, case-study, dashboard, reports, settings, digital-assets index/analytics, affiliate/analytics, saved |

**Auth/access guards (Canonical):**
- `src/middleware.ts` — network-edge gate on all `/admin/:path*` except `/admin/login`; checks Supabase auth + `members.is_admin`; redirects to `/admin/login` on failure.
- `src/lib/admin/requireAdmin.ts` — server-side guard mirroring the same check, for `/api/admin/*` route handlers and Server Actions (middleware doesn't cover direct `fetch()`/action calls). Also exports the lighter `requireMember()` for read-only reuse by Portal pages.
- `src/app/admin/(dashboard)/layout.tsx` has its own redundant copy of the same check — defense in depth, not a gap.

**Admin-scoped API surface:** `src/app/api/admin/collections/[table]/route.ts` (+ `[id]/route.ts`) is the only generic REST surface, gated by the `SUPABASE_COLLECTIONS` allowlist (29 entries). The 18 CUSTOM pages bypass this entirely and write via Server Actions directly.

**No rich-text/WYSIWYG editor or file-upload utility exists anywhere in Canonical Admin.** Content fields are plain textarea/URL inputs across all three shared patterns. This is a real gap for a "CMS foundation," not a stylistic choice — flagged for a future sprint, not fixed here (would be a business-module change).

**Legacy `admin.html`:** 150,990 bytes, 19 sections (`dashboard, members, docs, courses, lessons, minicourse, products, orders, affiliate, leads, schedules, coupons, casestudies, experts, blog, notifications, support, prompts, submissions`), writing directly to 18 distinct Supabase tables. See §13 Risk R1 for why "Legacy" ≠ "inert."

---

## 4. Data Ownership Inventory

Full per-domain inventory (Website/Landing, Brand, all 10 Portal platforms, and 24 data domains — Goals through Companion assets) was produced this sprint and is the authoritative reference for EPIC-02 module scoping. Headline cross-cutting findings, most relevant to Admin foundation work:

1. **Lessons is a confirmed three-way split**: a hardcoded canonical seed (`knowledge-seed-data.ts`, 1684 lines), an unrelated Supabase `lessons` table with real production data, and an `/admin/knowledge-seed` editor that writes to *neither* — `"knowledge-seed"` is absent from `SUPABASE_COLLECTIONS`, so that admin page silently falls back to per-browser `localStorage`. Whoever edits "Lessons" in Admin today is not changing what any user actually sees.
2. **Prompts is a confirmed three-way split**: `src/data/prompts.ts` (hardcoded, canonical for cross-links), Supabase `prompts` (Canonical Admin writes here), Supabase `prompt_templates` (legacy `admin.html` writes here, and is also the table `/portal/prompts`'s `getLivePrompts()` queries — currently near-empty per its own code comment).
3. **Resources**: Admin's `/admin/resources` writes table `resources`; the public `/portal/resources` page's `getLiveDocuments()` reads table `documents`. Different tables, same concept — admin edits are not reflected on the live page.
4. **Blog** (`blog_posts` via legacy `admin.html` vs. `blog` via Canonical Admin) and **Case studies** (a third, now-orphaned `case_study` jsonb table still in the allowlist alongside the real `case_studies` typed table) repeat the same divergence pattern — see §13 Risk R1 for the full table.
5. **CKOS Phase-H tables** (`ckos_workflows`, `ckos_prompt_templates`, `ckos_best_practices`, `ckos_resources`) have migration SQL committed at repo root but were "written but never applied" to production per in-code comments — they exist as schema, not as live data paths.
6. **Contact info exists as two independent hardcoded records** (legacy `assets/js/config.js` vs. Next `src/lib/site.ts`) with nothing keeping them in sync, and no admin editor for either.
7. **Brand colors**: `/admin/settings` exposes `primaryColor`/`secondaryColor`/`accentColor` fields, but nothing in the app actually consumes them — the real tokens are static in `globals.css`. These settings fields are currently dead UI.
8. **Projects & Opportunities** (`ecosystems.ts`) is explicitly self-documented in its own file comment as a static stand-in for a future CMS collection — confirmed, no admin editor exists.
9. **Two near-duplicate Journey route folders** exist (`hanhtrinhcuatoi` and `hanh-trinh-cua-toi`) — a Portal-side finding, out of this sprint's Admin scope, but worth a pointer for whoever picks up Portal cleanup next.

The complete domain-by-domain table (Website/Landing, Brand, all Portal platforms, and all 24 data domains with source/owner/consumer/admin-editor/duplication columns) is preserved in the sprint research artifacts and should be pulled into the EPIC-02 backlog tracker directly rather than re-transcribed here — it is long-form reference material, not a decision document.

---

## 5. Admin Module Map

Mapping the brief's 14-item target navigation structure to what exists today:

| Target module | Current coverage | Gap |
|---|---|---|
| Dashboard | `/admin/dashboard` exists | None |
| Website | No dedicated module — contact info, footer, static legal pages have no admin surface | New module needed (future sprint) |
| Brand & Media | `/admin/settings` covers name/slogan/logo-URL/favicon-URL only; no asset library, no working color-token wiring | New module needed |
| Content | Split across `blog`, `case-study`, `student-success`, `updates`, `news`, `resources`, `templates`, `ebooks`, `checklists`, `sop` — functionally present but not grouped as one IA concept | Regroup only, no rebuild needed |
| CKOS | Split across `prompts`, `tools`, `knowledge-seed` — none actually wired to the CKOS-canonical data sources per §4 findings #1-2 | Needs data-path fix before UI regroup is meaningful |
| Academy | Only `/admin/course-pricing` (price/status on `courses`); no lesson/chapter editor exists | New module needed |
| Premium | `/admin/premium` (products), `/admin/course-pricing` (courses), `/admin/coupons`, `/admin/orders` — functionally present, not ADR-004-aligned yet | See §10 |
| Projects & Opportunities | `/admin/projects` manages *submissions* (grading), not the `digital-assets`/ecosystem content itself, which has no editor | Partial — naming currently conflates two different things |
| Community | `/admin/community` exists | None |
| Companion Studio | **Does not exist at all** | New module needed, see §11 |
| Users & Access | `/admin/users` (ban/unban only, no role editing since no roles exist) | See §8 |
| Analytics | `/admin/reports`, `/admin/affiliate/analytics`, `/admin/digital-assets/analytics` exist as separate, ungrouped pages | Regroup only |
| SEO | **No dedicated surface** — only static per-route Next.js `metadata` objects in code | New module needed |
| System Settings | `/admin/settings` exists, partially wired (see #7 above) | Needs field-level fixes, not a new module |

This map is the input for ADM-SPR-002's actual navigation regrouping — this sprint intentionally did not rebuild the IA around it (brief: "Do not build all module screens yet").

---

## 6. Navigation Architecture

**Current state:** 10 nav groups (`Tổng quan, Portal Builder, Lộ trình, Học tập, Thư viện, Affiliate, ĐẦU TƯ CÙNG TÔI, Cửa hàng, Nội dung`, plus 5 ungrouped top-level items), defined in `src/lib/admin/nav.ts`, rendered by `src/components/admin/AdminSidebar.tsx`. This does not yet match the brief's target 14-group structure (`Dashboard/Website/Brand & Media/Content/CKOS/Academy/Premium/Projects & Opportunities/Community/Companion Studio/Users & Access/Analytics/SEO/System Settings`) — remapping the full IA is ADM-SPR-002 work, not this sprint's (brief: foundation fixes only, no redesign).

**Dead-link audit result: zero dead links.** Every existing sidebar `href` resolves to a real route, including the 5 category dynamic-segment links (`digital-assets/category/[key]`).

**Orphan-page audit result: 4 pages found, now fixed.** These routes existed, were fully built and functional, and were reachable only by typing the exact URL — no sidebar entry pointed to them. Since these are already-shipped, already-working pages (not new modules, not new functionality), adding their nav entries is a mechanical consistency fix squarely inside this sprint's allowed scope ("Sidebar/navigation foundation," "clearly safe dead-link fixes" — this is the inverse of a dead link: a live page with no link). Applied in `src/lib/admin/nav.ts`:

- `/admin/affiliate-hub/top-products` → added to "Affiliate" group as "Top sản phẩm Affiliate"
- `/admin/digital-assets/projects` → added to "ĐẦU TƯ CÙNG TÔI" group as "Dự án"
- `/admin/digital-assets/articles` → added to "ĐẦU TƯ CÙNG TÔI" group as "Bài viết"
- `/admin/news` → added to "Nội dung" group as "Tin nội bộ"

All four reuse icons already imported in `AdminSidebar.tsx`'s `navIcons` map (`TrendingUp`, `FolderKanban`, `FileText`, `Newspaper`), so no new dependency or visual-language decision was introduced.

**Not changed:** the 10-group structure itself, group ordering, and group naming — remapping to the target 14-module IA is explicitly scoped to ADM-SPR-002, since it touches every page's product categorization, which is a business decision, not a mechanical fix.

---

## 7. Module Contracts

No formal per-module contract (props/data-shape/ownership boundary documentation) exists for Admin today, mirroring the same gap Sprint 4 found on the Portal side before `PORTAL_ARCHITECTURE_STANDARDIZATION.md` was written. The three shared page-shell patterns have de facto contracts worth recording as the starting point for ADM-SPR-002's module work:

- **`CrudPage.tsx`** — contract: a `collectionKey` (string) resolved through `useCollection()`, which checks `SUPABASE_COLLECTIONS` and either talks to `/api/admin/collections/[table]` (real persistence) or falls back to `useLocalCollection` (per-browser `localStorage`, silent, no warning shown to the admin user). **This silent fallback is itself worth flagging as a foundation-level risk** — see §13 Risk R4.
- **`ResourceManager.tsx`** — thin wrapper over the same `CrudPage`/collection contract, scoped to library-resource types.
- **`ContentManager.tsx`** — same contract shape, single consumer (`news`). Worth confirming in ADM-SPR-002 whether this is genuinely a distinct pattern or should be merged into `ResourceManager`.
- **CUSTOM pages** — each defines its own contract via a colocated `actions.ts` (Server Actions), directly typed against a specific Supabase table, bypassing the `SUPABASE_COLLECTIONS` allowlist and the `/api/admin/collections` REST surface entirely. This is not a defect — these are pages bound to pre-existing typed tables (`orders`, `users`, `coupons`, etc.) where a generic jsonb collection contract would be the wrong fit — but it means "Admin module contract" is really two contracts, not one, and ADM-SPR-002 documentation should say so explicitly rather than pretend a single unified contract exists.

---

## 8. Role and Permission Matrix

**Current state: a single boolean.** `members.is_admin` is the *only* authorization column that exists — confirmed against the full `members` schema (`id, full_name, referral_code, is_admin, created_at, date_of_birth, date_of_birth_hidden, identity_type`). `requireAdmin()` checks exactly this boolean; all 16 `requireAdmin()` call sites across every `actions.ts` file do the identical `if (!(await requireAdmin())) return { error: "Unauthorized" }` with no further role logic. Grep for `role|permission` across every admin action file returns zero matches. No `role` enum, no `permissions` json/array column, no prior schema attempt at richer authorization exists anywhere.

There is no prior design intent for admin-side roles either — the two docs that use role-shaped language (`ROLE_RESPONSIBILITY_MATRIX.md`, module data-ownership boundaries; `ROLE_SELECTION_ENGINE.md`, Companion's conversational persona modes) are both about different concepts entirely, not admin RBAC.

Per the brief's explicit instruction ("Do not implement a complex enterprise RBAC engine if one does not exist... implement only the smallest safe foundation needed"), this sprint does **not** implement the 7-role model. It records the target verb matrix as a specification for ADM-SPR-002+ to build toward, and flags that reaching it requires a real schema change (a `role` column or table) that is out of this sprint's scope:

| Role | View | Create | Edit | Publish | Delete | Manage Users |
|---|---|---|---|---|---|---|
| Founder/Owner | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Editor | ✓ | ✓ | ✓ | — | — | — |
| Reviewer | ✓ | — | — | ✓ (approve only) | — | — |
| Instructor | ✓ (own content) | ✓ (own content) | ✓ (own content) | — | — | — |
| Support | ✓ (orders/tickets only) | — | — | — | — | — |
| Read-only/Analyst | ✓ | — | — | — | — | — |

**Smallest-safe-foundation recommendation for ADM-SPR-002** (not implemented here, this is a forward specification): add a single `role` text column to `members` (nullable, defaulting existing `is_admin=true` rows to `"admin"`), and have `requireAdmin()` grow an optional `requiredRole` parameter — additive, backward-compatible, no breaking change to the 16 existing call sites. Building the actual verb-level enforcement per module is EPIC-02 module-build work, not foundation work.

---

## 9. Content Lifecycle

**Current state: no true lifecycle exists.** There is no Draft → In Review → Changes Requested → Approved → Published → Archived workflow anywhere in the codebase. What exists is a narrower, UI-only convention:

- A **Draft/Published/Hidden** three-state badge (`src/components/admin/ui/Badge.tsx:19-29`, `STATUS_TONE` map) used as a `CrudPage` filter across many collections (`blog`, `roadmap`, `knowledge-seed`, `updates`, `student-success`, all `portal-builder/*` sub-pages, `affiliate-hub`, digital-assets category pages).
- A separate **Active/Inactive** two-state pattern for a different subset (`affiliate-hub/top-products`, `portal-builder/banner`, `portal-builder/cta`, `affiliate/links`, `digital-assets/categories`, `community`).
- `courses.status` is unrelated to either — a free-text field constrained client-side to exactly `["open", "coming"]` (sellability, not editorial state).
- CKOS tables (`ckos_workflows`, `ckos_goals`, `ckos_prompt_templates`, `ckos_evaluation_models`) do have a real `version` + `status` lifecycle column pair — the only place in the codebase where genuine content versioning exists, but these tables are unmigrated to production per §4 finding #5.

**Critical caveat, worth repeating from §7:** the Draft/Published/Hidden badge is only real, server-persisted state for collections inside the `SUPABASE_COLLECTIONS` allowlist. For any collection key outside it (confirmed case: `knowledge-seed`), the same badge is fully functional in the UI but writes to per-browser `localStorage` — meaning two different admins looking at the same page can see different "Published" states, and nothing is actually published to end users when that toggle is flipped.

Per the brief ("Do not implement full workflow automation in this sprint unless a safe existing foundation already exists"), this sprint does not build the 6-state lifecycle. The safe existing foundation to build on for ADM-SPR-002 is the CKOS tables' `version`/`status` pair — extending that pattern to other content types is a smaller lift than inventing a new mechanism, and should be the recommended approach when that work is scoped.

---

## 10. Premium Management Specification

Written against the ADR-004-approved target model (Course = canonical purchasable entity; Lesson belongs only to a Course, not sold directly; Product = standalone products/services only), while recording exactly where today's implementation diverges — per the brief, **this sprint changes no schema and no checkout logic**; this section is a specification for future implementation work, not a changelog of what was done now.

**Current `courses` schema:** `id, name, status, price` — four columns only. No description, thumbnail, SEO fields, or sort order. `status` is unconstrained free text (client-enforced to `open`/`coming`), not a DB check constraint.

**Current `lessons` schema:** `id, title, description, video_url, pdf_url, price, active, sort_order` — used exclusively by `/portal/vdai-academy`. **Confirmed zero FK or join anywhere between `lessons` and `courses`.** Course and Lesson are today two fully independent commercial concepts, which is the exact state ADR-004 exists to resolve.

**`PREMIUM_PROGRAMS`** (`premium-programs.ts`) — 5 hardcoded program objects (copy, topics, pricing tier metadata, accent colors) matched to live `courses` rows only by fuzzy string-matching `matchPatterns` against `courses.name`. Everything except price/ownership/open-status is static TS, not admin-editable.

**Orders schema:** `id, member_email, product_name, amount, status, customer_name, customer_phone, lesson_id, course_id, product_id, order_code, payment_reference, created_at, confirmed_at` — a 3-way polymorphic reference (`lesson_id`/`course_id`/`product_id`), exactly the ambiguity ADR-004 targets. `createOrder` resolves price server-side via `ITEM_TABLE = {product: "products", lesson: "lessons", course: "courses"}`.

**Confirmed gap, worth flagging even though out of this sprint's scope to fix:** `my-products`/`account` pages join `products(...)` and `lessons(...)` but never `courses(...)`. A purchased **course** today has no dedicated content-delivery join in the UI — it falls back to the flat `product_name` text field with no unlock UX. This is a real user-facing gap under the current (pre-ADR-004-implementation) data model, not just a documentation nit.

**Entitlement model:** flat boolean via `getPurchasedIds()` — `orders.status='confirmed'` matched by `member_email` against one of the three polymorphic id columns. No per-chapter unlock, no tiering, no expiry.

**Recommendation for the eventual ADR-004 implementation sprint** (not this one): the FK consolidation should happen at the `orders` table first (introduce a single `purchasable_type`/`purchasable_id` pair or migrate everything to `course_id`), since that is the one table every other gap in this section (the missing `courses` join, the polymorphic entitlement check) traces back to.

---

## 11. Companion Studio Specification

**Current state: no admin surface exists.** This is the largest single gap this sprint surfaced.

- **Persona/voice** (`companion-identity.ts`, `warmth-engine.ts`, `human-flow.ts`) — 100% hardcoded TS constants, explicitly commented as approved by "Founder + Product Co-Designer" and not to be changed without a Product Team decision. No DB table, no admin read or write path.
- **`AGENT_REGISTRY`** (`src/companion/agents/agent-registry.ts`) — 32 entries across 8 Portal modules, **all `status:"planned"`, zero `"active"`**. `companion-orchestrator.ts` self-documents as rule-based, not yet calling a real LLM — it builds a deterministic fake "action plan" with steps pre-marked `done`. This is planning metadata, not a working system, and today has zero admin visibility.
- **Memory** — two disconnected systems: `memory_capsules` (Supabase, real data) and `growth-view.ts`'s localStorage-based event log. Grepping all 25 Admin sections for either returns zero matches — no admin page anywhere can see, moderate, or manage either memory system.
- **CKOS ingestion pipeline** (the brief's target "Internet → Trusted Source Filter → Review Queue → Admin/Expert Approval → CKOS → Companion" flow) — **confirmed to not exist in code anywhere.** The only "approval" concept in the codebase is an unrelated one (AI Workspace's own Draft/Reviewed/Needs-Revision/Approved flow for user-generated Mission outputs). "Trusted Companion" appears only in aspirational docs that explicitly say no code threshold is defined yet.
- **Evaluation/conversation-quality review** — not built. The CKOS `ckos_evaluation_models` route explicitly disclaims that Evaluation Intelligence isn't built; it only exposes an empty schema table "for structural completeness."
- **Versioning/audit trail for Companion config** — none. Any persona/voice change today requires a code deploy tracked only by git, invisible to any admin-facing changelog.

Per the brief ("Do not implement Companion runtime in this sprint"), no code changes are proposed here. The specification for ADM-SPR-002+ to scope against:

1. A minimal **Companion Studio read-only dashboard** first — surfacing `AGENT_REGISTRY` status, memory-system counts, and CKOS table row-counts — is a safer, smaller first step than building any write/editing surface, since it requires no new mutation paths or safety review.
2. Persona/voice editing should stay out of Admin until a Product Team decision explicitly reverses the current "don't change without Product Team decision" comment guarding those files — this sprint treats that guard as still in force.
3. The trusted-source/review-queue pipeline is a net-new system, not a foundation gap — it should be scoped as its own future epic, not folded into "Admin foundation."

---

## 12. Legacy Admin Sunset Plan

Per the brief: **do not delete legacy Admin in this sprint, do not migrate production data in this sprint.** This section is a plan, not an action taken.

**Phase 1 — Freeze (recommended for ADM-SPR-002, not done here):** Add a visible banner to `admin.html` stating it is Legacy and pointing operators to the Canonical Admin equivalent for each of the 11 overlapping sections (§13 R1 table). This alone would materially reduce Risk R1 without touching any data.

**Phase 2 — Redirect writes:** For each of the 11 colliding write paths, confirm Canonical Admin has full parity (it already does for all 11, per §3/§13), then disable the corresponding *write* actions in `admin.html` (read-only view remains, so operators mid-task aren't stranded), starting with the two highest-risk sections: Orders and Members/Users (financial and access-control data).

**Phase 3 — Full sunset:** Once Phase 2 has run with zero incidents for an agreed window, remove `admin.html` from routing/deployment entirely. Data cleanup for the now-fully-orphaned tables (`blog_posts`, `prompt_templates`, the legacy `case_study` jsonb table) is a separate, explicit migration decision requiring its own PMO sign-off — not automatic on sunset.

**Not recommended:** deleting `admin.html` outright in one step. Per Agent 1's confirmed finding, it is still a live write path today; a single-step deletion without Phase 1/2 first would be the riskiest possible sequencing, not the safest.

---

## 13. Risks

**R1 — CRITICAL. Legacy Admin is a live, competing write path on production data, not a passive reference.**
`admin.html` actively writes to 18 Supabase tables today. 11 of its 19 sections write to the same table (or same concept, different table) as a Canonical Admin page that also writes there, with no coordination between the two:

| Concern | Legacy section | Canonical route | Shared/colliding table |
|---|---|---|---|
| Courses/pricing | `courses` | `/admin/course-pricing` | `courses` |
| Coupons | `coupons` | `/admin/coupons` | `coupons` |
| Orders | `orders` | `/admin/orders` | `orders` |
| Leads | `leads` | `/admin/leads` | `leads` |
| Support tickets | `support` | `/admin/support` | `support_tickets` |
| Products | `products` | `/admin/premium` | `products` |
| Submissions/projects | `submissions` | `/admin/projects` | `submissions` |
| Case studies | `casestudies` | `/admin/case-study` | `case_studies` |
| Members/users | `members` | `/admin/users` | `members` |
| Blog | `blog` | `/admin/blog` | different tables (`blog_posts` vs `blog`) — content can silently diverge |
| Prompts | `prompts` | `/admin/prompts` | different tables (`prompt_templates` vs `prompts`) — content can silently diverge |

Any operator who still has an `admin.html` bookmark can edit live orders, member admin-flags, or coupons through a path the Canonical system has no visibility into. This is the top-priority item for §12 Phase 1.

**R2 — HIGH. Legacy Admin's auth model is materially weaker and independently risky.**
`admin.html`'s access check is purely client-side: `session.user.email === ADMIN_EMAIL || member?.is_admin === true`, where `ADMIN_EMAIL` is the hardcoded string `'duongvv.vn@gmail.com'`. There is no middleware/edge enforcement — this is trivially bypassable by disabling JS or forging client state, unlike Canonical Admin's network-edge + server-action double-gate. This is a real security gap independent of ADR-007's canonicalization decision, and should be treated with urgency proportional to R1, not deferred alongside the rest of the sunset plan.

**R3 — MEDIUM. No role/permission model beyond a single boolean.** Any user with `is_admin=true` has full, unrestricted access to every one of the 49 Canonical Admin routes — orders, member management, settings, everything. There is no way today to grant a support agent ticket-only access, or an editor content-only access, without giving them the same access as the Founder. See §8.

**R4 — MEDIUM. Silent localStorage fallback for non-allowlisted collections.** Any `CrudPage`/`ResourceManager` collection key not present in `SUPABASE_COLLECTIONS` (confirmed case: `knowledge-seed`) silently persists to per-browser `localStorage` instead of the database, with no warning shown to the admin using it. An admin editing "Knowledge Seed" content today may reasonably believe they are updating what users see, when they are not. This is a trap for the next person who adds a new collection without checking the allowlist first.

**R5 — LOW/MEDIUM. Three confirmed three-way (or two-way) data-source splits** (Lessons, Prompts, Resources — §4 findings #1-3) mean an admin editing one of these content types may be editing a copy that is not the one rendered on the live site. Lower urgency than R1/R2 since it's a correctness/confusion risk, not a security or write-collision risk, but should be sequenced early in ADM-SPR-002 since it undermines trust in the CMS itself.

**R6 — LOW. No rich-content editing or asset-upload tooling exists.** Not a defect introduced this sprint, but worth flagging as a real gap for a "CMS foundation" — every content field today is a plain textarea or URL string.

---

## 14. Recommended Admin Sprint Sequence

1. **ADM-SPR-002 — Risk mitigation & IA regroup.** R1 Phase 1 (legacy banner) and R2 (harden or disable legacy auth) first, since these are live risks, not backlog items. In parallel: remap `nav.ts` to the target 14-module structure (§5/§6), and fix the three data-source splits (R5) since they're prerequisites for any module actually being trustworthy.
2. **ADM-SPR-003 — Role foundation.** Add the minimal `role` column + `requireAdmin(requiredRole?)` extension (§8), scoped to the smallest safe foundation, not the full 7-role matrix at once.
3. **ADM-SPR-004 — Content lifecycle foundation.** Extend the CKOS `version`/`status` pattern to 1-2 other content types as a proof of the mechanism, rather than building all 6 lifecycle states everywhere simultaneously.
4. **ADM-SPR-005 — Premium/ADR-004 implementation.** The `orders` FK consolidation and `courses` join fix (§10) — a discrete, well-scoped implementation sprint once the above foundation is stable.
5. **ADM-SPR-006 — Companion Studio read-only dashboard.** Visibility first (§11 recommendation #1), before any editing surface.
6. **ADM-SPR-007+ — Legacy Admin Sunset Phases 2-3**, once ADM-SPR-002 through 005 have given Canonical Admin full, trusted parity.

This ordering exists to front-load risk reduction (R1/R2) before any new-feature work, per this sprint's own top finding.

---

## 15. Readiness Assessment for ADM-SPR-002

**CONDITIONAL YES — ADM-SPR-002 can begin**, with two items PMO should explicitly decide first, since both are judgment calls this sprint is not authorized to make unilaterally:

1. **Sequencing:** does PMO want ADM-SPR-002 to start with the R1/R2 risk-mitigation work (this document's recommendation, §14 step 1), or with the navigation/IA regroup on its own, treating legacy-Admin risk as a separately-scoped fast-follow? Both are reasonable; the choice affects how ADM-SPR-002's brief should be scoped.
2. **Legacy Admin freeze authorization:** §12 Phase 1 (adding a "this is Legacy" banner to `admin.html`) is a trivial, safe UI-only change to a page this sprint was told not to modify beyond "clearly safe dead-link fixes." Whether that falls inside or outside the next sprint's allowed-changes list should be stated explicitly in that sprint's brief, rather than assumed.

No other blocker was found. The Canonical Admin's existing shell, auth, and page-shell patterns are sound enough to build on immediately; nothing discovered this sprint requires a redesign or a schema change before ADM-SPR-002 can start.

---

## Verification (this sprint)

- **Lint (`npm run lint`):** 0 errors, 5 pre-existing warnings (all `@next/next/no-img-element`, unrelated files, unrelated to this sprint's changes).
- **Type-check + production build (`npm run build`):** succeeds cleanly. All routes compile, including the 4 newly-linked Admin routes (`/admin/affiliate-hub/top-products`, `/admin/digital-assets/projects`, `/admin/digital-assets/articles`, `/admin/news`).
- **Existing automated tests (`npm run test`):** 139/139 passed across 24 test files, no regressions from the `nav.ts` change (nav data only, no logic change) or the documentation-only edits.
- **Admin route verification:** all 49 routes confirmed to resolve to a real `page.tsx` (§3); the 4 previously-orphaned routes are now linked from the sidebar (§6).
- **Duplicate Admin write-path search:** completed, see §13 R1 — 11 confirmed colliding/overlapping write paths between `admin.html` and Canonical Admin.

---

## Scope discipline note

Per the brief's explicit Out of Scope list, this sprint did **not**: build any new CRUD module, migrate production data, change any database schema, refactor checkout, implement any ADR-004 database change, delete legacy Admin, build Companion runtime, build full analytics, add any feature unrelated to Admin foundation, redesign Portal, or modify Portal's feature-frozen behavior. The only code change made was the 4-line `nav.ts` addition described in §6. Everything else in this document is research, specification, and recommendation — submitted to PMO for review and decision, not self-approved.
