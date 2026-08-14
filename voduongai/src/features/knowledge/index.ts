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
export { useSeedProgress, getSeedCompletedStepIds, useCkosProgressReady } from "./utils/use-seed-progress";

// Knowledge Workspace Foundation — Collection System + Navigation + Bookmark + Reflection
export * from "./types/knowledge-collection.types";
export * from "./services/knowledge-collection.service";
export { useSeedBookmark, getSeedBookmarks, type BookmarkKind } from "./utils/use-seed-bookmark";
export { useSeedReflection } from "./utils/use-seed-reflection";

// Sprint 05 — Knowledge Intelligence™
export * from "./types/knowledge-taxonomy.types";
export * from "./data/knowledge-taxonomy";
export * from "./services/knowledge-graph.service";

// Sprint 06 — CKOS Intelligence Layer™
export * from "./services/recommendation-rules.service";
export * from "./quality/ckos-quality-guard";
