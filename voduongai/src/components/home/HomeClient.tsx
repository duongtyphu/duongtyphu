"use client";

import { useLandingTheme } from "@/components/site/LandingThemeProvider";
import { Hero } from "@/components/home/Hero";
import { PortalPreview } from "@/components/home/PortalPreview";
import { QuizAssessment } from "@/components/home/QuizAssessment";
import { SkillsShowcase } from "@/components/home/SkillsShowcase";
import { EcosystemPillars } from "@/components/home/EcosystemPillars";
import { ToolsIUse } from "@/components/home/ToolsIUse";
import { TrustStats } from "@/components/home/TrustStats";
import { Ecosystem } from "@/components/home/Ecosystem";
import { FinalCTA } from "@/components/home/FinalCTA";

export function HomeClient() {
  const { theme } = useLandingTheme();

  return (
    <div className={theme === "light" ? "bg-white" : ""}>
      <Hero variant={theme} />
      <EcosystemPillars variant={theme} />
      <PortalPreview variant={theme} />
      <QuizAssessment variant={theme} />
      <SkillsShowcase variant={theme} />
      <ToolsIUse variant={theme} />
      <TrustStats variant={theme} />
      <Ecosystem variant={theme} />
      <FinalCTA variant={theme} />
    </div>
  );
}
