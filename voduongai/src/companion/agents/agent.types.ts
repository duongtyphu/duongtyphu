/**
 * Companion Orchestration System™ — Product Amendment 02.
 *
 * AI Agent ở đây KHÔNG phải tính năng, KHÔNG phải trang riêng, KHÔNG phải
 * tool người dùng tự chọn. Đây là mô tả (metadata) về đội ngũ chuyên gia
 * đứng sau Companion — chỉ Companion mới đọc và chọn Agent, người dùng
 * không bao giờ thấy danh sách này như một menu.
 *
 * Nền tảng này rule-based hoàn toàn (chưa gọi AI thật) — xem
 * `companion-orchestrator.ts` và `orchestration-rules.ts`.
 */

/** 8 khu vực Portal có Companion điều phối, theo Product Amendment 02. */
export type PortalModule =
  | "khong-gian-ai"
  | "ckos"
  | "academy"
  | "opportunities"
  | "premium"
  | "learning-journal"
  | "my-journey"
  | "living-garden";

export type AgentOutputType =
  | "guidance"
  | "content"
  | "analysis"
  | "plan"
  | "summary"
  | "narrative"
  | "visualization";

/** Trạng thái sẵn sàng của Agent trong registry — không phải trạng thái chạy việc (xem PlanStep). */
export type AgentStatus = "active" | "planned";

export type CompanionAgent = {
  id: string;
  name: string;
  role: string;
  module: PortalModule;
  /** Những việc Agent này có thể làm giúp Companion. */
  capabilities: string[];
  /** Ngữ cảnh/tình huống khiến Companion cân nhắc mời Agent này. */
  triggerContext: string[];
  outputType: AgentOutputType;
  status: AgentStatus;
};
