/**
 * SPRINT R01 — Companion Runtime Integration: Runtime Orchestrator.
 *
 * `CompanionRuntimeEngine` — ĐIỂM DUY NHẤT orchestration nối Chat Runtime
 * thật (`src/app/api/companion/chat/route.ts`) với Companion Brain
 * (A02-A06). route.ts KHÔNG được gọi thẳng từng module `ai/mentor`/
 * `ai/platform`/`ai/knowledge`/`ai/memory` — mọi lời gọi đi qua đây.
 *
 * Trách nhiệm: load conversation → detect goal → build learning plan →
 * choose strategy → platform awareness → knowledge routing → memory →
 * reflection → build `RuntimeContext`. CHỈ orchestration — tái dùng
 * nguyên các pipeline đã có sẵn (`runMentorPipeline` A04,
 * `buildPlatformContext` A05, `routeKnowledge` A05, `runMemoryPipeline`
 * A06), không phát minh logic Goal/Memory/Platform/Knowledge mới ở đây.
 *
 * SPRINT R02 — CKOS & Platform Data Integration: thêm bước
 * KnowledgeNeed (đã có sẵn trong `knowledgeRouting`, A05) → Knowledge
 * Resolver (`ai/catalog/knowledge-resolver.ts`, đã lọc Permission) →
 * Mentor Context (`ai/catalog/mentor-context.ts`) — kết quả trả ra
 * SIBLING với `context` (KHÔNG nhét vào 8 field cố định của
 * `RuntimeContext`, giữ nguyên contract R01), đúng thứ tự Phần 6
 * "System → Runtime Context → Knowledge Package → Conversation". Engine
 * KHÔNG tự đọc Catalog/Supabase — `input.catalog` PHẢI do nơi gọi cung
 * cấp (xem field đó bên dưới).
 *
 * SPRINT FIX-R02 — Published Knowledge Adapter: `input.catalog` giờ
 * ĐƯỢC nơi gọi (route.ts) truyền vào THẬT (qua `CatalogProvider ↓
 * Published Catalog`, xem `ai/catalog/catalog-provider.ts`), thay vì
 * luôn `[]` như giới hạn đã biết ở R02. Chữ ký/kiến trúc hàm này KHÔNG
 * đổi — vẫn nhận `catalog?: KnowledgeCatalog` như 1 mảng đã resolve sẵn,
 * vẫn đồng bộ (synchronous), vẫn không tự biết/không tự đọc Supabase —
 * đúng yêu cầu "Không sửa: Runtime Engine architecture". Đổi duy nhất:
 * `knowledgePackage` (kết quả trả ra) đổi tên thành `mentorContext`
 * ("Không đổi dữ liệu. Chỉ đổi abstraction.").
 *
 * KHÁC các namespace A02-A06 (pure, không side-effect): đây là tầng tích
 * hợp Runtime — được phép dùng `Date.now()`/`new Date()` để đo latency
 * từng giai đoạn + ghi log (Sprint R01 Phần 6), đúng vị trí "caller cung
 * cấp timestamp" đã xác lập từ A02 (`createGoal({id, ...})`)/A06
 * (`MemoryEntry.timestamp` do caller truyền) — timestamp KHÔNG được sinh
 * bên trong 4 namespace pure đó.
 *
 * SPRINT R01-FIX: "memory"/"reflection" trong `RuntimeContext` (kết quả
 * `runMemoryPipeline()`) CHỈ là phân tích tạm thời cho ĐÚNG 1 lượt gọi
 * này — tính lại từ `input.conversation` mỗi lần, không đọc/ghi Database,
 * không phải long-term/persisted memory, không có bảng nào lưu kết quả
 * này giữa các lượt chat. Không đi vào response public (xem
 * `public-chat-response.ts`).
 */
import "server-only";

import { runMentorPipeline } from "../mentor/mentor-pipeline";
import type { MentorState } from "../mentor/mentor-state";
import { buildPlatformContext } from "../platform/platform-context";
import { routeKnowledge } from "../knowledge/knowledge-routing";
import { runMemoryPipeline } from "../memory/memory-pipeline";
import type { KnowledgeCatalog } from "../catalog/knowledge-catalog";
import { resolveKnowledgeNeed } from "../catalog/knowledge-resolver";
import { buildMentorContext, type MentorContext } from "../catalog/mentor-context";
import type { RuntimeContext, RuntimeConversation } from "./runtime-context";
import { recordRuntimeExecution, type RuntimeStageLatencyMs } from "./runtime-execution-log";

