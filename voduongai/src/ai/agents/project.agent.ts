import "server-only";
import { callCompanionModel, extractJson } from "./companion.agent";
import { buildProjectPrompt } from "../prompts/project.prompt";
import type { GeneratedGenericContent } from "../types/ai.types";

export async function generateProjectContent(
  title: string,
  brief?: string
): Promise<GeneratedGenericContent> {
  const raw = await callCompanionModel(buildProjectPrompt(title, brief));
  return extractJson<GeneratedGenericContent>(raw);
}
