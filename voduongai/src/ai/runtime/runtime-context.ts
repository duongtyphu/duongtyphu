/**
 * SPRINT R01 — Companion Runtime Integration: Runtime Context.
 *
 * `RuntimeContext` là SCHEMA DUY NHẤT nối Chat Runtime thật với Companion
 * Brain (A02-A06: `ai/mentor`, `ai/platform`, `ai/knowledge`, `ai/memory`).
 * CHỈ định nghĩa type — không business logic (logic thuộc về
 * `CompanionRuntimeEngine`, xem `companion-runtime-engine.ts`).
 *
 * Đúng 8 field theo yêu cầu Sprint R01, không thêm field nào khác:
 * `conversation`, `goal`, `learningPlan`, `strategy`, `platformContext`,
 * `knowledgeRouting`, `memory`, `reflection`.
 */

import type { Goal } from "../mentor/goal";
import type { GoalPlan } from "../mentor/goal-plan";
import type { ConversationStrategy } from "../mentor/conversation-strategy";
import type { PlatformContext } from "../platform/platform-context";
import type { KnowledgeRoutingResult } from "../knowledge/knowledge-routing";
import type { MemoryCandidate } from "../memory/memory-candidate";
import type { MemoryDecision } from "../memory/memory-policy";
import type { ProgressSnapshot } from "../memory/progress";
import type { NextAction } from "../memory/next-action";
import type { ReflectionResult } from "../memory/reflection";

/** 1 lượt nói — shape tối thiểu, KHÔNG import từ `ai/mentor`/`ai/memory`
    (2 namespace đó cố tình khai báo `Conversation` độc lập với nhau, xem
    A02/A06) — cùng shape nên gán trực tiếp được, không cần hàm chuyển đổi. */
export type RuntimeConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

export type RuntimeConversation = {
  turns: RuntimeConversationTurn[];
};

/**
 * Phần "memory" của `RuntimeContext` — TÁCH `reflection` ra field riêng
 * (yêu cầu Sprint R01 liệt kê 2 field độc lập), 4 field còn lại của
 * `MemoryPipelineResult` (`ai/memory/memory-pipeline.ts`) giữ nguyên.
 *
 * SPRINT R01-FIX — LƯU Ý QUAN TRỌNG VỀ TÊN GỌI: "Memory Pipeline" ở R01
 * CHỈ là PHÂN TÍCH TẠM THỜI trong phạm vi 1 request — suy ra từ đúng
 * `RuntimeConversation` (lịch sử + tin nhắn hiện tại) truyền vào lượt gọi
 * này, tính lại từ đầu mỗi lần, KHÔNG đọc/ghi bất kỳ đâu. Đây KHÔNG PHẢI
 * "long-term memory" hay "persisted memory" — không có bảng Database
 * nào lưu `MemoryCandidate`/`MemoryDecision`/`NextAction` giữa các lượt
 * chat, không migration nào được thêm ở R01/R01-FIX. Kết quả `memory` bị
 * huỷ hoàn toàn cuối mỗi request (KHÔNG đi vào response public — xem
 * `public-chat-response.ts`) — chỉ dùng nội bộ để `CompanionPromptBuilder`
 * dựng "Bối cảnh người học" cho đúng lượt chat hiện tại.
 */
export type RuntimeMemoryContext = {
  candidates: MemoryCandidate[];
  decision: MemoryDecision;
  progress: ProgressSnapshot;
  nextAction: NextAction;
};

export type RuntimeContext = {
  conversation: RuntimeConversation;
  /** `null` khi Goal Detection chưa nhận diện được mục tiêu nào từ hội
      thoại hiện tại — trung thực, không bịa Goal giả. */
  goal: Goal | null;
  /** `null` khi `goal` là `null` (không có Goal thì không có kế hoạch). */
  learningPlan: GoalPlan | null;
  strategy: ConversationStrategy;
  platformContext: PlatformContext;
  /** `null` khi `goal` là `null` — `routeKnowledge()` (A05) yêu cầu 1
      `Goal` cụ thể, không đoán route khi chưa có mục tiêu. */
  knowledgeRouting: KnowledgeRoutingResult | null;
  memory: RuntimeMemoryContext;
  /** Cùng bản chất "phân tích tạm thời theo request" như `memory` ở trên
      — suy từ `conversation` hiện tại, không đọc/ghi Database, không phải
      long-term memory. Xem ghi chú đầy đủ tại `RuntimeMemoryContext`. */
  reflection: ReflectionResult;
};
