import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { isAiConfigured } from "@/ai/agents/companion.agent";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import { CompanionAdminShell } from "@/components/admin/companion/CompanionAdminShell";

export const metadata = { title: "Companion · Admin" };

/**
 * Tự gọi requireAdmin() độc lập ở đây, không dựa hoàn toàn vào
 * (dashboard)/layout.tsx đã gate — do Partial Rendering, layout dùng chung
 * KHÔNG re-render trên mỗi lần điều hướng client-side giữa các trang cùng
 * layout (bài học từ lỗi /admin/tools trước đây). Nền dùng thẳng
 * <SanctuaryBackground/> — đúng nền /portal/companion thật, không phải
 * *-atmosphere-bg (Companion không nằm trong họ class đó).
 */
export default async function AdminCompanionPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <div className="space-y-4">
        <AdminBreadcrumb
          trail={[{ label: "Học viện" }, { label: "Companion" }, { label: "Companion (CMS quản trị AI Mentor)" }]}
        />
        <Suspense>
          <CompanionAdminShell aiConfigured={isAiConfigured()} />
        </Suspense>
      </div>
    </AdminAtmosphere>
  );
}
