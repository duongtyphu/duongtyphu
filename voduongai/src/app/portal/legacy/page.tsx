import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { LegacyHero } from "@/components/portal/legacy/LegacyHero";
import { getHub } from "@/lib/portal/hubs";

export const metadata = { title: "My Legacy", description: "Di sản số của riêng bạn — những gì bạn xây hôm nay sẽ còn mãi." };

export default function LegacyHubPage() {
  const hub = getHub("legacy")!;

  return (
    <div className="space-y-8">
      <LegacyHero />
      <HubModuleGrid modules={hub.modules} />
    </div>
  );
}
