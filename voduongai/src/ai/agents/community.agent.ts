import "server-only";
import { callCompanionModel, extractJson } from "./companion.agent";
import { buildCommunityPrompt } from "../prompts/community.prompt";
import type { GeneratedGenericContent } from "../types/ai.types";

export async function generateCommunityContent(
  title: string,
  brief?: string
): Promise<GeneratedGenericContent> {
  const raw = await callCompanionModel(buildCommunityPrompt(title, brief));
  return extractJson<GeneratedGenericContent>(raw);
}
