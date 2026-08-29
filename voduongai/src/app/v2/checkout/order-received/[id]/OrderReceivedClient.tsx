"use client";

/* =============================================================================
 * Đơn hàng đã ghi nhận 2.0 — cùng khuôn kỹ thuật `CheckoutClient.tsx`
 * (`/v2/checkout`), tiền tố `.chk` dùng chung (cùng luồng thanh toán, không
 * tách CSS riêng). Nội dung dùng CHUNG `OrderReceipt` với 1.0
 * (`src/app/portal/checkout/order-received/[id]/OrderReceipt.tsx`),
 * `successHref="/v2/tai-khoan"` (đã hiển thị đúng "Sản phẩm đã mua" từ
 * `orders` thật qua `AccountContent`, đúng NGUYÊN TẮC BẤT BIẾN — không trỏ
 * `/portal/my-products`).
 * ========================================================================== */

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import { OrderReceipt } from "@/app/portal/checkout/order-received/[id]/OrderReceipt";
import type { OrderRecord } from "@/app/portal/checkout/actions";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../../../inter-gf.css";
import "../../checkout.css";

export function OrderReceivedClient({ premium, order }: { premium: PremiumStatus; order: OrderRecord }) {
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
            <h1 className="text-2xl font-bold text-gray-900">Cảm ơn bạn!</h1>
            <p className="mt-1 text-sm text-gray-500">Đơn hàng #{order.order_code ?? order.id} đã được ghi nhận.</p>
            <OrderReceipt order={order} successHref="/v2/tai-khoan" />
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
