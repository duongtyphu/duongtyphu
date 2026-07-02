/**
 * CKOS — EC-001: Knowledge Foundation
 * Service layer để đọc/lọc Knowledge Asset.
 *
 * Hiện tại đọc từ seed data file (chưa có database). Thiết kế theo hàm
 * thuần (không side-effect ngoài đọc mảng in-memory) để sau này migrate
 * sang Supabase chỉ cần đổi phần lấy `assets`, chữ ký hàm giữ nguyên.
 */

import { knowledgeSeedData } from "../data/knowledge-seed-data";
import { canPublishKnowledgeAsset, validateKnowledgeAsset } from "../utils/knowledge-validation";
import {
  KnowledgeStatus,
  type KnowledgeAsset,
  type KnowledgeAssetFilter,
  type KnowledgeType,
} from "../types/knowledge.types";

function getSource(): KnowledgeAsset[] {
  return knowledgeSeedData;
}

export function getAllKnowledgeAssets(): KnowledgeAsset[] {
  return getSource();
}

export function getKnowledgeAssetBySlug(slug: string): KnowledgeAsset | undefined {
  return getSource().find((asset) => asset.slug === slug);
}

export function getKnowledgeAssetsByType(type: KnowledgeType): KnowledgeAsset[] {
  return getSource().filter((asset) => asset.type === type);
}

export function getKnowledgeAssetsByPersona(persona: string): KnowledgeAsset[] {
  return getSource().filter((asset) => asset.dna.persona.includes(persona));
}

export function getKnowledgeAssetsByGoal(goal: string): KnowledgeAsset[] {
  return getSource().filter((asset) => asset.dna.goal.includes(goal));
}

export function getPublishedKnowledgeAssets(): KnowledgeAsset[] {
  return getSource().filter((asset) => asset.status === KnowledgeStatus.PUBLISHED);
}

export function getFeaturedKnowledgeAssets(): KnowledgeAsset[] {
  return getSource().filter((asset) => asset.status === KnowledgeStatus.PUBLISHED && asset.system.featured);
}

/**
 * Filter tổng hợp — dùng cho UI thư viện và Admin sau này.
 * Mặc định chỉ trả về asset đã publish trừ khi filter.status được set rõ ràng.
 */
export function filterKnowledgeAssets(filter: KnowledgeAssetFilter): KnowledgeAsset[] {
  const status = filter.status ?? KnowledgeStatus.PUBLISHED;
  return getSource().filter((asset) => {
    if (asset.status !== status) return false;
    if (filter.type && asset.type !== filter.type) return false;
    if (filter.persona && !asset.dna.persona.includes(filter.persona)) return false;
    if (filter.goal && !asset.dna.goal.includes(filter.goal)) return false;
    if (filter.difficulty && asset.dna.difficulty !== filter.difficulty) return false;
    if (filter.category && asset.dna.category !== filter.category) return false;
    if (filter.premium !== undefined && asset.system.premium !== filter.premium) return false;
    if (filter.featured !== undefined && asset.system.featured !== filter.featured) return false;
    return true;
  });
}

export { validateKnowledgeAsset, canPublishKnowledgeAsset };
