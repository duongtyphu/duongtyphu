/**
 * Companion Studio™ — Mock response, dùng khi chưa cấu hình API key để
 * Founder vẫn xem được luồng UI (Preview/Quick Actions) mà không vỡ Admin.
 */

import type {
  CompanionAgentKind,
  CompanionQuickAction,
  GeneratedGenericContent,
  GeneratedKnowledgeSeed,
} from "../types/ai.types";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mockGenericContent(
  kind: CompanionAgentKind,
  title: string,
  brief?: string
): GeneratedGenericContent {
  return {
    title,
    slug: slugify(title),
    summary: brief?.trim() || `Bản nháp tóm tắt cho "${title}" — Companion sẽ viết chi tiết khi có API key.`,
    content: `Đây là bản nháp mẫu (mock) cho "${title}" (${kind}).\n\nKhi Companion Studio được kết nối AI API thật, nội dung đầy đủ — có ví dụ, checklist và bước tiếp theo — sẽ hiển thị ở đây để bạn xem trước và chỉnh sửa.`,
    tags: [],
    seoTitle: title,
    seoDescription: brief?.trim() || `Tìm hiểu về ${title}.`,
  };
}

export function mockKnowledgeSeed(title: string, brief?: string): GeneratedKnowledgeSeed {
  return {
    title,
    slug: slugify(title),
    summary: brief?.trim() || `Bản nháp Knowledge Seed cho "${title}".`,
    goal: ["Áp dụng được ngay vào công việc"],
    persona: ["Nhân viên văn phòng"],
    problem: "(Companion sẽ mô tả vấn đề thực tế khi có API key)",
    coreIdea: "(Companion sẽ viết ý tưởng cốt lõi khi có API key)",
    process: "(Companion sẽ viết quy trình từng bước khi có API key)",
    samplePrompt: "(Companion sẽ tạo prompt mẫu khi có API key)",
    beforeAfterExample: "(Companion sẽ tạo ví dụ trước/sau khi có API key)",
    commonMistakes: ["(Companion sẽ liệt kê sai lầm thường gặp khi có API key)"],
    checklist: ["(Companion sẽ tạo checklist khi có API key)"],
    caseStudy: "(Companion sẽ viết case study khi có API key)",
    exercise: "(Companion sẽ tạo bài tập khi có API key)",
    reflectionQuestions: ["Bạn sẽ áp dụng điều này vào việc gì hôm nay?"],
    companionNote: "Đây là bản nháp mẫu — hãy cấu hình API key để Companion viết nội dung thật.",
    nextStep: "Cấu hình ANTHROPIC_API_KEY hoặc OPENAI_API_KEY để dùng Companion viết giúp.",
    tags: [],
    difficulty: "BEGINNER",
    estimatedTime: "20 phút",
  };
}

export function mockRefine(
  action: CompanionQuickAction,
  content: string
): { content: string; slug?: string; seoTitle?: string; seoDescription?: string } {
  if (action === "generate_slug") {
    return { content, slug: slugify(content.slice(0, 60)) };
  }
  if (action === "generate_seo") {
    return { content, seoTitle: content.slice(0, 60), seoDescription: content.slice(0, 150) };
  }
  return { content: `${content}\n\n(Bản nháp mock — cấu hình API key để Companion thực sự "${action}".)` };
}
