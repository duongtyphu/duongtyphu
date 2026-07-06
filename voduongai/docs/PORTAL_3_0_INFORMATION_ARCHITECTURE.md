# PORTAL 3.0 — P.1 Information Architecture

Status: **DRAFT — pending Architecture Review sign-off** (see §7)
Supersedes: `docs/THE_PORTAL_ARCHITECTURE_FREEZE.md` §II sidebar model (flat 11-item list) and
`docs/OS_CONTENT_BLUEPRINT.md` 5-hub model (Journey/Knowledge/Build/Connect/Legacy), per the
explicit Master Execution Order authorizing sidebar/nav/layout redesign. The Freeze doc's
**shell mechanism** (single `layout.tsx`, no per-project sub-layouts, `PortalShell` never
overridden, `CompanionPresence` never disabled) is **kept** — only the content model of the
sidebar and the hub taxonomy change.

---

## 1. Current-state map (as of this audit)

### 1.1 Sidebar today (`src/lib/portal/hubs.ts` → `portalNavSections`, flat, no groups)

1. Trang chủ Học viện — `/portal`
2. Companion — `/portal/companion`
3. Hệ tri thức AI — `/portal/hetrithucai`
4. Học viện AI — `/portal/hocvienai`
5. AI Workspace — `/portal/aiworkspace`
6. Dự án & Cơ hội — `/portal/duan-cohoi`
7. Premium — `/portal/premium`
8. Cộng đồng — `/portal/congdongai`
— divider —
9. Nhật ký học tập — `/portal/nhatkyhoctap`
10. Hành trình của tôi — `/portal/hanhtrinhcuatoi`
11. Khu vườn của bạn — `/portal/khuvuoncuaban`

### 1.2 Parallel, second IA layer (`portalHubs`, drives 4 hub-landing pages: `knowledge`/`build`/`connect`/`legacy`, plus `journey`)

A richer 5-hub model (Journey / Knowledge / Build / Connect / Legacy) already exists and nests
most of the same routes as sub-items — e.g. "Dự án & Cơ hội" and "Premium" both appear as
top-level sidebar items **and** as sub-items under the Build hub. This is a duplicate taxonomy
maintained by hand in the same file, currently the single largest IA inconsistency.

### 1.3 Structural problems found

| # | Problem | Evidence |
|---|---|---|
| P1 | Two live, un-consolidated Academy surfaces | `hocvienai/page.tsx` (current) and `vdai-academy/page.tsx` (still live, own checkout list) — `ai-academy/page.tsx` is a pure redirect to `hocvienai`, but `vdai-academy` was never folded in |
| P2 | Two Journey routes | `hanh-trinh-cua-toi/page.tsx` and `hanhtrinhcuatoi/page.tsx` — only the latter is wired to `getHub("journey")`; the former is a stale duplicate slug |
| P3 | CKOS has zero portal-facing UI | 6 read-only API routes exist (`/api/v1/ckos/{goals,tools,prompts,workflows,evaluations,search}`); grep across `src/app` and `src/components` found **no page or component consuming any of them** — CKOS today is API-only |
| P4 | Projects & Opportunities entangled with Build/Affiliate | `/portal/duan-cohoi` exists as a real page, but its content (DigiU/SolarGroup/Crypto/Blockchain/Trading) is modeled as Build-hub sub-items and digital-assets categories, not as its own IA branch |
| P5 | Premium duplicated | appears as its own sidebar item *and* as a Build-hub sub-item |
| P6 | Sidebar frozen at "6 Gem Hub items" by `THE_PORTAL_ARCHITECTURE_FREEZE.md`, actual sidebar has 11 flat items — the freeze doc itself is already out of sync with the shipped sidebar |
| P7 | `Workspace` is a single thin page (`portal/workspace/page.tsx`) with no clear relationship to the AI Workspace content hub (`portal/aiworkspace/*`) — naming collision between two different concepts ("Workspace" as companion session vs. "AI Workspace" as content hub) |

---

## 2. Target IA — 7-pillar model

Per the Master Execution Order, the Portal is rebuilt around **user growth**, not menus, using this
mandatory axis:

```
Companion → CKOS → Academy → Projects & Opportunities → Premium → Journey → Workspace
```

