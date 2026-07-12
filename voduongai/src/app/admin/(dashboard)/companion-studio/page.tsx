import { Bot } from "lucide-react";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

/**
 * Companion Studio — Workspace Landing (ADM-SPR-201 Task 4, nâng cấp từ
 * ComingSoon đơn giản sang WorkspaceSectionFoundation). Sở hữu Portal Area
 * "Companion" và "Sứ mệnh Companion" (xem areas.ts).
 */
export default function CompanionStudioAdminPage() {
  return (
    <WorkspaceSectionFoundation
      icon={Bot}
      title="Companion Studio"
      scope="Quản lý persona, bộ nhớ và agent registry của Companion. Sở hữu 2 Portal Area: &quot;Companion&quot; (/portal/companion) và &quot;Sứ mệnh Companion&quot; (/portal/su-menh-companion). Portal Coverage Audit (ADM-SPR-005) phát hiện Companion có 3 hệ thống bộ nhớ song song chưa hợp nhất (memory_capsules, growth-view event log, memory-store.ts) — chưa có Registry/CRUD nào ở Admin."
      willManage={[
        "Persona/agent registry của Companion (chưa có route/CRUD nào)",
        "Hợp nhất 3 hệ thống bộ nhớ song song đã phát hiện ở Portal Coverage Audit",
      ]}
      portalSource="Portal Area &quot;Companion&quot; + &quot;Sứ mệnh Companion&quot; — xem /admin/portal/areas hoặc docs/admin/PORTAL_COVERAGE_AUDIT.md §Companion."
    />
  );
}
