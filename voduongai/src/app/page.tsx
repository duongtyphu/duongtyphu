import { Hero } from "@/components/home/Hero";
import { PortalPreview } from "@/components/home/PortalPreview";
import { FreeResources } from "@/components/home/FreeResources";
import { ToolsIUse } from "@/components/home/ToolsIUse";
import { Problem } from "@/components/home/Problem";
import { Solution } from "@/components/home/Solution";
import { AcademyTeaser } from "@/components/home/AcademyTeaser";
import { TrustStats } from "@/components/home/TrustStats";
import { Ecosystem } from "@/components/home/Ecosystem";
import { FounderStory } from "@/components/home/FounderStory";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <PortalPreview />
      <FreeResources />
      <ToolsIUse />
      <Problem />
      <Solution />
      <AcademyTeaser />
      <TrustStats />
      <Ecosystem />
      <FounderStory />
      <FinalCTA />
    </>
  );
}
