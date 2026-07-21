import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { listCaseStudies } from "./case-studies/actions";

export const metadata = { title: "CKOS Dashboard · Admin" };

/**
 * 9 bảng dùng CHUNG một schema generic (id/data jsonb/status/order/
 * created_at/updated_at) — đã xác nhận qua information_schema trước khi
 * code, không suy đoán. Field chứa tên hiển thị khác nhau giữa các bảng
 * (title vs name) — đã xác nhận từng FieldConfig thật trong trang admin
 * tương ứng trước khi khai báo titleField dưới đây.
 */
const GENERIC_SOURCES = [
  { key: "prompt", label: "Prompt", table: "prompts", titleField: "title", href: "/admin/ckos/prompts" },
  { key: "workflow", label: "Workflow (SOP)", table: "sop", titleField: "name", href: "/admin/ckos/sop" },
  { key: "resource", label: "Resource", table: "resources", titleField: "name", href: "/admin/ckos/resources" },
  { key: "template", label: "Template", table: "templates", titleField: "name", href: "/admin/ckos/templates" },
  { key: "ebook", label: "Ebook", table: "ebooks", titleField: "name", href: "/admin/ckos/ebooks" },
  { key: "checklist", label: "Checklist", table: "checklists", titleField: "name", href: "/admin/ckos/checklists" },
  // Tools nằm ngoài nhóm sidebar "Hệ tri thức (CKOS)" (ở nhóm "Nội dung",
  // /admin/tools) — vẫn tính vào Dashboard vì là 1 trong 7 Intelligence.
  { key: "tool", label: "Công cụ AI", table: "tools", titleField: "name", href: "/admin/tools" },
  { key: "lesson", label: "Lesson", table: "knowledge_seeds", titleField: "title", href: "/admin/ckos/lessons" },
  { key: "collection", label: "Thư viện AI", table: "knowledge_collections", titleField: "name", href: "/admin/ckos/knowledge-collections" },
  { key: "best_practice", label: "Best Practice", table: "best_practices", titleField: "title", href: "/admin/ckos/best-practices" },
] as const;

type GenericRow = { id: string; title: string; status: string; updatedAt: string | null };
type FolderStat = {
  key: string;
  label: string;
  href: string;
  total: number;
  byStatus: Record<string, number>;
  rows: GenericRow[];
};

async function getFolderStat(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  source: (typeof GENERIC_SOURCES)[number]
): Promise<FolderStat> {
  const { data, error } = await supabase.from(source.table).select("id, data, status, updated_at");
  const rows: GenericRow[] = error
    ? []
    : (data ?? []).map((r) => {
        const d = (r.data ?? {}) as Record<string, unknown>;
        return {
          id: r.id as string,
          title: String(d[source.titleField] ?? r.id),
          status: String(r.status ?? "Draft"),
          updatedAt: (r.updated_at as string) ?? null,
        };
      });

  const byStatus: Record<string, number> = {};
  for (const row of rows) byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;

  return { key: source.key, label: source.label, href: source.href, total: rows.length, byStatus, rows };
}

type RecentItem = { folderLabel: string; folderHref: string; title: string; updatedAt: string };

