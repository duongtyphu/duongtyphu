# Project CMS Architecture — Portal 4.0 (Admin First, No Code)

**Status: Design-first contract, extends `PROJECT_ECOSYSTEM_ARCHITECTURE.md`.
No implementation in this document — no code, no SQL DDL, no `.tsx`/`.ts`
file is touched by this document itself.**

This document assumes `PROJECT_ECOSYSTEM_ARCHITECTURE.md` (hereafter "the
predecessor doc") is read and frozen: Ecosystem is the root content object,
one shared template renders it (§1), the seven mini-site sections and their
required/optional rules are fixed (§3), the CMS field shape for Ecosystem/
Product/Resource/CTA is fixed (§4), and the ownership/Companion/CTA/video
rules (§5, §8–§11) already stand. **This document does not restate any of
that — it goes one level deeper: the admin's screen-by-screen experience,
the full nesting depth of the content hierarchy, and whether the pattern
holds at real production scale.** Section references like "§4" without a
document name mean the predecessor doc.

Tone/rigor precedent: `CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md` — same
"owner / lifecycle / consumers / reference-don't-duplicate" discipline is
applied here per entity in §3.

---

## 1. Content Hierarchy

### What "Platform" means

"Platform" is **not** a new tenant concept and does not get its own CMS
record. It is the plain-English name for "VO DUONG AI Portal as a whole" —
the same root the predecessor doc already assumes when it says an Ecosystem
is "a first-class content object" inside `/portal/duan-cohoi`. Concretely,
"Platform-level settings" in this document means the handful of fields that
are genuinely global to the whole Projects & Opportunities Hub and not
owned by any single Ecosystem — the Hub's own page copy, the Hub-wide FAQ
default set the predecessor doc mentions in §3.5, and the Hub's default
listing order/filter chips. These already live (or should live) in one
existing singleton-style collection, the same pattern `portal-welcome`
already uses for the Portal Dashboard (`src/data/admin/portalBuilder.ts`,
loaded via `useCollection("portal-welcome", …)` — a one-row collection, not
a hierarchy level with children). Platform is real, but it is a single
settings record, not a fourth tier that nests anything.

### The real nesting

```
Platform (Hub-wide settings, singleton — not a parent record)
   │
   └── Ecosystem                (top-level record, one per mini-site)
          │
          ├── Product              (nested list, §4 of predecessor doc)
          │     └── (no further nesting — a Product is a card/row, not
          │          a parent; if a Product ever needs its own depth,
          │          that is explicitly future work, per predecessor §3.3)
          │
          ├── Article / Guide / Update / Tutorial / News
          │     (all one entity type, "Article", differentiated by the
          │      `category` enum from predecessor §7 — not five separate
          │      hierarchy levels)
          │
          ├── Video                (a field on Ecosystem/Product/Article,
          │                         not an independent parent-child level)
          │
          ├── Resource             (nested list, §4)
          │
          ├── FAQ                  (nested list, §4)
          │
          └── CTA                  (nested list, §10; may also be a
                                     reusable template, §7 of this doc)
```

**Only two levels are truly parent-child (hierarchical, own lifecycle,
cascade on parent hide/delete):** Platform → Ecosystem, and Ecosystem →
Product. Everything else nests **structurally** (it is stored as a
sub-list of an Ecosystem/Product/Article record, per predecessor §4/§5)
but is **conceptually cross-cutting**, not a fourth or fifth hierarchy
tier:

- **Article/Guide/News/Video-as-content/Resource/FAQ** attach to exactly
  one Ecosystem (predecessor §5) — this is ownership, not deep nesting.
  "Guide," "News," "Tutorial," and "Update" are not distinct hierarchy
  levels or distinct CMS collections; they are one value of Article's
  `category` field (predecessor §7). Treating them as five levels would
  multiply admin screens for no relationship benefit — this document
  explicitly rejects that shape.
- **Video** is not a hierarchy level at all — it is a field (`video` on
  Ecosystem per predecessor §4, and per §6 of this document, an optional
  field on Product and Article too). A "Video entity" only exists as a
  concept if an Article/Product needs more than one video; §6 covers that.
- **CTA** is a nested list owned by Ecosystem (predecessor §4/§10), but
  §7 of this document allows CTA *templates* to exist independently of
  any Ecosystem, reusable across many — this is the one place a
  genuinely cross-cutting, non-owned entity exists in the hierarchy.
- **Tags/category** (Article's `category`, Product's `badge`) are flat
  enums applied at whatever level carries them — they are attributes,
  never a browsable hierarchy tier with their own admin screen.

So: **Platform → Ecosystem → Product is the only real drill-down a
human would call "hierarchy."** Article/Video/Resource/FAQ/CTA are
owned children of Ecosystem (occasionally Product or Article, §4), but
they are siblings of each other, not stacked levels — an admin never
"drills into Article to find Video," they pick Video as a field while
editing an Article.

---

## 2. CMS Hierarchy

Mapping §1 onto real admin screens, extending the existing
`useCollection`/`CrudPage`/Supabase `id,data` pattern
(`src/lib/admin/store.ts`, `src/lib/admin/supabaseCollections.ts`,
`src/components/admin/CrudPage.tsx`) rather than inventing a new one:

| Content concept | Admin shape | Why |
|---|---|---|
| Platform settings | **One singleton record** in a `portal-hub-settings`-style collection (same shape as today's `portal-welcome`: `useCollection<T>("portal-hub-settings", [seed])`, always exactly one row) | It's Hub-wide, low-cardinality, changes rarely — a form, not a list |
| Ecosystem | **One `CrudPage` collection**, e.g. `ecosystems` → table `ecosystems`, following the exact registration convention in `supabaseCollections.ts` (`ecosystems: "ecosystems"` added to the map, `tableForCollection` resolves it, the generic `/api/admin/collections/[table]` route reads/writes it) | One record per level (§1), matches every existing top-level entity (Tool, Prompt, `digital-asset-projects`) |
| Product | **Nested ordered sub-list inside the Ecosystem record**, edited via move-up/down + visible toggle exactly like `portal-sections`/`portalSectionsSeed` in `portal-builder/page.tsx` — not its own collection/table | Product has no independent lifecycle outside its parent Ecosystem (predecessor §5); giving it its own `CrudPage` would let a Product exist "orphaned," which the one-ecosystem-owns-its-products rule forbids |
| Article | **Its own top-level `CrudPage` collection** (`ecosystem-articles` → table, same convention as `digital-asset-articles` today), carrying `ecosystemId` as a foreign-key-shaped field, **not** nested inside the Ecosystem record | Article volume alone rules out nesting: an Ecosystem record with 200 embedded articles would make every Ecosystem save/load rewrite all 200 articles' JSONB blob (§9) — Article needs its own row, its own list/search/pagination UI, independent of how big the parent Ecosystem record is |
| FAQ | Nested ordered sub-list inside Ecosystem (predecessor §4) | Low cardinality (typically single-digit Q&A pairs), no independent lifecycle, matches predecessor's own schema |
| Resource | Nested ordered sub-list inside Ecosystem (predecessor §4) | Same — low cardinality, owned, no independent lifecycle |
| CTA (per-ecosystem instance) | Nested ordered sub-list inside Ecosystem (predecessor §4/§10) | Same — but see the template registry below |
| CTA template | **Separate small `CrudPage` collection** (`cta-templates`), reusable rows an admin can "apply" into any Ecosystem's nested CTA list (§7) | Cross-cutting by design (§1) — belongs to no single Ecosystem, so it cannot live nested inside one |
| Video | A field (`provider`/`url`/`visible`) on Ecosystem, Product, or Article — never its own collection | Section 1: not a hierarchy level, no independent lifecycle to manage in a list UI |
| Affiliate Link | Already its own collection today (`digital-asset-links` → `digital_asset_links`); this document extends the same shape for Ecosystem/Product-scoped links rather than inventing a parallel table (§8) | Precedent already exists and already carries `clickCount`, `status`, `priority`-shaped fields |

**The dividing line, stated once:** something becomes its own top-level
`CrudPage` collection when (a) its natural count per parent is large/
unbounded (Article, Affiliate Link), or (b) it needs its own detail
route/permalink (Article, per predecessor §7). Something stays a nested
sub-list inside its parent's record when its count per parent is small
and bounded (Product, FAQ, Resource, CTA-instance) and it has no
independent lifecycle. This is the same line the codebase already draws
today: `digital-asset-projects` and `digital-asset-articles` are each
their own collection (unbounded, need detail routes), while
`portal-sections` and `today-action-cards` are nested-list-shaped
singletons (bounded, no independent lifecycle) — this document just
names the rule explicitly so future collections don't have to be argued
from scratch each time.

---

## 3. Data Ownership

| Entity | Owning admin screen | Entered once / changes often | Reference, don't duplicate boundary |
|---|---|---|---|
| Platform (Hub) settings | Hub Settings form (singleton) | Entered once, rarely revisited | N/A — nothing to reference, it's the root |
| Ecosystem | Ecosystem `CrudPage` (list + detail form) | `name`/`slug`/`logo` entered once and essentially frozen (predecessor's own framing: "an Ecosystem's name rarely changes"); `statusBadge`/`fullIntro`/`highlights` revisited occasionally | `learnFirst` and Companion's cross-pillar pointers (predecessor §5/§11) are reference-only — Ecosystem stores a label+href into CKOS/Academy/Workspace/Journey, never re-authors that target's content |
| Product | Nested inside Ecosystem's edit form | Entered once per product, edited rarely (name/logo/link are stable facts) | Optional future `caseStudyRef` (predecessor §5) is reference-only into `case_studies`, never a copied case-study summary |
| Article | Article `CrudPage` (its own list) | Changes often — this is the highest-churn entity in the whole hierarchy, hence its own collection (§2) | `relatedProducts`/`relatedEcosystem`/`relatedVideos`/`relatedResources`/`relatedCTA` (§4 of this doc) are ID-shaped references into existing rows, never copied text. `companionSuggestion` is a **single reference pointer** (one CKOS Tool/Prompt/Lesson id, or one Academy Journey id, or one Workspace practice id, or one Journey reflection id) — it is never a text field an author types Companion-voiced copy into, because Companion's actual wording is templated at render time (predecessor §11); a free-text field here would let an author accidentally fabricate or duplicate Companion's voice, which is exactly what predecessor §11's "never repeats a sentence" rule forbids |
| CTA (instance) | Nested inside Ecosystem's edit form (§10 UI, §7 of this doc) | Set once per ecosystem, occasionally reordered/disabled | If sourced from a CTA template (§7), the instance stores `templateId` + its own `order`/`visible`/`role` override — it does not duplicate the template's `label`/`icon`/base copy unless the admin explicitly detaches it |
| CTA template | CTA Template `CrudPage` (small, flat list) | Entered once per template ("Official Website," "Register," "Telegram"), reused indefinitely | Owns its own copy — it is the canonical source other CTA instances point at, nothing else to reference |
| Video | Field on Ecosystem/Product/Article | Set once when a video exists, rarely changed | N/A — a URL + provider enum is the content itself, nothing to reference |
| Resource | Nested inside Ecosystem's edit form | Entered once per resource, occasionally re-linked if a URL moves | N/A — title/type/url is the content itself |
| FAQ | Nested inside Ecosystem's edit form | Entered once per Q&A pair, edited occasionally | N/A — but must not restate Article content verbatim; if an FAQ answer and an Article say the same thing, the FAQ should link to the Article rather than duplicate its body |
| Affiliate Link | Affiliate Link `CrudPage` (already exists: `digital-asset-links`; extended per §8) | `url`/`country`/`campaign` entered once per link, `status`/`priority` change often as campaigns rotate | `clickCount` (already the real precedent in `DigitalAssetLink`) must only ever reflect real tracked clicks — never a fabricated or estimated number, no exceptions (standing rule, restated because Affiliate Link is the entity most tempted to grow a fake stat) |

---

## 4. Relationship Model

**One-to-many (real, foreign-key-shaped):**

- Ecosystem 1—* Product (`product.ecosystemId`) — a Product belongs to
  exactly one Ecosystem, no exceptions (predecessor §5 already states
  this; restated here because it anchors everything else).
- Ecosystem 1—* FAQ, Ecosystem 1—* Resource, Ecosystem 1—* CTA-instance
  — all owned-child, no independent identity outside the parent (§2).
- Product 1—* Affiliate Link (`link.productId`) — a link belongs to
  exactly one Product (extends the existing `DigitalAssetLink.projectId`
  shape, §8).

**Many-to-many (only where genuinely needed):**

- **Article *—* Product, within one Ecosystem.** An Article's primary
  ownership is still exactly one Ecosystem (predecessor §5's fixed
  rule stays — this document does not relax it), but within that one
  Ecosystem an Article legitimately covers more than one Product (e.g.
  a "So sánh WebWisePay và AlphaMind" guide inside DigiU touches two
  Products). This is modeled as `article.relatedProductIds: string[]`,
  a real many-to-many join, scoped by the invariant that every id in
  that array must belong to the same `article.ecosystemId` — an Article
  can never reference a Product from a different Ecosystem, which
  keeps "one ecosystem = one scoped world" (predecessor §5) intact even
  with a many-to-many edge inside it.
- **CTA template *—* Ecosystem.** One CTA template ("Official Website")
  is legitimately applied across many Ecosystems' CTA lists (§3, §7).
  This is the one place a truly reusable, ecosystem-independent object
  exists — modeled as each Ecosystem's CTA-instance carrying an optional
  `templateId` back-reference, so the same template can be instantiated
  N times without N copies of its copy/icon existing.

**Everything else on Article stays a specific, named relationship type,
not a generic catch-all "related items" bucket** — this matters because
a generic `related: {type, id}[]` field is exactly the shape that invites
duplicating content instead of referencing it cleanly:

| Article field | Relationship type | Cardinality |
|---|---|---|
| `ecosystemId` | belongs-to | 1 |
| `relatedProductIds` | many-to-many, scoped to same ecosystem | 0..N |
| `relatedVideoRef` | reference to a Video field (on Ecosystem/Product/self) | 0..1 |
| `relatedResourceIds` | many-to-many into the Ecosystem's Resource sub-list | 0..N |
| `relatedCTAId` | reference into the Ecosystem's CTA-instance list (§7) | 0..1 |
| `companionSuggestionRef` | single reference pointer into CKOS/Academy/Workspace/Journey (§3) | 0..1 |

No field is typed as a loose "related content" array of mixed kinds —
each relationship says exactly what it points at, matching the
"reference, don't duplicate" discipline CKOS's Consumption Matrix
already enforces (`CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md` §"How to read
the per-type sections," item 5, Relationships).

---

## 5. Article Workflow

End-to-end admin flow, authoring one Article, using the same
`CrudPage` modal shape every collection already uses
(`src/components/admin/CrudPage.tsx`):

1. **Create draft** — `status: Draft`, pick `ecosystemId` (required —
   an Article cannot exist without a parent Ecosystem, predecessor §5).
2. **Fill required fields** — `title`, `category` (Introduction/Guides/
   Updates/Tutorials/News, predecessor §7), `featuredImage`, `author`,
   `tags`.
3. **Fill SEO fields** — `slug` (unique within the ecosystem, per
   predecessor §7), `metaTitle`, `metaDescription`, `canonicalUrl`
   (optional — only needed if the same content is intentionally
   published at more than one URL, e.g. during the Digital Assets/
   Ecosystem coexistence period described below).
4. **Write body** — richtext content, same field shape `digitalAssets.ts`'s
   `DigitalAssetArticle` already uses.
5. **Set relationships** — `relatedProductIds`, `relatedVideoRef`,
   `relatedResourceIds`, `relatedCTAId`, `companionSuggestionRef` (§4) —
   all pick-from-existing-rows selectors, never free-text.
6. **Review** — `status` stays `Draft`; the admin (or a second reviewer)
   reads the rendered preview via the same `viewHref` pattern `CrudPage`
   already supports for other collections.
7. **Publish** — `status: Published`; the Article now appears in its
   Ecosystem's Articles section (predecessor §3.4) and, if a permalink
   route exists (predecessor §2), at its own URL.
8. **Later edit/archive** — edits go through the same form; retiring an
   Article means `status: Hidden`, never delete (archive-over-delete,
   the standing Portal rule, already applied to `DigitalAssetProject.status`
   and every CKOS type).

### Reconciling with existing article-shaped systems

The codebase today has **three** article-shaped things: `DigitalAssetArticle`
(`digital_asset_articles` table, admin at
`src/app/admin/(dashboard)/digital-assets/articles/page.tsx`), Blog AI's
`BlogPost` (`src/data/blog.ts`, mixes hand-authored posts with
`fromDigitalAssetArticle()`-merged rows read live from Supabase, per
`src/app/blogai/page.tsx`), and now this document's new Ecosystem-scoped
Article.

**Recommendation: coexist via the same merge-at-render technique, do not
unify into one table yet.** Concretely:

- This document's Article is a **new, distinct collection**
  (`ecosystem-articles`), scoped by `ecosystemId`, purpose-built for the
  Ecosystem mini-site's Articles section (predecessor §3.4).
- It does **not** replace `DigitalAssetArticle` — Digital Assets remains
  its own personal-holdings pillar per predecessor §1 ("neither owns the
  other's data"), so its articles keep their own table and admin screen.
- Where the same real-world write genuinely belongs in both an Ecosystem
  mini-site and Blog AI's aggregate feed, it is **merged at render time**,
  exactly like `fromDigitalAssetArticle(article: DigitalAssetArticleLike): BlogPost`
  already does for Digital Assets → Blog AI today (`src/data/blog.ts`
  line ~997) — a small adapter function maps the Ecosystem Article's
  canonical fields into `BlogPost`'s shape with `href` overridden to the
  Article's own permalink, so Blog AI's aggregate list can surface it
  without a second copy of the body text ever being stored.
- **Why not unify into one Article table right now**: the three systems
  have different required-field sets (Digital Assets articles don't need
  `ecosystemId`; Blog AI posts don't need `relatedProductIds`) and
  different ownership screens with different admins in mind. Forcing a
  single schema today would mean either loosening required fields until
  the type stops meaning anything, or a migration of existing
  `DigitalAssetArticle`/`BlogPost` rows this document has no authority to
  order. The adapter-function pattern already proven by
  `fromDigitalAssetArticle` is the correct amount of unification for now:
  one shared *read* shape (`BlogPost`), three independent *write* owners.

---

## 6. Video Workflow

A video attaches to Ecosystem (predecessor §3.2/§4/§9), and, per this
document, optionally to a Product row or an Article too (same field
shape, not a new concept):

```
video: {
  provider: "youtube" | "vimeo" | "embed" | "self-hosted",  // enum, see below
  url: string,
  visible: boolean,
}
```

**Admin flow**: pick provider from a select, paste the video's ID or URL,
toggle `visible`. Same three-field form on Ecosystem, Product, or Article
— no separate "Video" admin screen exists because a video never has an
independent lifecycle apart from whatever it's attached to (§1).

**Featured-video designation, when multiple videos exist across one
Ecosystem's Products/Articles**: each attaching entity's `video` field is
independent — there is no ranking mechanism across them, and this
document does not introduce one. The *Ecosystem's own* `video` field
(predecessor §3.2) is implicitly "the featured one" because it is the
only video the mini-site template renders in the fixed Intro Video slot
(predecessor §3's section order) — Product/Article-level videos render
inline within their own card/body, not competing for that slot. If a
future need arises to feature one Product's video ecosystem-wide, that
is a new field on Ecosystem (e.g. `featuredVideoRef` pointing at a
Product), not authorized by this document.

**Fallback/omission behavior**: identical to predecessor §9 — empty
`url` or `visible: false` omits the section/embed entirely, no broken
iframe, no placeholder box, no "coming soon" copy, regardless of which
level (Ecosystem/Product/Article) the video is attached to.

**"Future self-hosted," architecturally**: `provider: "self-hosted"` is
added to the enum **now**, as a reserved, currently-unimplemented value —
the admin form may even omit it from the visible select options until a
self-hosted playback mechanism exists. This is deliberately not a
placeholder upload feature: no file-upload UI, no storage bucket wiring,
no player component is authorized by this document. Reserving the enum
value now means a future self-hosted rollout is an additive change (new
render branch + new admin option) rather than a schema migration that
has to touch every existing `video` field across every Ecosystem/Product/
Article row.

---

## 7. CTA Workflow

Per predecessor §10, each CTA carries `label`, `url`, `role`
(`primary`/`secondary`), `iconKind`, `order`, `visible`. This document
adds the fuller field set requested — **Title, Description, Icon, Button
Style, Destination, Visibility, Priority, Enable/Disable, Order** — by
mapping directly onto that existing shape plus three additions:

| Requested field | Maps to |
|---|---|
| Title | `label` (predecessor) |
| Description | new: `description` (short optional subtext under the button label) |
| Icon | `iconKind` (predecessor's existing enum) |
| Button Style | new: `buttonStyle` enum (`solid` / `outline` / `text-link`) — purely visual, independent of `role` |
| Destination | `url` (predecessor) |
| Visibility | `visible` (predecessor) |
| Priority | `order` (predecessor already calls this `order`; "Priority" is the same concept under the name requested here) |
| Enable/Disable | `visible` (same field as Visibility — this document does not introduce a second on/off flag, to avoid two booleans that can disagree) |
| Order | `order` (predecessor) |

**Admin flow**: within an Ecosystem's edit form, a CTA sub-section lists
existing CTA rows with move-up/move-down (same control as Portal
Builder's section reordering) and a visible toggle per row. "Add" opens
the same modal-form pattern as `CrudPage`, with all the fields above.
"Disable" is the `visible` toggle, never delete (archive-over-delete).

**Enforcing exactly one PRIMARY at the admin-UI level** (not just a
documented rule): when an admin sets a CTA's `role` to `primary`, the
save handler must auto-demote any other CTA in the same Ecosystem's list
that currently holds `role: primary` to `secondary` in the same write —
mirroring how `CrudPage`'s existing `handleSave` already does a
single-collection read-modify-write (`update(editing.id, payload)`).
Concretely this is a small addition to the Ecosystem edit form's save
logic (not a new mechanism): before persisting the CTA list, if the
incoming list has more than one `role: primary`, keep only the
most-recently-edited one as primary and force the rest to secondary.
This makes "exactly one primary" impossible to violate through the
admin UI, rather than a convention an admin could accidentally break by
typing `primary` twice.

**CTA templates — reusable vs per-ecosystem authored**: a small
additional `cta-templates` collection (§2) holds standard, reusable CTA
definitions — "Official Website," "Register," "Join Telegram" — each
with its own `label`/`description`/`iconKind`/`buttonStyle` but no `url`
(the destination is always ecosystem-specific). An admin adding a CTA to
an Ecosystem may either (a) pick a template, which pre-fills
label/description/icon/style and only asks for `url`+`role`+`order`, or
(b) author a one-off CTA from scratch with no template link. Either way
the result is a normal CTA-instance row in that Ecosystem's `ctas` list
(§4 of predecessor); the template only exists to save re-typing standard
copy, not to create a different kind of record. This is the one
genuinely reusable-across-ecosystems object identified in §4 of this
document.

---

## 8. Affiliate Workflow

Extends, not replaces, the existing `DigitalAssetLink` precedent
(`src/data/digitalAssets.ts`, admin at
`src/app/admin/(dashboard)/digital-assets/links/page.tsx`) which already
has `type`, `url`, `isAffiliate`, `trackingCode`, `clickCount`, `status`,
`order` per Project. This document's Product-scoped affiliate links add
`country`, `language`, and `campaign`:

```
AffiliateLink (per Product):
  id, productId, title, url, type, isAffiliate, trackingCode,
  country: text (optional, e.g. "VN" / "Global"),
  language: text (optional, e.g. "vi" / "en"),
  campaign: text (optional, free label for a specific promo run),
  priority: number,   // same role as predecessor's `order`/priority concept
  status: "Active" | "Inactive",
  clickCount: number  // real counts only — same rule as DigitalAssetLink.clickCount
```

**Admin flow for adding a country- or campaign-specific link**: open the
Product's affiliate links sub-list (same `CrudPage`-modal pattern as
`digital-asset-links` today), add a row, fill `country`/`language`/
`campaign` alongside the existing fields, set `status: Active`, set
`priority`.

**Which link renders to a given visitor — explicitly out of scope for
selection logic beyond simple priority ordering.** This document commits
to only this much: among a Product's `Active` links matching the
visitor's known context (if any context is known at all), the
**highest-priority** one renders; if no country/language/campaign
context is available for a given visitor — which is the common case
today, since there is no geo/campaign-detection infrastructure in the
codebase now — the single highest-priority `Active` link with no
country/language/campaign set (a "default" link) renders. **Any real
geo-IP detection, language-header sniffing, or campaign-parameter
routing is future infrastructure this document does not authorize** —
building that would require a decision about visitor context detection
(cookies, headers, query params) that belongs in its own design
document, not smuggled into a CMS/admin architecture doc. Until that
exists, `country`/`language`/`campaign` are useful **admin-side
organizing/filtering fields** (so an admin managing 50 links across
regions can filter the list) even before any visitor-facing selection
logic reads them.

**Extends, doesn't replace**: this is the same `DigitalAssetLink` type
with three optional fields added and a `productId` (vs. today's
`projectId`) foreign key — an admin who already knows the Digital Assets
Links screen needs no new mental model, and `clickCount`'s real-counts-
only rule (§3, standing rule) carries over unchanged.

---

## 9. Future Scalability

Addressed honestly, per section, at 300 ecosystems / 5,000 products /
100,000 articles / millions of users:

### Admin-side

**Ecosystem (300 rows) and Product (5,000 rows, ~17/ecosystem average)**
are fine as-is: a `CrudPage` list with search + status filter (the
pattern already exists on every collection today) comfortably handles
low-thousands of rows; Product doesn't even need its own list screen
since it's nested (§2).

**Article (100,000 rows) cannot be admin-managed the way today's
`CrudPage` works out of the box.** Today's `CrudPage` (§ code read for
this document, `src/components/admin/CrudPage.tsx`) loads the entire
collection into client state on mount (`useCollection` → `fetch` the
whole table, no pagination in the fetch, no server-side filtering — see
`store.ts`'s `useSupabaseCollection.load()`, which does `GET
/api/admin/collections/${key}` with no query params) and filters/sorts
in-memory in the browser (`CrudPage`'s `useMemo` over `items`). At
100,000 rows this breaks two ways: the initial fetch ships the entire
table to the browser on every admin page load, and every keystroke in
the search box re-filters 100,000 in-memory objects. **This must change
for Article specifically** — before this scale is reached, the Article
admin list needs server-side pagination and server-side search/filter
(the `/api/admin/collections/[table]` route needs a paginated variant
that accepts `?ecosystemId=&category=&status=&search=&page=`, and
`CrudPage` — or a dedicated Article admin page that doesn't reuse
generic `CrudPage` — needs to call it incrementally rather than loading
everything). This document does not design that paginated API here (it
is implementation), but it explicitly flags it as required, not
optional, before Article approaches five-figure row counts, let alone
100,000.

### Data-side

**Is the JSONB `id, data` pattern still appropriate at this scale? For
Ecosystem/Product/FAQ/Resource/CTA — yes.** These stay low-cardinality
per parent and low total row count (hundreds to low-thousands), so the
existing generic `/api/admin/collections/[table]` route reading/writing
an opaque `data` JSONB blob per row (as every current collection in
`supabaseCollections.ts` already does) remains appropriate — no schema
work needed.

**For Article specifically, the honest recommendation is: graduate to
typed columns with real indexes before 100,000 rows, not "it scales
because Postgres JSONB can index too."** Reasoning: Article is the one
entity that needs (a) full-text search across `title`/`content` at the
admin list level, (b) filtered listing by `ecosystemId` + `category` +
`status` simultaneously, and (c) the SEO `slug` uniqueness constraint
(§5) enforced at the database level, not application-level. A generic
`data jsonb` column with a GIN index can technically support some of
this, but it forfeits the two things a typed table gives for free: a
real `UNIQUE(ecosystem_id, slug)` constraint (application-level
uniqueness checks race under concurrent admin edits at high volume) and
a query planner that can use a plain b-tree index on `ecosystem_id`/
`category`/`status` instead of scanning/filtering JSONB. **Concrete
recommendation**: an `articles` table with typed columns for
`id, ecosystem_id, slug, title, category, status, published_at,
meta_title, meta_description` (the fields every list/filter/SEO
operation needs) plus one `content jsonb` or `content text` column for
the body and relationship arrays — the same "typed columns for what's
queried, JSONB for what's just stored" split the repo already uses
elsewhere (e.g. `case_studies` graduated out of the generic collection
pattern once it needed real typed access, per
`CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md`'s own note that Case Study "now
writes directly to the typed `case_studies` table via dedicated
`actions.ts`" instead of the generic JSONB collection route). This is
not a "maybe someday" — it is the specific point where the generic
pattern's simplicity (no migration needed to add a field) is outweighed
by the cost of unindexed, unconstrained lookups at five-figure-plus row
counts.

### Render-side

**The one-shared-template rule (predecessor §1) holds** — nothing about
scale changes the argument that no ecosystem gets a bespoke route or
component; 300 ecosystems each rendering through
`/portal/duan-cohoi/[ecosystemSlug]` is exactly as true at 300 as at 5.

**But an Ecosystem page with 5,000 products does need pagination, and
the predecessor doc did not need to address this because it assumed a
handful of products per ecosystem.** Predecessor §12 already requires
the Products grid to "look correct at any count (1 through many)" via a
wrapping responsive grid — that solves *visual* correctness but not
*payload* correctness: a single ecosystem is unlikely to reach anywhere
near 5,000 products itself (5,000 total ÷ 300 ecosystems ≈ 17 average),
so in practice no single mini-site page needs to server-render
thousands of Product cards at once. If a future ecosystem genuinely
accumulates hundreds of products, the honest fix is the same pattern
already used for Articles at the Hub level — a "show first N, load
more" or an in-page paginated Products section — rather than assuming
the wrapping grid alone solves an unbounded list. This document flags
that as a real, if currently unlikely, future need rather than a
day-one requirement.

**Millions of users** is a read-traffic/caching question, not a CMS
architecture question — nothing in this document's admin/CMS design
changes based on visitor volume; that concern belongs to
rendering/caching strategy (ISR/CDN), out of this document's scope.

---

## 10. Admin Experience

**What's better than today's Digital Assets admin**: today, "add an
ecosystem's worth of content" means separately visiting the Digital
Assets Projects screen, the Articles screen, the Links screen, and
manually keeping a mental map of which project/article/link belongs to
which of the five hardcoded categories — there is no single screen that
represents "DigiU as a whole." Under this design, one Ecosystem record
(§2) is that single screen: an admin opens one `CrudPage` entry and
finds Overview, Video, Products, Articles (linked, not embedded — §2),
FAQ, Resources, and CTAs all editable from that one place, in the fixed
order the mini-site actually renders them in (predecessor §3) — so the
admin's editing screen visually mirrors the page it produces, which
nothing in today's Digital Assets admin does.

**A first-time admin's "add ecosystem" workflow, end to end**: create
the Ecosystem shell (name, slug, logo, status Draft) → fill Overview
fields, including the required `whoFor`/`whoNotReady`/`learnFirst`/
`expectedOutcome` readiness fields that Companion depends on (predecessor
§6, §11) → optionally add a video → add Product rows inline (no separate
screen) → either write a first Article directly in the new
`ecosystem-articles` collection (picking this Ecosystem as its
`ecosystemId`) or leave Articles empty for now (honest-empty per
predecessor §3.4/§12) → add FAQ pairs → optionally attach Resources →
add at least one CTA — either pick a reusable template (§7) and just
paste a URL, or author one from scratch — and confirm exactly one is
marked primary (enforced automatically, §7) → toggle section visibility
as desired → flip `status: Published`. At no point does the admin open
a code editor, ask for a deploy, or wait on an engineer — this is the
whole point of predecessor §1's "adding an ecosystem is authoring a CMS
entry, never authoring a page," now shown as a concrete click-by-click
path rather than asserted abstractly.

**What this document does not authorize building yet**:

- It does not authorize building the actual `ecosystems`/
  `ecosystem-articles`/`cta-templates` Supabase tables, the
  `/api/admin/collections/[table]` registrations for them, or any admin
  page/component — those are implementation, to be built strictly
  against this contract and the predecessor's, not invented ad hoc.
- It does not authorize the paginated/server-side-search Article admin
  API flagged in §9 — only flags it as required before Article reaches
  five-figure row counts.
- It does not authorize graduating Article to a typed table (§9) —
  only recommends it as the right target architecture for that specific
  entity.
- It does not authorize any geo-IP/campaign-based affiliate link
  selection logic (§8) — only simple priority-among-Active-links
  ordering.
- It does not authorize a self-hosted video upload/playback feature
  (§6) — only reserves the enum value.
- It does not authorize a shared-article-pool (many ecosystems
  referencing one Article) — predecessor §7 already declined this, and
  this document's Article-still-belongs-to-exactly-one-Ecosystem model
  (§4) does not relax it.
- It does not authorize unifying `DigitalAssetArticle`/`BlogPost`/this
  document's Article into one physical table — §5's recommendation is
  explicitly coexistence via adapter functions, not a merge migration.

This is the same boundary `CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md` and
the predecessor doc each draw at their own close: a frozen contract to
build against, not a build order.
