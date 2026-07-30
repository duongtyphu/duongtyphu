import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Users2 } from "lucide-react";

export const metadata = { title: "Tiếp thị liên kết · Admin" };

type ReferralRow = {
  id: number;
  referrer_id: string;
  referred_email: string;
  commission_amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Vừa đăng ký",
  confirmed: "Đã có đơn hàng",
  paid: "Đã trả hoa hồng",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-green-50 text-green-700 border-green-200",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * ADM-V2-03 — "Tiếp thị liên kết" (Vận hành). ĐÍNH CHÍNH so với ghi chú cũ
 * ("chỉ có nội dung tĩnh Portal + ecosystem_chrome.affiliateOffers, không
 * có hệ theo dõi thật"): audit lại phát hiện bảng `referrals` (referrer_id/
 * referred_email/referred_id/order_id/commission_rate/commission_amount/
 * status pending-confirmed-paid/paid_at) ĐÃ tồn tại và ĐÃ được đọc thật ở
 * `/portal/referral` ("Hoa hồng giới thiệu", dùng `members.referral_code`)
 * — đây LÀ hệ theo dõi mã giới thiệu/hoa hồng thật của VDAI, khác hẳn nội
 * dung affiliate của Dự án & Cơ hội (chương trình bên ngoài như Lazada/
 * Shopee). Chỉ CHƯA có Admin UI nào đọc bảng này — 0 dòng dữ liệu tại thời
 * điểm audit. CHỈ ĐỌC ở sprint này (cùng mức thận trọng với Đơn hàng/Hỗ trợ
 * khách hàng — không thêm hành động "đánh dấu đã trả hoa hồng" cho tới khi
 * có quyết định riêng, tránh đụng vào luồng thanh toán/hoa hồng thật ngoài
 * phạm vi đã duyệt).
 */
export default async function TiepThiLienKetPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const [referralsRes, membersRes] = supabase
    ? await Promise.all([
        supabase
          .from("referrals")
          .select("id, referrer_id, referred_email, commission_amount, status, created_at, paid_at")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase.from("members").select("id, email"),
      ])
    : [{ data: null, error: null }, { data: null }];

  const emailByMemberId = new Map((membersRes.data ?? []).map((m) => [m.id, m.email]));
  const referrals = (referralsRes.data ?? []) as ReferralRow[];
  const error = referralsRes.error;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Vận hành", href: "/admin/van-hanh/don-hang" }, { label: "Tiếp thị liên kết" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Tiếp thị liên kết</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hoa hồng giới thiệu thật (bảng <code className="text-gray-700">referrals</code>, đã đọc ở
          /portal/referral) — khác chương trình affiliate bên ngoài (Lazada/Shopee...) quản ở Workspace
          Học viện → Dự án & Cơ hội. CHỈ ĐỌC.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          dữ liệu hoa hồng giới thiệu.
        </div>
      )}

      {supabase && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-gray-700">
          Không đọc được bảng referrals: {error.message}
        </div>
      )}

      {supabase && !error && referrals.length === 0 && (
        <AdminEmptyState
          icon={Users2}
          title="Chưa có lượt giới thiệu nào"
          description="Bảng referrals đã sẵn sàng và đang được /portal/referral đọc thật — danh sách này sẽ tự hiện đúng ngay khi có thành viên giới thiệu người khác đăng ký/mua khoá học."
        />
      )}

      {supabase && !error && referrals.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Người giới thiệu</th>
                <th className="px-4 py-3">Người được giới thiệu</th>
                <th className="px-4 py-3">Hoa hồng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {referrals.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-gray-900">{emailByMemberId.get(r.referrer_id) ?? r.referrer_id}</td>
                  <td className="px-4 py-3 text-gray-700">{r.referred_email}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {formatMoney(r.commission_amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[r.status] ?? "border-gray-200 bg-gray-50 text-gray-600"}`}>
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
