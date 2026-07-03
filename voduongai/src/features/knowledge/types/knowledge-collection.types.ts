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
};

export type KnowledgeCollectionProgress = {
  totalSeeds: number;
  completedSeeds: number;
  percent: number;
};
