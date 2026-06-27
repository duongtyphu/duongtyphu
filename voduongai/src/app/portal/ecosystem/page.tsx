import { PageHeader } from "@/components/portal/ui/PageHeader";
import { Button } from "@/components/portal/ui/Button";
import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";

export const metadata = { title: "Hệ sinh thái", description: "Không ai tỏa sáng một mình — đây là cộng đồng đồng hành cùng bạn." };

export default function EcosystemHubPage() {
  const hub = getHub("ecosystem")!;

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
