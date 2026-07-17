import { Hero } from "@/components/home/Hero";
import { IntroVideo } from "@/components/home/IntroVideo";
import { PortalPreview } from "@/components/home/PortalPreview";
import { QuizAssessment } from "@/components/home/QuizAssessment";
import { EcosystemPillars } from "@/components/home/EcosystemPillars";
import { ToolsIUse } from "@/components/home/ToolsIUse";
import { Roadmap } from "@/components/home/Roadmap";
import { TrustStats } from "@/components/home/TrustStats";
import { Ecosystem } from "@/components/home/Ecosystem";
import { FounderStory } from "@/components/home/FounderStory";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <IntroVideo />
      <PortalPreview />
      <QuizAssessment />
      <EcosystemPillars />
      <ToolsIUse />
      <Roadmap />
      <TrustStats />
      <Ecosystem />
      <FounderStory />
      <FinalCTA />
    </>
  );
}
