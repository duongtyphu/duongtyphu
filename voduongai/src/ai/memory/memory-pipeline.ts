/**
 * SPRINT A06 — Memory & Reflection Engine: Memory Pipeline.
 *
 * Nối các mảnh đã có ở A06 thành 1 pipeline:
 * Conversation → Memory Candidate → Memory Classification → Reflection →
 * Progress → Next Action. CHỈ orchestration — không phát minh logic mới,
 * không kết nối Runtime/Goal Runtime/Platform Runtime nào.
 */

import {
  extractMemoryCandidates,
  pickPrimaryMemoryCandidate,
  type Conversation,
  type MemoryCandidate,
} from "./memory-candidate";
import { decideMemoryDecision, type MemoryDecision } from "./memory-policy";
import { createMemoryEntry, type MemoryEntry } from "./memory-model";
import { buildReflection, type ReflectionResult } from "./reflection";
import { buildProgressSnapshot, type ProgressSnapshot } from "./progress";
import { buildNextAction, type NextAction } from "./next-action";

export type MemoryPipelineResult = {
  memoryCandidates: MemoryCandidate[];
  memoryDecision: MemoryDecision;
  reflection: ReflectionResult;
  progress: ProgressSnapshot;
  nextAction: NextAction;
};

/**
 * Helper thuần — chạy trọn 1 lượt pipeline cho 1 `Conversation`.
 * `activeGoals`/`completedGoals` PHẢI do nơi gọi cung cấp (mặc định 0) —
 * pipeline này không tự đọc Goal Runtime. `id`/`timestamp` mỗi
 * `MemoryEntry` suy từ vị trí candidate trong mảng (chuỗi cố định,
 * KHÔNG gọi `Date.now()`/`crypto.randomUUID()`) — chỉ dùng nội bộ để
 * dựng Reflection/Progress, không phải mốc thời gian/ID hệ thống thật.
 * Không mutate `conversation` truyền vào.
 */
export function runMemoryPipeline(
  conversation: Conversation,
  options?: { activeGoals?: number; completedGoals?: number }
): MemoryPipelineResult {
  const memoryCandidates = extractMemoryCandidates(conversation);
  const primary = pickPrimaryMemoryCandidate(memoryCandidates);
  const memoryDecision = decideMemoryDecision(primary);

  const entries: MemoryEntry[] = memoryCandidates
    .filter((c) => c.shouldRemember)
    .map((c, index) =>
      createMemoryEntry({
        id: `${c.type}-${index}`,
        type: c.type,
        title: c.type,
        summary: c.content,
        confidence: c.confidence,
        source: "conversation",
        timestamp: `turn-${index}`,
      })
    );

  const reflection = buildReflection(entries);
  const progress = buildProgressSnapshot({
    activeGoals: options?.activeGoals ?? 0,
    completedGoals: options?.completedGoals ?? 0,
    recentMemoryEntries: entries,
  });
  const nextAction = buildNextAction({ memoryDecision, progress });

  return { memoryCandidates, memoryDecision, reflection, progress, nextAction };
}
