/**
 * CKOS — Knowledge Intelligence™ (Sprint 05)
 * Danh sách chuẩn hoá Skill / AI Tool / Scenario. Xem quy tắc mở rộng
 * trong docs/CKOS/Tag_Standard.md — không thêm tag mới ngoài quy trình đó.
 */

import type { AiToolTag, ScenarioTag, SkillTag } from "../types/knowledge-taxonomy.types";

export const SKILL_TAXONOMY: SkillTag[] = [
  { id: "communication", label: "Communication" },
  { id: "writing", label: "Writing", parentId: "communication" },
  { id: "prompt-engineering", label: "Prompt Engineering", parentId: "communication" },
  { id: "ai-office", label: "AI Office" },
  { id: "data-analysis", label: "Data Analysis", parentId: "ai-office" },
  { id: "time-management", label: "Time Management", parentId: "ai-office" },
  { id: "meeting-facilitation", label: "Meeting Facilitation", parentId: "ai-office" },
  { id: "presentation", label: "Presentation", parentId: "ai-office" },
  { id: "research", label: "Research" },
  { id: "process-automation", label: "Process Automation", parentId: "ai-office" },
  { id: "customer-communication", label: "Customer Communication", parentId: "communication" },
];

export const AI_TOOL_TAXONOMY: AiToolTag[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "gemini", label: "Gemini" },
  { id: "excel", label: "Excel" },
  { id: "copilot", label: "Copilot" },
  { id: "notebooklm", label: "NotebookLM" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gamma", label: "Gamma" },
  { id: "otter", label: "Otter.ai" },
];

export const SCENARIO_TAXONOMY: ScenarioTag[] = [
  { id: "office-work", label: "Công việc văn phòng" },
  { id: "management", label: "Quản lý" },
  { id: "customer-service", label: "Chăm sóc khách hàng" },
  { id: "research-scenario", label: "Nghiên cứu" },
  { id: "presentation-scenario", label: "Trình bày / Thuyết trình" },
  // Chưa có Seed nào thuộc các scenario dưới đây — giữ trong taxonomy để
  // Collection tương lai (AI Content, AI Marketing, AI Business) dùng lại,
  // không tạo Seed/Collection mới trong Sprint này.
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "affiliate", label: "Affiliate" },
];

export function getSkillLabel(id: string): string {
  return SKILL_TAXONOMY.find((s) => s.id === id)?.label ?? id;
}

export function getAiToolLabel(id: string): string {
  return AI_TOOL_TAXONOMY.find((t) => t.id === id)?.label ?? id;
}

export function getScenarioLabel(id: string): string {
  return SCENARIO_TAXONOMY.find((s) => s.id === id)?.label ?? id;
}
