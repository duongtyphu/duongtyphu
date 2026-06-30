import { GemCard } from "@/components/portal/ui/GemCard";
import { BuildModuleGrid } from "@/components/portal/build/BuildModuleGrid";
import type { BuildModule } from "@/data/portal/build-os";

/**
 * Answers: "Có những dự án/cơ hội nào tôi nên tìm hiểu thêm, không phải để cam kết lợi nhuận mà để mở rộng hiểu biết?"
 */
export function ProjectOpportunitySection({ modules }: { modules: BuildModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">Project &amp; Opportunity</h2>
      <p className="mt-1 text-sm text-gray-500">
        Thông tin chia sẻ và phân tích cơ hội để bạn tự tìm hiểu — không phải lời cam kết lợi nhuận hay khuyến nghị đầu tư.
      </p>
      <GemCard className="mt-4">
        <BuildModuleGrid modules={modules} />
      </GemCard>
    </section>
  );
}
