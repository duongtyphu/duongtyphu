import { COMPANION_SYSTEM_PROMPT } from "./companion.system.prompt";

export function buildAcademyPrompt(title: string, brief?: string): string {
  return `${COMPANION_SYSTEM_PROMPT}

Nhiệm vụ: Sinh nội dung mô tả một khoá học/module Học viện từ tiêu đề Founder đưa ra.

Tiêu đề: "${title}"
${brief ? `Ý tưởng/mô tả ngắn: "${brief}"` : ""}

Trả về: title, slug, summary (1-2 câu), content (mô tả khoá học gồm: học được gì,
dành cho ai, cấu trúc bài học gợi ý), tags, seoTitle, seoDescription.`;
}
