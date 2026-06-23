import { Hero } from "@/components/home/Hero";
import { PortalPreview } from "@/components/home/PortalPreview";
import { FreeResources } from "@/components/home/FreeResources";
import { ToolsIUse } from "@/components/home/ToolsIUse";
import { Problem } from "@/components/home/Problem";
import { Solution } from "@/components/home/Solution";
import { Journey } from "@/components/home/Journey";
import { AcademyTeaser } from "@/components/home/AcademyTeaser";
import { TrustStats } from "@/components/home/TrustStats";
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
      <Journey />
      <AcademyTeaser />
      <TrustStats />
      <FinalCTA />
    </>
  );
}
