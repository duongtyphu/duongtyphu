"use client";

import { useEffect, useState } from "react";
import {
  ONBOARDING_LEVELS,
  ONBOARDING_TIMES,
  readOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/portal/onboarding";

export function OnboardingSummary() {
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);

  useEffect(() => {
    // Hydration-safe: localStorage is only available after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(readOnboardingProfile());
  }, []);

  if (!profile) return null;

  const level = ONBOARDING_LEVELS.find((l) => l.id === profile.level)?.label;
  const time = ONBOARDING_TIMES.find((t) => t.id === profile.dailyTime)?.label;
  if (!level && !time) return null;

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {level && (
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-white/70">
          Cấp độ: {level}
        </span>
      )}
      {time && (
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-white/70">
          {time}/ngày
        </span>
      )}
    </div>
  );
}
