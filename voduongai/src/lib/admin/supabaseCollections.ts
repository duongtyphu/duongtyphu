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
  // LEGACY (Phase F.2): singular `case_study` (jsonb) — no longer written to
  // by any Admin UI. NOT the same table as the typed, plural `case_studies`
  // that /portal/case-studies actually reads (that one has its own dedicated
  // Server Actions at /admin/ckos/case-studies/actions.ts, not this generic
  // route — see CLAUDE.md "Case Study"). The admin page this comment used to
  // reference (app/admin/(dashboard)/case-study/page.tsx) was deleted in the
  // old-admin teardown and, per CLAUDE.md, never actually worked (it wrote to
  // columns that don't exist on the real table). Kept in the map (not
  // removed) per "không xóa entry cũ nếu chưa chắc an toàn".
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

  // Việc 3 — Lesson (CKOS Knowledge Seed), Giai đoạn 1. Bảng mới, tên
  // "knowledge_seeds" (không phải "lessons" — tên đó đã bị chiếm bởi bảng
  // id/title/video_url/pdf_url/price. Route Portal từng đọc bảng này
  // (/portal/vdai-academy) đã bị xoá theo yêu cầu Founder — bảng vẫn giữ
  // nguyên, mồ côi có chủ đích, xem CLAUDE.md). Khớp đúng tên type
  // KnowledgeSeed trong src/features/knowledge/types/knowledge-seed.types.ts.
  "knowledge-seeds": "knowledge_seeds",

  // Việc 4 — "Thư viện AI" (Knowledge Collection), gom nhóm Lesson theo bộ
  // sưu tập. Khớp tên type KnowledgeCollection trong
  // src/features/knowledge/types/knowledge-collection.types.ts.
  "knowledge-collections": "knowledge_collections",

  // Best Practice — bảng mới "best_practices" (đã kiểm tra không trùng tên
  // với bảng nào đang chạy, kể cả "ckos_best_practices" chưa tồn tại của
  // kiến trúc Phase G/H cũ chưa apply). Xem CLAUDE.md "Case Study" (mục
  // liên quan) cho lý do vì sao "case-studies" KHÔNG có trong map này —
  // bảng case_studies là typed, không phải schema generic này.
  "best-practices": "best_practices",

  // Việc 6 (Nhóm B) — "Sứ mệnh Companion", Phần 1. 6 bảng, mỗi bảng thay 1
  // mảng hardcode trong src/app/portal/su-menh-companion/page.tsx. Founder
  // xác nhận cần tự sửa (không phải brand manifesto cố định).
  "mission-items": "mission_items",
  "philosophy-pairs": "philosophy_pairs",
  constitution: "constitution",
  genome: "genome",
  evolution: "evolution",
  timeline: "timeline",

  // Việc 6 (Nhóm B), Phần 2 — 7 trang flipbook "Companion qua hình ảnh".
  // CHỈ quản title/thứ tự — `src` hiển thị đối chiếu, không sửa qua Admin
  // này (không có trong danh sách field chỉnh sửa của trang Admin).
  "companion-flipbook-pages": "companion_flipbook_pages",

  // Việc 9 — "Hành trình của tôi", cửa Mirror. CHỈ static chrome (title/
  // empty-state/footer/câu hỏi xoay vòng) — KHÔNG đụng `invitation` (dòng
  // mở Companion, tính động từ growthSignals thật) hay bất kỳ dữ liệu
  // reflections/memory_capsules/growth-view.ts nào khác.
  "mirror-chrome": "mirror_chrome",
  "mirror-questions": "mirror_questions",
  // Cửa 2 — Nhật ký học tập. KHÔNG đụng MODULE_LABEL/TODAY_PRIORITY (enum
  // map) hay dòng "{totalRawOutputs} kết quả thật..." (template nội suy
  // biến runtime) — cả 3 giữ nguyên trong code.
  "journal-chrome": "journal_chrome",
  "journal-intentions": "journal_intentions",
  // Cửa 3 — My Story. KHÔNG đụng JOURNEY_CHAPTER_NAMES (dùng chung 3 cửa)
  // hay KIND_LABEL (enum map MemoryCapsuleKind→label) — cả 2 giữ nguyên
  // trong code.
  "story-chrome": "story_chrome",
  // Cửa 4 — Bản đồ hành trình (RỦI RO CAO NHẤT). KHÔNG đụng
  // CHAPTER_DESTINATIONS (mảng không key, gắn chương bằng vị trí index —
  // kéo-thả/xoá qua CMS generic sẽ gán sai hoặc crash) hay
  // PORTAL_CONNECTIONS (field `module` là key tra cứu thật vào
  // getModuleActivitySummary(), không phải chỉ để hiển thị) — cả 2 giữ
  // nguyên 100% trong code, xem CLAUDE.md mục "Hành trình của tôi".
  "map-chrome": "map_chrome",
  // Cửa 5 — Khu vườn của bạn (cuối cùng). KHÔNG đụng companionLine/
  // treeStage/buildElements (template nội suy biến runtime + ngưỡng dữ
  // liệu thật) hay cặp CTA (nhãn+href cùng đổi theo gardenEmpty, giữ
  // nguyên cả khối trong code — nhất quán với nextDirection.text ở Cửa 4).
  "garden-chrome": "garden_chrome",
  // Việc 10 — /portal/hocvienai (khác src/data/portal/ai-workspace.ts vẫn
  // giữ LEARNING_PATHS/AI_RESOURCES, chưa migrate ở việc này).
  "work-needs": "work_needs",
  "hocvienai-faq": "hocvienai_faq",
  // Việc 11 — /portal/aiworkspace. `ai-workflow-sections` KHÁC bảng `sop`
  // (Workflow/SOP đầy đủ đã Full ở /admin/ckos/sop) — đã xác nhận qua
  // audit, 2 khái niệm khác nhau, không trùng id.
  "recommended-workspace": "recommended_workspace",
  "ai-workflow-sections": "ai_workflow_sections",
  // Nhóm 3, Phần D (mở rộng) — 5 trang chi tiết hệ sinh thái
  // (/portal/duan-cohoi/[ecosystemSlug]). CHỈ 2 field an toàn (name/
  // shortDescription) — id mỗi dòng = đúng `id` gốc trong ecosystems.ts
  // (eco_digiu/eco_solargroup/eco_crypto/eco_blockchain/eco_trading).
  // KHÔNG đụng highlights/whoFor/whoNotReady/expectedOutcome/fullIntro/
  // statusBadge hay marketingLinks/subProjects/fields/affiliateOffers/
  // exchanges/potentialAnalysis — vẫn đọc tĩnh từ ecosystems.ts.
  "ecosystem-chrome": "ecosystem_chrome",
  // Premium — Dashboard Live-edit. CHỈ chữ tĩnh an toàn (Hero/2 nhãn
  // section/4 bước thanh toán/FAQ) — KHÔNG đụng bảng `courses` (giá/trạng
  // thái mở bán, quản qua /admin/course-pricing riêng, giữ nguyên) hay
  // PREMIUM_PROGRAMS/PremiumAdvisor/PremiumConsult/FounderSpotlight (vẫn
  // tĩnh trong code).
  "premium-chrome": "premium_chrome",
  "premium-payment-steps": "premium_payment_steps",
  "premium-faq": "premium_faq",
};

export function tableForCollection(key: string): string | null {
  return SUPABASE_COLLECTIONS[key] ?? null;
}
