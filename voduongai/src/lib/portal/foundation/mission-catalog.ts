/**
 * EPIC 03 — Phase 2 (B2 hoàn thiện): Mission Runtime / Mission Catalog.
 *
 * Ánh xạ trực tiếp 10 Golden Reference Mission
 * (`docs/GOLDEN_REFERENCE_MISSION_PACK.md`) thành dữ liệu THẬT trong
 * codebase — trước đây các Mission này chỉ tồn tại trong tài liệu thiết
 * kế, không có `missionId` nào chạy thật trong Workspace. Đây KHÔNG phải
 * Sprint mới — đây là phần "Mission Runtime/Mission Mapping" còn thiếu
 * của Sprint B2 (AI Workspace Execution Engine), theo Roadmap Lock.
 *
 * `primaryCompetencyId` dùng các Competency THẬT theo brief Phase 2
 * (AI Writing/Research/Presentation/Automation/Data Analysis...) — thay
 * cho việc suy ra Capability từ `context.module` (gap đã ghi ở Sprint B5).
 */

export type GoldenMissionId =
  | "viet-email-chuyen-nghiep"
  | "viet-proposal-khach-hang"
  | "lam-dashboard-excel"
  | "thiet-ke-slide"
  | "viet-landing-page"
  | "viet-content-facebook"
  | "nghien-cuu-thi-truong"
  | "phan-tich-khach-hang"
  | "xay-sop"
  | "lap-ke-hoach-marketing";

export type MissionUnlockCondition =
  | { type: "none" }
  | { type: "requiresMission"; missionIds: GoldenMissionId[] }
  | { type: "requiresCapability"; competencyId: string; minLevel: number }
  | { type: "requiresAny"; conditions: MissionUnlockCondition[] };

export type GoldenMission = {
  missionId: GoldenMissionId;
  missionName: string;
  missionCategory: string;
  primaryCompetencyId: string;
  competencyIds: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  expectedOutputType: string;
  unlockCondition: MissionUnlockCondition;
};

/**
 * 10 Golden Reference Mission — nội dung/thứ tự khớp đúng
 * `GOLDEN_REFERENCE_MISSION_PACK.md`. `unlockCondition` lấy đúng từ mục
 * "Unlock Rule" của từng Mission trong tài liệu đó.
 */
