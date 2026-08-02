/**
 * SPRINT R01 — Companion Runtime Integration: Runtime Execution Log.
 *
 * Log riêng cho `CompanionRuntimeEngine` (Phần 6 của brief) — TÁCH BIỆT
 * `provider-execution-log.ts` (log lời gọi AI Provider, thuộc Provider
 * Architecture — R01 cấm sửa). Cùng nguyên tắc process-local, in-memory,
 * đủ cho dev/sandbox hiện tại (không phải audit log bền vững — Sprint sau
 * nếu cần production nhiều instance/serverless).
 *
 * TUYỆT ĐỐI KHÔNG log: nội dung hội thoại, prompt, `Goal.title`/
 * `description` (văn bản tự do từ người dùng), nội dung Memory Candidate.
 * Chỉ log tín hiệu CẤU TRÚC (enum/id/số) — category, confidence (số),
 * kind, id khu vực nền tảng (cố định trong `platform-tree.ts`, không phải
 * dữ liệu người dùng), status, latency.
 */
import "server-only";

export type RuntimeStageLatencyMs = {
  mentor: number;
  platform: number;
  knowledge: number;
  memory: number;
  total: number;
};

export type RuntimeExecutionLogEntry = {
  conversationId: string;
  goalCategory: string | null;
  goalConfidence: number | null;
  strategyKind: string;
  knowledgeRouted: boolean;
  primaryPlatformAreaId: string | null;
  memoryDecisionStatus: string;
  nextActionType: string;
  latencyMs: RuntimeStageLatencyMs;
  at: string;
};

const MAX_ENTRIES = 1000;
let entries: RuntimeExecutionLogEntry[] = [];

export function recordRuntimeExecution(entry: RuntimeExecutionLogEntry): void {
  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);
}

export function listRuntimeExecutions(conversationId?: string): RuntimeExecutionLogEntry[] {
  return conversationId ? entries.filter((e) => e.conversationId === conversationId) : [...entries];
}

/** Chỉ dùng cho test — reset log giữa các test case. */
export function __resetRuntimeExecutionLogForTest(): void {
  entries = [];
}
