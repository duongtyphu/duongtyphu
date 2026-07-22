# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This repo contains **two parallel systems** for VO DUONG AI (formerly branded
"VDAI Academy" — rebrand in progress, see "Naming" below):

1. **Root — static marketing site.** Plain HTML/CSS/JS files (`index.html`,
   `blog/`, `docs/`, `v-solo/`, `v-scale/`, `login.html`, `portal.html`,
   `admin.html`, legal pages, etc.), deployed via `vercel.json`. No build
   step — these are hand-authored static files.
2. **`voduongai/` — the real app.** A Next.js 16 (App Router) + Supabase
   project: public marketing pages, an authenticated student Portal
   (`/portal/**`), an admin CMS (`/admin/**`), and an AI provider/agent
   layer. This is where the database, auth, checkout, and all CRUD content
   management actually live.

**Important architectural caveat (see `WEBSITE-OVERVIEW.md`):** the root
static pages (`login.html`, `register.html`, `portal.html`, `terms.html`,
`privacy.html`, `refund-policy.html`, `admin.html`) **duplicate** routes
that also exist in `voduongai/` (`/login`, `/terms`, `/privacy`,
`/refund-policy`, `/portal`, `/admin`). These are two independent
implementations of the same pages — if you edit legal or pricing content,
check whether both copies need updating to avoid the two versions drifting
apart. `voduongai/` is the system with the database and is treated as the
canonical/production app; the root static duplicates predate it.

Both systems share the same Supabase project (see `SUPABASE_MIGRATIONS.md`
and `voduongai/PRODUCTION_MIGRATION_RUNBOOK.md`).

## Commands

### Root (static site)

```bash
npm test          # = npm run test:links, runs tests/link-checker.js
npm run test:links
```

`tests/link-checker.js` crawls every `.html` file in the repo (skipping
`node_modules`, `.git`, `supabase`, `google-apps-script`, `docs`) and
validates nav/footer/logo/CTA/related-article/social/legal/auth links and
in-page anchors. No other build/lint step exists for the static site —
these are plain files served as-is.

### `voduongai/` (Next.js app)

Run all commands from inside `voduongai/`:

```bash
npm run dev              # next dev — local dev server
npm run build             # next build
npm run start             # next start — serve production build
npm run lint               # eslint
npm test                   # vitest run
npx vitest run path/to/file.test.ts          # run a single test file
npx vitest run -t "test name substring"      # run tests matching a name
```

Tests live alongside source in `__tests__/` directories (e.g.
`src/lib/portal/__tests__/`, `src/ai/providers/__tests__/`,
`src/companion/agents/__tests__/`). Vitest runs in a `jsdom` environment
(`voduongai/vitest.config.ts`) with the `@/*` → `src/*` path alias.