export type CompanionRuntimeEngineInput = {
  /** Chỉ dùng để tương quan log (Phần 6) — KHÔNG log nội dung hội thoại. */
  conversationId: string;
  /** Lịch sử + tin nhắn mới nhất của người dùng, đã gộp thành 1
      `RuntimeConversation` — nơi gọi (route.ts) chịu trách nhiệm gộp. */
  conversation: RuntimeConversation;
  /** Trạng thái Mentor của lượt trước — Chat Runtime hiện CHƯA lưu trạng
      thái này giữa các lượt (giới hạn đã biết, ngoài phạm vi R01: không
      migration/Database) — mặc định `"greeting"` mỗi lượt. */
  mentorState?: MentorState;
  /** "Khu vực nền tảng hiện tại" — Chat Runtime hiện chưa có tín hiệu này
      (không route/trang nào truyền vào) — mặc định `null`, tài liệu hoá
      như giới hạn đã biết, KHÔNG tự suy đoán. */
  currentAreaId?: string | null;
  /** R01 CẤM đụng Goal Runtime — 2 số này PHẢI do nơi gọi cung cấp thật
      nếu có; mặc định `0`/`0` (giới hạn đã biết, chờ Goal Runtime nối vào
      ở Sprint sau). */
  activeGoals?: number;
  completedGoals?: number;
  /** SPRINT R02 — Knowledge Catalog (metadata Published only). Engine
      KHÔNG tự đọc Supabase/DB — Catalog PHẢI do nơi gọi cung cấp sẵn.
      Mặc định `[]` nếu không truyền (vd. test thuần không cần Catalog
      thật). SPRINT FIX-R02 — route.ts giờ truyền Published Catalog THẬT
      vào đây (qua `publishedCatalogProvider.getCatalog()`), không còn
      luôn `[]` như giới hạn đã biết ở R02. */
  catalog?: KnowledgeCatalog;
  /** SPRINT R02 Phần 7 — quyền truy cập Premium của user hiện tại, do nơi
      gọi xác định (Engine không tự kiểm tra quyền/đọc DB). Mặc định
      `false` — an toàn hơn (không có quyền) cho tới khi được xác nhận rõ
      ràng, đúng nguyên tắc "không bypass Permission". */
  hasPremiumAccess?: boolean;
};

export type CompanionRuntimeEngineResult = {
  context: RuntimeContext;
  /** SPRINT R02 — kết quả Knowledge Resolver + Content Selection, đã lọc
      Permission (Published/public hoặc user có quyền, không bao giờ có
      Internal). `CompanionPromptBuilder` (Phần 6) đọc field này, KHÔNG tự
      đọc Catalog/CKOS nào khác. SPRINT FIX-R02 — đổi tên từ
      `knowledgePackage` ("Không đổi dữ liệu. Chỉ đổi abstraction."). */
  mentorContext: MentorContext;
};

/**
 * Chạy trọn pipeline Companion Brain cho 1 lượt chat, trả về
 * `RuntimeContext` để `CompanionPromptBuilder` dùng dựng prompt. Đồng thời
 * ghi 1 dòng Runtime Execution Log (Phần 6) — không log prompt/nội dung
 * hội thoại đầy đủ, chỉ log tín hiệu cấu trúc (category/kind/id/status) +
 * latency từng giai đoạn.
 */
export function runCompanionRuntimeEngine(input: CompanionRuntimeEngineInput): CompanionRuntimeEngineResult {
  const totalStart = Date.now();

  const mentorStart = Date.now();
  const mentorResult = runMentorPipeline(input.conversation, input.mentorState ?? "greeting");
  const mentorMs = Date.now() - mentorStart;

  const platformStart = Date.now();
  const currentAreaId = input.currentAreaId ?? null;
  const platformContext = buildPlatformContext(currentAreaId);
  const platformMs = Date.now() - platformStart;

  const knowledgeStart = Date.now();
  const knowledgeRouting = mentorResult.detectedGoal
    ? routeKnowledge({ goal: mentorResult.detectedGoal, strategy: mentorResult.strategy, currentAreaId })
    : null;
  const knowledgeMs = Date.now() - knowledgeStart;

  const memoryStart = Date.now();
  const memoryResult = runMemoryPipeline(input.conversation, {
    activeGoals: input.activeGoals ?? 0,
    completedGoals: input.completedGoals ?? 0,
  });
  const memoryMs = Date.now() - memoryStart;

  // SPRINT R02 — Knowledge Resolver: KnowledgeNeed (đã có sẵn trong
  // knowledgeRouting, A05) → KnowledgeResolution → MentorContext. Chỉ
  // đọc `input.catalog` (do nơi gọi cung cấp) — không tự đọc Supabase/DB.
  const knowledgeNeed = knowledgeRouting?.knowledgeNeed ?? null;
  const knowledgeResolution = resolveKnowledgeNeed(input.catalog ?? [], knowledgeNeed, {
    hasPremiumAccess: input.hasPremiumAccess ?? false,
  });
  const mentorContext = buildMentorContext(knowledgeResolution);

  const context: RuntimeContext = {
    conversation: input.conversation,
    goal: mentorResult.detectedGoal,
    learningPlan: mentorResult.goalPlan,
    strategy: mentorResult.strategy,
    platformContext,
    knowledgeRouting,
    memory: {
      candidates: memoryResult.memoryCandidates,
      decision: memoryResult.memoryDecision,
      progress: memoryResult.progress,
      nextAction: memoryResult.nextAction,
    },
    reflection: memoryResult.reflection,
  };

  const latencyMs: RuntimeStageLatencyMs = {
    mentor: mentorMs,
    platform: platformMs,
    knowledge: knowledgeMs,
    memory: memoryMs,
    total: Date.now() - totalStart,
  };

  recordRuntimeExecution({
    conversationId: input.conversationId,
    goalCategory: mentorResult.detectedGoal?.category ?? null,
    goalConfidence: mentorResult.detectedGoal?.confidence ?? null,
    strategyKind: mentorResult.strategy.kind,
    knowledgeRouted: knowledgeRouting?.primaryRoute !== null && knowledgeRouting !== null,
    primaryPlatformAreaId: knowledgeRouting?.primaryRoute?.platformAreaId ?? null,
    memoryDecisionStatus: memoryResult.memoryDecision.status,
    nextActionType: memoryResult.nextAction.actionType,
    latencyMs,
    at: new Date().toISOString(),
  });

  return { context, mentorContext };
}

export const CompanionRuntimeEngine = { run: runCompanionRuntimeEngine };
