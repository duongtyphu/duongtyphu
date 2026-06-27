import { RoadmapInteractive } from "@/components/portal/RoadmapInteractive";
import { AdminRoadmapSection } from "@/components/portal/AdminRoadmapSection";
import { PageHeader } from "@/components/portal/ui/PageHeader";

export const metadata = { title: "Lộ trình thành công", description: "Lộ trình học và áp dụng AI, Affiliate Marketing theo từng giai đoạn tại VO DUONG AI." };

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Lộ trình thành công"
        description="7 bước từ làm quen AI đến mở rộng hệ sinh thái cá nhân. Chọn điểm bắt đầu phù hợp với bạn."
      />
      <AdminRoadmapSection />
      <RoadmapInteractive />
    </div>
  );
}