`voduongai/.env.example` documents required/optional env vars. With
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` unset, the
Portal runs public (no login) for local/demo use, but `/admin/**` still
hard-redirects to login (fail-closed — see `middleware.ts`). Checkout
confirmation requires `SEPAY_WEBHOOK_API_KEY`; the AI provider layer falls
back to `MockProviderAdapter` for any provider whose API key is unset.

## Architecture — `voduongai/` (the main app)

### Routing & auth

- App Router under `src/app/`. Public pages (`/`, `/about`, `/contact`,
  `/blog`, `/blogai`, `/login`, `/reset-password`, `/privacy`, `/terms`,
  `/refund-policy`), the authenticated Portal (`src/app/portal/**`, ~40
  feature areas), and the admin CMS (`src/app/admin/**`).
- `src/middleware.ts` gates `/portal/:path*`, `/login`, and `/admin/:path*`
  using Supabase session cookies + a `members.is_admin` check. The matcher
  list must stay in sync with `PROTECTED_ROUTE_PREFIXES` in
  `src/lib/protected-routes.ts` (Next.js requires the matcher to be a
  static literal, so it can't just import that constant).
- Middleware only protects page navigation. Route handlers under
  `src/app/api/admin/**` re-check admin access server-side via
  `requireAdmin()` / `requireMember()` in `src/lib/admin/requireAdmin.ts`.

### Admin CMS — generic collection store

Most admin-managed content (blog, prompts, tools, templates, ebooks,
checklists, SOP, resources, news, updates, community, portal-builder
config, affiliate products/links, digital assets, services, roadmap...) is
**not** modeled as individual Prisma-style entities. Instead
`src/lib/admin/supabaseCollections.ts` holds an **allowlist** mapping a
`collectionKey` (used by the admin UI / `CrudPage.tsx`) to a real Postgres
table name, and a single generic API route
(`src/app/api/admin/collections/[table]`) does the CRUD. This allowlist is
the security boundary — never add a sensitive table (`orders`, `leads`,
`members`) to it. A few areas (e.g. Case Study) have graduated to
dedicated typed tables + `actions.ts` files instead of the generic store;
check for a feature-specific implementation before assuming everything
goes through the generic collection API.

### AI layer

Two related-but-distinct subsystems:

- `src/ai/` — a **multi-provider adapter layer**
  (`src/ai/providers/*-provider-adapter.ts` for Anthropic, OpenAI, Gemini,
  DeepSeek, Grok, Mistral, Ollama, Perplexity, Cohere) routed through
  `provider-manager.ts` / `model-router.ts`, plus domain "agents"
  (`src/ai/agents/*.agent.ts`) and prompts (`src/ai/prompts/`) for
  academy/community/companion/content/knowledge/premium/project use cases.
  Missing API keys make a provider report "unavailable"; the manager falls
  back to `MockProviderAdapter` rather than failing.
- `src/companion/` — the "Companion" orchestration layer:
  `agents/companion-orchestrator.ts` + `agent-registry.ts` route requests
  to per-module agents, `unlock/` implements a progression/unlock-state
  engine for companion features, and `work-session/` models a companion
  work-session state machine.

### Design system

`src/design-system/` is numbered by concern (`01-foundation` →
`10-reference`) — foundation, colors, typography, spacing, icons, motion,
components, layout, patterns, reference — with its own `README.md`.
Prefer reusing tokens/components from here over inventing new ad hoc
styles in feature code.

### Data layer patterns

- `src/data/` holds typed static/seed data (blog, tools, prompts,
  resources, digital assets...) plus an `admin/` subfolder mirroring the
  admin-editable collections.
- `src/lib/supabase-server.ts` / `supabase-browser.ts` / `supabase.ts`
  provide server, browser, and shared Supabase clients respectively —
  route handlers and Server Components should use the server client.

## Database — Supabase

The schema is split across **two un-indexed folders of numbered/phased SQL
files** with no migration tool — this is a known pain point, and
`SUPABASE_MIGRATIONS.md` (root) is the authoritative index of what exists
and in what order to apply it from scratch:

1. Root-level `supabase-*.sql` files — core relational schema (members,
   orders, courses, lessons, products, referrals, leads, coupons,
   case_studies, support, prompt templates...).
2. `voduongai/supabase-*.sql` (including `supabase-phase2..5-*.sql` and the
   `supabase-phase-{c,d,e,f,g,h*}-*.sql` series) — Next.js app additions:
   generic CMS content tables, admin auth, order metadata, CKOS
   (structured knowledge/tools/prompts/workflows) tables, etc. Each phase
   generally has matching `-schema` / `-migrate` / `-verify` /
   `-rollback` files.

All migrations are written idempotent (`create table if not exists`,
`add column if not exists`, `drop policy if exists`) so re-running an
already-applied file is safe.

**`voduongai/PRODUCTION_MIGRATION_RUNBOOK.md` explicitly states Claude Code
does not have production Supabase credentials and must not run any
migration against production** — migrations there are verified via the
read-only anon key + code review, but a human with dashboard/service-role
access applies them. Use the Supabase MCP tools for read-only inspection
(`list_tables`, `get_advisors`, `get_logs`) and treat `apply_migration`
against this project's production data as something to confirm with the
user first, not a default action.

## Naming

The product has been rebranded from **"VDAI Academy"** to **"VO DUONG AI"**
(with **V-SOLO** / **V-SCALE** tracks, formerly VDAI SOLO/SCALE). Most
copy has been migrated; `BRAND_VOICE_GUIDE.md` still documents the old
"VDAI Academy" terminology glossary (Đúng/Sai naming table) — treat its
brand-voice/tone/writing-style guidance as current, but verify specific
product names against `WEBSITE-OVERVIEW.md` and existing pages before
reusing an old name. One intentional exception: order codes keep the
`VDAI<id>` technical format because it must match the SePay webhook
integration — this is an identifier, not display copy, and should not be
renamed.

---

# Quy ước cho project này

## Logo (bắt buộc cho trang mới)

Mọi trang HTML mới tạo từ nay phải dùng logo SVG đồng nhất với trang chủ
(`index.html`), KHÔNG dùng pattern chữ "VDAI Academy" / khối `nav-logo-mark`
kiểu cũ (chữ "V" trong ô vuông).

**Nav (header):**
```html
<a href="index.html" class="nav-logo" style="display:inline-flex;align-items:center;text-decoration:none">
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="display:inline-block;flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#F97316"/></svg><span style="display:inline-flex;flex-direction:column;line-height:1;margin-left:7px"><b style="font-size:15px;font-weight:800;color:#fff;letter-spacing:1.5px;font-family:Inter,system-ui,sans-serif">VDAI</b><small style="font-size:8px;font-weight:600;color:#94a3b8;letter-spacing:3px;font-family:Inter,system-ui,sans-serif">ACADEMY</small></span>
</a>
```

**Footer:**
```html
<a href="index.html" class="footer-brand-logo" style="display:inline-flex;align-items:center;text-decoration:none">
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style="display:inline-block;flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#F97316"/></svg><span style="display:inline-flex;flex-direction:column;line-height:1;margin-left:8px"><b style="font-size:18px;font-weight:800;color:#fff;letter-spacing:1.5px;font-family:Inter,system-ui,sans-serif">VDAI</b><small style="font-size:9px;font-weight:600;color:#94a3b8;letter-spacing:3px;font-family:Inter,system-ui,sans-serif">ACADEMY</small></span>
</a>
```

(Mobile drawer dùng cùng SVG, bọc trong `<div class="nav-logo" style="display:inline-flex;align-items:center">` thay vì `<a>`.)

Lưu ý: các trang tĩnh cũ (privacy.html, terms.html, refund-policy.html, thank-you.html, 404.html...)
vẫn còn dùng pattern cũ — chưa cần sửa lại trừ khi được yêu cầu riêng. Quy tắc này chỉ bắt buộc
áp dụng cho các trang MỚI tạo từ nay về sau.

## Internal linking cho bài viết Blog AI (bắt buộc cho bài viết mới)

Mỗi bài viết mới đăng ở trang Blog AI phải có liên kết (internal link) tới:

1. **Một bài nền tảng (pillar post)** — bài viết tổng quan/gốc của chủ đề đó.
2. **Hai hoặc ba bài cùng chủ đề** — các bài liên quan trong cùng cụm nội dung.
3. **Trang SOLO hoặc SCALE phù hợp** — trỏ về trang khoá học tương ứng với nội dung bài viết
   (VDAI SOLO cho nội dung vận hành một mình, VDAI SCALE cho nội dung mở rộng/đội nhóm).

Áp dụng cho mọi bài viết Blog AI tạo ra từ nay về sau.
