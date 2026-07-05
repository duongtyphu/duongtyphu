/**
 * Sprint 003 — Workspace Runtime Integration — Memory Sync.
 *
 * Memory Contract: sau khi Output hoàn thành vào Portfolio ("Complete"
 * trong Runtime Flow), Workspace ghi lại 5 trường — Learning/Reflection/
 * Knowledge/Best Practice/Capability Improvement — TỪ DỮ LIỆU THẬT đã
 * có (Reflection Owner đã gửi + Reviewer Agent review + Portfolio
 * `capabilityMapping`), không suy diễn/bịa nội dung. Không tạo bảng lưu
 * trữ song song với Output/Portfolio — Memory chỉ tham chiếu
 * `outputId`/`portfolioItemId`, không copy nội dung Output đầy đủ (Single
 * Source of Truth, giống nguyên tắc đã khóa ở `portfolio-store.ts`).
 */

import type { OutputRecord } from "./workspace-session-store";
import type { PortfolioItemRecord } from "./portfolio-store";
import { emitGrowthEvent } from "./growth-event-bus";

export type MemoryEntry = {
  memoryId: string;
  outputId: string;
  portfolioItemId: string;
  sessionId: string;
  /** Owner đã học được gì — lấy nguyên văn từ Reflection thật đã gửi, không diễn giải lại. */
  learning: string;
  /** Câu hỏi + câu trả lời Reflection đầy đủ (bằng chứng thô). */
  reflection: string;
  /** Tri thức liên quan — Competency/Mission Output này thuộc về. */
  knowledge: string;
  /** Điều gì đã làm tốt — lấy từ `agentReview.strengths` nếu có Reviewer Agent đã chạy; rỗng nếu chưa có. */
  bestPractice: string;
  /** Năng lực nào được cải thiện — map trực tiếp từ `portfolioItem.capabilityMapping`. */
  capabilityImprovement: string;
  createdAt: string;
};

const MEMORY_KEY = "vdai_memory_entries";
const MAX_ENTRIES = 500;

function readAll(): MemoryEntry[] {
  try {
    const raw = window.localStorage.getItem(MEMORY_KEY);
    return raw ? (JSON.parse(raw) as MemoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: MemoryEntry[]): void {
  try {
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch {
    // localStorage đầy/không khả dụng — Memory chỉ mất khả năng lưu lâu dài, không vỡ Runtime.
  }
}

export function listMemoryEntries(sessionId?: string): MemoryEntry[] {
  const entries = readAll();
  return sessionId ? entries.filter((e) => e.sessionId === sessionId) : entries;
}

/**
 * Đồng bộ Memory ngay sau khi 1 Output hoàn thành vào Portfolio — gọi
 * đúng 1 lần/Portfolio Item (idempotent theo `portfolioItemId`, không
 * ghi trùng nếu gọi lại nhiều lần cho cùng 1 item).
 */
export function syncMemoryForPortfolioItem(portfolioItem: PortfolioItemRecord, output: OutputRecord): MemoryEntry {
  const existing = readAll().find((e) => e.portfolioItemId === portfolioItem.portfolioItemId);
  if (existing) return existing;

  const reflectionText = output.reflections.map((r) => `${r.question} ${r.answer}`).join(" | ");
  const learning = output.reflections.map((r) => r.answer).join(" ") || "Chưa có Reflection.";
  const bestPractice = output.agentReview?.strengths.join("; ") ?? "";
  const knowledge = portfolioItem.missionId
    ? `Golden Mission: ${portfolioItem.missionId}`
    : `Competency: ${(portfolioItem.capabilityMapping ?? []).join(", ") || "chưa xác định"}`;

  const entry: MemoryEntry = {
    memoryId: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    outputId: output.outputId,
    portfolioItemId: portfolioItem.portfolioItemId,
    sessionId: portfolioItem.sessionId,
    learning,
    reflection: reflectionText,
    knowledge,
    bestPractice,
    capabilityImprovement: (portfolioItem.capabilityMapping ?? []).join(", "),
    createdAt: new Date().toISOString(),
  };

  writeAll([...readAll(), entry]);
  emitGrowthEvent({ eventType: "MEMORY_UPDATED", workspaceSessionId: portfolioItem.sessionId, outputId: output.outputId, missionId: portfolioItem.missionId });
  return entry;
}
