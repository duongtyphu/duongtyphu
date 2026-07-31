import QRCode from "qrcode";
import { siteConfig } from "@/lib/site";
import { getAffiliateOverview } from "@/lib/portal/live-affiliate";
import { CopyLinkButton } from "@/components/portal/CopyLinkButton";
import { RequestPayoutForm } from "./RequestPayoutForm";

export const metadata = { title: "Chương trình Affiliate" };

const REFERRAL_STATUS_LABEL: Record<string, string> = {
  pending: "Vừa đăng ký",
  confirmed: "Đã có đơn hàng — chờ thanh toán",
  paid: "Đã trả hoa hồng",
};

const REFERRAL_STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-green-50 text-green-700 border-green-200",
};

const PAYOUT_STATUS_LABEL: Record<string, string> = {
  pending: "Đang chờ xử lý",
  approved: "Đã duyệt",
  paid: "Đã thanh toán",
  rejected: "Đã từ chối",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Chương trình Affiliate chính thức VO DUONG AI — trang tổng quan Portal
 * (thay thế `/portal/referral` cũ, cùng dữ liệu `members.referral_code`/
 * `referrals`, mở rộng thêm QR/lượt truy cập/khách hàng/đơn hàng/doanh
 * thu/yêu cầu thanh toán theo đúng yêu cầu module đầy đủ). Xem
 * `src/lib/portal/live-affiliate.ts` cho toàn bộ logic đọc dữ liệu.
 */
export default async function AffiliatePage() {
  const overview = await getAffiliateOverview();

  if (!overview) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Chương trình Affiliate</h1>
          <p className="mt-2 text-gray-700">
            Giới thiệu người khác tham gia VO DUONG AI và nhận hoa hồng thật trên mỗi đơn hàng được xác nhận.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
          Đăng nhập để lấy link giới thiệu và xem hoa hồng của bạn.
        </div>
      </div>
    );
  }

  const { referralCode, referralLink, visits, signups, customers, ordersCount, revenue, commissionConfirmed, commissionPaid, commissionTotal, referrals, payoutRequests } = overview;

  const qrSvg = referralLink
    ? await QRCode.toString(referralLink, { type: "svg", margin: 1, width: 176, color: { dark: "#111827", light: "#ffffffff" } })
    : null;

  if (!referralCode || !referralLink) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Chương trình Affiliate</h1>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
          Tài khoản của bạn chưa được cấp mã giới thiệu. Liên hệ {siteConfig.contact.email} để được hỗ trợ.
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Lượt truy cập", value: visits === null ? "—" : visits.toLocaleString("vi-VN"), note: visits === null ? "Chưa bật theo dõi" : "lượt bấm link" },
    { label: "Lượt đăng ký", value: signups.toLocaleString("vi-VN"), note: "người đăng ký qua link" },
    { label: "Khách hàng", value: customers.toLocaleString("vi-VN"), note: "đã mua sản phẩm" },
    { label: "Đơn hàng", value: ordersCount.toLocaleString("vi-VN"), note: "đơn được ghi nhận" },
    { label: "Doanh thu", value: formatMoney(revenue), note: "tổng giá trị đơn hàng" },
    { label: "Hoa hồng", value: formatMoney(commissionTotal), note: `${formatMoney(commissionPaid)} đã trả` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Chương trình Affiliate</h1>
        <p className="mt-2 text-gray-700">
          Giới thiệu người khác tham gia VO DUONG AI và nhận hoa hồng thật trên mỗi đơn hàng được xác nhận thanh toán
          thành công.
        </p>
      </div>

      <div className="card-shine glow-blue grid gap-5 rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-5 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Link giới thiệu của bạn</p>
          <div className="mt-3 flex items-center gap-3">
            <input
              readOnly
              value={referralLink}
              className="w-full min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
            />
            <CopyLinkButton value={referralLink} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Mã giới thiệu của bạn: <span className="font-mono font-bold text-gray-900">{referralCode}</span>
          </p>
        </div>
        {qrSvg && (
          <div className="flex flex-col items-center gap-2 justify-self-center sm:justify-self-end">
            <div
              className="rounded-xl border border-gray-200 bg-white p-2"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="text-xs text-gray-500">Quét để chia sẻ</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s) => (
          <div key={s.label} className="card-shine rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{s.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="mt-1 text-xs text-gray-500">{s.note}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">Trạng thái thanh toán</h2>
        <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Hoa hồng đã xác nhận, chưa thanh toán:{" "}
                <span className="font-bold text-gray-900">{formatMoney(commissionConfirmed)}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Đã thanh toán: <span className="font-bold text-gray-900">{formatMoney(commissionPaid)}</span>
              </p>
            </div>
            {payoutRequests !== null ? (
              <RequestPayoutForm maxAmount={commissionConfirmed} />
            ) : (
              <p className="text-xs text-gray-400">Tính năng yêu cầu thanh toán chưa được kích hoạt.</p>
            )}
          </div>

          {payoutRequests !== null && payoutRequests.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              {payoutRequests.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{formatMoney(p.amountRequested)}</p>
                    <p className="text-xs text-gray-500">{formatDate(p.requestedAt)}</p>
                  </div>
                  <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600">
                    {PAYOUT_STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">Lịch sử giao dịch</h2>
        {referrals.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">Chưa có lượt giới thiệu nào — chia sẻ link ở trên để bắt đầu.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Người được giới thiệu</th>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Doanh thu</th>
                  <th className="px-4 py-3">Hoa hồng</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {referrals.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{r.referredEmail}</td>
                    <td className="px-4 py-3 text-gray-700">{r.orderProductName ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                      {r.orderAmount != null ? formatMoney(r.orderAmount) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900">{formatMoney(r.commissionAmount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${REFERRAL_STATUS_STYLE[r.status] ?? "border-gray-200 bg-gray-50 text-gray-600"}`}
                      >
                        {REFERRAL_STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
