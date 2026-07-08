export type OnboardingGoalId =
  | "learn-ai"
  | "apply-work"
  | "extra-income"
  | "personal-brand"
  | "automation";

export type OnboardingLevelId = "none" | "beginner" | "basic" | "practicing" | "experienced";

export type OnboardingTimeId = "15" | "30" | "60" | "120";

export type OnboardingProfile = {
  goal: OnboardingGoalId;
  level: OnboardingLevelId;
  dailyTime: OnboardingTimeId;
};

export const ONBOARDING_GOALS: { id: OnboardingGoalId; label: string; href: string; hint: string }[] = [
  { id: "learn-ai", label: "Tôi muốn học AI từ nền tảng", href: "/portal/ai-academy", hint: "Bắt đầu từ Học viện AI — đi từng bước vững chắc." },
  { id: "apply-work", label: "Tôi muốn ứng dụng AI vào công việc", href: "/portal/prompts", hint: "Khám phá thư viện Prompt để áp dụng ngay vào công việc." },
  { id: "extra-income", label: "Tôi muốn kiếm thêm thu nhập", href: "/portal/affiliate-hub", hint: "Affiliate Hub giúp bạn bắt đầu kiếm thu nhập cùng AI." },
  { id: "personal-brand", label: "Tôi muốn xây dựng thương hiệu cá nhân", href: "/portal/personal-brand", hint: "Lộ trình xây thương hiệu cá nhân trong kỷ nguyên AI." },
  { id: "automation", label: "Tôi muốn tự động hóa công việc / kinh doanh", href: "/portal/tools", hint: "Bộ công cụ AI giúp tự động hoá công việc và kinh doanh." },
];

export const ONBOARDING_LEVELS: { id: OnboardingLevelId; label: string }[] = [
  { id: "none", label: "Chưa biết gì" },
  { id: "beginner", label: "Mới bắt đầu" },
  { id: "basic", label: "Đã biết cơ bản" },
  { id: "practicing", label: "Đang thực hành" },
  { id: "experienced", label: "Đã có kinh nghiệm" },
];

export const ONBOARDING_TIMES: { id: OnboardingTimeId; label: string }[] = [
  { id: "15", label: "15 phút" },
  { id: "30", label: "30 phút" },
  { id: "60", label: "60 phút" },
  { id: "120", label: "120 phút" },
];

export const GOAL_STORAGE_KEY = "vdai_portal_goal";
export const ONBOARDING_PROFILE_KEY = "vdai_portal_onboarding_profile";
export const ONBOARDING_DONE_KEY = "vdai_portal_onboarding_done";

export function readOnboardingProfile(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingProfile;
  } catch {
    return null;
  }
}

export function saveOnboardingProfile(profile: OnboardingProfile) {
  localStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(ONBOARDING_DONE_KEY, "1");
  localStorage.setItem(GOAL_STORAGE_KEY, profile.goal);
}

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_DONE_KEY) === "1" || !!localStorage.getItem(GOAL_STORAGE_KEY);
  } catch {
    return true;
  }
}