Each pillar becomes exactly one top-level sidebar entry. Sidebar returns to a **grouped**
structure (unlike the current flat list) to separate the growth axis from account/utility
items, but retains the Freeze's non-negotiables: one nav source of truth, no per-project sidebar
injection, PortalShell/Header/Search/CompanionPresence untouched as shell mechanism.

### 2.1 Sidebar v3.0 (proposed)

**Primary — the 7 pillars, in mandated order:**

1. **Companion** — `/portal/companion` (home surface: greeting, today's suggestion, "what should I do next")
2. **CKOS** — `/portal/ckos` *(new)* — canonical Tool/Prompt/Workflow/Resource/Lesson/Best Practice/Case Study browser, powered by the existing `/api/v1/ckos/*` read routes
3. **Academy** — `/portal/academy` *(renamed/consolidated from `hocvienai` + `vdai-academy`)*
4. **Projects & Opportunities** — `/portal/duan-cohoi` (kept slug, promoted to a real standalone pillar — no longer nested under Build)
5. **Premium** — `/portal/premium` (kept slug, de-duplicated — removed as a nested item elsewhere)
6. **Journey** — `/portal/hanhtrinhcuatoi` (kept slug; `hanh-trinh-cua-toi` becomes a redirect, mirroring the existing `ai-academy → hocvienai` pattern)
7. **Workspace** — `/portal/workspace` (becomes the unification point: where Companion + CKOS objects + Academy lessons + Projects converge into an actionable session — absorbs the content-hub role currently played by `aiworkspace`)

**Secondary — utility/account, visually separated (unchanged in spirit from today's divider):**

8. Cộng đồng — `/portal/congdongai`
9. Nhật ký học tập — `/portal/nhatkyhoctap`
10. Khu vườn của bạn — `/portal/khuvuoncuaban`
11. Tài khoản / Sản phẩm của tôi (existing `account`, `my-products`) — surfaced via `PortalUserMenu`, not the sidebar (consistent with Freeze §II header component map)

### 2.2 Route consolidation plan

| Old route(s) | New pillar | Action |
|---|---|---|
| `hocvienai`, `vdai-academy`, `ai-academy` (redirect) | Academy | Merge `vdai-academy`'s live checkout/lesson-list logic into `academy` page content; `ai-academy` and `vdai-academy` both become redirects |
| `hanh-trinh-cua-toi`, `hanhtrinhcuatoi` | Journey | Keep `hanhtrinhcuatoi` as canonical, make `hanh-trinh-cua-toi` a redirect |
| *(none — greenfield)* | CKOS | New `portal/ckos/page.tsx` + `[type]/[slug]` detail routes, reading the existing 6 API routes client-side |
| `duan-cohoi` + Build-hub DigiU/SolarGroup/Crypto/Blockchain/Trading sub-items | Projects & Opportunities | Promote to standalone pillar; Build-hub sub-items become in-page sections of this one route, not separate hub nesting |
| `premium` (top nav) + Build-hub Premium sub-item | Premium | Remove the Build-hub duplicate entry; single source |
| `aiworkspace/*`, `workspace` | Workspace | `workspace` absorbs the unifying "session" role; `aiworkspace` content (bai-viet/nghe/[slug]) becomes content served *through* Workspace rather than a parallel hub |
| `hetrithucai`, `prompts`, `tools`, `templates`, `checklists`, `sop`, `resources`, `practice`, `case-studies` | CKOS + Academy (split) | Library-shaped content (Prompt/Tool/Template/Checklist/SOP/Resource) surfaces under **CKOS** (they are exactly the 7 canonical CKOS object types); course/curriculum-shaped content stays under **Academy** |
| `roadmap`, `start-here` | Journey | Already conceptually Journey sub-content per today's `portalHubs.journey.modules` — stays, now nested inside the Journey pillar page instead of a separate hub |
| `congdongai`, `nhatkyhoctap`, `khuvuoncuaban`, `achievements`, `experts`, `mirror`, `origin`, `personal-brand`, `saved`, `services`, `story`, `student-success`, `support`, `updates`, `ai-assistant` | Secondary/utility | Kept as-is for now; candidates for a later consolidation pass (P.10/P.11), not blocking P.1 |
| `digital-assets/*`, `goals/*`, `checkout/*`, `my-products`, `account`, `referral`, `earn`, `affiliate-hub` | Cross-cutting (commerce/account) | Unaffected by pillar redesign — remain reachable via Premium (commerce) and account menu (utility), not part of the growth axis |

### 2.3 CKOS pillar — concrete shape

This is the one pillar with **zero existing UI** (P3 above), so it's specified in more detail:

- `portal/ckos/page.tsx` — landing: 7 canonical object types (Tool, Prompt, Workflow, Resource,
  Lesson, Best Practice, Case Study), each a card linking to a filtered list, consuming
  `/api/v1/ckos/search?type=...` for counts.
- `portal/ckos/[type]/page.tsx` — list view per type, backed by the matching existing route
  (`/api/v1/ckos/tools`, `/prompts`, `/workflows`; `evaluations`/`goals` stay API-only until a
  future H-phase gives them a canonical UI need). **Resource/Lesson/Best Practice/Case Study
  do not yet have `/api/v1/ckos/*` routes** — Phase H.6–H.8 only produced schema + dry-run seed
  SQL for these, nothing has been applied to production. The CKOS pillar UI for those 4 types
  therefore ships **after** a Product-Owner-approved apply of H.6/H.7/H.8 SQL and 4 new API
  routes (`/api/v1/ckos/resources`, `/lessons`, `/best-practices`, `/case-studies`) — tracked as
  a P.4 sub-task, not a P.1 blocker.
- `portal/ckos/[type]/[slug]/page.tsx` — detail view.

---

## 3. Companion-first framing

Every pillar answers "what should I do next" via the same mechanism already partially built in
`src/lib/portal/foundation/*` (mission-runtime, goal-runtime, growth-view): each pillar's landing
page surfaces one Companion-suggested next action above the fold, sourced from
`companion-manager.ts` state — no new state system, reuse what exists.

---

## 4. What is explicitly NOT changing in P.1

- `PortalShell`, `PortalHeader`, `PortalSearch`, `CompanionPresence`, `NotificationTicker`,
  `FirstFootprintCeremony`, `OnboardingJourney` — shell mechanism stays exactly as documented in
  the Freeze doc.
- No Supabase schema/data changes — this is IA/navigation only.
- No CKOS SQL is applied to production as part of P.1 (H.6–H.8 remain dry-run/unapplied).
- Secondary/utility routes (§2.2 last two rows) are not touched in P.1 — they're inventoried but
  deferred, so the phase stays scoped to the 7-pillar restructure.

---

## 5. Open questions for Product Owner (before P.2 starts)

1. Should `vdai-academy`'s live checkout/lesson flow be a literal merge into `academy`, or should
   Academy become a thin landing page that deep-links into the existing checkout flow unchanged?
   (Affects how much of `vdai-academy/page.tsx` logic needs touching vs. just re-routing.)
2. Confirm "Projects & Opportunities" should absorb the DigiU/SolarGroup/Crypto/Blockchain/Trading
   verticals wholesale, or if any of those should remain under Premium (they are commerce-adjacent).
3. Confirm secondary nav item set (Cộng đồng / Nhật ký học tập / Khu vườn của bạn) — keep as-is or
   fold any into a pillar (e.g. Khu vườn → part of Journey)?

---

## 6. Phase order (recap, per Master Execution Order)

P.1 IA (this doc) → P.2 Design System → P.3 Companion → P.4 CKOS → P.5 Academy →
P.6 Projects & Opportunities → P.7 Premium → P.8 Workspace → P.9 Journey → P.10 Responsive &
Polish → P.11 QA → P.12 Release Candidate.

---

## 7. P.1 Review

- **Architecture Review**: 7-pillar model is additive over existing routes — no route deleted
  outright in P.1, only redirects added for true duplicates (P1/P2 above). Risk: low.
- **UX Review**: sidebar count goes from 11 flat items to 7 primary + 4 secondary — reduces
  choice at the primary level, matches "answer what should I do next" objective.
- **Content Review**: no copy rewritten in P.1 (navigation/routing only); content rewrite is P.3–P.9.
- **CKOS Review**: 3 of 7 canonical types (Tool/Prompt/Workflow) have real API routes today;
  Resource/Lesson/Best Practice/Case Study UI is explicitly gated on a production apply decision
  outside P.1 scope.
- **Performance/Mobile Review**: not applicable yet — no components built in P.1.

**Verdict: ready to proceed to P.2 (Design System)**, pending Product Owner answers to §5 (can
proceed in parallel — none of the 3 questions block starting the design system work).
