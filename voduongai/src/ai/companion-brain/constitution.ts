/**
 * EPIC-A01 — Companion Brain Foundation — A02: Companion Constitution.
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
