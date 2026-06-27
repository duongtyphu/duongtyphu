import { PageHeader } from "@/components/portal/ui/PageHeader";
import { Button } from "@/components/portal/ui/Button";
import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";

export const metadata = { title: "Tri thức", description: "Toàn bộ tri thức AI thực chiến — học đúng thứ bạn cần, áp dụng ngay." };

export default function KnowledgeHubPage() {
  const hub = getHub("knowledge")!;

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
