# PORTAL 4.0 — PORTAL MASTER QA — SPRINT 2
## CTA & User Flow Audit

**STATUS: AUDIT COMPLETE. Only safe, narrow CTA-wording/voice fixes applied per the brief's "Only fix safe CTA inconsistencies" instruction — no redesign, no new features, no data-model changes.**

All 9 platforms and their child pages were traced for CTA presence/wording/hierarchy, 5 specific user journeys were walked hop-by-hop, the full Premium payment chain was traced end-to-end (including Supabase schema), and every literal Companion-attributed CTA string in the codebase was checked against `docs/COMPANION_EXPERIENCE_ARCHITECTURE.md`'s voice rules.

---

## 1. Overall CTA & User Flow Score: **5.5 / 10**

The Portal is genuinely strong at the *sentence* and *mechanics* level — Companion's voice discipline is excellent (95 strings checked, only 2 active rule violations, both fixed in this sprint), the checkout form has exactly one submit button with server-side price re-validation, and no page in the audit has literal duplicate purchase buttons. What pulls the score down is *structural completeness*: several of the specific cross-pillar flows the brief asked us to verify simply don't exist, multiple whole pages have zero forward navigation, Community's primary CTA is switched off, and — the most serious single finding — a confirmed, paid course purchase does not currently deliver any content to the buyer.

| Dimension | Score | Why |
|---|---|---|
| CTA Clarity | 6/10 | Individually clear labels, but real duplicate/ambiguous wording found (§2, now partly fixed) |
| User Flow | 5/10 | 3 of 5 traced journeys break on a missing hop (§4) |
| Conversion Flow | 4/10 | Home→Premium works; CKOS/Academy never nudge toward Premium; see Premium Flow below |
| Companion Guidance | 9/10 | Near-perfect voice discipline; 2 active violations found and fixed (§7) |
| Premium Flow | 4/10 | Checkout/payment mechanics are excellent; content delivery after purchase is broken (§6, P0) |
| Journey Flow | 6/10 | Good per-door CTA coverage, but wildly uneven density and no exit to Community |
| Community Flow | 5/10 | Learning Space/Case Study CTAs are solid; the page's own primary CTA does nothing |

---

## 2. Primary CTA Audit

Hub-page-level primary CTA counts were already established in Sprint 1 and are not repeated here (CKOS/Journey Hub: 1 clear primary; Home: correctly non-competing by design; AI Workspace: 3 competing, one dead; Projects & Opportunities: 0 by page end; Premium: 5 equal-weight program CTAs; Community: 2 disabled).

**New this sprint — child/detail pages:**
- Every dynamic detail page checked (`aiworkspace/[slug]` ×3 variants, `hetrithucai/[slug]`, `tools/[id]`, `resources/[id]`, `prompts/[id]`) has at least one identifiable primary action. None were found with zero primary CTA.
- `duan-cohoi/[ecosystemSlug]` and its sub-project page have **no visually-distinct primary CTA at all** — every link is a card-level click target of equal weight (marketing links, sub-project cards, article titles). This is a deliberate Product Owner rule already recorded in code ("no repeated bottom CTA band"), not a bug — flagged as a design characteristic, not an issue.
- `duan-cohoi/bai-viet/[slug]` (article detail) has **no forward-navigation CTA at all** — only a back-link and a bookmark button. A reader who finishes the article is offered nothing next. (P2, §9)

**Wording/destination fixed this sprint:**
- `premium-programs.ts`: three different programs (AI Cơ bản, AI Nâng cao, OpenClaw) shared the identical CTA label `"Đăng ký khóa học"` while linking to three different checkout destinations. **Fixed** — each now reads `"Đăng ký AI Cơ bản"` / `"Đăng ký AI Nâng cao"` / `"Đăng ký OpenClaw"`, matching the distinguishing-label pattern already used by V-Solo/V-Scale.
- `aiworkspace/[slug]/page.tsx`: the same "return to hub" action was labeled `"Quay lại hub"` in one render branch and `"Về hub"` in the other two, within the same file. **Fixed** — standardized to `"Về hub"` everywhere in that file.

---

