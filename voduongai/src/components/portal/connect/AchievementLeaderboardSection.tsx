import { ConnectModuleGrid } from "@/components/portal/connect/ConnectModuleGrid";
import type { ConnectModule } from "@/data/portal/connect-os";

/**
 * Answers: "Cộng đồng đang ghi nhận sự trưởng thành của ai, và tôi có thể học hỏi từ ai?"
 */
export function AchievementLeaderboardSection({ modules }: { modules: ConnectModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Achievement &amp; Leaderboard</h2>
      <p className="mt-1 text-sm text-white/55">Những cột mốc và câu chuyện trưởng thành của cộng đồng.</p>
      <div className="mt-4">
        <ConnectModuleGrid modules={modules} />
      </div>
    </section>
  );
}
