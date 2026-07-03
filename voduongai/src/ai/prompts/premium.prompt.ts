import { COMPANION_SYSTEM_PROMPT } from "./companion.system.prompt";

export function buildPremiumPrompt(title: string, brief?: string): string {
  return `${COMPANION_SYSTEM_PROMPT}

Nhiệm vụ: Sinh nội dung mô tả một hạng mục Premium từ tiêu đề Founder đưa ra.
Đây là nội dung trả phí — giá trị phải rõ ràng, cụ thể, KHÔNG phóng đại,
KHÔNG hứa hẹn kết quả quá mức.

Tiêu đề: "${title}"
${brief ? `Ý tưởng/mô tả ngắn: "${brief}"` : ""}

Trả về: title, slug, summary, content (giá trị cụ thể người dùng nhận được,
điều kiện phù hợp), tags, seoTitle, seoDescription.`;
}
