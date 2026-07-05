import "server-only";

/**
 * Danh sách capability id mà mọi Provider tổng quát (LLM text-generation)
 * được xem là hỗ trợ ở mức MVP — tránh lặp lại cùng 1 mảng ở 10 Adapter.
 * Provider chuyên biệt (vd Ollama chỉ chạy local, Perplexity thiên
 * research) vẫn dùng đúng danh sách này ở Wave 1 vì tất cả đều là model
 * sinh văn bản tổng quát — khác biệt thật sự nằm ở `tier`/`providerType`,
 * không phải ở tập capability hỗ trợ.
 */
export const ALL_TEXT_CAPABILITIES: string[] = [
  "writing.draft",
  "writing.review",
  "writing.edit",
  "writing.copywriting",
  "writing.seo",
  "coding.general",
  "research.market-analysis",
  "research.knowledge-synthesis",
  "research.fact-checking",
  "research.trend-scouting",
  "strategy.planning",
  "qa.review",
  "office.spreadsheet",
  "office.dashboard",
  "business.sales",
  "business.finance",
  "design.visual",
  "automation.workflow",
  "growth.goal-coaching",
  "growth.reflection-coaching",
  "growth.learning-coaching",
  // Sprint 002 — Wave 3 Companion capability (Workforce hoàn chỉnh 30/30):
  "research.customer-insight",
  "writing.translation",
  "business.partnership",
  "design.presentation",
  "design.video-script",
  "design.brand-consistency",
  "automation.integration",
  "office.document",
  "office.presentation",
  "office.report",
];
