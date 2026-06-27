import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";
import { BuildHero } from "@/components/portal/build/BuildHero";
import { BuildPillars } from "@/components/portal/build/BuildPillars";
import { IncomeEngineSection } from "@/components/portal/build/IncomeEngineSection";
import { BrandBuilderSection } from "@/components/portal/build/BrandBuilderSection";
import { SystemBuilderSection } from "@/components/portal/build/SystemBuilderSection";
import { ProjectOpportunitySection } from "@/components/portal/build/ProjectOpportunitySection";
import { PremiumPathSection } from "@/components/portal/build/PremiumPathSection";
import { AIBuildCoach } from "@/components/portal/build/AIBuildCoach";
import { BuildProgressCard } from "@/components/portal/build/BuildProgressCard";
import { FounderJourneyCard } from "@/components/portal/build/FounderJourneyCard";
import {
  buildPillars,
  incomeEngineModules,
  brandBuilderModules,
  systemBuilderModules,
  projectOpportunityModules,
  premiumPathModules,
  aiBuildTip,
  buildProgress,
  founderJourney,
} from "@/data/portal/build-os";

export const metadata = {
  title: "Hệ Kiến Tạo",
  description: "Biến tri thức thành giá trị — thu nhập, thương hiệu, hệ thống, dự án, doanh nghiệp và tài sản.",
};

export default function BuildOSPage() {
  const hub = getHub("growth")!;

  return (
    <div className="space-y-10">
      <BuildHero />
      <BuildPillars pillars={buildPillars} />
      <IncomeEngineSection modules={incomeEngineModules} />
      <BrandBuilderSection modules={brandBuilderModules} />
      <SystemBuilderSection modules={systemBuilderModules} />
      <ProjectOpportunitySection modules={projectOpportunityModules} />
      <PremiumPathSection modules={premiumPathModules} />
      <AIBuildCoach tip={aiBuildTip} />
      <BuildProgressCard dimensions={buildProgress} />
      <FounderJourneyCard journey={founderJourney} />
      <section>
        <h2 className="text-lg font-bold text-white">Khám phá thêm trong Hệ Kiến Tạo</h2>
        <div className="mt-4">
          <HubModuleGrid modules={hub.modules} />
        </div>
      </section>
    </div>
  );
}
