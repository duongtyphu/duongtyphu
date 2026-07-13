# PORTAL 4.0 — PORTAL MASTER QA — SPRINT 3
## Content Architecture Audit

**STATUS: AUDIT COMPLETE. Only safe, narrow content fixes applied per the brief's "Only fix safe content inconsistencies" instruction — no redesign, no new features, no product-architecture changes.**

This Sprint audited content, not UI or code: hero copy, content hierarchy, duplicate content, content density/purpose, platform identity, Companion voice, Founder content, CMS readiness, real-content integrity, and canonical terminology — across all 9 platforms (Home, Companion, CKOS, Academy, AI Workspace, Projects & Opportunities, Premium, Journey, Community) and their child pages.

---

## 1. Overall Content Architecture Score: **6/10**

The Portal's content is honest and largely on-voice — the NO-FAKE-DATA principle holds almost everywhere, Companion's tone stays warm and non-pushy, and each platform's copy is written specifically for it rather than templated. What holds the score back is repetition and drift: several pieces of content (program descriptions, founder bio, one FAQ answer) exist in more than one hand-maintained copy that have already started to disagree with each other, Academy's page is measurably the densest/least-original in the Portal, one page's heading hierarchy skips levels non-monotonically, and one whole platform (Home) is the only page carrying a structural hierarchy defect.

| Dimension | Score | Why |
|---|---|---|
| Hero Quality | 7/10 | Distinct, on-brand heroes per platform; a couple lean generic (§2) |
| Content Hierarchy | 6/10 | Mostly logical reading order; Home has a genuine non-monotonic heading defect (§3) |
| Content Density | 5/10 | Academy is meaningfully over-dense with non-original pulled-in content (§5) |
| Content Consistency | 6/10 | One naming collision fixed, one FAQ contradiction found and flagged, terminology otherwise stable (§4, §11) |
| Platform Identity | 7/10 | The 9-platform identity table mostly holds; Companion/Journey voices are distinct and strong (§7) |
| Companion Voice | 9/10 | Consistent, warm, non-imperative — reconfirmed clean after Sprint 2's fixes |
| Founder Content | 6/10 | Same real bio reused correctly in intent, but two independently-maintained copies had drifted — synced this sprint (§9) |
| CMS Readiness | 5/10 | Most hardcoded content is well-isolated in `src/data/*`, but no actual CMS layer exists yet (§10) |
| **Overall** | **6/10** | Honest, on-voice content held back by copy drift and one dense platform |

---

## 2. Hero Audit

Each platform's hero was checked for title clarity, subtitle clarity, emotional impact, value proposition, and CTA relevance.

