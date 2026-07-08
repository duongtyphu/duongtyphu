# Portal Cross-Pillar Experience Audit

Audit scope: the experience *between* the 7 pillars (Home, CKOS, Academy,
Workspace, Projects, Premium, Journey) and Companion, following the mission
that Portal should feel like one continuous flow — Discover → Learn →
Practice → Reflect → Grow → Return — rather than 7 independent pages.

## Broken transitions

None found. Every pillar entry page resolves to a real route, and every
Companion/next-step link checked resolves to a page that exists and matches
what the link claims.

## Strong transitions (verified)

- **Home → all 7 pillars.** Each Pillar Entrance Card on Home answers what
  the pillar is, what the member has actually started there (real data via
  `growth-view.ts` or real Supabase counts, never invented), what Companion
  suggests next, and a single clear CTA into the pillar. This is the
  strongest, most consistent transition in the whole Portal.
- **CKOS → Academy / Projects / Companion.** The closing "Tri thức không
  dừng ở việc đọc" strip gives three honest next moves, matching the CKOS
  audit's established rhythm.
- **Academy → CKOS / Workspace / Case Study.** Academy's closing strip and
  its "trước khi chọn hành trình" content correctly send a learner either
  back to reference material or forward into practice.
- **Projects → Academy / CKOS / Companion.** Every ecosystem card states who
  it's for, who isn't ready, and a concrete "learn this first" link — this
  is the most rigorous per-card cross-pillar reasoning in the Portal.
- **Premium → Academy / Workspace / Companion.** Premium never pressures a
  visitor without history into buying; the "chưa chắc Premium phù hợp"
  strip and the ownedCount-aware Companion line both degrade gracefully for
  a visitor with zero purchases.
- **Journey → Academy / Projects / Companion.** The reflection prompts each
  pair a real question with one concrete next action, not a generic "explore
  more."
- **Companion presence page → Journey / Mission page.** Kept exactly as
  designed (Companion experience is frozen); the closing reflection line and
  quiet "Sứ mệnh Companion" footer link both work as intended.

## Weak CTA chains

None found that needed changing. Hero `quickActions` pairs (two buttons per
pillar hero) are a consistent, intentional pattern across every pillar —
not competing CTAs, but "go deeper" vs. "go elsewhere useful," and were left
as-is. The CKOS "Tìm trong CKOS" behavior (scrolls to category grid) is a
known prior decision and was left untouched.

## Dead ends (found and fixed)

- **Workspace session, after `status === "completed"`.** A finished session
  used to end at a history log and a "back to origin module" link — no
  forward-moving step. Since `WorkspaceSession.status` is real, already-read
  data (no new schema), a completion strip was added: when a session is
  completed, the member is now invited to look back at it in "Hành trình của
  tôi," with a link to `/portal/hanhtrinhcuatoi`. This is the concrete
  Workspace → Journey relationship the mission statement called for, built
  only on data that already exists.

## Duplicate journeys / duplicate Companion sentences

- **Found and fixed:** Home's "Hành trình của tôi" pillar card and the
  Companion presence page both used near-identical wording — "Nếu muốn nhìn
  lại quãng đường đã đi... Companion có thể chờ ở đó" appeared, essentially
  verbatim, in both places. Home's card line was reworded to a distinct
  sentence ("Ghé qua khi bạn muốn biết mình đã thực sự đi được bao xa, không
  chỉ đang làm gì hôm nay.") that keeps the same intent without repeating the
  Companion presence page's exact phrasing.
- A full sweep of every `CompanionGuide` / `CompanionMemoryLine` `message`,
  `emptyMessage`, and `contextTemplate` string across all pillar pages found
  no other duplicates — each pillar's Companion voice is distinct.

## Missing relationships

- **Added:** Workspace (completed session) → Journey, described above.
- **Explicitly deferred:** CKOS → Journey, Academy → Journey, and Journey →
  CKOS direct links were not added as new forward links on those hub pages.
  Journey is always one click away via the persistent sidebar nav item
  ("Hành trình của tôi"), so a hub-page-level nudge would be redundant
  chrome rather than a real missing path — adding it would mean inventing a
  "you're ready to reflect now" signal with no real trigger behind it.
- **Explicitly deferred:** Projects → Premium. No genuine trigger exists
  today (no real signal that a Projects visitor is Premium-ready) — adding
  this link would be fabricating a relationship the product doesn't
  actually have yet, which the standing rules forbid.
- **Explicitly deferred:** CKOS's "Best Practice" category still has no real
  route (table not implemented) — this was already a documented, intentional
  decision from the CKOS audits and was left untouched.

## Improvements made in this pass

1. Added a real, data-backed completion strip to the Workspace session view
   (`WorkspaceMvp.tsx`) that appears only when `session.status === "completed"`
   and links to Hành trình của tôi — closing the one confirmed dead end.
2. Reworded Home's Journey pillar-card Companion line to remove a
   near-duplicate sentence shared with the Companion presence page.

## Remaining production gaps

- CKOS "Vừa xem gần đây" and "Continue Learning" cards on the CKOS hub are
  honest empty states today (Companion has no view-history memory yet) —
  closing that gap needs a real history/recency data model, not more UI.
- Projects has no real engagement-tracking (which ecosystems a member has
  actually looked at) — the page already states this honestly instead of
  faking it; building it needs new schema, not a new link.
- A true "Projects readiness" or "Premium readiness" signal (to justify a
  Projects → Premium transition) would need real usage/outcome data that
  doesn't exist yet.
