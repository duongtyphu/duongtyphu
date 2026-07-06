# PORTAL 3.0 — P.2 Design System & Design Language

Status: **v1 — implemented, living document**
Scope: this is the design DNA for the whole VO DUONG AI AI Operating System — Portal today,
Admin/Companion/CKOS/Academy/Workspace tomorrow. Not a "make it prettier" pass.

---

## 1. Design Principles

1. **Calm before clever.** Every surface should feel quiet enough that Companion and content are
   what draw attention — not the chrome.
2. **One card language, everywhere.** A card looks and behaves the same whether it's a Tool, a
   Lesson, or a FAQ entry. Content changes; the frame does not.
3. **Tokens, not literals.** Any new component reaches for a token (`--radius-*`, `--shadow-token-*`,
   `--color-*`, `--motion-*`) before it reaches for a raw hex/px value.
4. **Freeze the shell, free the content.** `PortalShell`/`PortalHeader`/`PortalSidebar`/`PortalSearch`
   stay exactly as documented in `THE_PORTAL_ARCHITECTURE_FREEZE.md` — this phase does not touch
   them structurally, it only supplies the tokens/components that pages inside `{children}` should
   use consistently.
5. **Premium means restraint, not decoration.** Prefer whitespace, one accent color per screen,
   and a single hover/lift motion pattern over gradients-on-gradients.

---

## 2. Color System

Source of truth: `src/app/globals.css`, `@theme` block. Tailwind v4 CSS-first config — no
`tailwind.config.*` file; every `--color-*` token auto-generates matching `bg-*`/`text-*`/`border-*`
utilities.

