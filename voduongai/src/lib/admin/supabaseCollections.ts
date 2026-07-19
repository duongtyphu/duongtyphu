/**
 * Allowlist of admin collections backed by real Supabase tables (Phase 2 of the
 * localStorage → Supabase migration). Each entry maps the existing
 * `collectionKey` (used throughout the admin UI / CrudPage) to the actual
 * Postgres table name. Only keys in this map are ever queried — this is the
 * security boundary for the generic /api/admin/collections/[table] route, so
 * it must never be widened to include sensitive tables (orders, leads, members...).
 */
export const SUPABASE_COLLECTIONS: Record<string, string> = {
  // NOTE (Phase F.1 correction): earlier phases assumed Admin-authored prompts
  // were invisible on /portal/prompts because that page's `getLivePrompts()`
  // reads a different, empty table (`prompt_templates`). That assumption was
  // WRONG — the same page also renders <AdminPromptsSection>, which reads
  // this `prompts` table (via useCollection, service-role bypass of RLS) and
  // already displays Admin-authored Published prompts correctly for any
  // logged-in user. No code change made here — left as-is intentionally.
  prompts: "prompts",
  tools: "tools",
  templates: "templates",
  ebooks: "ebooks",
  checklists: "checklists",
  sop: "sop",
  resources: "resources",
  blog: "blog",
  // LEGACY (Phase F.2): no longer written to by any Admin UI. The Case Study
  // admin page (app/admin/(dashboard)/case-study/page.tsx) now writes
  // directly to the typed `case_studies` table via dedicated actions.ts,
  // matching what /portal/case-studies + the search index actually read.
  // Kept in the map (not removed) per "không xóa entry cũ nếu chưa chắc an toàn".
  "case-study": "case_study",
  news: "news",
  updates: "updates",
  community: "community",
  "student-success-stories": "student_success_stories",

  // Phase 3 — Portal Builder / Roadmap config collections
  "portal-banners": "portal_banners",
  "portal-cta": "portal_cta",
  "portal-featured": "portal_featured",
  "today-action-cards": "today_action_cards",
  "start-here-steps": "start_here_steps",
  "user-goals": "user_goals",
  "roadmap-steps": "roadmap_steps",
  "daily-missions": "daily_missions",
  "affiliate-hub-sections": "affiliate_hub_sections",
  "affiliate-hub-top-products": "affiliate_hub_top_products",

  // Phase 4 — Affiliate products/links, Digital Assets, Settings, Portal singletons
  "affiliate-products": "affiliate_products",
  "affiliate-links": "affiliate_links",
  "digital-asset-categories": "digital_asset_categories",
  "digital-asset-projects": "digital_asset_projects",
  "digital-asset-links": "digital_asset_links",
  "digital-asset-articles": "digital_asset_articles",
  "digital-asset-settings": "digital_asset_settings",
  settings: "settings",
  "portal-sections": "portal_sections",
  "portal-welcome": "portal_welcome",

  // Phase 5 — Services (was localStorage-only)
  services: "services",

  // Phase 6 — Admin rebuild: home_cards, projects, founder_profile
  "home-cards": "home_cards",
  projects: "projects",
  "founder-profile": "founder_profile",

  // Phase 7 — Companion Admin CMS (AI Mentor). companion_persona/
  // companion_conversation_strategy đã tồn tại từ trước (0 dòng, mồ côi —
  // xem CLAUDE.md), tái sử dụng lại đây. 9 bảng còn lại mới, tạo qua
  // supabase-phase7-companion-admin.sql (chưa apply, chờ Founder duyệt).
  "companion-persona": "companion_persona",
  "companion-conversation-strategy": "companion_conversation_strategy",
  "companion-conversation-examples": "companion_conversation_examples",
  "companion-knowledge-refs": "companion_knowledge_refs",
  "companion-memory-policy": "companion_memory_policy",
  "companion-coaching-strategy": "companion_coaching_strategy",
  "companion-training-scenarios": "companion_training_scenarios",
  "companion-capabilities": "companion_capabilities",
  "companion-safety-rules": "companion_safety_rules",
  "companion-test-sessions": "companion_test_sessions",
  "companion-versions": "companion_versions",
};

export function tableForCollection(key: string): string | null {
  return SUPABASE_COLLECTIONS[key] ?? null;
}
