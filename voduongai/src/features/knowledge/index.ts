/**
 * CKOS — EC-001: Knowledge Foundation
 * Public entry point cho module Knowledge. Mọi nơi khác trong app import
 * qua đây, không import trực tiếp từ types/data/services con.
 */

export * from "./types/knowledge.types";
export * from "./services/knowledge.service";
export { KNOWLEDGE_TYPE_LABELS, KNOWLEDGE_PERSONAS, KNOWLEDGE_GOALS } from "./utils/knowledge-labels";

// Sprint 02 — The Knowledge Journey™
export * from "./types/knowledge-seed.types";
export * from "./services/knowledge-seed.service";
export { DISCOVERY_GOALS, DISCOVERY_GOAL_TO_SEED_GOAL } from "./data/discovery-goals";
export { useSeedProgress } from "./utils/use-seed-progress";