### Brand
| Token | Hex | Usage |
|---|---|---|
| `brand-blue` | `#2563EB` | Primary actions, links, active states |
| `brand-blue-dark` / `brand-navy-soft` | `#0B1F4D` | Deep accents |
| `brand-violet` | `#5B8CFF` | Secondary accent (gradients w/ blue) |
| `brand-orange` | `#FF7A00` | Rare accent (brand mark only — see §9 Do/Don't on logo hex drift) |
| `brand-navy` | `#06142D` | Dark surfaces (Companion/Sanctuary theme) |
| `brand-purple` | `#8B5CF6`, `brand-cyan` `#22D3EE` | Gradient pairs for premium/featured moments |

### GemOS system (used by cards/badges/progress across the whole Portal)
`gemos-navy/midnight/sapphire` (dark surfaces), `gemos-ai-blue`/`gemos-gem-cyan`/`gemos-vision-purple`/
`gemos-soft-violet` (accent gradients), `gemos-gold` (celebratory/Gem moments only),
`gemos-success`/`gemos-warning`/`gemos-danger` (status), `gemos-text-primary/secondary/muted/disabled`
(text hierarchy on dark surfaces).

### Neutral scale
`brand-gray-50/100/200/400/500/700` — the light-surface neutral ramp. **Gap**: no `brand-gray-300/600/800/900`
steps exist yet; pages currently fall back to raw Tailwind `gray-900`/`gray-600` etc. for body text.
Documented as debt (§10) rather than invented here, since guessing intermediate stops without a
real usage need would be exactly the "tuỳ tiện" (arbitrary) pattern this phase forbids.

### Accessibility fix shipped in P.2
`GemBadge`'s three tones (`free`/`premium`/`locked`) previously used light text
(`#6ee7b7`/`#e9d5ff`/`#94a3b8`) that was designed for a dark surface, but every badge in the app
renders inside `.gemos-gem-card` (white background) — contrast ratio was **~1.5–2.5:1**, failing
WCAG AA (4.5:1 minimum for text). Fixed to `#047857`/`#6d28d9`/`#475569` — all now **≥5.6:1** on
white. See `src/app/globals.css`, `.gemos-badge-free/-premium/-locked`.

---

## 3. Typography

- Font: `Plus Jakarta Sans` (`next/font/google`, subsets `latin`+`vietnamese`, weights 400–800),
  wired as `--font-sans` in `@theme`. No other font in the codebase — keep it that way.
- **Gap found**: no shared heading scale component. 67 occurrences of hand-written
  `text-2xl font-bold`/`text-2xl font-extrabold`/`text-xl font-bold` across `src/app/portal/**`,
  each page picking its own weight/size for what is conceptually the same "page H1" or "section H2."
  `PageHeader.tsx` exists for page-level H1 but is only adopted by 1 of 3 sampled pages.
- **Shipped in P.2**: `SectionHeader` (`src/components/portal/ui/SectionHeader.tsx`) — standardizes
  the section-level H2 (`eyebrow` + `title` + optional `description`/`action`), used to replace 3
  hand-written `<h2 className="mb-4 text-xl font-bold text-gray-900">` occurrences in
  `premium/page.tsx` as the reference implementation.
- **Recommended scale** (not yet enforced repo-wide — apply as pages are touched in P.3–P.9):
  - Page H1: `text-2xl font-extrabold text-gray-900` (via `PageHeader`)
  - Section H2: `text-xl font-bold text-gray-900` (via `SectionHeader`)
  - Card title: `text-sm font-bold text-gray-900` + `.gemos-card-title` (hover→brand-blue)
  - Body: `text-sm text-gray-600`, muted: `text-sm text-gray-500`

---

## 4. Spacing, Radius, Shadow, Motion, Focus (new tokens, P.2)

Added to `src/app/globals.css` `@theme` — Tailwind v4 auto-generates the matching utility class
from each token name (`--radius-xl` → `rounded-xl`, `--shadow-token-sm` → `shadow-token-sm`).

```css
--radius-xs:   6px;   /* tooltips, tiny chips */
--radius-sm:   8px;   /* inputs, small buttons */
--radius-md:  12px;   /* icon tiles, nav items */
--radius-lg:  16px;   /* FAQ/simple content cards */
--radius-xl:  24px;   /* legacy alias, matches existing .gemos-gem-card */
--radius-2xl: 28px;   /* .gemos-gem-card canonical radius (was hardcoded 24px) */

--shadow-token-xs:    0 1px 2px rgba(15,23,42,0.05);
--shadow-token-sm:    0 1px 4px rgba(15,23,42,0.07);   /* card resting state */
--shadow-token-md:    0 8px 24px -8px rgba(15,23,42,0.14);
--shadow-token-lg:    0 12px 28px -10px rgba(37,99,235,0.22); /* card hover state */
--shadow-token-focus: 0 0 0 3px rgba(37,99,235,0.35);

--motion-fast: 150ms;  --motion-base: 250ms;  --motion-slow: 400ms;
--motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
```

Spacing scale: **no new token** — Tailwind's default 4px-based scale (`p-4`, `gap-6`, etc.) is
already used consistently across the audited pages and needs no override; inventing a parallel
spacing scale would violate principle #3 (tokens for things that actually vary, not busywork).

`.gemos-gem-card`/`.gemos-glass-card` now reference `var(--radius-2xl)`, `var(--shadow-token-sm)`,
`var(--shadow-token-lg)`, and `var(--motion-base)`/`var(--motion-ease)` instead of the previous
hardcoded `24px`/`0 1px 4px rgba(0,0,0,0.07)`/`0.25s ease` literals — same visual result, now backed
by tokens so a future palette/elevation change is a one-line edit.

### Focus states (Accessibility, mandatory)
```css
:focus-visible {
  outline: 2px solid var(--color-brand-blue, #2563eb);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}
```
Applies globally via `:focus-visible` (keyboard-only, no mouse-click ring flash) — every button,
link, and form control in the Portal now gets a visible, on-brand focus ring with no per-component
opt-in required.

---

## 5. AI Operating System Visual Language

- **Surfaces**: white cards (`.gemos-gem-card`) on a light `--background: #F8FAFC` page for content
  areas; dark `gemos-navy`/`gemos-midnight` surfaces reserved for the Companion/Sanctuary experience
  specifically — these are two intentionally different registers (calm-light for "doing," warm-dark
  for "reflecting with Companion"), not an inconsistency to merge.
- **Motion**: one hover pattern for all cards — `translateY(-5px)` + shadow step up + border
  lightens, `250ms` ease. No per-page bespoke hover effects (`hover:-translate-y-1 hover:shadow-md`
  duplicated inline) — consolidated into the shared CSS class (§7).
- **Gradients**: reserved for exactly two roles — primary CTA buttons (`.gemos-btn-primary`,
  blue→violet) and celebratory/featured moments (`gemos-card-featured`/`gemos-card-success` glow
  rings). Never used as a full-section background outside those two roles.
- **Icons**: `lucide-react` exclusively for UI chrome icons — no new icon library. Raw inline SVG
  is reserved for the brand mark only (see §9 for a drift issue found there).
- Avoided per the mandate: no neon, no cyberpunk, no per-page one-off color combos — every color
  used in a component must trace back to a token in §2.

---

## 6. Component Guidelines

### Already standardized, in active use (kept, not rebuilt)
| Component | File | Notes |
|---|---|---|
| `Button` | `ui/Button.tsx` | variants `primary/secondary/icon` + **new in P.2**: `inverse`/`inverse-ghost` for CTAs on gradient/dark surfaces (replaces one-off `rounded-full bg-white ... text-blue-700` literals — see §7) |
| `GemCard` / `GlassCard` | `ui/GemCard.tsx`, `ui/GlassCard.tsx` | variants `default/featured/progress/action/locked/success` |
| `GemBadge` | `ui/GemBadge.tsx` | tones `free/premium/locked` — contrast fixed in P.2 |
| `PageHeader` | `ui/PageHeader.tsx` | page-level H1, tone `blue/violet/orange/green` |
| `EmptyState` / `LoadingState` | `ui/EmptyState.tsx`, `ui/LoadingState.tsx` | already generic/reusable — no change needed |
| `PortalSearch` | `PortalSearch.tsx` | two themes (`companionTheme` prop) — kept, documented as an intentional light/dark split, not global dark-mode |

### New in P.2
| Component | File | Fills the gap |
|---|---|---|
| `SectionHeader` | `ui/SectionHeader.tsx` | content-section H2 — every page was hand-writing this |
| `Button` `inverse`/`inverse-ghost` | `ui/Button.tsx` | white-on-gradient CTA, previously copy-pasted per page |

### Content-type cards (CKOS/Knowledge/Lesson/Workflow/Project/Progress/Timeline)
**Decision: these are `GemCard` compositions, not new components**, per principle #2 (one card
language). A "Lesson card" is `GemCard` + an icon tile + title + meta row; a "Workflow card" is the
same shell with a step-count badge. Building a separate `LessonCard`/`WorkflowCard`/`ProjectCard`
component per content type today — before P.4–P.6 define what data each actually renders — would be
exactly the "component chung chung không phản ánh bản sắc" anti-pattern (generic components not
reflecting real content) the brief warns against, just inverted (over-specific components with no
real content yet). **P.4 CKOS Experience** is the right phase to add typed wrapper components
(`CkosObjectCard`, etc.) once the CKOS UI is actually being built against real API data.

