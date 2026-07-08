# Project Platform Business Architecture — Portal 4.0

**Status: Design-first contract, extends `PROJECT_ECOSYSTEM_ARCHITECTURE.md` and
`PROJECT_CMS_ARCHITECTURE.md`. No implementation in this document — no code,
no SQL DDL, no `.tsx`/`.ts`/`.css` file is touched by this document itself,
and no component name is introduced here that doesn't already exist in the
two predecessor docs.**

This document assumes both predecessor docs are read and frozen:

- `PROJECT_ECOSYSTEM_ARCHITECTURE.md` (hereafter "doc 1") — the rendering
  level: an Ecosystem is a first-class CMS content object with one shared
  seven-section template (§3), a fixed section order, honest empty states
  (§9, §12), and the corrected Hub→Ecosystem link (fixing the
  `digital-assets`-category-link defect).
- `PROJECT_CMS_ARCHITECTURE.md` (hereafter "doc 2") — the admin level: the
  content hierarchy Platform → Ecosystem → Product (§1), Article as its own
  top-level collection scoped by `ecosystemId` rather than nested (§2), the
  CTA template registry (§7), the reference-don't-duplicate relationship
  model (§4), and the honest scaling recommendation that Article must
  graduate to typed Postgres columns before 100,000 rows (§9).

**This document goes one level above both.** Doc 1 answers "how does one
ecosystem render." Doc 2 answers "how does an admin manage content." This
document answers a different question entirely: **what is the business
shape of this Platform for the next 5-10 years** — lifecycle states,
partner relationships, growth model, and which future features must be
structurally reserved now (without building them) so they arrive later as
additive features, not a rearchitecture. Section references like "§4"
without a document name mean this document; "doc 1 §x" / "doc 2 §x" mean
the predecessor named.

Tone/rigor precedent: `CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md` — the same
frozen-ownership-contract discipline, and its willingness to say "zero real
rows, honest empty state" about Case Study and Best Practice rather than
pretend otherwise. The standing rules of the real Projects & Opportunities
pillar (`docs/PORTAL_CROSS_PILLAR_EXPERIENCE.md`, `PROJECTS_FINAL_AUDIT.md`,
`PROJECTS_PRODUCTION_RECONSTRUCTION.md`) govern every section below:
objective tone, Companion as advisor never salesperson, Projects → Premium
explicitly deferred, no fake data ever.

---

## 1. Business Vision

### The problem this Platform actually solves

VO DUONG AI's Projects & Opportunities pillar exists to help a visitor make
an **honest, non-hyped decision** about a real opportunity — an ecosystem
like DigiU, SolarGroup, or a Trading platform — that they might otherwise
only encounter through generic affiliate marketing (urgency framing,
unverifiable claims, one-sided endorsement). The business problem is not
"how do we get more clicks on affiliate links." It is **"how do we let
someone who trusts Vo Duong's judgment figure out, quickly and honestly,
whether this specific opportunity fits their specific situation — and if
not, what they should learn or practice first before it would."** This is
already the standing frame `PROJECTS_PRODUCTION_RECONSTRUCTION.md` describes
the pillar as answering: "Am I ready? Which opportunity fits me? Why? What
should I learn or practice first?" — not to sell, recruit, or rank
opportunities. This document does not reopen that frame; it extends it to
the business level.

### Why "Opportunity Center, not affiliate catalogue" is a business
position, not just a UX preference

A generic affiliate catalogue optimizes for one number: click-through, then
conversion. Its incentive is structurally opposed to honesty — the catalogue
owner is paid more when a visitor clicks, regardless of whether the
opportunity actually fits them, so every commercial incentive pushes toward
inflating appeal and suppressing "who should wait." An Opportunity Center
inverts that incentive on purpose: it is explicitly built to tell a visitor
"you are not ready for this yet" (doc 1 §3.1's required `whoNotReady` field)
even when that costs a click. This is not a UX nicety layered onto an
affiliate business — it **is** the business, because the actual asset VO
DUONG AI is building is not "traffic that converts once," it is **trust
that a visitor can return to again and again without ever being burned by a
recommendation that didn't fit.** A business built on trust compounds
(repeat visits, repeat willingness to act on Companion's word, word-of-mouth
referral); a business built on click volume decays as visitors learn not to
trust the source.

### Commercial value that accrues from doing this well

- **Trust** — a visitor who is told honestly "this isn't for you yet, learn
  X first" is more likely to believe the *next* recommendation, and the one
  after that. This is the compounding asset; it does not show up as a
  single quarter's revenue line, but it is the reason repeat visitors exist
  at all.
- **Retention** — an Opportunity Center that routes an unready visitor into
  real learning content (Academy, CKOS) rather than losing them keeps that
  visitor inside the Portal ecosystem rather than churning them out to a
  competitor's catalogue. The visitor who wasn't ready today may become
  ready in six months — and returns to *this* Platform because it told them
  the truth the first time.
- **A defensible long-term surface for legitimate partnerships** — because
  every ecosystem mini-site already states a real, honest reason a real
  partner relationship exists (doc 1 §3.1's `whoFor`/`whoNotReady`, §8's
  disclosed affiliate CTAs), a genuine Partner (§6) can attach to this
  Platform without the Platform having to fabricate enthusiasm it doesn't
  have. This is a durable commercial surface precisely because it never
  needed to lie to build it — inflated claims erode the exact asset (trust)
  that makes a partnership worth having in the first place.

### What this Platform explicitly refuses to optimize for

- **Short-term click volume.** No metric anywhere in this architecture (or
  its two predecessors) rewards maximizing clicks on a CTA independent of
  fit. The one-PRIMARY-CTA rule (doc 1 §10) already caps how many equally
  weighted asks a page can make; this document does not relax that cap for
  a business reason.
- **Inflated claims.** No lifecycle state defined in §3-§5 is triggered by
  or reports a fabricated metric. "Growing" (§3) is a manual admin judgment
  based on real content/engagement, never an automated fake-threshold. This
  is the same discipline CKOS's Case Study section already applies (zero
  real rows, said plainly) — this document extends it to every lifecycle
  state that could otherwise be tempted to invent a number to look busier
  than it is.

