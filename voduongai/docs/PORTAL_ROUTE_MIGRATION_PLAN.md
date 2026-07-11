# PORTAL 4.0 — ROUTE MIGRATION PLAN

**STATUS: AUDIT + PLAN ONLY — NOT IMPLEMENTED. NO ROUTE HAS BEEN CHANGED.**
**Wait for explicit Product Owner approval before starting Phase 2 of this plan.**

**PRODUCT OWNER DECISION — recorded:** defer the actual rename (Phases 2–5). Phase 1 groundwork (§6) — config-driven middleware, the two dead-redirect bugfixes, the new link-integrity test — proceeds now, independent of the deferred rename, since none of it changes any URL.

**Phase 1 — DONE:**
- `src/lib/protected-routes.ts` added (`PROTECTED_ROUTE_PREFIXES` + `isProtectedRoute()`); `src/middleware.ts`'s auth check now reads from it instead of an inline `pathname.startsWith("/portal")` literal. `config.matcher` is unchanged (Next.js requires it to stay static string literals) but now carries a comment pointing at the shared source of truth.
- The two dead redirects (`/portal/growth → /portal/build`, `/portal/ecosystem → /portal/connect`) removed from `next.config.ts` — traced via `git log` to the very first commit that created the file; no evidence either destination ever existed as a real route, so per the project's no-fabricated-data standard they were removed rather than repointed to a guessed destination.
- `src/__tests__/route-integrity.test.ts` added — a filesystem/regex-based static check (no new test-runner dependency) that (1) every hardcoded internal link literal in `src/**` resolves to a real route or a known redirect source, and (2) every `next.config.ts` redirect destination resolves to a real route. It would have caught the dead redirects above had it existed earlier. One legitimate finding on first run: `/solo` (Học viện AI page) links to the VDAI SOLO course page, which is real but lives outside this Next.js app's own route tree — added to an explicit, commented allowlist rather than silently ignored.

---

## 0. Executive Summary

Removing the `/portal/` URL prefix (e.g. `/portal/duan-cohoi/digiu/alphamind` → `/du-an-co-hoi/digiu/alphamind`) is **mechanically simple but operationally large**: one route segment disappears, but that segment is referenced **1,309 times across 287 files**, it is also the single string the auth middleware uses to decide what's protected, and it touches the checkout/payment flow.

Three things block a safe migration today and must be resolved **before** any code changes:

1. **Portal Home has no home.** `/portal` (root) cannot simply become `/` — `/` is already the public marketing homepage (`src/app/page.tsx`). This is not in any of the brief's examples and needs a Product Owner decision (see §3).
2. **Auth is keyed to a single hardcoded string.** `src/middleware.ts` protects everything via `pathname.startsWith("/portal")`. Once the prefix is gone there is no single string left to gate on — the middleware needs a structural change, not a find-and-replace.
3. **There is no routing safety net.** Of 23 test files that mention `/portal/`, none test redirects, middleware, or link integrity. A 1,300-reference sweep today would ship with zero automated protection against a broken link.

**Recommendation (§13): defer the actual rename until after the Portal Master Audit**, but do the low-risk groundwork (config-driven middleware, dead-redirect fixes, a new link-integrity test) now, independent of the go/no-go decision. Full reasoning in §13.

---

## 1. Audit Findings

### 1.1 Route inventory

`src/app/portal/` contains **~65 distinct destination routes** (static + dynamic) across 9 pillars, plus standalone utility pages, plus 6 redirect-stub/archived files kept for URL history. One `layout.tsx` wraps the entire subtree (no nested layouts).

