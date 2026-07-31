/**
 * Bảng class Tailwind sáng/tối dùng chung cho luồng auth
 * (/login, /register, /forgot-password, /onboarding, /reset-password) —
 * cùng bảng màu custom hex Header/Footer/ThemeToggleButton đã dùng cho
 * chế độ sáng của Landing Page (không dùng token `gray-*` của Admin, vì
 * đây là mảng "Landing", không phải Admin/Portal).
 */
export type AuthThemeName = "light" | "dark";

export const authTheme: Record<
  AuthThemeName,
  {
    heading: string;
    subtext: string;
    faint: string;
    border: string;
    input: string;
    card: string;
    pageBg: string;
    tabInactive: string;
    tabActive: string;
    link: string;
  }
> = {
  light: {
    heading: "text-[#0F172A]",
    subtext: "text-[#54637A]",
    faint: "text-[#94A3B8]",
    border: "border-[#E2E8F0]",
    input:
      "border-[#E2E8F0] bg-white text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#7C5CFC]",
    card: "border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]",
    pageBg: "min-h-screen bg-white",
    tabInactive: "border border-[#E2E8F0] text-[#54637A]",
    tabActive: "bg-[#7C5CFC] text-white",
    link: "text-[#7C5CFC] hover:underline",
  },
  dark: {
    heading: "text-white",
    subtext: "text-white/60",
    faint: "text-white/40",
    border: "border-white/10",
    input:
      "border-white/15 bg-white/5 text-white outline-none placeholder:text-white/40 focus:border-[#7C5CFC]",
    card: "border-white/10 bg-white/[0.04] text-white/80",
    pageBg: "",
    tabInactive: "border border-white/15 text-white/60",
    tabActive: "bg-[#7C5CFC] text-white",
    link: "text-[#7C5CFC] hover:underline",
  },
};
