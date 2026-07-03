import "server-only";
import { callCompanionModel, extractJson } from "./companion.agent";
import { buildPremiumPrompt } from "../prompts/premium.prompt";
import type { GeneratedGenericContent } from "../types/ai.types";

export async function generatePremiumContent(
  title: string,
  brief?: string
): Promise<GeneratedGenericContent> {
  const raw = await callCompanionModel(buildPremiumPrompt(title, brief));
  return extractJson<GeneratedGenericContent>(raw);
}
