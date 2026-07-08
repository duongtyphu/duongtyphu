# Project Ecosystem Architecture — Portal 4.0

**Status: Design-first contract. No implementation in this document —
Projects & Opportunities must be rebuilt against this contract, not
around it. This document contains no code, no SQL DDL, and touches no
`.tsx`/`.ts` file.**

This document follows the same posture as `CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md`:
it is a frozen ownership/rendering contract, not a feature pitch. It
corrects a specific, named defect the Product Owner identified in the
current `/portal/duan-cohoi` implementation and replaces it with one
that is CMS-driven end to end.

---

## 1. Overall Architecture

### The conceptual model

```
Projects & Opportunities Hub  (/portal/duan-cohoi)
        │
        ├── Ecosystem: DigiU
        ├── Ecosystem: SolarGroup
        ├── Ecosystem: Crypto
        ├── Ecosystem: Blockchain
        ├── Ecosystem: Trading
        └── Ecosystem: N+1 …  (added later, zero new code)
```

Today the Hub is one list page (`src/app/portal/duan-cohoi/page.tsx`)
whose `ECOSYSTEMS` array is a hardcoded const with a `title`,
`description`, `whoFor`/`whoNotReady`/`learnFirst`/`expectedOutcome`
per ecosystem — and an `href` field. That `href` is the defect: every
card's `href` points into `/portal/digital-assets/category/[slug]`
(`digiu`, `equity`, `crypto`, `blockchain`, `trading`). That
`digital-assets` area (`src/app/portal/digital-assets/**`) renders
under the H1 **"ĐẦU TƯ CÙNG TÔI"** — it is a personal-holdings /
watch-list catalogue: a flat, cross-category grid of individual
`DigitalAssetProject` cards (each with `whatIsIt`/`whyInterested`/
`whoForIt`, a badge like "Đang theo dõi"/"Đang tham gia", filters by
category/badge/search) plus a shared article list. It answers "what
is Vo Duong personally tracking or holding right now," one project at
a time. It is **not** an ecosystem's own home — there is no single
page anywhere that represents "DigiU as a whole" (hero, video,
product hierarchy, FAQ, its own CTA set). Clicking a Hub card today
therefore does not land the visitor on the ecosystem it just read
about; it lands them in an unrelated personal watch-list filtered to
a same-named category. This is the concept-level bug the Product
Owner is naming, and it is confirmed by reading both files: the two
areas were never designed as the same concept, they only happen to
share five category names.

### The corrected model

An **Ecosystem** (DigiU, SolarGroup, Crypto, Blockchain, Trading, and
any future one) becomes a first-class content object with its own
mini website: Overview/Hero, Intro Video, a Projects/Products list
**scoped to that ecosystem**, Articles, FAQ, optional Resources, and a
multi-button CTA — all seven sections described in full in §3. The
Hub stays the entry list; each card now links to the ecosystem's own
mini-site route (§2), never to `digital-assets`.

`digital-assets` ("Đầu tư cùng tôi") is not deleted or folded in by
this document — it remains its own personal-holdings/watch-list
pillar (a flat catalogue across all ecosystems, from the visitor's
"what should I keep an eye on" angle). The Ecosystem mini-site is a
different angle: "what is this ecosystem, is it for me, what would I
learn first." The two may cross-link (an ecosystem's Products section
may reference the matching `digital-assets` entries as reference-only,
same "reference, don't duplicate" discipline CKOS already uses), but
neither owns the other's data, and digital-assets category pages are
never again the destination for an ecosystem card.

### Rendering pipeline (conceptual)

```
CMS content (Admin-authored, per ecosystem)
        ↓
Typed content model  ("Ecosystem" + its owned sub-entities, §4/§5)
        ↓
One shared template component tree
  (EcosystemHero → IntroVideo → ProductsList → ArticlesList
   → FAQList → ResourcesList → CTAGroup → CompanionPanel)
        ↓
One dynamic route, rendered per ecosystem via its slug
  (/portal/duan-cohoi/[ecosystemSlug])
```