### Not present / explicit gaps (not built in P.2 — no current usage to design against)
- **Tabs, Select** — zero usage found anywhere in the Portal today. Not built speculatively.
- **Modal/Drawer** — `CheckoutModal.tsx` exists but is a misnomer (it's a plain checkout `Link`,
  not a modal). No real modal/drawer pattern exists in Portal (Admin has its own `Modal.tsx`,
  out of scope — P.2 explicitly excludes new Admin work). Build when a P.3–P.9 phase needs one.
- **Dashboard widget** — Gem Home (`portal/page.tsx`) already composes ~10 purpose-built widget
  components (`TodayMissionCard`, `NextBestActionCard`, etc.) — these already are the "dashboard
  widget" pattern; no generic wrapper needed on top.

---

## 7. Refactors shipped in P.2 (proof of the system, not a full rewrite)

Representative duplication found in the UI audit was fixed at the source in 3 pages, to validate
the tokens/components work in production markup (not just in isolation):

- `src/app/portal/premium/page.tsx`: 2× `"gemos-gem-card rounded-2xl p-5"` (redundant radius
  re-declaration) → `<GemCard>`; 1× hand-rolled FAQ card (`rounded-2xl border border-gray-100
  bg-white p-5 shadow-sm`) → `<GemCard>`; 2× one-off CTA button literals → `<Button variant="inverse"
  | "inverse-ghost">`; 3× hand-written section `<h2>` → `<SectionHeader>`.
