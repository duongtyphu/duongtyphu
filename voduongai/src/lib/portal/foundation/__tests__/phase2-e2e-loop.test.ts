import { describe, it, expect, beforeEach } from "vitest";
import { startCompanionWorkspace, readWorkspaceContext } from "@/lib/portal/companion-workspace";
import {
  findResumableSession,
  createSession,
  advanceStep,
  saveOutputVersion,
  startReview,
  markOutputReviewed,
  startReflection,
  submitReflection,
  completeSession,
  getSession,
} from "@/lib/portal/foundation/workspace-session-store";
import { promoteEligibleOutputs, listPortfolioItems } from "@/lib/portal/foundation/portfolio-store";
import { computeCapabilityProfiles, getCapabilityTimeline } from "@/lib/portal/foundation/capability-engine";
import { recordNewUnlocks, getMissionUnlockStatuses } from "@/lib/portal/foundation/mission-unlock-runtime";
import { readGrowthEvents } from "@/lib/portal/foundation/growth-event-bus";

/**
 * PHASE 2 EXIT VALIDATION — QA End-to-End.
 *
 * Môi trường sandbox này không có Supabase Service Role Key thật (rỗng
 * trong `.env.local`) và không truy cập được hộp thư/tài khoản Supabase
 * thật nào (không magic link, không mật khẩu có sẵn) — nên KHÔNG thể
 * chạy QA qua trình duyệt với người dùng đăng nhập Supabase thật trong
 * môi trường này (xem `docs/PHASE_2_EXIT_VALIDATION.md` mục QA Result để
 * biết bằng chứng cụ thể — chế độ public/demo của middleware cũng không
 * dùng được vì các component khác (`useMemoryCapsules`) yêu cầu cứng
 * Supabase client, gây lỗi 500 khi thiếu cấu hình).
 *
 * Đây là bài kiểm tra thay thế nghiêm ngặt nhất có thể trong môi trường
 * này: import và chạy THẬT toàn bộ code sản xuất (không mock) của Học
 * viện AI → Mission → Workspace → Output → Review → Reflection →
 * Portfolio → Growth → Capability → Unlock, qua đúng API mà UI thật gọi
 * (`startCompanionWorkspace`, `saveOutputVersion`, `submitReflection`...).
 * `localStorage`/`window` thật có trong môi trường `jsdom` của Vitest.
 */
