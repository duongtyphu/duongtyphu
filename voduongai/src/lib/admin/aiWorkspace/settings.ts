/**
 * AI Workspace Settings — Hero + Footer CTA của `/portal/aiworkspace`
 * (PMO-HARDENING-CONT Workstream 1). Singleton record, cùng pattern
 * `globalSettings.ts`/`missionPresentation.ts`. Không đổi layout/style —
 * chỉ đưa phần TEXT + CTA label/href vào Admin, giữ nguyên nội dung hiện
 * tại làm seed mặc định.
 */

export type AiWorkspaceSettings = {
  id: string;
  heroSubtitle: string;
  heroDescription: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  footerTitle: string;
  footerDescription: string;
  footerPrimaryLabel: string;
  footerPrimaryHref: string;
  footerSecondaryLabel: string;
  footerSecondaryHref: string;
  status: "Draft" | "Published";
  updatedDate: string;
};

export const AI_WORKSPACE_SETTINGS_COLLECTION_KEY = "ai-workspace-settings";
export const AI_WORKSPACE_SETTINGS_ID = "ai_workspace_settings_singleton";

export const AI_WORKSPACE_SETTINGS_SEED: AiWorkspaceSettings[] = [
  {
    id: AI_WORKSPACE_SETTINGS_ID,
    heroSubtitle: "Nơi Companion và đội ngũ AI hỗ trợ bạn biến mục tiêu thành kết quả.",
    heroDescription:
      "Bạn không cần bắt đầu bằng việc chọn công cụ AI. Hãy bắt đầu bằng việc bạn muốn làm gì. Companion sẽ giúp bạn chọn đúng công cụ, đúng Prompt, đúng quy trình và đưa kết quả về Không gian làm việc.",
    heroPrimaryCtaLabel: "Bắt đầu cùng Companion",
    heroSecondaryCtaLabel: "Khám phá công cụ AI",
    footerTitle: "Muốn học AI có hệ thống hơn?",
    footerDescription:
      "Khoá học VDAI SOLO hướng dẫn từng bước — từ AI Chat đến Prompt và Tự động hóa — với ví dụ thực chiến phù hợp với người Việt.",
    footerPrimaryLabel: "Xem khoá học VDAI SOLO",
    footerPrimaryHref: "/solo",
    footerSecondaryLabel: "Đọc lộ trình miễn phí",
    footerSecondaryHref: "/portal/aiworkspace/bai-viet/lo-trinh-hoc-ai-cho-nguoi-moi-bat-dau",
    status: "Published",
    updatedDate: "2026-07-13",
  },
];
