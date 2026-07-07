import { HubModuleGrid } from "@/components/portal/ui/HubModuleGrid";
import { getHub } from "@/lib/portal/hubs";
import { JourneyHero } from "@/components/portal/journey/JourneyHero";
import { RelatedActions } from "@/components/portal/journey/RelatedActions";
import { GrowthActivityPanel } from "@/components/portal/growth/GrowthActivityPanel";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { relatedActions } from "@/data/portal/journey-hub";

export const metadata = { title: "Hành trình", description: "Mỗi viên ngọc quý cần thời gian để mài giũa — đây là lộ trình của riêng bạn." };

/**
 * Portal 4.0 Content Reconstruction — Journey Growth System.
 *
 * Trước đây trang này xếp chồng 5 khối dữ liệu TĨNH/GIẢ (CurrentJourneyCard
 * 38% cố định, GrowthPathTimeline 7 bước cố định, Mission30DayCard cố định,
 * HumanGrowthDetail 5 chỉ số % cố định, MilestoneCard chứng chỉ cố định) —
 * không có khối nào phản ánh dữ liệu thật của người dùng. Đồng thời có 3 hệ
 * thống "khu vườn" khác nhau (ở đây, ở /khuvuoncuaban, ở /story) và 2 hệ
 * thống "Human Growth" khác nhau chạy song song.
 *
 * Theo PORTAL_CONTENT_RECONSTRUCTION_PLAN.md (mục B.7): hợp nhất về ĐÚNG 1
 * "Growth System" và ĐÚNG 1 "Garden", cả hai đều dùng chung
 * `growth-view.ts` (đọc WorkspaceSession/GrowthEvent thật, không có Supabase
 * bịa, không có % giả) — đây là component `GrowthActivityPanel` đã tồn tại
 * và đã đúng nguyên tắc trung thực từ trước, chỉ chưa được dùng làm nguồn
 * DUY NHẤT. Toàn bộ nội dung tĩnh cũ (CurrentJourneyCard/GrowthPathTimeline/
 * Mission30DayCard/HumanGrowthDetail/MilestoneCard/AIJourneyCoach) đã bị xoá.
 */
export default function JourneyHubPage() {
  const hub = getHub("journey")!;

  return (
    <div className="space-y-10">
      <JourneyHero />

      <CompanionGuide
        message="Không phải mỗi ngày đều cần có gì đó mới để xem. Đôi khi nhìn lại quãng đường đã đi cũng là một hình thức tiến bộ."
        action={{ label: "Xem hoạt động gần đây", href: "/portal/nhatkyhoctap" }}
      />

      <section>
        <SectionHeader eyebrow="Growth System" title="Tiến độ thật của bạn" description="Không phải % ước lượng — chỉ những gì bạn thực sự đã làm." />
        <div className="grid gap-5 lg:grid-cols-2">
          <GrowthActivityPanel variant="journey" />
          <GrowthActivityPanel variant="garden" />
        </div>
      </section>

      <RelatedActions actions={relatedActions} />

      <section>
        <SectionHeader eyebrow="Growth Experience" title="Khám phá thêm trong hành trình" />
        <div className="mt-4">
          <HubModuleGrid modules={hub.modules} />
        </div>
      </section>

      <KnowledgeJourneyStrip
        title="Trưởng thành cần được nuôi dưỡng liên tục"
        steps={[
          { label: "Học tiếp", description: "Quay lại Học viện AI để tiếp tục hành trình học.", href: "/portal/hocvienai" },
          { label: "Áp dụng vào dự án", description: "Xem cơ hội bạn có thể áp dụng những gì vừa trưởng thành.", href: "/portal/duan-cohoi" },
          { label: "Chia sẻ với Companion", description: "Kể cho Companion nghe bạn đang cảm nhận thế nào.", href: "/portal/companion" },
        ]}
      />
    </div>
  );
}
