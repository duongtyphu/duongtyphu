import { describe, it, expect, beforeEach, vi } from "vitest";
import { startCompanionWorkspace, readWorkspaceContext } from "@/lib/portal/companion-workspace";
import {
  findResumableSession,
  createSession,
  runCompanionAgentForOutput,
  runReviewerAgentForOutput,
  approveOutput,
  submitReflection,
} from "@/lib/portal/foundation/workspace-session-store";
import { activateWave1Companions } from "@/lib/portal/foundation/workforce-registry";
import { promoteEligibleOutputs, listPortfolioItems } from "@/lib/portal/foundation/portfolio-store";
import { syncMemoryForPortfolioItem, listMemoryEntries } from "@/lib/portal/foundation/memory-store";
import { readGrowthEvents } from "@/lib/portal/foundation/growth-event-bus";

/**
 * PHASE 4 SPRINT 003 — Workspace Runtime Integration.
 *
 * End-to-End đúng Runtime Flow của brief:
 * Owner → Goal → Companion → Blueprint → Task → Department → AI Companion
 * → AI Service Manager → Provider → Output → Review → Owner Approval →
 * Portfolio → Memory.
 *
 * `global.fetch` mock giả lập `/api/ai/workforce` (ranh giới mạng duy
 * nhất — không có API key thật trong sandbox) — toàn bộ logic Workforce
 * Registry/Companion Manager/Workspace Session/Portfolio/Memory là code
 * sản xuất thật, không mock.
 */
describe("PHASE 4 SPRINT 003 — Workspace Runtime Integration (E2E)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Goal "Tạo bài Facebook giới thiệu VO DUONG AI" chạy trọn Runtime Flow tới Portfolio + Memory', async () => {
    const fetchMock = vi.fn(async (_url: string, options: RequestInit) => {
      const body = JSON.parse(options.body as string) as { agentRole: string; capabilityId?: string };
      if (body.agentRole === "companion-task" && body.capabilityId === "writing.draft") {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            result: {
              raw: "🚀 VO DUONG AI — Hệ điều hành giúp bạn đạt mục tiêu bằng AI. Học thật, làm thật, có Companion đồng hành.",
              model: "mock-model",
              providerId: "mock",
              isMock: true,
            },
          }),
        } as Response;
      }
      if (body.agentRole === "reviewer") {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            result: {
              strengths: ["Ngắn gọn, đúng thông điệp"],
              issues: [],
              suggestedImprovements: ["Có thể thêm CTA rõ hơn"],
              approvalRecommendation: "approve",
              versionSuggestion: "Giữ nguyên",
              isMock: true,
            },
          }),
        } as Response;
      }
      throw new Error(`agentRole/capabilityId không hợp lệ trong test: ${JSON.stringify(body)}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    // Owner → Goal → Companion → Blueprint (Facebook Content Blueprint, missionId đã map).
    const url = startCompanionWorkspace({
      module: "khong-gian-ai",
      source: "recommended-workspace",
      itemId: "viet-bai-facebook",
      itemType: "workspace",
      title: "Facebook Content Blueprint",
      userGoal: "Tạo bài Facebook giới thiệu VO DUONG AI",
      missionId: "viet-content-facebook",
    });
    expect(url).toContain("/portal/workspace");

    const context = readWorkspaceContext()!;
    const session = findResumableSession(context) ?? createSession(context);

    // AI Workforce Activation — Department → AI Companion sẵn sàng nhận Task.
    activateWave1Companions();

    // AI Companion (Writer Companion, EMP-C001) → AI Service Manager → Provider (Mock) → Output.
    const written = await runCompanionAgentForOutput(session.sessionId, "EMP-C001", {
      prompt: context.userGoal!,
      context: context.expectedOutput,
    });
    expect(written).not.toBeNull();
    expect(written!.output.versions).toHaveLength(1);
    expect(written!.output.approvalStatus).toBe("draft");
    expect(fetchMock).toHaveBeenCalledWith("/api/ai/workforce", expect.objectContaining({ method: "POST" }));

    // Review — Reviewer chỉ gợi ý, không tự approve.
    const reviewed = await runReviewerAgentForOutput(session.sessionId, written!.output.outputId, {
      qaChecklist: ["Đúng thông điệp", "Sẵn sàng đăng"],
      goal: context.userGoal!,
    });
    expect(reviewed).not.toBeNull();
    expect(reviewed!.output.agentReview?.approvalRecommendation).toBe("approve");
    expect(reviewed!.output.approvalStatus).toBe("reviewed"); // chờ Owner

    // Owner Approval — quyết định cuối, ghi OUTPUT_APPROVED tường minh.
    const approved = approveOutput(session.sessionId, written!.output.outputId);
    expect(approved).not.toBeNull();
    expect(approved!.output.approvalStatus).toBe("approved");

    // Reflection (kiến trúc đã khóa Sprint B4/B5 vẫn yêu cầu trước Portfolio).
    const reflected = submitReflection(session.sessionId, written!.output.outputId, [
      { question: "Bạn học được gì?", answer: "Giao Task cho AI Companion qua Runtime nhanh hơn nhiều so với tự viết." },
    ])!;
    expect(reflected.output.reflectionStatus).toBe("submitted");

    // Portfolio Sync — tự động khi Output đủ điều kiện.
    const promoted = promoteEligibleOutputs(reflected.session.sessionId, reflected.session);
    expect(promoted).toHaveLength(1);
    expect(listPortfolioItems()).toHaveLength(1);
    expect(listPortfolioItems()[0].missionId).toBe("viet-content-facebook");

    // Memory Sync — sau khi Complete (vào Portfolio), ghi Memory thật.
    const completedOutput = reflected.session.outputs.find((o) => o.outputId === written!.output.outputId)!;
    const memoryEntry = syncMemoryForPortfolioItem(promoted[0], completedOutput);
    expect(memoryEntry.learning).toContain("Giao Task cho AI Companion qua Runtime");
    expect(memoryEntry.bestPractice).toContain("Ngắn gọn");
    expect(listMemoryEntries(session.sessionId)).toHaveLength(1);

    // Idempotent — gọi lại syncMemoryForPortfolioItem cho cùng portfolioItem không tạo bản ghi trùng.
    syncMemoryForPortfolioItem(promoted[0], completedOutput);
    expect(listMemoryEntries(session.sessionId)).toHaveLength(1);

    // Event Timeline — đủ toàn bộ Event của Runtime Flow.
    const eventTypes = new Set(readGrowthEvents().map((e) => e.eventType));
    expect(eventTypes.has("COMPANION_ACTIVATED")).toBe(true);
    expect(eventTypes.has("AGENT_RUN_STARTED")).toBe(true);
    expect(eventTypes.has("AGENT_RUN_COMPLETED")).toBe(true);
    expect(eventTypes.has("OUTPUT_CREATED")).toBe(true);
    expect(eventTypes.has("OUTPUT_REVIEWED")).toBe(true);
    expect(eventTypes.has("USER_APPROVAL_REQUIRED")).toBe(true);
    expect(eventTypes.has("OUTPUT_APPROVED")).toBe(true);
    expect(eventTypes.has("PORTFOLIO_CREATED")).toBe(true);
    expect(eventTypes.has("MEMORY_UPDATED")).toBe(true);
    expect(eventTypes.has("AGENT_RUN_FAILED")).toBe(false);
  });
});
