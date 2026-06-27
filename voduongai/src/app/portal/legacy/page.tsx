import { PageHeader } from "@/components/portal/ui/PageHeader";
import { Button } from "@/components/portal/ui/Button";
import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";

export const metadata = { title: "My Legacy", description: "Di sản số của riêng bạn — những gì bạn xây hôm nay sẽ còn mãi." };

export default function LegacyHubPage() {
  const hub = getHub("legacy")!;

  return (
    <div className="space-y-8">
      <PageHeader
        title={hub.heroTitle}
        description={hub.heroSubtitle}
        action={<Button href="/portal" variant="secondary">← Về Gem Home</Button>}
      />
      <HubModuleGrid modules={hub.modules} />
    </div>
  );
}
