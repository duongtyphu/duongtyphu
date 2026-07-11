# PORTAL 4.0 — DESIGN SYSTEM (FREEZE)

**STATUS: SPRINT 0 DELIVERABLE — DESIGN SYSTEM ONLY. NO PORTAL UI WAS MODIFIED TO PRODUCE THIS DOCUMENT.**
**This is the single source of truth for every future UI decision in the Portal. Portal Master QA begins only after this document is approved.**
**After approval: no Platform may invent its own button, spacing, card, radius, shadow, background, animation, or color language without Product Owner approval (§15).**

Every value in this document was read directly out of the running codebase (`src/app/globals.css`, `src/components/portal/ui/*`, and the actual pages/components listed inline) — nothing here is aspirational or proposed-but-unbuilt unless explicitly marked **[GAP]**. Where the audit found real inconsistency or debt, it's documented as such rather than smoothed over, matching how every other frozen doc in this project (`PORTAL_RC1_RELEASE_CANDIDATE.md`, `VO_DUONG_AI_EXPERIENCE_PRINCIPLES.md`) handles the same situation.

### Relationship to existing design documents

Two design-system documents already exist and predate this freeze:
- **`docs/PORTAL_3_0_DESIGN_SYSTEM.md`** — the P.2 token audit (radius/shadow/motion/focus tokens, `Button`/`GemCard` component inventory, the badge-contrast accessibility fix). Its findings are **verified still accurate** as of this audit and are folded into this document rather than repeated as a separate source.
- **`src/design-system/01-foundation/` through `10-reference/`** — a fuller "VO DUONG AI Design System™ v1.0" scaffold. This audit found it contains **stale, unverified claims** — e.g. it references components (`journey/CurrentJourneyCard.tsx`, `journey/MilestoneCard.tsx`, `journey/Mission30DayCard.tsx`, `ArticleCard.tsx`) that do not exist anywhere in `src/`. Treat that folder as **superseded by this document** for anything the two disagree on; its still-valid structural ideas (per-area layout naming, the VISUAL DNA reference-image workflow) are not duplicated here but are not contradicted either.

This document is the tie-breaker going forward. If either older doc conflicts with what's written here, this document wins.

---

## SECTION 1 — Design Philosophy

