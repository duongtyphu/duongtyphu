import "server-only";

/**
 * Companion Studio™ — AI Service Layer (server-side dispatcher)
 * Điểm vào duy nhất cho mọi agent — route API gọi qua đây, KHÔNG gọi
 * agent trực tiếp từ nơi khác. Tự động fallback sang mock nếu chưa cấu
 * hình API key, để không bao giờ làm vỡ Admin.
 */

import { isAiConfigured } from "../agents/companion.agent";
import { generateKnowledgeSeedContent } from "../agents/knowledge.agent";
import { generateGenericContent, refineContent } from "../agents/content.agent";
import { generateAcademyContent } from "../agents/academy.agent";
import { generateProjectContent } from "../agents/project.agent";
import { generateCommunityContent } from "../agents/community.agent";
import { generatePremiumContent } from "../agents/premium.agent";
import { mockGenericContent, mockKnowledgeSeed, mockRefine } from "./companion-ai.mock";
import type {
  CompanionAgentKind,
  CompanionGenerateResult,
  CompanionQuickAction,
  GeneratedGenericContent,
  GeneratedKnowledgeSeed,
} from "../types/ai.types";

export const AI_NOT_CONFIGURED_MESSAGE =
  "Companion Studio chưa được kết nối AI API. Vui lòng cấu hình API key để sử dụng tính năng Companion viết giúp.";

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateKnowledgeSeed(
  title: string,
  brief?: string
): Promise<CompanionGenerateResult<GeneratedKnowledgeSeed>> {
  if (!isAiConfigured()) {
    return { ok: true, mocked: true, data: mockKnowledgeSeed(title, brief) };
  }
  try {
    const data = await generateKnowledgeSeedContent(title, brief);
    return { ok: true, mocked: false, data: { ...data, slug: data.slug || slugify(title) } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Companion viết giúp thất bại." };
  }
}

const GENERIC_AGENTS: Partial<
  Record<CompanionAgentKind, (title: string, brief?: string) => Promise<GeneratedGenericContent>>
> = {
  academy: generateAcademyContent,
  project: generateProjectContent,
  community: generateCommunityContent,
  premium: generatePremiumContent,
};

export async function generateContent(
  kind: CompanionAgentKind,
  title: string,
  brief?: string
): Promise<CompanionGenerateResult<GeneratedGenericContent>> {
  if (!isAiConfigured()) {
    return { ok: true, mocked: true, data: mockGenericContent(kind, title, brief) };
  }
  try {
    const agent = GENERIC_AGENTS[kind];
    const data = agent ? await agent(title, brief) : await generateGenericContent(kind, title, brief);
    return { ok: true, mocked: false, data: { ...data, slug: data.slug || slugify(title) } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Companion viết giúp thất bại." };
  }
}

export async function improveContent(
  kind: CompanionAgentKind,
  action: CompanionQuickAction,
  content: string
): Promise<CompanionGenerateResult<{ content: string; slug?: string; seoTitle?: string; seoDescription?: string }>> {
  if (!isAiConfigured()) {
    return { ok: true, mocked: true, data: mockRefine(action, content) };
  }
  try {
    const data = await refineContent(kind, action, content);
    return { ok: true, mocked: false, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Companion viết giúp thất bại." };
  }
}
