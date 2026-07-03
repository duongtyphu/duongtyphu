/**
 * CKOS Quality Guard™ (Sprint 06)
 * Biến CKOS Standard Library (docs/CKOS/) từ tài liệu thành rào chắn kỹ
 * thuật thật. Toàn bộ hàm ở đây thuần (không I/O), test bằng
 * `ckos-quality-guard.test.ts` chạy qua `npm test`.
 */

import { splitBeforeAfter } from "../utils/split-before-after";
import { SKILL_TAXONOMY, AI_TOOL_TAXONOMY, SCENARIO_TAXONOMY } from "../data/knowledge-taxonomy";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

export type QualityIssue = { field: string; message: string };

/** Cụm bị cấm trong Companion Note — CompanionNote_Standard.md. */
const BANNED_COMPANION_PHRASES = [
  "hành trình",
  "chinh phục",
  "phiên bản tốt nhất",
  "cùng nhau",
  "đỉnh cao",
];

/** Tiền tố Checklist mang tính lý thuyết, không phải hành động — Checklist_Standard.md. */
const THEORY_CHECKLIST_PATTERN = /^(Hiểu|Nắm được|Nắm rõ|Biết(?! rõ mình| ơn)|Học được)\b/i;

const MIN_PROMPTS = 5;
const REFLECTION_QUESTION_COUNT = 1;
const CHECKLIST_MIN = 3;
const CHECKLIST_MAX = 5;
const COMPANION_NOTE_MAX_WORDS = 40;

/** Rule 2 — mỗi Seed tối thiểu 5 Prompt thật. */
function checkPrompts(seed: KnowledgeSeed): QualityIssue[] {
  if (seed.prompts.length < MIN_PROMPTS) {
    return [{ field: "prompts", message: `Cần tối thiểu ${MIN_PROMPTS} prompt, hiện có ${seed.prompts.length}.` }];
  }
  const withoutVariable = seed.prompts.filter((p) => !p.includes("[") || !p.includes("]"));
  if (withoutVariable.length > 0) {
    return [{ field: "prompts", message: `${withoutVariable.length} prompt không có biến trong [ngoặc vuông].` }];
  }
  return [];
}

/** Rule 3 — Example phải khớp 1 trong 3 format chuẩn. */
function checkExample(seed: KnowledgeSeed): QualityIssue[] {
  if (!splitBeforeAfter(seed.example)) {
    return [
      {
        field: "example",
        message: 'Không khớp format Trước/Sau, Không dùng AI/Có AI, hoặc Sai/Đúng.',
      },
    ];
  }
  return [];
}

/** Rule 4 — Checklist phải là hành động, 3-5 mục. */
function checkChecklist(seed: KnowledgeSeed): QualityIssue[] {
  const issues: QualityIssue[] = [];
  if (seed.checklist.length < CHECKLIST_MIN || seed.checklist.length > CHECKLIST_MAX) {
    issues.push({
      field: "checklist",
      message: `Cần ${CHECKLIST_MIN}-${CHECKLIST_MAX} mục, hiện có ${seed.checklist.length}.`,
    });
  }
  const theoryItems = seed.checklist.filter((item) => THEORY_CHECKLIST_PATTERN.test(item));
  if (theoryItems.length > 0) {
    issues.push({ field: "checklist", message: `Mục lý thuyết, không phải hành động: ${theoryItems.join(" | ")}` });
  }
  return issues;
}

/** Rule 5 — Exercise phải là hành động cụ thể, không rỗng, không quá dài (ước lượng 5-15 phút). */
function checkExercise(seed: KnowledgeSeed): QualityIssue[] {
  const text = seed.exercise.trim();
  if (!text) return [{ field: "exercise", message: "Exercise đang rỗng." }];
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 60) {
    return [{ field: "exercise", message: "Exercise quá dài — có thể vượt khung 5-15 phút thực hành." }];
  }
  return [];
}

/** Rule 6 — Reflection: đúng 1 câu hỏi riêng của Seed (2 câu còn lại cố định ở tầng UI). */
function checkReflection(seed: KnowledgeSeed): QualityIssue[] {
  if (seed.reflectionQuestions.length !== REFLECTION_QUESTION_COUNT) {
    return [
      {
        field: "reflectionQuestions",
        message: `Cần đúng ${REFLECTION_QUESTION_COUNT} câu hỏi riêng, hiện có ${seed.reflectionQuestions.length}.`,
      },
    ];
  }
  return [];
}

/** Rule 7 — Companion Note: ngắn, không cụm cấm. */
function checkCompanionNote(seed: KnowledgeSeed): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const wordCount = seed.companionNote.trim().split(/\s+/).length;
  if (wordCount > COMPANION_NOTE_MAX_WORDS) {
    issues.push({ field: "companionNote", message: `Quá dài (${wordCount} từ, tối đa ${COMPANION_NOTE_MAX_WORDS}).` });
  }
  const lower = seed.companionNote.toLowerCase();
  const foundBanned = BANNED_COMPANION_PHRASES.filter((phrase) => lower.includes(phrase));
  if (foundBanned.length > 0) {
    issues.push({ field: "companionNote", message: `Chứa cụm bị cấm: ${foundBanned.join(", ")}.` });
  }
  return issues;
}

