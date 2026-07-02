/**
 * CKOS — EC-001: Knowledge Foundation
 * Public entry point cho module Knowledge. Mọi nơi khác trong app import
 * qua đây, không import trực tiếp từ types/data/services con.
 */

export * from "./types/knowledge.types";
export * from "./services/knowledge.service";
export { KNOWLEDGE_TYPE_LABELS, KNOWLEDGE_PERSONAS, KNOWLEDGE_GOALS } from "./utils/knowledge-labels";