| Principle | What it means in this codebase, concretely |
|---|---|
| **Human-first** | Companion is a presence, not a chatbot widget (`docs/COMPANION_EXPERIENCE_ARCHITECTURE.md`) — every screen answers a human question ("where am I, what changed, what's next"), never a system-status question. |
| **Calm before complexity** | One accent color per screen, one card language (§6), one hover pattern (§9) — not gradients-on-gradients or a different interaction idiom per page. |
| **Premium before decorative** | Restraint over ornament: whitespace and a single lift/glow motion beat stacked effects. Gradients are reserved for exactly two roles (§9) — never a full-section background outside those roles. |
| **Clarity before density** | Content-type cards carry a title, one meta line, and one CTA — not stat blocks or badge walls. Empty states explain *why*, not just *that* (§11). |
| **Growth before engagement** | No XP, points, streak counters, or fake progress bars anywhere in the Portal — confirmed zero instances in this audit. Progress is told through real milestones (`growth-map/growth-milestones.ts`), never gamified metrics. |
| **Atmosphere before decoration** | Every platform is a distinct radial-gradient "atmosphere," not a texture or pattern (§8). |
| **Background is storytelling** | Each atmosphere's color family is chosen to match that platform's emotional register (warm welcome, knowledge library, learning campus, creative studio, opportunity center — §3/§8) — the background is doing narrative work, not filling space. |
| **AI supports people, not replaces people** | Companion never claims false certainty, never fabricates data to look complete (`docs/VO_DUONG_AI_EXPERIENCE_PRINCIPLES.md` §11 — the project's NO-FAKE-DATA principle, which this design system inherits wholesale for §11 Empty States and §12 CMS). |

---

## SECTION 2 — Portal Layout System

**AI Workspace (`/portal/aiworkspace`) is the canonical layout reference**, per the brief. Its structure is the exact pattern every hub page in the Portal now follows (established across this project's Global Visual Update and Content Gutter work):

```
<div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">   ← cancels shell padding, atmosphere goes full-bleed
  <div className="{platform}-atmosphere-bg" aria-hidden />                            ← full-bleed atmosphere (§8)
  <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">                           ← shell padding restored
    <div className="rounded-3xl p-6 md:p-8 space-y-10">                              ← Content Gutter (canonical, frozen)
      {/* page content */}
    </div>
  </div>
</div>
```

| Rule | Frozen value | Source |
|---|---|---|
| **Sidebar width** | `w-64` (256px) expanded, `w-[68px]` collapsed | `PortalShell.tsx:78` |
| **Mobile nav drawer width** | `w-72` (288px), `max-w-[85vw]` | `PortalShell.tsx:94` |
| **Header height** | `h-16` (64px) | `PortalHeader.tsx:22` |
| **Page padding (shell)** | `px-4 py-6 md:px-8 md:py-8` | `PortalShell.tsx:111` (`<main>`) |
| **Content Gutter** | `rounded-3xl p-6 md:p-8` | Canonical since the AI Workspace inset-shell pattern (originally `94201cf`); this exact value is what every hub page's content sits inside, nested within the shell padding above |
| **Container / Max Width** | **Two intentional tiers** — see below | |
| **Section spacing** | `space-y-10` (Home/CKOS/AI Workspace) or `space-y-12` (Academy/Projects & Opportunities) between major page sections | Audited across all 5 canonical pillar pages |
| **Card gap** | `gap-4` in content grids (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4` / `lg:grid-cols-3`) | Dominant pattern across CKOS/Academy/AI Workspace/Projects card grids |
| **Vertical rhythm** | Section → `space-y-10/12`; within a card, `space-y-2/3`; card grid → `gap-4` | No separate spacing-scale token exists — Tailwind's default 4px scale is used directly and consistently (confirmed in `PORTAL_3_0_DESIGN_SYSTEM.md` §4, still true) |
| **Responsive breakpoints** | Tailwind v4 defaults, unmodified: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px | No `--breakpoint-*` override found anywhere in `globals.css`'s `@theme` block, no `tailwind.config.*` exists (Tailwind v4 CSS-first) |

**Container Width — two tiers, both intentional, do not merge them:**
1. **Hub/pillar pages** (Home, CKOS, Academy, AI Workspace, Projects & Opportunities, Journey Hub, Community): **no max-width constraint** — content fills the Content Gutter's available width, which is itself bounded only by the sidebar and viewport. This is deliberate: these pages are grids of cards/sections, not continuous reading text.
2. **Reading-column pages** (long-form or narrative content): an explicit `mx-auto max-w-*` on top of the Content Gutter. Observed values: Premium `max-w-6xl`, article/blog detail pages `max-w-3xl`, My Story `max-w-2xl`, Learning Journal `max-w-2xl`, Journey Map `max-w-2xl`, Mirror `max-w-xl`, Companion/Companion Mission `max-w-xl`/`max-w-3xl`. **[GAP]** these values aren't yet drawn from a single named scale (each page picked its own Tailwind `max-w-*` independently) — no evidence they're wrong, but a future pass could name them (`--container-reading-sm/md/lg`) rather than leave them as five separate literals.

---

## SECTION 3 — Color System

Tailwind v4 CSS-first — every `--color-*` token in `globals.css`'s `@theme` block auto-generates matching `bg-*`/`text-*`/`border-*` utilities. No `tailwind.config.*` file exists.

### Global Brand Colors
| Token | Hex | Usage |
|---|---|---|
| `brand-blue` | `#2563EB` | Primary actions, links, active states — the Portal's dominant accent |
| `brand-blue-dark` / `brand-navy-soft` | `#0B1F4D` | Deep accents |
| `brand-violet` | `#5B8CFF` | Secondary accent, paired with blue in gradients |
| `brand-orange` | `#FF7A00` | Brand mark accent (logo dot) only — see §7 for a hex-drift note |
| `brand-navy` | `#06142D` | Dark surfaces (Companion/Sanctuary, Premium) |
| `brand-purple` | `#8B5CF6` | Gradient pairs for premium/featured moments |
| `brand-cyan` | `#22D3EE` | Gradient pairs, "featured" card glow |

### GemOS system tokens (cards/badges/status, used platform-wide)
`gemos-navy` `#050B18` / `gemos-midnight` `#071426` / `gemos-sapphire` `#0B1B35` (dark surfaces) · `gemos-ai-blue` `#2563EB` / `gemos-gem-cyan` `#22D3EE` / `gemos-vision-purple` `#7C3AED` / `gemos-soft-violet` `#A78BFA` (accent gradients) · `gemos-gold` `#FBBF24` (celebratory moments only) · `gemos-text-primary` `#F8FAFC` / `gemos-text-secondary` `#CBD5E1` / `gemos-text-muted` `#94A3B8` / `gemos-text-disabled` `#64748B` (text hierarchy on dark surfaces).

### Neutral scale
`brand-gray-50` `#F8FAFC` / `100` `#F1F5F9` / `200` `#E2E8F0` / `400` `#94A3B8` / `500` `#64748B` / `700` `#334155`. **[GAP, inherited from Portal 3.0 audit, still open]**: no `300/600/800/900` steps exist — pages fall back to raw Tailwind `gray-900`/`gray-600` for body text. Not filled here per the same reasoning as before: inventing intermediate stops without a real usage need is exactly the "arbitrary value" pattern this document exists to prevent.

### State Colors
| State | Token | Hex | Note |
|---|---|---|---|
| Success | `gemos-success` | `#10B981` | Base token — **[GAP]** no badge/alert/toast class actually uses this exact hex; the one card variant named for success (`.gemos-card-success`) uses amber (`rgba(251,191,36,...)`, i.e. `gemos-gold`) instead — a naming/color mismatch to resolve, not invent a fix for here |
| Warning | `gemos-warning` | `#F59E0B` | Base token exists; no dedicated warning badge/alert component built yet |
| Info | — | — | **[GAP]** no info color token or component exists anywhere in the codebase. Not fabricated here — flagged as an open item for whoever builds the first component that needs it |
| Error | `gemos-danger` | `#F43F5E` | Base token exists; no dedicated error/invalid form-state class exists yet — confirmed zero hits for `.gemos-alert*`/`.gemos-toast*`/`.gemos-input-error` anywhere in `globals.css` |

### Platform Identity Colors

Each platform is defined by its **atmosphere background** (full CSS in §8) plus, where applicable, its **`PillarHero` tone gradient** (`src/components/portal/ui/PillarHero.tsx`, `TONE_GRADIENT`). This table is the canonical per-platform palette:

| Platform | Atmosphere class | Atmosphere color family | Hero/brand gradient |
|---|---|---|---|
| **Home** | `.home-atmosphere-bg` | Blue → violet → warm gold wash (`#f3f0fc → #eef1fb → #fdf6e8`) | `CompanionPresenceBand`'s own: `linear-gradient(135deg, #1E293B 0%, #2563EB 50%, #6D28D9 100%)` |
| **Companion** | `.sanctuary-bg` / `.sanctuary-bg-warm` | Near-white, faint blue/violet/orange radial washes (`#FEFEFE → #F7F9FC → #F3F0FA → #FDF6EE`) | Companion brand gradient (§10): `#111827 → #2563EB → #7C3AED → #F97316` |
| **CKOS** (Hệ tri thức AI) | `.ckos-atmosphere-bg` | Indigo/violet/cyan, "knowledge library" tone (`#eeeafc → #e6e9fa → #e3f6fb`) | `PillarHero` tone `knowledge`: `#4338CA → #7C3AED → #22D3EE` |
| **Academy** (Học viện AI) | `.academy-atmosphere-bg` | Blue/cyan/emerald, "learning campus" tone (`#e9f2fc → #e3f5f6 → #e6f9ef`) | `PillarHero` tone `learning`: `#2563EB → #0891B2 → #10B981` |
| **AI Workspace** | `.workspace-atmosphere-bg` | Violet/cyan/orange, "creative studio" tone (`#efe9fb → #e6f6f9 → #fdf1e6`) | Own hero gradient (matches Companion brand): `#111827 → #2563EB → #7C3AED → #F97316` |
| **Projects & Opportunities** | `.projects-atmosphere-bg` | Emerald/teal/amber, "opportunity center" tone (`#e6f5ef → #e3f4f2 → #fdf3e2`) | `PillarHero` tone `opportunity`: `#059669 → #0D9488 → #F59E0B` |
| **Premium** | Own inline dark canvas (not a shared class) | `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,76,222,.35), transparent), linear-gradient(180deg, #0B1020 0%, #0E1428 45%, #0B1020 100%)` | `PillarHero` tone `value`: `#7C3AED → #C026D3 → #FBBF24` (used for the pillar-entrance tile, not the Premium page itself) |
| **Journey** (Hành trình của tôi) | `.hub-atrium-bg` + `.hub-atrium-sheen` | Blue/violet/orange, "Bright Atrium" tone, more saturated than the generic pillars (`#e9eefb → #dfe7f8`) | `PillarHero` tone `brand`: `#2563EB → #5B8CFF → #7C3AED` (used for the pillar-entrance tile) |
| **Community** (Cộng đồng) | `.campus-bg` + `.campus-glow-a/b/c` | Sky blue/orange/emerald, warm-daylight "AI Campus" tone (`#fbecd9 → #dcf1e4 → #d7e9fa`) | Own — `.campus-hero` layered gradient, not `PillarHero` |

Journey's five "doors" (Mirror, My Story, Learning Journal, Journey Map, Garden) each keep their **own** bespoke atmosphere (`.mirror-chamber-bg` dark violet/slate, `.story-book-bg` warm parchment, `.journal-notebook-bg` warm paper + ruled lines, `.map-parchment-bg` aged-map tan, `.garden-sky--dawn/day/sunset/night` a full day-cycle) — this is intentional per `GARDEN_VISUAL_DIRECTION.md` and is **not** a violation of "one atmosphere per platform"; the five doors are sub-experiences of Journey, each with its own emotional register, the same way Journey itself has one relative to Home.

---

## SECTION 4 — Typography

- **Font**: Plus Jakarta Sans (`next/font/google`, subsets `latin`+`vietnamese`, weights 400–800), wired as `--font-sans`. No other font in the codebase, with one deliberate exception: `.story-serif` (`Georgia, "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif`) used only in My Story, to give that one door a "handwritten book" register distinct from the rest of the Portal.

| Role | Frozen pattern | Source |
|---|---|---|
| **Heading (Page H1)** | `text-2xl font-extrabold text-gray-900` (`sm:text-3xl`/`sm:text-4xl` on hero bands) | `PageHeader.tsx`, `PillarHero.tsx` |
| **Subheading (Section H2)** | `text-xl font-bold text-gray-900` | `SectionHeader.tsx` |
| **Body** | `text-sm text-gray-600` | Consistent across card descriptions, section copy |
| **Caption / muted** | `text-sm text-gray-500` or `text-xs text-gray-400` for secondary metadata | Consistent across timestamps, sub-labels |
| **Quote** | `italic` + reduced opacity/muted color (`text-gray-500 italic`) | Reflection prompts, Companion musings |
| **Companion Voice** | First-person, warm, sometimes trailing off — see `docs/COMPANION_EXPERIENCE_ARCHITECTURE.md` for the full voice standard; visually rendered the same as Quote/Body depending on context, no separate typographic treatment | Reference only per brief §10 — not duplicated here |
| **Button text** | `text-sm font-bold` (primary) / `text-sm font-semibold` (secondary/ghost) | `Button.tsx` |
| **Card title** | `text-sm font-bold text-gray-900` + `.gemos-card-title` (hover → `brand-blue`) | `.gemos-gem-card` system |
| **Card description** | `text-xs leading-relaxed text-gray-500` | Dominant pattern across `GemCard`-based cards |
| **Badge/chip text** | `font-size: 11px; font-weight: 700; letter-spacing: 0.02em` | `.gemos-badge` |

**Line-height / letter-spacing**: no global type-scale class system exists in `globals.css` beyond the badge rule above — `leading-relaxed`/`leading-tight` and default letter-spacing are applied per-component via Tailwind utilities, consistently enough across the audit that no override token is needed (confirmed in the Portal 3.0 audit, still true: "Tailwind's default 4px-based scale... needs no override").

**Font weights in use**: 400 (body, rare), 500/`font-medium` (secondary labels), 600/`font-semibold` (secondary buttons, subheads), 700/`font-bold` (card titles, section H2), 800/`font-extrabold` (page H1, hero headlines). No 300 or 900 weight usage found.

**[GAP, inherited]**: no shared heading-scale *component* is adopted repo-wide — `PageHeader`/`SectionHeader` exist and are correct, but many pages still hand-write `<h2 className="text-xl font-bold text-gray-900">` instead of importing `SectionHeader`. The pattern above is the frozen standard regardless of which pages have adopted the component yet.

---

## SECTION 5 — Button System

Single component: `src/components/portal/ui/Button.tsx`. **Never hand-roll a button — every button in the Portal goes through this component or its documented CSS classes.**

| Variant | Class | Look |
|---|---|---|
| **Primary** | `gemos-btn-primary rounded-full px-6 py-2.5 text-sm font-bold text-white` | Gradient fill `linear-gradient(135deg, #2563EB, #7C3AED)`, `box-shadow: 0 10px 30px -10px rgba(124,58,237,.5)` |
| **Secondary** | `gemos-btn-secondary rounded-full px-6 py-2.5 text-sm font-semibold text-gray-900/85` | Neutral surface, for the non-primary action beside a primary CTA |
| **Icon** | `gemos-btn-secondary flex h-9 w-9 items-center justify-center rounded-full text-gray-700` | Same surface as Secondary, icon-only, square-circle footprint |
| **Inverse** | `rounded-full bg-white px-6 py-2.5 text-sm font-bold text-brand-blue shadow-token-sm hover:bg-blue-50` | For CTAs sitting on a gradient/dark surface (hero bands) |
| **Inverse-ghost** | `rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10` | Secondary action on the same dark/gradient surfaces as Inverse |
| **Danger** | **[GAP — not built]** | No danger/destructive button variant exists anywhere in the Portal today. Not fabricated here; build it as `Button.tsx`'s 6th variant, matching the existing recipe (`rounded-full`, `text-sm font-bold`, red surface), the first time a real destructive action needs one |

**States**
- **Disabled**: `disabled:cursor-not-allowed disabled:opacity-40` — applied globally in `Button.tsx`, not per-variant.
- **Hover**: variant-specific (see table); Primary uses `filter: brightness(1.08)` + slight lift, not a color swap.
- **Focus**: global `:focus-visible` ring (`outline: 2px solid var(--color-brand-blue)`, `outline-offset: 2px`) — applies automatically, no per-button opt-in.
- **Loading**: **[GAP — not built]**. `Button.tsx` has no `loading` prop or spinner state. The closest existing primitive is `.gemos-shimmer` (§9), not currently wired into `Button`.
- **Pressed** (`:active`): **[GAP — not explicitly styled]**. No `active:` state defined on any variant; relies on the browser default plus the hover transform already in flight.

**Rule (binding):** never create a different button style for a different page. If none of the five existing variants fit, extend `Button.tsx` with a new variant — do not hand-roll `rounded-full bg-... px-... py-...` inline again (this exact anti-pattern was found and fixed twice already in the Portal 3.0 audit).

---

## SECTION 6 — Card System

**Canonical base**: `.gemos-gem-card` / `.gemos-glass-card` (`globals.css`, shared class) — `border-radius: var(--radius-2xl)` (28px), `background: #fff`, `border: 1px solid #E2E8F0`, `box-shadow: var(--shadow-token-sm)`; hover: `translateY(-5px)`, `border-color: #CBD5E1`, `box-shadow: var(--shadow-token-lg)`, title text → `brand-blue`. React wrapper: `GemCard.tsx` (`p-5 sm:p-6`), variants `default/featured/progress/action/locked/success`.

The brief asks for 10 named canonical card types. Here is what the audit actually found for each — several are real, distinct components; several are the same `GemCard` shell with different content; a few don't exist yet and are marked as such rather than invented:

| Requested type | Reality in the codebase | radius / padding / shadow | Image ratio | CTA placement |
|---|---|---|---|---|
| **Knowledge Card** | `features/knowledge/components/KnowledgeSeedCard.tsx` | `.gemos-gem-card` (hand-applied), `rounded-2xl p-5` | No image (icon tile only) | Bottom-left text link |
| **Course/Premium Card** | `components/portal/premium/PremiumProgramCard.tsx` | Hand-rolled dark glass: `rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur` — **intentionally not** `.gemos-gem-card` (Premium runs on a dark canvas, §3) | No fixed ratio — icon/badge header | Bottom, full-width button |
| **Project Card** | `components/portal/DigitalAssetProjectCard.tsx` | `.gemos-gem-card` (hand-applied), `rounded-2xl p-5` | No image (icon tile) | Bottom text link |
| **Journey Card** | `features/academy/components/JourneyCard.tsx` (Academy learning journeys) | Hand-rolled `rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm` — **not** `.gemos-gem-card` | No image | Bottom |
| **Community Card** | Inline in `congdongai/page.tsx` (Learning Spaces grid) + `campus-bg`/`.campus-card` glass surface | `.campus-card`: `rounded-[20px]`, `bg: rgba(255,255,255,.82)`, `backdrop-filter: blur(8px)` — a **distinct** glass recipe, not `.gemos-gem-card` (matches Community's own atmosphere register) | No image | Varies |
| **Story Card** | Several: `CompanionMemoryCard`, `HumanGrowthDashboardCard`, `MonthlyLetterCard`, `ReflectionJournalCard`, `UnderstandingNoteCard` (all in `components/portal/story/`) | **All compose `<GemCard>` directly** — the one card family that fully follows the canonical pattern | Standard `GemCard` (`p-5 sm:p-6`) | No image | Inline text link |
| **Case Study Card** | **[GAP]** No dedicated component — inline markup only, in `case-studies/page.tsx` | Uses `.card-shine` (a 4th, distinct hover-shine class) + `bg-white/[0.04]` — **flag: this near-transparent background was very likely copied from Premium's dark-surface recipe onto a light page**, a real bug pattern (identical to the `prompts/page.tsx` bug the Portal 3.0 audit already found and fixed once) | Not yet decided | Not yet decided |
| **Resource Card** | `components/portal/ResourceCard.tsx` | `.gemos-gem-card` (hand-applied), `rounded-2xl p-5` | No image | Bottom |
| **Event Card** | **[GAP — does not exist]**. No Event content type, admin section, or card component found anywhere in the Portal today | — | — | — |

**Also found, not in the brief's list but real and load-bearing**: `PillarEntranceCard.tsx` (Home's 7 pillar-entrance tiles) is **deliberately** not `.gemos-gem-card` — 7 distinct accent surfaces (violet/blue/slate/emerald/amber/teal/rose), each its own radius (`rounded-lg` to `rounded-[1.75rem]`). This is an intentional, documented exception ("each door feels different"), not drift — keep it as the one card family exempt from the shared shell.

**Binding rule**: any *new* content-type card should compose `<GemCard>` (as the Story-door cards correctly do) rather than hand-apply the `.gemos-gem-card` class string or invent a new `rounded-2xl border ... shadow-sm` recipe. The Case Study inline card (`bg-white/[0.04]` on a light page) is flagged as a bug to fix, not a pattern to repeat.

---

## SECTION 7 — Iconography

- **One icon family**: `lucide-react`, exclusively, for all UI chrome. Confirmed zero usage of `react-icons`/`@heroicons`/any other icon package anywhere in `src/components/portal` or `src/app/portal`.
- **Stroke weight**: Lucide's default (`strokeWidth={2}`, left unset in the overwhelming majority of usages). One deliberate deviation: `PortalSidebar.tsx` nav icons use `strokeWidth={1.75}` (slightly finer, matches the sidebar's smaller icon size). No other unexplained stroke-width overrides found.
- **Icon size scale** (by frequency, dominant → rare):

| Size | Role |
|---|---|
| `h-3.5 w-3.5` | Badge/chip icons |
| `h-4 w-4` | **Default** — card/sidebar/secondary-button icons (74 occurrences, the clear majority) |
| `h-5 w-5` | Hero/section-primary icons |
| `h-6 w-6`+ | Large illustrative icons only |

- **Icon container/tile**: `flex h-{N} w-{N} items-center justify-center rounded-{lg|xl|full} bg-{color}`, glyph nested inside at one size step smaller than the tile. Standard card tile: `h-9`–`h-11`; hero/detail-page tile: `h-12`–`h-14`. **[GAP]** tile radius varies (`rounded-lg`/`rounded-xl`/`rounded-full`) with no single canonical value per context — not resolved here, flagged for a future pass since guessing which one is "correct" without a real design decision would itself violate this document's own no-fabrication standard.
- **Icon color**: matches the surrounding accent (platform tone, or `text-gray-700`/`text-gray-400` for neutral chrome) — no separate icon-color token system; inherits from the same brand/gray tokens as text.
- **Known deviation to fix**: `src/app/portal/aiworkspace/[slug]/page.tsx` hand-codes 16 separate raw `<svg>` icons (checkmarks/chevrons/arrows) instead of the equivalent `lucide-react` import — the one file in the Portal that breaks the "Lucide only" rule for ordinary UI icons. Everywhere else, raw `<svg>` is correctly reserved for the brand logo mark, custom progress rings (`ProgressRing.tsx`), and special-styled reference pages (Garden scene layers, Journey Map compass, Companion Sanctuary) — all legitimate exceptions.
- **Known drift, not fixed here** (carried over from Portal 3.0 audit): `PortalHeader.tsx`/`PortalSidebar.tsx` inline the brand SVG mark using `#FF7A00` for the accent dot; `CLAUDE.md`'s mandated logo markup for new pages specifies `#F97316`. Still open — needs an explicit Product Owner call (update the mandate to match the shipped shell, or update the shell), not a default fix either direction.

---

## SECTION 8 — Background System

> **The checkered/grid background has been permanently deprecated.** This was completed in an earlier sprint (the Global Visual Update) and is re-stated here as a permanent, binding rule, not a one-time cleanup.

**Prohibited, with no exception, anywhere in the Portal:**
- checkered backgrounds
- hidden grids
- engineering grids
- blueprint textures
- dot grids
- repeated square patterns
- matrix patterns

Confirmed via full-codebase grep sweep (both this sprint's audit and the earlier Global Visual Update's own re-audit): zero instances of any of the above remain, in CSS or inline component styles. `.gemos-bg` — the one surviving "fallback" background class — is explicitly a neutral gradient wash now, documented in its own code comment as superseded by each platform's real atmosphere.

**Backgrounds must rely on**: atmosphere, light, depth, gradients, glass, illustration, photography, AI artwork. Every platform atmosphere class is a layered radial-gradient "mesh" — never a flat fill, never a repeating texture. Full CSS for all nine platform atmospheres plus the five Journey-door atmospheres is documented per-platform in §3; the underlying technique is identical everywhere: 2–4 soft `radial-gradient` light pools over a `linear-gradient` base, `position: absolute; inset: 0`, rendered behind a `relative z-10` content layer.

**Glass surfaces** (used for cards/panels sitting on top of an atmosphere, not as the atmosphere itself): `.hub-glass-card` (Journey Hub), `.campus-card`/`.campus-hero` (Community), `.garden-glass-card` (Garden), `.mirror-glass-veil` (Mirror, `mix-blend-mode: soft-light`) — each a `backdrop-filter: blur(8–18px)` semi-transparent white surface, tuned per platform rather than one shared glass recipe. This variation is intentional (matches each atmosphere's own color temperature) and is not a violation of "one card language" (§6) — glass panels are atmosphere-adjacent chrome, not content cards.

**Background is storytelling, not decoration** — binding test: see §14.

---

## SECTION 9 — Motion System

Base tokens (`globals.css` `:root`, Portal 3.0 P.2, still current):
```css
--motion-fast: 150ms;
--motion-base: 250ms;
--motion-slow: 400ms;
--motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
```

| Motion role | Frozen pattern |
|---|---|
| **Hover (cards)** | `translateY(-5px)` + `border-color` lightens + `box-shadow` steps up (`shadow-token-sm` → `shadow-token-lg`), `250ms`, `var(--motion-ease)` — one pattern, applied via `.gemos-gem-card:hover`, used everywhere a card is clickable |
| **Hover (buttons)** | Primary: `filter: brightness(1.08)`. Inverse: background tint shift (`hover:bg-blue-50`/`hover:bg-white/10`). No transform on button hover — only cards lift |
| **Transition (default)** | `transition` (Tailwind default, ~150ms) for color/opacity changes not covered above; `var(--motion-base)` (250ms) for the card system specifically |
| **Page entrance** | Fade + slight `translateY` on mount, e.g. `.story-fade-in`, `.journal-page-fade-in` — used on Story/Journal content blocks, not a global page-transition system (no route-level enter/exit animation exists) |
| **Glow** | Two registers: (a) celebratory — `.gemos-glow-pulse` (opacity 0.5↔1, scale 1↔1.08, 2.2s), used for featured/success moments; (b) ambient/living — the Companion/Sanctuary/Garden family of `*-breathe`/`*-pulse` keyframes (`companion-presence-breathe`, `sanctuary-glow-pulse`, `garden-gem-breathe`, `living-core-pulse`, etc.) — slow (2–12s), low-amplitude, meant to read as "alive," not "notify me" |
| **Glass** | `backdrop-filter: blur(8–18px)` per §8 — static, not animated |
| **Loading** | `.gemos-shimmer` — a `background-position` sweep, `1.6s ease-in-out infinite`. **[GAP]** no class is literally named "skeleton"; `.gemos-shimmer` is the de facto skeleton-loader primitive and should be treated as such rather than building a second one |
| **Skeleton** | Same as Loading — `.gemos-shimmer` is the only shimmer-style loading primitive in the codebase |
| **Reduced motion** | Comprehensive — every animated class family (Companion, Sanctuary, Garden, Hub, Journal, Map, Campus, Living Core, Story, Mirror) has its own `@media (prefers-reduced-motion: reduce)` block setting `animation: none` (with a static-opacity fallback where needed). Confirmed platform-by-platform, no gaps found — this is the one area of the motion system with full, verified coverage |
| **Animation timing** | Ambient/breathing motifs: 2–12s (calm, background-level). Celebratory/one-shot pulses: 300ms–2.2s. Marquees (`ticker-scroll`, `opportunities-companions-scroll`): 40–60s (deliberately slow, non-distracting). Orbit rings (Living Core): 42–71s |

**Motion must feel calm, premium, intentional** — binding test: any new animation must map to one of the rows above (hover / entrance / glow / loading / ambient-breathing), or extend that row's existing timing family. Do not add a new one-off keyframe with an arbitrary duration.

---

## SECTION 10 — Companion Design Language

Full identity, roles, voice, and behavior are defined in `docs/COMPANION_EXPERIENCE_ARCHITECTURE.md` — **not duplicated here.** Visual rules only:

- **Living Core** (`components/LivingCore.tsx`): the one visual embodiment of Companion across the Portal — a breathing circular core (`living-core-pulse`, 1.6–2s scale pulse) with 2–3 slow-rotating orbit rings (42–71s) and drifting "mote" particles. States: `idle/thinking/speaking/celebrating/sleeping/offline`, each a distinct color/animation-speed variant of the same component — never a different illustration per state.
- **Companion brand gradient**: `linear-gradient(90deg/135deg, #111827, #2563EB, #7C3AED, #F97316)` — used exactly where Companion's own name/presence appears as text or a hero surface (AI Workspace hero, Companion/Companion Mission pages, sidebar "Companion" wordmark). Distinct from any single platform's atmosphere tone — this gradient means "this is Companion speaking," not "this is platform X."
- **Dark Sanctuary surfaces**: `.sanctuary-bg`/`.sanctuary-bg-warm`/`.mirror-chamber-bg` are the only Portal surfaces that shift to a near-black or navy base rather than the light-surface register everything else uses — reserved for Companion/Mirror specifically, the two most reflective/intimate experiences in the Portal. This is an intentional second register, not an inconsistency (confirmed and preserved from the Portal 3.0 audit).
- **Breathing as signature motion**: every Companion-adjacent surface (Living Core, Sanctuary orbs, Companion avatar states) uses a slow scale/opacity "breathe" cycle rather than a sharp bounce or spin — this is Companion's visual heartbeat and should not be reused for non-Companion UI (e.g. a loading spinner should use `.gemos-shimmer`, not a breathing pulse, so the breathing motif stays uniquely legible as "Companion is here").

---

## SECTION 11 — Empty States

**Canonical component**: `components/portal/ui/EmptyState.tsx` (aliased as `GemEmptyState`) — `{ title, description?, icon? (default Gem), action? }`, rendered as `.gemos-glass-card` + centered icon tile + `text-base font-bold` title + `text-sm text-gray-500` description + optional action slot.

**Portal-wide rules (binding, and already the house style everywhere audited):**
- Never display generic "No Data" or 404-style messages.
- Never display fake statistics or fake activity — confirmed zero instances anywhere in the Portal.
- Every empty state must encourage exploration honestly — state the *real* reason data is absent, not just that it's absent.

**House voice, confirmed via real examples across the codebase**: first-person, warm ("mình chưa có", "sẽ cập nhật khi có"), states the actual reason, and very often pairs the statement with a concrete alternate action rather than leaving a dead end:
- Case Studies: *"Chưa có Case Study nào được đăng... mỗi Case Study cần thời gian thu thập số liệu thật và sự đồng ý của người trong câu chuyện trước khi đăng công khai."* → CTA to Learning Journal instead.
- Projects & Opportunities (no sub-projects yet): *"...mình chưa có nội dung thật đủ chi tiết để tách theo từng dự án con, nên chưa hiển thị mục này thay vì bịa tên dự án."* — the anti-fabrication principle stated directly in user-facing copy.
- Living Garden (first-time user): *"Khu vườn của bạn đang chờ hạt giống đầu tiên... Mỗi hành động nhỏ hôm nay là một hạt giống cho phiên bản tốt hơn của bạn ngày mai."*

**[GAP]**: the shared `EmptyState`/`GemEmptyState` component is under-adopted — most empty states across `src/app/portal/**` are written as one-off inline JSX rather than through the component, even though the *voice* is consistently correct everywhere. The tone standard is fully met; the component-reuse standard is not. Sweep opportunistically as pages are touched, per the same low-effort-per-page approach the Portal 3.0 audit already established for card/button adoption — not a mass-refactor to schedule separately.

---

## SECTION 12 — CMS Design Principles

Every visual block *should eventually* be editable through Admin, per the brief. Here is what's actually wired today versus what isn't — this section is an honest map, not a claim that all of it is done:

| Visual block | Admin-editable today? | Admin route |
|---|---|---|
| Tools | Yes | `admin/tools` → `/portal/tools` |
| Prompts | Yes | `admin/prompts` → `/portal/prompts` |
| Resources / Templates / Checklists / Ebooks | Yes | `admin/resources`, `admin/templates`, `admin/checklists`, `admin/ebooks` |
| Case Studies | Yes (content), but no card component exists to style it (§6 gap) | `admin/case-study` → `/portal/case-studies` |
| Projects (ecosystems, digital assets, articles) | Yes | `admin/digital-assets` (+ `articles`/`categories`/`projects` subs), `admin/projects` |
| Premium programs / pricing | Yes | `admin/premium`, `admin/course-pricing` |
| Community | Yes | `admin/community` → `/portal/congdongai` |
| SOP / Services / Roadmap / Support / Updates / Student Success | Yes | `admin/sop`, `admin/services`, `admin/roadmap`, `admin/support`, `admin/updates`, `admin/student-success` |
| CKOS Knowledge Seeds | Yes | `admin/knowledge-seed` |
| Affiliate/Referral | Yes | `admin/affiliate`, `admin/affiliate-hub`, `admin/referral` (top products) |
| Home banner / CTA / featured items / today's actions / user goals | Yes — but as **layout/arrangement** controls, not new content types | `admin/portal-builder/*` |
| **Hero** (per-pillar `PillarHero` copy/tone) | **[GAP]** — no admin section controls `PillarHero` eyebrow/title/subtitle text; it's hardcoded per page | — |
| **FAQ** (CKOS, Academy, Projects & Opportunities all have one) | **[GAP]** — every FAQ audited is a static array in the page file, not Admin-editable | — |
| **Learning Spaces** (Community) | **[GAP]** — the `LEARNING_SPACES` array in `congdongai/page.tsx` is hardcoded, not CMS-driven | — |
| **Stories** (Community/My Story testimonials, if any beyond real Case Studies) | Not applicable beyond Case Studies — no separate "Stories" content type exists |
| **Events** | **[GAP]** — no Event content type exists anywhere (§6) |
| **News** | Partial — `admin/news`/`admin/blog` exist but which public surface they feed wasn't conclusively identified in this audit; flagged for confirmation rather than guessed |

**Principle going forward**: any new visual block built after this freeze should be designed CMS-first where the content is genuinely dynamic (has more than one real instance, or will be edited without a code deploy) — but hardcoding a one-off hero/FAQ is not automatically wrong; the gap list above is informational, not a mandate to build 8 new Admin sections before Master QA.

---

## SECTION 13 — Accessibility

Frozen standards (carried forward from the Portal 3.0 P.2 accessibility audit, re-confirmed still accurate):

1. **Contrast**: ≥4.5:1 for body text, ≥3:1 for large text (≥24px, or ≥19px bold). The one contrast bug found and fixed to date — `GemBadge`'s three tones were designed for a dark surface but render on white (`.gemos-gem-card`) — is documented in §3's badge colors; audit any new tinted badge/label against this before shipping.
2. **Focus**: global `:focus-visible` ring (`outline: 2px solid var(--color-brand-blue)`, `2px` offset) — automatic on every interactive element. Never add `outline: none` without an equivalent visible replacement.
3. **Semantic HTML**: navigation → `<a>`/`Link` (as `Button`'s `href` prop already enforces); actions → `<button type="button">` (as `Button` already enforces). Never `<div onClick>` for an interactive element.
4. **Keyboard**: mobile nav drawer closes on `Escape` — carry this into any future modal/drawer.
5. **Reduced motion**: `prefers-reduced-motion: reduce` support is comprehensive across every animated component family (§9) — maintain this coverage for any new animation.
6. **Touch targets**: **[Not previously audited — new finding]**. Standard interactive element heights: `h-9` (36px, Icon button, secondary chip actions) and `h-11` (44px, primary pillar-entrance icon tiles). WCAG 2.1 AA recommends a 44×44px minimum touch target — `h-11` elements meet this, `h-9` elements (36px) fall slightly short. Not fixed here (would be a real, if small, UI change, out of scope for a plan-only freeze) — flagged as a concrete follow-up for whichever team picks up Master QA's accessibility pass.
7. **Text size floor**: no text below `text-xs` (12px) for body/label content anywhere audited — maintain this floor.
8. **Responsive**: mobile nav is a real purpose-built drawer, not a shrunk desktop sidebar (§2); content grids use `grid-cols-1 sm:grid-cols-2 md:/lg:grid-cols-3` consistently — no systemic responsive gap found.

---

## SECTION 14 — Visual Quality Gate

**A Platform succeeds only if it can be recognized without seeing its logo, title, or menu — recognition must come from atmosphere, color, lighting, composition, motion, and visual identity alone.**

This is not a new bar invented for this document — it is the exact acceptance criterion the Product Owner set for the Global Visual Update sprint that built the per-platform atmosphere system in §3/§8 ("hide every logo, Product Owner should still recognize each platform purely from atmosphere/color/composition"). That sprint's own verification method — SSR HTML inspection confirming each platform's distinct gradient/color-family renders correctly, cross-checked against the "avoid visual repetition" requirement — is the model to reuse for any future platform.

**This freeze formalizes that sprint's bar as a permanent, binding gate**, not a one-time QA checklist: any new platform or major section added after this document must be atmosphere-distinguishable from every existing one before it ships, using the same technique (a unique radial-gradient mesh + its own color family from §3, never a repeated texture, never another platform's palette).

---

## SECTION 15 — Design Freeze Rules

**After this document is approved:**

No Platform may invent its own:
- button
- spacing
- card
- radius
- shadow
- background
- animation
- color language

**...without Product Owner approval.**

Concretely, this means:
- New buttons extend `Button.tsx` (§5) — they don't hand-roll `rounded-full bg-...` again.
- New cards compose `<GemCard>` (§6) — they don't hand-roll a 5th `rounded-2xl border ... shadow-sm` recipe.
- New spacing uses Tailwind's default scale as already applied in §2 — no parallel spacing system.
- New radius/shadow reaches for `--radius-*`/`--shadow-token-*` (§2, inherited from Portal 3.0 P.2) before a raw px/hex value.
- New backgrounds follow the atmosphere technique in §8 — never a grid/checkerboard/texture, never a flat fill outside the two roles named in §9's Glow row.
- New motion maps to one of §9's five families (hover / entrance / glow / loading / ambient-breathing) at one of its existing timing values.
- New color reaches for a token in §3 — every color used in a new component must trace back to a token in this document.

Where this document marks something **[GAP]** — Danger button, Info color, Event Card, per-pillar Hero/FAQ CMS editability, etc. — that is not silent permission to invent a one-off solution when the need arises. It means: bring it to the Product Owner as a proposed addition to this document first, the same way any other new pattern would be proposed, so the gap gets filled once, centrally, rather than solved differently by whichever page happens to need it first.

---

## Appendix — Known Gaps & Debt (rollup, for Master QA planning)

| # | Gap | Section |
|---|---|---|
| 1 | No Danger button variant | §5 |
| 2 | No Button loading/pressed state | §5 |
| 3 | No Info state color; Success color/token mismatch (`.gemos-card-success` uses gold, not the emerald `gemos-success` token) | §3 |
| 4 | Neutral gray ramp missing `300/600/800/900` steps | §3 (inherited) |
| 5 | No Event Card / Event content type anywhere | §6 |
| 6 | Case Study inline card likely has a copy-pasted dark-surface bug (`bg-white/[0.04]` on a light page) | §6 |
| 7 | Icon tile radius not standardized (`rounded-lg`/`xl`/`full` all in use) | §7 |
| 8 | 16 raw `<svg>` icons in `aiworkspace/[slug]/page.tsx` should be Lucide | §7 |
| 9 | Brand-mark accent hex drift: shell files use `#FF7A00`, `CLAUDE.md` mandates `#F97316` | §7 (inherited) |
| 10 | No "skeleton" naming — `.gemos-shimmer` is the de facto primitive | §9 |
| 11 | `EmptyState`/`GemEmptyState` component under-adopted vs. inline empty-state JSX | §11 |
| 12 | Per-pillar Hero copy, FAQ, and Community "Learning Spaces" are hardcoded, not CMS-editable | §12 |
| 13 | `h-9` (36px) interactive elements fall short of the 44px WCAG touch-target recommendation | §13 |
| 14 | Reading-column `max-w-*` values (Premium/Story/Mirror/Journal/Map) aren't yet a named scale | §2 |
| 15 | `src/design-system/**` contains stale component references (`ArticleCard`, `CurrentJourneyCard`, `MilestoneCard`, `Mission30DayCard`) that don't exist in the codebase | Front matter |

None of these are fixed by this document — this is a freeze of what *is*, plus an honest list of what's known to be missing, exactly as the brief asked for.
