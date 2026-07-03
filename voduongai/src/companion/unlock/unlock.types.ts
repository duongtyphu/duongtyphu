/**
 * EPIC 02 — Sprint 05: Unlockable Assets Implementation™.
 * Types cho hệ thống mở khóa thật (Prompt Pack / Checklist / Template) —
 * xem `docs/JOURNEY_UNLOCK_BLUEPRINT.md`/`docs/UNLOCK_RULE_STANDARD.md` cho
 * Constitution đầy đủ. Đây là bản implement đầu tiên, pilot cho 1 Mission.
 */

export type UnlockableAssetType = "prompt_pack" | "checklist" | "template";

/** Vòng đời trạng thái của MỘT asset đối với người dùng hiện tại. */
export type UnlockAssetStatus = "locked" | "available" | "unlocked" | "completed";

export type PromptPackContent = {
  prompts: { label: string; prompt: string }[];
};

export type ChecklistContent = {
  items: { label: string; detail: string }[];
};

export type TemplateContent = {
  templates: { label: string; body: string }[];
};

export type UnlockableAssetContent = PromptPackContent | ChecklistContent | TemplateContent;

/**
 * Điều kiện mở khóa — rule-based, xem `UNLOCK_RULE_STANDARD.md`. Sprint 05
 * chỉ implement `mission-evidence-and-reflection` (pilot); các loại khác để
 * mở rộng sau (CKOS `seed-completed`, Opportunities `evidence-logged`...).
 */
export type UnlockCondition = {
  type: "mission-evidence-and-reflection";
  missionId: string;
};

export type UnlockableAsset = {
  id: string;
  title: string;
  type: UnlockableAssetType;
  description: string;
  /** Câu bật mí một chi tiết thật bên trong — hiển thị khi asset còn `locked` (xem DISCOVERY_STANDARD.md mục Teaser). */
  lockedPreview: string;
  unlockCondition: UnlockCondition;
  content: UnlockableAssetContent;
  relatedMissionId: string;
  relatedSeedId?: string;
  /** Câu Companion nói khi asset chuyển sang `available` — xem COMPANION_UNLOCK_LANGUAGE.md. */
  companionMessage: string;
  /** Trạng thái mặc định khi asset được định nghĩa — trạng thái THẬT của từng người dùng nằm ở unlock-state.ts. */
  status: UnlockAssetStatus;
};
