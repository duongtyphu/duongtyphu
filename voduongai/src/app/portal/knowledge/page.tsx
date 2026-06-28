import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";
import { KnowledgeHero } from "@/components/portal/knowledge/KnowledgeHero";
import { LearningPathGrid } from "@/components/portal/knowledge/LearningPathGrid";
import { AcademySection } from "@/components/portal/knowledge/AcademySection";
import { ResourceLibraryGrid } from "@/components/portal/knowledge/ResourceLibraryGrid";
import { PracticeZone } from "@/components/portal/knowledge/PracticeZone";
import { KnowledgeCompanionIntro } from "@/components/portal/knowledge/KnowledgeCompanionIntro";
import { RecommendedKnowledge } from "@/components/portal/knowledge/RecommendedKnowledge";
import { KnowledgeStats } from "@/components/portal/knowledge/KnowledgeStats";
import {
  learningPaths,
  academyItems,
  resourceLibraryItems,
  practiceItems,
  aiKnowledgeTip,
  recommendedKnowledgeItems,
  knowledgeStats,
} from "@/data/portal/knowledge-hub";

export const metadata = { title: "Tri thức", description: "Hệ Tri Thức của bạn — học đúng, thực hành đúng và lưu giữ đúng." };

export default function KnowledgeHubPage() {
  const hub = getHub("knowledge")!;

  return (
    <div className="space-y-10">
      <KnowledgeHero />
      <LearningPathGrid paths={learningPaths} />
      <AcademySection items={academyItems} />
      <ResourceLibraryGrid items={resourceLibraryItems} />
      <PracticeZone items={practiceItems} />
      <KnowledgeCompanionIntro tip={aiKnowledgeTip} items={recommendedKnowledgeItems} />
      <RecommendedKnowledge items={recommendedKnowledgeItems} />
      <KnowledgeStats stats={knowledgeStats} />
      <section>
        <h2 className="text-lg font-bold text-white">Khám phá thêm trong Tri thức</h2>
        <div className="mt-4">
          <HubModuleGrid modules={hub.modules} />
        </div>
      </section>
    </div>
  );
}
