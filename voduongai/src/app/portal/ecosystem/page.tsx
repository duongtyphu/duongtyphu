import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";
import { ConnectHero } from "@/components/portal/connect/ConnectHero";
import { ConnectPillars } from "@/components/portal/connect/ConnectPillars";
import { CommunityHubSection } from "@/components/portal/connect/CommunityHubSection";
import { EventWebinarSection } from "@/components/portal/connect/EventWebinarSection";
import { AchievementLeaderboardSection } from "@/components/portal/connect/AchievementLeaderboardSection";
import { OpportunityNetworkSection } from "@/components/portal/connect/OpportunityNetworkSection";
import { ContributionZoneSection } from "@/components/portal/connect/ContributionZoneSection";
import { AIConnectCoach } from "@/components/portal/connect/AIConnectCoach";
import { ConnectProgressCard } from "@/components/portal/connect/ConnectProgressCard";
import { HumanNetworkCard } from "@/components/portal/connect/HumanNetworkCard";
import {
  connectPillars,
  communityHubModules,
  eventWebinarModules,
  achievementLeaderboardModules,
  opportunityNetworkModules,
  contributionZoneModules,
  aiConnectTip,
  connectProgress,
  humanNetwork,
} from "@/data/portal/connect-os";

export const metadata = {
  title: "Hệ Kết Nối",
  description: "Không ai tiến hóa một mình — kết nối với cộng đồng, mentor, sự kiện và cơ hội.",
};

export default function ConnectOSPage() {
  const hub = getHub("ecosystem")!;

  return (
    <div className="space-y-10">
      <ConnectHero />
      <ConnectPillars pillars={connectPillars} />
      <CommunityHubSection modules={communityHubModules} />
      <EventWebinarSection modules={eventWebinarModules} />
      <AchievementLeaderboardSection modules={achievementLeaderboardModules} />
      <OpportunityNetworkSection modules={opportunityNetworkModules} />
      <ContributionZoneSection modules={contributionZoneModules} />
      <AIConnectCoach tip={aiConnectTip} />
      <ConnectProgressCard dimensions={connectProgress} />
      <HumanNetworkCard network={humanNetwork} />
      <section>
        <h2 className="text-lg font-bold text-white">Khám phá thêm trong Hệ Kết Nối</h2>
        <div className="mt-4">
          <HubModuleGrid modules={hub.modules} />
        </div>
      </section>
    </div>
  );
}