export default async function CkosDashboardPage() {
  const supabase = getSupabaseAdmin();

  const folders: FolderStat[] = supabase
    ? await Promise.all(GENERIC_SOURCES.map((source) => getFolderStat(supabase, source)))
    : GENERIC_SOURCES.map((source) => ({ key: source.key, label: source.label, href: source.href, total: 0, byStatus: {}, rows: [] }));

  const { caseStudies } = await listCaseStudies();
  const caseStudyTotal = caseStudies.length;
  const caseStudyActive = caseStudies.filter((c) => c.active).length;
  const caseStudyInactive = caseStudyTotal - caseStudyActive;

  const totalAllCkos = folders.reduce((sum, f) => sum + f.total, 0) + caseStudyTotal;

  // Published/Draft tổng hợp — cộng dồn TẤT CẢ giá trị status thật xuất
  // hiện trong 9 bảng generic (không hardcode chỉ 2 loại, để tự đúng nếu
  // sau này có dòng "Hidden"). Case Study KHÔNG có cột status (chỉ có
  // `active` boolean) nên báo cáo riêng, không gộp vào đây.
  const statusTotals: Record<string, number> = {};
  for (const f of folders) {
    for (const [status, count] of Object.entries(f.byStatus)) {
      statusTotals[status] = (statusTotals[status] ?? 0) + count;
    }
  }

  // Cập nhật gần đây — gộp từ 9 bảng generic (đều có updated_at thật).
  // Case Study bị loại vì bảng đó không có cột updated_at (chỉ created_at),
  // xem ghi chú hiển thị bên dưới.
  const recentItems: RecentItem[] = folders
    .flatMap((f) =>
      f.rows
        .filter((r) => r.updatedAt)
        .map((r) => ({ folderLabel: f.label, folderHref: f.href, title: r.title, updatedAt: r.updatedAt as string }))
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">CKOS Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng quan số liệu THẬT trên toàn bộ 7 Intelligence của Hệ tri thức AI — không có số mock.
          </p>
        </div>

        {!supabase && (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
            Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không đọc được số
            liệu thật lúc này.
          </div>
        )}

        {/* Tổng cộng + Published/Draft */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Tổng cộng toàn CKOS</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">{totalAllCkos}</p>
            <p className="mt-1 text-xs text-gray-400">Knowledge Card, mọi trạng thái, 7 Intelligence</p>
          </div>
          {Object.entries(statusTotals).map(([status, count]) => (
            <div key={status} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{status}</p>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">{count}</p>
              <p className="mt-1 text-xs text-gray-400">9 Folder generic (không gồm Case Study)</p>
            </div>
          ))}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Case Study</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              {caseStudyActive} <span className="text-base font-semibold text-gray-400">đang hiển thị</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {caseStudyInactive} đã ẩn — dùng cột <code>active</code>, không phải <code>status</code>
            </p>
          </div>
        </div>

        {/* Card mỗi Folder */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">7 Intelligence — theo Folder</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {folders.map((f) => (
              <div key={f.key} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-900">{f.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-gray-900">{f.total}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {Object.entries(f.byStatus)
                    .map(([s, c]) => `${c} ${s}`)
                    .join(" · ") || "Chưa có dữ liệu"}
                </p>
                <Link href={f.href} className="mt-3 inline-block text-xs font-semibold text-brand-blue hover:underline">
                  Xem →
                </Link>
              </div>
            ))}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Case Study</p>
              <p className="mt-2 text-2xl font-extrabold text-gray-900">{caseStudyTotal}</p>
              <p className="mt-1 text-xs text-gray-400">
                {caseStudyTotal === 0 ? "Chưa có dữ liệu" : `${caseStudyActive} đang hiển thị · ${caseStudyInactive} đã ẩn`}
              </p>
              {caseStudyTotal === 0 ? (
                <Link
                  href="/admin/ckos/case-studies"
                  className="mt-3 inline-block text-xs font-semibold text-brand-blue hover:underline"
                >
                  Chưa có Case Study nào — Thêm ngay →
                </Link>
              ) : (
                <Link href="/admin/ckos/case-studies" className="mt-3 inline-block text-xs font-semibold text-brand-blue hover:underline">
                  Xem →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Cập nhật gần đây */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Cập nhật gần đây</h2>
          <p className="mt-1 text-xs text-gray-400">
            Case Study không có cột <code>updated_at</code> (chỉ có <code>created_at</code>) nên không gộp được vào
            danh sách này — xem trực tiếp tại trang quản lý Case Study.
          </p>
          <div className="mt-3 space-y-2">
            {recentItems.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-center text-sm text-gray-400">
                Chưa có mục nào để hiển thị.
              </p>
            ) : (
              recentItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.folderHref}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-blue-200"
                >
                  <span className="min-w-0 flex-1 truncate">
                    <span className="mr-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                      {item.folderLabel}
                    </span>
                    <span className="font-semibold text-gray-900">{item.title}</span>
                  </span>
                  <span className="ml-3 shrink-0 text-xs text-gray-400">
                    {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminAtmosphere>
  );
}