No ecosystem gets a bespoke file, bespoke layout, or bespoke section
order. The template renders whatever sections the CMS entry has
populated and toggled visible, in the CMS-defined order, and renders
an honest empty/omitted state for anything not filled in (§3, §9,
§12). Adding an ecosystem is authoring a CMS entry, never authoring a
page — this constraint is absolute and is the single thing every other
section in this document exists to make possible.

---

## 2. Navigation

### URL scheme

| Route | Purpose |
|---|---|
| `/portal/duan-cohoi` | Hub — the existing list page, kept, cards fixed (see below) |
| `/portal/duan-cohoi/[ecosystemSlug]` | One ecosystem's mini website, one shared template, e.g. `/portal/duan-cohoi/digiu` |
| `/portal/duan-cohoi/[ecosystemSlug]#products` | In-page anchor to the Projects/Products section |
| `/portal/duan-cohoi/[ecosystemSlug]#articles` | In-page anchor to Articles |
| `/portal/duan-cohoi/[ecosystemSlug]#faq` | In-page anchor to FAQ |
| `/portal/duan-cohoi/[ecosystemSlug]#resources` | In-page anchor to Resources |
| `/portal/duan-cohoi/[ecosystemSlug]/articles/[articleSlug]` | Optional: a single article's own permalink, if an ecosystem's articles need SEO-indexable individual pages (see §7) |

Sub-sections within a mini-site are **in-page anchors under one route**,
not separate routes — Overview/Video/Products/Articles/FAQ/Resources/CTA
are regions of the same server-rendered page, consistent with how a
"mini website" should feel like one continuous page a visitor scrolls
and jumps around, not a mini-navigation of its own. Only the article
permalink (for SEO and shareability, §7) breaks out to its own route,
same pattern the Hub already uses for `digital-assets/articles/[slug]`.

### Breadcrumb model

```
Portal → Dự án & Cơ hội → {Ecosystem name}
```

On an article permalink:

```
Portal → Dự án & Cơ hội → {Ecosystem name} → {Article title}
```

Breadcrumbs are derived, not authored — the ecosystem name and article
title come straight from the CMS entry, so there is no separate
breadcrumb-copy field to maintain.

### Fixing the Hub's card links

Each Hub card's destination becomes:

```
href = `/portal/duan-cohoi/${ecosystem.slug}`
```

replacing today's `href: "/portal/digital-assets/category/digiu"` etc.
The Hub card itself keeps its existing job (status badge, `whoFor`/
`whoNotReady`/`learnFirst`/`expectedOutcome` teaser) — it is a
decision-aid preview, and now correctly hands the visitor off to the
ecosystem's own mini-site rather than an unrelated personal-holdings
filter. `whoFor`/`whoNotReady`/`learnFirst`/`expectedOutcome` migrate
from the current hardcoded array into the CMS Overview section (§4) so
the Hub card and the mini-site's Companion (§11) read from the same
one source, never two copies that can drift apart.

---

## 3. Mini Website Structure

Each ecosystem mini-site renders up to seven sections, in this fixed
order, from one shared template. Order is fixed by the template (not
CMS-reorderable) so every ecosystem feels like the same product;
**visibility** of each section is CMS-toggled, and section 5 (Resources)
is the only fully optional one by design — the rest degrade to an
honest empty state rather than disappearing outright (§12), except
where noted.

### 3.1 Overview / Hero — required

- **Logo** — ecosystem mark (image or the same emoji-icon convention
  `digitalAssets.ts` already uses, e.g. `🌐`).
- **Short description** — one to two sentences, the same role as the
  Hub card's `description` today.
- **Full intro** — richtext body: what this ecosystem is, in the
  ecosystem's own words plus Vo Duong's honest framing (never a
  fabricated "about us").
- **Highlights** — a short ordered list of factual points (not
  claims/stats) — e.g. "Ra mắt năm X", "Hoạt động tại Y quốc gia" —
  never a metric that isn't independently verifiable.
