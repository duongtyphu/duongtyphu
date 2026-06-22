import { Hero } from "@/components/home/Hero";
import { TrustStats } from "@/components/home/TrustStats";
import { Problem } from "@/components/home/Problem";
import { Solution } from "@/components/home/Solution";
import { FreeResources } from "@/components/home/FreeResources";
import { ToolsIUse } from "@/components/home/ToolsIUse";
import { PortalPreview } from "@/components/home/PortalPreview";
import { About } from "@/components/home/About";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStats />
      <Problem />
      <Solution />
      <FreeResources />
      <ToolsIUse />
      <PortalPreview />
      <About />
      <FinalCTA />
    </>
  );
}