describe("Phase 2 Exit Validation — full loop (Academy → Unlock)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("chạy đủ Mission → Workspace → Output → Review → Reflection → Portfolio → Growth → Capability → Unlock", () => {
    // 1. Academy/AI Workspace CTA — gắn missionId thật (Mission Runtime, B2)
    const url = startCompanionWorkspace({
      module: "khong-gian-ai",
      source: "recommended-workspace",
      itemId: "phan-tich-khach-hang",
      itemType: "workspace",
      title: "Phân tích khách hàng",
      expectedOutput: "1 bản mô tả chân dung khách hàng",
      missionId: "phan-tich-khach-hang",
    });
    expect(url).toContain("/portal/workspace");
    expect(url).toContain("missionId=phan-tich-khach-hang");

    // 2. Workspace: Session Runtime — context được lưu thật, Session được tạo/resume
    const context = readWorkspaceContext();
    expect(context?.missionId).toBe("phan-tich-khach-hang");
    const resumable = findResumableSession(context!);
    const session = resumable ?? createSession(context!);
    expect(session.status).toBe("active");
    expect(session.context.missionId).toBe("phan-tich-khach-hang");

    // 3. Execution Planner — tiến qua các bước tới Draft
    let current = advanceStep(session.sessionId, "preparing")!;
    current = advanceStep(current.sessionId, "research")!;
    current = advanceStep(current.sessionId, "draft")!;
    expect(current.currentStepId).toBe("draft");

    // 4. Output Runtime — lưu Output thật, không ghi đè khi có version 2
    const saved1 = saveOutputVersion(current.sessionId, {
      type: "excel",
      content: "Phân tích khách hàng lần 1: nhóm mua lại 3+ lần chiếm 18% doanh thu.",
    })!;
    expect(saved1.output.versions).toHaveLength(1);
    const saved2 = saveOutputVersion(current.sessionId, {
      outputId: saved1.output.outputId,
      type: "excel",
      content: "Phân tích khách hàng v2: đã thêm đề xuất chương trình chăm sóc riêng.",
    })!;
    expect(saved2.output.versions).toHaveLength(2); // Version History — không ghi đè

    // 5. Review Flow
    startReview(saved2.session.sessionId, saved2.output.outputId);
    const reviewed = markOutputReviewed(saved2.session.sessionId, saved2.output.outputId)!;
    expect(reviewed.output.reviewStatus).toBe("reviewed");

    // 6. Reflection Flow
    startReflection(reviewed.session.sessionId, reviewed.output.outputId);
    const reflected = submitReflection(reviewed.session.sessionId, reviewed.output.outputId, [
      { question: "Bạn học được gì?", answer: "Học cách nhóm khách hàng theo tần suất mua." },
      { question: "AI giúp bạn ở đâu?", answer: "AI giúp tổng hợp nhanh hơn nhiều so với làm tay." },
      { question: "Điều gì cần cải thiện?", answer: "Cần thêm dữ liệu 6 tháng để kết luận chắc chắn hơn." },
    ])!;
    expect(reflected.output.reflectionStatus).toBe("submitted");
    expect(reflected.output.reflections).toHaveLength(3);

    // 7. Portfolio Runtime — Output đạt chuẩn tự động vào Portfolio
    const promoted = promoteEligibleOutputs(reflected.session.sessionId, reflected.session);
    expect(promoted).toHaveLength(1);
    expect(listPortfolioItems()).toHaveLength(1);
    expect(listPortfolioItems()[0].outputId).toBe(reflected.output.outputId);
    expect(listPortfolioItems()[0].missionId).toBe("phan-tich-khach-hang");

    // 8. Growth Event Backbone — sinh Event thật xuyên suốt toàn bộ luồng trên
    const events = readGrowthEvents();
    const eventTypes = new Set(events.map((e) => e.eventType));
    // missionId có mặt trong context → startCompanionWorkspace phát MISSION_STARTED
    // thay vì WORKSPACE_STARTED (đúng logic đã cài từ Sprint B1/B3).
    expect(eventTypes.has("MISSION_STARTED")).toBe(true);
    expect(eventTypes.has("OUTPUT_CREATED")).toBe(true);
    expect(eventTypes.has("OUTPUT_VERSIONED")).toBe(true);
    expect(eventTypes.has("REVIEW_STARTED")).toBe(true);
    expect(eventTypes.has("REVIEW_COMPLETED")).toBe(true);
    expect(eventTypes.has("REFLECTION_STARTED")).toBe(true);
    expect(eventTypes.has("REFLECTION_COMPLETED")).toBe(true);
    expect(eventTypes.has("PORTFOLIO_CREATED")).toBe(true);
    // Mọi Event đều khai báo trước tối thiểu 3 module tiêu thụ (Product Guardrails)
    for (const e of events) expect(e.modulesUsing.length).toBeGreaterThanOrEqual(3);

    // 9. Capability Engine — đo đúng Competency thật ("Data Analysis"), KHÔNG phải module
    const profiles = computeCapabilityProfiles();
    const dataAnalysis = profiles.find((p) => p.capabilityId === "Data Analysis");
    expect(dataAnalysis).toBeDefined();
    expect(dataAnalysis!.currentLevel).toBeGreaterThanOrEqual(1);
    expect(dataAnalysis!.evidenceCount).toBe(1);
    const timeline = getCapabilityTimeline("Data Analysis");
    expect(timeline.length).toBeGreaterThan(0); // Capability Timeline — append-only

    // 10. Hoàn thành Mission
    const finished = completeSession(reflected.session.sessionId)!;
    expect(finished.status).toBe("completed");
    expect(getSession(finished.sessionId)?.status).toBe("completed");

    // 11. Unlock Runtime — đánh giá điều kiện thật dựa trên Mission hoàn thành + Capability
    const unlockStatuses = getMissionUnlockStatuses();
    const phanTich = unlockStatuses.find((s) => s.missionId === "phan-tich-khach-hang");
    expect(phanTich?.isUnlocked).toBe(true); // đã hoàn thành → tự thoả điều kiện chính nó
    const newUnlocks = recordNewUnlocks();
    // Mission "lam-dashboard-excel" (điều kiện requiresAny với phan-tich-khach-hang)
    // không unlock lẫn nhau theo chiều ngược — chỉ xác nhận Runtime chạy không lỗi
    // và trả về mảng hợp lệ (có thể rỗng nếu chưa mission nào khác đủ điều kiện).
    expect(Array.isArray(newUnlocks)).toBe(true);

    // Validation Rule cuối cùng: Growth Event Bus không ghi Capability/Portfolio nào
    // nếu KHÔNG có Evidence — xác nhận ngược bằng 1 session hoàn toàn trống.
    const emptySession = createSession({
      module: "khong-gian-ai",
      source: "test-empty",
      routeFrom: "/portal/khong-gian-ai",
      timestamp: new Date().toISOString(),
    });
    const emptyProfiles = computeCapabilityProfiles([emptySession]);
    expect(emptyProfiles).toHaveLength(0); // không Evidence → không tạo Capability nào
  });
});
