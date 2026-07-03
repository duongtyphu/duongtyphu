import "server-only";
import { callCompanionModel, extractJson } from "./companion.agent";
import { buildAcademyPrompt } from "../prompts/academy.prompt";
import type { GeneratedGenericContent } from "../types/ai.types";

export async function generateAcademyContent(
  title: string,
  brief?: string
): Promise<GeneratedGenericContent> {
  const raw = await callCompanionModel(buildAcademyPrompt(title, brief));
  return extractJson<GeneratedGenericContent>(raw);
}
