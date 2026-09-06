"use client";

/* =============================================================================
 * Xem nội dung khoá học 2.0 — di chuyển đích "Tiếp tục học tập" (Trang chủ
 * 2.0) sang Portal 2.0 theo NGUYÊN TẮC BẤT BIẾN (đầu CLAUDE.md). Phát hiện
 * ở Giai đoạn 11 (audit toàn diện Portal 2.0), Đợt 1: `TrangChuClient.tsx`
 * (`onClick={() => router.push(\`/portal/premium/${course.id}/hoc\`)}`) trỏ
 * thẳng route học Portal 1.0 — vi phạm, vì `/v2/premium` chưa có route con
 * tương đương.
 *
 * Khung Portal (sidebar/topbar) — `PortalV2Shell`, cùng khuôn kỹ thuật
 * `checkout`/`tai-khoan` (chưa có mockup Claude Design riêng — không phải 1
 * trong 46 màn Bước F). `activeHtmlFile="Premium.html"` — trang này chỉ vào
 * được từ thẻ khoá học ở `/v2/trang-chu`/`/v2/premium`, đặt Premium active
 * hợp lý hơn để trống (đúng ngữ cảnh điều hướng, khác `checkout`/`tai-khoan`
 * không khớp mục nào).
 *
 * Nội dung ở giữa — dùng CHUNG `CourseLearnPageContent`/`CourseLearnClient`
 * (`src/app/portal/premium/[courseId]/hoc/*`) với `/portal/premium/[courseId]/hoc`
 * (1.0): Single Source of Truth, đã thêm `backHref`/`purchaseHref` (prop tuỳ
 * chọn mới, mặc định giữ `/portal/premium` cho 1.0) — 2.0 truyền
 * `backHref={null}` (đã có `PortalBackLink`-style riêng không cần, sidebar
 * đã đủ điều hướng) và `purchaseHref="/v2/premium"`.
 * ========================================================================== */

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { ReactNode } from "react";

import "../../../inter-gf.css";
import "./course-learn.css";

export function CourseLearnV2Client({ premium, children }: { premium: PremiumStatus; children: ReactNode }) {
  return (
    <div className="chl">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          useTopbarRightWrapper={false}
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Premium.html"
          showSearchBox={false}
        >
          <div className="content">{children}</div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
