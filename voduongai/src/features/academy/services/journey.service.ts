/**
 * Academy — Sprint 02: Learning Journey Engine™
 * Đọc dữ liệu từ CKOS (không tạo tri thức mới, không sửa dữ liệu CKOS) và
 * chiếu thành Learning Journey theo 7 giai đoạn. Toàn bộ rule-based, không AI.
 * Xem quy tắc đầy đủ: docs/Academy/JourneyRules.md
 *
 * VIỆC 3 (Nhóm A audit): trước đây file này đọc `getAllKnowledgeCollections()`/
 * các hàm cross-reference từ knowledge-collection.service.ts/
 * knowledge-seed.service.ts — các hàm đó đọc thẳng mảng tĩnh
 * `knowledgeCollections`/`knowledgeSeedJourneys` (đã @deprecated), KHÔNG
 * phải bảng Supabase `knowledge_collections`/`knowledge_seeds` mà Admin CKOS
 * quản lý — nghĩa là Founder sửa Lesson/Collection qua Admin không phản
 * ánh gì ở Học viện AI. Đã sửa: nhận `collections`/`seeds` (lấy từ
 * getLiveKnowledgeCollections()/getLiveKnowledgeSeeds(), Supabase thật) làm
 * THAM SỐ thay vì tự đọc mảng tĩnh — giữ nguyên 100% logic tính stage/
 * progress/prerequisite/next-journey. KHÔNG đụng tới
 * knowledge-collection.service.ts/knowledge-seed.service.ts/
 * knowledge-graph.service.ts hay KnowledgeWorkspace.tsx/
 * KnowledgeCollectionView.tsx (Learning Engine, giữ nguyên theo yêu cầu) —
 * các hàm cross-reference cần thiết được viết lại cục bộ trong file này,
 * chỉ dùng cho Academy Journey Engine.
 */

import { computeSeedProgress, type KnowledgeCollection, type KnowledgeSeed } from "@/features/knowledge";
import { isJourneyMarkedReady } from "../utils/use-journey-ready";
import { JourneyStage, type LearningJourney, type JourneyStatus } from "../types/journey.types";

type GetSeedCompletedStepIds = (seedId: string) => string[];

// ─── Cross-reference cục bộ (dùng collections/seeds LIVE truyền vào, không
// đọc mảng tĩnh) — mirror đúng logic của knowledge-collection.service.ts/
// knowledge-seed.service.ts, KHÔNG đổi rule/threshold nào. ────────────────

function findCollectionBySlug(collections: KnowledgeCollection[], slug: string): KnowledgeCollection | undefined {
  return collections.find((c) => c.slug === slug);
}

function findSeedBySlug(seeds: KnowledgeSeed[], slug: string): KnowledgeSeed | undefined {
  return seeds.find((s) => s.slug === slug);
}

function getSeedsInCollectionLive(collection: KnowledgeCollection, seeds: KnowledgeSeed[]): KnowledgeSeed[] {
  return collection.seedSlugs
    .map((slug) => findSeedBySlug(seeds, slug))
    .filter((s): s is KnowledgeSeed => Boolean(s));
}

function computeCollectionProgressLive(
  collection: KnowledgeCollection,
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): { totalSeeds: number; completedSeeds: number; percent: number } {
  const inCollection = getSeedsInCollectionLive(collection, seeds);
  const completedSeeds = inCollection.filter(
    (s) => computeSeedProgress(s, getSeedCompletedStepIds(s.id)).percent >= 100
  ).length;
  const totalSeeds = inCollection.length;
  return { totalSeeds, completedSeeds, percent: totalSeeds === 0 ? 0 : Math.round((completedSeeds / totalSeeds) * 100) };
}

function getNextSeedToLearnLive(
  collection: KnowledgeCollection,
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): KnowledgeSeed | null {
  const inCollection = getSeedsInCollectionLive(collection, seeds);
  return inCollection.find((s) => computeSeedProgress(s, getSeedCompletedStepIds(s.id)).percent < 100) ?? null;
}

function getSuggestedNextCollectionLive(
  currentCollection: KnowledgeCollection,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): KnowledgeCollection | null {
  const others = collections.filter((c) => c.slug !== currentCollection.slug);
  return (
    others.find((c) => computeCollectionProgressLive(c, seeds, getSeedCompletedStepIds).percent < 100) ??
    others[0] ??
    null
  );
}