export const GOLDEN_MISSIONS: GoldenMission[] = [
  {
    missionId: "viet-email-chuyen-nghiep",
    missionName: "Viết Email chuyên nghiệp bằng AI",
    missionCategory: "AI Office",
    primaryCompetencyId: "AI Writing",
    competencyIds: ["AI Writing", "Business Communication"],
    difficulty: "Beginner",
    expectedOutputType: "Email",
    unlockCondition: { type: "none" },
  },
  {
    missionId: "viet-proposal-khach-hang",
    missionName: "Soạn Proposal bằng AI",
    missionCategory: "AI Writing",
    primaryCompetencyId: "AI Writing",
    competencyIds: ["AI Writing", "Business Communication"],
    difficulty: "Intermediate",
    expectedOutputType: "Proposal",
    unlockCondition: {
      type: "requiresAny",
      conditions: [
        { type: "requiresMission", missionIds: ["viet-email-chuyen-nghiep"] },
        { type: "requiresCapability", competencyId: "AI Writing", minLevel: 2 },
      ],
    },
  },
  {
    missionId: "lam-dashboard-excel",
    missionName: "Làm Dashboard Excel bằng AI",
    missionCategory: "AI Data",
    primaryCompetencyId: "Data Analysis",
    competencyIds: ["Data Analysis", "AI Data"],
    difficulty: "Beginner",
    expectedOutputType: "Spreadsheet",
    unlockCondition: { type: "none" },
  },
  {
    missionId: "thiet-ke-slide",
    missionName: "Thiết kế Slide thuyết trình bằng AI",
    missionCategory: "AI Design",
    primaryCompetencyId: "Presentation",
    competencyIds: ["Presentation", "AI Design"],
    difficulty: "Beginner",
    expectedOutputType: "Presentation",
    unlockCondition: { type: "none" },
  },
  {
    missionId: "viet-landing-page",
    missionName: "Viết Landing Page bằng AI",
    missionCategory: "AI Writing",
    primaryCompetencyId: "AI Writing",
    competencyIds: ["AI Writing", "AI Marketing"],
    difficulty: "Intermediate",
    expectedOutputType: "Landing Page",
    unlockCondition: { type: "requiresCapability", competencyId: "AI Writing", minLevel: 2 },
  },
  {
    missionId: "viet-content-facebook",
    missionName: "Viết Content Facebook bằng AI",
    missionCategory: "AI Marketing",
    primaryCompetencyId: "AI Writing",
    competencyIds: ["AI Writing", "AI Marketing"],
    difficulty: "Beginner",
    expectedOutputType: "Social Content",
    unlockCondition: { type: "none" },
  },
  {
    missionId: "nghien-cuu-thi-truong",
    missionName: "Nghiên cứu thị trường bằng AI",
    missionCategory: "AI Research",
    primaryCompetencyId: "Research",
    competencyIds: ["Research", "Critical Thinking"],
    difficulty: "Beginner",
    expectedOutputType: "Research Report",
    unlockCondition: { type: "none" },
  },
  {
    missionId: "phan-tich-khach-hang",
    missionName: "Phân tích khách hàng bằng AI",
    missionCategory: "AI Sales",
    primaryCompetencyId: "Data Analysis",
    competencyIds: ["Data Analysis", "AI Sales"],
    difficulty: "Intermediate",
    expectedOutputType: "Analysis Report",
    unlockCondition: {
      type: "requiresAny",
      conditions: [
        { type: "requiresMission", missionIds: ["lam-dashboard-excel"] },
        { type: "requiresCapability", competencyId: "Data Analysis", minLevel: 1 },
      ],
    },
  },
  {
    missionId: "xay-sop",
    missionName: "Xây SOP bằng AI",
    missionCategory: "AI Business",
    primaryCompetencyId: "Automation",
    competencyIds: ["Automation", "Process Design"],
    difficulty: "Beginner",
    expectedOutputType: "SOP",
    unlockCondition: { type: "none" },
  },
  {
    missionId: "lap-ke-hoach-marketing",
    missionName: "Lập kế hoạch Marketing bằng AI",
    missionCategory: "AI Marketing",
    primaryCompetencyId: "Research",
    competencyIds: ["Research", "AI Marketing", "Business Strategy"],
    difficulty: "Advanced",
    expectedOutputType: "Marketing Plan",
    unlockCondition: { type: "requiresCapability", competencyId: "AI Marketing", minLevel: 2 },
  },
];

export function getGoldenMission(missionId: string): GoldenMission | undefined {
  return GOLDEN_MISSIONS.find((m) => m.missionId === missionId);
}

/**
 * Ánh xạ real-world CTA (Workspace đề xuất ở AI Workspace, `ai-workspace.ts`)
 * sang đúng `missionId` Golden Mission tương ứng khi trùng chủ đề — để
 * Workspace Session mang `missionId` thật thay vì trống, mà không cần đổi
 * dữ liệu `RECOMMENDED_WORKSPACES` gốc. Không map cưỡng ép — mục nào
 * không trùng chủ đề (Banner, Video ngắn, Prompt chuyên nghiệp) để trống,
 * không gán sai Competency.
 */
export const RECOMMENDED_WORKSPACE_TO_MISSION: Partial<Record<string, GoldenMissionId>> = {
  "viet-bai-facebook": "viet-content-facebook",
  "tao-landing-page": "viet-landing-page",
  "viet-email-ban-hang": "viet-email-chuyen-nghiep",
  "phan-tich-khach-hang": "phan-tich-khach-hang",
  "ke-hoach-30-ngay": "lap-ke-hoach-marketing",
};
