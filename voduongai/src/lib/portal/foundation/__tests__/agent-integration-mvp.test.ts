import { describe, it, expect, beforeEach, vi } from "vitest";
import { startCompanionWorkspace, readWorkspaceContext } from "@/lib/portal/companion-workspace";
import {
  findResumableSession,
  createSession,
  runWriterAgentForOutput,
  runReviewerAgentForOutput,
  approveOutput,
  submitReflection,
} from "@/lib/portal/foundation/workspace-session-store";
import { promoteEligibleOutputs, listPortfolioItems } from "@/lib/portal/foundation/portfolio-store";
import { readGrowthEvents } from "@/lib/portal/foundation/growth-event-bus";
import { listAgentRuns } from "@/lib/portal/foundation/agent-run-store";

/**
 * AI Agent Integration MVP — Test Case (mục 9 của brief):
 *
 *   User nhập Goal: "Viết một bài Facebook giới thiệu VO DUONG AI"
 *   → Companion chọn Blueprint: Facebook Content Blueprint
 *   → Writer Agent tạo draft
 *   → Reviewer Agent review
 *   → User approve
 *   → Output vào Portfolio
 *
 * `global.fetch` được mock để giả lập đúng response của `/api/ai/workforce`
 * (ranh giới mạng — không có ANTHROPIC_API_KEY/OPENAI_API_KEY thật trong
 * môi trường này, xem `docs/AI_AGENT_INTEGRATION_MVP.md` mục Test Result)
 * — toàn bộ logic phía sau (Workspace Session/Output/Event/Approval/
 * Portfolio) là code sản xuất thật, không mock.
 */
