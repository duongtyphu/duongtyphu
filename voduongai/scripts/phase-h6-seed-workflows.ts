/**
 * PHASE H.6 — Static Workflow Seeding (REAL SCRIPT, NOT EXECUTED)
 * ============================================================================
 * Đọc trực tiếp 3 nguồn Workflow tĩnh có cấu trúc bước thật (không bịa nội
 * dung — script này IMPORT đúng module nguồn, không hardcode literal step
 * nào) và chuẩn bị batch INSERT cho `ckos_workflows`/`ckos_workflow_steps`.
 *
 * KHÔNG được chạy ở Phase H.6 (chỉ chuẩn bị sẵn sàng — "không migrate dữ
 * liệu thật"). Khi Product Owner duyệt, chạy bằng:
 *   npx tsx scripts/phase-h6-seed-workflows.ts --dry-run   (mặc định, chỉ in ra)
 *   npx tsx scripts/phase-h6-seed-workflows.ts --apply     (ghi thật, cần SUPABASE_SERVICE_ROLE_KEY)
 *
 * Yêu cầu SUPABASE_SERVICE_ROLE_KEY trong .env.local để chạy --apply (không
 * có trong môi trường audit này — script được viết sẵn, chưa từng chạy).
 */

import { AI_WORKFLOWS } from "../src/data/portal/ai-workspace";
import { knowledgeSeedJourneys } from "../src/features/knowledge/data/knowledge-seed-journeys";
import { roadmapSeed } from "../src/data/admin/roadmap";

type CandidateStep = { order: number; title: string; instruction?: string };
type CandidateWorkflow = {
  slug: string;
  title: string;
  description: string;
  source_system: "ai_workflows" | "knowledge_seed_journeys" | "roadmap_seed";
  legacy_source_id: string;
  category?: string;
  steps: CandidateStep[];
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

function normalizeTitle(title: string): string {
  return title.toLowerCase().trim().replace(/\s+/g, " ");
}

function stepSignature(steps: CandidateStep[]): string {
  return steps.map((s) => normalizeTitle(s.title)).join("|");
}

// ---------------------------------------------------------------------------
// 1. Nguồn AI_WORKFLOWS (4 workflow, mỗi workflow có `steps: string[]`)
// ---------------------------------------------------------------------------
const fromAiWorkflows: CandidateWorkflow[] = AI_WORKFLOWS.map((w) => ({
  slug: slugify(w.id),
  title: w.title,
  description: `Quy trình ${w.title.toLowerCase()} với sự hỗ trợ của: ${w.suggestedTools.join(", ")}.`,
  source_system: "ai_workflows",
  legacy_source_id: w.id,
  steps: w.steps.map((title, i) => ({ order: i + 1, title })),
}));

// ---------------------------------------------------------------------------
// 2. Nguồn knowledgeSeedJourneys (11 seed, mỗi seed có `steps: {title,order}[]`)
// ---------------------------------------------------------------------------
const fromKnowledgeSeedJourneys: CandidateWorkflow[] = knowledgeSeedJourneys.map((seed) => ({
  slug: seed.slug,
  title: seed.title,
  description: seed.summary,
  source_system: "knowledge_seed_journeys",
  legacy_source_id: seed.id,
  category: seed.collectionSlug,
  steps: [...seed.steps]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ order: s.order, title: s.title })),
}));

// ---------------------------------------------------------------------------
// 3. Nguồn roadmapSeed — ĐÂY LÀ 1 WORKFLOW DUY NHẤT (không phải 8 workflow
//    riêng — mỗi phần tử trong roadmapSeed là 1 BƯỚC của "Lộ trình thành
//    công", đã xác nhận đọc trực tiếp src/data/admin/roadmap.ts ở Phase H.6).
// ---------------------------------------------------------------------------
const fromRoadmap: CandidateWorkflow[] = [
  {
    slug: "lo-trinh-thanh-cong",
    title: "Lộ trình thành công",
    description: "Lộ trình 8 bước từ làm quen AI tới mở rộng hệ sinh thái.",
    source_system: "roadmap_seed",
    legacy_source_id: "roadmap",
    steps: [...roadmapSeed]
      .filter((s) => s.status === "Published") // loại 2 bước Draft (step_7, step_8)
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ order: s.order, title: s.title, instruction: s.description })),
  },
];

