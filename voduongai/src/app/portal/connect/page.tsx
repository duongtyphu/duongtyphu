import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";
import { ConnectHero } from "@/components/portal/connect/ConnectHero";
import { ConnectPillars } from "@/components/portal/connect/ConnectPillars";
import { ConnectEngineTabs } from "@/components/portal/connect/ConnectEngineTabs";
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

const CONNECT_TABS = [
  { key: "community", label: "Cộng đồng", subtitle: "Không gian để bạn tìm thấy người cùng hành trình.", modules: communityHubModules },
  { key: "event", label: "Sự kiện", subtitle: "Webinar, workshop, livestream và offline đang chờ bạn.", modules: eventWebinarModules },
  { key: "achievement", label: "Thành tựu", subtitle: "Những cột mốc và câu chuyện trưởng thành của cộng đồng.", modules: achievementLeaderboardModules },
  { key: "opportunity", label: "Cơ hội", subtitle: "Cơ hội hợp tác, affiliate và phát triển nghề nghiệp từ mạng lưới.", modules: opportunityNetworkModules },
  { key: "contribution", label: "Đóng góp", subtitle: "Chia sẻ lại điều bạn đã học để cộng đồng cùng trưởng thành.", modules: contributionZoneModules },
];

export default function ConnectOSPage() {
  const hub = getHub("connect")!;

  return (
    <div className="space-y-10">
      <ConnectHero />
      <ConnectPillars pillars={connectPillars} />
      <section>
        <h2 className="text-lg font-bold text-white">Khu vực kết nối</h2>
        <p className="mt-1 text-sm text-white/55">Chọn nhóm bạn muốn tham gia — cộng đồng, sự kiện, thành tựu, cơ hội hay đóng góp.</p>
        <div className="mt-4">
          <ConnectEngineTabs tabs={CONNECT_TABS} />
        </div>
      </section>
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
