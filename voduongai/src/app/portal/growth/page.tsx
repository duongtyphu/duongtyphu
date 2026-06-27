import { PageHeader } from "@/components/portal/ui/PageHeader";
import { Button } from "@/components/portal/ui/Button";
import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";

export const metadata = { title: "Phát triển", description: "Biến tri thức AI thành thu nhập và tài sản số — từng bước, bền vững." };

export default function GrowthHubPage() {
  const hub = getHub("growth")!;

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