## 3. Secondary CTA Audit

Secondary actions generally support the primary goal correctly (e.g. "Website chính thức" beside "Truy cập {tool}", "Đọc lộ trình miễn phí" beside a course CTA). Two findings:

- **Not disclosed, not fixed**: on `tools/[id]/page.tsx`, the *primary* button (`"Truy cập {tool.name}"`) silently uses `tool.affiliateUrl || tool.link`, while the honest "direct site" framing (`"Website chính thức"`) is demoted to secondary. The label itself isn't wrong, but it doesn't disclose that the primary path may route through an affiliate redirect. Not changed here — relabeling would touch affiliate-disclosure policy, a content/legal decision beyond a wording tweak.
- **Too many, not fixed**: `hanhtrinhcuatoi/ban-do` (Journey Map) surfaces up to 11 clickable link rows in a single view (per-chapter destination links, a "Kết nối tới Portal" block of 4-5 more links, plus the final CTA) — versus 1–2 internal CTAs on each of its 4 sibling doors. All individually well-labeled, but the sheer density on this one door is a real outlier. Flagged, not trimmed (removing links is closer to a content decision than a safe wording fix).

---

## 4. User Flow Audit

Walked 4 of the brief's named journeys hop-by-hop; a 5th (conversion) is covered in §5.

| Journey | Result |
|---|---|
| Home → CKOS → Academy → AI Workspace → Journey | **3 of 4 hops confirmed**, Home→CKOS→Academy→AI Workspace all real working links. **AI Workspace → Journey is missing** — the only path found detours through the unrelated `/portal/workspace` session page, reachable solely after completing a Companion work session |
| Home → Projects & Opportunities → Premium → Checkout | **2 of 3 hops confirmed.** Home→Projects works, Premium→Checkout works (conditional on course availability, honest fallback otherwise). **Projects & Opportunities → Premium is missing entirely** — confirmed zero mention of Premium anywhere in the `duan-cohoi` subtree beyond a code comment |
| Community → Learning Space → CKOS | **Missing.** None of Community's 7 Learning Space cards link to `/portal/ckos` or `/portal/hetrithucai`. The closest relative ("Prompt Engineering" → `/portal/prompts`) is a real CKOS knowledge category but bypasses the CKOS hub page entirely |
| Journey (Mirror/Reflection) → Community | **Missing.** Recursive check across all 5 Journey doors plus the Hub found zero links to `/portal/congdongai` anywhere in the platform |

None of these were added — inserting a new cross-pillar link is a content/IA placement decision (where exactly should it live on the page, what should it say), which this sprint's "fix inconsistencies, don't redesign" scope doesn't cover. All 3 missing links are carried into §10's recommendations.

**Bonus, confirmed working:** Projects → Ecosystem Detail (`duan-cohoi/page.tsx` → `duan-cohoi/[ecosystemSlug]/page.tsx`) resolves correctly. "Community → Join" has no working primary mechanism (the two CTA-styled buttons are disabled), but two real, working outbound links exist in the page footer (Facebook Group, Zalo Group) — de-emphasized by explicit Product Owner instruction already recorded in code, not an oversight.

---

## 5. Conversion Flow Audit

**Free Visitor → Learner → Premium → Course Access**, traced in full:

- Home → Premium: **confirmed**, the only first-class pillar-grid link to Premium.
- CKOS → Premium and Academy → Premium: **both missing.** Neither pillar ever links or nudges toward Premium — Academy's own FAQ explicitly states "Học viện không bán khoá học" (Academy doesn't sell courses) and never upsells. This means the *only* on-ramp to Premium in the entire Portal is the Home pillar-grid tile.
- Premium → Checkout → confirmed order: **real, working, traced through the Supabase schema** (see §6).
- **Ownership doesn't change what CKOS/Academy/AI Workspace show.** `getPurchasedIds()` (the real ownership check) is called on Premium and the Journey platform (Hub/Mirror/My Story/Journey Map) — never on `hocvienai` or `aiworkspace`. A user who has paid for Premium sees byte-identical Academy/Workspace pages to a free visitor. This is a real personalization gap in the conversion funnel, not a broken link — flagged, not fixed (adding ownership-aware UI to two pillar pages is new UI logic, out of this sprint's scope).

