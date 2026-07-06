import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";
import { JourneyHero } from "@/components/portal/journey/JourneyHero";
import { CurrentJourneyCard } from "@/components/portal/journey/CurrentJourneyCard";
import { GrowthPathTimeline } from "@/components/portal/journey/GrowthPathTimeline";
import { Mission30DayCard } from "@/components/portal/journey/Mission30DayCard";
import { HumanGrowthDetail } from "@/components/portal/journey/HumanGrowthDetail";
import { MilestoneCard } from "@/components/portal/journey/MilestoneCard";
import { AIJourneyCoach } from "@/components/portal/journey/AIJourneyCoach";
import { RelatedActions } from "@/components/portal/journey/RelatedActions";
import { GrowthActivityPanel } from "@/components/portal/growth/GrowthActivityPanel";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import {
  currentJourney,
  growthPathSteps,
  mission30Day,
  growthDetailDimensions,
  milestone,
  aiJourneyTip,
  relatedActions,
} from "@/data/portal/journey-hub";

export const metadata = { title: "Hành trình", description: "Mỗi viên ngọc quý cần thời gian để mài giũa — đây là lộ trình của riêng bạn." };

export default function JourneyHubPage() {
  const hub = getHub("journey")!;

  return (
    <div className="space-y-10">
      <JourneyHero />

      <CurrentJourneyCard journey={currentJourney} />

      <GrowthPathTimeline steps={growthPathSteps} />

      <Mission30DayCard totalDays={mission30Day.totalDays} currentDay={mission30Day.currentDay} days={mission30Day.days} />

      <HumanGrowthDetail dimensions={growthDetailDimensions} />

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <MilestoneCard milestone={milestone} />
        </div>
        <div className="lg:col-span-6">
          <AIJourneyCoach tip={aiJourneyTip} />
        </div>
      </div>

      <RelatedActions actions={relatedActions} />

      <GrowthActivityPanel variant="journey" />

      <section>
        <SectionHeader eyebrow="Growth Experience" title="Khám phá thêm trong hành trình" />
        <div className="mt-4">
          <HubModuleGrid modules={hub.modules} />
        </div>
      </section>

      <KnowledgeJourneyStrip
        title="Trưởng thành cần được nuôi dưỡng liên tục"
        steps={[
          { label: "Học tiếp", description: "Quay lại Học viện AI để tiếp tục hành trình học.", href: "/portal/hocvienai" },
          { label: "Áp dụng vào dự án", description: "Xem cơ hội bạn có thể áp dụng những gì vừa trưởng thành.", href: "/portal/duan-cohoi" },
          { label: "Chia sẻ với Companion", description: "Kể cho Companion nghe bạn đang cảm nhận thế nào.", href: "/portal/companion" },
        ]}
      />
    </div>
  );
}
