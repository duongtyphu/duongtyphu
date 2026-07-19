"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useLandingTheme } from "@/components/site/LandingThemeProvider";

// Only the Landing Page ("/") supports light/dark — every other public
// route (about, contact, blog, portal, admin) keeps its existing look, so
// the toggle simply doesn't render there.
export function ThemeToggleButton() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useLandingTheme();

  if (pathname !== "/") return null;

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition ${
        isLight
          ? "border-[#E2E8F0] bg-[#0F172A]/5 text-[#0F172A] hover:bg-[#0F172A]/10"
          : "border-white/15 bg-white/5 text-white hover:bg-white/10"
      }`}
    >
      {isLight ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
    </button>
  );
}
