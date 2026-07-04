/**
 * AI Agent Integration MVP — Agent Run Log.
 *
 * Ghi lại từng lần Writer/Reviewer Agent chạy — chỉ 2 Agent trong MVP
 * này (không thêm Agent khác). Emit `AGENT_RUN_STARTED`/
 * `AGENT_RUN_COMPLETED`/`AGENT_RUN_FAILED` qua Growth Event Bus đã khóa
 * (không tạo Event Bus riêng).
 */

import { emitGrowthEvent } from "./growth-event-bus";

export type AgentRole = "Writer Agent" | "Reviewer Agent";
export type AgentRunStatus = "running" | "completed" | "failed";

export type AgentRunRecord = {
  runId: string;
  sessionId: string;
  outputId?: string;
  agentRole: AgentRole;
  status: AgentRunStatus;
  startedAt: string;
  completedAt?: string;
  error?: string;
  isMock?: boolean;
};

const AGENT_RUNS_KEY = "vdai_agent_runs";
const MAX_RUNS = 500;

function readAll(): AgentRunRecord[] {
  try {
    const raw = window.localStorage.getItem(AGENT_RUNS_KEY);
    return raw ? (JSON.parse(raw) as AgentRunRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(runs: AgentRunRecord[]) {
  try {
    window.localStorage.setItem(AGENT_RUNS_KEY, JSON.stringify(runs.slice(-MAX_RUNS)));
  } catch {
    // localStorage đầy/không khả dụng — Agent Run Log chỉ mất khả năng lưu lâu dài.
  }
}

export function listAgentRuns(sessionId: string): AgentRunRecord[] {
  return readAll().filter((r) => r.sessionId === sessionId);
}

export function startAgentRun(sessionId: string, agentRole: AgentRole, outputId?: string): AgentRunRecord {
  const run: AgentRunRecord = {
    runId: `agentrun_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sessionId,
    outputId,
    agentRole,
    status: "running",
    startedAt: new Date().toISOString(),
  };
  writeAll([...readAll(), run]);
  emitGrowthEvent({ eventType: "AGENT_RUN_STARTED", workspaceSessionId: sessionId, outputId });
  return run;
}

export function completeAgentRun(runId: string, isMock: boolean): AgentRunRecord | null {
  const all = readAll();
  const idx = all.findIndex((r) => r.runId === runId);
  if (idx < 0) return null;
  const updated: AgentRunRecord = { ...all[idx], status: "completed", completedAt: new Date().toISOString(), isMock };
  all[idx] = updated;
  writeAll(all);
  emitGrowthEvent({ eventType: "AGENT_RUN_COMPLETED", workspaceSessionId: updated.sessionId, outputId: updated.outputId });
  return updated;
}

export function failAgentRun(runId: string, error: string): AgentRunRecord | null {
  const all = readAll();
  const idx = all.findIndex((r) => r.runId === runId);
  if (idx < 0) return null;
  const updated: AgentRunRecord = { ...all[idx], status: "failed", completedAt: new Date().toISOString(), error };
  all[idx] = updated;
  writeAll(all);
  emitGrowthEvent({ eventType: "AGENT_RUN_FAILED", workspaceSessionId: updated.sessionId, outputId: updated.outputId });
  return updated;
}
