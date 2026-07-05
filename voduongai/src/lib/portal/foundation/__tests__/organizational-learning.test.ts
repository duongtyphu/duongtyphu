import { describe, it, expect, beforeEach } from "vitest";
import {
  promoteBestPractice,
  listBestPractices,
  suggestBlueprintImprovement,
  decideBlueprintImprovement,
  listBlueprintImprovements,
  summarizeKnowledgeEvolution,
  shareCrossDepartmentLearning,
  listCrossDepartmentShares,
  getOrganizationalMemoryTimeline,
} from "@/lib/portal/foundation/organizational-learning";

/**
 * SPRINT F2 — Organizational Learning Engine.
 *
 * Không chỉ AI học — toàn bộ tổ chức học. Test khoá 5 thành phần vào dữ
 * liệu thật, và đặc biệt khoá nguyên tắc: Blueprint Improvement KHÔNG
 * được sửa Blueprint đã khóa (`GOLDEN_MISSIONS`) — chỉ là đề xuất chờ
 * Owner duyệt riêng.
 */
describe("SPRINT F2 — Organizational Learning Engine", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("Best Practice Engine: bắt buộc có Mission làm bằng chứng, không suy diễn không căn cứ", () => {
    expect(() => promoteBestPractice("Luôn ghi rõ nguồn trong Research Report", [])).toThrow();

    const bp = promoteBestPractice("Luôn ghi rõ nguồn trong Research Report", ["mission-01"], "research-knowledge");
    expect(bp.evidenceMissionIds).toEqual(["mission-01"]);
    expect(listBestPractices("research-knowledge")).toHaveLength(1);
    expect(listBestPractices("technology-automation")).toHaveLength(0);
  });

  it("Blueprint Improvement: đề xuất không sửa Blueprint trực tiếp, chỉ chờ Owner quyết định riêng", () => {
    const suggestion = suggestBlueprintImprovement("viet-landing-page", "Thêm bước khảo sát đối thủ trước khi viết Content Blueprint", "mission-01");
    expect(suggestion.status).toBe("proposed");
    expect(listBlueprintImprovements("viet-landing-page")).toHaveLength(1);

    const decided = decideBlueprintImprovement(suggestion.suggestionId, "accepted")!;
    expect(decided.status).toBe("accepted");
    expect(decided.decidedAt).toBeTruthy();
    expect(decideBlueprintImprovement("khong-ton-tai", "accepted")).toBeNull();
  });

  it("Knowledge Evolution: tổng hợp đúng số lượng thật từ Best Practice + Blueprint Improvement", () => {
    promoteBestPractice("practice 1", ["mission-01"]);
    promoteBestPractice("practice 2", ["mission-02"]);
    suggestBlueprintImprovement("viet-landing-page", "suggestion 1", "mission-01");

    const summary = summarizeKnowledgeEvolution();
    expect(summary.totalBestPractices).toBe(2);
    expect(summary.totalBlueprintImprovements.proposed).toBe(1);
    expect(summary.totalBlueprintImprovements.accepted).toBe(0);
    expect(summary.latestUpdateAt).toBeTruthy();
  });

  it("Cross Department Learning: chỉ chia sẻ được Best Practice đã tồn tại thật, tham chiếu practiceId không copy nội dung", () => {
    expect(() => shareCrossDepartmentLearning("khong-ton-tai", "research-knowledge", ["content-communication"])).toThrow();

    const bp = promoteBestPractice("Luôn kiểm QA trước khi Owner Approval", ["mission-01"], "technology-automation");
    const share = shareCrossDepartmentLearning(bp.practiceId, "technology-automation", ["content-communication", "creative-design"]);
    expect(share.practiceId).toBe(bp.practiceId);
    expect(listCrossDepartmentShares("creative-design")).toHaveLength(1);
    expect(listCrossDepartmentShares("business-strategy")).toHaveLength(0);
  });

  it("Organizational Memory Timeline: gộp đúng thứ tự thời gian từ Best Practice + Blueprint Improvement + Cross Department Share", () => {
    const bp = promoteBestPractice("practice", ["mission-01"], "research-knowledge");
    suggestBlueprintImprovement("viet-landing-page", "suggestion", "mission-01");
    shareCrossDepartmentLearning(bp.practiceId, "research-knowledge", ["content-communication"]);

    const timeline = getOrganizationalMemoryTimeline();
    expect(timeline.map((e) => e.kind)).toEqual(["best_practice", "blueprint_improvement", "cross_department_share"]);
    for (let i = 1; i < timeline.length; i++) {
      expect(new Date(timeline[i].at).getTime()).toBeGreaterThanOrEqual(new Date(timeline[i - 1].at).getTime());
    }
  });
});
