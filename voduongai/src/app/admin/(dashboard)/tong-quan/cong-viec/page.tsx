import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { ClipboardCheck } from "lucide-react";

export const metadata = { title: "Công việc · Admin" };

type WorkItem = {
  key: string;
  label: string;
  detail: string;
  href: string;
  kind: "Đơn hàng" | "Hỗ trợ" | "Khách hàng tiềm năng";
  at: string;
};

const KIND_STYLE: Record<WorkItem["kind"], string> = {
  "Đơn hàng": "bg-orange-50 text-orange-700 border-orange-200",
  "Hỗ trợ": "bg-blue-50 text-blue-700 border-blue-200",
  "Khách hàng tiềm năng": "bg-purple-50 text-purple-700 border-purple-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * ADM-V2-01 — "Công việc" (Tổng quan). Gom TẤT CẢ việc cần Founder xử lý
 * từ 3 nguồn dữ liệu thật đã có (Vận hành: đơn hàng chờ xác nhận, ticket hỗ
 * trợ đang mở, khách hàng tiềm năng mới) về 1 danh sách duy nhất. CHỈ ĐỌC —
 * không có nút "đánh dấu đã xử lý" (hành động ghi thuộc đúng module Vận
 * hành sở hữu dữ liệu, ngoài phạm vi trang tổng hợp này).
 */
export default async function CongViecPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const [orders, tickets, leads] = supabase
    ? await Promise.all([
        supabase
          .from("orders")
          .select("id, customer_name, member_email, product_name, course_id, created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("support_tickets")
          .select("id, member_email, subject, created_at")
          .eq("status", "open")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("leads")
          .select("id, name, email, source, created_at")
          .eq("status", "new")
          .order("created_at", { ascending: false })
          .limit(100),
      ])
    : [{ data: null, error: null }, { data: null, error: null }, { data: null, error: null }];

  const items: WorkItem[] = [
    ...(orders.data ?? []).map((o) => ({
      key: `order-${o.id}`,
      label: o.customer_name ?? o.member_email,
      detail: `Đơn hàng chờ xác nhận — ${o.product_name ?? o.course_id ?? "—"}`,
      href: "/admin/van-hanh/don-hang",
      kind: "Đơn hàng" as const,
      at: o.created_at as string,
    })),
    ...(tickets.data ?? []).map((t) => ({
      key: `ticket-${t.id}`,
      label: t.member_email,
      detail: `Ticket đang mở — ${t.subject}`,
      href: "/admin/van-hanh/ho-tro-khach-hang",
      kind: "Hỗ trợ" as const,
      at: t.created_at as string,
    })),
    ...(leads.data ?? []).map((l) => ({
      key: `lead-${l.id}`,
      label: l.name ?? l.email,
      detail: `Khách hàng tiềm năng mới${l.source ? ` — nguồn: ${l.source}` : ""}`,
      href: "/admin/van-hanh/khach-hang-tiem-nang",
      kind: "Khách hàng tiềm năng" as const,
      at: l.created_at as string,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const anyError = orders.error || tickets.error || leads.error;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Tổng quan", href: "/admin/dashboard" }, { label: "Công việc" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Công việc</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách việc cần xử lý gom từ Vận hành (đơn hàng chờ xác nhận, ticket hỗ trợ đang mở, khách
          hàng tiềm năng mới). CHỈ ĐỌC — bấm vào từng việc để xử lý tại đúng module sở hữu dữ liệu.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          danh sách việc cần xử lý.
        </div>
      )}

      {supabase && anyError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Có lỗi khi đọc dữ liệu — danh sách bên dưới có thể chưa đầy đủ.
        </div>
      )}

      {supabase && items.length === 0 && !anyError && (
        <AdminEmptyState
          icon={ClipboardCheck}
          title="Không có việc nào cần xử lý"
          description="Hiện không có đơn hàng chờ xác nhận, ticket hỗ trợ đang mở, hay khách hàng tiềm năng mới nào."
        />
      )}

      {supabase && items.length > 0 && (
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-gray-50"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${KIND_STYLE[item.kind]}`}
                  >
                    {item.kind}
                  </span>
                  <span className="truncate text-sm font-semibold text-gray-900">{item.label}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">{item.detail}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-400">{formatDate(item.at)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
