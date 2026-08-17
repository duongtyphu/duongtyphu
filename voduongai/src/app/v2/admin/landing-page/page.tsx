import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { PageHead } from "@/components/v2/ui/PageHead";

export const metadata = { title: "Landing Page — Admin" };

/**
 * `/v2/admin/landing-page` — Landing Page KHÔNG có bản "2.0" riêng — chỉ
 * có đúng 1 trang chủ marketing công khai (`/`), dùng chung cho mọi
 * phiên bản Portal. Bản mock cũ ở đây là 1 form riêng biệt (Hero/hệ sinh
 * thái/chip câu hỏi) hoàn toàn KHÔNG ghi vào đâu — trong khi Admin 1.0 đã
 * có sẵn 1 trình soạn thảo THẬT, đầy đủ, đã verify hoạt động đúng:
 * `/admin/landing` (Live-edit Cách A, bảng `landing_chrome`, sửa xong
 * phản ánh ngay trên `/`). Xây trùng 1 form giả ở đây vừa lãng phí vừa
 * gây hiểu lầm "có 2 nơi sửa Landing Page" — trỏ thẳng sang bản thật.
 */
export default function AdminLandingPagePage() {
  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Landing Page"
        title="Landing Page"
        description="Landing Page (trang chủ marketing công khai, voduongai.com) dùng chung cho mọi phiên bản Portal — không có bản 2.0 riêng."
      />
      <Card padding="admin">
        <CardHead title="Chỉnh sửa nội dung" />
        <p className="mb-4 text-[13px] leading-relaxed text-[var(--v2-muted)]">
          Trình soạn thảo Live-edit thật (Hero, hệ sinh thái, showcase kỹ năng, công cụ, cộng đồng...) đã có
          sẵn ở Admin 1.0 — sửa xong phản ánh ngay trên trang live.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/landing"
            className="flex items-center gap-2 rounded-[10px] bg-[var(--v2-violet)] px-4 py-[11px] text-[13px] font-bold text-white"
          >
            Mở trình soạn thảo (Admin 1.0) →
          </Link>
          <a
            href="https://voduongai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[10px] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-4 py-[11px] text-[13px] font-bold text-[var(--v2-text)] hover:bg-[var(--v2-bg)]"
          >
            <ExternalLink className="h-[14px] w-[14px]" aria-hidden="true" />
            Xem trang live
          </a>
        </div>
      </Card>
    </div>
  );
}
