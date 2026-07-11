# PORTAL 4.0 — COMPONENT LIBRARY (FREEZE)

**STATUS: SPRINT 0.5 DELIVERABLE — COMPONENT LIBRARY FREEZE ONLY. NO CODE WAS WRITTEN OR CHANGED TO PRODUCE THIS DOCUMENT.**
**Companion piece to `docs/PORTAL_DESIGN_SYSTEM.md` (tokens/patterns) — this document is the component-level inventory. Where the two overlap (Cards, Buttons, Backgrounds), this document is the more granular source; `PORTAL_DESIGN_SYSTEM.md` remains the source for tokens/CSS values.**

Every component listed here was found by reading the actual file (not inferred from a name). Where no shared component exists for something the brief asks about, this document says so plainly rather than describing an inline pattern as if it were a component — the whole point of this freeze is to stop the team from believing something exists when it doesn't.

---

## SECTION 1 — Component Philosophy

- **Components are reusable.** A component earns a place in this library by being used in more than one place, or by being the deliberately-designated canonical way to solve a recurring problem (even a first usage) — not by being extracted for its own sake.
- **Components solve one purpose.** `Button` renders a button. `GemCard` renders a card shell. Neither should grow a second, unrelated responsibility because a page needed "just one more prop."
- **Components should not be duplicated.** This audit found real duplication (§11) — two different `<input>` styling recipes, two near-identical avatar implementations, three separate re-export aliases. None of it is fixed here (no code changes), but all of it is named, so it stops multiplying.
- **Prefer extending existing components over creating new ones.** If `GemCard`'s variants don't fit, extend `GemCard`. If `Button`'s five variants don't fit, add a sixth. Building a new one-off is the last resort, not the first instinct — and per §12, requires Product Owner approval when the existing library genuinely can't solve the problem.

---

## SECTION 2 — Page Components

