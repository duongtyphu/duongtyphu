/**
 * PHASE 4 EPIC 01 — ProviderExecutionLog.
 *
 * Log server-side, trong bộ nhớ tiến trình (process-local) — đủ cho môi
 * trường dev/sandbox hiện tại. KHÔNG phải database — nếu triển khai
 * production nhiều instance/serverless, Sprint sau cần thay bằng lưu
 * trữ bền vững (ngoài phạm vi EPIC 01). Không log nội dung `raw`/prompt
 * đầy đủ (tránh lưu dữ liệu nhạy cảm không cần thiết) — chỉ log metadata.
 */
import "server-only";

export type ProviderExecutionLogEntry = {
  providerId: string;
  capability: string;
  taskType: string;
  success: boolean;
  isMock: boolean;
  latencyMs: number;
  error?: string;
  at: string;
};

const MAX_ENTRIES = 1000;
let entries: ProviderExecutionLogEntry[] = [];

export function recordExecution(entry: ProviderExecutionLogEntry): void {
  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);
}

export function listExecutions(providerId?: string): ProviderExecutionLogEntry[] {
  return providerId ? entries.filter((e) => e.providerId === providerId) : [...entries];
}

/** Chỉ dùng cho test — reset log giữa các test case. */
export function __resetExecutionLogForTest(): void {
  entries = [];
}
