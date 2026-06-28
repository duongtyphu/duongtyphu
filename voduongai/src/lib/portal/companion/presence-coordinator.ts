/**
 * Presence Coordinator (Sprint 18.8). Xem `docs/PRESENCE_COORDINATOR.md`.
 *
 * KHÔNG phải một engine nói mới, KHÔNG phải một event bus. Mỗi engine hiện
 * có (Life Moments, Return After Silence, Daily Thought, Proactive Thought,
 * Greeting, Story Matching, Micro Reaction) vẫn tự quyết định nội dung của
 * moment nó tạo ra, ở đúng nơi nó đang sống hôm nay (server hoặc client).
 *
 * File này chỉ làm một việc: gom các candidate đó — kể cả những candidate
 * sống ở phía server (Life Moment, Return After Silence) tách biệt khỏi cây
 * client-state của `CompanionPresence.tsx` — về một shape thống nhất
 * (`CompanionPresenceCandidate`), rồi đưa thẳng vào
 * `chooseCompanionMoment()` (`thought-governance.ts`, Sprint 18.6) đã có
 * sẵn. Một dòng quyết định hiện diện duy nhất, không phải hai.
 */

import type { LifeMoment } from "@/lib/portal/life-moments/life-moments";
import type { CompanionThought } from "@/lib/portal/companion/proactive-thoughts";
import type { LivingStory } from "@/lib/portal/companion/living-stories";
import {
  chooseCompanionMoment,
  type CompanionMomentCandidate,
  type CompanionMomentDecision,
  type CompanionMomentType,
  type CompanionSpeechBudget,
} from "@/lib/portal/companion/thought-governance";

/**
 * 8 nguồn candidate ban đầu (NV01) — đúng danh sách đã định nghĩa, không
 * thêm tuỳ ý. `origin_line` chưa có engine nào thực sự kích hoạt nó như một
 * moment hiện diện tự phát hôm nay (xem `origin-memory.ts`) — candidate của
 * nó luôn `isEligible: false`, một giới hạn được công khai, không che giấu.
 */
export type PresenceCandidateSource =
  | "life_moment"
  | "return_after_silence"
  | "daily_thought"
  | "proactive_thought"
  | "greeting"
  | "story_moment"
  | "micro_reaction"
  | "origin_line";

export type PresenceCandidatePayload =
  | { source: "life_moment"; moment: LifeMoment }
  | { source: "return_after_silence"; milestoneOccurredAt: string }
  | { source: "daily_thought" | "proactive_thought"; thought: CompanionThought }
  | { source: "story_moment"; story: LivingStory }
  | { source: "greeting" }
  | { source: "micro_reaction"; line: string }
  | { source: "origin_line" };

/** Shape thống nhất một candidate hiện diện, bất kể nó sinh ra ở server hay client. */
export type CompanionPresenceCandidate = {
  source: PresenceCandidateSource;
  momentType: CompanionMomentType;
  isEligible: boolean;
  isMajor: boolean;
  payload?: PresenceCandidatePayload;
};

/**
 * Dữ liệu phía server — đã fetch sẵn ở `layout.tsx`, KHÔNG query lại DB ở
 * client (NV02). `null`/`undefined` nghĩa là tín hiệu đó chưa xảy ra.
 */
export type PresenceServerState = {
  lifeMoment: LifeMoment | null;
  lifeMomentEligible: boolean;
  returnAfterSilenceMilestone: string | null;
  returnAfterSilenceEligible: boolean;
};

/** Dữ liệu phía client — trạng thái session/UI hiện có ở `CompanionPresence.tsx`. */
export type PresenceClientState = {
  isSpaceOpen: boolean;
  isMinimized: boolean;
  thought: CompanionThought | null;
  story: LivingStory | null;
  microLine: string | null;
  hasGreeting: boolean;
};

export type PresenceCoordinatorContext = {
  now: number;
  server: PresenceServerState;
  client: PresenceClientState;
};

/**
 * NV03 — Candidate Adapter: chuyển từng nguồn (server hoặc client) thành
 * `CompanionPresenceCandidate`, không sửa engine gốc của nguồn đó.
 */
