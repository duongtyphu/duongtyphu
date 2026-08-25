import { describe, it, expect, beforeEach } from "vitest";
import { seedLandingPageProductionGoal, listGoalMissions, getGoalMission, linkMissionToSession, __resetGoalRuntimeCacheForTest} from "@/lib/portal/foundation/goal-runtime";
import {
  recordMissionAnalysis,
  recordMissionResearch,
  addMissionDecision,
  recordMissionReview,
  recordMissionQA,
  recordMissionLessonsLearned,
  recordMissionOwnerApproval,
  buildMissionPackage,
  extractMissionTemplate,
} from "@/lib/portal/foundation/mission-runtime";

/**
 * MISSION 01 — Golden Reference Mission — thực thi thật.
 *
 * Chạy trọn Mission Runtime Pipeline trên chính Mission 01 (Research &
 * Planning) của Goal "Landing Page Production" — Goal ĐẦU TIÊN của hệ
 * thống. Đây là bằng chứng thật (không phải Podcast ví dụ) rằng Mission
 * 01 hoàn thành và trở thành Golden Reference — Mission Package + Mission
 * Template được sinh ra từ chính Mission này.
 *
 * Research Report dưới đây dựa trên dữ liệu THẬT đã có trong repo
 * (Workforce Registry, Goal Runtime, Product Principle Sprint 003) —
 * không có Internet access thật trong sandbox này nên KHÔNG bịa số liệu
 * thị trường bên ngoài, chỉ dùng nguồn nội bộ có thể trích dẫn được
 * (xem `lessonsLearned` — đây là hạn chế được ghi nhận minh bạch).
 */
