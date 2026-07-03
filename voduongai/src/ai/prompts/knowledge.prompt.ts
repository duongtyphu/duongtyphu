/**
 * Companion Studio™ — Prompt cho Knowledge Seed.
 * Bắt buộc tuân thủ Companion Content Standard đầy đủ.
 */

import { COMPANION_SYSTEM_PROMPT } from "./companion.system.prompt";

export function buildKnowledgeSeedPrompt(title: string, brief?: string): string {
  return `${COMPANION_SYSTEM_PROMPT}

Nhiệm vụ: Sinh một Knowledge Seed hoàn chỉnh (Golden Seed) từ tiêu đề Founder đưa ra.

Tiêu đề: "${title}"
${brief ? `Ý tưởng/mô tả ngắn của Founder: "${brief}"` : ""}

Trả về đầy đủ theo Companion Content Standard, gồm các phần:
1. Mục tiêu (goal) — 1-2 mục tiêu ngắn gọn.
2. Dành cho ai (persona).
3. Vấn đề (problem) — vấn đề thực tế người đọc đang gặp.
4. Ý tưởng cốt lõi (coreIdea).
5. Quy trình (process) — các bước thực hiện.
6. Prompt mẫu (samplePrompt) — 1 prompt AI cụ thể có thể copy dùng ngay.
7. Ví dụ trước/sau (beforeAfterExample).
8. Sai lầm thường gặp (commonMistakes) — danh sách.
9. Checklist — danh sách các bước kiểm tra.
10. Case Study — 1 ví dụ thực tế ngắn.
11. Exercise — 1 bài tập áp dụng ngay.
12. Reflection — ít nhất 1 câu hỏi phản tư.
13. Companion Note — 1 câu gợi ý ngắn, giọng đồng hành.
14. Next Step — bước tiếp theo cụ thể.
15. Slug, Tags, Difficulty (BEGINNER/INTERMEDIATE/ADVANCED), Estimated time.

Founder không cần tự nhập các trường này — Companion sinh toàn bộ.`;
}
