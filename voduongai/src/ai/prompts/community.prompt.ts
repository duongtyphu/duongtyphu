import { COMPANION_SYSTEM_PROMPT } from "./companion.system.prompt";

export function buildCommunityPrompt(title: string, brief?: string): string {
  return `${COMPANION_SYSTEM_PROMPT}

Nhiệm vụ: Sinh nội dung một bài đăng Cộng đồng từ tiêu đề Founder đưa ra.

Tiêu đề: "${title}"
${brief ? `Ý tưởng/mô tả ngắn: "${brief}"` : ""}

Trả về: title, slug, summary, content (giọng văn gần gũi, khơi gợi thảo luận,
không phóng đại), tags, seoTitle, seoDescription.`;
}