export function buildPresenceCandidates(context: PresenceCoordinatorContext): CompanionPresenceCandidate[] {
  const { server, client } = context;

  const candidates: CompanionPresenceCandidate[] = [
    {
      source: "life_moment",
      momentType: "life-moment",
      isEligible: !!server.lifeMoment && server.lifeMomentEligible,
      isMajor: true,
      payload: server.lifeMoment ? { source: "life_moment", moment: server.lifeMoment } : undefined,
    },
    {
      source: "return_after_silence",
      momentType: "return-after-silence",
      isEligible: !!server.returnAfterSilenceMilestone && server.returnAfterSilenceEligible,
      isMajor: true,
      payload: server.returnAfterSilenceMilestone
        ? { source: "return_after_silence", milestoneOccurredAt: server.returnAfterSilenceMilestone }
        : undefined,
    },
    {
      source: "daily_thought",
      momentType: "daily-thought",
      isEligible: !!client.thought && client.thought.trigger === "daily-thought",
      isMajor: true,
      payload: client.thought ? { source: "daily_thought", thought: client.thought } : undefined,
    },
    {
      source: "proactive_thought",
      momentType: "proactive-thought",
      isEligible: !!client.thought && client.thought.trigger !== "daily-thought",
      isMajor: true,
      payload: client.thought ? { source: "proactive_thought", thought: client.thought } : undefined,
    },
    {
      source: "story_moment",
      momentType: "story-moment",
      isEligible: !!client.story,
      isMajor: true,
      payload: client.story ? { source: "story_moment", story: client.story } : undefined,
    },
    {
      source: "greeting",
      momentType: "greeting",
      isEligible: client.hasGreeting,
      isMajor: false,
      payload: client.hasGreeting ? { source: "greeting" } : undefined,
    },
    {
      source: "micro_reaction",
      momentType: "micro-reaction",
      isEligible: !!client.microLine,
      isMajor: false,
      payload: client.microLine ? { source: "micro_reaction", line: client.microLine } : undefined,
    },
    // Sprint 18.8 — chưa có engine nào tạo Origin Line như một moment hiện
    // diện tự phát; giữ candidate ở đây để registry đủ 8 nguồn theo brief,
    // nhưng luôn không đủ điều kiện cho tới khi engine đó thật sự tồn tại.
    {
      source: "origin_line",
      momentType: "origin-line",
      isEligible: false,
      isMajor: true,
    },
  ];

  return candidates;
}

export type PresenceDecisionResult = {
  decision: CompanionMomentDecision;
  candidates: CompanionPresenceCandidate[];
};

/**
 * NV04 — Governance Integration: gom candidate rồi đưa thẳng vào
 * `chooseCompanionMoment()` đã có sẵn (Sprint 18.6) — không có ma trận xung
 * đột riêng ở đây, vì single-priority-wins của governance đã tự giải quyết
 * mọi cặp xung đột (Life Moment vs Daily Thought, Return After Silence vs
 * Greeting, Story Moment vs Proactive Thought,...).
 */
export function choosePresenceMoment(
  context: PresenceCoordinatorContext,
  budget?: CompanionSpeechBudget
): PresenceDecisionResult {
  const candidates = buildPresenceCandidates(context);
  const momentCandidates: CompanionMomentCandidate[] = candidates.map((c) => ({
    type: c.momentType,
    isEligible: c.isEligible,
    isMajor: c.isMajor,
  }));
  const decision = chooseCompanionMoment(momentCandidates, context.now, budget);

  if (process.env.NODE_ENV === "development") {
    // NV06 — Lightweight Debug Mode: chỉ log candidate/chosen/reason/suppressed,
    // không log dữ liệu nhạy cảm (không log nội dung câu nói/profile người dùng).
    console.debug("[presence-coordinator]", {
      candidates: candidates.map((c) => ({ source: c.source, momentType: c.momentType, isEligible: c.isEligible })),
      chosen: decision.chosen,
      reason: decision.reason,
      suppressed: decision.suppressed,
    });
  }

  return { decision, candidates };
}

export function presenceCandidateBySource(
  candidates: CompanionPresenceCandidate[],
  source: PresenceCandidateSource
): CompanionPresenceCandidate | undefined {
  return candidates.find((c) => c.source === source);
}
