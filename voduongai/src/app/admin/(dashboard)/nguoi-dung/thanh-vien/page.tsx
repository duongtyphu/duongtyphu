import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { IdCard } from "lucide-react";

export const metadata = { title: "Thành viên · Admin" };

type PaidMember = {
  email: string;
  fullName: string | null;
  products: string[];
  totalAmount: number;
  latestConfirmedAt: string;
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

/**
 * ADM-V2-01 — "Thành viên" (Người dùng). Góc nhìn THEO GÓI ĐÃ MUA (khác
 * "Danh sách người dùng" — góc nhìn theo TÀI KHOẢN) — cùng nguồn dữ liệu
 * (`members` + `orders`), KHÔNG tách CRUD riêng, tránh 2 menu cùng sở hữu 1
 * nguồn dữ liệu. Định nghĩa "Thành viên" = có ít nhất 1 đơn hàng
 * `status='confirmed'`. CHỈ ĐỌC.
 */
export default async function ThanhVienPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const { data, error } = supabase
    ? await supabase
        .from("orders")
        .select("member_email, product_name, course_id, amount, confirmed_at, created_at")
        .eq("status", "confirmed")
        .order("confirmed_at", { ascending: false })
    : { data: null, error: null };

  const byEmail = new Map<string, PaidMember>();
  for (const o of data ?? []) {
    const existing = byEmail.get(o.member_email);
    const product = o.product_name ?? o.course_id ?? "—";
    const at = (o.confirmed_at ?? o.created_at) as string;
    if (existing) {
      if (!existing.products.includes(product)) existing.products.push(product);
      existing.totalAmount += o.amount ?? 0;
      if (at > existing.latestConfirmedAt) existing.latestConfirmedAt = at;
    } else {
      byEmail.set(o.member_email, {
        email: o.member_email,
        fullName: null,
        products: [product],
        totalAmount: o.amount ?? 0,
        latestConfirmedAt: at,
      });
    }
  }

  const emails = Array.from(byEmail.keys());
  if (supabase && emails.length > 0) {
    const { data: memberRows } = await supabase.from("members").select("email, full_name").in("email", emails);
    for (const m of memberRows ?? []) {
      const row = byEmail.get(m.email);
      if (row) row.fullName = m.full_name;
    }
  }

  const members = Array.from(byEmail.values()).sort(
    (a, b) => new Date(b.latestConfirmedAt).getTime() - new Date(a.latestConfirmedAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Người dùng", href: "/admin/users" }, { label: "Thành viên" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Thành viên</h1>
        <p className="mt-1 text-sm text-gray-500">
          Góc nhìn theo gói/khoá học đã sở hữu — thành viên = có ít nhất 1 đơn hàng đã xác nhận
          (<code className="text-gray-700">orders.status = &quot;confirmed&quot;</code>). Cùng nguồn dữ liệu
          người dùng với &quot;Danh sách người dùng&quot;, chỉ khác góc nhìn.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          danh sách thành viên.
        </div>
      )}

      {supabase && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Không đọc được dữ liệu đơn hàng: {error.message}
        </div>
      )}

      {supabase && !error && members.length === 0 && (
        <AdminEmptyState
          icon={IdCard}
          title="Chưa có thành viên đã mua nào"
          description="Hiện chưa có đơn hàng nào ở trạng thái 'Đã xác nhận'. Danh sách này sẽ tự hiện đúng ngay khi có đơn hàng đầu tiên được xác nhận."
          action={{ label: "Xem Đơn hàng", href: "/admin/van-hanh/don-hang" }}
        />
      )}

      {supabase && !error && members.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Thành viên</th>
                <th className="px-4 py-3">Sản phẩm đã mua</th>
                <th className="px-4 py-3">Tổng chi tiêu</th>
                <th className="px-4 py-3">Lần mua gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((m) => (
                <tr key={m.email}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{m.fullName ?? "—"}</div>
                    <div className="text-xs text-gray-500">{m.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{m.products.join(", ")}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {formatMoney(m.totalAmount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(m.latestConfirmedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/admin/users" className="text-sm font-semibold text-brand-blue hover:underline">
        Xem toàn bộ Danh sách người dùng →
      </Link>
    </div>
  );
}