| Component | File | Purpose | Variants | Spacing | Responsive | CMS readiness |
|---|---|---|---|---|---|---|
| **PillarHero** | `ui/PillarHero.tsx` | Shared hero band for CKOS/Academy/Projects & Opportunities pillar pages | `tone`: `brand/knowledge/learning/opportunity/value` (5 gradients, §3 of Design System) | `p-7 sm:p-10` | `text-2xl sm:text-4xl` title scale | Static (copy hardcoded per page — **[GAP]**, already flagged in `PORTAL_DESIGN_SYSTEM.md` §12) |
| **CompanionPresenceBand** | `components/portal/gem-home/CompanionPresenceBand.tsx` | Home's own hero — greeting + Living Core + next-best-action | Home-only, not shared | Same shell recipe as `PillarHero` (`p-7 sm:p-10`) but a distinct component | Same as `PillarHero` | Static |
| **Campus Hero** | Inline in `congdongai/page.tsx` (`.campus-hero` class) | Community's own hero | Community-only | Own recipe (`p-8 sm:p-12`) | — | Static |
| **Premium hero** | Inline in `premium/page.tsx` | Premium's own hero — no card, text floats on the dark canvas | Premium-only | — | — | Static |
| **[GAP — not unified]** | — | Four platforms (CKOS/Academy/Projects share `PillarHero`; Home, Community, Premium each hand-roll their own) — this is documented as intentional per `PORTAL_DESIGN_SYSTEM.md` §6 ("each door feels different"), but means "Hero" is not one component, it's one shared component plus three bespoke ones. Not fixed here. | | | | |
| **PageHeader** | `ui/PageHeader.tsx` | Page-level H1, two modes: simple (title/description/action) and icon-hero (icon + tone + subtitle) | `tone`: `blue/violet/orange/green`; `titleGradient` (Companion-brand gradient via `GradientTitle`) | `p-6 md:p-8` (icon mode) | `sm:flex-row` | Static |
| **GradientTitle** | `ui/GradientTitle.tsx` | Renders text with the Companion brand gradient, "AI" substring always solid orange `#F97316` | Single purpose, no variants | — | — | Static (text passed as prop, not itself editable) |
| **SectionHeader** | `ui/SectionHeader.tsx` | Section-level H2 (`eyebrow` + `title` + optional `description`/`action`) | — | — | — | Static |
| **Breadcrumb** | `components/site/Breadcrumb.tsx` | **Marketing-site only** — dark-theme breadcrumb (`text-white/50`), used on public pages, not inside `/portal/**` | — | — | `flex-wrap` | Static |
| **Portal breadcrumbs** | **[GAP — no shared component]** | Where Portal pages show a breadcrumb (e.g. `duan-cohoi/[ecosystemSlug]/page.tsx`, `hetrithucai/[slug]/page.tsx`), each page hand-rolls its own inline `<nav>` — confirmed decentralized in `PORTAL_DESIGN_SYSTEM.md` §2.4. Not every Portal page has one at all. | | | | |
| **PortalBackLink** | `ui/PortalBackLink.tsx` | **Canonical** back button — the one standardized nav-back element for the whole Portal (Portal Standardization Task 1) | `tone`: `light/dark`; `colorClassName` escape hatch for Journey doors with bespoke atmosphere color variables | `mb-6`, `gap-1.5` | — | Static (label/href are props, not itself editable) |
| **PortalSidebar** | `components/portal/PortalSidebar.tsx` | **Canonical** — the one sidebar, desktop and mobile share this via a `variant` prop | `variant`: `desktop/mobile`; `collapsed` | `w-64` / `w-[68px]` collapsed | Hidden below `md`, replaced by the mobile drawer | Nav structure comes from `lib/portal/hubs.ts` (code, not CMS) |
| **PortalHeader** | `components/portal/PortalHeader.tsx` | **Canonical** — sticky topbar (search, notifications, saved, user menu) | — | `h-16`, `px-4 md:px-6` | — | Static |
| **PortalShell** | `components/portal/PortalShell.tsx` | **Canonical** — the app shell composing header + sidebar + mobile drawer + `<main>` + `CompanionPresence` | — | `<main>` `px-4 py-6 md:px-8 md:py-8` | Drawer swap at `md` | — |
| **Footer** | `components/site/Footer.tsx` | **Marketing-site only.** Confirmed: `Portal` has no footer at all — `AccountMenu.tsx` explicitly returns `null` on any `/portal/*` path, and `Footer.tsx` links *into* Portal routes from the public site rather than appearing inside it. | — | — | — | Static |
| **CTA Footer** | `ui/KnowledgeJourneyStrip.tsx` (closest to canonical) + several hand-rolled page-specific CTA sections (AI Workspace's gradient footer box, Premium's FAQ+CTA) | Closing "what's next" section at the bottom of pillar pages | — | `space-y-4`, card grid `gap-4` | — | Static |
| **[GAP — not unified]** | — | `KnowledgeJourneyStrip` is reused across CKOS/Academy/Projects/Home, but AI Workspace and Premium each hand-roll their own closing CTA instead of using it — not fixed here, flagged as a consolidation candidate. | | | | |

---

## SECTION 3 — Card Library

Base shell for most of these: `.gemos-gem-card`/`GemCard.tsx` (`border-radius: 28px`, white background, `1px` `#E2E8F0` border, `shadow-token-sm` → `shadow-token-lg` + `translateY(-5px)` on hover, title → `brand-blue` on hover). Full CSS in `PORTAL_DESIGN_SYSTEM.md` §3/§6.