"Projects → Ecosystem Detail" confirmed working (§4). "Community → Join" has no working primary mechanism (§4).

---

## 6. Premium Payment Flow Audit

Traced the full chain: **Course Card → Checkout → Payment → Unlock.**

1. **Course Card → Checkout link: confirmed working.** `PremiumProgramCard.tsx` only builds a checkout link when a real Supabase `courses` row exists with `status = 'open'`; otherwise it honestly shows "Sắp mở đăng ký" with no link — the code's own comment explains this is deliberate ("tell the truth rather than link to a broken payment flow").
2. **Checkout page/form: confirmed working, single submit button.** `createOrder()` re-derives the authoritative price server-side from the `courses` table rather than trusting the client-supplied query-string price — a real anti-tampering safeguard.
3. **Payment: confirmed working, bank-transfer/VietQR flow (not a card gateway).** The order-received page polls order status every 4 seconds; the SePay webhook authenticates via a constant-time API-key comparison, matches the transfer amount exactly, and — if the amount doesn't match — deliberately leaves the order `pending` for manual admin review rather than silently auto-confirming. This is a well-built, honest confirmation mechanism.
4. **Unlock: BROKEN — P0.** This is the most important finding in this audit. Once an order is confirmed:
   - `my-products/page.tsx` and `account/page.tsx` both query orders joined against `products(...)` and `lessons(...)` tables to render the purchased content (video/PDF links) — **neither query joins against `courses` at all.**
   - The `courses` table (per its own SQL schema files) has only `id, name, status, description, price, created_at` — **no content columns, and no separate course-lessons table exists anywhere in the codebase.**
   - Result: a confirmed course order renders as a bare status card ("Đã xác nhận") with no actual lesson/video content — directly contradicting the program card's own copy (`"{N} bài giảng video — mở khóa tự động sau khi thanh toán"`) and the Premium page's FAQ (`"bài giảng của chương trình bạn mua được mở khóa trong mục Sản phẩm của tôi — không cần chờ duyệt tay"`).
   - **A user can pay real money for a course today and receive no content.** This is exactly the brief's own definition of a P0 (§9).

**No duplicate/conflicting purchase buttons found anywhere in the chain** — every card, every advisor recommendation, every hero CTA on Premium routes to the single real buy action per program; nothing was found offering two different "buy this" paths for the same course.

**Not fixed here**: resolving the unlock gap requires either a real course-content data model (a schema addition + admin authoring flow) or, at minimum, a decision about what a confirmed course order should honestly show in the interim — both are scoping/engineering decisions beyond "fix a CTA inconsistency," explicitly out of this sprint's "no new features" boundary.

---

## 7. Companion CTA Audit

Checked every literal Companion-attributed suggestion/CTA string (~95 total) across `CompanionSpace`, `CompanionContextualNudge`, `CompanionThoughtBubble`, `CompanionQuickPanel`, `PremiumAdvisor`, `proactive-thoughts.ts` (60 lines), `route-context.ts`, and the Home greeting chain (`warmth-engine.ts`/`human-flow.ts`, rendered via `CompanionPresenceBand`).

**Result: near-perfect discipline, with 2 active violations found and fixed.**