/** Rule bổ sung Sprint 05 — tag phải nằm trong taxonomy chuẩn hoá. */
function checkTaxonomy(seed: KnowledgeSeed): QualityIssue[] {
  const skillIds = new Set(SKILL_TAXONOMY.map((s) => s.id));
  const toolIds = new Set(AI_TOOL_TAXONOMY.map((t) => t.id));
  const scenarioIds = new Set(SCENARIO_TAXONOMY.map((s) => s.id));
  const issues: QualityIssue[] = [];
  const badSkills = seed.skills.filter((id) => !skillIds.has(id));
  const badTools = seed.aiTools.filter((id) => !toolIds.has(id));
  const badScenarios = seed.scenarios.filter((id) => !scenarioIds.has(id));
  if (badSkills.length > 0) issues.push({ field: "skills", message: `Tag ngoài taxonomy: ${badSkills.join(", ")}` });
  if (badTools.length > 0) issues.push({ field: "aiTools", message: `Tag ngoài taxonomy: ${badTools.join(", ")}` });
  if (badScenarios.length > 0) issues.push({ field: "scenarios", message: `Tag ngoài taxonomy: ${badScenarios.join(", ")}` });
  return issues;
}

/** Chạy toàn bộ rule 2-7 + taxonomy cho 1 Seed. */
export function validateSeedQuality(seed: KnowledgeSeed): QualityIssue[] {
  return [
    ...checkPrompts(seed),
    ...checkExample(seed),
    ...checkChecklist(seed),
    ...checkExercise(seed),
    ...checkReflection(seed),
    ...checkCompanionNote(seed),
    ...checkTaxonomy(seed),
  ];
}

export type GraphIssue = { slug: string; message: string };

/**
 * Đối chiếu toàn vẹn Knowledge Graph — dangling reference, chu trình, Seed
 * cô lập, Seed mồ côi, Collection không liên kết, duplicate id/slug (Sprint
 * 05 + Sprint 06 Task 03).
 */
export function validateGraphIntegrity(seeds: KnowledgeSeed[], collections: KnowledgeCollection[]): GraphIssue[] {
  const issues: GraphIssue[] = [];
  const seedSlugs = new Set(seeds.map((s) => s.slug));
  const collectionSlugs = new Set(collections.map((c) => c.slug));

  // Duplicate id / slug — mỗi Seed phải là duy nhất.
  const idCounts = new Map<string, number>();
  const slugCounts = new Map<string, number>();
  for (const seed of seeds) {
    idCounts.set(seed.id, (idCounts.get(seed.id) ?? 0) + 1);
    slugCounts.set(seed.slug, (slugCounts.get(seed.slug) ?? 0) + 1);
  }
  for (const [id, count] of idCounts) {
    if (count > 1) issues.push({ slug: id, message: `Duplicate id: "${id}" xuất hiện ${count} lần.` });
  }
  for (const [slug, count] of slugCounts) {
    if (count > 1) issues.push({ slug, message: `Duplicate slug: "${slug}" xuất hiện ${count} lần.` });
  }

  // Seed mồ côi — không thuộc seedSlugs[] của bất kỳ Collection nào.
  const allCollectionSeedSlugs = new Set(collections.flatMap((c) => c.seedSlugs));
  for (const seed of seeds) {
    if (!allCollectionSeedSlugs.has(seed.slug)) {
      issues.push({ slug: seed.slug, message: "Seed mồ côi — không nằm trong seedSlugs[] của Collection nào." });
    }
  }

  // Collection không liên kết — relatedCollections rỗng.
  for (const collection of collections) {
    if (collection.relatedCollections.length === 0) {
      issues.push({ slug: collection.slug, message: "Collection không liên kết — relatedCollections rỗng." });
    }
  }

  for (const seed of seeds) {
    for (const slug of seed.relatedSeeds) {
      if (!seedSlugs.has(slug)) issues.push({ slug: seed.slug, message: `relatedSeeds trỏ tới slug không tồn tại: ${slug}` });
    }
    for (const slug of seed.prerequisites) {
      if (!seedSlugs.has(slug)) issues.push({ slug: seed.slug, message: `prerequisites trỏ tới slug không tồn tại: ${slug}` });
    }
    for (const slug of seed.nextSeeds) {
      if (!seedSlugs.has(slug)) issues.push({ slug: seed.slug, message: `nextSeeds trỏ tới slug không tồn tại: ${slug}` });
      if (slug === seed.slug) issues.push({ slug: seed.slug, message: "nextSeeds trỏ vào chính nó." });
    }
    if (!collectionSlugs.has(seed.collectionSlug)) {
      issues.push({ slug: seed.slug, message: `collectionSlug không tồn tại: ${seed.collectionSlug}` });
    }
    const isolated =
      seed.skills.length === 0 && seed.scenarios.length === 0 && seed.relatedSeeds.length === 0;
    if (isolated) issues.push({ slug: seed.slug, message: "Seed không có kết nối nào (skill/scenario/relatedSeeds)." });
  }

  for (const collection of collections) {
    for (const slug of collection.relatedCollections) {
      if (!collectionSlugs.has(slug)) {
        issues.push({ slug: collection.slug, message: `relatedCollections trỏ tới Collection không tồn tại: ${slug}` });
      }
    }
  }

  // Phát hiện chu trình trong prerequisites (đồ thị có hướng phải là DAG).
  const prereqMap = new Map(seeds.map((s) => [s.slug, s.prerequisites]));
  function hasCycle(start: string): boolean {
    function dfs(node: string, path: Set<string>): boolean {
      for (const next of prereqMap.get(node) ?? []) {
        if (next === start) return true;
        if (path.has(next)) return true;
        if (dfs(next, new Set(path).add(next))) return true;
      }
      return false;
    }
    return dfs(start, new Set([start]));
  }
  for (const slug of seedSlugs) {
    if (hasCycle(slug)) issues.push({ slug, message: "Phát hiện chu trình (cycle) trong prerequisites." });
  }

  return issues;
}
