/**
 * SPRINT R01 — Companion Runtime Integration: Runtime Response.
 *
 * `RuntimeResponse` — SCHEMA nội bộ tổng hợp kết quả 1 lượt chạy Runtime
 * Engine, đúng 6 field theo yêu cầu: `assistantMessage`, `goal`,
 * `strategy`, `learningPlan`, `knowledgeRouting`, `nextAction`.
 *
 * SPRINT R01-FIX — RANH GIỚI NỘI BỘ/PUBLIC: type này (và hàm dựng nó) CHỈ
 * dùng NỘI BỘ phía server — route.ts KHÔNG còn đính field nào của nó vào
 * response JSON trả cho browser. Response public đi qua đúng 1 hàm khác,
 * `buildPublicChatResponse()` (`public-chat-response.ts`), vốn không nhận
 * `RuntimeContext`/`RuntimeResponse` làm tham số nên không có đường nào
 * rò rỉ `goal`/`strategy`/`learningPlan`/`knowledgeRouting`/`nextAction`
 * ra ngoài. Giữ lại type này cho mục đích nội bộ tương lai (log/debug
 * phía server) — không phải hợp đồng public.
 */
import type { Goal } from "../mentor/goal";
import type { GoalPlan } from "../mentor/goal-plan";
import type { ConversationStrategy } from "../mentor/conversation-strategy";
import type { KnowledgeRoutingResult } from "../knowledge/knowledge-routing";
import type { NextAction } from "../memory/next-action";
import type { RuntimeContext } from "./runtime-context";

export type RuntimeResponse = {
  /** Nội dung Companion trả lời — text thô từ ProviderManager (sau khi
      route.ts gọi AI), KHÔNG phải hàng DB `companion_messages`. */
  assistantMessage: string;
  goal: Goal | null;
  strategy: ConversationStrategy;
  learningPlan: GoalPlan | null;
  knowledgeRouting: KnowledgeRoutingResult | null;
  nextAction: NextAction;
};

/** Helper thuần — lắp `RuntimeResponse` từ `RuntimeContext` đã có sẵn +
    nội dung trả lời của AI. Không tính lại/không thêm business logic. */
export function buildRuntimeResponse(context: RuntimeContext, assistantMessage: string): RuntimeResponse {
  return {
    assistantMessage,
    goal: context.goal,
    strategy: context.strategy,
    learningPlan: context.learningPlan,
    knowledgeRouting: context.knowledgeRouting,
    nextAction: context.memory.nextAction,
  };
}
