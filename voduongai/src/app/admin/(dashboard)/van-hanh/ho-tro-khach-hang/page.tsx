import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Hỗ trợ khách hàng · Admin" };

type TicketRow = {
  id: number;
  member_email: string;
  subject: string;
  message: string;
  reply: string | null;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  open: "Đang mở",
  replied: "Đã trả lời",
  closed: "Đã đóng",
};

const STATUS_STYLE: Record<string, string> = {
  open: "bg-orange-50 text-orange-700 border-orange-200",
  replied: "bg-blue-50 text-blue-700 border-blue-200",
  closed: "bg-gray-50 text-gray-600 border-gray-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Vận hành — "Hỗ trợ khách hàng" (Admin v2.0). Bảng `support_tickets` đã
 * có dữ liệu thật (`/portal/support`, `submitSupportTicket`) nhưng trước
 * đây KHÔNG có trang Admin nào đọc. CHỈ ĐỌC — không có nút trả lời/đổi
 * trạng thái ở đây (đó là action ghi, ngoài phạm vi "chỉ đọc" của đợt
 * tái cấu trúc Admin v2.0 này; không đụng `src/app/portal/support/actions.ts`).
 */
export default async function HoTroKhachHangPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const { data, error } = supabase
    ? await supabase
        .from("support_tickets")
        .select("id, member_email, subject, message, reply, status, created_at")
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: null, error: null };

  const tickets = (data ?? []) as TicketRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Hỗ trợ khách hàng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Yêu cầu hỗ trợ thật gửi từ /portal/support. Trang này CHỈ ĐỌC — chưa có thao tác trả lời/đổi
          trạng thái ở đây.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          danh sách yêu cầu hỗ trợ.
        </div>
      )}

      {supabase && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Không đọc được bảng support_tickets: {error.message}
        </div>
      )}

      {supabase && !error && tickets.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Chưa có yêu cầu hỗ trợ nào.
        </div>
      )}

      {supabase && !error && tickets.length > 0 && (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{t.subject}</h3>
                  <p className="text-xs text-gray-500">
                    {t.member_email} · {formatDate(t.created_at)}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    STATUS_STYLE[t.status] ?? "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  {STATUS_LABEL[t.status] ?? t.status}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{t.message}</p>
              {t.reply && (
                <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-500">Đã trả lời: </span>
                  {t.reply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
