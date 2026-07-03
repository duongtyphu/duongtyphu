"use client";

/**
 * Companion Studio™ — Client-side wrapper. Gọi qua /api/ai/companion,
 * KHÔNG bao giờ gọi provider AI trực tiếp từ browser (không lộ API key).
 */

import type {
  CompanionAgentKind,
  CompanionGenerateResult,
  CompanionQuickAction,
  GeneratedGenericContent,
  GeneratedKnowledgeSeed,
} from "../types/ai.types";

async function post<T>(payload: Record<string, unknown>): Promise<CompanionGenerateResult<T>> {
  try {
    const res = await fetch("/api/ai/companion", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as CompanionGenerateResult<T>;
  } catch {
    return { ok: false, error: "Không thể kết nối Companion Studio. Vui lòng thử lại." };
  }
}

export function generateKnowledgeSeed(title: string, brief?: string) {
  return post<GeneratedKnowledgeSeed>({ kind: "knowledge", title, brief });
}

export function generateBlogPost(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "blog", title, brief });
}

export function generateCourse(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "academy", title, brief });
}

export function generateProject(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "project", title, brief });
}

export function generateCommunityPost(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "community", title, brief });
}

export function generatePremiumContent(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "premium", title, brief });
}

export function generateFAQ(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "faq", title, brief });
}

export function generatePrompt(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "prompt", title, brief });
}

export function generateChecklist(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "checklist", title, brief });
}

export function generateTemplate(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "template", title, brief });
}

export function generateSOP(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "sop", title, brief });
}

export function generateCaseStudy(title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind: "case_study", title, brief });
}

export function generateContent(kind: CompanionAgentKind, title: string, brief?: string) {
  return post<GeneratedGenericContent>({ kind, title, brief });
}

function refine(kind: CompanionAgentKind, action: CompanionQuickAction, content: string) {
  return post<{ content: string; slug?: string; seoTitle?: string; seoDescription?: string }>({
    mode: "refine",
    kind,
    action,
    content,
  });
}

export function improveContent(kind: CompanionAgentKind, content: string) {
  return refine(kind, "more_professional", content);
}

export function rewriteContent(kind: CompanionAgentKind, content: string) {
  return refine(kind, "rewrite", content);
}

export function generateSEO(kind: CompanionAgentKind, content: string) {
  return refine(kind, "generate_seo", content);
}

export function generateSlug(kind: CompanionAgentKind, content: string) {
  return refine(kind, "generate_slug", content);
}

export function runQuickAction(kind: CompanionAgentKind, action: CompanionQuickAction, content: string) {
  return refine(kind, action, content);
}