| Pillar (current slug) | Route files | Dynamic children |
|---|---|---|
| `hetrithucai` (CKOS library) | 3 | `[slug]`, `collection/[slug]` |
| `aiworkspace` | 4 (1 is a redirect stub: `nghe/[slug]` → `[slug]`) | `[slug]`, `bai-viet/[slug]` |
| `duan-cohoi` | 4 | `[ecosystemSlug]`, `[ecosystemSlug]/[subProjectSlug]`, `bai-viet/[slug]` |
| `hanhtrinhcuatoi` | 3 (1 is an **archived duplicate**: `hanh-trinh-cua-toi`, hyphenated dupe of the unhyphenated canonical) | `ban-do` |
| `hocvienai` | 4 (2 pure redirect stubs: `ai-academy`, `personal-brand`) | — |
| `congdongai` | 4 (2 archived, 1 redirect stub: `experts`) | — |
| `nhatkyhoctap`, `khuvuoncuaban`, `mirror`, `story` | 1 each (Journey "doors" — currently flat top-level routes, **not** nested under `hanhtrinhcuatoi`) | — |
| `companion` / `su-menh-companion` | 5 (two parallel "Companion" entry points — a pre-existing duplicate-route finding from the Companion Architecture audit, not caused by this migration) | `companion-qua-hinh-anh` |
| `digital-assets`, `goals`, `checkout`, `prompts`, `resources`, `tools` | 3, 3, 2, 2, 2, 2 | `[slug]`/`[id]`/`[categorySlug]` etc. |
| 21 standalone pages | `account`, `achievements`, `affiliate-hub`, `ai-assistant`, `case-studies`, `checklists`, `ckos`, `earn`, `my-products`, `origin`, `practice`, `premium`, `referral`, `roadmap`, `saved`, `services`, `sop`, `start-here`, `support`, `templates`, `vdai-academy`, `workspace` | — |

Two **pre-existing dead redirects** were found in `next.config.ts` during this audit (unrelated to the prefix question, worth fixing regardless): `/portal/growth → /portal/build` and `/portal/ecosystem → /portal/connect` — neither `/portal/build` nor `/portal/connect` exists as a route.

