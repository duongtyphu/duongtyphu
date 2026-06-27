import { ConnectModuleGrid } from "@/components/portal/connect/ConnectModuleGrid";
import type { ConnectModule } from "@/data/portal/connect-os";

/**
 * Answers: "Mạng lưới này có thể mở ra cơ hội hợp tác hay phát triển nào cho tôi?"
 */
export function OpportunityNetworkSection({ modules }: { modules: ConnectModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Opportunity Network</h2>
      <p className="mt-1 text-sm text-white/55">Cơ hội hợp tác, affiliate và phát triển nghề nghiệp từ mạng lưới.</p>
      <div className="mt-4">
        <ConnectModuleGrid modules={modules} />
      </div>
    </section>
  );
}
