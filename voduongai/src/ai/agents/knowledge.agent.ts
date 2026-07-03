import "server-only";
import { callCompanionModel, extractJson } from "./companion.agent";
import { buildKnowledgeSeedPrompt } from "../prompts/knowledge.prompt";
import type { GeneratedKnowledgeSeed } from "../types/ai.types";

export async function generateKnowledgeSeedContent(
  title: string,
  brief?: string
): Promise<GeneratedKnowledgeSeed> {
  const raw = await callCompanionModel(buildKnowledgeSeedPrompt(title, brief));
  return extractJson<GeneratedKnowledgeSeed>(raw);
}