- `src/app/portal/hocvienai/page.tsx`: tool-grid card (`rounded-2xl border ... hover:-translate-y-1
  hover:shadow-md`, a bespoke reimplementation of the card hover system) → shared `.gemos-gem-card`
  class; FAQ card (`rounded-xl border ... p-4`, a **third** distinct radius/padding recipe for the
  same "FAQ card" role as Premium's) → `<GemCard>`.
- `src/app/portal/prompts/page.tsx`: **real bug fixed** — `bg-white/[0.04]` on a light-theme page
  made the "Prompt mới" cards nearly invisible (near-white-on-white; the class was almost certainly
  copied from a dark-theme card recipe without checking the surface it landed on) → `<GemCard>`.

Before this pass there were **4 distinct hand-rolled "content card" recipes** doing the same job
across just these 3 pages (`GemCard`/`.gemos-gem-card` proper, `rounded-2xl border-gray-100
bg-white p-5 shadow-sm`, `rounded-xl border-gray-100 bg-white p-4 shadow-sm`, `card-shine` +
`bg-white/[0.04]`). All 3 pages now use one.

All changes verified: `tsc --noEmit` clean, `eslint` clean on every touched file, dev server boots
with no runtime errors (pages correctly 307-redirect to `/login` per the existing auth gate —
consistent with all other Portal routes, confirming no regression in the route itself).

---

## 8. Responsive System

- Breakpoint in use across `PortalShell`/`PortalHeader`/`PortalSidebar`: `md:` (desktop chrome
  switch) is dominant; `lg:` only appears in content-page grids, not shell chrome — correct
  separation (shell breakpoints are a fixed contract, content grids can use whatever breakpoints
  fit their content).
- Mobile sidebar is **not** a shrunk desktop sidebar — `PortalShell` renders a real slide-in drawer
  (`fixed inset-0 z-50 md:hidden`, closes on Escape + route change) sharing `PortalSidebar` via a
  `variant="mobile"` prop, so nav item markup isn't duplicated but the container chrome is
  purpose-built for touch (full-height panel + backdrop, not a squeezed rail).
- **No change made to shell responsive behavior in P.2** — it already satisfies "not a scaled-down
  desktop" per the audit; flagged as a pass, not a gap.
- Content-page responsive grids (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, etc.) are already
  used consistently across the sampled pages — no systemic gap found.

---

## 9. Accessibility Rules

1. **Contrast**: every text/background pairing must hit **≥4.5:1** for body text, **≥3:1** for
   large text (≥24px or ≥19px bold). §2 documents the badge-contrast fix; audit any future tinted-
   badge/label combo against this before shipping.
2. **Focus**: `:focus-visible` global ring (§4) — do not add `outline: none` anywhere without
   supplying an equivalent visible replacement.
3. **Semantic HTML**: buttons that navigate must be `<a>`/`Link` (as `Button`'s `href` prop already
   does); buttons that act must be `<button type="button">` (as `Button` already does) — do not use
   `<div onClick>` for interactive elements.
4. **Keyboard**: mobile drawer already closes on `Escape` (verified in `PortalShell`) — carry this
   pattern into any future modal/drawer built in later phases.
5. **Text size floor**: no text below `text-xs` (12px equivalent) for body/label content anywhere
   in the audited pages — keep this floor going forward.
6. **Known drift, not fixed in P.2**: `PortalHeader.tsx` and `PortalSidebar.tsx` each inline their
   own copy of the brand SVG mark, using `#FF7A00` for the accent circle — the CLAUDE.md-mandated
   logo markup for **new** pages specifies `#F97316`. Per CLAUDE.md, existing pages are exempt from
   the mandatory-logo rule unless explicitly requested — **not changed here**, since `PortalHeader`/
   `PortalSidebar` are explicitly frozen shell files (§II of the Freeze doc) and touching them is
   out of P.2's "don't break the shell if it's working" boundary. Logged as debt for a future,
   explicitly-scoped brand-consistency pass.

---

## 10. Do & Don't

**Do**
- Reach for `GemCard`/`Button`/`GemBadge`/`SectionHeader`/`PageHeader`/`EmptyState`/`LoadingState`
  before writing new markup for a card/button/badge/heading/empty/loading state.
- Use `--radius-*`/`--shadow-token-*`/`--motion-*` tokens in any new CSS.
- Keep dark-surface (Companion/Sanctuary) and light-surface (everything else) as two intentional
  registers — don't try to force one dark-mode toggle across both; they serve different moments.

**Don't**
- Don't invent a 5th card recipe. If `GemCard`'s variants don't fit, extend `GemCard`, don't
  hand-roll `rounded-2xl border ... shadow-sm` again.
- Don't reuse a class string copied from a dark-themed component on a light page without checking
  actual contrast (`bg-white/[0.04]` bug, §7).
- Don't add a new icon library. Don't add a new font. Don't add a new spacing scale.
- Don't touch `PortalShell`/`PortalHeader`/`PortalSidebar`/`PortalSearch` structurally — only content
  inside `{children}` changes in this phase.

---

## 11. Technical Notes

- Tailwind v4, CSS-first (`@theme` in `src/app/globals.css`) — there is no `tailwind.config.*` to
  edit; all token work happens in this one CSS file.
- `--radius-*`/`--shadow-token-*` tokens auto-generate Tailwind utilities by name — this is why the
  P.2 tokens are named `--shadow-token-*` rather than `--shadow-*`: Tailwind v4 already defines a
  default `--shadow-sm`/`--shadow-md`/etc. ramp, and overriding those directly would change every
  existing untouched `shadow-sm` usage in the codebase — an unintended, unscoped side effect. Using
  a distinct `-token` suffix keeps this additive and safe.
- No `tailwind.config.*`, no new npm dependency, no Supabase schema change, no new Admin page — all
  within the stated P.2 limits.

---

## 12. Remaining Debt (explicit, for P.3+ to pick up)

1. Neutral gray ramp (`brand-gray-300/600/800/900`) not yet tokenized — pages still fall back to
   raw Tailwind `gray-*` for body text. Low risk (Tailwind's own gray scale is already consistent),
   but worth tokenizing once a real cross-page audit of body-text colors is done.
2. Only 3 of ~40+ content pages were refactored onto the shared card/button/heading components in
   P.2 (chosen as representative proof, not exhaustive). Remaining pages still contain one-off
   card/heading markup — the pattern to fix them is now established and low-effort per page; sweep
   during P.3–P.9 as each pillar's pages are touched anyway, rather than a disconnected mass-refactor
   here.
3. Brand SVG mark hardcoded in 2 shell files with a hex value (`#FF7A00`) that drifted from the
   CLAUDE.md-mandated `#F97316` — not fixed here (shell files are frozen in P.2's scope); needs an
   explicit follow-up decision (update CLAUDE.md's mandated hex to match shipped shell, or update
   the shell to match CLAUDE.md — a Product Owner call, not a default-favor-one-side fix).
4. Tabs/Select/Modal/Drawer components intentionally not built — no current usage to design
   against. Build in whichever phase (P.4–P.9) first needs one, against real content.
5. `vdai-academy`/`hocvienai` duplicate Academy surface (flagged in P.1) still exists — P.2 was
   navigation/design-token scope only, the actual page consolidation is P.5's job.
