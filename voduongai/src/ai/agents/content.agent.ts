import "server-only";
import { callCompanionModel, extractJson } from "./companion.agent";
import { COMPANION_SYSTEM_PROMPT } from "../prompts/companion.system.prompt";
import type {
  CompanionAgentKind,
  CompanionQuickAction,
  GeneratedGenericContent,
} from "../types/ai.types";

const KIND_LABEL: Record<string, string> = {
  blog: "một bài viết Blog",
  faq: "một câu hỏi thường gặp (FAQ)",
  prompt: "một Prompt AI thực chiến",
  checklist: "một Checklist",
  template: "một Template",
  sop: "một SOP (quy trình chuẩn)",
  case_study: "một Case Study",
};

function buildGenericPrompt(kind: CompanionAgentKind, title: string, brief?: string): string {
  const label = KIND_LABEL[kind] ?? "một nội dung";
  return `${COMPANION_SYSTEM_PROMPT}

Nhiệm vụ: Viết ${label} từ tiêu đề Founder đưa ra.

Tiêu đề: "${title}"
${brief ? `Ý tưởng/mô tả ngắn: "${brief}"` : ""}

Trả về JSON với các trường: title, slug, summary (1-2 câu), content (nội dung
đầy đủ, có ví dụ/checklist/bước tiếp theo nếu phù hợp), tags (mảng string),
seoTitle, seoDescription.`;
}

export async function generateGenericContent(
  kind: CompanionAgentKind,
  title: string,
  brief?: string
): Promise<GeneratedGenericContent> {
  const raw = await callCompanionModel(buildGenericPrompt(kind, title, brief));
  return extractJson<GeneratedGenericContent>(raw);
}

const ACTION_INSTRUCTION: Record<CompanionQuickAction, string> = {
  rewrite: "Viết lại toàn bộ nội dung theo giọng văn Companion, giữ nguyên ý chính.",
  shorten: "Rút ngắn nội dung, giữ lại ý quan trọng nhất, súc tích hơn.",
  more_professional: "Viết lại theo giọng văn chuyên nghiệp hơn, vẫn giữ rõ ràng dễ hiểu.",
  add_example: "Thêm 1 ví dụ cụ thể minh hoạ cho nội dung này.",
  add_checklist: "Thêm 1 checklist ngắn (3-5 bước) phù hợp với nội dung này.",
  add_prompt: "Thêm 1 prompt AI mẫu người đọc có thể copy dùng ngay, phù hợp với nội dung này.",
  add_reflection: "Thêm 1 câu hỏi phản tư (reflection question) ở cuối nội dung.",
  generate_seo: "Chỉ trả về seoTitle và seoDescription phù hợp với nội dung này.",
  generate_slug: "Chỉ trả về một slug (kebab-case, không dấu) phù hợp với nội dung này.",
};

export async function refineContent(
  kind: CompanionAgentKind,
  action: CompanionQuickAction,
  content: string
): Promise<{ content: string; slug?: string; seoTitle?: string; seoDescription?: string }> {
  const prompt = `${COMPANION_SYSTEM_PROMPT}

Nội dung hiện tại:
"""
${content}
"""

Yêu cầu: ${ACTION_INSTRUCTION[action]}

Trả về JSON: { "content": "...", "slug"?: "...", "seoTitle"?: "...", "seoDescription"?: "..." }.
Nếu yêu cầu chỉ liên quan slug/SEO, vẫn trả về "content" giữ nguyên như cũ.`;
  const raw = await callCompanionModel(prompt);
  return extractJson(raw);
}