---

## 2. Platform Vision

### The 5-10 year shape

Unlimited Ecosystems, unlimited Partners, unlimited Products, unlimited
Campaigns, unlimited Affiliate Programs, unlimited Countries, unlimited
Languages — all reachable **without re-architecting**, meaning: adding any
of these in year 7 should look exactly like adding one today (author a CMS
entry, publish it), not "schedule an engineering sprint to support Partner
#40."

### The structural invariants that make this possible

Two invariants, stated once here because every other section in this
document is just a consequence of holding them:

1. **An Ecosystem is always CMS content, never code.** This is doc 1 §1's
   frozen rule ("adding an ecosystem is authoring a CMS entry, never
   authoring a page") restated at the business level: no future business
   development — a new country, a new partner type, a new campaign format —
   is ever allowed to require a new route file, a new component, or a new
   admin page. If a future business need seems to require one, the correct
   response is to ask which existing CMS field or sub-collection (doc 1 §4,
   doc 2 §2-§4) it should extend, not to special-case a page.

2. **A business relationship is always modeled as data attached to an
   Ecosystem or Product, never a special-cased page.** A Partner, an
   Affiliate Program, a Campaign, a region-specific commercial term — every
   one of these is a record or field referencing an existing Ecosystem/
   Product (doc 2 §4's relationship model: named, typed relationships, never
   a generic "related items" bucket), never a bespoke standalone page built
   to accommodate one specific deal. The moment a business relationship
   needs its own page rather than its own field, that is the signal the
   relationship has actually turned into a new Ecosystem (which is already
   fully supported) rather than a variant of an existing one.

Doc 1/doc 2's already-frozen mechanics are the **enforcement layer** for
both invariants: the one-shared-template rule (doc 1 §1) enforces invariant
1 at render time; the reference-don't-duplicate discipline and the CTA
template registry (doc 2 §4, §7) enforce invariant 2 by giving every
relationship a named, typed slot to live in instead of inventing a new
shape per deal. This document does not re-specify either mechanic — it
states why they were the right choice at the business level: **they are
what makes "unlimited X without re-architecting" actually true rather than
aspirational.**

---

## 3. Ecosystem Lifecycle

Extends the real `status: "Draft" | "Published" | "Hidden"` precedent
already used by `DigitalAssetProject`/`DigitalAssetArticle` (`src/data/
digitalAssets.ts`) and doc 1 §4's `Ecosystem.status` field — this section
does not invent a new vocabulary, it adds the business-lifecycle detail the
CMS-level enum alone doesn't carry (a CMS `status` field has three values;
the business process behind reaching and leaving each of them needs more
texture than a field can hold, which is exactly what this section supplies).

```
Idea → Draft → Private Review → Published → Growing → Archived → Restored
```

