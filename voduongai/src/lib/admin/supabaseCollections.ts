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
  // CANONICAL (STABILIZATION-SPR-1101 Task 1, corrects a stale Phase F.2
  // comment that wrongly claimed a dedicated actions.ts writes to the typed
  // `case_studies` table — no such file ever existed). The Case Study admin
  // page still writes here via this generic collection route, and
  // /portal/case-studies + /portal/congdongai + the search index now all
  // read this SAME table (filter status="Published") — one Case Study
  // source, not two. The old typed `case_studies` table is legacy/unread.
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

  // Phase 6 (PROJECTS-SPR-602) — Ecosystem CMS thật cho /portal/duan-cohoi
  // (Canonical Product theo Founder Directive), thay thế hoàn toàn model
  // digital_asset_projects/digital_asset_links cũ (Consumer = 0 trên Portal
  // thật). Chạy supabase-projects-opportunities-migration.sql trước khi
  // merge/deploy — nếu chưa chạy, /portal/duan-cohoi sẽ hiển thị rỗng.
  ecosystems: "ecosystems",

  // Phase 7 (IMP-PRODUCTION-HARDENING-1201) — sửa lỗi: 2 collection này đã
  // có UI ghi thật (useCollection) từ WEB-SPR-201/MEDIA-SPR-201 nhưng chưa
  // từng được đăng ký ở đây → mọi lần Founder lưu chỉ ghi vào localStorage
  // trình duyệt hiện tại (mất khi đổi máy/xoá cache, không đồng bộ giữa
  // các phiên Admin). Chạy supabase-production-hardening-collections-
  // migration.sql trước khi merge/deploy. Hiện chưa có Portal Consumer nào
  // đọc 2 bảng này (xác nhận qua audit) — đây thuần là sửa lỗi mất dữ liệu
  // phía Admin, không phải tính năng mới.
  "website-global-settings": "website_global_settings",
  "media-assets": "media_assets",
};

export function tableForCollection(key: string): string | null {
  return SUPABASE_COLLECTIONS[key] ?? null;
}