- `warmth-engine.ts`'s `welcomeCopy` — the exact text rendered as the Home page's H1 Companion greeting, shown to every first-time and recently-returning user — contained the imperative `"Hãy"` ("Hãy bắt đầu từ một bước nhỏ...", "Hãy tiếp tục cùng nhau nhé.") twice, a direct violation of the already-frozen rule ("never Bạn nên/cần/Hãy"). **Fixed**: reworded to invitational phrasing with the same meaning, no "Hãy": *"Một bước nhỏ là đủ để bắt đầu, mọi thứ khác sẽ đến đúng lúc của nó."* and *"Mình tiếp tục cùng nhau nhé."*
- `human-flow.ts`'s `connect`-stage `progressNarrative` ("Hãy biến những trải nghiệm vừa qua thành tài sản lâu dài.") had the same violation. Currently **dormant** (not wired into any rendered component today), but **fixed anyway** so the violation doesn't ship silently if that field is ever connected later.
- **Everywhere else audited — 0 violations.** Consistently invitational ("nếu bạn muốn", "khi bạn sẵn sàng"), first-person "mình", no percentages/scores/counts attached to the user, no fake urgency. `CompanionSpace.tsx` is notably honest about its own limits ("Trò chuyện sâu với Companion đang được chuẩn bị" — doesn't claim a capability that doesn't exist).
- **One borderline case, not changed**: `PremiumAdvisor.tsx`'s "unsure" recommendation uses `"Đừng mua gì khi chưa rõ."` — grammatically imperative, but *anti-sales* in direction (discouraging a purchase, not pressuring one). Flagged for a Product Owner judgment call on whether the "never imperative" rule is meant to cover anti-sales imperatives too, or only pro-sales pressure — genuinely ambiguous, not resolved unilaterally here.

---

## 8. Dead-End Page Report

**True dead ends (zero outgoing links to any other Portal page):**
`support`, `origin` (likely intentional — `noindex`, Companion lore easter egg), `checklists`, `templates`, `services`, `referral`, `practice`. Also: `account`'s default-opened tab has no forward link at all (the only link on the whole page lives inside a different tab, and only when the user has zero orders).

**Borderline (only a back-link, no forward guidance):**
`su-menh-companion/companion-qua-hinh-anh` (the Companion image flipbook — only link is back to `/portal/companion`).

**Notable state-dependent dead ends:**
- `checkout/order-received/[id]` — while payment is pending (the bank-transfer waiting state, the single most common thing a first-time buyer sees right after paying), the page shows only a status spinner with **no link at all**. A forward CTA only appears once `status === "confirmed"`.
- `my-products/page.tsx` — inverted: the *empty* state has one working link ("Tài nguyên Premium →"), but once a user actually owns something, the populated cards only link to external `video`/`pdf` URLs — zero internal Portal navigation for a page a paying customer is likely to revisit often.

**Fixed this sprint (empty states given exactly one action):**
- `saved/page.tsx`'s empty state ("Bạn chưa lưu nội dung nào...") previously offered zero clickable next step. **Added one link** — "Xem thư viện Prompt →" to `/portal/prompts`, matching the first content type the message itself names.
- CKOS's "Vừa xem gần đây" placeholder told users to "dùng ô tìm kiếm phía trên" (use the search box above) but provided no actual link. **Added one anchor link** — "Đi tới ô tìm kiếm →" to the page's own `#search` section.

**Left unfixed, intentionally**: Community's other empty sections (Community Stories, Workshops & Events, Project Showcase-when-empty) offer zero action — but no real "share your story"/"host an event" feature exists behind them yet, per this project's NO-FAKE-DATA principle. Adding a CTA here would mean fabricating an action for a feature that doesn't exist, which is worse than an honest, actionless empty state. Confirmed via the Community Campus Reconstruction's own established rules — not changed.

**Left unfixed, structural**: the 7 full dead-end pages and 2 state-dependent ones above were not given speculative forward links, since picking a destination for each requires a product/IA decision this sprint isn't scoped to make (the same reasoning Sprint 1 applied to structural nav gaps). Carried into §10.

---

## 9. Priority Issues (P0–P3)

**P0 — Critical (broken conversion/payment/dead route)**
1. Confirmed course purchases deliver no content — no `courses` join in `my-products`/`account`, no content data model exists for courses at all (§6).

**P1 — Major UX problem**
1. Community's only primary CTA ("Tham gia cộng đồng") is `aria-disabled` in both its placements — the page's single most prominent action does nothing.
2. AI Workspace hub's most visually dominant CTA links to `/solo`, a dead route (reconfirmed from Sprint 1).
3. 3 of the 7 brief-requested cross-pillar journeys don't exist: AI Workspace → Journey, Projects & Opportunities → Premium, Journey → Community (§4).
4. Academy and AI Workspace never reflect Premium ownership — identical experience for free and paying users on the two highest-traffic pillars (§5).
5. 7 pages are true dead ends with zero forward navigation of any kind: `support`, `checklists`, `templates`, `services`, `referral`, `practice`, plus `account`'s default tab (§8).
6. `checkout/order-received/[id]` offers no link at all during the (common) pending-payment state (§8).