describe("AI Agent Integration MVP — end-to-end test case", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("Goal → Companion → Blueprint → Writer Agent → Reviewer Agent → User Approval → Portfolio", async () => {
    const fetchMock = vi.fn(async (_url: string, options: RequestInit) => {
      const body = JSON.parse(options.body as string) as { agentRole: string };
      if (body.agentRole === "writer") {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            result: {
              draftOutput: "🚀 VO DUONG AI — Hệ điều hành giúp bạn đạt mục tiêu bằng AI. Học thật, làm thật, có Companion đồng hành.",
              summary: "Bài Facebook giới thiệu VO DUONG AI",
              suggestedTitle: "Giới thiệu VO DUONG AI",
              notes: "Nhấn mạnh Companion đồng hành",
              isMock: false,
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
              versionSuggestion: "Giữ nguyên, chỉ cần thêm CTA nếu muốn",
              isMock: false,
            },
          }),
        } as Response;
      }
      throw new Error("agentRole không hợp lệ trong test.");
    });
    vi.stubGlobal("fetch", fetchMock);

    // Goal + Blueprint (Facebook Content Blueprint, mission viet-content-facebook đã map ở mission-catalog.ts)
    const url = startCompanionWorkspace({
      module: "khong-gian-ai",
      source: "recommended-workspace",
      itemId: "viet-bai-facebook",
      itemType: "workspace",
      title: "Facebook Content Blueprint",
      userGoal: "Viết một bài Facebook giới thiệu VO DUONG AI",
      missionId: "viet-content-facebook",
    });
    expect(url).toContain("/portal/workspace");

    const context = readWorkspaceContext()!;
    const session = findResumableSession(context) ?? createSession(context);

    // Writer Agent tạo draft thật (qua fetch đã mock)
    const written = await runWriterAgentForOutput(session.sessionId, {
      goal: context.userGoal!,
      blueprintName: context.title!,
      taskName: "Draft",
      outputType: "markdown",
    });
    expect(written).not.toBeNull();
    expect(written!.output.versions).toHaveLength(1);
    expect(written!.output.approvalStatus).toBe("draft");
    expect(fetchMock).toHaveBeenCalledWith("/api/ai/workforce", expect.objectContaining({ method: "POST" }));

    // Reviewer Agent review — chỉ gợi ý, không tự approve
    const reviewed = await runReviewerAgentForOutput(session.sessionId, written!.output.outputId, {
      qaChecklist: ["Đúng thông điệp", "Sẵn sàng đăng"],
      goal: context.userGoal!,
    });
    expect(reviewed).not.toBeNull();
    expect(reviewed!.output.agentReview?.approvalRecommendation).toBe("approve");
    expect(reviewed!.output.approvalStatus).toBe("reviewed"); // chờ User — CHƯA phải "approved"

    // User Approval — quyết định cuối, KHÔNG phải Agent
    const approved = approveOutput(session.sessionId, written!.output.outputId);
    expect(approved).not.toBeNull();
    expect(approved!.output.approvalStatus).toBe("approved");
    expect(approved!.output.reviewStatus).toBe("reviewed"); // tương thích kiến trúc Portfolio đã khóa

    // Kiến trúc đã khóa (Sprint B4/B5) vẫn yêu cầu Reflection thật trước Portfolio —
    // không nới lỏng điều kiện này chỉ vì brief MVP không nhắc tới.
    const reflected = submitReflection(session.sessionId, written!.output.outputId, [
      { question: "Bạn học được gì?", answer: "AI Agent thật có thể tạo Output nhanh hơn nhiều so với tự viết." },
    ])!;
    expect(reflected.output.reflectionStatus).toBe("submitted");

    const promoted = promoteEligibleOutputs(reflected.session.sessionId, reflected.session);
    expect(promoted).toHaveLength(1);
    expect(listPortfolioItems()).toHaveLength(1);
    expect(listPortfolioItems()[0].missionId).toBe("viet-content-facebook");

    // Event Log đầy đủ (mục 6 của brief)
    const eventTypes = new Set(readGrowthEvents().map((e) => e.eventType));
    expect(eventTypes.has("AGENT_RUN_STARTED")).toBe(true);
    expect(eventTypes.has("AGENT_RUN_COMPLETED")).toBe(true);
    expect(eventTypes.has("OUTPUT_CREATED")).toBe(true);
    expect(eventTypes.has("OUTPUT_REVIEWED")).toBe(true);
    expect(eventTypes.has("USER_APPROVAL_REQUIRED")).toBe(true);
    expect(eventTypes.has("PORTFOLIO_CREATED")).toBe(true);
    expect(eventTypes.has("AGENT_RUN_FAILED")).toBe(false); // không có lỗi nào trong test case này

    // Agent Run Log ghi đủ 2 Agent (Writer + Reviewer), không có Agent thứ 3 nào
    const runs = listAgentRuns(session.sessionId);
    const roles = new Set(runs.map((r) => r.agentRole));
    expect(roles.has("Writer Agent")).toBe(true);
    expect(roles.has("Reviewer Agent")).toBe(true);
    expect(roles.size).toBe(2);
    expect(runs.every((r) => r.status === "completed")).toBe(true);
  });

  it("Reviewer Agent gợi ý 'revise' → Output ở trạng thái Needs Revision, KHÔNG tự approve", async () => {
    const fetchMock = vi.fn(async (_url: string, options: RequestInit) => {
      const body = JSON.parse(options.body as string) as { agentRole: string };
      if (body.agentRole === "writer") {
        return { ok: true, json: async () => ({ ok: true, result: { draftOutput: "Bản nháp còn sơ sài", summary: "", suggestedTitle: "", notes: "", isMock: false } }) } as Response;
      }
      return {
        ok: true,
        json: async () => ({
          ok: true,
          result: { strengths: [], issues: ["Thiếu thông tin quan trọng"], suggestedImprovements: ["Bổ sung số liệu"], approvalRecommendation: "revise", versionSuggestion: "Viết lại phần đầu", isMock: false },
        }),
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);

    const url = startCompanionWorkspace({
      module: "khong-gian-ai",
      source: "recommended-workspace",
      itemId: "viet-bai-facebook",
      title: "Facebook Content Blueprint",
      userGoal: "Viết một bài Facebook giới thiệu VO DUONG AI",
      missionId: "viet-content-facebook",
    });
    expect(url).toContain("/portal/workspace");
    const context = readWorkspaceContext()!;
    const session = createSession(context);

    const written = (await runWriterAgentForOutput(session.sessionId, { goal: context.userGoal!, blueprintName: context.title!, taskName: "Draft", outputType: "markdown" }))!;
    const reviewed = (await runReviewerAgentForOutput(session.sessionId, written.output.outputId, { qaChecklist: [], goal: context.userGoal! }))!;

    expect(reviewed.output.approvalStatus).toBe("needs_revision");
    // Không có USER_APPROVAL_REQUIRED khi Reviewer gợi ý "revise" — hệ thống không chờ Approve cho bản chưa đạt.
    const eventTypes = new Set(readGrowthEvents().map((e) => e.eventType));
    expect(eventTypes.has("USER_APPROVAL_REQUIRED")).toBe(false);
    expect(listPortfolioItems()).toHaveLength(0); // chưa Approve, chưa Reflection → chắc chắn chưa vào Portfolio
  });
});