**Outside `/portal/`:** `/`, `/about`, `/contact`, `/disclaimer`, `/privacy`, `/refund-policy`, `/terms`, `/login`, `/reset-password`, `/auth/callback`, `/blogai(+[slug])`. All plain English, unaccented, hyphenated-when-multiword. No `/solo` or `/scale` route exists in this app (referenced in `CLAUDE.md` conventions but not present in `src/app/` — likely lives elsewhere or isn't built yet). **No naming collisions with any proposed new Portal slug except the `/` root (see §3).**

**`/admin/` (71 files):** fully isolated, no naming collisions with `/portal/` pillar names, unaffected by this migration except for 5 files with hardcoded `viewHref`/`revalidatePath` links into `/portal/*` (§1.8).

**`/api/` (13 routes):** `/api/webhooks/sepay` (payment webhook) and 6 routes under `/api/v1/ckos/*`. Confirmed outside the middleware matcher entirely — zero impact from this migration (§1.6).

### 1.2 Middleware & auth gate — the real choke point

`src/middleware.ts`:

```ts
const isPortalRoute = request.nextUrl.pathname.startsWith("/portal");
...
export const config = { matcher: ["/portal/:path*", "/login", "/admin/:path*"] };
```

Every one of the ~65 Portal routes is protected **exclusively** because it starts with `/portal`. There is no allowlist, no per-route flag, no route-group marker — just this one string check. This is the single highest-risk piece of this migration: get it wrong for even one route and either (a) a paid/private page becomes publicly reachable, or (b) a page that should be public (rare, but e.g. none currently) gets incorrectly gated.

`/login` also redirects an already-authenticated user to `/portal` — one more hardcoded literal to change.

### 1.3 Reference census

**1,309 occurrences of the literal string `/portal/` across 287 files.** Approximate breakdown:

| Bucket | Occurrences |
|---|---:|
| `src/app/portal/**` (in-page breadcrumbs/CTAs/internal links) | 403 |
| `src/components/portal/**` (shared UI) | 351 |
| `src/lib/portal/**` (Companion routing, workspace runtime) | 255 |
| `src/data/**` (static data with hardcoded hrefs) | 137 |
| Test files (incidental fixture data, not route tests) | 73 |
| `src/companion/**` | 27 |
| `src/features/**` | 32 |
| Root app files (`sitemap.ts`, `robots.ts`, `middleware.ts`) | 27 |
| `src/components/site/**`, `src/components/home/**` | 35 |
| `src/app/admin/**` | 17 |
| `src/app/api/**` | 8 |
| Everything else | ~15 |

Top single-file offenders: `src/data/blog.ts` (64), `src/components/portal/companion/CompanionPresence.tsx` (39), `src/app/portal/ckos/page.tsx` (33), `src/components/portal/ai-space/WorkspaceMvp.tsx` (32), `src/lib/portal/companion/route-context.ts` (30), `src/lib/portal/companion/proactive-thoughts.ts` (30), `src/app/sitemap.ts` (22).

### 1.4 High-leverage choke-point files

Fixing these first would resolve navigation for the large majority of real user journeys before touching the long tail:

- **`src/lib/portal/hubs.ts`** — single source of truth for the sidebar (`portalHubs`, `portalNavSections`); consumed by `src/lib/site.ts` → `PortalSidebar.tsx` and `MobileNavDrawer.tsx`. One file change, both desktop and mobile nav fixed.
- **`src/lib/portal/companion-workspace.ts`** — the one function behind every "Thực hành cùng Companion / Bắt đầu Workspace" button across the whole Portal.
- **`src/lib/portal/companion/route-context.ts`** — Companion's per-route "next best action" table, keyed by hardcoded `/portal/...` path prefixes.
- **`src/app/sitemap.ts`** — 22 hardcoded entries, single file for sitemap correctness.
- **`src/app/robots.ts`** — 1 line, disallows `/portal/checkout*`.

**Breadcrumbs are NOT a single choke point.** `src/components/site/Breadcrumb.tsx` is a dumb presentational component with no hardcoded paths — every page builds its own breadcrumb items inline (e.g. `duan-cohoi/[ecosystemSlug]/page.tsx`, `hetrithucai/[slug]/page.tsx`). This is decentralized and part of the long tail, not a quick win.

### 1.5 Checkout & payment (highest business risk)

- `/portal/checkout` and `/portal/checkout/order-received/[id]` are **double-gated**: the middleware's `/portal/:path*` matcher redirects unauthenticated users, **and** `checkout/page.tsx` independently calls `supabase.auth.getUser()` and does its own `redirect("/login")`. A rename that moves checkout out of the matcher does **not** remove auth protection (the page-level check is independent) — but it does lose the `?next=` return-param the middleware currently attaches, a UX regression to fix, not a security one.
- Payment confirmation is **not** a gateway redirect — it's bank-transfer via VietQR, confirmed asynchronously by `POST /api/webhooks/sepay`, which authenticates via a static API-key header (`timingSafeEqual`), sits entirely outside the middleware matcher, and is **unaffected by this migration regardless of what happens to `/portal/`**.
- 3 hardcoded `/portal/` literals to fix in the checkout path itself: `CheckoutForm.tsx:40` (`router.push`), `OrderReceipt.tsx:72` (post-payment link to `/portal/my-products`), `checkout/page.tsx:20` (`redirect("/portal")` fallback).

### 1.6 Sitemap & robots.txt — pre-existing inconsistency, worth fixing regardless

- `src/app/sitemap.ts` **does** list ~19 static `/portal/*` pages plus dynamically expanded tool/prompt/resource detail pages — despite the entire section being auth-gated. Crawlers are being told these pages exist; they'll all bounce to `/login`.
- `src/app/robots.ts` disallows only `/portal/checkout*`, `/admin*`, `/api/*` — it does **not** disallow the rest of `/portal/*`, so robots.txt technically permits crawling pages the middleware will redirect away from anyway.
- This is a pre-existing SEO inconsistency, not something the migration causes. Recommend treating "should authenticated Portal pages be in the sitemap at all" as a **separate, small fix** — either during Phase 1 prep or independently — regardless of the prefix-removal timeline.

### 1.7 Canonical / metadataBase — good news

No page anywhere in the codebase sets an explicit `alternates.canonical`. Canonical/OG URLs are derived automatically by Next.js from `metadataBase` (`src/app/layout.tsx`, sourced from `siteConfig.url`) plus the route's actual resolved pathname. **This means canonical URLs will self-correct once routes are renamed — no separate metadata-layer fix required.** The only manual work is anywhere a URL is built as a raw string (sitemap, robots, redirects, hardcoded links) — never in metadata config.

### 1.8 Admin isolation

`src/components/admin/**` has zero hardcoded `/portal/` links. `src/app/admin/**` has 9 files, two categories needing updates in a rename:
- **View-live-page links** (5 files: `tools`, `digital-assets/projects`, `digital-assets/category/[key]` ×2, `digital-assets/articles`) — `viewHref={(it) => \`/portal/...\`}` props.
- **Cache invalidation** (`revalidatePath("/portal/...")` calls in `case-study/actions.ts` ×3 and `course-pricing/actions.ts` ×4, plus several in Portal's own `actions.ts` files under `practice`, `support`, `account`) — must be updated in lockstep with any route rename or admin writes will stop invalidating the correct page cache.

No structural risk here — admin itself stays at `/admin/*` untouched, this is just link-string maintenance.

### 1.9 Test coverage gap

23 test files reference `/portal/` strings, all incidentally (fixture/context data inside business-logic tests — goal runtime, workforce activation, memory capsules, etc.). **Zero tests exercise redirects, the middleware matcher, or link integrity.** A migration today would have no automated way to catch a broken internal link short of manual click-through. See §11.

---

## 2. Bonus findings (not migration-blocking, worth a ticket regardless)

- `/portal/growth → /portal/build` and `/portal/ecosystem → /portal/connect` are dead redirects (destination doesn't exist as a route) — likely leftover from an earlier rename that was never finished.
- `/portal/hanh-trinh-cua-toi` (hyphenated) is an archived duplicate of the canonical `/portal/hanhtrinhcuatoi` (unhyphenated) — already redirected in `next.config.ts`, file kept only for history.
- `/portal/companion` and `/portal/su-menh-companion` both present themselves as "the" Companion entry point — a pre-existing duplicate-route finding from the earlier Companion Architecture audit, unrelated to this migration but will need its own final-slug decision if/when addressed.

---

## 3. Blocking decision: Portal Home vs `/`

`/portal` (the Portal home/reception page) has no example in the brief and cannot mechanically become `/` — that URL is already the public marketing homepage. Three options, no default assumed:

| Option | URL | Trade-off |
|---|---|---|
| A. Keep the prefix for the root only | `/portal` stays as-is, every child route drops the prefix | Simplest, smallest blast radius, but leaves one inconsistent URL (`/portal` still exists, but `/portal/hocvienai` becomes `/hoc-vien-ai`) |
| B. Vietnamese label for the hub | `/trang-chu` or `/bat-dau` | Fully consistent with the new convention, but is a genuinely new URL nobody currently links to or has bookmarked |
| C. Redirect `/` itself into the authenticated app for logged-in users | `/` serves marketing site to logged-out visitors, Portal home for logged-in members (middleware-driven split) | Matches how many SaaS products behave, but is a materially bigger change to `src/app/page.tsx` and middleware logic than a pure rename — likely too much scope for this initiative |

**Recommendation: Option A.** It's the only option that doesn't require a decision about the marketing homepage's own behavior, and it keeps the rename mechanical (one segment removed per route) rather than architectural. Flagging for explicit Product Owner sign-off — this table is not resolved by default.

---

## 4. Final URL Standard (proposed)

**Rule:** `domain/menu-page/sub-page/detail-page` — lowercase, hyphen-separated, unaccented Vietnamese for Vietnamese concepts; established English/brand terms (`premium`, `ai-workspace`, `mirror`, `companion`) kept as-is rather than force-translated, since those are already used as proper nouns in the product's own design docs. No accented characters, no abbreviations, no old English route segments, no duplicate canonical routes for the same content (existing duplicates in §2 must be resolved as part of, or before, cutover — not carried forward under new names).

**Full route map** — top-level pillars (dynamic child segments `[slug]`/`[id]` are unaffected by the rename and simply inherit their parent's new prefix):

| Current | Proposed | Note |
|---|---|---|
| `/portal` | `/portal` | See §3 — kept as-is pending decision |
| `/portal/hetrithucai` | `/he-tri-thuc-ai` | |
| `/portal/aiworkspace` | `/ai-workspace` | English brand term, hyphenated |
| `/portal/duan-cohoi` | `/du-an-co-hoi` | Fixes existing partial-hyphenation inconsistency (`duan-cohoi`) |
| `/portal/hanhtrinhcuatoi` | `/hanh-trinh-cua-toi` | |
| `/portal/hocvienai` | `/hoc-vien-ai` | |
| `/portal/congdongai` | `/cong-dong` | Brief's own example drops "ai" — **flag for confirmation**, diverges from strict 1:1 translation (`cong-dong-ai`) |
| `/portal/nhatkyhoctap` | `/nhat-ky-hoc-tap` | |
| `/portal/khuvuoncuaban` | `/khu-vuon-cua-ban` | Inverts an existing alias — this hyphenated form is *currently* a redirect *source* to the unhyphenated canonical; under the new standard it becomes the canonical destination |
| `/portal/mirror` | `/mirror` | Brand term — proposed keep; alt: `/guong-soi` — flag for confirmation |
| `/portal/story` | `/story` or `/cau-chuyen-cua-toi` | Currently a flat top-level route despite being a Journey "door" conceptually — flag both the slug AND whether it should nest under `/hanh-trinh-cua-toi/*` (see §5 scope note) |
| `/portal/companion` | `/companion` | Brand term — kept |
| `/portal/su-menh-companion` | `/su-menh-companion` | Already hyphenated correctly |
| `/portal/premium` | `/premium` | Matches brief's own example exactly |
| `/portal/digital-assets` | `/tai-san-so` | |
| `/portal/goals` | `/muc-tieu` | |
| `/portal/checkout` | `/portal/checkout` (unchanged) | **Recommend excluding checkout from this migration entirely** — see §7 |
| `/portal/prompts` / `/resources` / `/tools` | `/prompt` / `/tai-nguyen` / `/cong-cu` | |
| 21 standalone pages | translate 1:1 per the same hyphenation rule | Full per-page table to be finalized alongside §3's decision, not blocking the plan itself |

Every dynamic child (`[slug]`, `[id]`, `[ecosystemSlug]`, etc.) keeps its exact current value — only the static parent segments change.

**Explicit open question bundled into this table, not resolved here:** should the Journey "doors" (`mirror`, `story`, `nhatkyhoctap`, `khuvuoncuaban`) be nested under `/hanh-trinh-cua-toi/*` to match the `menu-page/sub-page` shape the brief itself asks for, given they are conceptually children of the Journey Hub? This is a **hierarchy** change, not a **prefix** change — recommend treating it as a separate decision so it doesn't inflate the risk/scope of what is otherwise a mechanical rename (see §5).

---

## 5. Migration Plan

### 5.1 Final route map
Per §4. Scope note: this plan treats the migration as a **1:1 mechanical prefix/slug rename**, not a hierarchy restructure. Nesting the Journey doors, or resolving the Companion duplicate-route question, are real improvements but are separable decisions — bundling them in would roughly double the review surface of an already-large change for marginal added risk reduction.

### 5.2 Old → new redirect map
Every current `/portal/*` URL gets a **permanent (301)** redirect to its new equivalent in `next.config.ts`, added only in Phase 4 (§6) once internal links no longer depend on the old path. The 26 *existing* legacy redirect rules (old-old → old-portal, e.g. `/portal/academy → /portal/hocvienai`) must be **repointed directly to the final new destination** (e.g. `/portal/academy → /hoc-vien-ai`) rather than left to chain through the old destination — a redirect chain of 2 hops is avoidable and both slower and worse for SEO than one hop.

### 5.3 Middleware changes
Replace the single `pathname.startsWith("/portal")` check with a config-driven allowlist — e.g. a `PROTECTED_ROUTE_PREFIXES` array in a shared file, imported by `middleware.ts`. This is valuable **independent of the rename** (Phase 1, low risk) because it turns "is this route protected" from an implicit string convention into an explicit, auditable list — which is also what makes the dual-serving strategy in Phase 2/3 possible (protect both old and new prefixes simultaneously without editing matcher logic twice).

### 5.4 Auth flow changes
- `/login`'s post-auth redirect target (`/portal` → new home target, see §3) — one literal.
- `checkout/page.tsx`'s own `redirect("/login")` should start setting `?next=` itself (currently doesn't, unlike the middleware's version) — a small pre-existing gap worth fixing in the same pass regardless of the rename, so checkout's auth redirect has parity with the rest of the Portal.
- No change to `getPurchasedIds()` or any Supabase membership check — confirmed DB-query-based, not URL-based.

### 5.5 Internal-link update strategy
Sequenced by leverage, not alphabetically:
1. Choke-point files first (§1.4): `hubs.ts`, `companion-workspace.ts`, `route-context.ts`, `sitemap.ts`, `robots.ts` — highest fraction of real navigation fixed per file touched.
2. `src/data/**` (137 refs, mostly static arrays — mechanical, low logic risk, but `data/blog.ts` alone is 64 refs and worth its own review pass since blog content references Portal CTAs).
3. Remaining `src/components/portal/**` and `src/lib/portal/**`.
4. Long tail: in-page breadcrumbs/CTAs inside `src/app/portal/**` (403 refs, decentralized, must be swept page-by-page since there's no shared breadcrumb-building function to fix once).
5. `revalidatePath()` calls in admin + portal server actions (§1.8) — small in count but functionally silent if missed (stale cache, not a crash), so needs a deliberate checklist rather than relying on the sweep catching them incidentally.

### 5.6 Canonical metadata update
No action required beyond the route rename itself — confirmed self-correcting via `metadataBase` (§1.7).

### 5.7 Sitemap update
Rewrite `src/app/sitemap.ts`'s static route list to new paths. Recommend using this pass to also resolve §1.6's pre-existing inconsistency (should auth-gated pages be listed at all) rather than mechanically translating the same 22 entries as-is.

### 5.8 Checkout/payment route protection
See §7 — recommend excluding checkout from the rename's first cutover entirely; if it is included, it must be the last thing cut over, with its own dedicated soak period and manual QA pass (real payment, not a mock) before the redirect goes live.

### 5.9 Admin isolation strategy
No structural change to `/admin/*`. Only the 9 files in §1.8 (view-live-page links + `revalidatePath` calls) need updating, and only after the corresponding public route has actually moved — sequence admin-link updates to follow, not lead, each pillar's cutover.

### 5.10 Rollback plan
See §6 (phased) — the dual-serving design in Phase 2/3 means rollback before Phase 4 is a plain `git revert` on the internal-link commits, with zero user-facing impact (old URLs never stopped working). Phase 4 (adding permanent redirects, removing old physical routes) is the only step that isn't trivially reversible — old URLs stop being real routes and become redirects. Recommend a mandatory soak period (1–2 weeks in production on dual URLs, monitoring 404s/redirect-loop reports) between Phase 3 completion and Phase 4.

### 5.11 Test plan
See §11.

### 5.12 Risk assessment
See §12.

---

## 6. Migration Phases

- **Phase 1 — Foundation (low risk, do independent of go/no-go).** Config-driven middleware (§5.3), fix the two dead redirects (§2), add the link-integrity test (§11). No URL changes yet.
- **Phase 2 — Parallel routes (medium risk, fully reversible).** Create new top-level route files rendering the same components as today's `/portal/*` pages. Expand the middleware allowlist to protect both old and new prefixes. Do **not** touch internal links yet — both URL shapes work, only the new ones aren't linked-to internally yet. This lets QA and the new link-integrity test validate the new URLs in isolation.
- **Phase 3 — Cutover internal references (highest effort — the 1,300-reference sweep).** Choke-points first, then data, then the long tail of in-page breadcrumbs/CTAs, then `revalidatePath` calls (§5.5). Old URLs remain live and correct throughout — nothing is removed yet.
- **Phase 4 — Redirect old → new + decommission (point of no easy return).** Add permanent redirects for every old path (§5.2), repoint the 26 existing legacy redirect rules to their final destination directly. Convert old physical route files to redirect stubs (matching this project's own existing pattern for prior legacy aliases) rather than deleting outright.
- **Phase 5 — Cleanup.** Remove the dual-matcher scaffolding once traffic to old paths is negligible (or keep old redirects indefinitely — low cost, protects any external backlinks/bookmarks permanently). Resolve the bonus findings from §2 if approved separately.

---

## 7. Checkout/payment: recommend special-casing

Checkout is revenue-critical and already double-gated (§1.5), so a rename mistake here is the only scenario in this migration with direct financial impact. Two options:

- **A. Include checkout, but cut it over last, alone, with a dedicated real-payment QA pass and its own soak period** separate from the rest of the migration's timeline.
- **B. Leave `/portal/checkout*` exactly as-is, permanently, decoupled from this migration entirely** — the small URL inconsistency (one path keeps the old prefix) is a low cost against removing all rename risk from the revenue path.

No default assumed — flagging as its own decision alongside §3.

---

## 8. Rollback strategy (summary)
Trivial through Phase 3 (dual-serving, `git revert` on link-update commits only). Phase 4 requires the soak period in §5.10 before proceeding, precisely because it's the step that isn't trivially reversible.

---

## 9. Test plan
1. **New: a link-integrity test** (static analysis of `href`/`router.push`/`redirect()` call sites, or a Playwright crawl) — this is a net-new capability since none currently exists (§1.9), and should land in Phase 1 regardless of the rename's timing, so it starts protecting the codebase immediately.
2. **Manual QA checklist per pillar**, using the full route inventory in §1.1 as the checklist source — home, each hub, a spot-check of dynamic detail pages, login redirect-with-`next`, admin sanity check (unaffected), sitemap validates against new URLs, robots.txt still blocks checkout.
3. **Redirect-map correctness pass**: script `curl` against every entry in §5.2's map on a staging deploy, confirm 301 + correct final destination (no chains).
4. **Checkout**: one real (or sandboxed) end-to-end payment run before Phase 4 touches checkout at all, regardless of which option in §7 is chosen.

---

## 10. Risk assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Checkout/payment breakage | Highest | §7 special-casing, dedicated soak + real-payment QA |
| Middleware auth-gate misconfiguration | High | §5.3 config-driven refactor, dual-matcher overlap during Phase 2/3 |
| Portal Home vs `/` collision | High (blocking) | §3 — must be resolved before Phase 2 starts |
| 1,300+ scattered internal references | Medium (large surface, low individual severity) | Choke-point-first sequencing (§5.5), new link-integrity test (§11) |
| Sitemap/SEO | Medium, pre-existing | Migration is an opportunity to also fix §1.6, not required to |
| No existing routing test coverage | Medium | §11 item 1 closes this gap before the rename, not after |
| Admin, API, webhook routes | Low | Confirmed fully isolated (§1.8, §1.6) |
| Duplicate/dead routes carried forward under new names | Low, but avoidable | §2 findings should be resolved during, not after, cutover |

---

## 11. Report

- **Recommended final route structure:** §4's table — mechanical prefix removal + hyphenation-consistency fix, hierarchy restructuring (Journey doors nesting, Companion duplicate resolution) treated as separate follow-on decisions.
- **Total references affected:** 1,309 occurrences across 287 files (§1.3).
- **Highest-risk routes:** `/portal/checkout` + `/portal/checkout/order-received/[id]` (revenue-critical, double-gated); `/portal` root (blocking naming collision with `/`); every route indirectly, via the single-string middleware matcher (§1.2).
- **Migration phases:** 5 phases (§6), only Phase 4 is not trivially reversible.
- **Rollback strategy:** §5.10 / §8 — dual-serving makes Phases 1–3 reversible via plain revert; Phase 4 gated behind a mandatory soak period.

### Recommendation: migrate now or defer?

**Defer the full rename (Phases 2–5) until after the Portal Master Audit** (already queued, not yet started, per `PORTAL_RC1_RELEASE_CANDIDATE.md`'s own roadmap). Reasoning:

1. Two blocking decisions (§3 Portal Home, §7 checkout) are cheap to resolve but haven't been made — resolving them now costs nothing and unblocks everything else whenever the migration does proceed.
2. The Master Audit may itself decide to cut, merge, or rename pages for **content** reasons (it's explicitly scoped to review the whole Portal) — renaming a page for URL-prefix reasons and then renaming it again for content reasons within the same quarter is wasted effort and doubled review load.
3. Zero existing routing test coverage means this rename currently has no automated safety net — that gap should close before, not during, a 1,300-reference sweep.

**Do now, independent of the above:** Phase 1 only — the config-driven middleware refactor, the two dead-redirect bugfixes (§2), and the new link-integrity test (§11). All three are low-risk, valuable on their own, and make the eventual full migration meaningfully safer whenever it's approved.

---

**NO IMPLEMENTATION HAS BEEN DONE. This document is the deliverable for this task. Waiting for Product Owner approval before any Phase 2+ work begins.**