const allCandidates: CandidateWorkflow[] = [
  ...fromAiWorkflows,
  ...fromKnowledgeSeedJourneys,
  ...fromRoadmap,
];

// ---------------------------------------------------------------------------
// Dedup theo yêu cầu H.6 mục 3: slug / title / goal(description) / step
// structure / source. Chiến lược: KHÔNG tự động xoá — chỉ CẢNH BÁO khi phát
// hiện khả năng trùng, để con người quyết định (an toàn hơn tự động drop).
// ---------------------------------------------------------------------------
function findDuplicateWarnings(items: CandidateWorkflow[]) {
  const warnings: string[] = [];
  const bySlug = new Map<string, CandidateWorkflow[]>();
  const byTitle = new Map<string, CandidateWorkflow[]>();
  const byStepSig = new Map<string, CandidateWorkflow[]>();

  for (const item of items) {
    const slugKey = item.slug;
    const titleKey = normalizeTitle(item.title);
    const stepKey = stepSignature(item.steps);

    bySlug.set(slugKey, [...(bySlug.get(slugKey) ?? []), item]);
    byTitle.set(titleKey, [...(byTitle.get(titleKey) ?? []), item]);
    byStepSig.set(stepKey, [...(byStepSig.get(stepKey) ?? []), item]);
  }

  for (const [slug, group] of bySlug) {
    if (group.length > 1) {
      warnings.push(`[DUPLICATE SLUG] "${slug}" xuất hiện ${group.length} lần: ${group.map((g) => g.source_system).join(", ")}`);
    }
  }
  for (const [title, group] of byTitle) {
    if (group.length > 1) {
      warnings.push(`[DUPLICATE TITLE] "${title}" xuất hiện ${group.length} lần: ${group.map((g) => g.source_system).join(", ")}`);
    }
  }
  for (const [sig, group] of byStepSig) {
    if (group.length > 1 && sig.length > 0) {
      warnings.push(`[DUPLICATE STEP STRUCTURE] ${group.map((g) => g.slug).join(" vs ")} có chuỗi bước giống hệt nhau`);
    }
  }
  return warnings;
}

function main() {
  const apply = process.argv.includes("--apply");
  const warnings = findDuplicateWarnings(allCandidates);

  console.log(`Tổng số workflow candidate: ${allCandidates.length}`);
  console.log(`  - Từ AI_WORKFLOWS: ${fromAiWorkflows.length}`);
  console.log(`  - Từ knowledgeSeedJourneys: ${fromKnowledgeSeedJourneys.length}`);
  console.log(`  - Từ roadmapSeed (gộp thành 1 workflow): ${fromRoadmap.length}`);
  console.log(`Cảnh báo trùng lặp: ${warnings.length}`);
  warnings.forEach((w) => console.log("  " + w));

  if (!apply) {
    console.log("\n[DRY RUN] Không ghi gì vào Supabase. Chạy với --apply để ghi thật (cần SUPABASE_SERVICE_ROLE_KEY).");
    console.log(JSON.stringify(allCandidates, null, 2));
    return;
  }

  // ⚠️ Nhánh --apply CHƯA được implement ở Phase H.6 (theo đúng yêu cầu
  // "không migrate dữ liệu thật"). Khi Phase H.7+ được duyệt, bổ sung:
  //   import { createClient } from "@supabase/supabase-js";
  //   const admin = createClient(url, serviceRoleKey);
  //   for (const wf of allCandidates) {
  //     const { data: inserted } = await admin.from("ckos_workflows").upsert({...}, { onConflict: "legacy_source_id,source_system" }).select().single();
  //     for (const step of wf.steps) await admin.from("ckos_workflow_steps").insert({ workflow_id: inserted.id, ... });
  //   }
  throw new Error("Nhánh --apply chưa được implement — Phase H.6 chỉ chuẩn bị script, không ghi dữ liệu thật.");
}

main();
