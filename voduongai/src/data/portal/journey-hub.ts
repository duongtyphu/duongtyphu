// Mock data for the Hành Trình (Journey) Hub. Shapes mirror what a future
// database table / API response would return — swap the constants below
// for real fetches without touching the components that consume them.

export type CurrentJourney = {
  goalLabel: string;
  levelLabel: string;
  dailyTimeLabel: string;
  startedAtLabel: string;
  overallPercent: number;
};

export const currentJourney: CurrentJourney = {
  goalLabel: "Ứng dụng AI vào công việc",
  levelLabel: "Đang thực hành",
  dailyTimeLabel: "30 phút / ngày",
  startedAtLabel: "12/05/2026",
  overallPercent: 38,
};

export type GrowthPathStepStatus = "completed" | "current" | "locked";

export type GrowthPathStep = {
  key: string;
  label: string;
  description: string;
  status: GrowthPathStepStatus;
  href?: string;
};

export const growthPathSteps: GrowthPathStep[] = [
  { key: "discover", label: "DISCOVER", description: "Khám phá AI có thể giúp gì cho hành trình của bạn.", status: "completed", href: "/portal/start-here" },
  { key: "learn", label: "LEARN", description: "Học nền tảng AI, Prompt và công cụ thực chiến.", status: "completed", href: "/portal/hocvienai" },
  { key: "apply", label: "APPLY", description: "Áp dụng AI vào công việc và dự án thật.", status: "current", href: "/portal/practice" },
  { key: "build", label: "BUILD", description: "Xây hệ thống, sản phẩm hoặc thương hiệu riêng.", status: "locked" },
  { key: "share", label: "SHARE", description: "Chia sẻ giá trị, kết nối với cộng đồng.", status: "locked" },
  { key: "grow", label: "GROW", description: "Mở rộng quy mô và năng lực bản thân.", status: "locked" },
  { key: "legacy", label: "LEGACY", description: "Tạo di sản số bền vững cho riêng bạn.", status: "locked" },
];

export type MissionDay = {
  day: number;
  status: "completed" | "current" | "upcoming";
};

export const mission30Day: { totalDays: number; currentDay: number; days: MissionDay[] } = {
  totalDays: 30,
  currentDay: 12,
  days: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const status: MissionDay["status"] = day < 12 ? "completed" : day === 12 ? "current" : "upcoming";
    return { day, status };
  }),
};

export type GrowthDetailDimension = {
  key: "knowledge" | "skill" | "career" | "community" | "legacy";
  label: string;
  percent: number;
  description: string;
  tip: string;
};

export const growthDetailDimensions: GrowthDetailDimension[] = [
  { key: "knowledge", label: "Knowledge", percent: 35, description: "Kiến thức nền tảng AI và lĩnh vực bạn theo đuổi.", tip: "Hoàn thành 1 bài học mới trong Học viện AI mỗi tuần." },
  { key: "skill", label: "Skill", percent: 20, description: "Kỹ năng thực hành Prompt, công cụ và Quy trình.", tip: "Thực hành ít nhất 1 Prompt thực chiến mỗi ngày." },
  { key: "career", label: "Career", percent: 15, description: "Khả năng tạo thu nhập và phát triển sự nghiệp với AI.", tip: "Khám phá Affiliate Hub để bắt đầu hành trình thu nhập." },
  { key: "community", label: "Community", percent: 10, description: "Mức độ kết nối và đóng góp cho cộng đồng.", tip: "Tham gia một thảo luận trong Cộng đồng VO DUONG AI." },
  { key: "legacy", label: "Legacy", percent: 5, description: "Tài sản số và di sản bạn đang xây dựng lâu dài.", tip: "Lưu lại ghi chú hoặc prompt đầu tiên vào My Legacy." },
];

export type Milestone = {
  certificateLabel: string;
  nextMilestoneLabel: string;
  conditionLabel: string;
};

export const milestone: Milestone = {
  certificateLabel: "Chứng chỉ AI Foundation",
  nextMilestoneLabel: "Hoàn thành bước APPLY",
  conditionLabel: "Hoàn thành 3 bài thực hành + 1 Quy trình trong giai đoạn APPLY.",
};

export type AiJourneyTip = {
  message: string;
  href: string;
  cta: string;
};

export const aiJourneyTip: AiJourneyTip = {
  message:
    "Dựa trên hành trình hiện tại, bạn nên tập trung vào bước APPLY trong 7 ngày tới: thực hành Prompt, hoàn thành 1 Quy trình và ghi lại 3 bài học quan trọng.",
  href: "/portal/ai-assistant",
  cta: "Hỏi AI Coach",
};

export type RelatedAction = {
  id: string;
  label: string;
  href: string;
};

export const relatedActions: RelatedAction[] = [
  { id: "ra1", label: "Học bài tiếp theo", href: "/portal/hocvienai" },
  { id: "ra2", label: "Thực hành Prompt", href: "/portal/prompts" },
  { id: "ra3", label: "Lưu ghi chú vào My Legacy", href: "/portal/legacy" },
  { id: "ra4", label: "Tham gia thử thách", href: "/portal/practice" },
  { id: "ra5", label: "Xem cộng đồng", href: "/portal/congdongai" },
];