**P2 — Needs improvement**
1. `duan-cohoi/bai-viet/[slug]` (ecosystem articles) end with no forward CTA at all.
2. Affiliate links on `tools/[id]` aren't disclosed as such in the primary CTA's label.
3. Journey Map (`ban-do`) carries ~11 clickable rows versus 1–2 on sibling doors — density outlier.
4. `my-products` loses all internal Portal navigation once a user actually owns something.
5. `"Đi tới →"` (shared `KnowledgeJourneyStrip` default label) repeats verbatim for 3 different destinations on the same page (`tools/[id]`) — each disambiguated only by its card heading, not the button text itself.

**P3 — Polish**
1. `PremiumAdvisor`'s one anti-sales imperative ("Đừng mua gì khi chưa rõ") — needs a Product Owner call on whether the "no imperative" rule applies in this direction too.
2. `aiworkspace/bai-viet/[slug]` renders both a breadcrumb and a `PortalBackLink` — redundant duplicate "go back" affordance.
3. `"Truy cập {tool.name}"` appears twice verbatim (hero + bottom CTA band) on the same tool detail page, same destination — harmless repetition, not a conflict.

---

## 10. Recommended Improvements

Ranked by leverage; none of these were implemented (each requires either a Product Owner content/priority decision or exceeds "fix, don't build" scope):

1. **Scope the course-content delivery gap (P0)** — the single highest-priority item in this report. Needs a real decision: build a minimal courses-content data model, or (faster, interim) make the "unlock" state honestly show something true (e.g. "đơn hàng đã xác nhận — nội dung sẽ được gửi qua email trong X giờ") instead of silently rendering nothing, until the real delivery mechanism exists.
2. **Give Community a working primary CTA** — even a temporary honest state beats a disabled button sitting in the same visual slot as a real one, twice on the same page.
3. **Confirm `/solo`** (carried over from Sprint 1, re-surfaced here as it's also AI Workspace's most prominent CTA) — resolve whether it's a real external URL or genuinely broken.
4. **Add the 3 missing cross-pillar links** (AI Workspace → Journey, Projects & Opportunities → Premium, Journey → Community) — each is a small, well-scoped addition once someone decides exact placement/copy.
5. **Decide whether Academy/AI Workspace should reflect Premium ownership** — currently a silent gap, not a bug, but likely worth a product decision given how much infrastructure (`getPurchasedIds`) already exists and is unused there.
6. **Address the 7 fully dead-end pages** — each needs a product decision on where its "next step" should point (a shared "back to Portal home" fallback would be the cheapest safety net if individual destinations aren't decided soon).
7. **Give `checkout/order-received` a next step during the pending state** — at minimum, a link back to `/portal/my-products` or Home while waiting, so a user doesn't feel stuck immediately after paying.

---

## Appendix — Fixes applied in this sprint (safe CTA/wording only, per "Only fix safe CTA inconsistencies")

1. Removed the two active Companion-voice violations ("Hãy...") from the Home page's greeting copy (`warmth-engine.ts`), plus a dormant third instance (`human-flow.ts`) — reworded to the established invitational tone, same meaning.
2. Standardized `aiworkspace/[slug]/page.tsx`'s "return to hub" label ("Quay lại hub" → "Về hub") to match its own other two instances.
3. Gave Premium's 3 identically-labeled program CTAs ("Đăng ký khóa học" ×3) distinct labels matching their program name, consistent with the V-Solo/V-Scale pattern already in use.
4. Added one clickable next-step to `saved/page.tsx`'s empty state (previously zero).
5. Added one clickable next-step (anchor link to the page's own search section) to CKOS's "Vừa xem gần đây" placeholder (previously zero, despite referring to a search box it didn't link to).

Verified: `npm run lint` clean, `npm run build` succeeds (all routes compile), `npm run test` 139/139 pass.
