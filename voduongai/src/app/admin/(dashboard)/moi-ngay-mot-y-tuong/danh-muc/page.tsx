import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listMnytCategories, getMnytCategoryTopicCounts } from "./actions";
import { NewCategoryForm, CategoryCard } from "./CategoryForm";

export const metadata = { title: "Mỗi ngày một ý tưởng — Danh mục · Admin" };

export default async function MnytDanhMucPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [{ items, configured }, counts] = await Promise.all([listMnytCategories(), getMnytCategoryTopicCounts()]);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        trail={[
          { label: "Học viện", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Mỗi ngày một ý tưởng", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Danh mục" },
        ]}
      />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Mỗi ngày một ý tưởng — Danh mục</h1>
        <p className="mt-1 text-sm text-gray-500">
          35 lĩnh vực gốc của thiết kế. Xoá 1 lĩnh vực chỉ thực hiện được nếu không còn ý tưởng nào thuộc lĩnh vực đó.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      )}

      {configured && (
        <>
          <NewCategoryForm />
          <div className="space-y-3">
            {items.map((c) => (
              <CategoryCard key={c.key} category={c} topicCount={counts[c.key] ?? 0} />
            ))}
            {items.length === 0 && <p className="text-sm text-gray-400">Chưa có lĩnh vực nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