- **Status badge** — reuses the existing badge vocabulary ("Đang theo
  dõi" / "Đang nghiên cứu" / "Chia sẻ trải nghiệm" / "Đang tham gia").
- **Readiness fields** — `whoFor` / `whoNotReady` / `learnFirst` /
  `expectedOutcome` (moved here from the Hub's hardcoded array, §2).
  These are required — they are the fields Companion depends on (§11).

### 3.2 Intro Video — optional, honest-empty if absent

One embeddable video slot. Supports YouTube, Vimeo, or a generic
embed URL (see §9 for the fallback behavior).

### 3.3 Projects / Products — optional, honest-empty if absent

A **scoped sub-list** of products/projects belonging only to this
ecosystem — this is the section that most directly fixes the current
defect, since today nothing shows "DigiU's own product list" anywhere.
Products may nest one level, matching the real-world hierarchy the PO
described:

```
DigiU (Ecosystem)
 ├─ WebWisePay        (Product)
 ├─ AlphaMind          (Product)
 ├─ Deposits           (Product)
 └─ Shares             (Product)
```

Each Product has its own short description, optional logo/image,
optional link out (official site, whitepaper, etc.), and optional
status badge (reusing the same badge vocabulary as §3.1). A Product
is not a full mini-site of its own — it is a card/row within this
section; if a Product later warrants its own depth, that is a future
decision, not something this template pre-builds.

### 3.4 Articles — optional, honest-empty if absent

A list of articles scoped to this ecosystem, each with a category tag
(§7). Rendered as cards (title, excerpt, category, date), linking to
either the in-page anchor detail or the dedicated article permalink
route (§2), per how the CMS entry is configured.

### 3.5 FAQ — optional, honest-empty if absent

Ordered list of question/answer pairs, same accordion pattern already
used on the Hub page today (`FAQ` const) — moved from hub-wide generic
questions to per-ecosystem specific ones, while the Hub itself may
keep a small set of hub-wide FAQ entries (e.g. "is this investment
advice") as a separate, template-level default.

### 3.6 Resources — fully optional

Downloadable/linked materials, typed as PDF / Presentation / Website /
Document (same shape as `src/data/resources.ts`'s existing resource
type conventions). This section simply does not render if empty — no
placeholder card, no "coming soon."

### 3.7 Call To Action (multi-button) — required

A configurable set of buttons (§10) — always at least one PRIMARY
plus zero or more secondary buttons. Rendered once, typically pinned
near the top (after Overview) and repeated at the bottom of the page,
same as long-form landing patterns elsewhere in the product — but this
is a rendering-position detail, not a new architectural rule.

**Section presence summary**

| Section | Required? | Empty behavior |
|---|---|---|
| Overview/Hero | Yes | N/A — cannot publish without it |
| Intro Video | No | Section omitted |
| Products | No | Honest empty-state line (§12), not omitted, since a visitor arriving at "DigiU" reasonably expects to check for products |
| Articles | No | Section omitted |
| FAQ | No | Section omitted |
| Resources | No | Section omitted |
| CTA | Yes | N/A — cannot publish without at least one PRIMARY CTA |

---

## 4. CMS Structure

One CMS entity, **Ecosystem**, owns everything below as nested,
CMS-editable fields/sub-collections — matching the same
field/ordering/visibility conventions already used by the
`portal-builder` admin module (`welcomeSeed`, `portalSectionsSeed`,
each section carrying an `order` and a `visible` boolean edited via
move-up/move-down controls and a toggle, per
`src/app/admin/(dashboard)/portal-builder/page.tsx`).

### Ecosystem (top-level record)

| Field | Type | Notes |
|---|---|---|
| `id` | text | stable identifier |
| `slug` | text | drives `/portal/duan-cohoi/[slug]` |
| `name` | text | e.g. "Hệ sinh thái DigiU" |
| `logo` | image | or emoji string, matching existing icon convention |
| `shortDescription` | text | used by both Hub card and mini-site hero |
| `fullIntro` | richtext | Hero full body |
| `highlights` | ordered list of text | factual bullet points only |
| `statusBadge` | enum | "Đang theo dõi" / "Đang nghiên cứu" / "Chia sẻ trải nghiệm" / "Đang tham gia" |
| `whoFor` | richtext | readiness field, feeds Companion |
| `whoNotReady` | richtext | readiness field, feeds Companion |
| `learnFirst` | { label: text, href: url } | cross-pillar pointer, feeds Companion + §11 |
| `expectedOutcome` | richtext | readiness field, feeds Companion |
| `video` | { provider: enum(YouTube/Vimeo/Embed), url: url, visible: boolean } | §9 |
| `products` | ordered list of Product records | §4 sub-schema below |
| `articles` | reference list → Article records scoped to this ecosystem | §7 |
| `faq` | ordered list of { question: text, answer: richtext } | |
| `resources` | ordered list of Resource records | §4 sub-schema below |
| `ctas` | ordered list of CTA records | §10 |
| `sectionVisibility` | { video: boolean, products: boolean, articles: boolean, faq: boolean, resources: boolean } | per-section on/off, independent of whether content exists — lets an admin hide a section even if partially filled |
| `order` | number | Hub listing order |
| `status` | enum | "Draft" / "Published" / "Hidden" — same three-state convention as `DigitalAssetProject.status` |

### Product (nested under Ecosystem)

| Field | Type |
|---|---|
| `id` | text |
| `name` | text |
| `logo` | image |
| `shortDescription` | text |
| `link` | url (optional) |
| `badge` | enum (same vocabulary as Ecosystem's statusBadge) |
| `order` | number |
| `visible` | boolean |

### Resource (nested under Ecosystem)

| Field | Type |
|---|---|
| `id` | text |
| `title` | text |
| `type` | enum ("PDF" / "Presentation" / "Website" / "Document") |
| `url` | url |
| `order` | number |

### CTA (nested under Ecosystem) — detailed in §10

| Field | Type |
|---|---|
| `id` | text |
| `label` | text |
| `url` | url |
| `role` | enum ("primary" / "secondary") |
| `iconKind` | enum (Official Website / Register / Affiliate / Telegram / Facebook / YouTube / Whitepaper / Download App) |
| `order` | number |
| `visible` | boolean |

This schema is concrete enough to build a `CrudPage`/`useCollection`-style
admin module from later (same pattern as `src/components/admin/CrudPage.tsx`
and `useCollection` in `src/lib/admin/store.ts`, which already back
Prompts/Tools/Resources/Portal Builder) — but building that admin
module is a future implementation step, not part of this document.

---

## 5. Database Concept (no SQL)

Following the ownership-and-lifecycle narrative style of
`CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md` §1–7, not DDL:

**Ecosystem** is the root entity. It owns its own Overview fields
directly (no separate table needed for Hero content — it is
low-cardinality enough to live on the Ecosystem row itself, same as
`DigitalAssetCategory` today holds `name`/`description`/`icon`/`color`
inline).

**Product** belongs to exactly one Ecosystem (one-to-many,
foreign-key-shaped: `product.ecosystemId → ecosystem.id`). A Product
never belongs to more than one ecosystem — if the same real-world
brand genuinely spans two ecosystems, it is modeled as two Product
records, not a many-to-many join, to keep the "one ecosystem = one
scoped list" guarantee simple and honest.

**Article** belongs to exactly one Ecosystem (`article.ecosystemId →
ecosystem.id`) and carries one `category` (§7 taxonomy). Whether
Article is its own top-level table (as `case_studies` and
`documents`/`prompt_templates` already are, per the Supabase migration
files under repo root and `supabaseCollections.ts`) or an
ecosystem-scoped array is an implementation choice for later — this
document only fixes the relationship (belongs to exactly one
Ecosystem, optionally referenced elsewhere read-only) and defers the
"shared pool vs scoped" storage decision to §7.

**FAQ item**, **Resource**, **CTA button** are each owned by exactly
one Ecosystem, nested/child records — no independent lifecycle outside
their parent Ecosystem (deleting/hiding the Ecosystem hides them too;
this mirrors how `portal-sections` entries are owned by the single
Portal Builder collection today rather than existing independently).

**Relationship to existing real Portal entities** (same "reference,
don't duplicate" discipline CKOS's Consumption Matrix already
enforces):

| Ecosystem field | Points to | Contract |
|---|---|---|
| `learnFirst` | CKOS Tool / Prompt / Lesson, or Academy Journey | reference-only — Ecosystem stores a label+href, never re-authors the target's content |
| Companion's cross-pillar prompts (§11) | CKOS (what to learn first), Academy (what Journey to complete), Workspace (what practice helps), Journey (reflection) | reference-only, same as `learnFirst` |
| Products' optional `caseStudyRef` (future field, not required now) | `case_studies` table | reference-only, **primary consumer stays Projects overall**, per the existing Knowledge Object Consumption Matrix — an Ecosystem's Products section may point at a matching Case Study once real rows exist, never fabricate one meanwhile |

**No fake data, structurally enforced**: nothing in this schema has a
field for "stats," "testimonials," or "success rate." The only place a
real outcome could ever appear is via a reference to the existing
`case_studies` table — and per CKOS's contract (§6 there), that table
has zero real rows today, has no static fallback file, and must never
get one. An Ecosystem mini-site that wants to show proof therefore
renders Case Study's own existing honest-empty-state component
(already built for `/portal/case-studies`), never an ecosystem-specific
substitute. This is what makes fabrication structurally impossible
rather than merely discouraged: there is no field to put a fake number
in, and the one legitimate proof source is read-only and already
governed by the zero-row honesty rule.

---

## 6. Admin Workflow

An administrator creates or edits an ecosystem entirely through CMS
forms, zero custom pages, in this order:

1. **Create ecosystem shell** — name, slug, logo, status = Draft.
2. **Fill Overview** — shortDescription, fullIntro, highlights,
   statusBadge, whoFor/whoNotReady/learnFirst/expectedOutcome.
3. **Add video** (optional) — pick provider, paste URL, toggle visible.
4. **Add Products** — add rows (name, logo, shortDescription, link,
   badge), reorder via move-up/down, toggle each visible.
5. **Write Articles** — attach existing articles scoped to this
   ecosystem or author new ones (§7), assign category.
6. **Set FAQ** — add ordered question/answer pairs.
7. **Attach Resources** (optional) — add rows with type + url.
8. **Configure CTAs** — add buttons, mark exactly one `role: primary`,
   assign `iconKind`, reorder, toggle visible (§10).
9. **Toggle section visibility** — independent per-section on/off.
10. **Publish** — flip `status: Draft → Published`; the Hub card and
    mini-site route both go live from the same flip, no separate
    "publish to Hub" step.

No step involves writing a route, a component, or touching layout —
this is the workflow-level proof of the "one shared template" rule in
§1.

---

## 7. Article Management

Articles attach to exactly one Ecosystem via `ecosystemId` (§5).
Category taxonomy is a fixed enum, matching the ordered stages a
reader typically needs:

- **Introduction** — "what is this ecosystem," entry-level.
- **Guides** — "how to do X within this ecosystem."
- **Updates** — dated developments, most likely to go stale, so these
  should carry a visible published date on the card.
- **Tutorials** — step-by-step, product-specific.
- **News** — external happenings relevant to the ecosystem.

**Filtering**: within a mini-site's Articles section, a simple
category filter/tab set (Introduction/Guides/Updates/Tutorials/News),
same visual pattern as the Hub's own filter chips.

**SEO**: each article needs a slug unique within its ecosystem
(`/portal/duan-cohoi/[ecosystemSlug]/articles/[articleSlug]`), a meta
title, and a meta description — same minimum metadata fields
`digital-assets/articles/[slug]` presumably already needs for its own
article pages.

**Shared pool vs ecosystem-scoped**: this document specifies
ecosystem-scoped as the default (an Article belongs to one Ecosystem)
because it keeps the CMS mental model simple and matches "each
ecosystem is its own mini website." A future shared-article-pool
model (one article referenced by multiple ecosystems) is a legitimate
later extension but is explicitly **not** authorized by this document
— it would need its own relationship design (many-to-many) and a
decision about which ecosystem "owns" SEO canonicalization, which is
out of scope here.

---

## 8. Affiliate Management

An ecosystem's CTA set (§3.7, §10) is where affiliate/referral links
live — modeled as ordered CTA records with `role`, `iconKind`, `url`,
`visible` (§4). Admin workflow for affiliate specifically:

- **Add**: append a new CTA row, pick `iconKind` (e.g. "Affiliate"),
  paste the tracked URL, set `role: secondary` (or `primary` if this
  ecosystem's main action *is* the affiliate signup — see §10's rule
  that exactly one CTA is primary regardless of which kind it is).
- **Edit**: change label/url/order in place.
- **Disable**: toggle `visible: false` rather than delete, consistent
  with the Portal's archive-over-delete convention already used for
  Tool/Prompt/Resource status fields.
- **Reorder**: move-up/move-down, same control already used for
  Portal Builder sections.

**Tracking considerations**: only real, measurable data (e.g. an
actual click-through count from real link traffic, if and when a
tracking mechanism is wired up) may ever be displayed next to a CTA —
never an estimated or illustrative number. Until real tracking exists,
no click-count field is shown at all; this is the same "no field to
put a fake number in" discipline as §5's Case Study rule.

**Why this doesn't become "just an affiliate page"**: the CTA section
is one of seven, positioned after Overview/Video/Products/Articles/
FAQ/Resources establish the ecosystem's actual substance (§3). The
architecture gives affiliate links exactly the visual weight of "one
section among many, with one clearly primary action," not the page's
entire reason to exist — enforced structurally by the fixed section
order and the one-primary-CTA rule (§10), not by editorial promise
alone.

---

## 9. Video Management

`video` config (§4) supports:

- **YouTube** — store the video ID or full URL; template resolves to
  an embeddable player.
- **Vimeo** — same, provider-specific ID/URL.
- **Generic embed** — a raw embeddable URL for any other host.

**Fallback behavior**: if `video.url` is empty or `video.visible` is
false, the entire Intro Video section is omitted from render — no
broken iframe, no gray placeholder box, no "video coming soon" filler
copy. This matches the "honest empty state" pattern used elsewhere in
Portal (e.g. Case Study's zero-row state) — omission is more honest
than a fake-looking placeholder that implies a video should be there.

---

## 10. CTA Management

Each CTA record (§4) carries: `label`, `url`, `role` (`primary` /
`secondary`), `iconKind` (enum: Official Website / Register /
Affiliate / Telegram / Facebook / YouTube / Whitepaper / Download
App), `order`, `visible`.

**The one-PRIMARY rule**: exactly one CTA in an ecosystem's set may
have `role: primary` at any time — this is validated at the CMS level
(the admin form should refuse to save a second `primary`, or
auto-demote the previous one when a new one is marked). This is the
same standing Portal rule already governing single-primary-CTA
elsewhere in the product; it is not relaxed just because an ecosystem
may have many affiliate/social links. All other CTAs render as
secondary — visually smaller/lower-contrast, listed after the primary
— so a visitor's attention is never split evenly across, say, eight
equal-weight buttons. A mini-site with only one CTA total simply has
that one CTA as primary; there is no requirement to always show
secondaries.

**Visibility condition**: `visible` per CTA lets an admin disable,
say, a Telegram button without deleting its record (§8's
archive-over-delete). No conditional logic beyond this boolean is in
scope for this document (e.g. no "show only to logged-in users" rule
is specified here).

---

## 11. Companion Integration

Companion appears once inside an ecosystem mini-site (§ "Companion
rhythm" convention in `PORTAL_DNA.md` — one Companion sentence per
page, never stacked, never repeated verbatim anywhere else in
Portal). Placement: near the Overview/Hero, so it's the first thing
after the visitor learns what the ecosystem is, before Products/
Articles pull attention elsewhere.

**What Companion answers**, using only the ecosystem's own CMS fields
— never inventing an answer the fields don't support:

- **"What is this ecosystem?"** — drawn from `shortDescription`/
  `fullIntro`, paraphrased, not restated verbatim (Companion cites,
  never re-authors — same rule CKOS applies to every knowledge type).
- **"Am I suitable?"** — drawn directly from `whoFor` / `whoNotReady`.
- **"What should I learn first?"** — drawn from `learnFirst`, which
  itself already points cross-pillar (§5) to CKOS (a specific Tool/
  Prompt/Lesson), Academy (a specific Journey), Workspace (a specific
  practice), or Journey (a reflection prompt) — Companion surfaces
  that link, it does not invent a new one.
- **"Should I join now?"** — drawn from `expectedOutcome` plus
  `whoNotReady`, framed as a decision aid ("here's what joining
  realistically gets you, and here's who shouldn't yet") — never a
  push toward the primary CTA. Companion may mention that a CTA exists
  ("bạn có thể xem trang chính thức ở dưới") but must not say anything
  resembling "hãy tham gia ngay," "đừng bỏ lỡ," or any urgency/scarcity
  framing — that phrasing is reserved for marketing copy this pillar
  explicitly does not carry (`PORTAL_DNA.md`'s "objective tone" note
  for this pillar).

**Cross-pillar linking is mandatory, not optional**: because
`learnFirst` is a required Overview field (§3.1, §4), every ecosystem
mini-site has at least one live pointer into CKOS/Academy/Workspace/
Journey by construction — an ecosystem cannot be published without
Companion having something concrete to point at.

**Never repeats a sentence used elsewhere**: Companion copy here is
templated from the ecosystem's own fields at render time (interpolated,
not a fixed string), so two different ecosystems naturally produce
different sentences even with the same template — the risk of a
literal repeat is with the Hub-level Companion (which today already
says something about "chọn đúng điểm bắt đầu"). Any future authoring
of these Companion templates must diff against existing Companion
copy across Portal before shipping wording, per the standing rule —
this document flags the requirement, it does not author the final
copy.

---

## 12. Future Scalability

Adding ecosystem #6 (or #20) requires exactly one action: create a new
`Ecosystem` CMS entry (§4) and publish it. No new route file, no new
component, no new admin page — the dynamic route
`/portal/duan-cohoi/[ecosystemSlug]` and the shared template already
handle any slug whose Ecosystem record exists and is `Published`. The
Hub page's card list is derived from the same collection, so a newly
published ecosystem appears there automatically, in `order` position,
with no separate "add to Hub" step (§6, step 10).

**Handling uneven content richness**: the template must look
intentional whether an ecosystem has 10 Products or zero, 12 Articles
or zero:

- Every optional section (§3's table) either renders fully or is
  **omitted entirely** — never rendered as a half-empty shell with a
  header and no content, except Products, which gets one honest
  empty-state line (§3's table) because a mini-site's Products section
  is the section visitors most reasonably expect to check for.
- Grid/list layouts for Products/Articles/Resources must use a layout
  that looks correct at any count (1 through many) — e.g. a
  responsive card grid that simply wraps, not a fixed N-column layout
  designed around a specific number of items, so a 1-product ecosystem
  doesn't look like a rendering bug and a 10-product ecosystem doesn't
  overflow the design.
- CTA rendering already scales from one button (primary only) to many
  (primary + several secondaries) by the model in §10, without a
  layout special-case.

**What this document does not authorize**: it does not authorize
building the admin CRUD module, deploying any Supabase table, writing
the dynamic route, or migrating the current `ECOSYSTEMS` const —
those are separate, future implementation decisions to be built
strictly against this contract, the same boundary
`CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md` draws at its own close.
