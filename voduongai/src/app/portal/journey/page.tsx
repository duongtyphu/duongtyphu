import { PageHeader } from "@/components/portal/ui/PageHeader";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { HumanGrowthIndex } from "@/components/portal/ui/HumanGrowthBar";
import { getHub } from "@/lib/portal/hubs";

export const metadata = { title: "Hành trình", description: "Mỗi viên ngọc quý cần thời gian để mài giũa — đây là lộ trình của riêng bạn." };

export default function JourneyHubPage() {
  const hub = getHub("journey")!;

  return (
    <div className="space-y-8">
      <PageHeader
        title={hub.heroTitle}
        description={hub.heroSubtitle}
        action={<Button href="/portal" variant="secondary">← Về Gem Home</Button>}
      />
      <GemCard variant="progress">
        <h2 className="mb-4 text-sm font-bold text-white">Human Growth Index</h2>
        <HumanGrowthIndex />
      </GemCard>
      <HubModuleGrid modules={hub.modules} />
    </div>
  );
}
