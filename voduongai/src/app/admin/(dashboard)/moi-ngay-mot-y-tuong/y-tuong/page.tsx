import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listMnytTopicsAdmin } from "./actions";
import { listMnytCategories } from "../danh-muc/actions";
import { NewTopicButton } from "./NewTopicButton";

export const metadata = { title: "Mỗi ngày một ý tưởng — Ý tưởng · Admin" };

const PAGE_SIZE = 40;

export default async function MnytYTuongPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const categoryKey = sp.category || undefined;
  const q = sp.q || undefined;

  const [{ items, total, configured }, { items: categories }] = await Promise.all([
    listMnytTopicsAdmin({ page, pageSize: PAGE_SIZE, categoryKey, q }),
    listMnytCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { page: String(page), category: categoryKey ?? "", q: q ?? "", ...patch };
    if (merged.page && merged.page !== "1") params.set("page", merged.page);
    if (merged.category) params.set("category", merged.category);
    if (merged.q) params.set("q", merged.q);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        trail={[
          { label: "Học viện", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Mỗi ngày một ý tưởng", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Ý tưởng" },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Mỗi ngày một ý tưởng — Ý tưởng</h1>
          <p className="mt-1 text-sm text-gray-500">{total} ý tưởng. Bấm vào 1 dòng để sửa đầy đủ nội dung.</p>
        </div>
        {configured && <NewTopicButton categories={categories.map((c) => ({ key: c.key, name: c.name }))} />}
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      )}

      {configured && (
        <>
          <form className="flex flex-wrap items-center gap-2" action="/admin/moi-ngay-mot-y-tuong/y-tuong" method="get">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Tìm theo tiêu đề hoặc id..."
              className="w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
            />
            <select name="category" defaultValue={categoryKey ?? ""} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none">
              <option value="">Tất cả lĩnh vực</option>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
            <button type="submit" className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">Lọc</button>
            {(categoryKey || q) && (
              <Link href="/admin/moi-ngay-mot-y-tuong/y-tuong" className="text-sm font-semibold text-gray-500 hover:text-gray-700">Xoá bộ lọc</Link>
            )}
          </form>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Tiêu đề</th>
                  <th className="px-4 py-2">Lĩnh vực</th>
                  <th className="px-4 py-2">Độ khó</th>
                  <th className="px-4 py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2 text-gray-400">{t.day}</td>
                    <td className="px-4 py-2">
                      <Link href={`/admin/moi-ngay-mot-y-tuong/y-tuong/${t.id}`} className="font-semibold text-gray-900 hover:text-brand-blue">
                        {t.title}
                      </Link>
                      <div className="font-mono text-[11px] text-gray-400">{t.id}</div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
                        {t.category_name}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{t.difficulty}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Không tìm thấy ý tưởng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Link href={buildHref({ page: String(Math.max(1, page - 1)) })} aria-disabled={page <= 1} className={`rounded-lg border border-gray-200 px-3 py-1.5 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}>
                ← Trước
              </Link>
              <span className="text-gray-500">Trang {page}/{totalPages}</span>
              <Link href={buildHref({ page: String(Math.min(totalPages, page + 1)) })} aria-disabled={page >= totalPages} className={`rounded-lg border border-gray-200 px-3 py-1.5 ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}>
                Sau →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
