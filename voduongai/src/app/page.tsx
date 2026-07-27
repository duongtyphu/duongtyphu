"use client";

import { useLandingTheme } from "@/components/site/LandingThemeProvider";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { IntroVideo } from "@/components/home/IntroVideo";
import { PortalPreview } from "@/components/home/PortalPreview";
import { QuizAssessment } from "@/components/home/QuizAssessment";
import { EcosystemPillars } from "@/components/home/EcosystemPillars";
import { ToolsIUse } from "@/components/home/ToolsIUse";
import { AudienceProblem } from "@/components/home/AudienceProblem";
import { Roadmap } from "@/components/home/Roadmap";
import { TrustStats } from "@/components/home/TrustStats";
import { Ecosystem } from "@/components/home/Ecosystem";
import { FounderStory } from "@/components/home/FounderStory";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  const { theme } = useLandingTheme();

  return (
    <div className={theme === "light" ? "bg-white" : ""}>
      <Hero variant={theme} />
      <StatsBar />
      <IntroVideo variant={theme} />
      <PortalPreview variant={theme} />
      <QuizAssessment variant={theme} />
      <EcosystemPillars variant={theme} />
      <ToolsIUse variant={theme} />
      <AudienceProblem variant={theme} />
      <Roadmap variant={theme} />
      <TrustStats variant={theme} />
      <Ecosystem variant={theme} />
      <FounderStory variant={theme} />
      <FinalCTA variant={theme} />
    </div>
  );
}
