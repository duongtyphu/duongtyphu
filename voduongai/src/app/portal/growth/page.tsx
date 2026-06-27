import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";
import { BuildHero } from "@/components/portal/build/BuildHero";
import { BuildPillars } from "@/components/portal/build/BuildPillars";
import { BuildEngineTabs } from "@/components/portal/build/BuildEngineTabs";
import { ProjectOpportunitySection } from "@/components/portal/build/ProjectOpportunitySection";
import { AIBuildCoach } from "@/components/portal/build/AIBuildCoach";
import { BuildProgressCard } from "@/components/portal/build/BuildProgressCard";
import { FounderJourneyCard } from "@/components/portal/build/FounderJourneyCard";
import {
  buildPillars,
  incomeEngineModules,
  brandBuilderModules,
  systemBuilderModules,
  premiumPathModules,
  projectOpportunityModules,
  aiBuildTip,
  buildProgress,
  founderJourney,
} from "@/data/portal/build-os";

export const metadata = {
  title: "Hệ Kiến Tạo",
  description: "Biến tri thức thành giá trị — thu nhập, thương hiệu, hệ thống, dự án, doanh nghiệp và tài sản.",
};

const ENGINE_TABS = [
  { key: "income", label: "Thu nhập", subtitle: "Các nguồn thu nhập bạn có thể bắt đầu xây dựng ngay hôm nay.", modules: incomeEngineModules },
  { key: "brand", label: "Thương hiệu", subtitle: "Xây dựng thương hiệu cá nhân có giá trị lâu dài.", modules: brandBuilderModules },
  { key: "system", label: "Hệ thống", subtitle: "Thiết kế quy trình, landing page, email, CRM, automation và AI Agent.", modules: systemBuilderModules },
  { key: "premium", label: "Premium", subtitle: "Dành cho người muốn rút ngắn thời gian thử-sai.", modules: premiumPathModules },
];

export default function BuildOSPage() {
  const hub = getHub("growth")!;

  return (
    <div className="space-y-10">
      <BuildHero />
      <BuildPillars pillars={buildPillars} />
      <section>
        <h2 className="text-lg font-bold text-white">Khu vực kiến tạo</h2>
        <p className="mt-1 text-sm text-white/55">Chọn nhóm bạn muốn bắt đầu — thu nhập, thương hiệu, hệ thống hay premium.</p>
        <div className="mt-4">
          <BuildEngineTabs tabs={ENGINE_TABS} />
        </div>
      </section>
      <ProjectOpportunitySection modules={projectOpportunityModules} />
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
