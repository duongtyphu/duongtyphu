import { ConnectModuleGrid } from "@/components/portal/connect/ConnectModuleGrid";
import type { ConnectModule } from "@/data/portal/connect-os";

/**
 * Answers: "Tôi có thể đóng góp gì lại cho cộng đồng đã giúp tôi trưởng thành?"
 */
export function ContributionZoneSection({ modules }: { modules: ConnectModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Contribution Zone</h2>
      <p className="mt-1 text-sm text-white/55">Chia sẻ lại điều bạn đã học để cộng đồng cùng trưởng thành.</p>
      <div className="mt-4">
        <ConnectModuleGrid modules={modules} />
      </div>
    </section>
  );
}
