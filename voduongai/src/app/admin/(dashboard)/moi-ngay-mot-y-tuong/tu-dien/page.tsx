import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listMnytGlossary } from "./actions";
import { GlossaryList } from "./GlossaryList";

export const metadata = { title: "Mỗi ngày một ý tưởng — Từ điển · Admin" };

export default async function MnytTuDienPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { items, configured } = await listMnytGlossary();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        trail={[
          { label: "Học viện", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Mỗi ngày một ý tưởng", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Từ điển" },
        ]}
      />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Mỗi ngày một ý tưởng — Từ điển</h1>
        <p className="mt-1 text-sm text-gray-500">100 thuật ngữ AI gốc của thiết kế, hiển thị ở view Từ điển của Portal.</p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      )}

      {configured && <GlossaryList items={items} />}
    </div>
  );
}
