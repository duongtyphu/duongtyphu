import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Môi trường · Admin" };

const CORE_CHECKS: Array<{ label: string; envVar: string; configured: boolean }> = [
  {
    label: "Supabase URL (server)",
    envVar: "SUPABASE_URL",
    configured: Boolean(process.env.SUPABASE_URL),
  },
  {
    label: "Supabase Service Role Key",
    envVar: "SUPABASE_SERVICE_ROLE_KEY",
    configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  },
  {
    label: "Supabase URL (client)",
    envVar: "NEXT_PUBLIC_SUPABASE_URL",
    configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  },
  {
    label: "Supabase Anon Key (client)",
    envVar: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },
];

/**
 * ADM-V2-05 — "Môi trường" (Hệ thống). Theo đúng nguyên tắc bắt buộc:
 * KHÔNG cho chỉnh biến môi trường qua UI (vẫn qua Vercel Dashboard/CLI),
 * KHÔNG hiển thị bất kỳ giá trị biến môi trường nào — chỉ TÊN biến +
 * boolean đã cấu hình/chưa (cùng pattern `{!supabase && <div>Chưa cấu
 * hình SUPABASE_SERVICE_ROLE_KEY...</div>}` đã dùng xuyên suốt hàng chục
 * trang Admin khác). Phạm vi trang này: hạ tầng LÕI (Supabase) + môi
 * trường chạy (NODE_ENV) — trạng thái AI Provider/dịch vụ tích hợp khác
 * xem ở "API & Tích hợp" (tránh 2 trang cùng sở hữu 1 nội dung).
 */
export default async function MoiTruongPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const nodeEnv = process.env.NODE_ENV;

  return (
    <div className="max-w-3xl space-y-6">
      <AdminBreadcrumb trail={[{ label: "Hệ thống", href: "/admin/he-thong/moi-truong" }, { label: "Môi trường" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Môi trường</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trạng thái cấu hình hạ tầng lõi. CHỈ hiển thị đã cấu hình/chưa — quản lý giá trị thật vẫn qua
          Vercel Dashboard/CLI, không chỉnh được ở đây.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Môi trường chạy</p>
        <p className="mt-1 text-lg font-extrabold text-gray-900">{nodeEnv ?? "—"}</p>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Hạ tầng lõi (Supabase)</h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {CORE_CHECKS.map((c) => (
            <div key={c.envVar} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm font-semibold text-gray-900">{c.label}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  c.configured ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}
              >
                {c.configured ? "Đã cấu hình" : `Thiếu ${c.envVar}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/admin/he-thong/api-tich-hop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
      >
        Xem trạng thái AI Provider & dịch vụ khác (API & Tích hợp) <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