/** Mirror getAdjacentSeeds() (knowledge-seed.service.ts) — chỉ cần "previous". */
function getPreviousSeedLive(
  seed: KnowledgeSeed,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[]
): KnowledgeSeed | null {
  const collection = findCollectionBySlug(collections, seed.collectionSlug);
  if (!collection) return null;
  const index = collection.seedSlugs.indexOf(seed.slug);
  const previousSlug = index > 0 ? collection.seedSlugs[index - 1] : undefined;
  return previousSlug ? findSeedBySlug(seeds, previousSlug) ?? null : null;
}

/** Mirror getPrerequisiteGuidance() (knowledge-seed.service.ts). */
function getPrerequisiteGuidanceLive(
  seed: KnowledgeSeed,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): string | null {
  const explicitPrerequisites = seed.prerequisites
    .map((slug) => findSeedBySlug(seeds, slug))
    .filter((s): s is KnowledgeSeed => Boolean(s));

  const incomplete = explicitPrerequisites.find(
    (p) => computeSeedProgress(p, getSeedCompletedStepIds(p.id)).percent < 100
  );
  if (incomplete) {
    return `Bạn nên hoàn thành "${incomplete.title}" trước khi học "${seed.title}".`;
  }
  if (explicitPrerequisites.length > 0) return null;

  const previous = getPreviousSeedLive(seed, collections, seeds);
  if (!previous) return null;
  const percent = computeSeedProgress(previous, getSeedCompletedStepIds(previous.id)).percent;
  if (percent >= 100) return null;
  return `Bạn nên hoàn thành "${previous.title}" trước khi học "${seed.title}".`;
}

// ─── API công khai của Journey Engine — chữ ký thêm collections/seeds
// (LIVE, lấy từ getLiveKnowledgeCollections()/getLiveKnowledgeSeeds()) thay
// vì tự đọc mảng tĩnh bên trong. Logic/threshold/copy giữ nguyên 100%. ────

/** Mỗi Learning Journey chiếu 1:1 từ 1 CKOS Collection — không tạo Journey độc lập. */
export function getAllLearningJourneys(collections: KnowledgeCollection[]): LearningJourney[] {
  return collections.map((collection) => toJourney(collection));
}

export function getLearningJourneyBySlug(
  collections: KnowledgeCollection[],
  slug: string
): LearningJourney | undefined {
  const collection = findCollectionBySlug(collections, slug);
  return collection ? toJourney(collection) : undefined;
}

function toJourney(collection: KnowledgeCollection): LearningJourney {
  return {
    id: `journey-${collection.slug}`,
    slug: collection.slug,
    title: collection.title,
    goal: collection.description,
    collectionSlug: collection.slug,
  };
}

/**
 * Rule chuyển % tiến độ CKOS Collection thành 1 trong 7 giai đoạn Journey.
 * Xem JourneyRules.md — ngưỡng này KHÔNG hiển thị dạng % cho người dùng,
 * chỉ dùng nội bộ để xác định stage.
 */
function stageFromPercent(percent: number, isReady: boolean): JourneyStage {
  if (percent >= 100 && isReady) return JourneyStage.READY;
  if (percent >= 100) return JourneyStage.GROWTH;
  if (percent >= 70) return JourneyStage.REFLECTION;
  if (percent >= 45) return JourneyStage.APPLICATION;
  if (percent >= 15) return JourneyStage.PRACTICE;
  if (percent > 0) return JourneyStage.LEARNING;
  return JourneyStage.PREPARATION;
}

export function computeJourneyStatus(
  journey: LearningJourney,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): JourneyStatus {
  const collection = findCollectionBySlug(collections, journey.collectionSlug);
  if (!collection) return { stage: JourneyStage.PREPARATION, currentSeedSlug: null, percent: 0 };

  const progress = computeCollectionProgressLive(collection, seeds, getSeedCompletedStepIds);
  const nextSeed = getNextSeedToLearnLive(collection, seeds, getSeedCompletedStepIds);
  const isReady = isJourneyMarkedReady(journey.slug);

  return {
    stage: stageFromPercent(progress.percent, isReady),
    currentSeedSlug: nextSeed?.slug ?? null,
    percent: progress.percent,
  };
}

