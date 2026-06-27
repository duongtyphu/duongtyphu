import { ConnectModuleGrid } from "@/components/portal/connect/ConnectModuleGrid";
import type { ConnectModule } from "@/data/portal/connect-os";

/**
 * Answers: "Tôi có thể tìm thấy và trò chuyện với những ai trong cộng đồng?"
 */
export function CommunityHubSection({ modules }: { modules: ConnectModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Community Hub</h2>
      <p className="mt-1 text-sm text-white/55">Không gian để bạn tìm thấy người cùng hành trình.</p>
      <div className="mt-4">
        <ConnectModuleGrid modules={modules} />
      </div>
    </section>
  );
}
