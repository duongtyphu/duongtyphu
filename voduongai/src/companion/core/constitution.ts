/**
 * EPIC-A01 — Companion Core Foundation — A02: Companion Constitution.
 * (FIX EPIC-A01: thư mục đổi từ `src/ai/companion-brain/` sang
 * `src/companion/core/`, thuật ngữ "Companion Brain" đổi thành
 * "Companion Core" trong toàn bộ chú thích — schema giữ nguyên 100%.)
 *
 * THUẦN KIẾN TRÚC — chuẩn bị cấu trúc cho ~20-30 Điều (Article), KHÔNG
 * viết toàn bộ nội dung thật (đúng yêu cầu). Độc lập hoàn toàn khỏi
 * `src/ai/providers/**`, không kết nối AI, không đổi Prompt.
 *
 * Category là quyết định KIẾN TRÚC (nhóm phân loại điều khoản — tương tự
 * "Tier" ở Provider Manifest CS-03), không phải nội dung thương hiệu, nên
 * đặt tên nhóm chuẩn phổ quát cho 1 bản Hiến pháp AI (An toàn/Đạo đức/
 * Giới hạn hành động/Bảo mật/Chất lượng phản hồi/Leo thang). NỘI DUNG
 * từng điều khoản (title/content thật) vẫn để trung thực "Chưa biên
 * tập" — đó là quyết định của Founder/PMO, không tự soạn.
 *
 * DRAFT NOTICE (FIX EPIC-A01, mục 4) — ghi rõ lại, không suy diễn ngầm:
 * CẢ 2 phần dưới đây đều là DRAFT, chưa phải quyết định cuối cùng:
 *   1. TAXONOMY — 6 category (`ConstitutionCategory`) + số lượng điều/
 *      category (`ARTICLES_PER_CATEGORY = 4`) là đề xuất kiến trúc, CHƯA
 *      được Founder/PMO xác nhận là cấu trúc chính thức của Hiến pháp.
 *      Founder/PMO có thể đổi tên category, gộp/tách category, hoặc đổi
 *      số điều mỗi nhóm khi biên tập nội dung thật.
 *   2. NỘI DUNG — toàn bộ 24 điều trong `COMPANION_CONSTITUTION_DRAFT`
 *      (title lẫn `content`) chỉ là khung sườn placeholder
 *      ("chưa đặt tên" / "Chưa biên tập"), chờ Founder/PMO biên tập và
 *      phê duyệt (Draft → Published) trước khi xem là nội dung thật.
 */

export type ConstitutionStatus = "draft" | "published";

export type ConstitutionCategory =
  | "safety"
  | "ethics-honesty"
  | "action-boundaries"
  | "security-privacy"
  | "response-quality"
  | "escalation-handoff";

export type ConstitutionArticle = {
  id: string;
  category: ConstitutionCategory;
  title: string;
  content: string;
  priority: number;
  version: number;
  status: ConstitutionStatus;
};

export const CONSTITUTION_CATEGORY_LABEL: Record<ConstitutionCategory, string> = {
  safety: "An toàn",
  "ethics-honesty": "Đạo đức & Trung thực",
  "action-boundaries": "Giới hạn hành động",
  "security-privacy": "Bảo mật & Quyền riêng tư",
  "response-quality": "Chất lượng phản hồi",
  "escalation-handoff": "Leo thang & Chuyển tiếp",
};

const CATEGORIES: ConstitutionCategory[] = [
  "safety",
  "ethics-honesty",
  "action-boundaries",
  "security-privacy",
  "response-quality",
  "escalation-handoff",
];

/** 6 category x 4 điều = 24, nằm trong khoảng 20-30 điều đề bài yêu cầu. */
const ARTICLES_PER_CATEGORY = 4;

const NOT_CURATED = "Chưa biên tập — chờ Founder/PMO xác nhận nội dung thật.";

function buildStubArticles(): ConstitutionArticle[] {
  const articles: ConstitutionArticle[] = [];
  let priority = 1;
  for (const category of CATEGORIES) {
    for (let n = 1; n <= ARTICLES_PER_CATEGORY; n++) {
      articles.push({
        id: `art-${category}-${String(n).padStart(2, "0")}`,
        category,
        title: `Điều #${priority} — ${CONSTITUTION_CATEGORY_LABEL[category]} (chưa đặt tên)`,
        content: NOT_CURATED,
        priority,
        version: 1,
        status: "draft",
      });
      priority++;
    }
  }
  return articles;
}

/** Bản Draft 24 điều — khung sườn, KHÔNG phải nội dung Hiến pháp thật. */
export const COMPANION_CONSTITUTION_DRAFT: ConstitutionArticle[] = buildStubArticles();

export function listConstitutionArticles(): ConstitutionArticle[] {
  return COMPANION_CONSTITUTION_DRAFT;
}

export function listConstitutionCategories(): { id: ConstitutionCategory; label: string }[] {
  return CATEGORIES.map((id) => ({ id, label: CONSTITUTION_CATEGORY_LABEL[id] }));
}
