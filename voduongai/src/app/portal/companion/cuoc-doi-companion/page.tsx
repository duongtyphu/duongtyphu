import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionLifeTimeline } from "@/components/portal/companion/CompanionLifeTimeline";
import { CompanionLegacy } from "@/components/portal/companion/CompanionLegacy";
import { CompanionHeading, CompanionSubtitle } from "@/components/portal/companion/CompanionTypography";

export const metadata = { title: "Cuộc đời Companion — Companion" };

/**
 * Companion Design System™ — Layer 06, Nhiệm vụ 04, 06: The Life Timeline™
 * + Legacy™. Không có số phiên bản, không có ngày tháng release — chỉ có
 * các chương trưởng thành, và một lời kết về điều mình muốn để lại.
 */
export default function CuocDoiCompanionPage() {
  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="text-center">
          <CompanionHeading>Cuộc đời Companion</CompanionHeading>
          <CompanionSubtitle className="mt-4">
            Không phải một bản changelog. Đây là hành trình mình đã lớn lên, từng chương một.
          </CompanionSubtitle>
        </div>

        <div className="mt-16">
          <CompanionLifeTimeline />
        </div>

        <div className="mt-20">
          <CompanionLegacy />
        </div>
      </div>
    </div>
  );
}