| Card | When to use | When not to use | Layout / media | CTA | Hover | Responsive | Accessibility |
|---|---|---|---|---|---|---|---|
| **Knowledge Card** (`KnowledgeSeedCard.tsx`) | CKOS Lesson/Knowledge Seed listings | Non-knowledge content | `.gemos-gem-card`, icon tile only, no image | Bottom text link | Standard lift | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | Card is `<Link>`-wrapped — keyboard-reachable |
| **Course/Premium Card** (`PremiumProgramCard.tsx`) | Premium program listings only | Any light-surface page | Hand-rolled dark glass (`bg-white/[0.04]`, `backdrop-blur`) — **intentionally not** `GemCard`, matches Premium's dark canvas | Bottom, full-width button | `hover:bg-white/[0.06]` + border color shift | `scroll-mt-24` for anchor nav | `<article>` semantic element |
| **Project Card** (`DigitalAssetProjectCard.tsx`) | Projects & Opportunities digital-asset listings | — | `.gemos-gem-card` (hand-applied class, not `<GemCard>`) | Bottom text link | Standard lift | Grid, `gap-4` | — |
| **Journey Card** (`features/academy/components/JourneyCard.tsx`) | Academy learning-journey listings — **note: this is an Academy component despite the name**, unrelated to the Journey platform's 6 doors | Journey Hub content (which uses `CurrentChapterCard`/`.hub-glass-card` instead — a different, unrelated card) | Hand-rolled `rounded-2xl border-gray-100 bg-white/70 backdrop-blur-sm` — **not** `GemCard` | — | — | `sm:grid-cols-2` | — |
| **Premium/Featured moments** (`GemCard variant="featured"`) | Any content that earned a celebratory glow (e.g. My Story's monthly letter) | Routine content — reserve for genuinely special moments per `PORTAL_DESIGN_SYSTEM.md` §9 | `GemCard`, cyan glow border | Varies by content | Standard lift + glow | — | — |
| **Story Card** (`CompanionMemoryCard`/`HumanGrowthDashboardCard`/`MonthlyLetterCard`/`ReflectionJournalCard`/`UnderstandingNoteCard`, all in `components/portal/story/`) | My Story door content blocks | — | **All compose `<GemCard>` directly** — the one card family that fully follows the canonical pattern | Inline text link | Standard lift | `space-y-4`/`h-full` | — |
| **Event Card** | **[GAP — does not exist]** | No Event content type, admin section, or card component exists anywhere in the Portal | | | | | |
| **News Card** | **[GAP — does not exist]** | `nhatkyhoctap/page.tsx` has an explicit code comment stating this is a deliberate decision: news/blog articles belong to Blog AI, not the Learning Journal. No News Card anywhere in Portal. | | | | | |
| **Resource Card** (`ResourceCard.tsx`) | Resources/prompts/ebooks/checklists/templates listings | — | `.gemos-gem-card` (hand-applied), no image | Bottom | Standard lift | Grid | — |
| **Community Card** (`.campus-card` glass surface, Community's own recipe) | Community-specific content boxes | Non-Community pages | `rounded-[20px]`, `bg: rgba(255,255,255,.82)`, `backdrop-filter: blur(8px)` — a distinct glass recipe matching Community's warm atmosphere, not `.gemos-gem-card` | Varies | `border-color`/`shadow` shift | — | — |
| **Learning Space Card** (inline in `congdongai/page.tsx`, `LEARNING_SPACES` array) | Community's 7 learning-space entries | — | Fully inline, per-item hardcoded tint (`space.tint`) and icon-chip color (`space.chip`) — **no separate component file** | Card itself is the link | `hover:-translate-y-0.5` | `sm:grid-cols-2 lg:grid-cols-3` (assumed from surrounding grid convention) | — |
| **Case Study Card** | **[GAP — no dedicated component]** | Inline markup only in `case-studies/page.tsx`, using `.card-shine` + `bg-white/[0.04]` — **flagged as a likely bug**: this near-transparent background was very likely copy-pasted from Premium's dark-surface recipe onto a light page (identical to a `prompts/page.tsx` bug already found and fixed once before). Do not copy this pattern elsewhere until it's resolved. | | | | | |
| **Video Card** | **[GAP — does not exist]** | No `<video>` tag, embed, or video-thumbnail card exists anywhere in the Portal. The one "YouTube" reference (`congdongai/page.tsx`) is a plain external link with a `PlayCircle` icon, not a card. | | | | | |

**Also in active use, not in the brief's list but real**: `PillarEntranceCard.tsx` (Home's 7 pillar-entrance tiles — deliberately 7 distinct accent surfaces, not `GemCard`, an intentional exception per `PORTAL_DESIGN_SYSTEM.md` §6), `AssetLockedCard.tsx`/`AssetUnlockedCard.tsx` (unlockable-asset states, hand-rolled), `JourneyStatusCard.tsx` (composes `<GemCard variant="progress">`, shared by CKOS + Academy), `CollectionCard.tsx`/`NextActionCard.tsx`/`OneNextStepCard.tsx`/`DownloadPrepCard.tsx` (CKOS feature-module cards, all hand-rolled, not `GemCard`).

**Binding rule**: any new card composes `<GemCard>` (as the Story-door cards correctly do). Do not hand-apply the `.gemos-gem-card` class string directly, and do not invent a 5th hand-rolled recipe.

---

## SECTION 4 — Button Library

Single component: `ui/Button.tsx`. **No additional button styles are allowed** — every button in the Portal goes through this component.

| Variant | Status | Class recipe |
|---|---|---|
| **Primary** | Built | `gemos-btn-primary rounded-full px-6 py-2.5 text-sm font-bold text-white` — gradient fill, `box-shadow` glow |
| **Secondary** | Built | `gemos-btn-secondary rounded-full px-6 py-2.5 text-sm font-semibold text-gray-900/85` |
| **Ghost** | **[GAP — not built as a named variant]** | Closest existing equivalent is `inverse-ghost` (`border border-white/40`, transparent fill) — but that's specifically for dark/gradient surfaces, not a general-purpose ghost button for light surfaces. No true "ghost on white" variant exists |
| **Icon** | Built | `gemos-btn-secondary flex h-9 w-9 items-center justify-center rounded-full text-gray-700` |
| **Danger** | **[GAP — not built]** | No destructive/danger button variant exists. Delete actions found (`SecurityPanel.tsx`, `account/LifeProfileCard.tsx`) use ad-hoc `border-red-*`/`text-red-*` classes outside `Button.tsx` entirely |
| **Disabled** | Built | `disabled:cursor-not-allowed disabled:opacity-40` — global, not per-variant |
| **Loading** | **[GAP — not built]** | No `loading` prop or spinner state on `Button`. Closest primitive (`LoadingState`/`.gemos-shimmer`) is not wired into it |
| *(also built, not in brief's list)* | `inverse`/`inverse-ghost` | For CTAs on gradient/dark hero surfaces |

**Hover/Focus/Pressed**: hover is variant-specific (brightness shift for Primary, background tint for others — no universal transform); focus is the global `:focus-visible` ring (automatic, not per-button); **pressed (`:active`) has no explicit style anywhere** — `[GAP]`.

---

## SECTION 5 — Form Components

**No shared form-input components exist.** There is no `Input.tsx`, `TextField.tsx`, `Select.tsx`, `Checkbox.tsx`, or `Toggle.tsx` in `components/portal/`. Every form in the Portal hand-rolls its inputs inline.

| Element | Status | Detail |
|---|---|---|
| **Input** | **[GAP — two competing recipes, not unified]** | Recipe A (`ProfileForm.tsx`, `SupportTicketForm.tsx`, `PracticeSubmissionForm.tsx`, `SecurityPanel.tsx`, `account/LifeProfileCard.tsx`, `CheckoutForm.tsx`): `rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400`. Recipe B (`GoalCreateForm.tsx`, all fields): `rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none`. Two real, different hand-rolled styles coexist — needs a Product Owner call on which one freezes as canonical (§12), not decided here |
| **Textarea** | Same as Input | Follows whichever of the two recipes above the containing form uses |
| **Select** | Same as Input | `ProfileForm.tsx` (gender), `GoalCreateForm.tsx` (category/type/priority) — no dedicated Select component, styled inline matching the surrounding form's input recipe |
| **Checkbox** | **[GAP — effectively doesn't exist as a real control]** | Exactly one `type="checkbox"` found anywhere in the Portal (`unlock/AssetContentView.tsx`), and it's decorative (no `onChange`, no state) — a checklist bullet rendered as a checkbox, not a functioning form control |
| **Radio** | **[GAP — does not exist]** | Zero `type="radio"` usage anywhere in the Portal |
| **Switch** | **[GAP — one hand-rolled instance, not persisted]** | `NotificationSettingsPanel.tsx` — a real `aria-pressed` toggle pill (`h-6 w-11 rounded-full`, sliding thumb), but its state is local-only (`useState`, never saved to a backend) despite living in an account-settings screen — flagged as a real product gap, not just a design one |
| **Search** | Built, canonical | `PortalSearch.tsx` — `{ companionTheme?: boolean }`. Two internal layouts: desktop inline (debounced 220ms, arrow-key navigation, grouped results) and a mobile full-screen overlay trigger. `companionTheme` only affects the desktop variant's color scheme |
| **Validation / Error / Success** | **[GAP — color-only text convention, not a shared component]** | No red-border-on-invalid pattern exists (confirmed: the only `border-red-*` hits in the whole Portal are on delete/danger *buttons*, never on inputs). The real convention is a plain status line below the form: error `text-sm text-red-400` or `text-red-600` (inconsistent between the two — not unified), success `text-sm text-green-400`. `SecurityPanel.tsx` is the one file that unifies both into a single conditional expression — the closest thing to a pattern worth formalizing |

---

## SECTION 6 — Navigation Components

| Component | Status | Detail |
|---|---|---|
| **Sidebar** | Canonical | `PortalSidebar.tsx` — see §2 |
| **Mobile Menu** | Canonical | `PortalShell.tsx`'s drawer (`fixed inset-0 z-50 md:hidden`, `Escape`-to-close, closes on route change) + `PortalSidebar variant="mobile"` — a real purpose-built touch drawer, not a shrunk desktop sidebar |
| **Breadcrumb** | **[GAP — no shared Portal component]** | `components/site/Breadcrumb.tsx` exists but is marketing-site-only. Inside `/portal/**`, breadcrumbs (where present at all) are hand-rolled per-page |
| **Back Button** | Canonical | `PortalBackLink.tsx` — see §2 |
| **Pagination** | **[GAP — does not exist]** | Confirmed: zero pagination pattern anywhere in the Portal. All primary listing pages (`tools`, `prompts`, `resources`, `templates`, `digital-assets`) render their entire filtered array unpaginated via `.map()`. The only `.slice(0, N)` usage found is for fixed-count "related content" strips, not "load more" pagination |
| **Tabs** | Built, but with caveats | `ProfileTabs.tsx` — real, functioning (`{key, label, icon, content}[]`, `useState` active tab, `border-b-2 border-brand-blue` active indicator). **Not ARIA-compliant** — no `role="tablist"`/`role="tab"`/`aria-selected` — a visual tab pattern, not an accessible one. This is the only tab implementation found anywhere in the Portal |

---

## SECTION 7 — Feedback Components

| Component | Status | Detail |
|---|---|---|
| **Empty State** | Canonical | `EmptyState.tsx`/`GemEmptyState.tsx` — `{title, description?, icon?, action?}`. Under-adopted relative to inline empty-state JSX (flagged already in `PORTAL_DESIGN_SYSTEM.md` §11) |
| **Loading** | Canonical | `LoadingState.tsx` — `{label, rows}`. `rows=0` → centered spinner (pulsing `Gem` icon); `rows>0` → shimmer rows |
| **Skeleton** | Same component as Loading | `LoadingState.tsx`'s `rows>0` path *is* the skeleton loader, using `.gemos-shimmer`. No separate "Skeleton" component exists or is needed — this is one component covering both requested categories |
| **Alert** | **[GAP — does not exist]** | No dismissable notification banner/alert-bar component anywhere |
| **Toast** | **[GAP — does not exist]** | No toast library in `package.json` (confirmed: no `react-hot-toast`, `sonner`, or equivalent), no hand-rolled toast component |
| **Badge** | Canonical, narrow scope | `GemBadge.tsx` — exactly 3 tones (`free/premium/locked`), backed by `.gemos-badge-free/-premium/-locked` |
| **Status Label** | **[GAP — inconsistent]** | Ecosystem-card status chips (`duan-cohoi/page.tsx`, e.g. "Đang theo dõi") reuse `.gemos-badge`'s *shape* but pick colors from a hand-rolled per-item lookup array (`ECOSYSTEM_SURFACE`) — not the same tone system `GemBadge` uses. Other small status chips (`ToolCard.tsx`, `ResourceCard.tsx`) are fully inline with no shared base class at all. **Note**: `/admin` already has a proper shared status component (`components/admin/ui/Badge.tsx`, tones `green/orange/red/blue/gray`, driven by a `STATUS_TONE` map) that the Portal side lacks — worth using as the model if this gap gets addressed |

---

## SECTION 8 — Media Components

| Component | Status | Detail |
|---|---|---|
| **Hero Image** | **[GAP — does not exist]** | Every Portal hero (§2) is a gradient surface — no photography-based hero exists anywhere |
| **Gallery** | **[GAP — does not exist]** | No image-grid/gallery component anywhere |
| **Video** | **[GAP — does not exist]** | No `<video>` tag or embed component anywhere (§3, §6 note) |
| **Avatar** | Built, but duplicated | `PortalUserMenu.tsx` — the real Portal-context avatar: initial-letter circle (`h-7 w-7 rounded-full bg-brand-orange/20 text-brand-orange`). `components/site/AccountMenu.tsx` has a near-identical implementation but explicitly disables itself inside `/portal/*` (`if (pathname?.startsWith("/portal")) return null`) — so it's dead code from the Portal's perspective, but its existence as a second hand-rolled copy of the same idea is the duplication worth flagging. No photo-based avatar for regular users exists |
| **Founder Profile** | Canonical | `community/CommunityGuides.tsx` — real photo (`next/image`) profile card + modal, currently one entry (the Founder). Code comment confirms it's intentionally CMS-ready for future mentors |
| **Map** | Canonical shell, honest empty state | `community/CommunityMapPanel.tsx` — `LOCATIONS` array is deliberately empty; renders only a dashed-border empty state with an explicit no-fake-markers disclaimer, per the project's NO-FAKE-DATA principle |
| **Illustration** | Garden-only | `components/portal/garden/scene/`: `TreeLayer`, `WindLayer`, `SunlightLayer`, `BokehLayer`, `SparkleLayer`, `LeafChipLayer`, orchestrated by `GardenScene.tsx`. No illustration system exists outside Garden — every other platform's "illustration" is its gradient atmosphere (`PORTAL_DESIGN_SYSTEM.md` §8), not a drawn asset |

---

## SECTION 9 — Companion Components

Full identity/voice/roles/silence rules: `docs/COMPANION_EXPERIENCE_ARCHITECTURE.md` — **not duplicated here.** This section maps the brief's six requested roles to the real components that embody them, per that document's own §2 role table:

| Brief's role | Companion's platform-role equivalent (per Architecture doc §2) | Component(s) |
|---|---|---|
| **Greeting** | Host (Home, Community) | `CompanionPresenceBand` (Home), `CompanionGreetingBubble.tsx` |
| **Reflection** | Witness (Journey's 6 doors) | `CompanionMemoryLine.tsx` (Journey Hub), Mirror/My Story's own reflection surfaces (`MirrorChamber.tsx` etc., not Companion-namespaced components but where Companion's reflective role lives) |
| **Suggestion** | Knowledge Guide (CKOS), Creative Collaborator (AI Workspace) | `CompanionThoughtBubble.tsx`, `CompanionContextualNudge.tsx`, `CompanionQuickPanel.tsx`, `CompanionDesk` (AI Workspace) |
| **Witness** | Witness (Journey) | Same as Reflection row — `CompanionMemoryLine.tsx`, `CompanionStoryMoment.tsx`, `LifeMomentBubble.tsx` |
| **Host** | Host (Home, Community) | `CompanionPresenceBand`, `CompanionPresence.tsx` (the floating avatar itself) |
| **Advisor** | Growth Advisor (Premium), Opportunity Advisor (Projects & Opportunities) | `PremiumAdvisor` |

**Full component inventory** (`components/portal/companion/`): `CompanionAvatar.tsx`, `CompanionContextualNudge.tsx`, `CompanionFlipbook.tsx` (status unclear — Architecture doc §8 flags this for review, possible removal, not resolved here), `CompanionGreetingBubble.tsx`, `CompanionMemoryLine.tsx`, `CompanionMicroReactionBubble.tsx`, `CompanionNest.tsx`, `CompanionPresence.tsx` (the root floating-avatar orchestrator), `CompanionQuickPanel.tsx`, `CompanionSpace.tsx` (the 6-block panel — Architecture doc §8 marks this **IMPROVE**, not **KEEP**, since 6 blocks opening at once risks "saying too much at once"), `CompanionStoryMoment.tsx`, `CompanionTaskEntry.tsx`/`CompanionTaskEntryPanel.tsx`, `CompanionThoughtBubble.tsx`, `CompanionWorkSessionPanel.tsx`, `LifeMomentBubble.tsx`, `OriginLineWhisper.tsx`.

**Visual DNA** (not duplicating voice rules, only the visual identity): a breathing spherical crystal (`LivingCore.tsx`), never a face or mascot; the Companion brand gradient `#111827 → #2563EB → #7C3AED → #F97316` used wherever Companion's own presence/name is the subject; dark Sanctuary surfaces reserved exclusively for Companion + Mirror.

---

## SECTION 10 — CMS Readiness

| Category | Meaning here | Examples |
|---|---|---|
| **Editable** | Content is already stored/edited via a real Admin CRUD screen | Tools, Prompts, Resources, Templates, Checklists, Case Studies, Digital Assets/Projects, Premium programs & pricing, Community, SOP/Services/Roadmap/Support/Updates, CKOS Knowledge Seeds, Affiliate/Referral |
| **Reusable** | Component is code-level reusable (any page can compose it) but its *content* is not Admin-editable — reusability is a developer property, not an editor property | `GemCard`, `Button`, `GemBadge`, `SectionHeader`, `PageHeader`, `EmptyState`, `KnowledgeJourneyStrip`, `PillarHero` (the component is reusable; each page's copy passed into it is hardcoded) |
| **Future CMS** | Explicitly designed/documented as a future CMS candidate, not built yet | Companion's Greeting/Reflection/Question/Memory-template libraries (`docs/COMPANION_EXPERIENCE_ARCHITECTURE.md` §11 — full proposed table there, not repeated here); per-pillar `PillarHero` copy; FAQ arrays (CKOS/Academy/Projects & Opportunities); Community's `LEARNING_SPACES` array |
| **Static** | Not expected to become CMS-editable — structural, brand, or one-off by nature | Brand SVG mark, `PortalSidebar`'s nav structure (`lib/portal/hubs.ts`), Footer link columns, `GradientTitle`'s gradient stops |
| **Admin Managed** | Full CRUD lives entirely in `/admin`, portal only renders | Same list as "Editable" above — every Admin-backed content type in `PORTAL_DESIGN_SYSTEM.md` §12's mapping table |

---

## SECTION 11 — Component Status

Every component in §§2–9 belongs to exactly one of: **CANONICAL** (the one correct way to solve this problem, adopt it going forward), **REUSABLE** (a real, valid shared component, narrower in scope than "canonical" or with a sibling variant), **LEGACY** (working, but should not be the template for new work), **DEPRECATED** (a pure alias/duplicate — use the thing it points to instead).

**CANONICAL**: `Button`, `GemCard`, `GemBadge`, `EmptyState`/`GemEmptyState`, `LoadingState`, `PageHeader`, `SectionHeader`, `PortalBackLink`, `PortalSidebar`, `PortalHeader`, `PortalShell`, `PillarHero`, `GradientTitle`, `KnowledgeJourneyStrip`, `PortalSearch`, `CommunityGuides`, `CommunityMapPanel`, Garden scene layer system, every `Companion*` component in §9's inventory except the two flagged below.

**REUSABLE**: `GlassCard` (sibling of `GemCard`, same base class), `GemSection`, `GemProgress`/`ProgressRing` (two different progress visualizations, both valid for their own use case), `HubModuleGrid`, `JourneyStep` (generic step-dots, not Journey-platform-specific despite the name), `ExperienceFlow`, `TopbarGlass`, `GemLockedOverlay`, `ProfileTabs` (real and reusable, but see its ARIA caveat in §6).

**LEGACY**: `CompanionSpace.tsx` (works, but the Architecture doc itself marks it **IMPROVE** — six blocks in one panel risks over-talking; not the template for a new Companion surface), `AccountMenu.tsx` (dead code from the Portal's own perspective — self-disables on every `/portal/*` route — kept alive only for the marketing site), the two competing `<input>` recipes in §5 (both "work," neither is canonical until Product Owner picks one).

**DEPRECATED** (pure re-export aliases — use the target directly, do not import the alias in new code):
- `GemButton` (`ui/GemButton.tsx`) → use `Button`
- `GemLoading` (`ui/GemLoading.tsx`) → use `LoadingState`
- `PortalBackground` (`ui/PortalBackground.tsx`) → use `GemBackground`

**Under review, not classified** (per `COMPANION_EXPERIENCE_ARCHITECTURE.md` §8, unresolved): `CompanionFlipbook.tsx` — unclear if still reachable anywhere in the current Portal; remove if not, otherwise apply the same restraint standard as every other Companion surface.

---

## SECTION 12 — Quality Rules

**No new component may be introduced unless:**
1. **The existing library cannot solve the problem.** Check §§2–9 first — extend `Button`/`GemCard`/`GemBadge`/etc. before writing something new. Several real gaps are already named in this document (Danger button, Ghost button, Loading button state, a unified Input, Checkbox, Radio, Alert, Toast, a unified Status Label, Event/Video/News Card) — building one of *those* still requires the step below, it isn't pre-approved just because it's listed here as missing.
2. **Product Owner approves.**

This applies equally to filling a documented `[GAP]` and to solving a problem this document didn't anticipate. A gap being named in this freeze is not permission to build it unreviewed — it's the opposite: naming it centrally means whoever eventually builds it brings one proposal to the Product Owner instead of the problem getting solved differently by whichever page needs it first (the exact failure mode that produced the two competing `<input>` recipes and the three deprecated re-export aliases documented above).

---

## Appendix — Rollup of Open Items (for Master QA / whoever picks this up next)

| # | Item | Section |
|---|---|---|
| 1 | Hero is 1 shared component (`PillarHero`) + 3 bespoke ones (Home/Community/Premium) — not consolidated | §2 |
| 2 | Portal has no shared Breadcrumb component; pages that have one hand-roll it | §2, §6 |
| 3 | CTA Footer: `KnowledgeJourneyStrip` exists but AI Workspace/Premium don't use it | §2 |
| 4 | Case Study card likely has a copy-pasted dark-surface bug | §3 |
| 5 | No Event Card, News Card, or Video Card — confirmed non-existent, not just under-documented | §3 |
| 6 | Button: no Ghost, no Danger, no Loading state, no `:active`/pressed style | §4 |
| 7 | Two competing `<input>`/`<textarea>`/`<select>` styling recipes, unresolved | §5 |
| 8 | Checkbox is not a real wired control anywhere; Radio doesn't exist at all | §5 |
| 9 | The one Switch (notification settings) doesn't persist its state | §5 |
| 10 | Error text color inconsistent (`red-400` vs `red-600`) across forms | §5 |
| 11 | No Pagination anywhere — all primary listings render fully unpaginated | §6 |
| 12 | `ProfileTabs` works but isn't ARIA-compliant | §6 |
| 13 | No Alert, no Toast, no toast library | §7 |
| 14 | Status Label is inconsistent — ecosystem-card chips vs. `GemBadge` vs. fully inline chips are three different approaches; Admin already solved this better than Portal has | §7 |
| 15 | Two near-duplicate avatar implementations (`PortalUserMenu` vs. dead-in-portal `AccountMenu`) | §8 |
| 16 | `CompanionSpace` marked **IMPROVE** by its own architecture doc, not **KEEP** | §9, §11 |
| 17 | `CompanionFlipbook` status unresolved — may be dead code | §9, §11 |
| 18 | Three deprecated re-export aliases (`GemButton`, `GemLoading`, `PortalBackground`) still importable — nothing stops new code from using them | §11 |

None of these are fixed by this document. This is a freeze of what exists, classified honestly, exactly as the brief asked for — implementation waits for separate, explicit Product Owner approval per §12.
