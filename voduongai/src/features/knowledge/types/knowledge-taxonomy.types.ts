/**
 * CKOS — Knowledge Intelligence™ (Sprint 05)
 * Taxonomy chuẩn hoá cho Skill / AI Tool / Business Scenario — không phải
 * tag tự do. Mọi Seed chỉ được gắn tag nằm trong danh sách này.
 */

export type SkillTag = {
  id: string;
  label: string;
  /** Skill cha (nếu có) — dựng cây Skill Map, VD: "Prompt Engineering" thuộc "Communication". */
  parentId?: string;
};

export type AiToolTag = {
  id: string;
  label: string;
};

export type ScenarioTag = {
  id: string;
  label: string;
};