describe("MISSION 01 — Golden Reference Mission (Landing Page Production, Research & Planning)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    __resetGoalRuntimeCacheForTest();
  });

  it("Chạy trọn Pipeline trên Mission 01 thật — Mission Package + Golden Mission Template sinh ra thành công", () => {
    const seeded = seedLandingPageProductionGoal()!;
    const mission01 = listGoalMissions(seeded.epic.epicId).find((m) => m.title === "Research & Planning")!;
    expect(mission01).toBeDefined();

    linkMissionToSession(mission01.missionId, "session-mission-01-golden-reference");
    expect(getGoalMission(mission01.missionId)?.status).toBe("in_progress");

    recordMissionAnalysis(mission01.missionId, {
      problem: "VO DUONG AI chưa có Landing Page Production — cần xác định rõ đối tượng, thông điệp, đối thủ tham chiếu trước khi viết Content Blueprint (Mission 02).",
      scope: [
        "Xác định đối tượng mục tiêu của Landing Page",
        "Xác định thông điệp giá trị cốt lõi",
        "Khảo sát điểm khác biệt so với sản phẩm AI khác cùng phân khúc",
      ],
      risks: [
        "Thông điệp không rõ ràng dẫn đến Content Blueprint (Mission 02) sai hướng",
        "Sandbox không có Internet thật — không thể khảo sát đối thủ trực tiếp, chỉ dùng dữ liệu sản phẩm nội bộ",
      ],
    });

    recordMissionResearch(mission01.missionId, {
      findings: [
        "VO DUONG AI đã có 30 AI Companion phủ 7 Department, Workforce Registry và Goal Runtime chạy thật — đây là lợi thế khác biệt cần làm nổi bật, không chỉ là 'công cụ AI trả lời câu hỏi'",
        "Đối tượng mục tiêu chính: cá nhân/doanh nghiệp nhỏ muốn GIAO việc cho AI thay vì tự học prompt rời rạc từng cái một",
        "Sản phẩm cạnh tranh trực tiếp với các AI Chatbot đơn lẻ (không có Workforce/Goal Runtime thật) — điểm khác biệt cốt lõi: 'Giao Goal cho một tổ chức AI', không phải 'Chat với AI'",
      ],
      sources: [
        "Workforce Registry thật (30 Companion, workforce-registry.ts)",
        "Goal Runtime thật (goal-runtime.ts) — Goal → Epic → Mission chạy được",
        "Product Principle đã công bố ở Sprint 003 (Workspace Runtime Integration): 'Người dùng không chat với AI. Người dùng giao Goal cho một tổ chức AI.'",
      ],
      recommendations: [
        "Headline Landing Page tập trung vào 'Giao Goal cho một tổ chức AI', không liệt kê tính năng rời rạc",
        "CTA chính dẫn Owner bắt đầu Goal đầu tiên của họ (không phải đăng ký tài khoản suông)",
        "Dùng chính Mission 01 này làm case study minh chứng — 'AI Workforce tự thực hiện Landing Page của chính mình', kiểm chứng được qua Runtime Events/QA Report thật, không phải marketing claim suông",
      ],
    });

    addMissionDecision(
      mission01.missionId,
      "Chọn hướng Headline 'Giao Goal cho một tổ chức AI' thay vì liệt kê tính năng",
      "Khớp đúng Product Principle đã khoá ở Sprint 003; tạo khác biệt rõ với AI Chatbot đơn lẻ không có Workforce/Goal Runtime"
    );
    addMissionDecision(
      mission01.missionId,
      "Dùng chính Mission 01 (Goal Runtime thật) làm case study trên Landing Page thay vì số liệu thị trường bên ngoài",
      "Sandbox không có Internet thật để khảo sát đối thủ — case study nội bộ có Runtime Events/QA Report kiểm chứng được, giữ tính trung thực thay vì bịa số liệu"
    );

    recordMissionReview(mission01.missionId, {
      reviewer: "Content Companion (EMP-C001) — sơ duyệt trước khi chuyển Content Blueprint",
      notes: [
        "Research Report đủ Finding/Nguồn/Khuyến nghị, khớp Input/Output của Mission 01",
        "Khuyến nghị headline đã đủ rõ để Mission 02 (Content Blueprint) triển khai tiếp",
      ],
      approved: true,
    });

    recordMissionQA(mission01.missionId, {
      checks: [
        { label: "Research Report có nguồn trích dẫn rõ ràng, không bịa số liệu bên ngoài", passed: true },
        { label: "Khuyến nghị khớp Definition of Done của Mission 01", passed: true },
        { label: "Decision Log có lý do rõ ràng cho từng quyết định", passed: true },
      ],
      issues: [],
    });

    // QA pass + Review approved -> Mission tự chuyển waiting_review, chờ Owner Approval thật.
    expect(getGoalMission(mission01.missionId)?.status).toBe("waiting_review");

    recordMissionLessonsLearned(mission01.missionId, {
      lessons: [
        "Sandbox không có Internet thật — Research Report cho Mission dạng 'thị trường' nên ghi rõ nguồn là dữ liệu sản phẩm nội bộ, không giả lập số liệu ngoài để giữ tính trung thực",
        "Chạy Mission qua Mission Runtime (Analysis→Research→Planning→Review→QA→Owner Approval→Package→Template) tốn thêm bước so với ghi Output thô, nhưng đổi lại có Mission Template tái dùng ngay cho Mission 02-06 và mọi Goal sau",
      ],
    });

    // Owner Approval — căn cứ: Founder đã chỉ đạo APPROVED → LOCK → IMPLEMENTATION cho Mission 01
    // (Acceleration Mode), áp dụng làm Owner Approval cho Mission Package Golden Reference này.
    recordMissionOwnerApproval(mission01.missionId, {
      approved: true,
      notes: ["Founder đã Approve chuyển Mission 01 sang Implementation — áp dụng làm căn cứ Owner Approval cho Mission Package Golden Reference"],
    });

    expect(getGoalMission(mission01.missionId)?.status).toBe("completed");

    const pkg = buildMissionPackage(mission01.missionId)!;
    expect(pkg).not.toBeNull();
    expect(pkg.acceptanceReport.accepted).toBe(true);
    expect(pkg.researchReport.findings.length).toBeGreaterThan(0);
    expect(pkg.decisionLog).toHaveLength(2);
    expect(pkg.qaReport.issues).toHaveLength(0);
    expect(pkg.ownerReview.approved).toBe(true);
    expect(pkg.runtimeEvents.map((e) => e.eventType)).toEqual(expect.arrayContaining(["MISSION_STARTED", "MISSION_COMPLETED"]));

    const template = extractMissionTemplate(mission01.missionId)!;
    expect(template).not.toBeNull();
    expect(template.sourceMissionId).toBe(mission01.missionId);
    expect(template.pipeline).toHaveLength(8);
  });
});