/** Seed hiện tại người học nên tiếp tục — dùng cho Journey Card "Bạn nên làm gì tiếp theo". */
export function getCurrentSeedForJourney(
  journey: LearningJourney,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): KnowledgeSeed | null {
  const collection = findCollectionBySlug(collections, journey.collectionSlug);
  if (!collection) return null;
  return getNextSeedToLearnLive(collection, seeds, getSeedCompletedStepIds);
}

/**
 * Phase 6 — Academy Experience. Academy KHÔNG tự tạo "Purpose/Who this is
 * for/Prerequisites/Expected Output" — mọi field dưới đây đọc thẳng từ Seed
 * hiện tại (CKOS, `features/knowledge`), không có nội dung mới nào được
 * viết ra ở đây. Nếu Journey đã xong hết (không còn seed nào), field liên
 * quan trả về rỗng một cách trung thực thay vì lấy tạm seed khác.
 */
export type JourneyLearnerProfile = {
  persona: string[];
  whatYouWillGain: string[];
  expectedOutput: string | null;
  prerequisiteGuidance: string | null;
};

export function getJourneyLearnerProfile(
  journey: LearningJourney,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): JourneyLearnerProfile {
  const seed = getCurrentSeedForJourney(journey, collections, seeds, getSeedCompletedStepIds);
  if (!seed) {
    return { persona: [], whatYouWillGain: [], expectedOutput: null, prerequisiteGuidance: null };
  }
  return {
    persona: seed.persona,
    whatYouWillGain: seed.whatYouWillGain,
    expectedOutput: seed.exercise || null,
    prerequisiteGuidance: getPrerequisiteGuidanceLive(seed, collections, seeds, getSeedCompletedStepIds),
  };
}

/**
 * Next Journey (Feature 09, CKOS Collection Relationship) — chỉ gợi ý khi
 * Journey hiện tại đã thật sự hoàn thành hoặc gần xong; không tạo Collection
 * giả để luôn có gợi ý. Trả về null nếu CKOS chưa có Collection kế tiếp nào.
 */
export function getSuggestedNextJourney(
  journey: LearningJourney,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): LearningJourney | null {
  const collection = findCollectionBySlug(collections, journey.collectionSlug);
  if (!collection) return null;
  const next = getSuggestedNextCollectionLive(collection, collections, seeds, getSeedCompletedStepIds);
  return next ? toJourney(next) : null;
}

/**
 * Companion Guidance (Feature 06) — không nói "bạn còn N bài", chỉ gợi ý
 * hành động cụ thể theo giọng đồng hành. Xem JourneyRules.md.
 */
export function getCompanionJourneyGuidance(
  journey: LearningJourney,
  status: JourneyStatus,
  collections: KnowledgeCollection[],
  seeds: KnowledgeSeed[],
  getSeedCompletedStepIds: GetSeedCompletedStepIds
): string {
  switch (status.stage) {
    case JourneyStage.PREPARATION:
      return `Mình nghĩ hôm nay bạn nên bắt đầu với "${journey.title}" — chỉ cần 10-15 phút đầu tiên để làm quen.`;
    case JourneyStage.LEARNING:
      return "Mình thấy bạn đang tìm hiểu dần. Đừng vội — hiểu chắc từng phần rồi hẵng thực hành.";
    case JourneyStage.PRACTICE: {
      const seed = getCurrentSeedForJourney(journey, collections, seeds, getSeedCompletedStepIds);
      return seed
        ? `Mình nghĩ bạn đã sẵn sàng để thử "${seed.title}" — làm luôn với công việc thật của bạn.`
        : "Mình nghĩ bạn đã sẵn sàng để thực hành phần tiếp theo.";
    }
    case JourneyStage.APPLICATION:
      return "Bạn đang áp dụng khá tốt rồi. Hôm nay thử dùng lại kỹ năng này cho một việc thật khác xem sao.";
    case JourneyStage.REFLECTION:
      return "Bạn đã đi được một chặng dài. Dành 2 phút nhìn lại — bạn thấy mình khác gì so với lúc bắt đầu?";
    case JourneyStage.GROWTH:
      return "Bạn đã hoàn thành hành trình này. Mình nghĩ đã đến lúc bạn tự xác nhận mình đã sẵn sàng.";
    case JourneyStage.READY:
      return "Bạn đã sẵn sàng. Hành trình tiếp theo đang chờ khi bạn muốn.";
    default:
      return "";
  }
}
