import { COMPANION_SYSTEM_PROMPT } from "./companion.system.prompt";

export function buildProjectPrompt(title: string, brief?: string): string {
  return `${COMPANION_SYSTEM_PROMPT}

Nhiệm vụ: Sinh nội dung mô tả một Dự án/Cơ hội từ tiêu đề Founder đưa ra.

Tiêu đề: "${title}"
${brief ? `Ý tưởng/mô tả ngắn: "${brief}"` : ""}

Trả về: title, slug, summary (1-2 câu, không FOMO/phóng đại), content (mô tả cơ hội,
ai phù hợp tham gia, việc cần làm cụ thể), tags, seoTitle, seoDescription.`;
}