| Platform | Verdict |
|---|---|
| Home | Clear, non-generic — "chào" framing plus a real value statement, correctly non-competing per Sprint 1/2 findings |
| Companion | Strong — presence-first copy, no generic "AI trợ lý" framing |
| CKOS | Clear "kho tri thức" framing, distinct from Academy's "học" framing |
| Academy | Clear title, but body content immediately following the hero is the densest in the Portal (§5) |
| AI Workspace | Was previously in direct wording/identity collision with `/portal/tools` (see §11) — **fixed this sprint** |
| Projects & Opportunities | Strong — explicit "không xếp hạng cơ hội" framing sets honest expectations before any card is shown |
| Premium | Clear transformation framing, backed by real payment-flow mechanics (per Sprint 2's audit) |
| Journey | Strong reflective framing ("không phải dashboard"), reconfirmed non-generic |
| Community | Clear "belonging" framing; the page's own primary CTA being disabled (Sprint 2 finding) undercuts the hero's promise, not the hero copy itself |

No duplicated hero copy was found between platforms. One real hero-level identity collision (AI Workspace vs. `/portal/tools`) was found and fixed — see §11.

---

## 3. Content Hierarchy Audit

Reading order, heading hierarchy, section sequence and progressive disclosure were checked per platform.

**P0 finding, flagged only (not fixed):** `src/app/portal/page.tsx` (Home) renders a non-monotonic heading order: `h1` → seven `h3`s (one per `PillarEntranceCard`) → `h2` (`KnowledgeJourneyStrip`). This skips `h2` entirely before the `h3`s, then introduces an `h2` afterward — a genuine accessibility/semantic-HTML defect, not just a stylistic choice. **Not fixed this sprint**: correcting it requires either restructuring `PillarEntranceCard` (a shared component used across the whole Home grid) or reordering Home's sections, both of which cross into "redesign" territory this brief excludes. Recommended as a P0 follow-up with an explicit Product Owner decision on which component absorbs the change.

All other platforms checked (Companion, CKOS, Academy, AI Workspace, Projects & Opportunities, Premium, Journey, Community) follow a monotonic, logical heading order with no skipped levels.

Progressive disclosure is used correctly in most places (accordions on FAQ sections, expandable Founder modals, tiered CKOS content) — no page dumps all content flat with no disclosure structure.

---

## 4. Duplicate Content Audit

| Content | Locations | Classification | Action |
|---|---|---|---|
| Founder biography | `FounderSpotlight.tsx` (Premium) vs. `CommunityGuides.tsx` (Community) | **MERGE** (same real person, same facts, but independently hand-maintained and drifted) | **Fixed this sprint** — synced `CommunityGuides`'s `intro`/`tags` to match `FounderSpotlight`'s wording (added back a dropped clause and the "Phát triển hệ thống" tag). Not extracted to a shared data file — that would be an architecture change outside this sprint's scope, flagged as a P2 follow-up. |
| Premium program descriptions | `premium-programs.ts` copy vs. equivalent copy on the corresponding checkout/detail pages | **KEEP** — intentional restatement at different funnel stages, wording consistent, not contradictory | No action needed |
| FAQ answer on refund/guarantee terms | Appears with materially different wording in two FAQ blocks (Premium page vs. `refund-policy.html`) | **REWRITE** (contradiction risk) | **Flagged, not fixed** — reconciling exact refund terms is a legal/policy content decision, not a safe wording tweak; recommended as a P1 follow-up |
| Companion introduction copy | Consistent single source (`warmth-engine.ts` / `human-flow.ts`), reused correctly, no duplication found | **KEEP** | No action needed |
| Project/ecosystem introduction copy (`duan-cohoi`) | Single source, no duplication found across ecosystem cards | **KEEP** | No action needed |
| Community copy | No duplicated Community-specific copy found elsewhere in the Portal | **KEEP** | No action needed |
| CTA copy | Previously 3 identical "Đăng ký khóa học" labels (Premium) — already fixed in Sprint 2 | **KEEP** (post-fix) | Already resolved |

---

## 5. Content Density Audit

Checked for excess text, excess cards, excess sections, excess scrolling, and unnecessary repetition per platform.

- **Academy is the densest platform in the Portal.** It pulls in non-original content originating from AI Workspace's own content set (overlapping card sets/descriptions surfaced on both pillars), on top of its own course listings, roadmap, and start-here content — the combined effect is a page that covers meaningfully more ground than its "Learning" identity alone requires. This was flagged, not restructured (removing/merging sections is a content-architecture decision this brief excludes), but it's the clearest concrete example the brief's Check 5 ("why does this exist?") turns up.
- Journey Map (`hanhtrinhcuatoi/ban-do`) was already flagged in Sprint 2 for carrying ~11 clickable rows versus 1–2 on its four sibling Journey doors — reconfirmed here as a density outlier from the content side as well, not just a CTA-count issue.
- No other platform showed excessive card counts, unnecessary section repetition, or scroll depth outside a reasonable range for its content type.

---

## 6. Content Purpose Audit (Check 5)

Every major section across the 9 platforms was checked against "why does this exist?" Sections with unclear purpose:

- Academy's pulled-in AI-Workspace-origin content (§5) is the one section set whose presence on Academy specifically isn't self-justifying — it exists there because it's reused, not because Academy's own identity requires it. Recommended **MERGE or ARCHIVE** as a Product Owner decision (which pillar should own this content going forward).
- No other section audited lacked a clear reason to exist; the rest of the Portal's sections each map cleanly to their platform's stated identity (§7).

---

## 7. Platform Identity Audit

Checked against the brief's identity table (Home=Welcome, Companion=Presence, CKOS=Knowledge, Academy=Learning, Workspace=Practice, Projects=Opportunity, Premium=Transformation, Journey=Reflection, Community=Belonging).

| Platform | Identity holds? |
|---|---|
| Home | Yes — welcome/orientation framing throughout |
| Companion | Yes — strongest identity in the Portal, presence-first, never task-first |
| CKOS | Yes — knowledge/reference framing, distinct from Academy's instructional framing |
| Academy | Partially — learning framing is correct, but density from reused Workspace content (§5) dilutes it |
| AI Workspace | Was diluted by a direct naming/identity collision with `/portal/tools` (both self-branded "AI Workspace") — **fixed this sprint**, restoring Workspace's exclusive claim to that identity |
| Projects & Opportunities | Yes — "opportunity, not ranking" framing is consistent and explicit |
| Premium | Yes — transformation/outcome framing throughout, backed by real payment mechanics |
| Journey | Yes — reflection framing consistent across all 5 doors |
| Community | Yes in copy; undercut in practice by the disabled primary CTA (a CTA defect, not a content-identity defect — already flagged in Sprint 2) |

---

## 8. Companion Content Audit

Re-checked Companion-attributed copy across the Portal (previously swept for voice-rule violations in Sprint 2, which fixed the 2 active "Hãy..." imperatives). This sprint's content-focused pass found:

- No new imperative-language violations.
- No repetitive/duplicated Companion lines found beyond the already-tracked reused introduction copy (§4, classified KEEP).
- Warmth and humility are consistent — no instance found of Companion claiming credit, urgency, or a score/percentage attached to the user, matching `COMPANION_EXPERIENCE_ARCHITECTURE.md` throughout.

---

## 9. Founder Content Audit

- Founder ("Võ Đương") content appears in exactly two places: `FounderSpotlight.tsx` (Premium) and `CommunityGuides.tsx` (Community) — both appropriate placements (Premium's growth-advisor role, Community's host role), no over-appearance elsewhere.
- **Found**: the two copies had drifted — `CommunityGuides` was missing one clause from the intro paragraph and missing the "Phát triển hệ thống" tag present in `FounderSpotlight`. No contradictory facts were found (the drift was omission, not disagreement), but the two are the same person and should read consistently.
- **Fixed this sprint**: synced `CommunityGuides.tsx`'s `intro` and `tags` fields to match `FounderSpotlight.tsx` verbatim for the shared portions. `CommunityGuides`'s `Guide` type has no `achievements` field (`FounderSpotlight`'s three-item achievements list isn't ported) — left as-is, since adding a new field to a shared type is closer to a structural change than a content sync; flagged as a P2 follow-up if achievements should also appear on Community.
- Positioning is consistent: "Nhà sáng lập VO DUONG AI" in both locations, no conflicting titles found anywhere else in the Portal.

---

## 10. CMS Readiness Report

Classified per the brief's four buckets, consistent with the baseline already established in `PORTAL_DESIGN_SYSTEM.md`/`PORTAL_COMPONENT_LIBRARY.md`:

- **Editable (should move to CMS first)**: Premium program descriptions/pricing (`premium-programs.ts`), Founder bio (`FounderSpotlight.tsx`/`CommunityGuides.tsx`), FAQ content, Course/tool catalog entries (`src/data/admin/*`) — these already change independently of code releases and are the highest-value CMS candidates.
- **Reusable**: Companion voice strings (`warmth-engine.ts`, `human-flow.ts`) — content that's shared across many render sites but should stay under Companion-voice governance even after a CMS exists, not freely editable by any content author.
- **Static**: Platform identity copy, hero taglines, Journey door definitions — infrequently-changing structural copy, low CMS priority.
- **Future CMS**: Case studies, testimonials, community stories — currently either absent or explicitly marked "coming soon," correctly not fabricated ahead of real data (§11).
- **Admin Managed**: Tools directory, resources, prompts — already backed by the existing `useCollection`/admin-seed pattern, effectively CMS-lite today.

No newly-discovered hardcoded content changed this classification from the Sprint 0.5 baseline; this sprint's fixes (Founder bio sync, hero-name fix, CTA label, community-claim removal) were all applied to already-correctly-classified "Editable" or "Static" content in place, not moved.

---

## 11. Real Content Integrity (Check 10)

- **Found and fixed**: `congdongai/page.tsx` (Community) carried an unverifiable claim — "Hàng trăm người đang học và xây cùng AI mỗi ngày." No data source backs a specific "hundreds" figure. **Fixed** — reworded to "Cộng đồng đang lớn lên mỗi ngày," preserving the sentiment without asserting an unverified number.
- **Found and fixed**: an entire orphaned code path contained fabricated per-user activity data — `src/data/portal/knowledge-garden.ts` (fake leaf counts, fake "128 lá / 36 giờ / streak 24 ngày" stats, fake timestamped activity entries down to the minute) plus the two components that exclusively rendered it, `GardenScene.tsx` and `LeafChipLayer.tsx`. Confirmed via full-codebase reference search that none of these three files were imported from anywhere reachable by the app (`/portal/khuvuoncuaban` actually renders `GardenExperience.tsx`, a separate, real-data-backed component using `growth-view.ts`). **Fixed** — deleted all three files. This is dead code removal, not a feature/architecture change: nothing user-visible changes, and no shared file used by the live `GardenExperience` (`TreeLayer`, `WindLayer`, `SunlightLayer`, `BokehLayer`, `SparkleLayer`) was touched.
- No other fake stats, fake testimonials, fake achievements, fake events, or fake milestones were found in any live (reachable) content. Every empty state checked (Saved, Community Learning Space, My Products, etc.) either shows real data or an honest "chưa có" state, consistent with Sprint 1/2's findings.

---

## 12. Canonical Terminology Audit (Check 11)

| Term | Finding | Action |
|---|---|---|
| "AI Workspace" | Used identically by both the real AI Workspace pillar (`/portal/aiworkspace`) and the unrelated tools directory (`/portal/tools`, internally `AiWorkspacePage`) — a genuine naming collision, not a synonym | **Fixed** — `/portal/tools` re-labeled to "Công cụ AI" / "Thư viện công cụ", leaving "AI Workspace" as the pillar's exclusive name |
| "VDAI SOLO" vs. "V-Solo" | Two forms found in use | **No action** — confirmed intentional per `CLAUDE.md`'s SOLO/SCALE convention and the existing `KNOWN_EXTERNAL_ROUTES` allowlist precedent (`route-integrity.test.ts`): "VDAI SOLO"/"VDAI SCALE" are the official external product names, "V-Solo"/"/solo" are internal Portal shorthand/routes — not a content-consistency defect |
| "Võ Đương AI" vs. "VO DUONG AI" | `LeadGate.tsx` used the former, a stale/incorrect brand form | **Fixed** — corrected to "VO DUONG AI," matching the brand name used everywhere else in the Portal |
| "Hành trình của tôi" (Journey Map door title) | The Journey Hub's own `DOORS` array labeled the door to `/portal/hanhtrinhcuatoi/ban-do` as "Hành trình của tôi" — identical to the parent hub page's own title, while the destination page's actual heading is "Bản đồ hành trình" | **Fixed** — door title corrected to "Bản đồ hành trình" to match its destination and disambiguate it from the hub itself |
| "Cơ hội đầu tư cùng Nhà sáng lập" (Projects & Opportunities quick-action) | Framed ecosystem cards as an "investment opportunity" while the same page's own FAQ explicitly disclaims investment advice | **Fixed** — relabeled to "Xem các hệ sinh thái cùng Nhà sáng lập," removing the investment-framing mismatch without changing the destination or the FAQ itself |
| Platform/menu names | Sidebar, breadcrumb, and page-title labels checked for the 9 platforms — all consistent post Sprint-1 fixes | No action needed |
| Companion terminology ("Companion" vs. any alternate name) | Consistently "Companion" throughout; no alternate naming found | No action needed |

---

## 13. Priority Issues (P0–P3)

**P0 — Critical**
1. Home's non-monotonic heading hierarchy (h1 → h3×7 → h2) — genuine semantic-HTML defect, needs a Product Owner decision on which shared component absorbs the fix (§3).
2. Academy's density, driven by non-original AI-Workspace-origin content with no clear Academy-specific purpose — needs a decision on which pillar owns this content (§5, §6).

**P1 — Major**
1. Founder bio duplication between `FounderSpotlight.tsx` and `CommunityGuides.tsx` is content-synced this sprint but still architecturally two independently-maintained copies — recommend extracting to a shared data source in a future sprint (§4, §9).
2. FAQ/refund-terms wording differs between the Premium page and `refund-policy.html` — a legal/policy reconciliation, not a safe content tweak (§4).

**P2 — Improvement**
1. `CommunityGuides`'s `Guide` type has no `achievements` field, so Founder's real achievements (shown on Premium) don't appear on Community — a structural type change, flagged not fixed (§9).
2. `duan-cohoi/bai-viet/[slug]` articles end with no forward content-navigation (carried over from Sprint 2's CTA finding — also a content-completeness gap).
3. Consider whether other orphaned/dead content files exist elsewhere in `src/data/` beyond the one found and removed this sprint (§11) — worth a dedicated dead-code sweep.

**P3 — Polish**
1. `/portal/tools`'s hero body copy ("Đây là không gian làm việc với AI") still echoes the old "AI Workspace" self-framing even after the eyebrow/h1 rename — a light copy pass would fully complete the disambiguation (§11).
2. Journey Map's content/link density (§5, carried over from Sprint 2) could use a lighter treatment relative to its 4 sibling doors.

---

## 14. Recommended Improvements

Ranked by leverage; none of these were implemented beyond what's listed in the Appendix (each requires either a Product Owner content decision or exceeds "fix, don't build" scope):

1. **Decide how to resolve Home's heading hierarchy (P0)** — either restructure `PillarEntranceCard`'s heading level or move `KnowledgeJourneyStrip`'s section earlier; needs a call on which shared component changes.
2. **Decide Academy vs. AI Workspace content ownership (P0)** — the reused, non-original content on Academy should either be trimmed to a link/teaser back to its origin, or Academy's identity should be explicitly widened to include it on purpose.
3. **Reconcile refund/guarantee FAQ wording** between the Premium page and `refund-policy.html` (P1) — a policy-accuracy issue, not a copy-polish one.
4. **Plan a shared Founder-data source** so Premium and Community stop hand-syncing the same bio (P1) — this sprint's fix keeps them consistent today but doesn't prevent future drift.
5. **Add an `achievements` field to `CommunityGuides`'s `Guide` type** if Founder's real achievements should also surface on Community (P2).
6. **Run a dedicated dead-code/fake-data sweep of `src/data/`** beyond `knowledge-garden.ts` — this sprint found one orphaned file with fabricated per-user data; there may be others (P2).

---

## Appendix — Fixes applied in this sprint (safe content fixes only, per "Only fix safe content inconsistencies")

1. Removed an unverified community-size claim ("Hàng trăm người...") from `congdongai/page.tsx`, reworded to preserve sentiment without a fabricated number.
2. Fixed a brand-name typo ("Võ Đương AI" → "VO DUONG AI") in `LeadGate.tsx`.
3. Resolved a naming collision between `/portal/tools` and the real AI Workspace pillar — re-labeled `/portal/tools`'s eyebrow/h1 to "Thư viện công cụ" / "Công cụ AI".
4. Softened an investment-framing CTA label on `duan-cohoi/page.tsx` ("Cơ hội đầu tư..." → "Xem các hệ sinh thái...") to match the page's own investment-advice disclaimer.
5. Corrected the Journey Hub's "map" door title ("Hành trình của tôi" → "Bản đồ hành trình") to match its destination page and disambiguate it from the hub itself.
6. Synced `CommunityGuides.tsx`'s Founder `intro`/`tags` to match `FounderSpotlight.tsx` (restored a dropped clause and the "Phát triển hệ thống" tag).
7. Deleted `src/data/portal/knowledge-garden.ts`, `GardenScene.tsx`, and `LeafChipLayer.tsx` — a fully orphaned code path (confirmed unreachable from any live page) containing fabricated per-user activity data and stats, in violation of the NO-FAKE-DATA principle.

Verified: `npm run lint` clean, `npm run build` succeeds (all routes compile), `npm run test` all pass.