| State | Who can see it | What triggers the transition | Reversible? |
|---|---|---|---|
| **Idea** | Internal only (not even in the CMS as a real record yet — a note, a conversation, nothing published or draftable) | An admin decides a real ecosystem relationship is worth building out | N/A — nothing exists to reverse |
| **Draft** | Internal only — the CMS record exists (doc 1 §6 step 1: "create ecosystem shell... status = Draft") but is not visible on the Hub or at its own route | An admin creates the Ecosystem CMS shell | Yes — freely edited, never shown publicly until explicitly moved forward |
| **Private Review** | Admin-preview only, via the same `viewHref` preview pattern doc 2 §5 already specifies for Article review — a real, renderable preview of the mini-site, visible to whoever the admin shares the preview link with, never indexed or listed | An admin who believes the Draft is substantially complete (Overview + required CTA present, per doc 1 §3's required-section table) requests review | Yes — can go back to Draft for more edits, or forward to Published |
| **Published** | Public — appears on the Hub (doc 1 §12) and at its own route | Admin flips `status: Draft → Published` per doc 1 §6 step 10 | Yes — can be Archived; is not expected to move backward to Draft once real visitors have seen it (see note below) |
| **Growing** | Public, same visibility as Published — this is not a separate rendering state, it is an **internal admin tag** layered on top of Published | An admin manually flags the ecosystem once it has enough real content/engagement to matter (see definition below) | Yes — the tag can be removed without affecting public visibility at all |
| **Archived** | Not public — removed from the Hub and its own route returns the honest "no longer active" state, same posture as archive-over-delete elsewhere in the Portal | Admin decision that the ecosystem should no longer be presented as a live opportunity (partner relationship ended, ecosystem shut down, etc.) | Yes — see Restored |
| **Restored** | Returns to whatever visibility Restored re-enables (see below) | Admin decision to bring an Archived ecosystem back | This *is* the reversal path for Archived — Archived is never terminal |

### "Growing" — a real, non-fake definition

**Growing is a manual admin judgment call, never an automated metric
threshold.** It exists to let an admin distinguish, in the admin list view
(doc 2 §2's `CrudPage` collection for Ecosystem), "an ecosystem that just
launched with the minimum required Overview + CTA" from "an ecosystem that
has real Products populated, real Articles being published regularly, and
real (if modest) traffic/engagement" — without ever inventing a fabricated
score to draw that line automatically. Concretely: an admin who looks at an
Ecosystem's real content (how many real Products, how many real Articles,
whatever real click data doc 2 §8 eventually surfaces) and judges it has
crossed from "just launched" to "actually developing" toggles a
`growthStage` field (a CMS field, not a rendering state — doc 1's seven
sections render identically whether an ecosystem is Published or Growing).
This is consistent with the standing no-fake-data rule the same way Case
Study's zero-row honesty is: there is no automated formula converting raw
numbers into a "Growing" badge a visitor sees, because that badge would be
exactly the kind of inflated-looking metric §1 refuses to optimize for.
**Growing is an internal admin-organizing tag (useful once dozens of
ecosystems exist and an admin needs to sort "which of these actually need
my attention this quarter" — see §8), not a visitor-facing claim.** If it
is ever surfaced to visitors at all, it must render as a fact ("5 Products,
12 Articles published"), never as a subjective score.

### Archived is not a dead end

**Restored** re-enables exactly what the ecosystem had before Archiving:
its CMS content is untouched (archive-over-delete means the record and all
its nested Products/FAQ/Resources/CTAs are preserved exactly as they were,
consistent with doc 1 §5's "no independent lifecycle outside their parent
Ecosystem" — hiding/archiving the parent hides the children, it does not
delete them). Whether a Restored ecosystem needs re-review or goes straight
back to Published depends on how long it was archived and why:

- **Archived briefly for a clerical reason** (a partner relationship paused
  and resumed within weeks, no content went stale) — Restored goes straight
  back to its prior state (Published, or Published+Growing if it carried
  that tag), no re-review required.
- **Archived for a substantive reason** (the partner relationship actually
  ended and is being re-established with new terms, or the content sat
  archived long enough that Products/Articles may now be factually stale) —
  Restored should re-enter **Private Review**, not go straight to Published,
  so an admin re-confirms the content is still honest before it's public
  again. This is a judgment call for the admin making the Restore decision,
  not an automated rule this document tries to encode as a hard timeout —
  the same "don't invent a fake threshold" discipline as Growing applies
  here too.

---

## 4. Product Lifecycle

```
Draft → Preparing → Published → Updating → Deprecated → Archived
```

Extends doc 1 §4's Product schema (nested under Ecosystem, `visible:
boolean`, `badge` enum) with the process detail a boolean alone can't carry.

| State | Meaning | Visible to visitors? |
|---|---|---|
| **Draft** | Not yet live — the admin has created the Product row (doc 1 §6 step 4) but it is not ready to show; equivalent to `visible: false` with incomplete fields | No |
| **Preparing** | Not yet live, but content is substantially complete and pending a final check before going public — the distinction from Draft is completeness, not visibility; both render nothing to a visitor | No |
| **Published** | Live — fully rendering with `visible: true`, current and accurate | Yes |
| **Updating** | **Still live**, being actively revised — a visitor sees the current (pre-edit) content until the edit is saved; this is not a separate visibility state, it is a work-in-progress tag an admin applies while editing a Published Product so the admin list view (doc 2 §2) shows "this one is mid-edit" without ever hiding it from visitors mid-edit | Yes — unchanged, this is the one likely point of confusion this document resolves: **Updating is not "temporarily hidden," it is "visibly live, currently being revised behind the scenes"** |
| **Deprecated** | Still visible, but rendered with an honest notice ("không còn được cung cấp/hỗ trợ tích cực" — no longer actively offered) — a visitor can still see what the Product was and why it mattered, but is told plainly not to expect active support or updates | Yes — with the honest notice |
| **Archived** | Fully hidden — removed from the Ecosystem's rendered Products section entirely | No |

### Draft vs. Updating — the one likely ambiguity, resolved

**Draft** means "not yet live" — nothing about this Product has ever been
shown to a visitor. **Updating** means "already live, currently being
revised" — a visitor is looking at (or could look at) real, currently-
accurate content while an admin works on the next revision behind the
scenes. An admin never has to guess which to pick because the deciding
question is simply: **has this Product ever been Published before?** If
no, it's Draft (or Preparing, if content is far enough along). If yes, and
it's being actively edited right now, it's Updating — and Updating never
un-publishes the Product while the edit is in progress.

### Deprecated vs. Archived — the one required distinction

**Deprecated** keeps a Product visible with an honest "no longer actively
offered" notice — this matters commercially because a visitor who searched
for that specific product name (or arrived via an old external link)
should find a truthful page, not a 404 or a silent disappearance, and
should be told plainly rather than left to assume it's still current.
**Archived** removes it from view entirely — appropriate once the Product
is not just inactive but no longer relevant enough to reference at all
(e.g. it was renamed/replaced by a genuinely different Product, and keeping
the old one visible would confuse rather than inform). An admin should
default to Deprecated over Archived whenever there is real doubt, because
Deprecated is the more honest, more reversible choice — Archived is not a
harsher "more official" version of Deprecated, it is a different business
decision (stop referencing this at all vs. keep referencing it honestly as
no-longer-current).

---

## 5. Article Lifecycle

```
Draft → Review → Published → Updated → Archived
```

Extends doc 2 §5's Article workflow (`status: Draft → Published`, "later
edit/archive... retiring an Article means `status: Hidden`, never delete").

### Resolving "Updated": a fourth state or a timestamp?

This is a real ambiguity the requested lifecycle list surfaces, and this
document resolves it rather than gloss over it, against doc 2 §5's already-
frozen Article workflow.

**Recommendation: `Updated` is a `lastUpdatedAt` timestamp on a Published
Article, not a real fourth CMS state.**

Reasoning:

- Doc 2 §5 already defines the full workflow (Create draft → Fill fields →
  Fill SEO → Write body → Set relationships → Review → Publish → Later
  edit/archive) and explicitly frames "later edit" as going "through the
  same form" as authoring — an edit to a Published Article is not modeled
  there as a state transition, it's modeled as the same `status: Published`
  record getting new field values. Introducing a real `Updated` state now
  would mean either (a) contradicting doc 2 §5's frozen workflow by routing
  every edit through a state machine it never specified, or (b) adding a
  parallel concept doc 2 didn't reserve room for — both are exactly the
  kind of "restate wholesale, don't extend" mistake this document is
  supposed to avoid.
- A real state implies a *visitor-facing* distinction between "Published"
  and "Published, but recently edited" — but there is no honest reason a
  visitor's experience of an Article should differ based on whether it was
  edited yesterday or never. What a visitor legitimately benefits from
  knowing is *when* it was last updated (useful for the "Updates" category
  specifically, doc 1 §7, which doc 1 already flags as "most likely to go
  stale, so these should carry a visible published date on the card") —
  which a timestamp answers directly and a state does not.
- A `lastUpdatedAt` timestamp is strictly simpler for the admin (doc 2 §5's
  `CrudPage` modal already writes a row on save; a timestamp is a field
  update, not a workflow branch to navigate) and strictly more honest for
  the visitor (an exact date beats an ambiguous "this was Updated at some
  point" badge).

So the real Article lifecycle is: **Draft → Review → Published → Archived**,
with `lastUpdatedAt` as a plain timestamp field that updates every time a
Published Article is saved — visible on the card per doc 1 §7's own
recommendation for the "Updates" category, and available for every other
category too, at no extra conceptual cost.

### The rest of the lifecycle, restated only where new detail is needed

- **Draft → Review**: doc 2 §5 step 6 already covers this (`status` stays
  Draft; a second reviewer reads the rendered preview). This document adds
  nothing here.
- **Published → Archived**: archive-over-delete, same as everywhere else —
  `status: Hidden` (doc 2 §5 step 8's existing wording), reversible by an
  admin flipping it back, no re-review gate required unless the Article's
  factual content is now stale enough that an admin judges otherwise (same
  admin-judgment discipline as Ecosystem's Restored path, §3) — this
  document does not impose a mandatory re-review step doc 2 §5 never
  specified.

---

## 6. Partner Model

### A Partner is data attached to an Ecosystem, not a new hierarchy tier

Doc 2 §1 already draws the line for what counts as a real hierarchy level:
"Platform → Ecosystem → Product is the only real drill-down a human would
call 'hierarchy'... Article/Video/Resource/FAQ/CTA are owned children of
Ecosystem... but they are siblings of each other, not stacked levels." A
Partner (Company, Community, Startup, Exchange, AI Company, Education
Partner, Investment Partner) fits this exact pattern and this document does
not create an exception for it: **Partner is a new sibling of FAQ/Resource/
CTA — an owned, nested record attached to an Ecosystem — never a fourth
tier alongside Ecosystem/Product.**

Codebase grounding: today there is no dedicated "Partner" entity anywhere in
the repo. The closest real commercial-relationship precedent is Premium's
own `products` Supabase table (`src/app/portal/premium/page.tsx`) — a
paid-product catalogue with its own checkout flow, which is a *different*
concept (a product VO DUONG AI sells directly) from a Partner (an external
company/community/exchange an Ecosystem has an honest relationship with,
disclosed, not necessarily transactional). This document does not conflate
the two, and does not repurpose Premium's `products` table for Partner data
— Partner is new data, but new *data*, not a new architectural pattern.

### Partner fields (business shape, not schema)

A Partner record carries: name, type (Company / Community / Startup /
Exchange / AI Company / Education Partner / Investment Partner — a flat
enum, same pattern as doc 1 §3.1's `statusBadge` enum, not a browsable
hierarchy of its own per doc 2 §1's "Tags/category... are attributes,
never a browsable hierarchy tier"), a relationship description (plain text
— what this partner actually is to this ecosystem, in Vo Duong's own honest
framing, same voice rule as doc 1 §3.1's `fullIntro`), a real logo/link,
and an **honest disclosure of the commercial relationship** — is this an
affiliate arrangement, a paid sponsorship, an equity/ownership relationship,
or a purely informational listing with no commercial tie at all. This
disclosure is never optional and never hidden — it is a required field,
consistent with the "never hidden" standing rule this document is asked to
bake in, and consistent with doc 1 §8's existing affiliate-CTA disclosure
posture (CTAs are visibly labeled by `iconKind`, never disguised).

### Multiplicities, stated explicitly

- **Yes, a single Ecosystem can have multiple Partners.** This is exactly
  the "another reference relationship" doc 2 §4 already models for
  Article↔Product (many-to-many, scoped) — DigiU as an Ecosystem may
  legitimately have a Company partner, an Education Partner, and an
  Exchange partner simultaneously, each its own Partner record referenced
  by that Ecosystem's `partners` list, no new relationship type needed.
- **Yes, a Partner can span multiple Ecosystems.** Same reusable-referenced-
  not-duplicated pattern doc 2 §7 already establishes for the CTA template
  registry: one Partner record ("Example Exchange Co.") can be referenced
  by DigiU's `partners` list and Trading's `partners` list simultaneously,
  without two copies of that Partner's name/logo/relationship description
  existing. Each Ecosystem's reference to that Partner may carry its own
  relationship-description override (the same relationship might read
  slightly differently in context) the same way a CTA-instance can override
  a template's `role`/`order` without duplicating its base copy (doc 2 §3's
  CTA-instance/template split).

This is deliberately not a new architectural concept — it is the CTA
template pattern, applied to a different kind of reusable, cross-cutting
record, which is exactly why it is additive rather than a rearchitecture.

---

## 7. Affiliate Model (business lens)

Doc 2 §8 already specifies the admin field shape (`AffiliateLink` per
Product: `country`/`language`/`campaign`/`priority`/`status: Active|
Inactive`/`clickCount`, extending the real `DigitalAssetLink` precedent in
`src/data/digitalAssets.ts` which already carries `isAffiliate`,
`trackingCode`, `clickCount`, `status: Active|Inactive`). This section does
not re-specify those fields — it defines the **business lifecycle** they
serve.

```
Active → Paused → Expired → (Campaign variant) → Replacement → History → Analytics-Ready
```

- **Active** — the link is live, eligible to render per doc 2 §8's simple
  priority-among-Active-links rule.
- **Paused** — temporarily not eligible to render, without losing its
  record (maps to `status: Inactive` in the real field shape — this
  document does not add a second boolean, consistent with doc 2 §7's "this
  document does not introduce a second on/off flag, to avoid two booleans
  that can disagree" reasoning applied here to Affiliate Link too).
- **Expired** — the underlying commercial arrangement has actually ended
  (a partner's program closed, a campaign's window passed) — also maps to
  `status: Inactive`, but is a distinct *business* reason from Paused (an
  admin pausing to reconsider vs. an admin recording that the arrangement
  is genuinely over). The CMS field doesn't need a fourth enum value to
  capture this distinction — the business reason lives in the link's
  `campaign` label or an admin note, same "don't add a field just to
  capture a reason a human can just write down" restraint doc 2 already
  applies elsewhere.
- **Campaign** — not a separate lifecycle stage but a business
  *classification*: a link tagged with a specific `campaign` value (doc 2
  §8's field) is understood, at the business level, as time-bound —
  expected to move to Expired on a known date, unlike a Product's
  "default" evergreen link which has no natural expiry.
- **Replacement** — an old link is superseded by a new one (a partner
  rotates its affiliate program, changes its tracking domain, or updates
  commercial terms). **The old link's history/analytics must survive the
  swap.** Conceptually: the old `AffiliateLink` record is set to Expired
  (never deleted, archive-over-delete), and the new link is a **new**
  record — not an edit-in-place of the old one's `url` — so the old
  record's accumulated `clickCount` and any future analytics keep meaning
  what they always meant (clicks on *that specific* arrangement), rather
  than being silently reinterpreted as clicks on the new arrangement.
  Conceptually, the new record may carry a `supersedes`-style reference
  back to the old one (same pattern as Article's typed relationship
  fields, doc 2 §4 — a named pointer, never a generic blob) so an admin
  reviewing history can trace "this is what replaced that," but this
  document does not specify that field's exact name — that is doc 2's
  domain, not this one's.
- **History** — every Expired/Replaced link's record persists, readable,
  never deleted — this is the archive-over-delete rule applied to
  Affiliate Link specifically, and it is what makes "Replacement" honest
  (nothing about swapping links erases what actually happened under the
  old one).
- **Analytics-Ready** — a real business state, not a UI label: a link
  reaches Analytics-Ready when **real click/conversion data exists to
  report on** — some meaningful, real traffic has actually occurred. A
  link with zero real traffic yet (freshly Active, no clicks) is **not**
  Analytics-Ready and must render an honest "chưa đủ dữ liệu" ("not enough
  data yet") state wherever its performance would otherwise be shown —
  never a fabricated number, a zero dressed up as a metric, or a
  placeholder chart. This is the identical discipline CKOS's Case Study
  section already applies to zero real rows, extended here to the one
  other place in this Platform most tempted to grow a fake stat (doc 2 §3
  already flags Affiliate Link as exactly that entity).

### Multi-country / multi-language, at the business level

A Partner or a Product may legitimately have **region-specific commercial
terms** — a different affiliate arrangement for Vietnamese visitors than
for a global audience, or a different partner entirely per country. At the
business level this is not a new concept: it is simply multiple
`AffiliateLink` records under the same Product, each carrying its own
`country`/`language` value (doc 2 §8's existing fields), with the
already-specified priority-among-Active-links rule choosing which renders
when. This document does not re-specify doc 2 §8's field-level design or
its explicit non-authorization of real geo-IP/campaign-routing logic — it
only confirms, at the business level, that "the same Partner relationship
can honestly differ by region" is already representable without any new
architecture, because a region-specific term is just another Active link
with a `country` value set, not a new kind of record.

---

## 8. Growth Model

Honest assessment at 500 Ecosystems / 20,000 Products / 500,000 Articles /
millions of users — the **lifecycle/business-process** question, not the
technical scaling question doc 2 §9 already answers (referenced, not
repeated: doc 2 §9 already establishes that Article must graduate to typed
Postgres columns with server-side pagination before 100,000 rows, that
Ecosystem/Product/FAQ/Resource/CTA stay fine as JSONB collections at
hundreds-to-low-thousands of rows, and that the one-shared-template render
rule holds unchanged at any ecosystem count).

### Does "Private Review" (§3) still work manually at 500 Ecosystems?

**No — not as a single admin's manual glance-and-approve step.** At 5-20
ecosystems, one admin reviewing each Draft-to-Published transition
personally is realistic. At 500, the honest answer is that **manual review
by a single person does not scale as a *process*, even though the
lifecycle *states themselves* (Draft/Private Review/Published/Growing/
Archived/Restored) remain exactly correct.** What breaks is not the state
machine, it's the assumption that one person's attention is the review
mechanism. This document does not solve that problem (assigning reviewers,
building a review queue, defining SLAs for how long something may sit in
Private Review) — it explicitly **reserves** the need for a
**review-queue/workflow-assignment concept** as a future addition: a
`reviewerId` or `assignedTo`-style field on the Ecosystem record, and a
filtered admin view ("ecosystems awaiting my review") are additive
extensions of the existing `CrudPage` pattern (doc 2 §2), not a
rearchitecture — but this document does not authorize building either now,
consistent with the "reserve, don't build" instruction governing this
whole document.

### Does a flat Partner list (§6) stay browsable at scale?

**No.** A flat list of Partners is fine at a handful; at hundreds (500
Ecosystems, plausibly several Partners each, with real reuse across
Ecosystems per §6) a flat admin list becomes unbrowsable the same way doc 2
§9 already found for Article at 100,000 rows — the failure mode is
identical in shape even though the numbers are smaller: an admin needs to
filter/search, not scroll. Doc 2's own dividing line (§2: something becomes
its own filterable/searchable admin surface once its natural count is
large) applies here too. This document does not authorize building
Partner-type filtering, category grouping, or a dedicated Partner
`CrudPage` list view with search now — it flags that **Partner needs its
own type/category-based organization in the admin UI before it reaches
low-hundreds of rows**, the same honest "before this number, not
optional" framing doc 2 §9 uses for Article's pagination requirement.

### What else genuinely needs new process design, not more servers

- **Partner renewal/expiry as a business process.** A commercial
  relationship with a Partner is not indefinite — terms lapse, need
  renegotiation, or need a decision to end. At a handful of Partners, an
  admin remembers this. At hundreds, "who is tracking which partnership
  needs renewal by when" is a real operations question this document
  flags but does not solve — it is not answered by any lifecycle state
  defined in §3-§7, because none of those states carry a renewal-date
  concept. A future addition (a `renewalDueAt`-style field, feeding an
  admin-facing "renewals coming up" view) would be additive to the Partner
  record (§6) — reserved as a likely future field, not built now.
- **Affiliate Replacement (§7) at volume.** One admin manually noticing "a
  partner rotated their tracking domain" works at a handful of links; at
  thousands of Active links across 20,000 Products, that noticing has to
  become a process (a partner notifies VO DUONG AI, or a scheduled check)
  rather than an admin's memory. This document does not design that
  process — it flags that the *lifecycle* (Active→Paused→Expired→
  Replacement→History) holds unchanged at scale, but the *trigger
  mechanism* for who initiates a Replacement needs real operational design
  once volume passes what one admin can track by eye.
- **What does NOT need new process design**: the Ecosystem/Product/Article
  lifecycle *states themselves* (§3-§5) hold unchanged at 500/20,000/
  500,000 — nothing about having more Ecosystems changes what Draft,
  Published, Growing, Archived, or Restored *mean*. The growth-model
  problem at this scale is entirely about **who does the reviewing/
  organizing/renewing**, never about the shape of the lifecycle itself.

---

## 9. Future Expansion

For each future feature: what it attaches to, the one provision reserved
now, and what is explicitly not being built.

### Ratings

- **Attaches to**: Product (primarily) or Ecosystem — wherever a visitor
  would reasonably want to know "did this actually work for others."
- **Reserved now**: nothing beyond the plain fact that no field for a
  rating/average/score exists anywhere in doc 1's or doc 2's schema (doc 1
  §5 already states this explicitly: "nothing in this schema has a field
  for 'stats,' 'testimonials,' or 'success rate'"). The one provision this
  document reserves is conceptual, not a field: **if Ratings is ever built,
  it must render nothing — no average, no star count, no fabricated
  placeholder — until real submissions exist**, identical to Case Study's
  zero-row honesty. There is no field to reserve for a fake number because
  there must never be one.
- **Not being built now**: any rating submission mechanism, any aggregate
  score, any UI surface for it at all.

### User Reviews

- **Attaches to**: Product or Ecosystem, same reasoning as Ratings.
- **Reserved now**: same as Ratings — the discipline to reserve is
  behavioral (render nothing until real, attributable, consented reviews
  exist — same consent bar Case Study already requires: "created only when
  a real result exists AND the person involved has consented to
  publication," CKOS §6), not a schema field.
- **Not being built now**: any review submission/moderation mechanism.

### Companion Recommendations

- **Attaches to**: Ecosystem or Product, surfaced through Companion's
  existing single presence per page (doc 1 §11).
- **Reserved now**: if built, a Companion Recommendation must be a
  **single reference pointer** — an id into an existing Ecosystem/Product/
  Article/Tool/Prompt/Lesson — never a freeform-authored text field an
  admin types Companion-voiced copy into. This is the exact discipline doc
  2 §3 already enforces for Article's `companionSuggestionRef` ("it is
  never a text field an author types Companion-voiced copy into, because
  Companion's actual wording is templated at render time... a free-text
  field here would let an author accidentally fabricate or duplicate
  Companion's voice"). Extending Companion Recommendations to Ecosystem/
  Product would reuse that identical field shape, and must inherit doc 1
  §11's "never repeats a sentence used elsewhere in Portal" rule the same
  way. This is also how Companion Recommendations is **structurally
  prevented from becoming persuasive/sales-toned**: because the field is a
  reference, not free text, an admin cannot type urgency/scarcity language
  into it even if tempted — the actual wording is always template-
  generated from the same objective-tone templates doc 1 §11 already
  specifies (cites, never re-authors; frames as decision aid, never push).
- **Not being built now**: the recommendation engine/matching logic itself,
  any admin UI for it, any new field beyond confirming the existing
  reference-pointer pattern extends here too.

### Personalized Opportunities

- **Attaches to**: a new, genuinely new concept — a per-visitor view over
  existing Ecosystem/Product data, not a new content type.
- **Reserved now**: nothing schema-side; the reservation is architectural
  restraint — Personalized Opportunities must be built as a *filter/sort*
  over real Ecosystem/Product records a visitor's real activity already
  touched (same pattern as Journey's real-activity-only reflection, CKOS's
  Final Knowledge Flow), never a feature that requires inventing synthetic
  "recommended for you" data.
- **Not being built now**: any personalization/recommendation logic,
  any per-user preference storage.

### Saved Opportunities

- **Attaches to**: a new join concept — a visitor ↔ Ecosystem/Product
  bookmark, not a change to Ecosystem/Product themselves.
- **Reserved now**: the invariant that a Saved Opportunity is a reference
  (visitor id + Ecosystem/Product id), never a duplicated copy of the
  Ecosystem/Product's content — same reference-don't-duplicate discipline
  as everything else in this Platform.
- **Not being built now**: the save/bookmark mechanism, any UI for it.

### Notifications

- **Attaches to**: cuts across Ecosystem (e.g. "an ecosystem you saved was
  Updated") and Article (e.g. "a new Article was published in an ecosystem
  you follow") — a new delivery concept, not owned by either.
- **Reserved now**: the one provision worth reserving is that Article's
  `lastUpdatedAt` timestamp (§5's recommendation) and Ecosystem/Product's
  real status transitions (§3-§4) already exist as the *triggering
  events* a future Notification system would key off of — no new event
  data needs to be invented later, because the lifecycle states this
  document defines already carry the timestamps/transitions a
  notification would fire on.
- **Not being built now**: any notification delivery mechanism (email,
  push, in-app), any subscription/preference model.

### Version History

- **Attaches to**: Article primarily (highest-churn entity per doc 2 §3),
  potentially Ecosystem/Product.
- **Reserved now**: nothing beyond the fact that archive-over-delete
  (§3-§5, and the standing Portal rule) already means no record is ever
  hard-deleted — a future Version History feature is fundamentally "show
  the sequence of saves that already didn't get thrown away" rather than a
  feature requiring new retention policy. The one thing worth reserving is
  conceptual: don't delete edit history at the application level even
  before a Version History UI exists to show it (a note for future
  implementation-level decisions, not authorized here).
- **Not being built now**: any diff/version UI, any explicit version-row
  storage design (that's a doc-2-level schema decision for later).

### Localization

- **Attaches to**: Ecosystem, Product, Article — any content-bearing
  entity.
- **Reserved now**: this document picks **a separate translation-shadow-
  record concept over a field-per-locale approach**, and states the
  reason: a field-per-locale design (`name_en`, `name_vi`, `fullIntro_en`,
  `fullIntro_vi`...) means every future language multiplies every
  content field on every existing entity — exactly the kind of change
  doc 2 §2's dividing line warns against ("unbounded... needs its own
  detail route/permalink"; a locale is unbounded the same way Article
  volume is). A shadow-record model (one canonical Ecosystem/Product/
  Article record, plus N `EcosystemTranslation`-style records each
  scoped by `entityId` + `locale`, mirroring exactly how Article already
  scopes by `ecosystemId` per doc 2 §2) is additive — adding a new
  language is adding new rows, never altering every existing entity's
  column set. This is the same "unbounded count → its own scoped
  collection, not a field explosion on the parent" reasoning doc 2 §2
  already applies to Article vs. nesting it in Ecosystem.
- **Not being built now**: any translation record, any locale-switching
  UI, any admin translation workflow.

### A/B Campaigns

- **Attaches to**: CTA (doc 1 §10, doc 2 §7) and/or the Affiliate Model's
  `campaign` field (§7) — an experiment over which existing CTA/link
  variant renders, not a new content type.
- **Reserved now**: nothing beyond confirming that CTA's existing
  `role`/`order`/`visible` shape and Affiliate Link's existing `campaign`
  field (doc 2 §7-§8) are already variant-shaped enough that an A/B test
  is "which of several already-real CTA/link records renders to this
  visitor," not a new record type. No reservation beyond that — this is
  explicitly a case where the existing fields already suffice
  conceptually, and no proactive field addition is needed.
- **Not being built now**: any actual split-testing mechanism, traffic
  allocation, or statistical-significance reporting — and, consistent
  with §7's existing non-authorization, no visitor-context detection
  infrastructure this would depend on.

---

## 10. Admin Philosophy

**One-sentence mental model an admin should hold**: *"I manage content and
relationships; the Platform handles everything else."*

This is the business-level synthesis of doc 1 §1's "adding an ecosystem is
authoring a CMS entry, never authoring a page" and doc 2 §10's "at no point
does the admin open a code editor, ask for a deploy, or wait on an
engineer" — restated once more here because this document is the place
where it becomes a philosophy of *decisions*, not just a description of
*workflow*.

Four concrete examples of the shift this represents — each phrased as a
content decision, never a technical one:

1. **Moving an Ecosystem from Draft to Published (§3)** is not "deploy the
   new route" — it is the decision *"I believe this ecosystem's Overview
   and CTA are honest and complete enough to show a real visitor."* The
   admin is making a judgment about readiness and honesty, not about
   infrastructure.
2. **Adding a Partner to an existing Ecosystem (§6)** is not "build a new
   partnership page" — it is the decision *"this real company/community/
   exchange genuinely relates to this ecosystem, and here is the honest,
   disclosed description of how."* The admin decides what's true about the
   relationship; the Platform handles rendering it consistently wherever
   Partners appear.
3. **Replacing an expiring Affiliate Link (§7)** is not "update the tracking
   script" — it is the decision *"this specific commercial arrangement has
   changed, and the old one's history should stay intact rather than be
   erased or silently reinterpreted."* The admin decides what happened
   commercially; the Platform's Replacement/History lifecycle preserves the
   record correctly.
4. **Tagging an Ecosystem as Growing (§3)** is not "flip a performance
   flag" — it is the decision *"I have looked at this ecosystem's real
   content and engagement and judge it has moved past 'just launched.'"*
   The admin makes a subjective, honest call about maturity; the Platform
   never computes that judgment from a formula that could be gamed or
   could quietly become a fabricated metric.

In each case, the admin's job is to decide *what is true and what should be
shown* — the Platform's job (already fully specified by doc 1's rendering
contract and doc 2's CMS mechanics) is to make that decision reality
without ever requiring the admin to think about routes, components, or
schemas.

---

## Quality Gate — Self-Assessment

**Would this architecture still hold if VO DUONG AI became 100x larger?**
This section addresses lifecycle/business-process concerns only — pure
data/scaling questions (JSONB vs. typed columns, pagination, query
indexes) are doc 2 §9's domain and are not re-litigated here; where
relevant they are cross-referenced, not repeated.

- **The Ecosystem/Product/Article lifecycle states (§3-§5) hold at 100x.**
  Nothing about having 500 Ecosystems instead of 5 changes what Draft,
  Private Review, Published, Growing, Archived, Restored actually *mean*,
  or what Draft/Preparing/Published/Updating/Deprecated/Archived mean for
  a Product, or what Draft/Review/Published/Archived (+`lastUpdatedAt`)
  mean for an Article. The state machines are count-independent by design.

- **The two structural invariants (§2) hold at 100x.** "An Ecosystem is
  always CMS content, never code" and "a business relationship is always
  data attached to an Ecosystem/Product, never a special-cased page" are
  exactly as true at 500 Ecosystems and hundreds of Partners as they are
  at 5 and a handful — doc 1's one-shared-template rule and doc 2's
  reference-don't-duplicate relationship model don't degrade with volume;
  that durability is the entire reason those two docs were written as
  frozen contracts in the first place.

- **Where the answer is honestly "the lifecycle model holds, but the
  business PROCESS around it becomes a real operations design question
  this document flags but does not solve"** (§8, restated once here as the
  Quality Gate's central finding):

  - **Who reviews what**, once Private Review (§3) can no longer be one
    admin's manual glance at 500 Ecosystems — this document reserves a
    review-queue/assignment concept as a future additive field, but does
    not design the actual review process (who is a reviewer, how work gets
    assigned, what SLA governs how long something sits in review).
  - **How partnerships get renewed**, once Partner (§6) exists in the
    hundreds rather than a handful — this document reserves a future
    `renewalDueAt`-style field and flags that Partner needs type/category
    admin-UI organization before it reaches low-hundreds of rows (§8), but
    does not design the actual renewal workflow (who tracks upcoming
    renewals, who initiates renegotiation, what happens if a renewal
    lapses silently).
  - **Who notices an Affiliate Replacement (§7) is needed**, once Active
    links number in the thousands rather than a handful — the lifecycle
    (Active→Paused→Expired→Replacement→History) is unchanged at volume,
    but the trigger mechanism (a partner notification process, a scheduled
    audit, something else) is real operations design this document
    explicitly does not solve.

- **What this Quality Gate does not re-assess**: the technical/data
  scaling questions doc 2 §9 already answered honestly (Article's typed-
  column graduation before 100,000 rows, the admin list's need for
  server-side pagination, the render-side note that a single ecosystem
  accumulating hundreds of Products would need in-page pagination) remain
  doc 2's answers — this document's 100x check is scoped to lifecycle and
  business process, per its own charter, and defers to doc 2 §9 by name
  rather than repeating or re-deriving its conclusions.

**Overall verdict**: the lifecycle and structural-invariant layer of this
architecture is built to hold at 100x without modification — that was the
explicit design goal, and every section above was written to keep it true.
The one honest limitation this Quality Gate surfaces is that **lifecycle
correctness does not by itself guarantee operational capacity** — at 100x,
several of the *processes* that operate the lifecycle (who reviews, who
renews, who notices a swap is needed) need real operational design that
this document deliberately does not attempt, consistent with its mandate
to flag future needs rather than build or fully solve them now.
