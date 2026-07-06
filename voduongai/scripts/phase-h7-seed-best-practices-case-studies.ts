/**
 * PHASE H.7 — Best Practice & Case Study Seeding (REAL SCRIPT, NOT EXECUTED
 * against production — only --dry-run was run during this session).
 * ============================================================================
 * Đọc trực tiếp:
 *   - `knowledgeSeedData` (features/knowledge/data/knowledge-seed-data.ts) —
 *     lọc theo `type === GUIDE` cho Best Practice, `type === CASE_STUDY` cho
 *     Case Study. Không hardcode literal nội dung nào.
 *   - `studentSuccessSeed` (data/admin/studentSuccess.ts) — Case Study.
 *
 * KHÔNG bao gồm CONSTITUTION (Companion, 10 nguyên tắc) hay RULES (Cộng
 * đồng, 5 nội quy) — theo quyết định Phase H.2 ADR-001: nội dung Companion
 * brand narrative GIỮ NGUYÊN tại chỗ, chỉ nên được CKOS tham chiếu (link),
 * không sao chép nội dung. Xem ADR-006 mục Rationale trong báo cáo đi kèm.
 *
 * Chạy:
 *   npx tsx scripts/phase-h7-seed-best-practices-case-studies.ts            (dry-run mặc định)
 *   npx tsx scripts/phase-h7-seed-best-practices-case-studies.ts --apply    (CHƯA implement)
 */

import { knowledgeSeedData } from "../src/features/knowledge/data/knowledge-seed-data";
import { KnowledgeType } from "../src/features/knowledge/types/knowledge.types";
import { studentSuccessSeed } from "../src/data/admin/studentSuccess";

type CandidateBestPractice = {
  slug: string;
  title: string;
  description: string;
  principle: string;
  source_system: "knowledge_seed_guide";
  legacy_source_id: string;
};

type CandidateCaseStudy = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  source_system: "knowledge_seed_case_study" | "student_success";
  legacy_source_id: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

// ---------------------------------------------------------------------------
// Best Practice ← guides (type=GUIDE trong knowledgeSeedData)
// ---------------------------------------------------------------------------
const bestPracticeCandidates: CandidateBestPractice[] = knowledgeSeedData
  .filter((a) => a.type === KnowledgeType.GUIDE)
  .map((a) => ({
    slug: slugify(a.id.replace(/^guide-/, "")),
    title: a.title,
    description: a.summary,
    principle: a.content,
    source_system: "knowledge_seed_guide",
    legacy_source_id: a.id,
  }));

// ---------------------------------------------------------------------------
// Case Study ← case studies (type=CASE_STUDY trong knowledgeSeedData) + studentSuccessSeed
// ---------------------------------------------------------------------------
const caseStudyFromKnowledgeSeed: CandidateCaseStudy[] = knowledgeSeedData
  .filter((a) => a.type === KnowledgeType.CASE_STUDY)
  .map((a) => ({
    slug: slugify(a.id.replace(/^case-study-/, "")),
    title: a.title,
    summary: a.summary,
    content: a.content,
    source_system: "knowledge_seed_case_study",
    legacy_source_id: a.id,
  }));

const caseStudyFromStudentSuccess: CandidateCaseStudy[] = studentSuccessSeed
  .filter((s) => s.status === "Published")
  .map((s) => ({
    slug: slugify(s.id),
    title: s.title,
    summary: s.shortDescription,
    content: s.content,
    source_system: "student_success",
    legacy_source_id: s.id,
  }));

const caseStudyCandidates = [...caseStudyFromKnowledgeSeed, ...caseStudyFromStudentSuccess];

// ---------------------------------------------------------------------------
// Dedup (yêu cầu H.7 mục 6: slug/title/source/content signature)
// ---------------------------------------------------------------------------
function findDuplicates<T extends { slug: string; title: string; source_system: string }>(
  items: T[],
  contentKey: (item: T) => string
): string[] {
  const warnings: string[] = [];
  const bySlug = new Map<string, T[]>();
  const byTitle = new Map<string, T[]>();
  const byContent = new Map<string, T[]>();

  for (const item of items) {
    bySlug.set(item.slug, [...(bySlug.get(item.slug) ?? []), item]);
    byTitle.set(normalize(item.title), [...(byTitle.get(normalize(item.title)) ?? []), item]);
    const sig = normalize(contentKey(item)).slice(0, 200);
    byContent.set(sig, [...(byContent.get(sig) ?? []), item]);
  }
  for (const [k, g] of bySlug) if (g.length > 1) warnings.push(`[DUPLICATE SLUG] "${k}": ${g.map((x) => x.source_system).join(", ")}`);
  for (const [k, g] of byTitle) if (g.length > 1) warnings.push(`[DUPLICATE TITLE] "${k}": ${g.map((x) => x.source_system).join(", ")}`);
  for (const [, g] of byContent) if (g.length > 1) warnings.push(`[DUPLICATE CONTENT SIGNATURE] ${g.map((x) => x.slug).join(" vs ")}`);
  return warnings;
}

function main() {
  const apply = process.argv.includes("--apply");

  console.log(`Best Practice candidates: ${bestPracticeCandidates.length} (nguồn: knowledge_seed_guide)`);
  const bpWarnings = findDuplicates(bestPracticeCandidates, (i) => i.principle);
  console.log(`  Cảnh báo trùng lặp: ${bpWarnings.length}`);
  bpWarnings.forEach((w) => console.log("    " + w));

  console.log(`\nCase Study candidates: ${caseStudyCandidates.length} (${caseStudyFromKnowledgeSeed.length} knowledge_seed_case_study + ${caseStudyFromStudentSuccess.length} student_success)`);
  const csWarnings = findDuplicates(caseStudyCandidates, (i) => i.content);
  console.log(`  Cảnh báo trùng lặp: ${csWarnings.length}`);
  csWarnings.forEach((w) => console.log("    " + w));

  if (!apply) {
    console.log("\n[DRY RUN] Không ghi gì vào Supabase.");
    console.log("\n--- Best Practice candidates ---");
    console.log(JSON.stringify(bestPracticeCandidates, null, 2));
    console.log("\n--- Case Study candidates ---");
    console.log(JSON.stringify(caseStudyCandidates, null, 2));
    return;
  }

  throw new Error("Nhánh --apply chưa được implement — Phase H.7 chỉ chuẩn bị script, không ghi dữ liệu thật.");
}

main();
