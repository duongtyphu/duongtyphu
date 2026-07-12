import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PORTAL_MANAGEMENT_SECTIONS } from "@/lib/admin/portal/navigation";
import { PORTAL_AREAS } from "@/lib/admin/portal/areas";
import { PORTAL_PAGES, UNMAPPED_PAGE_COUNT } from "@/lib/admin/portal/pages";

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

/**
 * Portal Dashboard (Task 1) — "Founder mở Admin sẽ nhìn thấy toàn bộ
 * Portal." Số liệu THẬT tính từ PORTAL_AREAS/PORTAL_PAGES (liệt kê cơ học
 * từ route thật, không phải mock) — khác Website/Brand Dashboard (dùng
 * Mock Data theo đúng chỉ thị brief của các sprint đó), ở đây Task 1
 * không có caveat "(Mock Data)" nên dùng số liệu thật ngay.
 */
export default function PortalDashboardPage() {
  const ownedAreas = PORTAL_AREAS.filter((a) => a.ownerWorkspace !== null).length;
  const deadPages = PORTAL_PAGES.filter((p) => p.note?.includes("chết")).length;

  return (
    <AdminWorkspaceShell
      title="Portal Management"
      description="Toàn cảnh Portal thật (không phải Website Workspace quản lý — đây là toàn bộ ứng dụng Portal công khai/đăng nhập). Dữ liệu liệt kê cơ học từ route thật trong src/app/portal/**, không phải mock."
      rootHref="/admin/portal"
      sections={PORTAL_MANAGEMENT_SECTIONS}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Portal Area" value={PORTAL_AREAS.length} sub="Theo đúng sidebar Portal thật" />
          <StatCard label="Portal Page (route thật)" value={PORTAL_PAGES.length} />
          <StatCard label="Area có Owner Workspace" value={ownedAreas} sub={`${PORTAL_AREAS.length - ownedAreas} chưa xác định`} />
          <StatCard label="Page chưa khớp Area nào" value={UNMAPPED_PAGE_COUNT} sub={`${deadPages} route đã xác nhận chết`} />
        </div>

        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">⚠️ Phát hiện</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-white/70">
            <li>
              • <strong>{UNMAPPED_PAGE_COUNT}/{PORTAL_PAGES.length} route thật</strong> không khớp tiền tố bất kỳ Area
              nào trong 10 mục sidebar chính thức — khẳng định lại phát hiện của{" "}
              <code className="text-brand-orange">docs/admin/PORTAL_COVERAGE_AUDIT.md</code> (ADM-SPR-005): sidebar
              chỉ có 10 mục nhưng nhiều route thật hơn tồn tại song song. Xem Page Registry.
            </li>
            <li>
              • <strong>/portal/hetrithucai</strong> (3 route) trùng tên khái niệm với <strong>/portal/ckos</strong>{" "}
              nhưng là route khác — chưa xác nhận quan hệ giữa 2 route này.
            </li>
            <li>
              • <strong>4/10 Portal Area</strong> chưa có Workspace Admin nào sở hữu rõ ràng (Trang chủ Học viện, Học
              viện AI, AI Workspace, Hành trình của tôi).
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Portal Areas</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PORTAL_AREAS.map((area) => (
              <Link
                key={area.key}
                href="/admin/portal/areas"
                className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
              >
                <span className="text-sm font-semibold text-white/80">{area.label}</span>
                <span className="text-xs text-white/40">{area.ownerWorkspace ?? "Chưa xác định Owner"}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
