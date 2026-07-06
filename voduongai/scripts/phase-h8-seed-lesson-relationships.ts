// Phase H.8 — Lesson Intelligence: dry-run relationship discovery script.
// Reads REAL source files (no fabricated content). Reports candidate rows
// for the 9 Lesson relationship tables. Does NOT write to Supabase — no
// service role key is used, no network calls are made.
//
// Run: npx tsx scripts/phase-h8-seed-lesson-relationships.ts

import { roadmapSeed } from "../src/data/admin/roadmap";
import { startHereSeed } from "../src/data/admin/startHere";

type RelationCandidate = {
  lessonRef: string;
  target: string;
  relation:
    | "tool"
    | "prompt"
    | "workflow"
    | "resource"
    | "best_practice"
    | "case_study"
    | "faq"
    | "journey"
    | "competency";
  source: string;
};

function fromRelatedLessonFields(): RelationCandidate[] {
  // The only fields anywhere in the codebase that point FROM another entity
  // TO a lesson are `relatedLesson` on RoadmapStep and StartHereItem — the
  // inverse direction of what this phase needs (Lesson -> X). They cannot be
  // used to seed Lesson -> Journey/Tool/etc without a lesson id on the other
  // side, so they are reported here only as evidence, not as candidates.
  const roadmapHits = roadmapSeed.filter((s) => Boolean(s.relatedLesson));
  const startHereHits = (startHereSeed ?? []).filter((s: { relatedLesson?: string }) =>
    Boolean(s.relatedLesson)
  );
  console.log(
    `[evidence] roadmapSeed entries with relatedLesson set: ${roadmapHits.length}/${roadmapSeed.length}`
  );
  console.log(
    `[evidence] startHereSeed entries with relatedLesson set: ${startHereHits.length}/${(startHereSeed ?? []).length}`
  );
  return [];
}

function main() {
  const candidates: RelationCandidate[] = [
    ...fromRelatedLessonFields(),
    // No other source in the repo maps a specific lesson to a specific
    // Tool/Prompt/Workflow/Resource/BestPractice/CaseStudy/FAQ/Journey/
    // Competency. See Phase H.8 report, section "Nguồn dữ liệu đã đọc toàn
    // văn" for the full list of files inspected.
  ];

  const bySlug = new Map<string, RelationCandidate[]>();
  for (const c of candidates) {
    const key = `${c.relation}:${c.lessonRef}:${c.target}`;
    bySlug.set(key, [...(bySlug.get(key) ?? []), c]);
  }
  const duplicates = [...bySlug.entries()].filter(([, v]) => v.length > 1);

  console.log(`Lesson relationship candidates found: ${candidates.length}`);
  console.log(`Duplicate warnings: ${duplicates.length}`);
  console.log(JSON.stringify({ candidates, duplicateCount: duplicates.length }, null, 2));

  if (process.argv.includes("--apply")) {
    throw new Error(
      "Phase H.8 is dry-run only. --apply is intentionally not implemented — see ADR-007."
    );
  }
}

main();
