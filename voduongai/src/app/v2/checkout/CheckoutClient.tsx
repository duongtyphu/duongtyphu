"use client";

/* =============================================================================
 * Thanh toán 2.0 — di chuyển trang thanh toán sang Portal 2.0 theo NGUYÊN TẮC
 * BẤT BIẾN (đầu CLAUDE.md): mọi thứ đang sửa ở `/v2/*` chỉ được có đích cuối
 * là `/v2/*`, không link ngược về `/portal/*`. Trước đây `PremiumClient.tsx`'s
 * `PlanPriceCard` build `checkoutHref = "/portal/checkout?..."` — vi phạm.
 *
 * Khung Portal (sidebar/topbar) — `PortalV2Shell`, cùng khuôn kỹ thuật
 * `su-menh-companion`/`tai-khoan` (chưa có mockup Claude Design riêng cho
 * trang này — không phải 1 trong 46 màn Bước F — nên KHÔNG có
 * `activeHtmlFile` khớp mục nào trong sidebar, đúng thực tế: trang này chỉ
 * vào được qua nút "Thanh toán ngay" ở `/v2/premium`, không phải 1 đích
 * điều hướng sidebar).
 *
 * Nội dung ở giữa — dùng CHUNG `CheckoutForm`/`actions.ts`
 * (`src/app/portal/checkout/*`) với `/portal/checkout` (1.0): Single Source
 * of Truth (Server Actions là logic nghiệp vụ thuần, đã xác nhận route-
 * agnostic từ trước — không cần sửa gì). `CheckoutForm` nhận
 * `orderReceivedBasePath="/v2/checkout/order-received"` (prop tuỳ chọn mới
 * thêm, mặc định giữ `/portal/checkout/order-received` cho 1.0).
 * ========================================================================== */

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import { CheckoutForm } from "@/app/portal/checkout/CheckoutForm";
import type { CheckoutItemType } from "@/app/portal/checkout/actions";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../inter-gf.css";
import "./checkout.css";

export function CheckoutClient({
  premium,
  email,
  target,
}: {
  premium: PremiumStatus;
  email: string;
  target: { itemType: CheckoutItemType; itemId: string | number; title: string; price: number };
}) {
  return (
    <div className="chk">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          useTopbarRightWrapper={false}
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Thanh toan.html"
          showSearchBox={false}
        >
          <div className="content">
            <h1 className="text-2xl font-bold text-gray-900">Hoàn tất đơn hàng</h1>
            <p className="mt-1 text-sm text-gray-500">Xác nhận thông tin và tiến hành thanh toán</p>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-violet">Sản phẩm</p>
              <h2 className="mt-1 text-lg font-bold text-gray-900">{target.title}</h2>
              <p className="mt-1 text-xl font-extrabold text-brand-orange">
                {target.price > 0 ? `${target.price.toLocaleString("vi-VN")}đ` : "Miễn phí"}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">Thông tin của bạn</h2>
              <CheckoutForm target={target} email={email} orderReceivedBasePath="/v2/checkout/order-received" />
            </div>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
