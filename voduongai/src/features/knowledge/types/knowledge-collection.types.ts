/**
 * CKOS — Collection System
 * Một Collection gồm nhiều Knowledge Seed cùng chủ đề lớn (ví dụ "AI Office").
 */

export type KnowledgeCollection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** slug của các Seed thuộc Collection này, đúng thứ tự học. */
  seedSlugs: string[];
  /**
   * Sprint 05 — Collection Relationship (Feature 07): slug Collection nên
   * học tiếp theo sau khi hoàn thành Collection này. Rỗng nếu chưa có
   * Collection kế tiếp (không tạo Collection giả để lấp chỗ trống).
   */
  relatedCollections: string[];
};

export type KnowledgeCollectionProgress = {
  totalSeeds: number;
  completedSeeds: number;
  percent: number;
};
